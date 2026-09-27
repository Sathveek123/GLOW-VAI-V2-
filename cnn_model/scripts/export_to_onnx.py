"""
GlowVAI Skin Analysis — ONNX Export for Mobile Deployment (Phase 5)
====================================================================
Exports the trained PyTorch checkpoint to ONNX format for React Native
ONNX Runtime Mobile deployment (Phase 6).

CRITICAL: Only run this AFTER evaluate.py confirms the checkpoint
achieves acceptable accuracy on the held-out test set.

Exporting an untrained or poorly-trained checkpoint produces a valid
ONNX file that runs without errors but gives meaningless predictions.
That failure is silent — the mobile app will run, accept real user
photos, and return garbage skin type labels with full confidence.

Pre-export checklist
---------------------
1. Run evaluate.py against the checkpoint first
2. Confirm the test evaluation report shows acceptable metrics
3. Verify the report timestamp post-dates the training run
4. THEN export this checkpoint to ONNX

Post-export verification
-------------------------
After exporting, run a sanity inference against the ONNX file using
a REAL test image (not a random noise tensor) before bundling into
the mobile app. The ONNX Runtime output must match the PyTorch output
for the same input (numerical tolerance < 1e-5 per logit).

ONNX spec
---------
Input:   input_image  [1, 3, 224, 224]  float32  (ImageNet-normalised)
Output:  skin_type_logits  [1, 4]        float32  (apply argmax at inference)
         concern_logits    [1, 5]        float32  (apply sigmoid > 0.5)

Dynamic axes: batch_size is dynamic (supports batch inference at any size)
Opset:  13 (compatible with ONNX Runtime 1.14+ and React Native ONNX Runtime)

Usage
-----
python scripts/export_to_onnx.py \\
    --checkpoint checkpoints/skin_model_best.pth \\
    --output     checkpoints/skin_model.onnx
"""

import torch
import argparse
from pathlib import Path
import sys
import json

_REPO_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(_REPO_ROOT))

from src.models.heads import SkinModel  # type: ignore
from src.data.dataset import CONCERN_LABELS  # type: ignore


def export_model(
    checkpoint_path: str,
    output_path: str,
    opset_version: int = 13,
    verify_consistency: bool = True,
) -> None:
    """
    Loads a trained checkpoint and exports it to ONNX.

    Args:
        checkpoint_path  : Path to .pth saved by train.py
        output_path      : Destination for .onnx file
        opset_version    : ONNX opset (13 = ONNX Runtime 1.14+)
        verify_consistency: If True, runs a PyTorch forward pass and
                           checks that ONNX Runtime output matches within
                           numerical tolerance. Requires onnxruntime installed.
    """
    print(f"[Export] Loading model from: {checkpoint_path}")

    model = SkinModel(num_concerns=len(CONCERN_LABELS))
    state_dict = torch.load(checkpoint_path, map_location="cpu")
    model.load_state_dict(state_dict)
    model.eval()
    print("[Export] Checkpoint loaded. Model is in eval mode.")

    # Representative dummy input — matches the model's expected input spec.
    # Dynamic axes means the actual batch size at inference time can differ
    # from this, but the model architecture is fixed to 3×224×224 per image.
    dummy_input = torch.randn(1, 3, 224, 224)

    output_path = str(output_path)
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)

    print(f"[Export] Exporting to ONNX opset {opset_version}...")
    torch.onnx.export(
        model,
        dummy_input,
        output_path,
        input_names=["input_image"],
        output_names=["skin_type_logits", "concern_logits"],
        dynamic_axes={
            "input_image": {0: "batch_size"},
            "skin_type_logits": {0: "batch_size"},
            "concern_logits": {0: "batch_size"},
        },
        opset_version=opset_version,
        do_constant_folding=True,  # fold constants for faster inference
        export_params=True,
        verbose=False,
    )
    print(f"✓ Exported to: {output_path}")

    # ── PyTorch reference output for consistency check ────────────────────
    with torch.no_grad():
        pt_skin_type, pt_concerns = model(dummy_input)
    pt_skin_type = pt_skin_type.numpy()
    pt_concerns = pt_concerns.numpy()

    # ── Optional ONNX Runtime consistency verification ────────────────────
    if verify_consistency:
        try:
            import onnxruntime as ort
            import numpy as np

            print("\n[Export] Running ONNX Runtime consistency check...")
            sess = ort.InferenceSession(output_path)
            ort_outputs = sess.run(
                None,
                {"input_image": dummy_input.numpy()},
            )
            ort_skin_type, ort_concerns = ort_outputs

            skin_type_diff = np.abs(pt_skin_type - ort_skin_type).max()
            concerns_diff = np.abs(pt_concerns - ort_concerns).max()

            TOLERANCE = 1e-4
            if skin_type_diff < TOLERANCE and concerns_diff < TOLERANCE:
                print(f"✓ ONNX Runtime output matches PyTorch (max diff: "
                      f"skin_type={skin_type_diff:.2e}, concerns={concerns_diff:.2e})")
            else:
                print(
                    f"⚠️  WARNING: Numerical mismatch between PyTorch and ONNX Runtime!\n"
                    f"   skin_type max diff: {skin_type_diff:.4e} (tolerance {TOLERANCE})\n"
                    f"   concerns max diff:  {concerns_diff:.4e}\n"
                    f"   Investigate before deploying this ONNX file."
                )
        except ImportError:
            print(
                "\n[Export] onnxruntime not installed — skipping consistency check.\n"
                "Install with: pip install onnxruntime\n"
                "STRONGLY recommended to verify before mobile deployment."
            )

    # ── Export manifest ───────────────────────────────────────────────────
    manifest = {
        "checkpoint_path": checkpoint_path,
        "onnx_path": output_path,
        "opset_version": opset_version,
        "input_spec": {
            "name": "input_image",
            "shape": [1, 3, 224, 224],
            "dtype": "float32",
            "normalisation": "ImageNet (mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])",
        },
        "outputs": [
            {
                "name": "skin_type_logits",
                "shape": [1, 4],
                "dtype": "float32",
                "inference": "argmax → index into SKIN_TYPE_LABELS",
                "labels": ["oily", "dry", "combination", "normal"],
            },
            {
                "name": "concern_logits",
                "shape": [1, 5],
                "dtype": "float32",
                "inference": "sigmoid > 0.5 → binary presence per concern",
                "labels": CONCERN_LABELS,
            },
        ],
        "pytorch_reference": {
            "skin_type_logits_sample": pt_skin_type.tolist(),
            "concern_logits_sample": pt_concerns.tolist(),
        },
    }

    manifest_path = Path(output_path).with_suffix(".export_manifest.json")
    with open(str(manifest_path), "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"✓ Export manifest saved to: {manifest_path}")

    print("\n[Export] NEXT STEPS before mobile deployment:")
    print("  1. Run a sanity inference with a REAL face image (not noise)")
    print("     against this ONNX file")
    print("  2. Confirm the predicted skin type matches what you expect")
    print("  3. Bundle the ONNX file into the React Native app assets")
    print("  4. Implement Phase 6 ONNX Runtime Mobile inference in TypeScript")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Export GlowVAI SkinModel checkpoint to ONNX — Phase 5"
    )
    parser.add_argument(
        "--checkpoint", required=True,
        help="Path to trained .pth checkpoint (from train.py)"
    )
    parser.add_argument(
        "--output",
        default="checkpoints/skin_model.onnx",
        help="Output path for .onnx file"
    )
    parser.add_argument(
        "--opset", type=int, default=13,
        help="ONNX opset version (default 13, compatible with ONNX Runtime 1.14+)"
    )
    parser.add_argument(
        "--no-verify", action="store_true",
        help="Skip ONNX Runtime consistency check (not recommended)"
    )
    args = parser.parse_args()

    export_model(
        checkpoint_path=args.checkpoint,
        output_path=args.output,
        opset_version=args.opset,
        verify_consistency=not args.no_verify,
    )
