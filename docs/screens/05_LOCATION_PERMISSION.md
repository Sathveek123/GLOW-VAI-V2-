# Screen 05: Location Permission Modal

## 1. Executive Summary & Overview
**Location Permission Modal** requests device GPS permission to verify hyper-local 15-min quick-commerce serviceability.

- **Screen Title**: Location Permission Modal
- **Route / File Path**: Component `src/components/modals/PermissionModal.tsx (type="location")`
- **Domain Category**: Launch & Onboarding / Permissions
- **Target OS / Framework**: Android / React Native (Expo Location)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Presentation**: Bottom sheet modal overlay with top radius 24px, pure white sheet background (`#FFFFFF`), and translucent backdrop (`rgba(0,0,0,0.4)`)
- **Icon Badge**: 64px circular badge, `lucide-react-native` location pin icon, `Colors.onboarding.primaryTint` (coral 8% opacity) background fill with subtle coral border
- **Headline**: `"Enable Location Access"` (or `"Location Access Blocked"`)
- **Body**: *"We use your location to check if 15-min delivery is available in your area, or show standard delivery options."*
- **Micro-Note Badge**: `"⚡ Vijayawada: 15-45 min · 🚚 Rest of India: 3-7 days"`
- **Primary CTA**: `"Allow While Using App"` — `Colors.onboarding.primary` (`#D4472C`) coral fill
- **Secondary Link**: `"Enter Address Manually"` — `Colors.onboarding.textSecondary` (`#6B6B6B`)

---

## 3. User Interaction & State Machine
- **On Mount**: Checks `Location.getForegroundPermissionsAsync()`.
- **Primary CTA Tap**:
  - Triggers `Location.requestForegroundPermissionsAsync()`.
  - On grant: Fetches current GPS coordinates via `Location.getCurrentPositionAsync()`.
- **Secondary Link Tap**: Closes modal and navigates to Screen 17 Location Search.

---

## 4. Backend Integration
- GPS coordinates checked against cached `deliveryZones` in Firestore.
