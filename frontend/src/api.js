import axios from 'axios';

/**
 * API client for Smart Career Guidance System
 *
 * Base URL comes from environment variable so it works in both
 * local dev and production without changing code:
 *   .env.development  → REACT_APP_API_URL=http://localhost:5000/api
 *   .env.production   → REACT_APP_API_URL=https://your-api.com/api
 */
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login if token expired
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;