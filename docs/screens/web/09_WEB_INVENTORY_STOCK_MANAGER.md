# Web Screen 09: Dark Store Inventory & Re-order Manager

## 📌 Overview
The **Dark Store Inventory & Re-order Manager** is an automated inventory management portal tracking bin stock levels, low-stock thresholds, and replenishment orders across dark stores.

---

## 🎨 UI Architecture & Layout Specs

### 1. Inventory Summary Grid
- Total SKU count, In-Stock SKUs, Low Stock Warnings (`< 5 units`), Out of Stock SKUs
- Filter by Darkstore Location (*Vijayawada Central · Benz Circle · Guntur Express*)

### 2. Stock Management Table
- Columns: SKU ID, Product Title, Brand, Bin Location (`A1-04`), Available Stock, Reserved Stock, Low Threshold, Actions
- Inline editing: Quick stock level adjustment
- Action: `[ Trigger Auto-Replenishment Purchase Order ]`
