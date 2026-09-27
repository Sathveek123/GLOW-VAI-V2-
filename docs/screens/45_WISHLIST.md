# Screen 45: Wishlist & Saved Products Screen

## 1. Executive Summary & Overview
**Wishlist & Saved Products Screen** manages saved skincare items, routine favorites, and price-drop notifications for the user.

- **Screen Title**: Wishlist & Saved Products Screen
- **Route / File Path**: `app/(customer)/wishlist.tsx` | `src/features/shop/WishlistScreen.tsx`
- **Domain Category**: Shop & Catalogue
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Wishlist Cards**: White horizontal cards with 1px `Colors.onboarding.border` (`#EDEBE6`) outline:
  - Product Thumbnail image
  - Brand name in Coral (`#D4472C`)
  - Product title & volume
  - Price & discount MRP badge
  - Trash icon button to remove from wishlist
  - `OptimisticCartButton` for instant move-to-cart
- **Price Drop Notification Badge**: Small alert pill (`Colors.status.infoBg` `#E8F0FE`): `"📉 Price dropped by ₹100 since saved"`
- **Empty State**: Centered illustration + `"Your Wishlist is Empty"` + `"Browse Skincare Catalog"` primary CTA button in Coral fill (`#D4472C`)

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back              My Wishlist (4) │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ [Image]  Minimalist Niacinamide │ │  ← Wishlist item card
│ │          ₹599  ~~₹699~~         │ │
│ │ 📉 Price dropped by ₹100        │ │  ← Price drop alert pill
│ │ [ 🗑️ Remove ]  [ + Add to Cart ]│ │  ← Delete + Cart CTAs
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [Image]  Dot & Key Sunscreen    │ │
│ │          ₹499                   │ │
│ │ [ 🗑️ Remove ]  [ + Add to Cart ]│ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ [      Move All Items to Cart     ] │  ← Primary bulk CTA (#2D9D5F)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Remove Tap**: Optimistically removes item from wishlist with haptic feedback.
- **Add to Cart Tap**: Moves item from wishlist to active cart session.
- **Move All Tap**: Adds all saved wishlist items to cart in a single batch.

---

## 5. Backend & Storage Integration
- Subscribes to Firestore `users/{uid}/wishlist` collection
- Uses `Colors.onboarding.primary` coral, `Colors.status.info` blue, and `Colors.shop.cartGreen`

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Upgraded from dark surface (`#0A0F1E`) to Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) brand titles and `OptimisticCartButton`.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
