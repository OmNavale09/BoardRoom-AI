import Navbar from "./Navbar.jsx";
import Hero from "./Hero.jsx";
import Features from "./Feature.jsx";
import Team from "./Team.jsx";
import HowItWorks from "./HowItWorks.jsx";
import Privacy from "./Privacy.jsx";
import Terms from "./Terms.jsx";
import Footer from "./Footer.jsx";
import './Feature.css'

export default function Landing() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <Features />
      <Team />
      <HowItWorks />
      <Privacy />
      <Terms />
      <Footer />
    </div>
  );
}