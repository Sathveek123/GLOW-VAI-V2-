# Screen 31: Hydration & Sebum Metric Detail

## 1. Executive Summary & Overview
**Hydration & Sebum Metric Detail** provides deep analysis of cellular hydration % and T-zone lipid balance with formulation recommendations.

- **Screen Title**: Hydration & Sebum Metric Detail
- **Route / File Path**: `src/features/scan/HydrationSebumDetailScreen.tsx`
- **Domain Category**: AI Diagnostics & Reports
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED cyan/gold arbitrary colors)
- **Background**: Pure White (`#FFFFFF`)
- **Radial Metric Gauges**:
  - **Hydration Gauge**: `Colors.onboarding.primary` (`#D4472C`) coral fill (e.g. `72% Optimal Hydration`)
  - **Sebum / Oil Metric Gauge**: `Colors.status.warning` (`#F59E0B`) gold-amber ONLY for lipid/oil indicator (semantic use for shine/sebum)
- **Recommended Formulations**: Standard product card components reused from catalog (Hyaluronic Acid, Ceramides, Gel Moisturizer)

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back         Hydration & Sebum    │
│                                     │
│     ( 72% )             ( 45% )     │  ← Dual Gauges:
│   [Coral Fill]        [Amber Fill]  │     Hydration (Coral) + Sebum (Amber)
│    Hydration          Sebum/Oil     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Skin Barrier Health: Intact     │ │  ← Status card
│ │ Recommended: Gel-cream texture  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Recommended Formulations:           │
│ [Product Card 1]  [Product Card 2]  │  ← Standard ProductCard components
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Product Tap**: Opens `app/(customer)/product/[id].tsx`.

---

## 5. Backend & Storage Integration
- Uses `Colors.onboarding.primary` coral and `Colors.status.warning` amber tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Removed arbitrary cyan & gold colors. Set Hydration gauge to `Colors.onboarding.primary` coral and Sebum gauge to semantic `Colors.status.warning` amber for oiliness.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
