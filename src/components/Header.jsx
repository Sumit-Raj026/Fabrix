import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, ArrowRight } from 'lucide-react';
import { CONFIG } from '../config';
import { PRODUCTS } from '../data/products';

export default function Header({ searchTerm, setSearchTerm, theme, toggleTheme, onSelectProduct, products = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter recommendations based on search term
  const getSuggestions = () => {
    const sourceProducts = products.length > 0 ? products : PRODUCTS;
    if (!searchTerm.trim()) {
      // Show default popular products when search is empty but focused
      return sourceProducts.slice(0, 3);
    }
    const cleanSearch = searchTerm.toLowerCase().trim();
    return sourceProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(cleanSearch) ||
        p.category.toLowerCase().includes(cleanSearch) ||
        p.id.toLowerCase().includes(cleanSearch)
    ).slice(0, 4); // Limit to 4 suggestions
  };

  const suggestions = getSuggestions();
  const hasInput = searchTerm.trim().length > 0;

  const handleSuggestionClick = (product) => {
    onSelectProduct(product);
    setIsOpen(false);
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
        <div className="flex items-center gap-3 sm:gap-4 relative" ref={dropdownRef}>
          <div className="relative">
            <input
              type="text"
              id="search-input"
              placeholder="SEARCH..."
              value={searchTerm}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
              className="w-32 sm:w-48 md:w-60 bg-brand-stone border border-brand-border text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 text-[10px] tracking-widest rounded-full py-2.5 pl-10 pr-4 outline-none focus:border-brand-gold transition-all duration-300"
              autoComplete="off"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 dark:text-stone-500 pointer-events-none" />
          </div>

          {/* Autocomplete Dropdown Panel */}
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 sm:w-80 bg-brand-stone border border-brand-border shadow-2xl rounded-sm overflow-hidden z-50 animate-scale-in">
              <div className="px-4 py-2.5 border-b border-brand-border bg-stone-50/50 dark:bg-stone-900/20 flex items-center justify-between">
                <span className="text-[9px] font-bold tracking-wider text-stone-500 uppercase">
                  {hasInput ? 'Search Suggestions' : 'Trending Items'}
                </span>
                {hasInput && suggestions.length > 0 && (
                  <span className="text-[8px] font-medium text-stone-400">
                    {suggestions.length} found
                  </span>
                )}
              </div>

              {/* Suggestions List */}
              <div className="max-h-[300px] overflow-y-auto">
                {suggestions.length > 0 ? (
                  suggestions.map((product) => (
                    <a
                      key={product.id}
                      href={`#product-${product.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(product);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-brand-stone-hover border-b border-brand-border/40 last:border-b-0 transition-colors duration-200 text-left block text-current no-underline"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-10 h-10 object-cover rounded-sm bg-brand-charcoal"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-brand-gold uppercase tracking-wider block">
                          {product.category}
                        </span>
                        <h4 className="text-xs text-stone-900 dark:text-white font-medium truncate">
                          {product.title}
                        </h4>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-light mt-0.5">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                          }).format(product.price)}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 dark:text-stone-600 flex-shrink-0" />
                    </a>
                  ))
                ) : (
                  <div className="p-5 text-center text-xs text-stone-500 font-light italic">
                    No suggestions for "{searchTerm}"
                  </div>
                )}
              </div>

              {/* Full Results Link */}
              {hasInput && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2 bg-stone-50 dark:bg-stone-900/30 text-center text-[9px] font-bold text-brand-gold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-charcoal border-t border-brand-border transition-colors duration-200"
                >
                  View All Search Results
                </button>
              )}
            </div>
          )}

          {/* Theme Toggle button */}
          <button
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="p-2.5 rounded-full border border-brand-border bg-brand-stone text-stone-700 dark:text-stone-300 hover:border-brand-gold hover:text-brand-gold dark:hover:text-brand-gold transition-all duration-300"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </header>
  );
}
