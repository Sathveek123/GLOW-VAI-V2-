# Screen 07: Terms of Service & Privacy Modal

## 1. Executive Summary & Overview
**Terms of Service & Privacy Modal** presents legal terms, privacy policies, and medical disclaimers required prior to account registration.

- **Screen Title**: Terms of Service & Privacy Modal
- **Route / File Path**: Component `src/components/modals/LegalTermsModal.tsx`
- **Domain Category**: Launch & Onboarding / Legal
- **Target OS / Framework**: Android / React Native (Mode B Clean Light Modal)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF` background, `#F8FAFC` surface card)
- **Header**: Sticky header with back chevron & `"Terms of Service & Privacy Policy"` title
- **Highlighted Callout**: Medical Disclaimer alert box (`#F59E0B` 10% opacity fill)
- **3 Granular Checkboxes**:
  1. *"I agree to the Terms of Service & Privacy Policy"*
  2. *"I read & accept the AI Medical Disclaimer"*
  3. *"I consent to camera/scan data processing for skin diagnostics"*
- **Scroll Detection**: Tracks scroll progress (`contentOffset.y + layoutMeasurement.height >= contentSize.height - 20`)
- **Primary CTA**: `"Accept & Continue"` — disabled until ALL 3 checkboxes are checked AND scroll reaches bottom

---

## 3. User Interaction & State Machine
- **Scroll to End**: Unlocks consent state.
- **Checkbox Toggle**: State Machine enforces all 3 checks required.
- **Accept Tap — Failure Path**:
  - If the Firestore consents write fails (network drop mid-write), do **NOT** navigate forward.
  - Show inline retry banner above the CTA: *"Couldn't save your consent — check your connection and try again."*
  - Consent must be confirmed persisted server-side before proceeding, since this is a legal/compliance requirement. Button reverts to loading state on retry tap, not a full screen reload.

---

## 4. Legal Compliance
- Compliant with Indian DPDP Act 2023 & CDSCO cosmetic recommendations.
