# Screen 65: Student Referral Hub & Coin Wallet Screen

## 1. Executive Summary & Overview
**Student Referral Hub & Coin Wallet Screen** is an essential screen within the **Student Referrals** module of the **GlowVAI V2** application.

- **Screen Title**: Student Referral Hub & Coin Wallet Screen
- **Route / File Path**: `app/(customer)/referrals/index.tsx | src/features/referrals/ReferralsScreen.tsx`
- **Domain Category**: Student Referrals
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Gold Coin Accent (#F59E0B), Deep Purple/Blue Gradient (#4F46E5 -> #060D1E), Card Elevation
- **Core Components Used**: `Referral Coin Balance Dial (e.g. 450 Coins = ₹450), Personal Referral Code Card with Copy Link Button, WhatsApp Share Action Button, How It Works 3-Step Card, Invite Friends CTA`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Central referral management hub allowing verified college students to share referral codes and view coin balances.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Central referral management hub allowing verified college students to share referral codes and view coin balances.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Referral Coin Balance Dial (e.g. 450 Coins = ₹450), Personal Referral Code Card with Copy Link Button, WhatsApp Share Action Button, How It Works 3-Step Card, Invite Friends CTA`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Copy link to clipboard -> Trigger native OS share sheet.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore users/{uid}.referralCode and referralCoinBalance.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
