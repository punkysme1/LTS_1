
import React, { useState, useEffect, useCallback } from 'react';
import { Manuscript } from '../types';
import { getManuscripts } from '../services/manuscriptService';
import ManuscriptCard from '../components/ManuscriptCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const CatalogPage: React.FC = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState(0);

  const fetchManuscripts = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    try {
      const { data, totalPages: newTotalPages, totalItems: newTotalItems } = await getManuscripts(page, query);
      setManuscripts(data);
      setTotalPages(newTotalPages);
      setTotalItems(newTotalItems);
    } catch (error) {
      console.error("Failed to fetch manuscripts:", error);
      // Handle error display here
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchManuscripts(currentPage, searchTerm);
  }, [currentPage, searchTerm, fetchManuscripts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };
  
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchManuscripts(1, searchTerm); // Explicitly call fetch on submit or rely on useEffect
  };


  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Katalog Manuskrip</h1>
      
      <form onSubmit={handleSearchSubmit} className="mb-8 max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Cari manuskrip (judul, pengarang, kode)..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
          />
          <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 py-3 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50">
            Cari
          </button>
        </div>
      </form>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {manuscripts.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 text-xl">
              {searchTerm ? `Tidak ada manuskrip yang cocok dengan pencarian "${searchTerm}".` : "Belum ada manuskrip yang tersedia."}
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                Menampilkan {manuscripts.length} dari {totalItems} manuskrip.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {manuscripts.map((manuscript) => (
                  <ManuscriptCard key={manuscript.id} manuscript={manuscript} />
                ))}
              </div>
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CatalogPage;
