# Screen 06c: Compact Cart Pill (Global Floating Component)

## 1. Executive Summary & Overview
**Compact Cart Pill** is a persistent, globally-rendered floating action element within the **Cart** module, providing at-a-glance cart state and one-tap access from any browsing screen.

- **Component Title**: Compact Cart Pill
- **Route / File Path**: `src/components/cart/CompactCartPill.tsx`
- **Domain Category**: Cart & Checkout
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode-agnostic (renders correctly over both Mode A and Mode B backgrounds via elevation/shadow, not background-color dependence)
- **Dimensions**: Content-hugging width (~140-160px), 44px height, 22px border-radius (full pill) — explicitly NOT a full-width bar
- **Position**: Fixed, floating, bottom-center or bottom-right, 16px margin from edges, positioned ABOVE the bottom tab bar with clear separation (never overlapping)
- **Fill**: `Colors.primary` solid, white text/icon, elevation 4 shadow
- **Content**: Single line — bag icon (16px) + "{count} item{s}" (Inter 600, 13px) + chevron-right (14px)

---

## 3. Screen Structure & Visual Components
```
                      ┌─────────────┐
                      │ 🛍 2 items → │   ← 150px wide, 44px tall,
                      └─────────────┘      full pill radius, floats
                                            above tab bar

┌─────────────────────────────────────┐
│ Home  Categories  Scan  Cart Profile│
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **Appearance**: Spring-in scale animation (`withSpring`, 0 → 1) triggered the moment cart transitions from 0 to 1+ items — reuses the same spring curve as the optimistic add-to-cart button for motion-language consistency
- **Persistence**: Fixed position via `position: absolute` at root navigator level (not per-screen), remains visible across Home/Shop/Category screens, hides only on Cart/Checkout screens themselves (redundant there)
- **Count Update**: In-place number change with a small bounce (`withSequence` scale 1→1.15→1) on the count text only — the pill container does not re-mount or re-animate on quantity changes, only the digit
- **Tap**: Navigates to Cart screen (`(customer)/(tabs)/cart`)
- **Empty Cart**: Pill fully unmounts (not just hidden) when count returns to 0, with reverse spring-out animation

---

## 5. Backend, Firebase & API Integration
- Subscribes to local optimistic cart state store (same source as Home Screen's inline quantity steppers) — no independent Firestore read, avoiding redundant listeners for the same data
- Cart state syncs to `users/{uid}/cart/{itemId}` in background per standard optimistic-write pattern
