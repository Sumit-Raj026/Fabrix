import React from 'react';

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A-Z" }
];

export default function Filters({ selectedCategory, setSelectedCategory, sortBy, setSortBy, totalItems, categories = ["Home Decor", "Household Goods", "Customized Items"] }) {
  const displayCategories = ["All", ...categories];

  return (
    <div className="w-full py-8 border-b border-brand-border flex flex-col md:flex-row md:items-center md:justify-between gap-6 px-4 md:px-0 max-w-7xl mx-auto">
      
      {/* Category Tabs */}
      <div className="flex items-center overflow-x-auto scrollbar-none gap-2 pb-2 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0">
        {displayCategories.map((category) => {
          const isActive = selectedCategory === category;
          const buttonId = `filter-btn-${category.toLowerCase().replace(/\s+/g, '-')}`;
          return (
            <button
              key={category}
              id={buttonId}
              onClick={() => setSelectedCategory(category)}
              className={`whitespace-nowrap px-5 py-2.5 text-[10px] font-bold tracking-widest uppercase rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-brand-gold text-brand-charcoal shadow-lg shadow-brand-gold/15" 
                  : "bg-brand-stone/40 border border-brand-border text-stone-500 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white hover:border-brand-gold/50"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Stats and Sorting */}
      <div className="flex items-center justify-between md:justify-end gap-6">
        <span className="text-[10px] font-medium text-stone-500 tracking-wider uppercase">
          {totalItems} {totalItems === 1 ? 'item' : 'items'}
        </span>

        <div className="flex items-center gap-3">
          <label htmlFor="sort" className="text-[10px] font-bold uppercase tracking-widest text-stone-500 select-none">
            Sort
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-brand-stone border border-brand-border rounded-md px-3 py-2 text-[10px] font-bold tracking-widest text-stone-800 dark:text-stone-300 outline-none cursor-pointer focus:border-brand-gold/50 transition-colors duration-300"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value} className="bg-brand-stone text-stone-800 dark:text-stone-300">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
    </div>
  );
}
