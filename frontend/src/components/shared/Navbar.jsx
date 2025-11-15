import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, 
  X, 
  LogOut, 
  User, 
  BookOpen, 
  LayoutDashboard,
  FileText,
  Bookmark,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../../utils/helpers';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/questions', label: 'Questions', icon: FileText },
  ];

  const userLinks = [
    { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/user/quiz', label: 'Take Quiz', icon: BookOpen },
    { to: '/user/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/user/profile', label: 'Profile', icon: User },
  ];

  const links = isAdmin() ? adminLinks : userLinks;

  return (
    <nav className="bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 shadow-sm backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to={isAdmin() ? '/admin/dashboard' : '/user/dashboard'} className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 xs:w-8 xs:h-8 text-blue-600 dark:text-blue-500" />
              <span className="text-lg xs:text-xl font-bold text-gray-900 dark:text-white">QuizAI</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* User menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
              data-testid="navbar-theme-toggle"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-200">{user?.username}</span>
              {isAdmin() && (
                <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  Admin
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Theme Toggle for mobile */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle theme"
              data-testid="mobile-theme-toggle"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
              aria-label="Toggle menu"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111111] z-50 transition-colors duration-200" data-testid="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-colors min-h-[48px] touch-manipulation',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                  data-testid={`mobile-nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{link.label}</span>
                </Link>
              );
            })}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
              <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">
                Logged in as <span className="font-medium text-gray-900 dark:text-gray-200">{user?.username}</span>
                {isAdmin() && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors border border-red-200 dark:border-red-500/20"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
