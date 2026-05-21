import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Plus,
  Trash2,
  X,
  Tag,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

import {
  getAllPromos,
  createPromo,
  deletePromo,
  togglePromo
} from "../../api/promoApi";

import { useAuth } from "../../context/AuthContext";

const initialForm = {
  code: "",
  type: "percentage",
  discountValue: "",
  endDate: ""
};

const typeOptions = [
  {
    value: "percentage",
    label: "Percentage (%)"
  },
  {
    value: "fixed",
    label: "Flat Amount (Rs.)"
  }
];

const StatusBadge = ({ active }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
      active
        ? "bg-green-500/10 text-green-400"
        : "bg-graphite-700/60 text-parchment-100/40"
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        active
          ? "bg-green-400"
          : "bg-parchment-100/30"
      }`}
    />

    {active ? "Active" : "Inactive"}
  </span>
);

const AdminPromo = () => {
  const { token } = useAuth();

  const [promos, setPromos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] =
    useState(initialForm);

  const [formErrors, setFormErrors] =
    useState({});

  const fetchPromos = async () => {
    try {
      setLoading(true);

      // FIXED HERE
      const data = await getAllPromos(
        {},
        token
      );

      setPromos(data.promos || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load promos"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPromos();
    }
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: ""
    }));
  };

  const validate = () => {
    const errors = {};

    const code =
      formData.code.trim().toUpperCase();

    if (!code) {
      errors.code = "Code is required";
    } else if (
      !/^[A-Z0-9_-]{2,20}$/.test(code)
    ) {
      errors.code =
        "Use letters, numbers, _ or - only";
    } else if (
      promos.some(
        (p) => p.code === code
      )
    ) {
      errors.code =
        "Promo code already exists";
    }

    const val = Number(
      formData.discountValue
    );

    if (!formData.discountValue) {
      errors.discountValue =
        "Discount value is required";
    } else if (
      isNaN(val) ||
      val <= 0
    ) {
      errors.discountValue =
        "Enter valid amount";
    } else if (
      formData.type ===
        "percentage" &&
      val > 100
    ) {
      errors.discountValue =
        "Percentage cannot exceed 100";
    }

    if (!formData.endDate) {
      errors.endDate =
        "Expiry date is required";
    }

    return errors;
  };

  const resetForm = () => {
    setFormData(initialForm);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validate();

    if (Object.keys(errors).length) {
      setFormErrors(errors);
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        code:
          formData.code
            .trim()
            .toUpperCase(),

        type: formData.type,

        discountValue: Number(
          formData.discountValue
        ),

        description:
          formData.type ===
          "percentage"
            ? `${formData.discountValue}% OFF`
            : `Rs. ${formData.discountValue} OFF`,

        endDate: formData.endDate
      };

      const data = await createPromo(
        payload,
        token
      );

      toast.success(
        data.message ||
          "Promo created successfully"
      );

      resetForm();

      fetchPromos();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create promo"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const data = await togglePromo(
        id,
        token
      );

      toast.success(
        data.message ||
          "Promo updated"
      );

      fetchPromos();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update promo"
      );
    }
  };

  const handleDelete = async (
    id,
    code
  ) => {
    if (
      !window.confirm(
        `Delete promo "${code}"?`
      )
    ) {
      return;
    }

    try {
      const data = await deletePromo(
        id,
        token
      );

      toast.success(
        data.message ||
          "Promo deleted"
      );

      fetchPromos();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to delete promo"
      );
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-12">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Admin
        </p>

        <h1 className="font-display text-6xl italic tracking-tight">
          Promo Codes
        </h1>

        <p className="mt-4 max-w-2xl text-parchment-100/70">
          Create and manage customer
          discount promo codes.
        </p>
      </div>

      <div className="mb-10 rounded-3xl border border-graphite-700 bg-graphite-800 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-3xl italic">
            New Promo Code
          </h2>

          {(formData.code ||
            formData.discountValue) && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl border border-graphite-700 p-3 transition hover:border-error hover:text-red-300"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-5 md:grid-cols-2"
        >
          <div>
            <input
              type="text"
              name="code"
              placeholder="Promo Code"
              value={formData.code}
              onChange={handleChange}
              className={`w-full rounded-xl border bg-graphite-900 px-4 py-3 uppercase outline-none ${
                formErrors.code
                  ? "border-red-500"
                  : "border-graphite-700"
              }`}
            />

            {formErrors.code && (
              <p className="mt-1 text-xs text-red-400">
                {formErrors.code}
              </p>
            )}
          </div>

          <div>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 outline-none"
            >
              {typeOptions.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                >
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="number"
              name="discountValue"
              placeholder={
                formData.type ===
                "percentage"
                  ? "Discount %"
                  : "Amount in Rs."
              }
              value={
                formData.discountValue
              }
              onChange={handleChange}
              min="1"
              max={
                formData.type ===
                "percentage"
                  ? 100
                  : undefined
              }
              className={`w-full rounded-xl border bg-graphite-900 px-4 py-3 outline-none ${
                formErrors.discountValue
                  ? "border-red-500"
                  : "border-graphite-700"
              }`}
            />

            {formErrors.discountValue && (
              <p className="mt-1 text-xs text-red-400">
                {
                  formErrors.discountValue
                }
              </p>
            )}
          </div>

          <div>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className={`w-full rounded-xl border bg-graphite-900 px-4 py-3 outline-none ${
                formErrors.endDate
                  ? "border-red-500"
                  : "border-graphite-700"
              }`}
            />

            {formErrors.endDate && (
              <p className="mt-1 text-xs text-red-400">
                {formErrors.endDate}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 rounded-xl bg-velvet px-6 py-4 font-medium text-parchment-50 transition hover:bg-velvet-light disabled:opacity-50 md:w-fit"
          >
            <Plus size={18} />

            {submitting
              ? "Creating..."
              : "Create Promo"}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          Loading promos...
        </div>
      ) : promos.length === 0 ? (
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/60">
          No promo codes yet.
        </div>
      ) : (
        <div className="space-y-4">
          {promos.map((promo) => (
            <div
              key={promo._id}
              className={`flex flex-col gap-4 rounded-3xl border bg-graphite-800 p-5 transition sm:flex-row sm:items-center sm:justify-between ${
                promo.isActive
                  ? "border-graphite-700"
                  : "border-graphite-700/40 opacity-60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-graphite-900">
                  <Tag
                    size={20}
                    className="text-velvet-light"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg font-bold tracking-widest text-parchment-50">
                      {promo.code}
                    </span>

                    <StatusBadge
                      active={
                        promo.isActive
                      }
                    />
                  </div>

                  <p className="mt-1 text-sm text-parchment-100/60">
                    {promo.type ===
                    "percentage"
                      ? `${promo.discountValue}% OFF`
                      : `Rs. ${promo.discountValue} OFF`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleToggle(
                      promo._id
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-graphite-700 px-4 py-2.5 text-sm transition hover:border-velvet"
                >
                  {promo.isActive ? (
                    <ToggleRight
                      size={18}
                      className="text-green-400"
                    />
                  ) : (
                    <ToggleLeft
                      size={18}
                    />
                  )}

                  {promo.isActive
                    ? "Active"
                    : "Inactive"}
                </button>

                <button
                  onClick={() =>
                    handleDelete(
                      promo._id,
                      promo.code
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-error px-4 py-2.5 text-sm text-red-300 transition hover:bg-error/20"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminPromo;