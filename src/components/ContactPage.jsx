import React, { useState } from 'react';
import { Mail, MapPin, Phone, Clock, Send, CheckCircle } from 'lucide-react';
import { CONFIG } from '../config';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const subjects = [
    { id: 'General', label: 'General Inquiry' },
    { id: 'Shipping', label: 'Shipping & Tracking' },
    { id: 'Custom', label: 'Custom Orders' },
    { id: 'Returns', label: 'Returns & Refunds' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API delivery
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setSubject('General');
    }, 1200);
  };

  return (
    <div className="space-y-16 pb-10 pt-2 text-stone-900 dark:text-stone-100 max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-[10px] font-bold tracking-[0.3em] text-brand-gold uppercase block">Get In Touch</span>
        <h1 className="font-serif text-3xl md:text-5xl font-light text-stone-900 dark:text-white leading-tight">
          We'd Love to Hear From You
        </h1>
        <p className="text-xs text-stone-500 font-light max-w-xl mx-auto leading-relaxed">
          Questions about sizing, custom monogramming, shipping, or returns? Drop us a message, and our concierge team will assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Contact Info Sidebar */}
        <div className="md:col-span-5 space-y-8">
          
          {/* Map Visual */}
          <a href="https://maps.app.goo.gl/ycXaAiYhY8vSBoaf7" target="_blank" rel="noopener noreferrer" className="block w-full h-48 bg-brand-stone/40 border border-brand-border/40 rounded-sm overflow-hidden relative group">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"></div>
            <div className="absolute inset-0 bg-brand-charcoal/20 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <MapPin className="w-8 h-8 text-brand-gold relative z-10" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-brand-gold rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          </a>

          <div className="space-y-6">
            <h2 className="font-serif text-xl font-light text-stone-900 dark:text-white">Office Headquarters</h2>
            <div className="space-y-4 text-xs font-light text-stone-600 dark:text-stone-400">
              <div className="flex items-start gap-4">
                <MapPin className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                <a href="https://maps.app.goo.gl/ycXaAiYhY8vSBoaf7" target="_blank" rel="noopener noreferrer" className="leading-relaxed hover:text-brand-gold transition-colors">{CONFIG.ADDRESS}</a>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href={`mailto:${CONFIG.EMAIL}`} className="hover:text-brand-gold transition-colors">{CONFIG.EMAIL}</a>
              </div>
              <div className="flex items-center gap-4">
                <Phone className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-brand-gold transition-colors">+91 98765 43210</a>
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t border-brand-border/40 pt-6">
            <h2 className="font-serif text-xl font-light text-stone-900 dark:text-white">Office Hours</h2>
            <div className="space-y-3 text-xs font-light text-stone-600 dark:text-stone-400">
              <div className="flex items-center gap-4">
                <Clock className="w-4 h-4 text-brand-gold flex-shrink-0" />
                <span>Monday &ndash; Saturday: 9:00 AM &ndash; 10:00 PM IST</span>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="w-4 h-4 text-stone-500 flex-shrink-0" />
                <span>Sunday: Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7">
          <div className="bg-brand-stone border border-brand-border p-6 sm:p-10 rounded-sm shadow-xl relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/[0.03] rounded-full filter blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

            {isSubmitted ? (
              <div className="text-center py-12 space-y-6 flex flex-col items-center animate-fade-in relative z-10">
                <div className="w-20 h-20 bg-brand-gold/10 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="w-10 h-10 text-brand-gold animate-bounce" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900 dark:text-white font-light">Message Received</h3>
                <p className="text-xs text-stone-500 font-light max-w-sm leading-relaxed">
                  Thank you for reaching out. We have logged your request and our concierge team will follow up shortly!
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-6 px-8 py-3 bg-brand-charcoal text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-sm shadow-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 relative z-10 animate-fade-in">
                
                {/* Subject Selectors */}
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400">Inquiry Subject</label>
                  <div className="grid grid-cols-2 gap-3">
                    {subjects.map((sub) => (
                      <button
                        key={sub.id}
                        type="button"
                        onClick={() => setSubject(sub.id)}
                        className={`py-3 px-4 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all duration-300 border text-center
                          ${subject === sub.id 
                            ? 'bg-brand-gold text-brand-charcoal border-brand-gold shadow-md' 
                            : 'bg-brand-charcoal border-brand-border/40 text-stone-400 hover:border-brand-gold/50 hover:text-stone-300'
                          }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Floating Label Input - Name */}
                  <div className="relative group">
                    <input
                      type="text"
                      id="contact-name"
                      className="peer w-full bg-brand-charcoal border border-brand-border/40 focus:border-brand-gold text-white text-xs px-4 pt-6 pb-2 rounded-sm outline-none transition-all"
                      placeholder=" "
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <label
                      htmlFor="contact-name"
                      className="absolute text-[10px] font-bold uppercase tracking-widest text-stone-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-brand-gold cursor-text"
                    >
                      Your Name *
                    </label>
                  </div>

                  {/* Floating Label Input - Email */}
                  <div className="relative group">
                    <input
                      type="email"
                      id="contact-email"
                      className="peer w-full bg-brand-charcoal border border-brand-border/40 focus:border-brand-gold text-white text-xs px-4 pt-6 pb-2 rounded-sm outline-none transition-all"
                      placeholder=" "
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label
                      htmlFor="contact-email"
                      className="absolute text-[10px] font-bold uppercase tracking-widest text-stone-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-brand-gold cursor-text"
                    >
                      Email Address *
                    </label>
                  </div>
                </div>

                {/* Floating Label Textarea - Message */}
                <div className="relative group">
                  <textarea
                    id="contact-message"
                    rows="5"
                    className="peer w-full bg-brand-charcoal border border-brand-border/40 focus:border-brand-gold text-white text-xs px-4 pt-6 pb-2 rounded-sm outline-none transition-all leading-relaxed resize-none"
                    placeholder=" "
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                  <label
                    htmlFor="contact-message"
                    className="absolute text-[10px] font-bold uppercase tracking-widest text-stone-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0] left-4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-3 peer-focus:text-brand-gold cursor-text"
                  >
                    Message Detail *
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-gold hover:bg-brand-gold-hover text-brand-charcoal font-bold text-xs uppercase tracking-widest transition-all duration-300 rounded-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending Message...' : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
