# Screen 35: Ingredient Contraindication & Safety Audit

## 1. Executive Summary & Overview
**Ingredient Contraindication & Safety Audit** checks active ingredient compatibility (e.g. Retinol + AHA/BHA conflicts) to prevent skin barrier damage.

- **Screen Title**: Ingredient Contraindication & Safety Audit
- **Route / File Path**: `src/features/recommendations/IngredientAuditScreen.tsx`
- **Domain Category**: Recommendations & Safety
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Compatibility Badges**:
  - Safe Pairings: `Colors.status.success` (`#2D9D5F`) background & text
  - Layering Warnings: `Colors.status.warning` (`#F59E0B`) background & text
  - Direct Contraindications: `Colors.status.error` (`#EF4444`) background & text
- **pH Level Indicator**: Horizontal gradient bar, pH 3.5 (left, `Colors.status.warning` amber tint) through pH 5.5-6.0 (center-right, `Colors.status.success` green tint) representing the skin-compatible range — a small marker/pin shows the audited product's actual pH value positioned along this gradient. Not a plain neutral bar.

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back      Ingredient Safety Audit │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🟢 Niacinamide + Hyaluronic     │ │  ← Safe pairing (Colors.status.success)
│ │ Compatible — Apply together     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🟡 Retinol + Salicylic Acid     │ │  ← Warning pairing (Colors.status.warning)
│ │ Separate: Use AM/PM split       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Formulation pH Audit:               │
│ [ 3.5 ─── 4.5 ─── 5.5 ─── 6.5 ]     │  ← pH scale bar
│                                     │
│ [      Apply Safe Layering Rules  ] │  ← Primary CTA fill
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Pair Tap**: Expands clinical research notes explaining chemical interaction.

---

## 5. Backend & Storage Integration
- Uses `Colors.status.*` design tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Confirmed `Colors.status.success`, `Colors.status.warning`, and `Colors.status.error` token mapping across all ingredient pairing badges.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
