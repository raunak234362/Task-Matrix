// export const BASE_URL='http://192.168.1.152:5152/'
// export const BASE_URL='http://192.168.1.215:5152/'
// Development environment
const DEV_URL = 'http://localhost:5154/api';
// Production environment
const PROD_URL = 'https://192.168.1.153:5154/api';

export const BASE_URL = process.env.NODE_ENV === 'development' ? DEV_URL : PROD_URL;

// Add CORS configuration
export const CORS_CONFIG = {
  origin: true,
  credentials: true
};

// export const BASE_URL='http://192.168.1.49:8000'
// export const BASE_URL='https://projectstationbe.onrender.com/'
