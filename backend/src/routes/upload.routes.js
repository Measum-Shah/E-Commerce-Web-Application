import express from "express";
import cloudinary from "../config/cloudinary.js";
import upload from "../middlewares/upload.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/role.middleware.js";
import roles from "../constants/roles.js";

const router = express.Router();

// POST /api/v1/upload
router.post(
  "/",
  protect,
  authorize(roles.ADMIN),
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400);
        throw new Error("No image file received");
      }

      // Convert buffer to base64 data URI — works reliably with cloudinary v1
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "premier",
      });

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;