# Screen 53: Payment Method Selection Screen

## 1. Executive Summary & Overview
**Payment Method Selection Screen** is an essential screen within the **Payments** module of the **GlowVAI V2** application.

- **Screen Title**: Payment Method Selection Screen
- **Route / File Path**: `src/features/cart/PaymentMethodSelectScreen.tsx`
- **Domain Category**: Payments
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: White / Dark Card Tiles, UPI Logo Badges (GPay, PhonePe, Paytm), Security Shield
- **Core Components Used**: `UPI Intent Radio Options (GPay, PhonePe, Paytm, BHIM), Credit/Debit Card Input Option, Net Banking Selector, Cash on Delivery (COD) Option, "Pay ₹799" Primary CTA`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Payment gateway selector supporting direct UPI Intent, credit/debit card, net banking, and COD.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Payment gateway selector supporting direct UPI Intent, credit/debit card, net banking, and COD.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `UPI Intent Radio Options (GPay, PhonePe, Paytm, BHIM), Credit/Debit Card Input Option, Net Banking Selector, Cash on Delivery (COD) Option, "Pay ₹799" Primary CTA`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Select payment mode -> Launch Cashfree PG Native SDK session.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Express Backend /api/orders/create Cashfree payment_session_id.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
