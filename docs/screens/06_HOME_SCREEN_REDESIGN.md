# Screen 06: Home Screen (FOMO Billboard System)

## 1. Executive Summary & Overview
**Home Screen** is the primary discovery and re-engagement surface within the **Shop & Discovery** module of GlowVAI V2. It combines urgency-driven flash deals, personalized recommendations, and category browsing in a fixed, muscle-memory-optimized layout.

- **Screen Title**: Home Screen
- **Route / File Path**: `app/(customer)/(tabs)/index.tsx | src/features/shop/HomeScreen.tsx`
- **Domain Category**: Shop & Discovery
- **Target OS / Framework**: Android / React Native (Expo Router)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode A — Atmospheric header zone (maroon urgency band: `#7A0C1F`, used ONLY for Sections 1-2, never bleeding into product-list zones below) transitioning to Mode B — Clean Light for all content below the fold (`Colors.light.background`)
- **Header Row 1**: ETA text (Inter 700, 16px, white) LEFT + location text (Inter 400, 13px, white 85% opacity, truncated with chevron) LEFT-stacked below, profile icon (32px circle) RIGHT — fixed position, never relocates across app versions
- **Search Bar**: 48px height, white bg, rounded 12px, magnifying-glass icon left, embedded "AI Scan" pill button right (`Colors.primary` fill, camera-scan icon + label, 32px height)
- **Flash Deal Billboard**: Maroon bg (`#7A0C1F`), eyebrow text "⚡ FLASH GLOW DROP · {N}% MATCH" (Inter 600, 11px, gold `#D4A855`), headline "Flat ₹{X} Off Today" (Syne 800, 26px, white), live countdown row using `LiveCountdown` component, 2-column split: hero product card (left, 55% width) + 2x2 mini category grid (right, 45% width)
- **Occasion Billboard**: Conditional full-width card, admin-configured theme color (never brand maroon — visually distinct as "seasonal"), date stamp bottom-left, same hero+grid layout pattern as Flash Deal
- **Personalized Greeting**: "Hey {firstName}, your GlowVAI picks" (Syne 700, 18px) for returning users with scan history; "Recommended for you" for new users — horizontal product scroll below, each card with inline quantity stepper
- **Free Delivery Progress Bar**: Sticky card, `Colors.light.surface` bg, animated fill bar (`Colors.status.success`), only renders when cart has 1+ items below threshold
- **Brand Marquee**: Auto-scrolling horizontal ticker, infinite loop, Inter 500 13px brand names separated by dot
- **Value Drop Banner**: Full-bleed accent color band (green, distinct from maroon), tagline + horizontal product scroll with stock-urgency badges where applicable

---

## 3. Screen Structure & Visual Components

```
┌─────────────────────────────────────┐
│ ⚡ 15 MIN                       👤 │ ← Row 1: fixed position
│ Payikapuram, Andhra Pradesh ⌄       │
│ 🔍 Search "Niacinamide..." [AI Scan]│ ← Row 2: fixed position
├─────────────────────────────────────┤
│ ⚡ FLASH GLOW DROP · 98% MATCH       │ ← maroon zone starts
│ Flat ₹100 Off Today                 │
│ ⚡ Ends in 11:47 · Free 15-Min Drop  │ ← live ticking countdown
│ ┌──────────┐  ┌────┐┌────┐          │
│ │ Glow     │  │Serums││SPF │        │
│ │ Specials │  │More││    │          │
│ │ ₹699 ₹99 │  ├────┤├────┤          │
│ │ [image]  │  │Barrier││Acne│       │
│ └──────────┘  └────┘└────┘          │ ← maroon zone ends
├─────────────────────────────────────┤
│ [Occasion Billboard — conditional]  │
├─────────────────────────────────────┤
│ Hey Priya, your GlowVAI picks       │
│ [card][card][card][card] →          │
├─────────────────────────────────────┤
│ Add ₹123 more for FREE delivery     │
│ [████████░░░░░░░░] progress bar     │
├─────────────────────────────────────┤
│ Forest Essentials • Kama • Biotique │ ← auto-scroll marquee
├─────────────────────────────────────┤
│ GLOW @₹99 · Handpicked daily        │
│ [card][card][card][card] →          │
└─────────────────────────────────────┘
(floating: Compact Cart Pill)
┌─────────────────────────────────────┐
│ Home  Categories  Scan  Cart Profile│ ← fixed tab bar
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Flash Deal Countdown**: Live `setInterval` tick, 1000ms, format MM:SS; pulses red under 60s remaining; section auto-fade-unmounts on expiry (never shows stale 00:00)
- **Occasion Billboard**: Rendered only if `systemConfig/general.activeOccasion` has a date range containing today's date — auto-hides outside range, no manual toggle needed
- **Personalized Greeting Cards**: Inline quantity stepper (- 1 +) if item already in cart — same stepper component reused everywhere in-app (Product Detail, Category, Cart) for muscle-memory consistency
- **Free Delivery Bar**: Fill width recalculates via Reanimated interpolation on every cart total change, animates smoothly (not a jump-cut)
- **Marquee Tap**: Any brand name navigates to filtered catalog (`shop?brand={brandId}`)
- **Value Drop Cards**: Stock urgency text ("Only 3 left") only shown if `vendor.assignedInventory[productId].stock <= 5` — never a fabricated urgency signal
- **Pull-to-Refresh**: Refetches flash deal, occasion config, and recommendations in parallel (`Promise.all`), custom tintColor `Colors.primary`
- **Section Entrance**: Staggered `FadeInDown.delay(index * 60)` on first mount only (guarded by `hasAnimated` ref, not re-triggered on re-render)

---

## 5. Backend, Firebase & API Integration
- Firestore: `systemConfig/general` — active flash deal + occasion config (single doc read, cached 5 min)
- Firestore: `products` query — `isActive == true`, filtered by category/concern for value-drop and recommendation sections
- Firestore: `users/{uid}.skinProfile` read — determines personalized vs generic greeting copy
- Cart state: local optimistic state synced to `users/{uid}/cart/{itemId}` — Compact Cart Pill subscribes to this same local store, no redundant Firestore read
- Security & Privacy: Public catalog reads are open per `SECURITY_AND_PRIVACY.md` Firestore rules; cart/personalization reads scoped to `isOwner(userId)`
