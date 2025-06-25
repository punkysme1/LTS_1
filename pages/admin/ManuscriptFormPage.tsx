
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Manuscript } from '../../types';
import { getManuscriptById, addManuscript, updateManuscript } from '../../services/manuscriptService';
import LoadingSpinner from '../../components/LoadingSpinner';

// Helper for multi-string inputs
const StringArrayInput: React.FC<{ label: string; id: string; value: string[]; onChange: (value: string[]) => void; placeholder?: string }> = 
  ({ label, id, value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState(value.join(', '));
  
  useEffect(() => {
    setInputValue(value.join(', '));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const str = e.target.value;
    setInputValue(str);
    onChange(str.split(',').map(s => s.trim()).filter(s => s));
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <input
        type="text"
        id={id}
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder || "Pisahkan dengan koma"}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700 dark:text-gray-100"
      />
    </div>
  );
};


const ManuscriptFormPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const initialFormState: Omit<Manuscript, 'id' | 'tanggalDitambahkan'> = {
    kodeInventarisasi: '', kodeDigital: '', judul: '', pengarang: '', penyalin: '', tahunPenyalinan: '',
    statusKetersediaan: 'Tersedia', kelengkapan: 'Lengkap', keterbacaan: 'Baik',
    kategori: [], bahasa: [], aksara: [], jumlahHalaman: 0, tinta: '', kondisiNaskah: '',
    deskripsi: '', kolofon: '', catatan: '', thumbnailUrl: '', imageUrls: [], googleDriveFolderUrl: '',
  };

  const [manuscript, setManuscript] = useState<Omit<Manuscript, 'id' | 'tanggalDitambahkan' | 'imageUrls'> & { imageUrlsString: string }>(
    { ...initialFormState, imageUrlsString: '' } 
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchManuscript = useCallback(async (manuscriptId: string) => {
    setIsLoading(true);
    try {
      const data = await getManuscriptById(manuscriptId);
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _id, tanggalDitambahkan: _td, imageUrls, ...restData } = data;
        setManuscript({ ...restData, googleDriveFolderUrl: data.googleDriveFolderUrl || '', imageUrlsString: imageUrls.join(', ') });
      } else {
        setError('Manuskrip tidak ditemukan.');
      }
    } catch (err) {
      setError('Gagal memuat data manuskrip.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      fetchManuscript(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
        setManuscript(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    } else {
        setManuscript(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleStringArrayChange = (name: keyof Pick<Manuscript, 'kategori' | 'bahasa' | 'aksara'>, values: string[]) => {
     setManuscript(prev => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const { imageUrlsString, ...restOfManuscriptState } = manuscript;

    const manuscriptDataToSave: Omit<Manuscript, 'id' | 'tanggalDitambahkan'> = {
        ...restOfManuscriptState,
        imageUrls: imageUrlsString.split(',').map(s => s.trim()).filter(s => s),
        googleDriveFolderUrl: manuscript.googleDriveFolderUrl || undefined, // Ensure it's undefined if empty
    };
    
    try {
      if (isEditing && id) {
        await updateManuscript(id, manuscriptDataToSave);
      } else {
        await addManuscript(manuscriptDataToSave);
      }
      navigate('/admin/manuscripts');
    } catch (err) {
      setError(isEditing ? 'Gagal memperbarui manuskrip.' : 'Gagal menambah manuskrip.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !manuscript.judul) return <LoadingSpinner />;
  if (error && !isEditing) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">
        {isEditing ? 'Edit Manuskrip' : 'Tambah Manuskrip Baru'}
      </h1>
      {error && <p className="mb-4 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900 p-3 rounded-md">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Judul</label>
            <input type="text" name="judul" id="judul" value={manuscript.judul} onChange={handleChange} required className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="pengarang" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pengarang</label>
            <input type="text" name="pengarang" id="pengarang" value={manuscript.pengarang} onChange={handleChange} required className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="kodeInventarisasi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode Inventarisasi</label>
            <input type="text" name="kodeInventarisasi" id="kodeInventarisasi" value={manuscript.kodeInventarisasi} onChange={handleChange} required className="mt-1 block w-full input-style" />
          </div>
           <div>
            <label htmlFor="kodeDigital" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode Digital</label>
            <input type="text" name="kodeDigital" id="kodeDigital" value={manuscript.kodeDigital} onChange={handleChange} className="mt-1 block w-full input-style" />
          </div>
           <div>
            <label htmlFor="penyalin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Penyalin</label>
            <input type="text" name="penyalin" id="penyalin" value={manuscript.penyalin} onChange={handleChange} className="mt-1 block w-full input-style" />
          </div>
          <div>
            <label htmlFor="tahunPenyalinan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tahun Penyalinan</label>
            <input type="text" name="tahunPenyalinan" id="tahunPenyalinan" value={manuscript.tahunPenyalinan} onChange={handleChange} className="mt-1 block w-full input-style" />
          </div>
        </div>

        {/* Status and Details */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <label htmlFor="statusKetersediaan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status Ketersediaan</label>
                <select name="statusKetersediaan" id="statusKetersediaan" value={manuscript.statusKetersediaan} onChange={handleChange} className="mt-1 block w-full input-style">
                    <option value="Tersedia">Tersedia</option>
                    <option value="Dipinjam">Dipinjam</option>
                    <option value="Restorasi">Restorasi</option>
                </select>
            </div>
            <div>
                <label htmlFor="kelengkapan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kelengkapan</label>
                <select name="kelengkapan" id="kelengkapan" value={manuscript.kelengkapan} onChange={handleChange} className="mt-1 block w-full input-style">
                    <option value="Lengkap">Lengkap</option>
                    <option value="Tidak Lengkap">Tidak Lengkap</option>
                </select>
            </div>
            <div>
                <label htmlFor="keterbacaan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keterbacaan</label>
                <select name="keterbacaan" id="keterbacaan" value={manuscript.keterbacaan} onChange={handleChange} className="mt-1 block w-full input-style">
                    <option value="Baik">Baik</option>
                    <option value="Cukup">Cukup</option>
                    <option value="Kurang">Kurang</option>
                </select>
            </div>
        </div>

        {/* Array Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StringArrayInput label="Kategori" id="kategori" value={manuscript.kategori} onChange={(v) => handleStringArrayChange('kategori', v)} />
          <StringArrayInput label="Bahasa" id="bahasa" value={manuscript.bahasa} onChange={(v) => handleStringArrayChange('bahasa', v)} />
          <StringArrayInput label="Aksara" id="aksara" value={manuscript.aksara} onChange={(v) => handleStringArrayChange('aksara', v)} />
        </div>
        
        {/* More Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="jumlahHalaman" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah Halaman</label>
                <input type="number" name="jumlahHalaman" id="jumlahHalaman" value={manuscript.jumlahHalaman} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
                <label htmlFor="tinta" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tinta</label>
                <input type="text" name="tinta" id="tinta" value={manuscript.tinta} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
        </div>

        <div>
          <label htmlFor="kondisiNaskah" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kondisi Naskah</label>
          <textarea name="kondisiNaskah" id="kondisiNaskah" value={manuscript.kondisiNaskah} onChange={handleChange} rows={3} className="mt-1 block w-full input-style" />
        </div>
        <div>
          <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deskripsi</label>
          <textarea name="deskripsi" id="deskripsi" value={manuscript.deskripsi} onChange={handleChange} rows={5} required className="mt-1 block w-full input-style" />
        </div>
        <div>
          <label htmlFor="kolofon" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kolofon</label>
          <textarea name="kolofon" id="kolofon" value={manuscript.kolofon} onChange={handleChange} rows={3} className="mt-1 block w-full input-style" />
        </div>
        <div>
          <label htmlFor="catatan" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Catatan</label>
          <textarea name="catatan" id="catatan" value={manuscript.catatan} onChange={handleChange} rows={3} className="mt-1 block w-full input-style" />
        </div>

        {/* Image and Drive URLs */}
        <div>
            <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Thumbnail</label>
            <input type="url" name="thumbnailUrl" id="thumbnailUrl" value={manuscript.thumbnailUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full input-style" />
        </div>
        <div>
            <label htmlFor="imageUrlsString" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Gambar Pratinjau Pilihan (pisahkan dengan koma)</label>
            <textarea name="imageUrlsString" id="imageUrlsString" value={manuscript.imageUrlsString} onChange={handleChange} rows={3} placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" className="mt-1 block w-full input-style" />
        </div>
         <div>
            <label htmlFor="googleDriveFolderUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300">URL Folder Google Drive (untuk pratinjau isi buku)</label>
            <input type="url" name="googleDriveFolderUrl" id="googleDriveFolderUrl" value={manuscript.googleDriveFolderUrl || ''} onChange={handleChange} placeholder="https://drive.google.com/drive/folders/YOUR_FOLDER_ID" className="mt-1 block w-full input-style" />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Pastikan folder di Google Drive sudah di-set "Anyone with the link can view".</p>
        </div>


        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
          <Link to="/admin/manuscripts" className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
            Batal
          </Link>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50">
            {isLoading ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Manuskrip')}
          </button>
        </div>
      </form>
      <style>{`
        .input-style {
          border-radius: 0.375rem; /* rounded-md */
          border-width: 1px;
          border-color: #D1D5DB; /* border-gray-300 */
          padding: 0.5rem 0.75rem; /* px-3 py-2 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
        }
        .dark .input-style {
          background-color: #374151; /* dark:bg-gray-700 */
          border-color: #4B5563; /* dark:border-gray-600 */
          color: #F3F4F6; /* dark:text-gray-100 */
        }
        .input-style:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          --tw-ring-color: #3B82F6; /* focus:ring-primary-500 */
          border-color: #3B82F6; /* focus:border-primary-500 */
          box-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        }
      `}</style>
    </div>
  );
};

export default ManuscriptFormPage;