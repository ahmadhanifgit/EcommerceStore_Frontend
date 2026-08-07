import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";


function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

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

      <Link to="/checkout">Checkout</Link>

      {/* Auth Links — show Login or User name + Logout based on auth state */}
      {user ? (
        <>
          <span className="nav-user-greeting">Hi, {user.name}</span>
          <button className="nav-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}

    </nav>
  );
}

export default Navbar;