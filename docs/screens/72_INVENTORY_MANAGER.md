# Screen 72: Darkstore Inventory Manager Screen

## 1. Executive Summary & Overview
**Darkstore Inventory Manager Screen** enables darkstore operators to monitor real-time stock levels, update SKU availability, and trigger automated stock replenishment.

- **Screen Title**: Darkstore Inventory Manager Screen
- **Route / File Path**: `src/features/admin/InventoryManagerScreen.tsx`
- **Domain Category**: Admin & Operations
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **SKU Cards**: Mode B surface cards with `Colors.onboarding.border` (`#EDEBE6`) outline
- **Urgency Badges**: `Colors.status.error` (`#EF4444`) for low stock (<= 5 units), `Colors.status.success` (`#2D9D5F`) for in-stock SKUs

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back             Inventory Manager│
│ 🔍 Filter by Brand or SKU           │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Minimalist 10% Niacinamide 30ml │ │  ← Stock Item Card
│ │ Stock: 42 units  🟢 In Stock   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Derma Co 1% HA Sunscreen 50g    │ │  ← Low Stock Card
│ │ Stock: 3 units   🔴 Low Stock   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Quantity Stepper (+/-)**: Updates local SKU inventory counter in real time.
- **Stock Alert Trigger**: Sends push alert to darkstore manager when stock drops below threshold.

---

## 5. Backend & Firebase Integration
- Firestore: `products/{productId}` — updates `stockLeft` and `isQuickCommerceEligible` fields
