# Screen 51: Coupon Code & GlowVAI Coins Redemption Screen

## 1. Executive Summary & Overview
**Coupon Code & GlowVAI Coins Redemption Screen** is an essential screen within the **Cart & Discounts** module of the **GlowVAI V2** application.

- **Screen Title**: Coupon Code & GlowVAI Coins Redemption Screen
- **Route / File Path**: `src/features/cart/CouponCoinRedemptionScreen.tsx`
- **Domain Category**: Cart & Discounts
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Gold Coin Accent (#F59E0B), Coupon Ticket Surface, Apply Button Accent
- **Core Components Used**: `Coupon Code Text Input with Apply Button, Available Coupons List, GlowVAI Referral Coin Balance Card, Coin Redemption Slider (Max 20% Subtotal), Applied Savings Summary`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Discount management screen enabling promo code entry and GlowVAI referral coin redemption.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Discount management screen enabling promo code entry and GlowVAI referral coin redemption.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Coupon Code Text Input with Apply Button, Available Coupons List, GlowVAI Referral Coin Balance Card, Coin Redemption Slider (Max 20% Subtotal), Applied Savings Summary`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Validate promo code string -> Calculate max allowable coin discount -> Apply discount to cart.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Cloud Function coupon validation.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
