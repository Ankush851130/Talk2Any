import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { userApi } from '../services/userApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success) {
        setUser(res.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (err) {
      console.warn('Session restoration failed:', err.message);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const googleLogin = async (googleData) => {
    setError(null);
    try {
      const res = await authApi.googleLogin(googleData);
      if (res.token) {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
      return { success: false, message: err.message };
    }
  };

  const login = async (emailOrUsername, password) => {
    setError(null);
    try {
      const res = await authApi.login({ emailOrUsername, password });
      if (res.token) {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, message: err.message };
    }
  };

  const register = async (userData) => {
    setError(null);
    try {
      const res = await authApi.register(userData);
      if (res.token) {
        localStorage.setItem('token', res.token);
        setUser(res.user);
        return { success: true, user: res.user };
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, message: err.message };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateUser = async (profileData) => {
    try {
      const res = await userApi.updateProfile(profileData);
      if (res.success) {
        setUser(res.user);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const sendOtpCode = async () => {
    try {
      const res = await authApi.sendOtp();
      return { success: true, message: res.message, devOtp: res.devOtp };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const verifyOtpCode = async (otp) => {
    try {
      const res = await authApi.verifyOtp(otp);
      if (res.success) {
        setUser(res.user);
        return { success: true, message: res.message };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        googleLogin,
        login,
        register,
        logout,
        updateUser,
        sendOtpCode,
        verifyOtpCode,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
