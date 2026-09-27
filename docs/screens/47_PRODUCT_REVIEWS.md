# Screen 47: Customer Product Reviews & Ratings Screen

## 1. Executive Summary & Overview
**Customer Product Reviews & Ratings Screen** presents verified customer reviews, skin-type specific ratings, photo attachments, and clinical reaction feedback for products.

- **Screen Title**: Customer Product Reviews & Ratings Screen
- **Route / File Path**: `app/(customer)/product/[id]/reviews.tsx` | `src/features/shop/ProductReviewsScreen.tsx`
- **Domain Category**: Shop & Catalogue / Social Proof
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Rating Summary Header**: Large rating number (`4.8 / 5.0`), 5-star visual bar, and rating breakdown histogram (5★, 4★, 3★, 2★, 1★) with Coral (`#D4472C`) progress bars
- **Skin-Type Filter Chips**: Filter reviews by reviewer skin profile (`Filter by My Skin Type: Oily`, `Acne-Prone`, `Combination`, `Verified Buyers Only`)
- **Review Cards List**: White cards with 1px `Colors.onboarding.border` (`#EDEBE6`) outline:
  - Reviewer name, verified buyer checkmark, reviewer skin type tag (`"Combination Skin · 24-34"`)
  - Star rating & review date
  - Review title & body text
  - Customer photo attachments thumbnail carousel
  - Helpful count upvote button (`"👍 Helpful (14)"`)
- **Write Review Primary CTA**: `"Write a Review"` button in `Colors.onboarding.primary` (`#D4472C`) coral fill

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back         Reviews & Ratings (84)│
├─────────────────────────────────────┤
│  4.8 ★★★★★                         │  ← Rating score summary
│  5★ ████████████ 82%                │     (Coral progress bars)
│  4★ ███ 12%                         │
│                                     │
│  Filter Reviews:                    │
│  [✓ Verified Buyers]  [Oily Skin]   │  ← Skin type filter chips
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Ananya R.  ✓ Verified Buyer     │ │  ← Review card
│ │ 🏷️ Combination Skin · 18-24     │ │     (#FFFFFF bg + light border)
│ │ ★★★★★  "Saved my moisture barrier"│ │
│ │ [ Photo 1 ]  [ Photo 2 ]        │ │  ← Customer photo gallery
│ │ 👍 Helpful (14)                 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ [            Write a Review       ] │  ← Primary CTA (#D4472C)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Skin Type Filter Tap**: Filters review list to display feedback matching user's specific skin profile.
- **Upvote Button Tap**: Increments review helpful count optimistically in local state.
- **Write Review Tap**: Opens review submission form modal with star rating and photo picker.

---

## 5. Backend & Storage Integration
- Subscribes to Firestore `products/{productId}/reviews` subcollection
- Uses `Colors.onboarding.primary` coral and `Colors.onboarding.border` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Upgraded from dark surface (`#0A0F1E`) to Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) rating bars and verified buyer badges.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
