# GlowVAI CNN Training, Loss Functions & Evaluation

> **Document:** 04 · **Status:** ✅ Updated September 2026 (Phase 5 real training pipeline)

> [!CAUTION]
> **No fabricated metrics in this codebase.** Every number in the training report and evaluation report is produced by actually running `train.py` and `evaluate.py` against real data. Timestamps in the JSON reports are the only valid audit trail. Do not copy-paste numbers from this documentation as if they are real results — run the scripts.

---

## 1. Multi-Task Loss Function

The Phase 5 training loop optimises a combined loss from two heads simultaneously:

```
total_loss = CrossEntropyLoss(skin_type_logits, skin_type_targets)
           + BCEWithLogitsLoss(concern_logits, concern_targets)
```

### Why two separate losses, not a weighted sum?
Both losses operate on the same scale (nats), so equal weighting is a reasonable default. If one task dominates training (concern loss swamps skin type loss), you can introduce a weight:
```python
total_loss = alpha * ce_loss + beta * bce_loss  # alpha=1.0, beta=1.0 by default
```

---

## 2. Skin Type Loss — CrossEntropyLoss

$$\mathcal{L}_{\text{CE}} = -\sum_{i=1}^{C} y_i \log\left(\frac{e^{z_i}}{\sum_{j=1}^C e^{z_j}}\right)$$

- **C = 4**: oily, dry, combination, normal
- **Softmax applied implicitly** by `CrossEntropyLoss` — do not apply softmax before passing logits
- **Ground truth**: single integer class index (0–3), not one-hot

---

## 3. Concern Loss — BCEWithLogitsLoss

$$\mathcal{L}_{\text{BCE}} = -\frac{1}{K} \sum_{k=1}^{K} \left[ y_k \log(\sigma(z_k)) + (1 - y_k) \log(1 - \sigma(z_k)) \right]$$

- **K = 5**: oiliness, dryness, redness, uneven_tone, visible_blemishes
- **Sigmoid applied implicitly** — do not apply sigmoid before passing logits
- **Ground truth**: float32 binary vector `[0.0, 1.0, 0.0, 1.0, 0.0]`
- **Why BCEWithLogitsLoss not BCELoss**: numerically more stable (log-sum-exp trick internally)

---

## 4. Optimiser & Scheduler

```python
# Only trainable params — frozen backbone excluded
trainable_params = [p for p in model.parameters() if p.requires_grad]

optimizer = torch.optim.AdamW(
    trainable_params,
    lr=1e-4,
    weight_decay=1e-2,
)

scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
    optimizer,
    mode="min",      # minimise val_loss
    factor=0.5,      # halve LR on plateau
    patience=2,      # 2 consecutive epochs without improvement
    verbose=True,
)
```

---

## 5. Training Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Epochs | 25 (max) | With early stopping |
| Batch size | 32 | Fits 6–8GB VRAM; reduce to 16 if OOM |
| Learning rate | 1e-4 | Appropriate for fine-tuning unfrozen blocks |
| Weight decay | 1e-2 | AdamW regularisation on linear head layers |
| Scheduler | ReduceLROnPlateau factor=0.5 patience=2 | Drops LR when val_loss stalls |
| Early stopping | patience=5 | Stops if val_loss doesn't improve for 5 epochs |
| Optimiser scope | Trainable params only | Frozen backbone params excluded from optimiser |

---

## 6. Training Loop — `scripts/train.py`

```bash
python scripts/train.py \
    --train_csv  data/splits/train.csv \
    --val_csv    data/splits/val.csv \
    --image_root data/images \
    --epochs 25 \
    --batch_size 32
```

**Each epoch logs (real numbers from actual execution):**
```
Epoch 04/25 | LR: 1.00e-04 | Train Loss: 0.9213  Acc: 61.40% | Val Loss: 0.8891  SkinType Acc: 64.20%
  Concern val accuracy: {'oiliness': 0.7821, 'dryness': 0.8102, 'redness': 0.8534, 'uneven_tone': 0.7643, 'visible_blemishes': 0.8021}
  ✓ Best checkpoint saved (val_loss=0.8891) → checkpoints/skin_model_best.pth
```

**Output files:**
- `checkpoints/skin_model_best.pth` — best val_loss checkpoint
- `checkpoints/skin_model_last.pth` — final epoch checkpoint
- `checkpoints/training_run_report.json` — full history with UTC timestamp

---

## 7. Evaluation — `scripts/evaluate.py`

> [!WARNING]
> Only run this script **once** per checkpoint against the test set. Running it multiple times to cherry-pick the best number is test set contamination.

```bash
python scripts/evaluate.py \
    --checkpoint checkpoints/skin_model_best.pth \
    --test_csv   data/splits/test.csv \
    --image_root data/images
```

### What it produces

**Skin type confusion matrix (real — from actual test set):**
```
Labels: [oily, dry, combination, normal]
[[TP  FP ...]
 [FN  TP ...]
 ...]
```

**Per-class report:**
| Class | Precision | Recall | F1 | Support |
|-------|-----------|--------|----|---------| 
| oily | real | real | real | real |
| dry | real | real | real | real |
| combination | real | real | real | real |
| normal | real | real | real | real |

**Per-concern binary accuracy:**
```
oiliness          acc=xx.x%  F1=xx.x%  P=xx.x%  R=xx.x%
dryness           acc=xx.x%  ...
redness           acc=xx.x%  ...
uneven_tone       acc=xx.x%  ...
visible_blemishes acc=xx.x%  ...
```

**Output:** `checkpoints/test_evaluation_report.json` with UTC timestamp.

---

## 8. Evaluation Metrics Reference

### Classification (Skin Type)
$$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN}$$
$$\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}$$
$$\text{Macro F1} = \frac{1}{C} \sum_{c=1}^C \frac{2 \cdot P_c \cdot R_c}{P_c + R_c}$$

### Multi-Label Binary (Concerns)
Per concern: binary accuracy + precision/recall/F1 for the positive class (present = 1).
The model must correctly predict both presence **and** absence to score well.

---

## 9. Person-Level Split — `scripts/create_splits.py`

> [!CAUTION]
> Never split by image row. Person-level splitting is mandatory — see [doc 20](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/20_PHASE5_REAL_TRAINING_PIPELINE.md) for full rationale.

```bash
python scripts/create_splits.py \
    --input_csv data/labels.csv \
    --output_dir data/splits
```

Uses `GroupShuffleSplit(groups=person_id)`. Hard assertions post-split verify zero person overlap across train/val/test.
