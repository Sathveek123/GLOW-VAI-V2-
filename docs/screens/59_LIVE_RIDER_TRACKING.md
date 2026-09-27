# Screen 59: Real-Time Rider GPS Map Tracking Screen

## 1. Executive Summary & Overview
**Real-Time Rider GPS Map Tracking Screen** is an essential screen within the **Order Tracking & Delivery** module of the **GlowVAI V2** application.

- **Screen Title**: Real-Time Rider GPS Map Tracking Screen
- **Route / File Path**: `src/features/orders/LiveRiderTrackingScreen.tsx`
- **Domain Category**: Order Tracking & Delivery
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Google Maps Dark Theme, Rider EV Icon Marker, Cyan Polyline Route
- **Core Components Used**: `Interactive React Native Maps View, Moving Rider EV Marker, Darkstore Dispatch Pin, User House Pin, Bottom Rider Card (Name, Phone Call Button, ETA Countdown)`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Live delivery tracking map showing real-time GPS coordinates of assigned delivery rider en route to customer doorstep.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Live delivery tracking map showing real-time GPS coordinates of assigned delivery rider en route to customer doorstep.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Interactive React Native Maps View, Moving Rider EV Marker, Darkstore Dispatch Pin, User House Pin, Bottom Rider Card (Name, Phone Call Button, ETA Countdown)`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Listens to riderTelemetry updates in Firestore or WebSocket -> Decodes driving polyline.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore orders/{orderId}/tracking snapshot.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
