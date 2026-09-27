# GlowVAI Production Deployment & Roadmap

> **Document:** 08 · **Status:** ✅ Updated September 2026

---

## 1. Current Deployment State (Phase 6)

### On-Device (Primary)
| Asset | Status | Location |
|-------|--------|----------|
| `skin_model.onnx` | ⏳ Needs real trained weights | `assets/models/skin_model.onnx` |
| `skinModelService.ts` | ✅ Implemented | `src/services/skinModelService.ts` |
| `imagePreprocessing.ts` | ✅ Implemented (pixel decode pending) | `src/services/imagePreprocessing.ts` |
| `ScanAnalysisScreen.tsx` | ✅ Wired to real ONNX | `src/features/scan/ScanAnalysisScreen.tsx` |
| `SkinReportScreen.tsx` | ✅ Consumes real result | `src/features/scan/SkinReportScreen.tsx` |

### Python Training (Phase 5)
| Component | Status |
|-----------|--------|
| `backbone.py` — SkinEncoder (MobileNetV3-Large) | ✅ |
| `heads.py` — SkinTypeHead + ConcernHead + SkinModel | ✅ |
| `dataset.py` — SkinConcernDataset + validation | ✅ |
| `create_splits.py` — Person-level GroupShuffleSplit | ✅ |
| `train.py` — Real training loop + audit JSON | ✅ |
| `evaluate.py` — Real confusion matrix + report | ✅ |
| `export_to_onnx.py` — opset 13 + ORT consistency | ✅ |

---

## 2. Production Launch Checklist

```
□ Step 1: Label dataset
      Collect face images, assign person_id, label skin_type + concern severity
      Target: 3,000+ unique people minimum for usable accuracy

□ Step 2: Run splits
      python scripts/create_splits.py \
          --input_csv data/labels.csv \
          --output_dir data/splits

□ Step 3: Validate dataset loads
      python src/data/dataset.py data/splits/train.csv data/images

□ Step 4: Train
      python scripts/train.py \
          --train_csv data/splits/train.csv \
          --val_csv   data/splits/val.csv \
          --image_root data/images \
          --epochs 25

□ Step 5: Evaluate on held-out test set (ONCE — not repeatedly)
      python scripts/evaluate.py \
          --checkpoint checkpoints/skin_model_best.pth \
          --test_csv   data/splits/test.csv \
          --image_root data/images

□ Step 6: Review test_evaluation_report.json
      Confirm accuracy meets minimum bar before shipping:
        skin_type_accuracy >= 0.60
        avg concern F1 >= 0.65

□ Step 7: Export to ONNX
      python scripts/export_to_onnx.py \
          --checkpoint checkpoints/skin_model_best.pth \
          --output     checkpoints/skin_model.onnx

□ Step 8: Wire pixel decode in imagePreprocessing.ts
      npm install react-native-image-pixels
      Replace decodeImageToRgb() stub with getPixels() call

□ Step 9: Bundle model into app
      cp checkpoints/skin_model.onnx assets/models/skin_model.onnx
      Add 'onnx' to metro.config.js assetExts

□ Step 10: Native prebuild
      npx expo prebuild --clean
      npx expo run:android  (or run:ios)

□ Step 11: Sanity inference on device
      Run a real scan with a real face in good lighting
      Verify skin type result makes sense (not 'uncertain')
      Check inferenceLatencyMs in debug footer (target < 200ms on mid-range phone)

□ Step 12: Ship
```

---

## 3. Model Version Management

Every time you retrain and ship a new `.onnx` file, update the version string in `skinModelService.ts`:

```typescript
const MODEL_VERSION = 'skin_model_v1_2026';  // change to v2, v3, etc.
```

This version string appears in:
- `SkinAnalysisResult.modelVersion` (visible in report debug footer)
- `Firestore scans/{scanId}.modelVersion`
- `checkpoints/training_run_report.json`
- `checkpoints/test_evaluation_report.json`

Always correlate version string → training_run_report timestamp → test_evaluation_report timestamp before attributing accuracy numbers.

---

## 4. Model Update Strategy

### Patch update (same architecture, retrained)
1. Retrain with new/expanded dataset
2. Run evaluate.py — confirm improvement
3. Export new `.onnx`
4. Bump `MODEL_VERSION` string
5. Ship as app update (model bundled in app binary)

### Architecture update (new backbone / heads)
1. Update `backbone.py` + `heads.py`
2. Update `export_to_onnx.py` ONNX spec doc block
3. Update `skinModelService.ts` output name parsing if output node names changed
4. Full retrain + evaluate cycle
5. Bump major version

---

## 5. Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| Inference latency (CPU) | < 200ms | MobileNetV3-Large ~25ms bare; preprocessing adds overhead |
| Model file size | < 20 MB | Current: ~14 MB |
| App cold start (first scan) | < 3s | Session creation + model parse on first call |
| Subsequent scans | < 500ms | Session reuse via singleton |
| Skin type accuracy | ≥ 65% | On real labelled test set, not fabricated |
| Concern macro F1 | ≥ 0.60 | Per-concern average |

---

## 6. Roadmap (Future Phases)

| Phase | Feature | Priority |
|-------|---------|----------|
| 7 | Multi-frame averaging (3 photos, vote) | High — reduces single-shot variance |
| 7 | Scan history + improvement tracking | High |
| 8 | Core ML / NNAPI hardware acceleration | Medium |
| 8 | INT8 quantisation for smaller ONNX | Medium |
| 9 | Expansion to more skin concerns | Low |
| 10 | Concern-to-product recommendation ML | Low |
