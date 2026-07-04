import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/ProductListings.css";

import products from "../../data/products";
import ProductCard from "../../components/Product/ProductCard";

const ProductListings = () => {
  const [view, setView] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [searchParams] = useSearchParams();

  const searchTerm = (searchParams.get("q") || "").trim().toLowerCase();
  const minRating = selectedRatings.includes("4") ? 4 : selectedRatings.includes("3") ? 3 : 0;

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        [product.title, product.category, product.brand, product.description]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category);

      const matchesPrice = (() => {
        if (priceFilter === "under100") return product.price < 100;
        if (priceFilter === "100-300") return product.price >= 100 && product.price <= 300;
        if (priceFilter === "above300") return product.price > 300;
        return true;
      })();

      const matchesRating = !minRating || product.rating >= minRating;
      const matchesAvailability = !inStockOnly || product.stock > 0;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesAvailability;
    });

    switch (sortBy) {
      case "newest":
        return [...result].sort((a, b) => b.id - a.id);
      case "price-low":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...result].sort((a, b) => b.price - a.price);
      case "highest-rated":
        return [...result].sort((a, b) => b.rating - a.rating);
      default:
        return result;
    }
  }, [inStockOnly, minRating, priceFilter, searchTerm, selectedCategories, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((item) => item !== category)
        : [...prevCategories, category]
    );
  };

  const toggleRating = (value) => {
    setSelectedRatings((prevRatings) =>
      prevRatings.includes(value)
        ? prevRatings.filter((item) => item !== value)
        : [...prevRatings, value]
    );
  };

  return (
    <div className="product-listings">
      <div className="breadcrumb">
        <span>Home</span>
        <span> / </span>
        <strong>Product Listings</strong>
      </div>

      <div className="listing-container">
        <aside className="filters">
          <h3>Filters</h3>

          <div className="filter-group">
            <h4>Category</h4>

            {['Electronics', 'Fashion', 'Home & Living', 'Kitchen', 'Sports & Outdoor'].map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                {category}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h4>Price</h4>

            <label>
              <input
                type="radio"
                name="price"
                checked={priceFilter === "under100"}
                onChange={() => setPriceFilter("under100")}
              />
              Under $100
            </label>

            <label>
              <input
                type="radio"
                name="price"
                checked={priceFilter === "100-300"}
                onChange={() => setPriceFilter("100-300")}
              />
              $100 - $300
            </label>

            <label>
              <input
                type="radio"
                name="price"
                checked={priceFilter === "above300"}
                onChange={() => setPriceFilter("above300")}
              />
              Above $300
            </label>

            <label>
              <input
                type="radio"
                name="price"
                checked={priceFilter === ""}
                onChange={() => setPriceFilter("")}
              />
              Any Price
            </label>
          </div>

          <div className="filter-group">
            <h4>Rating</h4>

            <label>
              <input
                type="checkbox"
                checked={selectedRatings.includes("4")}
                onChange={() => toggleRating("4")}
              />
              4★ & Above
            </label>

            <label>
              <input
                type="checkbox"
                checked={selectedRatings.includes("3")}
                onChange={() => toggleRating("3")}
              />
              3★ & Above
            </label>
          </div>

          <div className="filter-group">
            <h4>Availability</h4>

            <label>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly((prev) => !prev)}
              />
              In Stock
            </label>
          </div>
        </aside>

        <section className="listing-content">
          <div className="listing-top">
            <p>Showing {filteredProducts.length} Products</p>

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

              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                <option value="">Sort By</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="highest-rated">Highest Rated</option>
              </select>
            </div>
          </div>

          <div className={view === "grid" ? "products-grid" : "products-list"}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} showAddToCartButton />
              ))
            ) : (
              <h2>No Products Found</h2>
            )}
          </div>

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