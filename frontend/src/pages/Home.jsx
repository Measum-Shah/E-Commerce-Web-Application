import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { getAllProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const fetchFeaturedProducts = async () => {
    try {
      const data = await getAllProducts();

      const products = data.products || data.data || [];

      setFeaturedProducts(
        products.filter((product) => product.isFeatured).slice(0, 4)
      );
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <main>
      <section className="mx-auto grid min-h-[85vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-velvet-light">
            Premium Tech Store
          </p>

          <h1 className="font-display text-6xl italic leading-tight tracking-tight text-parchment-50 md:text-7xl">
            Curated laptops for serious work.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-parchment-100/70">
            Buy premium laptops, computers, and accessories with a clean shopping
            experience built for trust, speed, and quality.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="rounded-xl bg-velvet px-7 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-95"
            >
              Shop Collection
            </Link>

            <Link
              to="/products"
              className="rounded-xl border border-graphite-700 px-7 py-4 font-medium text-parchment-100 transition hover:border-velvet hover:text-parchment-50"
            >
              Explore Deals
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2rem] border border-graphite-700 bg-graphite-800 p-4">
            <img
              src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1400&auto=format&fit=crop"
              alt="Premium laptop"
              className="h-[520px] w-full rounded-[1.5rem] object-cover"
            />
          </div>

          <div className="absolute -bottom-8 left-8 rounded-2xl border border-graphite-700 bg-graphite-900/90 p-5 backdrop-blur-xl">
            <p className="font-display text-3xl italic">2026</p>
            <p className="text-sm text-parchment-100/60">
              Professional buying experience
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.3em] text-velvet-light">
              Featured
            </p>

            <h2 className="font-display text-5xl italic tracking-tight">
              Selected machines
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm text-parchment-100/70 transition hover:text-parchment-50 md:flex"
          >
            View all <ArrowRight size={18} />
          </Link>
        </div>

        {featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/60">
            No featured products found.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Home;