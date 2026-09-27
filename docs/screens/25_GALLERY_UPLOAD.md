# Screen 25: Gallery Upload Alternative

## 1. Executive Summary & Overview
**Gallery Upload Alternative** allows users to select an existing selfie photo from their device photo library for AI skin diagnostic analysis.

- **Screen Title**: Gallery Upload Alternative
- **Route / File Path**: `src/features/scan/GalleryUploadScreen.tsx`
- **Domain Category**: AI Face Scan & Diagnostics
- **Target OS / Framework**: Android / iOS / Web (Expo ImagePicker)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Photo Grid**: Standard native photo gallery grid with 3-column layout
- **Selection State**: Selected image tile highlights with `Colors.onboarding.primary` (`#D4472C`) coral border + checkmark badge
- **Quality Warning Banner**: Displayed only if selected image resolution is below threshold (tinted `Colors.status.warningBg` card with warning icon)
- **Primary CTA**: `"Use Selected Photo"` — `Colors.onboarding.primary` (`#D4472C`) coral fill, rounded 14px

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back              Select Photo    │
│                                     │
│ ┌───────┐ ┌───────┐ ┌───────┐       │
│ │Img 1  │ │Img 2✓ │ │Img 3  │       │  ← 3-Column Gallery Grid
│ └───────┘ └───────┘ └───────┘       │     (Img 2 selected with Coral border)
│ ┌───────┐ ┌───────┐ ┌───────┐       │
│ │Img 4  │ │Img 5  │ │Img 6  │       │
│ └───────┘ └───────┘ └───────┘       │
│                                     │
│ [⚠️ Image is slightly dim. Bright]  │  ← Warning card (conditional)
│ [   photos provide best scan results]│
│                                     │
│ [        Use Selected Photo       ] │  ← Coral Primary CTA
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Image Selection**: Highlights selected tile with coral border.
- **On CTA Press**: Passes selected image URI to `src/features/scan/ImagePreviewScreen.tsx`.

---

## 5. Backend & Storage Integration
- Uses `expo-image-picker` and `Colors.onboarding.*` design tokens

---

## 6. Work Completed & Revision Log
- **Codebase Creation**: Created `src/features/scan/GalleryUploadScreen.tsx` in Mode B Clean Light (`#FFFFFF`) with 3-column photo grid and Coral (`#D4472C`) selection borders.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
