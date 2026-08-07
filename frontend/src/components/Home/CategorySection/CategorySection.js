import { useState, useEffect } from "react";
import "../../../styles/CategorySection.css";
import ProductCard from "../../Product/ProductCard";

import electronicsBanner from "../../../assets/images/banners/electronics-banner.jpg";
import homeBanner from "../../../assets/images/banners/home-banner.jpg";

const API_URL = process.env.REACT_APP_API_URL || "https://ecommercestore-frontend-backend.onrender.com/api/products";

function CategorySection({ title, category }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        const list = Array.isArray(data) ? data : data.data || [];
        setProducts(list);
      })
      .catch((err) => console.error(`Error fetching category ${category}:`, err))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return null;

  const categoryProducts = products
    .filter((product) => product.category && product.category.toLowerCase() === category.toLowerCase())
    .slice(0, 4);

  const displayProducts = categoryProducts.length > 0 ? categoryProducts : products.slice(0, 4);

  const banner = category === "Electronics" ? electronicsBanner : homeBanner;

  return (
    <section className="category-section">
      <div className="category-banner">
        <img src={banner} alt={title} />
        <h2>{title}</h2>
      </div>

      <div className="category-products">
        {displayProducts.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default CategorySection;