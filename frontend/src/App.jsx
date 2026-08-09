import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import TodoList from './components/TodoList';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <h1>Full-Stack Learning App</h1>
      <p>React Frontend + Node.js Backend</p>
      {user && (
        <div className="app-header-user">
          <span>Signed in as {user.username}</span>
          <button type="button" onClick={logout} className="logout-btn">
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <TodoList />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Header />
          <main>
            <AppRoutes />
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
