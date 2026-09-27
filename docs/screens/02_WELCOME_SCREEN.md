# Screen 02: Welcome Screen

## 1. Executive Summary & Overview
**Welcome Screen** is the hero onboarding landing screen within the **Launch & Onboarding** module of **GlowVAI V2**.

- **Screen Title**: Welcome Screen
- **Route / File Path**: `app/(auth)/welcome.tsx | src/features/onboarding/WelcomeScreen.tsx`
- **Domain Category**: Launch & Onboarding
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Hero Carousel**: 3-slide auto-scroll & horizontal swipe carousel (`"AI Skin Diagnostic"`, `"Dermatologist Routines"`, `"15-Min Express Delivery"`)
- **Typography Standards**: Inter/Manrope typography tokens. `Colors.onboarding.textPrimary` (`#1A1A1A`), `Colors.onboarding.textSecondary` (`#6B6B6B`)
- **Pill Pagination**: Active slide indicator in `Colors.onboarding.primary` (`#D4472C`) coral with 20px pill expansion
- **Primary CTA**: `"Get Started"` — `Colors.onboarding.primary` (`#D4472C`) coral fill, navigates to Phone Login (`(auth)/login`)
- **Secondary CTA**: `"Explore Products"` — `Colors.onboarding.surfaceSubtle` (`#FAF9F6`) with `Colors.onboarding.border` (`#EDEBE6`) outline, allows guest browsing of catalog

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────┐
│              glowvai                │  ← tight wordmark
│                                     │
│  ┌───────────────────────────────┐  │
│  │   [Slide Image / Illustration]│  │  ← 3-slide Hero Carousel
│  │   AI Skin Diagnostic          │  │
│  │   Scan & analyze skin in 10s  │  │
│  └───────────────────────────────┘  │
│             ◯  ━━  ◯                │  ← active pill pagination
│                                     │
│  ┌───────────────────────────────┐  │
│  │         Get Started           │  │  ← Primary CTA (Phone Login)
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │      Explore Products         │  │  ← Secondary CTA (Guest Browse)
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine

- **Carousel Interaction & Auto-Advance Rule**:
  - Auto-advance carousel every 4000ms, BUT:
    - Pauses permanently once user manually swipes (`touched = true` forever for this session, never resumes auto-advance).
    - Pauses while user's finger is on screen (`onTouchStart` → clear interval, `onTouchEnd` → do NOT restart if touched).
  - This gives new users a passive preview while respecting user intent the moment they control navigation manually.
- **"Get Started" Tap**:
  - Triggers haptic feedback (`safeHapticImpact`).
  - Navigates to Screen 09 Phone Login (`/(auth)/login`).
- **"Explore Products" Tap**:
  - Sets guest mode in state store.
  - Navigates to Main Customer Shop (`/(customer)/(tabs)`).

---

## 5. Backend & Storage Integration

- Pre-fetches active delivery zones (`deliveryZones`) and root shop categories on mount.
- No direct user write; pure presentation & navigation gateway.
