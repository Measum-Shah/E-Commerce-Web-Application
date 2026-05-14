import express from "express";

import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryBySlugController,
  updateCategoryController,
  deleteCategoryController
} from "../controllers/category.controller.js";

import {
  createCategoryValidator,
  updateCategoryValidator
} from "../validators/category.validator.js";

import validate from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import roles from "../constants/roles.js";

const router = express.Router();

router.get("/", getAllCategoriesController);
router.get("/:slug", getCategoryBySlugController);

router.post(
  "/",
  protect,
  authorize(roles.ADMIN),
  createCategoryValidator,
  validate,
  createCategoryController
);

router.put(
  "/:id",
  protect,
  authorize(roles.ADMIN),
  updateCategoryValidator,
  validate,
  updateCategoryController
);

router.delete(
  "/:id",
  protect,
  authorize(roles.ADMIN),
  deleteCategoryController
);

export default router;