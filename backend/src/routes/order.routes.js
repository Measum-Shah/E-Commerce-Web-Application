import express from "express";

import {
  createOrderController,
  getMyOrdersController,
  getOrderByIdController,
  cancelOrderController,
  getAllOrdersController,
  updateOrderStatusController
} from "../controllers/order.controller.js";

import {
  createOrderValidator,
  updateOrderStatusValidator
} from "../validators/order.validator.js";

import validate from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import roles from "../constants/roles.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  createOrderValidator,
  validate,
  createOrderController
);

router.get("/my", getMyOrdersController);

router.get(
  "/admin/all",
  authorize(roles.ADMIN),
  getAllOrdersController
);

router.get("/:id", getOrderByIdController);

router.patch("/:id/cancel", cancelOrderController);

router.patch(
  "/admin/:id/status",
  authorize(roles.ADMIN),
  updateOrderStatusValidator,
  validate,
  updateOrderStatusController
);

export default router;