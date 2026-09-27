# Web Screen 06: Dark Store 90s SLA Dispatch Terminal

## 📌 Overview
The **Dark Store 90s SLA Dispatch Terminal** is an industrial-grade web admin interface used by dark store managers (e.g. Benz Circle Vijayawada) to process incoming 10-minute quick-commerce orders.

---

## 🎨 UI Architecture & Layout Specs

### 1. SLA Queue Header & Audio Alert Bar
- Real-time order counter (*"3 Active Orders in Picking Queue"*)
- Audio alert toggle for incoming quick-commerce orders
- Global store status switch: `[ Darkstore Open 🟢 / Pause Orders 🔴 ]`

### 2. Live Order Kanban Board (3 Columns)
- **Column 1 — Incoming Orders (0–30s SLA)**:
  - Giant countdown clock per order (counts down from 90s in red)
  - Order ID, Item list with dark store bin location tags (e.g., `Bin A4-02`), Customer Delivery OTP
  - Action: `[ Accept & Assign Picker ]`
- **Column 2 — Picking & Packing (30–60s SLA)**:
  - Items checklist with barcode verification scanner input
  - Action: `[ Pack & Generate OTP Handshake ]`
- **Column 3 — Out for Express Delivery (60–90s SLA)**:
  - Assigned rider name, phone, live GPS map location marker
  - Delivery OTP status (`[ OTP Verified ✓ ]`)
