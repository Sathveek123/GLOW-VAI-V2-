"""
GlowVAI Skin Analysis — Real Training Loop (Phase 5)
=====================================================
Runs a genuine training loop against real labelled data.

No fabricated metrics anywhere in this file.
Whatever loss/accuracy numbers print to stdout DURING a real run
ARE the actual numbers — good or bad. They are recorded with a
timestamp in checkpoints/training_run_report.json.

Before citing any number from a training run in product documentation
or copy:
  1. Confirm the run_record timestamp matches when you ran this script
  2. Confirm the train_csv and val_csv paths in the run record match
     the real data you labelled
  3. Confirm the checkpoint file timestamp post-dates the run

Architecture trained: SkinModel (MobileNetV3-Large shared encoder
  + SkinTypeHead (CE loss) + ConcernMultiLabelHead (BCE loss))

Loss function:
  total_loss = CrossEntropyLoss(skin_type_logits, skin_type_targets)
             + BCEWithLogitsLoss(concern_logits, concern_targets)

Optimiser:     AdamW (trainable params only), lr=1e-4, weight_decay=0.01
Scheduler:     ReduceLROnPlateau(mode=min, factor=0.5, patience=2)
Early stopping: patience=5 epochs without val_loss improvement

Usage
-----
python scripts/train.py \\
    --train_csv data/splits/train.csv \\
    --val_csv   data/splits/val.csv \\
    --image_root data/images \\
    --epochs 25 \\
    --batch_size 32
"""

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
import argparse
import json
from datetime import datetime
from pathlib import Path
import sys
import os

# ── Path resolution ──────────────────────────────────────────────────────────
# Allow running from repo root OR from scripts/ directory
_REPO_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(_REPO_ROOT))

from src.models.heads import SkinModel  # type: ignore
from src.data.dataset import SkinConcernDataset, CONCERN_LABELS, SKIN_TYPE_LABELS  # type: ignore


# ── Training epoch ───────────────────────────────────────────────────────────

def train_one_epoch(
    model: nn.Module,
    loader: DataLoader,
    skin_type_criterion: nn.Module,
    concern_criterion: nn.Module,
    optimizer: torch.optim.Optimizer,
    device: torch.device,
) -> tuple[float, float]:
    """
    Runs one full pass over the training set.

    Returns:
        (mean_loss_per_sample, skin_type_accuracy)
    """
    model.train()
    total_loss = 0.0
    correct_skin_type = 0
    total_samples = 0

    for batch in loader:
        images = batch["image"].to(device)
        skin_type_targets = batch["skin_type"].to(device)
        concern_targets = batch["concerns"].to(device)

        optimizer.zero_grad()
        skin_type_logits, concern_logits = model(images)

        loss_skin_type = skin_type_criterion(skin_type_logits, skin_type_targets)
        loss_concerns = concern_criterion(concern_logits, concern_targets)
        total_loss_batch = loss_skin_type + loss_concerns

        total_loss_batch.backward()
        optimizer.step()

        bs = images.size(0)
        total_loss += total_loss_batch.item() * bs
        preds = skin_type_logits.argmax(dim=1)
        correct_skin_type += (preds == skin_type_targets).sum().item()
        total_samples += bs

    return total_loss / total_samples, correct_skin_type / total_samples


# ── Validation epoch ─────────────────────────────────────────────────────────

@torch.no_grad()
def validate(
    model: nn.Module,
    loader: DataLoader,
    skin_type_criterion: nn.Module,
    concern_criterion: nn.Module,
    device: torch.device,
) -> tuple[float, float, dict]:
    """
    Evaluates model on validation set with no gradient computation.

    Returns:
        (mean_val_loss, skin_type_accuracy, per_concern_accuracy_dict)
    """
    model.eval()
    total_loss = 0.0
    correct_skin_type = 0
    total_samples = 0
    all_concern_preds = []
    all_concern_targets = []

    for batch in loader:
        images = batch["image"].to(device)
        skin_type_targets = batch["skin_type"].to(device)
        concern_targets = batch["concerns"].to(device)

        skin_type_logits, concern_logits = model(images)

        loss_skin_type = skin_type_criterion(skin_type_logits, skin_type_targets)
        loss_concerns = concern_criterion(concern_logits, concern_targets)
        loss = loss_skin_type + loss_concerns

        bs = images.size(0)
        total_loss += loss.item() * bs
        preds = skin_type_logits.argmax(dim=1)
        correct_skin_type += (preds == skin_type_targets).sum().item()
        total_samples += bs

        concern_probs = torch.sigmoid(concern_logits)
        all_concern_preds.append((concern_probs > 0.5).cpu())
        all_concern_targets.append(concern_targets.cpu())

    concern_pred_tensor = torch.cat(all_concern_preds, dim=0)
    concern_target_tensor = torch.cat(all_concern_targets, dim=0)

    # Per-concern binary accuracy (what fraction of samples correctly predicted
    # present/absent for each concern)
    per_concern_accuracy = {}
    for i, label in enumerate(CONCERN_LABELS):
        acc = (concern_pred_tensor[:, i] == concern_target_tensor[:, i]).float().mean().item()
        per_concern_accuracy[label] = round(acc, 4)

    return (
        total_loss / total_samples,
        correct_skin_type / total_samples,
        per_concern_accuracy,
    )


# ── Main training driver ─────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="GlowVAI SkinModel training — Phase 5"
    )
    parser.add_argument("--train_csv",      required=True, help="Path to train split CSV")
    parser.add_argument("--val_csv",        required=True, help="Path to val split CSV")
    parser.add_argument("--image_root",     required=True, help="Root directory for images")
    parser.add_argument("--epochs",         type=int,   default=25)
    parser.add_argument("--batch_size",     type=int,   default=32)
    parser.add_argument("--lr",             type=float, default=1e-4)
    parser.add_argument("--weight_decay",   type=float, default=1e-2)
    parser.add_argument("--checkpoint_dir", default="checkpoints",
                        help="Directory for saved checkpoints and run report")
    parser.add_argument("--patience",       type=int,   default=5,
                        help="Early stopping patience (epochs without val_loss improvement)")
    parser.add_argument("--num_workers",    type=int,   default=4,
                        help="DataLoader worker processes (0 for Windows debugging)")
    args = parser.parse_args()

    # ── Device ───────────────────────────────────────────────────────────────
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"[Training] Device: {device}")
    if device.type == "cuda":
        print(f"[Training] GPU: {torch.cuda.get_device_name(0)}")
    else:
        print("[Training] WARNING: Training on CPU — this will be slow for large datasets.")
        print("[Training] Use a CUDA GPU or Google Colab for real training runs.")

    Path(args.checkpoint_dir).mkdir(parents=True, exist_ok=True)

    # ── Datasets & loaders ───────────────────────────────────────────────────
    print(f"\n[Training] Loading training dataset: {args.train_csv}")
    train_ds = SkinConcernDataset(args.train_csv, args.image_root, is_train=True)

    print(f"\n[Training] Loading validation dataset: {args.val_csv}")
    val_ds = SkinConcernDataset(args.val_csv, args.image_root, is_train=False)

    train_loader = DataLoader(
        train_ds,
        batch_size=args.batch_size,
        shuffle=True,
        num_workers=args.num_workers,
        pin_memory=(device.type == "cuda"),
    )
    val_loader = DataLoader(
        val_ds,
        batch_size=args.batch_size,
        shuffle=False,
        num_workers=args.num_workers,
        pin_memory=(device.type == "cuda"),
    )

    print(f"\n[Training] Train: {len(train_ds)} samples | Val: {len(val_ds)} samples")
    print(f"[Training] Batch size: {args.batch_size} | "
          f"Train batches: {len(train_loader)} | Val batches: {len(val_loader)}")

    # ── Model ────────────────────────────────────────────────────────────────
    model = SkinModel(num_concerns=len(CONCERN_LABELS)).to(device)

    # ── Losses ───────────────────────────────────────────────────────────────
    skin_type_criterion = nn.CrossEntropyLoss()
    concern_criterion = nn.BCEWithLogitsLoss()

    # ── Optimiser (trainable params only — frozen backbone excluded) ─────────
    trainable_params = [p for p in model.parameters() if p.requires_grad]
    n_trainable = sum(p.numel() for p in trainable_params)
    print(f"\n[Training] Trainable parameters: {n_trainable:,}")

    optimizer = torch.optim.AdamW(
        trainable_params, lr=args.lr, weight_decay=args.weight_decay
    )
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, mode="min", factor=0.5, patience=2, verbose=True
    )

    # ── Training loop ────────────────────────────────────────────────────────
    best_val_loss = float("inf")
    epochs_without_improvement = 0
    history = []

    print(f"\n[Training] Starting training — {args.epochs} epochs, "
          f"early stop patience={args.patience}\n")
    print("-" * 80)

    for epoch in range(args.epochs):
        train_loss, train_acc = train_one_epoch(
            model, train_loader, skin_type_criterion, concern_criterion, optimizer, device
        )
        val_loss, val_acc, per_concern_acc = validate(
            model, val_loader, skin_type_criterion, concern_criterion, device
        )
        scheduler.step(val_loss)
        current_lr = optimizer.param_groups[0]["lr"]

        print(
            f"Epoch {epoch+1:02d}/{args.epochs} | "
            f"LR: {current_lr:.2e} | "
            f"Train Loss: {train_loss:.4f}  Acc: {train_acc*100:.2f}% | "
            f"Val Loss: {val_loss:.4f}  SkinType Acc: {val_acc*100:.2f}%"
        )
        print(f"  Concern val accuracy: {per_concern_acc}")

        epoch_record = {
            "epoch": epoch + 1,
            "lr": current_lr,
            "train_loss": round(train_loss, 6),
            "train_skin_type_acc": round(train_acc, 6),
            "val_loss": round(val_loss, 6),
            "val_skin_type_acc": round(val_acc, 6),
            "val_concern_acc": per_concern_acc,
        }
        history.append(epoch_record)

        # ── Checkpoint on improvement ─────────────────────────────────────
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            epochs_without_improvement = 0
            checkpoint_path = Path(args.checkpoint_dir) / "skin_model_best.pth"
            torch.save(model.state_dict(), str(checkpoint_path))
            print(f"  ✓ Best checkpoint saved (val_loss={val_loss:.4f}) → {checkpoint_path}")
        else:
            epochs_without_improvement += 1
            print(
                f"  No improvement ({epochs_without_improvement}/{args.patience} "
                f"patience epochs used)"
            )
            if epochs_without_improvement >= args.patience:
                print(
                    f"\n[Training] Early stopping triggered after {epoch+1} epochs "
                    f"— no val_loss improvement for {args.patience} consecutive epochs."
                )
                break

    # ── Save last checkpoint regardless ─────────────────────────────────────
    last_ckpt = Path(args.checkpoint_dir) / "skin_model_last.pth"
    torch.save(model.state_dict(), str(last_ckpt))

    # ── Real training run record ─────────────────────────────────────────────
    # This JSON is the audit trail for this specific training run.
    # It records what data was used, when it ran, how many epochs completed,
    # and the exact loss/accuracy history — real numbers, not invented ones.
    run_record = {
        "timestamp_utc": datetime.utcnow().isoformat() + "Z",
        "device": str(device),
        "train_csv": args.train_csv,
        "val_csv": args.val_csv,
        "image_root": args.image_root,
        "train_samples": len(train_ds),
        "val_samples": len(val_ds),
        "model_architecture": "MobileNetV3-Large + SkinTypeHead + ConcernMultiLabelHead",
        "epochs_planned": args.epochs,
        "epochs_run": len(history),
        "batch_size": args.batch_size,
        "initial_lr": args.lr,
        "weight_decay": args.weight_decay,
        "patience": args.patience,
        "best_val_loss": round(best_val_loss, 6),
        "concern_labels": CONCERN_LABELS,
        "skin_type_labels": SKIN_TYPE_LABELS,
        "history": history,
    }

    report_path = Path(args.checkpoint_dir) / "training_run_report.json"
    with open(str(report_path), "w") as f:
        json.dump(run_record, f, indent=2)

    print(f"\n{'='*80}")
    print(f"[Training] COMPLETE — {len(history)} epochs run")
    print(f"[Training] Best val loss: {best_val_loss:.4f}")
    print(f"[Training] Best checkpoint:  {Path(args.checkpoint_dir) / 'skin_model_best.pth'}")
    print(f"[Training] Last checkpoint:  {last_ckpt}")
    print(f"[Training] Run record:       {report_path}")
    print(f"\nIMPORTANT: The numbers in this report are REAL results from THIS run.")
    print(f"Verify timestamp {run_record['timestamp_utc']} before citing any metric.")


if __name__ == "__main__":
    main()
