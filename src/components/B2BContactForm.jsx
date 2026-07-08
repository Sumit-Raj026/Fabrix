import React, { useState } from 'react';
import { Send, CheckCircle, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { b2bService } from '../lib/b2b';

const BUSINESS_TYPES = [
  'Wholesale / Retailer',
  'Corporate Gifting',
  'OEM / ODM Design',
  'Interior Designer',
  'Distribution'
];

const QUANTITY_RANGES = [
  '50 - 100 Units',
  '100 - 500 Units',
  '500+ Units',
  'To be discussed'
];

export default function B2BContactForm({ onSuccess, onCancel, isModal = false }) {
  const [step, setStep] = useState(1);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('Wholesale / Retailer');
  const [gstNumber, setGstNumber] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNext = () => {
    if (!companyName || !contactPerson || !email || !phone) {
      setErrorMsg('Please fill in all required contact fields.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleBack = () => setStep(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessType || !estimatedQuantity || !message) {
      setErrorMsg('Please complete all project details.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await b2bService.submitInquiry({
        companyName,
        contactPerson,
        email,
        phone,
        businessType,
        gstNumber,
        estimatedQuantity,
        message
      });
      setIsSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setCompanyName('');
    setContactPerson('');
    setEmail('');
    setPhone('');
    setBusinessType('Wholesale / Retailer');
    setGstNumber('');
    setEstimatedQuantity('');
    setMessage('');
    setIsSubmitted(false);
    if (onCancel) onCancel();
  };

  if (isSubmitted) {
    return (
      <div className={`text-center flex flex-col items-center justify-center space-y-6 ${isModal ? 'p-12' : 'p-16 bg-brand-stone/40 border border-brand-border rounded-sm'}`}>
        <CheckCircle className="w-16 h-16 text-emerald-500 animate-bounce" />
        <h3 className="font-serif text-2xl text-stone-900 dark:text-white font-light">Inquiry Submitted Successfully</h3>
        <p className="text-sm text-stone-500 font-light max-w-md leading-relaxed mx-auto">
          Thank you for choosing Fabrix. Our corporate business team will review your partnership details and reach out within 24–48 business hours.
        </p>
        <button onClick={handleReset} className="mt-4 px-8 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors rounded-sm shadow-lg">
          {isModal ? 'Close Window' : 'Submit Another Inquiry'}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex-grow ${isModal ? 'p-8' : 'p-8 sm:p-12 bg-brand-stone/40 border border-brand-border rounded-sm'}`}>
      {!isModal && (
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-gold mb-8 justify-center">
          <span className={step === 1 ? "text-brand-gold" : "text-stone-600"}>01. Contact Info</span>
          <span className="w-8 h-[1px] bg-stone-700"></span>
          <span className={step === 2 ? "text-brand-gold" : "text-stone-600"}>02. Project Details</span>
        </div>
      )}

      <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-8">
        
        {errorMsg && (
          <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-sm text-xs animate-fade-in">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            {!isModal && (
              <p className="text-sm text-stone-400 font-light leading-relaxed mb-6 text-center max-w-xl mx-auto">
                Fill out this brief form to inquire about corporate gifting, wholesale pricing, or customization options.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Company Name *</label>
                <input type="text" required placeholder="Enter legal business name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-4 py-3 border border-brand-border/60 bg-stone-900/40 focus:bg-stone-900 focus:border-brand-gold focus:outline-none rounded-sm text-sm text-white transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Contact Person *</label>
                <input type="text" required placeholder="First & last name" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className="w-full px-4 py-3 border border-brand-border/60 bg-stone-900/40 focus:bg-stone-900 focus:border-brand-gold focus:outline-none rounded-sm text-sm text-white transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Corporate Email *</label>
                <input type="email" required placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-brand-border/60 bg-stone-900/40 focus:bg-stone-900 focus:border-brand-gold focus:outline-none rounded-sm text-sm text-white transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Contact Phone *</label>
                <input type="tel" required placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border border-brand-border/60 bg-stone-900/40 focus:bg-stone-900 focus:border-brand-gold focus:outline-none rounded-sm text-sm text-white transition-colors" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Primary Business Focus *</label>
              <div className="flex flex-wrap gap-3">
                {BUSINESS_TYPES.map(type => (
                  <button key={type} type="button" onClick={() => setBusinessType(type)} className={`px-4 py-2 text-xs rounded-full border transition-all duration-300 ${businessType === type ? 'bg-brand-gold border-brand-gold text-stone-950 font-bold' : 'border-brand-border/60 text-stone-400 hover:border-brand-gold hover:text-white'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Estimated Quantity *</label>
                <div className="grid grid-cols-2 gap-2">
                  {QUANTITY_RANGES.map(range => (
                    <button key={range} type="button" onClick={() => setEstimatedQuantity(range)} className={`px-3 py-2 text-[11px] rounded-sm border transition-all duration-300 ${estimatedQuantity === range ? 'bg-stone-800 border-brand-gold text-white font-bold shadow-[0_0_10px_rgba(188,160,118,0.2)]' : 'border-brand-border/60 bg-stone-900/40 text-stone-400 hover:border-brand-gold/50 hover:text-white'}`}>
                      {range}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">GSTIN Number (Optional)</label>
                <input type="text" placeholder="22AAAAA1111A1Z1" value={gstNumber} onChange={(e) => setGstNumber(e.target.value)} className="w-full px-4 py-3 border border-brand-border/60 bg-stone-900/40 focus:bg-stone-900 focus:border-brand-gold focus:outline-none rounded-sm text-sm uppercase font-mono mt-1 text-white transition-colors" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Project Scope Details *</label>
              <textarea rows="4" required placeholder="Specify style demands, custom colors, sizing requirements, or deadlines..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 border border-brand-border/60 bg-stone-900/40 focus:bg-stone-900 focus:border-brand-gold focus:outline-none rounded-sm text-sm leading-relaxed resize-none text-white transition-colors" />
            </div>
          </div>
        )}

        {/* Footer Buttons */}
        <div className={`pt-6 mt-4 flex items-center justify-between ${isModal ? 'border-t border-brand-border/40' : ''}`}>
          {step === 1 ? (
            <>
              {isModal ? (
                <button type="button" onClick={onCancel} className="px-5 py-2.5 text-stone-500 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                  Cancel
                </button>
              ) : (
                <div /> /* Empty div for flex layout spacing */
              )}
              <button type="button" onClick={handleNext} className="flex items-center gap-2 px-8 py-3 bg-white text-black text-xs font-bold tracking-widest uppercase hover:bg-brand-gold transition-colors duration-300 rounded-sm ml-auto">
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={handleBack} className="flex items-center gap-2 px-5 py-2.5 text-stone-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-charcoal text-xs font-bold tracking-widest uppercase hover:bg-brand-gold-hover transition-colors duration-300 rounded-sm shadow-lg disabled:opacity-50">
                {isSubmitting ? (
                  <><span className="w-4 h-4 border-2 border-brand-charcoal border-t-transparent rounded-full animate-spin" /> Submitting...</>
                ) : (
                  <>Submit Inquiry <Send className="w-4 h-4" /></>
                )}
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
