import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import WhatsAppButton from './components/WhatsAppButton';
import { PRODUCTS } from './data/products';
import { CONFIG } from './config';
import { Mail, MapPin, Instagram, Heart } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Initialize theme from localStorage or default to dark
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Sync theme with HTML class
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Handle URL hash to deep link to specific products
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#product-')) {
        const productId = hash.replace('#product-', '');
        const product = PRODUCTS.find((p) => p.id === productId);
        if (product) {
          setSelectedProduct(product);
        }
      }
    };

    // Run on mount and when hash changes
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenProduct = (product) => {
    setSelectedProduct(product);
    window.history.pushState(null, null, `#product-${product.id}`);
  };

  const handleCloseProduct = () => {
    setSelectedProduct(null);
    // Remove the product hash, preserving scroll position
    window.history.pushState(null, null, ' ');
  };

  // Filter & Sort Logic
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
    return 0; // Default/Featured sorting
  });

  const handleCustomOrderClick = () => {
    const message = `Hello Fabrix, I would like to inquire about placing a custom/bespoke order. Let's discuss design ideas and requirements!`;
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-stone-900 dark:text-white transition-colors duration-450 selection:bg-brand-gold/30 selection:text-white">
      
      {/* Header Navigation */}
      <Header 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Hero Section */}
      <Hero />

      {/* Catalog Main section */}
      <main id="catalog" className="flex-grow max-w-7xl mx-auto px-4 md:px-6 py-16 w-full relative overflow-hidden">
        {/* Glow backdrop decorative */}
        <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[800px] bg-brand-gold/[0.03] rounded-full filter blur-3xl pointer-events-none -z-10" />

        <h2 className="font-serif text-2xl md:text-3xl font-light text-stone-900 dark:text-white mb-2 tracking-wide transition-colors duration-400">
          The Collection
        </h2>
        <p className="text-[10px] font-bold text-stone-400 dark:text-stone-500 tracking-[0.2em] mb-8 uppercase transition-colors duration-400">
          Handcrafted quality, thoughtfully detailed
        </p>

        {/* Filter and Sorting Options */}
        <Filters 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
          sortBy={sortBy} 
          setSortBy={setSortBy}
          totalItems={sortedProducts.length}
        />

        {/* Product Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 py-12">
            {sortedProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onOpen={handleOpenProduct} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-brand-border rounded-sm bg-brand-stone/40 mt-12">
            <p className="text-sm text-stone-500 font-light italic mb-4">
              No products found matching your search.
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="px-6 py-2.5 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Custom Section CTA */}
        <section id="custom" className="my-20 bg-brand-stone border border-brand-border p-8 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 rounded-sm relative overflow-hidden shadow-2xl transition-all duration-400">
          <div className="absolute top-0 right-0 w-48 h-48 bg-brand-gold/[0.04] rounded-full filter blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-gold/[0.02] rounded-full filter blur-xl pointer-events-none" />
          
          <div className="max-w-2xl text-center lg:text-left relative z-10">
            <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold uppercase block mb-3">
              Bespoke Services
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-light text-stone-900 dark:text-white mb-4 leading-tight transition-colors duration-400">
              Looking for something completely custom?
            </h3>
            <p className="text-stone-600 dark:text-stone-400 font-light text-xs md:text-sm leading-relaxed tracking-wide transition-colors duration-400">
              Premium wall art, home décor, statues, lamps, personalized gifts, and custom 3D-printed creations—designed to bring elegance and individuality into every space
            </p>
          </div>
          <button
            onClick={handleCustomOrderClick}
            className="w-full lg:w-auto px-8 py-4 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 whitespace-nowrap btn-shimmer relative z-10 shadow-lg shadow-brand-gold/10"
          >
            Start Custom Order
          </button>
        </section>
      </main>

      {/* Footer Section */}
      <footer id="contact" className="bg-[#0c0c0b] text-stone-400 py-20 px-4 md:px-6 border-t border-brand-border/60">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white uppercase">
              {CONFIG.STORE_NAME}
            </span>
            <p className="text-stone-500 font-light text-xs leading-relaxed max-w-sm tracking-wide">
              We craft contemporary objects with an emphasis on minimalist design, clean lines, and natural materials. Elevating your home aesthetics, one item at a time.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-400">
              <li>
                <a href="#catalog" className="hover:text-brand-gold transition-colors duration-250">Browse Catalog</a>
              </li>
              <li>
                <a href="#custom" className="hover:text-brand-gold transition-colors duration-250">Custom Design</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-brand-gold transition-colors duration-250">Reach Us</a>
              </li>
            </ul>
          </div>

          {/* Contact details */}
          <div className="space-y-4">
            <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">
              Get in Touch
            </h4>
            <ul className="space-y-3.5 text-xs font-light text-stone-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>{CONFIG.ADDRESS}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href={`mailto:${CONFIG.EMAIL}`} className="hover:text-brand-gold transition-colors duration-250">{CONFIG.EMAIL}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Instagram className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors duration-250">@{CONFIG.INSTAGRAM}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="max-w-7xl mx-auto pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-500 font-bold tracking-widest uppercase">
          <p>© {new Date().getFullYear()} {CONFIG.STORE_NAME}. All rights reserved.</p>
          <p className="flex items-center gap-1 font-normal text-stone-600">
            Made with <Heart className="w-3.5 h-3.5 text-brand-gold fill-current" /> for minimalist living
          </p>
        </div>
      </footer>

      {/* Detail Modal Overlay */}
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={handleCloseProduct} 
        />
      )}

      {/* Floating Sticky WhatsApp Button */}
      <WhatsAppButton />

    </div>
  );
}
