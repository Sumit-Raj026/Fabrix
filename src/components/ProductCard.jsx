import React from 'react';
import { Eye, ArrowRight } from 'lucide-react';

export default function ProductCard({ product, onOpen }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <a 
      href={`#product-${product.id}`}
      onClick={(e) => {
        e.preventDefault();
        onOpen(product);
      }}
      id={`product-card-${product.id.toLowerCase()}`}
      className="group premium-card cursor-pointer flex flex-col bg-brand-stone border border-brand-border overflow-hidden rounded-sm block text-current no-underline"
    >
      {/* Image Container with aspect ratio */}
      <div className="relative aspect-[4/5] bg-brand-charcoal overflow-hidden border-b border-brand-border/55">
        <img 
          src={product.images[0]} 
          alt={product.title} 
          className="w-full h-full object-cover product-card-img"
          loading="lazy"
        />

        {/* Customization Badge */}
        {product.customizable && (
          <span className="absolute top-4 left-4 z-10 bg-brand-gold text-brand-charcoal text-[8px] font-bold tracking-widest uppercase py-1 px-3 shadow-md rounded-sm">
            Bespoke
          </span>
        )}

        {/* Category Badge on card */}
        <span className="absolute top-4 right-4 z-10 bg-brand-charcoal/80 backdrop-blur-md text-white text-[8px] font-semibold tracking-widest uppercase py-1 px-2.5 rounded-sm">
          {product.category}
        </span>

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-brand-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="p-3 bg-brand-gold text-brand-charcoal rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-6 flex flex-col flex-grow bg-brand-stone">
        <span className="text-[9px] font-bold tracking-widest text-stone-500 uppercase mb-2">
          {product.id}
        </span>
        <h3 className="font-serif text-base text-stone-900 dark:text-white font-light line-clamp-1 mb-2 group-hover:text-brand-gold transition-colors duration-300">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-brand-border/60">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm font-semibold text-brand-gold">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <>
                <span className="text-xs text-stone-500 line-through font-normal">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-[9px] font-bold text-rose-500 bg-rose-500/10 px-1 py-0.5 rounded-sm tracking-wide whitespace-nowrap">
                  {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% OFF
                </span>
              </>
            )}
          </div>
          <span className="text-[10px] font-bold tracking-widest text-stone-400 uppercase flex items-center gap-1 group-hover:gap-2 group-hover:text-brand-gold transition-all duration-300">
            Details <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
      
    </a>
  );
}
