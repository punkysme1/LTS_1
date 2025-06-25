

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { APP_NAME, NAVIGATION_LINKS, SunIcon, MoonIcon, MenuIcon, CloseIcon } from '../constants';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeClassName = "text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400";
  const inactiveClassName = "hover:text-primary-600 dark:hover:text-primary-400 transition-colors";

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary-700 dark:text-primary-300">
              {APP_NAME}
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {NAVIGATION_LINKS.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => 
                  `${isActive ? activeClassName : inactiveClassName} py-1 px-2`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
             <NavLink
                to="/admin" // ProtectedRoute will handle redirect if not logged in
                className="py-2 px-3 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-md transition-colors"
              >
                Admin
              </NavLink>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-label="Open main menu"
            >
              {isMobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAVIGATION_LINKS.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => 
                  `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-primary-50 dark:bg-gray-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
             <NavLink
                to="/admin" // ProtectedRoute will handle redirect
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-primary-500 text-white hover:bg-primary-600 mt-2"
              >
                Admin Panel
              </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
