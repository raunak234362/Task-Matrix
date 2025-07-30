/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import axios from "axios";
// console.log("API URL:", import.meta.env.VITE_BASE_URL);
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: false, // Set to false to avoid CORS preflight
  proxy: true,
  httpsAgent: {
    rejectUnauthorized: false,
  },
});

// Add request interceptor to handle CORS
instance.interceptors.request.use((config) => {
  // Add token if it exists
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
