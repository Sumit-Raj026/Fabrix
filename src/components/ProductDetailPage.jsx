import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Send } from 'lucide-react';
import { useParams, useNavigationType } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductCard from './ProductCard';
import { CONFIG } from '../config';
import { formatSKU } from '../utils/formatters';
import { useProduct, useRelatedProducts } from '../hooks/useProducts';

export default function ProductDetailPage({ onBack, onOpenProduct }) {
  const { id: productId } = useParams();
  const navType = useNavigationType();
  const { data: product, isLoading, error } = useProduct(productId);
  const { data: relatedProducts = [] } = useRelatedProducts(product?.category, productId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Automatically scroll to the top when navigating to a new product
  // but preserve scroll position on Back/Forward (POP)
  React.useEffect(() => {
    if (navType !== 'POP') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [productId, navType]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20 space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="font-serif text-2xl font-light text-white">Product Not Found</h2>
        <p className="text-xs text-stone-500 max-w-xs mx-auto">
          The requested item code does not exist in our active showrooms.
        </p>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-brand-gold text-brand-charcoal text-xs font-bold uppercase tracking-wider rounded-sm"
        >
          Return to Showroom
        </button>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const images = Array.isArray(product.images) ? product.images : [];
  const currentImage = images[activeImageIndex] || '';

  const handleBuyWhatsApp = () => {
    const textMsg = `Hi Fabrix! I am interested in purchasing the product:\n\n*Product Name:* ${product.title}\n*Product SKU:* ${formatSKU(product.id)}\n*Category:* ${product.category}\n*Price:* ${formatPrice(product.price)}\n\nPlease confirm availability and payment options.`;
    const encoded = encodeURIComponent(textMsg);
    window.open(`https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  return (
    <>
      <Helmet>
        <title>{product.title} | {CONFIG.STORE_NAME}</title>
        <meta name="description" content={product.description?.substring(0, 150) || `Buy ${product.title} at ${CONFIG.STORE_NAME}`} />
        <meta property="og:title" content={`${product.title} | ${CONFIG.STORE_NAME}`} />
        <meta property="og:description" content={product.description?.substring(0, 150)} />
        <meta property="og:image" content={currentImage} />
        <meta property="twitter:title" content={`${product.title} | ${CONFIG.STORE_NAME}`} />
        <meta property="twitter:description" content={product.description?.substring(0, 150)} />
        <meta property="twitter:image" content={currentImage} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.title,
            "image": currentImage,
            "description": product.description,
            "sku": product.id,
            "offers": {
              "@type": "Offer",
              "url": window.location.href,
              "priceCurrency": "INR",
              "price": product.price,
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": CONFIG.STORE_NAME
              }
            }
          })}
        </script>
      </Helmet>
      <div className="animate-fade-in space-y-6 pt-4 pb-8 px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto text-stone-900 dark:text-stone-150">
      
      {/* Main product display */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-start">
        
        {/* Left Side: Images Gallery */}
        <div className="md:col-span-6 lg:col-span-6 2xl:col-span-7 relative md:sticky md:top-24 z-10 flex flex-col gap-6">
          
          {/* Back navigation */}
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-white transition-colors -ml-1"
            >
              <ArrowLeft className="w-4 h-4" /> Return to catalog
            </button>
          </div>
          
          <div className="aspect-square bg-brand-stone/40 border border-brand-border rounded-sm overflow-hidden relative group">
            {currentImage ? (
              <img 
                src={currentImage} 
                alt={product.title} 
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                onClick={() => setIsLightboxOpen(true)}
              />
            ) : (
              <div className="w-full h-full bg-stone-900/10 flex items-center justify-center text-stone-500">
                No images available
              </div>
            )}

            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <span className="absolute top-4 right-4 bg-rose-500 text-white text-[9px] font-bold px-2 py-1 uppercase tracking-widest rounded-sm">
                Sale
              </span>
            )}

            {/* Floating Image Selector */}
            {images.length > 1 && (
              <div 
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-stone-900/40 dark:bg-stone-950/60 backdrop-blur-md rounded-full px-4 py-3 flex items-center gap-3.5 z-10 shadow-2xl overflow-x-auto max-w-[90%] scrollbar-none snap-x"
                onClick={(e) => e.stopPropagation()}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight' && idx < images.length - 1) setActiveImageIndex(idx + 1);
                      if (e.key === 'ArrowLeft' && idx > 0) setActiveImageIndex(idx - 1);
                    }}
                    className={`relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 snap-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold ${
                      activeImageIndex === idx 
                        ? 'ring-2 ring-brand-gold scale-110 shadow-[0_0_15px_rgba(188,160,118,0.5)] z-20' 
                        : 'ring-1 ring-white/20 hover:ring-white/60 hover:scale-105 opacity-80 hover:opacity-100 z-10'
                    }`}
                  >
                    <img src={img} alt={`${product.title} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Information Panel */}
        <div className="md:col-span-6 lg:col-span-6 2xl:col-span-5 space-y-8 lg:pl-8 md:mt-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] uppercase">
              <span className="text-brand-gold">{product.category}</span>
              <span className="w-px h-3 bg-stone-700"></span>
              <span className="text-stone-500">{formatSKU(product.id)}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-stone-900 dark:text-white leading-tight">{product.title}</h1>
          </div>

          {/* Price Area */}
          <div className="flex items-baseline gap-4 pb-2">
            <span className="text-3xl font-bold text-brand-gold tracking-tight">{formatPrice(product.price)}</span>
            {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
              <>
                <span className="text-lg text-stone-500 line-through decoration-1">{formatPrice(product.originalPrice)}</span>
                <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-sm uppercase tracking-widest ml-1">
                  {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Product Description */}
          <p className="text-[13px] text-stone-600 dark:text-stone-400 font-light leading-loose">
            {product.description}
          </p>

          {/* Specifications list */}
          {product.details && product.details.length > 0 && (
            <div className="space-y-4 pt-6">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">Details & Specifications</h3>
              <ul className="space-y-3 text-[13px] font-light text-stone-600 dark:text-stone-300">
                {product.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-brand-gold text-[8px] mt-1.5 flex-shrink-0">●</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Checkout & Inquiry Buttons */}
          <div className="pt-2">
            <button
              onClick={handleBuyWhatsApp}
              className="w-full py-4 bg-[#059669] hover:bg-[#047857] text-white font-bold uppercase text-[11px] tracking-[0.2em] transition-colors rounded-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <Send className="w-4 h-4 fill-current" /> Inquire via WhatsApp
            </button>
          </div>

        </div>
      </div>

      {/* Related recommendations */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-brand-border/45">
          <div>
            <span className="text-[9px] font-bold tracking-[0.25em] text-brand-gold uppercase block mb-1">
              Complete the look
            </span>
            <h2 className="font-serif text-xl md:text-2xl font-light text-stone-900 dark:text-white">
              Related Recommendations
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-10">
            {relatedProducts.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onOpen={() => onOpenProduct(p)} 
              />
            ))}
          </div>
        </div>
      )}

    </div>

      {/* Full-screen Lightbox Overlay */}
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-stone-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button 
            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 flex items-center justify-center bg-stone-900 hover:bg-brand-gold text-white rounded-full transition-colors duration-300 z-50"
            onClick={() => setIsLightboxOpen(false)}
          >
            <span className="text-xl leading-none">&times;</span>
          </button>
          
          <div className="relative w-full max-w-5xl h-[80vh] sm:h-[90vh] flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <img 
              src={currentImage} 
              alt={product.title} 
              className="w-full h-full object-contain cursor-zoom-out"
              onClick={() => setIsLightboxOpen(false)}
            />
            
            {/* Lightbox Navigation */}
            {images.length > 1 && (
              <>
                <button 
                  className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-stone-900/60 hover:bg-brand-gold text-white backdrop-blur-md rounded-full transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                  }}
                >
                  &larr;
                </button>
                <button 
                  className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-stone-900/60 hover:bg-brand-gold text-white backdrop-blur-md rounded-full transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                  }}
                >
                  &rarr;
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
