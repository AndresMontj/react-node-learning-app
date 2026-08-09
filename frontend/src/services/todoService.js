import axios from 'axios';

// Configurable via frontend/.env (VITE_API_URL) so the backend port can change
// without touching the source code.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Get all todos
export const getTodos = async () => {
  const response = await axios.get(`${API_BASE_URL}/todos`);
  return response.data;
};

// Create a new todo
export const createTodo = async (todoData) => {
  const response = await axios.post(`${API_BASE_URL}/todos`, todoData);
  return response.data;
};

// Update a todo
export const updateTodo = async (id, todoData) => {
  const response = await axios.put(`${API_BASE_URL}/todos/${id}`, todoData);
  return response.data;
};

// Delete a todo
export const deleteTodo = async (id) => {
  await axios.delete(`${API_BASE_URL}/todos/${id}`);
};

export default {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};