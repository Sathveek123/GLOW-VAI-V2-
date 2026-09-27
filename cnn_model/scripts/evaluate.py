"""
GlowVAI Skin Analysis — Real Test Set Evaluation (Phase 5)
===========================================================
Evaluates the trained checkpoint on the HELD-OUT TEST SET —
the set that was NEVER seen during training or validation.

This script produces GENUINE confusion matrices and classification
reports. Whatever numbers it prints ARE the real numbers from running
the model against that test set. They are saved to a JSON report with
a timestamp so the result is reproducible and auditable.

Rules for honest evaluation
---------------------------
1. Only run this script ONCE against the test set per checkpoint.
   Running it multiple times to pick the best number is test set
   contamination — it defeats the purpose of a held-out test set.
2. The test_csv MUST be the same one created by create_splits.py —
   do NOT add or swap images after the split was created.
3. The numbers from this report are the ONLY numbers you may honestly
   cite as "test accuracy" in product copy or research claims.

Usage
-----
python scripts/evaluate.py \\
    --checkpoint checkpoints/skin_model_best.pth \\
    --test_csv   data/splits/test.csv \\
    --image_root data/images \\
    --output_report checkpoints/test_evaluation_report.json
"""

import torch
from torch.utils.data import DataLoader
from sklearn.metrics import confusion_matrix, classification_report
import argparse
import json
from datetime import datetime
from pathlib import Path
import sys
import numpy as np

_REPO_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(_REPO_ROOT))

from src.models.heads import SkinModel  # type: ignore
from src.data.dataset import SkinConcernDataset, CONCERN_LABELS, SKIN_TYPE_LABELS  # type: ignore


@torch.no_grad()
def evaluate_on_test_set(
    checkpoint_path: str,
    test_csv: str,
    image_root: str,
    batch_size: int = 32,
    num_workers: int = 4,
) -> dict:
    """
    Runs full evaluation on the test set using a saved checkpoint.

    Args:
        checkpoint_path : Path to .pth file saved by train.py
        test_csv        : Path to test split CSV (from create_splits.py)
        image_root      : Root directory for images
        batch_size      : Inference batch size (larger = faster, less memory-efficient)
        num_workers     : DataLoader workers

    Returns:
        dict with full evaluation results (also printed to stdout)
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Evaluate] Device: {device}")
    print(f"[Evaluate] Loading checkpoint: {checkpoint_path}")

    model = SkinModel(num_concerns=len(CONCERN_LABELS)).to(device)
    state_dict = torch.load(checkpoint_path, map_location=device)
    model.load_state_dict(state_dict)
    model.eval()
    print("[Evaluate] Checkpoint loaded successfully")

    print(f"\n[Evaluate] Loading test dataset: {test_csv}")
    test_ds = SkinConcernDataset(test_csv, image_root, is_train=False)
    test_loader = DataLoader(
        test_ds,
        batch_size=batch_size,
        shuffle=False,  # NEVER shuffle for evaluation — order must be deterministic
        num_workers=num_workers,
        pin_memory=(device.type == "cuda"),
    )
    print(f"[Evaluate] Test set: {len(test_ds)} samples, {len(test_loader)} batches\n")

    all_skin_type_preds = []
    all_skin_type_targets = []
    all_concern_preds = []
    all_concern_targets = []

    for batch in test_loader:
        images = batch["image"].to(device)
        skin_type_logits, concern_logits = model(images)

        # Skin type: argmax of logits
        skin_type_preds = skin_type_logits.argmax(dim=1).cpu().numpy()
        # Concern: sigmoid > 0.5 threshold
        concern_probs = torch.sigmoid(concern_logits).cpu().numpy()
        concern_binary = (concern_probs > 0.5).astype(int)

        all_skin_type_preds.extend(skin_type_preds.tolist())
        all_skin_type_targets.extend(batch["skin_type"].numpy().tolist())
        all_concern_preds.append(concern_binary)
        all_concern_targets.append(batch["concerns"].numpy())

    all_concern_preds = np.concatenate(all_concern_preds, axis=0)
    all_concern_targets = np.concatenate(all_concern_targets, axis=0)

    # ── Skin type: confusion matrix & classification report ──────────────────
    cm = confusion_matrix(all_skin_type_targets, all_skin_type_preds)
    skin_type_report = classification_report(
        all_skin_type_targets,
        all_skin_type_preds,
        target_names=SKIN_TYPE_LABELS,
        output_dict=True,
        zero_division=0,
    )
    skin_type_report_text = classification_report(
        all_skin_type_targets,
        all_skin_type_preds,
        target_names=SKIN_TYPE_LABELS,
        zero_division=0,
    )

    print("=" * 70)
    print("REAL Skin Type Confusion Matrix (Test Set)")
    print("=" * 70)
    print(f"Label order: {SKIN_TYPE_LABELS}")
    print(cm)
    print(f"\nClassification Report:")
    print(skin_type_report_text)
    print(f"Overall Accuracy: {skin_type_report['accuracy']*100:.2f}%")
    print(f"Macro F1-Score:   {skin_type_report['macro avg']['f1-score']*100:.2f}%")

    # ── Concerns: per-concern binary classification report ───────────────────
    print("\n" + "=" * 70)
    print("REAL Per-Concern Accuracy (Test Set)")
    print("=" * 70)

    concern_results = {}
    for i, label in enumerate(CONCERN_LABELS):
        concern_report = classification_report(
            all_concern_targets[:, i].astype(int),
            all_concern_preds[:, i],
            output_dict=True,
            zero_division=0,
        )
        accuracy = concern_report["accuracy"]
        # f1 for positive class (presence = 1)
        f1 = concern_report.get("1", {}).get("f1-score", 0.0)
        precision = concern_report.get("1", {}).get("precision", 0.0)
        recall = concern_report.get("1", {}).get("recall", 0.0)

        concern_results[label] = {
            "accuracy": round(accuracy, 4),
            "precision_present": round(precision, 4),
            "recall_present": round(recall, 4),
            "f1_present": round(f1, 4),
        }
        print(
            f"  {label:<22} "
            f"acc={accuracy*100:.1f}%  "
            f"F1={f1*100:.1f}%  "
            f"P={precision*100:.1f}%  "
            f"R={recall*100:.1f}%"
        )

    # ── Full result record ────────────────────────────────────────────────────
    result = {
        "timestamp_utc": datetime.utcnow().isoformat() + "Z",
        "checkpoint": checkpoint_path,
        "test_csv": test_csv,
        "image_root": image_root,
        "test_samples": len(test_ds),
        "device": str(device),
        "skin_type_labels": SKIN_TYPE_LABELS,
        "skin_type_confusion_matrix": cm.tolist(),
        "skin_type_accuracy": round(skin_type_report["accuracy"], 4),
        "skin_type_macro_f1": round(skin_type_report["macro avg"]["f1-score"], 4),
        "skin_type_per_class": {
            k: {
                "precision": round(v["precision"], 4),
                "recall": round(v["recall"], 4),
                "f1": round(v["f1-score"], 4),
                "support": int(v["support"]),
            }
            for k, v in skin_type_report.items()
            if k in SKIN_TYPE_LABELS
        },
        "concern_labels": CONCERN_LABELS,
        "concern_results": concern_results,
    }
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="GlowVAI SkinModel evaluation on held-out test set — Phase 5"
    )
    parser.add_argument("--checkpoint",     required=True,
                        help="Path to trained .pth checkpoint (from train.py)")
    parser.add_argument("--test_csv",       required=True,
                        help="Path to test split CSV (from create_splits.py)")
    parser.add_argument("--image_root",     required=True,
                        help="Root directory for images")
    parser.add_argument("--output_report",
                        default="checkpoints/test_evaluation_report.json",
                        help="Where to save the JSON evaluation report")
    parser.add_argument("--batch_size",     type=int, default=32)
    parser.add_argument("--num_workers",    type=int, default=4)
    args = parser.parse_args()

    result = evaluate_on_test_set(
        checkpoint_path=args.checkpoint,
        test_csv=args.test_csv,
        image_root=args.image_root,
        batch_size=args.batch_size,
        num_workers=args.num_workers,
    )

    output_path = Path(args.output_report)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(str(output_path), "w") as f:
        json.dump(result, f, indent=2)

    print(f"\n{'='*70}")
    print(f"✓ REAL evaluation report saved to {output_path}")
    print(f"  Timestamp:    {result['timestamp_utc']}")
    print(f"  Test samples: {result['test_samples']}")
    print(f"  Skin type accuracy: {result['skin_type_accuracy']*100:.2f}%")
    print(f"  Skin type macro F1: {result['skin_type_macro_f1']*100:.2f}%")
    print(f"\nThis result is REAL and reproducible:")
    print(f"  python scripts/evaluate.py --checkpoint {args.checkpoint} "
          f"--test_csv {args.test_csv} --image_root {args.image_root}")
    print(f"Identical numbers should appear on rerun (deterministic eval, no shuffle).")
