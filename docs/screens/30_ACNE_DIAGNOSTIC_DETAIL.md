# Screen 30: Acne & Lesion Diagnostic Detail

## 1. Executive Summary & Overview
**Acne & Lesion Diagnostic Detail** breaks down acne severity class (0–3), comedones, inflammatory papules, and targeted active ingredients.

- **Screen Title**: Acne & Lesion Diagnostic Detail
- **Route / File Path**: `src/features/scan/AcneDiagnosticDetailScreen.tsx`
- **Domain Category**: AI Diagnostics & Reports
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clinical White & Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Severity Scale**: Severity levels mapped directly to `Colors.status.*` tokens (0: `Colors.status.success`, 1-2: `Colors.status.warning`, 3: `Colors.status.error`)
- **Typography Standards**: Enforces standardized `Typography.headingLg` and `Typography.bodyMd` tokens (REMOVED generic `Syne_700Bold` inline strings)
- **Lesion Breakdown Table**: White card with `Colors.light.border` outline, breaking down Inflammatory Papules, Non-Inflammatory Comedones, and Pustule counts
- **Recommended Actives**: Ingredient chips in `Colors.shop.surface` bg featuring Salicylic Acid 2% and Niacinamide 10%

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back            Acne Diagnostic   │
│                                     │
│     Grade 1: Mild Comedonal         │  ← Typography.headingLg
│     [ Status.warning Amber Badge ]  │  ← Status mapped severity
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Lesion Type        Count  Level │ │
│ │ Papules            2      Low   │ │  ← Lesion breakdown card
│ │ Comedones          8      Mild  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Recommended Actives:                │
│ [ 🌿 Salicylic Acid 2% ] [ Niacinamide ]  ← Active chips
│                                     │
│ [   Explore Formulated Products   ] │  ← Primary CTA fill
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Active Chip Tap**: Filters catalog by specific active ingredient.
- **On CTA Press**: Navigates to recommended acne routines.

---

## 5. Backend & Storage Integration
- Enforces `Typography.*` and `Colors.status.*` design tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Re-themed to Mode B Clean Light (`#FFFFFF`), replaced literal hex values with `Colors.status.*` tokens, and replaced inline `Syne_700Bold` strings with `Typography.headingLg`.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
