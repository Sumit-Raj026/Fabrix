import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';
import { CONFIG } from '../config';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(CONFIG.DEFAULT_WELCOME_MESSAGE);
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      
      {/* Tooltip Badge */}
      {showTooltip && (
        <div className="relative bg-brand-stone border border-brand-border text-stone-900 dark:text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in w-[calc(100vw-3rem)] sm:w-auto sm:max-w-xs md:max-w-sm mb-1 transition-colors duration-400">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-brand-gold tracking-widest uppercase">
              Support & Inquiries
            </span>
            <span className="text-xs font-light text-stone-500 dark:text-stone-350 mt-0.5 whitespace-nowrap">
              Need custom sizing or designs? Chat with us.
            </span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            id="close-tooltip-btn"
            className="text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors duration-200"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          {/* Tooltip triangle tail */}
          <div className="absolute right-6 bottom-[-6px] w-3 h-3 bg-brand-stone border-r border-b border-brand-border rotate-45" />
        </div>
      )}

      {/* Floating Button with pulsing ring */}
      <button
        onClick={handleWhatsAppClick}
        id="floating-whatsapp-btn"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-500/30"
        aria-label="Contact us on WhatsApp"
      >
        {/* Glow pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-600/30 animate-ping -z-10 group-hover:animate-none" />
        
        {/* Icon */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-7 h-7 fill-current"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 1.977 14.053.954 11.998.954c-5.442 0-9.866 4.372-9.87 9.802 0 1.714.452 3.39 1.31 4.877L2.455 21.03l5.59-1.465L6.647 19.15z" />
          <path d="M15.969 12.983c-.303-.151-1.793-.884-2.071-.984-.278-.1-.482-.151-.684.151-.202.303-.784.984-.961 1.185-.177.202-.354.227-.657.076-.303-.151-1.28-.472-2.438-1.503-.9-.802-1.507-1.793-1.684-2.095-.177-.302-.019-.465.132-.615.136-.135.303-.354.455-.53.151-.177.202-.303.303-.505.101-.202.051-.379-.025-.53-.076-.151-.684-1.647-.937-2.253-.247-.594-.499-.513-.684-.523-.177-.009-.379-.01-.58-.01s-.53.076-.808.379c-.278.303-1.062 1.036-1.062 2.527s1.087 2.93 1.238 3.132c.151.202 2.14 3.268 5.18 4.578.723.311 1.288.497 1.729.637.727.231 1.388.199 1.91.121.582-.087 1.794-.733 2.047-1.439.253-.707.253-1.314.177-1.439-.076-.126-.279-.202-.582-.353z" />
        </svg>
      </button>

    </div>
  );
}
