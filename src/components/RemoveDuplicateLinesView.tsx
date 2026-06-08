import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import {
  Layers,
  Copy,
  Check,
  Download,
  Trash2,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Globe,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Settings,
  FileText,
  Info,
  ListFilter
} from 'lucide-react';

interface RemoveDuplicateLinesViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function RemoveDuplicateLinesView({ onNavigateToTool, onNavigateHome }: RemoveDuplicateLinesViewProps) {
  const [inputText, setInputText] = useState('');
  const [copiedResult, setCopiedResult] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Deduplication toggles for expert refinement!
  const [isCaseSensitive, setIsCaseSensitive] = useState(false); // Default false: "Apple" and "apple" are duplicates
  const [trimLinesBeforeCompare, setTrimLinesBeforeCompare] = useState(true); // Default true: trim outer whitespaces
  const [ignoreEmptyLines, setIgnoreEmptyLines] = useState(true); // Default true: remove blank lines

  // SEO specifications
  const seoTitle = "Remove Duplicate Lines Online | TextToolkitHub";
  const seoDescription = "Remove duplicate lines instantly from text lists, emails, keywords, and datasets.";

  const faqs = [
    {
      id: 1,
      question: "What does the Remove Duplicate Lines tool do?",
      answer: "This tool takes any multi-line text list (such as email addresses, keywords, directories, or numeric logs) and identifies and purges repeating lines while preserving the original order of the first occurrence."
    },
    {
      id: 2,
      question: "How does 'Preserve Order' work?",
      answer: "Unlike general alphabetizers or database sorters that shuffle your list, our deduplication algorithm processes lines sequentially, keeping the first unique occurrence in place and only stripping subsequent duplications."
    },
    {
      id: 3,
      question: "Can I choose to ignore lowercase/uppercase differences?",
      answer: "Yes. By turning off the 'Case Sensitive' toggle, references like 'TEXT' and 'text' are recognized as duplicates and will be pruned. Turn on 'Case Sensitive' if capitalization matters in your dataset."
    },
    {
      id: 4,
      question: "Is my text list securely processed?",
      answer: "Absolutely. All line segmentation, comparisons, and filtering are performed entirely in your browser memory context. None of your data, emails, or spreadsheets are sent over the network to any servers."
    }
  ];

  // Configure SEO metadata and FAQ schema dynamic injection
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

    const scriptId = "remove-duplicate-lines-json-ld";
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

  // Compute Deduplicated outputs in real-time
  const parseLines = (text: string) => {
    if (!text) return [];
    // Handle CRLF (\r\n) or LF (\n) or CR (\r) line ending formats safely
    return text.split(/\r?\n/);
  };

  const rawLinesList = parseLines(inputText);

  // Compute stats and results
  const analysisResult = (() => {
    if (!inputText) {
      return {
        outputLines: [] as string[],
        originalCount: 0,
        uniqueCount: 0,
        removedCount: 0,
        outputText: ''
      };
    }

    const originalCount = rawLinesList.length;
    const seenSet = new Set<string>();
    const outputLines: string[] = [];

    rawLinesList.forEach((line) => {
      // Determine what string we compare
      let cleanLine = line;
      if (trimLinesBeforeCompare) {
        cleanLine = cleanLine.trim();
      }

      // Check if we should ignore empty lines
      if (ignoreEmptyLines && cleanLine === '') {
        return; // Skip empty line completely
      }

      // Handle case sensitivity for uniqueness set checks
      const comparisonKey = isCaseSensitive ? cleanLine : cleanLine.toLowerCase();

      if (!seenSet.has(comparisonKey)) {
        seenSet.add(comparisonKey);
        outputLines.push(line); // Keep the original formatted line (preserving casing and custom trailing wraps if trim is just comparison-only)
      }
    });

    const uniqueCount = outputLines.length;
    const removedCount = originalCount - uniqueCount - (ignoreEmptyLines ? rawLinesList.filter(l => (trimLinesBeforeCompare ? l.trim() : l) === '').length : 0);

    return {
      outputLines,
      originalCount,
      uniqueCount,
      removedCount: Math.max(0, removedCount),
      outputText: outputLines.join('\n')
    };
  })();

  // Clear workspace
  const handleClear = () => {
    setInputText('');
  };

  // Copy result content
  const handleCopyResult = async () => {
    if (!analysisResult.outputText) return;
    try {
      await navigator.clipboard.writeText(analysisResult.outputText);
      setCopiedResult(true);
      setTimeout(() => setCopiedResult(false), 2000);
    } catch (err) {
      console.warn('Failed to copy result:', err);
    }
  };

  // Download filtered lines as a TXT file
  const handleDownloadTxt = () => {
    if (!analysisResult.outputText) return;
    try {
      const blob = new Blob([analysisResult.outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'deduplicated-lines.txt';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);
    } catch (err) {
      console.error('Failed to download TXT file:', err);
    }
  };

  // Pre-load benchmark lines sample
  const handleLoadSample = () => {
    setInputText([
      'organic keyword tools',
      'email@domain.com',
      'organic keyword tools', // Duplicate
      'marketing strategy',
      '  email@domain.com  ', // Duplicate (whitespace variation)
      'organic keyword tools', // Duplicate
      'technical SEO checklist',
      'marketing strategy', // Duplicate
      '', // Empty Line
      'contact@texttoolkithub.com'
    ].join('\n'));
  };

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/remove-duplicate-lines').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="dedup-tool-root">
      {/* Background radial soft lights */}
      <div className="glow-accent top-12 right-20 bg-indigo-400/10"></div>
      <div className="glow-accent bottom-36 left-8 bg-emerald-400/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold font-sans">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            id="dedup-breadcrumbs-home"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <button
            onClick={onNavigateHome}
            className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            id="dedup-breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-emerald-600 dark:text-emerald-450">Remove Duplicate Lines</span>
        </div>

        {/* Page Title Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Layers className="w-7 h-7 text-indigo-500" />
              </span>
              Remove Duplicate Lines
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Clean up raw lists, spreadsheet records, emails, or technical logs in one click. Instantly eliminate duplicate lines while keeping original order intact.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner cursor-pointer"
            id="dedup-seo-btn"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            {showSeoMeta ? 'Hide Search Preview' : 'Show Search Preview'}
          </button>
        </div>

        {/* SEO Google preview card */}
        {showSeoMeta && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="dedup-seo-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Google Search Result Visualizer
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-404 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-indigo-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/remove-duplicate-lines
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-404 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Tool Workspace Area Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* INPUT AREA: 7 Cols wide on desktop */}
          <div className="lg:col-span-7 flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300 shadow-sm">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                Original Text List (Input)
              </span>
              <button
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="dedup-btn-sample"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> Paste Sample List
              </button>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <textarea
                id="dedup-input-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your lines here. Each item must be on a new line..."
                className="w-full h-full min-h-[300px] md:min-h-[400px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-none font-sans leading-relaxed"
              />
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/20 flex items-center justify-between gap-3 pt-4">
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  disabled={!inputText}
                  className="p-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 rounded-2xl transition disabled:opacity-35 cursor-pointer"
                  title="Clear original text container"
                  id="dedup-btn-clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-404 dark:text-slate-500 select-none font-mono">
                Line Count: {inputText ? rawLinesList.length : 0}
              </div>
            </div>

          </div>

          {/* SETTINGS PARAMETERS AND OUTPUTS COL: 5 Cols wide */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* Live Counter Panel Widgets Card */}
            <div className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3.5 block font-mono">
                Real-Time Deduplication Stats
              </span>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/45 rounded-2xl border border-slate-100 dark:border-slate-850 text-center">
                  <span className="text-[10px] text-slate-400 block mb-0.5 leading-none">Original</span>
                  <span className="text-lg md:text-xl font-bold text-slate-800 dark:text-slate-200" id="dedup-stat-original">
                    {inputText ? analysisResult.originalCount : 0}
                  </span>
                </div>
                
                <div className="p-3 bg-emerald-50/30 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/40 text-center">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block mb-0.5 leading-none">Unique</span>
                  <span className="text-lg md:text-xl font-bold text-emerald-600 dark:text-emerald-400" id="dedup-stat-unique">
                    {inputText ? analysisResult.uniqueCount : 0}
                  </span>
                </div>

                <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/40 text-center">
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 block mb-0.5 leading-none">Removed</span>
                  <span className="text-lg md:text-xl font-bold text-indigo-600 dark:text-indigo-400" id="dedup-stat-removed">
                    {inputText ? analysisResult.removedCount : 0}
                  </span>
                </div>
              </div>

              {inputText && analysisResult.removedCount > 0 && (
                <div className="mt-4 flex items-center gap-2 p-2.5 bg-indigo-50/40 dark:bg-slate-900/70 border border-indigo-100/30 dark:border-slate-800 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 leading-normal font-sans">
                  <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  Successfully removed <strong className="text-indigo-600 dark:text-indigo-400">{analysisResult.removedCount}</strong> redundant entries from your text array.
                </div>
              )}
            </div>

            {/* Customizer Settings Toggles Card */}
            <div className="p-6 border border-slate-250 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-950/30 rounded-3xl">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-4 font-sans">
                <Settings className="w-4 h-4 text-indigo-500 animate-spin-slow" />
                Comparison Parameters
              </span>

              <div className="space-y-4">
                {/* Trim Lines Row */}
                <div className="flex items-center justify-between gap-3 p-1">
                  <div>
                    <label htmlFor="trim-compare-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 block cursor-pointer">
                      Trim Whitespaces
                    </label>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">Ignore spaces at the beginning or end of lines</span>
                  </div>
                  <input
                    id="trim-compare-toggle"
                    type="checkbox"
                    checked={trimLinesBeforeCompare}
                    onChange={(e) => setTrimLinesBeforeCompare(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 h-4 w-4 bg-white dark:bg-slate-950 cursor-pointer"
                  />
                </div>

                {/* Case Sensitive Row */}
                <div className="flex items-center justify-between gap-3 p-1">
                  <div>
                    <label htmlFor="case-compare-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 block cursor-pointer">
                      Case Sensitive
                    </label>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">Treat capital and lowercase letters differently</span>
                  </div>
                  <input
                    id="case-compare-toggle"
                    type="checkbox"
                    checked={isCaseSensitive}
                    onChange={(e) => setIsCaseSensitive(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 h-4 w-4 bg-white dark:bg-slate-950 cursor-pointer"
                  />
                </div>

                {/* Ignore Empty Lines Row */}
                <div className="flex items-center justify-between gap-3 p-1">
                  <div>
                    <label htmlFor="ignore-empty-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 block cursor-pointer">
                      Remove Empty Lines
                    </label>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">Filter out layout breaks and blank spaces</span>
                  </div>
                  <input
                    id="ignore-empty-toggle"
                    type="checkbox"
                    checked={ignoreEmptyLines}
                    onChange={(e) => setIgnoreEmptyLines(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 h-4 w-4 bg-white dark:bg-slate-950 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* OUTPUT PREVIEW INTERFACE: Visual outcomes */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex-grow flex flex-col justify-between">
              
              <div className="p-5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                  Deduplicated Output Preview
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-450">
                  {inputText ? `${analysisResult.uniqueCount} lines unique` : 'empty'}
                </span>
              </div>

              <div className="p-6 flex-grow bg-slate-50/20 dark:bg-transparent min-h-[140px] max-h-[220px] overflow-y-auto">
                {inputText ? (
                  <pre className="text-xs text-slate-705 dark:text-slate-300 font-mono whitespace-pre-wrap break-all leading-normal">
                    {analysisResult.outputText}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-600 select-none py-6">
                    <ListFilter className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                    <p className="text-xs font-sans">Awaiting duplicate-removing action</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs px-2">Fill in your original text values in the input box on the left.</p>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/20 flex gap-3">
                <button
                  onClick={handleCopyResult}
                  disabled={!inputText}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-35 cursor-pointer shadow-md shadow-indigo-500/10"
                  id="dedup-btn-copy-result"
                >
                  {copiedResult ? (
                    <>
                      <Check className="w-4 h-4" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Result
                    </>
                  )}
                </button>


              </div>

            </div>

          </div>

        </div>

        {/* SCIENTIFIC INFORMATION & STRATEGIC EXPOSITIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-650 dark:text-slate-300">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Deduplication Workflows</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Why Redundant Items Degrade Datasets
            </h2>

            <div className="text-sm leading-relaxed space-y-4 font-sans">
              <p>
                In data management, mailing outreach, program logs, and search-engine keywords lists, redundant data entries directly waste structural computational efficiency and compromise statistical analytics.
              </p>
              <p>
                Manually tracking down repeating entries across extensive documents is tedious and error-prone. Our Free Remove Duplicate Lines Tool automates list cleaning 100% locally on your browser. Enter any log output, email directories, spreadsheet exports, or keywords array, tailor spacing rules, and obtain cleansed strings in a heartbeat.
              </p>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Perfect Use Cases for Deduplication
            </h3>
            <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400 pl-4 list-disc font-sans leading-relaxed">
              <li><strong>SEO Keyword Arrays:</strong> Extract duplicate search keywords before executing cluster tools or budget bids.</li>
              <li><strong>Newsletter Subscriptions:</strong> Remove duplicates from user emails before initiating standard campaigns to lower subscriber bounce rates.</li>
              <li><strong>Database Query Logs:</strong> Clean repeating lines or debug metrics from complex system commands.</li>
              <li><strong>E-commerce Inventory Lists:</strong> Unify structural product catalogs, SKU mappings, or raw address fields.</li>
            </ul>
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 font-mono">Advanced Refining</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Fine-tuning Comparison Rules
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-300 leading-relaxed mb-6 font-sans">
              Different projects require different definitions of "sameness". This tool provides robust configuration parameters to support granular parsing rules:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-sans">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Whitespace Stripping</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">If active, lines containing the same text but with random outer spacing (e.g. " item" vs "item ") are correctly merged together.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Capitalization Rules</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adjust if comparing identifiers where capitalization defines unique items, like code variables or mixed-case passwords.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Empty Row Purging</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Filters out all blank lines entirely. Keeps your outputs beautifully condensed and ready for table import.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Strict Order Retention</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">First-come, first-kept. The list maintains its structure, keeping your sorting sequences, timelines, or index ranks correct.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50/25 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/40 text-xs leading-relaxed font-sans">
              <span className="font-bold text-indigo-800 dark:text-indigo-400 block mb-1">🛡️ Offline and Safe Execution:</span>
              Deduplication handles sensitive entries completely internal to your web sandbox context. None of your valuable list sheets or emails ever traverse the network.
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION DISPLAY */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800" id="dedup-faq-section">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white font-sans">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Learn more about how the deduplication engine scans and purges redundant values.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-indigo-400 dark:hover:border-slate-750 cursor-pointer select-none transition-all duration-200 font-sans"
                    id={`dedup-faq-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                      <div className="text-slate-300 hover:text-slate-500 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3.5 text-sm text-slate-500 dark:text-slate-404 leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-3.5 flex animate-in fade-in slide-in-from-top-1 duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* RELATED COMPANION UTILITIES */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800" id="dedup-related-section">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Companion Text Utilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`dedup-related-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between font-sans">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-404 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-4 block font-mono">
                  Browse Tool &rarr;
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
