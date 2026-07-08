import React from 'react';
import { ShoppingBag, Tag, Coins } from 'lucide-react';

export default function AdminDashboard({ products, categories }) {
  const totalProducts = products.length;
  const totalValue = products.reduce((acc, curr) => acc + curr.price, 0);
  const totalCategories = categories.length;
  const customizableCount = products.filter(p => p.customizable).length;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-serif font-light tracking-wide text-white mb-2">Dashboard Overview</h2>
        <p className="text-xs text-stone-400 font-light">At a glance view of your catalog and business metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat Cards */}
        <div className="bg-brand-stone border border-brand-border p-6 rounded-sm relative overflow-hidden group hover:border-brand-gold transition-colors duration-300">
          <ShoppingBag className="absolute -right-4 -bottom-4 w-24 h-24 text-stone-900 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Total Products</h4>
            <p className="text-3xl font-serif text-white">{totalProducts}</p>
          </div>
        </div>

        <div className="bg-brand-stone border border-brand-border p-6 rounded-sm relative overflow-hidden group hover:border-brand-gold transition-colors duration-300">
          <Tag className="absolute -right-4 -bottom-4 w-24 h-24 text-stone-900 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Categories</h4>
            <p className="text-3xl font-serif text-white">{totalCategories}</p>
          </div>
        </div>

        <div className="bg-brand-stone border border-brand-border p-6 rounded-sm relative overflow-hidden group hover:border-brand-gold transition-colors duration-300">
          <Coins className="absolute -right-4 -bottom-4 w-24 h-24 text-stone-900 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Catalog Value</h4>
            <p className="text-3xl font-serif text-white">{formatPrice(totalValue)}</p>
          </div>
        </div>

        <div className="bg-brand-stone border border-brand-border p-6 rounded-sm relative overflow-hidden group hover:border-brand-gold transition-colors duration-300">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 text-stone-900 opacity-50 group-hover:opacity-100 transition-opacity duration-300 font-serif text-[120px] leading-none flex items-center justify-center">C</div>
          <div className="relative z-10">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Customizable</h4>
            <p className="text-3xl font-serif text-white">{customizableCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
