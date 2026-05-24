import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";

import { getProductBySlug } from "../api/productApi";
import { addToCart } from "../api/cartApi";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { token, isAuthenticated } = useAuth();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

  // Image gallery state
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchProduct = async () => {
    try {
      const data = await getProductBySlug(slug);
      setProduct(data.product || data.data);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  // Reset gallery when product changes
  useEffect(() => {
    setActiveIndex(0);
  }, [product]);

  const images = product?.images || [];

  const goPrev = () =>
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));

  const goNext = () =>
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  const increaseQty = () => {
    if (!product || quantity >= product.stock) return;
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart");
      navigate("/login");
      return;
    }
    try {
      setCartLoading(true);
      const data = await addToCart({ productId: product._id, quantity }, token);
      await fetchCart();
      toast.success(data.message || "Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-parchment-100">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center text-parchment-100">
        Product not found.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start">

        {/* ── IMAGE GALLERY ── */}
        <div className="lg:sticky lg:top-28 space-y-3">

          {/* Main image with prev/next arrows */}
          <div className="group relative overflow-hidden rounded-3xl border border-graphite-700 bg-graphite-800">
            {/* Slide track */}
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.name} image ${i + 1}`}
                  className="h-[300px] w-full shrink-0 object-cover sm:h-[460px] lg:h-[560px]"
                />
              ))}
            </div>

            {/* Arrows — only show if more than 1 image */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-graphite-600 bg-graphite-900/80 text-parchment-100 opacity-0 backdrop-blur transition hover:border-velvet hover:text-parchment-50 group-hover:opacity-100"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={goNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-graphite-600 bg-graphite-900/80 text-parchment-100 opacity-0 backdrop-blur transition hover:border-velvet hover:text-parchment-50 group-hover:opacity-100"
                >
                  <ChevronRight size={20} />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === activeIndex
                          ? "w-6 bg-velvet-light"
                          : "w-2 bg-parchment-100/30 hover:bg-parchment-100/60"
                      }`}
                    />
                  ))}
                </div>

                {/* Counter badge */}
                <div className="absolute right-3 top-3 rounded-full bg-graphite-900/70 px-3 py-1 text-xs text-parchment-100/70 backdrop-blur">
                  {activeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`shrink-0 overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                    i === activeIndex
                      ? "border-velvet scale-[1.03]"
                      : "border-graphite-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={src}
                    alt={`Thumbnail ${i + 1}`}
                    className="h-16 w-16 object-cover sm:h-20 sm:w-20"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── PRODUCT INFO ── */}
        <div className="space-y-5">

          {/* Name, price, add to cart */}
          <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-5 sm:p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-velvet-light sm:text-sm">
              {product.brand}
            </p>

            <h1 className="mt-3 font-display text-3xl italic leading-tight tracking-tight text-parchment-50 sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>

            <p className="mt-5 text-sm leading-7 text-parchment-100/70 sm:text-base">
              {product.description}
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-parchment-100/60">Price</p>
                <h2 className="mt-1 text-3xl font-medium text-parchment-50 sm:text-4xl">
                  Rs. {product.price?.toLocaleString()}
                </h2>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm ${
                  product.stock > 0
                    ? "bg-success/20 text-green-300"
                    : "bg-error/20 text-red-300"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} Available`
                  : "Out of stock"}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex w-full items-center justify-between rounded-xl border border-graphite-700 sm:w-auto">
                <button
                  onClick={decreaseQty}
                  className="px-4 py-3 transition hover:bg-graphite-700 rounded-l-xl"
                >
                  <Minus size={18} />
                </button>
                <span className="min-w-[60px] text-center text-parchment-50">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  className="px-4 py-3 transition hover:bg-graphite-700 rounded-r-xl"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || cartLoading}
                className="w-full rounded-xl bg-velvet px-6 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
              >
                {cartLoading ? "Adding..." : "Add to Collection"}
              </button>
            </div>
          </div>

          {/* Specs + Product Info */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-5 sm:p-6">
              <h3 className="mb-5 font-display text-2xl italic text-parchment-50">
                Specifications
              </h3>
              <div className="space-y-3 text-sm">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex flex-col gap-0.5 border-b border-graphite-700 pb-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="capitalize text-parchment-100/60">{key}</span>
                      <span className="text-parchment-50 sm:text-right">{value}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-5 sm:p-6">
              <h3 className="mb-5 font-display text-2xl italic text-parchment-50">
                Product Info
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Condition", value: product.condition, className: "capitalize" },
                  { label: "Warranty", value: product.warranty },
                  { label: "SKU", value: product.sku },
                  { label: "Category", value: product.category?.name },
                ].map(({ label, value, className }) => (
                  <div
                    key={label}
                    className="flex flex-col gap-0.5 border-b border-graphite-700 pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-parchment-100/60">{label}</span>
                    <span className={`text-parchment-50 ${className || ""}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;