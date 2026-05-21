import axios from "axios";

const api = axios.create({
  // baseURL: "https://e-commerce-web-application-aun5.onrender.com/api/v1"
   baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

export default api;