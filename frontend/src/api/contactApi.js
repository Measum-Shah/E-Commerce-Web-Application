import api from "./axios";

// Public route - NO token required
export const submitContactForm = async (formData) => {
  const response = await api.post("/contact", formData);
  return response.data;
};

// Admin routes - token passed manually in Authorization header
export const getAllContacts = async (params = {}, token) => {
  const response = await api.get("/contact", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getContactStats = async (token) => {
  const response = await api.get("/contact/stats/summary", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getContactById = async (id, token) => {
  const response = await api.get(`/contact/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateContactStatus = async (id, status, token) => {
  const response = await api.patch(`/contact/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addContactReply = async (id, replyMessage, token) => {
  const response = await api.post(`/contact/${id}/reply`, { replyMessage }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteContact = async (id, token) => {
  const response = await api.delete(`/contact/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};