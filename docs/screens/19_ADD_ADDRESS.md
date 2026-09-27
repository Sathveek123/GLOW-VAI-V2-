# Screen 19: Add New Address Form Screen

## 1. Executive Summary & Overview
**Add Address Screen** captures house/flat numbers, landmarks, recipient details, and address labels.

- **Screen Title**: Add New Address Form Screen
- **Route / File Path**: `app/(customer)/add-address.tsx | src/features/location/AddAddressScreen.tsx`
- **Domain Category**: Location & Delivery
- **Target OS / Framework**: Android / React Native

---

## 2. Layout & UI Design System Specifications
- **Mode**: Mode B — Clean Light (`#FFFFFF` background, `#F8FAFC` surface card)
- **Header**: Sticky `"Confirm Address"` header (framed as confirmation to lower perceived form length)
- **Pre-filled Location Summary Card**: Non-editable card with map badge + resolved address + pencil edit icon. Tapping returns to Screen 18 Map Pin Picker to adjust pin.
- **Form Fields**:
  - House / Flat / Building No. * (required, min 3 chars)
  - Street / Area * (pre-filled, editable)
  - Landmark (optional)
  - Address Label Chips: Horizontal pills (`🏠 Home`, `💼 Work`, `🎓 College`, `📍 Other`)
  - Recipient Name * (required, pre-filled from user account if available)
  - Recipient Phone * (required, 10-digit Indian mobile validation)
  - Set as Default Switch: Only visible if user already has 1+ saved addresses (first address is default automatically)
- **Primary CTA**: `"Save Address"` — sticky footer, disabled until required fields valid

---

## 3. Interaction & Backend Integration
- On save, computes PIP serviceability flag (`isQuickCommerceServiceable`) for selected coordinates against `deliveryZones`.
- Writes document to Firestore `users/{uid}/addresses/{addressId}` with server timestamps.
- Returns to checkout flow or Saved Addresses list.
