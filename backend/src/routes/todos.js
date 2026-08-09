const express = require('express');
const { z } = require('zod');

const { requireAuth } = require('../middleware/auth');
const {
  getTodosForUser,
  createTodoForUser,
  findTodoForUser,
  updateTodoForUser,
  deleteTodoForUser,
} = require('../data/store');

const router = express.Router();

router.use(requireAuth);

const createTodoSchema = z.object({
  text: z.string().trim().min(1, 'Todo text is required').max(500, 'Todo text is too long'),
});

const updateTodoSchema = z.object({
  text: z.string().trim().min(1).max(500).optional(),
  completed: z.boolean().optional(),
});

router.get('/', (req, res) => {
  res.json(getTodosForUser(req.user.id));
});

router.post('/', (req, res) => {
  const parsed = createTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }

  const todo = createTodoForUser(req.user.id, parsed.data.text);
  res.status(201).json(todo);
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid todo id' });
  }

  const parsed = updateTodoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.issues[0].message });
  }

  if (!findTodoForUser(req.user.id, id)) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  const updated = updateTodoForUser(req.user.id, id, parsed.data);
  res.json(updated);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ message: 'Invalid todo id' });
  }

  const deleted = deleteTodoForUser(req.user.id, id);
  if (!deleted) {
    return res.status(404).json({ message: 'Todo not found' });
  }

  res.json({ message: 'Todo deleted' });
});

module.exports = router;
