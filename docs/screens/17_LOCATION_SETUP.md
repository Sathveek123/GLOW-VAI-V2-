# Screen 17: Location Setup & Search Screen

## 1. Executive Summary & Overview
**Location Setup Screen** provides search autocomplete and GPS-based delivery location selection.

- **Screen Title**: Location Setup & Search Screen
- **Route / File Path**: `app/(customer)/location-setup.tsx | src/features/location/LocationSetupScreen.tsx`
- **Domain Category**: Location & Delivery
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF` background, `#F8FAFC` surface)
- **Header**: Sticky header with back chevron & `"Set Delivery Location"` title
- **Search Bar**: 48px input box with magnifying glass icon, placeholder `"Search area, street name..."`
- **GPS Row**: Full-width row with `Colors.primary` text + `Navigation` icon, `"Use Current Location"`
- **Saved Addresses Section**: Section header `"SAVED ADDRESSES"` (`Inter 600 11px uppercase`, letter-spacing 0.5px) followed by address rows (label icon + street address + chevron)
- **Search Results State**: Populated via 350ms debounced geocoding search wrapping Google Places / FastAPI proxy. Shows skeleton rows while resolving.

---

## 3. User Interaction & State Machine
- **GPS Row Tap**:
  - Checks location permission status via `checkLocationPermission()`.
  - If not granted: Triggers `PermissionModal` inline.
  - If granted: Obtains GPS coordinates via `getDeviceCurrentLocation()` and navigates to Screen 18 Map Pin Picker.
- **Search Result Tap**: Navigates to Screen 18 Map Pin Picker with place coordinates pre-filled.
- **Saved Address Tap**: Sets selected address as active delivery location app-wide.

---

## 4. Backend Integration
- FastAPI geocode proxy (`/api/v1/maps/geocode`).
- Real-time Firestore listener on `users/{uid}/addresses`.
- `expo-location` for device GPS capture.
