# GlowVAI CNN Dataset Pipeline & Transforms

> **Document:** 03 · **Status:** ✅ Updated September 2026 (Phase 5 implementation)

---

## 1. Phase 5 Dataset — `SkinConcernDataset`

Defined in [`cnn_model/src/data/dataset.py`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/src/data/dataset.py).

This is the **primary training dataset class** for the GlowVAI skin model. It supersedes earlier task-specific dataset classes (SkinDataset for acne, UTKFace loaders, etc.) with a unified schema that covers all Phase 5 targets.

---

## 2. Required CSV Schema

```csv
image_path,person_id,skin_type,oiliness,dryness,redness,uneven_tone,visible_blemishes
images/p001_shot1.jpg,P001,combination,2,1,0,1,0
images/p001_shot2.jpg,P001,combination,2,0,0,1,1
images/p002_shot1.jpg,P002,oily,3,0,1,2,1
```

| Column | Type | Values | Notes |
|--------|------|--------|-------|
| `image_path` | str | Relative to `image_root` | `.jpg` or `.png` |
| `person_id` | str | Unique per person | **Critical** — used for split integrity |
| `skin_type` | str | `oily\|dry\|combination\|normal` | Maps to index 0–3 |
| `oiliness` | int | 0–3 | 0=None, 1=Mild, 2=Moderate, 3=Pronounced |
| `dryness` | int | 0–3 | Same severity scale |
| `redness` | int | 0–3 | Same severity scale |
| `uneven_tone` | int | 0–3 | Same severity scale |
| `visible_blemishes` | int | 0–3 | Same severity scale |

### Concern Binarisation
Severity integers are binarised at load time:
```
severity >= 1  →  present  (1.0)
severity == 0  →  absent   (0.0)
```
This produces a `float32` vector for `BCEWithLogitsLoss`.

---

## 3. Pre-flight Validation

`SkinConcernDataset.__init__()` runs two hard checks before any training starts:

### Schema Validation
- Confirms every required column is present
- Confirms all `skin_type` values are in `['oily', 'dry', 'combination', 'normal']`
- Raises `ValueError` immediately — no silent failures

### File Validation
```python
for _, row in df.iterrows():
    full_path = image_root / row["image_path"]
    if not full_path.exists():
        missing.append(full_path)
    else:
        with Image.open(full_path) as img:
            img.verify()   # catches corrupt headers
```
Raises `FileNotFoundError` or `ValueError` before the first training epoch.
**Rationale:** A missing file discovered mid-epoch produces a cryptic tensor shape error that's hard to debug. Fail loudly at load time.

---

## 4. Data Transforms

### Training Transforms (with augmentation)
```python
TRAIN_TRANSFORMS = transforms.Compose([
    transforms.Resize((256, 256)),
    transforms.RandomCrop((224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.RandomRotation(degrees=10),
    transforms.ColorJitter(brightness=0.15, contrast=0.15, saturation=0.10),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
```

### Evaluation Transforms (deterministic)
```python
EVAL_TRANSFORMS = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])
```

### Augmentation Design Rationale

| Transform | Rationale |
|-----------|-----------|
| `RandomHorizontalFlip` | Faces are roughly symmetric |
| `RandomRotation(10°)` | Natural head tilt variation |
| `ColorJitter` | Camera-to-camera color balance variation |
| NO geometric distortion | Shear/perspective corrupts skin texture patterns the model needs to learn |
| NO `RandomErasing` | Would zero out potentially the most diagnostically significant skin regions |

---

## 5. `__getitem__` Output Contract

```python
{
    "image":      Tensor [3, 224, 224],   # ImageNet-normalised RGB
    "skin_type":  Tensor scalar long,     # 0–3 class index
    "concerns":   Tensor [5] float32,     # binary 0.0 or 1.0 per concern
    "person_id":  str,                    # kept for debug/audit
}
```

---

## 6. Supporting Datasets (Historical — Pre-Phase-5)

The `cnn_model/scripts/` directory contains metadata generators for public datasets used in earlier model iterations. These remain for reference but are **not used by the Phase 5 SkinConcernDataset**:

| Dataset | Task | Script |
|---------|------|--------|
| Fitzpatrick17k | 6-class skin phototype | `generate_fitzpatrick_metadata.py` |
| DermNet / Acne DB | Acne severity | `generate_acne_metadata.py` |
| SCUT-FBP5500 | Portrait quality score | `generate_scut_metadata.py` |
| UTKFace | Age / gender | `generate_utkface_metadata.py` |
| CelebA | Facial attribute labels | `generate_celeba_metadata.py` |
| FFHQ | High-quality face reference | `generate_ffhq_metadata.py` |

For Phase 5 training, you need a labelled CSV with `person_id` + skin type + concern severity annotations for your own collected images, or a remapped version of the above.

---

## 7. DataLoader Configuration

```python
train_loader = DataLoader(
    train_ds,
    batch_size=32,
    shuffle=True,
    num_workers=4,         # 0 on Windows if getting multiprocessing errors
    pin_memory=True,       # only with CUDA device
)
val_loader = DataLoader(
    val_ds,
    batch_size=32,
    shuffle=False,         # NEVER shuffle eval — deterministic output required
    num_workers=4,
    pin_memory=True,
)
```

---

## 8. Sanity Check

```bash
python cnn_model/src/data/dataset.py data/splits/train.csv data/images
```

Validates schema, checks all files, loads sample 0, and prints:
```
[Dataset] Schema validation passed — 4823 rows
[Dataset] File validation passed — 4823 images confirmed, 0 missing, 0 corrupt
Dataset size: 4823 samples
Sample image shape:  torch.Size([3, 224, 224])
Skin type label:     2 → combination
Concern labels:      tensor([1., 0., 0., 1., 0.])
✓ Dataset sanity check passed
```
