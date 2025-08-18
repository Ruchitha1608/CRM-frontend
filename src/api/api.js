// src/api/api.js
import axios from "axios";

// Replace this with your backend base URL
// const API_BASE_URL = "http://localhost:5000/api";
const API_BASE_URL = "https://crm-backend-rmcb.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or wherever you store JWT
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
