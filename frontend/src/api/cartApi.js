import api from "./axios";

export const getMyCart = async (token) => {
  const response = await api.get("/cart", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const addToCart = async (data, token) => {
  const response = await api.post("/cart/add", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCartItem = async (data, token) => {
  const response = await api.patch("/cart/update", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const removeCartItem = async (productId, token) => {
  const response = await api.delete(`/cart/remove/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const clearCart = async (token) => {
  const response = await api.delete("/cart/clear", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};