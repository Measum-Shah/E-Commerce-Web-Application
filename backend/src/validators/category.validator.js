import { body } from "express-validator";

const createCategoryValidator = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters")
];

const updateCategoryValidator = [
  body("name")
    .optional()
    .isLength({ min: 2 })
    .withMessage("Category name must be at least 2 characters")
];

export {
  createCategoryValidator,
  updateCategoryValidator
};