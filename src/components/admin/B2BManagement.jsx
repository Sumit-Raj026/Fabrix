import React, { useState, useEffect } from 'react';
import { Loader2, Briefcase, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import { b2bService } from '../../lib/b2b';

export default function B2BManagement() {
  const [b2bInquiries, setB2bInquiries] = useState([]);
  const [b2bLoading, setB2bLoading] = useState(true);

  useEffect(() => {
    fetchB2BInquiries();
  }, []);

  const fetchB2BInquiries = async () => {
    setB2bLoading(true);
    try {
      const data = await b2bService.getInquiries();
      setB2bInquiries(data || []);
    } catch (e) {
      console.error('Error fetching B2B inquiries:', e);
    } finally {
      setB2bLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await b2bService.updateInquiryStatus(id, status);
      fetchB2BInquiries(); // refresh
    } catch (e) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-serif font-light tracking-wide text-white mb-2">B2B & Wholesale Leads</h2>
          <p className="text-xs text-stone-400 font-light">Manage inquiries from businesses and bulk buyers.</p>
        </div>
        <button 
          onClick={fetchB2BInquiries}
          className="px-4 py-2 bg-brand-stone hover:bg-brand-stone-hover border border-brand-border text-xs font-bold tracking-widest uppercase transition-colors rounded-sm"
        >
          Refresh Leads
        </button>
      </div>

      {b2bLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
        </div>
      ) : b2bInquiries.length === 0 ? (
        <div className="text-center py-16 border border-brand-border bg-brand-stone rounded-sm">
          <Briefcase className="w-8 h-8 text-stone-600 mx-auto mb-4" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-2">No Inquiries Found</h3>
          <p className="text-xs text-stone-500 font-light">When businesses submit the B2B form, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {b2bInquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-brand-stone border border-brand-border rounded-sm p-6 flex flex-col md:flex-row gap-6 hover:border-brand-gold/30 transition-colors duration-300">
              <div className="flex-grow space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-serif tracking-wide text-white mb-1">
                      {inquiry.company_name}
                    </h3>
                    <p className="text-xs text-stone-400 font-bold tracking-wider uppercase">
                      Contact: <span className="text-stone-300">{inquiry.contact_name}</span>
                    </p>
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-sm ${
                    inquiry.status === 'new' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    inquiry.status === 'contacted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                    inquiry.status === 'converted' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-stone-500/10 text-stone-400 border border-stone-500/20'
                  }`}>
                    {inquiry.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-500" />
                    <a href={`mailto:${inquiry.email}`} className="hover:text-brand-gold transition-colors">{inquiry.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-500" />
                    <a href={`tel:${inquiry.phone}`} className="hover:text-brand-gold transition-colors">{inquiry.phone}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                    <span>Estimated Volume: {inquiry.estimated_volume || 'Not specified'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>Date: {new Date(inquiry.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {inquiry.message && (
                  <div className="bg-brand-charcoal p-4 rounded-sm border border-brand-border/50">
                    <p className="text-xs text-stone-300 font-light leading-relaxed whitespace-pre-wrap">
                      "{inquiry.message}"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-row md:flex-col gap-2 md:w-40 md:flex-shrink-0 justify-end md:justify-start pt-2">
                <select 
                  value={inquiry.status}
                  onChange={(e) => handleUpdateStatus(inquiry.id, e.target.value)}
                  className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-2 outline-none text-white transition-all duration-300"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
