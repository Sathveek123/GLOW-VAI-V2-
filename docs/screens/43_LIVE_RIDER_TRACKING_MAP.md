# Screen 43: Live Rider Tracking Map

## 1. Executive Summary & Overview
**Live Rider Tracking Map** renders real-time Google Maps GPS location of the quick-commerce rider, polyline route, live ETA countdown, and direct call CTA.

- **Screen Title**: Live Rider Tracking Map
- **Route / File Path**: `src/features/orders/OrderTrackingLive.tsx`
- **Domain Category**: Orders & Delivery Tracking
- **Target OS / Framework**: Android / iOS / Web (MapViewComponent wrapper)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Full-bleed Google Maps view with clean light map styling
- **Rider Marker**: Custom delivery motorcycle icon marker with real-time GPS coordinate updates
- **Polyline Route**: `Colors.primary` (`#1A73E8`) 4px route polyline connecting Dark Store -> Rider -> Customer Delivery Pin
- **Rider Profile Card**: Bottom sheet card (`Colors.shop.surface`) displaying Rider Name, Phone Call CTA button, and 4-digit Delivery OTP

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back         Live Rider Tracking  │
│ ┌─────────────────────────────────┐ │
│ │  ⚡ Arriving in 8 Mins          │ │  ← Floating ETA pill
│ └─────────────────────────────────┘ │
│                                     │
│         [ MAP VIEW - ROUTE ]        │
│          🏢 Dark Store              │
│               \                     │  ← Blue Polyline (#1A73E8)
│                🛵 Rider Marker      │
│                 \                   │
│                  🏠 Customer Pin    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 🛵 Rajesh (Dark Store Rider)    │ │  ← Rider profile bottom card
│ │ 📞 Call Rider  │  🔑 Delivery OTP│ │
│ │                   1482          │ │  ← Delivery OTP display
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Recenter Button**: Animates map viewport back to rider location.
- **Call Button**: Triggers `Linking.openURL('tel:...')` native phone dialer.

---

## 5. Backend & Storage Integration
- Cross-platform `MapViewComponent.native.tsx` / `MapViewComponent.web.tsx`
- Uses `Colors.primary` blue polyline and `Colors.shop.surface` bottom card

---

## 6. Work Completed & Revision Log
- **Renumbering Fix**: Renumbered from duplicate Screen 32 to Screen 43 inside the Orders & Delivery Tracking module.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
