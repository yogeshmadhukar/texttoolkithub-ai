import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Info, 
  Sliders, 
  Settings, 
  Check, 
  X, 
  AlertTriangle, 
  HelpCircle, 
  Lock, 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  RefreshCw,
  HeartHandshake
} from 'lucide-react';
import { getSavedConsentStatus, setAnalyticsConsent, GA_MEASUREMENT_ID } from '../lib/analytics.ts';

interface CookiePolicyViewProps {
  onNavigateHome: () => void;
  onNavigateToTool: (id: string) => void;
}

export default function CookiePolicyView({ onNavigateHome, onNavigateToTool }: CookiePolicyViewProps) {
  const currentYear = 2026;
  
  // Real-time state management for the interactive cookie preferences dashboard
  const [analyticsConsent, setAnalyticsConsentState] = useState<'granted' | 'denied' | 'pending'>(() => {
    return getSavedConsentStatus();
  });
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state with local storage on user action
  const handleToggleAnalytics = (approved: boolean) => {
    setAnalyticsConsent(approved);
    const newStatus = approved ? 'granted' : 'denied';
    setAnalyticsConsentState(newStatus);
    
    setToastMessage(`Preferences successfully updated! Analytics tracking is now ${approved ? 'ENABLED (Anonymized)' : 'DISABLED'}.`);
    
    // Automatically fade out the toast message after 4 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/30 dark:bg-slate-900 transition-colors duration-200">
      
      {/* Premium Ambient Aura */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-200/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-emerald-200/10 dark:bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 font-sans" aria-label="Breadcrumb">
          <button 
            onClick={onNavigateHome}
            className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors"
          >
            Home
          </button>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-850 dark:text-slate-200 font-medium">Cookie Policy</span>
        </nav>

        {/* Status Toast Notification */}
        {toastMessage && (
          <div 
            className="fixed bottom-6 right-6 z-[10000] flex items-center gap-3 px-4 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-medium rounded-xl shadow-xl border border-slate-800 dark:border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300"
            role="alert"
          >
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
            <button 
              onClick={() => setToastMessage(null)}
              className="ml-2 hover:opacity-75 transition-opacity"
              aria-label="Close notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Paper Container layout */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm shadow-slate-100 dark:shadow-none">
          
          <article className="prose prose-slate dark:prose-invert max-w-none">
            
            {/* Premium Header Block */}
            <div className="border-b border-slate-100 dark:border-slate-850 pb-8 mb-8 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-sans uppercase tracking-widest rounded-full mb-3 border border-indigo-100 dark:border-indigo-950/65">
                <Cookie className="w-3.5 h-3.5" /> Cookie Framework
              </span>
              <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-950 dark:text-white leading-tight" id="cookie-policy-title">
                Cookie Policy &amp; Tracking Consent
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-sans">
                Last Updated: June 30, {currentYear} • Authorized Version 1.0 (AdSense &amp; GDPR Compliant)
              </p>
            </div>

            {/* Core Body Content */}
            <div className="space-y-8 text-sm text-slate-650 dark:text-slate-400 leading-relaxed font-sans">
              
              {/* Privacy First Callout */}
              <div className="p-5 rounded-2xl border border-emerald-100 dark:border-emerald-950/50 bg-emerald-50/20 dark:bg-emerald-950/5 flex gap-4 items-start">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-emerald-850 dark:text-emerald-400 mb-1">
                    Privacy-First Architecture Notice
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    TextToolkitHub is engineered as a secure client-side workspace. Absolutely none of the text, codes, files, or JSON payloads you format, minify, reverser, or check ever reach our servers. Everything computes locally in your web browser. This Cookie Policy explains the minimal, transparent, and user-controlled cookies we utilize to sustain this platform.
                  </p>
                </div>
              </div>

              {/* SECTION 1: Introduction */}
              <section className="space-y-3">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">01.</span> Introduction
                </h2>
                <p>
                  At TextToolkitHub (available at <a href="https://texttoolkithub.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">https://texttoolkithub.com</a>), we prioritize absolute transparency in our data processing pipelines. This Cookie Policy details how we use cookies, local storage variables, and alternative tracking technologies to enable visual comfort settings, optimize rendering performance, prevent connection fraud, and finance our free utilities through Google AdSense.
                </p>
                <p>
                  By continuing to use our website, you agree that we can place cookies on your computer or device in accordance with this policy, unless you have configured your browser settings or adjusted our interactive preference center to reject them.
                </p>
              </section>

              {/* SECTION 2: What Cookies Are */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">02.</span> What Cookies Are
                </h2>
                <p>
                  Cookies are small alphanumeric text files placed on your computer, tablet, or smartphone by your browser when you visit websites. They act as a memory log for a website, enabling it to recognize your device across page views or on subsequent visits.
                </p>
                <p>
                  In addition to standard cookies, we use HTML5 Web Storage (<code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-slate-700 dark:text-slate-300">localStorage</code> and <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs text-slate-700 dark:text-slate-300">sessionStorage</code>). Web storage performs a similar function but is highly optimized for performance because data resides strictly in your browser and is never automatically transmitted to web-servers with every HTTP packet request, guaranteeing robust security.
                </p>
              </section>

              {/* SECTION 3: Types of Cookies Used */}
              <section className="space-y-4 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">03.</span> Types of Cookies We Use
                </h2>
                <p>
                  We categorize the technical identifiers stored in your web browser into four primary brackets to ensure complete compliance with EU (GDPR) and California (CCPA) standards.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Category A */}
                  <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Lock className="w-4 h-4" />
                      <h3 className="text-sm">Essential Cookies</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Necessary for basic security, routing, and interface persistence. These do not store personal details. For example, we save your dark/light theme choice (<code className="px-1 bg-slate-100 dark:bg-slate-800 rounded font-mono">theme-preference</code>) inside local storage so you do not suffer visual eye-strain from a white flash when navigating pages.
                    </p>
                  </div>

                  {/* Category B */}
                  <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Sliders className="w-4 h-4" />
                      <h3 className="text-sm">Functional Cookies</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Remembers temporary settings inside our text sandboxes—such as column spacing choices inside the CSV Formatter or character replacements in the Fancy Text Generator. This is saved in client memory to preserve your progress and save user effort on page reloads.
                    </p>
                  </div>

                  {/* Category C */}
                  <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Settings className="w-4 h-4" />
                      <h3 className="text-sm">Analytics Cookies</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Provided by Google Analytics (GA4) with strict IP masking. These measure aggregate metrics like unique visitors, popular tool categories, and page loading latency, helping us pinpoint and debug system errors. They run only if you click "Accept".
                    </p>
                  </div>

                  {/* Category D */}
                  <div className="p-5 rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                      <Cookie className="w-4 h-4" />
                      <h3 className="text-sm">Advertising Cookies</h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Set by Google AdSense and third-party advertising vendors. Google uses cookies (including the DoubleClick and DART cookies) to serve targeted, safe, and contextually appropriate ads on our platform based on prior page visits.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Third-Party Services */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">04.</span> Third-Party Services
                </h2>
                <p>
                  We limit our reliance on external scripts to maintain bulletproof privacy boundaries. Currently, the only active third-party integrations that can set cookies are:
                </p>
                <div className="space-y-3.5 mt-2">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/25">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">Google Analytics (GA4)</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Measures traffic trends anonymously. Under our active integration protocol, your IP is automatically masked/hashed, cross-device behavioral profiles are disabled, and ad personalization signals are hard-coded to off. Tracking ID: <code className="font-mono bg-slate-100 dark:bg-slate-800 text-[10px] px-1 rounded">{GA_MEASUREMENT_ID}</code>.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-900/25">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">Google AdSense</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      Serves context-appropriate advertisements to sustain TextToolkitHub as a free resource. Google utilizes cookies to optimize ad serving. You can review Google’s advertising terms and opt-out of ad personalization directly through the official <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5">Google Ads Settings Portal <ExternalLink className="w-3 h-3 inline" /></a>.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 5: INTERACTIVE CONSENT DASHBOARD (GDPR Gold Standard) */}
              <section className="border-2 border-indigo-650/25 dark:border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/10 rounded-2xl p-6 sm:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                    05. Interactive Cookie Preferences
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  You can inspect or override your active tracking consent status right here. This preference is saved directly inside your local storage state and immediately updates our site’s Google Analytics configuration.
                </p>

                {/* Dashboard Panel */}
                <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 p-4 sm:p-5 mt-4 space-y-4">
                  
                  {/* Row A: Essential */}
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200">Essential &amp; Functional Web Storage</span>
                        <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded uppercase">Required</span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Persists UI states, dark mode preferences, and local tool inputs. Cannot be turned off.
                      </p>
                    </div>
                    <div className="flex items-center justify-center h-8">
                      <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-950 rounded-lg text-xs font-semibold inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Active
                      </div>
                    </div>
                  </div>

                  {/* Row B: Google Analytics */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-slate-850 dark:text-slate-200">Masked Google Analytics Tracking</span>
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded uppercase ${
                          analyticsConsent === 'granted' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/45 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-500'
                        }`}>
                          {analyticsConsent === 'granted' ? 'Approved' : 'Restricted'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Captures system traffic and performance aggregate metrics safely. Zero text tracking.
                      </p>
                    </div>
                    
                    {/* Switch Toggle Buttons */}
                    <div className="flex items-center gap-2 sm:self-center">
                      <button
                        onClick={() => handleToggleAnalytics(false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                          analyticsConsent !== 'granted'
                            ? 'bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 border border-red-200 dark:border-red-900/60 font-semibold'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850'
                        }`}
                        aria-label="Decline analytics tracking"
                        id="cookie-dashboard-decline"
                      >
                        Restrict
                      </button>
                      <button
                        onClick={() => handleToggleAnalytics(true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                          analyticsConsent === 'granted'
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-semibold'
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-850'
                        }`}
                        aria-label="Authorize analytics tracking"
                        id="cookie-dashboard-accept"
                      >
                        Authorize
                      </button>
                    </div>
                  </div>

                </div>

                <div className="text-[11px] text-slate-400 dark:text-slate-500 italic flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin duration-1000" /> State matches the active bottom consent banner configurations.
                </div>
              </section>

              {/* SECTION 6: How Users Can Disable Cookies */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">06.</span> Disabling &amp; Clearing Browser Cookies
                </h2>
                <p>
                  You are the absolute owner of your browser. You can control, block, or completely purge both cookies and Web Storage parameters.
                </p>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  To manage cookies across major web browsers, check the standard settings blocks:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/15 dark:bg-slate-900/10">
                    <strong className="text-slate-700 dark:text-slate-350">Google Chrome:</strong>
                    <p className="mt-1">Settings &rarr; Privacy &amp; Security &rarr; Third-Party Cookies &rarr; Block or Clear.</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/15 dark:bg-slate-900/10">
                    <strong className="text-slate-700 dark:text-slate-350">Apple Safari:</strong>
                    <p className="mt-1">Preferences &rarr; Privacy &rarr; Manage Website Data &rarr; Remove All.</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/15 dark:bg-slate-900/10">
                    <strong className="text-slate-700 dark:text-slate-350">Mozilla Firefox:</strong>
                    <p className="mt-1">Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data &rarr; Manage Data.</p>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/15 dark:bg-slate-900/10">
                    <strong className="text-slate-700 dark:text-slate-350">Microsoft Edge:</strong>
                    <p className="mt-1">Settings &rarr; Cookies and Site Permissions &rarr; Manage and Delete Cookies.</p>
                  </div>
                </div>
                <p className="text-xs text-slate-450 dark:text-slate-500 pt-1">
                  <em>Note:</em> Purging your Web Storage or clearing cookies will reset your custom dark theme visual setting and clear active text inputs saved inside the workspace.
                </p>
              </section>

              {/* SECTION 7: Data Protection & GDPR/CCPA Rights */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">07.</span> Data Protection &amp; Legal Frameworks (GDPR &amp; CCPA)
                </h2>
                <p>
                  We recognize your digital sovereignty.
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong className="text-slate-850 dark:text-slate-200">EU GDPR Rights:</strong> Since we do not transmit your text conversions to servers, we do not compile, hold, or utilize personal profiles. Your local files remain yours. To request any connection log metrics we occasionally parse for firewall protection, you have a full right to request copies under Article 15.
                  </li>
                  <li>
                    <strong className="text-slate-850 dark:text-slate-200">California CCPA / CPRA Rules:</strong> We do not sell, rent, or trade your personal information. We do not transmit user datasets to marketing databases, which fully complies with California’s anti-selling laws.
                  </li>
                </ul>
              </section>

              {/* SECTION 8: Children's Privacy */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">08.</span> Children's Online Privacy Protection
                </h2>
                <p>
                  Our developer and text converter utilities are completely family-safe and do not knowingly capture or record personal details from children under the age of 13. If you believe a minor has initiated a tracking session on their browser that we have processed, please contact us immediately to facilitate a cache flush.
                </p>
              </section>

              {/* SECTION 9: Policy Updates */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">09.</span> Policy Updates
                </h2>
                <p>
                  TextToolkitHub reserves the right to revise this Cookie Policy to match evolving browser security frameworks or changes in ad-serving rules. Any adjustments made are reflected directly on this page with an updated "Last Updated" timestamp at the header of the document.
                </p>
              </section>

              {/* SECTION 10: Contact Information */}
              <section className="space-y-4 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">10.</span> Contact Information
                </h2>
                <p>
                  For privacy complaints, feedback regarding local storage states, or queries about this cookie policy, please send a message to our development team:
                </p>
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-150 dark:border-slate-850 inline-block">
                  <span className="text-xs text-slate-400 block mb-0.5">Primary Support Address</span>
                  <a 
                    href="mailto:texttoolkithub@gmail.com" 
                    className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
                  >
                    texttoolkithub@gmail.com
                  </a>
                </div>
              </section>

              {/* FAQS Callout */}
              <div className="border border-slate-150 dark:border-slate-850 rounded-2xl p-5 space-y-3.5 mt-8">
                <h3 className="font-semibold text-slate-850 dark:text-slate-200 flex items-center gap-1.5 text-xs sm:text-sm">
                  <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Cookie Policy FAQ
                </h3>
                <div className="space-y-3 text-xs leading-relaxed">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-350">Are my texts safe?</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Yes, absolutely. Cookies only save site preferences and aggregate page-visit tallies. Your pasted documents, passwords, or JSON payloads are handled in-browser and are never saved in any cookies.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-350">What is the "DART cookie"?</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5">Google utilizes the DART/DoubleClick cookie to serve ads based on your internet browsing trends. This does not monitor your private code or files on this platform.</p>
                  </div>
                </div>
              </div>

            </div>

          </article>

        </div>

      </div>
    </div>
  );
}
