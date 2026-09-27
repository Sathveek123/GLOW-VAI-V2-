# Screen 18: Interactive Map Pin Location Picker Screen

## 1. Executive Summary & Overview
**Map Pin Picker Screen** allows precise pin adjustment on a full-bleed map for exact delivery address placement.

- **Screen Title**: Interactive Map Pin Location Picker Screen
- **Route / File Path**: `app/(customer)/map-pin-picker.tsx | src/features/location/MapPinPickerScreen.tsx`
- **Domain Category**: Location & Delivery
- **Target OS / Framework**: Android / React Native (`react-native-maps`)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mixed — Full-bleed native map with Mode B Clean Light bottom sheet overlay (`#FFFFFF` background, rounded top 20px)
- **Center Pin**: Fixed center pin in `Colors.primary` brand blue with drop shadow. Reanimated scale pulse ripple ring loop activates while map is panning.
- **Bottom Sheet Overlay**:
  - Resolved address text (`Inter 500 15px`). Skeleton shimmer during 400ms region change settle.
  - Live Serviceability Badge: Evaluates PIP Ray-Casting algorithm (`src/utils/pip.ts`) against `deliveryZones`:
    - `⚡ Quick-Commerce Available · 15-45 min delivery`
    - `🚚 Standard Delivery Available · 3-7 days`
  - Primary CTA: `"Confirm Location & Proceed"`
- **Recenter FAB**: Floating circular button bottom-right with `Navigation` icon returning map to device GPS.

---

## 3. User Interaction & State Machine
- `onRegionChange`: Starts pin ripple animation & sets resolving state.
- `onRegionChangeComplete`: Stops ripple animation, debounces reverse-geocode query 400ms, and runs PIP check.
- **Confirm Tap**: Navigates to Screen 19 Add Address Form with lat/lng & resolved address pre-filled.

---

## 4. Backend Integration
- Point-in-Polygon (PIP) Ray-Casting algorithm against cached `deliveryZones`.
- Reverse-geocoding API (`/api/v1/maps/reverse-geocode`).
