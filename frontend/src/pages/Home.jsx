import { useEffect, useState } from "react";
import { useLoader } from "../context/LoaderContext";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Star,
  Zap,
  Package,
  Award,
} from "lucide-react";

import { getAllProducts } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";

/* ─── helpers ─────────────────────────────────────────── */
const filterByCategory = (products, keyword) =>
  products.filter((p) =>
    p.category?.name?.toLowerCase().includes(keyword.toLowerCase())
  );

const CATEGORY_CONFIG = [
  {
    key: "laptop",
    label: "Laptops",
    tagline: "Engineered for peak performance",
    accent: "from-violet-900/40 to-transparent",
    badge: "bg-violet-500/20 text-violet-300",
  },
  {
    key: "pc",
    label: "Desktop PCs",
    tagline: "Power that doesn't compromise",
    accent: "from-sky-900/40 to-transparent",
    badge: "bg-sky-500/20 text-sky-300",
  },
  {
    key: "accessor",
    label: "Accessories",
    tagline: "Elevate your every setup",
    accent: "from-amber-900/40 to-transparent",
    badge: "bg-amber-500/20 text-amber-300",
  },
  {
    key: "hardware",
    label: "Hardware",
    tagline: "Build. Upgrade. Dominate.",
    accent: "from-emerald-900/40 to-transparent",
    badge: "bg-emerald-500/20 text-emerald-300",
  },
];

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Verified Products",
    desc: "Every item inspected and certified before listing.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    desc: "Nationwide shipping within 2–5 business days.",
  },
  {
    icon: RotateCcw,
    title: "7-Day Returns",
    desc: "Not satisfied? Return it hassle-free.",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Real humans ready to help, 9am–9pm daily.",
  },
];

const STATS = [
  { value: "12K+", label: "Happy Customers" },
  { value: "3,500+", label: "Products Sold" },
  { value: "4.9★", label: "Average Rating" },
  { value: "99%", label: "Satisfaction Rate" },
];

const TESTIMONIALS = [
  {
    name: "Ayesha R.",
    role: "Graphic Designer",
    text: "Got my MacBook Pro in perfect condition. The listing was accurate and delivery was surprisingly fast. Premier is now my go-to.",
    stars: 5,
  },
  {
    name: "Hamza K.",
    role: "Software Engineer",
    text: "Bought a refurbished ThinkPad and honestly couldn't tell it was used. Great value for money — highly recommend.",
    stars: 5,
  },
  {
    name: "Sara M.",
    role: "Content Creator",
    text: "The accessories section is incredible. Got a mechanical keyboard and a monitor stand, both arrived well-packaged and on time.",
    stars: 4,
  },
];

/* ─── section component ───────────────────────────────── */
const CategorySection = ({ config, products, index }) => {
  const items = filterByCategory(products, config.key).slice(0, 4);
  const isEven = index % 2 === 0;

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">
      {/* decorative side accent */}
      <div
        className={`pointer-events-none absolute inset-y-0 ${
          isEven ? "left-0" : "right-0"
        } w-1/3 bg-gradient-to-r ${config.accent} blur-3xl`}
      />

      <div className="relative">
        {/* section header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span
              className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-medium uppercase tracking-widest ${config.badge}`}
            >
              {String(index + 1).padStart(2, "0")} — Collection
            </span>

            <h2 className="font-display text-6xl italic tracking-tight text-parchment-50 md:text-7xl">
              {config.label}
            </h2>

            <p className="mt-2 text-lg text-parchment-100/50">
              {config.tagline}
            </p>
          </div>

          <Link
            to="/products"
            className="group flex items-center gap-2 self-start rounded-xl border border-graphite-700 px-5 py-3 text-sm text-parchment-100/70 transition hover:border-velvet hover:text-parchment-50 md:self-auto"
          >
            View all{" "}
            <ArrowRight
              size={16}
              className="transition group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* products grid */}
        {items.length === 0 ? (
          <div className="flex h-52 items-center justify-center rounded-3xl border border-dashed border-graphite-700 text-parchment-100/40">
            No {config.label.toLowerCase()} listed yet — check back soon.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

/* ─── main component ──────────────────────────────────── */
const Home = () => {
  const [products, setProducts] = useState([]);
  const { withLoader } = useLoader();

  useEffect(() => {
    const load = async () => {
      await withLoader(async () => {
        try {
          const data = await getAllProducts();
          setProducts(data.products || data.data || []);
        } catch (err) {
          console.log(err.message);
        }
      });
    };
    load();
  }, []);

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] overflow-hidden bg-graphite-900">
        {/* giant background number */}
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-display text-[22rem] italic leading-none text-graphite-800/60"
        >
          01
        </span>

        {/* noise overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        {/* purple glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-velvet/20 blur-[120px]" />

        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-[1fr_520px]">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-velvet-light" />
              <p className="text-sm uppercase tracking-[0.4em] text-velvet-light">
                Premium Tech Store — Pakistan
              </p>
            </div>

            <h1 className="font-display text-7xl italic leading-[0.95] tracking-tight text-parchment-50 md:text-8xl lg:text-[6.5rem]">
              The finest
              <br />
              <span className="text-velvet-light">machines,</span>
              <br />
              delivered.
            </h1>

            <p className="mt-8 max-w-lg text-xl leading-8 text-parchment-100/60">
              Curated laptops, PCs, accessories, and hardware — built for people
              who take their work seriously.
            </p>

            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="group flex items-center gap-3 rounded-2xl bg-velvet px-8 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-95"
              >
                Shop Now
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>

              <Link
                to="/products"
                className="rounded-2xl border border-graphite-700 px-8 py-4 font-medium text-parchment-100 transition hover:border-velvet hover:text-parchment-50"
              >
                View Deals
              </Link>
            </div>

            {/* mini stats */}
            <div className="mt-14 flex flex-wrap gap-8">
              {STATS.slice(0, 3).map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl italic text-parchment-50">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-parchment-100/50">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* hero image stack */}
          <div className="relative hidden lg:block">
            {/* back card */}
            <div className="absolute -right-6 -top-6 h-full w-full rounded-[2.5rem] border border-graphite-700 bg-graphite-800" />
            {/* front card */}
            <div className="relative rounded-[2.5rem] border border-graphite-700 bg-graphite-800 p-4 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=900&auto=format&fit=crop"
                alt="Premium laptop"
                className="h-[520px] w-full rounded-[2rem] object-cover"
              />

              {/* floating badge */}
              <div className="absolute -left-8 bottom-16 rounded-2xl border border-graphite-700 bg-graphite-900/95 px-5 py-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-velvet/20">
                    <Zap size={18} className="text-velvet-light" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-parchment-50">
                      In stock & ready
                    </p>
                    <p className="text-xs text-parchment-100/50">
                      Ships within 24hrs
                    </p>
                  </div>
                </div>
              </div>

              {/* floating price tag */}
              <div className="absolute -right-6 top-10 rounded-2xl border border-graphite-700 bg-graphite-900/95 px-4 py-3 backdrop-blur-xl">
                <p className="text-xs text-parchment-100/50">Starting from</p>
                <p className="font-display text-2xl italic text-parchment-50">
                  Rs. 45,000
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
          <div className="h-10 w-px animate-pulse bg-gradient-to-b from-velvet/60 to-transparent" />
          <p className="text-xs uppercase tracking-widest text-parchment-100/30">
            Scroll
          </p>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────── */}
      <section className="border-y border-graphite-700 bg-graphite-800/50">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TRUST_FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-graphite-700 bg-graphite-900">
                  <Icon size={20} className="text-velvet-light" />
                </div>
                <div>
                  <p className="font-medium text-parchment-50">{title}</p>
                  <p className="mt-0.5 text-sm text-parchment-100/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY SECTIONS ────────────────────────────── */}
      <div className="divide-y divide-graphite-800">
        {CATEGORY_CONFIG.map((config, i) => (
          <CategorySection
            key={config.key}
            config={config}
            products={products}
            index={i}
          />
        ))}
      </div>

      {/* ── STATS BANNER ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-velvet py-20">
        {/* giant text bg */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display text-[14rem] italic leading-none text-white/5 select-none"
        >
          Premier
        </span>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-6xl italic text-parchment-50">
                  {s.value}
                </p>
                <p className="mt-2 text-sm uppercase tracking-[0.3em] text-white/60">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PREMIER ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <span className="mb-4 inline-block rounded-full border border-graphite-700 px-4 py-1.5 text-xs uppercase tracking-widest text-velvet-light">
            Why choose us
          </span>
          <h2 className="font-display text-6xl italic tracking-tight text-parchment-50">
            Built different.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-parchment-100/50">
            We obsess over every product in our catalog so you get exactly what
            you see — no surprises, no shortcuts.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Award,
              title: "Curated, Not Random",
              body: "Every product goes through a strict quality check. We only list what we'd buy ourselves.",
              highlight: true,
            },
            {
              icon: Package,
              title: "Accurate Listings",
              body: "Photos, specs, and condition descriptions are all verified. What you see is what arrives.",
              highlight: false,
            },
            {
              icon: ShieldCheck,
              title: "Buyer Protection",
              body: "7-day return policy on all orders. If something's wrong, we make it right — period.",
              highlight: false,
            },
          ].map(({ icon: Icon, title, body, highlight }) => (
            <div
              key={title}
              className={`rounded-3xl border p-8 ${
                highlight
                  ? "border-velvet bg-velvet/10"
                  : "border-graphite-700 bg-graphite-800"
              }`}
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${
                  highlight ? "bg-velvet/30" : "bg-graphite-900"
                }`}
              >
                <Icon
                  size={26}
                  className={highlight ? "text-velvet-light" : "text-parchment-100/60"}
                />
              </div>
              <h3 className="font-display text-3xl italic text-parchment-50">
                {title}
              </h3>
              <p className="mt-3 leading-7 text-parchment-100/60">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="bg-graphite-800/40 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-3 inline-block text-xs uppercase tracking-[0.4em] text-velvet-light">
                Reviews
              </span>
              <h2 className="font-display text-6xl italic tracking-tight text-parchment-50">
                Real buyers.
                <br />
                Real words.
              </h2>
            </div>
            <p className="max-w-xs text-parchment-100/50 md:text-right">
              Over 12,000 customers have trusted Premier for their tech needs.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-3xl border border-graphite-700 bg-graphite-800 p-7"
              >
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>

                <p className="mt-5 text-lg leading-8 text-parchment-100/80">
                  "{t.text}"
                </p>

                <div className="mt-6 flex items-center gap-3 border-t border-graphite-700 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-velvet/20 font-medium text-velvet-light">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-parchment-50">
                      {t.name}
                    </p>
                    <p className="text-xs text-parchment-100/50">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-graphite-700 bg-graphite-800 p-12 text-center md:p-20">
          {/* decorative blobs */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-velvet/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-velvet/20 blur-3xl" />

          <div className="relative">
            <p className="mb-4 text-sm uppercase tracking-[0.4em] text-velvet-light">
              Ready to upgrade?
            </p>
            <h2 className="font-display text-6xl italic tracking-tight text-parchment-50 md:text-7xl">
              Find your next
              <br />
              machine today.
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-lg text-parchment-100/60">
              Hundreds of verified products. Competitive prices. Delivered to
              your door anywhere in Pakistan.
            </p>
            <Link
              to="/products"
              className="mt-10 inline-flex items-center gap-3 rounded-2xl bg-velvet px-10 py-5 text-lg font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-95"
            >
              Browse Collection <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Home;