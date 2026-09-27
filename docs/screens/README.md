# GlowVAI V2 — Complete Screen Documentation Index

> **Last updated:** September 2026 | **Build State:** All screens implemented, `npx tsc --noEmit` → **0 errors**
> **Performance Architecture Guide:** [70-Screen Performance & Touch Guide](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/docs/70_SCREEN_TOUCH_AND_PERFORMANCE_OPTIMIZATION.md)
>
> This directory is the **single source of truth** for every screen in the GlowVAI V2 React Native (Expo Router) application.
> Each entry maps to a live `.tsx` component file, its expo-router route, the design palette, and current build status.

---

## 🎨 Design System Reference

### Color Tokens (GlowVAI Brand)
| Token | Hex | Usage |
|-------|-----|-------|
| `deepBerry` | `#8F0D2F` | Primary brand, headers, primary buttons |
| `plum` | `#5C2A91` | Secondary brand, links, AI elements |
| `warmIvory` | `#FFFDF7` | Screen backgrounds |
| `softCream` | `#FAF4EE` | Card backgrounds |
| `coral` | `#F27F78` | Accents, highlights, sale badges |
| `softCoral` | `#FBE0DC` | Light accent backgrounds |
| `lavender` | `#F2ECFA` | AI / premium section backgrounds |
| `cobaltBlue` | `#1677E8` | Actions, links, info states |
| `successGreen` | `#159447` | Confirmations, delivery, in-stock |
| `softGreen` | `#E3F5EA` | Success backgrounds |
| `text` | `#321A2B` / `#241529` | Main body text |
| `mutedText` | `#756C73` / `#716675` | Secondary, captions |
| `border` | `#E8E1E5` | Dividers, card borders |

### Typography
- **Headings:** `Syne` (ExtraBold 800), `Manrope` (Bold 700)
- **Body:** `Inter` (Regular 400, Medium 500, SemiBold 600)
- **Minimum touch target:** 44px × 44px
- **Safe area:** All screens wrapped in `<SafeAreaView>`

---

## 📱 Complete 52-Screen Master Directory

### 🟣 FLOW 1 — Onboarding & Launch (Screens 01–08)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **01** | [Splash Screen](#01-splash-screen) | `src/features/onboarding/SplashScreen.tsx` | `app/index.tsx` | ✅ Live |
| **02** | [Welcome Carousel](#02-welcome-carousel) | `src/features/onboarding/WelcomeScreen.tsx` | `app/(auth)/welcome.tsx` | ✅ Live |
| **03** | [GlowVAI Platform Intro](#03-platform-intro) | `src/features/onboarding/PlatformIntroScreen.tsx` | `app/(auth)/onboarding.tsx` | ✅ Live |
| **04** | [Permissions Gate](#04-permissions-gate) | `src/features/onboarding/PermissionsScreen.tsx` | `app/(auth)/permissions.tsx` | ✅ Live |
| **05** | [Terms & Privacy](#05-terms--privacy) | `app/(auth)/terms-privacy.tsx` | `app/(auth)/terms-privacy.tsx` | ✅ Live |
| **06** | [Onboarding Success](#06-onboarding-success) | `src/features/onboarding/OnboardingSuccessScreen.tsx` | `app/(auth)/success.tsx` | ✅ Live |

---

### 🔐 FLOW 2 — Authentication (Screens 07–10)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **07** | [Login — Phone Entry](#07-login--phone-entry) | `src/features/auth/LoginScreen.tsx` | `app/(auth)/login.tsx` | ✅ Live |
| **08** | [OTP Verification](#08-otp-verification) | `src/features/auth/OtpVerificationScreen.tsx` | `app/(auth)/verify-otp.tsx` | ✅ Live |
| **09** | [Profile Setup](#09-profile-setup) | `src/features/profile/ProfileSetupScreen.tsx` | `app/(auth)/profile-setup.tsx` | ✅ Live |
| **10** | [Skin Concerns Survey](#10-skin-concerns-survey) | `src/features/shop/SkinConcernsSurveyScreen.tsx` | `app/(auth)/skin-survey.tsx` | ✅ Live |

---

### 📍 FLOW 3 — Location & Serviceability (Screens 11–15)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **11** | [Location Setup](#11-location-setup) | `src/features/location/LocationSetupScreen.tsx` | `app/(customer)/location-setup.tsx` | ✅ Live |
| **12** | [Map Pin Picker](#12-map-pin-picker) | `src/features/location/MapPinPickerScreen.tsx` | `app/(customer)/map-picker.tsx` | ✅ Live |
| **13** | [Add Address Form](#13-add-address-form) | `src/features/location/AddAddressScreen.tsx` | `app/(customer)/add-address.tsx` | ✅ Live |
| **14** | [Saved Addresses](#14-saved-addresses) | `src/features/location/SavedAddressesScreen.tsx` | `app/(customer)/address/index.tsx` | ✅ Live |
| **15** | [Serviceability Result](#15-serviceability-result) | `src/features/location/ServiceabilityResultScreen.tsx` | `app/(customer)/serviceability.tsx` | ✅ Live |

---

### 🏠 FLOW 4 — Home & Shop Discovery (Screens 16–22)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **16** | [Home Screen](#16-home-screen) | `src/features/shop/HomeScreen.tsx` | `app/(customer)/(tabs)/index.tsx` | ✅ Live |
| **17** | [Product Catalog / Categories](#17-product-catalog--categories) | `src/features/shop/CategoriesScreen.tsx` | `app/(customer)/(tabs)/shop.tsx` | ✅ Live |
| **18** | [Product Catalog Store Hub](#18-product-catalog-store-hub) | `src/features/shop/ProductCatalogStoreHub.tsx` | `app/(customer)/product/catalog.tsx` | ✅ Live |
| **19** | [Product Detail](#19-product-detail) | `src/features/shop/ProductDetailsScreen.tsx` | `app/(customer)/product/[id].tsx` | ✅ Live |
| **20** | [Product Reviews](#20-product-reviews) | `src/features/shop/ProductReviewsScreen.tsx` | `app/(customer)/product-reviews.tsx` | ✅ Live |
| **21** | [Search & Filters](#21-search--filters) | `src/features/shop/SearchAndFiltersScreen.tsx` | `app/(customer)/search-filters.tsx` | ✅ Live |
| **22** | [Wishlist](#22-wishlist) | `src/features/shop/WishlistScreen.tsx` | `app/(customer)/wishlist.tsx` | ✅ Live |

---

### 🤳 FLOW 5 — AI Face Scan & Skin Report (Screens 23–30)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **23** | [Scan Intro](#23-scan-intro) | `src/features/scan/ScanIntroScreen.tsx` | `app/(customer)/scan/intro.tsx` | ✅ Live |
| **24** | [Face Scan Entry](#24-face-scan-entry) | `src/features/scan/FaceScanScreen.tsx` | `app/(customer)/scan/index.tsx` | ✅ Live |
| **25** | [Camera Viewfinder](#25-camera-viewfinder) | `src/features/scan/CameraViewfinderScreen.tsx` | `app/(customer)/scan/camera.tsx` | ✅ **FIXED** — Real `CameraView` |
| **26** | [Face Scan Camera (Alt)](#26-face-scan-camera-alt) | `src/features/scan/FaceScanCameraScreen.tsx` | _(embedded)_ | ✅ **FIXED** — Real `CameraView` |
| **27** | [Gallery Upload](#27-gallery-upload) | `src/features/scan/GalleryUploadScreen.tsx` | `app/(customer)/scan/gallery.tsx` | ✅ **FIXED** — Real `expo-image-picker` |
| **28** | [Image Preview & Quality Check](#28-image-preview--quality-check) | `src/features/scan/ImagePreviewScreen.tsx` | `app/(customer)/scan/preview.tsx` | ✅ **FIXED** — Real `photoUri` from route params |
| **29** | [Scan Analyzing](#29-scan-analyzing) | `src/features/scan/ScanAnalysisScreen.tsx` | `app/(customer)/scan/analyzing.tsx` | ✅ Live |
| **30** | [Scan Failed](#30-scan-failed) | `src/features/scan/ScanFailedScreen.tsx` | `app/(customer)/scan/failed.tsx` | ✅ Live |
| **31** | [Skin Report Overview](#31-skin-report-overview) | `src/features/scan/SkinReportScreen.tsx` | `app/(customer)/scan/report.tsx` | ✅ Live |

---

### 💊 FLOW 6 — AI Recommendations (Screens 32–34)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **32** | [AI Dermatologist Chat](#32-ai-dermatologist-chat) | `src/features/recommendations/AiDermatologistChatScreen.tsx` | `app/(customer)/scan/report.tsx` _(tab)_ | ✅ Live |
| **33** | [Express Routine Checkout](#33-express-routine-checkout) | `src/features/recommendations/ExpressRoutineCheckoutScreen.tsx` | `app/(customer)/express-checkout.tsx` | ✅ Live |

---

### 🛒 FLOW 7 — Cart & Checkout (Screens 35–42)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **35** | [Cart](#35-cart) | `src/features/cart/CartScreen.tsx` | `app/(customer)/(tabs)/cart.tsx` | ✅ Live |
| **36** | [Checkout Review](#36-checkout-review) | `src/features/checkout/CheckoutReviewScreen.tsx` | `app/(customer)/checkout-review.tsx` | ✅ Live |
| **37** | [Payment Method Select](#37-payment-method-select) | `src/features/checkout/PaymentMethodSelectScreen.tsx` | `app/(customer)/payment-method.tsx` | ✅ Live |
| **38** | [Cashfree Payment Processing](#38-cashfree-payment-processing) | `src/features/checkout/CashfreePaymentProcessingScreen.tsx` | `app/(customer)/payment-processing.tsx` | ✅ Live |
| **39** | [Payment Success](#39-payment-success) | `src/features/checkout/PaymentSuccessScreen.tsx` | `app/(customer)/payment-success.tsx` | ✅ Live |
| **40** | [Payment Failed](#40-payment-failed) | `src/features/checkout/PaymentFailedScreen.tsx` | `app/(customer)/payment-failed.tsx` | ✅ Live |

---

### 📦 FLOW 8 — Orders & Delivery Tracking (Screens 41–47)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **41** | [Orders List](#41-orders-list) | `src/features/orders/OrdersListScreen.tsx` | `app/(customer)/orders/index.tsx` | ✅ Live |
| **42** | [Order Details](#42-order-details) | `src/features/orders/OrderDetailsScreen.tsx` | `app/(customer)/orders/[id].tsx` | ✅ Live |
| **43** | [Order Tracking Feed](#43-order-tracking-feed) | `src/features/orders/OrderTrackingFeed.tsx` | `app/(customer)/order-tracking.tsx` | ✅ Live |
| **44** | [Live Rider Tracking (Map)](#44-live-rider-tracking-map) | `src/features/orders/LiveRiderTrackingScreen.tsx` | `app/(customer)/orders/[id].tsx` _(tab)_ | ✅ Live |
| **45** | [Order Tracking Live](#45-order-tracking-live) | `src/features/orders/OrderTrackingLive.tsx` | _(embedded)_ | ✅ Live |
| **46** | [Express Order Flow](#46-express-order-flow) | `src/features/orders/ExpressOrderFlowScreen.tsx` | _(embedded)_ | ✅ Live |
| **47** | [Rate Order & Delivery](#47-rate-order--delivery) | `src/features/orders/RateOrderDeliveryScreen.tsx` | _(modal)_ | ✅ Live |

---

### 👤 FLOW 9 — Profile, Referrals & Rewards (Screens 48–52)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **48** | [Profile Overview](#48-profile-overview) | `src/features/profile/ProfileOverviewScreen.tsx` | `app/(customer)/(tabs)/profile.tsx` | ✅ Live |
| **49** | [Referral Hub & Student Rewards](#49-referral-hub--student-rewards) | `src/features/referrals/ReferralHubScreen.tsx` | `app/(customer)/referrals.tsx` | ✅ Live |
| **50** | [Student Verification](#50-student-verification) | `src/features/referrals/StudentVerificationScreen.tsx` | `app/(customer)/student-verify.tsx` | ✅ Live |
| **51** | [Help & Support](#51-help--support) | `src/features/support/HelpAndSupportScreen.tsx` | `app/(customer)/support.tsx` | ✅ Live |
| **52** | [Settings & Security](#52-settings--security) | `src/features/settings/SettingsAndSecurityScreen.tsx` | `app/(customer)/settings/index.tsx` | ✅ Live |

---

### 🏭 FLOW 10 — Admin & Vendor (Screens 53–54)

| # | Screen | Component File | Route | Status |
|---|--------|---------------|-------|--------|
| **53** | [Vendor Admin Portal](#53-vendor-admin-portal) | `src/features/admin/VendorAdminPortalScreen.tsx` | `app/(admin)/index.tsx` | ✅ Live |
| **54** | [Vendor App Dashboard](#54-vendor-app-dashboard) | `src/features/vendor/VendorAppScreen.tsx` | `app/(vendor)/index.tsx` | ✅ Live |

---

## 🔍 Detailed Screen Specifications

---

### 01. Splash Screen
**File:** [`SplashScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/onboarding/SplashScreen.tsx)
**Route:** `app/index.tsx`
**Category:** Launch & Onboarding

**Layout:**
- Full-screen deep berry (`#8F0D2F`) background
- Centred GlowVAI logo with `✦` Sparkles icon + gold wordmark
- Tagline: *"Beauty Intelligence, Delivered"*
- Animated scale-in logo on mount
- Auto-navigates after 2.2s → checks auth state → routes to Home or Login

**Key Logic:**
- Reads `auth.currentUser` from Firebase Auth
- Reads `user.onboardingComplete` from Firestore
- Routes: authenticated + onboarded → `/(customer)/(tabs)`, else → `/(auth)/welcome`

---

### 02. Welcome Carousel
**File:** [`WelcomeScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/onboarding/WelcomeScreen.tsx)
**Route:** `app/(auth)/welcome.tsx`
**Category:** Onboarding

**Layout:**
- 3-slide swipeable carousel (FlatList horizontal)
- Slide 1: AI Skin Scan — berry hero illustration + "Know your skin in 30 seconds"
- Slide 2: 10-Min Delivery — coral delivery icon + "Skincare at your door, instantly"
- Slide 3: Beauty Protection — plum shield icon + "100% reaction coverage guarantee"
- Dot pagination indicator at bottom
- "Get Started" CTA → `/(auth)/onboarding`
- "Already have account? Login" link → `/(auth)/login`

---

### 03. Platform Intro
**File:** [`PlatformIntroScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/onboarding/PlatformIntroScreen.tsx)
**Route:** `app/(auth)/onboarding.tsx`
**Category:** Onboarding

**Layout:**
- 3 value-prop cards in vertical scroll: AI Diagnosis, Quick Commerce, Beauty Protection
- Each card: icon circle + headline + short description
- Deep berry "Continue" CTA → Permissions screen

---

### 04. Permissions Gate
**File:** [`PermissionsScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/onboarding/PermissionsScreen.tsx)
**Route:** `app/(auth)/permissions.tsx`
**Category:** Permissions

**Layout:**
- 3 permission rows: Camera, Location, Notifications
- Each row: icon + title + description + "Allow" button
- Requests permissions sequentially using `expo-camera`, `expo-location`, `expo-notifications`
- "Continue" CTA only enabled when Camera + Location granted
- **Camera permission required** for AI Skin Scan
- **Location required** for quick-commerce serviceability check

---

### 05. Terms & Privacy
**Route:** `app/(auth)/terms-privacy.tsx`
**Category:** Compliance

**Layout:**
- Scrollable legal text card
- Sections: Terms of Service, Privacy Policy, Medical Disclaimer
- Key disclaimer: *"GlowVAI provides cosmetic skin assessments only — not medical diagnosis"*
- "I Agree" CTA → `/(auth)/success`

---

### 06. Onboarding Success
**File:** [`OnboardingSuccessScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/onboarding/OnboardingSuccessScreen.tsx)
**Route:** `app/(auth)/success.tsx`
**Category:** Onboarding

**Layout:**
- Large animated checkmark (green circle, scale-in)
- "Welcome to GlowVAI!" headline
- "Your skin journey starts now" subtitle
- Auto-redirects to `/(customer)/(tabs)` after 1.5s

---

### 07. Login — Phone Entry
**File:** [`LoginScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/auth/LoginScreen.tsx)
**Route:** `app/(auth)/login.tsx`
**Category:** Authentication

**Layout:**
- GlowVAI logo header
- Country code picker (🇮🇳 +91 default)
- 10-digit phone number input field
- "Send OTP" CTA → triggers Firebase `signInWithPhoneNumber`
- Google Sign-In button (secondary)

**State:**
- Loading: spinner on "Send OTP" button
- Error: red inline "Invalid phone number" / "Too many requests" messages
- Firebase Recaptcha handled natively

---

### 08. OTP Verification
**File:** [`OtpVerificationScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/auth/OtpVerificationScreen.tsx)
**Route:** `app/(auth)/verify-otp.tsx`
**Category:** Authentication

**Layout:**
- 6-cell OTP input (each cell: 48×52px, auto-advance on digit entry)
- "Resend OTP" with 30s countdown timer
- "Verify" CTA
- Phone number displayed masked: `+91 ****XXXX`

**State:**
- Auto-submits when all 6 digits filled
- Error: "Invalid OTP" toast + cells turn coral border
- Success: navigates to Profile Setup or Home (existing user)

---

### 09. Profile Setup
**File:** [`ProfileSetupScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/profile/ProfileSetupScreen.tsx)
**Route:** `app/(auth)/profile-setup.tsx`
**Category:** Authentication

**Layout:**
- Avatar upload circle (coral dashed border)
- Name input field
- Age range selector (chips: 13-17, 18-24, 25-34, 35-44, 45+)
- Gender selector (chips: Male, Female, Non-binary, Prefer not to say)
- "Save & Continue" CTA → writes to Firestore `users/{uid}`

---

### 10. Skin Concerns Survey
**File:** [`SkinConcernsSurveyScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/shop/SkinConcernsSurveyScreen.tsx)
**Route:** `app/(auth)/skin-survey.tsx` / `app/(customer)/skin-survey.tsx`
**Category:** Diagnostics

**Layout:**
- "What are your skin concerns?" headline
- 2-column grid of concern chips (up to 3 selectable):
  - Acne & Breakouts, Dryness, Oiliness, Uneven Skin Tone, Dark Spots, Fine Lines, Sensitivity, Dullness
- Selected chips: berry fill, white text
- "Continue" CTA → saves to Firestore, navigates to Location Setup

---

### 11. Location Setup
**File:** [`LocationSetupScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/location/LocationSetupScreen.tsx)
**Route:** `app/(customer)/location-setup.tsx`
**Category:** Location

**Layout:**
- Search bar for address / area name
- "Use my current location" GPS auto-detect button (with scooter icon)
- Recent locations list
- Map preview thumbnail
- On detect: calls Google Geocoding API, shows pin → `map-picker.tsx`

---

### 12. Map Pin Picker
**File:** [`MapPinPickerScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/location/MapPinPickerScreen.tsx)
**Route:** `app/(customer)/map-picker.tsx`
**Category:** Location

**Layout:**
- Full-screen `MapView` (react-native-maps)
- Centred draggable pin (coral animated pulse)
- Bottom sheet: detected address + "Confirm Location" CTA
- On confirm → `add-address.tsx` with pre-filled lat/lng

---

### 13. Add Address Form
**File:** [`AddAddressScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/location/AddAddressScreen.tsx)
**Route:** `app/(customer)/add-address.tsx`
**Category:** Location

**Layout:**
- "Full address" (pre-filled from geocoding)
- Flat/House No, Building Name, Landmark (optional), Pincode
- Address type selector: Home 🏠, Work 💼, College 🎓
- "Save Address" CTA → writes `users/{uid}/addresses/{addressId}`

---

### 14. Saved Addresses
**File:** [`SavedAddressesScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/location/SavedAddressesScreen.tsx)
**Route:** `app/(customer)/address/index.tsx`
**Category:** Location

**Layout:**
- List of saved addresses with type icon (Home/Work/College)
- Active address: berry left border + "DEFAULT" badge
- Swipe-left → delete action
- "Add New Address" floating CTA

---

### 15. Serviceability Result
**File:** [`ServiceabilityResultScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/location/ServiceabilityResultScreen.tsx)
**Route:** `app/(customer)/serviceability.tsx`
**Category:** Location & Quick Commerce

**Layout:**
- Two states:
  - **Quick Commerce Zone** (Vijayawada): Green badge "Express Available · 10–15 min delivery", store card, full product access
  - **Pan-India Zone**: Blue badge "3–7 day standard delivery", limited catalog
- Store hours, estimated ETA chip
- "Start Shopping" CTA → Home screen

---

### 16. Home Screen
**File:** [`HomeScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/shop/HomeScreen.tsx)
**Route:** `app/(customer)/(tabs)/index.tsx`
**Category:** Home & Discovery

**Layout (top to bottom):**
1. **Header**: GlowVAI logo (left), location pill (centre), cart icon (right)
2. **Search bar**: grey rounded, "Search skincare, makeup..."
3. **Flash Glow Drop banner**: countdown timer + limited deal
4. **Shop by Category** carousel (horizontal scroll): Skin Care, Hair Care, Makeup, Body Care, Wellness, Fragrance, Men's Grooming, Baby Care (8 categories with gradient icon tiles)
5. **Campaign Banner**: full-width promotional image
6. **Recommended for You** horizontal product cards
7. **AI Skin Scan CTA** floating card
8. **Bottom Tab Bar**: Home, Shop, Cart, Scan, Profile

**Key Features:**
- Spring-physics horizontal scroll (`decelerationRate="fast"`, `snapToInterval`)
- Cart badge count from `useCartStore`
- Real-time Flash timer countdown

---

### 17. Product Catalog / Categories
**File:** [`CategoriesScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/shop/CategoriesScreen.tsx)
**Route:** `app/(customer)/(tabs)/shop.tsx`
**Category:** Shop

**Layout:**
- Category chip filter bar (horizontal scroll): All, Skin Care, Hair Care, Makeup, Body Care, Wellness
- 2-column product grid with skeleton loading pulse
- Each card: product image, brand, name, MRP strikethrough, discounted price, "ADD" button
- Empty state: coral illustration + "No products found" message

---

### 18. Product Catalog Store Hub
**File:** [`ProductCatalogStoreHub.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/shop/ProductCatalogStoreHub.tsx)
**Route:** `app/(customer)/product/catalog.tsx`
**Category:** Shop

**Layout:**
- Brand + category filtered product listing
- Sort: Relevance, Price Low-High, Price High-Low, Top Rated
- 2-column grid with Add to Cart inline buttons

---

### 19. Product Detail
**File:** [`ProductDetailsScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/shop/ProductDetailsScreen.tsx)
**Route:** `app/(customer)/product/[id].tsx`
**Category:** Shop

**Layout:**
1. Back button + share icon header
2. Product image carousel (dots pagination)
3. Brand name, product name, rating + review count
4. MRP strikethrough + discounted price + discount % badge
5. Size/variant selector chips
6. "Add to Cart" berry CTA + "Wishlist" heart button
7. Description accordion
8. Ingredients tab
9. "You may also like" horizontal scroll
10. Reviews preview (3 cards) + "See All Reviews" link

---

### 20. Product Reviews
**File:** [`ProductReviewsScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/shop/ProductReviewsScreen.tsx)
**Route:** `app/(customer)/product-reviews.tsx`
**Category:** Shop

**Layout:**
- Rating summary (5-star breakdown bar chart)
- Filter chips: All, 5★, 4★, With Photos, Verified
- Review cards: avatar, name (masked), skin type, date, star rating, text, reaction photos

---

### 21. Search & Filters
**File:** [`SearchAndFiltersScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/shop/SearchAndFiltersScreen.tsx)
**Route:** `app/(customer)/search-filters.tsx`
**Category:** Shop

**Layout:**
- Autofocus search input with clear button
- Recent searches chips
- Active filter pills (dismissible)
- Filter sheet: Category, Brand, Price Range, Skin Type, Concern
- Results list → taps navigate to Product Detail

---

### 22. Wishlist
**File:** [`WishlistScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/shop/WishlistScreen.tsx)
**Route:** `app/(customer)/wishlist.tsx`
**Category:** Shop

**Layout:**
- "My Wishlist" header + item count badge
- Product card list: image, name, price, "Add to Cart" + remove button
- Empty state: heart outline icon + "Save your favourites" message
- Price drop notification toggle per item

---

### 23. Scan Intro
**File:** [`ScanIntroScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/ScanIntroScreen.tsx)
**Route:** `app/(customer)/scan/intro.tsx`
**Category:** AI Face Scan

**Layout:**
- GlowVAI AI Scan branded header
- 3 preparation instruction cards (coral line-art icons):
  - Wash your face, Remove glasses, Ensure good lighting
- Privacy assurance: "Scanned locally · Not stored · Cosmetic only"
- "Start Scan" CTA → `scan/camera`
- "Upload Photo" link → `scan/gallery`

---

### 24. Face Scan Entry
**File:** [`FaceScanScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/FaceScanScreen.tsx)
**Route:** `app/(customer)/scan/index.tsx`
**Category:** AI Face Scan

**Layout:**
- Full-screen animated scan preparation view
- 4-phase scanner animation (pulsing ring, grid overlay, detection dots)
- Face position guide animation
- CTA → opens camera

---

### 25. Camera Viewfinder ⭐ UPDATED
**File:** [`CameraViewfinderScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/CameraViewfinderScreen.tsx)
**Route:** `app/(customer)/scan/camera.tsx`
**Category:** AI Face Scan

> [!IMPORTANT]
> **Real Camera Implementation** — This screen uses `expo-camera` v16 `CameraView` component. No placeholder images. The device's front-facing camera opens immediately.

**Layout:**
- Deep berry header: back button, "Glow AI Scan" title, flip camera button
- **Live `CameraView` (front camera)** fills the entire screen
- AR overlays on top of live feed:
  - Berry pill: Face detected ✓ · Looking at camera ✓ · Lighting good ✓ · Face centered ✓
  - Green oval face reticle (240×320px) with 4-corner L-brackets
  - Eye level guide (2 white dots + horizontal line)
  - Chin guide line
  - "Perfect distance!" badge
  - No sunglasses ✓ · No cap or hat ✓ · Face clearly visible ✓
- Bottom controls:
  - Smile guide: 😊 "Give a gentle natural smile"
  - Large circular shutter button (white ring + camera icon)
  - Privacy note: "Your face is checked only to position and validate the scan"

**Camera Logic:**
- `useCameraPermissions()` — requests on mount, shows grant-access screen if denied
- `cameraRef.takePictureAsync({ quality: 0.85 })` — captures real photo
- Passes `photoUri` to preview via: `router.push({ pathname: '/scan/preview', params: { photoUri } })`
- Flip button: toggles `facing` state `'front' ↔ 'back'`

**Permission Screen (if denied):**
- Camera icon + "Camera Access Needed" title
- "Grant Camera Access" CTA → `requestPermission()`
- "Go Back" link

---

### 26. Face Scan Camera (Alt) ⭐ UPDATED
**File:** [`FaceScanCameraScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/FaceScanCameraScreen.tsx)
**Category:** AI Face Scan

> [!IMPORTANT]
> **Real Camera Implementation** — Replaces previous grey silhouette placeholder. Now uses `expo-camera` `CameraView`.

**Layout:**
- White background header: back button, "Skip" link
- Headline: *"it's time to / give a second chance to your skin"*
- Camera box (78% width × 44% height, rounded-28 corners): **Live `CameraView`** with dashed oval face guide overlay
- Flip button below camera box
- 3 instruction icons: Wash face · Remove specs · Good lighting
- Bottom row: Gallery shortcut | Shutter button | Flip camera

**Camera Logic:**
- `takePictureAsync({ quality: 0.85 })` on shutter press
- Passes `photoUri` → preview screen via params
- Separate gallery shortcut → picks photo from device

---

### 27. Gallery Upload ⭐ UPDATED
**File:** [`GalleryUploadScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/GalleryUploadScreen.tsx)
**Route:** `app/(customer)/scan/gallery.tsx`
**Category:** AI Face Scan

> [!IMPORTANT]
> **Real Device Gallery** — Uses `expo-image-picker` to open the actual device photo library. No fake stock photo thumbnails.

**Layout:**
- Berry header: "Choose a clear photo"
- Illustration card: shows selected photo preview (or image icon placeholder if none selected yet)
- Headline + subtitle
- 4 photo quality tips grid: One face only · No sunglasses · Bright light · No filter
- Privacy note: "Your photo is used only for this scan"

**Gallery Logic:**
- `ImagePicker.launchImageLibraryAsync({ mediaTypes: Images, allowsEditing: true, aspect: [3,4], quality: 0.9 })`
- On pick: `router.push({ pathname: '/scan/preview', params: { photoUri: asset.uri } })`
- Shows selected photo immediately in illustration card preview
- "Open Camera" secondary CTA → `/scan/camera`

---

### 28. Image Preview & Quality Check ⭐ UPDATED
**File:** [`ImagePreviewScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/ImagePreviewScreen.tsx)
**Route:** `app/(customer)/scan/preview.tsx`
**Category:** AI Face Scan

> [!IMPORTANT]
> **Shows actual captured photo** — Reads `photoUri` from `useLocalSearchParams()`. Never uses hardcoded stock images.

**Layout:**
- Berry header: back button, "Check your scan" title, retake icon
- **Preview card (280px height):** Displays `photoUri` from route params with face mesh overlay on top:
  - Dashed oval reticle (180×230px)
  - Eye socket outlines (left + right)
  - Nose vertical guide line
  - Mouth arc guide
  - 12 facial contour dots (coral)
  - "Skin mask 224 × 224" badge (bottom-right)
- Fallback: `ImageOff` icon + "No photo found — Please retake" if no URI
- Quality status banner:
  - ✅ "Good image quality — Your face is centered and clearly visible" (soft green)
  - ⚠️ "This photo needs a quick adjustment" (soft coral)
- Quality checklist cards: Face position · Lighting · Sharpness · Skin area
- Privacy note: "The mesh helps us check positioning; it does not identify you"
- Sticky footer: "Use this photo" (primary) · "Retake" (secondary outline)

**Data Flow:**
```
Camera/Gallery → captures real photoUri → route params → ImagePreviewScreen reads params.photoUri → displays actual photo
```

---

### 29. Scan Analyzing
**File:** [`ScanAnalysisScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/ScanAnalysisScreen.tsx)
**Route:** `app/(customer)/scan/analyzing.tsx`
**Category:** AI Face Scan

**Layout:**
- Animated circular progress ring (berry → coral gradient)
- 4-step checklist animating in sequence:
  - Detecting face landmarks...
  - Analysing skin zones...
  - Running AI diagnostics...
  - Preparing your report...
- Each step: checkmark appears when "complete"
- Calls `/api/v1/analyse` → FastAPI backend → CNN model
- On success → `scan/report.tsx`
- On failure → `scan/failed.tsx`

---

### 30. Scan Failed
**File:** [`ScanFailedScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/ScanFailedScreen.tsx)
**Route:** `app/(customer)/scan/failed.tsx`
**Category:** AI Face Scan

**Layout:**
- Warning triangle icon (amber)
- Error reason (e.g., "Face not clearly detected", "Low lighting", "Network error")
- 3 correction tips cards
- "Try Again" (berry CTA) + "Upload Different Photo" (outline)

---

### 31. Skin Report Overview
**File:** [`SkinReportScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/scan/SkinReportScreen.tsx)
**Route:** `app/(customer)/scan/report.tsx`
**Category:** Diagnostics

**Layout:**
1. **Hero card** (berry background): SCAN COMPLETE badge · Skin type result (e.g., "Combination Skin") · 82% confidence bar · Description
2. **3 Quick metric cards**: Scan Quality 91% · Skin Balance 74/100 · Main Focus: Tone
3. **Visible Skin Insights** section: 3 insight cards (Oiliness, Uneven tone, Dry areas) each with progress bar + confidence %
4. **Face Zone Summary card**: minimal face oval diagram + coloured dots (T-zone, cheeks) + legend
5. **Your Simple Routine** (AM + PM cards side-by-side)
6. **Recommended for You** — 2 product cards (serum + moisturizer) with "ADD" buttons linked to `useCartStore`
7. **Medical disclaimer** card (amber)
8. Sticky footer: "Retake" (outline) + "Shop This Routine" (berry)

> [!NOTE]
> Product images in this screen use Unsplash skincare product shots (serums/moisturizers) — NOT face photos. This is correct and intentional.

---

### 32. AI Dermatologist Chat
**File:** [`AiDermatologistChatScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/recommendations/AiDermatologistChatScreen.tsx)
**Category:** AI Consultation

**Layout:**
- Chat interface: user bubbles (right, berry) + AI bubbles (left, soft lavender)
- AI avatar with "GlowVAI AI" label
- Suggested question chips: "What ingredients suit me?", "Is this product safe?"
- Inline product recommendation cards within chat
- Text input + send button footer
- Non-medical disclaimer in first message

---

### 33. Express Routine Checkout
**File:** [`ExpressRoutineCheckoutScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/recommendations/ExpressRoutineCheckoutScreen.tsx)
**Route:** `app/(customer)/express-checkout.tsx`
**Category:** Quick Commerce

**Layout:**
- "Your AI Routine Bundle" header
- Product list from AI recommendation
- Bundle discount badge (e.g., "-20% AI Discount")
- Total price + estimated delivery (10 min)
- "Tap to Pay ₹XXX" — success green CTA button
- One-tap checkout → skips cart → goes to payment

---

### 35. Cart
**File:** [`CartScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/cart/CartScreen.tsx)
**Route:** `app/(customer)/(tabs)/cart.tsx`
**Category:** Cart & Checkout

**Layout:**
- Cart item list: product image, name, brand, quantity stepper (+/-), price, remove button
- Free delivery progress bar: "Add ₹XX more for free delivery"
- Promo code input field
- Glow Coins toggle (if available)
- Bill Summary card: subtotal, delivery fee, discount, taxes, **Total**
- "Proceed to Checkout" berry CTA

**State:**
- Empty: shopping bag illustration + "Your cart is empty" + "Start Shopping" CTA
- Loading: skeleton placeholders
- Connected to `useCartStore` (Zustand)

---

### 36. Checkout Review
**File:** [`CheckoutReviewScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/checkout/CheckoutReviewScreen.tsx)
**Route:** `app/(customer)/checkout-review.tsx`
**Category:** Checkout

**Layout:**
- Delivery address card (editable)
- Estimated delivery time chip
- Order items summary (collapsed)
- Bill summary (expanded)
- "Place Order" → `payment-method.tsx`

---

### 37. Payment Method Select
**File:** [`PaymentMethodSelectScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/checkout/PaymentMethodSelectScreen.tsx)
**Route:** `app/(customer)/payment-method.tsx`
**Category:** Payment

**Layout:**
- Payment options list:
  - UPI (GPay, PhonePe, BHIM icons)
  - Credit / Debit Card
  - Net Banking
  - Cash on Delivery
- Saved UPI IDs carousel
- Selected: berry radio + green checkmark
- "Pay ₹XXX" CTA → `payment-processing.tsx`

---

### 38. Cashfree Payment Processing
**File:** [`CashfreePaymentProcessingScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/checkout/CashfreePaymentProcessingScreen.tsx)
**Route:** `app/(customer)/payment-processing.tsx`
**Category:** Payment

**Layout:**
- Full-screen native Cashfree SDK WebView
- GlowVAI loading spinner overlay while SDK initialises
- Cashfree payment form (card / UPI / netbanking)
- On success callback → `payment-success.tsx`
- On failure callback → `payment-failed.tsx`

---

### 39. Payment Success
**File:** [`PaymentSuccessScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/checkout/PaymentSuccessScreen.tsx)
**Route:** `app/(customer)/payment-success.tsx`
**Category:** Payment

**Layout:**
- Animated success checkmark (scale-in, green)
- "Order Placed! 🎉" headline
- Order ID + estimated delivery time
- "Track Order" CTA → `orders/[id].tsx`
- "Continue Shopping" link → Home

---

### 40. Payment Failed
**File:** [`PaymentFailedScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/checkout/PaymentFailedScreen.tsx)
**Route:** `app/(customer)/payment-failed.tsx`
**Category:** Payment

**Layout:**
- Red/coral X circle icon
- "Payment Failed" headline + reason (bank decline, network, timeout)
- "Retry Payment" (berry) + "Try Different Method" (outline)
- Auto-refund note for pre-deducted amounts

---

### 41. Orders List
**File:** [`OrdersListScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/orders/OrdersListScreen.tsx)
**Route:** `app/(customer)/orders/index.tsx`
**Category:** Orders

**Layout:**
- Tab filter: Active (default) · Past
- Order card: order ID, date, item thumbnails, status badge, total price
- Status badges: Placed (blue) · Preparing (amber) · Out for Delivery (cobalt) · Delivered (green) · Cancelled (red)
- Tap → `orders/[id].tsx`

---

### 42. Order Details
**File:** [`OrderDetailsScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/orders/OrderDetailsScreen.tsx)
**Route:** `app/(customer)/orders/[id].tsx`
**Category:** Orders

**Layout:**
- Order status progress stepper (Placed → Packed → Picked → Delivered)
- Delivery address
- Item breakdown with quantities
- Tax invoice download link
- "Track Live" → `LiveRiderTrackingScreen`
- "Cancel Order" (if Placed status) · "Rate & Review" (if Delivered)
- "Need Help?" CTA → Support

---

### 43. Order Tracking Feed
**File:** [`OrderTrackingFeed.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/orders/OrderTrackingFeed.tsx)
**Route:** `app/(customer)/order-tracking.tsx`
**Category:** Orders & Delivery

**Layout:**
- Real-time status feed (Firestore `onSnapshot`)
- Timeline entries: timestamp + event description
- Active event: berry highlight with animated pulse dot

---

### 44. Live Rider Tracking (Map)
**File:** [`LiveRiderTrackingScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/orders/LiveRiderTrackingScreen.tsx)
**Category:** Delivery

**Layout:**
- Full-screen `MapView`
- Rider marker (scooter icon, animated pulse)
- Customer delivery pin
- Route polyline (cobalt blue)
- Bottom sheet: rider name, estimated arrival, "Call Rider" button
- Real-time updates via Firestore `orders/{orderId}/riderLocation`

---

### 45. Order Tracking Live
**File:** [`OrderTrackingLive.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/orders/OrderTrackingLive.tsx)
**Category:** Delivery

**Layout:**
- Live status banner: "Your order is on the way!"
- ETA chip (updating every 30s)
- Rider info card
- Chat / call support quick access

---

### 46. Express Order Flow
**File:** [`ExpressOrderFlowScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/orders/ExpressOrderFlowScreen.tsx)
**Category:** Quick Commerce

**Layout:**
- Animated order timeline for express/10-min delivery
- Darkstore confirmation step
- Rider assignment step
- En-route step with live map

---

### 47. Rate Order & Delivery
**File:** [`RateOrderDeliveryScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/orders/RateOrderDeliveryScreen.tsx)
**Category:** Reviews

**Layout:**
- 5-star rating selector (tap to fill)
- Two sections: Product Quality rating + Delivery Experience rating
- Photo upload option (reaction/product photos)
- Text review input
- "Submit Rating" CTA → writes to Firestore `reviews`

---

### 48. Profile Overview
**File:** [`ProfileOverviewScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/profile/ProfileOverviewScreen.tsx)
**Route:** `app/(customer)/(tabs)/profile.tsx`
**Category:** Account

**Layout:**
- User avatar + name + phone number header (berry gradient)
- Skin Report quick-access card (plum accent)
- Hub tiles: Orders · Wishlist · Referrals · Beauty Protection
- Recent order card
- Settings rows: Help & Support · Settings & Privacy · About GlowVAI
- "Sign Out" button (destructive)

---

### 49. Referral Hub & Student Rewards
**File:** [`ReferralHubScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/referrals/ReferralHubScreen.tsx)
**Route:** `app/(customer)/referrals.tsx`
**Category:** Referrals

**Layout:**
- Glow Coins balance card (gold accent)
- Referral code with "Copy" + "Share via WhatsApp" buttons
- "For Every Friend" reward structure:
  - Friend gets: ₹100 off first order
  - You get: 200 Glow Coins
- Student Rewards section: "Verify Student ID → Extra 15% off"
- Referral earnings history list

---

### 50. Student Verification
**File:** [`StudentVerificationScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/referrals/StudentVerificationScreen.tsx)
**Route:** `app/(customer)/student-verify.tsx`
**Category:** Referrals

**Layout:**
- College name input (with autocomplete)
- College email ID input (.edu / .ac.in domain)
- College ID photo upload (camera or gallery)
- Consent checkbox: "I confirm this is a valid student ID"
- "Submit for Verification" CTA
- Status: Pending · Verified · Rejected
- Verified: "Student Verified ✓" badge + 15% discount activated

---

### 51. Help & Support
**File:** [`HelpAndSupportScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/support/HelpAndSupportScreen.tsx)
**Route:** `app/(customer)/support.tsx`
**Category:** Support

**Layout:**
- Search bar: "Search for help..."
- WhatsApp-style support card: "Chat with us on WhatsApp" (green)
- FAQ accordion (expandable):
  - Where is my order?
  - How does the AI scan work?
  - What is Beauty Protection?
  - How do I use Glow Coins?
  - How to cancel / return?
- Contact options: Call · Email · WhatsApp (3 icon buttons)

---

### 52. Settings & Security
**File:** [`SettingsAndSecurityScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/settings/SettingsAndSecurityScreen.tsx)
**Route:** `app/(customer)/settings/index.tsx`
**Category:** Security

**Layout:**
- Account security card: Biometric login toggle, Change PIN, Two-factor auth
- Privacy settings (expandable): data usage, scan data retention, marketing comms
- Notification toggles: Order updates, Promotions, Skin reminders, Price drops
- "Delete Account" (red, with confirmation modal)
- "Sign Out" CTA

---

### 53. Vendor Admin Portal
**File:** [`VendorAdminPortalScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/admin/VendorAdminPortalScreen.tsx)
**Route:** `app/(admin)/index.tsx`
**Category:** Admin

**Layout:**
- Order queue with accept/reject/assign actions
- Rider assignment dropdown
- Inventory quick-view panel
- Claims portal shortcut

---

### 54. Vendor App Dashboard
**File:** [`VendorAppScreen.tsx`](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/src/features/vendor/VendorAppScreen.tsx)
**Route:** `app/(vendor)/index.tsx`
**Category:** Vendor

**Layout:**
- Darkstore operations dashboard
- Incoming orders list with timer
- Accept / Ready / Handoff workflow
- Today's stats: orders completed, revenue, avg prep time

---

## 🔗 Cross-Screen Data Flow

```
Auth → Profile Setup → Skin Survey → Location Setup → Home
                                          ↓
Camera/Gallery → Image Preview → Scan Analyzing → Skin Report
                     (photoUri passed via route params)
                                          ↓
                               AI Recommendations → Cart → Checkout → Payment → Orders
```

---

## ✅ Build Verification

```bash
# Run from project root
npx tsc --noEmit   # → 0 errors
npx expo start --go --clear   # → Starts on port 8081
```

**Packages required for scan flow:**
```
expo-camera (~16.0.17) — CameraView for live camera feed
expo-image-picker     — Real device gallery access (installed Sep 2026)
```

---

## 📁 File Structure Reference

```
src/features/
├── onboarding/         # Screens 01–06
├── auth/               # Screens 07–08
├── profile/            # Screens 09, 48
├── shop/               # Screens 10, 17–22
├── location/           # Screens 11–15
├── scan/               # Screens 23–31 ⭐ (camera fixed)
├── recommendations/    # Screens 32–33
├── cart/               # Screen 35
├── checkout/           # Screens 36–40
├── orders/             # Screens 41–47
├── referrals/          # Screens 49–50
├── support/            # Screen 51
├── settings/           # Screen 52
├── admin/              # Screen 53
└── vendor/             # Screen 54

app/
├── index.tsx                    # Screen 01 (Splash)
├── (auth)/                      # Screens 02–10
├── (customer)/
│   ├── (tabs)/                  # Screens 16, 17, 35, 48
│   ├── scan/                    # Screens 23–31
│   ├── location/                # Screens 11–15
│   ├── product/                 # Screens 19–20
│   ├── orders/                  # Screens 41–42
│   └── settings/                # Screen 52
├── (admin)/                     # Screen 53
└── (vendor)/                    # Screen 54
```
