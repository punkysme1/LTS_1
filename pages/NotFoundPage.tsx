
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center px-4">
      <img 
        src="https://picsum.photos/seed/404-not-found/400/300" 
        alt="Halaman tidak ditemukan" 
        className="w-full max-w-sm h-auto rounded-lg shadow-md mb-8"
      />
      <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Maaf, halaman yang Anda cari tidak ada atau mungkin telah dipindahkan.
      </p>
      <Link 
        to="/" 
        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md transition duration-300"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default NotFoundPage;
