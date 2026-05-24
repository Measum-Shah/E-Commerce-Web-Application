import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useLoader } from "../context/LoaderContext";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

import { getAllProducts } from "../api/productApi";
import { getAllCategories } from "../api/categoryApi";
import ProductCard from "../components/ProductCard";

const PAGE_SIZE = 6;
const LOAD_MORE = 5;
const MIN_PRICE = 100;
const MAX_PRICE = 150000;

/* ─── Dual Range Slider ───────────────────────────────────── */
const RangeSlider = ({ min, max, value, onChange }) => {
  const trackRef = useRef(null);

  const toPercent = (v) => ((v - min) / (max - min)) * 100;

  const clamp = (v) => Math.min(max, Math.max(min, v));

  const handleTrackClick = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    const raw = min + pct * (max - min);
    const midVal = (value[0] + value[1]) / 2;
    if (raw < midVal) {
      onChange([clamp(Math.round(raw / 1000) * 1000), value[1]]);
    } else {
      onChange([value[0], clamp(Math.round(raw / 1000) * 1000)]);
    }
  };

  const startDrag = (thumb, e) => {
    e.preventDefault();
    const rect = trackRef.current.getBoundingClientRect();

    const onMove = (ev) => {
      const clientX = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + pct * (max - min);
      const rounded = clamp(Math.round(raw / 1000) * 1000);

      if (thumb === 0) {
        onChange([Math.min(rounded, value[1] - 1000), value[1]]);
      } else {
        onChange([value[0], Math.max(rounded, value[0] + 1000)]);
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);
  };

  const leftPct = toPercent(value[0]);
  const rightPct = toPercent(value[1]);

  return (
    <div className="px-2 pt-1 pb-2">
      {/* price labels */}
      <div className="mb-4 flex items-center justify-between">
        <div className="rounded-lg border border-graphite-700 bg-graphite-900 px-3 py-1.5 text-sm font-medium text-parchment-50">
          Rs. {value[0].toLocaleString()}
        </div>
        <div className="text-xs text-parchment-100/30">to</div>
        <div className="rounded-lg border border-graphite-700 bg-graphite-900 px-3 py-1.5 text-sm font-medium text-parchment-50">
          Rs. {value[1].toLocaleString()}
        </div>
      </div>

      {/* track */}
      <div
        ref={trackRef}
        className="relative h-1.5 w-full cursor-pointer rounded-full bg-graphite-700"
        onClick={handleTrackClick}
      >
        {/* filled range */}
        <div
          className="absolute h-full rounded-full bg-velvet"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />

        {/* left thumb */}
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-velvet bg-parchment-50 shadow-md transition-transform active:scale-110 active:cursor-grabbing"
          style={{ left: `${leftPct}%` }}
          onMouseDown={(e) => startDrag(0, e)}
          onTouchStart={(e) => startDrag(0, e)}
        />

        {/* right thumb */}
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-velvet bg-parchment-50 shadow-md transition-transform active:scale-110 active:cursor-grabbing"
          style={{ left: `${rightPct}%` }}
          onMouseDown={(e) => startDrag(1, e)}
          onTouchStart={(e) => startDrag(1, e)}
        />
      </div>

      {/* min/max labels */}
      <div className="mt-3 flex justify-between text-xs text-parchment-100/30">
        <span>Rs. {MIN_PRICE.toLocaleString()}</span>
        <span>Rs. {MAX_PRICE.toLocaleString()}</span>
      </div>
    </div>
  );
};

/* ─── Category Section ────────────────────────────────────── */
const CategorySection = ({ category, products }) => {
  const [shown, setShown] = useState(PAGE_SIZE);

  if (products.length === 0) return null;

  const visible = products.slice(0, shown);
  const canLoadMore = shown < products.length;
  const canShowLess = shown > PAGE_SIZE;

  return (
    <section className="mb-14 sm:mb-16">
      {/* header */}
      <div className="mb-6 flex items-center gap-4">
        <div className="shrink-0">
          <h2 className="font-display text-3xl sm:text-4xl italic tracking-tight text-parchment-50">
            {category.name}
          </h2>
          <p className="mt-0.5 text-xs text-parchment-100/40">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="h-px flex-1 bg-graphite-700/50" />
      </div>

      {/* grid */}
      <div className="grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* load more / less buttons */}
      {(canLoadMore || canShowLess) && (
        <div className="mt-7 flex items-center justify-center gap-3">
          {canLoadMore && (
            <button
              onClick={() => setShown((v) => Math.min(v + LOAD_MORE, products.length))}
              className="flex items-center gap-2 rounded-xl border border-graphite-700 bg-graphite-800 px-5 py-2.5 text-sm text-parchment-100/60 transition hover:border-velvet hover:text-parchment-50 active:scale-95"
            >
              Show {Math.min(LOAD_MORE, products.length - shown)} more
              <ChevronDown size={15} />
            </button>
          )}
          {canShowLess && (
            <button
              onClick={() => setShown(PAGE_SIZE)}
              className="flex items-center gap-2 rounded-xl border border-graphite-700 bg-graphite-800 px-5 py-2.5 text-sm text-parchment-100/60 transition hover:border-velvet hover:text-parchment-50 active:scale-95"
            >
              Show less
              <ChevronUp size={15} />
            </button>
          )}
        </div>
      )}
    </section>
  );
};

/* ─── Main Page ───────────────────────────────────────────── */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);

  const searchRef = useRef(null);
  const { withLoader, loading } = useLoader();

  const fetchData = async () => {
    await withLoader(async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ]);
        setProducts(productData.products || productData.data || []);
        setCategories(categoryData.categories || categoryData.data || []);
      } catch (error) {
        console.log(error.response?.data?.message || error.message);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ── filtered + grouped ── */
  const { grouped, totalVisible } = useMemo(() => {
    const q = search.trim().toLowerCase();
    const [pMin, pMax] = priceRange;

    const filtered = products.filter((p) => {
      if (q) {
        const hit =
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q);
        if (!hit) return false;
      }
      if (selectedCategory !== "all") {
        const catId = p.category?._id || p.category;
        if (catId !== selectedCategory) return false;
      }
      const price = p.price || 0;
      if (price < pMin || price > pMax) return false;
      return true;
    });

    const map = new Map();
    categories.forEach((c) => map.set(c._id, { category: c, products: [] }));

    filtered.forEach((p) => {
      const catId = p.category?._id || p.category || "__other__";
      if (!map.has(catId)) {
        map.set(catId, {
          category: { _id: catId, name: p.category?.name || "Other" },
          products: [],
        });
      }
      map.get(catId).products.push(p);
    });

    const grouped = [...map.values()].filter((g) => g.products.length > 0);
    return { grouped, totalVisible: filtered.length };
  }, [products, categories, search, selectedCategory, priceRange]);

  const hasActiveFilters =
    search ||
    selectedCategory !== "all" ||
    priceRange[0] !== MIN_PRICE ||
    priceRange[1] !== MAX_PRICE;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setPriceRange([MIN_PRICE, MAX_PRICE]);
  };

  const isPriceDefault =
    priceRange[0] === MIN_PRICE && priceRange[1] === MAX_PRICE;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">

      {/* ── page header ── */}
      <div className="mb-10">
        <p className="mb-3 text-xs sm:text-sm uppercase tracking-[0.35em] text-velvet-light">
          Collection
        </p>
        <h1 className="font-display text-4xl sm:text-6xl italic tracking-tight text-parchment-50">
          Shop premium tech
        </h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base text-parchment-100/60">
          Browse laptops, computers, and accessories with a clean professional buying experience.
        </p>
      </div>

      {/* ── search bar ── */}
      <div className="mb-5 relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-parchment-100/40"
        />
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products or brands…"
          className="w-full rounded-xl border border-graphite-700 bg-graphite-800 py-3 pl-10 pr-9 text-sm text-parchment-50 placeholder:text-parchment-100/30 outline-none transition focus:border-velvet focus:bg-graphite-900"
        />
        {search && (
          <button
            onClick={() => { setSearch(""); searchRef.current?.focus(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-parchment-100/40 transition hover:text-parchment-50"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── category pills ── */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-xl px-3.5 py-2 text-sm transition active:scale-95 ${
            selectedCategory === "all"
              ? "bg-velvet text-parchment-50"
              : "border border-graphite-700 bg-graphite-800 text-parchment-100/60 hover:border-velvet hover:text-parchment-50"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() =>
              setSelectedCategory(
                selectedCategory === cat._id ? "all" : cat._id
              )
            }
            className={`rounded-xl px-3.5 py-2 text-sm transition active:scale-95 ${
              selectedCategory === cat._id
                ? "bg-velvet text-parchment-50"
                : "border border-graphite-700 bg-graphite-800 text-parchment-100/60 hover:border-velvet hover:text-parchment-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* ── price range ── */}
      <div className="mb-8 rounded-2xl border border-graphite-700 bg-graphite-800 px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs uppercase tracking-widest text-parchment-100/40">
            Price range
          </p>
          {!isPriceDefault && (
            <button
              onClick={() => setPriceRange([MIN_PRICE, MAX_PRICE])}
              className="text-xs text-parchment-100/40 transition hover:text-velvet-light"
            >
              Reset
            </button>
          )}
        </div>
        <RangeSlider
          min={MIN_PRICE}
          max={MAX_PRICE}
          value={priceRange}
          onChange={setPriceRange}
        />
      </div>

      {/* ── meta row ── */}
      <div className="mb-8 flex items-center justify-between">
        <p className="text-xs text-parchment-100/30">
          {!loading && (
            totalVisible === products.length
              ? `${products.length} product${products.length !== 1 ? "s" : ""}`
              : `${totalVisible} of ${products.length} products`
          )}
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-xl border border-graphite-700 px-3.5 py-2 text-xs text-parchment-100/50 transition hover:border-velvet hover:text-parchment-50 active:scale-95"
          >
            <X size={12} />
            Clear all filters
          </button>
        )}
      </div>

      {/* ── content ── */}
      {!loading && grouped.length === 0 ? (
        <div className="rounded-2xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/50">
          {hasActiveFilters
            ? "No products match your filters."
            : "No products found."}
        </div>
      ) : (
        grouped.map(({ category, products: catProducts }) => (
          <CategorySection
            key={category._id}
            category={category}
            products={catProducts}
          />
        ))
      )}
    </main>
  );
};

export default Products;