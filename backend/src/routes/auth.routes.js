import express from "express";
import authorize from "../middlewares/role.middleware.js";
import roles from "../constants/roles.js";
import {
  register,
  login,
  me
} from "../controllers/auth.controller.js";


import {
  registerValidator,
  loginValidator
} from "../validators/auth.validator.js";

import validate from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);
router.get("/me", protect, me);

router.get(
  "/admin-test",
  protect,
  authorize(roles.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin"
    });
  }
);

export default router;