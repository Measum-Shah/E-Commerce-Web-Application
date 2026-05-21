import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import roles from "../constants/roles.js";

import {
  createPromoController,
  getAllPromosController,
  getPromoByIdController,
  updatePromoController,
  deletePromoController,
  togglePromoStatusController,
  applyPromoCodeController
} from "../controllers/promo.controller.js";

const router = express.Router();

// ─── Public/User routes ───────────────────────────────────────────────────────

// POST /api/v1/promos/apply  — user applies a code at checkout
router.post("/apply", protect, applyPromoCodeController);

// ─── Admin routes ─────────────────────────────────────────────────────────────

router.use(protect, authorize(roles.ADMIN));

router.get("/", getAllPromosController);
router.post("/", createPromoController);
router.get("/:id", getPromoByIdController);
router.put("/:id", updatePromoController);
router.delete("/:id", deletePromoController);
router.patch("/:id/toggle", togglePromoStatusController);

export default router;