import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import ProductListings from "./pages/ProductListings/ProductListings";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Checkout from "./pages/Checkout/Checkout";

import CartProvider from "./context/CartContext";
import AuthProvider from "./context/AuthContext";

import {
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <AuthProvider>
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

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

        </Routes>

        <Footer />

      </CartProvider>
    </AuthProvider>
  );
}

export default App;