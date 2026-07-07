import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
let supabaseUrl = '';
let supabaseAnonKey = '';

try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key === 'VITE_SUPABASE_URL' || key === 'NEXT_PUBLIC_SUPABASE_URL') {
          supabaseUrl = val;
        }
        if (key === 'VITE_SUPABASE_ANON_KEY' || key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') {
          supabaseAnonKey = val;
        }
      }
    });
  }
} catch (e) {
  console.error('Error loading .env manually:', e);
}

// Fallback to hardcoded keys from supabase.js if .env is missing
if (!supabaseUrl) {
  supabaseUrl = 'https://vyyahylbqdvefuwaacav.supabase.co';
}
if (!supabaseAnonKey) {
  supabaseAnonKey = 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';
}

console.log('Connecting to Supabase:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      throw error;
    }

    console.log(`Found ${data.length} products in the database:\n`);
    
    data.forEach((p, idx) => {
      const imagesJson = JSON.stringify(p.images || []);
      const sizeKB = Math.round(imagesJson.length / 1024);
      console.log(`[Product #${idx + 1}]`);
      console.log(`- ID: ${p.id}`);
      console.log(`- Title: ${p.title}`);
      console.log(`- Category: ${p.category}`);
      console.log(`- Price: ${p.price}`);
      console.log(`- Original Price (MRP): ${p.original_price}`);
      console.log(`- Images Size: ${sizeKB} KB (${p.images?.length || 0} image(s))`);
      if (p.images && p.images.length > 0) {
        p.images.forEach((img, i) => {
          console.log(`  * Image ${i + 1} characters: ${img.slice(0, 50)}... [Total Length: ${img.length}]`);
        });
      }
      console.log('----------------------------------------------------');
    });

  } catch (err) {
    console.error('Error querying database:', err);
  }
}

checkDatabase();
