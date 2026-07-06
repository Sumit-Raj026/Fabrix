import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { LogIn, Key, HelpCircle, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { CONFIG } from '../config';

export default function AdminLogin({ onLoginSuccess, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        throw error;
      }
      
      if (data.user) {
        onLoginSuccess(data.user);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Invalid credentials or login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal text-white flex flex-col font-sans select-none justify-center items-center p-4">
      
      {/* Back button */}
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 flex items-center gap-2 text-stone-400 hover:text-white transition-all duration-300 px-4 py-2 border border-stone-850 hover:border-brand-gold rounded-full text-xs font-bold uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Catalog
      </button>

      {/* Login Box Wrapper */}
      <div className="w-full max-w-md bg-[#151513] border border-brand-border rounded-sm shadow-2xl overflow-hidden animate-scale-in p-8 sm:p-10">
        
        {/* Header Logo & Title */}
        <div className="text-center mb-8">
          <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white uppercase block mb-1">
            {CONFIG.STORE_NAME}
          </span>
          <span className="text-[9px] font-bold text-brand-gold tracking-[0.3em] uppercase block">
            Security Gatehouse
          </span>
        </div>

        {/* 1. SETUP REQUIRED STATE */}
        {!isSupabaseConfigured ? (
          <div className="space-y-6">
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-sm text-amber-500 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold block uppercase tracking-wider mb-1">Database Keys Needed</span>
                Supabase credentials are not configured in your project's environment variables.
              </div>
            </div>

            <div className="space-y-4 text-xs font-light text-stone-400 leading-relaxed border-t border-brand-border/60 pt-4">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-brand-gold" /> Setup Instructions:
              </h4>
              <ol className="list-decimal list-inside space-y-2.5">
                <li>Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-brand-gold underline hover:text-brand-gold-hover">supabase.com</a>.</li>
                <li>Go to <strong>Project Settings</strong> &rarr; <strong>API</strong>.</li>
                <li>Copy the <strong>Project URL</strong> and <strong>anon public key</strong>.</li>
                <li>Create a <code className="text-white bg-stone-900 px-1 py-0.5 rounded">.env</code> file in your local root directory:
                  <pre className="mt-2 p-3 bg-stone-950 text-[10px] font-mono text-stone-300 rounded border border-stone-850 overflow-x-auto whitespace-pre">
{`VITE_SUPABASE_URL=https://your-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
                  </pre>
                </li>
                <li>Restart your local server, or configure these variables inside your <strong>Vercel Project Environment Variables</strong> dashboard settings.</li>
              </ol>
            </div>
          </div>
        ) : (
          /* 2. AUTH FORM STATE */
          <form onSubmit={handleLogin} className="space-y-6">
            
            {errorMsg && (
              <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-sm text-rose-500 flex items-center gap-2.5 text-xs animate-scale-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Administrator Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@fabrix.com"
                className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3.5 outline-none text-white transition-all duration-300"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-2">
                Security Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-charcoal border border-brand-border focus:border-brand-gold text-xs tracking-wider rounded-sm p-3.5 outline-none text-white transition-all duration-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-brand-gold text-brand-charcoal font-bold text-xs tracking-widest uppercase hover:bg-brand-gold-hover active:scale-[0.99] transition-all duration-300 rounded-sm shadow-lg shadow-brand-gold/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Authenticate
                </>
              )}
            </button>

            {/* Guide Info footer */}
            <div className="border-t border-brand-border/60 pt-6 text-[10px] text-stone-500 font-light flex items-start gap-1.5 leading-relaxed">
              <Key className="w-3.5 h-3.5 text-brand-gold flex-shrink-0 mt-0.5" />
              <span>
                <strong>First-time sign in?</strong> You can add administrator credentials under your Supabase Project dashboard: <strong>Authentication</strong> &rarr; <strong>Users</strong> &rarr; <strong>Add User</strong>.
              </span>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
