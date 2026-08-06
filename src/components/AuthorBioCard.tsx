import React from 'react';
import { Mail, Linkedin, ShieldCheck, CheckCircle2, User, Award, Calendar, Lock } from 'lucide-react';
import founderImage from '../assets/images/regenerated_image_1786048550988.jpg';
import { AUTHOR_NAME, AUTHOR_JOB_TITLE, PUBLISHER_NAME, GENERAL_EMAIL, AUTHOR_LINKEDIN, AUTHOR_X } from '../utils/schemaGenerator.ts';

interface AuthorBioCardProps {
  toolName?: string;
  lastUpdated?: string;
  onNavigate?: (page: string) => void;
}

export default function AuthorBioCard({
  toolName,
  lastUpdated = 'August 2026',
  onNavigate
}: AuthorBioCardProps) {

  const handleEditorialClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('about');
      // Scroll to editorial section if on about page
      setTimeout(() => {
        const el = document.getElementById('editorial-policy-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.location.href = '/about#editorial-policy-section';
    }
  };

  return (
    <div className="w-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 shadow-xs my-8 transition-colors duration-200" id="author-bio-card">
      
      {/* Top Banner: Verification & Technical Audit Stamp */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-100 dark:border-slate-850 text-xs">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1.5 rounded-full border border-emerald-200/50 dark:border-emerald-900/50">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Verified &amp; Tested Technical Accuracy</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Verified &amp; Updated: <strong className="text-slate-800 dark:text-slate-200">{lastUpdated}</strong></span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        
        {/* Author Avatar Badge */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-100 dark:bg-slate-900 shrink-0 shadow-md border-2 border-white dark:border-slate-850 relative overflow-hidden group">
          <img
            src={founderImage}
            alt={AUTHOR_NAME}
            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/45 via-transparent to-transparent opacity-60 pointer-events-none" />
          <div className="absolute bottom-1 left-0 right-0 text-center">
            <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold bg-indigo-650/95 px-1.5 py-0.5 rounded-full text-white backdrop-blur-xs">
              AUTHOR
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="flex-1 space-y-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-sans">
                  {AUTHOR_NAME}
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-md">
                  Expert Reviewer
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                {AUTHOR_JOB_TITLE} at <strong className="text-indigo-600 dark:text-indigo-400">{PUBLISHER_NAME}</strong>
              </p>
            </div>

            {/* Contact & Social Links */}
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${GENERAL_EMAIL}`}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-800 transition text-xs flex items-center gap-1 font-medium"
                title="Email Author & Technical Editor (hello@texttoolkithub.com)"
              >
                <Mail className="w-3.5 h-3.5" /> Email
              </a>
              <a
                href={AUTHOR_LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-[#0077b5]/10 text-slate-600 dark:text-slate-300 hover:text-[#0077b5] border border-slate-200 dark:border-slate-800 transition text-xs flex items-center gap-1 font-medium"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5" /> Profile
              </a>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Yogesh Kumar Madhukar is an experienced full-stack web developer and technical editor with over a decade of expertise in browser engineering, client-side data parsing, and WebAssembly utilities. As the founder of TextToolkitHub under <strong>{PUBLISHER_NAME}</strong>, Yogesh personally architects, audits, and verifies every tool for technical accuracy, high execution speed, and strict <strong>zero-knowledge privacy compliance</strong>.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-850">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                100% On-Device Client Processing
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 dark:text-slate-400">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                Zero Data Server Uploads
              </span>
            </div>

            <a
              href="/about#editorial-policy-section"
              onClick={handleEditorialClick}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Award className="w-3.5 h-3.5" /> View Editorial &amp; Technical Accuracy Policy →
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
