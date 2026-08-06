import React from 'react';
import HubLogo from './HubLogo.tsx';
import { PUBLISHER_NAME, AUTHOR_NAME, SUPPORT_EMAIL } from '../utils/schemaGenerator.ts';
import { Check, Globe, Mail } from 'lucide-react';

export default function LegalFooter() {
  const currentYear = 2026;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center space-y-6" id="legal-document-footer">
      {/* Brand Header & Logo */}
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="inline-flex items-center gap-2.5">
          <HubLogo size="md" editable={false} />
          <span className="font-sans font-extrabold text-xl tracking-tight text-slate-950 dark:text-white">
            Text<span className="text-indigo-600 dark:text-indigo-400">Toolkit</span>Hub
          </span>
        </div>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          Privacy-first online text, PDF &amp; image tools.
        </p>
      </div>

      {/* Publisher & Leadership Attribution */}
      <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
        <p className="font-semibold text-slate-700 dark:text-slate-300">
          Published by {PUBLISHER_NAME}
        </p>
        <p>
          Founded &amp; Edited by {AUTHOR_NAME}
        </p>
      </div>

      {/* Security & Processing Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 max-w-2xl mx-auto pt-1">
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>100% On-Device Processing</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>No Server File Uploads</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Privacy First</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Secure Browser Processing</span>
        </div>
      </div>

      {/* Website & Direct Email Link */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs font-medium text-slate-600 dark:text-slate-400 pt-1">
        <a 
          href="https://texttoolkithub.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <Globe className="w-3.5 h-3.5 text-indigo-500" />
          <span>Website: https://texttoolkithub.com</span>
        </a>
        <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
        <a 
          href={`mailto:${SUPPORT_EMAIL}`} 
          className="inline-flex items-center gap-1.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
        >
          <Mail className="w-3.5 h-3.5 text-indigo-500" />
          <span>Email: {SUPPORT_EMAIL}</span>
        </a>
      </div>

      {/* Clean Copyright Banner */}
      <div className="pt-3 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-900">
        © {currentYear} TextToolkitHub. All Rights Reserved.
      </div>
    </div>
  );
}
