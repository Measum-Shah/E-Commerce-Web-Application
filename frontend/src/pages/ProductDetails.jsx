import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import { getProductBySlug } from "../api/productApi";
import { addToCart } from "../api/cartApi";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { slug } = useParams();

  const { token, isAuthenticated } = useAuth();
  const { fetchCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);

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
      toast.error("Please login first");
      return;
    }

    try {
      setCartLoading(true);

      const payload = {
        productId: product._id,
        quantity,
      };

      const data = await addToCart(payload, token);

      await fetchCart();

      toast.success(data.message || "Added to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add to cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6 text-parchment-100">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center px-6 text-center text-parchment-100">
        Product not found.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:py-14">
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-3 sm:p-5 lg:sticky lg:top-28">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="h-[280px] w-full rounded-2xl object-cover sm:h-[420px] lg:h-[650px]"
          />
        </div>

        <div className="space-y-6">
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

            <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-parchment-100/60">
                  Price
                </p>

                <h2 className="mt-1 text-3xl font-medium text-parchment-50 sm:text-4xl">
                  Rs. {product.price?.toLocaleString()}
                </h2>
              </div>

              <div
                className={`w-fit rounded-full px-4 py-2 text-sm ${
                  product.stock > 0
                    ? "bg-success/20 text-green-300"
                    : "bg-error/20 text-red-300"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} Available`
                  : "Out of stock"}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex w-full items-center justify-between rounded-xl border border-graphite-700 sm:w-auto">
                <button
                  onClick={decreaseQty}
                  className="px-4 py-3 transition hover:bg-graphite-700"
                >
                  <Minus size={18} />
                </button>

                <span className="min-w-[70px] text-center text-parchment-50">
                  {quantity}
                </span>

                <button
                  onClick={increaseQty}
                  className="px-4 py-3 transition hover:bg-graphite-700"
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

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-5 sm:p-6">
              <h3 className="mb-5 font-display text-2xl italic text-parchment-50">
                Specifications
              </h3>

              <div className="space-y-4 text-sm">
                {product.specifications &&
                  Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div
                        key={key}
                        className="flex flex-col gap-1 border-b border-graphite-700 pb-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="capitalize text-parchment-100/60">
                          {key}
                        </span>

                        <span className="break-words text-parchment-50 sm:text-right">
                          {value}
                        </span>
                      </div>
                    )
                  )}
              </div>
            </div>

            <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-5 sm:p-6">
              <h3 className="mb-5 font-display text-2xl italic text-parchment-50">
                Product Info
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex flex-col gap-1 border-b border-graphite-700 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-parchment-100/60">
                    Condition
                  </span>

                  <span className="capitalize text-parchment-50">
                    {product.condition}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-b border-graphite-700 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-parchment-100/60">
                    Warranty
                  </span>

                  <span className="text-parchment-50">
                    {product.warranty}
                  </span>
                </div>

                <div className="flex flex-col gap-1 border-b border-graphite-700 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-parchment-100/60">
                    SKU
                  </span>

                  <span className="break-all text-parchment-50 sm:text-right">
                    {product.sku}
                  </span>
                </div>

                <div className="flex flex-col gap-1 pb-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-parchment-100/60">
                    Category
                  </span>

                  <span className="text-parchment-50">
                    {product.category?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetails;