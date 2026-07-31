# Ecommerce Store Frontend

A modern React-based ecommerce frontend built to showcase a complete online shopping experience. The project includes a polished home page, product listings, product detail views, a shopping cart, search and filtering, and a responsive user interface.

## What We Built

This project was developed as a frontend ecommerce demo with the following main pieces:

- A full shopping layout with a header, navigation, hero section, offers, categories, services, suppliers, and newsletter area
- A product listing page with search, category filters, price filters, rating filters, availability filter, sorting, and grid/list view toggle
- A product detail page with image, pricing, stock information, description, quantity selector, and related products
- A cart page with quantity updates, item removal, cart summary, shipping calculation, and clear cart functionality
- Global cart state persisted in the browser using local storage
- Responsive styling for desktop, tablet, and mobile screens

## Tech Stack

- React
- React DOM
- React Router DOM
- Create React App
- CSS for component and page styling
- React Icons

## Project Structure

```text
src/
  App.js
  index.js
  index.css
  App.css
  assets/
  components/
    Footer/
    Header/
    Home/
    Product/
  context/
    CartContext.js
  data/
    products.json
  pages/
    Cart/
    Home/
    ProductDetails/
    ProductListings/
  styles/
```

## Main Features

### Home Page
- Hero banner
- Deals and promotions section
- Category sections for different product groups
- Recommended products section
- Services section
- Suppliers section
- Newsletter section

### Product Listings Page
- Search products using the query string
- Filter by category
- Filter by price range
- Filter by rating
- Filter by in-stock availability
- Sort by newest, low-to-high price, high-to-low price, and highest rated
- Toggle between grid and list layouts

### Product Details Page
- Detailed product information
- Product image display
- Brand, category, rating, reviews, and price details
- Stock status and quantity selector
- Add to cart action
- Related products section

### Cart Page
- Add products from listing and detail pages
- Increase or decrease item quantity
- Remove individual items
- Clear the whole cart
- View subtotal, shipping, and grand total

## State and Data Handling

- Product data is stored locally in JSON format
- The cart uses a custom React context provider
- Cart items are saved to browser local storage so they persist on refresh

## How We Structured the App

- Routing is handled with React Router
- Shared UI sections such as the header and footer are rendered globally
- Each page is separated into its own component and style file for better organization
- Reusable product cards are used across the listings and detail sections

## Installation and Run

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the development server
   ```bash
   npm start
   ```

3. Open the app in your browser at:
   ```text
   http://localhost:3000
   ```

## Build for Production

```bash
npm run build
```

## Summary of What We Did

We created a complete frontend ecommerce experience from scratch with:

- A modern UI structure for an online store
- Product browsing and navigation flow
- Search and filtering capabilities
- Shopping cart behavior with persistent state
- Clean component-based architecture
- Responsive page design and reusable product components

This README now serves as a clear overview of the project, its features, and the implementation work completed.
3. User can search, sort, and filter products.

Viewing Product Detail
1. User clicks a product card.
2. The app navigates to the product details route.
3. The full product information is displayed.

Adding to Cart
1. User clicks Add to Cart on a product.
2. The product is added to the global cart context.
3. The cart badge updates.

Managing Cart
1. User navigates to the cart page.
2. They can increase/decrease quantity or remove items.
3. Cart summary and total are updated automatically.

11. Current Implementation Notes

The current version already includes:

- Functional search through the listings page
- Functional category, price, rating, and stock filters
- Functional sorting options
- Cart management with context-based global state
- Product card click navigation to details page
- Responsive UI across core pages

12. Project Status

Status: Functional frontend ecommerce demo

Current state:

- Core shopping experience is implemented
- UI is responsive for main device sizes
- Cart and product browsing flows are working

13. Possible Future Enhancements

Potential future improvements could include:

- Checkout flow
- User authentication
- Backend integration
- Wishlist feature
- Product pagination with real server data
- Payment gateway integration
- Admin dashboard
- Dark mode

14. Summary

This project is a complete frontend ecommerce experience built in React. It includes a home page, product listings, product detail pages, cart management, search, filtering, sorting, and responsive design. It is a strong foundation for a real-world ecommerce web application.
