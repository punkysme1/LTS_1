import React, { useState, useEffect, useCallback } from 'react';
// DIUBAH: Hapus 'Link' karena kita tidak akan berpindah halaman lagi
// import { Link } from 'react-router-dom';
import { Manuscript } from '../../types';
import { getManuscripts, deleteManuscript, addManuscript } from '../../services/manuscriptService'; // BARU: Tambahkan import 'addManuscript'
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

// BARU: Kunci unik untuk menyimpan data form di localStorage
const STORAGE_KEY = 'progresFormManuskrip';

// BARU: Nilai awal yang kosong untuk form
const initialFormState = {
  judul: '', pengarang: '', penyalin: '', tahunPenyalinan: '', deskripsi: '',
  kodeInventarisasi: '', kodeDigital: '', statusKetersediaan: 'Tersedia',
  kelengkapan: 'Lengkap', keterbacaan: 'Baik', jumlahHalaman: 0, tinta: '',
  kondisiNaskah: '', kolofon: '', catatan: '', thumbnailUrl: '',
  googleDriveFolderUrl: '', kategori: [] as string[], bahasa: [] as string[],
  aksara: [] as string[], imageUrls: [] as string[],
};

const ManageManuscriptsPage: React.FC = () => {
  // --- State untuk Daftar Manuskrip ---
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // --- BARU: State untuk Formulir ---
  const [showForm, setShowForm] = useState(false); // Untuk menampilkan/menyembunyikan form
  const [formData, setFormData] = useState(initialFormState); // Untuk data isian form
  const [isSubmitting, setIsSubmitting] = useState(false); // Untuk status tombol submit

  // --- Fungsi untuk Mengambil Data ---
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

  // --- BARU: Logika Simpan Otomatis Formulir ---
  // Memuat data dari localStorage saat komponen pertama kali dimuat
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
        console.log('Progres formulir berhasil dimuat dari localStorage.');
      } catch (e) {
        console.error("Gagal memuat data formulir dari localStorage", e);
      }
    }
  }, []);

  // Menyimpan data ke localStorage setiap kali formData berubah
  useEffect(() => {
    // Hanya simpan jika form ditampilkan untuk menghindari penyimpanan state awal yang kosong
    if (showForm) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, showForm]);


  // --- Fungsi Handler ---
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
        // Refresh list tanpa mengubah loading utama
        fetchManuscripts(currentPage, searchTerm); 
      } catch (error) {
        console.error("Failed to delete manuscript:", error);
        setFeedbackMessage("Gagal menghapus manuskrip.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- BARU: Handler untuk Formulir ---
  const handleToggleForm = () => {
    setShowForm(!showForm); // Balikkan status tampil/sembunyi
    setFeedbackMessage(null); // Hapus pesan feedback saat form dibuka
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedbackMessage(null);
    try {
      const dataToSubmit = { ...formData, jumlahHalaman: Number(formData.jumlahHalaman) || 0 };
      await addManuscript(dataToSubmit);
      setFeedbackMessage("Manuskrip baru berhasil ditambahkan!");
      
      localStorage.removeItem(STORAGE_KEY); // Hapus progres dari localStorage
      setFormData(initialFormState); // Reset state form
      setShowForm(false); // Sembunyikan form
      fetchManuscripts(1, ""); // Kembali ke halaman 1 dan refresh daftar
      
    } catch (error: any) {
      setFeedbackMessage("Gagal menambahkan manuskrip: " + (error.message || "Silakan coba lagi."));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Kelola Manuskrip</h1>
        {/* DIUBAH: <Link> menjadi <button> untuk menampilkan form */}
        <button 
          onClick={handleToggleForm}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
        >
          {showForm ? 'Tutup Formulir' : 'Tambah Manuskrip Baru'}
        </button>
      </div>

      {/* --- BARU: Tampilkan formulir secara kondisional --- */}
      {showForm && (
        <div className="mb-8 p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Formulir Tambah Manuskrip</h2>
          <form onSubmit={handleSubmit}>
            {/* Contoh beberapa input, Anda bisa melengkapi sisanya */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <label htmlFor="judul" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
                    <input type="text" id="judul" name="judul" value={formData.judul} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" required />
                </div>
                <div className="mb-4">
                    <label htmlFor="pengarang" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pengarang</label>
                    <input type="text" id="pengarang" name="pengarang" value={formData.pengarang} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm" />
                </div>
            </div>
            {/* --- Tambahkan semua elemen formulir Anda yang lain di sini --- */}
            <div className="flex items-center justify-end space-x-4 mt-6">
                <button type="button" onClick={handleToggleForm} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400">{isSubmitting ? 'Menyimpan...' : 'Simpan Manuskrip'}</button>
            </div>
          </form>
        </div>
      )}

      {feedbackMessage && (
        <div className={`p-3 mb-4 rounded-md ${feedbackMessage.includes('berhasil') ? 'bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200' : 'bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-200'}`}>
          {feedbackMessage}
        </div>
      )}

      <div className="mb-4">
        <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Cari manuskrip..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-gray-100" />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {manuscripts.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400 py-4">{searchTerm ? "Tidak ada manuskrip yang cocok." : "Belum ada manuskrip."}</p>
          ) : (
            <div className="overflow-x-auto">
              {/* --- Tabel manuskrip Anda tetap di sini --- */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                {/* ... thead dan tbody tabel Anda ... */}
                <thead className="bg-gray-50 dark:bg-gray-700">
                    {/* ... a ... */}
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {manuscripts.map((manuscript) => (
                    <tr key={manuscript.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{manuscript.judul}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{manuscript.pengarang}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{manuscript.kodeInventarisasi}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button onClick={() => alert('Fungsi edit belum diimplementasikan')} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">Edit</button>
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
