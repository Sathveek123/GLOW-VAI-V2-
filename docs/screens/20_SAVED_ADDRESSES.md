# Screen 20: Saved Delivery Addresses Management Screen

## 1. Executive Summary & Overview
**Saved Addresses Screen** manages saved user addresses, default selections, and serviceability badges.

- **Screen Title**: Saved Delivery Addresses Management Screen
- **Route / File Path**: `app/(customer)/saved-addresses.tsx | src/features/location/SavedAddressesScreen.tsx`
- **Domain Category**: Location & Delivery
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF` background, `#F8FAFC` surface)
- **Header**: `"Delivery Addresses"` title with `"+ Add New"` text button top-right
- **Address Cards**:
  - Full-width card with border elevation.
  - Radio selector on left.
  - Label icon & text top row + `"DEFAULT"` tag (Inter 600 10px uppercase, `Colors.primary`).
  - Live Serviceability Badge: `⚡ 15-45 min` (green 12% opacity fill) or `🚚 Standard` computed dynamically on read via PIP check against `deliveryZones`.
  - Edit & Delete action buttons bottom-right.
- **Empty State**: Centered map illustration + `"No saved addresses yet"` + `"Add Your First Address"` CTA button when 0 addresses exist.
- **Bottom Sticky CTA**: `"+ Add New Address"` — full width, visible when list is non-empty.

---

## 3. User Interaction & State Machine
- **Real-time Listener**: `onSnapshot` on Firestore `users/{uid}/addresses`.
- **Radio Select Tap**: Atomic Firestore batch write to set `isDefault: true` on target address and `false` on previous default.
- **Edit Tap**: Navigates to Screen 19 Add Address Form pre-filled with data.
- **Delete Tap**: Opens confirmation modal. Auto-promotes next address to default if deleting current default.

---

## 4. Backend Integration
- Firestore real-time collection query (`users/{uid}/addresses`).
- Atomic batch updates via `writeBatch(db)`.
- Point-in-Polygon (PIP) Ray-Casting algorithm for read-time serviceability verification.
