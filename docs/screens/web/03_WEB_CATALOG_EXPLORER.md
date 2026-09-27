# Web Screen 03: Desktop Catalog Explorer & Faceted Filter

## 📌 Overview
The **Desktop Catalog Explorer** provides a comprehensive desktop-optimized shopping environment with multi-faceted sidebar filters, instant search, price sliders, and 4-column product card grids.

---

## 🎨 UI Architecture & Layout Specs

### 1. Multi-Faceted Sidebar Filter Panel (Left Column, Width 280px)
- **Category Filter**: Checkboxes for Skin Care, Hair Care, Makeup, Body Care, Fragrance
- **Skin Concern Filter**: Acne, Hyperpigmentation, Dryness, Oiliness, Fine Lines
- **Active Ingredient Filter**: Niacinamide, Salicylic Acid, Hyaluronic Acid, Vitamin C, Retinol
- **Price Range Slider**: Dual-thumb range slider (`₹199` to `₹4,999`)
- **Express Delivery Only Toggle**: `[⚡ 10-Min Vijayawada Stock Only]`
- **Filter Reset**: `[ Clear All Filters ]`

### 2. Main Product Grid Area (Right Area)
- **Header Toolbar**: Total item count display (*"Showing 148 Clinical Products"*) + Sort Dropdown (*Relevance · Price Low-High · Price High-Low · Rating*)
- **4-Column Product Grid**:
  - High-res product thumbnail with hover swap image
  - Express Delivery badge (if dark store stocked)
  - Rating stars + total review count
  - Product title & brand
  - Price display: MRP strikethrough, Discounted price, Discount % tag
  - Inline `[ Add to Cart ]` button with optimistic quantity counter

---

## 🚀 Performance Optimizations
- Paginated or virtualized grid loading using Intersection Observer
- Client-side memoization of filtered product sets
