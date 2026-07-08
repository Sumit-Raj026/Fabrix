import React, { useState } from 'react';
import { Tag, Plus, Trash2 } from 'lucide-react';

export default function CategoryManagement({ initialCategories }) {
  const [localCategories, setLocalCategories] = useState(initialCategories || []);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const clean = newCategoryName.trim();
    if (localCategories.includes(clean)) {
      alert("Category already exists!");
      return;
    }
    setLocalCategories(prev => [...prev, clean]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (cat) => {
    if (window.confirm(`Are you sure you want to delete "${cat}"? Products in this category will not be deleted, but you should re-assign them.`)) {
      setLocalCategories(prev => prev.filter(c => c !== cat));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-serif font-light tracking-wide text-white mb-2">Category Management</h2>
          <p className="text-xs text-stone-400 font-light">Organize your products with categories.</p>
        </div>
      </div>

      <div className="bg-brand-stone border border-brand-border rounded-sm p-6 max-w-2xl">
        <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
          <input 
            type="text" 
            placeholder="New Category Name..." 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="flex-grow bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
          />
          <button 
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4">Existing Categories</h3>
          {localCategories.map((cat, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-brand-border bg-brand-charcoal rounded-sm group hover:border-brand-gold/50 transition-colors duration-300">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-stone-500 group-hover:text-brand-gold transition-colors duration-300" />
                <span className="text-sm tracking-wide text-stone-200">{cat}</span>
              </div>
              <button 
                onClick={() => handleDeleteCategory(cat)}
                className="p-2 text-stone-500 hover:text-rose-500 transition-colors duration-300"
                title="Delete Category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {localCategories.length === 0 && (
            <div className="p-8 text-center text-stone-500 text-xs italic font-light border border-brand-border border-dashed rounded-sm">
              No categories found. Create your first one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
