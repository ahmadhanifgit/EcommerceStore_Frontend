import { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/ProductListings.css";
import ProductCard from "../../components/Product/ProductCard";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/products";

const ProductListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [view, setView] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceFilter, setPriceFilter] = useState("");
  //const [selectedRatings, setSelectedRatings] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [searchParams] = useSearchParams();

  const searchTerm = (searchParams.get("q") || "").trim().toLowerCase();
  //const minRating = selectedRatings.includes("4") ? 4 : selectedRatings.includes("3") ? 3 : 0;

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }
      const data = await response.json();
      const productList = Array.isArray(data) ? data : (data.data || []);
      setProducts(productList);
    } catch (err) {
      console.error("Failed to fetch products from backend API:", err);
      setError("Unable to load products. Please check if the backend server is running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const title = product.name || product.title || "";
      const category = product.category || "";
      const brand = product.brand || "";
      const description = product.description || "";
      //const rating = product.rating !== undefined ? product.rating : 4.5;

      const matchesSearch =
        !searchTerm ||
        [title, category, brand, description]
          .join(" ")
          .toLowerCase()
          .includes(searchTerm);

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(category);

      const matchesPrice = (() => {
        if (priceFilter === "under100") return product.price < 100;
        if (priceFilter === "100-300") return product.price >= 100 && product.price <= 300;
        if (priceFilter === "above300") return product.price > 300;
        return true;
      })();

      //const matchesRating = !minRating || rating >= minRating;
      const matchesAvailability = !inStockOnly || (product.stock && product.stock > 0);

      return matchesSearch && matchesCategory && matchesPrice && matchesAvailability;
    });

    switch (sortBy) {
      case "newest":
        return [...result].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case "price-low":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-high":
        return [...result].sort((a, b) => b.price - a.price);
      //case "highest-rated":
      //  return [...result].sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
      default:
        return result;
    }
  }, [products, inStockOnly, priceFilter, searchTerm, selectedCategories, sortBy]);

  const toggleCategory = (category) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(category)
        ? prevCategories.filter((item) => item !== category)
        : [...prevCategories, category]
    );
  };

  /*const toggleRating = (value) => {
    setSelectedRatings((prevRatings) =>
      prevRatings.includes(value)
        ? prevRatings.filter((item) => item !== value)
        : [...prevRatings, value]
    );
  };*/
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

          {/*<div className="filter-group">
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
          </div>*/}

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
                {/*<option value="highest-rated">Highest Rated</option>*/}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading products from server...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <h3>⚠️ Connection Error</h3>
              <p>{error}</p>
              <button className="retry-btn" onClick={fetchProducts}>
                Retry
              </button>
            </div>
          ) : (
            <div className={view === "grid" ? "products-grid" : "products-list"}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} showAddToCartButton />
                ))
              ) : (
                <h2>No Products Found</h2>
              )}
            </div>
          )}

          {!loading && !error && filteredProducts.length > 0 && (
            <div className="pagination">
              <button>{"<"}</button>
              <button className="active-page">1</button>
              <button>{">"}</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProductListings;