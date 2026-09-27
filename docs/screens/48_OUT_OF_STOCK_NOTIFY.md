# Screen 48: Out of Stock & Restock Notification Modal

## 1. Executive Summary & Overview
**Out of Stock & Restock Notification Modal** allows users to request SMS/push notifications when an out-of-stock SKU is replenished at their nearest Vijayawada dark store.

- **Screen Title**: Out of Stock & Restock Notification Modal
- **Route / File Path**: Component `src/components/modals/RestockNotifyModal.tsx`
- **Domain Category**: Shop & Catalogue / Inventory Alerts
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Presentation**: Bottom sheet modal overlay with top radius 24px, pure white sheet background (`#FFFFFF`), and translucent backdrop (`rgba(0,0,0,0.4)`)
- **Icon Badge**: 64px circular badge, bell alert icon (`Ionicons`), `Colors.status.warningBg` (`#FEF3C7`) background fill with amber border
- **Headline**: `"Out of Stock at Nearest Dark Store"` in `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **Sub-headline**: *"Get notified instantly the moment this formulation is restocked at Payikapuram Dark Store."*
- **Notification Preferences**:
  - ☑ Push Notification
  - ☑ SMS Alert (`+91 98765 43210`)
  - ☑ WhatsApp Alert
- **Primary CTA**: `"Notify Me When Restocked"` in `Colors.onboarding.primary` (`#D4472C`) coral fill
- **Alternative Action Link**: `"View Similar In-Stock Serums"` in `Colors.onboarding.textSecondary` (`#6B6B6B`)

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│              ━━━━━━                 │  ← Drag handle
│ ┌─────────────────────────────────┐ │
│ │ 🔔 Restock Alert                │ │  ← Amber icon badge (#FEF3C7)
│ └─────────────────────────────────┘ │
│                                     │
│  Temporarily Out of Stock           │  ← Headline (Typography.headingLg)
│  Notify when back in stock at       │
│  Payikapuram Dark Store #04.        │
│                                     │
│  Alert Channels:                    │
│  ☑ Push Notification  ☑ SMS Alert   │  ← Channel checkboxes
│                                     │
│ [    Notify Me When Restocked     ] │  ← Primary Coral CTA (#D4472C)
│                                     │
│   View Similar In-Stock Alternatives│  ← Alternative link
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Notify Me Tap**: Saves user subscription to Firestore `restockSubscriptions/{skuId}_{uid}` document.
- **Success Toast**: Displays `"✓ Restock alert set! We'll notify you first."` confirmation toast.
- **Alternatives Tap**: Closes modal and navigates to Product Catalog (`Screen 40`) with category filter applied.

---

## 5. Backend & Storage Integration
- Subscribes to Cloud Firestore `restockSubscriptions`
- Uses `Colors.onboarding.primary` coral and `Colors.status.warning` tokens

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Upgraded from dark backdrop (`rgba(10,15,30,0.75)`) to Mode B Clean Light (`#FFFFFF`) sheet with translucent backdrop (`rgba(0,0,0,0.4)`) and Coral (`#D4472C`) notification CTA.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
