# Screen 04: Camera Permission Modal

## 1. Executive Summary & Overview
**Camera Permission Modal** requests OS camera permissions for AI skin diagnostic scans.

- **Screen Title**: Camera Permission Modal
- **Route / File Path**: Component `src/components/modals/PermissionModal.tsx (type="camera")`
- **Domain Category**: Launch & Onboarding / Permissions
- **Target OS / Framework**: Android / React Native (Expo Camera)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Presentation**: Bottom sheet modal overlay with top radius 24px, pure white sheet background (`#FFFFFF`), and translucent backdrop (`rgba(0,0,0,0.4)`)
- **Icon Badge**: 64px circular badge, `lucide-react-native` camera icon, `Colors.onboarding.primaryTint` (coral 8% opacity) background fill with subtle coral border
- **Headline**: `"Enable Camera Access"` (or `"Camera Access Blocked"` if denied in OS settings)
- **Body**: *"We use your camera only for AI skin scans. Photos are processed securely and never stored without consent."*
- **Micro-Note Badge**: `"🔒 Encrypted & Private"` in `Colors.status.success` (`#2D9D5F`)
- **Primary CTA**: `"Grant Camera Access"` — `Colors.onboarding.primary` (`#D4472C`) coral fill
- **Secondary Link**: `"Skip for Now"` — `Colors.onboarding.textSecondary` (`#6B6B6B`)

---

## 3. User Interaction & State Machine
- **On Mount**: Checks `Camera.getCameraPermissionsAsync()`.
- **Primary CTA Tap**:
  - If status `undetermined`: Calls `Camera.requestCameraPermissionsAsync()`.
  - If status `blocked`: Opens device app settings via `Linking.openSettings()`.
- **Secondary Link Tap**: Closes modal and proceeds with manual input option.

---

## 4. Backend & Security
- Zero photo upload without explicit user action.
- Photos processed locally or transmitted over TLS 1.3 to diagnostic endpoint.
