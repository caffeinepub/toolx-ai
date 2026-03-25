import Dashboard from "./components/Dashboard";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Tools from "./components/Tools";

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: "#04060f" }}>
      <Navbar />
      <main>
        <Hero />
        <Tools />
        <Dashboard />
        <Pricing />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
