# GlowVAI V2 — Development & Deployment Guide

## 1. Prerequisites & System Setup

Before developing or deploying GlowVAI V2, ensure your environment meets the following requirements:
- **Node.js**: `v18.x` or `v20.x` LTS installed.
- **Python**: `v3.10` or higher installed.
- **Java Development Kit (JDK)**: JDK 17 (required for Android builds).
- **Android Studio & SDK**: Android SDK 34, Android Virtual Device (AVD) setup.
- **Firebase CLI**: `npm install -g firebase-tools`.
- **EAS CLI**: `npm install -g eas-cli`.

---

## 2. Local Development Environment Setup

### 2.1 Repository Setup
```bash
# Navigate to project workspace
cd "d:\Client Projects\GlowVai\glowvaisathweek-main"

# Install Mobile App Dependencies
npm install
```

### 2.2 Environment Variables Configuration
Copy `.env.example` to `.env` in the root directory and specify your real Firebase credentials and Google Maps API keys:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=glowvai-v2.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=glowvai-v2
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=glowvai-v2.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=1:109876543210:android:abc123def456
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
EXPO_PUBLIC_EXPRESS_BACKEND_URL=http://10.0.2.2:5000
EXPO_PUBLIC_FASTAPI_BACKEND_URL=http://10.0.2.2:10000
```
> **Note**: In Android Emulator, `10.0.2.2` maps to host computer's `localhost`.

### 2.3 Starting Local Services

#### A. Mobile App (Expo Metro Bundler)
```bash
npx expo start --android
```

#### B. Express Backend (`glowvai-backend`)
```bash
cd glowvai-backend
npm install
node server.js
# Runs on http://localhost:5000
```

#### C. Python FastAPI AI Backend (`backend`)
```bash
# From workspace root:
pip install -r backend/requirements.txt
python -m uvicorn backend.main:app --host 0.0.0.0 --port 10000 --reload
# Runs on http://localhost:10000
```

---

## 3. Production Deployment Guide

### 3.1 Python AI Backend Deployment (Render Cloud)
The repository includes a production `render.yaml` manifest:
- **Service Type**: Web Service (`python`)
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `python -m uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `CASHFREE_ENVIRONMENT`: `production` or `sandbox`
  - `CASHFREE_APP_ID`: Your production Cashfree App ID
  - `CASHFREE_SECRET_KEY`: Your production Cashfree Secret Key
  - `GOOGLE_MAPS_API_KEY`: Your Google Cloud Server Maps API Key

### 3.2 Firebase Firestore Rules & Indexes Deployment
Deploy security rules and database composite indexes via Firebase CLI:
```bash
firebase login
firebase use glowvai-v2
firebase deploy --only firestore
```

### 3.3 Android Production APK / AAB Build (EAS Build)
Generate production Android app binary via Expo Application Services:
```bash
# Preview APK build for internal testing
eas build -p android --profile preview

# Production AAB build for Google Play Store upload
eas build -p android --profile production
```

---

## 4. Maintenance & Diagnostic Verification

- **Verify Firestore Rules**: Run security rules simulator in Firebase Console.
- **Verify Backend Connectivity**: Curl health endpoints:
  - Express: `curl http://localhost:5000/health`
  - FastAPI AI: `curl http://localhost:10000/health`
- **Audit Git Cleanliness**: Ensure no `.env` or credentials are committed to version control.
