import React, { useState } from 'react';
import { Tag, Plus, Trash2, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../../lib/supabase';

export default function CategoryManagement({ products, initialCategories }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const queryClient = useQueryClient();

  // Add Mutation
  const addMutation = useMutation({
    mutationFn: async (name) => {
      return await db.saveCategory(name);
    },
    onSuccess: () => {
      // Invalidate and refetch categories site-wide
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategoryName('');
    },
    onError: (err) => {
      alert("Failed to add category. It may already exist.");
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (name) => {
      return await db.deleteCategory(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (err) => {
      alert("Failed to delete category.");
    }
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const clean = newCategoryName.trim();
    
    // Check if it already exists locally first for quick feedback
    if (initialCategories.includes(clean)) {
      alert("Category already exists!");
      return;
    }

    addMutation.mutate(clean);
  };

  const handleDeleteCategory = (cat) => {
    if (window.confirm(`Are you sure you want to delete "${cat}"? Products currently in this category will not be deleted, but you should re-assign them to a valid category.`)) {
      deleteMutation.mutate(cat);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-serif font-light tracking-wide text-white mb-2">Category Management</h2>
          <p className="text-xs text-stone-400 font-light">Manage your global product categories.</p>
        </div>
      </div>

      <div className="bg-brand-stone border border-brand-border rounded-sm p-6 max-w-2xl">
        <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
          <input 
            type="text" 
            placeholder="New Category Name..." 
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={addMutation.isPending}
            className="flex-grow bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300 disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={addMutation.isPending}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm disabled:opacity-50 min-w-[120px]"
          >
            {addMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add</>}
          </button>
        </form>

        <div className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4 flex items-center justify-between">
            <span>Existing Categories ({initialCategories.length})</span>
            {deleteMutation.isPending && <Loader2 className="w-3 h-3 animate-spin text-brand-gold" />}
          </h3>
          
          {initialCategories.length === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs border border-dashed border-brand-border rounded-sm">
              No categories found in the database. Add one above!
            </div>
          ) : (
            initialCategories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-brand-border bg-brand-charcoal rounded-sm group hover:border-brand-gold/50 transition-colors duration-300">
                <div className="flex items-center gap-3">
                  <Tag className="w-4 h-4 text-stone-500 group-hover:text-brand-gold transition-colors duration-300" />
                  <span className="text-sm tracking-wide text-stone-200">{cat}</span>
                </div>
                <button 
                  onClick={() => handleDeleteCategory(cat)}
                  disabled={deleteMutation.isPending}
                  className="text-stone-500 hover:text-rose-500 transition-colors p-2 disabled:opacity-50"
                  title={`Delete ${cat}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
