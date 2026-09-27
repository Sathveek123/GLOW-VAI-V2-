# Screen 55: Payment Success & Order Confirmed Screen

## 1. Executive Summary & Overview
**Payment Success & Order Confirmed Screen** is an essential screen within the **Checkout Success** module of the **GlowVAI V2** application.

- **Screen Title**: Payment Success & Order Confirmed Screen
- **Route / File Path**: `app/(customer)/checkout/success.tsx | src/features/cart/PaymentSuccessScreen.tsx`
- **Domain Category**: Checkout Success
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Emerald Green Accent (#10B981), Confetti Lottie Animation, Dark Card
- **Core Components Used**: `Success Checkmark Animation, Order ID Badge ("#ORD-991823"), Estimated Delivery Time Clock ("Delivering by 6:45 PM"), View Order Details CTA, Back to Home Link`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Order confirmation screen celebrating successful payment with live delivery countdown and invoice link.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Order confirmation screen celebrating successful payment with live delivery countdown and invoice link.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Success Checkmark Animation, Order ID Badge ("#ORD-991823"), Estimated Delivery Time Clock ("Delivering by 6:45 PM"), View Order Details CTA, Back to Home Link`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Clears shopping cart -> Subscribes to order tracking listener.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore orders/{orderId} initial state CONFIRMED.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
