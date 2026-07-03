import "../../../styles/CategorySection.css";

import products from "../../../data/products";
import ProductCard from "../../Product/ProductCard";

import electronicsBanner from "../../../assets/images/banners/electronics-banner.jpg";
import homeBanner from "../../../assets/images/banners/home-banner.jpg";

function CategorySection({ title, category }) {

  const categoryProducts = products
    .filter(product => product.category === category)
    .slice(0,4);

  const banner =
    category === "Electronics"
      ? electronicsBanner
      : homeBanner;

  return (

    <section className="category-section">

      <div className="category-banner">

        <img
          src={banner}
          alt={title}
        />

        <h2>{title}</h2>

      </div>

      <div className="category-products">

        {categoryProducts.map(product => (

          <ProductCard

            key={product.id}

            product={product}

          />

        ))}

      </div>

    </section>

  );

}

export default CategorySection;