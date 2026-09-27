# Screen 13: Student Verification Status Screen

## 1. Executive Summary & Overview
**Student Status Screen** displays live review progress or active student discount status.

- **Screen Title**: Student Verification Status Screen
- **Route / File Path**: `app/(customer)/student-status.tsx | src/features/referrals/StudentReferralScreen.tsx`
- **Domain Category**: Referrals & Perks
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Header**: Title `"Student Status"` in `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **Status Variations**:
  - `PENDING`: Amber warning badge (`Colors.status.warning` `#F59E0B`), `"Verification in Progress"`, *"Our team is reviewing your student ID (Est. 2-4 hours)"*
  - `VERIFIED`: Emerald success badge (`Colors.status.success` `#2D9D5F`), `"Student Discount Active!"`, *"Enjoy 15% OFF auto-applied at checkout"*
  - `REJECTED`: Red error badge (`Colors.status.error` `#EF4444`), `"Verification Unsuccessful"`, *"Reason: Unclear ID image. Please re-upload a clear photo."* + `"Try Again"` Coral CTA (`#D4472C`)

---

## 3. Real-Time Integration
- Listens to Firestore `users/{uid}` real-time changes to update badge state dynamically.
