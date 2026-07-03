import "../../../styles/Recommended.css";

import products from "../../../data/products";

import ProductCard from "../../Product/ProductCard";

function Recommended(){

const recommended=

products.filter(product=>product.recommended);

return(

<section className="recommended">

<h2>

Recommended Items

</h2>

<div className="recommended-grid">

{

recommended.map(product=>

<ProductCard

key={product.id}

product={product}

variant="recommended"

/>

)

}

</div>

</section>

);

}

export default Recommended;