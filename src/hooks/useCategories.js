import { useQuery } from '@tanstack/react-query';
import { db } from '../lib/supabase';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const dbCategories = await db.getCategories();
        if (dbCategories !== null && Array.isArray(dbCategories)) {
          return dbCategories;
        }
      } catch (err) {
        console.error("Failed to fetch categories from db:", err);
      }
      return [];
    },
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    refetchOnWindowFocus: false, // Minimize DB calls
  });
}
