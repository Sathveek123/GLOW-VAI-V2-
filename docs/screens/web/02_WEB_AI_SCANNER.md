# Web Screen 02: WebRTC Browser AI Skin Diagnostic Scanner

## 📌 Overview
The **WebRTC Browser AI Skin Diagnostic Scanner** allows web browser users to perform a clinical facial scan using their laptop, desktop, or mobile web browser camera. It streams frame data via WebRTC / Canvas to the FastAPI Python backend (`/api/v1/analyse`) for PyTorch CNN inference.

---

## 🎨 UI Architecture & Layout Specs

### 1. Web Camera Viewfinder Panel (16:9 Aspect Ratio)
- **Live Stream Canvas**: High-definition HTML5 `<video>` / `<canvas>` element
- **Overlay Reticle**: Green/Berry SVG facial positioning oval with 4-corner alignment markers
- **Real-Time Guidance Bar**:
  - `[ Check ]` Lighting level
  - `[ Check ]` Distance check
  - `[ Check ]` Face position alignment
- **Control Toolbar**:
  - `[ Switch Camera ]` (if secondary webcams available)
  - `[ Take Snap ]` (Large white shutter button)
  - `[ Drag & Drop File Upload ]` fallback option for high-res JPEG/PNG images

### 2. Diagnostic Processing State
- Animated radial radar scanner overlay
- Multi-phase status progression:
  1. *Capturing 224×224 normalized face crop...*
  2. *Running PyTorch CNN Multi-Task Biometric Model...*
  3. *Auditing Active Ingredient Interactions...*
  4. *Generating Clinical Dermatologist Routine...*

### 3. Diagnostic Report Web View
- Split layout: Left column shows face image with biometrics overlay; Right column displays 7 biometric metric cards with progress bars and personalized routine recommendations.
- 1-Click CTA: `[ Add Routine to Web Cart ]`

---

## 🔒 Security & WebRTC Protocols
- Enforces HTTPS for WebRTC MediaDevices API permission
- Transient frame processing: Captured frames stay in GPU memory during inference and are purged upon session close.
