import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

// Create AuthContext
export const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/check`);
        if (response.data.isAuthenticated) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error('Authentication check error:', error);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`${API_URL}/auth/logout`);
      setUser(null);
    } catch (error) {
      setError(error.response?.data?.message || 'Logout failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user profile
  const getUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/users/profile`);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    getUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
