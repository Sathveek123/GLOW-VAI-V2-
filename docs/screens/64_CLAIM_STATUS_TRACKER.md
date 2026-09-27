# Screen 64: Beauty Protection Claim Review Tracker Screen

## 1. Executive Summary & Overview
**Beauty Protection Claim Review Tracker Screen** is an essential screen within the **Beauty Protection Warranty** module of the **GlowVAI V2** application.

- **Screen Title**: Beauty Protection Claim Review Tracker Screen
- **Route / File Path**: `src/features/orders/ClaimStatusTrackerScreen.tsx`
- **Domain Category**: Beauty Protection Warranty
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Status Colors: Blue (Submitted), Amber (Under Review), Green (Approved/Refunded), Red (Rejected)
- **Core Components Used**: `Claim ID Badge, Status Timeline, Admin/Dermatologist Review Notes Card, Refund Amount / Wallet Voucher Display`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Tracks live audit status of filed Beauty Protection claims by GlowVAI dermatology operations team.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Tracks live audit status of filed Beauty Protection claims by GlowVAI dermatology operations team.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Claim ID Badge, Status Timeline, Admin/Dermatologist Review Notes Card, Refund Amount / Wallet Voucher Display`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Subscribe to beautyProtectionClaims/{claimId} in Firestore.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore beautyProtectionClaims document listener.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
