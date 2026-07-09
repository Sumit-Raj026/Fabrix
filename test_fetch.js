import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vyyahylbqdvefuwaacav.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Fetching products...");
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('display_order', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error("Fetch error:", error);
  } else {
    console.log("Fetch success! Count:", data.length);
  }
}

test();
