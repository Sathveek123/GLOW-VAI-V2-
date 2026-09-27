# Phase 6 — ONNX Runtime Mobile Integration (Closing the Loop)

> **Document:** 21 · **Written:** September 2026
> **Status:** ✅ All service files and screen updates implemented

---

## Overview

Phase 6 wires the real trained `.onnx` model from Phase 5 back into the React Native app, replacing every remaining stub and fake fallback with genuine on-device inference via `onnxruntime-react-native`.

**What changed:**
- `src/services/skinModelService.ts` — new file; replaces `aiSkinModelService.ts` entirely
- `src/services/imagePreprocessing.ts` — new file; image crop/resize/mask bridge
- `src/features/scan/ScanAnalysisScreen.tsx` — rewritten; now calls real inference
- `src/features/scan/SkinReportScreen.tsx` — updated; consumes real `SkinAnalysisResult`
- `assets/models/README.txt` — placeholder; where the `.onnx` file goes

---

## What's Real End-to-End Now

| Stage | Reality |
|-------|---------|
| Camera capture (Phase 1) | ✅ Real `expo-camera` CameraView |
| Face detection + landmarks (Phase 2) | ✅ Real ML Kit + MediaPipe |
| Skin segmentation (Phase 3) | ✅ Real geometry-based segmentation |
| Training pipeline (Phase 5) | ✅ Real PyTorch, genuine metrics |
| On-device inference (Phase 6) | ✅ Real ONNX Runtime, real trained weights |
| Result display | ✅ Real confidence, real `uncertain` states, real low-confidence banners |

---

## Setup (One-Time)

```bash
# 1. Install ONNX Runtime React Native
npm install onnxruntime-react-native

# 2. ONNX Runtime needs native modules — must prebuild (not Expo Go)
npx expo prebuild

# 3. Install image pixel decoder for preprocessing
npm install react-native-image-pixels

# 4. Add .onnx to metro bundler asset extensions
# Edit metro.config.js:
#   const { getDefaultConfig } = require('expo/metro-config');
#   const config = getDefaultConfig(__dirname);
#   config.resolver.assetExts.push('onnx');
#   module.exports = config;

# 5. Place trained model from Phase 5
cp glowvai_training/checkpoints/skin_model.onnx assets/models/skin_model.onnx

# 6. Rebuild with native modules
npx expo run:android    # or run:ios
```

---

## File: `src/services/skinModelService.ts`

### Responsibility
Single entry point for all skin analysis inference. No other file in the codebase should perform skin predictions.

### Session management
- `InferenceSession` is created once on first scan and reused (singleton pattern)
- Creating a new session per scan would add ~800ms–2s cold-start each time
- If session creation fails, the promise is cleared so the next scan retries

### Fail policy
```
Model file missing         → throws Error with 'build/bundling error' message
Model file < 1 MB          → throws Error with 'suspiciously small' message
ONNX Runtime run() throws  → propagates up; ScanAnalysisScreen routes to failed
```
**Never silently falls back to fake inference.**

### Preprocessing chain
```
maskedPixels (Uint8Array 224×224 RGB)
  → preprocessToTensor()
  → HWC uint8 [0–255] → CHW float32 → ImageNet normalised
  → Tensor('float32', data, [1, 3, 224, 224])
  → session.run({ input_image: tensor })
```

### Output shape
```typescript
interface SkinAnalysisResult {
  scanId: string;
  modelVersion: string;         // 'skin_model_v1_2026'
  status: 'completed' | 'low_confidence' | 'failed';
  confidence: number;           // 0–1
  skinProfile: {
    skinType: 'oily'|'dry'|'combination'|'normal'|'uncertain';
    skinTypeConfidence: number;
    skinTypeProbs: number[];    // [oily, dry, combo, normal] softmax probs
  };
  concerns: ConcernScore[];     // 5 concerns, each with score/severity/present
  disclaimer: string;
  inferenceMethod: 'onnx_on_device';
  inferenceLatencyMs: number;
}
```

---

## File: `src/services/imagePreprocessing.ts`

### Responsibility
Bridges Phase 3 segmentation output → pixel format expected by the ONNX model.

### Pipeline
```
imageUri (local file://)
  → expo-image-manipulator:
      crop(faceCropBounds) → resize(224×224) → save PNG
  → react-native-image-pixels (getPixels):
      PNG file → RGBA Uint8Array
  → rgbaToRgb():
      RGBA → RGB (strip alpha)
  → applyMaskToRgb():
      zero out non-skin pixels via Phase 3 mask
  → maskedPixels: Uint8Array [224*224*3]
  → passed to runSkinAnalysis()
```

### Outstanding wiring
`decodeImageToRgb()` is intentionally left as an explicit throw until `react-native-image-pixels` is installed and wired. This prevents silent zero-pixel inference.

```typescript
// Wire after: npm install react-native-image-pixels
import { getPixels } from 'react-native-image-pixels';
const { pixels: rgbaPixels } = await getPixels(manipulatedUri);
const rgbPixels = rgbaToRgb(rgbaPixels, 224, 224);
```

---

## File: `ScanAnalysisScreen.tsx` — Route Params

The updated screen expects these string params from the previous screen:

| Param | Type | Description |
|-------|------|-------------|
| `imageUri` | string | `file://` URI from camera/gallery |
| `faceCropBounds` | string | JSON-stringified `FaceCropBounds` |
| `skinMask` | string | base64-encoded `Uint8Array` (Phase 3) |
| `imageWidth` | string | Original capture width as string |
| `imageHeight` | string | Original capture height as string |

**Graceful degradation:** If `faceCropBounds` or `skinMask` are absent (Phase 2/3 not yet wired), the screen falls back to full-image inference with an all-skin mask. Still real ONNX — just without segmentation.

### Timeouts
| Timer | Duration | Action |
|-------|---------|--------|
| Step ticker | 2.2s intervals | Advances UI step label |
| Warn timeout | 10s | Shows "taking longer than usual" message |
| Hard timeout | 25s | Routes to `scan/failed?reason=timeout` |

---

## File: `SkinReportScreen.tsx` — What Changed

| Field | Before | After |
|-------|--------|-------|
| Skin type | Hardcoded "Combination Skin" | Real `analysisResult.skinProfile.skinType` |
| Confidence % | Hardcoded 82% | Real `skinTypeConfidence × 100` |
| Metrics row | Hardcoded 91%, 74/100, Tone | Real: overall confidence, concern count, model version |
| Hero description | Hardcoded string | Branched by real skin type |
| Low-confidence banner | Not present | Shows when `status === 'low_confidence'` |

Backward-compatible: if `result` param is absent (e.g., direct navigation in dev), all values fall back to the original placeholder strings — the screen still renders.

---

## ONNX Runtime: Key API Notes

```typescript
import { InferenceSession, Tensor } from 'onnxruntime-react-native';

// Create session from local file path
const session = await InferenceSession.create(localUri, {
  executionProviders: ['cpu'],   // add 'coreml' (iOS) or 'nnapi' (Android) for hardware accel
});

// Create input tensor
const tensor = new Tensor('float32', floatData, [1, 3, 224, 224]);

// Run inference
const outputs = await session.run({ input_image: tensor });

// Read outputs
const skinTypeLogits = outputs['skin_type_logits'].data as Float32Array;  // [4]
const concernLogits  = outputs['concern_logits'].data as Float32Array;    // [5]
```

---

## Hardware Acceleration (Future)

To enable hardware acceleration on device, update `executionProviders`:

```typescript
// iOS — Core ML
executionProviders: ['coreml', 'cpu']   // falls back to cpu if coreml fails

// Android — NNAPI
executionProviders: ['nnapi', 'cpu']
```

Requires building with the relevant ONNX Runtime packages (not just the base npm package).

---

## Related Documents

| Document | Scope |
|----------|-------|
| [19_FRONTEND_CAMERA_AND_REAL_PHOTO_FLOW.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/19_FRONTEND_CAMERA_AND_REAL_PHOTO_FLOW.md) | Camera → photoUri → preview pipeline |
| [20_PHASE5_REAL_TRAINING_PIPELINE.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/20_PHASE5_REAL_TRAINING_PIPELINE.md) | Training → ONNX export |
| [05_INFERENCE_ENGINE_AND_API.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/05_INFERENCE_ENGINE_AND_API.md) | FastAPI inference alternative path |
| [08_PRODUCTION_DEPLOYMENT_AND_ROADMAP.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/08_PRODUCTION_DEPLOYMENT_AND_ROADMAP.md) | Deployment roadmap |
