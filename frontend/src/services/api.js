import axios from 'axios';

// Get backend API URL from env or fallback to local port
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('househunt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for global error catching (like token expiration)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect if user gets unauthorized
      localStorage.removeItem('househunt_token');
      localStorage.removeItem('househunt_user');
      // Dispatch custom event to let contexts know user has logged out
      window.dispatchEvent(new Event('auth-unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
