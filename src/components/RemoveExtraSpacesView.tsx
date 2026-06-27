import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Eraser, 
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
  Minimize,
  RefreshCw,
  Space,
  Scissors,
  CheckCircle,
  Activity
} from 'lucide-react';

interface RemoveExtraSpacesViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function RemoveExtraSpacesView({ onNavigateToTool, onNavigateHome }: RemoveExtraSpacesViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Configuration options for whitespace cleansing
  const [stripAllMultipleSpaces, setStripAllMultipleSpaces] = useState<boolean>(true); // converts multiple consecutive spaces into single space
  const [stripDoubleSpacesOnly, setStripDoubleSpacesOnly] = useState<boolean>(false); // converts 2 spaces only into 1 space
  const [trimLeadingTrailing, setTrimLeadingTrailing] = useState<boolean>(true); // trims start and end
  const [removeTabs, setRemoveTabs] = useState<boolean>(true); // replaces tabs with space
  const [removeEmptyLines, setRemoveEmptyLines] = useState<boolean>(false); // strips redundant carriage returns

  // SEO Configurations
  const seoTitle = "Remove Extra Spaces Online Free – Whitespace & Tabs Cleaner";
  const seoDescription = "Instantly remove double spaces, multiple spaces, duplicate tabs, and trim leading/trailing whitespace from your text online for free.";

  const faqs = [
    {
      id: 1,
      question: "How do extra spaces end up in documents?",
      answer: "Duplicate spacing is common when converting files across formats, copying tabulated text from files, exporting DB entries, or transcribing scanned documents via OCR sensors. Authors also frequently press the spacebar twice inadvertently between sentences."
    },
    {
      id: 2,
      question: "What is the difference between removing double spaces vs multiple spaces?",
      answer: "Removing double spaces targets pairs of spaces and reduces them to a single space. Removing 'multiple spaces' targets any consecutive block of or more spaces (e.g., 3, 5, or 10 spaces) and collapses them down to a single space, which is much more aggressive and comprehensive for raw exports."
    },
    {
      id: 3,
      question: "Does the Whitespace Cleaner affect line break carriage returns?",
      answer: "No, by default standard single/double line returns are protected so that your paragraph flow is preserved. If you toggle on the 'Clean Redundant Empty Lines' option under configuration, empty blank lines will be pruned gracefully."
    },
    {
      id: 4,
      question: "Is there any word or character limit on this sanitization tool?",
      answer: "None whatsoever. All memory operations occur entirely inside your browser's local sandbox memory. This allows you to paste full-length articles, books, databases, or code layouts safely and securely."
    },
    {
      id: 5,
      question: "Is my text private on TextToolkitHub?",
      answer: "Absolutely. TextToolkitHub does not run servers or cache databases for text documents. 100% of the computing logic processes locally in your browser so zero data footprints are exposed."
    }
  ];

  // Dynamic SEO Page Title and Schema.org Injection
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

    // Schema FAQ Content Setup
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

    const scriptId = "remove-spaces-json-ld";
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

  // Main Live Clean Run
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let result = inputText;

    // Convert tabs to standard spaces if requested
    if (removeTabs) {
      result = result.replace(/\t/g, ' ');
    }

    // Process empty/multi line breaks if requested
    if (removeEmptyLines) {
      result = result.replace(/\n\s*\n+/g, '\n\n');
    }

    // Spaces Reduction Matrix:
    if (stripAllMultipleSpaces) {
      // Replaces 2 or more space blocks with a single space
      result = result.replace(/ {2,}/g, ' ');
    } else if (stripDoubleSpacesOnly) {
      // Replaces exactly 2 spaces with 1 space
      result = result.replace(/  /g, ' ');
    }

    // Leading & Trailing space trimming
    if (trimLeadingTrailing) {
      // Trim start of each line, and end of each line
      const lines = result.split('\n');
      const trimmedLines = lines.map(line => line.trim());
      result = trimmedLines.join('\n');
      // Trim total bookends
      result = result.trim();
    }

    setOutputText(result);
  }, [inputText, stripAllMultipleSpaces, stripDoubleSpacesOnly, trimLeadingTrailing, removeTabs, removeEmptyLines]);

  // Handle Operations
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`   This is a   document with excessive   spacing. 
  
There are   double spaces  inside this text block,
as well as heavy   tabs\t\ttabbed elements here.

Trimmed leading  and trailing margins will clear  outer spaces.   `);
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
      console.warn('Unable to copy spaces cleaned text: ', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Find other tools
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/remove-extra-spaces' && t.id !== 'remove-extra-spaces').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="remove-spaces-page">
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
            onClick={() => onNavigateToTool('tools')}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400">Remove Extra Spaces</span>
        </div>

        {/* Header segment */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Eraser className="w-7 h-7 text-indigo-550" />
              </span>
              Remove Extra Spaces Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Format messy spacing instantly. Clean duplicate double spaces, multiple spacing tabs, trailing empty runs, and leading outer carriage blocks dynamically.
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

        {/* SEO Metadata Drawer */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Real Google Search Result Snippet
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/remove-extra-spaces
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

        {/* Configuration Panel */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 p-5 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Formatting Configurations</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Enable or disable spacing triggers below to customize parsing behavior.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Trim leading and trailing spaces */}
            <label className="flex items-center gap-2.5 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition select-none text-xs font-bold text-slate-750 dark:text-slate-200">
              <input
                type="checkbox"
                checked={trimLeadingTrailing}
                onChange={(e) => setTrimLeadingTrailing(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-350 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Trim Leading/Trailing
            </label>

            {/* Remove Multiple consecutive spaces */}
            <label className="flex items-center gap-2.5 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition select-none text-xs font-bold text-slate-750 dark:text-slate-200">
              <input
                type="checkbox"
                checked={stripAllMultipleSpaces}
                onChange={(e) => {
                  setStripAllMultipleSpaces(e.target.checked);
                  if (e.target.checked) setStripDoubleSpacesOnly(false);
                }}
                className="w-4 h-4 text-indigo-600 border-slate-350 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Remove Multiple Spaces
            </label>

            {/* Remove double spaces only */}
            <label className="flex items-center gap-2.5 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition select-none text-xs font-bold text-slate-750 dark:text-slate-200">
              <input
                type="checkbox"
                checked={stripDoubleSpacesOnly}
                onChange={(e) => {
                  setStripDoubleSpacesOnly(e.target.checked);
                  if (e.target.checked) setStripAllMultipleSpaces(false);
                }}
                className="w-4 h-4 text-indigo-600 border-slate-350 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Double Spaces Only
            </label>

            {/* Remove tabs */}
            <label className="flex items-center gap-2.5 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition select-none text-xs font-bold text-slate-750 dark:text-slate-200">
              <input
                type="checkbox"
                checked={removeTabs}
                onChange={(e) => setRemoveTabs(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-350 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Convert Tabs to Spaces
            </label>

            {/* Clean empty lines */}
            <label className="flex items-center gap-2.5 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 transition select-none text-xs font-bold text-slate-750 dark:text-slate-200">
              <input
                type="checkbox"
                checked={removeEmptyLines}
                onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-350 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Clean Empty Lines
            </label>

          </div>
        </div>

        {/* Work Desk side-by-side grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* INPUT FIELD */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Raw Input document
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5" /> Load Draft Sample
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Type or paste text with double spaces, duplicate tabs, or uneven leading/trailing whitespaces here..."
                className="w-full p-5 min-h-[350px] md:min-h-[440px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="remove-spaces-input-textarea"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex gap-4">
                  <span>Input Characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>
                </div>

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
                    className="p-1 px-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-35"
                    id="btn-clear"
                  >
                    Clear Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT FIELD */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Formatted output text
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Cleaned Live
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <textarea
                value={outputText}
                readOnly
                placeholder="Cleaned outputs will appear instantly..."
                className="w-full p-5 min-h-[350px] md:min-h-[440px] border-0 outline-none text-base text-slate-700 dark:text-slate-250 bg-slate-50/20 dark:bg-slate-900/10 resize-y font-sans leading-relaxed"
                id="remove-spaces-output-textarea"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div>
                  <span>Output Characters: <strong className="text-emerald-600 dark:text-emerald-400">{outputText.length}</strong></span>
                  <span className="ml-3 text-slate-450">
                    Saves: <strong className="text-slate-700 dark:text-slate-200">{Math.max(0, inputText.length - outputText.length)} B</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`px-4.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/20 dark:text-indigo-400'}`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
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

        {/* DEDICATED EXHAUSTIVE UNIQUE COPY CONTENT */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Section 1: How it works & Benefits */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Core Science</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              How Spacing Sanitizers Work
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                Space delimiters are important syntactic markers that allow digital processors to identify distinct words. However, redundant consecutive spaces, tabulator tabs, and trailing indent blocks can clutter formatting structures and cause styling inconsistencies in web designs or layouts.
              </p>
              <p>
                Our <strong>Remove Extra Spaces</strong> engine processes inputs through granular Regular Expressions (regex) client-side. The tool isolates sequential spacers, merges double spacings, clears margins on block lines, and converts tab delimiters cleanly according to your needs.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">
              Principal Benefits of Cleaning Whitespaces
            </h3>
            <ul className="text-sm list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Reduced Bytes Footprint:</strong> Redundant spaces consume bytes. Cleaning them optimizes string payloads and database values.</li>
              <li><strong>Clean Grammars:</strong> Avoid double spaces after periods, a layout styling habit that looks unprofessional in modern digital typesetting.</li>
              <li><strong>Seamless Code Imports:</strong> Maintain clean spacing when copying and pasting code blocks or Tab-Separated Values (TSV) into spreadsheets and forms.</li>
            </ul>
          </div>

          {/* Section 2: Instructions and Layout */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Operations Handbooks</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Quick Usage Steps
            </h2>
            
            <div className="space-y-4.5 text-sm leading-relaxed">
              <p>Follow these quick instructions to clean up your text documents:</p>
              
              <div className="flex gap-3 leading-relaxed">
                <span className="w-5 h-5 bg-indigo-50 dark:bg-slate-805 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5">1</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Aquire and Paste Your Draft</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Copy messy scripts or data columns from your email client, PDF, or text files directly into the input textarea.</p>
                </div>
              </div>

              <div className="flex gap-3 leading-relaxed">
                <span className="w-5 h-5 bg-indigo-50 dark:bg-slate-805 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5">2</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Verify Configurations</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select whether to trim leading margins, merge all multi-spaces, or strip blank lines completely using the toggles.</p>
                </div>
              </div>

              <div className="flex gap-3 leading-relaxed">
                <span className="w-5 h-5 bg-indigo-50 dark:bg-slate-805 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5">3</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Copy Pristine Copy output</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click "Copy Result" to save the cleaned text directly to your clipboard for instant pasting.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Frequently Asked Questions accordion */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-550 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Frequently asked questions on dealing with text indentation, spacing, and formatting.
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
                    id={`remove-spaces-faq-item-${faq.id}`}
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

        {/* Companion / Related Tools Block */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
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
