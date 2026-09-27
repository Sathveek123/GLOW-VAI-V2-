# Screen 67: Customer Profile & Settings Overview Screen

## 1. Executive Summary & Overview
**Customer Profile & Settings Overview Screen** is an essential screen within the **Profile & Settings** module of the **GlowVAI V2** application.

- **Screen Title**: Customer Profile & Settings Overview Screen
- **Route / File Path**: `app/(customer)/(tabs)/profile.tsx | src/features/auth/ProfileScreen.tsx`
- **Domain Category**: Profile & Settings
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Dark Theme Surface (#060D1E), Rounded Menu Rows, Chevron Icons
- **Core Components Used**: `User Header Avatar & Name, Student Verified Badge, Menu Items (Saved Addresses, Skin Scan History, Referral Wallet, Privacy Controls, Terms & Policies, Help & Support), "Logout" Button`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Main profile dashboard providing access to saved addresses, previous diagnostic scan history, privacy controls, and account settings.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Main profile dashboard providing access to saved addresses, previous diagnostic scan history, privacy controls, and account settings.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `User Header Avatar & Name, Student Verified Badge, Menu Items (Saved Addresses, Skin Scan History, Referral Wallet, Privacy Controls, Terms & Policies, Help & Support), "Logout" Button`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Confirm logout modal -> Signs out Firebase Auth session.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firebase Auth signOut call.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
