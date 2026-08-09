import React, { useState, useEffect } from 'react';
import todoService from '../services/todoService';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await todoService.getTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    try {
      const newTodo = await todoService.createTodo({ text: inputValue });
      setTodos([...todos, newTodo]);
      setInputValue('');
    } catch (error) {
      console.error('Error creating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setLoading(true);
    try {
      const updatedTodo = await todoService.updateTodo(id, {
        ...todo,
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    setLoading(true);
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="todo-app">
      <h1>React + Node.js Learning App</h1>

      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new todo..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !inputValue.trim()}>
          {loading ? 'Adding...' : 'Add Todo'}
        </button>
      </form>

      {loading && <p className="loading">Loading todos...</p>}

      {!loading && todos.length === 0 && (
        <p className="empty-state">No todos found. Add one above!</p>
      )}

      {!loading && todos.length > 0 && (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <span
                onClick={() => handleToggleTodo(todo.id)}
                className={`todo-text ${todo.completed ? 'completed' : ''}`}
              >
                {todo.text}
              </span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;