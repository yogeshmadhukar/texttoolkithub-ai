import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  ArrowUpDown, 
  Globe, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  ArrowUpRight, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Sliders,
  Settings,
  AlertCircle,
  Download,
  ShieldCheck,
  FileDigit,
  Shuffle,
  Binary,
  Layers,
  Sparkle
} from 'lucide-react';

interface TextSorterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function TextSorterView({ onNavigateToTool, onNavigateHome }: TextSorterViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Settings / Controls
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [naturalSort, setNaturalSort] = useState(true);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(true);
  const [ignoreBlankLines, setIgnoreBlankLines] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);

  // Stats computed on input
  const [lineCount, setLineCount] = useState(0);
  const [uniqueCount, setUniqueCount] = useState(0);

  // SEO Parameters
  const seoTitle = "Text Sorter Tool Online - Sort Lines Alphabetically Free";
  const seoDescription = "Sort text lines alphabetically (A-Z or Z-A), reverse order, randomize lists, and eliminate duplicate lines instantly. Free privacy-first online Text Sorter Tool with FAQ schema.";

  const faqs = [
    {
      id: 1,
      question: "What is Text Sorting?",
      answer: "Text sorting is the process of arranging lines of text into a specific logical order, most commonly alphabetical (A-Z) or alphabetical reverse (Z-A). It helps organize unorganized index cards, item lists, email addresses, names, or coding scripts into structured lists for easier scanning and lookup."
    },
    {
      id: 2,
      question: "How does Natural Sorting work?",
      answer: "Standard computer sorting (ASCII-betical) arranges items character-by-character. For instance, 'Item 10' would be sorted before 'Item 2' because '1' comes before '2'. Enabling our 'Natural Sort' configuration correctly interprets numeric sequences, placing 'Item 2' before 'Item 10' in chronological order."
    },
    {
      id: 3,
      question: "Can I remove duplicate lines using this text sorter?",
      answer: "Yes. You can toggle the 'Remove Duplicate Lines' filter to automatically clean and filter out identical lines from your output in real-time, or use our standalone filters to sanitize redundant data instantly."
    },
    {
      id: 4,
      question: "Does sorting run on a server?",
      answer: "No. Just like all tools on TextToolkitHub, all sorting, shuffling, reversing, and duplication filters run entirely within your web browser using HTML5 local memory. Your input documents, private keys, or emails never traverse any networks."
    },
    {
      id: 5,
      question: "What languages are supported by the alphabetical sorter?",
      answer: "The sorter relies on the standard `Intl.Collator` Unicode algorithm. This ensures localized casing, diacritics, accent hooks, and multi-byte non-English symbols are ordered with high grammatical accuracy according to international rules."
    }
  ];

  // Dynamic SEO Setup & Schema FAQ JSON-LD script injection
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

    // Schema FAQ Content Injection
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

    const scriptId = "text-sorter-json-ld";
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

  // Compute text statistics on input
  useEffect(() => {
    if (!inputText) {
      setLineCount(0);
      setUniqueCount(0);
      return;
    }
    const rawLines = inputText.split(/\r?\n/);
    setLineCount(rawLines.length);

    const sanitizersSet = new Set();
    rawLines.forEach(line => {
      let val = line;
      if (ignoreWhitespace) val = val.trim();
      if (ignoreBlankLines && val === '') return;
      
      // Handle casing variations
      if (!caseSensitive) val = val.toLowerCase();
      sanitizersSet.add(val);
    });
    setUniqueCount(sanitizersSet.size);
  }, [inputText, ignoreWhitespace, ignoreBlankLines, caseSensitive]);

  // Unified Sorting / Transform Logic
  const getProcessedLines = () => {
    if (!inputText) return [];
    let lines = inputText.split(/\r?\n/);

    if (ignoreWhitespace) {
      lines = lines.map(l => l.trim());
    }

    if (ignoreBlankLines) {
      lines = lines.filter(l => l !== '');
    }

    if (removeDuplicates) {
      const seen = new Set<string>();
      lines = lines.filter(line => {
        const checkVal = caseSensitive ? line : line.toLowerCase();
        if (seen.has(checkVal)) {
          return false;
        }
        seen.add(checkVal);
        return true;
      });
    }

    return lines;
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText });
  };

  // Explicit actions triggered by user
  const applySortAscending = () => {
    saveToHistory();
    const lines = getProcessedLines();
    const collator = new Intl.Collator(undefined, {
      numeric: naturalSort,
      sensitivity: caseSensitive ? 'variant' : 'base'
    });
    lines.sort(collator.compare);
    setOutputText(lines.join('\n'));
  };

  const applySortDescending = () => {
    saveToHistory();
    const lines = getProcessedLines();
    const collator = new Intl.Collator(undefined, {
      numeric: naturalSort,
      sensitivity: caseSensitive ? 'variant' : 'base'
    });
    lines.sort((a, b) => collator.compare(b, a));
    setOutputText(lines.join('\n'));
  };

  const applyReverseOrder = () => {
    saveToHistory();
    const lines = getProcessedLines();
    lines.reverse();
    setOutputText(lines.join('\n'));
  };

  const applyRandomizeOrder = () => {
    saveToHistory();
    const lines = getProcessedLines();
    // Fisher-Yates Shuffle Algorithm for uniform randomization
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setOutputText(lines.join('\n'));
  };

  const applyRemoveRedundantDuplicates = () => {
    saveToHistory();
    let lines = getProcessedLines();
    const seen = new Set<string>();
    lines = lines.filter(line => {
      const checkVal = caseSensitive ? line : line.toLowerCase();
      if (seen.has(checkVal)) {
        return false;
      }
      seen.add(checkVal);
      return true;
    });
    setOutputText(lines.join('\n'));
  };

  // Utilities
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`Banana
Apple
Orange
Banana
Grapes
Peach
Pineapple
Apple
Watermelon`);
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
    setOutputText('');
  };

  const handleUndo = () => {
    if (history) {
      const prevInput = inputText;
      const prevOutput = outputText;
      setInputText(history.input);
      setOutputText(history.output);
      setHistory({ input: prevInput, output: prevOutput });
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to copy output text:', err);
    }
  };

  const handleDownloadTxt = () => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sorted_text_output.txt';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);
    } catch (err) {
      console.error('File generation error:', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Exclude current tool from relates list
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/text-sorter').slice(0, 3);

  // Trigger default quick sort preview if user desires live preview
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }
    // Update automatically with current processors (standard default sort A-Z is helpful, 
    // or keep output text updated with current selections)
    const lines = getProcessedLines();
    // We don't automatically sort ascending unless input updates, but let the user trigger, 
    // or let's auto-process current set of modifiers without sorting
    setOutputText(lines.join('\n'));
  }, [inputText, ignoreWhitespace, ignoreBlankLines, removeDuplicates]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 animate-fade-in" id="text-sorter-page">
      {/* Dynamic ambient background glow sparkles */}
      <div className="glow-accent top-20 right-10"></div>
      <div className="glow-accent bottom-20 left-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 animate-fade-in">
        
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
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Text Sorter</span>
        </div>

        {/* Title Header Row Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-850 rounded-2xl w-fit inline-block">
                <ArrowUpDown className="w-7 h-7 text-indigo-600" />
              </span>
              Text Sorter Tool Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Sort text lists, records, logs or names alphabetically. Reverse, shuffle, or remove duplicates cleanly in one click. Fully client-side.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-850 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta'}
          </button>
        </div>

        {/* Dynamic Mockup of Search Listing Snippet (SERP) */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Live Google Search Result Page (SERP) Mockup
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5 font-mono">
                <span>https://texttoolkithub.com/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/text-sorter</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-700 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Configurations Dashboard Panel */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
              <Sliders className="w-4 h-4 text-indigo-500" /> Advanced Sorter Settings
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Adjust comparative metrics to manage spaces, numbers or diacritic rules.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Control: Natural sort */}
            <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-850 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
              <input
                type="checkbox"
                checked={naturalSort}
                onChange={(e) => setNaturalSort(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Natural Sort (2 &lt; 10)
            </label>

            {/* Control: Case sensitivity */}
            <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-850 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
              <input
                type="checkbox"
                checked={caseSensitive}
                onChange={(e) => setCaseSensitive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Case Sensitive
            </label>

            {/* Control: Trim spacing */}
            <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-850 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
              <input
                type="checkbox"
                checked={ignoreWhitespace}
                onChange={(e) => setIgnoreWhitespace(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Ignore Whitespace
            </label>

            {/* Control: Ignore empty lines */}
            <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-850 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
              <input
                type="checkbox"
                checked={ignoreBlankLines}
                onChange={(e) => setIgnoreBlankLines(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Ignore Empty Lines
            </label>

            {/* Control: Auto-remove duplicates */}
            <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-850 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
              <input
                type="checkbox"
                checked={removeDuplicates}
                onChange={(e) => setRemoveDuplicates(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Strip Duplicates auto
            </label>
          </div>
        </div>

        {/* Real-time Workspace split panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* INPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> Raw Input Lines
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Sample List
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Enter or paste list elements here, with each item on a separate line..."
                className="w-full p-5 min-h-[300px] border-0 outline-none text-base text-slate-800 dark:text-slate-200 bg-transparent resize-y font-mono tracking-wide leading-relaxed"
                id="text-sorter-input-textarea"
                aria-label="Sorter Input Textarea"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium font-mono">
                <div className="flex items-center gap-4">
                  <span>Lines: <strong className="text-slate-700 dark:text-slate-200">{lineCount}</strong></span>
                  <span>Uniques: <strong className="text-slate-700 dark:text-slate-200">{uniqueCount}</strong></span>
                </div>

                <div className="flex items-center gap-2 font-sans">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-0.5 cursor-pointer"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Undo Action
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-450 hover:text-rose-600 rounded-lg transition disabled:opacity-35 cursor-pointer"
                    id="btn-clear"
                  >
                    Clear Text
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Processed Result Output
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 font-sans">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Ready
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <div className="p-5 min-h-[300px] flex flex-col justify-between">
                {outputText ? (
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Processed results will display here instantly."
                    className="w-full h-[230px] border-0 outline-none text-base text-emerald-700 dark:text-emerald-400 bg-transparent resize-none font-mono leading-relaxed"
                    id="text-sorter-output-textarea"
                    aria-label="Sorter Output Preview"
                  />
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic block my-auto text-center font-sans">
                    Your processed, sorted output items will render instantly here...
                  </span>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-3 items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Output Lines: <strong className="text-slate-700 dark:text-slate-200">{outputText ? outputText.split('\n').length : 0}</strong>
                </span>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleDownloadTxt}
                    disabled={!outputText}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:border-slate-350 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition"
                    title="Download output as plain Text document"
                    id="btn-download-txt"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-500" /> Download
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer font-sans ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/25 dark:text-indigo-400'}`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Output
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* CONTROLS COMMAND DESK BLOCK */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-16 shadow-inner">
          <div className="flex items-center gap-2 mb-4">
            <span className="p-1.5 bg-emerald-500/10 rounded-lg">
              <Sparkle className="w-4 h-4 text-emerald-500" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-700 dark:text-slate-300 font-sans">
              Line Transformation Toolkit
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button
              onClick={applySortAscending}
              disabled={!inputText}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl flex flex-col items-center justify-center gap-1 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              id="action-sort-az"
            >
              <ArrowUpDown className="w-5 h-5 opacity-90" />
              Sort A-Z Alphabetical
            </button>

            <button
              onClick={applySortDescending}
              disabled={!inputText}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-2xl flex flex-col items-center justify-center gap-1 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              id="action-sort-za"
            >
              <ArrowUpDown className="w-5 h-5 scale-y-[-1] opacity-90" />
              Sort Z-A Alphabetical
            </button>

            <button
              onClick={applyReverseOrder}
              disabled={!inputText}
              className="px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl flex flex-col items-center justify-center gap-1 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              id="action-reverse"
            >
              <RotateCcw className="w-5 h-5 opacity-90 text-amber-500" />
              Reverse Line Order
            </button>

            <button
              onClick={applyRandomizeOrder}
              disabled={!inputText}
              className="px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl flex flex-col items-center justify-center gap-1 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              id="action-randomize"
            >
              <Shuffle className="w-5 h-5 opacity-90 text-emerald-500" />
              Randomize / Shuffle
            </button>

            <button
              onClick={applyRemoveRedundantDuplicates}
              disabled={!inputText}
              className="px-4 py-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl flex flex-col items-center justify-center gap-1 transition disabled:opacity-30 disabled:pointer-events-none cursor-pointer col-span-2 md:col-span-1"
              id="action-dedupe"
            >
              <Layers className="w-5 h-5 opacity-90 text-indigo-500" />
              Filter Out Duplicates
            </button>
          </div>
        </div>

        {/* LONG-FORM INFORMATION SECTIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
          
          {/* Column 1: Background explanations */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">Educational Overview</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              What is Text Sorting?
            </h2>
            <div className="space-y-4 font-sans">
              <p>
                Text sorting is a foundational utility used across various disciplines of programming, database development, copywriting, and document preparation. It automatically structures arbitrary lists of characters, string parameters, names, or values into ordered structures based on character weights.
              </p>
              <p>
                Whether sorting logs by timestamp coordinates, organizing client indices alphabetically, or trimming massive CSV row datasets down to unique lines, having a rapid fully-offline text sorter streamlines index cataloging cleanly and with high confidence.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Key Features Evaluated
            </h3>
            <div className="space-y-3 font-sans">
              <p>Our tool supports multiple state transformations simultaneously:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Alphabetical (A-Z):</strong> Orders inputs ascendingly using locale collation benchmarks so accents are stacked correctly.</li>
                <li><strong>Reverse Order (Z-A):</strong> Inverts alphabetical structures quickly of all elements.</li>
                <li><strong>Fisher-Yates Randomization:</strong> Shuffles arrays with absolute balance for clean randomized item selections.</li>
                <li><strong>Redundancy Filtering:</strong> Cross-checks and prunes duplicate listings based on custom case sensitivity definitions.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: User Actionable Steps */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">How-To Instructions</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How To Use the Sorter Tool
            </h2>
            <div className="space-y-4 font-sans">
              <p>Perform direct list transformations in 3 simple phases:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Aquire and Input Raw List</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Paste random words, email lists, coordinates, or code sequences into the input panel.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Set Comparative Parameters</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Turn on Case Sensitivity, Natural chronological digits sorting, or auto-trim spacing configurations.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Execute & Save Results</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click any Action modifier, copy the clean output result directly, or export it to a local <code>.txt</code> file.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Privacy-First Security Mandate
            </h3>
            <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-xs tracking-wide">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-800 dark:text-emerald-350 block">100% Offline Parsing Guard:</strong>
                TextToolkitHub is an isolated sandbox workspace. Your text documents, files, client catalogs, and parameters never exit your browser.
              </div>
            </div>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto font-sans">
            <div className="text-center mb-12 animate-fade-in">
              <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked FAQ Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Have questions about sorting filters, numerical layouts, or browser processing? We've explained everything below.
              </p>
            </div>

            <div className="flex flex-col gap-4 font-sans">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id}
                    onClick={() => toggleFaq(faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer select-none transition-all duration-200"
                    id={`text-sorter-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4 font-sans">
                      <h3 className="font-bold text-slate-850 dark:text-slate-100 text-sm sm:text-base leading-snug">
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

        {/* Companion Tools shelves */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800 font-sans">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6 font-medium">
            Explore Companion Text Utilities
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
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between">
                    {tool.title}
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-4 block">
                  Open Utility &rarr;
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
