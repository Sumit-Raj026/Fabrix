import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vyyahylbqdvefuwaacav.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Create the Supabase client (only if credentials exist to avoid console crashes)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
