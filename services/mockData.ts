
import { Manuscript, BlogPost, Comment, GuestBookEntry } from '../types';

const generatePlaceholderImages = (seed: string, count: number): string[] => {
  return Array.from({ length: count }, (_, i) => `https://picsum.photos/seed/${seed}-${i}/800/1200`);
};

export const MOCK_MANUSCRIPTS: Manuscript[] = Array.from({ length: 55 }, (_, i) => ({
  id: `manuskrip-${i + 1}`,
  kodeInventarisasi: `TPPKPQ-MS-${String(i + 1).padStart(3, '0')}`,
  kodeDigital: `DIGI-MS-${String(i + 1).padStart(3, '0')}`,
  judul: `Kitab Al-Hikam ${i + 1}`,
  pengarang: `Syaikh Ibn 'Athaillah As-Sakandari`,
  penyalin: `Ahmad bin Muhammad`,
  tahunPenyalinan: `${1850 + i}`,
  statusKetersediaan: (i % 3 === 0) ? 'Tersedia' : (i % 3 === 1 ? 'Dipinjam' : 'Restorasi'),
  kelengkapan: (i % 2 === 0) ? 'Lengkap' : 'Tidak Lengkap',
  keterbacaan: (i % 3 === 0) ? 'Baik' : (i % 3 === 1 ? 'Cukup' : 'Kurang'),
  kategori: ['Tasawuf', 'Fiqh'],
  bahasa: ['Arab', 'Jawa Pegon'],
  aksara: ['Arab', 'Pegon'],
  jumlahHalaman: 150 + i * 5,
  tinta: 'Hitam dan Merah',
  kondisiNaskah: 'Baik, beberapa halaman ada bercak air.',
  deskripsi: `Ini adalah deskripsi panjang untuk Kitab Al-Hikam ${i + 1}. Manuskrip ini berisi kumpulan kata-kata hikmah dari Syaikh Ibn 'Athaillah As-Sakandari. Sangat berharga dan mengandung banyak pelajaran. Naskah ini ditulis dengan tinta hitam untuk teks utama dan tinta merah untuk penandaan atau judul bab. Kertas yang digunakan adalah kertas Eropa dengan watermark.`,
  kolofon: `Selesai disalin pada hari Selasa, bulan Rabiul Awal tahun ${1270 + i} Hijriah.`,
  catatan: 'Perlu digitalisasi ulang untuk kualitas lebih baik.',
  thumbnailUrl: `https://picsum.photos/seed/mthumb${i+1}/400/300`,
  imageUrls: (i % 5 === 0) ? generatePlaceholderImages(`manuscript-selected-${i+1}`, 3) : [], // Only some have direct image URLs
  googleDriveFolderUrl: (i % 3 === 0) ? `https://drive.google.com/drive/folders/1sIbPlKjzLqxqupRfDTonZG8Zs5xIpJxo?usp=drive_link` : undefined, // Example folder link for some manuscripts
  tanggalDitambahkan: new Date(2023, 0, 1 + i).toISOString(),
}));

const MOCK_COMMENTS: Comment[] = [
    { id: 'c1', postId: 'blog-1', author: 'Pembaca Setia', date: '2024-07-20T10:00:00Z', text: 'Artikel yang sangat mencerahkan!', isApproved: true },
    { id: 'c2', postId: 'blog-1', author: 'Peneliti Naskah', date: '2024-07-21T11:30:00Z', text: 'Terima kasih atas informasinya. Apakah ada referensi lebih lanjut?', isApproved: true },
    { id: 'c3', postId: 'blog-2', author: 'Mahasiswa Sejarah', date: '2024-07-22T09:15:00Z', text: 'Sangat membantu untuk penelitian saya.', isApproved: false },
];

export const MOCK_BLOG_POSTS: BlogPost[] = Array.from({length: 12}, (_, i) => ({
  id: `blog-${i + 1}`,
  title: `Mengungkap Misteri Manuskrip Kuno ${i + 1}`,
  author: 'Tim Pustakawan TPPKPQ',
  date: new Date(2024, 6, 15 + i).toISOString(),
  excerpt: `Sebuah perjalanan mendalam ke dalam salah satu koleksi manuskrip berharga kami, manuskrip ${i+1}. Temukan sejarah, konten, dan signifikansinya...`,
  content: `<p>Ini adalah isi lengkap dari artikel blog "Mengungkap Misteri Manuskrip Kuno ${i+1}".</p><p>Paragraf kedua yang menjelaskan lebih detail tentang topik yang dibahas. Manuskrip ini memiliki keunikan tersendiri yang akan kami bahas lebih lanjut. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p><img src="https://picsum.photos/seed/blogimg${i+1}/600/400" alt="Blog Image ${i+1}" class="my-4 rounded-md shadow-md mx-auto" /><p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
  comments: MOCK_COMMENTS.filter(c => c.postId === `blog-${i + 1}`),
  thumbnailUrl: `https://picsum.photos/seed/bthumb${i+1}/400/250`,
}));

export const MOCK_GUEST_BOOK_ENTRIES: GuestBookEntry[] = Array.from({length: 25}, (_, i) => ({
  id: `gb-${i + 1}`,
  name: `Pengunjung ${i + 1}`,
  message: `Sangat terkesan dengan koleksi digital perpustakaan ini. Semoga terus berkembang! Ini adalah kunjungan saya yang ke-${i+1}.`,
  date: new Date(2024, 0, 1 + i).toISOString(),
  isApproved: i % 2 === 0, // Alternating approved status
}));