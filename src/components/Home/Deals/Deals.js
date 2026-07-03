import "../../../styles/Deals.css"

import products from "../../../data/products";

import ProductCard from "../../Product/ProductCard";

function Deals() {

const deals = products.filter(product=>product.deal);

return(

<section className="deals">

<div className="deal-info">

<h2>Deals & Offers</h2>

<p>Today's Special Deals</p>

</div>

<div className="deal-products">

{

deals.slice(0,5).map(product=>

<ProductCard

key={product.id}

product={product}

/>

)

}

</div>

</section>

);

}

export default Deals;