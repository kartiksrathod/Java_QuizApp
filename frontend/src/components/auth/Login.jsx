import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BookOpen, Mail, Lock, AlertCircle, Brain, Sun, Moon } from 'lucide-react';
import LoadingSpinner from '../shared/LoadingSpinner';
import { showToast } from '../shared/Toast';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const result = await login(formData.username, formData.password);
    setLoading(false);

    if (result.success) {
      showToast('Login successful!', 'success');
      // Redirect based on role
      if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } else {
      setError(result.error || 'Login failed');
      showToast(result.error || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center px-4 transition-colors duration-200">
      {/* Theme toggle button - fixed position */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg z-50"
        aria-label="Toggle theme"
        data-testid="login-theme-toggle"
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#111111] p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 fade-in transition-colors duration-200">
        {/* Logo and title */}
        <div className="text-center">
          <div className="flex justify-center">
            <Brain className="w-16 h-16 text-blue-600 dark:text-blue-500" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">QuizAI Platform</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Sign in to your account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter email or username"
                  data-testid="login-username-input"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-3 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400 dark:placeholder-gray-500"
                  placeholder="Enter password"
                  data-testid="login-password-input"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="login-submit-button"
          >
            {loading ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Sign up
              </Link>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                ← Back to Home
              </Link>
            </p>
          </div>
        </form>

        {/* Demo credentials */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/30">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">Demo Credentials:</p>
          <div className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
            <p><strong>Admin:</strong> admin@quizapp.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
