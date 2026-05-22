import Promo from "../models/Promo.js";

// ─── Admin: Create promo / discount / special offer ───────────────────────────

export const createPromo = async (data, adminId) => {
  const existing = await Promo.findOne({ code: data.code.toUpperCase() });

  if (existing) {
    const error = new Error("Promo code already exists");
    error.statusCode = 400;
    throw error;
  }

  const promo = await Promo.create({
    ...data,
    createdBy: adminId
  });

  return promo;
};

// ─── Admin: Get all promos ─────────────────────────────────────────────────────

export const getAllPromos = async (query = {}) => {
  const { status, type, page = 1, limit = 20 } = query;

  const filter = {};

  if (type) filter.type = type;

  if (status === "active") {
    filter.isActive = true;
    filter.endDate = { $gte: new Date() };
  } else if (status === "expired") {
    filter.endDate = { $lt: new Date() };
  } else if (status === "inactive") {
    filter.isActive = false;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [promos, total] = await Promise.all([
    Promo.find(filter)
      .populate("applicableCategories", "name")
      .populate("applicableProducts", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),

    Promo.countDocuments(filter)
  ]);

  return {
    promos,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit))
  };
};

// ─── Admin: Get single promo by ID ────────────────────────────────────────────

export const getPromoById = async (id) => {
  const promo = await Promo.findById(id)
    .populate("applicableCategories", "name")
    .populate("applicableProducts", "name");

  if (!promo) {
    const error = new Error("Promo not found");
    error.statusCode = 404;
    throw error;
  }

  return promo;
};

// ─── Admin: Update promo ──────────────────────────────────────────────────────

export const updatePromo = async (id, data) => {
  if (data.code) {
    data.code = data.code.toUpperCase();
  }

  const promo = await Promo.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true
  });

  if (!promo) {
    const error = new Error("Promo not found");
    error.statusCode = 404;
    throw error;
  }

  return promo;
};

// ─── Admin: Delete promo ──────────────────────────────────────────────────────

export const deletePromo = async (id) => {
  const promo = await Promo.findByIdAndDelete(id);

  if (!promo) {
    const error = new Error("Promo not found");
    error.statusCode = 404;
    throw error;
  }
};

// ─── Admin: Toggle active status ─────────────────────────────────────────────

export const togglePromoStatus = async (id) => {
  const promo = await Promo.findById(id);

  if (!promo) {
    const error = new Error("Promo not found");
    error.statusCode = 404;
    throw error;
  }

  promo.isActive = !promo.isActive;
  await promo.save();

  return promo;
};

// ─── User: Validate & apply a promo code to cart ─────────────────────────────

export const applyPromoCode = async (code, userId, cart) => {
  const promo = await Promo.findOne({ code: code.toUpperCase() });

  if (!promo) {
    const error = new Error("Invalid promo code");
    error.statusCode = 400;
    throw error;
  }

  const now = new Date();

  if (!promo.isActive) {
    const error = new Error("This promo code is no longer active");
    error.statusCode = 400;
    throw error;
  }

  if (now < promo.startDate) {
    const error = new Error("This promo code is not yet valid");
    error.statusCode = 400;
    throw error;
  }

  if (now > promo.endDate) {
    const error = new Error("This promo code has expired");
    error.statusCode = 400;
    throw error;
  }

  if (promo.usageLimit !== null && promo.usedCount >= promo.usageLimit) {
    const error = new Error("This promo code has reached its usage limit");
    error.statusCode = 400;
    throw error;
  }

  // ✅ FIX: cart.totalAmount may not exist — compute it from items as fallback
  const cartItems = cart.items || [];

  const computedTotal = cartItems.reduce(
    (sum, item) => sum + (item.subtotal ?? item.price * item.quantity),
    0
  );

  const cartTotal = cart.totalAmount ?? computedTotal;

  if (cartTotal < promo.minOrderAmount) {
    const error = new Error(
      `Minimum order amount of Rs. ${promo.minOrderAmount} required for this promo`
    );
    error.statusCode = 400;
    throw error;
  }

  let discountAmount = 0;
  let applicableItems = cartItems;

  // Filter items to applicable products/categories if set
  if (promo.applicableProducts.length > 0) {
    applicableItems = cartItems.filter((item) =>
      promo.applicableProducts.some(
        (p) => p.toString() === item.product.toString()
      )
    );
  } else if (promo.applicableCategories.length > 0) {
    applicableItems = cartItems.filter((item) =>
      promo.applicableCategories.some(
        (c) => c.toString() === item.category?.toString()
      )
    );
  }

  // ✅ FIX: use item.subtotal if present, otherwise compute price × quantity
  const applicableTotal = applicableItems.reduce(
    (sum, item) => sum + (item.subtotal ?? item.price * item.quantity),
    0
  );

  switch (promo.type) {
    case "percentage":
      discountAmount = (applicableTotal * promo.discountValue) / 100;

      if (promo.maxDiscountAmount) {
        discountAmount = Math.min(discountAmount, promo.maxDiscountAmount);
      }
      break;

    case "fixed":
      discountAmount = Math.min(promo.discountValue, applicableTotal);
      break;

    case "free_shipping":
      discountAmount = 0;
      // delivery fee waiver is handled in Checkout via freeShipping flag
      break;

    case "special_offer":
      // Buy X get Y logic
      if (promo.specialOffer?.buyQuantity) {
        const totalQty = applicableItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        const freeRounds = Math.floor(
          totalQty / promo.specialOffer.buyQuantity
        );

        const freeQty = freeRounds * (promo.specialOffer.getQuantity || 1);

        // Discount = cheapest items × freeQty × getDiscount%
        const sortedItems = [...applicableItems].sort(
          (a, b) => a.price - b.price
        );

        let remaining = freeQty;

        for (const item of sortedItems) {
          if (remaining <= 0) break;

          const qty = Math.min(item.quantity, remaining);

          discountAmount +=
            qty *
            item.price *
            ((promo.specialOffer.getDiscount || 100) / 100);

          remaining -= qty;
        }
      }
      break;
  }

  discountAmount = Math.round(discountAmount);

  return {
    promo: {
      _id:         promo._id,
      code:        promo.code,
      type:        promo.type,
      description: promo.description,
      freeShipping: promo.type === "free_shipping"
    },
    discountAmount,
    newTotal: Math.max(0, cartTotal - discountAmount)
  };
};

// ─── Called from order service after order is placed ─────────────────────────

export const incrementPromoUsage = async (promoId) => {
  await Promo.findByIdAndUpdate(promoId, {
    $inc: { usedCount: 1 }
  });
};