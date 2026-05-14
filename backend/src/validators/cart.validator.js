import { body } from "express-validator";

const addToCartValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be numeric")
];

const updateCartValidator = [
  body("productId")
    .notEmpty()
    .withMessage("Product ID is required"),

  body("quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isNumeric()
    .withMessage("Quantity must be numeric")
];

export {
  addToCartValidator,
  updateCartValidator
};