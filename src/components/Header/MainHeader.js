import SearchBar from "./SearchBar";

function MainHeader() {
  return (
    <div className="main-header">

      <h1 className="logo">ShopEase</h1>

      <SearchBar />

      <div className="header-icons">

        <span>♡ Wishlist</span>

        <span>🛒 Cart</span>

      </div>

    </div>
  );
}

export default MainHeader;