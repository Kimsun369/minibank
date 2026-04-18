import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      // backend expects `username` field; accept email and use local-part as username
      const username = emailOrUsername.includes('@') ? emailOrUsername.split('@')[0] : emailOrUsername;
      const payload = { username, password };
      const res = await api.loginUser(payload);
      if (res && res.access_token) {
        localStorage.setItem('access_token', res.access_token);
      }
      if (res && res.refresh_token) {
        localStorage.setItem('refresh_token', res.refresh_token);
      }
      if (res && res.user) {
        localStorage.setItem('user', JSON.stringify(res.user));
        setUser(res.user);
      }
      return res;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      // create username from email local-part
      const username = email.includes('@') ? email.split('@')[0] : email;
      const payload = { username, password, full_name: name, email };
      const res = await api.registerUser(payload);
      // after register, attempt login to obtain tokens
      await login(email, password);
      return res;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('account');
    // Keep transactions in localStorage for persistence
    // localStorage.removeItem('transactions');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};