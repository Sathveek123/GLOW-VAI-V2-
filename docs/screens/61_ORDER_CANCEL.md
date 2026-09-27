# Screen 61: Order Cancellation Request Screen

## 1. Executive Summary & Overview
**Order Cancellation Request Screen** is an essential screen within the **Order Management** module of the **GlowVAI V2** application.

- **Screen Title**: Order Cancellation Request Screen
- **Route / File Path**: `src/features/orders/OrderCancelScreen.tsx`
- **Domain Category**: Order Management
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Dark Sheet Overlay, Reason Checkboxes, Red Cancel Button
- **Core Components Used**: `Cancellation Reason Radio List ("Placed by mistake", "ETA too long", "Changed mind"), Refund Details Note, "Confirm Cancellation" CTA`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Allows customer to cancel active order before vendor dark store packs items (within SLA window).

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Allows customer to cancel active order before vendor dark store packs items (within SLA window).
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Cancellation Reason Radio List ("Placed by mistake", "ETA too long", "Changed mind"), Refund Details Note, "Confirm Cancellation" CTA`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Check order status -> If PLACED/CONFIRMED -> Initiate cancellation & automated refund.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Cloud Function cancelOrder endpoint.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
