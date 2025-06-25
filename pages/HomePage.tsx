
import React from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../constants';

const HomePage: React.FC = () => {
  return (
    <div className="text-center">
      <section className="py-12 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <div className="container mx-auto px-6">
          <img 
            src={`https://picsum.photos/seed/${APP_NAME}/1200/400`} 
            alt="Perpustakaan TPPKP Qomaruddin" 
            className="w-full max-w-4xl mx-auto h-auto rounded-lg shadow-md mb-8 object-cover max-h-96"
          />
          <h1 className="text-4xl sm:text-5xl font-bold text-primary-700 dark:text-primary-300 mb-6">
            Selamat Datang di {APP_NAME}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Jelajahi koleksi manuskrip digital kami, baca artikel menarik, dan tinggalkan jejak Anda di buku tamu. 
            Kami berdedikasi untuk melestarikan dan menyebarkan warisan intelektual Islam nusantara.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/catalog" 
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 text-lg"
            >
              Lihat Katalog Manuskrip
            </Link>
            <Link 
              to="/blog" 
              className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 text-lg"
            >
              Baca Blog Kami
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-10">Fitur Utama</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-3">Katalog Digital</h3>
            <p className="text-gray-600 dark:text-gray-400">Akses ratusan manuskrip digital dengan detail lengkap dan pratinjau halaman.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-3">Artikel & Blog</h3>
            <p className="text-gray-600 dark:text-gray-400">Baca tulisan-tulisan mendalam mengenai khazanah intelektual, sejarah, dan koleksi kami.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-3">Interaksi Komunitas</h3>
            <p className="text-gray-600 dark:text-gray-400">Berikan komentar pada artikel dan tinggalkan pesan di buku tamu digital kami.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
