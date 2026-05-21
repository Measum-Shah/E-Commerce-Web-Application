import api from "./axios";

// Public route - NO token required
export const validateCoupon = async (code, cart) => {
  const response = await api.post("/promos/validate", { code, cart });
  return response.data;
};

// Admin routes - token passed manually in Authorization header
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