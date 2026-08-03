import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { WebRTCProvider } from './context/WebRTCContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Room from './pages/Room';
import Profile from './pages/Profile';
import Friends from './pages/Friends';
import Search from './pages/Search';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <WebRTCProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />

                {/* Protected User Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/room/:id"
                  element={
                    <ProtectedRoute>
                      <Room />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile/:username?"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/friends"
                  element={
                    <ProtectedRoute>
                      <Friends />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/search"
                  element={
                    <ProtectedRoute>
                      <Search />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Only Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch All */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </WebRTCProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
