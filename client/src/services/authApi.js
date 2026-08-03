import { fetchApi } from './api';

export const authApi = {
  register: (userData) => fetchApi('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  googleLogin: (payload) => fetchApi('/auth/google', { method: 'POST', body: JSON.stringify(payload) }),
  login: (credentials) => fetchApi('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  logout: () => fetchApi('/auth/logout', { method: 'POST' }),
  getMe: () => fetchApi('/auth/me'),
  sendOtp: () => fetchApi('/auth/send-otp', { method: 'POST' }),
  verifyOtp: (otp) => fetchApi('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ otp }) }),
  forgotPassword: (email) => fetchApi('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token, password) => fetchApi(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify({ password }) }),
  verifyEmail: (token) => fetchApi(`/auth/verify-email/${token}`),
};
