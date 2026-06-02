import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Info, Check, X } from 'lucide-react';
import { 
  GA_MEASUREMENT_ID, 
  getSavedConsentStatus, 
  setAnalyticsConsent 
} from '../lib/analytics.ts';

interface AnalyticsConsentBannerProps {
  onConsentChange?: (consentStatus: 'granted' | 'denied') => void;
}

export default function AnalyticsConsentBanner({ onConsentChange }: AnalyticsConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show only if a valid Google Analytics ID is declared AND consent is still 'pending'
    if (GA_MEASUREMENT_ID) {
      const status = getSavedConsentStatus();
      if (status === 'pending') {
        // Trigger soft layout delay for premium visual entry
        const timer = setTimeout(() => {
          setVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDecline = () => {
    setAnalyticsConsent(false);
    setVisible(false);
    if (onConsentChange) onConsentChange('denied');
  };

  const handleAccept = () => {
    setAnalyticsConsent(true);
    setVisible(true); // briefly show checked status, then exit
    setTimeout(() => {
      setVisible(false);
      if (onConsentChange) onConsentChange('granted');
    }, 400);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-white dark:bg-[#0c111d] border border-slate-200/80 dark:border-slate-850 p-5 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/60 z-[9999] font-sans"
          id="analytics-consent-banner"
        >
          <div className="flex items-start gap-3">
            
            {/* Soft info shielding icon */}
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100/40 dark:border-indigo-950/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                Privacy &amp; Statistical Processing
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                TextToolkitHub employs masked, anonymous connection data to prevent system bugs and index tool traffic peaks. <strong className="text-slate-700 dark:text-slate-350">We strictly never process, record, or transmit any pasted texts, codes, or file variables.</strong> 
              </p>
              
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                Refer to our{' '}
                <a 
                  href="#/privacy" 
                  className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500"
                >
                  Privacy Policy
                </a>{' '}
                to examine your rights under GDPR.
              </div>

              {/* Action Blocks */}
              <div className="mt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleDecline}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  id="analytics-decline-btn"
                >
                  Decline Statistics
                </button>
                <button
                  type="button"
                  onClick={handleAccept}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-[11px] font-medium text-white transition-colors cursor-pointer inline-flex items-center gap-1 shadow-sm"
                  id="analytics-accept-btn"
                >
                  <span>Accept Statistics</span>
                </button>
              </div>

            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
