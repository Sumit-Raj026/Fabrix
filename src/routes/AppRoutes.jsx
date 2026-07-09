import React, { Suspense, lazy } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { CONFIG } from '../config';

import Hero from '../components/Hero';
import Filters from '../components/Filters';
import ProductCard from '../components/ProductCard';
const AboutPage = lazy(() => import('../components/AboutPage'));
const ContactPage = lazy(() => import('../components/ContactPage'));
const B2BPage = lazy(() => import('../components/B2BPage'));
const ProductDetailPage = lazy(() => import('../components/ProductDetailPage'));
const SearchResultsPage = lazy(() => import('../components/SearchResultsPage'));

const AdminPanel = lazy(() => import('../components/admin/AdminLayout'));
const AdminLogin = lazy(() => import('../components/admin/AdminLogin'));

export default function AppRoutes({
  products,
  categories,
  dbLoading,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  sortBy,
  setSortBy,
  handleOpenProduct,
  handleCloseProduct,
  handleCustomOrderClick,
  authLoading,
  user,
  setUser,
  handleLogout
}) {
  const navigate = useNavigate();

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  return (
    <Suspense fallback={<div className="min-h-screen flex flex-col items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-gold mb-4" /></div>}>
      <Routes>
      <Route path="/" element={
        <>
          <Hero />
          <main id="catalog" className="flex-grow max-w-[1600px] mx-auto px-4 md:px-6 py-16 w-full relative overflow-hidden">
            <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-brand-gold/[0.03] rounded-full filter blur-3xl pointer-events-none -z-10" />

            <h2 className="font-serif text-2xl md:text-3xl font-light text-stone-900 dark:text-white mb-2 tracking-wide transition-colors duration-400">
              The Collection
            </h2>
            <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 tracking-[0.2em] mb-8 uppercase transition-colors duration-400">
              Handcrafted quality, thoughtfully detailed
            </p>

            <Filters 
              selectedCategory={selectedCategory} 
              setSelectedCategory={setSelectedCategory} 
              sortBy={sortBy} 
              setSortBy={setSortBy}
              categories={categories}
            />

            {dbLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 md:gap-10 py-12">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="flex flex-col bg-brand-stone/40 border border-brand-border/45 rounded-sm p-6 space-y-4 animate-pulse">
                    <div className="aspect-[4/5] bg-stone-900/10 dark:bg-stone-800/10 rounded-sm w-full" />
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 md:gap-10 py-12 mb-24">
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onOpen={handleOpenProduct} 
                  />
                ))}
              </div>
            ) : (
              <div className="py-12">
                <div className="text-center py-16 border border-brand-border rounded-sm bg-brand-stone/40 max-w-2xl mx-auto mb-16 shadow-sm">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold uppercase block mb-3">
                    Catalog Empty
                  </span>
                  <h3 className="font-serif text-xl font-light text-stone-905 dark:text-white mb-4 transition-colors duration-400">
                    No Products Found
                  </h3>
                </div>
              </div>
            )}

            <section id="custom" className="mt-20 mb-10 bg-brand-stone border border-brand-border p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 rounded-sm relative overflow-hidden shadow-2xl transition-all duration-400">
              <div className="max-w-2xl text-center lg:text-left relative z-10">
                <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold uppercase block mb-3">
                  Bespoke Services
                </span>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900 dark:text-white mb-4 leading-tight transition-colors duration-400">
                  Looking for something completely custom?
                </h3>
              </div>
              <button
                onClick={handleCustomOrderClick}
                className="w-full lg:w-auto px-8 py-4 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 whitespace-nowrap btn-shimmer relative z-10 shadow-lg shadow-brand-gold/10"
              >
                Start Custom Order
              </button>
            </section>
          </main>
        </>
      } />
      
      <Route path="/story" element={
        <main className="flex-grow max-w-[1600px] mx-auto px-4 md:px-6 pt-16 pb-8 w-full">
          <Helmet><title>Our Story | {CONFIG.STORE_NAME}</title></Helmet>
          <AboutPage />
        </main>
      } />

      <Route path="/wholesale" element={
        <main className="flex-grow max-w-[1600px] mx-auto px-4 md:px-6 pt-16 pb-8 w-full">
          <Helmet><title>B2B & Wholesale | {CONFIG.STORE_NAME}</title></Helmet>
          <B2BPage />
        </main>
      } />

      <Route path="/contact" element={
        <main className="flex-grow max-w-[1600px] mx-auto px-4 md:px-6 pt-16 pb-8 w-full">
          <Helmet><title>Contact Us | {CONFIG.STORE_NAME}</title></Helmet>
          <ContactPage />
        </main>
      } />

      <Route path="/search" element={
        <SearchResultsPage 
          products={products} 
          onSelectProduct={handleOpenProduct} 
        />
      } />

      <Route path="/product/:id" element={
        <ProductDetailPage 
          products={products} 
          onBack={handleCloseProduct} 
          onOpenProduct={handleOpenProduct} 
        />
      } />

      <Route path="/admin" element={
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin w-8 h-8 text-brand-gold" /></div>}>
          <Helmet><title>Admin Dashboard | {CONFIG.STORE_NAME}</title><meta name="robots" content="noindex, nofollow" /></Helmet>
          {authLoading ? (
            <div className="min-h-screen bg-brand-charcoal text-white flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
            </div>
          ) : !user ? (
            <AdminLogin 
              onLoginSuccess={(usr) => setUser(usr)}
              onClose={() => navigate('/')}
            />
          ) : (
            <AdminPanel 
              products={products} 
              categories={categories}
              user={user}
              onClose={() => navigate('/')}
              onLogout={handleLogout}
            />
          )}
        </Suspense>
      } />
      </Routes>
    </Suspense>
  );
}
