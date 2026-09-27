# Screen 22: Pan-India Standard Delivery Result

## 1. Executive Summary & Overview
**Pan-India Standard Delivery Result** displays serviceability status when the user's address falls outside the quick-commerce 15-minute zone, routing orders to standard Pan-India e-commerce fulfillment (3–7 business days).

- **Screen Title**: Pan-India Standard Delivery Result
- **Route / File Path**: `src/features/location/PanIndiaServiceabilityScreen.tsx`
- **Domain Category**: Location & Serviceability
- **Target OS / Framework**: Android / iOS / Web (Expo Router & React Native)

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF`) (REMOVED standalone blue `#1E56B3`)
- **Background**: `Colors.shop.background` (`#FFFFFF`)
- **Info Badge**: `"🚚 Standard delivery · 3-7 business days"` — Neutral light background (`Colors.light.textSecondary` 8% tint), `Colors.shop.textPrimary` (`#1A1A1A`) text
- **Delivery Fee Note**: `"Free delivery above ₹699"` — Inter body text, neutral styling
- **Primary CTA**: `"Browse National Catalog"` — `Colors.primary` (`#1A73E8`) fill, rounded 12px

---

## 3. Screen Structure & Layout Wireframe
```
┌─────────────────────────────────────┐
│ ← Back                               │
│                                     │
│ [ 🚚 Standard delivery · 3-7 days ] │  ← Neutral info badge
│                                     │
│ Deliver to: Banjara Hills, Hyderabad│
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Pan-India Express Warehouse     │ │  ← Mode B Surface card
│ │ Ships via BlueDart / Delhivery  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Free delivery on orders above ₹699   │  ← Inter neutral text
│                                     │
│ [      Browse National Catalog    ] │  ← Primary CTA fill
└─────────────────────────────────────┘
```

---

## 4. User Interaction & State Machine
- **On Mount**: Triggers when GPS coordinates or pin code falls outside quick-commerce polygon.
- **On CTA Press**: Navigates to `app/(customer)/(tabs)/shop.tsx` (Product Catalog).

---

## 5. Backend & Storage Integration
- Uses standard `Colors.shop.*` tokens and neutral info badges

---

## 6. Work Completed & Revision Log
- **Design Alignment**: Eliminated arbitrary `#1E56B3` blue color. Updated info badge to neutral light tint (`Colors.light.textSecondary` background tint) to reflect informational delivery state.
- **Verification**: Compiled cleanly with `npx tsc --noEmit` (0 errors).
