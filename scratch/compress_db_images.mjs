import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

// Parse .env manually
let supabaseUrl = 'https://vyyahylbqdvefuwaacav.supabase.co';
let supabaseAnonKey = 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';

try {
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key === 'VITE_SUPABASE_URL' || key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
        if (key === 'VITE_SUPABASE_ANON_KEY' || key === 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY') supabaseAnonKey = val;
      }
    });
  }
} catch (e) {}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const MAX_PX = 600;
const QUALITY = 0.7;

async function compressBase64(base64String) {
  try {
    const img = await loadImage(base64String);
    let { width, height } = img;

    if (width > MAX_PX || height > MAX_PX) {
      if (width > height) {
        height = Math.round(height * MAX_PX / width);
        width = MAX_PX;
      } else {
        width = Math.round(width * MAX_PX / height);
        height = MAX_PX;
      }
    }

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL('image/jpeg', QUALITY);
  } catch (err) {
    console.warn('  Could not compress image, skipping:', err.message);
    return null;
  }
}

async function run() {
  console.log('Fetching products from Supabase...');
  const { data: products, error } = await supabase.from('products').select('*');
  if (error) { console.error('DB Error:', error); process.exit(1); }

  console.log(`Found ${products.length} products.\n`);

  for (const product of products) {
    const images = product.images || [];
    const totalSizeKB = Math.round(JSON.stringify(images).length / 1024);
    console.log(`Processing: ${product.title} (${product.id}) — Images: ${images.length}, Size: ${totalSizeKB} KB`);

    if (totalSizeKB < 300) {
      console.log('  → Already small enough, skipping.\n');
      continue;
    }

    const compressedImages = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const imgKB = Math.round(img.length / 1024);
      process.stdout.write(`  Image ${i + 1}: ${imgKB} KB → `);

      if (img.startsWith('data:') && imgKB > 80) {
        const compressed = await compressBase64(img);
        if (compressed) {
          const newKB = Math.round(compressed.length / 1024);
          process.stdout.write(`${newKB} KB ✓\n`);
          compressedImages.push(compressed);
        } else {
          process.stdout.write(`skipped\n`);
          compressedImages.push(img);
        }
      } else {
        process.stdout.write(`ok (kept)\n`);
        compressedImages.push(img);
      }
    }

    const newSizeKB = Math.round(JSON.stringify(compressedImages).length / 1024);
    console.log(`  Saving back: ${totalSizeKB} KB → ${newSizeKB} KB`);

    const { error: updateError } = await supabase
      .from('products')
      .update({ images: compressedImages })
      .eq('id', product.id);

    if (updateError) {
      console.error(`  ✗ Failed to update ${product.id}:`, updateError.message);
    } else {
      console.log(`  ✓ Updated successfully!\n`);
    }
  }

  console.log('\n✅ All done! Database images have been recompressed.');
}

run();
