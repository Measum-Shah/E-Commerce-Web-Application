import api from "./axios";

export const getAllCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const getCategoryBySlug = async (slug) => {
  const response = await api.get(`/categories/${slug}`);
  return response.data;
};

export const createCategory = async (data, token) => {
  const response = await api.post("/categories", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateCategory = async (id, data, token) => {
  const response = await api.put(`/categories/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteCategory = async (id, token) => {
  const response = await api.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};