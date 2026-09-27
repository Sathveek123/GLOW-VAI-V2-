# Screen 44: Quick-Commerce Dark Store Hub Screen

## 1. Executive Summary & Overview
**Quick-Commerce Dark Store Hub Screen** displays real-time inventory from the nearest Vijayawada dark store with instant 15-45 minute dispatch status.

- **Screen Title**: Quick-Commerce Dark Store Hub Screen
- **Route / File Path**: `app/(customer)/shop/express-store.tsx` | `src/features/shop/ExpressStoreScreen.tsx`
- **Domain Category**: Shop & Catalogue / Quick Commerce
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Dark Store Banner**: `Colors.shop.surface` (`#FAFAFA`) card with 1px `Colors.onboarding.border` outline:
  - `"⚡ Payikapuram Dark Store #04"`
  - `"15-30 min express delivery available"` in `Colors.status.success` (`#2D9D5F`)
  - Distance: `"1.4 km away · 8 min prep time"`
- **Flash Sale & Express Category Chips**: Horizontal filter pills (`⚡ In Stock Now`, `💧 Hydration Hydrators`, `☀️ Sunscreen Packs`) with active Coral (`#D4472C`) underline
- **Express SKU Tiles Grid**: 2-column white product cards featuring `"In Stock at Dark Store"` green badges and `OptimisticCartButton` for instant add-to-cart
- **Dispatcher Status Pill**: Floating info bar displaying dark store operational hours (`07:00 AM - 11:30 PM`)

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back       ⚡ 15-Min Express Store │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🏪 Payikapuram Dark Store #04   │ │  ← Dark store info card
│ │ 🟢 15-30 min delivery active    │ │     (#FAFAFA bg + green status)
│ │ 📍 1.4 km away · 8 min prep     │ │
│ └─────────────────────────────────┘ │
│                                     │
│  [⚡ In Stock]  [💧 Serums]  [☀️ SPF]│  ← Category filter chips
│  ════════════                        │
│                                     │
│ ┌────────────────┐ ┌──────────────┐ │
│ │ [Image]        │ │ [Image]      │ │  ← Express product tiles
│ │ Niacinamide 10%│ │ Vitamin C 15%│ │     (2-column layout)
│ │ ⚡ 15-Min Drop │ │ ⚡ 15-Min Drop│ │
│ │ [ + Add Cart ] │ │ [ + Add Cart]│ │  ← OptimisticCartButton
│ └────────────────┘ └──────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Category Filter Tap**: Filters dark store product grid by immediate inventory availability.
- **Cart Button Tap**: Triggers `OptimisticCartButton` scale feedback and updates local cart store.

---

## 5. Backend & Storage Integration
- Queries Firestore `deliveryZones` and `darkStores/{storeId}/inventory`
- Uses `Colors.shop.surface`, `Colors.status.success`, and `Colors.onboarding.primary` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Upgraded from dark layout to Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) category chips and emerald green 15-min delivery badges.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
