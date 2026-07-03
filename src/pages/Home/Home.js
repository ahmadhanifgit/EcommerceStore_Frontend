import Hero from "../../components/Home/Hero/Hero";
import Deals from "../../components/Home/Deals/Deals";
import CategorySection from "../../components/Home/CategorySection/CategorySection";
import SupplierBanner from "../../components/Home/SupplierBanner/SupplierBanner";
import Recommended from "../../components/Home/Recommended/Recommended";
import Services from "../../components/Home/Services/Services";
import Suppliers from "../../components/Home/Suppliers/Suppliers";
import Newsletter from "../../components/Home/Newsletter/Newsletter";

import "../../styles/Home.css";

function Home() {

  return (

    <>

      <Hero />

      <Deals />

      <CategorySection
        title="Home & Living"
        category="Home & Living"
      />

      <CategorySection
        title="Consumer Electronics"
        category="Electronics"
      />

      <SupplierBanner />

      <Recommended />

      <Services />

      <Suppliers />

      <Newsletter />

    </>

  );

}

export default Home;