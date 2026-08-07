# Ecommerce Store — Full-Stack Web Application

A complete full-stack ecommerce web application built with **React** (frontend), **Express.js** (backend), and **MongoDB Atlas** (database). The project delivers a real online shopping experience including product browsing, search and filtering, detailed product views, cart management, real JWT-based user authentication, order placement, and checkout.

---

## Table of Contents

1. [Recent Updates](#recent-updates)
2. [Tech Stack](#tech-stack)
3. [Architecture Overview](#architecture-overview)
4. [Project Structure](#project-structure)
5. [Frontend](#frontend)
6. [Backend](#backend)
7. [MongoDB Atlas Database](#mongodb-atlas-database)
8. [Data Flow — How It All Works Together](#data-flow--how-it-all-works-together)
9. [API Endpoints](#api-endpoints)
10. [Environment Variables](#environment-variables)
11. [Installation and Setup](#installation-and-setup)
12. [Running the Application](#running-the-application)
13. [Features Breakdown](#features-breakdown)
14. [State Management](#state-management)
15. [Routing](#routing)
16. [Security Considerations](#security-considerations)
17. [Current Implementation Notes](#current-implementation-notes)
18. [Possible Future Enhancements](#possible-future-enhancements)

---

## Recent Updates

The following features were added **this week** and extend the product/cart foundation documented previously. Authentication is now backed by a real API (it is no longer simulated), and orders are now persisted to the database.

- **User model** — a Mongoose `User` schema with `name`, `email`, and `password` (bcrypt-hashed).
- **`POST /api/auth/register`** — registers a new user and stores the password as a bcrypt hash (never plain text).
- **`POST /api/auth/login`** — verifies credentials and returns a signed **JWT token**.
- **JWT stored in `localStorage`** — after a successful login the frontend saves the token (key `token`) and user (key `user`) in `localStorage` and sends the token as `Authorization: Bearer <token>` on protected requests.
- **Protected routes** — the **Cart** and **Checkout** pages are now accessible to logged-in users only; unauthenticated visitors are redirected to `/login`.
- **Order model** — a Mongoose `Order` schema with `user`, `products`, `totalPrice`, `status`, and `createdAt`.
- **`POST /api/orders`** — a protected endpoint that saves a new order to MongoDB when **Place Order** is clicked on the checkout page.

> Sections below (Project Structure, Backend, API Endpoints, Data Flow, Security, etc.) have been updated to reflect these changes.

---

## Tech Stack

| Layer       | Technology                  | Purpose                                     |
|-------------|-----------------------------|---------------------------------------------|
| Frontend    | React 19, React Router 7    | UI rendering, client-side routing           |
| Styling     | Vanilla CSS                 | Component and page styling                  |
| Icons       | React Icons                 | Icon library for UI elements                |
| Backend     | Node.js, Express 5          | REST API server                             |
| Database    | MongoDB Atlas (Mongoose 9)  | Cloud-hosted NoSQL document database        |
| Auth        | jsonwebtoken (JWT), bcrypt  | Token-based authentication, password hashing |
| CORS        | cors package                | Cross-origin resource sharing               |
| Env Config  | dotenv                      | Environment variable management             |

---

## Architecture Overview

```
┌──────────────────────┐         HTTP Requests         ┌──────────────────────┐
│                      │  ──────────────────────────►   │                      │
│   React Frontend     │    GET  /api/products          │   Express Backend    │
│   (localhost:3000)    │    POST /api/auth/register     │   (localhost:5000)   │
│                      │    POST /api/auth/login        │                      │
│                      │    POST /api/orders  (JWT)     │                      │
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
                                                        │   Collections:       │
                                                        │     products         │
                                                        │     users            │
                                                        │     orders           │
                                                        │                      │
                                                        └──────────────────────┘
```

- The **frontend** runs on `http://localhost:3000` and makes `fetch()` calls to the backend API.
- The **backend** runs on `http://localhost:5000`, handles REST API requests, and communicates with MongoDB Atlas using Mongoose.
- **CORS** is enabled on the backend so the frontend (different port) can make cross-origin requests.
- **Protected endpoints** (e.g. `POST /api/orders`) require a valid **JWT** sent in the `Authorization: Bearer <token>` header.

---

## Project Structure

```text
EcommerceStore_Frontend/
├── .gitignore
├── README.md
├── quick_reference.md
│
├── backend/
│   ├── .env                         # Secrets: MongoDB URI + JWT config (not pushed to GitHub)
│   ├── package.json                 # Backend dependencies
│   ├── server.js                    # Express server — middleware, DB connection, route mounting
│   ├── models/
│   │   ├── Product.js               # Mongoose product schema/model
│   │   ├── User.js                  # Mongoose user schema/model (bcrypt-hashed password)
│   │   └── Order.js                 # Mongoose order schema/model
│   ├── controllers/
│   │   ├── authController.js        # register + login business logic
│   │   └── orderController.js       # create order + list-own-orders logic
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification — protects private routes
│   └── routes/
│       ├── authRoutes.js            # POST /api/auth/register, POST /api/auth/login
│       └── orderRoutes.js           # POST /api/orders, GET /api/orders (protected)
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
        │   ├── Product/
        │   │   └── ProductCard.js   # Reusable product card component
        │   └── ProtectedRoute/
        │       └── ProtectedRoute.js # Guards Cart/Checkout — redirects guests to /login
        │
        ├── context/
        │   ├── CartContext.js        # Cart state provider (localStorage persisted)
        │   └── AuthContext.js        # Auth state provider (localStorage persisted)
        │
        ├── services/
        │   ├── authService.js        # register/login API calls + token storage
        │   └── orderService.js       # placeOrder() / getMyOrders() API calls
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

The frontend is a **React 19** single-page application bootstrapped with **Create React App**. It uses **React Router DOM v7** for client-side navigation and renders all product data by fetching from the backend API, which defaults to the deployed backend at `https://ecommercestore-frontend-backend.onrender.com/api/products`.

### Key Frontend Dependencies

| Package            | Version  | Purpose                                |
|--------------------|----------|----------------------------------------|
| react              | ^19.2.7  | Core UI library                        |
| react-dom          | ^19.2.7  | DOM rendering                          |
| react-router-dom   | ^7.18.1  | Client-side routing                    |
| react-icons        | ^5.7.0   | Icon components                        |
| react-scripts      | 5.0.1    | Create React App toolchain             |

### How the Frontend Fetches Data

The frontend uses the native `fetch()` API to communicate with the backend. The base URL is configurable via the `REACT_APP_API_URL` environment variable, defaulting to the deployed backend at `https://ecommercestore-frontend-backend.onrender.com/api/products`.

**ProductListings.js** — Fetches all products on mount:
```javascript
const API_URL = process.env.REACT_APP_API_URL || "https://ecommercestore-frontend-backend.onrender.com/api/products";
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

| Package        | Version  | Purpose                                    |
|----------------|----------|--------------------------------------------|
| express        | ^5.2.1   | Web framework for REST API                 |
| mongoose       | ^9.9.0   | MongoDB ODM (Object Document Mapper)       |
| bcrypt         | ^6.0.0   | Hashing user passwords before storage      |
| jsonwebtoken   | ^9.0.3   | Signing and verifying JWT auth tokens      |
| cors           | ^2.8.6   | Cross-Origin Resource Sharing middleware    |
| dotenv         | ^17.4.2  | Load environment variables from `.env`     |

### Server Configuration (server.js)

The backend server performs the following on startup:

1. **Loads environment variables** — `require('dotenv').config()` reads the `.env` file
2. **Sets up middleware** — CORS (`app.use(cors())`), JSON parsing, URL-encoded body parsing
3. **Connects to MongoDB Atlas** — Using Mongoose with the connection string from `MONGO_URI`
4. **Registers routes** — Product CRUD under `/api/products`, auth under `/api/auth`, and orders under `/api/orders`
5. **Starts listening** — On port `5000` (configurable via `PORT` env var)

Route modules are mounted in `server.js`:
```javascript
app.use('/api/auth', authRoutes);     // register + login
app.use('/api/orders', orderRoutes);  // create order (protected) + list own orders
```

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

### User Model (User.js)

Stores registered users. Passwords are **never stored in plain text** — the `authController` hashes them with bcrypt before saving.

| Field     | Type   | Required | Constraints                                   |
|-----------|--------|----------|-----------------------------------------------|
| name      | String | Yes      | Trimmed                                       |
| email     | String | Yes      | Unique, lowercased, trimmed                   |
| password  | String | Yes      | Minimum 6 characters, stored as a bcrypt hash |
| createdAt | Date   | Auto     | Mongoose timestamps                           |
| updatedAt | Date   | Auto     | Mongoose timestamps                           |

The `email` field has a `unique` index, so registering with an email that already exists is rejected.

### Order Model (Order.js)

Stores a customer's order. Mongoose creates the `orders` collection automatically the first time an order is saved — no manual setup needed.

| Field      | Type                | Required | Default   | Notes                                             |
|------------|---------------------|----------|-----------|---------------------------------------------------|
| user       | ObjectId (→ `User`) | Yes      | —         | Taken from the JWT (`req.user.id`), never the body |
| products   | Array               | Yes      | —         | Must contain at least one item (see below)        |
| totalPrice | Number              | Yes      | —         | Minimum 0; recalculated/verified on the server    |
| status     | String (enum)       | No       | `Pending` | `Pending`, `Processing`, `Shipped`, `Delivered`, `Cancelled` |
| createdAt  | Date                | Auto     | —         | Mongoose timestamps                               |
| updatedAt  | Date                | Auto     | —         | Mongoose timestamps                               |

Each entry in `products` is a sub-document that snapshots the product at purchase time (so the order stays accurate even if the product is later edited):

| Field     | Type                   | Required | Notes                        |
|-----------|------------------------|----------|------------------------------|
| productId | ObjectId (→ `Product`) | Yes      | Reference to the product     |
| title     | String                 | Yes      | Product name at purchase     |
| price     | Number                 | Yes      | Minimum 0                    |
| quantity  | Number                 | Yes      | Minimum 1                    |
| image     | String                 | No       | Product image URL            |

### Authentication (authController + authMiddleware)

- **`authController.js`** contains the business logic for `register` and `login`. On register, the password is hashed with bcrypt; on login, the submitted password is compared against the stored hash and, on success, a **JWT** is signed with `JWT_SECRET` (expiry from `JWT_EXPIRES_IN`).
- **`authMiddleware.js`** protects private routes. It reads the `Authorization: Bearer <token>` header, verifies the JWT, and attaches the decoded user to `req.user`. Controllers then read the user ID from `req.user.id` — the client can never spoof which user an order belongs to.

---

## MongoDB Atlas Database

### Connection Details

- **Service**: MongoDB Atlas (cloud-hosted)
- **Cluster**: `itsimplera-frontend.kstkkn8.mongodb.net`
- **Database Name**: `ecommerce`
- **Collections**: `products`, `users`, `orders`
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
fetch("https://ecommercestore-frontend-backend.onrender.com/api/products")
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

### 5. Authentication Flow (Register + Login)

```
User submits Signup form
       │
       ▼
authService.register(name, email, password)
       │
       ▼
POST /api/auth/register  →  authController hashes password with bcrypt  →  saves User
       │
       ▼
User submits Login form  →  authService.login(email, password)
       │
       ▼
POST /api/auth/login  →  bcrypt.compare(password, hash)
       │
       ▼
On success: JWT signed with JWT_SECRET, returned in { data: { token, user } }
       │
       ▼
Frontend stores token ("token") and user ("user") in localStorage (AuthContext)
```

### 6. Place Order Flow

```
User is on /checkout (protected route — must be logged in)
       │
       ▼
User fills shipping form and clicks "Place Order"
       │
       ▼
orderService.placeOrder(products)  — reads JWT from localStorage
       │
       ▼
POST /api/orders  with header  Authorization: Bearer <token>
       │
       ▼
authMiddleware verifies the JWT and sets req.user
       │
       ▼
orderController validates cart, verifies each product in DB,
recalculates totalPrice, and saves the Order (status defaults to "Pending")
       │
       ▼
Response: { success: true, message: "Order placed successfully.", data: order }
       │
       ▼
Frontend shows success (real order ID + total) and clears the cart
```

---

## API Endpoints

All endpoints are served from the backend base URL — the deployed backend at `https://ecommercestore-frontend-backend.onrender.com`, or `http://localhost:5000` when running locally.

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

### Authentication

| Method | Endpoint                | Description                           | Request Body                    |
|--------|-------------------------|---------------------------------------|---------------------------------|
| POST   | `/api/auth/register`    | Register a new user (password hashed) | `{ name, email, password }`     |
| POST   | `/api/auth/login`       | Login; returns a JWT token            | `{ email, password }`           |

**Register** returns a success message (the user then logs in separately). **Login** returns:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "<jwt-token>",
    "user": { "id": "...", "name": "...", "email": "..." }
  }
}
```

### Orders (protected — require `Authorization: Bearer <token>`)

| Method | Endpoint         | Description                                  | Request Body                                   |
|--------|------------------|----------------------------------------------|------------------------------------------------|
| POST   | `/api/orders`    | Place a new order for the logged-in user     | `{ products: [{ productId, quantity }, ...] }` |
| GET    | `/api/orders`    | List the logged-in user's orders (newest first) | —                                           |

The user ID is taken from the JWT, not the request body. The server verifies each `productId` against the database and recalculates `totalPrice`, so client-supplied prices cannot be tampered with. A successful order returns:
```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": { "_id": "...", "user": "...", "products": [ ... ], "totalPrice": 0, "status": "Pending", "createdAt": "..." }
}
```

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

| Variable         | Description                          | Example                                                                   |
|------------------|--------------------------------------|---------------------------------------------------------------------------|
| `PORT`           | Port for the Express server          | `5000`                                                                    |
| `MONGO_URI`      | MongoDB Atlas connection string      | `mongodb+srv://user:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority` |
| `JWT_SECRET`     | Secret key used to sign JWT tokens   | `a-long-random-secret-string`                                             |
| `JWT_EXPIRES_IN` | JWT token lifetime                   | `7d`                                                                      |

`JWT_SECRET` must be set for authentication to work. Keep it private and out of version control.

### Frontend (optional)

| Variable                   | Description                                   | Default                                                          |
|----------------------------|-----------------------------------------------|------------------------------------------------------------------|
| `REACT_APP_API_URL`        | Products API base URL                         | `https://ecommercestore-frontend-backend.onrender.com/api/products` |
| `REACT_APP_API_BASE_URL`   | Server root for auth/order services           | `https://ecommercestore-frontend-backend.onrender.com`           |

> The defaults point to the deployed backend on Render. For local development against `http://localhost:5000`, set these variables in `frontend/.env` (e.g. `REACT_APP_API_URL=http://localhost:5000/api/products` and `REACT_APP_API_BASE_URL=http://localhost:5000`).

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
JWT_SECRET=<a-long-random-secret-string>
JWT_EXPIRES_IN=7d
```

Replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB Atlas credentials, and set `JWT_SECRET` to any long random string of your own.

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

### Cart Page (protected)
- Requires login — guests are redirected to `/login`
- Add products from listings and detail pages
- Increase or decrease item quantities
- Remove individual items
- Clear the entire cart
- View subtotal, shipping, and grand total

### Authentication Pages
- Login page with email and password validation
- Signup page with full name, email, password, and confirm password
- Client-side form validation (email format, password length, match check)
- **Real backend authentication** — Signup calls `POST /api/auth/register`; Login calls `POST /api/auth/login` and receives a JWT
- JWT token and user persisted in localStorage via AuthContext

### Checkout Page (protected)
- Requires login — guests are redirected to `/login`
- Shipping information form
- Payment details form
- Form validation for phone, address, city, ZIP code
- Order summary display
- **Place Order** sends `POST /api/orders` with the JWT, shows loading/error states, prevents duplicate submissions, and on success displays the real order ID and clears the cart

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
- Calls the backend auth API via `services/authService.js`
- **Persistence**: On login, the JWT token is saved to `localStorage` under the key `"token"` and the user object under `"user"`; both are cleared on logout
- Backed by **real JWT authentication** against `POST /api/auth/login` and `POST /api/auth/register`

### orderService

- `services/orderService.js` keeps order API logic out of the UI components
- `placeOrder(products)` — sends `POST /api/orders` with the JWT in the `Authorization` header and returns the saved order
- `getMyOrders()` — fetches the logged-in user's orders

---

## Routing

| Path              | Component          | Description                          |
|-------------------|--------------------|--------------------------------------|
| `/`               | Home               | Home page                            |
| `/listings`       | ProductListings    | Product listing with filters         |
| `/listings?q=...` | ProductListings    | Filtered by search term              |
| `/details/:id`    | ProductDetails     | Single product detail                |
| `/cart`           | Cart               | Shopping cart (**protected** — login required) |
| `/login`          | Login              | Login page                           |
| `/signup`         | Signup             | Signup page                          |
| `/checkout`       | Checkout           | Checkout page (**protected** — login required) |

Protected routes are wrapped in the `ProtectedRoute` component, which checks `AuthContext`. Unauthenticated users are redirected to `/login`.

---

## Security Considerations

- The `.env` file containing the MongoDB connection string and `JWT_SECRET` is added to `.gitignore` to prevent secrets from being pushed to GitHub
- CORS is configured to allow all origins (`app.use(cors())`) — for production, this should be restricted to the frontend domain only
- **Passwords are hashed with bcrypt** before being stored — plain-text passwords are never persisted
- **Authentication uses JWT** — protected endpoints (e.g. `POST /api/orders`) require a valid token verified by `authMiddleware`; the user ID is taken from the token, never trusted from the request body
- The JWT is stored in `localStorage`, which is convenient but vulnerable to XSS — for production, consider httpOnly cookies and short token lifetimes with refresh tokens

---

## Current Implementation Notes

- Product data is fetched live from MongoDB Atlas via the backend API
- The local `products.json` file exists but is no longer the primary data source
- Rating and review fields are commented out in the frontend as they are not stored in the database
- Search and filtering are performed client-side after fetching all products from the API
- The `strict: false` option on the Product schema allows flexible document structure in MongoDB
- **Authentication is now real (JWT-based)** — the previous simulated/client-only auth has been replaced by `POST /api/auth/register` and `POST /api/auth/login`
- **Orders are persisted** — placing an order on checkout saves an `Order` document via `POST /api/orders`; the server verifies products and recalculates the total rather than trusting the client
- **Cart and Checkout are protected** — only logged-in users can reach them (via the `ProtectedRoute` component)

---

## Possible Future Enhancements

- Order history page in the UI (backend `GET /api/orders` already exists)
- Order status updates and admin management (`Processing` → `Shipped` → `Delivered`)
- Server-side search and filtering with pagination
- Wishlist feature
- Payment gateway integration
- Admin dashboard for product management
- Image upload functionality
- Refresh tokens and httpOnly cookie storage for JWTs
- Dark mode theme
- Rate limiting and input sanitization on the backend
