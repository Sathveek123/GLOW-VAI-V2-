# Screen 12: Student Verification Submission Screen

## 1. Executive Summary & Overview
**Student Verification Screen** allows students to submit credentials for a 15% recurring discount on skincare products.

- **Screen Title**: Student Verification Submission Screen
- **Route / File Path**: `app/(customer)/student-verification.tsx | src/features/referrals/StudentReferralScreen.tsx`
- **Domain Category**: Referrals & Perks
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Header**: Section header `"Student Discount Verification"` in `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **Banner Card**: `"Get 15% OFF all skincare products with verified student status"` — `Colors.onboarding.surfaceSubtle` (`#FAF9F6`) card with 1px `Colors.onboarding.border` (`#EDEBE6`) outline
- **Verification Paths**:
  - **Path A (Instant)**: `.ac.in` / `.edu.in` institutional email input. Auto-verifies instantly.
  - **Path B (Manual)**: Student ID Card photo upload (dashed outline card with `lucide-react-native` camera icon in Coral `#D4472C`).
- **College Search Input**: Autocomplete dropdown for Indian universities (e.g. KL University, GMRIT, VR Siddhartha).
- **Primary CTA**: `"Submit Verification"` — `Colors.onboarding.primary` (`#D4472C`) coral fill

---

## 3. Interaction & Backend Integration
- **Path B (Manual ID) Completion Flow**: Submission creates a `studentVerifications/{verificationId}` document with `status: 'PENDING_VERIFICATION'` — this does **NOT** set `users/{uid}.isStudentVerified` yet. That field only flips to `true` via the admin approval Cloud Function once a human reviewer approves the ID photo (see Screen 13 for resulting status states).
- Navigates to Screen 13 Student Status immediately after submission regardless of path, so the user always sees their current status rather than a dead-end confirmation screen.
