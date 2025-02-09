import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { showNotification } from './notification';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        store.dispatch(logout());
        showNotification.error('Session expired. Please login again.');
      }
      
      // Handle other errors
      const message = error.response.data.message || 'An error occurred';
      showNotification.error(message);
    } else if (error.request) {
      showNotification.error('Network error. Please check your connection.');
    } else {
      showNotification.error('An unexpected error occurred.');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 