# GlowVAI Dataset Preparation Scripts — Deep Dive

> **Document:** 09 · **Status:** ✅ Updated September 2026

---

## 1. Overview

The `cnn_model/scripts/` directory contains 55+ automation scripts for dataset preparation, training, evaluation, and model management. This document covers the **dataset preparation scripts** specifically.

---

## 2. Phase 5 Primary Split Script — `create_splits.py`

> [!IMPORTANT]
> This is the **correct split script for Phase 5 training**. It uses person-level splitting via `GroupShuffleSplit`. Do not use the older `create_dataset_split.py` for the Phase 5 `SkinConcernDataset` — it does row-level splitting which will cause data leakage.

```bash
python scripts/create_splits.py \
    --input_csv  data/labels.csv \
    --output_dir data/splits \
    --train_ratio 0.8 \
    --val_ratio   0.1 \
    --seed 42
```

### What it does:
1. Reads `data/labels.csv` (must have `person_id` column)
2. Split 1: `GroupShuffleSplit(train_size=0.8, groups=person_id)` → train vs temp
3. Split 2: `GroupShuffleSplit(train_size=0.5, groups=person_id)` on temp → val vs test
4. Hard assertions: `assert not (train_people & val_people)` etc.
5. Writes `data/splits/train.csv`, `val.csv`, `test.csv`

### Why person-level matters:
Same person's face in both train AND test inflates accuracy by 15–30%. The model memorises face shape and unique pigmentation patterns rather than learning generalisable skin conditions. This is a silent bug — the model runs, produces high test accuracy, and only fails when presented with genuinely new users.

---

## 3. Legacy Dataset Scripts (Pre-Phase-5)

These scripts exist in `cnn_model/scripts/` for reference. They were used to build metadata CSVs for the earlier task-specific models (acne, skin tone, portrait quality). They are **not used by the Phase 5 SkinConcernDataset** which requires its own `person_id` + concern severity annotations.

| Script | Dataset | Output |
|--------|---------|--------|
| `generate_fitzpatrick_metadata.py` | Fitzpatrick17k | `skin_tone` CSV |
| `generate_acne_metadata.py` | DermNet Acne DB | `acne_severity` CSV |
| `generate_scut_metadata.py` | SCUT-FBP5500 | `portrait_score` CSV |
| `generate_utkface_metadata.py` | UTKFace | `age`, `gender` CSV |
| `generate_celeba_metadata.py` | CelebA | `facial_attributes` CSV |
| `generate_ffhq_metadata.py` | FFHQ | `face_quality` CSV |
| `generate_all_metadata.py` | All above | Unified master CSV |
| `merge_metadata.py` | All CSVs | Merged schema |
| `standardize_images.py` | Any images | RGB JPEG standardisation |
| `validate_master_metadata.py` | Master CSV | Schema validation |
| `validate_metadata.py` | Any CSV | Field checks |

---

## 4. Image Standardisation — `standardize_images.py`

Before training, all images should be standardised to consistent format:

```bash
python scripts/standardize_images.py \
    --input_dir  data/raw_images \
    --output_dir data/images \
    --size 256
```

**What it does:**
- Converts all images to RGB (handles RGBA, L, P modes)
- Re-encodes as JPEG with quality=95 (reduces corrupt header risk)
- Resizes if larger than `--size` on the short side (preserves aspect ratio)
- Skips already-standardised files

**Why do this before training:**
`SkinConcernDataset` pre-flight validation uses `img.verify()` which catches truncated JPEG headers. Running standardise first ensures these don't appear at dataset load time.

---

## 5. Dataset Validation Scripts

### `validate_datasets.py`
Runs a complete validation sweep:
- All images exist on disk
- No corrupt headers
- Label distribution (prevents extreme class imbalance)
- Person count per split

### `verify_dataset_split.py`
Post-split verification:
```bash
python scripts/verify_dataset_split.py \
    --train_csv data/splits/train.csv \
    --val_csv   data/splits/val.csv \
    --test_csv  data/splits/test.csv
```
Outputs a table showing person counts, image counts, and class distribution per split.

---

## 6. Metadata Cleaning Scripts

### `clean_master_metadata.py`
Removes rows where:
- `image_path` is empty or NaN
- `skin_type` is not in the valid set
- Any concern severity is outside 0–3

### `validate_master_metadata.py`
Reports:
- Total rows
- Unique persons
- Per-class image count
- Missing value counts per column

---

## 7. Recommended Dataset Preparation Order

```bash
# 1. Collect images into data/raw_images/
# 2. Create your labels.csv with person_id, skin_type, concern severities
# 3. Standardise images
python scripts/standardize_images.py --input_dir data/raw_images --output_dir data/images

# 4. Validate metadata
python scripts/validate_master_metadata.py --csv data/labels.csv

# 5. Create person-level splits
python scripts/create_splits.py --input_csv data/labels.csv --output_dir data/splits

# 6. Verify splits
python scripts/verify_dataset_split.py \
    --train_csv data/splits/train.csv \
    --val_csv   data/splits/val.csv \
    --test_csv  data/splits/test.csv

# 7. Validate dataset loads without errors
python src/data/dataset.py data/splits/train.csv data/images
```
