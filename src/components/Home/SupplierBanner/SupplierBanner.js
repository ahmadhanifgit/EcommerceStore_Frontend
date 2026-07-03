import "../../../styles/SupplierBanner.css";

function SupplierBanner(){

return(

<section className="supplier-banner">

<div className="supplier-left">

<h2>

An easy way to send requests to suppliers

</h2>

<p>

Submit your sourcing request and receive quotes from verified suppliers.

</p>

</div>

<div className="supplier-form">

<input

type="text"

placeholder="What item do you need?"

/>

<textarea

rows="5"

placeholder="Describe your requirements"

></textarea>

<button>

Send Inquiry

</button>

</div>

</section>

);

}

export default SupplierBanner;