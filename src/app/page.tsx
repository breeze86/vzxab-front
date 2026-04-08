import Features from "./components/Features";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Reviews from "./components/Reviews";
import Specs from "./components/Specs";
import Support from "./components/Support";

export default function Home() {
  return (
    <div className="isolate min-h-screen bg-white" id="top">
      <Header />
      <main className="relative z-0 overflow-x-hidden pt-16">
        <Hero />
        {/* <Features /> */}
        <Products />
        <Specs />
        <Reviews />
        <Support />
        <Footer />
      </main>
    </div>
  );
}
