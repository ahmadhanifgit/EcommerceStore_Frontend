import "../../styles/ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductCard({ product, variant = "default", showAddToCartButton = false }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1);
  };

  const handleCardClick = () => {
    navigate(`/details/${product.id}`);
  };

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className={`product-card ${variant}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      role="button"
      tabIndex={0}
    >
      <img
        src={product.image}
        alt={product.title}
        className="product-image"
      />

      <div className="product-info">
        <h3>{product.title}</h3>

        <p className="price">${product.price}</p>

        <p className="category">{product.category}</p>

        <p className="rating">
          ⭐ {product.rating} ({product.reviews})
        </p>
      </div>

      {showAddToCartButton && (
        <button type="button" className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      )}
    </div>
  );
}

export default ProductCard;