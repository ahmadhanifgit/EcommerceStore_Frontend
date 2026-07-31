import SearchBar from "./SearchBar";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function MainHeader() {
  const { cartCount } = useCart();

  return (
    <div className="main-header">

      <h1 className="logo">ShopEase</h1>

      <SearchBar />

      <div className="header-icons">
        <Link to="/cart" className="cart-icon">
          <span>🛒</span>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>

    </div>
  );
}

export default MainHeader;