import apiClient from './apiClient';

export const register = async (username, password) => {
  const response = await apiClient.post('/auth/register', { username, password });
  return response.data;
};

export const login = async (username, password) => {
  const response = await apiClient.post('/auth/login', { username, password });
  return response.data;
};

export const logout = async () => {
  await apiClient.post('/auth/logout');
};

export const getMe = async () => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export default { register, login, logout, getMe };
