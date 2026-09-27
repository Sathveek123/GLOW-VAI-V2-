# Screen 40: Product Catalog & Grid Screen

## 1. Executive Summary & Overview
**Product Catalog & Grid Screen** provides a clean, searchable skincare product catalog supporting concern-based filtering, quick-commerce availability tags, and optimistic cart additions.

- **Screen Title**: Product Catalog & Grid Screen
- **Route / File Path**: `app/(customer)/(tabs)/shop.tsx` | `src/features/shop/CategoriesScreen.tsx`
- **Domain Category**: Shop & Catalogue
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED dark surface `#0F172A`)
- **Background**: Pure White (`#FFFFFF`)
- **Category Selector Bar**: Horizontal scrollable chips (Serums, Cleansers, Sunscreen, Moisturizers, Spot Treatments). Active chip features `Colors.primary` (`#1A73E8`) underline and text highlight
- **Product Tiles Grid**: White cards with `Colors.light.border` (`#E2E8F0`) outline, standard product card component (reused from Home & Recommendations)
- **Beauty Protection Badge**: Small shield icon + `"Protected"` badge in `Colors.status.info` (`#1A73E8`) tint on eligible products
- **Add to Cart**: Reusable `OptimisticCartButton` component with spring scale animation, haptic feedback, and instant badge count update
- **Empty State (0 products match active filter)**: Centered illustration + `"No products found"` + `"Clear Filters"` text link.
- **Loading State**: Skeleton grid — 4 `SkeletonCard` placeholders in the same 2-column layout, pulse animation matching the app-wide skeleton pattern, shown during initial fetch and on filter-change while new results load.

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ 🔍 Search products, actives, brands │  ← Search input
│                                     │
│  [All]  [Serums]  [Sunscreen]  [AHA]│  ← Horizontal category selector
│  ═════                               │     (Active: Colors.primary underline)
│                                     │
│ ┌────────────────┐ ┌──────────────┐ │
│ │ [Image]        │ │ [Image]      │ │  ← 2-Column Product Grid
│ │ Niacinamide 10%│ │ Vitamin C 15%│ │     (White cards + light border)
│ │ ₹599  (₹699)   │ │ ₹699  (₹799) │ │
│ │ 🛡️ Protected   │ │ 🛡️ Protected │ │  ← Beauty Protection badge
│ │ [ + Add Cart ] │ │ [ + Add Cart]│ │  ← OptimisticCartButton
│ └────────────────┘ └──────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Category Chip Tap**: Filters product list by selected skincare category or active ingredient.
- **Cart Button Tap**: Triggers `OptimisticCartButton` haptic feedback, increments local cart count instantly, and persists item to storage.

---

## 5. Backend & Storage Integration
- Connects to `catalogService.ts` / Firestore `products` collection
- Uses `Colors.shop.*`, `Colors.primary`, and `OptimisticCartButton` component

---

## 6. Work Completed & Revision Log
- **Codebase Creation**: Created `src/features/shop/CategoriesScreen.tsx` in Mode B Clean Light (`#FFFFFF`) with 2-column white product cards, concern filter chips, and `OptimisticCartButton`.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
