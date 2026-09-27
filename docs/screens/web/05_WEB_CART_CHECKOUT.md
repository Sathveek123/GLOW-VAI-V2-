# Web Screen 05: Desktop Split-Pane Cart & Web Checkout

## 📌 Overview
The **Desktop Split-Pane Cart & Web Checkout** provides a frictionless purchasing environment on desktop viewports. It pairs cart editing side-by-side with delivery address selection and Cashfree Web JS SDK checkout.

---

## 🎨 UI Architecture & Layout Specs

### 1. Left Column — Item List & Addresses (Width 60%)
- Cart item rows with high-res thumbnails, quantity controls, and delete icons
- Free delivery progress meter
- Delivery address selection cards + `[ + Add New Address ]` button
- Coupon promo code input + Glow Coin redemption slider

### 2. Right Column — Order Summary & Payment (Width 40%)
- Bill Breakdown: Item Total, Discount Savings, Delivery Fee, Taxes, Grand Total
- Cashfree Web JS Payment SDK Container:
  - UPI QR Code scanner display (for desktop payment via PhonePe/GPay)
  - Card payment fields (Card number, expiry, CVV)
  - Net Banking dropdown
- `[ Pay ₹XXX via Cashfree ]` CTA button
