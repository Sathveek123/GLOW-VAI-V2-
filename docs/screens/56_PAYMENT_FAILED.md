# Screen 56: Payment Failure & Retry Screen

## 1. Executive Summary & Overview
**Payment Failure & Retry Screen** is an essential screen within the **Checkout Failure** module of the **GlowVAI V2** application.

- **Screen Title**: Payment Failure & Retry Screen
- **Route / File Path**: `app/(customer)/checkout/failed.tsx | src/features/cart/PaymentFailedScreen.tsx`
- **Domain Category**: Checkout Failure
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Alert Red (#EF4444), Dark Card Surface, Action White Buttons
- **Core Components Used**: `Payment Error Icon, Failure Reason Details (e.g. "Bank Server Timed Out"), "Retry Payment" Primary Button, "Change Payment Method" Secondary Button`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Error resolution screen allowing user to retry failed transaction or select an alternative payment method without losing cart items.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Error resolution screen allowing user to retry failed transaction or select an alternative payment method without losing cart items.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Payment Error Icon, Failure Reason Details (e.g. "Bank Server Timed Out"), "Retry Payment" Primary Button, "Change Payment Method" Secondary Button`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Preserves cart state -> Re-initiates checkout session on retry.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Cashfree transaction error code mapper.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
