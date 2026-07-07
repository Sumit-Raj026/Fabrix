import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vyyahylbqdvefuwaacav.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Database helper operations
export const db = {
  // Fetch all products from Supabase
  async getProducts() {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Map database schema columns back to frontend naming conventions
      return data.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        price: Number(item.price),
        originalPrice: item.original_price ? Number(item.original_price) : null,
        description: item.description,
        details: Array.isArray(item.details) ? item.details : JSON.parse(item.details || '[]'),
        images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]'),
        customizable: item.customizable,
        customizationLabel: item.customization_label || ''
      }));
    } catch (err) {
      console.error('Error fetching products from database:', err);
      return null; // Return null to signal fallback to static products
    }
  },

  // Save (insert or update) a product
  async saveProduct(product) {
    if (!supabase) return false;
    
    // Map frontend structure to database schema columns
    const dbItem = {
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price,
      original_price: product.originalPrice,
      description: product.description,
      details: product.details, // jsonb will accept array
      images: product.images,   // jsonb will accept array
      customizable: product.customizable,
      customization_label: product.customizationLabel
    };

    try {
      const { error } = await supabase
        .from('products')
        .upsert(dbItem, { onConflict: 'id' });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error saving product to database:', err);
      throw err;
    }
  },

  // Delete a product by ID
  async deleteProduct(id) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting product from database:', err);
      throw err;
    }
  }
};
