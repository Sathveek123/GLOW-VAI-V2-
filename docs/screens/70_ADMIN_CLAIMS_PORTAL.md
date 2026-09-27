# Screen 70: Web Admin Beauty Protection Claims Review Dashboard Screen

## 1. Executive Summary & Overview
**Web Admin Beauty Protection Claims Review Dashboard Screen** is an essential screen within the **Admin Operations** module of the **GlowVAI V2** application.

- **Screen Title**: Web Admin Beauty Protection Claims Review Dashboard Screen
- **Route / File Path**: `admin/claims-dashboard.tsx | src/features/admin/ClaimsDashboard.tsx`
- **Domain Category**: Admin Operations
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Clinical Admin Interface, Photo Evidence Lightbox, Approve Green / Reject Red Buttons
- **Core Components Used**: `Claims Review Queue, Photo Evidence Lightbox Viewer, User Skin Diagnostic History Snapshot, Approve Claim Button, Reject Claim Button with Reason Notes`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Administrative dashboard for dermatology operations team reviewing submitted Beauty Protection claims and approving automated refunds.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Administrative dashboard for dermatology operations team reviewing submitted Beauty Protection claims and approving automated refunds.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Claims Review Queue, Photo Evidence Lightbox Viewer, User Skin Diagnostic History Snapshot, Approve Claim Button, Reject Claim Button with Reason Notes`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Approve claim -> Updates status to APPROVED -> Triggers automated gateway refund.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore beautyProtectionClaims collection update.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
