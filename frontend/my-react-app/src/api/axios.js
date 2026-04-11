// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://13.51.237.129:8000/skill/",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("login")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("refresh/"); // cookie-based
        return api(originalRequest);
      } catch (err) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api