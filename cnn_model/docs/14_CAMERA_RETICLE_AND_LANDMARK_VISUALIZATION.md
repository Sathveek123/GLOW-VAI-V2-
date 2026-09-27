# GlowVAI Camera Reticle & Landmark Visualization

> **Document:** 14 · **Status:** ✅ Updated September 2026

---

## 1. Camera Viewfinder System

The GlowVAI camera screen uses a real-time viewfinder overlay that guides users into the correct capture position before taking their scan photo.

### Components
| Component | File | Purpose |
|-----------|------|---------|
| `CameraViewfinderScreen` | `src/features/scan/CameraViewfinderScreen.tsx` | Main camera capture screen |
| `FaceScanCameraScreen` | `src/features/scan/FaceScanCameraScreen.tsx` | Alternative camera entry point |
| `FaceScanScreen` | `src/features/scan/FaceScanScreen.tsx` | Scan intro + capture flow orchestrator |

---

## 2. Reticle Overlay

The camera overlay renders a face-shaped reticle (oval) centred in the viewfinder. The reticle:

- Uses SVG Path or `View` border-radius to draw an oval mask
- Darkens the area outside the oval (semi-transparent black layer)
- Shows alignment guides: horizontal and vertical centre lines
- Changes colour based on capture gate state:
  - **White** — neutral / waiting
  - **Green** — all quality checks passed, ready to capture
  - **Red** — face not detected or quality check failed
  - **Yellow** — face detected but quality check in progress

---

## 3. Capture Gate System

The capture gate prevents low-quality images from reaching the ONNX inference pipeline. It runs in real-time while the camera is active.

### Gate Checks (Priority Order)
| Priority | Check | Failure Message |
|----------|-------|-----------------|
| 1 | Face detected | "Centre your face in the oval" |
| 2 | Face confidence ≥ 0.7 | "Move closer to the camera" |
| 3 | Lighting adequate | "Find better lighting" |
| 4 | No motion blur | "Hold still" |
| 5 | Face centred in reticle | "Align your face with the oval" |

All five checks must pass simultaneously for the capture button to activate.

### Implementation
The capture gate uses:
- **ML Kit Face Detection** (from `@react-native-ml-kit/face-detection`) for face bounding box + confidence
- **Brightness analysis** from camera frame metadata
- **Motion detection** via frame-to-frame pixel delta comparison

See [doc 18](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/cnn_model/docs/18_CAMERA_VALIDATION_AND_CAPTURE_GATE_SPECIFICATION.md) for the full Capture Gate state machine specification.

---

## 4. Face Bounding Box → Inference Chain

After capture, the face bounding box from ML Kit becomes the `FaceCropBounds` that `imagePreprocessing.ts` uses to crop the image before resizing:

```typescript
// From ML Kit Face Detection:
const face = detectedFaces[0];
const faceCropBounds: FaceCropBounds = {
  minX: face.frame.left,
  minY: face.frame.top,
  maxX: face.frame.left + face.frame.width,
  maxY: face.frame.top + face.frame.height,
};

// Passed to ScanAnalysisScreen via router params:
router.push({
  pathname: '/(customer)/scan/analyzing',
  params: {
    imageUri,
    faceCropBounds: JSON.stringify(faceCropBounds),
    // ...
  }
});
```

This ensures the ONNX model receives a crop of the face region, not the full 4K camera frame.

---

## 5. Landmark Dots Overlay (Report Screen)

`SkinReportScreen.tsx` displays landmark dots overlaid on the scanned face photo in the hero card. These are cosmetic UI elements — they show the user that AI analysis occurred.

> [!NOTE]
> The landmark dots visible on the SkinReportScreen are currently **rendered at fixed positions** relative to the face photo dimensions. In a future phase, they will be replaced with actual MediaPipe landmark positions captured during the scan.

---

## 6. Gallery Upload Path

When a user selects a photo from their gallery instead of using the camera:

1. `GalleryUploadScreen` uses `expo-image-picker` to select the image
2. ML Kit runs face detection on the picked image
3. If a face is found: proceeds with same `FaceCropBounds` flow as camera
4. If no face found: shows "No face detected — please choose a clearer photo" and prompts retry

The gallery path intentionally does NOT apply the capture gate (lighting/blur checks) — those are only meaningful for live camera frames.
