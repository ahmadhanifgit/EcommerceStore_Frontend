import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import ProductListings from "./pages/ProductListings/ProductListings";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";

import CartProvider from "./context/CartContext";

import {
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <CartProvider>

      <Header />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/listings"
          element={<ProductListings />}
        />

        <Route
          path="/details/:id"
          element={<ProductDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

      </Routes>

      <Footer />

    </CartProvider>
  );
}

export default App;