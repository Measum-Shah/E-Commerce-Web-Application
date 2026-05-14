import mongoose from "mongoose";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

import orderStatus from "../constants/orderStatus.js";
import paymentMethods from "../constants/paymentMethods.js";


// can later change to transsaction type

const createOrder = async (userId, data) => {
  const cart = await Cart.findOne({ user: userId });

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);

    if (!product) {
      throw new Error(`${item.name} not found`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} has insufficient stock`);
    }

    product.stock = product.stock - item.quantity;

    await product.save();
  }

  const subtotal = cart.totalAmount;
  const deliveryFee = data.deliveryFee || 0;
  const discount = data.discount || 0;

  const totalAmount = subtotal + deliveryFee - discount;

  const order = await Order.create({
    user: userId,

    items: cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      subtotal: item.subtotal
    })),

    shippingAddress: data.shippingAddress,

    paymentMethod:
      data.paymentMethod || paymentMethods.COD,

    paymentStatus: "pending",

    orderStatus: orderStatus.PENDING,

    totalItems: cart.totalItems,

    subtotal,

    deliveryFee,

    discount,

    totalAmount,

    notes: data.notes
  });

  cart.items = [];
  cart.totalItems = 0;
  cart.totalAmount = 0;

  await cart.save();

  return order;
};

const getMyOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("items.product", "name slug images");

  return orders;
};

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

const cancelOrder = async (orderId, userId) => {
  const order = await Order.findOne({
    _id: orderId,
    user: userId
  });

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

  return order;
};

const getAllOrders = async () => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("user", "fullName email phone");

  return orders;
};

const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.orderStatus = status;

  if (status === orderStatus.DELIVERED) {
    order.deliveredAt = new Date();
    order.paymentStatus = "paid";
  }

  await order.save();

  return order;
};

export {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus
};