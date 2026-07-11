import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { useSearchProducts, usePaginatedProducts } from '../hooks/useProducts';
import { Search, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { CONFIG } from '../config';

export default function SearchResultsPage({ onSelectProduct }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data: searchResults = [], isLoading } = useSearchProducts(query);

  // Fallback to popular products if no results
  const { data: { data: popularProducts = [] } = {} } = usePaginatedProducts({ limit: 4 });

  return (
    <main className="flex-grow max-w-[1600px] mx-auto px-4 md:px-6 pt-16 pb-16 w-full animate-fade-in">
      <Helmet><title>Search Results: "{query}" | {CONFIG.STORE_NAME}</title></Helmet>
      
      <div className="mb-12 border-b border-brand-border/40 pb-8">
        <h1 className="font-serif text-3xl md:text-4xl font-light text-stone-900 dark:text-white mb-4">
          Search Results
        </h1>
        <div className="flex items-center gap-2 text-stone-500 text-sm">
          <Search className="w-4 h-4" />
          <span>Showing results for <strong className="text-brand-gold font-bold">"{query}"</strong></span>
          <span className="ml-2 px-2 py-0.5 bg-stone-100 dark:bg-stone-900 rounded-full text-[10px] uppercase tracking-widest">
            {searchResults.length} {searchResults.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
          {searchResults.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onOpen={() => onSelectProduct(product)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-brand-stone/40 border border-brand-border rounded-sm">
          <h2 className="font-serif text-2xl text-stone-900 dark:text-white mb-4">We couldn't find any matches.</h2>
          <p className="text-stone-500 font-light max-w-md mx-auto mb-8">
            Try checking your spelling or using more general terms. You can also explore our most popular pieces below.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm shadow-lg">
            Return to Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {searchResults.length === 0 && (
        <div className="mt-20">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-400 mb-8 flex items-center gap-4">
            Popular Right Now <span className="h-[1px] flex-grow bg-brand-border/40"></span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-3 gap-y-8 md:gap-x-6 md:gap-y-12">
            {popularProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onOpen={() => onSelectProduct(product)} 
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
