import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Globe, 
  Copy, 
  Check, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  Info, 
  HelpCircle, 
  ArrowUpRight, 
  Eye, 
  Code, 
  Search, 
  RefreshCw, 
  FileText,
  User,
  Key,
  Link as LinkIcon,
  Image as ImageIcon,
  Twitter,
  Facebook,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface MetaTagGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface FormState {
  // Website info
  title: string;
  description: string;
  canonicalUrl: string;
  author: string;
  keywords: string;
  
  // Open Graph
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogImage: string;
  ogType: string;
  
  // Twitter Cards
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterCard: string;
  
  // Sync options
  syncOgWithWebsite: boolean;
  syncTwitterWithWebsite: boolean;
}

const INITIAL_FORM: FormState = {
  title: 'TextToolkitHub - Private, Free Online String Utilities',
  description: 'Instantly format, clean, convert, analyze, and encode your text. All tools are 100% free, private, and execute locally in your browser.',
  canonicalUrl: 'https://texttoolkithub.com',
  author: 'TextToolkitHub Team',
  keywords: 'text tools, word counter, case converter, slug generator, base64 encoder, offline text tools',
  
  ogTitle: '',
  ogDescription: '',
  ogUrl: '',
  ogImage: 'https://texttoolkithub.com/og-banner.png',
  ogType: 'website',
  
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterCard: 'summary_large_image',
  
  syncOgWithWebsite: true,
  syncTwitterWithWebsite: true,
};

export default function MetaTagGeneratorView({ onNavigateToTool, onNavigateHome }: MetaTagGeneratorViewProps) {
  const [form, setFormState] = useState<FormState>(() => {
    const cached = localStorage.getItem('tth_meta_tag_form');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return INITIAL_FORM;
      }
    }
    return INITIAL_FORM;
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'og' | 'twitter'>('edit');
  const [previewPlatform, setPreviewPlatform] = useState<'google' | 'facebook' | 'twitter'>('google');
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // References to input elements for focusing on recommendation click
  const inputRefs = {
    title: useRef<HTMLInputElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    canonicalUrl: useRef<HTMLInputElement>(null),
    author: useRef<HTMLInputElement>(null),
    keywords: useRef<HTMLInputElement>(null),
    ogImage: useRef<HTMLInputElement>(null),
  };

  const seoTitle = "Meta Tag Generator – Create SEO Meta Tags, Open Graph & Twitter Cards";
  const seoDescription = "Generate SEO meta tags, Open Graph tags and Twitter Card metadata instantly with live previews and basic audit checks.";

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('tth_meta_tag_form', JSON.stringify(form));
  }, [form]);

  // Handle syncing of OG and Twitter state when parent values update
  const updateForm = (updates: Partial<FormState>) => {
    setFormState(prev => {
      const next = { ...prev, ...updates };

      // Handle OG sync
      if (next.syncOgWithWebsite) {
        if (updates.title !== undefined) next.ogTitle = next.title;
        if (updates.description !== undefined) next.ogDescription = next.description;
        if (updates.canonicalUrl !== undefined) next.ogUrl = next.canonicalUrl;
      }

      // Handle Twitter sync
      if (next.syncTwitterWithWebsite) {
        if (updates.title !== undefined) next.twitterTitle = next.title;
        if (updates.description !== undefined) next.twitterDescription = next.description;
        if (updates.ogImage !== undefined || updates.canonicalUrl !== undefined) {
          next.twitterImage = next.ogImage;
        }
      }

      return next;
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to restore the default values? All your progress will be cleared.')) {
      setFormState(INITIAL_FORM);
      localStorage.removeItem('tth_meta_tag_form');
    }
  };

  // Derived tags values
  const effectiveOgTitle = form.syncOgWithWebsite ? form.title : form.ogTitle;
  const effectiveOgDescription = form.syncOgWithWebsite ? form.description : form.ogDescription;
  const effectiveOgUrl = form.syncOgWithWebsite ? form.canonicalUrl : form.ogUrl;
  const effectiveOgImage = form.ogImage;

  const effectiveTwitterTitle = form.syncTwitterWithWebsite ? form.title : form.twitterTitle;
  const effectiveTwitterDescription = form.syncTwitterWithWebsite ? form.description : form.twitterDescription;
  const effectiveTwitterImage = form.syncTwitterWithWebsite ? form.ogImage : form.twitterImage;

  // Code Block Builder
  const generatedCode = useMemo(() => {
    const codeLines: string[] = [];

    codeLines.push('<!-- Primary Meta Tags -->');
    if (form.title) {
      codeLines.push(`<title>${form.title}</title>`);
      codeLines.push(`<meta name="title" content="${form.title}" />`);
    }
    if (form.description) {
      codeLines.push(`<meta name="description" content="${form.description}" />`);
    }
    if (form.keywords) {
      codeLines.push(`<meta name="keywords" content="${form.keywords}" />`);
    }
    if (form.author) {
      codeLines.push(`<meta name="author" content="${form.author}" />`);
    }
    if (form.canonicalUrl) {
      codeLines.push(`<link rel="canonical" href="${form.canonicalUrl}" />`);
    }

    codeLines.push('\n<!-- Open Graph / Facebook -->');
    codeLines.push(`<meta property="og:type" content="${form.ogType}" />`);
    if (effectiveOgUrl) {
      codeLines.push(`<meta property="og:url" content="${effectiveOgUrl}" />`);
    }
    if (effectiveOgTitle) {
      codeLines.push(`<meta property="og:title" content="${effectiveOgTitle}" />`);
    }
    if (effectiveOgDescription) {
      codeLines.push(`<meta property="og:description" content="${effectiveOgDescription}" />`);
    }
    if (effectiveOgImage) {
      codeLines.push(`<meta property="og:image" content="${effectiveOgImage}" />`);
    }

    codeLines.push('\n<!-- Twitter -->');
    codeLines.push(`<meta property="twitter:card" content="${form.twitterCard}" />`);
    if (effectiveOgUrl) {
      codeLines.push(`<meta property="twitter:url" content="${effectiveOgUrl}" />`);
    }
    if (effectiveTwitterTitle) {
      codeLines.push(`<meta property="twitter:title" content="${effectiveTwitterTitle}" />`);
    }
    if (effectiveTwitterDescription) {
      codeLines.push(`<meta property="twitter:description" content="${effectiveTwitterDescription}" />`);
    }
    if (effectiveTwitterImage) {
      codeLines.push(`<meta property="twitter:image" content="${effectiveTwitterImage}" />`);
    }

    return codeLines.join('\n');
  }, [form, effectiveOgTitle, effectiveOgDescription, effectiveOgUrl, effectiveOgImage, effectiveTwitterTitle, effectiveTwitterDescription, effectiveTwitterImage]);

  // Validation System and SEO Audit Calculations
  const audit = useMemo(() => {
    const issues: {
      id: keyof typeof inputRefs;
      type: 'error' | 'warning' | 'success';
      message: string;
      suggestion: string;
      tab: 'edit' | 'og' | 'twitter';
    }[] = [];

    let scorePoints = 100;

    // Title Check
    if (!form.title.trim()) {
      scorePoints -= 30;
      issues.push({
        id: 'title',
        type: 'error',
        message: 'Page Title is completely missing.',
        suggestion: 'Add an engaging page title describing your webpage content in 30 to 60 characters.',
        tab: 'edit',
      });
    } else {
      const len = form.title.length;
      if (len < 30) {
        scorePoints -= 10;
        issues.push({
          id: 'title',
          type: 'warning',
          message: `Page Title (${len} chars) is too short.`,
          suggestion: 'Aim for at least 30 characters so your title has enough depth for search engines.',
          tab: 'edit',
        });
      } else if (len > 60) {
        scorePoints -= 10;
        issues.push({
          id: 'title',
          type: 'warning',
          message: `Page Title (${len} chars) is too long.`,
          suggestion: 'Truncate title to under 60 characters to prevent Google truncation on standard result lists.',
          tab: 'edit',
        });
      } else {
        issues.push({
          id: 'title',
          type: 'success',
          message: 'Page Title is optimally optimized!',
          suggestion: '',
          tab: 'edit',
        });
      }
    }

    // Description Check
    if (!form.description.trim()) {
      scorePoints -= 30;
      issues.push({
        id: 'description',
        type: 'error',
        message: 'Meta Description is completely missing.',
        suggestion: 'Outline a compelling pitch under 160 characters to maximize standard click-through rates.',
        tab: 'edit',
      });
    } else {
      const len = form.description.length;
      if (len < 110) {
        scorePoints -= 10;
        issues.push({
          id: 'description',
          type: 'warning',
          message: `Meta Description (${len} chars) is slightly short.`,
          suggestion: 'Expand your copy to around 120-160 characters to enrich search summary placeholders.',
          tab: 'edit',
        });
      } else if (len > 160) {
        scorePoints -= 10;
        issues.push({
          id: 'description',
          type: 'warning',
          message: `Meta Description (${len} chars) is too long.`,
          suggestion: 'Compress your summary under 160 characters, otherwise search result snippets will be clipped.',
          tab: 'edit',
        });
      } else {
        issues.push({
          id: 'description',
          type: 'success',
          message: 'Meta Description length is perfect!',
          suggestion: '',
          tab: 'edit',
        });
      }
    }

    // Canonical check
    if (!form.canonicalUrl.trim()) {
      scorePoints -= 15;
      issues.push({
        id: 'canonicalUrl',
        type: 'warning',
        message: 'Canonical URL is missing.',
        suggestion: 'Specify the definitive legal path of back-links to avoid potential duplicate content penalties.',
        tab: 'edit',
      });
    } else {
      try {
        new URL(form.canonicalUrl);
        issues.push({
          id: 'canonicalUrl',
          type: 'success',
          message: 'Canonical URL configuration is valid.',
          suggestion: '',
          tab: 'edit',
        });
      } catch (e) {
        scorePoints -= 15;
        issues.push({
          id: 'canonicalUrl',
          type: 'error',
          message: 'Canonical URL format is invalid.',
          suggestion: 'Ensure your definitive link starts with standard http:// or https:// protocols.',
          tab: 'edit',
        });
      }
    }

    // Author Checked
    if (!form.author.trim()) {
      scorePoints -= 5;
      issues.push({
        id: 'author',
        type: 'warning',
        message: 'Author tag is unconfigured.',
        suggestion: 'Specify the personal or corporate creator of the page to strengthen brand authority parameters.',
        tab: 'edit',
      });
    }

    // Keywords checked
    if (!form.keywords.trim()) {
      scorePoints -= 5;
      issues.push({
        id: 'keywords',
        type: 'warning',
        message: 'Keywords tag is blank.',
        suggestion: 'Add 3-6 comma-separated keywords representing key concepts of the webpage (though legacy, it helps niche spiders).',
        tab: 'edit',
      });
    } else {
      const keys = form.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      if (keys.length < 3) {
        scorePoints -= 3;
        issues.push({
          id: 'keywords',
          type: 'warning',
          message: 'Very few keywords specified.',
          suggestion: 'Provide at least 3 distinct keywords or target terms for broader search categorization parsing.',
          tab: 'edit',
        });
      }
    }

    // OG Image check
    if (!form.ogImage.trim()) {
      scorePoints -= 10;
      issues.push({
        id: 'ogImage',
        type: 'warning',
        message: 'Social Share Image is missing.',
        suggestion: 'Assign a preview banner path (usually 1200x630px) for captivating layouts on Facebook and Twitter.',
        tab: 'og',
      });
    } else {
      try {
        new URL(form.ogImage);
      } catch (e) {
        scorePoints -= 5;
        issues.push({
          id: 'ogImage',
          type: 'warning',
          message: 'Social Share Image URL format is invalid.',
          suggestion: 'Provide an absolute web path starting with http:// or https:// for reliable parsing.',
          tab: 'og',
        });
      }
    }

    return {
      score: Math.max(0, Math.min(100, scorePoints)),
      issues,
    };
  }, [form]);

  // Handle focusing onto inputs when requested
  const handleFocusIssue = (id: keyof typeof inputRefs, tab: 'edit' | 'og' | 'twitter') => {
    setActiveTab(tab);
    setTimeout(() => {
      const el = inputRefs[id]?.current;
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.focus();
      }
    }, 150);
  };

  // Copy handler
  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Export files handler
  const handleDownloadFile = (type: 'html' | 'txt') => {
    let content = '';
    let fileName = '';
    let mime = '';

    if (type === 'html') {
      content = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${generatedCode.replace(/\n/g, '\n    ')}
    <meta name="robots" content="index, follow" />
</head>
<body>
    <h1>${form.title || 'My SEO Page'}</h1>
    <p>This is a complete template representing your parsed metadata headers generated by TextToolkitHub.</p>
</body>
</html>`;
      fileName = 'metatags-template.html';
      mime = 'text/html';
    } else {
      content = generatedCode;
      fileName = 'meta-tags.txt';
      mime = 'text/plain';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Extract high-level domains
  const getDomainFromUrl = (urlStr: string) => {
    try {
      const parsed = new URL(urlStr);
      return parsed.hostname;
    } catch (e) {
      return 'yourwebsite.com';
    }
  };

  const domainName = getDomainFromUrl(form.canonicalUrl);

  const faqs = [
    {
      id: 1,
      question: "What are SEO Meta Tags?",
      answer: "SEO Meta tags are visual instructions embedded in HTML source headers. Search engine crawlers and social index spiders retrieve these inputs to format catalog descriptions, display search results, and construct social graphics."
    },
    {
      id: 2,
      question: "What is the optimal length for Page Title and Meta Descriptions?",
      answer: "HTML Standards suggest title bounds should rest between 50 and 60 characters for complete display on lists. Meta descriptions are optimal within 120 and 160 characters. Lengths exceeding these boundaries encounter truncation gaps in Google lists."
    },
    {
      id: 3,
      question: "What are Open Graph (OG) tags?",
      answer: "Open Graph metadata protocols were initially structured by Facebook to transform simple webpage directories into dynamic social previews. They capture targeted parameters (including title, summaries, and custom cards) during social sharing actions."
    },
    {
      id: 4,
      question: "Does TextToolkitHub save my inputted forms?",
      answer: "No. All configurations persist purely within your browser localStorage so you can return to edit schemas. No servers look up or inspect your fields, guaranteeing complete local execution safety."
    }
  ];

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Pre-configured list of companion tools
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/meta-generator').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200" id="seo-meta-generator-app">
      {/* Visual Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-850 py-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <button 
                  onClick={onNavigateHome}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                  title="Go Back Home"
                  id="btn-back-home"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-100/60 dark:border-indigo-900/40">
                  <Sparkles className="w-3.5 h-3.5" /> TextToolkitHub Utility
                </span>
              </div>
              <h1 className="text-4xl font-extrabold font-display tracking-tight text-slate-800 dark:text-white mt-3">
                SEO Meta Tag Generator
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm leading-relaxed max-w-2xl">
                Generate production-grade SEO meta tags, Open Graph cards, and Twitter integrations instantly with accurate interactive previews and real-time optimization checks.
              </p>
            </div>

            <div className="flex items-center gap-3.5 flex-shrink-0 self-start md:self-center">
              <button
                onClick={handleReset}
                className="btn-clear text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 flex items-center gap-2 px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider transition-all"
                id="btn-clear-meta"
              >
                <Trash2 className="w-4 h-4" /> Reset Fields
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Live Builder Forms (7 Columns) */}
          <section className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Tabs Selector */}
            <div className="bg-white dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-850 flex gap-1 shadow-sm transition-colors duration-200">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center justify-center gap-2 ${
                  activeTab === 'edit'
                    ? 'bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                }`}
                id="tab-btn-website"
              >
                <Globe className="w-4 h-4" /> Website Info
              </button>
              <button
                onClick={() => setActiveTab('og')}
                className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center justify-center gap-2 ${
                  activeTab === 'og'
                    ? 'bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                }`}
                id="tab-btn-og"
              >
                <Facebook className="w-4 h-4" /> Open Graph
              </button>
              <button
                onClick={() => setActiveTab('twitter')}
                className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-150 flex items-center justify-center gap-2 ${
                  activeTab === 'twitter'
                    ? 'bg-slate-100 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/60'
                }`}
                id="tab-btn-twitter"
              >
                <Twitter className="w-4 h-4" /> Twitter Cards
              </button>
            </div>

            {/* Tab: Website Info */}
            {activeTab === 'edit' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col gap-6 transition-colors duration-200"
              >
                <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-900">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-500">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Primary Website Metadata</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Define core components for search indexing.</p>
                  </div>
                </div>

                {/* Page Title Row */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Page Title
                    </label>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      form.title.length < 30 || form.title.length > 60
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    }`}>
                      {form.title.length} / 60 characters
                    </span>
                  </div>
                  <input
                    type="text"
                    ref={inputRefs.title}
                    value={form.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                    placeholder="Enter short, descriptive title tag"
                    id="input-meta-title"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Keep your title around 50–60 characters to keep search lists clean.
                  </p>
                </div>

                {/* Meta Description Row */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-slate-400" /> Meta Description
                    </label>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      form.description.length < 110 || form.description.length > 160
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                    }`}>
                      {form.description.length} / 160 characters
                    </span>
                  </div>
                  <textarea
                    ref={inputRefs.description}
                    value={form.description}
                    onChange={(e) => updateForm({ description: e.target.value })}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all resize-y"
                    placeholder="Provide keywords-infused high-performing description copy"
                    id="textarea-meta-desc"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Draft a compelling pitch under 160 characters so Google does not cut it off.
                  </p>
                </div>

                {/* Canonical URL */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" /> Canonical URL
                  </label>
                  <input
                    type="text"
                    ref={inputRefs.canonicalUrl}
                    value={form.canonicalUrl}
                    onChange={(e) => updateForm({ canonicalUrl: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                    placeholder="https://example.com/canonical-page"
                    id="input-meta-canonical"
                  />
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    Prevents search indexing from penalizing duplicate web addresses.
                  </p>
                </div>

                {/* Author and Keywords Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Author */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" /> Webpage Author
                    </label>
                    <input
                      type="text"
                      ref={inputRefs.author}
                      value={form.author}
                      onChange={(e) => updateForm({ author: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                      placeholder="e.g. John Doe"
                      id="input-meta-author"
                    />
                  </div>

                  {/* Keywords */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-slate-400" /> Keywords (Comma Separated)
                    </label>
                    <input
                      type="text"
                      ref={inputRefs.keywords}
                      value={form.keywords}
                      onChange={(e) => updateForm({ keywords: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                      placeholder="e.g. editor, generator, seo"
                      id="input-meta-keywords"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Open Graph */}
            {activeTab === 'og' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col gap-6 transition-colors duration-200"
              >
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-500">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Facebook Open Graph</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Control visual elements rendered on social timelines.</p>
                    </div>
                  </div>

                  {/* Sync Switches */}
                  <button
                    onClick={() => updateForm({ syncOgWithWebsite: !form.syncOgWithWebsite })}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                      form.syncOgWithWebsite
                        ? 'bg-indigo-500/15 border-indigo-400 text-indigo-600 dark:text-indigo-400'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700'
                    }`}
                    id="btn-sync-og"
                  >
                    {form.syncOgWithWebsite ? '✓ Synced with Web Info' : '⚡ Custom OG Fields'}
                  </button>
                </div>

                {!form.syncOgWithWebsite ? (
                  <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                    {/* OG Title */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        OG Title
                      </label>
                      <input
                        type="text"
                        value={form.ogTitle}
                        onChange={(e) => updateForm({ ogTitle: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                        placeholder="Enter customized Open Graph title"
                        id="input-og-title"
                      />
                    </div>

                    {/* OG Description */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        OG Description
                      </label>
                      <textarea
                        value={form.ogDescription}
                        onChange={(e) => updateForm({ ogDescription: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                        placeholder="Enter customized social description summary"
                        id="textarea-og-desc"
                      />
                    </div>

                    {/* OG URL */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        OG URL (Web path)
                      </label>
                      <input
                        type="text"
                        value={form.ogUrl}
                        onChange={(e) => updateForm({ ogUrl: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                        placeholder="https://example.com/target-path"
                        id="input-og-url"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    🌟 <strong>Open Graph Sync mode active:</strong> Title, Description, and Web URL parameters are automatically aligned with your <strong>Website Information form</strong> inputs. Disable synchronization to configure custom variations.
                  </div>
                )}

                {/* Always configurable parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* OG Image */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> OG Image URL
                    </label>
                    <input
                      type="text"
                      ref={inputRefs.ogImage}
                      value={form.ogImage}
                      onChange={(e) => updateForm({ ogImage: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                      placeholder="https://example.com/og-banner.png"
                      id="input-og-image"
                    />
                  </div>

                  {/* OG Type */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      OG Type
                    </label>
                    <select
                      value={form.ogType}
                      onChange={(e) => updateForm({ ogType: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none transition-all"
                      id="select-og-type"
                    >
                      <option value="website">website (Standard Default)</option>
                      <option value="article">article (Blogs / News / Items)</option>
                      <option value="book">book (Manuals / Literature)</option>
                      <option value="profile">profile (Admins / Authors)</option>
                      <option value="music.song">music.song (Media tracks)</option>
                      <option value="video.movie">video.movie (Video uploads)</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Tab: Twitter Cards */}
            {activeTab === 'twitter' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col gap-6 transition-colors duration-200"
              >
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-500">
                      <Twitter className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Twitter Cards Metadata</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Configure previews specifically for users on X/Twitter timelines.</p>
                    </div>
                  </div>

                  {/* Sync Switch */}
                  <button
                    onClick={() => updateForm({ syncTwitterWithWebsite: !form.syncTwitterWithWebsite })}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all ${
                      form.syncTwitterWithWebsite
                        ? 'bg-indigo-500/15 border-indigo-400 text-indigo-600 dark:text-indigo-400'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-700'
                    }`}
                    id="btn-sync-twitter"
                  >
                    {form.syncTwitterWithWebsite ? '✓ Synced with Web Info' : '⚡ Custom Twitter Fields'}
                  </button>
                </div>

                {!form.syncTwitterWithWebsite ? (
                  <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                    {/* Twitter Title */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Twitter Title
                      </label>
                      <input
                        type="text"
                        value={form.twitterTitle}
                        onChange={(e) => updateForm({ twitterTitle: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                        placeholder="Enter customized Twitter title"
                        id="input-twitter-title"
                      />
                    </div>

                    {/* Twitter Description */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Twitter Description
                      </label>
                      <textarea
                        value={form.twitterDescription}
                        onChange={(e) => updateForm({ twitterDescription: e.target.value })}
                        rows={3}
                        className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                        placeholder="Enter customized Twitter summary summary"
                        id="textarea-twitter-desc"
                      />
                    </div>

                    {/* Twitter Image */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Twitter Card Image URL
                      </label>
                      <input
                        type="text"
                        value={form.twitterImage}
                        onChange={(e) => updateForm({ twitterImage: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all"
                        placeholder="https://example.com/custom-twitter.png"
                        id="input-twitter-image"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-850/60 rounded-2xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    🌟 <strong>Twitter Card Sync active:</strong> Title, Description, and Graphic Preview parameters track your primary <strong>Website Info</strong> and <strong>OG Image</strong> automatically. Disable configuration toggle to vary social assets.
                  </div>
                )}

                {/* Twitter card style selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Twitter Card Style
                  </label>
                  <select
                    value={form.twitterCard}
                    onChange={(e) => updateForm({ twitterCard: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-2xl px-4 py-3 text-sm text-slate-800 dark:text-white outline-none transition-all"
                    id="select-twitter-card"
                  >
                    <option value="summary_large_image">summary_large_image (Captivating wide graphics banner)</option>
                    <option value="summary">summary (Small thumbnail graphic align on left)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {/* Generated Meta Tags Sandbox */}
            <div className="bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col gap-5 transition-colors duration-200">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-900">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-500">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                      HTML Head Source Code
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Insert this code inside your file's &lt;head&gt; segment.</p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                    title="Copy generated tag codes"
                    id="btn-copy-meta-tags"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy HTML'}
                  </button>
                </div>
              </div>

              {/* Code output terminal block */}
              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed max-h-[300px] border border-slate-800 shadow-inner">
                  <code>{generatedCode}</code>
                </pre>
              </div>

              {/* Export Panel Options */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  onClick={() => handleDownloadFile('html')}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                  id="btn-download-html"
                >
                  <Download className="w-4 h-4" /> Export HTML Template
                </button>
                <button
                  onClick={() => handleDownloadFile('txt')}
                  className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
                  id="btn-download-txt"
                >
                  <Download className="w-4 h-4" /> Export TXT Snippets
                </button>
              </div>
            </div>

          </section>

          {/* RIGHT: Live Previews + SEO Score (5 Columns) */}
          <section className="lg:col-span-5 flex flex-col gap-6">
            
            {/* SEO Optimization Score Card */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col gap-5 transition-colors duration-200">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> SEO Audit Assessment
                </h3>
              </div>

              <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-150 dark:border-slate-850">
                {/* Score Indicator radial mock */}
                <div className="relative flex-shrink-0 flex items-center justify-center">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                      strokeWidth="6"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      className={`fill-none transition-all duration-500 ${
                        audit.score > 80
                          ? 'stroke-emerald-500'
                          : audit.score > 50
                          ? 'stroke-amber-500'
                          : 'stroke-red-500'
                      }`}
                      strokeWidth="6"
                      strokeDasharray="213.62"
                      strokeDashoffset={213.62 - (213.62 * audit.score) / 100}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-mono leading-none tracking-tight text-slate-800 dark:text-white">
                      {audit.score}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">
                      SCORE
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-805 dark:text-slate-200">
                    {audit.score === 100 
                      ? 'Flawless Optimization Metadata' 
                      : audit.score > 85 
                      ? 'High Performance Score' 
                      : audit.score > 60 
                      ? 'Needs Meta Improvements' 
                      : 'Critical Header Errors'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Based on standard indexing rules, including title parameters, definitive URLs, summaries lengths, and validation checks.
                  </p>
                </div>
              </div>

              {/* Warnings List / Recommendations */}
              <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-1">
                {audit.issues.map((issue, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleFocusIssue(issue.id, issue.tab)}
                    className={`p-3.5 rounded-2xl border cursor-pointer hover:shadow-xs transition-all flex gap-3 ${
                      issue.type === 'error'
                        ? 'bg-red-50/40 dark:bg-red-950/10 border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400'
                        : issue.type === 'warning'
                        ? 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-400'
                        : 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                    }`}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {issue.type === 'error' ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : issue.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="font-bold flex items-center gap-1.5 justify-between">
                        {issue.message}
                        <span className="text-[9px] font-mono uppercase bg-white/60 dark:bg-slate-900 px-1.5 py-0.5 rounded border border-current text-slate-400">
                          Fix →
                        </span>
                      </div>
                      {issue.suggestion && (
                        <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {issue.suggestion}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Platform Live Previews (Google, FB, Twitter) */}
            <div className="bg-white dark:bg-slate-950 p-6 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm flex flex-col gap-4 transition-colors duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-150 dark:border-slate-850">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-400" /> Interactive Previews
                </span>

                {/* Platform Toggles */}
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                  <button
                    onClick={() => setPreviewPlatform('google')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                      previewPlatform === 'google'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    id="preview-btn-google"
                  >
                    Google
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('facebook')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                      previewPlatform === 'facebook'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    id="preview-btn-facebook"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => setPreviewPlatform('twitter')}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                      previewPlatform === 'twitter'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                    id="preview-btn-twitter"
                  >
                    Twitter
                  </button>
                </div>
              </div>

              {/* Renders platforms previews */}
              <div className="p-1">
                {/* Platform: Google Search */}
                {previewPlatform === 'google' && (
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-inner flex flex-col gap-1 text-left font-sans">
                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-1">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center border text-[10px] font-bold text-slate-700">
                        {domainName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-slate-800 font-medium leading-none text-[11px]">{domainName}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{form.canonicalUrl || 'https://example.com'}</span>
                      </div>
                    </div>
                    {/* Google Blue Link Title */}
                    <h3 className="text-lg md:text-xl text-[#1a0dab] hover:underline cursor-pointer leading-tight line-clamp-1 font-normal font-sans">
                      {form.title || 'Please enter a webpage title...'}
                    </h3>
                    {/* Google Snippet text */}
                    <p className="text-xs text-[#4d5156] leading-relaxed mt-1 font-sans line-clamp-2">
                      {form.description || 'Provide a high-quality Meta Description so search users can read an informative snippet describing your webpage on result pages.'}
                    </p>
                  </div>
                )}

                {/* Platform: Facebook Open Graph */}
                {previewPlatform === 'facebook' && (
                  <div className="bg-white rounded-2xl border border-slate-200 dark:border-slate-850 shadow-inner overflow-hidden flex flex-col text-left font-sans text-[#1c1e21]">
                    {/* Header Mock */}
                    <div className="p-3.5 flex items-center gap-2 bg-slate-50 border-b border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-slate-200 font-bold text-xs flex items-center justify-center text-slate-600">
                        FB
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold leading-none">Social Network Preview</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Shared post mock</span>
                      </div>
                    </div>

                    {/* Image Mock */}
                    <div className="aspect-[1.91/1] bg-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-200 relative group">
                      {effectiveOgImage ? (
                        <img
                          src={effectiveOgImage}
                          alt="Open Graph preview"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // fallback on invalid image url
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 p-4">
                          <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                          <span className="text-[10px] font-bold tracking-wider uppercase opacity-50">1200 x 630px OG Image</span>
                        </div>
                      )}
                    </div>

                    {/* Metadata Box */}
                    <div className="p-4 bg-slate-100 flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {domainName.toUpperCase()}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 tracking-tight leading-snug line-clamp-1">
                        {effectiveOgTitle || 'Target Social Share Title'}
                      </h4>
                      <p className="text-xs text-slate-500 leading-normal line-clamp-2 mt-0.5">
                        {effectiveOgDescription || 'Target Social Share description describing the link contents.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Platform: Twitter Card */}
                {previewPlatform === 'twitter' && (
                  <div className="bg-[#15202b] rounded-2xl border border-slate-800 shadow-inner overflow-hidden text-left font-sans text-white">
                    {/* Twitter Header mock */}
                    <div className="p-3.5 flex items-center justify-between border-b border-slate-850">
                      <div className="flex items-center gap-2">
                        <Twitter className="w-4 h-4 text-[#1d9bf0]" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Post preview</span>
                      </div>
                    </div>

                    {/* Twitter Card Layouts (Large Image vs standard Card) */}
                    {form.twitterCard === 'summary_large_image' ? (
                      <div className="flex flex-col">
                        {/* Wide Image */}
                        <div className="aspect-[2/1] bg-slate-900 border-b border-slate-800 overflow-hidden relative">
                          {effectiveTwitterImage ? (
                            <img
                              src={effectiveTwitterImage}
                              alt="Twitter Card wide graphic"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 p-4">
                              <ImageIcon className="w-8 h-8 opacity-40 mb-1" />
                              <span className="text-[10px] font-bold tracking-wider uppercase">Wide Graphic Placeholder</span>
                            </div>
                          )}
                        </div>

                        {/* Text Block content */}
                        <div className="p-3 bg-[#15202b] flex flex-col gap-0.5">
                          <span className="text-[10px] text-slate-400">
                            {domainName.toLowerCase()}
                          </span>
                          <h4 className="text-xs font-bold leading-snug text-white line-clamp-1">
                            {effectiveTwitterTitle || 'Target Twitter card title'}
                          </h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 mt-0.5">
                            {effectiveTwitterDescription || 'Provide summary description details to optimize readability on post feeds.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Small Card design
                      <div className="flex items-stretch border-b border-slate-850">
                        {/* Thumbnail image on left */}
                        <div className="w-24 md:w-28 bg-slate-900 border-r border-slate-800 flex-shrink-0 relative">
                          {effectiveTwitterImage ? (
                            <img
                              src={effectiveTwitterImage}
                              alt="Twitter thumbnail preview"
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                              <ImageIcon className="w-5 h-5 opacity-40" />
                            </div>
                          )}
                        </div>

                        {/* Text component */}
                        <div className="p-3 flex-1 flex flex-col gap-0.5 justify-center min-w-0">
                          <span className="text-[10px] text-slate-400">
                            {domainName.toLowerCase()}
                          </span>
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {effectiveTwitterTitle || 'Target Twitter card title'}
                          </h4>
                          <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">
                            {effectiveTwitterDescription || 'Provide summary description details.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </section>

        </div>

        {/* Informative Markdown Guide Section */}
        <section className="py-16 mt-16 border-t border-slate-200 dark:border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-505 block mb-2">Technical Insight</span>
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
                Understanding Meta Tags Craft
              </h2>

              <div className="prose prose-slate dark:prose-invert text-sm max-w-none text-slate-600 dark:text-slate-400 space-y-4 leading-relaxed">
                <p>
                  A webpage’s <strong>HTML header configuration</strong> is its ultimate representative within foreign digital environments. When bot indexing crawlers (from Google, Microsoft, and Pinterest) look up your sites, they bypass stylized CSS systems and read raw meta parameters representing key information.
                </p>
                <p>
                  Aligning core headers—such as <strong>definitive URLs, author declarations, indexing terms, and social layout settings</strong>—creates a resilient foundation for modern SEO success. TextToolKitHub provides all checks entirely on-premise inside the local sandbox workspace variables.
                </p>
              </div>

              <h3 className="text-lg font-medium text-slate-910 dark:text-white mt-8 mb-3">
                How to Embed Your Meta Tags
              </h3>
              <ul className="text-sm list-decimal pl-5 space-y-2 leading-relaxed text-slate-600 dark:text-slate-400">
                <li>Input your website coordinates inside the forms workspace blocks.</li>
                <li>Verify your live platform previews and fix diagnostic suggestions to hit a perfect 100 score.</li>
                <li>Copy the generated source tags or click <strong>Export HTML</strong> to retrieve standard templates.</li>
                <li>Paste the HTML codes into your project’s <code>&lt;head&gt;</code> component of your target templates.</li>
              </ul>
            </div>

            {/* Features matrix */}
            <div>
              <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-505 block mb-2">Features Checklist</span>
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
                Metadata Core Features
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200">1. Instant Synchronized Mode</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Saves layout editing overhead by synchronizing OG & Twitter Cards dynamically with Website elements.</p>
                </div>
                <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200">2. Interactive Social Decks</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Realistic live-feed mock cards for Google search links, Facebook graphs, and Twitter timeline summaries.</p>
                </div>
                <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200">3. Interactive SEO Auditor</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Computes custom optimization scores and provides actionable recommendation highlights that direct you onto target fields instantly.</p>
                </div>
                <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                  <h4 className="font-bold text-slate-850 dark:text-slate-200">4. Browser-Isolated Security</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No telemetry tracking, APIs calls, or network leaks. Everything runs client-side inside your standard secure web environment.</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-indigo-50/20 dark:bg-indigo-950/20 rounded-2xl border border-indigo-150 dark:border-indigo-950/40 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1">✓ Live Validator Insights:</span>
                Search crawlers truncate metadata blocks over fixed constraints to maintain display symmetry on result lists. Pre-checking widths and character counts saves branding presence securely.
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordions block */}
        <section className="py-16 mt-16 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto animate-in fade-in duration-200">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Queries
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Detailed insights on how TextToolkitHub optimizes search-engine tags.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id}
                    onClick={() => toggleFaq(faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-slate-350 dark:hover:border-slate-750 cursor-pointer select-none transition-all duration-200"
                    id={`meta-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                      <div className="text-slate-450 hover:text-slate-650 dark:hover:text-slate-250 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-930 pt-3.5 flex animate-in fade-in slide-in-from-top-1 duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Companion Utilities Section */}
        <section className="pt-16 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Explore Companion Web Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`related-card-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-4 block">
                  Open Utility →
                </span>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
