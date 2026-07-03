import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import products from "../../data/products";
import ProductCard from "../../components/Product/ProductCard";
import "../../styles/ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <div className="product-details-page">
        <h2>Product Not Found</h2>

        <Link to="/listings" className="back-btn">
          ← Back to Listings
        </Link>
      </div>
    );
  }

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const relatedProducts = products
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="product-details-page">

      {/* Breadcrumb */}

      <div className="breadcrumb">
        Home / Listings / {product.title}
      </div>

      {/* Back Button */}

      <Link to="/listings" className="back-btn">
        ← Back to Listings
      </Link>

      {/* Main Section */}

      <div className="product-details-container">

        {/* Left */}

        <div className="product-image-section">

          <img
            src={product.image}
            alt={product.title}
            className="product-image"
          />

        </div>

        {/* Right */}

        <div className="product-info-section">

          <h1>{product.title}</h1>

          <p className="brand">
            Brand: <strong>{product.brand}</strong>
          </p>

          <p className="category">
            Category: <strong>{product.category}</strong>
          </p>

          <div className="rating">
            ⭐ {product.rating} ({product.reviews} Reviews)
          </div>

          <div className="price-section">

            <span className="current-price">
              ${product.price}
            </span>

            <span className="old-price">
              ${product.oldPrice}
            </span>

          </div>

          <div className="stock">
            {product.stock > 0
              ? `In Stock (${product.stock})`
              : "Out of Stock"}
          </div>

          <p className="description">
            {product.description}
          </p>

          <div className="quantity-selector">

            <button
              onClick={decreaseQuantity}
              disabled={quantity === 1}
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              onClick={increaseQuantity}
              disabled={quantity === product.stock}
            >
              +
            </button>

          </div>

          <button className="add-cart-btn">
            Add to Cart
          </button>

        </div>

      </div>

      {/* Related Products */}

      <div className="related-products">

        <h2>Related Products</h2>

        <div className="related-products-grid">

          {relatedProducts.map((item) => (

            <Link
              key={item.id}
              to={`/details/${item.id}`}
              className="related-link"
            >
              <ProductCard product={item} />
            </Link>

          ))}

        </div>

      </div>

    </div>
  );
};

export default ProductDetails;