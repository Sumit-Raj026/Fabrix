import React from 'react';
import B2BContactForm from './B2BContactForm';

export default function B2BPage() {
  return (
    <div className="space-y-12 pb-10 pt-2 text-stone-900 dark:text-stone-100 max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold uppercase block">Partnerships & Wholesale</span>
        <h1 className="font-serif text-3xl md:text-5xl font-light text-stone-900 dark:text-white leading-tight">
          B2B & Bulk Volume Portal
        </h1>
        <p className="text-xs text-stone-500 font-light max-w-xl mx-auto leading-relaxed">
          Expand your catalog or design custom-detailed products at scale. Connect with our dedicated sales desk.
        </p>
      </div>

      <B2BContactForm isModal={false} />

      {/* Trust factors or additional info could go here in the future */}
      <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-brand-border/40">
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-brand-gold">Dedicated Support</h3>
          <p className="text-xs text-stone-500 font-light px-4 leading-relaxed">A dedicated account manager for your entire procurement lifecycle.</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-brand-gold">Custom Tooling</h3>
          <p className="text-xs text-stone-500 font-light px-4 leading-relaxed">In-house 3D modeling and rapid prototyping for bespoke requirements.</p>
        </div>
        <div className="space-y-3">
          <h3 className="font-serif text-lg text-brand-gold">Global Logistics</h3>
          <p className="text-xs text-stone-500 font-light px-4 leading-relaxed">Streamlined international shipping and customs handling.</p>
        </div>
      </div>
    </div>
  );
}
