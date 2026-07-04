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

          {cartItems.map((item) => (

            <div className="cart-item" key={item.id}>

              <img
                src={item.image}
                alt={item.title}
                className="cart-item-image"
              />

              <div className="cart-item-info">

                <h3>{item.title}</h3>

                <p>{item.brand}</p>

                <p className="cart-price">
                  ${item.price}
                </p>

              </div>

              <div className="cart-quantity">

                <button
                  onClick={() =>
                    decreaseCartQuantity(item.id)
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    increaseCartQuantity(item.id)
                  }
                >
                  +
                </button>

              </div>

              <div className="cart-subtotal">

                $
                {(item.price * item.quantity).toFixed(2)}

              </div>

              <button
                className="remove-btn"
                onClick={() =>
                  removeFromCart(item.id)
                }
              >
                Remove
              </button>

            </div>

          ))}

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

          <button className="checkout-btn">
            Proceed to Checkout
          </button>

          <button
            className="clear-cart-btn"
            onClick={clearCart}
          >
            Clear Cart
          </button>

          <Link
            to="/listings"
            className="continue-shopping-btn"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default Cart;