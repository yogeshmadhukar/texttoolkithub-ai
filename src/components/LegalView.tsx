import React from 'react';
import { ShieldCheck, Scale, FileText, Check } from 'lucide-react';

interface LegalViewProps {
  mode: 'privacy' | 'terms';
}

export default function LegalView({ mode }: LegalViewProps) {
  const currentYear = 2026;

  return (
    <div className="relative min-h-screen bg-slate-50/30 dark:bg-slate-900 transition-colors duration-200">
      
      {/* Decorative Glow elements */}
      <div className="glow-accent top-12 left-10"></div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Paper Container layout */}
        <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm shadow-slate-100 dark:shadow-none">
          
          {mode === 'privacy' ? (
            /* PRIVACY POLICY */
            <article className="prose prose-slate dark:prose-invert max-w-none">
              
              {/* Header block */}
              <div className="border-b border-slate-100 dark:border-slate-850 pb-8 mb-8 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-sans uppercase tracking-widest rounded-full mb-3 border border-emerald-100 dark:border-emerald-950">
                  <ShieldCheck className="w-3.5 h-3.5" /> GDPR &amp; AdSense Compliant
                </span>
                <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-950 dark:text-white" id="privacy-title">
                  Privacy Policy &amp; Cookie Disclosure
                </h1>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Last Updated: June 2, {currentYear} • Authorized Version 3.0 (Production-Ready)
                </p>
              </div>

              {/* Legal parameters content */}
              <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  At TextToolkitHub (available at https://texttoolkithub.com), we have an absolute, unyielding commitment to your data privacy. Because all our utility sandboxes run 100% locally client-side, we have no access, transmission, or visibility to what you write or paste. This Privacy Policy outlines the clean data boundaries we enforce.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  1. Zero Data Transmission (100% Client-Side Processing)
                </h2>
                <p>
                  Any sentences, documents, developer scripts, HTML text, or base64 files pasted into the workspace of tools like <strong>Word Counter</strong>, <strong>Text Compare</strong>, <strong>Case Converter</strong>, <strong>HTML Encoder/Decoder</strong>, or <strong>Base64 Converter</strong> are processed exclusively inside your web browser using HTML5 variables and local memory contexts. 
                </p>
                <p>
                  No data points are uploaded to external web-servers, cloud APIs, or search engines. Your text inputs never leave your computer, rendering our utility completely secure from server-side data leaks, database breaches, or unauthorized AI training loops.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  2. GDPR Compliance &amp; Your Rights
                </h2>
                <p>
                  For users residing in the European Economic Area (EEA) and Switzerland, we adhere strictly to the General Data Protection Regulation (GDPR). Because we do not request or store any personal data from you during the usage of our text utility suites, there is no personal data stockpile for us to share or restrict.
                </p>
                <p>
                  To the extent that any system telemetry or connection logs constitute personal data, you are entitled to the following rights:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/45">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Right to Access &amp; Portability</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">You may request a detailed explanation of whether we process any temporary transactional parameters related to your IP connection.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/45">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Right to Erasure &amp; Rectification</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">You can trigger automatic local cache wipes or request immediate deletion of any temporary connection variables on-demand.</p>
                  </div>
                </div>
                <p className="mt-2">
                  To exercise any of these rights, or raise specific regulatory questions, contact us directly at <strong className="text-slate-800 dark:text-slate-200"><a href="mailto:texttoolkithub@gmail.com" className="hover:underline text-indigo-600 dark:text-indigo-400">texttoolkithub@gmail.com</a></strong>.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  3. Google AdSense &amp; Third-Party Cookies
                </h2>
                <p>
                  Third-party ad networks, specifically Google AdSense, serve contextual and interest-based advertisements on TextToolkitHub to fund our free utility servers.
                </p>
                <p>
                  Google uses cookies to serve ads on your browser based on prior visits to our platform and other sites across the internet. This includes the use of advertising cookies (such as the DoubleClick/DART cookie), which enables Google and its selected vendor partners to present personalized advertisements.
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">Opt-Out of Personalized Ads:</strong> You can completely opt-out of personalized Google interest-based advertising by visiting Google's <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">Ads Settings Link</a>.
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">Alternate Opt-Out Portal:</strong> Alternatively, you can disable third-party vendor behavioral tracking cookies by visiting the <a href="https://optout.aboutads.info" target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">AboutAds Network Portal</a>.
                  </li>
                </ul>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  4. Cookies and Web Storage Metrics
                </h2>
                <p>
                  We are deeply opposed to corporate tracking. TextToolkitHub does not load telemetry tracking pixels, social media login hooks, or cross-site behavioral vectors.
                </p>
                <p>
                  We utilize standard HTML5 Web Storage (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">localStorage</code>) to persist your workspace settings. This is limited to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-slate-700 dark:text-slate-300">Theme values:</strong> stores variables like <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded font-mono">"theme-preference": "dark"</code> so your screen is comfortable to look at on returning.</li>
                  <li><strong className="text-slate-700 dark:text-slate-300">Layout states:</strong> remembers active tabs or tool-specific switches for seamless workflows.</li>
                </ul>
                <p>
                  You are free to disable, clear, or inspect this storage data at any time through your browser's Developer Console or setting controls.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  5. Anonymous Analytics
                </h2>
                <p>
                  We employ anonymous web analytics utilities to capture simple traffic trends (e.g. daily active visitors, peak times, and common screen sizes) to improve load times. These analytics are executed without ever analyzing or storing raw text inputs, and IP addresses are masked or entirely anonymized in accordance with Google and EEA data collection guidelines.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  6. Dynamic Policy Updates &amp; Consent
                </h2>
                <p>
                  We reserve the right to audit and expand this Privacy Policy to align with new client-side capabilities. By checking our site and continuing to utilize raw string sandbox converters, you indicate your acceptance of these standards.
                </p>

              </div>

            </article>
          ) : (
            /* TERMS OF SERVICE */
            <article className="prose prose-slate dark:prose-invert max-w-none">
              
              {/* Header block */}
              <div className="border-b border-slate-100 dark:border-slate-850 pb-8 mb-8 text-center sm:text-left">
                <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-sans uppercase tracking-widest rounded-full mb-3 border border-indigo-100 dark:border-indigo-950">
                  <Scale className="w-3.5 h-3.5" /> Legal &amp; Compliance Accord
                </span>
                <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-950 dark:text-white" id="terms-title">
                  Terms &amp; Conditions of Service
                </h1>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  Last Updated: June 2, {currentYear} • Authorized Version 2.0 (Production-Ready)
                </p>
              </div>

              {/* Legal parameters content */}
              <div className="space-y-6 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                
                <p className="text-base font-semibold text-slate-800 dark:text-slate-200">
                  Welcome to TextToolkitHub (the "Platform", "we", "us", or "our"). By accessing or using our website, utilities, user interfaces, or code tools, you (the "User") unconditionally agree to be bound by these Terms &amp; Conditions. Please review them carefully before proceeding with text conversions.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  1. Scope of Service &amp; Free Accessibility
                </h2>
                <p>
                  TextToolkitHub offers an array of professional, lightweight text and string utilities—including word counting, diff comparing, case converting, HTML escaping, and Base64 hashing. These services are provided entirely 100% free of charge to any visitor for personal, professional, educational, or commercial operations. 
                </p>
                <p>
                  We do not require account registration or payment details to utilize our active tool categories. While we strive to maintain 100% availability of the Platform, we reserve the right to modify, suspend, or restrict any system utility or feature set at any time without prior written notice.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  2. Browser-Based Local Processing
                </h2>
                <p>
                  You acknowledge and understand that our digital workspace operates primarily via <strong>client-side browser execution</strong>. Any sentences, documents, HTML strings, or script bodies pasted or uploaded to our tools are computed strictly inside your browser’s local sandboxed memory. 
                </p>
                <p>
                  Because we do not transmit, analyze, or archive your text inputs on our servers, <strong className="text-slate-850 dark:text-slate-200">you retain sole ownership and absolute custody of your input content</strong>. We have no mechanism to retrieve, restore, or back up any text blocks once you clear your active browser tabs or delete local application states.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  3. Intellectual Property Rights &amp; Ownership
                </h2>
                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/45">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Our Proprietary Rights</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                    All visual components, SVG assets, CSS structures, interactive logic scripts, core source code, documentation, button icons, dynamic metadata, and branding logos comprising the TextToolkitHub brand architecture are the exclusive intellectual property of TextToolkitHub and are protected by international trademark, copyright, and patent laws.
                  </p>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Your Content Standard</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    You grant us no license or ownership rights of any text blocks processed through our tools. You represents and warrant that you hold legitimate copyrights or permissions to transform, compare, or encode any corporate or private text submitted through the browser views.
                  </p>
                </div>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  4. Acceptable Use &amp; User Responsibilities
                </h2>
                <p>
                  As an express condition of utilizing TextToolkitHub, you agree to comply with all regional, state, national, and international laws. You are strictly prohibited from implementing the following behaviors:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">Automated Abuse:</strong> Building programmatic scraper scripts, automated browser entities, or APIs designed to repeatedly ping, extract, or overload Platform bundle files.
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">Commercial Reselling / Mirroring:</strong> Framing our tools inside external advertisement wrappers or mirror portals to resell our free computational services for commercial gain without written clearance.
                  </li>
                  <li>
                    <strong className="text-slate-700 dark:text-slate-300">Malicious Payloads:</strong> Submitting files, code strings, or scripts explicitly designed to bypass local security controls, execute Cross-Site Scripting (XSS), or introduce tracking vectors to your own browser.
                  </li>
                </ul>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  5. No Suitability Warranty (As-Is Standard)
                </h2>
                <p>
                  THE TEXTTOOLKITHUB PLATFORM, CODE BASE, AND UTILITY SANDBOXES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE HEREBY DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO ANY IMPLIED WARRANTIES OF MERCHANTABILITY, SUITABILITY FOR A PARTICULAR GOAL, FREEDOM FROM PROGRAMMING ERRORS, OR NON-INFRINGEMENT.
                </p>
                <p>
                  WE DO NOT WARRANT THAT THE COMPUTED STRINGS, CASE SHIFTS, BASE64 CODES, OR TEXT COMPARISON METRICS ARE 100% ACCURATE OR SUITABLE FOR PRODUCTION GRADE AUDITS. YOU ACCEPT ALL RISKS AND SHALL VALIDATE ALL OUTPUT FORMATS MANUALLY BEFORE EMBEDDING THEM IN OFFICIAL LEGAL, MEDICAL, OR DEVELOPER DOCUMENTS.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  6. Strict Limitation of Liability
                </h2>
                <p>
                  IN NO EVENT SHALL TEXTTOOLKITHUB, ITS FOUNDERS, VENDORS, PARTNERS, OR SYSTEM ADMINISTRATORS BE LIABLE FOR ANY DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF BUSINESS PROFITS, WORK STOPPAGE, SYSTEM CRASHES, DATA LEAKS, STORAGE CORRUPTION, OR CONSEQUENTIAL INJURIES) ARISING OUT OF THE USE OF OR INABILITY TO USE THE DIGITAL TEXT SUITES.
                </p>
                <p>
                  THIS LIMITATION APPLIES EVEN IF WE HAVE BEEN ADVISE OF THE POSSIBILITY OF SUCH INJURIES AND BEARS ABSOLUTE SIGNIFICANCE TO THE TOTAL EXTENT PERMITTED BY APPLICABLE JURISDICTIONAL LAWS.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  7. Governing Law &amp; Dispute Redress
                </h2>
                <p>
                  These Terms &amp; Conditions shall be governed, interpreted, and enforced in accordance with local jurisdictional statutes without regard to its conflict of law metrics. Any legal claims or actions arising directly in connection with this agreement must be submitted to municipal arbitrations inside our principal region of operations.
                </p>

                <h2 className="text-lg font-light font-display text-slate-900 dark:text-white pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center gap-2">
                  8. Modifications &amp; Legal Inquiries
                </h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time by updating this online address. Your continued interaction with the utility systems following such modifications constitutes binding agreement to the revised terms.
                </p>
                <p>
                  If you have any questions or require legal clearance for academic or professional applications, please contact our support desk at <strong className="text-slate-800 dark:text-slate-200"><a href="mailto:texttoolkithub@gmail.com" className="hover:underline text-indigo-600 dark:text-indigo-400">texttoolkithub@gmail.com</a></strong>.
                </p>

              </div>

            </article>
          )}

        </div>

      </div>
    </div>
  );
}
