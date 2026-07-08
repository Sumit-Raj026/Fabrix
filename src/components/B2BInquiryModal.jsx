import React from 'react';
import { X, Briefcase } from 'lucide-react';
import FocusTrap from 'focus-trap-react';
import B2BContactForm from './B2BContactForm';

export default function B2BInquiryModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <FocusTrap>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="b2b-modal-title">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-brand-stone border border-brand-border/80 shadow-2xl rounded-sm overflow-hidden z-10 flex flex-col max-h-[90vh] animate-scale-in text-stone-900 dark:text-stone-150">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-brand-border/40 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-brand-gold">
            <Briefcase className="w-4 h-4" />
            <h2 id="b2b-modal-title" className="text-xs font-bold uppercase tracking-widest">B2B & Custom Order Portal</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-white transition-colors p-2 -mr-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto">
          <B2BContactForm onCancel={onClose} isModal={true} />
        </div>
      </div>
      </div>
    </FocusTrap>
  );
}
