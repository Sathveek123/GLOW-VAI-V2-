# GlowVAI V2 — Technology Stack & Architectural Blueprint

## 1. Core Technology Choices

| Layer | Technology | Rationale & Specifications |
| :--- | :--- | :--- |
| **Mobile Client** | React Native (Expo SDK 51+) | Native cross-platform performance with rapid iteration, deep Android API integration. |
| **App Routing** | Expo Router (File-based) | Type-safe URL-based routing, deep linking support, standard Android back navigation. |
| **Language** | TypeScript (Strict Mode) | Strong compile-time typing, strict null checks, prevention of runtime `undefined` bugs. |
| **Authentication** | Firebase Authentication | Phone Number login with OTP verification, recaptcha verification on Android. |
| **Primary Database** | Cloud Firestore | Real-time listeners for order tracking, highly scalable NoSQL document structure. |
| **Cloud Storage** | Firebase Storage | Secure storage for product images, user skin scan captures (temporary/protected), and claim proofs. |
| **Express App Server** | Node.js + Express (`glowvai-backend`) | Express server on Port 5000 handling user profiles, Cashfree PG orders, and Google Play Store billing. |
| **AI Inference & Agent** | Python FastAPI (`backend`) | Python server on Port 10000 serving PyTorch CNN models (`cnn_model/`) and autonomous clinical tools. |
| **Payment Gateway** | Cashfree PG SDK | RBI-compliant checkout supporting UPI Intent, Cards, Net Banking, and instant refunds. |
| **Mapping & Location** | Google Maps Platform | Maps SDK for Android, Places API, and Ray-Casting Point-in-Polygon (PIP) geofence algorithms. |
| **AI / Computer Vision** | PyTorch Multi-Task CNN | Custom deep learning architecture analyzing acne, hydration, texture, sebum, sensitivity, and skin tone. |
| **Admin Portal** | Web Admin Portal (`admin/`) | Operational dashboard for vendor management, dark store geofence editing, catalog, and claims. |

---

## 2. Directory Architecture

```
GlowVAI-V2/
├── app/                  # Expo Router mobile application screens & navigation tabs
├── src/                  # Feature modules (auth, scan, shop, cart, orders, location, referrals)
├── glowvai-backend/      # Express Node.js Backend API (Port 5000)
├── backend/              # Python FastAPI AI Inference & Autonomous Agent Server (Port 10000)
├── cnn_model/            # PyTorch multi-task CNN skin diagnostic model & checkpoints
├── admin/                # Web Admin Portal for dark store operations & catalog
├── functions/            # Firebase Cloud Functions (TypeScript serverless backend)
├── docs/                 # Exhaustive technical documentation & architecture guides
├── logs/                 # Development logs and architectural decision records (ADRs)
├── scripts/              # Local dev seed scripts and emulator launchers
└── tests/                # Unit, integration, and security rule tests
```

---

## 3. Environment & Dependency Standards
- **Zero Mock Standard**: All network, Firebase, Cashfree PG, and diagnostic calls run authentic logic.
- **Strict Environment Isolation**: Sensitive keys configured exclusively via `.env` and environment variables.
- **Offline Resilience**: Caching via Firestore persistence with optimistic UI updates and server reconciliation.
