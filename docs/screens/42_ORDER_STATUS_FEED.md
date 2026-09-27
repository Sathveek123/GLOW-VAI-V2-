# Screen 42: Order Status Feed & Live Timeline

## 1. Executive Summary & Overview
**Order Status Feed & Live Timeline** tracks order processing stages (Received -> Dark Store Picked -> Packed -> Out for Delivery -> Delivered) with real-time status updates.

- **Screen Title**: Order Status Feed & Live Timeline
- **Route / File Path**: `src/features/orders/OrderTrackingFeed.tsx`
- **Domain Category**: Orders & Delivery Tracking
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Vertical Timeline Stepper**:
  - Completed Stages: `Colors.status.success` (`#2D9D5F`) checkmarks with green vertical connecting line
  - Current Stage: Pulsing emerald badge (`#2D9D5F`)
  - Pending Stages: Light grey bullet dots with `Colors.light.border` connecting line
- **Auto Transition**: Automatically transitions to Live Rider Tracking Map (Screen 43) when status flips to `OUT_FOR_DELIVERY`

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back            Order #GV-98412   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚡ 15-Min Quick-Commerce Express│ │  ← Order summary card
│ │ 3 Items · ₹1,249 · Paid via UPI │ │
│ └─────────────────────────────────┘ │
│                                     │
│  ✓ Order Placed          10:14 AM   │  ← Step 1 Complete (Green)
│  │                                  │
│  ✓ Packed at Dark Store  10:18 AM   │  ← Step 2 Complete (Green)
│  │                                  │
│  🟢 Out for Delivery     10:22 AM   │  ← Step 3 Current (Pulsing Green)
│  │                                  │
│  ⚪ Delivered                       │  ← Step 4 Pending (Grey)
│                                     │
│ [        Track Rider on Map       ] │  ← Primary CTA (Navigates to Screen 43)
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Status Change**: Real-time Firestore `onSnapshot` listener updates current step.
- **On Map CTA Press**: Navigates to `43_LIVE_RIDER_TRACKING_MAP.md` (`src/features/orders/OrderTrackingLive.tsx`).

---

## 5. Backend & Storage Integration
- Connects to Firestore `orders/{orderId}` collection via `onSnapshot`
- Uses `Colors.status.success` and `Colors.light.border` tokens

---

## 6. Work Completed & Revision Log
- **Renumbering Fix**: Renumbered from duplicate Screen 31 to Screen 42 inside the Orders & Delivery Tracking module.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
