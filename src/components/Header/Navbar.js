import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";


function Navbar() {
  const { cartCount } = useCart();

  return (
    <nav className="navbar">

      <Link to="/">Home</Link>

      <Link to="/listings">Listings</Link>

      <Link to="/cart" className="cart-link">
        Cart

        {cartCount > 0 && (
          <span className="cart-badge">
            {cartCount}
          </span>
        )}

      </Link>

    </nav>
  );
}

export default Navbar;