# Screen 69: Web Admin Dark Store & Order Dispatch Dashboard Screen

## 1. Executive Summary & Overview
**Web Admin Dark Store & Order Dispatch Dashboard Screen** is an essential screen within the **Admin Operations** module of the **GlowVAI V2** application.

- **Screen Title**: Web Admin Dark Store & Order Dispatch Dashboard Screen
- **Route / File Path**: `admin/darkstore-dashboard.tsx | src/features/admin/DarkStoreDashboard.tsx`
- **Domain Category**: Admin Operations
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Web Operations Grid, Alert Badges, SLA Countdown Timer
- **Core Components Used**: `Live Orders Queue Table, 90s Pick SLA Countdown Timer, Staging Bay Assign Picker, Dark Store Inventory Stock Manager, Rider Dispatch Trigger`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Backoffice web administration portal for dark store operators managing Vijayawada quick-commerce picking, packing, and rider dispatch.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Backoffice web administration portal for dark store operators managing Vijayawada quick-commerce picking, packing, and rider dispatch.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Live Orders Queue Table, 90s Pick SLA Countdown Timer, Staging Bay Assign Picker, Dark Store Inventory Stock Manager, Rider Dispatch Trigger`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Updates order status to PACKED / OUT_FOR_DELIVERY -> Trigger WhatsApp notification.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore orders & vendors collections admin access.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
