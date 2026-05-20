import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import roles from "../constants/roles.js";
import validate from "../middlewares/validate.middleware.js";
import {
  submitContactForm,
  getAllContacts,
  getContactById,
  updateContactStatus,
  addReply,
  deleteContact,
  getContactStats
} from "../controllers/contact.controller.js";
import {
  contactFormValidator,
  contactStatusValidator,
  contactReplyValidator
} from "../validators/contact.validator.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/", contactFormValidator, validate, submitContactForm);

// Admin only routes (authentication + admin role required)
router.get("/", protect, authorize(roles.ADMIN), getAllContacts);
router.get("/stats/summary", protect, authorize(roles.ADMIN), getContactStats);
router.get("/:id", protect, authorize(roles.ADMIN), getContactById);
router.patch("/:id/status", protect, authorize(roles.ADMIN), contactStatusValidator, validate, updateContactStatus);
router.post("/:id/reply", protect, authorize(roles.ADMIN), contactReplyValidator, validate, addReply);
router.delete("/:id", protect, authorize(roles.ADMIN), deleteContact);

export default router;