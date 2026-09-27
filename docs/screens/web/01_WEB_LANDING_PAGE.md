# Web Screen 01: Customer Marketing Web Landing Page

## 📌 Overview
The **Customer Marketing Web Landing Page** is the primary entry point for desktop and web browser users (`https://glowvai.com`). It delivers a high-impact luxury skincare experience featuring interactive hero carousels, live 10-minute delivery zone lookup, browser AI skin scan demo, and top clinical product highlights.

---

## 🎨 UI Architecture & Layout Specs

### 1. Navigation Header (Sticky Glassmorphic Bar)
- **Brand Logo**: GlowVAI Gold `✦` Sparkle + Deep Berry (`#8F0D2F`) Wordmark
- **Nav Links**: `AI Scan` · `Catalog` · `10-Min Delivery` · `Beauty Protection` · `Student Discount`
- **Location Selector**: Pin Icon + "Deliver to Vijayawada 520010 ▾"
- **Actions**: Search Icon · Wishlist (`♥`) · Cart Pill with Live Item Count Badge (`🛒 2`) · "Sign In" CTA

### 2. Hero Section (Split Layout)
- **Left Column**:
  - Headline: *"Clinical Beauty Diagnostics Meets 10-Minute Express Delivery"*
  - Sub-headline: *"Analyze 7 skin metrics in 30 seconds with PyTorch multi-task AI and get dermatologist-approved routines delivered in Vijayawada."*
  - CTAs: Primary Deep Berry `[ Start Free AI Scan → ]` · Secondary Outline `[ Explore Catalog ]`
  - Trust Badges: `4.9/5 Rating (12k+ Scans)` · `100% Reaction Warranty` · `Free Delivery over ₹1,999`
- **Right Column**:
  - Interactive 3D/High-Res Product Routine Visualizer + Floating Biometric Result Pill (*Acne Grade 0 · Hydration 84%*)

### 3. Serviceability Quick-Check Widget
- Input box: *"Enter 6-digit Pincode to verify 10-minute instant delivery"*
- Button: `[ Check Availability ]`
- Output: Instant green status *"⚡ 10-Min Express Available from Benz Circle Dark Store"*

### 4. Interactive AI Scan Demo Section
- Browser WebRTC live webcam feed simulator or image upload drag-and-drop zone
- Biometric breakdown tabs: Acne, Hydration, Texture, Pigmentation, Sebum, Sensitivity, Tone

### 5. Curated Clinical Categories & Bestsellers Grid
- Responsive 4-column product grid with instant hover zoom effects, rating stars, and 1-tap "Add to Cart" pills

---

## 🛠️ Data Flow & State Management
- Reads cart count from `useCartStore`
- Geolocation Pincode lookup proxies through Express backend (`/api/location/serviceability`)
- Responsive breakpoints: Mobile (`< 768px`), Tablet (`768–1024px`), Desktop (`> 1024px`)
