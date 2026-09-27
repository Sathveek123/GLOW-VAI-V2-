# Screen 58: Order Details & Receipt Screen

## 1. Executive Summary & Overview
**Order Details & Receipt Screen** is an essential screen within the **Order Tracking** module of the **GlowVAI V2** application.

- **Screen Title**: Order Details & Receipt Screen
- **Route / File Path**: `src/features/orders/OrderDetailsScreen.tsx`
- **Domain Category**: Order Tracking
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Clean Invoice White / Dark, Timeline Nodes, Price Table
- **Core Components Used**: `Order Status Timeline (Placed -> Confirmed -> Packed -> Out for Delivery -> Delivered), Shipping Address Card, Purchased Items List, Download Invoice Button, "File Beauty Protection Claim" Link`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Comprehensive order invoice and status timeline document showing rider details and invoice PDF export.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Comprehensive order invoice and status timeline document showing rider details and invoice PDF export.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Order Status Timeline (Placed -> Confirmed -> Packed -> Out for Delivery -> Delivered), Shipping Address Card, Purchased Items List, Download Invoice Button, "File Beauty Protection Claim" Link`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Subscribe to single order document in Firestore.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore orders/{orderId} document subscription.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
