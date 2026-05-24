import api from "./axios";
import axios from "axios";

// Visits routes live at /api/visits — outside the /api/v1 prefix.
// We derive the server root from the existing api baseURL so this
// works in both dev and production automatically.
const SERVER_ROOT = api.defaults.baseURL.replace(/\/api\/v1\/?$/, "");

export const trackVisit = async () => {
  const response = await axios.post(
    `${SERVER_ROOT}/api/visits/track`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const getVisitStats = async (token) => {
  const response = await axios.get(
    `${SERVER_ROOT}/api/visits/stats`,
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};