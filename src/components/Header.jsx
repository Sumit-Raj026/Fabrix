import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';
import { PRODUCTS } from '../data/products';

export default function Header({ searchTerm, setSearchTerm, theme, toggleTheme, onSelectProduct }) {
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter products for suggestions (max 5)
  const suggestions = searchTerm.trim() 
    ? PRODUCTS.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSuggestionClick = (product) => {
    onSelectProduct(product);
    setSearchTerm('');
    setIsFocused(false);
    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <a href="/" className="group">
            <span className="font-serif text-lg sm:text-2xl md:text-3xl font-semibold tracking-[0.25em] text-stone-900 dark:text-white uppercase select-none transition-colors duration-300 group-hover:text-brand-gold">
              {CONFIG.STORE_NAME}
            </span>
          </a>
        </div>

        {/* Navigation - Minimalist Menu */}
        <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-stone-500 dark:text-stone-400 uppercase">
          <a href="#catalog" className="hover:text-stone-900 dark:hover:text-white transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold hover:after:w-full after:transition-all after:duration-300">
            Catalog
          </a>
          <a href="#custom" className="hover:text-stone-900 dark:hover:text-white transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold hover:after:w-full after:transition-all after:duration-300">
            Custom Work
          </a>
          <a href="#contact" className="hover:text-stone-900 dark:hover:text-white transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold hover:after:w-full after:transition-all after:duration-300">
            Inquire
          </a>
        </nav>

        {/* Search Bar & Actions */}
        <div className="flex items-center gap-3 sm:gap-4 relative">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              id="search-input"
              placeholder="SEARCH..."
              value={searchTerm}
              onFocus={() => setIsFocused(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsFocused(true);
              }}
              className="w-32 sm:w-48 md:w-60 bg-brand-stone border border-brand-border text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 text-[10px] tracking-widest rounded-full py-2.5 pl-10 pr-4 outline-none focus:border-brand-gold transition-all duration-300"
              autoComplete="off"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-stone-500 pointer-events-none" />
          </div>

          {/* Theme Toggle button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="p-2.5 rounded-full border border-brand-border bg-brand-stone text-stone-700 dark:text-stone-300 hover:border-brand-gold hover:text-brand-gold dark:hover:text-brand-gold transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Suggestions Dropdown Card */}
          {isFocused && searchTerm.trim().length > 0 && (
            <div 
              ref={dropdownRef}
              className="absolute right-0 top-full mt-2 w-72 sm:w-80 md:w-96 bg-brand-stone border border-brand-border rounded-sm shadow-2xl overflow-hidden z-50 animate-scale-in"
            >
              <div className="p-3 border-b border-brand-border bg-stone-50 dark:bg-[#111110] flex items-center justify-between">
                <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 tracking-wider uppercase">
                  Quick Recommendations
                </span>
                <span className="text-[9px] font-medium text-stone-400 dark:text-stone-500">
                  {suggestions.length} {suggestions.length === 1 ? 'match' : 'matches'}
                </span>
              </div>

              {suggestions.length > 0 ? (
                <div className="max-h-[320px] overflow-y-auto">
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      onMouseDown={() => handleSuggestionClick(product)}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-stone-50 dark:hover:bg-[#1a1a19] border-b border-brand-border/60 last:border-b-0 transition-colors duration-200 group"
                    >
                      {/* Image Thumbnail */}
                      <img 
                        src={product.images[0]} 
                        alt={product.title} 
                        className="w-10 h-10 object-cover rounded-sm border border-brand-border"
                      />
                      
                      {/* Text details */}
                      <div className="flex-grow min-w-0">
                        <h4 className="text-xs text-stone-900 dark:text-white font-medium truncate group-hover:text-brand-gold transition-colors duration-200">
                          {product.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-stone-400 uppercase font-semibold">
                            {product.category}
                          </span>
                          <span className="text-stone-300 dark:text-stone-800">•</span>
                          <span className="text-[9px] text-brand-gold font-bold">
                            {formatPrice(product.price)}
                          </span>
                        </div>
                      </div>

                      {/* Go icon */}
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:text-brand-gold transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-stone-450 dark:text-stone-500 text-xs italic font-light">
                  No quick matches found.
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
