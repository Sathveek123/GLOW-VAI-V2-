# Screen 37: 24-Hour Patch Test Guide

## 1. Executive Summary & Overview
**24-Hour Patch Test Guide** provides step-by-step instructions for performing a patch test on inner arm/jawline before applying high-potency actives.

- **Screen Title**: 24-Hour Patch Test Guide
- **Route / File Path**: `src/features/recommendations/PatchTestGuideScreen.tsx`
- **Domain Category**: Safety & Guidance
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Paper Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Accent Color**: `Colors.primary` (`#1A73E8`) token (REMOVED arbitrary `#1A73E8` hex strings)
- **Step Instructions**:
  1. Apply pea-sized amount to inner forearm or jawline
  2. Leave undisturbed for 24 hours
  3. Monitor for redness, itching, or swelling
- **Safety Card**: White paper card with `Colors.light.border` outline and `Colors.status.info` tint badge

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back       24-Hour Patch Test     │
│                                     │
│     How to Perform a Patch Test     │  ← Typography.headingLg
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 1. Apply small dab to forearm   │ │  ← Clean Paper Card
│ │ 2. Wait 24 hours without wash   │ │
│ │ 3. Check for reaction or redness│ │
│ └─────────────────────────────────┘ │
│                                     │
│ [ ℹ️ If burning occurs, wash with ] │  ← Info safety badge
│ [    cool water immediately       ] │
│                                     │
│ [         I Understand            ] │  ← Primary CTA
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On CTA Press**: Dismisses guide modal and returns to Product Detail or Cart.

---

## 5. Backend & Storage Integration
- Uses `Colors.primary` and `Colors.light.border` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Standardized all blue references to use `Colors.primary` token and clean paper background.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
