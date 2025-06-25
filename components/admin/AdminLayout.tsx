
import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { APP_NAME, ADMIN_NAVIGATION_LINKS, SunIcon, MoonIcon, MenuIcon, CloseIcon } from '../../constants';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const activeClassName = "bg-primary-700 text-white";
  const inactiveClassName = "text-gray-300 hover:bg-primary-600 hover:text-white";

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 dark:bg-gray-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-4 bg-gray-900 dark:bg-gray-800 border-b border-gray-700">
          <Link to="/admin" className="text-xl font-bold text-white">
            Admin Panel
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            aria-label="Close sidebar"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-5 px-2 space-y-1 flex-grow">
          {ADMIN_NAVIGATION_LINKS.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => 
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${isActive ? activeClassName : inactiveClassName}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-2 border-t border-gray-700">
          <NavLink
                to="/"
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-primary-600 hover:text-white"
              >
                Kembali ke Situs Utama
            </NavLink>
           <button
            onClick={handleLogoutClick}
            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-red-600 hover:text-white mt-1"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 shadow md:justify-end">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            aria-label="Open sidebar"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <span className="text-sm mr-4 hidden sm:block text-gray-700 dark:text-gray-300">Welcome, Admin!</span>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <SunIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />}
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
