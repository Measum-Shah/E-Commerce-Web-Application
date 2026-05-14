import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import {
  cancelMyOrder,
  getMyOrders,
} from "../api/orderApi";

import { useAuth } from "../context/AuthContext";

const MyOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders(token);

      setOrders(data.orders || data.data || []);
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (id) => {
    try {
      const data = await cancelMyOrder(id, token);

      toast.success(
        data.message || "Order cancelled"
      );

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to cancel order"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        Loading orders...
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Orders
        </p>

        <h1 className="font-display text-6xl italic tracking-tight">
          Your Purchases
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-12 text-center">
          <h2 className="font-display text-4xl italic">
            No orders yet
          </h2>

          <p className="mt-3 text-parchment-100/60">
            Your placed orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl border border-graphite-700 bg-graphite-800 p-6"
            >
              <div className="flex flex-col gap-5 border-b border-graphite-700 pb-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-parchment-100/60">
                    Order ID
                  </p>

                  <h2 className="mt-1 text-lg font-medium">
                    #{order._id.slice(-8)}
                  </h2>
                </div>

                <div>
                  <p className="text-sm text-parchment-100/60">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-block rounded-full px-4 py-2 text-sm capitalize ${
                      order.orderStatus === "delivered"
                        ? "bg-success/20 text-green-300"
                        : order.orderStatus === "cancelled"
                        ? "bg-error/20 text-red-300"
                        : "bg-warning/20 text-yellow-300"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-parchment-100/60">
                    Payment
                  </p>

                  <p className="mt-1 uppercase">
                    {order.paymentMethod}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-parchment-100/60">
                    Total
                  </p>

                  <p className="mt-1 text-xl font-medium">
                    Rs.{" "}
                    {order.totalPrice?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {order.orderItems?.map((item) => (
                  <div
                    key={item.product?._id}
                    className="flex items-center gap-4 rounded-2xl border border-graphite-700 bg-graphite-900 p-4"
                  >
                    <img
                      src={item.product?.images?.[0]}
                      alt={item.product?.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-display text-2xl italic">
                        {item.product?.name}
                      </h3>

                      <p className="mt-2 text-sm text-parchment-100/60">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="text-lg font-medium">
                      Rs.{" "}
                      {item.price?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {order.orderStatus === "pending" && (
                <button
                  onClick={() =>
                    handleCancelOrder(order._id)
                  }
                  className="mt-6 rounded-xl border border-error px-6 py-3 text-sm text-red-300 transition hover:bg-error/20"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyOrders;