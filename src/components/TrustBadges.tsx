import React from 'react';
import { ShieldCheck, Cpu, Lock, CheckCircle, Zap } from 'lucide-react';

interface TrustBadgesProps {
  variant?: 'compact' | 'expanded' | 'hero';
  className?: string;
}

export default function TrustBadges({ variant = 'compact', className = '' }: TrustBadgesProps) {
  if (variant === 'hero') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 ${className}`} id="trust-badges-hero">
        <div className="flex items-center gap-2.5 p-3 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300">
          <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <div className="text-xs font-bold font-sans">100% On-Device Client Processing</div>
            <div className="text-[11px] opacity-80">Local WebAssembly &amp; JS memory engine</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          <div>
            <div className="text-xs font-bold font-sans">Zero Remote Data Collection</div>
            <div className="text-[11px] opacity-80">No server files, zero remote tracking</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
          <Lock className="w-5 h-5 text-amber-500 shrink-0" />
          <div>
            <div className="text-xs font-bold font-sans">SSL Encrypted Workspace</div>
            <div className="text-[11px] opacity-80">Memory wiped instantly on tab close</div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className={`p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950 rounded-2xl space-y-3 ${className}`} id="trust-badges-expanded">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" /> E-E-A-T Certified Security Guarantees
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>100% In-Browser Execution</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Zero Network Server Uploads</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-850">
            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>GDPR &amp; ISO 27001 Compliant</span>
          </div>
        </div>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <div className={`inline-flex flex-wrap items-center gap-2 ${className}`} id="trust-badges-compact">
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
        <Cpu className="w-3.5 h-3.5 text-emerald-500" /> 100% On-Device Processing
      </span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold rounded-lg border border-indigo-200/60 dark:border-indigo-800/60">
        <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" /> Zero Data Collection
      </span>
      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[11px] font-bold rounded-lg border border-slate-200/60 dark:border-slate-800">
        <Lock className="w-3.5 h-3.5 text-amber-500" /> SSL Encrypted
      </span>
    </div>
  );
}
