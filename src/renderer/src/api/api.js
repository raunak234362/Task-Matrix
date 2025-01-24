/* eslint-disable no-undef */
import axios from 'axios';

const instance = axios.create({
  // baseURL: 'https://106.51.141.125:5153',
  baseURL: 'https://192.168.1.153:5154',
  // baseURL: 'https://projectstationbe.onrender.com/',
  httpsAgent: {
    rejectUnauthorized: false
  }
});

export default instance;
