import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Use Vercel environment variables or fallbacks
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vyyahylbqdvefuwaacav.supabase.co';
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';

  if (!supabaseUrl || !supabaseKey) {
    return res.status(500).send('Database connection variables missing');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Fetch all products to list in the sitemap
    const { data: products, error } = await supabase
      .from('products')
      .select('id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const baseUrl = 'https://hellofabrix.com';
    const today = new Date().toISOString().split('T')[0];

    // Core static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/story', priority: '0.8', changefreq: 'monthly' },
      { url: '/wholesale', priority: '0.8', changefreq: 'weekly' },
      { url: '/contact', priority: '0.7', changefreq: 'monthly' }
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Add static pages
    staticPages.forEach(page => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <lastmod>${today}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += `  </url>\n`;
    });

    // Add dynamic product pages
    if (products) {
      products.forEach(product => {
        // Fallback to today if no date is found
        const lastMod = product.created_at ? new Date(product.created_at).toISOString().split('T')[0] : today;
        
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/product/${product.id}</loc>\n`;
        xml += `    <lastmod>${lastMod}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;
        xml += `  </url>\n`;
      });
    }

    xml += `</urlset>`;

    // Set headers for XML and cache control (cache for 1 hour at edge)
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(xml);

  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).send('Error generating sitemap');
  }
}
