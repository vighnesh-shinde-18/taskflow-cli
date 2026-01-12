import axios from 'axios';
import { getToken } from './token/tokenStore.js';// Your helper to get token from storage

const client = axios.create({
  baseURL: 'http://localhost:5000/api/v1'
});

// The Request Interceptor
client.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;