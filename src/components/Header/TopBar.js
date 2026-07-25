import { Link } from "react-router-dom";

function TopBar() {
  return (
    <div className="top-bar">
      <p>Free Shipping on Orders Over $5000</p>

      <div className="top-links">
        <Link to="/login">Login</Link>
        <Link to="/signup">Register</Link>
      </div>
    </div>
  );
}

export default TopBar;