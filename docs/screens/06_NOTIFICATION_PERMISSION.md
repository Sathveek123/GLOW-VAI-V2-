# Screen 05b: Push Notification Consent Modal

## 1. Executive Summary & Overview
**Push Notification Consent Modal** requests OS permission for order tracking, scan readiness, and referral coin alerts.

- **Screen Title**: Push Notification Consent Modal
- **Route / File Path**: Component `src/components/modals/PermissionModal.tsx (type="notification")`
- **Domain Category**: Launch & Onboarding / Permissions
- **Target OS / Framework**: Android / React Native (Expo Notifications)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Presentation**: Bottom sheet modal overlay with top radius 24px, pure white sheet background (`#FFFFFF`), and translucent backdrop (`rgba(0,0,0,0.4)`)
- **Icon Badge**: 64px circular badge, `lucide-react-native` bell icon, `Colors.onboarding.primaryTint` (coral 8% opacity) background fill with subtle coral border
- **Headline**: `"Stay in the Loop"`
- **Body**: *"Get notified when your rider is nearby, your skin report is ready, and coins land in your wallet."*
- **3 Value Micro-Rows**:
  - 🛵 *"Live rider tracking updates"*
  - 🔬 *"Scan report ready alerts"*
  - 🪙 *"Coin credit notifications"*
- **Primary CTA**: `"Enable Notifications"` — `Colors.onboarding.primary` (`#D4472C`) coral fill
- **Secondary Link**: `"Not Now"` — `Colors.onboarding.textSecondary` (`#6B6B6B`)

---

## 3. User Interaction & State Machine
- **Trigger Timing Rule**: This modal must **NOT** fire immediately after Location Permission (Screen 05). Two consecutive OS permission prompts cause measurable permission fatigue and lower grant rates.
  - *Correct Sequence*: Fire this modal **AFTER** Skin Survey (Screen 15) completes, when the user has invested setup effort and is more receptive. Do not call this modal from the initial permissions cluster during Splash → Welcome flow.
- **Primary CTA Tap**: Triggers OS push notification consent prompt. Saves FCM token to `users/{uid}/fcmToken`.
- **Secondary Link Tap**: Dismisses modal without blocking user onboarding flow.
