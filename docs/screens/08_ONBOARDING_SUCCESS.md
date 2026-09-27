# Screen 08: Onboarding Success Screen

## 1. Executive Summary & Overview
**Onboarding Success Screen** provides feedback on profile setup completion and transitions the user into the main app experience.

- **Screen Title**: Onboarding Success Screen
- **Route / File Path**: `app/(auth)/onboarding-success.tsx | src/features/onboarding/OnboardingSuccessScreen.tsx`
- **Domain Category**: Launch & Onboarding
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Hero Element**: 96px circular checkmark badge with emerald green background (`Colors.status.success` `#2D9D5F`)
- **Headline**: `"You're All Set, {displayName}!"` — `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **Body**: *"Your GlowVAI profile is active and ready for AI skin diagnostics."* — `Colors.onboarding.textSecondary` (`#6B6B6B`)
- **Reward Teaser Pill (CONDITIONAL)**: Only rendered if a real Firestore read of `users/{uid}.referralCoinBalance` returns `> 0` at mount time. Pill text dynamically reflects actual balance: `"🎁 {balance} Welcome Coins added to your wallet"`. If balance is 0 (no signup bonus or referral not used), this entire pill is omitted — screen shows only headline + body + CTA. Never display a reward claim the backend hasn't actually fulfilled (Zero Mock Policy).
- **Auto-Redirect Timer**: 2000ms countdown with Coral linear progress fill bar (`Colors.onboarding.primary` `#D4472C`)
- **Primary CTA**: `"Explore Products"` — `Colors.onboarding.primary` (`#D4472C`) coral fill for immediate manual bypass

---

## 3. State Machine & Transition
- **Auto-Redirect**: After 2000ms, automatically calls `router.replace('/(customer)/(tabs)')`.
- **Manual Tap**: Instantly navigates without waiting for timer expiration.
