# Screen 09: Phone Number Login Screen

## 1. Executive Summary & Overview
**Phone Number Login Screen** handles phone authentication for GlowVAI V2 accounts.

- **Screen Title**: Phone Number Login Screen
- **Route / File Path**: `app/(auth)/login.tsx | src/features/auth/LoginScreen.tsx`
- **Domain Category**: Authentication
- **Target OS / Framework**: Android / React Native (Firebase Auth)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Header**: Back chevron, title `"Enter your phone number"` in `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **Country Code Pill**: Fixed `"🇮🇳 +91"` pill (`Colors.onboarding.surfaceSubtle` `#FAF9F6` bg, 1px `Colors.onboarding.border` `#EDEBE6` outline)
- **Input Field**: 20px numeric input (`Colors.onboarding.surfaceSubtle` bg, active solid 1.5px `Colors.onboarding.borderFocus` `#D4472C` coral border — NO cyan glow, NO shadow blur)
- **Formatting**: Auto 5+5 digit grouping (`98765 43210`)
- **Validation**: 10-digit Indian mobile number validation starting with digits 6-9 (`validateIndianPhoneNumber`)
- **Error Banner**: Inline red alert banner (`Colors.status.error`) for rate-limiting (`auth/too-many-requests`)
- **Primary CTA**: `"Send OTP"` — `Colors.onboarding.primary` (`#D4472C`) coral fill

---

## 3. Interaction & Backend Integration
- **Send OTP Tap**: Calls Firebase Auth `signInWithPhoneNumber` (`sendPhoneOtp`).
- On success: Navigates to Screen 10 OTP Verification with `verificationId` and `phoneNumber`.
