// In-memory storage for learning purposes only.
// Data resets whenever the server restarts. Do not use this pattern in
// production - swap this module for a real database.

let nextUserId = 1;
let nextTodoId = 1;

/** @type {{ id: number, username: string, passwordHash: string }[]} */
const users = [];

/** @type {{ id: number, userId: number, text: string, completed: boolean }[]} */
const todos = [];

function createUser({ username, passwordHash }) {
  const user = { id: nextUserId++, username, passwordHash };
  users.push(user);
  return user;
}

function findUserByUsername(username) {
  return users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
}

function findUserById(id) {
  return users.find((u) => u.id === id);
}

function getTodosForUser(userId) {
  return todos.filter((t) => t.userId === userId);
}

function createTodoForUser(userId, text) {
  const todo = { id: nextTodoId++, userId, text, completed: false };
  todos.push(todo);
  return todo;
}

function findTodoForUser(userId, todoId) {
  return todos.find((t) => t.id === todoId && t.userId === userId);
}

function updateTodoForUser(userId, todoId, updates) {
  const todo = findTodoForUser(userId, todoId);
  if (!todo) return null;
  Object.assign(todo, updates);
  return todo;
}

function deleteTodoForUser(userId, todoId) {
  const index = todos.findIndex((t) => t.id === todoId && t.userId === userId);
  if (index === -1) return false;
  todos.splice(index, 1);
  return true;
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
  getTodosForUser,
  createTodoForUser,
  findTodoForUser,
  updateTodoForUser,
  deleteTodoForUser,
};
