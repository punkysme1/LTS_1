
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Manuscript } from '../../types';
import { addManuscript } from '../../services/manuscriptService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DownloadIcon, UploadIcon } from '../../constants';

// Declare XLSX, it's loaded from CDN
declare var XLSX: any;

type ManuscriptImportData = Omit<Manuscript, 'id' | 'tanggalDitambahkan'>;

interface UploadResult {
  rowNumber: number;
  originalData: Record<string, any>;
  status: 'success' | 'error' | 'skipped';
  message: string;
  manuscriptId?: string;
}

const MassUploadManuscriptsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  const [overallError, setOverallError] = useState<string | null>(null);
  const [overallSuccess, setOverallSuccess] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setResults([]);
      setOverallError(null);
      setOverallSuccess(null);
    }
  };

  const transformRowToManuscript = (row: Record<string, any>): ManuscriptImportData | { error: string } => {
    const requiredFields: (keyof ManuscriptImportData)[] = ['kodeInventarisasi', 'judul', 'pengarang', 'deskripsi', 'statusKetersediaan', 'kelengkapan', 'keterbacaan', 'jumlahHalaman'];
    for (const field of requiredFields) {
      const fieldValue = row[field as string];
      if (fieldValue === undefined || fieldValue === null || String(fieldValue).trim() === '') {
        if (field === 'jumlahHalaman' && (fieldValue === 0 || fieldValue === '0')) {
          // Allow 0 for jumlahHalaman
        } else {
          return { error: `Kolom wajib '${field}' kosong atau tidak valid.` };
        }
      }
      if (field === 'jumlahHalaman' && isNaN(parseInt(String(fieldValue), 10))) {
        return { error: `Kolom 'jumlahHalaman' harus berupa angka.` };
      }
    }
    
    const jumlahHalaman = parseInt(String(row.jumlahHalaman), 10);
    if (isNaN(jumlahHalaman)) {
      return { error: "Jumlah halaman tidak valid." };
    }

    const statusKetersediaan = String(row.statusKetersediaan) as Manuscript['statusKetersediaan'];
    const kelengkapan = String(row.kelengkapan) as Manuscript['kelengkapan'];
    const keterbacaan = String(row.keterbacaan) as Manuscript['keterbacaan'];

    if (!['Tersedia', 'Dipinjam', 'Restorasi'].includes(statusKetersediaan)) return {error: `Nilai statusKetersediaan tidak valid: ${statusKetersediaan}`};
    if (!['Lengkap', 'Tidak Lengkap'].includes(kelengkapan)) return {error: `Nilai kelengkapan tidak valid: ${kelengkapan}`};
    if (!['Baik', 'Cukup', 'Kurang'].includes(keterbacaan)) return {error: `Nilai keterbacaan tidak valid: ${keterbacaan}`};

    const parseMultiValueString = (value: any): string[] => {
        if (typeof value === 'string' && value.trim() !== '') {
            return value.split(';').map(s => s.trim()).filter(s => s);
        }
        return [];
    };

    return {
      kodeInventarisasi: String(row.kodeInventarisasi || ''),
      kodeDigital: String(row.kodeDigital || '') || undefined,
      judul: String(row.judul || ''),
      pengarang: String(row.pengarang || ''),
      penyalin: String(row.penyalin || '') || undefined,
      tahunPenyalinan: String(row.tahunPenyalinan || '') || undefined,
      statusKetersediaan,
      kelengkapan,
      keterbacaan,
      kategori: parseMultiValueString(row.kategori),
      bahasa: parseMultiValueString(row.bahasa),
      aksara: parseMultiValueString(row.aksara),
      jumlahHalaman: jumlahHalaman,
      tinta: String(row.tinta || '') || undefined,
      kondisiNaskah: String(row.kondisiNaskah || ''),
      deskripsi: String(row.deskripsi || ''),
      kolofon: String(row.kolofon || '') || undefined,
      catatan: String(row.catatan || '') || undefined,
      thumbnailUrl: String(row.thumbnailUrl || '') || '',
      imageUrls: parseMultiValueString(row.imageUrls),
      googleDriveFolderUrl: String(row.googleDriveFolderUrl || '') || undefined,
    };
  };


  const handleUpload = async () => {
    if (!file) {
      setOverallError("Silakan pilih file XLS terlebih dahulu.");
      return;
    }

    setIsProcessing(true);
    setResults([]);
    setOverallError(null);
    setOverallSuccess(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result;
      let newResults: UploadResult[] = [];
      let successCount = 0;
      let errorCount = 0;

      if (!arrayBuffer) {
        setOverallError("Gagal membaca file.");
        setIsProcessing(false);
        return;
      }

      try {
        const workbook = XLSX.read(arrayBuffer, { type: 'array', cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        if (!firstSheetName) {
            throw new Error("File Excel tidak memiliki sheet yang dapat dibaca.");
        }
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false, defval: "" });

        if (jsonData.length === 0) {
            setOverallError("Tidak ada data yang ditemukan di sheet pertama file Excel.");
            setIsProcessing(false);
            return;
        }
        
        const headers = Object.keys(jsonData[0] as Record<string, any>);
        const expectedHeaders = ['kodeInventarisasi', 'judul', 'pengarang', 'deskripsi', 'statusKetersediaan', 'kelengkapan', 'keterbacaan', 'jumlahHalaman'];
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        if (missingHeaders.length > 0) {
            setOverallError(`Header Excel tidak lengkap. Header yang diharapkan ada (minimal): ${missingHeaders.join(', ')}.`);
            setIsProcessing(false);
            return;
        }

        for (let i = 0; i < jsonData.length; i++) {
          const rowData = jsonData[i] as Record<string, any>;
          const rowNumber = i + 2; 
          
          const manuscriptData = transformRowToManuscript(rowData);

          if ('error' in manuscriptData) {
            newResults.push({ rowNumber, originalData: rowData, status: 'error', message: manuscriptData.error });
            errorCount++;
          } else {
            try {
              const added = await addManuscript(manuscriptData);
              newResults.push({ rowNumber, originalData: rowData, status: 'success', message: 'Berhasil diimpor.', manuscriptId: added.id });
              successCount++;
            } catch (apiError: any) {
              newResults.push({ rowNumber, originalData: rowData, status: 'error', message: `Gagal impor: ${apiError.message || 'Kesalahan server'}` });
              errorCount++;
            }
          }
          setResults([...newResults]);
        }

        if (successCount > 0) {
          setOverallSuccess(`${successCount} manuskrip berhasil diimpor.`);
        }
        if (errorCount > 0) {
          setOverallError(`${errorCount} manuskrip gagal diimpor. Lihat detail di bawah.`);
        }
        if (successCount === 0 && errorCount === 0 && jsonData.length > 0) {
          setOverallError("Tidak ada data valid untuk diimpor dalam file, atau semua baris error.");
        }

      } catch (parseError: any) {
        setOverallError(`Gagal memproses file XLS: ${parseError.message}`);
      } finally {
        setIsProcessing(false);
      }
    };

    reader.onerror = () => {
      setOverallError("Gagal membaca file.");
      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Unggah Massal Manuskrip (XLS)</h1>
        <a 
          href="/manuscript_template.xls" 
          download="manuscript_template.xls"
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          aria-label="Unduh template XLS"
        >
          <DownloadIcon className="w-5 h-5 mr-2" />
          Unduh Template XLS
        </a>
      </div>

      <div className="mb-6 p-4 border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-gray-700 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Petunjuk Penggunaan:</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>Unduh template XLS yang disediakan.</li>
          <li>Isi data manuskrip sesuai dengan kolom pada template. Pastikan header sesuai dengan template.</li>
          <li>Kolom yang **wajib** diisi: <code>kodeInventarisasi</code>, <code>judul</code>, <code>pengarang</code>, <code>deskripsi</code>, <code>statusKetersediaan</code>, <code>kelengkapan</code>, <code>keterbacaan</code>, <code>jumlahHalaman</code>.</li>
          <li>Kolom <code>statusKetersediaan</code> harus salah satu dari: <code>Tersedia</code>, <code>Dipinjam</code>, <code>Restorasi</code>.</li>
          <li>Kolom <code>kelengkapan</code> harus salah satu dari: <code>Lengkap</code>, <code>Tidak Lengkap</code>.</li>
          <li>Kolom <code>keterbacaan</code> harus salah satu dari: <code>Baik</code>, <code>Cukup</code>, <code>Kurang</code>.</li>
          <li>Kolom <code>jumlahHalaman</code> harus berupa angka.</li>
          <li>Untuk kolom yang menerima banyak nilai (<code>kategori</code>, <code>bahasa</code>, <code>aksara</code>, <code>imageUrls</code>), masukkan semua nilai dalam **satu sel Excel**, pisahkan setiap nilai dengan tanda titik koma (<code>;</code>). Contoh: <code>Tasawuf;Fiqh</code>.</li>
          <li>Kolom <code>googleDriveFolderUrl</code> diisi dengan URL folder Google Drive yang ingin disematkan (pastikan folder publik atau "Anyone with link can view").</li>
          <li>Simpan file sebagai format Excel (<code>.xls</code> atau <code>.xlsx</code>).</li>
          <li>Pilih file dan klik "Unggah & Proses".</li>
        </ul>
      </div>

      {overallError && <p className="mb-4 p-3 bg-red-100 dark:bg-red-700 text-red-700 dark:text-red-200 rounded-md">{overallError}</p>}
      {overallSuccess && <p className="mb-4 p-3 bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200 rounded-md">{overallSuccess}</p>}

      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-grow">
          <label htmlFor="xlsFile" className="sr-only">Pilih file XLS/XLSX</label>
          <input 
            type="file" 
            id="xlsFile"
            accept=".xls,.xlsx" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 dark:file:bg-primary-700 file:text-primary-700 dark:file:text-primary-100 hover:file:bg-primary-100 dark:hover:file:bg-primary-600"
          />
        </div>
        <button 
          onClick={handleUpload} 
          disabled={!file || isProcessing}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 transition-colors"
          aria-label="Unggah dan proses file XLS/XLSX"
        >
          <UploadIcon className="w-5 h-5 mr-2" />
          {isProcessing ? 'Memproses...' : 'Unggah & Proses'}
        </button>
      </div>

      {isProcessing && <LoadingSpinner />}

      {results.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Hasil Impor:</h2>
          <div className="overflow-x-auto max-h-[500px] border border-gray-200 dark:border-gray-700 rounded-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Baris (Excel)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Judul (Data Asli)</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Pesan</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result, index) => (
                  <tr key={index} className={
                    result.status === 'success' ? 'bg-green-50 dark:bg-green-900/30' : 
                    result.status === 'error' ? 'bg-red-50 dark:bg-red-900/30' : ''
                  }>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{result.rowNumber}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate" title={String(result.originalData.judul)}>{result.originalData.judul || '-'}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        result.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' :
                        result.status === 'error' ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' :
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                      }`}>
                        {result.status === 'success' ? 'Sukses' : result.status === 'error' ? 'Gagal' : 'Dilewati'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        {result.message}
                        {result.status === 'success' && result.manuscriptId && (
                            <Link to={`/admin/manuscripts/edit/${result.manuscriptId}`} className="ml-2 text-primary-600 hover:underline text-xs">(Edit)</Link>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
       <div className="mt-8">
            <Link to="/admin/manuscripts" className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200">
                &larr; Kembali ke Kelola Manuskrip
            </Link>
        </div>
    </div>
  );
};

export default MassUploadManuscriptsPage;