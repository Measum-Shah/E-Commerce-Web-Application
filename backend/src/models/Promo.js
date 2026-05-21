import mongoose from "mongoose";

const promoSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },

    description: {
      type: String,
      trim: true
    },

    type: {
      type: String,
      enum: ["percentage", "fixed", "free_shipping", "special_offer"],
      required: true
    },

    discountValue: {
      type: Number,
      required: function () {
        return this.type !== "free_shipping";
      },
      min: 0
    },

    // For special_offer: buy X get Y free / at discount
    specialOffer: {
      buyQuantity: { type: Number },      // buy X items
      getQuantity: { type: Number },      // get Y items
      getDiscount: { type: Number, default: 100 } // 100 = free, 50 = 50% off those Y items
    },

    minOrderAmount: {
      type: Number,
      default: 0
    },

    maxDiscountAmount: {
      type: Number, // cap for percentage discounts
      default: null
    },

    usageLimit: {
      type: Number,
      default: null // null = unlimited
    },

    usedCount: {
      type: Number,
      default: 0
    },

    perUserLimit: {
      type: Number,
      default: 1
    },

    applicableCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
      }
    ],

    applicableProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],

    startDate: {
      type: Date,
      default: Date.now
    },

    endDate: {
      type: Date,
      required: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// Virtual: is the promo currently valid?
promoSchema.virtual("isValid").get(function () {
  const now = new Date();
  return (
    this.isActive &&
    now >= this.startDate &&
    now <= this.endDate &&
    (this.usageLimit === null || this.usedCount < this.usageLimit)
  );
});


const Promo = mongoose.model("Promo", promoSchema);

export default Promo;