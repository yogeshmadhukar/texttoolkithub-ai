import React, { useState } from 'react';
import { 
  Copyright, 
  ShieldAlert, 
  Info, 
  FileText, 
  Mail, 
  CheckCircle, 
  AlertOctagon, 
  Scale, 
  HelpCircle, 
  ArrowLeft, 
  UserCheck, 
  Send,
  Eye,
  RefreshCw
} from 'lucide-react';

interface DmcaViewProps {
  onNavigateHome: () => void;
  onNavigateToTool: (id: string) => void;
}

export default function DmcaView({ onNavigateHome, onNavigateToTool }: DmcaViewProps) {
  const currentYear = 2026;
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('texttoolkithub@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <div className="relative min-h-screen bg-slate-50/30 dark:bg-slate-900 transition-colors duration-200">
      
      {/* Premium Ambient Aura */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-indigo-200/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-red-200/5 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      
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
          <span className="text-slate-850 dark:text-slate-200 font-medium">DMCA &amp; Copyright</span>
        </nav>

        {/* Paper Container Layout */}
        <div className="border border-slate-200 dark:border-slate-880 bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm shadow-slate-100 dark:shadow-none">
          
          <article className="prose prose-slate dark:prose-invert max-w-none">
            
            {/* Premium Header Block */}
            <div className="border-b border-slate-100 dark:border-slate-850 pb-8 mb-8 text-center sm:text-left">
              <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-400 text-xs font-bold font-sans uppercase tracking-widest rounded-full mb-3 border border-red-100 dark:border-red-950/65">
                <Copyright className="w-3.5 h-3.5 animate-pulse" /> IP Protection Framework
              </span>
              <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-950 dark:text-white leading-tight" id="dmca-policy-title">
                DMCA &amp; Copyright Policy
              </h1>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-sans">
                Effective Date: June 30, {currentYear} • Standard Compliance Edition
              </p>
            </div>

            {/* Core Body Content */}
            <div className="space-y-8 text-sm text-slate-650 dark:text-slate-400 leading-relaxed font-sans">
              
              {/* Trust Signal Callout */}
              <div className="p-5 rounded-2xl border border-indigo-100 dark:border-indigo-950/50 bg-indigo-50/20 dark:bg-indigo-950/5 flex gap-4 items-start">
                <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    TextToolkitHub Respects Intellectual Property
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-650 dark:text-slate-400 leading-relaxed">
                    As an offline-first utility ecosystem, TextToolkitHub respects the proprietary content, design components, educational explanations, and intellectual creations of others. We maintain an ironclad standard against digital piracy. Valid copyright complaints submitted in accordance with the Digital Millennium Copyright Act (DMCA) will be reviewed immediately, and infringing materials will be scrubbed without hesitation.
                  </p>
                </div>
              </div>

              {/* SECTION 1: Copyright Notice */}
              <section className="space-y-3">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">01.</span> Copyright Notice
                </h2>
                <p>
                  All proprietary content featured across <strong>TextToolkitHub</strong>—including but not limited to custom-written tool guides, structured help accordions, landing page copy, user interface designs, dynamic CSS themes, original layouts, visual vector assets, code structures, and the native branding logo—is protected under international copyright treaties and domestic IP regulations.
                </p>
                <p>
                  Unauthorized duplication, framing, scraping, distribution, or reproduction of our proprietary materials without clear, written authorization from our core administration team is strictly prohibited.
                </p>
              </section>

              {/* SECTION 2: Intellectual Property Rights */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">02.</span> Intellectual Property Rights
                </h2>
                <p>
                  All text manipulation programs, regex validators, base64 checkers, and other developer tools are developed as open-source reference implementations, styled using custom React elements and the Tailwind CSS library. While the underlying open-source standard libraries and general algorithms belong to their respective standard authors, our specific visual integration, layout, text descriptions, and interactive state interfaces constitute protected IP.
                </p>
              </section>

              {/* SECTION 3: DMCA Takedown Procedure */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">03.</span> DMCA Takedown Procedure
                </h2>
                <p>
                  If you are a copyright owner or an authorized agent representing one, and you believe that any content hosted or displayed directly on <a href="https://texttoolkithub.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">https://texttoolkithub.com</a> infringes upon your copyright under United States Code Title 17, Section 512(c)(3), you may submit a formal notification (referred to as a "DMCA Takedown Notice") to our designated Copyright Agent.
                </p>
                <p>
                  Upon receipt of a valid, legally compliant notification, we will immediately act to remove or disable access to the disputed material.
                </p>
              </section>

              {/* SECTION 4: Information Required in a Copyright Complaint */}
              <section className="space-y-4 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">04.</span> Information Required in a Complaint
                </h2>
                <p>
                  To enable us to identify the disputed content and act quickly, your DMCA notice must be a written communication that includes the following details (please consult your legal counsel or refer to 17 U.S.C. § 512(c)(3) for details):
                </p>

                <div className="bg-slate-50/55 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-850 p-5 space-y-3">
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <strong>Signature:</strong> A physical or electronic signature of the copyright owner or a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <strong>Identification of Infringed Work:</strong> A clear description of the copyrighted work that you claim has been infringed (such as direct source URLs, original publication dates).
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <strong>Identification of Infringing Content:</strong> Specific identifiers and exact URLs on TextToolkitHub where the infringing material is located so we can locate it instantly.
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <strong>Contact Info:</strong> Your physical address, telephone number, and direct email address.
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <strong>Good Faith Statement:</strong> A clear statement that you have a good faith belief that the use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      <strong>Accuracy Oath:</strong> A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 5: Counter-Notification Procedure */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">05.</span> Counter-Notification Procedure
                </h2>
                <p>
                  If content you submitted, hosted, or provided was removed due to an error or misidentification of the material, you may submit a written Counter-Notification under Sections 512(g)(2) and (3) of the DMCA.
                </p>
                <p>
                  To be effective, your counter-notification must contain your contact details, identification of the removed file, a statement under penalty of perjury of your good faith belief that the content was removed by mistake, and your consent to the jurisdiction of the Federal District Court.
                </p>
              </section>

              {/* SECTION 6: Repeat Infringer Policy */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">06.</span> Repeat Infringer Policy
                </h2>
                <p>
                  While TextToolkitHub does not host user-generated profiles or public cloud storage boards, we take infringement seriously. In accordance with the DMCA and other applicable IP frameworks, we maintain a strict policy to block any individual, contributor, developer, or user who is determined to be a repeat infringer of our own or others' intellectual property.
                </p>
              </section>

              {/* SECTION 7: Fair Use Statement */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">07.</span> Fair Use Statement
                </h2>
                <p>
                  TextToolkitHub occasionally quotes standard tech specifications, RFC clauses, or software library instructions under the **Fair Use** doctrine. These brief excerpts are strictly educational and serve to help developers understand, configure, and operate the browser-based tools effectively. We make no claim of ownership over referenced RFC standards or library names.
                </p>
              </section>

              {/* SECTION 8: Third-Party Content Disclaimer */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">08.</span> Third-Party Content Disclaimer
                </h2>
                <p>
                  Occasionally, user input fields can load external templates (like pre-saved mock JSON payloads, open-source cron scripts, or public test texts). These sample materials are pulled exclusively from standard publicly available presets. If any preset belongs to you and was not authorized for open-source reference usage, please notify us and we will replace it immediately.
                </p>
              </section>

              {/* SECTION 9: Contact Information */}
              <section className="space-y-4 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">09.</span> Contact Information for copyright Issues
                </h2>
                <p>
                  Please send all copyright notices, license queries, and DMCA claims directly to our designated contact address. Email submissions are highly preferred for rapid processing:
                </p>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-2">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-150 dark:border-slate-850 flex-grow">
                    <span className="text-xs text-slate-400 block mb-0.5">Primary Compliance Desk</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                      texttoolkithub@gmail.com
                    </span>
                  </div>
                  <button 
                    onClick={handleCopyEmail}
                    className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    {copiedEmail ? <UserCheck className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                    {copiedEmail ? 'Copied to Clipboard!' : 'Copy Support Email'}
                  </button>
                </div>
              </section>

              {/* SECTION 10: Policy Updates */}
              <section className="space-y-3 border-t border-slate-100 dark:border-slate-850 pt-6">
                <h2 className="text-lg sm:text-xl font-light font-display text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-500">10.</span> Policy Updates
                </h2>
                <p>
                  This Copyright and DMCA Policy is active in its current form and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page. We reserve the right to update this policy at any time to guarantee full regulatory compliance.
                </p>
              </section>

              {/* Legal Warning FAQS Callout */}
              <div className="border border-red-150 dark:border-red-950/40 rounded-2xl p-5 space-y-3 mt-8 bg-red-500/5">
                <h3 className="font-semibold text-red-850 dark:text-red-400 flex items-center gap-1.5 text-xs sm:text-sm">
                  <AlertOctagon className="w-4 h-4 text-red-650 dark:text-red-400" /> Important Warning for Claimants
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages, including attorney's fees and litigation costs incurred by the alleged infringer or the platform operator. Do not submit false copyright allegations.
                </p>
              </div>

            </div>

          </article>

        </div>

      </div>
    </div>
  );
}
