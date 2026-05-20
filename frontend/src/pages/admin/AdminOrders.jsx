import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

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

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders(token);

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

  const handleStatusUpdate = async (
    orderId,
    status
  ) => {
    try {
      const payload = {
        orderStatus: status,
      };

      const data = await updateOrderStatus(
        orderId,
        payload,
        token
      );

      toast.success(
        data.message ||
          "Order status updated"
      );

      fetchOrders();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update order"
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
      <div className="mb-12">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-velvet-light">
          Admin
        </p>

        <h1 className="font-display text-6xl italic tracking-tight">
          Orders
        </h1>

        <p className="mt-4 max-w-2xl text-parchment-100/70">
          Manage customer orders and track
          delivery progress.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-graphite-700 bg-graphite-800 p-10 text-center text-parchment-100/60">
          No orders found.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-3xl border border-graphite-700 bg-graphite-800 p-6"
            >
              <div className="grid gap-6 border-b border-graphite-700 pb-6 md:grid-cols-5">
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
                    Customer
                  </p>

                  <p className="mt-1">
                    {order.shippingAddress?.fullName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-parchment-100/60">
                    Phone
                  </p>

                  <p className="mt-1">
                    {order.shippingAddress?.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-parchment-100/60">
                    Total
                  </p>

                  {/* FIX: was order.totalPrice (doesn't exist), backend field is totalAmount */}
                  <p className="mt-1 text-xl font-medium">
                    Rs. {order.totalAmount?.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-parchment-100/60">
                    Status
                  </p>

                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusUpdate(
                        order._id,
                        e.target.value
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-graphite-700 bg-graphite-900 px-4 py-3 capitalize outline-none transition focus:border-velvet"
                  >
                    {orderStatuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* FIX: was order.orderItems (doesn't exist), backend field is items */}
              <div className="mt-6 space-y-4">
                {order.items?.map((item, index) => (
                  <div
                    key={item.product?._id || index}
                    className="flex items-center gap-4 rounded-2xl border border-graphite-700 bg-graphite-900 p-4"
                  >
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt={item.name}
                      className="h-24 w-24 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                      <h3 className="font-display text-2xl italic">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm text-parchment-100/60">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <p className="text-lg font-medium">
                      Rs. {item.price?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-graphite-700 bg-graphite-900 p-5">
                <h3 className="mb-4 font-display text-2xl italic">
                  Shipping Address
                </h3>

                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <p>
                    <span className="text-parchment-100/60">
                      Address:
                    </span>{" "}
                    {order.shippingAddress?.address}
                  </p>

                  <p>
                    <span className="text-parchment-100/60">
                      City:
                    </span>{" "}
                    {order.shippingAddress?.city}
                  </p>

                  <p>
                    <span className="text-parchment-100/60">
                      Area:
                    </span>{" "}
                    {order.shippingAddress?.area}
                  </p>

                  <p>
                    <span className="text-parchment-100/60">
                      Postal Code:
                    </span>{" "}
                    {order.shippingAddress?.postalCode}
                  </p>
                </div>

                {order.notes && (
                  <div className="mt-5 border-t border-graphite-700 pt-5">
                    <p className="text-sm text-parchment-100/60">
                      Notes
                    </p>

                    <p className="mt-2">
                      {order.notes}
                    </p>
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