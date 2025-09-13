import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { setAuthToken, onApiEvent } from '../services/api';
import { disconnectSocket } from '../services/socket';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'auth.token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedToken) {
        setToken(storedToken);
      }
    } catch (_) {}
    setIsLoading(false);
  }, []);

  // Persist token changes
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem(AUTH_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (_) {}
    setAuthToken(token);
  }, [token]);

  const login = useCallback(async ({ token: newToken, user: newUser }) => {
    // Set new authentication state directly
    setToken(newToken || null);
    setUser(newUser || null);
  }, []);

  const logout = useCallback(() => {
    // Disconnect socket before logout
    disconnectSocket();
    
    // Clear all authentication state
    setToken(null);
    setUser(null);
    
    // Clear localStorage
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (_) {}
    
    // Clear any cached API token
    setAuthToken(null);
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    isLoading,
    login,
    logout,
    setUser,
  }), [token, user, isLoading, login, logout]);

  // Handle 401 globally
  useEffect(() => {
    const off = onApiEvent((event) => {
      if (event === 'unauthorized') {
        logout();
      }
    });
    return off;
  }, [logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


