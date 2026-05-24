import express from "express";

import {
  createProductController,
  getAllProductsController,
  getFeaturedProductsController,
  getProductBySlugController,
  updateProductController,
  deleteProductController
} from "../controllers/product.controller.js";

import {
  createProductValidator,
  updateProductValidator
} from "../validators/product.validator.js";

import validate from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import roles from "../constants/roles.js";

const router = express.Router();

router.get("/", getAllProductsController);

// ✅ /featured MUST come before /:slug — otherwise Express treats "featured" as a slug
router.get("/featured", getFeaturedProductsController);

router.get("/:slug", getProductBySlugController);

router.post(
  "/",
  protect,
  authorize(roles.ADMIN),
  createProductValidator,
  validate,
  createProductController
);

router.put(
  "/:id",
  protect,
  authorize(roles.ADMIN),
  updateProductValidator,
  validate,
  updateProductController
);

router.delete(
  "/:id",
  protect,
  authorize(roles.ADMIN),
  deleteProductController
);

export default router;