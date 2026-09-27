# Screen 75: About App & Version Info Screen

## 1. Executive Summary & Overview
**About App & Version Info Screen** displays official GlowVAI V2 build numbers, open-source library licenses, clinical board accreditations, and legal credits.

- **Screen Title**: About App & Version Info Screen
- **Route / File Path**: `app/(customer)/about/index.tsx`
- **Domain Category**: Account & Information
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`)
- **Background**: Pure White (`#FFFFFF`)
- **Header Badge**: Concentric squircle logo container with `Colors.onboarding.primary` wordmark
- **Typography**: Inter 400 body text, Manrope 700 headings

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back                     About App│
│                                     │
│          [ glowvai logo ]           │  ← App Wordmark Badge
│           GlowVAI V2.4.0            │  ← Build Version
│       Made with ❤️ in India 🇮🇳       │
│                                     │
│  • Open Source Licenses             │
│  • Dermatologist Board Credits       │
│  • Terms of Service & Privacy       │
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Version Tap (5x Rapid Tap)**: Unlocks Developer Debug Console mode for diagnostic logging.
- **License Tap**: Opens modal sheet listing open-source dependency licenses.

---

## 5. Backend & Storage Integration
- Static app metadata reads from `app.json` config
- Storage: Stores debug toggle status in AsyncStorage
