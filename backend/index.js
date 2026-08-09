const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data (in-memory storage for learning purposes)
let todos = [
  { id: 1, text: 'Learn React', completed: true },
  { id: 2, text: 'Learn Node.js', completed: false },
  { id: 3, text: 'Build a full-stack app', completed: false }
];

// Routes
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.post('/api/todos', (req, res) => {
  const todo = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  todos[todoIndex] = { ...todos[todoIndex], ...req.body };
  res.json(todos[todoIndex]);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(todo => todo.id !== id);
  res.json({ message: 'Todo deleted' });
});

app.get('/', (req, res) => {
  res.send('Node.js Backend API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});