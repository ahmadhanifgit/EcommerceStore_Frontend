import "../../../styles/CategorySection.css";

import productsData from "../../../data/products.json";
import backpack from "../../../assets/images/products/backpack.jpg";
import bicycle from "../../../assets/images/products/bicycle.jpg";
import blender from "../../../assets/images/products/blender.jpg";
import campingTent from "../../../assets/images/products/camping-tent.jpg";
import chair from "../../../assets/images/products/chair.jpg";
import coffeeMaker from "../../../assets/images/products/coffee-maker.jpg";
import dinnerSet from "../../../assets/images/products/dinner-set.jpg";
import electricKettle from "../../../assets/images/products/electric-kettle.jpg";
import football from "../../../assets/images/products/football.jpg";
import headphones from "../../../assets/images/products/headphones.jpg";
import hoodie from "../../../assets/images/products/hoodie.jpg";
import jeans from "../../../assets/images/products/jeans.jpg";
import laptop from "../../../assets/images/products/laptop.jpg";
import microwave from "../../../assets/images/products/microwave.jpg";
import runningShoes from "../../../assets/images/products/running-shoes.jpg";
import smartphone from "../../../assets/images/products/smartphone.jpg";
import smartwatch from "../../../assets/images/products/smartwatch.jpg";
import sofa from "../../../assets/images/products/sofa.jpg";
import tableLamp from "../../../assets/images/products/table-lamp.jpg";
import tshirt from "../../../assets/images/products/tshirt.jpg";
import ProductCard from "../../Product/ProductCard";

import electronicsBanner from "../../../assets/images/banners/electronics-banner.jpg";
import homeBanner from "../../../assets/images/banners/home-banner.jpg";

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