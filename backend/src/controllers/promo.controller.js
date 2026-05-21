import {
  createPromo,
  getAllPromos,
  getPromoById,
  updatePromo,
  deletePromo,
  togglePromoStatus,
  applyPromoCode
} from "../services/promo.service.js";

// ─── Admin Controllers ────────────────────────────────────────────────────────

export const createPromoController = async (req, res, next) => {
  try {
    const promo = await createPromo(req.body, req.user._id);
    res.status(201).json({ success: true, message: "Promo created successfully", data: promo });
  } catch (error) {
    next(error);
  }
};

export const getAllPromosController = async (req, res, next) => {
  try {
    const result = await getAllPromos(req.query);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getPromoByIdController = async (req, res, next) => {
  try {
    const promo = await getPromoById(req.params.id);
    res.status(200).json({ success: true, data: promo });
  } catch (error) {
    next(error);
  }
};

export const updatePromoController = async (req, res, next) => {
  try {
    const promo = await updatePromo(req.params.id, req.body);
    res.status(200).json({ success: true, message: "Promo updated successfully", data: promo });
  } catch (error) {
    next(error);
  }
};

export const deletePromoController = async (req, res, next) => {
  try {
    await deletePromo(req.params.id);
    res.status(200).json({ success: true, message: "Promo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const togglePromoStatusController = async (req, res, next) => {
  try {
    const promo = await togglePromoStatus(req.params.id);
    res.status(200).json({
      success: true,
      message: `Promo ${promo.isActive ? "activated" : "deactivated"} successfully`,
      data: promo
    });
  } catch (error) {
    next(error);
  }
};

// ─── User Controller ──────────────────────────────────────────────────────────

export const applyPromoCodeController = async (req, res, next) => {
  try {
    const { code, cart } = req.body;
    const result = await applyPromoCode(code, req.user._id, cart);
    res.status(200).json({
      success: true,
      message: "Promo code applied successfully",
      data: result
    });
  } catch (error) {
    next(error);
  }
};