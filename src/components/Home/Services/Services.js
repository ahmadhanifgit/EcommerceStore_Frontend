import "../../../styles/Services.css";

import warehouse from "../../../assets/images/services/warehouse.jpg";

import customization from "../../../assets/images/services/customization.jpg";

import shipping from "../../../assets/images/services/shipping.jpg";

import inspection from "../../../assets/images/services/inspection.jpg";

import {

FaSearch,

FaShippingFast,

FaTools,

FaWarehouse

}

from "react-icons/fa";

const services=[

{

title:"Source from Industry Hubs",

image:warehouse,

icon:<FaWarehouse/>

},

{

title:"Customize Your Products",

image:customization,

icon:<FaTools/>

},

{

title:"Fast Reliable Shipping",

image:shipping,

icon:<FaShippingFast/>

},

{

title:"Product Inspection",

image:inspection,

icon:<FaSearch/>

}

];

function Services(){

return(

<section className="services">

<h2>

Our Extra Services

</h2>

<div className="service-grid">

{

services.map((service,index)=>(

<div

className="service-card"

key={index}

>

<img

src={service.image}

alt={service.title}

/>

<div className="service-content">

<h4>

{service.title}

</h4>

<div className="service-icon">

{service.icon}

</div>

</div>

</div>

))

}

</div>

</section>

);

}

export default Services;