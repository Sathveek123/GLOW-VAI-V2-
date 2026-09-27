# GlowVAI Model Evaluation & Confusion Matrices

> **Document:** 11 · **Status:** ✅ Updated September 2026 (Phase 5 real evaluation pipeline)

> [!CAUTION]
> **Only the numbers produced by running `evaluate.py` against the actual test set are valid.** Do not copy numbers from this document and present them as real model performance. This document explains the *format* and *interpretation* of evaluation results — not the results themselves.

---

## 1. Running Real Evaluation

```bash
python scripts/evaluate.py \
    --checkpoint checkpoints/skin_model_best.pth \
    --test_csv   data/splits/test.csv \
    --image_root data/images \
    --output_report checkpoints/test_evaluation_report.json
```

**One-time rule:** Run this against the held-out test set exactly once per checkpoint. Running repeatedly to find the best number defeats the purpose of a held-out set.

---

## 2. Skin Type Confusion Matrix

The script prints a real confusion matrix from `sklearn.metrics.confusion_matrix`:

```
====================================================================
REAL Skin Type Confusion Matrix (Test Set)
====================================================================
Label order: ['oily', 'dry', 'combination', 'normal']

[[TP_oily     FP_oily→dry  FP_oily→combo  FP_oily→norm]
 [FP_dry→oily  TP_dry       FP_dry→combo   FP_dry→norm]
 [...]
 [...]]
```

**Reading the matrix:**
- Row = true class, Column = predicted class
- Diagonal = correct predictions (TP per class)
- Off-diagonal = misclassifications

**Common misclassification patterns:**
- `combination` ↔ `oily`: Most frequent — the model may see T-zone oiliness as full-face oily
- `dry` ↔ `normal`: Mild dryness and normal skin look similar in photos
- `oily` → `combination`: Model is being conservative about full-face oiliness

---

## 3. Classification Report Format

```
              precision    recall  f1-score   support

        oily       0.72      0.68      0.70       142
         dry       0.69      0.74      0.71        98
 combination       0.61      0.65      0.63       213
      normal       0.78      0.75      0.76        81

    accuracy                           0.69       534
   macro avg       0.70      0.71      0.70       534
weighted avg       0.68      0.69      0.69       534
```

**Numbers above are illustrative format examples only — not real results.**

---

## 4. Per-Concern Binary Classification

For each concern, the evaluation computes binary classification metrics for the `present` class (1):

```
Concern               acc      F1      P       R
oiliness              82.1%   79.3%   81.0%   77.8%
dryness               85.4%   83.1%   85.2%   81.1%
redness               87.2%   84.6%   86.1%   83.2%
uneven_tone           80.3%   77.8%   79.4%   76.3%
visible_blemishes     83.7%   81.2%   82.8%   79.7%
```

**Format only — not real results.** Your actual numbers will differ based on your dataset.

### Interpreting concern metrics

**High accuracy + low F1 for positive class:**
This happens when the concern is rare in your test set. The model predicts `absent` most of the time and gets high accuracy from true negatives — but misses actual concern cases.

**Fix:** Check prevalence in your dataset. If a concern appears in < 10% of images, either:
1. Over-sample images with that concern, or
2. Use weighted BCE loss: `BCEWithLogitsLoss(pos_weight=torch.tensor([w]))`

---

## 5. Evaluation Report JSON

The script writes `checkpoints/test_evaluation_report.json`:

```json
{
  "timestamp_utc": "2026-09-13T10:00:00.000000Z",
  "checkpoint": "checkpoints/skin_model_best.pth",
  "test_csv": "data/splits/test.csv",
  "test_samples": 534,
  "device": "cuda",
  "skin_type_labels": ["oily", "dry", "combination", "normal"],
  "skin_type_accuracy": 0.69,
  "skin_type_macro_f1": 0.70,
  "skin_type_confusion_matrix": [[...], [...], [...], [...]],
  "skin_type_per_class": {
    "oily":        { "precision": 0.72, "recall": 0.68, "f1": 0.70, "support": 142 },
    "dry":         { "precision": 0.69, "recall": 0.74, "f1": 0.71, "support": 98 },
    "combination": { "precision": 0.61, "recall": 0.65, "f1": 0.63, "support": 213 },
    "normal":      { "precision": 0.78, "recall": 0.75, "f1": 0.76, "support": 81 }
  },
  "concern_labels": ["oiliness", "dryness", "redness", "uneven_tone", "visible_blemishes"],
  "concern_results": {
    "oiliness": { "accuracy": 0.821, "precision_present": 0.810, "recall_present": 0.778, "f1_present": 0.793 }
  }
}
```

**Numbers above are format examples only.**

---

## 6. Minimum Acceptable Metrics Before Production

| Metric | Minimum | Notes |
|--------|---------|-------|
| `skin_type_accuracy` | 0.60 | Below 60% is barely above random for 4 classes |
| `skin_type_macro_f1` | 0.55 | F1 is more robust than accuracy for imbalanced splits |
| Any concern `f1_present` | 0.50 | Below 50% means the model can't reliably detect that concern |

If these minimums aren't met:
1. Check label quality — is the `skin_type` annotation consistent across annotators?
2. Check dataset size — under 2,000 unique people is often insufficient
3. Consider unfreezing more backbone blocks (`unfreeze_last_n_blocks=4`)
4. Consider reducing learning rate to `5e-5`

---

## 7. Legacy Evaluation Scripts (Pre-Phase-5)

These scripts exist in `scripts/` and were used for task-specific model evaluation. They are **not compatible with the Phase 5 multi-task SkinModel**.

| Script | Legacy Purpose |
|--------|---------------|
| `evaluate_models.py` | Evaluated acne + skin tone models separately |
| `generate_confusion_matrix.py` | Standalone confusion matrix for single-task models |
| `save_model_metrics.py` | Saved per-task metrics to JSON |

For Phase 5 evaluation, use `scripts/evaluate.py` exclusively.
