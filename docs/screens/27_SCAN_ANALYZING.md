# Screen 27: Scan Analyzing & Inference Progress

## 1. Executive Summary & Overview
**Scan Analyzing & Inference Progress** displays the real-time clinical analysis progress while the PyTorch CNN model processes facial metrics.

- **Screen Title**: Scan Analyzing & Inference Progress
- **Route / File Path**: `app/(customer)/scan/analyzing.tsx` | `src/features/scan/ScanAnalysisScreen.tsx`
- **Domain Category**: AI Face Scan & Diagnostics
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED pulsing radar & sci-fi cyan metrics)
- **Background**: Pure White (`#FFFFFF`)
- **Progress Visual**: Simple circular progress ring with `Colors.onboarding.primary` (`#D4472C`) coral stroke filling smoothly as inference steps complete (0% to 100%)
- **Step Checklist**:
  - `"Analyzing hydration levels..."`
  - `"Checking barrier & texture..."`
  - `"Detecting sebum & active concerns..."`
  - Typography: `Typography.bodyMd`, `Colors.onboarding.textPrimary` (`#1A1A1A`), with checkmarks in `Colors.status.success` (`#2D9D5F`) upon step completion
- **Estimated Time Note**: `"This usually takes 5-8 seconds"` — `Typography.bodySm`, `Colors.onboarding.textSecondary` (`#6B6B6B`), setting clear expectations

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│                                     │
│               ( 78% )               │  ← Circular progress ring
│          [Coral Stroke Ring]        │     (Colors.onboarding.primary)
│                                     │
│     Analyzing Your Skin Health...   │  ← Typography.headingLg
│                                     │
│  ✓ Checking hydration levels        │
│  ✓ Analyzing barrier & texture      │  ← Step checklist with
│  ⏳ Detecting active concerns        │     emerald green checkmarks
│                                     │
│    "This usually takes 5-8 seconds" │  ← Estimated time note
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Inference Lifecycle**:
  - 0-3s: Barrier & hydration feature extraction
  - 3-6s: Concern classification & ingredient contraindication matching
  - 6-8s: Navigates automatically to `app/(customer)/scan/report.tsx` (Diagnostic Report).
- **Timeout Fallback**:
  - If inference exceeds 10 seconds (2s buffer past the promised 5-8s), the estimated time note updates in-place to: `"Still working — this is taking a bit longer than usual."` Progress ring continues indeterminate pulse rather than freezing at a stalled percentage.
  - If it exceeds 20 seconds total, auto-navigate to Scan Failed (Screen 28) with a timeout variant: `"This is taking too long. Please try again."`

---

## 5. Backend & Storage Integration
- Integrates PyTorch inference service or REST backend diagnostic API
- Uses `Colors.onboarding.primary` coral and `Colors.status.success` emerald green tokens

---

## 6. Work Completed & Revision Log
- **Codebase Upgrade**: Updated `src/features/scan/ScanAnalysisScreen.tsx` to remove dark blue sci-fi gradient (`#040914`) and cyan `#38BDF8` radar in favor of Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) progress ring and step checklist.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
