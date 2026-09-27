# Screen 38: Express Routine Checkout

## 1. Executive Summary & Overview
**Express Routine Checkout** enables 1-click bundle purchase for recommended skincare routines with instant quick-commerce delivery.

- **Screen Title**: Express Routine Checkout
- **Route / File Path**: `src/features/recommendations/ExpressRoutineCheckoutScreen.tsx`
- **Domain Category**: Quick Commerce & Checkout
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Bundle Discount Badge**: `Colors.status.successBg` background with `Colors.status.success` (`#2D9D5F`) text (e.g. `"Yay! Routine bundle saves ₹150"` — positive green discount signal)
- **Express ETA Notice**: `Colors.shop.heroMaroon` (`#7A0C1F`) text accent — `"⚡ 15-30 min express delivery"`
- **Standard Action CTA**: `"Click to Pay ₹{amount}"` button pattern — `Colors.shop.cartGreen` (`#2D9D5F`) fill (REMOVED experimental swipe slider for tap consistency)

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back      Express Routine Checkout│
│                                     │
│  [ ⚡ 15-30 min express delivery ]  │  ← Maroon text ETA notice
│                                     │
│  [ 🎉 Routine bundle saves ₹150 ]   │  ← Green discount badge (#2D9D5F)
│                                     │
│  Bundle Items (3 Products):         │
│  • Gentle Hydrating Cleanser 100ml  │
│  • Niacinamide 10% Serum 30ml       │
│  • Sunscreen Gel SPF50 50g          │
│                                     │
│  Total Amount: ₹1,149  (MRP ₹1,299) │
│                                     │
│ [        Click to Pay ₹1,149      ] │  ← Standard Tap-to-Pay CTA (#2D9D5F)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On CTA Tap**: Launches Cashfree payment gateway session directly or processes 1-click checkout.

---

## 5. Backend & Storage Integration
- Uses `Colors.shop.heroMaroon`, `Colors.shop.cartGreen`, and `Colors.status.success` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Replaced yellow discount badges with positive green `Colors.status.successBg` badges. Replaced experimental swipe slider with standard `Click to Pay ₹{amount}` CTA in `Colors.shop.cartGreen` (`#2D9D5F`).
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
