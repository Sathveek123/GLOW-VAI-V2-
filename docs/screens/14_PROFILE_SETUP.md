# Screen 14: Profile Setup Screen (Step 1 of 2)

## 1. Executive Summary & Overview
**Profile Setup Screen** collects basic demographic details during account onboarding.

- **Screen Title**: Profile Setup Screen (Step 1 of 2)
- **Route / File Path**: `app/(auth)/profile-setup.tsx | src/features/profile/ProfileSetupScreen.tsx`
- **Domain Category**: Profile & Onboarding
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Header**: Title `"Setup Your Profile"` in `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **Progress Bar**: Step 1 of 2 indicator (50% progress fill bar in `Colors.onboarding.primary` `#D4472C`)
- **Avatar Picker**: 72px circular avatar badge with `lucide-react-native` camera icon for optional profile picture upload
- **Full Name Input**: Required text input box (`Colors.onboarding.surfaceSubtle` `#FAF9F6` bg, 1px `Colors.onboarding.border` `#EDEBE6` outline, focus `Colors.onboarding.borderFocus` `#D4472C`)
- **Age Group Chips**: Horizontal pills (`Under 18`, `18-24`, `25-34`, `35-44`, `45+`) with Coral active fill/border
- **Gender Chips**: Horizontal pills (`Female`, `Male`, `Non-binary`, `Prefer not to say`) with Coral active fill/border
- **Primary CTA**: `"Continue to Skin Survey"` — `Colors.onboarding.primary` (`#D4472C`) coral fill

---

## 3. Interaction & Backend Integration
- **Immediate Data Write on Continue**: On Continue tap, writes `displayName`, `ageGroup`, and `gender` immediately to Firestore `users/{uid}` with `{ merge: true }` — NOT deferred to local state only. This protects against data loss if the user backgrounds or force-quits the app between Profile Setup and Skin Survey. Avatar upload (if selected) proceeds asynchronously in parallel with navigation to Screen 15.
