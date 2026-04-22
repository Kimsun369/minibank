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
  const [initializing, setInitializing] = useState(true);

  // Wrapper for setUser that normalizes the data
  const setUser = (userData) => {
    const normalized = normalizeUser(userData);
    setUserState(normalized);
    if (normalized) {
      localStorage.setItem("user", JSON.stringify(normalized));
      // Also store avatar separately for persistence
      if (normalized.avatar) {
        localStorage.setItem("userAvatar", normalized.avatar);
      }
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedOverrides = localStorage.getItem("userOverrides");
    const storedAvatar = localStorage.getItem("userAvatar");
    const token = localStorage.getItem("access_token");
    
    if (storedUser && token) {
      let userData = JSON.parse(storedUser);
      if (storedOverrides) {
        const overrides = JSON.parse(storedOverrides);
        userData = { ...userData, ...overrides };
      }
      // Restore avatar from localStorage if it exists
      if (storedAvatar) {
        userData.avatar = storedAvatar;
      }
      setUserState(normalizeUser(userData));
    }
    setInitializing(false);
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
        // Return success response for the Login component
        return { success: true, user: res.user };
      }
      
      // If we get here but no user data, return error
      return { success: false, error: "Login failed" };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
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
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUserState(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("account");
    localStorage.removeItem("userOverrides");
    localStorage.removeItem("userAvatar");
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

  // Calculate isAuthenticated based on user and token
  const isAuthenticated = !!user && !!localStorage.getItem("access_token");

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,  // ADD THIS - was missing!
        login,
        register,
        logout,
        loading,
        initializing,     // ADD THIS for loading state on app start
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