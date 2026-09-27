# Screen 06b: Vendor Closed State (Component Overlay)

## 1. Executive Summary & Overview
**Vendor Closed State** is a conditional presentational component within the **Shop & Discovery** module, rendered in place of the standard hero header whenever the active dark store vendor is outside operating hours.

- **Component Title**: Vendor Closed State
- **Route / File Path**: `src/components/shop/ClosedStoreState.tsx`
- **Domain Category**: Shop & Discovery / Delivery Serviceability
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode A — Atmospheric Dark (`Colors.dark.surface` card bg, NOT a red/error tone — closed is a scheduling state, not a failure state)
- **Status Card**: Rounded 16px card replacing the flash-deal billboard position — headline "We'll reopen at {openTime}, today" (Syne 700, 19px), body "You can still add items and order when the store re-opens" (Inter 400, 14px, `Colors.dark.textSecondary`)
- **Closed Ribbon Badge**: Rotated 10deg, top-right of status card, coral/red bg (`Colors.status.error`), white bold uppercase text "Sorry, we are CLOSED", drop shadow (elevation 6) for tactile sticky-note feel
- **Header Identity**: Vendor/zone name + address remain fully visible above the status card — never hidden or replaced
- **Catalog Below**: Fully unchanged, scrollable, add-to-cart fully functional — this component ONLY replaces the hero deal zone, nothing else on Home is disabled

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────┐
│ 🏠 Vamsi Krishna Nagar Store     👤 │ ← identity stays visible
│    A8 Block, Vambay Colony...       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────┐     │
│ │ We'll reopen at 6 AM, today │     │
│ │                 [Sorry,     │     │ ← rotated ribbon, top-right
│ │ You can still   we are      │     │
│ │ add items and   CLOSED]     │     │
│ │ order when the              │     │
│ │ store re-opens              │     │
│ └─────────────────────────────┘     │
│                                     │
│ Hey Priya, your quick picks         │ ← catalog UNCHANGED, fully live
│ [card +][card +][card +] →          │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Add-to-Cart While Closed**: Fully functional — items accumulate in cart for a scheduled order, no restriction on browsing/adding
- **Checkout CTA While Closed**: Text changes from "Place Order" to "Order will be placed when {vendorName} reopens at {time}" — never silently implies immediate delivery
- **Real-Time Reopen Detection**: Firestore `onSnapshot` listener on `vendors/{vendorId}.operatingHours.isOpenToday` — the instant this flips true (or current time crosses `openTime`), the component unmounts and standard Flash Deal billboard remounts, no manual refresh required
- **Ribbon Badge**: Static (no animation) — deliberately calm, since this is an informational state, not an alert requiring attention-grabbing motion

---

## 5. Backend, Firebase & API Integration
- Firestore: `vendors/{vendorId}` — `operatingHours.openTime`, `operatingHours.closeTime`, `operatingHours.isOpenToday`
- Client-side time comparison: `currentTime >= openTime && currentTime < closeTime` computed on each app foreground + real-time listener, per `DELIVERY_RULES.md` Step 3 vendor availability check
- No write operations — purely a read-driven conditional render
