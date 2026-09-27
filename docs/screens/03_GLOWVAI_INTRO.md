# Screen 03: Platform Intro & Value Props Screen

## 1. Executive Summary & Overview
**Platform Intro Screen** presents GlowVAI's 4 core value pillars ("Why GlowVAI?") within the **Launch & Onboarding** module of **GlowVAI V2**.

- **Screen Title**: Platform Intro & Value Props Screen
- **Route / File Path**: `app/(auth)/intro.tsx | src/features/onboarding/PlatformIntroScreen.tsx`
- **Domain Category**: Launch & Onboarding
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: `Colors.onboarding.background` (`#FFFFFF`)
- **Header**: Section title `"Why GlowVAI?"` in `Colors.onboarding.textPrimary` (`#1A1A1A`)
- **4 Value Pillar Cards**: Stacked cards using `Colors.onboarding.surfaceSubtle` (`#FAF9F6`) with 1px `Colors.onboarding.border` (`#EDEBE6`) outline:
  1. 🔬 **AI Skin Diagnostics** — Multi-parameter AI analysis across 6+ biometric skin markers
  2. 🚚 **15-Min Quick-Commerce** — Hyper-local express delivery in Payikapuram & Vijayawada
  3. 🎓 **15% Student Discount** — Instant email verification with `.ac.in` / `.edu.in`
  4. 🛡️ **Beauty Protection** — 100% money-back guarantee for adverse skin reactions
- **Primary CTA**: `"Continue to Sign In"` — `Colors.onboarding.primary` (`#D4472C`) coral fill, full width

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────┐
│  ← Back              Why GlowVAI?   │
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │ 🔬 AI Skin Diagnostics          ││  ← Pillar 1
│  │    Multi-parameter AI analysis  ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 🚚 15-Min Quick-Commerce        ││  ← Pillar 2
│  │    Payikapuram & Vijayawada     ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 🎓 15% Student Discount         ││  ← Pillar 3
│  │    Instant .ac.in unlock        ││
│  └─────────────────────────────────┘│
│  ┌─────────────────────────────────┐│
│  │ 🛡️ Beauty Protection Cover      ││  ← Pillar 4
│  │    100% adverse reaction refund ││
│  └─────────────────────────────────┘│
├─────────────────────────────────────┤
│  ┌─────────────────────────────────┐│
│  │      Continue to Sign In        ││  ← Primary CTA
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine

- **Card Stagger Animation**: Cards fade & translate up sequentially on screen mount (100ms delay per card).
- **Accuracy Claim Rule**: Uses capability language (*"Multi-parameter AI analysis across 6+ biometric skin markers"*) rather than unverified percentage claims to comply with CDSCO/DPDP regulatory guidelines.
- **CTA Tap**:
  - Triggers haptic feedback (`safeHapticImpact`).
  - Navigates to Screen 09 Phone Login (`/(auth)/login`).

---

## 5. Backend & Storage Integration

- Static value pillar definitions aligned with system rules (`DELIVERY_RULES.md`, `BEAUTY_PROTECTION_TERMS.md`).
- No network call required; instant rendering.
