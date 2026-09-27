# Screen 57: Orders History & Active Orders Screen

## 1. Executive Summary & Overview
**Orders History & Active Orders Screen** is an essential screen within the **Order Tracking** module of the **GlowVAI V2** application.

- **Screen Title**: Orders History & Active Orders Screen
- **Route / File Path**: `app/(customer)/(tabs)/orders.tsx | src/features/orders/OrdersListScreen.tsx`
- **Domain Category**: Order Tracking
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Dark Theme Surface (#060D1E), Active Status Pulsing Badge, Card Borders
- **Core Components Used**: `Tab Toggle (Active Orders vs Past Orders), Order Summary Cards with Status Badges (PLACED/PACKED/OUT_FOR_DELIVERY/DELIVERED), "Track Order" CTA, "Reorder" Button`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Customer order management screen displaying active delivery cards and past order history.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Customer order management screen displaying active delivery cards and past order history.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Tab Toggle (Active Orders vs Past Orders), Order Summary Cards with Status Badges (PLACED/PACKED/OUT_FOR_DELIVERY/DELIVERED), "Track Order" CTA, "Reorder" Button`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Real-time Firestore snapshot listener on orders where userId == uid.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore orders collection query with composite index.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
