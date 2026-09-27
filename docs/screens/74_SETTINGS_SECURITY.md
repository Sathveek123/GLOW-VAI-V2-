# Screen 74: Settings & Security Screen

## 1. Executive Summary & Overview
**Settings & Security Screen** provides customer preference controls, biometric authentication toggles, push notification preferences, and account deletion workflows.

- **Screen Title**: Settings & Security Screen
- **Route / File Path**: `app/(customer)/settings/index.tsx`
- **Domain Category**: Account & Security
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Setting Rows**: Flat list items separated by `Colors.onboarding.border` (`#EDEBE6`) dividers
- **Toggle Switches**: Active fill in `Colors.onboarding.primary` (`#D4472C`)

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back           Settings & Security│
│                                     │
│  Account Preferences                │
│  • Biometric Face ID Login   [ ON ] │  ← Toggle Switch
│  • Order Status Push Alerts  [ ON ] │
│  • Marketing SMS Updates     [ OFF] │
│                                     │
│  Security & Privacy                 │
│  • Delete Account & Data           │  ← Danger Red Text Link
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Toggle Tap**: Updates local AsyncStorage preference and syncs to user profile doc.
- **Delete Account Tap**: Shows confirmation alert modal requiring re-authentication before account purging.

---

## 5. Backend & Firebase Integration
- Firebase Auth: `deleteUser(user)` call for account removal
- Firestore: `users/{uid}` profile settings document
