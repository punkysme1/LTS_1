import { Manuscript } from '../types';
import { supabase } from './supabaseClient';

const ITEMS_PER_PAGE = 10;
const MANUSCRIPTS_TABLE = 'manuscripts'; // Define table name

export const getManuscripts = async (page: number = 1, searchQuery: string = ""): Promise<{ data: Manuscript[], totalPages: number, totalItems: number }> => {
  let query = supabase
    .from(MANUSCRIPTS_TABLE)
    .select('*', { count: 'exact' }); // Get total count for pagination

  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    // Menggunakan .or() untuk pencarian di beberapa kolom
    query = query.or(
      `judul.ilike.%${lowerCaseQuery}%,` +
      `pengarang.ilike.%${lowerCaseQuery}%,` +
      `kodeInventarisasi.ilike.%${lowerCaseQuery}%,` +
      `deskripsi.ilike.%${lowerCaseQuery}%`
    );
  }

  // MEMPERBAIKI INI: Menggunakan 'created_at' untuk mengurutkan, bukan 'tanggalDitambahkan'
  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

  if (error) {
    console.error("Error fetching manuscripts:", error);
    throw error;
  }
  
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  // Memastikan data sesuai dengan tipe Manuscript, terutama untuk kolom array
  const formattedData = data?.map(item => ({
      ...item,
      kategori: Array.isArray(item.kategori) ? item.kategori : (item.kategori ? String(item.kategori).split(',') : []),
      bahasa: Array.isArray(item.bahasa) ? item.bahasa : (item.bahasa ? String(item.bahasa).split(',') : []),
      aksara: Array.isArray(item.aksara) ? item.aksara : (item.aksara ? String(item.aksara).split(',') : []),
      imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : (item.imageUrls ? String(item.imageUrls).split(',') : []),
  })) || [];


  return { data: formattedData as Manuscript[], totalPages, totalItems };
};

export const getManuscriptById = async (id: string): Promise<Manuscript | undefined> => {
  const { data, error } = await supabase
    .from(MANUSCRIPTS_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined;
    console.error("Error fetching manuscript by ID:", error);
    throw error;
  }
  if (!data) return undefined;

  return {
    ...data,
    kategori: Array.isArray(data.kategori) ? data.kategori : [],
    bahasa: Array.isArray(data.bahasa) ? data.bahasa : [],
    aksara: Array.isArray(data.aksara) ? data.aksara : [],
    imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
  } as Manuscript;
};

// MEMPERBAIKI INI: Menghapus 'tanggalDitambahkan' dari tipe Omit
export const addManuscript = async (manuscript: Omit<Manuscript, 'id' | 'created_at' | 'updated_at'>): Promise<Manuscript> => {
  const manuscriptToInsert = {
    ...manuscript,
    // Kolom id, created_at, dan updated_at akan diisi secara otomatis oleh Supabase
  };

  const { data, error } = await supabase
    .from(MANUSCRIPTS_TABLE)
    .insert([manuscriptToInsert])
    .select()
    .single();

  if (error) {
    console.error("Error adding manuscript:", error);
    throw error;
  }
  if (!data) throw new Error("Failed to add manuscript, no data returned.");
  
  return {
    ...data,
    kategori: Array.isArray(data.kategori) ? data.kategori : [],
    bahasa: Array.isArray(data.bahasa) ? data.bahasa : [],
    aksara: Array.isArray(data.aksara) ? data.aksara : [],
    imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
  } as Manuscript;
};

// MEMPERBAIKI INI: Menghapus 'tanggalDitambahkan' dari tipe Omit
export const updateManuscript = async (id: string, updates: Partial<Omit<Manuscript, 'id' | 'created_at' | 'updated_at'>>): Promise<Manuscript | undefined> => {
  const { data, error } = await supabase
    .from(MANUSCRIPTS_TABLE)
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating manuscript:", error);
    throw error;
  }
  if (!data) return undefined;

  return {
    ...data,
    kategori: Array.isArray(data.kategori) ? data.kategori : [],
    bahasa: Array.isArray(data.bahasa) ? data.bahasa : [],
    aksara: Array.isArray(data.aksara) ? data.aksara : [],
    imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : [],
  } as Manuscript;
};

export const deleteManuscript = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from(MANUSCRIPTS_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting manuscript:", error);
    throw error;
  }
  return !error;
};
