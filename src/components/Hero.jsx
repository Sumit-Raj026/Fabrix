import React from 'react';
import { CONFIG } from '../config';

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-15 px-6 border-b border-brand-border bg-brand-stone">
      
      {/* Premium Ambient Lighting (Mesh Glows) */}
      <div className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] mesh-glow-1 pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] left-[5%] w-[450px] h-[450px] mesh-glow-2 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Tagline */}
        <span className="inline-block text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase text-brand-gold mb-6">
          PREMIUM HOME DECOR & CUSTOM CREATIONS
        </span>
        
        {/* Main Heading */}
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-extralight tracking-tight text-stone-900 dark:text-white leading-[1.2] mb-8 select-none transition-colors duration-400">
         Transforming   <span className="italic font-normal text-brand-gold">Ideas </span> <br className="hidden sm:inline" />
         Into Beautiful Objects
        </h1>
        
        {/* Description */}
        <p className="text-stone-600 dark:text-stone-400 font-sans text-xs md:text-sm max-w-2xl mx-auto leading-relaxed mb-12 font-light tracking-wide transition-colors duration-400">
           Discover premium wall art, elegant home décor, statues, lighting, and personalized creations. From custom nameplates and keychains to bespoke 3D-printed décor, every piece is thoughtfully crafted to make your space uniquely yours.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href="#catalog"
            className="w-full sm:w-auto px-8 py-4 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-all duration-300 shadow-lg shadow-brand-gold/10 btn-shimmer"
          >
            Explore Catalog
          </a>
          <a 
            href="#custom"
            className="w-full sm:w-auto px-8 py-4 border border-brand-border text-stone-850 dark:text-white hover:border-brand-gold hover:text-brand-gold text-xs font-bold tracking-widest uppercase transition-all duration-300"
          >
            Bespoke Requests
          </a>
        </div>
      </div>

      {/* Aesthetic Thin Divider */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1px] bg-gradient-to-r from-transparent via-brand-border to-transparent" />
    </section>
  );
}
