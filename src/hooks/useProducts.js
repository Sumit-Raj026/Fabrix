import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export function useReorderProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates) => {
      return await db.updateProductOrders(updates);
    },
    // Optimistic update
    onMutate: async (newOrder) => {
      await queryClient.cancelQueries({ queryKey: ['products'] });
      const previousProducts = queryClient.getQueryData(['products']);
      
      // We assume newOrder is an array of { id, display_order }
      // We can sort the cache manually to make it feel instant
      if (previousProducts) {
        const orderMap = new Map(newOrder.map(u => [u.id, u.display_order]));
        const updatedProducts = [...previousProducts].sort((a, b) => {
          const aOrder = orderMap.has(a.id) ? orderMap.get(a.id) : a.display_order || Number.MAX_SAFE_INTEGER;
          const bOrder = orderMap.has(b.id) ? orderMap.get(b.id) : b.display_order || Number.MAX_SAFE_INTEGER;
          return aOrder - bOrder;
        });
        queryClient.setQueryData(['products'], updatedProducts);
      }
      
      return { previousProducts };
    },
    onError: (err, newOrder, context) => {
      if (context?.previousProducts) {
        queryClient.setQueryData(['products'], context.previousProducts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
