# Ecommerce Store — Full-Stack Web Application

A complete full-stack ecommerce web application built with **React** (frontend), **Express.js** (backend), and **MongoDB Atlas** (database). The project delivers a real online shopping experience including product browsing, search and filtering, detailed product views, cart management, user authentication, and checkout.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Architecture Overview](#architecture-overview)
3. [Project Structure](#project-structure)
4. [Frontend](#frontend)
5. [Backend](#backend)
6. [MongoDB Atlas Database](#mongodb-atlas-database)
7. [Data Flow — How It All Works Together](#data-flow--how-it-all-works-together)
8. [API Endpoints](#api-endpoints)
9. [Environment Variables](#environment-variables)
10. [Installation and Setup](#installation-and-setup)
11. [Running the Application](#running-the-application)
12. [Features Breakdown](#features-breakdown)
13. [State Management](#state-management)
14. [Routing](#routing)
15. [Security Considerations](#security-considerations)
16. [Current Implementation Notes](#current-implementation-notes)
17. [Possible Future Enhancements](#possible-future-enhancements)

---

## Tech Stack

| Layer       | Technology                  | Purpose                                     |
|-------------|-----------------------------|---------------------------------------------|
| Frontend    | React 19, React Router 7    | UI rendering, client-side routing           |
| Styling     | Vanilla CSS                 | Component and page styling                  |
| Icons       | React Icons                 | Icon library for UI elements                |
| Backend     | Node.js, Express 5          | REST API server                             |
| Database    | MongoDB Atlas (Mongoose 9)  | Cloud-hosted NoSQL document database        |
| CORS        | cors package                | Cross-origin resource sharing               |
| Env Config  | dotenv                      | Environment variable management             |

---

## Architecture Overview

```
┌──────────────────────┐         HTTP Requests         ┌──────────────────────┐
│                      │  ──────────────────────────►   │                      │
│   React Frontend     │    GET /api/products           │   Express Backend    │
│   (localhost:3000)    │    GET /api/products/:id       │   (localhost:5000)   │
│                      │    POST /api/products          │                      │
│                      │  ◄──────────────────────────   │                      │
│                      │         JSON Responses         │                      │
└──────────────────────┘                                └──────────┬───────────┘
                                                                   │
                                                          Mongoose │ Connection
                                                                   │
                                                        ┌──────────▼───────────┐
                                                        │                      │
                                                        │   MongoDB Atlas      │
                                                        │   (Cloud Cluster)    │
                                                        │   DB: ecommerce      │
                                                        │   Collection:        │
                                                        │     products         │
                                                        │                      │
                                                        └──────────────────────┘
```

- The **frontend** runs on `http://localhost:3000` and makes `fetch()` calls to the backend API.
- The **backend** runs on `http://localhost:5000`, handles REST API requests, and communicates with MongoDB Atlas using Mongoose.
- **CORS** is enabled on the backend so the frontend (different port) can make cross-origin requests.

---

## Project Structure

```text
EcommerceStore_Frontend/
├── .gitignore
├── README.md
├── quick_reference.md
│
├── backend/
│   ├── .env                         # MongoDB connection string (not pushed to GitHub)
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Express server — routes, middleware, DB connection
│   └── models/
│       └── Product.js               # Mongoose product schema/model
│
└── frontend/
    ├── package.json                 # Frontend dependencies
    ├── public/                      # Static assets
    └── src/
        ├── App.js                   # Root component — routing and providers
        ├── App.css                  # Global app styles
        ├── index.js                 # React entry point
        ├── index.css                # Base CSS reset/styles
        │
        ├── assets/                  # Static images and media
        │
        ├── components/
        │   ├── Header/
        │   │   ├── Header.js        # Wrapper header component
        │   │   ├── TopBar.js        # Top info bar
        │   │   ├── MainHeader.js    # Logo + cart icon with badge
        │   │   ├── SearchBar.js     # Search input with query navigation
        │   │   └── Navbar.js        # Navigation links
        │   ├── Footer/
        │   │   └── Footer.js        # Footer component
        │   ├── Home/
        │   │   ├── Hero/            # Hero banner section
        │   │   ├── Deals/           # Deals and promotions section
        │   │   ├── CategorySection/ # Category product grid
        │   │   ├── Recommended/     # Recommended products section
        │   │   ├── Services/        # Services info section
        │   │   ├── SupplierBanner/  # Supplier promotion banner
        │   │   ├── Suppliers/       # Suppliers listing section
        │   │   └── Newsletter/      # Newsletter subscription section
        │   └── Product/
        │       └── ProductCard.js   # Reusable product card component
        │
        ├── context/
        │   ├── CartContext.js        # Cart state provider (localStorage persisted)
        │   └── AuthContext.js        # Auth state provider (localStorage persisted)
        │
        ├── data/
        │   └── products.json        # Legacy local product data (no longer primary source)
        │
        ├── pages/
        │   ├── Home/
        │   │   └── Home.js          # Home page — assembles all home sections
        │   ├── ProductListings/
        │   │   └── ProductListings.js   # Product listing with search, filters, sort
        │   ├── ProductDetails/
        │   │   └── ProductDetails.js    # Single product detail view
        │   ├── Cart/
        │   │   └── Cart.js          # Shopping cart page
        │   ├── Auth/
        │   │   ├── Login.js         # Login page with form validation
        │   │   └── Signup.js        # Signup page with form validation
        │   └── Checkout/
        │       └── Checkout.js      # Checkout page with shipping and payment
        │
        ├── styles/                  # All CSS files (one per component/page)
        │   ├── Auth.css
        │   ├── Cart.css
        │   ├── CategorySection.css
        │   ├── Checkout.css
        │   ├── Deals.css
        │   ├── Footer.css
        │   ├── Header.css
        │   ├── Hero.css
        │   ├── Home.css
        │   ├── Newsletter.css
        │   ├── ProductCard.css
        │   ├── ProductDetails.css
        │   ├── ProductListings.css
        │   ├── Recommended.css
        │   ├── Services.css
        │   ├── SupplierBanner.css
        │   └── Suppliers.css
        │
        └── utils/
            └── validation.js        # Form validation helpers (email, password, phone, ZIP)
```

---

## Frontend

### Overview

The frontend is a **React 19** single-page application bootstrapped with **Create React App**. It uses **React Router DOM v7** for client-side navigation and renders all product data by fetching from the backend API at `http://localhost:5000/api/products`.

### Key Frontend Dependencies

| Package            | Version  | Purpose                                |
|--------------------|----------|----------------------------------------|
| react              | ^19.2.7  | Core UI library                        |
| react-dom          | ^19.2.7  | DOM rendering                          |
| react-router-dom   | ^7.18.1  | Client-side routing                    |
| react-icons        | ^5.7.0   | Icon components                        |
| react-scripts      | 5.0.1    | Create React App toolchain             |

### How the Frontend Fetches Data

The frontend uses the native `fetch()` API to communicate with the backend. The base URL is configurable via the `REACT_APP_API_URL` environment variable, defaulting to `http://localhost:5000/api/products`.

**ProductListings.js** — Fetches all products on mount:
```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/products";
const response = await fetch(API_URL);
const data = await response.json();
const productList = data.data || [];   // API wraps data in { success, count, data }
```

**ProductDetails.js** — Fetches a single product by MongoDB `_id`:
```javascript
const response = await fetch(`${API_BASE_URL}/${id}`);
const data = await response.json();
const productData = data.data || data;
```

### Components

- **ProductCard** — Reusable card that displays product image, name, price, and category. Used on Home page sections, Product Listings, and Product Details (related products). Clicking a card navigates to `/details/:id`.
- **Header** — Composed of `TopBar`, `MainHeader` (logo + cart badge), `SearchBar`, and `Navbar`.
- **Footer** — Simple footer component rendered on all pages.
- **Home Sections** — `Hero`, `Deals`, `CategorySection`, `Recommended`, `Services`, `SupplierBanner`, `Suppliers`, `Newsletter`.

---

## Backend

### Overview

The backend is a **Node.js** server using **Express 5** that provides a RESTful API for product CRUD operations. It connects to **MongoDB Atlas** using **Mongoose 9** and serves JSON data to the frontend.

### Key Backend Dependencies

| Package   | Version  | Purpose                                    |
|-----------|----------|--------------------------------------------|
| express   | ^5.2.1   | Web framework for REST API                 |
| mongoose  | ^9.9.0   | MongoDB ODM (Object Document Mapper)       |
| cors      | ^2.8.6   | Cross-Origin Resource Sharing middleware    |
| dotenv    | ^17.4.2  | Load environment variables from `.env`     |

### Server Configuration (server.js)

The backend server performs the following on startup:

1. **Loads environment variables** — `require('dotenv').config()` reads the `.env` file
2. **Sets up middleware** — CORS (`app.use(cors())`), JSON parsing, URL-encoded body parsing
3. **Connects to MongoDB Atlas** — Using Mongoose with the connection string from `MONGO_URI`
4. **Registers routes** — All product CRUD endpoints under `/api/products`
5. **Starts listening** — On port `5000` (configurable via `PORT` env var)

### CORS Configuration

CORS is enabled globally on **line 16** of `server.js`:
```javascript
const cors = require('cors');   // line 5
app.use(cors());                // line 16
```
This allows the frontend at `http://localhost:3000` to make cross-origin requests to the backend at `http://localhost:5000`.

### Product Model (Product.js)

The Mongoose schema defines the product document structure stored in MongoDB:

| Field       | Type     | Required | Default | Validation                  |
|-------------|----------|----------|---------|-----------------------------|
| name        | String   | Yes      | —       | Trimmed, required           |
| price       | Number   | Yes      | —       | Minimum 0                   |
| image       | String   | No       | `""`    | URL to product image        |
| description | String   | No       | `""`    | —                           |
| category    | String   | Yes      | —       | Trimmed, required           |
| stock       | Number   | Yes      | 0       | Minimum 0                   |
| createdAt   | Date     | Auto     | —       | Mongoose timestamps         |
| updatedAt   | Date     | Auto     | —       | Mongoose timestamps         |

The schema uses `strict: false` which allows additional fields not defined in the schema to be stored.

---

## MongoDB Atlas Database

### Connection Details

- **Service**: MongoDB Atlas (cloud-hosted)
- **Cluster**: `itsimplera-frontend.kstkkn8.mongodb.net`
- **Database Name**: `ecommerce`
- **Collection**: `products`
- **Connection Method**: Mongoose ODM via connection string in `.env`

### How the Connection Works

1. The connection string is stored in `backend/.env` as `MONGO_URI`
2. `server.js` loads it via `dotenv` and passes it to `mongoose.connect()`
3. Mongoose establishes a persistent connection to the Atlas cluster
4. The `dbName: 'ecommerce'` option ensures the correct database is used
5. Custom DNS servers (`8.8.8.8`, `1.1.1.1`) are configured at the top of `server.js` to resolve Atlas hostnames reliably on certain networks

### Sample Product Document in MongoDB

```json
{
  "_id": "6a6c6bff709b87fd7e58efe4",
  "name": "Dell Inspiron Laptop",
  "price": 899,
  "image": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
  "description": "Powerful laptop with Intel Core i7 processor, 16GB RAM and 512GB SSD.",
  "category": "Electronics",
  "stock": 15,
  "createdAt": "2026-07-28T...",
  "updatedAt": "2026-07-28T..."
}
```

### Important Note on Image URLs

The `image` field must contain a **direct image URL** (e.g., `https://images.unsplash.com/photo-...`), NOT an Unsplash webpage URL (e.g., `https://unsplash.com/photos/...`). Webpage URLs will not render in `<img>` tags.

---

## Data Flow — How It All Works Together

### 1. Product Listing Flow

```
User visits /listings
       │
       ▼
ProductListings.js component mounts
       │
       ▼
fetch("http://localhost:5000/api/products")
       │
       ▼
Express server receives GET /api/products
       │
       ▼
Product.find(query) — Mongoose queries MongoDB Atlas
       │
       ▼
MongoDB Atlas returns product documents
       │
       ▼
Express sends JSON response: { success: true, count: N, data: [...] }
       │
       ▼
React receives JSON, sets state with setProducts(data)
       │
       ▼
Products rendered via ProductCard components in a grid/list
```

### 2. Product Detail Flow

```
User clicks a ProductCard
       │
       ▼
React Router navigates to /details/:id
       │
       ▼
ProductDetails.js fetches GET /api/products/:id
       │
       ▼
Express calls Product.findById(id)
       │
       ▼
MongoDB returns the single document
       │
       ▼
Product details rendered with image, price, stock, description
       │
       ▼
Related products fetched from GET /api/products and filtered by same category
```

### 3. Add to Cart Flow

```
User clicks "Add to Cart" on a product
       │
       ▼
addToCart(product, quantity) called from CartContext
       │
       ▼
Cart state updated (new item added or quantity incremented)
       │
       ▼
useEffect saves cart to localStorage
       │
       ▼
Header cart badge count updates automatically
```

### 4. Search and Filter Flow

```
User types in SearchBar and presses Enter
       │
       ▼
React Router navigates to /listings?q=searchTerm
       │
       ▼
ProductListings reads query from URL via useSearchParams
       │
       ▼
All products are fetched from API, then filtered client-side:
  - Search: matches name, category, brand, description
  - Category: checkbox filter
  - Price: radio button ranges (under $100, $100-$300, above $300)
  - Availability: in-stock only toggle
  - Sort: newest, price low-to-high, price high-to-low
```

---

## API Endpoints

All endpoints are served from `http://localhost:5000`.

### General

| Method | Endpoint          | Description                                      |
|--------|-------------------|--------------------------------------------------|
| GET    | `/`               | Root route — returns welcome message             |
| GET    | `/api/health`     | Health check — returns DB connection state        |

### Products CRUD

| Method | Endpoint               | Description                    | Request Body              |
|--------|------------------------|--------------------------------|---------------------------|
| GET    | `/api/products`        | Fetch all products             | —                         |
| GET    | `/api/products?category=Electronics` | Filter by category   | —                         |
| GET    | `/api/products?search=laptop`        | Search by name       | —                         |
| GET    | `/api/products/:id`    | Fetch single product by ID     | —                         |
| POST   | `/api/products`        | Create a new product           | JSON (see below)          |
| PUT    | `/api/products/:id`    | Update an existing product     | JSON (partial or full)    |
| DELETE | `/api/products/:id`    | Delete a product               | —                         |

### POST/PUT Request Body Example

```json
{
  "name": "Test Product",
  "price": 99,
  "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  "description": "A sample product for testing",
  "category": "Electronics",
  "stock": 10
}
```

**Required fields for POST**: `name`, `price`, `category`

### API Response Format

All product endpoints return responses in this structure:

```json
{
  "success": true,
  "count": 10,
  "data": [ ... ]
}
```

For single product:
```json
{
  "success": true,
  "data": { ... }
}
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable   | Description                          | Example                                                                   |
|------------|--------------------------------------|---------------------------------------------------------------------------|
| `PORT`     | Port for the Express server          | `5000`                                                                    |
| `MONGO_URI`| MongoDB Atlas connection string      | `mongodb+srv://user:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority` |

### Frontend (optional)

| Variable            | Description                    | Default                                  |
|---------------------|--------------------------------|------------------------------------------|
| `REACT_APP_API_URL` | Backend API base URL           | `http://localhost:5000/api/products`      |

---

## Installation and Setup

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- A MongoDB Atlas account with a configured cluster (or local MongoDB)

### 1. Clone the Repository

```bash
git clone https://github.com/ahmadhanifgit/EcommerceStore_Frontend.git
cd EcommerceStore_Frontend
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create or update the `.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ecommerce?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB Atlas credentials.

### 3. Setup the Frontend

```bash
cd ../frontend
npm install
```

### 4. Seed Your Database

Add product documents to the `products` collection in the `ecommerce` database on MongoDB Atlas. Each document should follow the schema defined in the [Product Model](#product-model-productjs) section.

---

## Running the Application

### Start the Backend (Terminal 1)

```bash
cd backend
npm start
```

The server starts at: `http://localhost:5000`

### Start the Frontend (Terminal 2)

```bash
cd frontend
npm start
```

The app opens at: `http://localhost:3000`

### Build for Production

```bash
cd frontend
npm run build
```

---

## Features Breakdown

### Home Page
- Hero banner with promotional content
- Deals and promotions section
- Category sections (Home & Living, Consumer Electronics)
- Recommended products section
- Services information section
- Supplier banner and listings
- Newsletter subscription section

### Product Listings Page
- Live search via URL query string (`/listings?q=term`)
- Filter by category (Electronics, Fashion, Home & Living, Kitchen, Sports & Outdoor)
- Filter by price range (Under $100, $100–$300, Above $300)
- Filter by in-stock availability
- Sort by newest, price (low to high), price (high to low)
- Toggle between grid and list view layouts

### Product Details Page
- Full product image display
- Product name, category, pricing (current + old price)
- Stock status with availability count
- Quantity selector with +/- buttons
- Add to Cart button
- Related products section (same category)
- Breadcrumb navigation

### Cart Page
- Add products from listings and detail pages
- Increase or decrease item quantities
- Remove individual items
- Clear the entire cart
- View subtotal, shipping, and grand total

### Authentication Pages
- Login page with email and password validation
- Signup page with full name, email, password, and confirm password
- Client-side form validation (email format, password length, match check)
- Auth state persisted in localStorage via AuthContext

### Checkout Page
- Shipping information form
- Payment details form
- Form validation for phone, address, city, ZIP code
- Order summary display

---

## State Management

### CartContext

- Provides global cart state across all pages
- Functions: `addToCart`, `removeFromCart`, `increaseCartQuantity`, `decreaseCartQuantity`, `clearCart`
- Computed values: `cartCount` (total items), `cartTotal` (total price)
- **Persistence**: Cart items saved to `localStorage` under the key `"cartItems"` and restored on page refresh

### AuthContext

- Provides global authentication state
- Functions: `login`, `signup`, `logout`
- **Persistence**: User data saved to `localStorage` under the key `"authUser"`
- Currently uses simulated authentication (no backend API integration for auth)

---

## Routing

| Path              | Component          | Description                |
|-------------------|--------------------|----------------------------|
| `/`               | Home               | Home page                  |
| `/listings`       | ProductListings    | Product listing with filters |
| `/listings?q=...` | ProductListings    | Filtered by search term    |
| `/details/:id`    | ProductDetails     | Single product detail      |
| `/cart`            | Cart               | Shopping cart               |
| `/login`          | Login              | Login page                 |
| `/signup`         | Signup             | Signup page                |
| `/checkout`       | Checkout           | Checkout page              |

---

## Security Considerations

- The `.env` file containing the MongoDB connection string is added to `.gitignore` to prevent credentials from being pushed to GitHub
- CORS is configured to allow all origins (`app.use(cors())`) — for production, this should be restricted to the frontend domain only
- Authentication is currently client-side only (simulated) — for production, a proper backend auth system with JWT or sessions would be needed

---

## Current Implementation Notes

- Product data is fetched live from MongoDB Atlas via the backend API
- The local `products.json` file exists but is no longer the primary data source
- Rating and review fields are commented out in the frontend as they are not stored in the database
- Search and filtering are performed client-side after fetching all products from the API
- The `strict: false` option on the Product schema allows flexible document structure in MongoDB

---

## Possible Future Enhancements

- Backend authentication API (JWT-based login/signup)
- Server-side search and filtering with pagination
- Wishlist feature
- Payment gateway integration
- Admin dashboard for product management
- Image upload functionality
- Order history and tracking
- Dark mode theme
- Rate limiting and input sanitization on the backend
