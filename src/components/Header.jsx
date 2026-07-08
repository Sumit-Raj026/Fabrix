import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, Sun, Moon, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { CONFIG } from '../config';
import { PRODUCTS } from '../data/products';

// Helper component to highlight matched text
const HighlightText = ({ text = '', matches = [], keyName }) => {
  if (!matches || matches.length === 0) return <span>{text}</span>;
  
  const match = matches.find(m => m.key === keyName);
  if (!match || !match.indices || match.indices.length === 0) return <span>{text}</span>;

  let lastIndex = 0;
  const nodes = [];
  
  match.indices.forEach(([start, end], i) => {
    if (start > lastIndex) {
      nodes.push(<span key={`${i}-text`}>{text.substring(lastIndex, start)}</span>);
    }
    nodes.push(
      <strong key={`${i}-match`} className="text-brand-gold font-bold">
        {text.substring(start, end + 1)}
      </strong>
    );
    lastIndex = end + 1;
  });

  if (lastIndex < text.length) {
    nodes.push(<span key="last-text">{text.substring(lastIndex)}</span>);
  }

  return <span>{nodes}</span>;
};

export default function Header({ searchTerm, setSearchTerm, theme, toggleTheme, onSelectProduct, onOpenB2B, products = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  const sourceProducts = products.length > 0 ? products : PRODUCTS;

  // Initialize Fuse for fuzzy searching
  const fuse = useMemo(() => new Fuse(sourceProducts, {
    keys: [
      { name: 'title', weight: 0.5 },
      { name: 'category', weight: 0.3 },
      { name: 'id', weight: 0.1 },
      { name: 'description', weight: 0.1 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeMatches: true
  }), [sourceProducts]);

  // Filter recommendations based on search term
  const suggestionsData = useMemo(() => {
    if (!searchTerm.trim()) {
      return sourceProducts.slice(0, 4).map(item => ({ item, matches: [] }));
    }
    return fuse.search(searchTerm).slice(0, 5);
  }, [searchTerm, fuse, sourceProducts]);

  const hasInput = searchTerm.trim().length > 0;

  const handleSuggestionClick = (product) => {
    onSelectProduct(product);
    setIsOpen(false);
    navigate(`/product/${product.id}`); // Direct navigation as per requirements
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleViewAllResults = () => {
    setIsOpen(false);
    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full glass transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="group">
            <span className="font-serif text-lg sm:text-2xl md:text-3xl font-semibold tracking-[0.25em] text-stone-900 dark:text-white uppercase select-none transition-colors duration-300 group-hover:text-brand-gold">
              {CONFIG.STORE_NAME}
            </span>
          </Link>
        </div>

        {/* Navigation - Minimalist Menu */}
      <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold tracking-[0.2em] text-stone-500 dark:text-stone-400 uppercase">
        <Link to="/" className="hover:text-stone-900 dark:hover:text-white transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold hover:after:w-full after:transition-all after:duration-300">
          Catalog
        </Link>
        <Link to="/wholesale" className="hover:text-stone-900 dark:hover:text-white transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold hover:after:w-full after:transition-all after:duration-300">
          B2B / Wholesale
        </Link>

        <Link to="/contact" className="hover:text-stone-900 dark:hover:text-white transition-colors duration-300 relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-brand-gold hover:after:w-full after:transition-all after:duration-300">
          Contact Us
        </Link>
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
              onKeyDown={handleKeyDown}
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
            <div className="absolute top-full right-0 mt-2 w-64 sm:w-80 md:w-96 bg-brand-stone border border-brand-border shadow-2xl rounded-sm overflow-hidden z-50 animate-scale-in">
              <div className="px-4 py-2.5 border-b border-brand-border bg-stone-50/50 dark:bg-stone-900/20 flex items-center justify-between">
                <span className="text-[9px] font-bold tracking-wider text-stone-500 uppercase">
                  {hasInput ? 'Search Suggestions' : 'Trending Items'}
                </span>
                {hasInput && suggestionsData.length > 0 && (
                  <span className="text-[8px] font-medium text-stone-400">
                    {suggestionsData.length} found
                  </span>
                )}
              </div>

              {/* Suggestions List */}
              <div className="max-h-[350px] overflow-y-auto">
                {suggestionsData.length > 0 ? (
                  suggestionsData.map(({ item, matches }) => (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSuggestionClick(item);
                      }}
                      className="w-full flex items-center gap-3 p-3 hover:bg-brand-stone-hover border-b border-brand-border/40 last:border-b-0 transition-colors duration-200 text-left block text-current no-underline group"
                    >
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded-sm bg-brand-charcoal"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-stone-500 uppercase tracking-wider block mb-0.5">
                          <HighlightText text={item.category} matches={matches} keyName="category" />
                        </span>
                        <h4 className="text-xs text-stone-900 dark:text-white font-medium truncate">
                          <HighlightText text={item.title} matches={matches} keyName="title" />
                        </h4>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 font-light mt-0.5 block">
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                            maximumFractionDigits: 0
                          }).format(item.price)}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-stone-400 dark:text-stone-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-center">
                    <p className="text-xs text-stone-900 dark:text-white font-medium mb-1">No matches found</p>
                    <p className="text-[10px] text-stone-500 font-light">Try searching for something else.</p>
                  </div>
                )}
              </div>

              {/* Full Results Link */}
              {hasInput && (
                <button
                  onClick={handleViewAllResults}
                  className="w-full py-3 bg-stone-50 dark:bg-stone-900/30 text-center text-[9px] font-bold text-brand-gold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-charcoal border-t border-brand-border transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  View All Search Results <ArrowRight className="w-3 h-3" />
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
