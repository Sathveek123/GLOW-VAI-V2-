# Screen 63: File Beauty Protection Claim Form Screen

## 1. Executive Summary & Overview
**File Beauty Protection Claim Form Screen** is an essential screen within the **Beauty Protection Warranty** module of the **GlowVAI V2** application.

- **Screen Title**: File Beauty Protection Claim Form Screen
- **Route / File Path**: `src/features/orders/BeautyProtectionClaimFormScreen.tsx`
- **Domain Category**: Beauty Protection Warranty
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Teal Warranty Accent (#0D9488), Dark Form Surface, Photo Upload Cards
- **Core Components Used**: `Reason Selector (Adverse Reaction / Transit Damage / Seal Tampered), Photo Evidence Upload Grid (Up to 3 photos), Clinical Symptoms Textarea, Batch Number Input, "Submit Claim" CTA`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Claims submission portal allowing users to upload photo proof of adverse reactions or damaged bottles under Beauty Protection warranty.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Claims submission portal allowing users to upload photo proof of adverse reactions or damaged bottles under Beauty Protection warranty.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Reason Selector (Adverse Reaction / Transit Damage / Seal Tampered), Photo Evidence Upload Grid (Up to 3 photos), Clinical Symptoms Textarea, Batch Number Input, "Submit Claim" CTA`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Upload photos to Firebase Storage -> Create beautyProtectionClaims document in Firestore.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firebase Storage claims/ & Firestore beautyProtectionClaims collection.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
