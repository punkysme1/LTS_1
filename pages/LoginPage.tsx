
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { APP_NAME } from '../constants';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../services/supabaseClient'; // Import Supabase client

interface LoginPageProps {
  isAuthenticated: boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ isAuthenticated }) => {
  const [email, setEmail] = useState(''); // Supabase uses email for login by default
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Default Supabase admin user credentials can be set up in Supabase dashboard
    // For this example, let's use tppkp@example.com / Qomaruddin2025
    // Ensure you create this user in your Supabase Auth settings.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email, // Using email as the identifier
      password: password,
    });

    if (signInError) {
      setError(signInError.message || 'Email atau password salah.');
    } else {
      // onAuthStateChange in App.tsx will handle navigation
      // Forcing navigation here can sometimes cause race conditions if onAuthStateChange is slow
      // navigate('/admin'); 
    }
    setLoading(false);
  };

  return (
    <div className={`flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4`}>
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
        <div className="text-center">
            <img src={`https://picsum.photos/seed/${APP_NAME}-logo/100/100`} alt="Logo" className="mx-auto mb-4 rounded-full" />
          <h1 className="text-3xl font-bold text-primary-700 dark:text-primary-300">{APP_NAME}</h1>
          <p className="text-gray-600 dark:text-gray-400">Admin Login</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 dark:text-red-400 text-sm text-center p-2 bg-red-100 dark:bg-red-900 rounded-md">{error}</p>}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
              placeholder="Password"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
         <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            <Link to="/" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                &larr; Kembali ke Situs Utama
            </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;