import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

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

      if (data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (err) {
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

      if (data.success) {
        setUser(data.data);
        setIsAuthenticated(true);
        setError(null);
        return true;
      } else {
        setError(data.error || 'Invalid credentials');
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        credentials: 'include',
      });

      setUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      console.error(err);
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