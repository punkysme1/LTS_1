
import React from 'react';
import { APP_NAME } from '../constants';

const DonatePage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary-700 dark:text-primary-300">Dukung Kami</h1>

      <img 
        src="https://picsum.photos/seed/donate-page/800/300" 
        alt="Dukungan untuk Pelestarian Manuskrip" 
        className="w-full h-auto rounded-lg shadow-md mb-8 object-cover"
      />

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        Upaya pelestarian dan digitalisasi manuskrip kuno membutuhkan sumber daya yang berkelanjutan. Dukungan Anda, sekecil apapun, akan sangat berarti bagi kami dalam menjaga warisan intelektual ini untuk generasi mendatang.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Bagaimana Anda Bisa Membantu?</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-2">Donasi Finansial</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Donasi Anda akan digunakan untuk biaya operasional, perawatan manuskrip, pengadaan peralatan digitalisasi, dan pengembangan platform ini.
            </p>
            <p className="mt-3 text-gray-700 dark:text-gray-300">
              Transfer ke rekening berikut:
              <br />
              <strong>Bank XYZ Cabang Gresik</strong>
              <br />
              No. Rekening: <strong>123-456-7890</strong>
              <br />
              Atas Nama: <strong>Yayasan Pelestari Khazanah Qomaruddin</strong>
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Mohon konfirmasi donasi Anda ke email <a href="mailto:donasi@tppkpqomaruddin.org" className="text-primary-600 hover:underline dark:text-primary-400">donasi@tppkpqomaruddin.org</a>.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-2">Donasi Manuskrip</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Jika Anda memiliki manuskrip kuno yang ingin dilestarikan, kami dengan senang hati akan membantu merawat dan mendigitalisasikannya. Hubungi kami untuk diskusi lebih lanjut.
            </p>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-400 mb-2">Menjadi Relawan</h3>
            <p className="text-gray-700 dark:text-gray-300">
              Kami selalu terbuka untuk relawan yang memiliki keahlian dalam bidang konservasi, digitalisasi, IT, atau penelitian filologi.
            </p>
          </div>
        </div>
      </section>

      <p className="text-center text-gray-700 dark:text-gray-300 mt-10">
        Terima kasih atas kepedulian dan dukungan Anda terhadap {APP_NAME}.
      </p>
    </div>
  );
};

export default DonatePage;
