# Screen 46: Brand Store Showcase Screen

## 1. Executive Summary & Overview
**Brand Store Showcase Screen** presents official brand storefronts (e.g. Minimalist, Derma Co, Dot & Key, Cetaphil) with verified authenticity guarantees and exclusive brand bundles.

- **Screen Title**: Brand Store Showcase Screen
- **Route / File Path**: `app/(customer)/brand/[id].tsx` | `src/features/shop/BrandStoreScreen.tsx`
- **Domain Category**: Shop & Catalogue
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Brand Hero Banner**: Clean header featuring brand logo, verified brand checkmark, and tagline (e.g. *"Minimalist: Transparent, Science-Backed Skincare"*). Background card in `Colors.shop.surface` (`#FAFAFA`) with 1px border.
- **Authenticity Shield Badge**: `"✓ 100% Official Brand Partner · Direct Factory Supply"` in `Colors.status.successBg` (`#E6F4EA`) with emerald text (`#2D9D5F`)
- **Category Filter Tabs**: Horizontal tabs (`Best Sellers`, `Serums`, `Suncare`, `Moisturizers`, `Bundles`) with active Coral (`#D4472C`) underline
- **Product Tiles Grid**: 2-column white product cards featuring `OptimisticCartButton` and MRP discount pills

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back                   [ 🔍 Search]│
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │  [Brand Logo]  MINIMALIST       │ │  ← Official brand hero banner
│ │  ✓ Verified Official Partner    │ │     (#FAFAFA surface bg)
│ │  "Transparent, Science-Backed"  │ │
│ └─────────────────────────────────┘ │
│                                     │
│  [Best Sellers]  [Serums]  [Suncare]│  ← Category tabs
│  ══════════════                      │
│                                     │
│ ┌────────────────┐ ┌──────────────┐ │
│ │ [Image]        │ │ [Image]      │ │  ← 2-Column Product Grid
│ │ Niacinamide 10%│ │ Salicylic 2% │ │     (White cards + light border)
│ │ ₹599           │ │ ₹549         │ │
│ │ [ + Add Cart ] │ │ [ + Add Cart]│ │  ← OptimisticCartButton
│ └────────────────┘ └──────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Category Tab Tap**: Filters brand product grid dynamically by product family.
- **Cart Button Tap**: Triggers `OptimisticCartButton` scale animation and updates cart state.

---

## 5. Backend & Storage Integration
- Subscribes to Firestore `brands/{brandId}` and `products` where `brandId == target`
- Uses `Colors.onboarding.primary` coral and `Colors.status.success` emerald tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Upgraded from dark layout to Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) brand tab highlights and official partner badges.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
