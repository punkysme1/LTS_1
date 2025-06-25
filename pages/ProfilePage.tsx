
import React from 'react';
import { APP_NAME } from '../constants';

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-700 dark:text-primary-300">Profil {APP_NAME}</h1>
      
      <img 
        src="https://picsum.photos/seed/library-profile/800/400" 
        alt="Gedung Perpustakaan TPPKP Qomaruddin" 
        className="w-full h-auto rounded-lg shadow-md mb-8 object-cover"
      />

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Tentang Kami</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
          Perpustakaan TPPKP (Tim Penyelamat dan Pelestari Khazanah Pesisir Qomaruddin) adalah sebuah inisiatif yang didedikasikan untuk menyelamatkan, melestarikan, dan mendigitalisasi manuskrip-manuskrip kuno warisan ulama Nusantara, khususnya yang berasal dari lingkungan Pondok Pesantren Qomaruddin, Bungah, Gresik, dan sekitarnya.
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Kami percaya bahwa manuskrip-manuskrip ini adalah jendela tak ternilai ke dalam kekayaan intelektual, spiritual, dan budaya para leluhur kita. Melalui upaya digitalisasi, kami berharap dapat membuat khazanah ini lebih mudah diakses oleh para peneliti, akademisi, santri, dan masyarakat luas.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Visi</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          Menjadi pusat rujukan digital terkemuka untuk studi manuskrip Islam Nusantara, khususnya dari tradisi pesisir utara Jawa.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Misi</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 leading-relaxed space-y-2">
          <li>Mengidentifikasi, mengumpulkan, dan menginventarisasi manuskrip-manuskrip kuno.</li>
          <li>Melakukan upaya konservasi fisik dan digitalisasi manuskrip.</li>
          <li>Menyediakan akses terbuka terhadap koleksi digital melalui platform online.</li>
          <li>Mendorong penelitian dan kajian terhadap isi manuskrip.</li>
          <li>Menyelenggarakan kegiatan edukasi dan diseminasi terkait khazanah manuskrip.</li>
        </ul>
      </section>
    </div>
  );
};

export default ProfilePage;
