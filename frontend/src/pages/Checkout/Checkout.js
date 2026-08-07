import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { placeOrder } from "../../services/orderService";
import validation, { getErrorMessage } from "../../utils/validation";
import "../../styles/Checkout.css";

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    zip: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTotal, setOrderTotal] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const shipping = cartItems.length > 0 ? 20 : 0;
  const tax = ((cartTotal + shipping) * 0.1).toFixed(2);
  const grandTotal = (parseFloat(cartTotal) + shipping + parseFloat(tax)).toFixed(
    2
  );

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle field blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name);
  };

  // Validate single field
  const validateField = (fieldName) => {
    let error = "";

    if (fieldName === "fullName") {
      if (validation.isFieldEmpty(formData.fullName)) {
        error = getErrorMessage("fullName", "empty");
      }
    }

    if (fieldName === "email") {
      if (validation.isFieldEmpty(formData.email)) {
        error = getErrorMessage("email", "empty");
      } else if (!validation.isValidEmail(formData.email)) {
        error = getErrorMessage("email", "invalid");
      }
    }

    if (fieldName === "phone") {
      if (validation.isFieldEmpty(formData.phone)) {
        error = getErrorMessage("phone", "empty");
      } else if (!validation.isValidPhone(formData.phone)) {
        error = getErrorMessage("phone", "invalid");
      }
    }

    if (fieldName === "address") {
      if (validation.isFieldEmpty(formData.address)) {
        error = getErrorMessage("address", "empty");
      }
    }

    if (fieldName === "city") {
      if (validation.isFieldEmpty(formData.city)) {
        error = getErrorMessage("city", "empty");
      }
    }

    if (fieldName === "zip") {
      if (validation.isFieldEmpty(formData.zip)) {
        error = getErrorMessage("zip", "empty");
      } else if (!validation.isValidZIP(formData.zip)) {
        error = getErrorMessage("zip", "invalid");
      }
    }

    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));

    return error === "";
  };

  // Validate all fields
  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (validation.isFieldEmpty(formData.fullName)) {
      newErrors.fullName = getErrorMessage("fullName", "empty");
      isValid = false;
    }

    if (validation.isFieldEmpty(formData.email)) {
      newErrors.email = getErrorMessage("email", "empty");
      isValid = false;
    } else if (!validation.isValidEmail(formData.email)) {
      newErrors.email = getErrorMessage("email", "invalid");
      isValid = false;
    }

    if (validation.isFieldEmpty(formData.phone)) {
      newErrors.phone = getErrorMessage("phone", "empty");
      isValid = false;
    } else if (!validation.isValidPhone(formData.phone)) {
      newErrors.phone = getErrorMessage("phone", "invalid");
      isValid = false;
    }

    if (validation.isFieldEmpty(formData.address)) {
      newErrors.address = getErrorMessage("address", "empty");
      isValid = false;
    }

    if (validation.isFieldEmpty(formData.city)) {
      newErrors.city = getErrorMessage("city", "empty");
      isValid = false;
    }

    if (validation.isFieldEmpty(formData.zip)) {
      newErrors.zip = getErrorMessage("zip", "empty");
      isValid = false;
    } else if (!validation.isValidZIP(formData.zip)) {
      newErrors.zip = getErrorMessage("zip", "invalid");
      isValid = false;
    }

    setErrors(newErrors);
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      zip: true,
    });
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions while a request is already in flight
    if (isSubmitting) {
      return;
    }

    // Must be logged in to place an order (route is protected, but double-check)
    if (!user) {
      setSubmitError("Please log in to place your order.");
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty. Add items before checking out.");
      navigate("/listings");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitError("");
    setIsSubmitting(true);

    // Build the product lines the backend expects. The server verifies each
    // product and recalculates the total — we only send IDs and quantities.
    const products = cartItems.map((item) => ({
      productId: item._id || item.id,
      quantity: item.quantity,
    }));

    try {
      const order = await placeOrder(products);

      // Show success using the real values returned by the backend
      setOrderId(order._id);
      setOrderTotal(Number(order.totalPrice).toFixed(2));
      setOrderPlaced(true);

      // Clear the cart only after the order is confirmed saved
      clearCart();
    } catch (error) {
      console.error("Order failed:", error);
      setSubmitError(
        error.message || "Something went wrong while placing your order."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is placed, show success message
  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="success-modal">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase.</p>
          <p className="order-details">
            Order ID: <strong>#{orderId}</strong>
          </p>
          <p className="order-total">
            Total: <strong>${orderTotal ?? grandTotal}</strong>
          </p>
          <div className="success-actions">
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              Return to Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page empty-checkout">
        <h1>Your Cart is Empty</h1>
        <p>Add items to your cart before checking out.</p>
        <button
          onClick={() => navigate("/listings")}
          className="continue-shopping-btn"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        {/* Shipping Form */}
        <div className="shipping-form-section">
          <h2>Shipping Details</h2>

          <form onSubmit={handleSubmit} className="checkout-form">
            {/* Full Name Field */}
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.fullName && errors.fullName ? "input-error" : ""
                }`}
                placeholder="Enter your full name"
              />
              {touched.fullName && errors.fullName && (
                <span className="error-message">{errors.fullName}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.email && errors.email ? "input-error" : ""
                }`}
                placeholder="Enter your email"
              />
              {touched.email && errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            {/* Phone Field */}
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.phone && errors.phone ? "input-error" : ""
                }`}
                placeholder="Enter your 11-digit phone number"
              />
              {touched.phone && errors.phone && (
                <span className="error-message">{errors.phone}</span>
              )}
            </div>

            {/* Address Field */}
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.address && errors.address ? "input-error" : ""
                }`}
                placeholder="Enter your address"
              />
              {touched.address && errors.address && (
                <span className="error-message">{errors.address}</span>
              )}
            </div>

            {/* City Field */}
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.city && errors.city ? "input-error" : ""
                }`}
                placeholder="Enter your city"
              />
              {touched.city && errors.city && (
                <span className="error-message">{errors.city}</span>
              )}
            </div>

            {/* ZIP Code Field */}
            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  touched.zip && errors.zip ? "input-error" : ""
                }`}
                placeholder="Enter your 5-digit ZIP code"
              />
              {touched.zip && errors.zip && (
                <span className="error-message">{errors.zip}</span>
              )}
            </div>

            {/* API / submission error banner */}
            {submitError && (
              <div className="checkout-error" role="alert">
                {submitError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="place-order-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary-section">
          <h2>Order Summary</h2>

          <div className="order-items">
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <div className="item-info">
                  <img src={item.image} alt={item.title} />
                  <div className="item-details">
                    <h4>{item.title}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="price-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%):</span>
              <span>${tax}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${grandTotal}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
