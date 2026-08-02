# Quick Reference Guide

## What Changed — Backend & MongoDB Integration

This document tracks the key changes made to connect the frontend to a real backend and MongoDB Atlas database, replacing the previous local-only data approach.

---

## 🔗 Backend Integration (New)

### What Was Added

A complete **Express.js backend** was created in the `backend/` directory to serve product data from MongoDB Atlas.

### Key Files

| File | Purpose |
|------|---------|
| `backend/server.js` | Express server — routes, middleware, MongoDB connection |
| `backend/models/Product.js` | Mongoose schema for the Product collection |
| `backend/.env` | Environment variables (MongoDB connection string) |
| `backend/package.json` | Backend dependencies |

### Backend Dependencies Installed

```bash
npm install express mongoose cors dotenv
```

| Package  | Version  | Why                                           |
|----------|----------|-----------------------------------------------|
| express  | ^5.2.1   | REST API framework                            |
| mongoose | ^9.9.0   | MongoDB ODM for schema/model management       |
| cors     | ^2.8.6   | Allow frontend (port 3000) to call backend (port 5000) |
| dotenv   | ^17.4.2  | Load `MONGO_URI` from `.env` file securely    |

---

## 🗄️ MongoDB Atlas Connection (New)

### Implementation Details

**File:** `backend/server.js` — Lines 1–29

1. **DNS Fix** (Line 1–2): Custom DNS servers (`8.8.8.8`, `1.1.1.1`) set to resolve Atlas hostnames reliably
2. **dotenv** (Line 7): `require('dotenv').config()` loads `.env` variables
3. **Connection String** (Line 13): `MONGO_URI` read from `process.env`
4. **Mongoose Connect** (Lines 21–29): `mongoose.connect(MONGO_URI, { dbName: 'ecommerce' })`

### Connection String Format

```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority
```

Stored in: `backend/.env` → `MONGO_URI`

### Database Details

- **Cluster:** `itsimplera-frontend.kstkkn8.mongodb.net`
- **Database:** `ecommerce`
- **Collection:** `products`

### Product Schema (backend/models/Product.js)

```javascript
{
  name:        { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  image:       { type: String, default: '' },
  description: { type: String, default: '' },
  category:    { type: String, required: true, trim: true },
  stock:       { type: Number, required: true, min: 0, default: 0 },
  // Mongoose auto-adds: createdAt, updatedAt (timestamps: true)
}
```

---

## 🌐 CORS Configuration (New)

### What It Does

Allows the React frontend at `http://localhost:3000` to make HTTP requests to the Express backend at `http://localhost:5000`.

### Where It Lives

**File:** `backend/server.js`
- **Line 5:** `const cors = require('cors');`
- **Line 16:** `app.use(cors());`

Without this, the browser blocks cross-origin `fetch()` calls with a CORS policy error.

---

## 🔒 .env and .gitignore (Changed)

### What Changed

Added `.env` to `.gitignore` so the MongoDB connection string (which contains the database password) is **not pushed to GitHub**.

**File:** `.gitignore` — Added line:
```
.env
```

Previously only `.env.local`, `.env.development.local`, `.env.test.local`, and `.env.production.local` were listed. The plain `.env` was missing.

---

## 📡 API Endpoints (New)

All served from `http://localhost:5000`:

| Method | Endpoint                              | Purpose                  |
|--------|---------------------------------------|--------------------------|
| GET    | `/`                                   | Welcome message          |
| GET    | `/api/health`                         | DB connection status     |
| GET    | `/api/products`                       | Get all products         |
| GET    | `/api/products?category=Electronics`  | Filter by category       |
| GET    | `/api/products?search=laptop`         | Search by name           |
| GET    | `/api/products/:id`                   | Get one product by ID    |
| POST   | `/api/products`                       | Create product           |
| PUT    | `/api/products/:id`                   | Update product           |
| DELETE | `/api/products/:id`                   | Delete product           |

### POST/PUT Body (JSON)

```json
{
  "name": "Product Name",
  "price": 99,
  "image": "https://images.unsplash.com/photo-...",
  "description": "Description text",
  "category": "Electronics",
  "stock": 10
}
```

Required for POST: `name`, `price`, `category`

---

## 🔄 Frontend Changes — Fetching from Backend

### ProductListings.js (Changed)

**Before:** Products loaded from local `products.json` file.
**After:** Products fetched from backend API via `fetch()`.

```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/products";

const response = await fetch(API_URL);
const data = await response.json();
const productList = data.data || [];
```

- Search, category, price, and stock filters are applied **client-side** after fetching all products
- Sorting (newest, price low/high) also done client-side

### ProductDetails.js (Changed)

**Before:** Product looked up from local data by ID.
**After:** Single product fetched from `GET /api/products/:id`.

```javascript
const response = await fetch(`${API_BASE_URL}/${id}`);
const data = await response.json();
const productData = data.data || data;
```

- Related products fetched separately from `GET /api/products` and filtered by matching category

### ProductCard.js (Changed)

Updated to use `product._id` (MongoDB ObjectId) instead of numeric `product.id`:

```javascript
const productId = product._id || product.id;
```

### CartContext.js (Changed)

Updated to handle MongoDB `_id` field alongside local `id`:

```javascript
const targetId = product._id || product.id;
```

All cart operations (add, remove, increase, decrease) check both `_id` and `id` for compatibility.

---

## ⚠️ Image URL Issue (Identified & Documented)

### Problem

Product images stored in MongoDB used **Unsplash webpage URLs** (HTML pages), not direct image URLs:

```
❌ https://unsplash.com/photos/open-macbook-air-on-wooden-desk-RSCirJ70NDM
```

These are HTML pages and cannot be rendered in `<img>` tags.

### Solution

Replace with **direct image URLs** from `images.unsplash.com`:

```
✅ https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600
```

**How to get the correct URL:** Open the Unsplash page → Right-click the image → Copy image address.

---

## 🚀 How to Run (Two Terminals)

### Terminal 1 — Backend
```bash
cd backend
npm install
npm start
# Server runs at http://localhost:5000
```

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000
```

---

## Authentication & Checkout Features (Previous Changes)

### Login Page (`/login`)

- Email and Password input fields
- Show/Hide password toggle
- Real-time validation
- Auto-redirect on successful login
- Sign up link for new users

**Test with:**
```
Email: john@example.com
Password: password123
```

### Signup Page (`/signup`)

- Full Name, Email, Password, Confirm Password fields
- Individual Show/Hide toggles for password fields
- Real-time field validation
- Password matching validation
- Auto-redirect on successful signup

**Test with:**
```
Full Name: John Doe
Email: john@example.com
Password: password123
Confirm Password: password123
```

### Checkout Page (`/checkout`)

- Shipping details form (name, email, phone, address, city, ZIP)
- Order summary with cart items
- Real-time validation
- Success modal on order placement

**Test with:**
```
Full Name: John Doe
Email: john@example.com
Phone: 12345678901
Address: 123 Main Street
City: New York
ZIP: 10001
```

---

## ✅ Validation Rules

| Field            | Rule                              | Error Message                                    |
|------------------|-----------------------------------|--------------------------------------------------|
| Email            | Required, valid format            | "Please enter a valid email address"             |
| Password         | Required, min 8 characters        | "Password must be at least 8 characters long"    |
| Confirm Password | Required, must match password     | "Passwords do not match"                         |
| Phone            | Required, 11 digits               | "Please enter a valid 11-digit phone number"     |
| ZIP Code         | Required, 5 digits                | "Please enter a valid 5-digit ZIP code"          |
| Full Name        | Required                          | "Full Name is required"                          |
| Address          | Required                          | "Address is required"                            |
| City             | Required                          | "City is required"                               |

---

## 🎨 Design Features

### Color Scheme
- **Primary Blue:** #2563eb (buttons, links, highlights)
- **Success Green:** #28a745 (success messages)
- **Error Red:** #dc3545 (invalid fields)
- **Dark Gray:** #1f2937 (text, headers)
- **Light Gray:** #f5f7fa (backgrounds)
- **Card Blue:** #0d6efd (product card price, Add to Cart button)

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px – 1199px
- Mobile: < 768px

---

## 🧪 Testing Checklist

### Backend API
- [ ] `GET /` — Returns welcome message
- [ ] `GET /api/health` — Shows DB connected
- [ ] `GET /api/products` — Returns all products from MongoDB
- [ ] `GET /api/products/:id` — Returns single product
- [ ] `POST /api/products` — Creates new product
- [ ] `PUT /api/products/:id` — Updates product
- [ ] `DELETE /api/products/:id` — Deletes product

### Frontend ↔ Backend
- [ ] Product listings page loads products from API
- [ ] Product details page loads single product by ID
- [ ] Search filter works on fetched data
- [ ] Category filter works
- [ ] Price filter works
- [ ] In-stock filter works
- [ ] Add to cart works with MongoDB `_id`
- [ ] Cart persists in localStorage on refresh

### Auth & Checkout
- [ ] Login form validation works
- [ ] Signup form validation works
- [ ] Checkout form validation works
- [ ] Cart items show in checkout summary

---

## 💾 Data Persistence

| Data             | Storage         | Key          | Context          |
|------------------|-----------------|--------------|------------------|
| Cart items       | localStorage    | `cartItems`  | CartContext.js   |
| Auth user        | localStorage    | `authUser`   | AuthContext.js   |
| Product data     | MongoDB Atlas   | `products`   | Backend API      |

---

**Last Updated:** 2026-08-02
**Status:** ✅ Full-stack application — Frontend + Backend + MongoDB Atlas connected
