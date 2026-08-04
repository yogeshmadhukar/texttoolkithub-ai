import React from 'react';
import { TOOLS } from '../data.ts';
import { getCleanPath } from '../types.ts';
import { Wrench, Github, Scale, HelpCircle, Shield, FileText, Linkedin } from 'lucide-react';
import HubLogo from './HubLogo.tsx';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = 2026; // Set exactly based on agent metadata context

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      onNavigate(page);
    }
  };

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        
        {/* Top Segment: 4 Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Column 1: Brand Pitch */}
          <div className="flex flex-col gap-4">
            <a 
              href={getCleanPath('home')}
              onClick={(e) => handleLinkClick(e, 'home')}
              className="flex items-center gap-2 group focus:outline-none"
              id="footer-logo-link"
            >
              <div className="group-hover:scale-105 transition-transform duration-200 shrink-0">
                <HubLogo size="md" editable={false} />
              </div>
              <span className="font-sans font-extrabold text-lg tracking-tight text-slate-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Text<span className="text-indigo-600 dark:text-indigo-400">Toolkit</span>Hub
              </span>
            </a>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Free online text tools for writers, developers, students, and professionals. Fast, accurate, and privacy-focused.
            </p>
            {/* Social Links Row */}
            <div className="flex items-center gap-3">
              <a
                href="https://x.com/TextToolkitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-650 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-550/20 dark:hover:border-indigo-500/20 hover:shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                title="Follow TextToolkitHub on X (Twitter)"
                aria-label="Follow TextToolkitHub on X (Twitter)"
                id="footer-x-link"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/texttoolkithub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-650 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 hover:text-[#0077b5] dark:hover:text-[#0a66c2] hover:border-indigo-550/20 dark:hover:border-indigo-500/20 hover:shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                title="Connect with TextToolkitHub on LinkedIn"
                aria-label="Connect with TextToolkitHub on LinkedIn"
                id="footer-linkedin-link"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Core Tools */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 dark:text-amber-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Popular Utilities
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              {TOOLS.slice(0, 6).map((tool) => (
                <li key={tool.id}>
                  <a 
                    href={getCleanPath(tool.id)}
                    onClick={(e) => handleLinkClick(e, tool.id)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-left transition-colors inline-block"
                    id={`footer-tool-${tool.id}`}
                  >
                    {tool.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Corporate Info */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5" /> Corporate Info
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a 
                  href={getCleanPath('tools')} 
                  onClick={(e) => handleLinkClick(e, 'tools')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-left transition-colors inline-block" 
                  id="footer-link-tools"
                >
                  Tools Directory
                </a>
              </li>
              <li>
                <a 
                  href={getCleanPath('guides')} 
                  onClick={(e) => handleLinkClick(e, 'guides')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-left transition-colors inline-block" 
                  id="footer-link-guides"
                >
                  Educational Guides
                </a>
              </li>
              <li>
                <a 
                  href={getCleanPath('about')} 
                  onClick={(e) => handleLinkClick(e, 'about')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer text-left transition-colors inline-block" 
                  id="footer-link-about"
                >
                  About Our Platform
                </a>
              </li>
              <li>
                <a 
                  href={getCleanPath('contact')} 
                  onClick={(e) => handleLinkClick(e, 'contact')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors inline-block" 
                  id="footer-link-contact"
                >
                  Talk to Support
                </a>
              </li>
              <li>
                <a 
                  href={getCleanPath('faq')} 
                  onClick={(e) => handleLinkClick(e, 'faq')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors inline-block" 
                  id="footer-link-faqs"
                >
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal Framework */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Legal Framework
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <a 
                  href={getCleanPath('privacy')} 
                  onClick={(e) => handleLinkClick(e, 'privacy')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors inline-block" 
                  id="footer-link-privacy"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href={getCleanPath('cookie-policy')} 
                  onClick={(e) => handleLinkClick(e, 'cookie-policy')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors inline-block" 
                  id="footer-link-cookie-policy"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a 
                  href={getCleanPath('dmca')} 
                  onClick={(e) => handleLinkClick(e, 'dmca')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors inline-block" 
                  id="footer-link-dmca"
                >
                  DMCA Policy
                </a>
              </li>
              <li>
                <a 
                  href={getCleanPath('terms')} 
                  onClick={(e) => handleLinkClick(e, 'terms')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors inline-block" 
                  id="footer-link-terms"
                >
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a 
                  href={getCleanPath('disclaimer')} 
                  onClick={(e) => handleLinkClick(e, 'disclaimer')} 
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors inline-block" 
                  id="footer-link-disclaimer"
                >
                  Disclaimer
                </a>
              </li>
              <li className="text-xs mt-1 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded inline-block w-fit">
                ✓ Local Client Mode Active
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="border-t border-slate-200 dark:border-slate-850 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              © {currentYear} TextToolkitHub. Founded &amp; Edited by Yogesh Kumar Madhukar.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              This website comes under <strong className="font-semibold text-indigo-650 dark:text-indigo-400">Madhukar &amp; Sons</strong>. 100% on-device client-side processing with zero remote data collection.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="font-mono bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 px-2.5 py-1 rounded-md text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
              Madhukar &amp; Sons Digital
            </span>
            <span className="font-mono bg-slate-100 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 px-2.5 py-1 rounded-md text-[10px] text-slate-500 dark:text-slate-400">
              v1.0.0 Stable
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
