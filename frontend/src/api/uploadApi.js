import api from "./axios";

// DO NOT manually set Content-Type here.
// Axios sets it automatically as "multipart/form-data; boundary=----xyz"
// If you set it manually, the boundary is missing and multer can't parse the file.
export const uploadImage = async (file, token) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // Content-Type intentionally omitted — axios handles it
    },
  });

  return response.data;
};