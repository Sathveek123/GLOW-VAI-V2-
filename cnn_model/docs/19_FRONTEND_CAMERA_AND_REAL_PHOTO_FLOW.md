# GlowVAI — Frontend Camera, Real Photo Flow & Scan Pipeline (v2 Architecture)

> **Document:** 19 · **Updated:** September 2026 (Phase 6 alignment)
> **Status:** ✅ Production — Camera capture mechanics real and correct.

> [!WARNING]
> **Architecture Update — Phase 6 Supersedes Sections 9 & 10 of this document.**
> The inference path described in Section 9 (FastAPI POST) and the Firestore schema in Section 10 are **legacy** and describe the pre-Phase-6 server-side flow that no longer applies.
> - **Primary inference path:** `skinModelService.ts → ONNX Runtime → on-device` (see Doc 05, Doc 21)
> - **Current Firestore schema:** See Doc 13 (Phase 6 schema with `inferenceMethod: "onnx_on_device"`)
> - **Current report consumer:** `SkinReportScreen` reads `SkinAnalysisResult` JSON from route params (see Doc 06)
> Sections 1–8 (camera capture, gallery, permission handling, face overlay, quality gate) remain accurate and current.

---

## Overview

This document describes the **camera capture mechanics and photo URI passing pattern** that feeds the GlowVAI scan pipeline. It covers the September 2026 fix that replaced all placeholder stock images with real device camera output.

For the full end-to-end scan pipeline including on-device ONNX inference, see:
- **[Doc 01](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/01_OVERVIEW_AND_ARCHITECTURE.md)** — complete system architecture
- **[Doc 21](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/21_PHASE6_ONNX_RUNTIME_MOBILE_INTEGRATION.md)** — on-device inference (what happens after capture)

---

## 1. Camera Capture → Inference Pipeline (Phase 6)

```
User opens GlowVAI app
    ↓
Home Screen → "Scan My Skin" CTA
    ↓
scan/intro.tsx → ScanIntroScreen (preparation guide)
    ↓
    ┌─────────────────────────────────────────┐
    │  TWO CAPTURE PATHS (user's choice)      │
    ├──────────────────┬──────────────────────┤
    │ CAMERA PATH      │ GALLERY PATH         │
    │                  │                      │
    │ scan/camera.tsx  │ scan/gallery.tsx     │
    │ CameraViewfinder │ GalleryUploadScreen  │
    │ Screen           │                      │
    │ ↓                │ ↓                    │
    │ CameraView       │ expo-image-picker    │
    │ (live feed)      │ launchImageLibrary   │
    │ ↓                │ ↓                    │
    │ takePictureAsync │ result.assets[0].uri │
    └────────┬─────────┴──────────────────────┘
             │  photoUri (real local file:// URI)
             ↓
    scan/preview.tsx → ImagePreviewScreen
    (displays REAL captured photo)
    (Phase 3 segmentation mask computed here)
    (faceCropBounds derived from ML Kit detection)
             ↓
    "Use this photo" → scan/analyzing.tsx
             ↓
    ScanAnalysisScreen
    → imagePreprocessing.ts  (crop → resize 224×224 → decode → mask)
    → skinModelService.ts    (ONNX Runtime on-device inference)
    → MobileNetV3-Large      (NOT ResNet-50 — see Doc 02)
             ↓
    scan/report.tsx → SkinReportScreen
    (reads SkinAnalysisResult from route params — see Doc 05/06)
             ↓
    AI Recommendations → Express Checkout → Cart → Payment
```

---

## 2. Camera Implementation (expo-camera v16)

### Package
```
expo-camera: ~16.0.17
```

### Key API (expo-camera v16)
```typescript
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

// Permission hook
const [permission, requestPermission] = useCameraPermissions();

// Component
<CameraView
  ref={cameraRef}
  style={StyleSheet.absoluteFillObject}
  facing={facing}    // 'front' | 'back'
/>

// Capture
const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
const photoUri = photo?.uri;  // file:///data/user/0/...../photo.jpg
```

> [!NOTE]
> `takePictureAsync` is the correct expo-camera v16 API. The old `takePicture` callback-based API was removed. If you see "takePicture is not a function", check that `expo-camera` is at version ~16.x.

### Critical: Photo URI Passing Pattern
```typescript
// In CameraViewfinderScreen — AFTER capture:
router.push({
  pathname: '/scan/preview',
  params: { photoUri }   // pass real URI — NEVER pass base64
});

// In ImagePreviewScreen — reading the URI:
const params = useLocalSearchParams<{ photoUri?: string }>();
const photoUri = params.photoUri || null;

// Rendering the real photo:
<Image source={{ uri: photoUri }} style={styles.capturedImage} />
```

**Why URI not base64:** base64-encoded images can be 30–40% larger than the file, causing memory pressure and slow serialisation through the router. Always pass the local file URI.

---

## 3. Gallery Upload Implementation (expo-image-picker)

### Package
```
expo-image-picker (installed September 2026)
```

### Key API
```typescript
import * as ImagePicker from 'expo-image-picker';

const handlePickFromGallery = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [3, 4],
    quality: 0.9,
  });

  if (!result.canceled && result.assets && result.assets.length > 0) {
    const asset = result.assets[0];
    if (!asset) return;
    const uri = asset.uri;
    router.push({ pathname: '/scan/preview', params: { photoUri: uri } });
  }
};
```

---

## 4. Face Mesh Overlay System

The **ImagePreviewScreen** renders a visual face mesh overlay on top of the captured image to communicate that AI is analysing face landmarks.

### Overlay Components
```
meshOval        — 180×230px dashed ellipse (face outline guide)
meshEyeLeft     — 30×12px rounded rect (left eye socket)
meshEyeRight    — 30×12px rounded rect (right eye socket)
meshNoseLine    — 1.5px vertical line from nose bridge
meshMouthArc    — 44×16px arc (border-bottom curve)
meshContourDots — 12 dots (4×4px, soft coral) at contour positions
skinMaskBadge   — "Skin mask 224 × 224" badge (bottom-right corner)
```

### Why 224×224?
The ONNX model (`skin_model.onnx` — MobileNetV3-Large) expects input images of **224×224 pixels** in `[B, 3, 224, 224]` float32 format (ImageNet-normalised CHW). This is the standard ImageNet input resolution. See **[Doc 02](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/02_MODEL_ARCHITECTURES_AND_HEADS.md)** for the full ONNX input spec.

### Face Detection Package
The face bounding box used for the crop-to-face step in `imagePreprocessing.ts` comes from:
- **Live preview (CameraView):** `react-native-vision-camera-face-detector` — real-time low-latency detection in the viewfinder
- **Post-capture mesh (still image):** `@mediapipe/tasks-vision` — full 468-point landmark mesh run once on the captured photo

Both run on-device. Detection is not server-side.

---

## 5. Capture Gate & Quality Validation

The **CameraViewfinderScreen** implements a real-time capture gate. All 5 checks must pass for the shutter to activate:

| Priority | Check | Failure Message |
|----------|-------|-----------------|
| 1 | Face detected | "Centre your face in the oval" |
| 2 | Face confidence ≥ 0.7 | "Move closer to the camera" |
| 3 | Lighting adequate | "Find better lighting" |
| 4 | No motion blur | "Hold still" |
| 5 | Face centred in reticle | "Align your face with the oval" |

For the full 17-priority validator spec (including the Expression Flow at priority 15), see **[Doc 18](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/18_CAMERA_VALIDATION_AND_CAPTURE_GATE_SPECIFICATION.md)**. Expression flow is specified but not yet wired — see Doc 07 Section 2 for current implementation status.

---

## 6. What Was Wrong Before (September 2026 Fix)

### Problem 1: Fake stock photos hardcoded as "camera feed"
```typescript
// ❌ BEFORE — Unsplash girl photo used as "camera":
<Image source={{ uri: 'https://images.unsplash.com/photo-1544005313-...' }} />

// ✅ AFTER — real device camera:
<CameraView ref={cameraRef} style={StyleSheet.absoluteFillObject} facing={facing} />
```

### Problem 2: Preview screen showed hardcoded girl image
```typescript
// ❌ BEFORE:
<Image source={{ uri: 'https://images.unsplash.com/photo-1544005313...' }} />

// ✅ AFTER — reads REAL photoUri from route params:
const params = useLocalSearchParams<{ photoUri?: string }>();
<Image source={{ uri: params.photoUri }} />
```

### Problem 3: Gallery showed fake stock photo thumbnails
```typescript
// ❌ BEFORE:
const samplePhotos = ['https://images.unsplash.com/photo-1544005313...'];

// ✅ AFTER — launches real device photo library:
const result = await ImagePicker.launchImageLibraryAsync({ ... });
```

### Problem 4: Camera captured photo but didn't pass URI
```typescript
// ❌ BEFORE — navigated to analyzing without the photo:
const handleCapture = () => {
  router.push('/(customer)/scan/analyzing');  // lost the photo!
};

// ✅ AFTER — captures and passes real URI:
const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
router.push({ pathname: '/scan/preview', params: { photoUri: photo.uri } });
```

---

## 7. Permission Handling

### Camera Permission States
```
┌─────────────────────────────────┐
│  !permission (loading)          │ → Show ActivityIndicator
├─────────────────────────────────┤
│  permission.granted = false     │ → Show "Grant Camera Access" screen
│  + canAskAgain = true           │ → Button calls requestPermission()
├─────────────────────────────────┤
│  permission.granted = false     │ → Show Alert with Settings link
│  + canAskAgain = false          │
├─────────────────────────────────┤
│  permission.granted = true      │ → Render live CameraView
└─────────────────────────────────┘
```

---

## 8. Camera Screens Quick Reference

| Screen | File | Camera Package | Real Photo? |
|--------|------|---------------|-------------|
| Camera Viewfinder | `CameraViewfinderScreen.tsx` | `expo-camera` CameraView | ✅ Yes |
| Face Scan Camera | `FaceScanCameraScreen.tsx` | `expo-camera` CameraView | ✅ Yes |
| Gallery Upload | `GalleryUploadScreen.tsx` | `expo-image-picker` | ✅ Yes |
| Image Preview | `ImagePreviewScreen.tsx` | reads `params.photoUri` | ✅ Yes |
| Scan Analysis | `ScanAnalysisScreen.tsx` | calls `skinModelService.ts` on-device | ✅ Yes |

---

## 9. Legacy — FastAPI Integration (Superseded by Phase 6)

> [!CAUTION]
> **This section describes the pre-Phase-6 server-side inference flow. It is superseded by `skinModelService.ts` + ONNX Runtime on-device inference.** Kept here for historical reference only. Do not implement new code against this pattern.

```typescript
// ❌ LEGACY — aiSkinModelService.ts (superseded)
const formData = new FormData();
formData.append('image', { uri: photoUri, name: 'scan.jpg', type: 'image/jpeg' } as any);
const response = await fetch(`${API_BASE}/api/v1/analyse`, {
  method: 'POST', body: formData,
});
```

**Current replacement (Phase 6):**
```typescript
// ✅ CURRENT — skinModelService.ts
const result = await runSkinAnalysis(maskedPixels, scanId);
// → SkinAnalysisResult (on-device, no network call)
```

See **[Doc 05](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/05_INFERENCE_ENGINE_AND_API.md)** — on-device ONNX Runtime is the primary path; FastAPI is secondary/development only.

---

## 10. Current Firestore Schema (Phase 6)

See **[Doc 13](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/13_FIREBASE_AND_TELEMETRY_PIPELINE.md)** for the full current schema.

The Phase 6 scan document includes:
- `inferenceMethod: "onnx_on_device"` (never `server`)
- `skinProfile: { skinType, skinTypeConfidence, skinTypeProbs }`
- `concerns: { oiliness, dryness, redness, uneven_tone, visible_blemishes }` (each with score + severity)
- `modelVersion: "skin_model_v1_2026"`

---

## 11. Related Documents

| Document | Scope |
|----------|-------|
| [01_OVERVIEW_AND_ARCHITECTURE.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/01_OVERVIEW_AND_ARCHITECTURE.md) | Full Phase 6 system architecture |
| [02_MODEL_ARCHITECTURES_AND_HEADS.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/02_MODEL_ARCHITECTURES_AND_HEADS.md) | MobileNetV3-Large spec, ONNX input shape |
| [05_INFERENCE_ENGINE_AND_API.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/05_INFERENCE_ENGINE_AND_API.md) | On-device ONNX primary, FastAPI secondary |
| [13_FIREBASE_AND_TELEMETRY_PIPELINE.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/13_FIREBASE_AND_TELEMETRY_PIPELINE.md) | Phase 6 Firestore schema |
| [14_CAMERA_RETICLE_AND_LANDMARK_VISUALIZATION.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/14_CAMERA_RETICLE_AND_LANDMARK_VISUALIZATION.md) | Reticle geometry & overlay |
| [18_CAMERA_VALIDATION_AND_CAPTURE_GATE_SPECIFICATION.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/18_CAMERA_VALIDATION_AND_CAPTURE_GATE_SPECIFICATION.md) | Full 17-priority capture gate spec |
| [21_PHASE6_ONNX_RUNTIME_MOBILE_INTEGRATION.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/21_PHASE6_ONNX_RUNTIME_MOBILE_INTEGRATION.md) | On-device inference (post-capture) |
