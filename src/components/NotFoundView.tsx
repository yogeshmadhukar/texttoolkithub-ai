import React, { useState, useMemo, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Search, 
  ArrowRight, 
  Home, 
  Compass, 
  HelpCircle, 
  Sparkles,
  FileText,
  Hash,
  Type,
  GitCompare,
  Globe,
  ArrowUpRight,
  Pilcrow,
  Eraser,
  Smile,
  List,
  FileSpreadsheet,
  Code,
  Clock,
  QrCode,
  FileJson,
  ArrowDownWideNarrow,
  ShieldCheck
} from 'lucide-react';

interface NotFoundViewProps {
  onNavigateHome: () => void;
  onNavigateToTool: (toolId: string) => void;
}

export default function NotFoundView({ onNavigateHome, onNavigateToTool }: NotFoundViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Update Page SEO Metadata and log 404 broken URL warning
  useEffect(() => {
    // 404 Event Logging as requested for tracking broken/unassigned URLs
    console.warn(`[404 Error] User landed on broken or missing URL: ${window.location.pathname}`);

    // Save previous document title
    const prevTitle = document.title;
    document.title = "404 - Page Not Found | TextToolkitHub";

    // Inject temporary meta tag
    const metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', "Oops! We couldn't find this text utility or guide on TextToolkitHub.");
    }

    return () => {
      // Revert title and description tags when component unmounts
      document.title = prevTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, []);

  // Filter tools live based on search term in 404 workspace
  const filteredToolsList = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return TOOLS.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
    ).slice(0, 5); // Limit list to prevent clutter
  }, [searchQuery]);

  // Static definition of Popular/Requested tools
  const popularTools = useMemo(() => {
    const popularIds = [
      'tools/word-counter',
      'tools/character-counter',
      'tools/case-converter',
      'tools/text-compare',
      'tools/url-encoder',
      'tools/fancy-text-generator'
    ];
    return TOOLS.filter(t => popularIds.includes(t.id));
  }, []);

  // Map icon names from TOOLS to react elements
  const getToolIcon = (name: string, sizeClass = "w-5 h-5") => {
    switch (name) {
      case 'FileText': return <FileText className={`${sizeClass} text-emerald-500`} />;
      case 'Hash': return <Hash className={`${sizeClass} text-emerald-500`} />;
      case 'Type': return <Type className={`${sizeClass} text-amber-500`} />;
      case 'GitCompare': return <GitCompare className={`${sizeClass} text-emerald-500`} />;
      case 'Globe': return <Globe className={`${sizeClass} text-amber-500`} />;
      case 'Sparkles': return <Sparkles className={`${sizeClass} text-indigo-500`} />;
      case 'Pilcrow': return <Pilcrow className={`${sizeClass} text-indigo-500`} />;
      case 'Eraser': return <Eraser className={`${sizeClass} text-indigo-505`} />;
      case 'Smile': return <Smile className={`${sizeClass} text-indigo-500`} />;
      case 'List': return <List className={`${sizeClass} text-indigo-500`} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={`${sizeClass} text-emerald-500`} />;
      case 'Code': return <Code className={`${sizeClass} text-indigo-500`} />;
      case 'Clock': return <Clock className={`${sizeClass} text-amber-500`} />;
      case 'QrCode': return <QrCode className={`${sizeClass} text-rose-500`} />;
      case 'FileJson': return <FileJson className={`${sizeClass} text-indigo-500`} />;
      case 'ArrowDownWideNarrow': return <ArrowDownWideNarrow className={`${sizeClass} text-indigo-500`} />;
      case 'ShieldCheck': return <ShieldCheck className={`${sizeClass} text-emerald-500`} />;
      default: return <FileText className={`${sizeClass} text-indigo-550`} />;
    }
  };

  const handleBrowseCatalog = () => {
    // Focus or scroll cleanly to the search bar structure 
    const isMobile = window.innerWidth < 768;
    const targetElement = document.getElementById('search-catalog-frame');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: isMobile ? 'start' : 'center' });
      const input = document.getElementById('notfound-search-bar') as HTMLInputElement | null;
      if (input) {
        setTimeout(() => input.focus(), 500);
      }
    }
  };

  return (
    <article className="relative min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 py-16 px-4 sm:px-6 lg:px-8 font-sans" aria-label="Page Not Found">
      
      {/* Decorative ambient background visual nodes */}
      <div className="absolute top-0 inset-0 bg-gradient-to-b from-rose-500/5 via-transparent to-transparent dark:from-rose-500/5 pointer-events-none z-0" />
      <div className="glow-accent top-12 left-10 opacity-70 bg-rose-500" />
      <div className="glow-accent top-96 right-12 opacity-80" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* HERO INTEGRATION BLOCK */}
        <div className="text-center flex flex-col items-center pt-8 pb-12">
          
          {/* Main Large Visual Icon Frame */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-40 h-40 relative flex items-center justify-center mb-8 select-none"
            id="notfound-large-visual"
          >
            {/* Ambient circular pulse tracks */}
            <div className="absolute inset-0 bg-slate-200/50 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-slate-800 animate-ping opacity-20 duration-[3s]" />
            <div className="absolute scale-[0.8] inset-0 bg-slate-100/60 dark:bg-slate-900/60 rounded-full border border-slate-200 dark:border-slate-800" />
            <div className="absolute scale-[0.6] inset-0 bg-white dark:bg-slate-950 rounded-full border border-slate-300 dark:border-slate-800 shadow-md" />
            
            {/* Visual Text Output */}
            <span className="relative font-bold text-5xl font-sans tracking-tighter text-indigo-600 dark:text-indigo-400">
              404
            </span>
          </motion.div>

          {/* Oops! Tagline Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-rose-500/10 dark:bg-rose-500/15 border border-rose-200/30 dark:border-rose-950/20 rounded-full text-xs font-bold text-rose-600 dark:text-rose-400 mb-6 cursor-default tracking-wide uppercase"
            id="notfound-tagline-badge"
          >
            <HelpCircle className="w-3.5 h-3.5" /> Oops! Page Not Found
          </motion.div>

          {/* Master 404 Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light font-display tracking-tight text-slate-900 dark:text-white leading-tight max-w-2xl mb-4"
            id="notfound-heading"
          >
            Oops! We couldn't find this text utility or guide.
          </motion.h1>

          {/* Paragraph explanation */}
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-slate-550 dark:text-slate-400 text-sm sm:text-base max-w-lg leading-relaxed mb-8"
            id="notfound-description"
          >
            The page or tool you are looking for may have been moved, renamed, or deleted. Use the quick navigation buttons below or search our complete collection of free online text utilities.
          </motion.p>

          {/* Dual/Multi CTAs triggers for instant navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3 w-full sm:w-auto"
            id="notfound-cta-actions-row"
          >
            {/* Navigation back home */}
            <button
              onClick={onNavigateHome}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-slate-900 dark:hover:bg-slate-100 hover:text-white dark:hover:text-slate-950 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-500/10 active:scale-[0.98] cursor-pointer"
              id="notfound-gohome-btn"
            >
              <Home className="w-4 h-4" /> Go to Home
            </button>

            {/* Quick Word Counter */}
            <button
              onClick={() => onNavigateToTool('tools/word-counter')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/10 active:scale-[0.98] cursor-pointer"
              id="notfound-wordcounter-btn"
            >
              <FileText className="w-4 h-4" /> Word Counter
            </button>

            {/* Quick Case Converter */}
            <button
              onClick={() => onNavigateToTool('tools/case-converter')}
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-[0.98] cursor-pointer"
              id="notfound-caseconverter-btn"
            >
              <Type className="w-4 h-4" /> Case Converter
            </button>

            {/* Scroll down to search catalog */}
            <button
              onClick={handleBrowseCatalog}
              className="px-5 py-2.5 border border-slate-250 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
              id="notfound-browse-all-btn"
            >
              <Compass className="w-4 h-4 text-slate-400" /> Browse All Tools
            </button>
          </motion.div>

        </div>

        {/* INTERACTIVE SEARCH CATALOG SEGMENT */}
        <div 
          id="search-catalog-frame" 
          className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-3xl p-6 sm:p-8 shadow-md mb-8 max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-indigo-500" />
            <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-slate-400">Search tool inventory</h3>
          </div>

          <div className="relative">
            <input
              type="text"
              id="notfound-search-bar"
              placeholder="Search tools (e.g. Word Counter, Slug, HTML)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 rounded-2xl text-slate-850 dark:text-white placeholder-slate-450 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold font-sans text-slate-400 hover:text-slate-650 dark:hover:text-white"
                id="notfound-search-clear"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick live search result triggers to find tools instantly on the spot */}
          {searchQuery.trim() !== '' && (
            <div className="mt-4 border-t border-slate-100 dark:border-slate-900 pt-3 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200" id="notfound-live-results">
              {filteredToolsList.length > 0 ? (
                filteredToolsList.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => onNavigateToTool(tool.id)}
                    className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-slate-200 dark:hover:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition"
                    id={`notfound-result-${tool.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        {getToolIcon(tool.iconName, "w-4 h-4")}
                      </div>
                      <div className="text-left">
                        <h4 className="font-sans font-bold text-slate-850 dark:text-slate-200 text-xs sm:text-sm">
                          {tool.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400">No tools match your query. Try 'Word Counter' or 'Base64'.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* POPULAR TOOLS SECTION */}
        <div id="popular-tools-wrapper" className="max-w-2xl mx-auto mb-6">
          <div className="text-center mb-6">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-500 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg mb-2 inline-block">
              Lost? Try one of our most popular tools below.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="notfound-popular-grid">
            {popularTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigateToTool(tool.id)}
                className="group p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 hover:border-indigo-400 rounded-2xl cursor-pointer hover:shadow-md transition duration-200 flex flex-col justify-between text-left"
                id={`notfound-popular-${tool.id}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 transition-colors">
                      {getToolIcon(tool.iconName, "w-4 h-4")}
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-500 transition-all duration-200" />
                  </div>
                  <h4 className="font-sans font-bold text-slate-850 dark:text-white text-xs sm:text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {tool.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-normal mt-1 min-h-[32px]">
                    {tool.description}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-50 dark:border-slate-900 flex justify-end">
                  <span className="text-[10px] uppercase font-bold text-indigo-500 group-hover:underline">Quick Access &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPREHENSIVE 404 NAVIGATION & CATEGORY DIRECTORY GUIDE */}
        <div className="mt-16 border-t border-slate-200 dark:border-slate-900 pt-12 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-900">
              Navigation Assistance &amp; Directory Guide
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              Navigating TextToolkitHub's Free Online Tool Collection
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              If you followed a bookmarked link or external search result that led to this missing page, here is everything you need to know about navigating our offline-first text utilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" /> Text Analysis &amp; Word Metrics
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Analyze your articles, blog posts, essays, and manuscripts with precision. Our analysis suite includes our flagship Word Counter, Character Counter, Sentence Counter, Readability Checker (Flesch-Kincaid Grade level formulas), and Keyword Density Checker. All analysis utilities execute locally in your browser RAM with zero external network requests.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <button onClick={() => onNavigateToTool('tools/word-counter')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Word Counter</button>
                <button onClick={() => onNavigateToTool('tools/character-counter')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Character Counter</button>
                <button onClick={() => onNavigateToTool('tools/readability-checker')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Readability Checker</button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Eraser className="w-4 h-4 text-indigo-500" /> Text Sanitation &amp; Cleanup Utilities
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Clean up scrambled PDF copy, OCR text scans, duplicate rows, and messy dataset dumps. Use our Remove Extra Spaces tool, Remove Line Breaks utility, Remove Duplicate Lines tool, Remove Empty Lines transformer, and Remove Special Characters utility to format your paragraphs and datasets effortlessly.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <button onClick={() => onNavigateToTool('tools/remove-line-breaks')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Remove Line Breaks</button>
                <button onClick={() => onNavigateToTool('tools/remove-extra-spaces')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Remove Extra Spaces</button>
                <button onClick={() => onNavigateToTool('tools/remove-duplicate-lines')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Remove Duplicate Lines</button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Type className="w-4 h-4 text-amber-500" /> Casing &amp; Format Converters
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Switch seamlessly between Title Case, UPPERCASE, lowercase, camelCase, snake_case, kebab-case, PascalCase, and Constant Case. Perfect for developers formatting database variables or content writers structuring blog post headlines.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <button onClick={() => onNavigateToTool('tools/case-converter')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Case Converter</button>
                <button onClick={() => onNavigateToTool('tools/slug-generator')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Slug Generator</button>
                <button onClick={() => onNavigateToTool('tools/yaml-json-converter')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">YAML to JSON</button>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-900 rounded-2xl p-6 space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> Encoding &amp; Developer Security
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Encode, decode, escape, and parse web data safely. Includes our Base64 Encoder/Decoder, URL Encoder/Decoder, HTML Entity Encoder, JWT Decoder, UUID/GUID Generator, and Hash Generator (MD5, SHA-256).
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <button onClick={() => onNavigateToTool('tools/base64-encoder')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">Base64 Encoder</button>
                <button onClick={() => onNavigateToTool('tools/url-encoder')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">URL Encoder</button>
                <button onClick={() => onNavigateToTool('tools/uuid-generator')} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg">UUID Generator</button>
              </div>
            </div>
          </div>

          <div className="bg-slate-100/70 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                404 Troubleshooting &amp; Navigation Frequently Asked Questions
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-sans">
                Find answers to common questions about missing tool pages, URL updates, and how to access our browser-cached suite offline.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Why did I encounter a 404 error on TextToolkitHub?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  A 404 error occurs when a web browser requests a page or tool URL handle that does not exist in our route router. This can happen if a URL was typed incorrectly in the address bar, if an outdated link was bookmarked, or if a legacy tool path was renamed during our recent architectural migration to unified category routes.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">How do I find a missing text tool quickly?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Use the interactive search catalog box above on this page. Simply start typing keywords like "word count", "JSON", "Base64", "case", or "PDF" to immediately see live search matches from our complete library of 66+ online text utilities. Alternatively, click "Go to Home" to view our complete tools grid.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Can I request a missing or new tool to be built?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Yes! If you are searching for a specific text processing utility, format converter, or developer helper that is not currently listed in our catalog, please navigate to our Contact page and select "Feature Proposal". Our core engineering team routinely builds and deploys requested client-side tools for our user community.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Are my inputs safe if I landed on a 404 page?</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Yes, 100%. Landing on a 404 page does not expose any user data or browser state. All operations on TextToolkitHub run strictly within your browser's local sandbox memory. No text input, uploaded files, or search queries are ever logged to external servers or sold to third-party data brokers.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </article>
  );
}
