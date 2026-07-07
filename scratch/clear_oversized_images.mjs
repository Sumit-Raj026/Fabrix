import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://vyyahylbqdvefuwaacav.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tiny 1x1 transparent pixel placeholder - safe to render instantly
const PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

// Threshold - images larger than this in KB will be replaced with placeholder
const MAX_IMAGE_KB = 150;

async function run() {
  console.log('🔍 Fetching all products from Supabase...\n');
  const { data: products, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error('❌ DB Error:', error);
    process.exit(1);
  }

  console.log(`Found ${products.length} products.\n`);
  let fixedCount = 0;

  for (const product of products) {
    const images = Array.isArray(product.images) ? product.images : [];
    const totalKB = Math.round(JSON.stringify(images).length / 1024);
    
    console.log(`📦 ${product.title} (${product.id}) — ${images.length} image(s), ${totalKB} KB total`);

    // Check if any individual image is oversized
    const hasOversized = images.some(img => img && img.length > MAX_IMAGE_KB * 1024);
    
    if (!hasOversized) {
      console.log('   ✅ OK - images are small enough\n');
      continue;
    }

    // Replace oversized images with placeholder
    const cleanedImages = images.map((img, i) => {
      const sizeKB = Math.round((img || '').length / 1024);
      if (sizeKB > MAX_IMAGE_KB) {
        console.log(`   🗜️  Image ${i+1}: ${sizeKB} KB → replaced with placeholder`);
        return PLACEHOLDER;
      }
      console.log(`   ✓  Image ${i+1}: ${sizeKB} KB → kept`);
      return img;
    });

    // Write back to database
    const { error: updateErr } = await supabase
      .from('products')
      .update({ images: cleanedImages })
      .eq('id', product.id);

    if (updateErr) {
      console.error(`   ❌ Failed to update ${product.id}:`, updateErr.message);
    } else {
      console.log(`   💾 Saved! Images cleared for ${product.title}`);
      fixedCount++;
    }
    console.log('');
  }

  console.log(`\n✅ Done! Fixed ${fixedCount} product(s) with oversized images.`);
  console.log('👉 Please re-upload images from Admin Panel — they will be auto-compressed.');
}

run();
