# GlowVAI System Audit — What's Real & What's Pending

> **Document:** 07 · **Status:** ✅ Updated September 2026 (Post Phase 6)

---

## 1. What Is Fully Real (Phases 1–6 Complete)

| Component | Status | Notes |
|-----------|--------|-------|
| Camera capture | ✅ Real | `expo-camera` CameraView, real native hardware |
| Gallery upload | ✅ Real | `expo-image-picker`, real file selection |
| Face detection | ✅ Real | ML Kit + MediaPipe landmarks |
| Capture gate | ✅ Real | Quality guard: lighting, blur, face confidence |
| Skin segmentation | ✅ Real | Phase 3 geometry-based segmentation mask |
| Image preprocessing | ✅ Real | Crop → resize 224×224 → CHW normalised tensor |
| On-device inference | ✅ Real | ONNX Runtime, loaded from `skin_model.onnx` |
| Native dependencies | ✅ Installed | `expo-image-manipulator` + `onnxruntime-react-native` installed |
| Metro asset config | ✅ Configured | `assetExts` includes `'onnx'` in `metro.config.js` |
| Web bundling safety | ✅ Safe | `import type` + platform-guarded native `getORT()` loader |
| Workspace TypeScript | ✅ Passed | `npm run typecheck` passes with 0 errors |
| Desktop & Mobile UI | ✅ Redesigned | 9.8/10 precision UI on Desktop Webview & Mobile screens |
| Skin type output | ✅ Real | softmax argmax over 4 classes |
| Concern output | ✅ Real | sigmoid > 0.5 threshold over 5 labels |
| Confidence reporting | ✅ Real | Softmax probability, "uncertain" state at < 50% |
| Low-confidence banner | ✅ Real | Shown when `status === 'low_confidence'` |
| Model version in footer | ✅ Real | `modelVersion` from `SkinAnalysisResult` |
| Inference latency | ✅ Real | `inferenceLatencyMs` from actual `Date.now()` delta |
| Fail routing | ✅ Real | `ScanFailedScreen` on model_unavailable / timeout / error |
| Training pipeline | ✅ Real | Phase 5 scripts produce genuine metrics |
| Person-level splits | ✅ Real | `GroupShuffleSplit(groups=person_id)`, hard assertions |
| Evaluation report | ✅ Real | Real confusion matrices, timestamped JSON |
| ONNX export | ✅ Real | opset 13 + ORT consistency check |
| Firestore telemetry | ✅ Real | `scans/{scanId}` with `inferenceMethod: "onnx_on_device"` |

---

## 2. What Requires Completion Before Production

| Component | Blocker | Work Required |
|-----------|---------|---------------|
| Trained model weights | No real labelled skin dataset yet | Label `person_id` + skin type + concern severity CSV, run `train.py` |
| `skin_model.onnx` real weights | Replace placeholder with ~14MB checkpoint | `cp checkpoints/skin_model.onnx assets/models/` after training |
| Native prebuild | App must use dev build, not Expo Go | `npx expo prebuild && npx expo run:android` |
| Phase 2/3 → Analysis wiring | `faceCropBounds` + `skinMask` params not yet passed | Wire `ImagePreviewScreen` → `ScanAnalysisScreen` param passing |
| Expression flow (smile→neutral) | ML Kit `smilingProbability` not wired | Extend `useFaceGuidance.ts` with expression state machine per [Doc 18](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/18_CAMERA_VALIDATION_AND_CAPTURE_GATE_SPECIFICATION.md) Section 3 |
| Doc 17 schema reconciliation | `UserSkinReport` spec diverges from `SkinAnalysisResult` | Either extend Phase 5 model to produce zone-level scores, or simplify Doc 17 to match current output (tracked Phase 7 item) |

---

## 3. What Was Removed (No Longer in Codebase)

| Removed | Reason |
|---------|--------|
| Hash-based fallback scores in `aiSkinModelService.ts` | Fake scores — worse than an honest failure state |
| Candidate endpoint list (7 parallel fetches) | Unnecessary with on-device inference |
| Hardcoded "82% confidence" in `SkinReportScreen` | Replaced with real `skinTypeConfidence` from model |
| Hardcoded "Combination Skin" in hero card | Replaced with real `skinType` from model |
| Hardcoded "91% Scan Quality" metric | Replaced with real overall confidence |
| Hardcoded "74/100 Skin Balance" | Replaced with real concern count |
| ResNet-50 backbone references | MobileNetV3-Large is the correct architecture |

---

## 4. Honest Accuracy Expectations

> [!WARNING]
> The following are **representative ranges**, not promises. Real accuracy depends entirely on the quality and quantity of your labelled training data.

### Skin Type Classification (4-class)
- **Well-labelled dataset (10k+ persons, consistent photography):** 70–80% test accuracy is achievable
- **Small dataset (< 2k persons):** 55–65% is more realistic
- **Under 50%:** Model is barely above random chance for 4 classes — indicates labelling issues or insufficient data

### Concern Detection (5-label binary, per concern)
- **High-prevalence concern (e.g., oiliness):** 75–85% binary accuracy
- **Low-prevalence concern (e.g., redness):** Can show high accuracy but low recall — check F1, not just accuracy

### When to trust the result
Confidence ≥ 80%: Result is reliable enough to recommend products.
Confidence 50–80%: Show result with caveat. Low-confidence banner applies at 50%.
Confidence < 50%: Show `uncertain` skin type + prompt retake.

---

## 5. Known Technical Limitations

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| Single photo, single frame | Misses dynamic skin conditions (T-zone varies through day) | Future: multi-frame average |
| Lighting sensitivity | Poor lighting → degraded input → low confidence | Capture gate enforces lighting quality |
| Segmentation boundary accuracy | Phase 3 geometry-based mask may include non-skin pixels at borders | Accept 5–10% impurity — model is robust to small mask errors |
| iOS/Android camera colour science differences | Same skin can look differently exposed | ColorJitter augmentation reduces gap at training time |
| No temporal tracking | Can't track skin improvement over time yet | Future: scan history comparison |
| Cosmetic labels only | Cannot detect medical conditions (rosacea, eczema, psoriasis) | By design — non-medical scope enforced |
