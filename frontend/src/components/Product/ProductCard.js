import "../../styles/ProductCard.css";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductCard({ product, variant = "default", showAddToCartButton = false }) {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!product) return null;

  const productId = product._id || product.id;
  const productTitle = product.name || product.title || "Product";
  //following code commented out as product rating and reviews are not available from the backend and they were showing default values hardcoded
  //const productRating = product.rating !== undefined ? product.rating : 4.5;
  //const productReviews = product.reviews !== undefined ? product.reviews : 12;

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product, 1);
  };

  const handleCardClick = () => {
    navigate(`/details/${productId}`);
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
        alt={productTitle}
        className="product-image"
      />

      <div className="product-info">
        <h3>{productTitle}</h3>

        <p className="price">${product.price}</p>

        <p className="category">{product.category}</p>

        {/*<p className="rating">
          ⭐ {productRating} ({productReviews})
        </p>*/}
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