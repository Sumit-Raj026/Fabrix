import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Tag, Package, Briefcase, ArrowLeft, LogOut
} from 'lucide-react';
import { CONFIG } from '../../config';

import AdminDashboard from './AdminDashboard';
import ProductManagement from './ProductManagement';
import CategoryManagement from './CategoryManagement';
import InventoryPanel from './InventoryPanel';
import B2BManagement from './B2BManagement';

export default function AdminLayout({ products, categories, user, onClose, onLogout }) {
  const [activeTab, setActiveTab] = useState('products'); // dashboard, products, categories, inventory, b2b

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'b2b', label: 'B2B & Leads', icon: Briefcase },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard products={products} categories={categories} />;
      case 'products':
        return <ProductManagement products={products} categories={categories} />;
      case 'categories':
        return <CategoryManagement products={products} initialCategories={categories} />;
      case 'inventory':
        return <InventoryPanel />;
      case 'b2b':
        return <B2BManagement />;
      default:
        return <AdminDashboard products={products} categories={categories} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal text-white flex flex-col font-sans">
      {/* Top Banner Header */}
      <header className="h-20 bg-brand-stone border-b border-brand-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 border border-brand-border rounded-full hover:bg-brand-stone-hover hover:border-brand-gold transition-all duration-300"
            title="Return to Site"
          >
            <ArrowLeft className="w-4 h-4 text-stone-400 hover:text-brand-gold" />
          </button>
          <div>
            <h1 className="font-serif text-xl tracking-wide">{CONFIG.STORE_NAME} Admin</h1>
            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1">Management Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold tracking-wider">{user?.email}</span>
            <span className="text-[9px] text-brand-gold uppercase tracking-[0.2em]">Administrator</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-charcoal border border-brand-border flex items-center justify-center text-brand-gold font-serif">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <button 
            onClick={onLogout}
            className="ml-2 p-2 text-stone-400 hover:text-rose-500 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-grow flex flex-col md:flex-row h-[calc(100vh-5rem)] overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-stone-950/50 border-r border-brand-border flex-shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto hide-scrollbar">
          <nav className="p-4 flex md:flex-col gap-2 min-w-max md:min-w-0 w-full">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-300 text-left ${
                    isActive 
                      ? 'bg-brand-stone border border-brand-border text-brand-gold' 
                      : 'text-stone-400 hover:bg-brand-stone/40 hover:text-white border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-gold' : 'text-stone-500'}`} />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-grow bg-brand-charcoal overflow-y-auto p-4 md:p-8">
          <div className="max-w-[1600px] mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>
    </div>
  );
}
