
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Manuscript } from '../types';
import { getManuscriptById } from '../services/manuscriptService';
import ImageCarousel from '../components/ImageCarousel';
import LoadingSpinner from '../components/LoadingSpinner';

const DetailSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
  <section className={`mb-6 ${className}`}>
    <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-500 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">{title}</h2>
    <div className="text-gray-700 dark:text-gray-300 space-y-1">{children}</div>
  </section>
);

const DetailEntry: React.FC<{ label: string; value?: string | number | string[] }> = ({ label, value }) => {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <p>
      <span className="font-medium text-gray-600 dark:text-gray-400">{label}:</span>
      <span className="ml-2">{Array.isArray(value) ? value.join(', ') : value}</span>
    </p>
  );
};

const getGoogleDriveFolderId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/folders\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
};


const ManuscriptDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [manuscript, setManuscript] = useState<Manuscript | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchManuscript = async () => {
        setIsLoading(true);
        try {
          const data = await getManuscriptById(id);
          setManuscript(data || null);
        } catch (error) {
          console.error("Failed to fetch manuscript:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchManuscript();
    }
  }, [id]);

  const googleDriveEmbedUrl = useMemo(() => {
    if (manuscript?.googleDriveFolderUrl) {
      const folderId = getGoogleDriveFolderId(manuscript.googleDriveFolderUrl);
      if (folderId) {
        return `https://drive.google.com/embeddedfolderview?id=${folderId}#grid`;
      }
    }
    return null;
  }, [manuscript?.googleDriveFolderUrl]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!manuscript) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Manuskrip tidak ditemukan.</h2>
        <Link to="/catalog" className="mt-4 inline-block text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-bold text-primary-700 dark:text-primary-300 mb-2">{manuscript.judul}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Pengarang: <span className="font-semibold">{manuscript.pengarang || 'Tidak diketahui'}</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Kode Inventarisasi: {manuscript.kodeInventarisasi}
          {manuscript.kodeDigital && ` / Kode Digital: ${manuscript.kodeDigital}`}
        </p>
      </div>

      {/* Main Content: Thumbnail and Core Details */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/3 flex-shrink-0">
          <img 
            src={manuscript.thumbnailUrl || `https://picsum.photos/seed/${manuscript.id}/400/600`} 
            alt={`Thumbnail ${manuscript.judul}`} 
            className="w-full h-auto rounded-lg shadow-md object-cover md:max-h-[500px]" 
          />
        </div>
        <div className="md:w-2/3">
          <DetailSection title="Deskripsi">
            <p className="whitespace-pre-line leading-relaxed">{manuscript.deskripsi || "Tidak ada deskripsi."}</p>
          </DetailSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <DetailSection title="Atribut Utama">
              <DetailEntry label="Penyalin" value={manuscript.penyalin} />
              <DetailEntry label="Tahun Penyalinan" value={manuscript.tahunPenyalinan} />
              <DetailEntry label="Jumlah Halaman" value={manuscript.jumlahHalaman} />
              <DetailEntry label="Tinta" value={manuscript.tinta} />
            </DetailSection>

            <DetailSection title="Klasifikasi">
              <DetailEntry label="Kategori" value={manuscript.kategori} />
              <DetailEntry label="Bahasa" value={manuscript.bahasa} />
              <DetailEntry label="Aksara" value={manuscript.aksara} />
            </DetailSection>
          </div>
        </div>
      </div>
      
      {/* Detailed Information Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-8">
        <DetailSection title="Kondisi & Status">
          <DetailEntry label="Kondisi Naskah" value={manuscript.kondisiNaskah} />
          <DetailEntry label="Status Ketersediaan" value={manuscript.statusKetersediaan} />
          <DetailEntry label="Kelengkapan" value={manuscript.kelengkapan} />
          <DetailEntry label="Keterbacaan" value={manuscript.keterbacaan} />
        </DetailSection>

        {(manuscript.kolofon || manuscript.catatan) && (
          <DetailSection title="Catatan Tambahan">
            {manuscript.kolofon && (
                <div className="mb-3">
                    <h3 className="font-medium text-gray-600 dark:text-gray-400">Kolofon:</h3>
                    <p className="whitespace-pre-line text-sm">{manuscript.kolofon}</p>
                </div>
            )}
            {manuscript.catatan && (
                <div>
                    <h3 className="font-medium text-gray-600 dark:text-gray-400">Catatan Internal:</h3>
                    <p className="whitespace-pre-line text-sm">{manuscript.catatan}</p>
                </div>
            )}
          </DetailSection>
        )}
      </div>
      
      {/* Google Drive Folder Embed */}
      {googleDriveEmbedUrl && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Pratinjau Isi Buku (via Google Drive)</h2>
          <div className="aspect-w-16 aspect-h-9 md:aspect-h-12 lg:aspect-h-10 border dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={googleDriveEmbedUrl}
              className="w-full h-full min-h-[500px] md:min-h-[600px]"
              allow="fullscreen"
              title={`Pratinjau Folder Google Drive untuk ${manuscript.judul}`}
              aria-label={`Pratinjau Folder Google Drive untuk ${manuscript.judul}`}
            ></iframe>
          </div>
           <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
            Folder Google Drive ini dibuka dalam mode sematan. Untuk pengalaman penuh, buka 
            <a 
                href={manuscript.googleDriveFolderUrl} 
                target="_blank" rel="noopener noreferrer" 
                className="text-primary-600 hover:underline dark:text-primary-400 ml-1"
            >
                langsung di Google Drive
            </a>.
          </p>
        </div>
      )}

      {/* Image Carousel for specific image URLs */}
      {manuscript.imageUrls && manuscript.imageUrls.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">Galeri Gambar Pilihan</h2>
          <ImageCarousel images={manuscript.imageUrls} altText={manuscript.judul} />
        </div>
      )}


      <div className="mt-12 text-center">
        <Link 
          to="/catalog" 
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Kembali ke Katalog
        </Link>
      </div>
    </div>
  );
};

export default ManuscriptDetailPage;