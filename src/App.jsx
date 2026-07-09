import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Header from './components/Header';
import ProductModal from './components/ProductModal';
import WhatsAppButton from './components/WhatsAppButton';
import B2BInquiryModal from './components/B2BInquiryModal';
import AppRoutes from './routes/AppRoutes';

import { CONFIG } from './config';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Mail, MapPin, Instagram, Heart } from 'lucide-react';
import { useProducts } from './hooks/useProducts';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isB2BOpen, setIsB2BOpen] = useState(false);
  
  const { data: products = [], isLoading: dbLoading } = useProducts();

  const navigate = useNavigate();
  const location = useLocation();

  const categories = Array.from(new Set(products.filter(p => p && p.category).map((p) => p.category)));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        setAuthLoading(false);
      }
    };
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('fabrix_theme');
      if (savedTheme) return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('fabrix_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleOpenProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleCloseProduct = () => {
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <div className="min-h-screen bg-brand-stone dark:bg-brand-charcoal text-stone-900 dark:text-white flex flex-col font-sans transition-colors duration-400">
      {!location.pathname.startsWith('/admin') && (
        <Header 
          theme={theme} 
          toggleTheme={toggleTheme} 
          setSearchTerm={setSearchTerm} 
          searchTerm={searchTerm} 
        />
      )}

      <main className={`flex-grow flex flex-col ${!location.pathname.startsWith('/admin') ? 'pt-16' : ''}`}>
        <AppRoutes
          products={products}
          categories={categories}
          dbLoading={dbLoading}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          searchTerm={searchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
          handleOpenProduct={handleOpenProduct}
          handleCloseProduct={handleCloseProduct}
          handleCustomOrderClick={() => setIsB2BOpen(true)}
          authLoading={authLoading}
          user={user}
          setUser={setUser}
          handleLogout={handleLogout}
        />
      </main>

      {/* Shared Footer across non-admin routes */}
      {!location.pathname.startsWith('/admin') && (
        <footer className="bg-stone-950 text-white pt-12 pb-8 px-4 md:px-6 mt-auto">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
            <div className="md:col-span-2 space-y-6">
              <h3 className="font-serif text-2xl tracking-wide font-light">{CONFIG.STORE_NAME}</h3>
              <p className="text-stone-400 text-xs font-light leading-relaxed max-w-sm">
                We craft contemporary objects with an emphasis on minimalist design, clean lines, and natural materials. Elevating your home aesthetics, one item at a time.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Quick Links</h4>
              <ul className="space-y-3.5 text-xs font-light text-stone-400">
                <li><a href="/#catalog" className="hover:text-brand-gold transition-colors duration-250">Browse Catalog</a></li>
                <li><a href="/#custom" className="hover:text-brand-gold transition-colors duration-250">Custom Design</a></li>
                <li><Link to="/contact" className="hover:text-brand-gold transition-colors duration-250">Reach Us</Link></li>
                <li><Link to="/admin" className="hover:text-brand-gold transition-colors duration-250">Admin Portal</Link></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h4 className="text-white text-[10px] font-bold uppercase tracking-[0.2em]">Get in Touch</h4>
              <ul className="space-y-3.5 text-xs font-light text-stone-400">
                <li className="flex items-start gap-2.5"><MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" /><span>{CONFIG.ADDRESS}</span></li>
                <li className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-brand-gold flex-shrink-0" /><a href={`mailto:${CONFIG.EMAIL}`} className="hover:text-brand-gold transition-colors duration-250">{CONFIG.EMAIL}</a></li>
                <li className="flex items-center gap-2.5"><Instagram className="w-4 h-4 text-brand-gold flex-shrink-0" /><a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="hover:text-brand-gold transition-colors duration-250">@{CONFIG.INSTAGRAM}</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto pt-8 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-stone-500 font-bold tracking-widest uppercase">
            <p>© {new Date().getFullYear()} {CONFIG.STORE_NAME}. All rights reserved.</p>
            <p className="flex items-center gap-1 font-normal text-stone-600">Made with <Heart className="w-3.5 h-3.5 text-brand-gold fill-current" /> for minimalist living</p>
          </div>
        </footer>
      )}

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      <WhatsAppButton />
      <B2BInquiryModal 
        isOpen={isB2BOpen} 
        onClose={() => setIsB2BOpen(false)} 
      />
    </div>
  );
}
