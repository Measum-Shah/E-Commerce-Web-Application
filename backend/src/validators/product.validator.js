import { body } from "express-validator";

const createProductValidator = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required"),

  body("description")
    .notEmpty()
    .withMessage("Description is required"),

  body("category")
    .notEmpty()
    .withMessage("Category is required"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be numeric"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isNumeric()
    .withMessage("Stock must be numeric")
];

const updateProductValidator = [
  body("name")
    .optional()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("price")
    .optional()
    .isNumeric()
    .withMessage("Price must be numeric"),

  body("stock")
    .optional()
    .isNumeric()
    .withMessage("Stock must be numeric")
];

export {
  createProductValidator,
  updateProductValidator
};