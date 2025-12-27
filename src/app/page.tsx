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
    <div className="min-h-screen bg-white" id="top">
      <Header />
      <main className="overflow-x-hidden">
        <Hero />
        <Features />
        <Products />
        <Specs />
        <Reviews />
        <Support />
        <Footer />
      </main>
    </div>
  );
}
