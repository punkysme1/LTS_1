
import { GuestBookEntry } from '../types';
import { supabase } from './supabaseClient';

const GUESTBOOK_TABLE = 'guestbook_entries';
const ITEMS_PER_PAGE = 10;

export const getGuestBookEntries = async (page: number = 1, showApprovedOnly: boolean = true): Promise<{ data: GuestBookEntry[], totalPages: number, totalItems: number }> => {
  let query = supabase
    .from(GUESTBOOK_TABLE)
    .select('*', { count: 'exact' });

  if (showApprovedOnly) {
    query = query.eq('isApproved', true);
  }

  query = query.order('date', { ascending: false }); // Or 'created_at'

  const { data, error, count } = await query
    .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

  if (error) {
    console.error("Error fetching guest book entries:", error);
    throw error;
  }
  
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  
  return { data: (data as GuestBookEntry[]) || [], totalPages, totalItems };
};

export const addGuestBookEntry = async (entry: Omit<GuestBookEntry, 'id' | 'date' | 'isApproved'>): Promise<GuestBookEntry> => {
  const entryData = {
    ...entry,
    isApproved: false, // Entries need approval by default
  };
  const { data, error } = await supabase
    .from(GUESTBOOK_TABLE)
    .insert([entryData])
    .select()
    .single();

  if (error) {
    console.error("Error adding guest book entry:", error);
    throw error;
  }
  if (!data) throw new Error("Failed to add guest book entry, no data returned.");
  return data as GuestBookEntry;
};

export const approveGuestBookEntry = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from(GUESTBOOK_TABLE)
    .update({ isApproved: true })
    .eq('id', id);

  if (error) {
    console.error("Error approving guest book entry:", error);
    throw error;
  }
  return !error;
};

// rejectGuestBookEntry is essentially delete for this implementation
export const rejectGuestBookEntry = async (id: string): Promise<boolean> => {
  return deleteGuestBookEntry(id);
};

export const deleteGuestBookEntry = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from(GUESTBOOK_TABLE)
    .delete()
    .eq('id', id);

  if (error) {
    console.error("Error deleting guest book entry:", error);
    throw error;
  }
  return !error;
};
