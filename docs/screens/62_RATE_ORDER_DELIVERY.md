# Screen 62: Order Delivery & Product Rating Modal Screen

## 1. Executive Summary & Overview
**Order Delivery & Product Rating Modal Screen** is an essential screen within the **Order Feedback** module of the **GlowVAI V2** application.

- **Screen Title**: Order Delivery & Product Rating Modal Screen
- **Route / File Path**: `src/features/orders/RateOrderModal.tsx`
- **Domain Category**: Order Feedback
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications

- **Color Palette & Tokens**: Dark Sheet Overlay, Star Rating Bar (#F59E0B), Tag Chips
- **Core Components Used**: `Rider Rating Stars (1-5), Delivery Speed Feedback Tags, Product Quality Stars, Written Feedback Textarea, Submit Rating CTA`
- **Typography Standards**: Google Font `Syne` (`Syne_700Bold`) for primary headers, `Inter` for body and form fields.
- **Visual Description**: Post-delivery feedback prompt allowing customers to rate rider speed and skincare product satisfaction.

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────────────────────────┐
│                    HEADER / NAV BAR                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   MAIN CONTENT AREA                     │
│                                                         │
│  - Post-delivery feedback prompt allowing customers to rate rider speed and skincare product satisfaction.
│                                                         │
├─────────────────────────────────────────────────────────┤
│                 PRIMARY ACTION FOOTER                   │
└─────────────────────────────────────────────────────────┘
```

### Detailed Content Breakdown:
1. **Header Section**: Displays domain status, back navigation control, or active location context.
2. **Main Viewport**: Renders `Rider Rating Stars (1-5), Delivery Speed Feedback Tags, Product Quality Stars, Written Feedback Textarea, Submit Rating CTA`.
3. **Action Area**: Contextual primary action CTA or state feedback indicator.

---

## 4. User Interaction & State Machine

- **Default / Success State**: Save review to Firestore -> Prompt user to share referral link.
- **Loading State**: Displays atomic `LoadingState` spinner or skeleton shimmer card.
- **Error Handling**: Graceful fallback using `ErrorState` with retry options.
- **Offline Mode**: Renders cached offline banner when network drops out.

---

## 5. Backend, Firebase & API Integration

- **Firebase / Database Hook**: `Firestore orders/{id}/ratings subcollection.`
- **Data Collections Referenced**: `users`, `products`, `orders`, `deliveryZones`, `beautyProtectionClaims` (where applicable).
- **Security & Privacy**: Adheres strictly to GlowVAI zero-secrets policy and DPDP Act 2023 compliance.
