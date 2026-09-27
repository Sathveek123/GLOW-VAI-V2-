# Screen 33: Diagnostic Product Recommendations

## 1. Executive Summary & Overview
**Diagnostic Product Recommendations** presents a personalized skincare routine matched directly to the user's AI diagnostic report.

- **Screen Title**: Diagnostic Product Recommendations
- **Route / File Path**: `app/(customer)/recommendations/index.tsx`
- **Domain Category**: Recommendations & Commerce
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED dark `#060D1E` & cyan)
- **Background**: Pure White (`#FFFFFF`)
- **Diagnostic Summary Banner**: `Colors.shop.surface` (`#FAFAFA`) card, `"Based on your scan: Combination skin, 84/100 Optimal"`
- **Product Carousel**: Standard `ProductCard` components (same component as Home & Catalog)
- **Active Ingredients Chips**: Small pill chips in `Colors.shop.surface` background
- **Primary CTA**: `"Add Entire Routine to Cart"` — `Colors.shop.cartGreen` (`#2D9D5F`) fill, matching the cart-action green used throughout checkout

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back      Personalized Routine    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🔬 Based on your scan:          │ │  ← Surface diagnostic summary banner
│ │ Combination Skin · 84/100 Health│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Recommended Products:               │
│ [Product 1]   [Product 2]   [Prod 3]│  ← Standard ProductCard carousel
│                                     │
│ Actives Used:                       │
│ [ Niacinamide ] [ Salicylic Acid ]  │  ← Active ingredient pills
│                                     │
│ [   Add Entire Routine to Cart    ] │  ← Emerald Green Cart CTA (#2D9D5F)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Add Entire Routine Press**: Adds all routine items to cart state with haptic feedback and navigates to `app/(customer)/(tabs)/cart.tsx`.

---

## 5. Backend & Storage Integration
- Uses `Colors.shop.*` and `Colors.shop.cartGreen` design tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Re-themed from dark navy `#060D1E` to Mode B Clean Light (`#FFFFFF`). Updated CTA button to `Colors.shop.cartGreen` (`#2D9D5F`) fill for checkout consistency.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
