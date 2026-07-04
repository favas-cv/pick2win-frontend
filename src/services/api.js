import axios from 'axios';

const API_URL = (import.meta.env.VITE_API_URL); //|| 'https://pick2win-api.duckdns.org/api').replace(/\/+$/, '');
console.log("API URL:", API_URL);
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Token auth header on every request if the user is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    const isFormData = config.data && (
      config.data instanceof FormData ||
      Object.prototype.toString.call(config.data) === '[object FormData]'
    );
    if (isFormData && config.headers) {
      if (typeof config.headers.delete === 'function') {
        config.headers.delete('Content-Type');
        config.headers.delete('content-type');
      } else {
        delete config.headers['Content-Type'];
        delete config.headers['content-type'];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler — 401 means token expired/invalid → log out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.skipAuthRedirect) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login without triggering a full React re-render loop
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login/user';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
