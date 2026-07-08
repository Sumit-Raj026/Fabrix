import { useQuery } from '@tanstack/react-query';
import { db } from '../lib/supabase';
import { PRODUCTS } from '../data/products';

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const dbProducts = await db.getProducts();
        if (dbProducts !== null && Array.isArray(dbProducts)) {
          return dbProducts;
        }
      } catch (err) {
        console.error("Failed to fetch products from db, falling back to static:", err);
      }
      return PRODUCTS;
    },
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Don't refetch on every window focus to save DB calls
  });
}
