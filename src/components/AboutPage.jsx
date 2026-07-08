import React from 'react';
import { ShieldCheck, Heart, Award, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 py-10 text-stone-900 dark:text-stone-100 max-w-5xl mx-auto px-4">
      {/* Hero section */}
      <div className="text-center space-y-4">
        <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold uppercase block">Our Heritage</span>
        <h1 className="font-serif text-3xl md:text-5xl font-light text-stone-900 dark:text-white leading-tight">
          The Craft of Minimalist Living
        </h1>
        <p className="text-xs text-stone-500 font-light max-w-xl mx-auto leading-relaxed">
          Fabrix was born out of a desire to create functional elegance. We design premium home styling solutions that blend into modern spaces while making a quiet statement.
        </p>
      </div>

      {/* Grid Story */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-light text-stone-900 dark:text-white">Our Philosophy</h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
            In a world filled with constant noise and clutter, we believe home should be a sanctuary of calmness. Our design process starts by stripping away the unnecessary, leaving behind raw, beautiful utility.
          </p>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-light leading-relaxed">
            Every item in our collection is handpicked, custom-detailed, and rigorously inspected. From the organic flax fibers of our cushions to the matte glaze of our clay ceramics, we reject shortcuts.
          </p>
        </div>
        <div className="aspect-[4/3] bg-brand-stone/40 border border-brand-border rounded-sm overflow-hidden flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <Sparkles className="w-10 h-10 text-brand-gold mx-auto animate-pulse" />
            <div className="font-serif text-lg text-white font-light">Artisanal Sourcing</div>
            <p className="text-[11px] text-stone-500 max-w-xs leading-relaxed">
              We collaborate exclusively with local craftsmen who employ generations-old techniques.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <h2 className="font-serif text-2xl font-light text-center text-stone-900 dark:text-white">Our Commitments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="bg-brand-stone/30 border border-brand-border/60 p-6 rounded-sm space-y-3 text-center">
            <ShieldCheck className="w-8 h-8 text-brand-gold mx-auto" />
            <h3 className="font-serif text-base text-white font-light">Honest Quality</h3>
            <p className="text-[11px] text-stone-505 dark:text-stone-400 font-light leading-relaxed">
              We stand by our materials. No synthetic blends, no cheap plastics. Only pure glass, clay, metals, and textiles.
            </p>
          </div>
          <div className="bg-brand-stone/30 border border-brand-border/60 p-6 rounded-sm space-y-3 text-center">
            <Heart className="w-8 h-8 text-brand-gold mx-auto" />
            <h3 className="font-serif text-base text-white font-light">Conscious Sourcing</h3>
            <p className="text-[11px] text-stone-505 dark:text-stone-400 font-light leading-relaxed">
              We manufacture in small batches to reduce carbon footprint and eliminate inventory waste.
            </p>
          </div>
          <div className="bg-brand-stone/30 border border-brand-border/60 p-6 rounded-sm space-y-3 text-center">
            <Award className="w-8 h-8 text-brand-gold mx-auto" />
            <h3 className="font-serif text-base text-white font-light">Bespoke Fitting</h3>
            <p className="text-[11px] text-stone-505 dark:text-stone-400 font-light leading-relaxed">
              All items marked customizable are completed to order in our workspace by hands, not assembly lines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
