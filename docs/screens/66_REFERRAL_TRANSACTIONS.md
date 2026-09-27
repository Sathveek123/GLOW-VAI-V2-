# Screen 66: Referral Coin Transactions Ledger Screen

## 1. Executive Summary & Overview
**Referral Coin Transactions Ledger Screen** is an essential screen within the **Student Referrals** module of the **GlowVAI V2** application.

- **Screen Title**: Referral Coin Transactions Ledger Screen
- **Route / File Path**: `src/features/referrals/ReferralTransactionsScreen.tsx`
- **Domain Category**: Student Referrals
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Dark Theme Surface (#0F172A), Coin Credit Green (+50), Coin Debit Red (-100)
- **Core Components Used**: `Transaction History List, Referee Details ("Rajesh K. completed order"), Coin Status (CREDITED / HOLDING_7_DAYS / EXPIRED), Expiration Notice`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Detailed ledger listing all earned referral coins, pending 7-day holding periods, and redeemed store discounts.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Detailed ledger listing all earned referral coins, pending 7-day holding periods, and redeemed store discounts.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Transaction History List, Referee Details ("Rajesh K. completed order"), Coin Status (CREDITED / HOLDING_7_DAYS / EXPIRED), Expiration Notice`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Fetch user coinTransactions subcollection.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore users/{uid}/coinTransactions subcollection query.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
