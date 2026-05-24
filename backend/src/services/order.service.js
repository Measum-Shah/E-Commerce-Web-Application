import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";

import orderStatus from "../constants/orderStatus.js";

import { applyPromoCode, incrementPromoUsage } from "./promo.service.js";

// ─── Email utilities ──────────────────────────────────────────────────────────
import sendEmail from "../utils/sendEmail.js";
import orderPlacedAdminEmail from "../emails/orderPlacedAdmin.js";
import orderPlacedCustomerEmail from "../emails/orderPlacedCustomer.js";
import orderStatusUpdateEmail from "../emails/orderStatusUpdate.js";

const ADMIN_EMAIL = "premiercomputers007@gmail.com";

// ─── Background Task Helper ───────────────────────────────────────────────────

const runInBackground = (task, label = "Background task") => {
  setImmediate(async () => {
    try {
      await task();
    } catch (error) {
      console.error(`[${label}] Failed:`, error.message);
    }
  });
};

// ─── Email Background Jobs ────────────────────────────────────────────────────

const sendOrderPlacedEmailsInBackground = async (order, userId) => {
  const user = await User.findById(userId).select("fullName email phone");

  if (!user) {
    console.warn("[sendOrderPlacedEmails] User not found, skipping emails");
    return;
  }

  const emailTasks = [];

  // 1. Email to admin
  const adminMail = orderPlacedAdminEmail(order, user);
  emailTasks.push(
    sendEmail({
      to: ADMIN_EMAIL,
      ...adminMail,
    })
  );

  // 2. Confirmation email to customer
  if (user.email) {
    const customerMail = orderPlacedCustomerEmail(order, user);
    emailTasks.push(
      sendEmail({
        to: user.email,
        ...customerMail,
      })
    );
  }

  const results = await Promise.allSettled(emailTasks);

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `[sendOrderPlacedEmails] Email ${index + 1} failed:`,
        result.reason?.message
      );
    }
  });
};

const sendOrderStatusEmailInBackground = async (order, user) => {
  if (!user?.email) {
    console.warn("[sendOrderStatusEmail] User email not found, skipping email");
    return;
  }

  const { subject, html } = orderStatusUpdateEmail(order, user);

  await sendEmail({
    to: user.email,
    subject,
    html,
  });
};

// ─── Create Order ─────────────────────────────────────────────────────────────

const createOrder = async (userId, body) => {
  const {
    shippingAddress,
    paymentMethod,
    promoCode,
    notes,
    deliveryFee: clientDeliveryFee,
  } = body;

  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    const err = new Error("Cart is empty");
    err.statusCode = 400;
    throw err;
  }

  let discount = 0;
  let freeShipping = false;
  let appliedPromo = null;

  if (promoCode) {
    const cartPayload = {
      totalAmount: cart.totalAmount,
      items: cart.items.map((item) => ({
        product: item.product._id || item.product,
        category: item.product?.category,
        price: item.price ?? item.product?.price ?? 0,
        quantity: item.quantity,
        subtotal:
          item.subtotal ??
          (item.price ?? item.product?.price ?? 0) * item.quantity,
      })),
    };

    const promoResult = await applyPromoCode(promoCode, userId, cartPayload);

    discount = promoResult.discountAmount;
    freeShipping = promoResult.promo.freeShipping;
    appliedPromo = promoResult.promo;
  }

  const deliveryFee = freeShipping ? 0 : clientDeliveryFee ?? 300;
  const totalAmount = Math.max(0, cart.totalAmount - discount + deliveryFee);

  const order = await Order.create({
    user: userId,
    items: cart.items,
    shippingAddress,
    paymentMethod,
    totalItems: cart.totalItems,
    subtotal: cart.totalAmount,
    deliveryFee,
    discount,
    totalAmount,
    notes,
    promoCode: appliedPromo?.code || null,
  });

  if (appliedPromo) {
    await incrementPromoUsage(appliedPromo._id);
  }

  // Clear cart before returning order
  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [], totalItems: 0, totalAmount: 0 }
  );

  // Email sending starts in background.
  // Order placement response will NOT wait for emails.
  runInBackground(
    () => sendOrderPlacedEmailsInBackground(order, userId),
    "createOrder email notification"
  );

  return order;
};

// ─── Get My Orders ────────────────────────────────────────────────────────────

const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name slug images");

  return orders;
};

// ─── Get Order By ID ──────────────────────────────────────────────────────────

const getOrderById = async (orderId, user) => {
  const order = await Order.findById(orderId)
    .populate("user", "fullName email phone")
    .populate("items.product", "name slug images");

  if (!order) {
    throw new Error("Order not found");
  }

  const isAdmin = user.role === "admin";
  const isOwner = order.user._id.toString() === user._id.toString();

  if (!isAdmin && !isOwner) {
    throw new Error("Access denied");
  }

  return order;
};

// ─── Cancel Order ─────────────────────────────────────────────────────────────

const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });

  if (!order) {
    throw new Error("Order not found");
  }

  if (
    order.orderStatus === orderStatus.SHIPPED ||
    order.orderStatus === orderStatus.DELIVERED
  ) {
    throw new Error("Order cannot be cancelled now");
  }

  order.orderStatus = orderStatus.CANCELLED;
  order.cancelledAt = new Date();

  await order.save();

  // Status email starts in background.
  // Cancel response will NOT wait for email.
  runInBackground(async () => {
    const user = await User.findById(userId).select("fullName email");

    await sendOrderStatusEmailInBackground(order, user);
  }, "cancelOrder email notification");

  return order;
};

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────

const getAllOrders = async () => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "fullName email phone");

  return orders;
};

// ─── Update Order Status (Admin) ─────────────────────────────────────────────

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId).populate(
    "user",
    "fullName email phone"
  );

  if (!order) {
    throw new Error("Order not found");
  }

  order.orderStatus = status;

  if (status === orderStatus.DELIVERED) {
    order.deliveredAt = new Date();
    order.paymentStatus = "paid";
  }

  await order.save();

  // Status update email starts in background.
  // Admin status update response will NOT wait for email.
  runInBackground(
    () => sendOrderStatusEmailInBackground(order, order.user),
    "updateOrderStatus email notification"
  );

  return order;
};

export {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
};