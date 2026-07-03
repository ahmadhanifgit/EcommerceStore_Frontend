import { useState } from "react";
import "../../styles/ProductListings.css";

import products from "../../data/products";
import ProductCard from "../../components/Product/ProductCard";

const ProductListings = () => {
  const [view, setView] = useState("grid");

  return (
    <div className="product-listings">

      {/* Breadcrumb */}

      <div className="breadcrumb">
        <span>Home</span>
        <span> / </span>
        <strong>Product Listings</strong>
      </div>

      <div className="listing-container">

        {/* Sidebar */}

        <aside className="filters">

          <h3>Filters</h3>

          {/* Category */}

          <div className="filter-group">

            <h4>Category</h4>

            <label>
              <input type="checkbox" />
              Electronics
            </label>

            <label>
              <input type="checkbox" />
              Fashion
            </label>

            <label>
              <input type="checkbox" />
              Home & Living
            </label>

            <label>
              <input type="checkbox" />
              Kitchen
            </label>

            <label>
              <input type="checkbox" />
              Sports & Outdoor
            </label>

          </div>

          {/* Price */}

          <div className="filter-group">

            <h4>Price</h4>

            <label>
              <input type="radio" name="price" />
              Under $100
            </label>

            <label>
              <input type="radio" name="price" />
              $100 - $300
            </label>

            <label>
              <input type="radio" name="price" />
              Above $300
            </label>

          </div>

          {/* Rating */}

          <div className="filter-group">

            <h4>Rating</h4>

            <label>
              <input type="checkbox" />
              4★ & Above
            </label>

            <label>
              <input type="checkbox" />
              3★ & Above
            </label>

          </div>

          {/* Availability */}

          <div className="filter-group">

            <h4>Availability</h4>

            <label>
              <input type="checkbox" />
              In Stock
            </label>

          </div>

        </aside>

        {/* Products */}

        <section className="listing-content">

          <div className="listing-top">

            <p>Showing {products.length} Products</p>

            <div className="listing-actions">

              <button
                className={view === "grid" ? "view-btn active" : "view-btn"}
                onClick={() => setView("grid")}
              >
                Grid
              </button>

              <button
                className={view === "list" ? "view-btn active" : "view-btn"}
                onClick={() => setView("list")}
              >
                List
              </button>

              <select>

                <option>Sort By</option>

                <option>Newest</option>

                <option>Price: Low to High</option>

                <option>Price: High to Low</option>

                <option>Highest Rated</option>

              </select>

            </div>

          </div>

          <div
            className={view === "grid" ? "products-grid" : "products-list"}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))
            ) : (
              <h2>No Products Found</h2>
            )}
          </div>

          {/* Pagination */}

          <div className="pagination">

            <button>{"<"}</button>

            <button className="active-page">1</button>

            <button>2</button>

            <button>3</button>

            <button>{">"}</button>

          </div>

        </section>

      </div>

    </div>
  );
};

export default ProductListings;