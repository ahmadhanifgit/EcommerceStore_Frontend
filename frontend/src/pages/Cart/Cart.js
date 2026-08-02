import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "../../styles/Cart.css";

function Cart() {
  const {
    cartItems,
    cartTotal,
    removeFromCart,
    increaseCartQuantity,
    decreaseCartQuantity,
    clearCart,
  } = useCart();

  const shipping = cartItems.length > 0 ? 20 : 0;
  const grandTotal = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty-cart">
        <h1>Your Cart is Empty</h1>
        <p>Add products to start shopping.</p>
        <Link to="/listings" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>

      <div className="cart-container">
        {/* Cart Items */}
        <div className="cart-items">
          {cartItems.map((item) => {
            const itemId = item._id || item.id;
            const title = item.name || item.title || "Product";
            const brand = item.brand || "Generic";

            return (
              <div className="cart-item" key={itemId}>
                <img
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={title}
                  className="cart-item-image"
                />

                <div className="cart-item-info">
                  <h3>{title}</h3>
                  <p>{brand}</p>
                  <p className="cart-price">${item.price}</p>
                </div>

                <div className="cart-quantity">
                  <button onClick={() => decreaseCartQuantity(itemId)}>
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button onClick={() => increaseCartQuantity(itemId)}>
                    +
                  </button>
                </div>

                <div className="cart-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(itemId)}
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>${shipping.toFixed(2)}</span>
          </div>

          <div className="summary-row total-row">
            <span>Total</span>
            <span>${grandTotal.toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>

          <button className="clear-cart-btn" onClick={clearCart}>
            Clear Cart
          </button>

          <Link to="/listings" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;