import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import productsData from "../../data/products.json";
import backpack from "../../assets/images/products/backpack.jpg";
import bicycle from "../../assets/images/products/bicycle.jpg";
import blender from "../../assets/images/products/blender.jpg";
import campingTent from "../../assets/images/products/camping-tent.jpg";
import chair from "../../assets/images/products/chair.jpg";
import coffeeMaker from "../../assets/images/products/coffee-maker.jpg";
import dinnerSet from "../../assets/images/products/dinner-set.jpg";
import electricKettle from "../../assets/images/products/electric-kettle.jpg";
import football from "../../assets/images/products/football.jpg";
import headphones from "../../assets/images/products/headphones.jpg";
import hoodie from "../../assets/images/products/hoodie.jpg";
import jeans from "../../assets/images/products/jeans.jpg";
import laptop from "../../assets/images/products/laptop.jpg";
import microwave from "../../assets/images/products/microwave.jpg";
import runningShoes from "../../assets/images/products/running-shoes.jpg";
import smartphone from "../../assets/images/products/smartphone.jpg";
import smartwatch from "../../assets/images/products/smartwatch.jpg";
import sofa from "../../assets/images/products/sofa.jpg";
import tableLamp from "../../assets/images/products/table-lamp.jpg";
import tshirt from "../../assets/images/products/tshirt.jpg";
import ProductCard from "../../components/Product/ProductCard";
import "../../styles/ProductDetails.css";
import { useCart } from "../../context/CartContext";

const imageMap = {
  backpack,
  bicycle,
  blender,
  "camping-tent": campingTent,
  chair,
  coffeeMaker,
  dinnerSet,
  electricKettle,
  football,
  headphones,
  hoodie,
  jeans,
  laptop,
  microwave,
  runningShoes,
  smartphone,
  smartwatch,
  sofa,
  tableLamp,
  tshirt,
};

const products = productsData.map((product) => ({
  ...product,
  image: imageMap[product.imageKey] || "",
}));

const ProductDetails = () => {
  const { id } = useParams();
  useEffect(() => {
    setQuantity(1);
  }, [id]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const product = products.find((item) => item.id === Number(id));

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
      (item) => item.category === product.category && item.id !== product.id,
    )
    .slice(0, 4);

  return (
    <div className="product-details-page">
      {/* Breadcrumb */}

      <div className="breadcrumb">Home / Listings / {product.title}</div>

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
            <span className="current-price">${product.price}</span>

            <span className="old-price">${product.oldPrice}</span>
          </div>

          <div className="stock">
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </div>

          <p className="description">{product.description}</p>

          <div className="quantity-selector">
            <button onClick={decreaseQuantity} disabled={quantity === 1}>
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

          <button
            className="add-cart-btn"
            onClick={() => {
              addToCart(product, quantity);
              setQuantity(1);
            }}
          >
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
