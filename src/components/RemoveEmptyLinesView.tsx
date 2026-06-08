import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Scissors, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  ArrowUpRight, 
  Globe, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface RemoveEmptyLinesViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function RemoveEmptyLinesView({ onNavigateToTool, onNavigateHome }: RemoveEmptyLinesViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Advanced feature controls
  const [removeMode, setRemoveMode] = useState<'all' | 'strict'>('all'); // 'all' = empty + whitespace only lines, 'strict' = strictly 0-character lines
  const [trimLines, setTrimLines] = useState<boolean>(false); // whether to trim whitespaces from active lines
  const [collapseConsecutive, setCollapseConsecutive] = useState<boolean>(false); // optionally collapse multiple consecutive empty lines into a single empty line instead of removing completely

  // SEO Parameters
  const seoTitle = "Remove Empty Lines Online | TextToolkitHub";
  const seoDescription = "Remove blank lines and clean text formatting instantly with our free Remove Empty Lines tool.";

  const faqs = [
    {
      id: 1,
      question: "What does the 'Remove Empty Lines' tool do?",
      answer: "This tool instantly scans your pasted text, identifies empty or blank lines (paragraphs with zero letters, or sections that only contain empty spacing), and strips them from your text. This yields a clean, compressed block of paragraphs or items."
    },
    {
      id: 2,
      question: "What is the difference between removing 'all empty & whitespace lines' and 'strictly empty lines'?",
      answer: "Strictly empty lines are lines with absolutely zero characters (length = 0). Whitespace lines are lines that might seem blank but actually contain spaces, tabs, or non-visible formatting marks. Choosing 'Remove Empty & Whitespace lines' purges both for a deeper, more immaculate cleaning."
    },
    {
      id: 3,
      question: "Can I collapse multiple empty lines into a single blank line instead?",
      answer: "Yes! By turning on the 'Collapse consecutive empty lines' switch, consecutive blank rows are reduced to exactly one single empty row. This preserves clean reading paragraph gaps while weeding out extra, irregular spacing."
    },
    {
      id: 4,
      question: "Does the utility alter my existing indentation or line spaces?",
      answer: "No, unless you explicitly select the 'Trim leading & trailing spaces' option. When disabled, the tool preserves every space and formatting character on non-empty rows perfectly."
    },
    {
      id: 5,
      question: "Are my files secure and private?",
      answer: "Yes, completely! Like all diagnostic modules on TextToolkitHub, all computations run entirely client-side using JavaScript in your individual browser session. No data is sent to our servers, maintaining 100% confidentiality."
    }
  ];

  // Dynamic SEO Setup & Schema-FAQ JSON-LD Injection
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

    // Schema FAQ JSON-LD Injection
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

    const scriptId = "remove-empty-lines-json-ld";
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

  // Run empty line removals dynamically when inputs shift
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    // Split text into individual lines while normalizing Carriage Returns
    const lines = inputText.split(/\r?\n/);
    const processedLines: string[] = [];
    let lastWasEmpty = false;

    for (let i = 0; i < lines.length; i++) {
      let currentLine = lines[i];
      
      // Determine if this line is empty based on mode
      const isStrictlyEmpty = currentLine.length === 0;
      const isWhitespaceOnly = currentLine.trim().length === 0;
      const isEmpty = removeMode === 'all' ? isWhitespaceOnly : isStrictlyEmpty;

      if (isEmpty) {
        if (collapseConsecutive) {
          if (!lastWasEmpty) {
            processedLines.push('');
            lastWasEmpty = true;
          }
        }
        // If not collapsing, we simply skip/remove it!
      } else {
        lastWasEmpty = false;
        // Optionally trim remaining lines
        if (trimLines) {
          processedLines.push(currentLine.trim());
        } else {
          processedLines.push(currentLine);
        }
      }
    }

    // Reconstruct into block stream
    setOutputText(processedLines.join('\n'));
  }, [inputText, removeMode, trimLines, collapseConsecutive]);

  // Operations Handlers
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`Shopping Grocery List Draft:
- Organic Apples
- Fresh Spinach
   
- Almond Milk (unsweetened)

  
- Whole grain oats
- Free range eggs

     
- Dark Chocolate (85% Cocoa)
 
- Greek Yogurt (plain)`);
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText });
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
      console.warn('Unable to copy text output: ', err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    try {
      const element = document.createElement('a');
      const file = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(file);
      element.href = url;
      element.download = 'cleaned_text_no_empty_lines.txt';
      document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 150);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.warn('Unable to release download file: ', err);
    }
  };

  // Metric info math helper calculations
  const countNewlines = (str: string) => (str.match(/\n/g) || []).length;
  
  const getInputLines = (): number => {
    if (!inputText) return 0;
    return inputText.split(/\r?\n/).length;
  };

  const getOutputLines = (): number => {
    if (!outputText) return 0;
    return outputText.split(/\r?\n/).length;
  };

  const inputLineCount = getInputLines();
  const outputLineCount = getOutputLines();

  // The count of removed empty lines is determined strictly during text execution
  const getRemovedCount = (): number => {
    if (!inputText) return 0;
    const lines = inputText.split(/\r?\n/);
    let emptyCount = 0;
    let consecutiveCount = 0;
    let lastWasEmpty = false;

    for (let currentLine of lines) {
      const isStrictlyEmpty = currentLine.length === 0;
      const isWhitespaceOnly = currentLine.trim().length === 0;
      const isEmpty = removeMode === 'all' ? isWhitespaceOnly : isStrictlyEmpty;

      if (isEmpty) {
        if (collapseConsecutive) {
          if (lastWasEmpty) {
            emptyCount++;
          }
          lastWasEmpty = true;
        } else {
          emptyCount++;
        }
      } else {
        lastWasEmpty = false;
      }
    }
    return emptyCount;
  };

  const removedEmptyLinesCount = getRemovedCount();

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Exclude empty lines from related tools, render top 3
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/remove-empty-lines' && t.id !== 'remove-empty-lines').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="remove-empty-lines-page">
      {/* Decorative Glow Accents */}
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
            id="breadcrumbs-category"
          >
            Formatting Cleaners
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400">Remove Empty Lines</span>
        </div>

        {/* Hero Header block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 w-fit">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Scissors className="w-6 h-6 text-indigo-500" />
              </span>
              <span className="px-3 py-1 bg-indigo-550/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-serif">
                Format Cleaner
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display tracking-tight text-slate-950 dark:text-white leading-[1.1] mb-2">
              Remove Empty <span className="font-semibold text-indigo-600 dark:text-indigo-400">Lines</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Prune unneeded blank rows, spaced tabs, and trailing line gaps from your logs, scripts, e-mails, or rosters instantly.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Rank Preview Box */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Live Google Search Rating Preview
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/remove-empty-lines
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Top Options Configuration Panel */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 p-5 mb-8 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-500" /> Formatting Algorithm Options
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select what is classified as an empty line and control extra space trims.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
            {/* Mode Radios */}
            <div className="flex border border-slate-250 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 p-1">
              <button
                onClick={() => setRemoveMode('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${removeMode === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                id="opt-mode-all"
              >
                Whitespace & Empty Lines
              </button>
              <button
                onClick={() => setRemoveMode('strict')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${removeMode === 'strict' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                id="opt-mode-strict"
              >
                Strictly Empty Only (Length = 0)
              </button>
            </div>

            {/* Trim Lines Checkbox */}
            <label 
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-850 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition-all text-[11px]"
              id="opt-trim-label"
            >
              <input
                type="checkbox"
                checked={trimLines}
                onChange={(e) => setTrimLines(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Trim remaining lines
            </label>

            {/* Collapse consecutive empty lines */}
            <label 
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-850 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition-all text-[11px]"
              id="opt-collapse-label"
            >
              <input
                type="checkbox"
                checked={collapseConsecutive}
                onChange={(e) => setCollapseConsecutive(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Collapse consecutive empty lines
            </label>
          </div>
        </div>

        {/* Diagnostics & Stats Cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Stats A: Original Line Count */}
          <div className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Total Original Lines</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-light font-display text-slate-900 dark:text-white" id="stat-original-lines">{inputLineCount}</span>
              <span className="text-xs text-slate-405 font-mono">rows</span>
            </div>
            <p className="text-[10px] text-slate-400/80 mt-1">Found in your source draft blocks</p>
          </div>

          {/* Stats B: Final Line Count */}
          <div className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950/20 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Final Cleaned Lines</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-light font-display text-slate-900 dark:text-white" id="stat-final-lines">{outputLineCount}</span>
              <span className="text-xs text-slate-405 font-mono">rows</span>
            </div>
            <p className="text-[10px] text-slate-400/80 mt-1">Remaining after purging operations</p>
          </div>

          {/* Stats C: Removed Empty Lines */}
          <div className="p-5 border border-slate-150 dark:border-indigo-950 bg-indigo-50/20 dark:bg-indigo-955/10 rounded-2xl flex flex-col justify-between shadow-sm">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500">Purged Empty Lines</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-light font-display text-indigo-600 dark:text-indigo-400" id="stat-removed-lines">{removedEmptyLinesCount}</span>
              <span className="text-xs text-indigo-400 font-mono">rows removed</span>
            </div>
            <p className="text-[10px] text-indigo-400/80 mt-1">Blank rows eradicated perfectly</p>
          </div>
        </div>

        {/* Master Workspace Split Editor Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* INPUT EDIT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-650 rounded-full"></span> 1. Source Document Paste Area
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Messy Sample List
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Paste lists, code codes, text transcripts, or files with redundant carriage items here..."
                className="w-full p-5 min-h-[350px] md:min-h-[420px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="remove-lines-input"
              />

              {/* Input Operations toolbar */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>
                
                <div className="flex items-center gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-650 hover:text-slate-850 dark:text-slate-350 dark:hover:text-white flex items-center gap-0.5"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Undo Clear
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="px-2 py-1 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-600 border border-slate-200 dark:border-slate-800 rounded-lg transition disabled:opacity-35 disabled:cursor-not-allowed text-[11px] font-semibold"
                    id="btn-clear"
                  >
                    Clear Text
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT RESULT VIEW */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 2. Cleaned Formatting Result
              </span>
              
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Cleaned instantly
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <textarea
                value={outputText}
                readOnly
                placeholder="Synchronously formatted outputs without empty lines will update instantly here..."
                className="w-full p-5 min-h-[350px] md:min-h-[420px] border-0 outline-none text-base text-slate-700 dark:text-slate-250 bg-slate-50/20 dark:bg-slate-900/10 resize-y font-sans leading-relaxed"
                id="remove-lines-output"
              />

              {/* Output Actions controls */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium">
                  Characters: <strong className="text-slate-700 dark:text-slate-200">{outputText.length}</strong>
                </span>

                <div className="flex items-center gap-2">


                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-extrabold tracking-wide transition disabled:opacity-35 ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'text-white bg-indigo-650 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500'}`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Text!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Result
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Editorial Informative Guide and Instructions Content */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Section A: Description and Guide */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Layout Sanitization</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              What are the benefits of stripping empty rows?
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                Whether you are parsing database records, sorting names from spreadsheet rosters, sanitizing raw markdown files, or formatting old e-mails, irregular empty lines represent clutter. Irregular spacing disrupts systematic layout reading, inflates print heights unnecessarily, and adds excess weight to files.
              </p>
              <p>
                Our <strong>Remove Empty Lines online</strong> utility provides instant, client-side cleaning for these common pain points. Users can instantly weed out spacing margins and collapse uneven Carriage Returns directly without complex text editing commands.
              </p>
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-8 mb-3">
              How to strip whitespace from documents
            </h3>
            <ul className="text-sm list-decimal pl-5 space-y-2 leading-relaxed">
              <li>Input or copy-paste your messy structured contents into the left text box.</li>
              <li>Select your cleaning criteria: choose whether you want to target strictly content-free lines or those containing tabs and spacer rows.</li>
              <li>Optionally toggle "Trim remaining lines" to strip leading and trailing margins from valid lines left behind.</li>
              <li>Immediately view line diagnostics including total original lines count, final rows count, and total purged segments.</li>
              <li>Erase, undo changes, download your clean files to `.txt` documents, or capture them on your clipboard.</li>
            </ul>
          </div>

          {/* Section B: Projections & Benchmarks */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Dynamic Features List</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              High-Value Processing Features
            </h2>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Whitespace Line Eradication</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Automatically checks lines for invisible spacer tokens—such as multiple space strings or hidden tabs—for absolute cleaning.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Smart Paragraph Collapsing</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">If you wish to keep paragraph divisions but eliminate chaotic spaces, the consecutive-line-collapse feature fuses them down into single lines.</p>
              </div>

              <div className="p-4 bg-indigo-550/10 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl">
                <h4 className="font-bold text-indigo-805 dark:text-indigo-400 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Private Client-Side Sandbox
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">All file content is calculated inside your current browser session state. No texts are uploaded to servers, keeping proprietary documents secure.</p>
              </div>
            </div>
          </div>

        </section>

        {/* FAQ Accordion Details */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Detailed insights on how our spacing algorithm cleans pasted inputs.
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
                    id={`remove-lines-faq-item-${faq.id}`}
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

        {/* Related utilities navigation footer */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Explore Companion Formatting Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`remove-lines-related-card-${tool.id}`}
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

      </div>
    </div>
  );
}
