
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Manuscript } from '../../types';
import { getManuscripts, deleteManuscript } from '../../services/manuscriptService';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const ManageManuscriptsPage: React.FC = () => {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);


  const fetchManuscripts = useCallback(async (page: number, query: string) => {
    setIsLoading(true);
    setFeedbackMessage(null);
    try {
      const { data, totalPages: newTotalPages } = await getManuscripts(page, query);
      setManuscripts(data);
      setTotalPages(newTotalPages);
    } catch (error) {
      console.error("Failed to fetch manuscripts:", error);
      setFeedbackMessage("Gagal memuat manuskrip.");
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
    setCurrentPage(1); 
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus manuskrip "${title}"?`)) {
      setIsLoading(true);
      try {
        await deleteManuscript(id);
        setFeedbackMessage(`Manuskrip "${title}" berhasil dihapus.`);
        fetchManuscripts(currentPage, searchTerm); // Refresh list
      } catch (error) {
        console.error("Failed to delete manuscript:", error);
        setFeedbackMessage("Gagal menghapus manuskrip.");
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Kelola Manuskrip</h1>
        <Link 
          to="/admin/manuscripts/new" 
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          Tambah Manuskrip Baru
        </Link>
      </div>

      {feedbackMessage && (
        <div className={`p-3 mb-4 rounded-md ${feedbackMessage.includes('berhasil') ? 'bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-200'}`}>
          {feedbackMessage}
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Cari manuskrip..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
        />
      </div>

      {isLoading && manuscripts.length === 0 ? ( // Show spinner only on initial load or full reload
        <LoadingSpinner />
      ) : (
        <>
          {manuscripts.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-4">
              {searchTerm ? "Tidak ada manuskrip yang cocok." : "Belum ada manuskrip."}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Judul</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pengarang</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Kode Inv.</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {manuscripts.map((manuscript) => (
                    <tr key={manuscript.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{manuscript.judul}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{manuscript.pengarang}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{manuscript.kodeInventarisasi}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link to={`/admin/manuscripts/edit/${manuscript.id}`} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">Edit</Link>
                        <button onClick={() => handleDelete(manuscript.id, manuscript.judul)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200">Hapus</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default ManageManuscriptsPage;
