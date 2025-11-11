import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from './components/shared/Toast';
import ProtectedRoute from './components/shared/ProtectedRoute';
import './App.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Admin Components
import AdminDashboard from './components/admin/AdminDashboard';
import QuestionManagement from './components/admin/QuestionManagement';

// User Components
import UserDashboard from './components/user/UserDashboard';
import QuizSelection from './components/user/QuizSelection';
import QuizInterface from './components/user/QuizInterface';
import QuizResults from './components/user/QuizResults';
import Profile from './components/user/Profile';
import Bookmarks from './components/user/Bookmarks';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/questions"
            element={
              <ProtectedRoute adminOnly>
                <QuestionManagement />
              </ProtectedRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/quiz"
            element={
              <ProtectedRoute>
                <QuizSelection />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/quiz/start"
            element={
              <ProtectedRoute>
                <QuizInterface />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/quiz/results"
            element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/bookmarks"
            element={
              <ProtectedRoute>
                <Bookmarks />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
