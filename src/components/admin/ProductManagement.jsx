import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Image as ImageIcon, Check, X, Upload, Loader } from 'lucide-react';
import { db } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import SortableProductRow from './SortableProductRow';
import { useReorderProducts } from '../../hooks/useProducts';

export default function ProductManagement({ products, categories }) {
  const queryClient = useQueryClient();
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

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
  
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

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
      const nextNum = products.length + 1;
      setFormId(`FX-0${nextNum < 10 ? '0' + nextNum : nextNum}`);
      setFormTitle('');
      setFormCategory(categories[0] || '');
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

  const handleAddDetailRow = () => setFormDetails(prev => [...prev, '']);
  const handleRemoveDetailRow = (index) => setFormDetails(prev => prev.filter((_, idx) => idx !== index));
  const handleDetailChange = (index, value) => {
    const newDetails = [...formDetails];
    newDetails[index] = value;
    setFormDetails(newDetails);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress({});
    const uploadedUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        setUploadProgress(prev => ({ ...prev, [i]: 10 }));
        const url = await uploadToCloudinary(file, (pct) => {
          setUploadProgress(prev => ({ ...prev, [i]: pct }));
        });
        uploadedUrls.push(url);
      } catch (err) {
        console.error("Upload failed for file", file.name, err);
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    }
    if (uploadedUrls.length > 0) {
      setFormImages(prev => [...prev, ...uploadedUrls]);
    }
    setIsUploading(false);
    setTimeout(() => setUploadProgress({}), 2000);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (index) => setFormImages(prev => prev.filter((_, idx) => idx !== index));

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formId.trim()) return;

    if (!editingProduct && products.some(p => p.id === formId.trim())) {
      alert("A product with this ID already exists!");
      return;
    }

    const filteredDetails = formDetails.filter(d => d.trim() !== '');
    const savedProduct = {
      id: formId.trim(),
      title: formTitle.trim(),
      category: formCategory || categories[0],
      price: Number(formPrice),
      originalPrice: formOriginalPrice ? Number(formOriginalPrice) : null,
      description: formDescription.trim(),
      details: filteredDetails.length > 0 ? filteredDetails : ["Standard specifications"],
      images: formImages.length > 0 ? formImages : ["/images/vase_1.jpg"],
      customizable: formCustomizable,
      customizationLabel: formCustomizable ? formCustomizationLabel.trim() : ""
    };

    try {
      await db.saveProduct(savedProduct);
      queryClient.setQueryData(['products'], (prev) => {
        if (!prev) return [savedProduct];
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
      alert("Failed to save product: " + (err.message || err));
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await db.deleteProduct(productId);
        queryClient.setQueryData(['products'], (prev) => prev ? prev.filter(p => p.id !== productId) : []);
      } catch (err) {
        alert("Failed to delete product: " + (err.message || err));
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const reorderMutation = useReorderProducts();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = products.findIndex((p) => p.id === active.id);
      const newIndex = products.findIndex((p) => p.id === over.id);
      
      const newArray = arrayMove(products, oldIndex, newIndex);
      
      // Calculate new display orders
      const updates = newArray.map((prod, index) => ({
        id: prod.id,
        display_order: index
      }));
      
      reorderMutation.mutate(updates);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-serif font-light tracking-wide text-white mb-2">Product Catalog</h2>
          <p className="text-xs text-stone-400 font-light">Manage your products, descriptions, and images.</p>
        </div>
        {!isFormOpen && (
          <button 
            onClick={() => handleOpenForm()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {!isFormOpen ? (
        <div className="bg-brand-stone border border-brand-border rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-stone-950/80 text-[10px] uppercase font-bold tracking-widest text-stone-500">
                <tr>
                  <th className="px-4 py-4 w-10"></th>
                  <th className="px-6 py-4 font-bold">Product</th>
                  <th className="px-6 py-4 font-bold">Category</th>
                  <th className="px-6 py-4 font-bold">Price</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                <DndContext 
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext 
                    items={products.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {products.length > 0 ? products.map((product) => (
                      <SortableProductRow 
                        key={product.id} 
                        product={product} 
                        onEdit={handleOpenForm} 
                        onDelete={handleDeleteProduct} 
                        formatPrice={formatPrice} 
                      />
                    )) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-stone-500 text-xs italic font-light">
                          No products found. Add your first product to get started.
                        </td>
                      </tr>
                    )}
                  </SortableContext>
                </DndContext>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-brand-stone border border-brand-border rounded-sm overflow-hidden animate-slide-up relative z-10">
          <div className="bg-stone-950 px-6 py-4 border-b border-brand-border flex items-center justify-between">
            <h3 className="font-serif text-lg text-white">
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="text-stone-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProduct}>
            <div className="p-6 space-y-8">
              {/* Row 1: ID & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Product ID (SKU)</label>
                  <input 
                    type="text" 
                    required 
                    disabled={!!editingProduct}
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300 disabled:opacity-50"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Title / Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Row 2: Category & Prices */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Category</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300 appearance-none"
                  >
                    {categories.length > 0 ? (
                      categories.map(c => <option key={c} value={c}>{c}</option>)
                    ) : (
                      <option value="">No categories available</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Price (₹)</label>
                  <input 
                    type="number" 
                    required 
                    min="0"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Compare at Price (₹) - Optional</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(e.target.value)}
                    className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3 outline-none text-white transition-all duration-300"
                  />
                </div>
              </div>

              {/* Row 3: Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Description</label>
                <textarea 
                  required 
                  rows="4"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider leading-relaxed rounded-sm p-3 outline-none text-white transition-all duration-300 resize-y"
                />
              </div>

              {/* Row 4: Details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Specifications / Details</label>
                  <button 
                    type="button" 
                    onClick={handleAddDetailRow}
                    className="text-[10px] text-brand-gold hover:text-white uppercase tracking-widest font-bold flex items-center gap-1 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Add Row
                  </button>
                </div>
                <div className="space-y-3">
                  {formDetails.map((detail, idx) => (
                    <div key={idx} className="flex items-center gap-3">
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
                  <span className="block text-xs font-bold tracking-wider text-white">Enable Monogram / Custom Engraving</span>
                  <span className="text-[10px] text-stone-500 font-light mt-0.5">If checked, users can submit custom request text before clicking inquire.</span>
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="prod-customizable"
                    checked={formCustomizable}
                    onChange={(e) => setFormCustomizable(e.target.checked)}
                    className="w-4 h-4 accent-brand-gold cursor-pointer"
                  />
                  <label htmlFor="prod-customizable" className="text-xs font-semibold text-stone-300 cursor-pointer">Customizable</label>
                </div>
              </div>

              {formCustomizable && (
                <div className="animate-scale-in">
                  <label htmlFor="prod-custom-label" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">Customization Prompt Label</label>
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

              {/* Row 6: Image Uploads */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-400">Product Images</label>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current.click()}
                    disabled={isUploading}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-brand-border hover:border-brand-gold hover:text-brand-gold text-[9px] font-bold tracking-widest text-stone-400 uppercase transition-all duration-300 rounded-sm disabled:opacity-50"
                  >
                    {isUploading ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </button>
                  <input type="file" multiple accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                </div>
                
                {isUploading && Object.keys(uploadProgress).length > 0 && (
                  <div className="mb-3 space-y-2">
                    {Object.entries(uploadProgress).map(([idx, pct]) => (
                      <div key={idx}>
                        <div className="flex justify-between text-[9px] text-stone-400 mb-1">
                          <span>Image {Number(idx) + 1}</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="h-1 bg-stone-800 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-gold transition-all duration-300 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 p-4 bg-brand-charcoal border border-brand-border rounded-sm">
                  {formImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-sm border border-brand-border overflow-hidden bg-stone-900 group">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-500 transition-all duration-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {formImages.length === 0 && !isUploading && (
                    <div className="col-span-full py-6 text-center text-stone-600 text-xs italic font-light">
                      No images added. Click "Upload Image" to upload photos.
                    </div>
                  )}
                </div>
              </div>
            </div>

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
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm disabled:opacity-50"
              >
                {isUploading ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                {isUploading ? 'Uploading...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
