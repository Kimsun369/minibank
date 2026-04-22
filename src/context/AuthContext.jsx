import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";
const AuthContext = createContext(undefined);

// Normalize user object to use full_name consistently
const normalizeUser = (userData) => {
  if (!userData) return null;
  return {
    ...userData,
    // Ensure we have full_name field (not name)
    full_name: userData.full_name || userData.name || "",
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(false);

  // Wrapper for setUser that normalizes the data
  const setUser = (userData) => {
    const normalized = normalizeUser(userData);
    setUserState(normalized);
    if (normalized) {
      localStorage.setItem("user", JSON.stringify(normalized));
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedOverrides = localStorage.getItem("userOverrides");
    if (storedUser) {
      let userData = JSON.parse(storedUser);
      if (storedOverrides) {
        const overrides = JSON.parse(storedOverrides);
        userData = { ...userData, ...overrides };
      }
      setUserState(normalizeUser(userData));
    }
  }, []);

  const login = async (emailOrUsername, password) => {
    setLoading(true);
    try {
      // backend expects `username` field; accept email and use local-part as username
      const username = emailOrUsername.includes("@")
        ? emailOrUsername.split("@")[0]
        : emailOrUsername;
      const payload = { username, password };
      const res = await api.loginUser(payload);
      if (res && res.access_token) {
        localStorage.setItem("access_token", res.access_token);
      }
      if (res && res.refresh_token) {
        localStorage.setItem("refresh_token", res.refresh_token);
      }
      if (res && res.user) {
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
      const username = email.includes("@") ? email.split("@")[0] : email;
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
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("account");
    localStorage.removeItem("userOverrides");
    // Keep transactions in localStorage for persistence
    // localStorage.removeItem('transactions');
  };

  const setUserOverride = (overrides) => {
    const currentOverrides = JSON.parse(
      localStorage.getItem("userOverrides") || "{}",
    );
    const newOverrides = { ...currentOverrides, ...overrides };
    localStorage.setItem("userOverrides", JSON.stringify(newOverrides));
    if (user) {
      const updatedUser = { ...user, ...newOverrides };
      setUser(updatedUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
        setUser,
        setUserOverride,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
