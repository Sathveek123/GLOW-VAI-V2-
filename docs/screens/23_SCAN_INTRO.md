# Screen 23: Scan Intro & Framing Preparation Guide

## 1. Executive Summary & Overview
**Scan Intro & Framing Preparation Guide** provides clear, 3-step preparation instructions for the user before launching the AI clinical face scan camera.

- **Screen Title**: Scan Intro & Framing Preparation Guide
- **Route / File Path**: `app/(customer)/scan/intro.tsx`
- **Domain Category**: AI Face Scan & Diagnostics
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED dark gradient & glassmorphism)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Header**: `Typography.headingLg` ("Prepare for Your AI Skin Scan") in `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **3-Step Prep Graphic**:
  - Step 1: Clean face / remove makeup (`lucide-react-native` `Sparkles` icon)
  - Step 2: Ensure natural indoor lighting (`lucide-react-native` `Sun` icon)
  - Step 3: Hold phone at eye level & center face (`lucide-react-native` `ScanFace` icon)
  - Icons sourced from `lucide-react-native` (`Sparkles` for clean-face, `Sun` for lighting, `ScanFace` for centering) — NOT custom-drawn illustrations. Matches the icon library already used in Camera/Location/Notification permission modals for visual consistency.
  - Cards: White background cards with `Colors.onboarding.border` (`#EDEBE6`) outline, line-art icons in `Colors.onboarding.primary` (`#D4472C`) coral
- **Privacy Disclaimer**: Small text block in `Colors.onboarding.textSecondary` (`#6B6B6B`), reiterating biometrics & camera privacy consent
- **Primary CTA**: `"Start Face Scan"` — `Colors.onboarding.primary` (`#D4472C`) coral fill, rounded 14px

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back                               │
│                                     │
│     Prepare for Your AI Skin Scan   │  ← Typography.headingLg
│     Follow 3 simple steps for accuracy│
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🧼 1. Clean face & remove makeup│ │  ← Coral line-art icon
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 💡 2. Find bright, even light   │ │  ← White card + border
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📱 3. Hold phone at eye level   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 🔒 Scans are encrypted & processed   │  ← Privacy text
│    for diagnostic routine matching.  │
│                                     │
│ [         Start Face Scan         ] │  ← Coral primary CTA
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Mount**: Verifies camera permission state.
- **On CTA Press**: Navigates to `app/(customer)/scan/camera.tsx` (Camera Capture).

---

## 5. Backend & Storage Integration
- Uses `Colors.onboarding.*` tokens and `Typography.*` system tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Re-themed entirely from dark blue sci-fi gradient & glassmorphic cards to Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) line-art step icons and white cards.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
