
import React from 'react';
import { Link } from 'react-router-dom';

const StatCard: React.FC<{ title: string; value: string | number; linkTo: string; bgColorClass: string }> = ({ title, value, linkTo, bgColorClass }) => (
  <Link to={linkTo} className={`block p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow ${bgColorClass}`}>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-3xl font-bold text-white">{value}</p>
  </Link>
);

const AdminDashboardPage: React.FC = () => {
  // These would typically come from service calls
  const manuscriptCount = 55; // from MOCK_MANUSCRIPTS.length
  const blogPostCount = 12; // from MOCK_BLOG_POSTS.length
  const guestBookPendingCount = 13; // from MOCK_GUEST_BOOK_ENTRIES.filter(e => !e.isApproved).length

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Manuskrip" value={manuscriptCount} linkTo="/admin/manuscripts" bgColorClass="bg-blue-500 hover:bg-blue-600" />
        <StatCard title="Total Artikel Blog" value={blogPostCount} linkTo="/admin/blog" bgColorClass="bg-green-500 hover:bg-green-600" />
        <StatCard title="Pesan Buku Tamu (Pending)" value={guestBookPendingCount} linkTo="/admin/guestbook" bgColorClass="bg-yellow-500 hover:bg-yellow-600" />
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Akses Cepat</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/admin/manuscripts/new" className="block p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-center font-medium transition-colors">
            Tambah Manuskrip Baru
          </Link>
          <Link to="/admin/blog/new" className="block p-4 bg-primary-500 hover:bg-primary-600 text-white rounded-md text-center font-medium transition-colors">
            Tulis Artikel Blog Baru
          </Link>
          <Link to="/admin/guestbook" className="block p-4 bg-gray-500 hover:bg-gray-600 text-white rounded-md text-center font-medium transition-colors">
            Moderasi Buku Tamu
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">Selamat Datang!</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Gunakan panel admin ini untuk mengelola konten Perpustakaan Digital TPPKP Qomaruddin. Anda dapat menambah, mengubah, dan menghapus manuskrip, artikel blog, serta memoderasi komentar dan entri buku tamu.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
