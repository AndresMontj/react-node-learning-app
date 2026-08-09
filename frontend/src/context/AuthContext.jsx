import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';
import { setUnauthorizedHandler } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // True while we're checking for an existing session on initial load.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If any API call ever comes back 401, treat the session as gone.
    setUnauthorizedHandler(() => setUser(null));

    (async () => {
      try {
        const me = await authService.getMe();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();

    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (username, password) => {
    const loggedInUser = await authService.login(username, password);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const register = useCallback(async (username, password) => {
    const newUser = await authService.register(username, password);
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
