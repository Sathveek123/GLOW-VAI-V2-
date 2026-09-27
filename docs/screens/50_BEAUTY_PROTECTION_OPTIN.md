# Screen 50: Beauty Protection Opt-In & Warranty Screen

## 1. Executive Summary & Overview
**Beauty Protection Opt-In & Warranty Screen** provides detailed terms and toggle controls for GlowVAI's 100% money-back adverse skin reaction guarantee.

- **Screen Title**: Beauty Protection Opt-In & Warranty Screen
- **Route / File Path**: `src/features/shop/BeautyProtectionOptInScreen.tsx`
- **Domain Category**: Shop & Catalogue / Guarantee
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Hero Protection Shield Card**: `Colors.status.infoBg` (`#E8F0FE`) card with shield icon and headline `"GlowVAI Beauty Protection Cover (₹29)"`
- **3 Coverage Pillars**:
  1. 🩺 **Adverse Reaction Guarantee** — 100% refund if product causes breakouts or redness within 14 days
  2. 🔬 **Dermatologist Review** — In-app photo claim review by verified clinical team
  3. ⚡ **Instant Wallet Refund** — Money returned to GlowVAI Wallet or original UPI payment method
- **Opt-In Switch Row**: Toggle switch (`[ ON / OFF ]`) for adding ₹29 warranty fee to checkout
- **Terms Disclaimer**: Small text block linking to `BEAUTY_PROTECTION_TERMS.md`
- **Primary Action CTA**: `"Save Protection Choice"` in `Colors.onboarding.primary` (`#D4472C`) coral fill

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back            Beauty Protection │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🛡️ GlowVAI Beauty Protection    │ │  ← Info shield card (#E8F0FE)
│ │ 100% Skin Reaction Guarantee    │ │
│ └─────────────────────────────────┘ │
│                                     │
│  Coverage Highlights:               │
│  • 🩺 100% refund for skin breakouts│
│  • 🔬 In-app photo claim review    │  ← 3 Coverage pillars
│  • ⚡ Instant UPI wallet refund     │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Add Protection Cover (₹29) [🟢] │ │  ← Opt-In toggle switch
│ └─────────────────────────────────┘ │
│                                     │
│ [    Save Protection Choice       ] │  ← Primary Coral CTA (#D4472C)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Toggle Switch Tap**: Enables or disables ₹29 warranty fee in `useCartStore` cart calculation.
- **Save Choice Tap**: Returns to Cart (`Screen 49`) or Checkout Review (`Screen 52`).

---

## 5. Backend & Storage Integration
- Integrates `cartStore` and Firestore `beautyProtectionClaims` policy rules
- Uses `Colors.status.info`, `Colors.status.success`, and `Colors.onboarding.primary` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Upgraded from dark surface (`#0A0F1E`) to Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) CTA and `#E8F0FE` warranty card.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
