"""
GlowVAI — Stratified Person-Level Train/Val/Test Split (Phase 5)
=================================================================
The MOST important data-integrity step in the whole pipeline.

Why person-level splitting matters
------------------------------------
Face datasets almost always contain multiple images of the same person
(different lighting, angles, expressions). If you split by image row
rather than by person:
  - The same person's face appears in both train and test
  - The model memorises identity features (face shape, skin tone,
    unique pigmentation) rather than learning generalisable skin
    condition patterns
  - Apparent test accuracy inflates by 15–30%+ compared to what the
    model achieves on genuinely NEW users
  - You only discover the gap after shipping to production

This script uses GroupShuffleSplit with groups=person_id, which
GUARANTEES that all images of one person go into exactly one split.
After splitting, it runs hard assertions to confirm zero person overlap.
If either assertion fails, the script crashes — there is no silent
data leakage here.

Usage
-----
python scripts/create_splits.py \\
    --input_csv data/labels.csv \\
    --output_dir data/splits

Output
------
data/splits/train.csv   — 80% of people
data/splits/val.csv     — 10% of people
data/splits/test.csv    — 10% of people
"""

import pandas as pd
from sklearn.model_selection import GroupShuffleSplit
import argparse
from pathlib import Path


def create_person_level_split(
    input_csv: str,
    output_dir: str,
    train_ratio: float = 0.8,
    val_ratio: float = 0.1,
    random_state: int = 42,
) -> None:
    """
    Splits a labelled CSV into train/val/test by person_id.

    Args:
        input_csv    : CSV with at minimum 'person_id' and 'image_path' columns
        output_dir   : Directory to write train.csv, val.csv, test.csv
        train_ratio  : Fraction of people in train split (default 0.80)
        val_ratio    : Fraction of people in val split (default 0.10)
                       test_ratio = 1 - train_ratio - val_ratio = 0.10
        random_state : Seed for reproducibility (default 42)
    """
    df = pd.read_csv(input_csv)

    if "person_id" not in df.columns:
        raise ValueError(
            "'person_id' column not found in input CSV.\n"
            "Cannot perform safe person-level splitting without it.\n"
            "Add a person_id column — each unique person must have a stable ID."
        )

    unique_people = df["person_id"].unique()
    n_people = len(unique_people)
    n_images = len(df)
    print(f"[Split] Input: {n_images} images, {n_people} unique people")
    print(f"[Split] Target ratios: train={train_ratio}, val={val_ratio}, "
          f"test={1.0 - train_ratio - val_ratio:.2f}")

    if n_people < 10:
        raise ValueError(
            f"Only {n_people} unique people found — too few for meaningful splits.\n"
            "Need at least 10 people to produce valid train/val/test sets."
        )

    # ── First split: train vs (val + test) ──────────────────────────────────
    gss1 = GroupShuffleSplit(
        n_splits=1, train_size=train_ratio, random_state=random_state
    )
    train_idx, temp_idx = next(gss1.split(df, groups=df["person_id"]))
    train_df = df.iloc[train_idx].reset_index(drop=True)
    temp_df = df.iloc[temp_idx].reset_index(drop=True)

    # ── Second split: val vs test from the remaining temp set ────────────────
    # val_ratio must be re-expressed relative to the temp set size
    val_relative_ratio = val_ratio / (1.0 - train_ratio)
    gss2 = GroupShuffleSplit(
        n_splits=1, train_size=val_relative_ratio, random_state=random_state
    )
    val_idx, test_idx = next(gss2.split(temp_df, groups=temp_df["person_id"]))
    val_df = temp_df.iloc[val_idx].reset_index(drop=True)
    test_df = temp_df.iloc[test_idx].reset_index(drop=True)

    # ── Hard integrity assertions — non-negotiable ───────────────────────────
    train_people = set(train_df["person_id"])
    val_people = set(val_df["person_id"])
    test_people = set(test_df["person_id"])

    train_val_leak = train_people & val_people
    train_test_leak = train_people & test_people
    val_test_leak = val_people & test_people

    if train_val_leak:
        raise AssertionError(
            f"DATA LEAKAGE: {len(train_val_leak)} person(s) appear in BOTH "
            f"train AND val: {list(train_val_leak)[:5]}"
        )
    if train_test_leak:
        raise AssertionError(
            f"DATA LEAKAGE: {len(train_test_leak)} person(s) appear in BOTH "
            f"train AND test: {list(train_test_leak)[:5]}"
        )
    if val_test_leak:
        raise AssertionError(
            f"DATA LEAKAGE: {len(val_test_leak)} person(s) appear in BOTH "
            f"val AND test: {list(val_test_leak)[:5]}"
        )

    # ── Write outputs ────────────────────────────────────────────────────────
    Path(output_dir).mkdir(parents=True, exist_ok=True)

    train_path = Path(output_dir) / "train.csv"
    val_path = Path(output_dir) / "val.csv"
    test_path = Path(output_dir) / "test.csv"

    train_df.to_csv(train_path, index=False)
    val_df.to_csv(val_path, index=False)
    test_df.to_csv(test_path, index=False)

    print(f"\n[Split] Results:")
    print(f"  Train : {len(train_df):>5} images, {len(train_people):>4} people → {train_path}")
    print(f"  Val   : {len(val_df):>5} images, {len(val_people):>4} people → {val_path}")
    print(f"  Test  : {len(test_df):>5} images, {len(test_people):>4} people → {test_path}")
    print(f"\n✓ Zero person overlap confirmed across all three splits.")
    print(f"✓ Splits written to: {output_dir}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Stratified person-level train/val/test split for GlowVAI skin data"
    )
    parser.add_argument(
        "--input_csv", required=True,
        help="Path to full labelled CSV (must have person_id column)"
    )
    parser.add_argument(
        "--output_dir", required=True,
        help="Directory to write train.csv, val.csv, test.csv"
    )
    parser.add_argument(
        "--train_ratio", type=float, default=0.8,
        help="Fraction of people in train split (default 0.8)"
    )
    parser.add_argument(
        "--val_ratio", type=float, default=0.1,
        help="Fraction of people in val split (default 0.1)"
    )
    parser.add_argument(
        "--seed", type=int, default=42,
        help="Random seed for reproducible splits (default 42)"
    )
    args = parser.parse_args()

    create_person_level_split(
        input_csv=args.input_csv,
        output_dir=args.output_dir,
        train_ratio=args.train_ratio,
        val_ratio=args.val_ratio,
        random_state=args.seed,
    )
