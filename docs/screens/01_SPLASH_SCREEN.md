# Screen 01: Splash Screen

## 1. Executive Summary & Overview
**Splash Screen** is the primary entry screen within the **Launch & Onboarding** module of **GlowVAI V2**.

- **Screen Title**: Splash Screen
- **Route / File Path**: `app/index.tsx` | `src/features/onboarding/SplashScreen.tsx`
- **Domain Category**: Launch & Onboarding (Beauty & Skincare E-Commerce)
- **Target OS / Framework**: Cross-Platform Android / iOS / Web (Expo Router & React Native)
- **Design Language**: Genuine White & Coral Beauty Brand UI (Nykaa / Purplle / Sugar Cosmetics aesthetic)

---

## 2. Layout & UI Design System Specifications
- **Mode**: White & Warm Coral Theme
- **Background**: Pure White (`#FFFFFF`) with subtle warm vertical gradient (`#FFFFFF` → `#FDF8F5` → `#FFFFFF`)
- **Decorative Ambient Arcs**:
  - Top-Right Arc: 220px circle in `rgba(212, 71, 44, 0.08)` (blur filter 40px)
  - Bottom-Left Arc: 180px circle in `rgba(212, 71, 44, 0.08)` (blur filter 40px)
- **Logo Wordmark**: 
  - Two-tone typography: `"glow"` in Warm Coral (`#D4472C`, Manrope-Bold, 42px) + `"vai"` in Soft Dark Charcoal (`#1A1A1A`, Manrope-Bold, 42px)
  - Letter Spacing: `-1px`, lowercase
- **Animated Accent Line**: Coral underline (`#D4472C`, height 3px, rounded 2px) expanding from 0 to 40px on mount
- **Tagline**: `"Your skin deserves the best"` — Inter-Regular, 13px, `#6B6B6B`, letter-spacing 0.3px
- **Radial Glow**: Warm coral radial blob behind logo, 200px diameter, opacity 1.0, spring scale animation
- **Pulse Dots**: 3 sequential pulse dots (6px diameter, rounded 3px, `#D4472C`) replacing generic activity spinners
- **Bottom Badge**: `"MADE IN INDIA 🇮🇳"` — Inter-Regular, 11px, `#6B6B6B`, letter-spacing 1.4px, 36px from bottom safe area
- **Status Bar**: `dark-content` on `#FFFFFF` background

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ (top-right coral arc blur -80px)    │
│                                     │
│         (warm coral glow blob)      │
│                                     │
│            glowvai                  │  ← Two-tone: "glow" (Coral) + "vai" (Dark)
│            ───────                  │  ← Animated coral underline bar (40px)
│     Your skin deserves the best     │  ← 13px subtitle
│                                     │
│           •  •  •                   │  ← 3 coral pulse dots (sequential fade)
│                                     │
│ (bottom-left coral arc blur -60px)  │
│        MADE IN INDIA 🇮🇳             │  ← 11px uppercase badge
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Mount Sequence**:
  1. **Radial Glow Expansion**: Opacity 0 → 1, scale 0.6 → 1.0 (spring damping: 14, stiffness: 80, 0-500ms)
  2. **Logo Entry** (80ms delay): Scale 0.8 → 1.0 (spring damping: 10, stiffness: 120) + Opacity 0 → 1 (350ms)
  3. **Underline Expansion** (400ms delay): Width 0 → 40px (400ms)
  4. **Sub-Tagline Fade** (700ms delay): Opacity 0 → 1 (400ms)
  5. **Sequential Pulse Dots**: Infinite loop pulsing 3 coral dots sequentially (280ms duration each)
  6. **Parallel Auth & Route Check**: Checks `AsyncStorage.getItem('glowvai_auth_token')` & Firebase Auth session
  7. **Enforced Display Time**: Minimum 1400ms display timer before smooth transition
  8. **Route Navigation Decision**:
     - Authenticated User + `onboardingCompleted === 'true'` → replace to `/(customer)/(tabs)`
     - Authenticated User + `onboardingCompleted !== 'true'` → replace to `/(auth)/profile-setup`
     - Unauthenticated / Guest User → replace to `/(auth)/welcome`

---

## 5. Backend & Storage Integration & Mobile Native Resilience
- **AsyncStorage**: Checked for local `glowvai_auth_token` and `glowvai_onboarding_completed` flag
- **Firebase Auth (`getCurrentUser()`)**: Synchronous session check wrapped in safe try/catch fallbacks
- **Native Crash Safety (`src/config/firebase.ts`)**:
  - All Firebase JS SDK initializations (`initializeApp`, `getAuth`, `getFirestore`, `getStorage`) wrapped in try-catch guards.
  - Prevents native mobile app crashes on boot across Android, iOS, and Expo Go.
- **Expo App Configuration (`app.json`)**:
  - `userInterfaceStyle`: `"light"`
  - `splash.backgroundColor`: `#FFFFFF`
  - `android.adaptiveIcon.backgroundColor`: `#FFFFFF`
