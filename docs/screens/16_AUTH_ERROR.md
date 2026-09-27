# Screen 16: Authentication Error & Recovery Overlay

## 1. Executive Summary & Overview
**Authentication Error Overlay** handles error states during login, OTP verification, and network interruptions.

- **Screen Title**: Authentication Error & Recovery Overlay
- **Route / File Path**: Component `src/components/ui/ErrorState.tsx` & Helper `src/utils/firebaseErrorMap.ts`
- **Domain Category**: Authentication / Error Handling
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Component Classification**: Reusable presentational overlay component (bottom sheet modal or inline banner)
- **Icon Badge**: 56px circular badge with `Colors.status.error` (`#EF4444`) at 12% opacity fill, containing `AlertTriangle` or `WifiOff` icon
- **Headline**: Dynamic headline in `Colors.onboarding.textPrimary` (`#1A1A1A`) based on error code (`"Incorrect Code"`, `"Code Expired"`, `"Connection Lost"`, `"Too Many Attempts"`, `"Something Went Wrong"`)
- **Body**: Max 2 lines human-readable message in `Colors.onboarding.textSecondary` (`#6B6B6B`) (never raw stack traces or error codes)
- **Primary CTA**: `"Try Again"` (`Colors.onboarding.primary` `#D4472C` coral fill)
- **Secondary Link**: `"Contact Support"` — text link deep-linking to WhatsApp support hotline (`openWhatsAppSupport`)

---

## 3. Error Code Variant Map (`firebaseErrorMap.ts`)
- `'auth/invalid-verification-code'` → Headline: *"Incorrect Code"*, Body: *"The OTP you entered doesn't match. Please check and try again."*
- `'auth/code-expired'` → Headline: *"Code Expired"*, Body: *"This OTP has expired. Request a new one to continue."*
- `'auth/network-request-failed'` → Headline: *"Connection Lost"*, Icon: `WifiOff`
- `'auth/too-many-requests'` → Headline: *"Too Many Attempts"*, CTA disabled countdown *"Try again in 4:32"*
- `'generic/unknown'` → Headline: *"Something Went Wrong"* + *"Contact Support"* text link

---

## 4. Interaction & State Machine
- `onRetry` callback executes parent component retry logic (clearing input fields, re-requesting OTP, or re-trying network call).
- `onContactSupport` opens WhatsApp deep link with pre-filled error context (`https://wa.me/918977855998?text=...`).
