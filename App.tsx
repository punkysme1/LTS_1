
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ManuscriptDetailPage from './pages/ManuscriptDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import GuestBookPage from './pages/GuestBookPage';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import DonatePage from './pages/DonatePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageManuscriptsPage from './pages/admin/ManageManuscriptsPage';
import MassUploadManuscriptsPage from './pages/admin/MassUploadManuscriptsPage';
import ManageBlogPage from './pages/admin/ManageBlogPage';
import ManageGuestBookPage from './pages/admin/ManageGuestBookPage';
import ManuscriptFormPage from './pages/admin/ManuscriptFormPage';
import BlogPostFormPage from './pages/admin/BlogPostFormPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from '@/pages/LoginPage';
import { supabase } from './services/supabaseClient'; // Import Supabase client
import LoadingSpinner from './components/LoadingSpinner';


const App: React.FC = () => {
  const [session, setSession] = useState<any>(null); // Supabase session object
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoadingAuth(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (_event === 'SIGNED_IN' || _event === 'SIGNED_OUT' || _event === 'USER_UPDATED') {
        // Potentially force re-render or notify components if needed,
        // though state change in App.tsx should usually suffice.
         window.dispatchEvent(new Event("authChange"));
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // Session state will be updated by onAuthStateChange
  };
  
  // eslint-disable-next-line react/prop-types
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (loadingAuth) {
        // You might want a full-page loading spinner here
        return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
    }
    if (!session) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  };

  if (loadingAuth) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  }

  return (
    <HashRouter>
      <Routes>
        {/* Login Page */}
        <Route path="/login" element={<LoginPage isAuthenticated={!!session} />} />

        {/* User-facing pages */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog" element={<CatalogPage />} />
          <Route path="catalog/:id" element={<ManuscriptDetailPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:postId" element={<BlogPostDetailPage />} />
          <Route path="guestbook" element={<GuestBookPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin pages */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminLayout onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="manuscripts" element={<ManageManuscriptsPage />} />
          <Route path="manuscripts/new" element={<ManuscriptFormPage />} />
          <Route path="manuscripts/edit/:id" element={<ManuscriptFormPage />} />
          <Route path="mass-upload-manuscripts" element={<MassUploadManuscriptsPage />} />
          <Route path="blog" element={<ManageBlogPage />} />
          <Route path="blog/new" element={<BlogPostFormPage />} />
          <Route path="blog/edit/:postId" element={<BlogPostFormPage />} />
          <Route path="guestbook" element={<ManageGuestBookPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;