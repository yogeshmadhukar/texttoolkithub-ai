import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Hash, 
  FileText,
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  ArrowUpRight, 
  BookOpen, 
  Globe, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  Flame,
  Binary,
  Maximize2
} from 'lucide-react';

interface CharacterCounterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function CharacterCounterView({ onNavigateToTool, onNavigateHome }: CharacterCounterViewProps) {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Focus character count SEO targets
  const seoTitle = "Character Counter Tool – Count Characters, Words & Text Limits";
  const seoDescription = "Free online character counter tool. Count characters with and without spaces, words, sentences, paragraphs, lines, and bytes. Check Twitter/X, SMS, and SEO limits instantly.";

  // Frequently Asked Questions
  const faqs = [
    {
      id: 1,
      question: "What is a Character Counter?",
      answer: "A character counter is a specialized utility that measures individual typographic elements, including letters, decimal digits, symbols, punctuation, tabs, and spaces. In content creation and coding, tracking character volume helps authors stay within digital space limitations."
    },
    {
      id: 2,
      question: "Why should I count characters without spaces?",
      answer: "Many platforms, such as SMS carriers, publishers, and academic portals, only calculate practical text length. Spaces are often discarded or not considered editorial content. Our tool splits both metrics in real time so you can inspect both immediately."
    },
    {
      id: 3,
      question: "What is the standard character limit for X (Twitter)?",
      answer: "For standard accounts, the maximum character length of a single post is capped at 280 characters. Our real-time visual progress meter monitors this boundary directly and warns you when you exceed the range."
    },
    {
      id: 4,
      question: "How does the byte size calculator work?",
      answer: "Standard alphanumeric characters weigh 1 byte in standard ASCII/UTF-8 encoding. However, special emojis, symbols, and accented characters occupy up to 3 or 4 bytes. Our byte calculator tracks the actual byte footprint of your text and reports it dynamically."
    },
    {
      id: 5,
      question: "Is my text data safe on TextToolkitHub?",
      answer: "Yes, 100%. All parsing logic executes straight inside your web browser container using local JavaScript. Absolutely no text data is transmitted, cached, or saved on distant host servers, aligning with modern privacy security guidelines."
    }
  ];

  // Dynamic Title and SEO Meta setup + JSON-LD Schema
  useEffect(() => {
    const previousTitle = document.title;
    document.title = seoTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') || "";
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoDescription);

    // Schema JSON-LD FAQ Page Injection
    const schemaContent = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const scriptId = "char-counter-json-ld";
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = JSON.stringify(schemaContent);

    return () => {
      document.title = previousTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Live Metric Calculations optimized via memoization to avoid redundant loops under non-text state updates
  const metrics = React.useMemo(() => {
    const trimmed = text.trim();
    const charCount = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;
    
    // Word counts
    const wordsArray = trimmed === '' ? [] : trimmed.split(/\s+/).filter(w => w.length > 0);
    const wordsCount = wordsArray.length;

    // Paragraph count (based on consecutive returns)
    const paragraphsArray = text === '' ? [] : text.split(/\n\s*\n+/).filter(p => p.trim().length > 0);
    const paragraphsCount = paragraphsArray.length;

    // Line breaks count
    const linesCount = text === '' ? 0 : text.split('\n').length;

    // Tabs count
    const tabsCount = (text.match(/\t/g) || []).length;

    // Bytes calculation in UTF-8
    let byteSize = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (code < 0x80) byteSize += 1;
      else if (code < 0x800) byteSize += 2;
      else if (code < 0xd800 || code >= 0xe000) byteSize += 3;
      else {
        // Surrogate pair
        i++;
        byteSize += 4;
      }
    }

    return {
      chars: charCount,
      charsNoSpaces: charNoSpaces,
      words: wordsCount,
      paragraphs: paragraphsCount,
      lines: linesCount,
      tabs: tabsCount,
      byteSize
    };
  }, [text]);

  // Social Limits Definitions
  const socialLimits = [
    { name: "X / Twitter Post", limit: 280, color: "indigo" },
    { name: "SEO Meta Title", limit: 60, color: "emerald" },
    { name: "SEO Meta Description", limit: 160, color: "violet" },
    { name: "SMS Textholder (1 Segment)", limit: 160, color: "rose" },
    { name: "LinkedIn Post limit", limit: 3000, color: "amber" },
    { name: "Instagram Caption", limit: 2200, color: "pink" }
  ];

  // Actions
  const handleLoadSample = () => {
    setHistory(text);
    setText(`"Good design comes from intentional pairings – not defaults." 

This Character Counter tracks typographic boundaries instantly. Simply paste scripts, SEO copy, or draft social posts to examine exact length specifications. Fully client-side and completely secure! Try testing our layout limits below.`);
  };

  const handleClear = () => {
    setHistory(text);
    setText('');
  };

  const handleUndo = () => {
    const current = text;
    setText(history);
    setHistory(current);
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to copy characters: ', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Find other tools
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/character-counter' && t.id !== 'character-counter').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="character-counter-page">
      {/* Background glow features */}
      <div className="glow-accent top-12 left-10"></div>
      <div className="glow-accent top-96 right-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold font-sans">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            id="breadcrumbs-home"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <button 
            onClick={onNavigateHome}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400">Character Counter</span>
        </div>

        {/* Master Header Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Hash className="w-7 h-7 text-emerald-500" />
              </span>
              Premium Character Counter
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Exhaustive typographic metrics suite. Track precise characters limit thresholds with and without spaces, byte weight ratios, social networks bounds, and lines variables in real-time.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* SEO Metadata Card */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Search Engine Preview snippet
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/character-counter
              </div>
              <h3 className="text-lg md:text-xl font-medium text-emerald-600 dark:text-emerald-400 hover:underline leading-snug cursor-pointer">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Core Layout Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT: Live Input Workspace (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              
              {/* Toolbar Ribbons */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Live Keypress Analyzers
                </span>
                
                <button 
                  onClick={handleLoadSample}
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  id="btn-sample-load"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Load Preset Sample
                </button>
              </div>

              {/* Text Area workspace */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Compose your message, code snippet, or SEO elements here..."
                className="w-full p-5 min-h-[300px] md:min-h-[420px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="char-counter-textarea"
              />

              {/* Controls bar */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{metrics.chars}</strong></span>
                  <span>Char (No spaces): <strong className="text-emerald-600 dark:text-emerald-400">{metrics.charsNoSpaces}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  
                  {/* Undo Button */}
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="p-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl flex items-center gap-1 transition-all text-xs font-semibold"
                      title="Undo last clear operation"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Undo
                    </button>
                  )}

                  {/* Clear button */}
                  <button
                    onClick={handleClear}
                    disabled={!text}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-400"
                    title="Clear content workspace"
                    id="btn-clear"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopy}
                    disabled={!text}
                    className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-slate-200 dark:border-slate-800 bg-white hover:bg-emerald-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-emerald-950/20 dark:text-slate-200'}`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Text
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT: Live Data & Visual limits (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6" id="metrics-rail">
            
            {/* Realtime Core metrics card */}
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-emerald-500" /> Granular Character metrics
              </h3>

              {/* Core numbers grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">With Spaces</dt>
                  <dd className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">{metrics.chars}</dd>
                </div>
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">Without Spaces</dt>
                  <dd className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{metrics.charsNoSpaces}</dd>
                </div>
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">Total Words</dt>
                  <dd className="text-3xl font-extrabold text-slate-850 dark:text-slate-200 font-mono mt-1">{metrics.words}</dd>
                </div>
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">Paragraphs</dt>
                  <dd className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{metrics.paragraphs}</dd>
                </div>
              </div>

              {/* Extras metrics sheet */}
              <div className="mt-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col gap-4">
                {/* Lines segments */}
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-900">
                  <span className="flex items-center gap-1.5"><Maximize2 className="w-3.5 h-3.5 text-slate-400" /> Line Breaks (Rows)</span>
                  <strong className="text-sm font-bold text-slate-850 dark:text-slate-200 font-mono">{metrics.lines}</strong>
                </div>

                {/* Tabs Count */}
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-900">
                  <span>Tab Spacers</span>
                  <strong className="text-sm font-bold text-slate-850 dark:text-slate-200 font-mono">{metrics.tabs} tabs</strong>
                </div>

                {/* Payload size in bytes */}
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Binary className="w-3.5 h-3.5 text-slate-400" /> UTF-8 Byte Weight</span>
                  <strong className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">{metrics.byteSize} B</strong>
                </div>
              </div>

              {/* Social boundaries progression checks */}
              <div className="border-t border-slate-200 dark:border-slate-850 pt-4 mt-5 flex flex-col gap-4">
                <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider">Social Media & SEO Limits</span>
                
                <div className="flex flex-col gap-3.5">
                  {socialLimits.map((platform) => {
                    const ratio = metrics.chars / platform.limit;
                    const percent = Math.min(100, Math.round(ratio * 100));
                    const isExceeded = metrics.chars > platform.limit;
                    
                    let barColor = "bg-indigo-500";
                    if (percent > 90) barColor = "bg-amber-500";
                    if (isExceeded) barColor = "bg-rose-500";

                    return (
                      <div key={platform.name} className="flex flex-col gap-1 text-xs">
                        <div className="flex justify-between font-medium">
                          <span className="text-slate-600 dark:text-slate-450">{platform.name}</span>
                          <span className={`font-mono ${isExceeded ? 'text-rose-600 dark:text-rose-400 font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                            {metrics.chars}/{platform.limit}
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${barColor}`} 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* CUSTOM UNIQUE CONTENT SECTION */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Segment 1: Educational Copy */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500">Workspace Guidelines</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              What is a Character Counter?
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                An online <strong>character counter</strong> is a text-parsing tool that analyzes the comprehensive structural volume of letters, numbers, spaces, carriage returns, symbols, and tabs in a document. Crucial for both digital markers and technical code formatters, counting limits is a cornerstone of clean-room documentation.
              </p>
              <p>
                Unlike generic counters which clump text together, our premium parser distinguishes between spaces and non-space characters in real-time, providing deep visual validation bars across multiple standard platform boundaries.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">
              Character Count vs. Word Count
            </h3>
            <p className="text-sm leading-relaxed">
              While a word counter divides text by blank string intervals, the character counter inspects each independent byte structure. For example, standard mobile SMS messages, search engine metadata fields, and tweet headers strictly check physical individual characters. Thus, balancing characters is key to optimizing search snippets and social networks.
            </p>
          </div>

          {/* Segment 2: SEO Standards list */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-500 font-sans">Platforms Summary</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Typographic Limit Guidelines
            </h2>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <span className="p-1 px-2.5 bg-emerald-550 text-white font-mono text-xs font-bold rounded-lg mt-0.5">X</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">X / Twitter Posts (280 characters max)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Allows for easy content delivery. Posts exceeding the 280 boundary require threads or subscription-tier upgrades.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <span className="p-1 px-2 bg-indigo-500 text-white font-mono text-xs font-bold rounded-lg mt-0.5">SEO</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Google Meta Limits (60 Title / 160 Description)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Search results clip titles over 60 characters and descriptions over 160 characters. Keeping within these limits optimizes CTR.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <span className="p-1 px-2 bg-pink-500 text-white font-sans text-xs font-bold rounded-lg mt-0.5">SMS</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Carrier Single SMS Constraints (160 max)</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">SMS messages are portioned in 160-character segments. Going above this count divides and bills your message as multiple segments.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Unique FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Detailed insights on calculating spacing, delimiters, and byte counts.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id}
                    onClick={() => toggleFaq(faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer select-none transition-all duration-200"
                    id={`char-counter-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                      <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-3.5 flex animate-in fade-in slide-in-from-top-1 duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Related / Companion Tools Block */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Explore Companion Text Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`related-card-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center justify-between">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mt-4 block">
                  Open Utility →
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
