# Screen 28: Scan Failed & Guidance State

## 1. Executive Summary & Overview
**Scan Failed & Guidance State** handles image quality error conditions (e.g. low light, uncentered face, blur) using the reusable `ErrorState` component pattern.

- **Screen Title**: Scan Failed & Guidance State
- **Route / File Path**: `app/(customer)/scan/failed.tsx` | `src/features/scan/ScanFailedScreen.tsx`
- **Domain Category**: AI Face Scan & Diagnostics
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Component Pattern**: Reusable `ErrorState` layout (same structure as Screen 16) with scan-specific guidance variants:
  - `no-face-detected`: `"We couldn't detect a face. Try better lighting."`
  - `poor-lighting`: `"Lighting is too low. Move somewhere brighter."`
  - `face-too-far`: `"Move closer to the camera."`
  - `face-too-close`: `"Step back slightly so your full face fits."`
- **Icon Treatment**: `Colors.status.warning` (`#F59E0B`) tone warning badge (NOT alarming red; these are guidance states)
- **Primary CTA**: `"Try Again"` — `Colors.onboarding.primary` (`#D4472C`) coral fill, returning directly to Camera Capture

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│                                     │
│               [ ⚠️ ]                │  ← Amber warning tone badge
│                                     │
│      Lighting Is Too Low           │  ← Typography.headingLg
│                                     │
│  We couldn't detect clear details.  │
│  Please move to a brightly lit room │  ← Guidance text
│  and face the light directly.       │
│                                     │
│ [            Try Again            ] │  ← Coral Primary CTA
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On CTA Press**: Clears previous image payload and redirects to `app/(customer)/scan/camera.tsx`.

---

## 5. Backend & Storage Integration
- Reuses `ErrorState` component
- Uses `Colors.status.warning` and `Colors.onboarding.primary` design tokens

---

## 6. Work Completed & Revision Log
- **Codebase Creation**: Created `src/features/scan/ScanFailedScreen.tsx` in Mode B Clean Light (`#FFFFFF`) using reusable `ErrorState` pattern with amber warning guidance icons.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
