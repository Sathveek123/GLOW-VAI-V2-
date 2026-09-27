# Screen 24: Camera Capture & Viewfinder

## 1. Executive Summary & Overview
**Camera Capture & Viewfinder** provides a live VisionCamera / Expo Camera feed for AI skin diagnostic photo capture with real-time face positioning guidance powered by the Phase 1–4 CNN Engine.

- **Screen Title**: Camera Capture & Viewfinder
- **Route / File Path**: `app/(customer)/scan/camera.tsx` | `src/features/scan/FaceScanScreen.tsx`
- **Domain Category**: AI Face Scan & Diagnostics
- **Target OS / Framework**: Android / iOS / Web (VisionCamera & Expo Camera)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Native Unmodified Camera Feed — NO themed overlay tint
- **Viewfinder**: True, natural native camera video feed (unaltered colors for accurate dermatological analysis)
- **Face Positioning Oval**: `Colors.onboarding.primary` (`#D4472C`) CORAL outline:
  - Thin 2.5px stroke
  - Smooth Reanimated color transition from Coral (`#D4472C`) while aligning to Emerald (`#2D9D5F`) when ready
  - Shutter button outer ring and inner dot transition to emerald green when ready
- **Bottom Control Bar**:
  - Translucent dark scrim for icon legibility over live camera feed
  - Flash toggle icon button (left)
  - Camera reverse toggle button (right)
  - Large circular Shutter CTA (center): White outer ring with Coral/Emerald center dot
- **Real-Time Guidance Engine**:
  - Driven by `useFaceGuidance` hook state machine (`no_face`, `move_closer`, `move_back`, `center_face`, `turn_to_light`, `hold_still`, `remove_sunglasses`, `too_dark`, `too_blurry`, `ready`)
  - 8-frame hysteresis buffer ($\sim 0.5\text{s}$) prevents borderline reticle flicker

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ [⚡ Flash]             [📷 Reverse] │  ← Translucent top scrim
│                                     │
│     [● MOVE CLOSER TO CAMERA]       │  ← Real-time guidance badge
│            ┌───────────┐            │
│            │  (CORAL / │            │  ← Reticle oval
│            │   EMERALD │            │     (smooth color transition)
│            │   OVAL    │            │
│            └───────────┘            │
│                                     │
│       "Ready to scan ✓"             │  ← White text + shadow
│                                     │
│               ( 🔘 )                │  ← Shutter CTA (White ring + Coral/Green dot)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Face Positioning State**:
  - Unaligned -> Coral oval (`#D4472C`) + guidance message ("Move closer", "Center face", etc.)
  - Aligned -> Emerald green solid oval (`#2D9D5F`) + "Ready to scan ✓"
- **Phase 3 Image Quality Gating**: Captures photo, runs `assessImageQuality()` (checking lighting, blur variance, pose angle, and face resolution $\ge 150\text{px}$). If valid, routes to `ImagePreviewScreen.tsx` or `ScanAnalysisScreen.tsx`; if invalid, routes to `ScanFailedScreen.tsx`.

---

## 5. Backend & Pipeline Integration
- Integrates `useFaceGuidance`, `analyzeFrame`, `faceLandmarks`, and `assessImageQuality`.
- Classical $3 \times 3$ Laplacian kernel blur variance calculation and luminance mean sampling on downscaled $120 \times 120$ worklet frame buffers.

---

## 6. Work Completed & Revision Log
- **Phase 1-4 Upgrade**: Fully updated `src/features/scan/FaceScanScreen.tsx` with Phase 1 real-time state machine, reanimated reticle color transitions, Phase 3 quality gating, and Phase 4 polygon skin segmentation support.
- **Verification**: Verified zero TypeScript errors (`npx tsc --noEmit`) and verified runtime on `http://localhost:8083/scan/camera`.
