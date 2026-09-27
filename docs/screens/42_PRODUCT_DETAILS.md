# Screen 42: Product Details & Specifications Screen

## 1. Executive Summary & Overview
**Product Details & Specifications Screen** provides high-resolution product imagery, active ingredient concentrations, dermatological suitability badges, how-to-use instructions, and 1-tap cart additions.

- **Screen Title**: Product Details & Specifications Screen
- **Route / File Path**: `app/(customer)/product/[id].tsx` | `src/features/shop/ProductDetailsScreen.tsx`
- **Domain Category**: Shop & Catalogue
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Image Gallery Carousel**: 400px height swipeable image viewer with bottom pagination dots (active dot in Coral `#D4472C`)
- **Brand & Title Header**: Brand name in Coral (`Colors.onboarding.primary` `#D4472C`), product name in `Typography.headingLg` (`Colors.onboarding.textPrimary` `#1A1A1A`)
- **Pricing & Discount Pill**: Current selling price (`Typography.priceLg`), original MRP with strikethrough, and emerald green discount percentage pill (`"20% OFF"` in `Colors.status.successBg`)
- **Beauty Protection Guarantee Badge**: Informational card (`Colors.status.infoBg` `#E8F0FE`) with shield icon: `"🛡️ Covered by Beauty Protection — 100% refund for adverse skin reactions"`
- **Suitable Skin Types Row**: Chip badges for compatible skin profiles (`Oily`, `Combination`, `Sensitive`)
- **How-To-Use & Actives Accordion**: Expandable collapsible sections for Application Order, Frequency (AM/PM), pH Level (5.5), and Key Actives
- **Sticky Bottom Action Bar**: Fixed bottom white bar featuring price total and `OptimisticCartButton` in `Colors.shop.cartGreen` (`#2D9D5F`) fill

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back                     [ 🛍️ Cart]│  ← Header bar
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │   [ Product Image Gallery ]     │ │  ← High-res image carousel
│ └─────────────────────────────────┘ │
│                ● ○ ○                │  ← Page dots
│                                     │
│  MINIMALIST                         │  ← Brand in Coral (#D4472C)
│  Niacinamide 10% Face Serum 30ml    │  ← Title (Typography.headingLg)
│                                     │
│  ₹599  ~~₹699~~  [ 14% OFF ]        │  ← Price + Discount pill
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🛡️ Beauty Protection Covered    │ │  ← Warranty badge (#E8F0FE)
│ └─────────────────────────────────┘ │
│                                     │
│  Suitable For:                      │
│  [ Oily Skin ]  [ Combination ]     │  ← Skin type chips
│                                     │
│  ▼ How to Apply (AM/PM Split)       │  ← Accordion section
│  ▼ Active Ingredient Percentage     │
│                                     │
├─────────────────────────────────────┤
│ ₹599  [ + Add to Cart ]             │  ← Sticky footer (CartGreen)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Image Gallery Swipe**: Horizontal paging through product photos with smooth scroll indicators.
- **Accordion Tap**: Toggles expansion of application guide and formulation pH details.
- **Cart Button Tap**: Triggers `OptimisticCartButton` scale animation, updates local cart state, and persists item to storage.
- **Share Icon Tap**: Triggers native device share sheet with product URL.

---

## 5. Backend & Storage Integration
- Subscribes to Firestore `products/{productId}` document
- Integrates `cartStore` and `useCartStore`
- Uses `Colors.onboarding.primary` coral, `Colors.status.success` emerald, and `Colors.shop.cartGreen`

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Upgraded from dark surface (`#0F172A`) and cyan `#00F2FE` accents to Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) brand header, emerald discount pills, and `OptimisticCartButton`.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
