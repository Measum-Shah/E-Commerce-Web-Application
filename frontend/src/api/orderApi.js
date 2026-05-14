
import api from "./axios";

export const placeOrder = async (data, token) => {
  const response = await api.post("/orders", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getMyOrders = async (token) => {
  const response = await api.get("/orders/my", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getSingleOrder = async (id, token) => {
  const response = await api.get(`/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const cancelMyOrder = async (id, token) => {
  const response = await api.patch(
    `/orders/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAllOrders = async (token) => {
  const response = await api.get("/orders/admin/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateOrderStatus = async (id, data, token) => {
  const response = await api.patch(
    `/orders/admin/${id}/status`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};