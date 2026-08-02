import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import ProductCard from "../../components/Product/ProductCard";
import "../../styles/ProductDetails.css";
import { useCart } from "../../context/CartContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/products";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const fetchProductDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    setQuantity(1);

    try {
      // 1. Fetch single product by ID from GET /api/products/:id
      const response = await fetch(`${API_BASE_URL}/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Product not found");
        }
        throw new Error(`Server returned error status ${response.status}`);
      }
      const data = await response.json();
      const productData = data.data || data;

      if (!productData || (!productData._id && !productData.id)) {
        throw new Error("Product not found");
      }

      setProduct(productData);

      // 2. Fetch related products by category from GET /api/products
      try {
        const allRes = await fetch(API_BASE_URL);
        if (allRes.ok) {
          const allData = await allRes.json();
          const allProducts = Array.isArray(allData) ? allData : (allData.data || []);
          const related = allProducts
            .filter(
              (item) =>
                item.category === productData.category &&
                (item._id || item.id) !== (productData._id || productData.id)
            )
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (relErr) {
        console.warn("Could not fetch related products:", relErr.message);
      }
    } catch (err) {
      console.error("Failed to fetch product details:", err);
      setError(err.message || "Failed to load product details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const increaseQuantity = () => {
    if (product && quantity < (product.stock || 99)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-page">
        <div className="error-state">
          <h3>⚠️ Unable to Load Product</h3>
          <p>{error || "Product not found"}</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="retry-btn" onClick={fetchProductDetails}>
              Try Again
            </button>
            <Link to="/listings" className="back-btn" style={{ margin: 0 }}>
              ← Back to Listings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = product.name || product.title || "Product";
  //const brand = product.brand || "Generic";
  //const rating = product.rating !== undefined ? product.rating : 4.5;
  //const reviews = product.reviews !== undefined ? product.reviews : 12;
  const oldPrice = product.oldPrice || Math.round(product.price * 1.15);
  const stock = product.stock !== undefined ? product.stock : 10;
  const image = product.image || "https://via.placeholder.com/450?text=No+Image";

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Home</Link> / <Link to="/listings">Listings</Link> / <strong>{title}</strong>
      </div>

      {/* Back Button */}
      <Link to="/listings" className="back-btn">
        ← Back to Listings
      </Link>

      {/* Main Product Section */}
      <div className="product-details-container">
        {/* Product Image */}
        <div className="product-image-section">
          <img src={image} alt={title} className="product-image" />
        </div>

        {/* Product Info */}
        <div className="product-info-section">
          <h1>{title}</h1>

          {/*<p className="brand">
            Brand: <strong>{brand}</strong>
          </p>*/}

          <p className="category">
            Category: <strong>{product.category}</strong>
          </p>

          {/*<div className="rating">
            ⭐ {rating} ({reviews} Reviews)
          </div>*/}

          <div className="price-section">
            <span className="current-price">${product.price}</span>
            {oldPrice > product.price && <span className="old-price">${oldPrice}</span>}
          </div>

          <div className="stock">
            {stock > 0 ? `In Stock (${stock} available)` : "Out of Stock"}
          </div>

          <p className="description">{product.description}</p>

          <div className="quantity-selector">
            <button onClick={decreaseQuantity} disabled={quantity === 1}>
              −
            </button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity} disabled={quantity >= stock}>
              +
            </button>
          </div>

          <button
            className="add-cart-btn"
            disabled={stock <= 0}
            onClick={() => {
              addToCart(product, quantity);
              setQuantity(1);
            }}
          >
            {stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-products-grid">
            {relatedProducts.map((item) => (
              <Link
                key={item._id || item.id}
                to={`/details/${item._id || item.id}`}
                className="related-link"
              >
                <ProductCard product={item} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
