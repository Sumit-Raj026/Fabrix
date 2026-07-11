import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vyyahylbqdvefuwaacav.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ZqYUvDiUXeTpnkaYdrCMGA_bLpfRSJV';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Database helper operations
export const db = {
  // Helper to map DB schema to frontend naming
  _mapProduct(item) {
    return {
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
    };
  },

  // Fetch all products from Supabase
  async getProducts() {
    if (!supabase) return [];
    try {
      let queryData;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('display_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });
      
      if (error) {
        if (error.code === '42703' || error.message?.includes('display_order')) {
          const fallback = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: true });
          if (fallback.error) throw fallback.error;
          queryData = fallback.data;
        } else {
          throw error;
        }
      } else {
        queryData = data;
      }
      return queryData.map(db._mapProduct);
    } catch (err) {
      console.error('Error fetching products from database:', err);
      throw err;
    }
  },

  async getPaginatedProducts({ page = 1, limit = 20, category = 'All', sortBy = 'default', search = '' }) {
    if (!supabase) return { data: [], count: 0 };
    try {
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase.from('products').select('*', { count: 'exact' });

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      
      if (search) {
        query = query.ilike('title', `%${search}%`);
      }

      // Sorting
      if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else {
        query = query.order('display_order', { ascending: true, nullsFirst: false }).order('created_at', { ascending: true });
      }

      query = query.range(from, to);

      const { data, error, count } = await query;
      
      if (error) {
        // Fallback for missing display_order
        if (error.code === '42703' || error.message?.includes('display_order')) {
          let fallbackQuery = supabase.from('products').select('*', { count: 'exact' });
          if (category && category !== 'All') fallbackQuery = fallbackQuery.eq('category', category);
          if (search) fallbackQuery = fallbackQuery.ilike('title', `%${search}%`);
          if (sortBy === 'price-asc') fallbackQuery = fallbackQuery.order('price', { ascending: true });
          else if (sortBy === 'price-desc') fallbackQuery = fallbackQuery.order('price', { ascending: false });
          else fallbackQuery = fallbackQuery.order('created_at', { ascending: true });
          
          const fallback = await fallbackQuery.range(from, to);
          if (fallback.error) throw fallback.error;
          return { data: fallback.data.map(db._mapProduct), count: fallback.count };
        }
        throw error;
      }
      
      return { data: data.map(db._mapProduct), count };
    } catch (err) {
      console.error('Error fetching paginated products:', err);
      throw err;
    }
  },

  async searchProducts(searchQuery) {
    if (!supabase || !searchQuery) return [];
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%,id.ilike.%${searchQuery}%`)
        .limit(20);
      
      if (error) throw error;
      return data.map(db._mapProduct);
    } catch (err) {
      console.error('Error searching products:', err);
      throw err;
    }
  },

  async getProductById(id) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data ? db._mapProduct(data) : null;
    } catch (err) {
      console.error('Error fetching product by id:', err);
      return null;
    }
  },

  async getRelatedProducts(category, excludeId, limit = 4) {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', excludeId)
        .limit(limit);
      
      if (error) throw error;
      return data.map(db._mapProduct);
    } catch (err) {
      console.error('Error fetching related products:', err);
      return [];
    }
  },

  // Bulk update product display orders
  async updateProductOrders(updates) {
    if (!supabase) return false;
    try {
      const promises = updates.map(update => 
        supabase
          .from('products')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
      );
      
      const results = await Promise.all(promises);
      const errors = results.filter(r => r.error).map(r => r.error);
      
      if (errors.length > 0) throw errors[0];
      return true;
    } catch (err) {
      console.error('Error updating product orders:', err);
      throw err;
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
  },

  // --- Category Operations ---
  
  async getCategories() {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data.map(c => c.name);
    } catch (err) {
      console.error('Error fetching categories from database:', err);
      return null;
    }
  },

  async saveCategory(name) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('categories')
        .insert([{ name }]);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error saving category to database:', err);
      throw err;
    }
  },

  async deleteCategory(name) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('name', name);
      
      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting category from database:', err);
      throw err;
    }
  }
};
