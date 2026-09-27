# GlowVAI Mobile Application Documentation Hub

Welcome to the official technical documentation for the **GlowVAI Mobile Application** built using React Native, Expo SDK 52, Expo Router v4, and PyTorch / FastAPI AI inference.

---

## 📱 Mobile Architecture Overview

The mobile client is designed for iOS and Android devices, focusing on sub-100ms touch responsiveness, 60fps native screen transitions, real-time camera AI face scanning, and 10-minute quick-commerce delivery.

```mermaid
graph TD
    subgraph App Shell [Expo Router v4 / React Native 0.76.9]
        Tabs[Bottom Navigation Bar]
        AuthGroup[(auth) Stack]
        CustomerGroup[(customer) Stack]
        VendorGroup[(vendor) Stack]
        AdminGroup[(admin) Stack]
    end

    subgraph Feature Modules [src/features/]
        AuthFeat[Auth & Student Verify]
        ScanFeat[expo-camera Face Scan]
        ShopFeat[Product Catalog & Search]
        CartFeat[Cart & Zustand Store]
        OrderFeat[Rider Maps & Delivery]
    end

    subgraph Native Drivers
        Reanimated[Reanimated UI Worklets]
        FastTouch[FastTouchable Touch Engine]
        Hermes[Hermes JS Bytecode Engine]
    end

    Tabs --> CustomerGroup
    CustomerGroup --> Feature Modules
    Feature Modules --> Native Drivers
```

---

## 📚 Key Mobile Technical Documents

| Document | Description | Link |
| :--- | :--- | :--- |
| **70-Screen Performance Architecture** | Master guide for sub-100ms touch latency, 60fps native navigation, Hermes engine, and 8-layer performance. | [70_SCREEN_TOUCH_AND_PERFORMANCE_OPTIMIZATION.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/docs/70_SCREEN_TOUCH_AND_PERFORMANCE_OPTIMIZATION.md) |
| **Mobile Screen Master Directory** | Complete 70-screen mobile user journey checklist, routes, and component specifications. | [docs/screens/README.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/docs/screens/README.md) |
| **Firebase Auth & OTP** | Mobile phone authentication, SMS verification, and student ID upload workflow. | [DATABASE_SCHEMA.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/docs/DATABASE_SCHEMA.md) |
| **Camera AI Diagnostics** | `expo-camera` v16 integration, live facial reticle overlays, and PyTorch CNN diagnostics. | [AI_CNN_MODEL_SPECIFICATION.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/docs/AI_CNN_MODEL_SPECIFICATION.md) |
| **Quick Commerce & Geofencing** | Point-in-Polygon (PIP) dark store geofencing and real-time rider tracking map integration. | [DELIVERY_RULES.md](file:///d:/Client%20Projects/GlowVai/glowvaisathweek-main/docs/DELIVERY_RULES.md) |

---

## ⚡ Quick Start (Mobile Developer Setup)

```bash
# 1. Install dependencies
npm install

# 2. Run Expo development server
npm run dev

# 3. Typecheck codebase
npx tsc --noEmit

# 4. Trigger live reload on connected Android device
adb -s R9ZXA0DD0NA reverse tcp:8081 tcp:8081
adb -s R9ZXA0DD0NA shell am broadcast -a com.facebook.react.devsupport.RELOAD_APP_ACTION
```

---
*Maintained by GlowVAI Mobile Engineering Team.*
