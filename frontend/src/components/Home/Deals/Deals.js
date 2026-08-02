import { useState, useEffect } from "react";
import "../../../styles/Deals.css";
import ProductCard from "../../Product/ProductCard";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/products";

function Deals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setProducts(list);
      })
      .catch((err) => console.error("Error fetching deals:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const deals = products.filter((p) => p.deal).length > 0
    ? products.filter((p) => p.deal)
    : products.slice(0, 5);

  if (deals.length === 0) return null;

  return (
    <section className="deals">
      <div className="deal-info">
        <h2>Deals & Offers</h2>
        <p>Today's Special Deals</p>
      </div>

      <div className="deal-products">
        {deals.slice(0, 5).map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default Deals;