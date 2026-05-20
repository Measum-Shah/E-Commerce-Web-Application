import axios from "axios";

const api = axios.create({
  baseURL: "https://e-commerce-web-application-aun5.onrender.com/api/v1",
  withCredentials: true,
});

export default api;