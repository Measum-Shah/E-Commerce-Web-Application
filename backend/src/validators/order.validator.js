
import { body } from "express-validator";
import paymentMethods from "../constants/paymentMethods.js";
import orderStatus from "../constants/orderStatus.js";

const createOrderValidator = [
  body("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Full name is required"),

  body("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("shippingAddress.address")
    .notEmpty()
    .withMessage("Address is required"),

  body("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required"),

  body("paymentMethod")
    .optional()
    .isIn(Object.values(paymentMethods))
    .withMessage("Invalid payment method")
];

const updateOrderStatusValidator = [
  body("orderStatus")
    .notEmpty()
    .withMessage("Order status is required")
    .isIn(Object.values(orderStatus))
    .withMessage("Invalid order status")
];

export {
  createOrderValidator,
  updateOrderStatusValidator
};