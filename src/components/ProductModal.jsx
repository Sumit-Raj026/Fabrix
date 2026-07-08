import React, { useState, useEffect } from 'react';
import { X, Send, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import { CONFIG } from '../config';

export default function ProductModal({ product, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customizationText, setCustomizationText] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [isFading, setIsFading] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product]);

  if (!product) return null;

  const images = Array.isArray(product?.images) ? product.images : [];
  const currentImage = images[currentImageIndex] || images[0] || '';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setIsFading(false);
    }, 150);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (images.length === 0) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setIsFading(false);
    }, 150);
  };

  const handleThumbnailClick = (idx) => {
    if (idx === currentImageIndex || images.length === 0) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentImageIndex(idx);
      setIsFading(false);
    }, 150);
  };

  const handleWhatsAppInquiry = (e) => {
    e.preventDefault();
    
    // Construct pre-filled message
    let message = `Hello Fabrix, I'm interested in inquiring about/purchasing this item:

🛍️ *Product:* ${product.title}
🆔 *Product ID:* ${product.id}
💰 *Price:* ${formatPrice(product.price)}
📂 *Category:* ${product.category}`;

    if (product.customizable && customizationText.trim()) {
      message += `\n\n✨ *Customization Details (${product.customizationLabel}):*\n> ${customizationText.trim()}`;
    } else if (product.customizable) {
      message += `\n\n✨ *Customization:* (No customization notes provided)`;
    }

    if (userNotes.trim()) {
      message += `\n\n💬 *My Message/Questions:* \n> ${userNotes.trim()}`;
    }

    message += `\n\n🔗 *Catalog Link:* ${window.location.origin}/#product-${product.id}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    // Open in a new tab
    window.open(whatsappUrl, '_blank');
  };

  return (
    <FocusTrap>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-brand-charcoal/90 backdrop-blur-md transition-opacity duration-400"></div>

        {/* Clickable overlay to close */}
        <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-5xl bg-brand-stone border border-brand-border shadow-2xl rounded-sm overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          id="close-modal-btn"
          className="absolute top-4 right-4 p-2 bg-brand-charcoal/80 backdrop-blur-sm border border-brand-border text-stone-400 hover:text-white hover:scale-105 transition-all duration-300 rounded-full z-30"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Product Image & Gallery */}
        <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-[600px] bg-brand-charcoal relative overflow-hidden flex flex-col justify-center">
          
          {/* Main Display Image */}
          <div className="w-full h-full relative overflow-hidden">
            <img 
              src={product.images[currentImageIndex]} 
              alt={`${product.title} view ${currentImageIndex + 1}`} 
              className={`w-full h-full object-cover transition-opacity duration-150 ${isFading ? 'opacity-30' : 'opacity-100'}`}
            />
          </div>

          {/* Navigation Arrows */}
          {product.images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-brand-charcoal/60 hover:bg-brand-gold hover:text-brand-charcoal text-white border border-white/10 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-brand-charcoal/60 hover:bg-brand-gold hover:text-brand-charcoal text-white border border-white/10 rounded-full shadow-lg transition-all duration-300 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Customizable Badge */}
          {product.customizable && (
            <div className="absolute top-4 left-4 bg-brand-charcoal text-white text-[9px] font-bold tracking-widest uppercase py-1.5 px-3.5 shadow-md flex items-center gap-1.5 rounded-sm border border-brand-border/60 z-10">
              <Award className="w-3.5 h-3.5 text-brand-gold" /> Customizable
            </div>
          )}

          {/* Gallery Thumbnails Overlay */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 bg-brand-charcoal/50 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                    currentImageIndex === idx 
                      ? 'border-brand-gold scale-105 shadow-md' 
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 md:p-10 flex flex-col justify-between overflow-y-auto max-h-none md:max-h-[600px] bg-brand-stone">
          <div>
            {/* Category and ID */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-[10px] font-bold tracking-widest text-brand-gold uppercase">
                {product.category}
              </span>
              <span className="text-brand-border">|</span>
              <span className="text-[10px] font-medium tracking-wider text-stone-500">
                {product.id}
              </span>
            </div>

            {/* Title */}
            <h2 id="modal-title" className="font-serif text-2xl md:text-3xl font-light text-stone-900 dark:text-white leading-tight mb-4 transition-colors duration-400">
              {product.title}
            </h2>

            {/* Price & Discount */}
            <div className="flex flex-wrap items-baseline gap-3 mb-6">
              <span className="text-xl font-bold text-brand-gold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                <>
                  <span className="text-sm text-stone-500 line-through font-normal">
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-sm tracking-wide">
                    {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-stone-600 dark:text-stone-400 text-sm font-light leading-relaxed mb-6 transition-colors duration-400">
              {product.description}
            </p>

            {/* Specifications Details List */}
            <div className="mb-8">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                Details & Specifications
              </h4>
              <ul className="space-y-2">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="text-xs text-stone-600 dark:text-stone-300 flex items-start gap-2 font-light transition-colors duration-400">
                    <span className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-1.5 flex-shrink-0" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customization input */}
            <form onSubmit={handleWhatsAppInquiry} className="space-y-5 pt-4 border-t border-brand-border/60">
              {product.customizable && (
                <div>
                  <label 
                    htmlFor="customization" 
                    className="block text-xs font-bold uppercase tracking-wider text-stone-750 dark:text-stone-300 mb-2"
                  >
                    Customization Request <span className="text-brand-gold font-normal">({product.customizationLabel})</span>
                  </label>
                  <input
                    type="text"
                    id="customization"
                    placeholder={`Enter your custom request...`}
                    value={customizationText}
                    onChange={(e) => setCustomizationText(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold focus:bg-white dark:focus:bg-[#20201e] text-xs tracking-wider rounded-sm p-3.5 outline-none text-stone-900 dark:text-white transition-all duration-300"
                  />
                </div>
              )}

              {/* Inquiry notes */}
              <div>
                <label 
                  htmlFor="notes" 
                  className="block text-xs font-bold uppercase tracking-wider text-stone-755 dark:text-stone-300 mb-2"
                >
                  Questions or Notes
                </label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="Ask about dimensions, shipping, or other queries..."
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-[#1b1b19] border border-brand-border focus:border-brand-gold focus:bg-white dark:focus:bg-[#20201e] text-xs tracking-wider rounded-sm p-3.5 outline-none text-stone-900 dark:text-white resize-none transition-all duration-300"
                />
              </div>

              {/* Submit CTA WhatsApp button */}
              <button
                type="submit"
                id="whatsapp-inquiry-btn"
                className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-600 text-white font-bold text-xs tracking-widest uppercase hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-500/25 active:scale-[0.99] transition-all duration-300 rounded-sm"
              >
                <Send className="w-4 h-4" />
                Inquire via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
      </div>
    </FocusTrap>
  );
}
