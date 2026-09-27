# GlowVAI V2 — Payment & Checkout Integration Guide

## 1. Overview

GlowVAI V2 features a robust, RBI-compliant checkout pipeline integrating:
- **Cashfree Payment Gateway (PG)**: Native UPI Intent, Cards, Net Banking, and Wallet support.
- **Dynamic Pricing Engine**: Automated calculations for product subtotals, Beauty Protection warranty fees, delivery fees based on geofence tier, and student referral coin redemptions.

---

## 2. Payment Flow Architecture

```
User App (Cart / Checkout)
       │
       ▼
1. Order Summary Calculation
   ├── Subtotal = sum(item.discountedPrice * item.quantity)
   ├── Beauty Protection Fee = sum(item.beautyProtectionFee) if opted-in
   ├── Delivery Fee = Quick-Commerce (Zone rules) or Pan-India (Flat ₹40 / Free >= ₹699)
   ├── Coin Redemption = max 20% of subtotal (1 coin = ₹1)
   └── Grand Total = Subtotal + Beauty Protection + Delivery Fee - Coin Discount
       │
       ▼
2. Create Cashfree Session
   ├── Client calls POST /api/orders/create (Express Backend)
   ├── Backend passes credentials to Cashfree API (sandbox.cashfree.com or api.cashfree.com)
   └── Returns paymentSessionId & orderId
       │
       ▼
3. Client Cashfree PG Launch
   ├── Native Cashfree React Native SDK initialized with paymentSessionId
   └── User completes UPI payment or card authentication
       │
       ▼
4. Payment Verification & Order Placement
   ├── Client passes orderId to POST /api/orders/verify
   ├── Backend verifies order status with Cashfree PG
   ├── Updates Cloud Firestore document orders/{orderId} status to 'CONFIRMED'
   └── Triggers push notification and vendor order notification
```

---

## 3. Pricing & Discount Calculation Engine

### 3.1 Cart Pricing Breakdown Formula
$$\text{Grand Total} = \text{Subtotal} + \text{Beauty Protection Total} + \text{Delivery Fee} - \text{Coins Redeemed}$$

### 3.2 Constraints & Rules
- **Beauty Protection Fee**: Optional opt-in checkbox per product (`isBeautyProtectionEligible: true`), usually ₹29 to ₹59 per item.
- **Referral Coin Redemption**:
  - Maximum 20% of cart subtotal can be covered by GlowVAI Referral Coins.
  - Minimum cart value for coin redemption: ₹299.
  - 1 GlowVAI Coin = ₹1.00 store discount credit.
- **Delivery Fee Rules**:
  - **Vijayawada Quick-Commerce**: Zone-specific base fee (e.g. ₹39), Free above ₹499.
  - **Pan-India Standard Delivery**: Flat ₹40 for orders under ₹699, Free for orders $\ge$ ₹699.

---

## 4. Order Lifecycle State Machine

```
   [ PLACED ] ──> Payment Authorized
       │
       ▼
  [ CONFIRMED ] ──> Dark Store / Vendor Receives Notification
       │
       ▼
   [ PACKED ] ──> Rider Assigned / Courier AWB Generated
       │
       ▼
[ OUT_FOR_DELIVERY ] ──> Real-time GPS Tracking
       │
       ▼
  [ DELIVERED ] ──> Triggers Referral Coin Evaluation (7-day holding period)
```

---

## 5. Security & Verification Policy

1. **Zero Client-Side Signature Generation**: Secret keys (`CASHFREE_SECRET_KEY`) never reside on the mobile client.
2. **Double Validation**: Order amounts are verified server-side against Firestore product prices before initiating payment sessions to prevent price tampering.
3. **Idempotency**: Duplicate payment callbacks are handled idempotently via `orderId` uniqueness constraints in Firestore security rules.
