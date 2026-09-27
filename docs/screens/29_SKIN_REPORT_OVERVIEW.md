# Screen 29: Diagnostic Skin Report Overview

## 1. Executive Summary & Overview
**Diagnostic Skin Report Overview** presents the overall AI skin health score, barrier health rating, primary skin type, and medical compliance disclaimers.

- **Screen Title**: Diagnostic Skin Report Overview
- **Route / File Path**: `app/(customer)/scan/report.tsx` | `src/features/scan/SkinReportScreen.tsx`
- **Domain Category**: AI Diagnostics & Reports
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED cyan score dial & dark surfaces)
- **Background**: Pure White (`#FFFFFF`)
- **Score Dial**: Large circular gauge featuring `Colors.onboarding.primary` (`#D4472C`) coral to `Colors.status.success` (`#2D9D5F`) green gradient stroke depending on score range (e.g. `"84/100 Optimal Health"`)
- **Skin Type Badge**: Pill shape in `Colors.shop.surface` (`#FAFAFA`) background with coral text (e.g. `"Combination / Sensitive Skin"`)
- **Metric Breakdown Cards**: White cards with `Colors.light.border` (`#E2E8F0`) outline, showing progress bars for Hydration, Sebum, Acne, Texture, and Pigmentation
- **Required Compliance Cards**:
  - **Prototype Simulation Mode**: `Colors.status.warningBg` tinted card highlighting model simulation status
  - **Cosmetic Routine Guidance**: `Colors.status.infoBg` tinted card reiterating non-medical cosmetic disclaimer
- **Primary CTA**: `"View My Routine"` — `Colors.onboarding.primary` (`#D4472C`) coral fill, rounded 14px

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back              Share Report    │
│                                     │
│               ( 84 )                │  ← 84/100 Circular Dial
│        [Coral -> Green Stroke]      │     (Optimal Health)
│                                     │
│  [ Pill: Combination / Sensitive ]  │  ← Skin Type pill
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 💧 Hydration: 72% (Good)        │ │  ← Metric breakdown cards
│ │ 🧪 Sebum Balance: Balanced      │ │
│ │ 🔬 Texture: Smooth              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [ ⚠️ PROTOTYPE SIMULATION MODE    ] │  ← Warning compliance callout
│ [ ℹ️ COSMETIC ROUTINE GUIDANCE    ] │  ← Info compliance callout
│                                     │
│ [          View My Routine        ] │  ← Coral Primary CTA
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Metric Card Tap**: Navigates to specific metric detail screen (`Screen 30`, `Screen 31`, or `Screen 32`).
- **On CTA Press**: Navigates to `app/(customer)/recommendations/index.tsx` (Recommendations).

---

## 5. Backend & Storage Integration
- Reads diagnostic report payload from local state or Firestore `scans` collection
- Uses `Colors.onboarding.*`, `Colors.status.*`, and `Typography.*` tokens

---

## 6. Work Completed & Revision Log
- **Codebase Upgrade**: Updated `src/features/scan/SkinReportScreen.tsx` to Mode B Clean Light (`#FFFFFF`) with Coral score gauge, compliance banners, and Coral CTA.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
