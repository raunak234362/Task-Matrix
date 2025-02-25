/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
import axios from "axios";

const instance = axios.create({
  // baseURL: "https://106.51.141.125:5154",
  baseURL: "http://localhost:5155",
  // baseURL: "https://whiteboardtec.com/backend",
  // baseURL: "https://192.168.1.153:5154",
  // baseURL: "http://192.168.1.152:5152/",
  // baseURL: "http://192.168.1.153:3000",
  // baseURL: 'https://projectstationbe.onrender.com/',
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
