# GlowVAI FAQs & Troubleshooting Guide

> **Document:** 15 · **Status:** ✅ Updated September 2026

---

## Training & Data

**Q: The training script crashes with "Only N unique people found — too few for meaningful splits"**
A: Your CSV needs at least 10 unique `person_id` values. Add more annotated people, or temporarily reduce `--train_ratio` for testing with small datasets.

**Q: Schema validation fails with "missing required columns"**
A: Your CSV must have exactly these columns: `image_path`, `person_id`, `skin_type`, `oiliness`, `dryness`, `redness`, `uneven_tone`, `visible_blemishes`. Check for typos or extra/missing columns.

**Q: File validation fails — images not found**
A: `image_path` in your CSV is relative to `image_root`. If CSV says `images/face01.jpg` and `image_root=data/`, the file must be at `data/images/face01.jpg`.

**Q: Training loss is NaN from epoch 1**
A: Almost always a learning rate issue — try `--lr 1e-5`. Also verify all images load correctly with `python src/data/dataset.py`.

**Q: Validation loss stops decreasing early (< 5 epochs)**
A: Try `--unfreeze_last_n_blocks 4` (more backbone fine-tuning) or reduce learning rate to `5e-5`.

**Q: `DataLoader` crashes on Windows with multiprocessing errors**
A: Use `--num_workers 0`. This is a known PyTorch + Windows multiprocessing limitation.

---

## ONNX Export & Mobile

**Q: ONNX export succeeds but `onnxruntime` says output shape mismatch**
A: The export script outputs `skin_type_logits [1, 4]` and `concern_logits [1, 5]`. If `skinModelService.ts` reads a different output name, update the `results['output_name']` key to match the ONNX node names in the manifest.

**Q: Model file is < 1 MB and the app throws "suspiciously small" error**
A: The real trained MobileNetV3-Large ONNX model is ~14 MB. A file < 1 MB is either a placeholder or an empty/corrupt write. Re-run `export_to_onnx.py` and verify the output size with `dir checkpoints/skin_model.onnx`.

**Q: App crashes on launch with ONNX Runtime native module not found**
A: You need a dev build — ONNX Runtime requires native modules not available in Expo Go. Run `npx expo prebuild` then `npx expo run:android` or `npx expo run:ios`.

**Q: `.onnx` file can't be required in TypeScript (module not found)**
A: Add `'onnx'` to `assetExts` in `metro.config.js`:
```js
config.resolver.assetExts.push('onnx');
```
Then restart the Metro bundler (`npx expo start --clear`).

**Q: `decodeImageToRgb` throws "requires a real pixel-decoding library"**
A: Expected — this function is intentionally left unimplemented. Install `react-native-image-pixels` and wire `getPixels()` in `imagePreprocessing.ts`. See [doc 21](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/21_PHASE6_ONNX_RUNTIME_MOBILE_INTEGRATION.md) for the exact call.

---

## Inference Results

**Q: All scans return `uncertain` skin type**
A: Model confidence is below 50% for every prediction. Causes: (1) model not actually trained yet (untrained weights output near-random logits), (2) model was trained on very different image conditions than what the camera captures, (3) masking is zeroing too many pixels.

**Q: Concern scores are always ~0.5 for everything**
A: Sigmoid of 0 = 0.5. This means the concern logits are near zero — the model hasn't learned to distinguish concern presence. Check training: did the BCE loss for concerns decrease over epochs?

**Q: SkinReportScreen shows "Combination Skin" / "82% confidence" instead of real data**
A: `params.result` is missing. The `ScanAnalysisScreen` didn't pass the result — check that the router navigation call includes `result: JSON.stringify(analysisResult)`.

**Q: Scan always routes to `ScanFailedScreen` with reason `processing_error`**
A: Check the console for `[ScanAnalysis] Real inference failed:` error. The most common cause is `decodeImageToRgb` throwing its "not implemented" error (expected until pixel decode is wired).

---

## Data Quality

**Q: How many people do I need for a usable model?**
A: Rule of thumb — 1,000 unique people minimum for any usable result; 3,000+ people for deployment-quality accuracy. Under 1,000, the model will overfit or not converge to meaningful patterns.

**Q: Do I need professional clinical annotations?**
A: For a cosmetic product, consistent lay annotations are acceptable. 2–3 annotators agreeing on skin type is enough. Concern severity (0–3 scale) benefits from clear annotation guidelines — prepare an annotator guide with reference photos for each severity level.

**Q: Can I use CelebA / UTKFace for Phase 5 SkinConcernDataset?**
A: Those datasets don't have the required concern severity columns. You'd need to re-annotate them with `oiliness`, `dryness`, `redness`, `uneven_tone`, `visible_blemishes` severities per image — significant labelling work. Starting with your own collected data is often more practical.
