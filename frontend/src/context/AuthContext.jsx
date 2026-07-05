import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('househunt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('househunt_token') || null;
  });
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Sync token and check session freshness on mount
  useEffect(() => {
    const loadCurrentUser = async () => {
      const storedToken = localStorage.getItem('househunt_token');
      if (storedToken) {
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('househunt_user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error('Session validation failed:', error.message);
          logout();
        }
      }
      setLoading(false);
    };

    loadCurrentUser();

    // Listen to global unauthorized events from api.js interceptors
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };

    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  // Register User
  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.post('/auth/register', userData);
      const { token: jwtToken, user: userInfo } = response.data;

      localStorage.setItem('househunt_token', jwtToken);
      localStorage.setItem('househunt_user', JSON.stringify(userInfo));

      setToken(jwtToken);
      setUser(userInfo);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed. Please try again.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Login User
  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: userInfo } = response.data;

      localStorage.setItem('househunt_token', jwtToken);
      localStorage.setItem('househunt_user', JSON.stringify(userInfo));

      setToken(jwtToken);
      setUser(userInfo);
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Invalid email or password.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('househunt_token');
    localStorage.removeItem('househunt_user');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  // Update Profile
  const updateProfile = async (formData) => {
    setLoading(true);
    setAuthError(null);
    try {
      // Send multipart form data for image uploads
      const response = await api.put('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = response.data.user;
      setUser(updatedUser);
      localStorage.setItem('househunt_user', JSON.stringify(updatedUser));
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to update profile details.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        register,
        login,
        logout,
        updateProfile,
        setAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
