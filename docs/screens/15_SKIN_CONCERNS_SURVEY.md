# Screen 15: Skin Profile & Concerns Survey (Step 2 of 2)

## 1. Executive Summary & Overview
**Skin Profile Survey** gathers user skin type and primary skin concerns to calibrate the AI diagnostic model.

- **Screen Title**: Skin Profile & Concerns Survey (Step 2 of 2)
- **Route / File Path**: `app/(auth)/skin-survey.tsx | src/features/profile/SkinSurveyScreen.tsx`
- **Domain Category**: Profile & Onboarding
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Header**: Title `"What are your main skin concerns?"` in `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **Progress Bar**: Step 2 of 2 indicator (100% progress fill bar in `Colors.onboarding.primary` `#D4472C`)
- **Skin Type Selector**: 4 cards (`Oily`, `Dry`, `Combination`, `Normal`)
- **6 Skin Concerns Grid** (2 columns):
  - 🔴 Acne & Breakouts
  - 🟡 Dark Spots & Hyperpigmentation
  - 🔵 Dehydration & Dullness
  - 🟣 Fine Lines & Wrinkles
  - 🟠 Redness & Sensitivity
  - 🟢 Large Pores & Texture
- **Card States**: Unselected = `Colors.onboarding.surfaceSubtle` (`#FAF9F6`) with 1px `Colors.onboarding.border` (`#EDEBE6`) outline; Selected = `Colors.onboarding.primaryTint` background fill with solid 1.5px Coral (`#D4472C`) border & checkmark badge
- **Skip Link**: `"Skip for now"` text link in `Colors.onboarding.textSecondary` (`#6B6B6B`), positioned above the Complete Setup button. Tapping sets `primaryConcerns: []` (explicit empty array — distinguishes 'asked, no preference' from 'never asked') and proceeds identically to Complete Setup. Rationale: this survey captures stated preference only — the actual CNN scan produces authoritative skinType/concern data later, so this step must never be a hard blocker to onboarding completion.
- **Primary CTA**: `"Complete Setup"` — `Colors.onboarding.primary` (`#D4472C`) coral fill

---

## 3. Interaction & Backend Integration
- Writes `skinProfile` object to Firestore `users/{uid}`.
- Sets `onboardingCompleted: true` atomically.
- Navigates to Screen 08 Onboarding Success Screen.
