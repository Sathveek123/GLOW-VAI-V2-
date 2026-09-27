"""
GlowVAI Skin Analysis — Dataset & DataLoader (Phase 5)
=======================================================
Reads a CSV of labelled face images and returns tensors suitable
for the multi-task SkinModel (skin type + multi-label concerns).

Expected CSV schema
-------------------
image_path        : str  — relative path from image_root
person_id         : str  — unique person identifier (CRITICAL for split integrity)
skin_type         : str  — one of: oily | dry | combination | normal
oiliness          : int  — severity 0-3 (0=None, 1=Mild, 2=Moderate, 3=Pronounced)
dryness           : int  — severity 0-3
redness           : int  — severity 0-3
uneven_tone       : int  — severity 0-3
visible_blemishes : int  — severity 0-3

Concern encoding
----------------
Concerns are binarised: severity >= 1 → present (1.0), else absent (0.0).
This makes the multi-label target a float32 vector of 0s and 1s that
BCEWithLogitsLoss can handle directly.

If you need severity regression (e.g., predicting a 0-3 score rather
than binary present/absent), replace the binarisation with:
    float(row[c]) / 3.0   # normalise to [0, 1]
and swap the loss to MSELoss or SmoothL1Loss.

person_id split integrity (CRITICAL)
-------------------------------------
person_id must be used for train/val/test splitting (see create_splits.py).
Never split by image_path row — the same person's face in both train and
test inflates accuracy by ~15-30% on face datasets and is a silent bug.
"""

import pandas as pd
from PIL import Image, UnidentifiedImageError
import torch
from torch.utils.data import Dataset
from torchvision import transforms
from pathlib import Path

# ── Label definitions ────────────────────────────────────────────────────────
# These two lists define the canonical label ordering across the whole pipeline.
# If you add a concern, add it HERE and nowhere else — all other files read
# from this module.

CONCERN_LABELS = [
    "oiliness",
    "dryness",
    "redness",
    "uneven_tone",
    "visible_blemishes",
]

SKIN_TYPE_LABELS = [
    "oily",
    "dry",
    "combination",
    "normal",
]

# ── Image transforms ─────────────────────────────────────────────────────────
# Training uses moderate augmentation appropriate for skin close-ups.
# Augmentation rationale per transform:
#   RandomHorizontalFlip  — faces are roughly horizontally symmetric
#   RandomRotation(10)    — captures natural head tilt variation
#   ColorJitter           — accounts for different lighting / cameras
#   NOTE: No aggressive geometric distortions (shear, perspective) —
#         they corrupt skin texture patterns that the model needs to learn

TRAIN_TRANSFORMS = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomCrop((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=10),
    transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.10),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

EVAL_TRANSFORMS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])


class SkinConcernDataset(Dataset):
    """
    PyTorch Dataset for GlowVAI skin concern multi-task training.

    Args:
        csv_path   : Path to the split CSV (train.csv / val.csv / test.csv)
        image_root : Root directory; image_path column is relative to this
        is_train   : If True, applies training augmentation; else eval transforms

    __getitem__ returns dict with keys:
        image      : Tensor [3, 224, 224] — normalised image
        skin_type  : Tensor scalar long   — class index 0-3
        concerns   : Tensor [5] float32   — binary concern presence 0.0 or 1.0
        person_id  : str                  — kept for debugging / audit
    """

    def __init__(self, csv_path: str, image_root: str, is_train: bool = True):
        self.df = pd.read_csv(csv_path)
        self.image_root = Path(image_root)
        self.transform = TRAIN_TRANSFORMS if is_train else EVAL_TRANSFORMS
        self.is_train = is_train
        self._validate_schema()
        self._validate_files()

    def _validate_schema(self):
        """Hard-check that the CSV has every required column."""
        required_columns = {"image_path", "person_id", "skin_type"} | set(CONCERN_LABELS)
        missing = required_columns - set(self.df.columns)
        if missing:
            raise ValueError(
                f"CSV is missing required columns: {missing}\n"
                f"Found columns: {list(self.df.columns)}"
            )
        invalid_skin_types = set(self.df["skin_type"].unique()) - set(SKIN_TYPE_LABELS)
        if invalid_skin_types:
            raise ValueError(
                f"Unknown skin_type values in CSV: {invalid_skin_types}\n"
                f"Valid values: {SKIN_TYPE_LABELS}"
            )
        print(f"[Dataset] Schema validation passed — {len(self.df)} rows")

    def _validate_files(self):
        """
        Pre-flight check: verify every image path exists and is readable
        BEFORE training starts. Fail loudly at load time, not silently
        mid-epoch when a bad path causes a cryptic tensor shape error.
        """
        missing = []
        corrupt = []
        for _, row in self.df.iterrows():
            full_path = self.image_root / row["image_path"]
            if not full_path.exists():
                missing.append(str(full_path))
                continue
            try:
                with Image.open(full_path) as img:
                    img.verify()
            except (UnidentifiedImageError, OSError):
                corrupt.append(str(full_path))

        if missing:
            raise FileNotFoundError(
                f"{len(missing)} image(s) referenced in CSV do not exist.\n"
                f"First 5: {missing[:5]}"
            )
        if corrupt:
            raise ValueError(
                f"{len(corrupt)} image(s) are corrupt or unreadable.\n"
                f"First 5: {corrupt[:5]}"
            )
        print(
            f"[Dataset] File validation passed — "
            f"{len(self.df)} images confirmed on disk, 0 missing, 0 corrupt"
        )

    def __len__(self) -> int:
        return len(self.df)

    def __getitem__(self, idx: int) -> dict:
        row = self.df.iloc[idx]
        image_path = self.image_root / row["image_path"]

        # Load and convert — always convert to RGB to handle greyscale / RGBA
        image = Image.open(image_path).convert("RGB")
        if self.transform:
            image = self.transform(image)

        skin_type_idx = SKIN_TYPE_LABELS.index(row["skin_type"])

        # Binarise: severity >= 1 → concern present
        concern_labels = torch.tensor(
            [float(row[c] >= 1) for c in CONCERN_LABELS],
            dtype=torch.float32,
        )

        return {
            "image": image,
            "skin_type": torch.tensor(skin_type_idx, dtype=torch.long),
            "concerns": concern_labels,
            "person_id": str(row["person_id"]),
        }


if __name__ == "__main__":
    # ── Sanity check ─────────────────────────────────────────────────────────
    # Run: python src/data/dataset.py <csv_path> <image_root>
    # Validates schema, checks all files, loads sample 0 — catches issues
    # before committing to a 25-epoch training run.
    import sys

    if len(sys.argv) < 3:
        print("Usage: python dataset.py <csv_path> <image_root>")
        print("Example: python src/data/dataset.py data/splits/train.csv data/images")
        sys.exit(1)

    csv_path = sys.argv[1]
    image_root = sys.argv[2]

    ds = SkinConcernDataset(csv_path, image_root, is_train=True)
    print(f"\nDataset size: {len(ds)} samples")

    sample = ds[0]
    print(f"Sample image shape:  {sample['image'].shape}")   # [3, 224, 224]
    print(f"Skin type label:     {sample['skin_type']} → {SKIN_TYPE_LABELS[sample['skin_type']]}")
    print(f"Concern labels:      {sample['concerns']}")
    print(f"Person ID:           {sample['person_id']}")
    print("✓ Dataset sanity check passed")
