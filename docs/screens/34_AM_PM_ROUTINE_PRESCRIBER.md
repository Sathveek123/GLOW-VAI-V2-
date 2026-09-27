# Screen 34: AM/PM Routine Prescriber

## 1. Executive Summary & Overview
**AM/PM Routine Prescriber** displays the step-by-step Morning (AM) and Evening (PM) routine breakdown for optimal active ingredient absorption.

- **Screen Title**: AM/PM Routine Prescriber
- **Route / File Path**: `src/features/recommendations/RoutinePrescriberScreen.tsx`
- **Domain Category**: Recommendations & Routine
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED indigo `#6366F1`)
- **Background**: Pure White (`#FFFFFF`)
- **Tab Toggle**: AM / PM segment control:
  - Active Tab: Coral underline & fill (`Colors.onboarding.primary`)
  - Inactive Tab: `Colors.onboarding.textSecondary` (`#6B6B6B`) dark neutral
  - Sun (☀️) / Moon (🌙) icons communicate AM/PM distinction cleanly
- **Step Timeline**: Numbered step cards (1. Cleanser, 2. Serum, 3. Moisturizer, 4. Sunscreen), white background with coral step-number badges

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back         AM / PM Routine      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │  [ ☀️ AM Routine ]  [ 🌙 PM ]   │ │  ← Coral active tab / neutral inactive
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [1] Gentle Hydrating Cleanser   │ │  ← Step 1 Card (Coral badge)
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [2] Niacinamide 10% Serum       │ │  ← Step 2 Card
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [3] Ultra Light Sunscreen SPF50 │ │  ← Step 3 Card
│ └─────────────────────────────────┘ │
│                                     │
│ [    Save Routine & Add to Cart   ] │  ← Primary CTA fill
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Tab Switch**: Toggles between Morning and Evening active steps.

---

## 5. Backend & Storage Integration
- Uses `Colors.onboarding.primary` coral and `Colors.onboarding.textSecondary` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Removed indigo `#6366F1` color. Standardized AM/PM tabs to use `Colors.onboarding.primary` coral for active state and `Colors.onboarding.textSecondary` dark neutral for inactive state.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
