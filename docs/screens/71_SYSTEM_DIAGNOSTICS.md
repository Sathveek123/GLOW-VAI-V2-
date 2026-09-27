# Screen 71: Admin System Diagnostics Screen

## 1. Executive Summary & Overview
**Admin System Diagnostics Screen** provides real-time infrastructure monitoring for GlowVAI V2, tracking Cloud Firestore latency, Auth session tokens, and Cloud Functions health.

- **Screen Title**: Admin System Diagnostics Screen
- **Route / File Path**: `src/features/admin/SystemDiagnosticsScreen.tsx`
- **Domain Category**: Admin & Operations
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Metric Tiles**: `Colors.shop.surface` (`#FAFAFA`) cards with `Colors.shop.border` (`#EEEEEE`) outline
- **Status Indicators**: `Colors.status.success` (`#2D9D5F`) for operational services, `Colors.status.warning` (`#F59E0B`) for degraded latency

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back            System Diagnostics│
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🟢 Firestore DB: Operational    │ │  ← Database status card
│ │ Latency: 24ms | Reads: 1.2k/min │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🟢 Auth SDK: Active             │ │  ← Auth service status card
│ │ Sessions: 840 active users      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Refresh Tap**: Triggers real-time ping to Firebase Cloud Functions health endpoint.
- **Log Item Tap**: Expands detailed stack trace modal for diagnostic review.

---

## 5. Backend & Firebase Integration
- Firestore: Pings `systemConfig/health` collection
- Firebase Auth: Reads active session count
