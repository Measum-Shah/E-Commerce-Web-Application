import mongoose from "mongoose";
import orderStatus from "../constants/orderStatus.js";
import paymentMethods from "../constants/paymentMethods.js";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    subtotal: Number
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [orderItemSchema],

    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      area: String,
      postalCode: String
    },

    paymentMethod: {
      type: String,
      enum: Object.values(paymentMethods),
      default: paymentMethods.COD
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: Object.values(orderStatus),
      default: orderStatus.PENDING
    },

    totalItems: Number,
    subtotal: Number,
    deliveryFee: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },

    promoCode: {
  type: String,
  default: null
},
    totalAmount: Number,

    notes: String,

    cancelledAt: Date,
    deliveredAt: Date
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;