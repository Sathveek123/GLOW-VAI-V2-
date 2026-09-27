# Screen 11: Resend OTP & Phone Correction Modal

## 1. Executive Summary & Overview
**Resend OTP Modal** provides fallback actions when users experience SMS delivery issues.

- **Screen Title**: Resend OTP & Phone Correction Modal
- **Route / File Path**: Component `src/components/modals/ResendOtpModal.tsx`
- **Domain Category**: Authentication / Recovery
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Presentation**: Centered dialog card (`#FFFFFF` pure white bg, `Colors.onboarding.border` `#EDEBE6` outline, radius 20px, max-width 320px, backdrop `rgba(0,0,0,0.4)`)
- **Headline**: `"Trouble receiving the code?"` — `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **2 Action Rows**:
  1. 📱 `"Resend SMS to +91 98765 43210"` — `Colors.onboarding.primary` (`#D4472C`) text (shows timer countdown if active)
  2. ✏️ `"Correct phone number"` — `Colors.onboarding.textSecondary` (`#6B6B6B`) (navigates back to Screen 09)
- **Dismiss Link**: Text link to close modal (`Colors.onboarding.textSecondary`)

---

## 3. State Machine & Rate-Limit Edge Case
- **Rate-Limit Edge Case**: If `"Resend SMS"` is tapped and Firebase returns `auth/too-many-requests`, Row 1 transitions to a disabled error state inline (not a separate modal) — text changes to *"Too many attempts. Please wait a few minutes."* in `Colors.status.error`, and row becomes non-interactive until a fresh cooldown period elapses.
- Pure presentational component with `onResend` and `onEditPhone` callback props.
