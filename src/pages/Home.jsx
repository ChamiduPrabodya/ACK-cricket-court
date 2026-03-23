import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Promotions from "../components/Promotions.jsx";
import WhyChoose from "../components/WhyChoose.jsx";
import Facilities from "../components/Facilities.jsx";
import Pricing from "../components/Pricing.jsx";
import ContactLocation from "../components/ContactLocation.jsx";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Promotions />
      <WhyChoose />
      <Facilities />
      <Pricing />
      <ContactLocation />
    </div>
  );
}

