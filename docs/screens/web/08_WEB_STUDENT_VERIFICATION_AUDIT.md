# Web Screen 08: Institutional Student Verification Audit Portal

## 📌 Overview
The **Student Verification Audit Portal** is an admin backoffice tool used to inspect and verify college ID cards uploaded by students seeking GlowVAI referral coins and student discounts.

---

## 🎨 UI Architecture & Layout Specs

### 1. Student Verification Table
- Search bar (by College Name, Student Name, Roll Number)
- Status filter: `Pending Audit (24)` · `Verified` · `Rejected`
- Columns: Request ID, Student Name, Institution Name, ID Card Expiry, Date Uploaded

### 2. ID Card Document Inspector
- Dual-sided image viewer: Front side of College ID + Back side
- OCR extraction overlay: Auto-detects student name, institution, and validity year
- Actions: `[ Verify Student & Credit 500 Coins ]` · `[ Flag Fraudulent ID ]`
