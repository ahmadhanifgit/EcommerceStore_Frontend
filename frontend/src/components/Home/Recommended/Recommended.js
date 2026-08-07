import { useState, useEffect } from "react";
import "../../../styles/Recommended.css";
import ProductCard from "../../Product/ProductCard";

const API_URL = process.env.REACT_APP_API_URL || "https://ecommercestore-frontend-backend.onrender.com/api/products";

function Recommended() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setProducts(list);
      })
      .catch((err) => console.error("Error fetching recommended items:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return null;
  }

  // Display top recommended products or slice first 4 products
  const recommendedItems = products.filter((p) => p.recommended).length > 0
    ? products.filter((p) => p.recommended)
    : products.slice(0, 4);

  if (recommendedItems.length === 0) return null;

  return (
    <section className="recommended">
      <h2>Recommended Items</h2>

      <div className="recommended-grid">
        {recommendedItems.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
            variant="recommended"
          />
        ))}
      </div>
    </section>
  );
}

export default Recommended;