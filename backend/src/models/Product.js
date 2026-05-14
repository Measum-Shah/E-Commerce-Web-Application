
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    brand: {
      type: String,
      trim: true
    },

    sku: {
      type: String,
      unique: true
    },

    condition: {
      type: String,
      enum: ["new", "used", "refurbished"],
      default: "used"
    },

    price: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      required: true,
      default: 0
    },

    lowStockThreshold: {
      type: Number,
      default: 5
    },

    images: [
      {
        type: String
      }
    ],

    specifications: {
      type: Map,
      of: String
    },

    tags: [
      {
        type: String
      }
    ],

    warranty: {
      type: String
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    },

    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;