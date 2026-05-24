import { useEffect, useState, useMemo, useRef } from "react";
import { useLoader } from "../context/LoaderContext";
import { Search, X, ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";

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
    <div className="pt-1 pb-2">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex-1 rounded-lg border border-graphite-700 bg-graphite-900 px-3 py-1.5 text-xs font-medium text-parchment-50 text-center">
          Rs. {value[0].toLocaleString()}
        </div>
        <div className="text-xs text-parchment-100/30">—</div>
        <div className="flex-1 rounded-lg border border-graphite-700 bg-graphite-900 px-3 py-1.5 text-xs font-medium text-parchment-50 text-center">
          Rs. {value[1].toLocaleString()}
        </div>
      </div>

      <div
        ref={trackRef}
        className="relative h-1.5 w-full cursor-pointer rounded-full bg-graphite-700"
        onClick={handleTrackClick}
      >
        <div
          className="absolute h-full rounded-full bg-velvet"
          style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-velvet bg-parchment-50 shadow-md transition-transform active:scale-110 active:cursor-grabbing"
          style={{ left: `${leftPct}%` }}
          onMouseDown={(e) => startDrag(0, e)}
          onTouchStart={(e) => startDrag(0, e)}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full border-2 border-velvet bg-parchment-50 shadow-md transition-transform active:scale-110 active:cursor-grabbing"
          style={{ left: `${rightPct}%` }}
          onMouseDown={(e) => startDrag(1, e)}
          onTouchStart={(e) => startDrag(1, e)}
        />
      </div>

      <div className="mt-2.5 flex justify-between text-xs text-parchment-100/30">
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

      <div className="grid gap-4 sm:gap-5 grid-cols-1 lg:grid-cols-3 xl:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

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

/* ─── Sidebar Filters ─────────────────────────────────────── */
const SidebarFilters = ({
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  hasActiveFilters,
  clearFilters,
}) => {
  const isPriceDefault =
    priceRange[0] === MIN_PRICE && priceRange[1] === MAX_PRICE;

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0">
      <div className="sticky top-6 space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-parchment-100/40">
            Filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-parchment-100/40 transition hover:text-velvet-light"
            >
              <X size={11} />
              Clear all
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="rounded-2xl border border-graphite-700 bg-graphite-800 p-5">
          <p className="mb-4 text-xs uppercase tracking-widest text-parchment-100/40">
            Categories
          </p>
          <div className="space-y-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategories.includes(cat._id);
              return (
                <label
                  key={cat._id}
                  className="flex cursor-pointer items-center gap-3 group"
                >
                  {/* Round radio-style toggle (multi-select) */}
                  <span
                    onClick={() => toggleCategory(cat._id)}
                    className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-velvet bg-velvet"
                        : "border-graphite-600 bg-graphite-900 group-hover:border-velvet/60"
                    }`}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-parchment-50" />
                    )}
                  </span>
                  <span
                    onClick={() => toggleCategory(cat._id)}
                    className={`text-sm transition-colors ${
                      isSelected
                        ? "text-parchment-50"
                        : "text-parchment-100/60 group-hover:text-parchment-100/80"
                    }`}
                  >
                    {cat.name}
                  </span>
                </label>
              );
            })}

            {categories.length === 0 && (
              <p className="text-xs text-parchment-100/30">No categories found</p>
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="rounded-2xl border border-graphite-700 bg-graphite-800 p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-parchment-100/40">
              Price Range
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

      </div>
    </aside>
  );
};

/* ─── Mobile Filter Drawer ────────────────────────────────── */
const MobileFilterDrawer = ({
  open,
  onClose,
  categories,
  selectedCategories,
  toggleCategory,
  priceRange,
  setPriceRange,
  hasActiveFilters,
  clearFilters,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="relative ml-auto h-full w-80 max-w-[90vw] overflow-y-auto bg-graphite-900 p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm font-medium text-parchment-50">Filters</p>
          <button
            onClick={onClose}
            className="rounded-lg border border-graphite-700 p-1.5 text-parchment-100/60 transition hover:border-graphite-500 hover:text-parchment-50"
          >
            <X size={16} />
          </button>
        </div>

        <SidebarFilters
          categories={categories}
          selectedCategories={selectedCategories}
          toggleCategory={toggleCategory}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          hasActiveFilters={hasActiveFilters}
          clearFilters={() => { clearFilters(); onClose(); }}
        />
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────── */
const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); // multi-select array
  const [priceRange, setPriceRange] = useState([MIN_PRICE, MAX_PRICE]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const hasActiveFilters =
    search ||
    selectedCategories.length > 0 ||
    priceRange[0] !== MIN_PRICE ||
    priceRange[1] !== MAX_PRICE;

  const clearFilters = () => {
    setSearch("");
    setSelectedCategories([]);
    setPriceRange([MIN_PRICE, MAX_PRICE]);
  };

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
      if (selectedCategories.length > 0) {
        const catId = p.category?._id || p.category;
        if (!selectedCategories.includes(catId)) return false;
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
  }, [products, categories, search, selectedCategories, priceRange]);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">

      {/* ── Page Header ── */}
      <div className="mb-8">
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

      {/* ── Search Bar (full width, always on top) ── */}
      <div className="mb-8 relative">
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
          className="w-full rounded-xl border border-graphite-700 bg-graphite-800 py-3.5 pl-10 pr-9 text-sm text-parchment-50 placeholder:text-parchment-100/30 outline-none transition focus:border-velvet focus:bg-graphite-900"
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

      {/* ── Mobile: filter button + active filter chips ── */}
      <div className="mb-5 flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-graphite-700 bg-graphite-800 px-4 py-2.5 text-sm text-parchment-100/60 transition hover:border-velvet hover:text-parchment-50"
        >
          <SlidersHorizontal size={15} />
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-velvet text-[10px] font-bold text-parchment-50">
              {selectedCategories.length + (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Active category chips on mobile */}
        {selectedCategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((id) => {
              const cat = categories.find((c) => c._id === id);
              return cat ? (
                <span
                  key={id}
                  className="flex items-center gap-1.5 rounded-full bg-velvet/20 border border-velvet/40 px-3 py-1 text-xs text-velvet-light"
                >
                  {cat.name}
                  <button onClick={() => toggleCategory(id)}>
                    <X size={11} />
                  </button>
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      {/* ── Main layout: sidebar + content ── */}
      <div className="flex gap-8">

        {/* Sidebar — desktop only */}
        <div className="hidden lg:block">
          <SidebarFilters
            categories={categories}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            hasActiveFilters={hasActiveFilters}
            clearFilters={clearFilters}
          />
        </div>

        {/* Product content */}
        <div className="flex-1 min-w-0">

          {/* Meta row */}
          <div className="mb-6 flex items-center justify-between">
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
                className="hidden lg:flex items-center gap-1.5 rounded-xl border border-graphite-700 px-3.5 py-2 text-xs text-parchment-100/50 transition hover:border-velvet hover:text-parchment-50 active:scale-95"
              >
                <X size={12} />
                Clear all filters
              </button>
            )}
          </div>

          {/* Content */}
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
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categories={categories}
        selectedCategories={selectedCategories}
        toggleCategory={toggleCategory}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />
    </main>
  );
};

export default Products;