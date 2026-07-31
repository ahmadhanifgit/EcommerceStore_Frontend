import "../../../styles/SupplierBanner.css";
import { useState } from "react";

function SupplierBanner(){
	const [item, setItem] = useState("");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState("");

	const handleSend = (e) => {
		e.preventDefault();
		if (!item.trim() || !message.trim()) {
			setStatus("Please fill both fields before sending.");
			return;
		}

		try {
			const inquiries = JSON.parse(localStorage.getItem("inquiries") || "[]");
			inquiries.push({ item: item.trim(), message: message.trim(), date: new Date().toISOString() });
			localStorage.setItem("inquiries", JSON.stringify(inquiries));
			setStatus("Inquiry sent. Suppliers will contact you soon.");
			setItem("");
			setMessage("");
		} catch (err) {
			console.error(err);
			setStatus("Failed to send inquiry. Try again.");
		}
	};

	return(
		<section className="supplier-banner">

			<div className="supplier-left">

				<h2>An easy way to send requests to suppliers</h2>

				<p>Submit your sourcing request and receive quotes from verified suppliers.</p>

			</div>

			<form className="supplier-form" onSubmit={handleSend}>

				<input
					type="text"
					placeholder="What item do you need?"
					value={item}
					onChange={(e) => setItem(e.target.value)}
				/>

				<textarea
					rows="5"
					placeholder="Describe your requirements"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
				></textarea>

				<button type="submit">Send Inquiry</button>

				{status && <p className="inquiry-status">{status}</p>}

			</form>

		</section>
	);

}

export default SupplierBanner;