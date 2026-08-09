import React from 'react';
import TodoList from './components/TodoList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>Full-Stack Learning App</h1>
        <p>React Frontend + Node.js Backend</p>
      </header>
      <main>
        <TodoList />
      </main>
    </div>
  );
}

export default App;