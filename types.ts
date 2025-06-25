
export interface Manuscript {
  id: string;
  kodeInventarisasi: string;
  kodeDigital: string;
  judul: string;
  pengarang: string;
  penyalin?: string;
  tahunPenyalinan?: string;
  statusKetersediaan: 'Tersedia' | 'Dipinjam' | 'Restorasi';
  kelengkapan: 'Lengkap' | 'Tidak Lengkap';
  keterbacaan: 'Baik' | 'Cukup' | 'Kurang';
  kategori: string[];
  bahasa: string[];
  aksara: string[];
  jumlahHalaman: number;
  tinta: string;
  kondisiNaskah: string;
  deskripsi: string;
  kolofon?: string;
  catatan?: string;
  thumbnailUrl: string;
  imageUrls: string[]; // For direct image links in app's carousel
  googledrivefolderurl?: string; // For embedding Google Drive folder view
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  date: string;
  content: string; // HTML content or Markdown
  excerpt: string;
  comments: Comment[];
  thumbnailUrl?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  date: string;
  text: string;
  isApproved: boolean;
}

export interface GuestBookEntry {
  id: string;
  name: string;
  message: string;
  date: string;
  isApproved: boolean;
}

export interface NavItem {
  label: string;
  path: string;
  adminOnly?: boolean;
}

export type Theme = 'light' | 'dark';
