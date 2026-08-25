import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// FIX: Added a fallback. If Vercel misses the env variable, it forces the live Render URL.
const API_URL = import.meta.env.VITE_API_URL || "https://khanandrishti-backend.onrender.com/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in
  const checkLoggedIn = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  // Login User
  const login = async (employeeCode, password, subsidiary, role) => {
    try {
      setError(null); // FIX: Clear any old errors before a new login attempt
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          employeeCode,
          password,
          subsidiary,
          role,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
        // FIX: Ensure backend errors display properly on the UI
        setError(data.error || data.message || 'Invalid credentials');
        return false;
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError('An error occurred during login. Check network connection.');
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        credentials: 'include',
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // FIX: Force state to clear even if the network fails during logout
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        checkLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};