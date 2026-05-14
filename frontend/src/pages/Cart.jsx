import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";

import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cart,
    loading,
    updateItemQuantity,
    removeItem,
    clearEntireCart,
  } = useCart();

  const items = cart?.items || [];

  const subtotal = items.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        Loading cart...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
            Shopping Bag
          </p>

          <h1 className="font-display text-6xl italic tracking-tight">
            Your Cart
          </h1>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearEntireCart}
            className="rounded-xl border border-graphite-700 px-5 py-3 text-sm text-parchment-100 transition hover:border-error hover:text-red-300"
          >
            Clear Cart
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-12 text-center">
          <h2 className="font-display text-4xl italic">
            Your cart is empty
          </h2>

          <p className="mt-3 text-parchment-100/60">
            Add premium machines to your collection.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-xl bg-velvet px-7 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light"
          >
            Shop Products
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-5">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="grid gap-5 rounded-3xl border border-graphite-700 bg-graphite-800 p-5 md:grid-cols-[140px_1fr_auto]"
              >
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="h-36 w-full rounded-2xl object-cover"
                />

                <div>
                  <p className="text-sm text-parchment-100/60">
                    {item.product.brand}
                  </p>

                  <h2 className="mt-1 font-display text-3xl italic">
                    {item.product.name}
                  </h2>

                  <p className="mt-3 text-lg font-medium">
                    Rs. {item.product.price?.toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between gap-4">
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="rounded-xl border border-graphite-700 p-3 text-parchment-100/70 transition hover:border-error hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="flex items-center rounded-xl border border-graphite-700">
                    <button
                      onClick={() =>
                        updateItemQuantity(
                          item.product._id,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity <= 1}
                      className="px-4 py-3 disabled:opacity-40"
                    >
                      <Minus size={16} />
                    </button>

                    <span className="min-w-[50px] text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateItemQuantity(
                          item.product._id,
                          item.quantity + 1
                        )
                      }
                      className="px-4 py-3"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
            <h2 className="font-display text-3xl italic">
              Order Summary
            </h2>

            <div className="mt-6 space-y-4 text-sm">
              <div className="flex justify-between border-b border-graphite-700 pb-4">
                <span className="text-parchment-100/60">
                  Subtotal
                </span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between border-b border-graphite-700 pb-4">
                <span className="text-parchment-100/60">
                  Delivery
                </span>
                <span>Calculated at checkout</span>
              </div>

              <div className="flex justify-between text-lg font-medium">
                <span>Total</span>
                <span>Rs. {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="mt-8 block rounded-xl bg-velvet px-6 py-4 text-center font-medium text-parchment-50 transition hover:bg-velvet-light active:scale-[0.98]"
            >
              Continue to Checkout
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
};

export default Cart;