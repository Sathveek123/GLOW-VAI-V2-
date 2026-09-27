# Screen 49: Cart & Checkout Summary Screen

## 1. Executive Summary & Overview
**Cart & Checkout Summary Screen** displays active shopping cart items, quick-commerce delivery fee breakdown, student discount vouchers, and total payable amount.

- **Screen Title**: Cart & Checkout Summary Screen
- **Route / File Path**: `app/(customer)/(tabs)/cart.tsx` | `src/features/shop/CartScreen.tsx`
- **Domain Category**: Quick Commerce & Cart
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Delivery Store Banner**: `Colors.shop.surface` (`#FAFAFA`) card displaying matched Vijayawada dark store (`"⚡ Delivering from Payikapuram Dark Store · 15-30 mins"`) in `Colors.status.success` (`#2D9D5F`)
- **Cart Item Cards List**: White cards with 1px `Colors.onboarding.border` (`#EDEBE6`) outline:
  - Product thumbnail, brand, title, size
  - Price & original MRP
  - Stepper quantity controls (`[ - ]  2  [ + ]`) with haptic feedback
  - Trash icon to delete item
- **Coupons & Coin Redemption Card**: Voucher code input bar + `"Use Referral Coins (₹50 Available)"` toggle switch
- **Bill Breakdown Card**:
  - Item Total (MRP): ₹1,299
  - Product Discount: -₹150
  - Delivery Fee: Free (Above ₹499)
  - Beauty Protection Warranty: ₹29
  - **To Pay Amount**: ₹1,178
- **Sticky Bottom Action Footer**: Fixed white bar with total price and `"Proceed to Checkout"` primary CTA in `Colors.shop.cartGreen` (`#2D9D5F`) fill

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Cart                   My Cart (2)│
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ ⚡ Payikapuram Dark Store       │ │  ← Dark store delivery banner
│ │ 🟢 15-30 min express delivery   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [Image] Minimalist Niacinamide  │ │  ← Cart item card
│ │         ₹599                    │ │
│ │ [ - ]  1  [ + ]     [ 🗑️ Delete]│ │  ← Quantity stepper + delete
│ └─────────────────────────────────┘ │
│                                     │
│ 🎟️ Apply Coupon / Coins (₹50)       │  ← Coupon input + coin toggle
│                                     │
│ Bill Summary:                       │
│ Items Total: ₹1,299                 │
│ Delivery Fee: FREE                  │  ← Free delivery indicator
│ Total Payable: ₹1,178               │
│                                     │
├─────────────────────────────────────┤
│ ₹1,178  [ Proceed to Checkout ➔ ]  │  ← Sticky CartGreen CTA (#2D9D5F)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Quantity Stepper Tap**: Increments or decrements item quantity in `useCartStore`, re-calculating subtotal instantly.
- **Delete Item Tap**: Removes item from cart and recalculates total.
- **Proceed to Checkout Tap**: Navigates to Checkout Review (`Screen 52`).

---

## 5. Backend & Storage Integration
- Subscribes to `useCartStore` Zustand store
- Uses `Colors.shop.cartGreen`, `Colors.status.success`, and `Colors.onboarding.primary` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Upgraded from dark surface (`#0A0F1E`) to Mode B Clean Light (`#FFFFFF`) with green `Colors.shop.cartGreen` (`#2D9D5F`) checkout CTA.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
