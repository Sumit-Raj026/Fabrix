import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== '...' && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 mb-16 animate-fade-in">
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-brand-border text-stone-600 dark:text-stone-400 hover:text-brand-gold hover:border-brand-gold disabled:opacity-30 disabled:hover:border-brand-border disabled:hover:text-stone-600 transition-colors rounded-sm flex items-center"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center gap-1 sm:gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => handlePageClick(page)}
            disabled={page === '...'}
            className={`
              w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-xs font-bold rounded-sm transition-all
              ${page === currentPage 
                ? 'bg-brand-gold text-brand-charcoal border-brand-gold' 
                : page === '...'
                  ? 'text-stone-500 cursor-default'
                  : 'border border-brand-border text-stone-600 dark:text-stone-400 hover:border-brand-gold hover:text-brand-gold'
              }
            `}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-brand-border text-stone-600 dark:text-stone-400 hover:text-brand-gold hover:border-brand-gold disabled:opacity-30 disabled:hover:border-brand-border disabled:hover:text-stone-600 transition-colors rounded-sm flex items-center"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
