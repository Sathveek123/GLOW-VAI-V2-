# Screen 52: Checkout Order Summary & Review Screen

## 1. Executive Summary & Overview
**Checkout Order Summary & Review Screen** is an essential screen within the **Checkout** module of the **GlowVAI V2** application.

- **Screen Title**: Checkout Order Summary & Review Screen
- **Route / File Path**: `app/(customer)/checkout/index.tsx | src/features/cart/CheckoutScreen.tsx`
- **Domain Category**: Checkout
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Clean Paper / Dark Mode, Section Dividers, Sticky Payment Footer
- **Core Components Used**: `Delivery Address Card with Edit Link, Delivery Time Estimate ("Express 25 Mins"), Items Summary, Complete Price Breakdown (Subtotal + Delivery + Protection - Coins = Grand Total), "Select Payment Method" CTA`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Final review screen presenting itemized pricing, delivery address, and estimated delivery timeline before launching payment.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Final review screen presenting itemized pricing, delivery address, and estimated delivery timeline before launching payment.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Delivery Address Card with Edit Link, Delivery Time Estimate ("Express 25 Mins"), Items Summary, Complete Price Breakdown (Subtotal + Delivery + Protection - Coins = Grand Total), "Select Payment Method" CTA`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Validates delivery address & item stock -> Invokes backend order session creator.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Express Backend /api/orders/create.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
