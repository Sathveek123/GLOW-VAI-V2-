# Screen 43: Ingredient Transparency & Formulation Audit Screen

## 1. Executive Summary & Overview
**Ingredient Transparency & Formulation Audit Screen** provides clinical breakdown of full INCI ingredient lists, active concentration percentages, and comedogenic rating scores for products.

- **Screen Title**: Ingredient Transparency & Formulation Audit Screen
- **Route / File Path**: `app/(customer)/product/[id]/ingredients.tsx` | `src/features/shop/IngredientsTransparencyScreen.tsx`
- **Domain Category**: Shop & Catalogue / Safety
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Safety Rating Card**: Top summary box showing `"Formulation Safety Score: 96/100 (Non-Comedogenic, Fragrance-Free)"` in `Colors.status.successBg` (`#E6F4EA`) with emerald green text (`#2D9D5F`)
- **pH & Concentration Meter**: Horizontal pH scale (pH 5.2 - 5.5) with pin marker, and active concentration gauge (10% Niacinamide) in Coral (`#D4472C`) fill
- **INCI Ingredient Table**: Clean 2-column table listing chemical name, functional purpose (e.g. *Humectant*, *Exfoliant*, *Emollient*), and safety classification:
  - 🟢 Safe / Bio-compatible: `Colors.status.success` (`#2D9D5F`) dot
  - 🟡 Moderate Active / Sensitivity Warning: `Colors.status.warning` (`#F59E0B`) dot
  - 🔴 Contraindicated for Damaged Barrier: `Colors.status.error` (`#EF4444`) dot
- **Comedogenic Rating Scale**: 0-5 scale bar (0 = Won't clog pores)

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back         Ingredient Audit     │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🟢 Safety Rating: 96/100        │ │  ← Green rating banner (#E6F4EA)
│ │ Non-Comedogenic · Fragrance-Free│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Formulation pH:                     │
│ [ 3.5 ─── (5.5) ─── 7.0 ]           │  ← pH scale + marker pin
│                                     │
│ Full INCI Ingredient Breakdown:     │
│ 🟢 Niacinamide 10%  (Skin Restoring)│
│ 🟢 Hyaluronic Acid  (Humectant)     │  ← 2-column ingredient list
│ 🟡 Salicylic Acid   (BHA Exfoliant) │     with status color indicators
│ 🟢 Zinc PCA 1%      (Sebum Control) │
│                                     │
│ Comedogenic Rating: [ 0 / 5 ]       │  ← Pore clogging scale bar
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Ingredient Row Tap**: Expands clinical description explaining chemical function and dermatological benefits.
- **Safety Legend Tap**: Displays tooltips explaining INCI classifications.

---

## 5. Backend & Storage Integration
- Subscribes to Firestore `products/{productId}` INCI formulation data
- Uses `Colors.status.success`, `Colors.status.warning`, `Colors.status.error`, and `Colors.onboarding.primary` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Replaced dark background (`#0A0F1E`) with Mode B Clean Light (`#FFFFFF`), Coral (`#D4472C`) active concentration bars, and semantic green/amber status indicators.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
