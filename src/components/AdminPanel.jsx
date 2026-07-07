import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Tag, Plus, Edit2, Trash2, 
  Image as ImageIcon, ArrowLeft, Check, X, Coins, Settings2, FilePlus, LogOut
} from 'lucide-react';
import { db } from '../lib/supabase';
export default function AdminPanel({ products, setProducts, categories, onClose, onLogout }) {
  const [activeTab, setActiveTab] = useState('products'); // dashboard, products, categories
  const [editingProduct, setEditingProduct] = useState(null); // null or product object
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Category management states
  const [localCategories, setLocalCategories] = useState(categories);
  const [newCategoryName, setNewCategoryName] = useState('');
  
  // Form states
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDetails, setFormDetails] = useState(['']);
  const [formImages, setFormImages] = useState([]);
  const [formCustomizable, setFormCustomizable] = useState(false);
  const [formCustomizationLabel, setFormCustomizationLabel] = useState('');

  const fileInputRef = useRef(null);

  // Stats calculation
  const totalProducts = products.length;
  const totalValue = products.reduce((acc, curr) => acc + curr.price, 0);
  const totalCategories = localCategories.length;
  const customizableCount = products.filter(p => p.customizable).length;

  const handleOpenForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormId(product.id);
      setFormTitle(product.title);
      setFormCategory(product.category);
      setFormPrice(product.price);
      setFormOriginalPrice(product.originalPrice || '');
      setFormDescription(product.description);
      setFormDetails([...product.details]);
      setFormImages([...product.images]);
      setFormCustomizable(product.customizable);
      setFormCustomizationLabel(product.customizationLabel || '');
    } else {
      setEditingProduct(null);
      // Auto generate a premium ID based on existing ones
      const nextNum = products.length + 1;
      setFormId(`FX-0${nextNum < 10 ? '0' + nextNum : nextNum}`);
      setFormTitle('');
      setFormCategory(localCategories[0] || '');
      setFormPrice(0);
      setFormOriginalPrice('');
      setFormDescription('');
      setFormDetails(['']);
      setFormImages([]);
      setFormCustomizable(false);
      setFormCustomizationLabel('');
    }
    setIsFormOpen(true);
  };

  const handleAddDetailRow = () => {
    setFormDetails(prev => [...prev, '']);
  };

  const handleRemoveDetailRow = (index) => {
    setFormDetails(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleDetailChange = (index, val) => {
    setFormDetails(prev => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  // Convert uploaded image to Base64
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setFormImages(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formId.trim()) return;

    // Prevent duplicate IDs on creations
    if (!editingProduct && products.some(p => p.id === formId.trim())) {
      alert("A product with this ID already exists!");
      return;
    }

    const filteredDetails = formDetails.filter(d => d.trim() !== '');

    const savedProduct = {
      id: formId.trim(),
      title: formTitle.trim(),
      category: formCategory,
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : null,
      description: formDescription.trim(),
      details: filteredDetails.length > 0 ? filteredDetails : ["Standard specifications"],
      images: formImages.length > 0 ? formImages : ["/images/vase_1.jpg"], // fallback cover
      customizable: formCustomizable,
      customizationLabel: formCustomizable ? formCustomizationLabel.trim() : ""
    };

    try {
      await db.saveProduct(savedProduct);

      setProducts(prev => {
        const exists = prev.some(p => p.id === savedProduct.id);
        if (exists) {
          return prev.map(p => p.id === savedProduct.id ? savedProduct : p);
        } else {
          return [...prev, savedProduct];
        }
      });

      setIsFormOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert("Failed to save product to database: " + (err.message || err));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This will remove it for all users across all devices.")) {
      try {
        await db.deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch (err) {
        alert("Failed to delete product: " + (err.message || err));
      }
    }
  };

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



  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-brand-charcoal text-white flex flex-col font-sans">
      
      {/* Top Banner Header */}
      <header className="h-20 bg-brand-stone border-b border-brand-border px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 border border-brand-border rounded-full hover:bg-brand-stone-hover hover:border-brand-gold transition-all duration-300"
            aria-label="Back to catalog"
          >
            <ArrowLeft className="w-5 h-5 text-stone-900 dark:text-white" />
          </button>
          <div>
            <h1 className="font-serif text-xl font-light text-stone-900 dark:text-white tracking-widest uppercase">
              FABRIX CONTROL
            </h1>
            <span className="text-[9px] font-bold text-brand-gold tracking-[0.2em] uppercase">
              Catalog Management Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">

          {onLogout && (
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to sign out?")) {
                  onLogout();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 border border-stone-800 hover:border-rose-500/40 hover:bg-rose-500/5 text-xs tracking-wider uppercase text-stone-400 hover:text-rose-500 transition-all duration-300 rounded-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 flex-col lg:flex-row">
        
        {/* Sidebar tabs */}
        <aside className="w-full lg:w-64 bg-stone-950 p-6 border-r border-brand-border/60 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-3 px-5 py-4 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'dashboard'
                ? 'bg-brand-gold text-brand-charcoal shadow-lg shadow-brand-gold/10'
                : 'text-stone-400 hover:text-white hover:bg-stone-900/50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-3 px-5 py-4 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'products'
                ? 'bg-brand-gold text-brand-charcoal shadow-lg shadow-brand-gold/10'
                : 'text-stone-400 hover:text-white hover:bg-stone-900/50'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Products ({totalProducts})
          </button>
          
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 lg:flex-initial flex items-center justify-center lg:justify-start gap-3 px-5 py-4 rounded-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'categories'
                ? 'bg-brand-gold text-brand-charcoal shadow-lg shadow-brand-gold/10'
                : 'text-stone-400 hover:text-white hover:bg-stone-900/50'
            }`}
          >
            <Tag className="w-4 h-4" />
            Categories ({totalCategories})
          </button>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 p-6 sm:p-10 bg-brand-charcoal overflow-y-auto max-h-[calc(100vh-5rem)]">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-10">
              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-2xl font-light tracking-wide text-white">
                  Operational Dashboard
                </h2>
                <p className="text-xs text-stone-500 font-light">
                  A high-level view of your current product catalog assets stored in this browser session.
                </p>
              </div>

              {/* Stats Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Stat 1 */}
                <div className="bg-[#151513] border border-brand-border p-6 rounded-sm flex items-center gap-4">
                  <div className="p-3 bg-brand-gold/10 rounded-full">
                    <ShoppingBag className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
                      Total Products
                    </span>
                    <span className="text-2xl font-bold font-serif text-white">{totalProducts}</span>
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-[#151513] border border-brand-border p-6 rounded-sm flex items-center gap-4">
                  <div className="p-3 bg-emerald-600/10 rounded-full">
                    <Coins className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
                      Catalog Valuation
                    </span>
                    <span className="text-xl font-bold font-serif text-emerald-500">{formatPrice(totalValue)}</span>
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-[#151513] border border-brand-border p-6 rounded-sm flex items-center gap-4">
                  <div className="p-3 bg-cyan-600/10 rounded-full">
                    <Tag className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
                      Active Categories
                    </span>
                    <span className="text-2xl font-bold font-serif text-white">{totalCategories}</span>
                  </div>
                </div>

                {/* Stat 4 */}
                <div className="bg-[#151513] border border-brand-border p-6 rounded-sm flex items-center gap-4">
                  <div className="p-3 bg-amber-600/10 rounded-full">
                    <Settings2 className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest block">
                      Bespoke (Customizable)
                    </span>
                    <span className="text-2xl font-bold font-serif text-white">{customizableCount}</span>
                  </div>
                </div>

              </div>

              {/* Quick info alerts */}
              <div className="bg-[#121210] border border-brand-border/60 p-6 rounded-sm max-w-3xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-gold mb-2">
                  ℹ️ Static vs Persistent Storage Details
                </h4>
                <p className="text-stone-400 text-xs leading-relaxed font-light">
                  This admin page manages products inside the browser's <strong>localStorage</strong>. All edits, creations, and deletions occur in real-time and will persist on this machine across browser restarts. If you'd like to push these changes to Vercel permanently, you can extract the saved database or let us commit updates back to your source repository files.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGER */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Header Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl font-light text-white">
                    Catalog Inventory
                  </h2>
                  <p className="text-xs text-stone-500 font-light">
                    Add, edit, or remove catalog items.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenForm()}
                  className="flex items-center justify-center gap-2.5 px-5 py-3.5 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover active:scale-[0.99] transition-all duration-300 rounded-sm shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-[#151513] border border-brand-border rounded-sm overflow-hidden mt-6 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-brand-border/60 bg-stone-950 text-[10px] font-bold tracking-wider text-stone-500 uppercase">
                        <th className="py-4 px-6">Image</th>
                        <th className="py-4 px-6">Product details</th>
                        <th className="py-4 px-6">ID</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6 text-center">Bespoke</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40 text-xs font-light">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-900/30 transition-colors duration-150">
                          {/* Image */}
                          <td className="py-4 px-6">
                            <img 
                              src={p.images[0]} 
                              alt={p.title} 
                              className="w-12 h-12 object-cover rounded-sm border border-brand-border bg-brand-charcoal"
                            />
                          </td>
                          {/* Title */}
                          <td className="py-4 px-6 font-medium">
                            <span className="text-stone-200 text-sm font-serif">{p.title}</span>
                          </td>
                          {/* ID */}
                          <td className="py-4 px-6">
                            <span className="font-mono text-stone-400">{p.id}</span>
                          </td>
                          {/* Category */}
                          <td className="py-4 px-6">
                            <span className="whitespace-nowrap px-2.5 py-1 bg-stone-900 border border-brand-border text-[9px] font-bold tracking-widest uppercase text-stone-400 rounded-sm">
                              {p.category}
                            </span>
                          </td>
                          {/* Price */}
                          <td className="py-4 px-6 text-brand-gold font-semibold whitespace-nowrap">
                            <div className="flex flex-col">
                              <span>{formatPrice(p.price)}</span>
                              {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                                <span className="text-[10px] text-stone-500 line-through font-normal">
                                  {formatPrice(p.originalPrice)}
                                </span>
                              )}
                            </div>
                          </td>
                          {/* Customizable */}
                          <td className="py-4 px-6 text-center">
                            {p.customizable ? (
                              <span className="text-brand-gold text-[9px] font-bold tracking-widest uppercase bg-brand-gold/10 px-2 py-0.5 border border-brand-gold/25 rounded-sm">Yes</span>
                            ) : (
                              <span className="text-stone-600 text-[9px] font-bold tracking-widest uppercase">No</span>
                            )}
                          </td>
                          {/* Actions */}
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenForm(p)}
                                className="p-2 border border-brand-border text-stone-400 hover:text-white hover:border-brand-gold hover:bg-brand-stone/5 transition-all duration-300 rounded-sm"
                                aria-label="Edit product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="p-2 border border-brand-border text-stone-400 hover:text-rose-500 hover:border-rose-500 hover:bg-rose-500/5 transition-all duration-300 rounded-sm"
                                aria-label="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {products.length === 0 && (
                  <div className="py-16 text-center text-stone-500 italic font-light">
                    Your catalog is currently empty. Click "+ Add New Product" to start building.
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGER */}
          {activeTab === 'categories' && (
            <div className="space-y-8 max-w-3xl">
              
              <div className="flex flex-col gap-2">
                <h2 className="font-serif text-2xl font-light text-white">
                  Categories Manager
                </h2>
                <p className="text-xs text-stone-500 font-light">
                  Add or delete active catalog filter categories.
                </p>
              </div>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="flex gap-3 bg-[#151513] border border-brand-border p-5 rounded-sm shadow-md">
                <input
                  type="text"
                  placeholder="New Category Name (e.g. 'Office Decor')..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
                />
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Category
                </button>
              </form>

              {/* Categories list */}
              <div className="bg-[#151513] border border-brand-border rounded-sm divide-y divide-brand-border/40 shadow-xl">
                {localCategories.map((c) => (
                  <div key={c} className="flex items-center justify-between p-5 hover:bg-stone-900/10 transition-colors duration-150">
                    <div className="flex items-center gap-3">
                      <Tag className="w-4 h-4 text-brand-gold" />
                      <span className="text-xs uppercase tracking-widest font-bold text-stone-200">{c}</span>
                      <span className="text-[10px] text-stone-500 font-light">
                        ({products.filter(p => p.category === c).length} items)
                      </span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(c)}
                      className="p-2 border border-brand-border text-stone-400 hover:text-rose-500 hover:border-rose-500 hover:bg-rose-500/5 transition-all duration-300 rounded-sm"
                      aria-label="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </main>
      </div>

      {/* MODAL: ADD / EDIT PRODUCT FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
          <div className="absolute inset-0" onClick={() => setIsFormOpen(false)}></div>
          
          {/* Form Box */}
          <form 
            onSubmit={handleSaveProduct}
            className="relative w-full max-w-3xl bg-[#151513] border border-brand-border shadow-2xl rounded-sm flex flex-col z-10 max-h-[90vh] overflow-y-auto animate-scale-in"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-brand-border/60 bg-stone-950 flex items-center justify-between">
              <div>
                <h3 className="font-serif text-lg font-light text-white tracking-widest uppercase">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
                </h3>
                <span className="text-[9px] font-bold text-brand-gold tracking-widest uppercase block mt-0.5">
                  {editingProduct ? `ID: ${editingProduct.id}` : 'Create a fresh catalog entry'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="p-1.5 border border-stone-800 text-stone-400 hover:text-white rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              
              {/* Row 1: ID, Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="prod-id" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Product ID *
                  </label>
                  <input
                    type="text"
                    id="prod-id"
                    required
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    disabled={!!editingProduct}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white disabled:opacity-50 transition-all duration-300"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="prod-title" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    id="prod-title"
                    required
                    placeholder="Minimalist Clay Pot..."
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Row 2: Category, Selling Price & Original Price */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="prod-cat" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Category
                  </label>
                  <select
                    id="prod-cat"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-stone-300 cursor-pointer transition-all duration-300"
                  >
                    {localCategories.map((c) => (
                      <option key={c} value={c} className="bg-brand-charcoal text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="prod-price" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Selling Price (INR) *
                  </label>
                  <input
                    type="number"
                    id="prod-price"
                    required
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
                  />
                </div>

                <div>
                  <label htmlFor="prod-mrp" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2 flex items-center justify-between">
                    <span>Original Price (MRP)</span>
                    <span className="text-[8px] font-light text-stone-500 lowercase">(optional)</span>
                  </label>
                  <input
                    type="number"
                    id="prod-mrp"
                    min="0"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 2000"
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label htmlFor="prod-desc" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                  Description
                </label>
                <textarea
                  id="prod-desc"
                  rows={3}
                  placeholder="Enter a premium, editorial product description..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3.5 outline-none text-white resize-none transition-all duration-300"
                />
              </div>

              {/* Row 4: Dynamic Specifications List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Details & Specifications
                  </label>
                  <button
                    type="button"
                    onClick={handleAddDetailRow}
                    className="flex items-center gap-1 text-[9px] font-bold tracking-widest text-brand-gold uppercase hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Detail
                  </button>
                </div>
                <div className="space-y-2">
                  {formDetails.map((detail, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. Material: 100% Stoneware..."
                        value={detail}
                        onChange={(e) => handleDetailChange(idx, e.target.value)}
                        className="flex-grow bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-2.5 outline-none text-white transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveDetailRow(idx)}
                        disabled={formDetails.length === 1}
                        className="p-2 border border-brand-border text-stone-500 hover:text-rose-500 hover:border-rose-500 transition-all duration-300 rounded-sm disabled:opacity-30"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 5: Customizable Toggle */}
              <div className="p-4 bg-brand-charcoal border border-brand-border rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold tracking-wider text-white">
                    Enable Monogram / Custom Engraving
                  </span>
                  <span className="text-[10px] text-stone-500 font-light mt-0.5">
                    If checked, users can submit custom request text before clicking inquire.
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="prod-customizable"
                    checked={formCustomizable}
                    onChange={(e) => setFormCustomizable(e.target.checked)}
                    className="w-4 h-4 accent-brand-gold cursor-pointer"
                  />
                  <label htmlFor="prod-customizable" className="text-xs font-semibold text-stone-300 cursor-pointer">
                    Customizable
                  </label>
                </div>
              </div>

              {/* Customizable Label input */}
              {formCustomizable && (
                <div className="animate-scale-in">
                  <label htmlFor="prod-custom-label" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                    Customization Prompt Label
                  </label>
                  <input
                    type="text"
                    id="prod-custom-label"
                    placeholder="e.g. Initials (Max 3 characters) or Name..."
                    value={formCustomizationLabel}
                    onChange={(e) => setFormCustomizationLabel(e.target.value)}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
                  />
                </div>
              )}

              {/* Row 6: Image Uploads & Previews */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Product Images (Base64 or URL Paths)
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-border hover:border-brand-gold hover:text-brand-gold text-[9px] font-bold tracking-widest text-stone-400 uppercase transition-all duration-300 rounded-sm"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Upload Image
                  </button>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Previews grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 p-4 bg-brand-charcoal border border-brand-border rounded-sm">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-sm border border-brand-border overflow-hidden bg-stone-900 group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-500 transition-all duration-200"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {formImages.length === 0 && (
                    <div className="col-span-full py-6 text-center text-stone-600 text-xs italic font-light">
                      No images added. Click "Upload Image" to add photos.
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4 border-t border-brand-border bg-stone-950 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-3 border border-brand-border text-stone-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors duration-300 rounded-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm"
              >
                <Check className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
