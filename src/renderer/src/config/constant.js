// export const BASE_URL='http://192.168.1.152:5152/'
// export const BASE_URL='http://192.168.1.215:5152/'
// Development environment
const DEV_URL = import.meta.env.VITE_BASE_URL;
// Production environment
const PROD_URL = import.meta.env.VITE_BASE_URL;

export const BASE_URL =
  process.env.NODE_ENV === "development" ? DEV_URL : PROD_URL;

// Add CORS configuration
export const CORS_CONFIG = {
  origin: true,
  credentials: true,
};

// export const BASE_URL='http://192.168.1.49:8000'
// export const BASE_URL='https://projectstationbe.onrender.com/'
