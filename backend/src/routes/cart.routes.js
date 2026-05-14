import express from "express";

import {
  addToCartController,
  getMyCartController,
  updateCartItemController,
  removeCartItemController,
  clearCartController
} from "../controllers/cart.controller.js";

import {
  addToCartValidator,
  updateCartValidator
} from "../validators/cart.validator.js";

import validate from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getMyCartController);

router.post(
  "/add",
  addToCartValidator,
  validate,
  addToCartController
);

router.patch(
  "/update",
  updateCartValidator,
  validate,
  updateCartItemController
);

router.delete(
  "/remove/:productId",
  removeCartItemController
);

router.delete(
  "/clear",
  clearCartController
);

export default router;