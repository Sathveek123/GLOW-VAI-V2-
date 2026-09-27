# Screen 32: Pigmentation & Texture Topography Detail

## 1. Executive Summary & Overview
**Pigmentation & Texture Topography Detail** analyzes melanin distribution, UV spot density, and epidermal texture smoothness score.

- **Screen Title**: Pigmentation & Texture Topography Detail
- **Route / File Path**: `src/features/scan/PigmentationTextureDetailScreen.tsx`
- **Domain Category**: AI Diagnostics & Reports
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED arbitrary bronze & purple colors)
- **Background**: Pure White (`#FFFFFF`)
- **Metric Progress Scales**:
  - **Pigmentation Index**: `Colors.onboarding.primary` (`#D4472C`) coral progress scale
  - **Texture Smoothness Score**: `Colors.onboarding.primary` (`#D4472C`) coral progress scale
  - Consistent progress color language across all metric detail screens (30, 31, 32) for visual coherence
- **Topography Analysis Card**: White card with `Colors.light.border` outline, detailing Pore Visibility, Post-Inflammatory Hyperpigmentation (PIH), and Alpha-Arbutin recommendations

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back      Pigmentation & Texture  │
│                                     │
│ Pigmentation Index:                 │
│ [████████████░░░░] 68/100 (Moderate)│  ← Coral progress bar
│                                     │
│ Texture Smoothness:                 │
│ [████████████████] 82/100 (Smooth)  │  ← Coral progress bar
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ PIH Concern: Mild cheek spots   │ │  ← Topography analysis card
│ │ Targeted Active: Alpha Arbutin 2%│ │
│ └─────────────────────────────────┘ │
│                                     │
│ [   Explore Brightening Solutions ] │  ← Primary CTA fill
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On CTA Press**: Filters catalog by Alpha Arbutin / Vitamin C active ingredients.

---

## 5. Backend & Storage Integration
- Uses `Colors.onboarding.primary` coral and `Colors.light.border` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Removed arbitrary bronze & purple hues. Standardized all progress bars to `Colors.onboarding.primary` coral for cross-screen visual consistency.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
