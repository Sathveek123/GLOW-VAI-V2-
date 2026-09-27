# Screen 26: Image Preview & Confirmation

## 1. Executive Summary & Overview
**Image Preview & Confirmation** allows the user to review their captured selfie photo while running the Phase 2 MediaPipe 468-point landmark mesh pass and Phase 3 ray-casting skin polygon mask generation before submitting to the AI diagnostic pipeline.

- **Screen Title**: Scan Quality Verification & Image Preview
- **Route / File Path**: `app/(customer)/scan/preview.tsx` | `src/features/scan/ImagePreviewScreen.tsx`
- **Domain Category**: AI Face Scan & Diagnostics
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Image Frame**: Centered photo preview card (`360px` height) with rounded `24px` corners and dark container background
- **Verification Status Banners**:
  - **Pass Banner**: Emerald Green (`#E6F4EA` bg, `#137333` text) displaying `"✓ 224x224 Skin Polygon Mask & 7 Zone Masks Built"`
  - **Reject Banner**: Amber Warning (`#FEF3E2` bg, `#B45309` text) displaying specific retake reasons (no face, multiple faces, angled face)
- **Action Buttons Layout**:
  - **Retake Button**: Outlined button style, `#EDEBE6` border, `#1A1A1A` bold text
  - **Confirm Button**: `"Analyze My Skin"` — `Colors.onboarding.primary` (`#D4472C`) coral fill, disabled state when quality fails

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│      Scan Quality Verification      │
│                                     │
│          ┌──────────────┐           │
│          │              │           │  ← Centered image preview card
│          │   [Photo]    │           │     360px height
│          │              │           │
│          └──────────────┘           │
│                                     │
│ [✓ 224x224 Skin Mask & 7 Zones Built]← Emerald Pass Banner
│                                     │
│ ┌──────────────┐  ┌───────────────┐ │
│ │    Retake    │  │Analyze My Skin│ │  ← Neutral Retake + Coral Confirm CTA
│ └──────────────┘  └───────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Automatic Quality & Segmentation Pass**: On load, invokes `analyzeStillImage()` (MediaPipe 468-point landmarker & transformation matrix frontality check) followed by `buildSkinSegmentation()` ($224 \times 224$ binary skin mask & 7 sub-zone masks).
- **Retake Press**: Navigates back to `app/(customer)/scan/camera.tsx`.
- **Analyze Press**: Passes image URI and pre-computed segmentation mask state to `app/(customer)/scan/analyzing.tsx`.

---

## 5. Backend & Pipeline Integration
- Integrates `analyzeStillImage()` from `postCaptureAnalysis.ts` and `buildSkinSegmentation()` from `skinSegmentation.ts`.
- Pre-computes per-zone sub-masks (`forehead`, `left_cheek`, `right_cheek`, `nose`, `chin`, `left_under_eye`, `right_under_eye`).

---

## 6. Work Completed & Revision Log
- **Phase 2 & 3 Upgrade**: Integrated 468-point mesh quality pass, frontality matrix validation, and $224 \times 224$ binary skin mask generation into `ImagePreviewScreen.tsx`. Created explicit Expo Router path `app/(customer)/scan/preview.tsx`.
- **Verification**: Verified zero TypeScript errors (`npx tsc --noEmit`) and verified runtime rendering on `http://localhost:8083/scan/preview`.
