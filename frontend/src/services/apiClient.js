import axios from 'axios';

// Configurable via frontend/.env (VITE_API_URL) so the backend port can change
// without touching the source code.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  // Required so the httpOnly auth cookie set by the backend is sent with
  // every request and accepted from responses.
  withCredentials: true,
});

let onUnauthorized = null;

// Allows AuthContext to register a callback (e.g. clear user state / redirect
// to /login) without this module needing to import React/router directly.
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
