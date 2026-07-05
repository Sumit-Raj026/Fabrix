import React from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { CONFIG } from '../config';

export default function Header({ searchTerm, setSearchTerm, theme, toggleTheme }) {
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
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative">
            <input
              type="text"
              id="search-input"
              placeholder="SEARCH CATALOG..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-28 sm:w-48 md:w-60 bg-brand-stone border border-brand-border text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 text-[10px] tracking-widest rounded-full py-2.5 pl-10 pr-4 outline-none focus:border-brand-gold transition-all duration-300"
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
        </div>

      </div>
    </header>
  );
}
