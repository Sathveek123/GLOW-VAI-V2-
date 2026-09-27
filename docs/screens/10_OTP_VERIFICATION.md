# Screen 10: OTP Verification Screen

## 1. Executive Summary & Overview
**OTP Verification Screen** verifies the 4-digit SMS OTP code sent during login.

- **Screen Title**: OTP Verification Screen
- **Route / File Path**: `app/(auth)/otp.tsx | src/features/auth/OtpVerificationScreen.tsx`
- **Domain Category**: Authentication
- **Target OS / Framework**: Android / React Native (Firebase Auth)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Header**: Back chevron, title `"Verify OTP Code"` in `Colors.onboarding.textPrimary` (`#1A1A1A`), subtitle showing target number `+91 98765 43210` in `Colors.onboarding.textSecondary` (`#6B6B6B`)
- **4 OTP Boxes**: 56x56px input boxes (`Colors.onboarding.surfaceSubtle` `#FAF9F6` bg, 1px `Colors.onboarding.border` `#EDEBE6` outline, active solid 1.5px `Colors.onboarding.borderFocus` `#D4472C` coral border — NO cyan glow, NO shadow blur)
- **Paste / SMS Autofill Support**: If the OS SMS-autofill suggestion bar offers the received code (Android SMS Retriever API), tapping it fills all 4 boxes simultaneously and triggers the same auto-submit logic as manual 4th-digit entry. Implemented via Expo's SMS retriever integration without manual clipboard polling.
- **Auto-Advance & Auto-Submit**: Automatically advances focus to next box; triggers verification immediately when 4th digit is entered
- **Failure Shake**: Triggers horizontal shake animation & red border highlight (`Colors.status.error`) on incorrect code
- **Timer Section**: 30s countdown timer (`numericMono`). Tapping `"Having trouble?"` opens Screen 11 Resend Modal

---

## 3. Interaction & Backend Integration
- Verifies credential using `PhoneAuthProvider.credential(verificationId, otpCode)` via `confirmPhoneOtp`.
- On success: Checks `users/{uid}` document to route to Profile Setup or Home Tabs.
