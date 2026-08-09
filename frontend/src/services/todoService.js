import apiClient from './apiClient';

// Get all todos
export const getTodos = async () => {
  const response = await apiClient.get('/todos');
  return response.data;
};

// Create a new todo
export const createTodo = async (todoData) => {
  const response = await apiClient.post('/todos', todoData);
  return response.data;
};

// Update a todo
export const updateTodo = async (id, todoData) => {
  const response = await apiClient.put(`/todos/${id}`, todoData);
  return response.data;
};

// Delete a todo
export const deleteTodo = async (id) => {
  await apiClient.delete(`/todos/${id}`);
};

export default {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo
};