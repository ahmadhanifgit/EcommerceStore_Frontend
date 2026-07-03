import "../../styles/ProductCard.css";

function ProductCard({ product, variant = "default" }) {
  return (
    <div className={`product-card ${variant}`}>

      <img
        src={product.image}
        alt={product.title}
        className="product-image"
      />

      <div className="product-info">

        <h3>{product.title}</h3>

        <p className="price">

          ${product.price}

        </p>

        <p className="category">

          {product.category}

        </p>

        <p className="rating">

          ⭐ {product.rating} ({product.reviews})

        </p>

      </div>

    </div>
  );
}

export default ProductCard;