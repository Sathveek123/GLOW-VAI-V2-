# GlowVAI V2 — Backend API Specification

This document details all API endpoints across the **GlowVAI Dual Backend Architecture**:
1. **Node.js / Express Server** (`glowvai-backend/server.js` - Port 5000)
2. **Python FastAPI AI Server** (`backend/main.py` - Port 10000)

---

## 1. Node.js Express Backend API (`glowvai-backend/server.js`)

### 1.1 Health & Audit
- **`GET /health`**
  - **Description**: Returns live system health, active environment (`production` vs `development`), and service status.
  - **Response (200 OK)**:
    ```json
    {
      "status": "online",
      "service": "GlowVAI Express Backend",
      "timestamp": "2026-09-07T18:45:00Z"
    }
    ```

### 1.2 User Profile & Location Services
- **`POST /api/users/save`**
  - **Description**: Saves or updates user profile details and default shipping address in Cloud Firestore.
  - **Request Body**:
    ```json
    {
      "uid": "USER_12345",
      "phoneNumber": "+919876543210",
      "displayName": "Jane Doe",
      "address": {
        "street": "MG Road",
        "city": "Vijayawada",
        "pincode": "520010",
        "latitude": 16.5062,
        "longitude": 80.6480
      }
    }
    ```
  - **Response (200 OK)**: `{"status": "success", "message": "User profile saved"}`

### 1.3 Order & Cashfree Payment Gateways
- **`POST /api/orders/create`**
  - **Description**: Creates a Cashfree order server-side using secure API credentials and generates a `payment_session_id`.
  - **Request Body**:
    ```json
    {
      "orderId": "ORD_991823",
      "orderAmount": 799.00,
      "orderCurrency": "INR",
      "customerDetails": {
        "customerId": "USER_12345",
        "customerName": "Jane Doe",
        "customerEmail": "jane@example.com",
        "customerPhone": "+919876543210"
      }
    }
    ```
  - **Response (200 OK)**:
    ```json
    {
      "status": "success",
      "paymentSessionId": "session_991823_xyz",
      "orderId": "ORD_991823"
    }
    ```

- **`POST /api/orders/verify`**
  - **Description**: Server-side verification of payment completion with Cashfree gateway. Updates Firestore order status to `PAID` / `CONFIRMED`.
  - **Request Body**: `{"orderId": "ORD_991823"}`
  - **Response (200 OK)**: `{"status": "success", "isPaid": true, "orderStatus": "PAID"}`

### 1.4 Maps & In-App Purchase Proxy
- **`GET /api/maps/geocode?address=Vijayawada`**
  - **Description**: Geocodes address via server-side Google Maps SDK.
- **`POST /api/billing/verify-purchase`**
  - **Description**: Verifies Google Play Store In-App Purchase and subscription purchase tokens.

---

## 2. Python FastAPI AI Engine API (`backend/main.py`)

### 2.1 Service Health
- **`GET /` & `GET /health`**
  - **Description**: Health check for Render cloud deployment.

### 2.2 Face Scan Diagnostics & Inference
- **`POST /predict`** or **`POST /api/v1/scan/analyze`**
  - **Description**: Accepts face image file upload (`multipart/form-data`) and runs multi-task PyTorch CNN inference.
  - **Request**: Form data with `image` (binary file) and `userId` (string).
  - **Response (200 OK)**:
    ```json
    {
      "success": true,
      "scanId": "SCAN-CNN-1725712345",
      "skinType": "COMBINATION",
      "overallScore": 84,
      "metrics": {
        "hydration": { "score": 78, "status": "GOOD", "notes": "Adequate moisture retention." },
        "acne": { "score": 84, "status": "GOOD", "notes": "Mild T-zone blemishes." },
        "texture": { "score": 82, "status": "GOOD", "notes": "Refined pore distribution." },
        "pigmentation": { "score": 88, "status": "EXCELLENT", "notes": "Minimal UV damage." },
        "sebum": { "score": 74, "status": "GOOD", "notes": "Moderate lipid balance." },
        "sensitivity": { "score": 90, "status": "EXCELLENT", "notes": "Resilient barrier." }
      },
      "detectedConcerns": ["T-Zone Sebum Control", "Barrier Hydration"],
      "recommendations": [
        "Niacinamide 5% + Zinc 1%",
        "Ceramide Barrier Gel",
        "Broad Spectrum SPF 50+"
      ]
    }
    ```

### 2.3 Autonomous AI Dermatologist Agent
- **`GET /api/v1/agent/tools`**: Returns JSON schema of clinical agent tools.
- **`POST /api/v1/agent/tool/execute`**: Executes specific clinical tool.
- **`POST /api/v1/agent/consult`**:
  - **Description**: Multi-step ReAct agent consultation endpoint returning markdown analysis, ingredient layering safety check, and 1-click routine checkout.

### 2.4 Server-Side Cashfree & Google Maps Fallback Endpoints
- **`POST /api/v1/payments/create-session`**: Cashfree sandbox/production payment session creator.
- **`GET /api/v1/payments/verify/{order_id}`**: Payment verification.
- **`POST /api/v1/maps/geocode`**: Server-side Google geocoder.
- **`POST /api/v1/maps/reverse-geocode`**: Reverse geocoder (lat/lng -> address text).
