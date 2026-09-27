# Web Screen 07: Beauty Protection Warranty Claims Audit Portal

## 📌 Overview
The **Warranty Claims Audit Portal** is a web backoffice interface for customer support leads to review and audit Beauty Protection claims submitted by customers (adverse reactions, broken packaging, transit damage).

---

## 🎨 UI Architecture & Layout Specs

### 1. Claims Queue Data Table
- Filter tabs: `Pending Review` · `Approved` · `Rejected` · `Refund Processed`
- Columns: Claim ID, Customer Name, Product Name, Claim Type (*Adverse Reaction / Packaging Damage*), Date Submitted, Status Badge

### 2. Claim Audit Detail Pane (Split Modal)
- **Left Side — Proof Evidence**:
  - High-resolution photo proof uploaded by customer (reaction photo or damaged bottle)
  - Zoom inspection lens
- **Right Side — Medical & Order Context**:
  - Customer AI Scan Biometrics history
  - Product INCI ingredient list + known contraindication flags
  - AI Recommended Disposition (*"Approve Full Refund — High Sensitivity Score match"*)
  - Actions: `[ Approve Full Refund ]` · `[ Approve Product Replacement ]` · `[ Reject Claim with Reason ]`
