# Screen 41: Instant Search & Advanced Filter Screen

## 1. Executive Summary & Overview
**Instant Search & Advanced Filter Screen** provides real-time SKU search, auto-complete, active ingredient filtering, skin concern matching, and price range sliders for the GlowVAI V2 catalog.

- **Screen Title**: Instant Search & Advanced Filter Screen
- **Route / File Path**: `app/(customer)/shop/search.tsx` | `src/features/shop/SearchAndFiltersScreen.tsx`
- **Domain Category**: Shop & Catalogue
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Search Header Bar**: Fixed top search bar with `Colors.onboarding.surfaceSubtle` (`#FAF9F6`) background, 1px `Colors.onboarding.border` (`#EDEBE6`) outline, real-time debounced query input, and clear icon button (`Ionicons` `close-circle`)
- **Recent Searches Section**: Horizontal tag chips of past query history (`"Niacinamide"`, `"Sunscreen SPF50"`, `"Salicylic Acid"`) with tap-to-search action
- **Filter Categories Accordion**:
  1. **Skin Concern**: Acne, Hydration, Brightening, Barrier Repair, Fine Lines
  2. **Active Ingredients**: Salicylic Acid, Niacinamide, Retinol, Vitamin C, Hyaluronic Acid, AHA/BHA
  3. **Product Type**: Serums, Cleansers, Moisturizers, Suncare, Toners, Spot Treatments
  4. **Delivery Speed**: ⚡ 15-30 min Quick Commerce vs 🚚 3-7 Days Pan-India
  5. **Price Range**: Dual-thumb range slider (₹199 – ₹2,499)
- **Active Filter Chips Bar**: Scrollable list of active filter pills with solid Coral (`#D4472C`) border and remove 'x' icons
- **Action Footer**: Fixed bottom bar with `"Clear All"` secondary link and `"Apply Filters ({count} Items)"` primary CTA in `Colors.onboarding.primary` (`#D4472C`) coral fill

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← [ 🔍 Search products, actives...  ]│  ← Search header + clear CTA
├─────────────────────────────────────┤
│ Recent Searches:                    │
│ [ Niacinamide ✕ ]  [ Sunscreen ✕ ]  │  ← Query history chips
│                                     │
│ Filter By Skin Concern:             │
│ ┌──────────────┐ ┌────────────────┐ │
│ │ 🔴 Acne       │ │ 💧 Hydration   │ │  ← Multi-select concern chips
│ └──────────────┘ └────────────────┘ │
│                                     │
│ Active Ingredients:                 │
│ ☑ Salicylic Acid   ☐ Vitamin C      │  ← Ingredient checkboxes
│ ☑ Niacinamide      ☐ Retinol        │
│                                     │
│ Delivery Option:                    │
│ (●) ⚡ 15-30 Min Quick Commerce      │  ← Delivery tier radio
│ ( ) 🚚 Pan-India Standard           │
│                                     │
├─────────────────────────────────────┤
│ [ Clear All ] [ Apply Filters (12) ]│  ← Action footer + Coral CTA
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Debounced Search Input**: 300ms debounce timer before executing query against catalog index.
- **Filter Selection**: Instantly recalculates matching item count in the Apply button without triggering network re-fetches.
- **Clear All Tap**: Resets all concern, ingredient, and price filters to default empty state.
- **Apply Filters Tap**: Navigates back to Product Catalog (`Screen 40`) with active query params.

---

## 5. Backend & Storage Integration
- Queries Firestore `products` collection with composite filters (`category`, `activeIngredients`, `concernIds`)
- Integrates `catalogService.ts` search indexing
- Uses `Colors.onboarding.primary` (`#D4472C`) and `Colors.onboarding.border` design tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Re-themed from dark overlay (`#0A0F1E`) and cyan `#00C2FF` glows to Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) active filter chips and clear filter buttons.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
