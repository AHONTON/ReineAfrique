// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "/api", // ou ton URL complète si backend séparé
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;