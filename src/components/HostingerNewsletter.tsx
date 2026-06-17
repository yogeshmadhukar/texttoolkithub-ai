import React from 'react';
import { Mail, ShieldCheck } from 'lucide-react';

export default function HostingerNewsletter() {
  return (
    <section 
      id="newsletter-subscription" 
      className="py-16 bg-slate-50/40 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800 z-10 relative"
      aria-labelledby="newsletter-title"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="bg-white dark:bg-slate-950 px-6 py-10 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center max-w-[900px] mx-auto transition-colors duration-200"
        >
          {/* Accent Header Icon */}
          <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-100/50 dark:border-indigo-900/30">
            <Mail className="w-5 h-5" />
          </div>

          <h2 
            id="newsletter-title" 
            className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display font-sans"
          >
            TextToolkitHub Insider
          </h2>
          
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto mb-8 font-sans">
            Get notified about new tools, updates, feature launches, SEO resources, and developer utilities. No spam. Unsubscribe anytime.
          </p>

          {/* Form target container for Hostinger Reach */}
          <div 
            className="w-full max-w-md mx-auto relative min-h-[200px]" 
            style={{ display: 'block', visibility: 'visible', opacity: 1 }}
            id="hostinger-reach-form-container"
          >
            <div data-reach-form="7a1f3865-1f2c-48c5-813b-c025ea00bf7e"></div>
          </div>

          {/* Trust/GDPR Accent Text */}
          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure verification. Your email address is protected.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
