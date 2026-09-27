# Screen 68: Customer Help, FAQ & Support Tickets Screen

## 1. Executive Summary & Overview
**Customer Help, FAQ & Support Tickets Screen** is an essential screen within the **Customer Support** module of the **GlowVAI V2** application.

- **Screen Title**: Customer Help, FAQ & Support Tickets Screen
- **Route / File Path**: `app/(customer)/support/index.tsx | src/features/support/SupportScreen.tsx`
- **Domain Category**: Customer Support
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Clean Accordion Surface, WhatsApp Green (#25D366), Action Cards
- **Core Components Used**: `FAQ Accordion List (Orders, Quick-Commerce, Beauty Protection, Referrals), Direct WhatsApp Chat Button, "Create Support Ticket" Form Button, Active Tickets Status List`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Support center enabling instant FAQ resolution, direct WhatsApp coordination with operations, or ticket creation.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Support center enabling instant FAQ resolution, direct WhatsApp coordination with operations, or ticket creation.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `FAQ Accordion List (Orders, Quick-Commerce, Beauty Protection, Referrals), Direct WhatsApp Chat Button, "Create Support Ticket" Form Button, Active Tickets Status List`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Deep link to WhatsApp with order context -> Create support ticket document.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore supportTickets collection & WhatsApp Deep Link generator.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
