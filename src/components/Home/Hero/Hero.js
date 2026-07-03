import "../../../styles/Hero.css"

import heroBanner from "../../../assets/images/hero/hero-banner.jpg";

import {
  FaUserCircle,
  FaGift,
  FaClipboardList,
} from "react-icons/fa";

function Hero() {
  return (
    <section className="hero">

      {/* LEFT MENU */}

      <div className="hero-menu">

        <ul>

          <li>Automobiles</li>

          <li>Clothes & Wear</li>

          <li>Home Interiors</li>

          <li>Computer & Tech</li>

          <li>Tools & Equipment</li>

          <li>Sports & Outdoor</li>

          <li>Animal & Pets</li>

          <li>Machinery Tools</li>

          <li>More Categories</li>

        </ul>

      </div>

      {/* CENTER */}

      <div className="hero-banner">

        <img
          src={heroBanner}
          alt="Hero Banner"
        />

      </div>

      {/* RIGHT */}

      <div className="hero-right">

        <div className="user-card">

          <FaUserCircle size={40}/>

          <h4>Hi, User</h4>

          <button>Join Now</button>

          <button className="login-btn">
            Log In
          </button>

        </div>

        <div className="offer-card orange">

          <FaGift/>

          <p>Get US $10 off with a new supplier</p>

        </div>

        <div className="offer-card blue">

          <FaClipboardList/>

          <p>Send quotes with supplier preferences</p>

        </div>

      </div>

    </section>
  );
}

export default Hero;