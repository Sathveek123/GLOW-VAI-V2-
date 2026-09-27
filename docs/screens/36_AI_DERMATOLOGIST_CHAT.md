# Screen 36: AI Dermatologist Clinical Chat

## 1. Executive Summary & Overview
**AI Dermatologist Clinical Chat** provides a conversational ReAct agent consultation interface for answering skincare, active ingredient, and routine questions.

- **Screen Title**: AI Dermatologist Clinical Chat
- **Route / File Path**: `src/features/recommendations/AiDermatologistChatScreen.tsx`
- **Domain Category**: AI Consultation & Support
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED full dark chat UI)
- **Background**: Pure White (`#FFFFFF`)
- **Message Bubbles**:
  - User Messages: Right-aligned, `Colors.onboarding.primary` (`#D4472C`) coral background with white text
  - AI Messages: Left-aligned, `Colors.shop.surface` (`#FAFAFA`) light grey background with `Colors.onboarding.textPrimary` (`#1A1A1A`) text, preceded by small `"GlowVAI AI"` label + doctor badge icon
- **Tool Call Badges**: Small inline pills within AI messages showing `"🔬 Checked ingredient safety"` or `"⚡ Verified stock"` in `Colors.status.info` (`#1A73E8`) tint
- **AI Typing Indicator**: Three small pulsing dots (same pulse rhythm as skeleton loaders app-wide) inside a left-aligned bubble matching the AI message style, shown while awaiting backend response. Replaced by the actual message the instant it arrives — never a blank gap between user message and AI reply.
- **1-Click Routine Checkout Card**: Embedded directly within the chat stream when the agent recommends products (not a floating overlay)
- **Input Bar**: Bottom-fixed, white background with `Colors.onboarding.border` top line and coral send button

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ 🩺 Dr. GlowVAI AI      [Online 🟢]  │  ← Clean header
├─────────────────────────────────────┤
│                                     │
│     [How do I use Salicylic Acid?]  │  ← User message (Coral bg, right)
│                                     │
│ 🩺 GlowVAI AI                       │
│ [🔬 Checked ingredient safety]      │  ← Tool call pill
│ Salicylic Acid is best used 2-3x    │
│ per week in your PM routine.        │  ← AI message (Surface bg, left)
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Recommended Routine Card        │ │  ← Inline 1-Click Checkout card
│ │ [ Add Routine to Cart - ₹899 ]  │ │
│ └─────────────────────────────────┘ │
│                                     │
├─────────────────────────────────────┤
│ [ Ask about your skin...    ] [ ➔ ] │  ← Bottom input bar + Coral send CTA
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Send Press**: Dispatches message payload to AI backend API.
- **On Inline Checkout Tap**: Adds recommended routine to cart directly from chat.

---

## 5. Backend & Storage Integration
- Connects to AI Dermatologist backend endpoint
- Uses `Colors.onboarding.primary` coral and `Colors.shop.surface` design tokens

---

## 6. Work Completed & Revision Log
- **Codebase Creation**: Created `src/features/recommendations/AiDermatologistChatScreen.tsx` in Mode B Clean Light (`#FFFFFF`) with Coral (`#D4472C`) user bubbles, light grey AI bubbles, tool call pills, and embedded 1-Click Routine Checkout cards.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
