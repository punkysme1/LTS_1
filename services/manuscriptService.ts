import { Manuscript } from '../types';
import { supabase } from './supabaseClient';

const ITEMS_PER_PAGE = 10;
const MANUSCRIPTS_TABLE = 'manuscripts';

export const getManuscripts = async (page: number = 1, searchQuery: string = ""): Promise<{ data: Manuscript[], totalPages: number, totalItems: number }> => {
  let query = supabase
    .from(MANUSCRIPTS_TABLE)
    .select('*', { count: 'exact' });

  if (searchQuery) {
    const lowerCaseQuery = searchQuery.toLowerCase();
    query = query.or(
      `judul.ilike.%${lowerCaseQuery}%,` +
      `pengarang.ilike.%${lowerCaseQuery}%,` +
      `kodeInventarisasi.ilike.%${lowerCaseQuery}%,` +
      `deskripsi.ilike.%${lowerCaseQuery}%`
    );
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

  if (error) {
    console.error("Error fetching manuscripts:", error);
    throw error;
  }
  
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  const formattedData = data?.map(item => ({
      ...item,
      kategori: Array.isArray(item.kategori) ? item.kategori : (item.kategori ? String(item.kategori).split(',') : []),
      bahasa: Array.isArray(item.bahasa) ? item.bahasa : (item.bahasa ? String(item.bahasa).split(',') : []),
      aksara: Array.isArray(item.aksara) ? item.aksara : (item.aksara ? String(item.aksara).split(',') : []),
      imageUrls: Array.isArray(item.imageUrls) ? item.imageUrls : (item.imageUrls ? String(item.imageUrls).split(',') : []),
  })) || [];


  return { data: formattedData as Manuscript[], totalPages, totalItems };
};

// ======================================================================
// ==> BAGIAN YANG HILANG DITAMBAHKAN KEMBALI DI SINI <==
// ======================================================================
export const getManuscriptById = async (id: string): Promise<Manuscript | undefined> => {
  const { data, error } = await supabase
    .from(MANUSCRIPTS_TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return undefined; // Data tidak ditemukan
    console.error("Error fetching manuscript by ID:", error);
    throw error;
  }
  if (!data) return undefined;

  // Logika pemformatan yang konsisten untuk memastikan data array tidak hilang
  const formattedData = {
    ...data,
    kategori: Array.isArray(data.kategori) ? data.kategori : (data.kategori ? String(data.kategori).split(',') : []),
    bahasa: Array.isArray(data.bahasa) ? data.bahasa : (data.bahasa ? String(data.bahasa).split(',') : []),
    aksara: Array.isArray(data.aksara) ? data.aksara : (data.aksara ? String(data.aksara).split(',') : []),
    imageUrls: Array.isArray(data.imageUrls) ? data.imageUrls : (data.imageUrls ? String(data.imageUrls).split(',') : []),
  };

  return formattedData as Manuscript;
};

export const addManuscript = async (manuscript: Omit<Manuscript, 'id' | 'created_at' | 'updated_at'>): Promise<Manuscript> => {
  // Logika pembersihan data untuk mencegah error 'malformed array literal'
  const manuscriptToInsert = {
    ...manuscript,
    kategori: manuscript.kategori && manuscript.kategori.length > 0 ? manuscript.kategori : [],
    bahasa: manuscript.bahasa && manuscript.bahasa.length > 0 ? manuscript.bahasa : [],
    aksara: manuscript.aksara && manuscript.aksara.length > 0 ? manuscript.aksara : [],
    imageUrls: manuscript.imageUrls && manuscript.imageUrls.length > 0 ? manuscript.imageUrls : [],
  };

  const { data, error } = await supabase
    .from(MANUSCRIPTS_TABLE)
    .insert([manuscriptToInsert])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }
  if (!data) throw new Error("Failed to add manuscript, no data returned.");
  
  return data as Manuscript;
};

export const updateManuscript = async (id: string, updates: Partial<Omit<Manuscript, 'id' | 'created_at' | 'updated_at'>>): Promise<Manuscript | undefined> => {
  
  const updatesToSubmit = { ...updates };
  const arrayFields: (keyof typeof updates)[] = ['kategori', 'bahasa', 'aksara', 'imageUrls'];

  arrayFields.forEach(field => {
    if (updates[field] !== undefined) {
      const value = updates[field] as any;
      (updatesToSubmit as any)[field] = value && value.length > 0 ? value : [];
    }
  });

  const { data, error } = await supabase
    .from(MANUSCRIPTS_TABLE)
    .update(updatesToSubmit)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error("Error updating manuscript:", error);
    throw error;
  }
  if (!data) return undefined;

  return data as Manuscript;
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
