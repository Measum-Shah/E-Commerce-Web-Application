import api from "./axios";

// ─── User: Apply promo code (authenticated) ───────────────────────────────────
// ✅ FIX: was missing — Checkout needs an authenticated apply route
export const applyPromoCode = async (code, cart, token) => {
  const response = await api.post(
    "/promos/apply",
    { code, cart },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;  // { success, message, data: { promo, discountAmount, newTotal } }
};

// ✅ KEPT for backward compatibility (public / guest validation if needed)
export const validateCoupon = async (code, cart) => {
  const response = await api.post("/promos/validate", { code, cart });
  return response.data;
};

// ─── Admin routes ─────────────────────────────────────────────────────────────

export const getAllPromos = async (params = {}, token) => {
  const response = await api.get("/promos", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getPromoById = async (id, token) => {
  const response = await api.get(`/promos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createPromo = async (data, token) => {
  const response = await api.post("/promos", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updatePromo = async (id, data, token) => {
  const response = await api.put(`/promos/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const togglePromo = async (id, token) => {
  const response = await api.patch(`/promos/${id}/toggle`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePromo = async (id, token) => {
  const response = await api.delete(`/promos/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};