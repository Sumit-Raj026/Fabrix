import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyyahylbqdvefuwaacav.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data, error } = await supabase.from('categories').select('*');
  console.log('Categories:', data);
  console.log('Error:', error);
}

test();
