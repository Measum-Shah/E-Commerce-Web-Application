import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Minus, Plus } from "lucide-react";
import { toast } from "react-hot-toast";

import { getProductBySlug } from "../api/productApi";
import { addToCart } from "../api/cartApi";

import { useAuth } from "../context/AuthContext";

const ProductDetails = () => {
  const { slug } = useParams();

  const { token, isAuthenticated } = useAuth();

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
    if (quantity >= product.stock) return;

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

      toast.success(data.message || "Added to cart");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to add to cart"
      );
    } finally {
      setCartLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        Product not found.
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-14">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[2rem] border border-graphite-700 bg-graphite-800 p-5">
          <img
            src={product.images?.[0]}
            alt={product.name}
            className="h-[650px] w-full rounded-[1.5rem] object-cover"
          />
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-8">
            <p className="text-sm uppercase tracking-[0.25em] text-velvet-light">
              {product.brand}
            </p>

            <h1 className="mt-3 font-display text-5xl italic leading-tight tracking-tight">
              {product.name}
            </h1>

            <p className="mt-6 text-parchment-100/70">
              {product.description}
            </p>

            <div className="mt-8 flex items-center justify-between">
              <div>
                <p className="text-sm text-parchment-100/60">
                  Price
                </p>

                <h2 className="mt-1 text-4xl font-medium">
                  Rs. {product.price?.toLocaleString()}
                </h2>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm ${
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

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-xl border border-graphite-700">
                <button
                  onClick={decreaseQty}
                  className="px-4 py-3 transition hover:bg-graphite-700"
                >
                  <Minus size={18} />
                </button>

                <span className="min-w-[60px] text-center">
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
                disabled={
                  product.stock <= 0 || cartLoading
                }
                className="flex-1 rounded-xl bg-velvet px-6 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98]"
              >
                {cartLoading
                  ? "Adding..."
                  : "Add to Collection"}
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
              <h3 className="mb-5 font-display text-2xl italic">
                Specifications
              </h3>

              <div className="space-y-4 text-sm">
                {product.specifications &&
                  Object.entries(
                    product.specifications
                  ).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between border-b border-graphite-700 pb-3"
                    >
                      <span className="capitalize text-parchment-100/60">
                        {key}
                      </span>

                      <span>{value}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
              <h3 className="mb-5 font-display text-2xl italic">
                Product Info
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between border-b border-graphite-700 pb-3">
                  <span className="text-parchment-100/60">
                    Condition
                  </span>

                  <span className="capitalize">
                    {product.condition}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-graphite-700 pb-3">
                  <span className="text-parchment-100/60">
                    Warranty
                  </span>

                  <span>{product.warranty}</span>
                </div>

                <div className="flex items-center justify-between border-b border-graphite-700 pb-3">
                  <span className="text-parchment-100/60">
                    SKU
                  </span>

                  <span>{product.sku}</span>
                </div>

                <div className="flex items-center justify-between pb-1">
                  <span className="text-parchment-100/60">
                    Category
                  </span>

                  <span>
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