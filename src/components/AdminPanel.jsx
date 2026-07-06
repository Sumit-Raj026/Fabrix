import React, { useState } from 'react';
import { 
  Lock, Plus, Edit, Trash2, Download, Copy, 
  LogOut, RefreshCw, Check, FileText, LayoutDashboard, 
  Tag, IndianRupee, Sparkles, X, ChevronRight 
} from 'lucide-react';
import { CONFIG } from '../config';
import { PRODUCTS as DEFAULT_PRODUCTS } from '../data/products';

export default function AdminPanel({ products, setProducts, onClose }) {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // null for Add, object for Edit
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Home Decor');
  const [formPrice, setFormPrice] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDetails, setFormDetails] = useState(''); // Textarea, new line per spec
  const [formImages, setFormImages] = useState(['', '', '']); // Array of 3 image strings
  const [formCustomizable, setFormCustomizable] = useState(false);
  const [formCustomizationLabel, setFormCustomizationLabel] = useState('');

  // Handle Passcode Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === CONFIG.ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Incorrect passcode. Please try again.');
    }
  };

  // Open Form for Adding Product
  const handleAddClick = () => {
    // Auto-generate ID based on count
    const nextNum = products.length + 1;
    const nextId = `FX-${String(nextNum).padStart(3, '0')}`;
    
    setFormId(nextId);
    setFormTitle('');
    setFormCategory('Home Decor');
    setFormPrice('');
    setFormDescription('');
    setFormDetails('');
    setFormImages(['/images/vase_1.jpg', '/images/vase_2.jpg', '/images/vase_3.jpg']);
    setFormCustomizable(false);
    setFormCustomizationLabel('');
    
    setCurrentProduct(null);
    setIsFormOpen(true);
  };

  // Open Form for Editing Product
  const handleEditClick = (product) => {
    setFormId(product.id);
    setFormTitle(product.title);
    setFormCategory(product.category);
    setFormPrice(product.price.toString());
    setFormDescription(product.description);
    setFormDetails(product.details.join('\n'));
    setFormImages([
      product.images[0] || '',
      product.images[1] || '',
      product.images[2] || ''
    ]);
    setFormCustomizable(product.customizable || false);
    setFormCustomizationLabel(product.customizationLabel || '');
    
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  // Delete Product
  const handleDeleteClick = (productId) => {
    if (window.confirm(`Are you sure you want to delete product ID: ${productId}?`)) {
      const updated = products.filter(p => p.id !== productId);
      setProducts(updated);
      localStorage.setItem('fabrix_products', JSON.stringify(updated));
    }
  };

  // Reset to original data
  const handleResetDefaults = () => {
    if (window.confirm('This will restore all default products and erase any local changes. Proceed?')) {
      setProducts(DEFAULT_PRODUCTS);
      localStorage.removeItem('fabrix_products');
    }
  };

  // Submit Add/Edit Form
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formTitle || !formPrice) {
      alert('Please fill out all required fields.');
      return;
    }

    const newProduct = {
      id: formId,
      title: formTitle,
      category: formCategory,
      price: parseInt(formPrice, 10),
      description: formDescription,
      details: formDetails.split('\n').map(d => d.trim()).filter(d => d.length > 0),
      images: formImages.map(img => img.trim()).filter(img => img.length > 0),
      customizable: formCustomizable,
      customizationLabel: formCustomizable ? formCustomizationLabel : undefined
    };

    let updatedProducts;
    if (currentProduct) {
      // Edit mode
      updatedProducts = products.map(p => p.id === currentProduct.id ? newProduct : p);
    } else {
      // Add mode (prevent duplicate IDs)
      if (products.some(p => p.id === newProduct.id)) {
        alert(`A product with ID ${newProduct.id} already exists. Please choose a unique ID.`);
        return;
      }
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem('fabrix_products', JSON.stringify(updatedProducts));
    setIsFormOpen(false);
  };

  // Generate products.js code content
  const getCompiledCode = () => {
    return `// Mock product data for Fabrix catalog with local image paths for reliability

export const PRODUCTS = ${JSON.stringify(products, null, 2)};
`;
  };

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCompiledCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download products.js file
  const handleDownloadCode = () => {
    const code = getCompiledCode();
    const element = document.createElement("a");
    const file = new Blob([code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = "products.js";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Render Login Panel
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a09]/95 backdrop-blur-md">
        <div className="w-full max-w-md p-8 bg-brand-stone border border-brand-border rounded-sm shadow-2xl animate-scale-in">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-brand-gold/10 flex items-center justify-center mx-auto mb-4 border border-brand-gold/20">
              <Lock className="w-5 h-5 text-brand-gold" />
            </div>
            <h2 className="font-serif text-2xl font-light text-stone-900 dark:text-white uppercase tracking-wider">
              Admin Access
            </h2>
            <p className="text-stone-500 dark:text-stone-400 text-xs font-light mt-1">
              Enter passcode to unlock the Catalog Manager
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full text-center bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold rounded-sm py-3 px-4 outline-none text-stone-900 dark:text-white text-sm tracking-widest font-bold transition-all duration-300"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-[11px] text-red-500 text-center font-bold">
                {authError}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-3 bg-transparent border border-brand-border hover:border-stone-500 text-stone-600 dark:text-stone-300 font-bold text-xs tracking-widest uppercase rounded-sm transition-colors duration-250"
              >
                Back to Site
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-gold-hover font-bold text-xs tracking-widest uppercase rounded-sm transition-colors duration-250 shadow-md shadow-brand-gold/10"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#faf9f6] dark:bg-[#0a0a09] overflow-y-auto flex flex-col text-stone-900 dark:text-white transition-colors duration-300">
      
      {/* Admin Navbar */}
      <header className="sticky top-0 z-30 w-full bg-white dark:bg-[#111110] border-b border-brand-border h-20 px-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <LayoutDashboard className="w-5 h-5 text-brand-gold" />
          <h1 className="font-serif text-lg md:text-xl font-light uppercase tracking-widest text-stone-900 dark:text-white">
            {CONFIG.STORE_NAME} <span className="font-sans font-bold text-[10px] text-brand-gold px-2 py-0.5 bg-brand-gold/10 border border-brand-gold/20 rounded-full ml-1">Manager</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-brand-border hover:border-brand-gold text-xs font-bold tracking-wider uppercase text-stone-700 dark:text-stone-300 hover:text-brand-gold transition-all duration-300 rounded-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Publish Code</span>
          </button>
          <button
            onClick={handleResetDefaults}
            className="flex items-center gap-2 px-4 py-2 border border-brand-border hover:border-red-500 hover:text-red-500 text-xs font-bold tracking-wider uppercase text-stone-500 transition-all duration-300 rounded-sm"
            title="Reset to original code list"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 dark:bg-stone-100 hover:bg-brand-gold dark:hover:bg-brand-gold text-white dark:text-stone-900 hover:text-brand-charcoal dark:hover:text-brand-charcoal text-xs font-bold tracking-wider uppercase transition-all duration-300 rounded-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      {/* Admin Content Workspace */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-10 w-full relative">
        
        {/* Dashboard Cards Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-brand-stone border border-brand-border p-5 rounded-sm">
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 tracking-wider uppercase">Total Products</span>
            <div className="text-3xl font-serif font-light text-stone-900 dark:text-white mt-1">{products.length}</div>
          </div>
          <div className="bg-brand-stone border border-brand-border p-5 rounded-sm">
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 tracking-wider uppercase">Bespoke / Customizable</span>
            <div className="text-3xl font-serif font-light text-stone-900 dark:text-white mt-1">
              {products.filter(p => p.customizable).length}
            </div>
          </div>
          <div className="bg-brand-stone border border-brand-border p-5 rounded-sm">
            <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500 tracking-wider uppercase">Active Categories</span>
            <div className="text-3xl font-serif font-light text-stone-900 dark:text-white mt-1">
              {new Set(products.map(p => p.category)).size}
            </div>
          </div>
          <div className="bg-brand-stone border border-brand-border p-5 rounded-sm flex items-center justify-between hover:border-brand-gold transition-all duration-300 cursor-pointer" onClick={handleAddClick}>
            <div>
              <span className="text-[10px] font-bold text-brand-gold tracking-wider uppercase">Quick Actions</span>
              <div className="text-sm font-bold uppercase tracking-widest mt-1 text-stone-900 dark:text-white">Add New Product</div>
            </div>
            <Plus className="w-6 h-6 text-brand-gold" />
          </div>
        </div>

        {/* Product Management Section */}
        <div className="bg-brand-stone border border-brand-border rounded-sm shadow-sm overflow-hidden mb-12">
          <div className="p-6 border-b border-brand-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="font-serif text-lg font-light text-stone-900 dark:text-white uppercase tracking-wider">
              Manage Catalog Items
            </h3>
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-brand-gold text-brand-charcoal hover:bg-brand-gold-hover font-bold text-xs tracking-wider uppercase rounded-sm transition-colors duration-250 shadow-md shadow-brand-gold/10"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Item</span>
            </button>
          </div>

          {/* Product Items Table */}
          {products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-50 dark:bg-[#111110] border-b border-brand-border text-[9px] font-bold text-stone-550 uppercase tracking-widest">
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-6">ID</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Type</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border/60">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-stone-50/50 dark:hover:bg-[#151513]/55 transition-colors duration-200">
                      {/* Product Info with Image */}
                      <td className="py-4 px-6 flex items-center gap-4 min-w-[280px]">
                        <img 
                          src={product.images[0] || '/images/vase_1.jpg'} 
                          alt={product.title} 
                          className="w-12 h-15 object-cover rounded-sm border border-brand-border bg-stone-100"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-stone-900 dark:text-white truncate">
                            {product.title}
                          </h4>
                          <p className="text-[10px] text-stone-400 dark:text-stone-500 line-clamp-1 mt-0.5 max-w-sm">
                            {product.description}
                          </p>
                        </div>
                      </td>
                      
                      {/* ID */}
                      <td className="py-4 px-6 text-xs text-stone-500 font-mono">
                        {product.id}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6 text-xs text-stone-700 dark:text-stone-300">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="py-4 px-6 text-xs font-semibold text-brand-gold">
                        {formatPrice(product.price)}
                      </td>

                      {/* Customizable Badge */}
                      <td className="py-4 px-6">
                        {product.customizable ? (
                          <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full">
                            Bespoke
                          </span>
                        ) : (
                          <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400 bg-stone-500/10 border border-stone-550/20 px-2.5 py-1 rounded-full">
                            Standard
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={() => handleEditClick(product)}
                            className="p-2 border border-brand-border hover:border-brand-gold text-stone-500 hover:text-brand-gold transition-colors duration-200 rounded-sm"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(product.id)}
                            className="p-2 border border-brand-border hover:border-red-500 text-stone-500 hover:text-red-500 transition-colors duration-200 rounded-sm"
                            title="Delete Product"
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
          ) : (
            <div className="text-center py-20 px-6 italic text-stone-400 text-xs">
              No products found in the catalog. Click "Add New Item" to populate the database.
            </div>
          )}
        </div>

      </main>

      {/* --- ADD / EDIT PRODUCT SLIDE-OVER FORM MODAL --- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-md">
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={() => setIsFormOpen(false)}></div>
          
          <div className="relative w-full max-w-2xl bg-brand-stone border border-brand-border rounded-sm shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh] animate-scale-in">
            {/* Form Header */}
            <div className="p-6 border-b border-brand-border/60 flex items-center justify-between bg-stone-50 dark:bg-[#111110]">
              <h3 className="font-serif text-lg font-light text-stone-900 dark:text-white uppercase tracking-wider">
                {currentProduct ? `Edit Catalog Product (${formId})` : 'Add New Product'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 border border-brand-border rounded-full hover:border-brand-gold text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields Body */}
            <form onSubmit={handleFormSubmit} className="flex-grow overflow-y-auto p-6 space-y-6">
              
              {/* Row 1: ID, Title, Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">Product ID *</label>
                  <input
                    type="text"
                    required
                    value={formId}
                    onChange={(e) => setFormId(e.target.value.toUpperCase())}
                    className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold rounded-sm p-3 outline-none text-xs text-stone-900 dark:text-white font-mono"
                    placeholder="e.g. FX-007"
                    disabled={!!currentProduct} // Keep original ID fixed in edit mode
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold rounded-sm p-3 outline-none text-xs text-stone-900 dark:text-white"
                    placeholder="e.g. Solid Wood Candlestick Set"
                  />
                </div>
              </div>

              {/* Row 2: Category, Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold rounded-sm p-3 outline-none text-xs text-stone-850 dark:text-stone-300 cursor-pointer"
                  >
                    <option value="Home Decor" className="bg-brand-stone">Home Decor</option>
                    <option value="Household Goods" className="bg-brand-stone">Household Goods</option>
                    <option value="Customized Items" className="bg-brand-stone">Customized Items</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">Price (INR) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold rounded-sm py-3 pl-7 pr-3 outline-none text-xs text-stone-900 dark:text-white"
                      placeholder="e.g. 1950"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold rounded-sm p-3 outline-none text-xs text-stone-900 dark:text-white resize-none"
                  placeholder="Enter high-end marketing copy/description..."
                />
              </div>

              {/* Row 4: Specifications / Details */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Specifications & Material Details <span className="text-stone-400 font-normal">(One detail per line)</span>
                </label>
                <textarea
                  rows={4}
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold rounded-sm p-3 outline-none text-xs text-stone-900 dark:text-white resize-y font-light leading-relaxed"
                  placeholder={`e.g.\nMaterial: 100% Stoneware Ceramic\nDimensions: 10" Height\nFinish: Sand Matte Rub\nCare: Hand wash only`}
                />
              </div>

              {/* Row 5: Photo Gallery (3 Image paths/URLs) */}
              <div className="space-y-4">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Product Image URLs / Local Paths <span className="text-stone-400 font-normal">(Provide 3 for the modal gallery)</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {formImages.map((img, idx) => (
                    <div key={idx}>
                      <span className="text-[9px] font-bold text-stone-400 block mb-1">Image {idx + 1}</span>
                      <input
                        type="text"
                        value={img}
                        onChange={(e) => {
                          const newImages = [...formImages];
                          newImages[idx] = e.target.value;
                          setFormImages(newImages);
                        }}
                        className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold rounded-sm p-2 outline-none text-[10px] text-stone-900 dark:text-white font-mono"
                        placeholder="/images/vase_1.jpg"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Customization checkbox */}
              <div className="p-4 bg-stone-50 dark:bg-[#111110] border border-brand-border rounded-sm flex flex-col gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formCustomizable}
                    onChange={(e) => setFormCustomizable(e.target.checked)}
                    className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold border-brand-border bg-white"
                  />
                  <div>
                    <span className="text-xs font-bold text-stone-900 dark:text-white">Enable Bespoke Customization</span>
                    <p className="text-[10px] text-stone-450 dark:text-stone-500 font-light mt-0.5">
                      Check this box if the customer can personalize this product (monograms, text, engraving, sizes).
                    </p>
                  </div>
                </label>

                {formCustomizable && (
                  <div className="animate-scale-in">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-gold mb-1.5">
                      Customization Instruction Label
                    </label>
                    <input
                      type="text"
                      required={formCustomizable}
                      value={formCustomizationLabel}
                      onChange={(e) => setFormCustomizationLabel(e.target.value)}
                      className="w-full bg-white dark:bg-[#1c1c1a] border border-brand-border focus:border-brand-gold rounded-sm p-2.5 outline-none text-xs text-stone-900 dark:text-white"
                      placeholder="e.g. Monogram Lettering (Max 3 characters)"
                    />
                  </div>
                )}
              </div>

              {/* Form Buttons Footer */}
              <div className="flex gap-3 pt-4 border-t border-brand-border/60">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="w-1/2 py-3 bg-transparent border border-brand-border hover:border-stone-500 text-stone-600 dark:text-stone-300 font-bold text-xs tracking-widest uppercase rounded-sm transition-colors duration-250"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-brand-gold text-brand-charcoal hover:bg-brand-gold-hover font-bold text-xs tracking-widest uppercase rounded-sm transition-colors duration-250 shadow-md shadow-brand-gold/10"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- EXPORT / PUBLISH CODE DIALOG MODAL --- */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/80 backdrop-blur-md">
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={() => setIsExportOpen(false)}></div>
          
          <div className="relative w-full max-w-3xl bg-brand-stone border border-brand-border rounded-sm shadow-2xl overflow-hidden flex flex-col z-10 max-h-[90vh] animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-brand-border/60 flex items-center justify-between bg-stone-50 dark:bg-[#111110]">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-brand-gold" />
                <h3 className="font-serif text-lg font-light text-stone-900 dark:text-white uppercase tracking-wider">
                  Publish Catalog Changes
                </h3>
              </div>
              <button 
                onClick={() => setIsExportOpen(false)}
                className="p-1 border border-brand-border rounded-full hover:border-brand-gold text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              <div className="p-4 bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-450 rounded-sm">
                <p className="text-xs leading-relaxed font-semibold">
                  ⚠️ <strong>Publishing Guide:</strong> Saving products here keeps them stored inside your browser's local memory. To publish them permanently to Vercel so that all visitors see them:
                </p>
                <ol className="text-xs list-decimal list-inside space-y-1.5 mt-2.5 font-light text-stone-700 dark:text-stone-300">
                  <li>Click <strong>"Download products.js"</strong> below.</li>
                  <li>Replace your project's local file at <strong>`src/data/products.js`</strong> with this downloaded file.</li>
                  <li>Commit and push the changes to GitHub. Vercel will automatically redeploy the new database!</li>
                </ol>
              </div>

              {/* Code block box */}
              <div className="relative bg-[#111110] border border-brand-border rounded-sm">
                <div className="absolute right-3 top-3 flex items-center gap-2 z-10">
                  <button
                    onClick={handleCopyCode}
                    className="p-2 bg-brand-stone border border-brand-border text-stone-400 hover:text-white rounded-sm hover:border-brand-gold transition-all duration-200 flex items-center gap-1.5 text-[9px] font-bold tracking-wider uppercase"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
                <div className="p-4 overflow-x-auto text-[10px] font-mono text-stone-300 max-h-[300px] leading-relaxed select-all">
                  <pre>{getCompiledCode()}</pre>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(false)}
                  className="w-1/2 py-4 bg-transparent border border-brand-border hover:border-stone-500 text-stone-600 dark:text-stone-300 font-bold text-xs tracking-widest uppercase rounded-sm transition-colors duration-250"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleDownloadCode}
                  className="w-1/2 py-4 bg-brand-gold text-brand-charcoal hover:bg-brand-gold-hover font-bold text-xs tracking-widest uppercase rounded-sm transition-colors duration-250 flex items-center justify-center gap-2 shadow-md shadow-brand-gold/10"
                >
                  <Download className="w-4 h-4" />
                  Download products.js
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
