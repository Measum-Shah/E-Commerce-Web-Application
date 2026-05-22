import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { applyPromoCode } from "../api/promoApi";  // ✅ use promoApi instead of raw api call
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

const validators = {
  fullName: (v) =>
    v.trim().length < 3
      ? "Full name must be at least 3 characters"
      : "",

  phone: (v) =>
    /^(\+92|0)?3[0-9]{9}$/.test(v.replace(/\s/g, ""))
      ? ""
      : "Enter a valid Pakistani phone number",

  city: (v) =>
    v.trim() === ""
      ? "City is required"
      : "",

  area: (v) =>
    v.trim() === ""
      ? "Area is required"
      : "",

  postalCode: (v) =>
    /^\d{5}$/.test(v.trim())
      ? ""
      : "Postal code must be 5 digits",

  address: (v) =>
    v.trim().length < 10
      ? "Please enter a more complete address"
      : "",

  notes: () => "",
};

const Checkout = () => {
  const navigate = useNavigate();

  const { token } = useAuth();

  const { cart, clearEntireCart } = useCart();

  const [loading, setLoading] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("cod");

  const [couponInput, setCouponInput] = useState("");

  const [couponLoading, setCouponLoading] = useState(false);

  const [couponError, setCouponError] = useState("");

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    area: "",
    postalCode: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const [touched, setTouched] = useState({});

  // ─────────────────────────────────────────────
  // CART TOTALS
  // ─────────────────────────────────────────────

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const deliveryFee = appliedCoupon?.freeShipping
    ? 0
    : 300;

  const discount =
    Number(appliedCoupon?.discountAmount) || 0;

  const total = Math.max(
    subtotal + deliveryFee - discount,
    0
  );

  // ─────────────────────────────────────────────
  // FORM
  // ─────────────────────────────────────────────

  const validateField = (name, value) =>
    validators[name]?.(value) ?? "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateAll = () => {
    const newErrors = {};

    let valid = true;

    Object.keys(formData).forEach((name) => {
      const err = validateField(name, formData[name]);

      if (err) {
        newErrors[name] = err;
        valid = false;
      }
    });

    setErrors(newErrors);

    setTouched(
      Object.keys(formData).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {}
      )
    );

    return valid;
  };

  // ─────────────────────────────────────────────
  // APPLY PROMO
  // ─────────────────────────────────────────────

  const handleApplyCoupon = async () => {
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      toast.error("Please enter promo code");
      return;
    }

    try {
      setCouponLoading(true);
      setCouponError("");

      // ✅ FIX: Build a cart payload with guaranteed fields
      //         the service needs: items[].subtotal and totalAmount
      const cartPayload = {
        items: items.map((item) => ({
          ...item,
          subtotal: item.subtotal ?? item.price * item.quantity,
        })),
        totalAmount: subtotal,           // ✅ pass computed subtotal as totalAmount
      };

      // ✅ FIX: use applyPromoCode from promoApi (handles auth header)
      const response = await applyPromoCode(code, cartPayload, token);

      // ✅ FIX: controller wraps result inside response.data.data
      //   response.data = { success, message, data: { promo, discountAmount, newTotal } }
      const result = response?.data;

      setAppliedCoupon({
        code:           result?.promo?.code        || code,
        type:           result?.promo?.type        || "",
        description:    result?.promo?.description || "",
        freeShipping:   result?.promo?.freeShipping || false,
        discountAmount: Number(result?.discountAmount) || 0,
        newTotal:       Number(result?.newTotal)       || 0,
      });

      toast.success("Promo code applied");
      setCouponInput("");
    } catch (error) {
      const message =
        error.response?.data?.message || "Invalid promo code";

      setCouponError(message);
      setAppliedCoupon(null);
      toast.error(message);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    setCouponError("");
    toast.success("Promo removed");
  };

  // ─────────────────────────────────────────────
  // PLACE ORDER
  // ─────────────────────────────────────────────

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!validateAll()) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        shippingAddress: {
          fullName:   formData.fullName,
          phone:      formData.phone,
          address:    formData.address,
          city:       formData.city,
          area:       formData.area,
          postalCode: formData.postalCode,
        },

        paymentMethod,
        deliveryFee,
        discount,

        // ✅ FIX: use `promoCode` to match the Order model field name
        promoCode: appliedCoupon?.code || null,

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

  const inputClass = (name) =>
    `w-full rounded-xl border bg-graphite-900 px-4 py-3 outline-none transition ${
      errors[name] && touched[name]
        ? "border-red-500 focus:border-red-400"
        : "border-graphite-700 focus:border-velvet"
    }`;

  const FieldError = ({ name }) =>
    errors[name] && touched[name] ? (
      <p className="mt-1 text-xs text-red-400">
        {errors[name]}
      </p>
    ) : null;

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
        noValidate
        className="grid gap-8 lg:grid-cols-[1fr_380px]"
      >
        <div className="space-y-6">
          {/* SHIPPING */}
          <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
            <h2 className="font-display text-3xl italic">
              Shipping Details
            </h2>

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                "fullName",
                "phone",
                "city",
                "area",
                "postalCode",
              ].map((field) => (
                <div key={field}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field}
                    value={formData[field]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={inputClass(field)}
                  />

                  <FieldError name={field} />
                </div>
              ))}

              <div className="md:col-span-2">
                <input
                  type="text"
                  name="address"
                  placeholder="Full address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass("address")}
                />

                <FieldError name="address" />
              </div>

              <div className="md:col-span-2">
                <textarea
                  name="notes"
                  placeholder="Notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="4"
                  className={inputClass("notes")}
                />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
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
                    checked={paymentMethod === option.id}
                    disabled={!option.available}
                    onChange={() => setPaymentMethod(option.id)}
                    className="accent-velvet"
                  />

                  <div>
                    <p className="font-medium text-parchment-50">
                      {option.label}
                    </p>

                    <p className="text-sm text-parchment-100/60">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <aside className="h-fit rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
          <h2 className="font-display text-3xl italic">
            Order Summary
          </h2>

          <div className="mt-6 space-y-3 border-b border-graphite-700 pb-5">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex justify-between"
              >
                <div>
                  <p className="text-sm">{item.name}</p>

                  <p className="text-xs text-parchment-100/50">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="text-sm">
                  Rs.{" "}
                  {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {appliedCoupon?.freeShipping
                  ? "FREE"
                  : `Rs. ${deliveryFee.toLocaleString()}`}
              </span>
            </div>

            {/* PROMO */}
            <div className="border-y border-graphite-700 py-4">
              {appliedCoupon ? (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-green-400">
                        {appliedCoupon.code}
                      </p>

                      <p className="mt-1 text-xs text-parchment-100/60">
                        {appliedCoupon.freeShipping
                          ? "Free Shipping Applied"
                          : `Discount: Rs. ${discount.toLocaleString()}`}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      value={couponInput}
                      onChange={(e) =>
                        setCouponInput(e.target.value)
                      }
                      className="flex-1 rounded-xl border border-graphite-700 bg-graphite-900 px-3 py-2 text-xs uppercase outline-none transition focus:border-velvet"
                    />

                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                      className="rounded-xl bg-velvet px-4 py-2 text-xs font-medium text-parchment-50"
                    >
                      {couponLoading ? "Checking..." : "Apply"}
                    </button>
                  </div>

                  {couponError && (
                    <p className="mt-2 text-xs text-red-400">
                      {couponError}
                    </p>
                  )}
                </>
              )}
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>Discount</span>
                <span>- Rs. {discount.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-medium border-t border-graphite-700 pt-4">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-velvet px-6 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light disabled:opacity-50"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
};

export default Checkout;