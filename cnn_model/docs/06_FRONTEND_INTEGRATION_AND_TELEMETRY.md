# GlowVAI Frontend Integration & Telemetry

> **Document:** 06 · **Status:** ✅ Updated September 2026 (Phase 6 real integration)

---

## 1. Frontend Inference Architecture (Phase 6)

```
[ScanAnalysisScreen] receives params:
  imageUri        — local file:// URI
  faceCropBounds  — JSON FaceCropBounds from Phase 2
  skinMask        — base64 Uint8Array from Phase 3
  imageWidth/Height
        │
        ▼
[imagePreprocessing.ts]
  prepareModelInput()
  → crop to face bounds (expo-image-manipulator)
  → resize to 224×224
  → decode PNG → RGB Uint8Array (react-native-image-pixels)
  → applyMaskToRgb() — zero non-skin pixels
        │
        ▼
[skinModelService.ts]
  runSkinAnalysis(maskedPixels, scanId)
  → getSession() — loads ONNX singleton on first call
  → preprocessToTensor() — HWC uint8 → CHW float32 → ImageNet norm
  → session.run({ input_image: tensor })
  → softmax(skin_type_logits) → skin type + confidence
  → sigmoid(concern_logits)   → concern flags + severity
  → returns SkinAnalysisResult
        │
        ▼
[SkinReportScreen]
  Reads result from router params (JSON.parse)
  → Real skin type display
  → Real confidence bar
  → Real concern cards
  → Low-confidence banner if status === 'low_confidence'
  → Model version + latency in debug footer
```

---

## 2. Old `aiSkinModelService.ts` — Replaced

> [!CAUTION]
> `aiSkinModelService.ts` is **no longer the active inference service**. It has been superseded by `skinModelService.ts`. Do not import from `aiSkinModelService` in new code.

The old service used:
- A list of `candidateEndpoints` dispatched in parallel
- A 1.8-second abort controller
- A **hash-based fallback** that computed fake skin scores from image URL character codes

The hash fallback was removed intentionally. Fake confident results are worse than an honest failed state — they make users believe they have real data when they don't.

---

## 3. Scan Flow Screen Pipeline

```
1. ScanIntroScreen
   → Explains what AI scan does (cosmetic, non-medical)

2. FaceScanCameraScreen  (or GalleryUploadScreen)
   → expo-camera CameraView — real native camera
   → Capture gate: face detection, lighting check, no motion blur
   → On capture: routes to ImagePreviewScreen with photoUri

3. ImagePreviewScreen
   → Displays captured photo
   → Phase 3 segmentation runs here (computes skin mask)
   → Routes to ScanAnalysisScreen with {imageUri, faceCropBounds, skinMask}

4. ScanAnalysisScreen
   → Calls prepareModelInput() → runSkinAnalysis()
   → Step ticker advances while real inference runs (cosmetic, not blocking)
   → Timeouts: warn at 10s, hard abort at 25s → ScanFailedScreen
   → On success: routes to SkinReportScreen with {result: JSON}

5. SkinReportScreen
   → Parses real SkinAnalysisResult from params
   → Shows real skin type, confidence, concern cards
   → Low-confidence banner if applicable
   → "View My Routine" → recommendations
   → "Retake Scan" → back to camera

6. ScanFailedScreen
   → Handles: timeout | processing_error | model_unavailable
   → Always offers retry option
```

---

## 4. Route Params Contract

### ScanAnalysisScreen receives:
| Param | Type | Source |
|-------|------|--------|
| `imageUri` | `string` | Camera capture / gallery pick |
| `faceCropBounds` | `string` (JSON) | Phase 2 MediaPipe bounding box |
| `skinMask` | `string` (base64) | Phase 3 skin segmentation |
| `imageWidth` | `string` | Captured image dimensions |
| `imageHeight` | `string` | Captured image dimensions |

### SkinReportScreen receives:
| Param | Type | Source |
|-------|------|--------|
| `result` | `string` (JSON) | `JSON.stringify(SkinAnalysisResult)` |

---

## 5. Mask Serialisation for Route Params

Expo Router params must be strings. The skin mask (`Uint8Array`) is serialised with:

```typescript
// In ImagePreviewScreen — before routing:
import { maskToBase64 } from '../../services/imagePreprocessing';
const maskB64 = maskToBase64(skinMask);
router.push({ pathname: '/(customer)/scan/analyzing', params: { skinMask: maskB64 } });

// In ScanAnalysisScreen — after receiving:
import { base64ToMask } from '../../services/imagePreprocessing';
const mask = base64ToMask(params.skinMask);
```

---

## 6. Telemetry & Firestore Sync

Implemented in [`src/services/telemetryService.ts`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/services/telemetryService.ts):

### Firestore Scan Document Schema
```json
{
  "scanId": "SCAN-1726173000000",
  "userId": "firebase_uid_xyz",
  "modelVersion": "skin_model_v1_2026",
  "inferenceMethod": "onnx_on_device",
  "status": "completed",
  "confidence": 0.74,
  "skinType": "combination",
  "skinTypeConfidence": 0.74,
  "concerns": {
    "oiliness": { "present": true, "score": 0.82, "severity": "pronounced" },
    "dryness":  { "present": false, "score": 0.21 },
    "redness":  { "present": false, "score": 0.18 },
    "uneven_tone": { "present": true, "score": 0.61, "severity": "moderate" },
    "visible_blemishes": { "present": false, "score": 0.29 }
  },
  "inferenceLatencyMs": 48,
  "scannedAt": 1726173000000,
  "disclaimer": "Cosmetic assessment only — not a medical diagnosis."
}
```

The `inferenceMethod: "onnx_on_device"` field distinguishes Phase 6 scans from any legacy records that may exist from the old hash-fallback system.

---

## 7. `SkinReportScreen` Backward Compatibility

If `result` param is absent (e.g., direct navigation in dev, or from a legacy code path that hasn't been updated), all values fall back to placeholder strings:

```typescript
const skinTypeDisplay = analysisResult
  ? /* real model output */
  : 'Combination Skin';  // placeholder — only in dev/preview
const confidencePct = analysisResult
  ? Math.round(analysisResult.skinProfile.skinTypeConfidence * 100)
  : 82;  // placeholder
```

This ensures the screen doesn't crash during development. In production, `result` is always present.
