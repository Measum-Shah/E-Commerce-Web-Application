import { useEffect, useState, useMemo } from "react";
import { toast } from "react-hot-toast";
import { Search, X, Calendar, ChevronDown } from "lucide-react";

import {
  getAllOrders,
  updateOrderStatus,
} from "../../api/orderApi";

import { useAuth } from "../../context/AuthContext";

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const AdminOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── filters
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders(token);
      setOrders(data.orders || data.data || []);
    } catch (error) {
      console.log(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      const data = await updateOrderStatus(orderId, { orderStatus: status }, token);
      toast.success(data.message || "Order status updated");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update order");
    }
  };

  // ── derived filtered list
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();

    return orders.filter((order) => {
      // search filter
      if (q) {
        const idMatch = order._id.toLowerCase().includes(q);
        const nameMatch = order.shippingAddress?.fullName?.toLowerCase().includes(q);
        const phoneMatch = order.shippingAddress?.phone?.toLowerCase().includes(q);
        if (!idMatch && !nameMatch && !phoneMatch) return false;
      }

      // date range filter
      if (dateFrom || dateTo) {
        const created = new Date(order.createdAt);
        // zero out time for clean day comparison
        created.setHours(0, 0, 0, 0);
        if (dateFrom) {
          const from = new Date(dateFrom);
          from.setHours(0, 0, 0, 0);
          if (created < from) return false;
        }
        if (dateTo) {
          const to = new Date(dateTo);
          to.setHours(23, 59, 59, 999);
          if (created > to) return false;
        }
      }

      return true;
    });
  }, [orders, search, dateFrom, dateTo]);

  const hasActiveFilters = search || dateFrom || dateTo;

  const clearFilters = () => {
    setSearch("");
    setDateFrom("");
    setDateTo("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
      {/* ── header */}
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Admin
        </p>
        <h1 className="font-display text-5xl sm:text-6xl italic tracking-tight">
          Orders
        </h1>
        <p className="mt-4 max-w-2xl text-parchment-100/70">
          Manage customer orders and track delivery progress.
        </p>
      </div>

      {/* ── search + filter bar */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment-100/40 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, name, or phone…"
            className="w-full rounded-xl border border-graphite-700 bg-graphite-800 py-3 pl-10 pr-10 text-sm text-parchment-50 placeholder:text-parchment-100/30 outline-none transition focus:border-velvet"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-parchment-100/40 hover:text-parchment-50 transition"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* date filter toggle */}
        <div className="relative">
          <button
            onClick={() => setShowDateFilter((v) => !v)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition active:scale-95 ${
              dateFrom || dateTo
                ? "border-velvet bg-velvet/10 text-parchment-50"
                : "border-graphite-700 bg-graphite-800 text-parchment-100/60 hover:border-velvet hover:text-parchment-50"
            }`}
          >
            <Calendar size={15} />
            {dateFrom || dateTo
              ? `${dateFrom || "…"} → ${dateTo || "…"}`
              : "Date range"}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${showDateFilter ? "rotate-180" : ""}`}
            />
          </button>

          {showDateFilter && (
            <div className="absolute right-0 top-full z-20 mt-2 w-72 rounded-2xl border border-graphite-700 bg-graphite-800 p-4 shadow-2xl">
              <p className="mb-3 text-xs uppercase tracking-widest text-parchment-100/40">
                Filter by date
              </p>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs text-parchment-100/50">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full rounded-xl border border-graphite-700 bg-graphite-900 px-3 py-2.5 text-sm text-parchment-50 outline-none transition focus:border-velvet [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-parchment-100/50">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full rounded-xl border border-graphite-700 bg-graphite-900 px-3 py-2.5 text-sm text-parchment-50 outline-none transition focus:border-velvet [color-scheme:dark]"
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => { setDateFrom(""); setDateTo(""); }}
                  className="flex-1 rounded-xl border border-graphite-700 py-2 text-xs text-parchment-100/60 transition hover:border-velvet hover:text-parchment-50 active:scale-95"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowDateFilter(false)}
                  className="flex-1 rounded-xl bg-velvet py-2 text-xs text-parchment-50 transition hover:bg-velvet-light active:scale-95"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* clear all filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 rounded-xl border border-graphite-700 px-4 py-3 text-sm text-parchment-100/60 transition hover:border-velvet hover:text-parchment-50 active:scale-95"
          >
            <X size={14} />
            Clear all
          </button>
        )}
      </div>

      {/* ── results count */}
      <p className="mb-6 text-sm text-parchment-100/40">
        {filteredOrders.length === orders.length
          ? `${orders.length} order${orders.length !== 1 ? "s" : ""}`
          : `${filteredOrders.length} of ${orders.length} orders`}
      </p>

      {/* ── orders list */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/60">
          {hasActiveFilters ? "No orders match your filters." : "No orders found."}
        </div>
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="rounded-2xl sm:rounded-3xl border border-graphite-700 bg-graphite-800 p-5 sm:p-6"
            >
              <div className="grid gap-5 border-b border-graphite-700 pb-5 sm:pb-6 grid-cols-2 md:grid-cols-5">
                <div>
                  <p className="text-xs sm:text-sm text-parchment-100/60">Order ID</p>
                  <h2 className="mt-1 text-base sm:text-lg font-medium">
                    #{order._id.slice(-8)}
                  </h2>
                  {order.createdAt && (
                    <p className="mt-0.5 text-xs text-parchment-100/40">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-parchment-100/60">Customer</p>
                  <p className="mt-1 text-sm sm:text-base">{order.shippingAddress?.fullName}</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-parchment-100/60">Phone</p>
                  <p className="mt-1 text-sm sm:text-base">{order.shippingAddress?.phone}</p>
                </div>

                <div>
                  <p className="text-xs sm:text-sm text-parchment-100/60">Total</p>
                  <p className="mt-1 text-lg sm:text-xl font-medium">
                    Rs. {order.totalAmount?.toLocaleString()}
                  </p>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <p className="text-xs sm:text-sm text-parchment-100/60">Status</p>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="mt-2 w-full rounded-xl border border-graphite-700 bg-graphite-900 px-3 py-2.5 text-sm capitalize outline-none transition focus:border-velvet active:scale-95"
                  >
                    {orderStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-5 space-y-3 sm:space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={item.product?._id || index}
                    className="flex items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-graphite-700 bg-graphite-900 p-3 sm:p-4"
                  >
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt={item.name}
                      className="h-16 w-16 sm:h-24 sm:w-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg sm:text-2xl italic truncate">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-parchment-100/60">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="text-base sm:text-lg font-medium shrink-0">
                      Rs. {item.price?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl sm:rounded-2xl border border-graphite-700 bg-graphite-900 p-4 sm:p-5">
                <h3 className="mb-3 sm:mb-4 font-display text-xl sm:text-2xl italic">
                  Shipping Address
                </h3>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-parchment-100/60">Address: </span>
                    {order.shippingAddress?.address}
                  </p>
                  <p>
                    <span className="text-parchment-100/60">City: </span>
                    {order.shippingAddress?.city}
                  </p>
                  <p>
                    <span className="text-parchment-100/60">Area: </span>
                    {order.shippingAddress?.area}
                  </p>
                  <p>
                    <span className="text-parchment-100/60">Postal Code: </span>
                    {order.shippingAddress?.postalCode}
                  </p>
                </div>

                {order.notes && (
                  <div className="mt-4 border-t border-graphite-700 pt-4">
                    <p className="text-sm text-parchment-100/60">Notes</p>
                    <p className="mt-2 text-sm">{order.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default AdminOrders;