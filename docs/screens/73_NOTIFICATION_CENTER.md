# Screen 73: Customer Notification Center Screen

## 1. Executive Summary & Overview
**Customer Notification Center Screen** displays active push notifications, order status milestones, price drop alerts, and clinical routine reminders.

- **Screen Title**: Customer Notification Center Screen
- **Route / File Path**: `app/(customer)/notifications/index.tsx`
- **Domain Category**: Account & Activity
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Notification Cards**: Mode B surface cards (`#FAF9F6`), unread notifications highlighted with `Colors.onboarding.primaryTint` (`rgba(212, 71, 44, 0.08)`)
- **Category Icons**: `Colors.shop.cartGreen` for orders, `Colors.onboarding.primary` for skin reminders

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back         Notifications (3)    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ⚡ 15-Min Delivery Dispatched   │ │  ← Order Status Notification
│ │ Your rider is en route! 2m ago  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ ☀️ Morning Routine Reminder      │ │  ← Clinical Routine Reminder
│ │ Apply SPF50PA++++ sunscreen now │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Notification Tap**: Navigates directly to target screen (e.g. order tracking map or product detail page).
- **Clear All Tap**: Marks all notifications as read in local storage and Firestore.

---

## 5. Backend & Firebase Integration
- Firestore: `users/{uid}/notifications` collection
- Firebase Messaging: Listens to incoming APNs/FCM push payloads
