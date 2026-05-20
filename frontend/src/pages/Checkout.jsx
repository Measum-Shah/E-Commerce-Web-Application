import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { placeOrder } from "../api/orderApi";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const paymentOptions = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay when your order arrives",
    available: true,
  },
  {
    id: "jazzcash",
    label: "JazzCash",
    description: "Not available — coming soon",
    available: false,
  },
  {
    id: "bank",
    label: "Bank Transfer",
    description: "Not available — coming soon",
    available: false,
  },
];

const Checkout = () => {
  const navigate = useNavigate();

  const { token } = useAuth();
  const { cart, clearEntireCart } = useCart();

  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    area: "",
    postalCode: "",
    notes: "",
  });

  const items = cart?.items || [];

  const subtotal = items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  const deliveryFee = 300;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          area: formData.area,
          postalCode: formData.postalCode,
        },
        paymentMethod,
        deliveryFee,
        discount,
        notes: formData.notes,
      };

      const data = await placeOrder(payload, token);

      await clearEntireCart();

      toast.success(data.message || "Order placed successfully");
      navigate("/orders");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Checkout
        </p>

        <h1 className="font-display text-6xl italic tracking-tight">
          Complete your order
        </h1>
      </div>

      <form
        onSubmit={handlePlaceOrder}
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          {/* Shipping Details */}
          <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
            <h2 className="font-display text-3xl italic">
              Shipping Details
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <input
                type="text"
                name="fullName"
                placeholder="Full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
              />

              <input
                type="text"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
              />

              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
                className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
              />

              <input
                type="text"
                name="area"
                placeholder="Area"
                value={formData.area}
                onChange={handleChange}
                required
                className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
              />

              <input
                type="text"
                name="postalCode"
                placeholder="Postal code"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet"
              />

              <input
                type="text"
                name="address"
                placeholder="Full address"
                value={formData.address}
                onChange={handleChange}
                required
                className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet md:col-span-2"
              />

              <textarea
                name="notes"
                placeholder="Notes, e.g. Call before delivery"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                className="rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none transition focus:border-velvet md:col-span-2"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
            <h2 className="font-display text-3xl italic">
              Payment Method
            </h2>

            <div className="mt-6 space-y-3">
              {paymentOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                    !option.available
                      ? "cursor-not-allowed border-graphite-700 opacity-50"
                      : paymentMethod === option.id
                      ? "border-velvet bg-velvet/10"
                      : "border-graphite-700 hover:border-graphite-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    disabled={!option.available}
                    onChange={() => setPaymentMethod(option.id)}
                    className="accent-velvet"
                  />

                  <div>
                    <p className="font-medium text-parchment-50">
                      {option.label}
                    </p>

                    <p
                      className={`text-sm ${
                        option.available
                          ? "text-parchment-100/60"
                          : "text-parchment-100/40"
                      }`}
                    >
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
          <h2 className="font-display text-3xl italic">
            Order Summary
          </h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between border-b border-graphite-700 pb-4">
              <span className="text-parchment-100/60">Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-b border-graphite-700 pb-4">
              <span className="text-parchment-100/60">Delivery</span>
              <span>Rs. {deliveryFee.toLocaleString()}</span>
            </div>

            <div className="flex justify-between border-b border-graphite-700 pb-4">
              <span className="text-parchment-100/60">Payment</span>
              <span>
                {paymentOptions.find((o) => o.id === paymentMethod)?.label}
              </span>
            </div>

            <div className="flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="mt-8 w-full rounded-xl bg-velvet px-6 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;