import "../../../styles/Newsletter.css";
import { useState } from "react";

function Newsletter(){
	const [email, setEmail] = useState("");
	const [status, setStatus] = useState("");

	const handleSubscribe = (e) => {
		e.preventDefault();
		const trimmed = email.trim();
		if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
			setStatus("Please enter a valid email address.");
			return;
		}

		// Save to localStorage as a simple persistence and show feedback
		try {
			const subs = JSON.parse(localStorage.getItem("newsletterSubs") || "[]");
			subs.push({ email: trimmed, date: new Date().toISOString() });
			localStorage.setItem("newsletterSubs", JSON.stringify(subs));
			setStatus("Thanks! You're subscribed.");
			setEmail("");
		} catch (err) {
			console.error(err);
			setStatus("Subscription failed. Try again.");
		}
	};

	return(
		<section className="newsletter">

			<h2>Subscribe To Our Newsletter</h2>

			<p>Get daily updates on products and offers.</p>

			<form className="newsletter-box" onSubmit={handleSubscribe}>
				<input
					type="email"
					placeholder="Enter your email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<button type="submit">Subscribe</button>
			</form>

			{status && <p className="newsletter-status">{status}</p>}

		</section>
	);

}

export default Newsletter;