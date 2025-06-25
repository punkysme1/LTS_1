
import React from 'react';
import { Link } from 'react-router-dom';
import { Manuscript } from '../types';

interface ManuscriptCardProps {
  manuscript: Manuscript;
}

const ManuscriptCard: React.FC<ManuscriptCardProps> = ({ manuscript }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
      <Link to={`/catalog/${manuscript.id}`} className="block">
        <img 
          src={manuscript.thumbnailUrl || `https://picsum.photos/seed/${manuscript.id}/400/300`} 
          alt={manuscript.judul} 
          className="w-full h-48 object-cover" 
        />
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-primary-700 dark:text-primary-400 min-h-[3.5rem] line-clamp-2">{manuscript.judul}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pengarang: {manuscript.pengarang || 'Tidak diketahui'}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Kode: {manuscript.kodeInventarisasi}</p>
          <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4 min-h-[3.75rem]">
            {manuscript.deskripsi.substring(0, 100)}{manuscript.deskripsi.length > 100 ? '...' : ''}
          </p>
          <span className="inline-block bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold px-3 py-1 rounded-full">
            Lihat Detail
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ManuscriptCard;
