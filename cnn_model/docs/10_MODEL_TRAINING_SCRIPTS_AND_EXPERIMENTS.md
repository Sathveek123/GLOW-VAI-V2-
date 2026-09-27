# GlowVAI Model Training Scripts & Experiments

> **Document:** 10 · **Status:** ✅ Updated September 2026 (Phase 5 real training pipeline)

---

## 1. Phase 5 Primary Training Script — `scripts/train.py`

This is the **single canonical training script** for the GlowVAI skin model. It replaces the earlier task-specific scripts (`train_acne.py`, `train_skintone.py`, etc.) with a unified multi-task loop.

### Full Usage

```bash
python scripts/train.py \
    --train_csv  data/splits/train.csv \
    --val_csv    data/splits/val.csv \
    --image_root data/images \
    --epochs     25 \
    --batch_size 32 \
    --lr         1e-4 \
    --weight_decay 1e-2 \
    --checkpoint_dir checkpoints \
    --patience 5 \
    --num_workers 4
```

> [!NOTE]
> Use `--num_workers 0` on Windows if you get multiprocessing errors during DataLoader initialisation. This is a known PyTorch Windows limitation.

### What Happens During Training

```
[Training] Device: cuda
[Training] GPU: NVIDIA GeForce RTX 3060

[Training] Loading training dataset: data/splits/train.csv
[Dataset] Schema validation passed — 4823 rows
[Dataset] File validation passed — 4823 images confirmed on disk, 0 missing, 0 corrupt

[Training] Loading validation dataset: data/splits/val.csv
...

[Training] Train: 4823 samples | Val: 634 samples
[Training] Batch size: 32 | Train batches: 151 | Val batches: 20
[Training] Trainable parameters: 1,204,832

[Training] Starting training — 25 epochs, early stop patience=5

Epoch 01/25 | LR: 1.00e-04 | Train Loss: 1.4012  Acc: 34.20% | Val Loss: 1.3241  SkinType Acc: 38.40%
  Concern val accuracy: {'oiliness': 0.6821, ...}
  ✓ Best checkpoint saved (val_loss=1.3241)

Epoch 02/25 | LR: 1.00e-04 | Train Loss: 1.2109  Acc: 47.30% | ...
...
```

### Output Files

| File | Description |
|------|-------------|
| `checkpoints/skin_model_best.pth` | Best checkpoint (lowest val_loss) |
| `checkpoints/skin_model_last.pth` | Final epoch checkpoint |
| `checkpoints/training_run_report.json` | Full epoch history with UTC timestamp |

---

## 2. Training Run Report Format

```json
{
  "timestamp_utc": "2026-09-13T09:00:00.000000Z",
  "device": "cuda",
  "train_csv": "data/splits/train.csv",
  "val_csv": "data/splits/val.csv",
  "train_samples": 4823,
  "val_samples": 634,
  "model_architecture": "MobileNetV3-Large + SkinTypeHead + ConcernMultiLabelHead",
  "epochs_planned": 25,
  "epochs_run": 14,
  "batch_size": 32,
  "initial_lr": 0.0001,
  "best_val_loss": 0.7821,
  "history": [
    {
      "epoch": 1,
      "lr": 0.0001,
      "train_loss": 1.4012,
      "train_skin_type_acc": 0.342,
      "val_loss": 1.3241,
      "val_skin_type_acc": 0.384,
      "val_concern_acc": {
        "oiliness": 0.6821,
        "dryness": 0.7104,
        "redness": 0.7534,
        "uneven_tone": 0.6943,
        "visible_blemishes": 0.7821
      }
    }
  ]
}
```

**Verification rule:** Before citing any number from this report, confirm the `timestamp_utc` matches when you actually ran the training script.

---

## 3. Legacy Task-Specific Scripts (Pre-Phase-5)

These scripts train the earlier single-task models that existed before Phase 5. They still exist in `scripts/` for reference but are **not the active training pipeline**.

| Script | Task | Architecture | Status |
|--------|------|-------------|--------|
| `train_acne.py` | 4-class acne severity | ResNet-50 + ClassificationHead | Legacy |
| `train_skintone.py` | 6-class Fitzpatrick | ResNet-50 + ClassificationHead | Legacy |
| `train_portrait.py` | Continuous score regression | ResNet-50 + RegressionHead | Legacy |
| `train_facial_attributes.py` | Multi-label attributes | ResNet-50 + ClassificationHead | Legacy |
| `train_face_detection.py` | Face bounding box quality | ResNet-50 | Legacy |
| `train_gender.py` | Binary gender | ResNet-50 | Legacy |
| `train_age.py` | Age regression | ResNet-50 | Legacy |

> [!WARNING]
> These scripts use `ResNet-50`. Do not use them for new training runs — they produce models that are incompatible with the Phase 6 ONNX inference pipeline which expects MobileNetV3-Large outputs of shape `[B, 4]` (skin type) and `[B, 5]` (concerns).

---

## 4. Hyperparameter Tuning Notes

### Learning Rate
`1e-4` is appropriate for fine-tuning the last 2 unfrozen blocks of MobileNetV3-Large.
- Too high (`1e-3`): Overshoots — val_loss diverges in first few epochs
- Too low (`1e-5`): Convergence is too slow for 25 epochs; often doesn't reach its best performance

### Batch Size
- **32** (default): Good balance on most GPUs
- **16**: Use if getting CUDA OOM on 4GB VRAM
- **64**: Can help if training loss is noisy (more stable gradients)

### Unfreezing Blocks
Controlled in `backbone.py`:
```python
SkinEncoder(pretrained=True, unfreeze_last_n_blocks=2)  # default
```
- `0` blocks: Fully frozen — fast but no domain adaptation
- `2` blocks: ~1.2M trainable params — recommended
- `4` blocks: More adaptation, higher overfitting risk on small datasets

### Early Stopping
If `patience=5` triggers too early (model didn't converge), increase to 7–8.
If training runs the full 25 epochs with no improvement: inspect the loss curve — the model may be learning rate-starved.

---

## 5. Resuming from Checkpoint

The current `train.py` does not implement checkpoint resumption. To resume after an interruption:

1. Load the last checkpoint into model state
2. Manually set the starting epoch
3. Recreate the optimiser and scheduler

Future enhancement: add `--resume_from_checkpoint` argument to `train.py`.

---

## 6. GPU vs CPU Training

| Hardware | Expected Time (25 epochs, 5000 images) |
|----------|---------------------------------------|
| NVIDIA RTX 3060 (12GB) | ~35 minutes |
| NVIDIA RTX 4090 (24GB) | ~12 minutes |
| Apple M2 Pro (CPU) | ~90 minutes |
| Intel Core i7 (CPU) | ~4 hours |
| Google Colab (T4 GPU) | ~45 minutes |

For datasets under 10k images, even a mid-range consumer GPU completes in under an hour.
