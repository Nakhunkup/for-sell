import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore, useLangStore } from '../store';
import { translations } from '../translations';
import { Moon, Sun, MonitorPlay, LogOut, User, PlusCircle, Globe } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const { lang, toggleLang } = useLangStore();
  const navigate = useNavigate();
  const t = translations[lang].nav;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-primary-600 dark:text-primary-500 hover:opacity-80 transition-opacity">
            <MonitorPlay size={28} className="text-primary-600 dark:text-primary-400" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-200">
              CourseHub
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <button 
              onClick={toggleLang}
              className="px-3 py-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors flex items-center gap-1.5 text-sm font-semibold border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              aria-label="Toggle Language"
            >
              <Globe size={18} />
              {lang === 'en' ? 'TH' : 'EN'}
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                {user.role === 'instructor' && (
                  <Link 
                    to="/create-course" 
                    className="hidden sm:flex items-center gap-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-primary-500/30"
                  >
                    <PlusCircle size={18} />
                    {t.create_course}
                  </Link>
                )}
                
                <div className="flex items-center gap-4 border-l border-gray-200 dark:border-gray-700 pl-4">
                  <Link to="/dashboard" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-2">
                    <User size={18} />
                    <span className="hidden sm:block">{t.dashboard}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-400/10 p-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-3">
                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors px-3 py-2">
                  {t.sign_in}
                </Link>
                <Link to="/register" className="text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors shadow-sm shadow-primary-500/30 whitespace-nowrap">
                  {t.get_started}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
