
import React, { useState, useEffect, useCallback } from 'react';
import { GuestBookEntry } from '../types';
import { getGuestBookEntries, addGuestBookEntry } from '../services/guestbookService';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';

const GuestBookPage: React.FC = () => {
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const fetchEntries = useCallback(async (page: number) => {
    setIsLoading(true);
    try {
      const { data, totalPages: newTotalPages } = await getGuestBookEntries(page, true); // Show approved only
      setEntries(data);
      setTotalPages(newTotalPages);
    } catch (error) {
      console.error("Failed to fetch guest book entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries(currentPage);
  }, [currentPage, fetchEntries]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      setSubmitError("Nama dan pesan tidak boleh kosong.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      await addGuestBookEntry({ name, message });
      setName('');
      setMessage('');
      setSubmitSuccess("Pesan Anda telah dikirim dan menunggu moderasi.");
      // Optionally, refetch entries or update UI optimistically,
      // but new entries are not approved by default.
    } catch (err) {
      setSubmitError("Gagal mengirim pesan. Silakan coba lagi.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">Buku Tamu</h1>

      <form onSubmit={handleSubmit} className="mb-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Tinggalkan Pesan Anda</h2>
        {submitError && <p className="mb-3 text-red-600 dark:text-red-400">{submitError}</p>}
        {submitSuccess && <p className="mb-3 text-green-600 dark:text-green-400">{submitSuccess}</p>}
        <div className="mb-4">
          <label htmlFor="guestName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama</label>
          <input
            type="text"
            id="guestName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="guestMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pesan</label>
          <textarea
            id="guestMessage"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 disabled:opacity-50"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </form>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {entries.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">Belum ada pesan di buku tamu.</p>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <div key={entry.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <p className="font-semibold text-gray-800 dark:text-gray-100">{entry.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {new Date(entry.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{entry.message}</p>
                </div>
              ))}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GuestBookPage;
