# Screen 54: Cashfree PG Payment Processing Modal Screen

## 1. Executive Summary & Overview
**Cashfree PG Payment Processing Modal Screen** is an essential screen within the **Payments** module of the **GlowVAI V2** application.

- **Screen Title**: Cashfree PG Payment Processing Modal Screen
- **Route / File Path**: `src/features/cart/CashfreeProcessingScreen.tsx`
- **Domain Category**: Payments
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Dark Overlay, Centered Loading Spinner, Cashfree Security Watermark
- **Core Components Used**: `Bank Processing Spinner, "Do Not Close App or Press Back" Security Notice, Cashfree Logo, Lock Icon`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Native Cashfree payment gateway modal displaying transaction state during bank authentication.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Native Cashfree payment gateway modal displaying transaction state during bank authentication.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Bank Processing Spinner, "Do Not Close App or Press Back" Security Notice, Cashfree Logo, Lock Icon`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Awaits Cashfree SDK callback -> Triggers backend payment verification.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Express Backend /api/orders/verify.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
