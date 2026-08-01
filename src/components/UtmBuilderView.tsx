import React, { useState, useMemo } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Link2, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  Download, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  Sparkles,
  BookOpen,
  QrCode,
  Globe,
  Settings,
  Share2,
  AlertCircle
} from 'lucide-react';

interface UtmBuilderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

const CHANNEL_PRESETS = [
  { label: 'Email Newsletter', source: 'newsletter', medium: 'email', campaign: 'weekly_digest' },
  { label: 'Google Ads (CPC)', source: 'google', medium: 'cpc', campaign: 'search_promo' },
  { label: 'Facebook Post', source: 'facebook', medium: 'social', campaign: 'organic_feed' },
  { label: 'LinkedIn Post', source: 'linkedin', medium: 'social', campaign: 'company_update' },
  { label: 'Twitter / X', source: 'twitter', medium: 'social', campaign: 'product_launch' },
  { label: 'YouTube Bio Link', source: 'youtube', medium: 'video', campaign: 'channel_bio' },
  { label: 'Affiliate Link', source: 'affiliate_partner', medium: 'referral', campaign: 'partner_promo' },
];

export default function UtmBuilderView({ onNavigateToTool, onNavigateHome }: UtmBuilderViewProps) {
  const [websiteUrl, setWebsiteUrl] = useState('https://example.com/landing');
  const [utmSource, setUtmSource] = useState('newsletter');
  const [utmMedium, setUtmMedium] = useState('email');
  const [utmCampaign, setUtmCampaign] = useState('summer_sale');
  const [utmTerm, setUtmTerm] = useState('');
  const [utmContent, setUtmContent] = useState('cta_button');

  const [lowercaseParams, setLowercaseParams] = useState(true);
  const [replaceSpaces, setReplaceSpaces] = useState<'dash' | 'underscore' | 'none'>('dash');

  const [copied, setCopied] = useState(false);
  const [pastedUrlToParse, setPastedUrlToParse] = useState('');
  const [parseNotice, setParseNotice] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Helper to format string values
  const formatVal = (val: string) => {
    let result = val.trim();
    if (lowercaseParams) {
      result = result.toLowerCase();
    }
    if (replaceSpaces === 'dash') {
      result = result.replace(/\s+/g, '-');
    } else if (replaceSpaces === 'underscore') {
      result = result.replace(/\s+/g, '_');
    }
    return result;
  };

  // Construct Final Tagged URL
  const generatedUrl = useMemo(() => {
    if (!websiteUrl.trim()) return '';

    let baseUrl = websiteUrl.trim();
    if (!/^https?:\/\//i.test(baseUrl)) {
      baseUrl = 'https://' + baseUrl;
    }

    try {
      const urlObj = new URL(baseUrl);
      
      const src = formatVal(utmSource);
      const med = formatVal(utmMedium);
      const cmp = formatVal(utmCampaign);
      const trm = formatVal(utmTerm);
      const cnt = formatVal(utmContent);

      if (src) urlObj.searchParams.set('utm_source', src);
      if (med) urlObj.searchParams.set('utm_medium', med);
      if (cmp) urlObj.searchParams.set('utm_campaign', cmp);
      if (trm) urlObj.searchParams.set('utm_term', trm);
      if (cnt) urlObj.searchParams.set('utm_content', cnt);

      return urlObj.toString();
    } catch {
      return baseUrl;
    }
  }, [websiteUrl, utmSource, utmMedium, utmCampaign, utmTerm, utmContent, lowercaseParams, replaceSpaces]);

  // Handle Preset Selection
  const applyPreset = (preset: typeof CHANNEL_PRESETS[0]) => {
    setUtmSource(preset.source);
    setUtmMedium(preset.medium);
    setUtmCampaign(preset.campaign);
  };

  // Reverse URL Parser
  const handleParseUrl = () => {
    if (!pastedUrlToParse.trim()) return;

    let target = pastedUrlToParse.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = 'https://' + target;
    }

    try {
      const urlObj = new URL(target);
      const src = urlObj.searchParams.get('utm_source') || '';
      const med = urlObj.searchParams.get('utm_medium') || '';
      const cmp = urlObj.searchParams.get('utm_campaign') || '';
      const trm = urlObj.searchParams.get('utm_term') || '';
      const cnt = urlObj.searchParams.get('utm_content') || '';

      urlObj.searchParams.delete('utm_source');
      urlObj.searchParams.delete('utm_medium');
      urlObj.searchParams.delete('utm_campaign');
      urlObj.searchParams.delete('utm_term');
      urlObj.searchParams.delete('utm_content');

      setWebsiteUrl(urlObj.origin + urlObj.pathname);
      setUtmSource(src);
      setUtmMedium(med);
      setUtmCampaign(cmp);
      setUtmTerm(trm);
      setUtmContent(cnt);

      setParseNotice(`Successfully extracted UTM parameters from URL!`);
      setTimeout(() => setParseNotice(null), 3000);
      setPastedUrlToParse('');
    } catch {
      setParseNotice(`Invalid URL string. Please enter a valid URL like https://site.com/path?utm_source=...`);
      setTimeout(() => setParseNotice(null), 4000);
    }
  };

  const handleCopy = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setWebsiteUrl('');
    setUtmSource('');
    setUtmMedium('');
    setUtmCampaign('');
    setUtmTerm('');
    setUtmContent('');
  };

  const faqs = [
    {
      q: 'What are UTM parameters and why are they important?',
      a: 'UTM (Urchin Tracking Module) parameters are standard query tags added to the end of a URL (such as utm_source, utm_medium, utm_campaign). When users click a UTM-tagged link, web analytics tools like Google Analytics track exact traffic sources, marketing campaigns, and conversion ROI.'
    },
    {
      q: 'Which UTM parameters are required?',
      a: '`utm_source` (e.g. newsletter, google, facebook) is mandatory. `utm_medium` (e.g. email, cpc, social) and `utm_campaign` (e.g. summer_sale) are strongly recommended for clean campaign grouping.'
    },
    {
      q: 'Are UTM parameters case-sensitive?',
      a: 'Yes! Google Analytics treats "Newsletter" and "newsletter" as two separate traffic sources. This is why our tool provides an automatic lowercasing toggle to keep your analytics data unified.'
    },
    {
      q: 'Is this UTM Link Builder free and private?',
      a: 'Yes. Every URL construction and parameter parsing action runs 100% locally inside your web browser. No tracking links, analytics data, or destination domains are stored or transmitted.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <button 
          onClick={onNavigateHome}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">UTM Parameter & Link Builder</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 rounded-2xl text-rose-600 dark:text-rose-400">
              <Link2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  UTM Parameter & Campaign Link Builder
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  Google Analytics Ready
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Create clean, tracking-ready marketing URLs for Google Analytics, newsletter campaigns, ad sets, and social posts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          Quick Channel Presets
        </div>
        <div className="flex flex-wrap gap-2">
          {CHANNEL_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl border border-slate-200 dark:border-slate-700/60 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reverse URL Parser Accordion / Box */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5 flex items-center gap-1.5">
          <Share2 className="w-4 h-4 text-indigo-500" />
          Reverse UTM Parser: Paste Existing Link
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={pastedUrlToParse}
            onChange={(e) => setPastedUrlToParse(e.target.value)}
            placeholder="Paste any URL containing utm_source, utm_medium, etc..."
            className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleParseUrl}
            className="px-4 py-2 text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors shrink-0"
          >
            Extract Parameters
          </button>
        </div>
        {parseNotice && (
          <div className="mt-2.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {parseNotice}
          </div>
        )}
      </div>

      {/* Main Form Fields & Generated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Form Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" /> Campaign Parameters
            </h3>
            <button
              onClick={handleClear}
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Website URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com/pricing"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Source (`utm_source`) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                placeholder="google, newsletter, facebook"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Medium (`utm_medium`)
              </label>
              <input
                type="text"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                placeholder="cpc, email, social, banner"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Name (`utm_campaign`)
              </label>
              <input
                type="text"
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="summer_sale, product_launch"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campaign Term (`utm_term`)
              </label>
              <input
                type="text"
                value={utmTerm}
                onChange={(e) => setUtmTerm(e.target.value)}
                placeholder="paid keyword search term"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Campaign Content (`utm_content`)
            </label>
            <input
              type="text"
              value={utmContent}
              onChange={(e) => setUtmContent(e.target.value)}
              placeholder="header_cta, sidebar_banner, blue_button"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Formatting Rules */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={lowercaseParams} 
                onChange={(e) => setLowercaseParams(e.target.checked)} 
                className="rounded text-indigo-600 focus:ring-indigo-500" 
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Auto-Lowercase Parameters</span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Spaces:</span>
              <select
                value={replaceSpaces}
                onChange={(e) => setReplaceSpaces(e.target.value as any)}
                className="px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg outline-none font-semibold text-slate-700 dark:text-slate-300"
              >
                <option value="dash">Replace with Dashes (-)</option>
                <option value="underscore">Replace with Underscores (_)</option>
                <option value="none">Keep Raw Spaces (%20)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Generated Output Card (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <Link2 className="w-4 h-4 text-emerald-500" /> Tagged Tracking URL
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-md border border-emerald-200 dark:border-emerald-800">
                Ready
              </span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs break-all leading-relaxed text-indigo-600 dark:text-indigo-400 min-h-[120px]">
              {generatedUrl || <span className="text-slate-400 italic">Enter a website URL above to generate your tagged campaign link...</span>}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleCopy}
                disabled={!generatedUrl}
                className="flex-1 py-2.5 px-4 bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Campaign Link!' : 'Copy UTM Link'}
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <div className="font-semibold text-slate-700 dark:text-slate-300">Campaign Summary:</div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div>Source: <span className="text-slate-900 dark:text-white font-bold">{utmSource || '-'}</span></div>
              <div>Medium: <span className="text-slate-900 dark:text-white font-bold">{utmMedium || '-'}</span></div>
              <div>Campaign: <span className="text-slate-900 dark:text-white font-bold">{utmCampaign || '-'}</span></div>
              <div>Content: <span className="text-slate-900 dark:text-white font-bold">{utmContent || '-'}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Section & FAQs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          Best Practices for UTM Campaign Link Tagging
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Adding UTM parameters to marketing URLs allows Google Analytics, Mixpanel, and Adobe Analytics to track where your website visitors come from. Always use consistent lowercase names (`utm_source=newsletter` instead of `utm_source=Newsletter`) to avoid duplicating source categories in your traffic acquisition reports.
        </p>

        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          Frequently Asked Questions
        </h4>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-4 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedFaq === idx && (
                <div className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
