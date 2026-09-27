# Screen 60: Handshake Delivery OTP Display Screen

## 1. Executive Summary & Overview
**Handshake Delivery OTP Display Screen** is an essential screen within the **Order Delivery Handshake** module of the **GlowVAI V2** application.

- **Screen Title**: Handshake Delivery OTP Display Screen
- **Route / File Path**: `src/features/orders/DeliveryOtpScreen.tsx`
- **Domain Category**: Order Delivery Handshake
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Dark Theme, Glowing OTP Box (#00F2FE), Security Shield Graphic
- **Core Components Used**: `4-Digit Delivery OTP Display ("OTP: 4892"), Security Instructions Card ("Share OTP with rider upon package handoff")`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Displays secure 4-digit OTP required by delivery rider to verify package handoff and mark order as DELIVERED.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Displays secure 4-digit OTP required by delivery rider to verify package handoff and mark order as DELIVERED.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `4-Digit Delivery OTP Display ("OTP: 4892"), Security Instructions Card ("Share OTP with rider upon package handoff")`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Rider verifies OTP on vendor app -> Order status transitions to DELIVERED.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore orders/{orderId}.deliveryOtp.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
