import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  AlignLeft, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  Info, 
  HelpCircle, 
  ArrowUpRight, 
  BookOpen, 
  FileText, 
  BookmarkCheck,  
  ChevronDown, 
  ChevronUp,
  RotateCcw
} from 'lucide-react';

interface SentenceCounterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function SentenceCounterView({ onNavigateToTool, onNavigateHome }: SentenceCounterViewProps) {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO parameters as requested
  const seoTitle = "Sentence Counter Online | Free Sentence Counting Tool";
  const seoDescription = "Count sentences instantly with our free Sentence Counter. Analyze sentence totals, words, characters, and reading time online.";

  // Frequently Asked Questions
  const faqs = [
    {
      id: 1,
      question: "What is a Sentence Counter?",
      answer: "A sentence counter is a browser-native writing analysis utility that calculates the exact count of sentences in any pasted or written text block. It checks for punctuation marks like periods, exclamation marks, and question marks to locate sentence endings."
    },
    {
      id: 2,
      question: "How does the Sentence Counter detect sentence endings?",
      answer: "Our tool parses the text looking for standard terminators (. , ! , ?) followed by a space, line break, or the end of the text. It also intelligently handles incomplete sentences at the very end of your paragraph and avoids double-counting consecutive symbols like '...'"
    },
    {
      id: 3,
      question: "Is my text data safe on TextToolkitHub?",
      answer: "Yes, absolutely! TextToolkitHub is designed with a strict privacy-first architecture. All calculation procedures are performed 100% locally client-side inside your own browser window. No text, data, or files are ever transmitted to any third-party external host or database."
    },
    {
      id: 4,
      question: "Is this Sentence Counter free to use?",
      answer: "Yes! Like all utilities in the TextToolkitHub suite, the Sentence Counter is entirely free, requires no signup, is free from annoying popups, and operates with sub-millisecond local latency."
    }
  ];

  // Dynamic Page Title and Meta Tag Setup for Real SEO Support
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

    // Schema JSON-LD Injection
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

    const scriptId = "sentence-counter-json-ld";
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

  // Live Metrics Calculations
  const calculateMetrics = () => {
    const trimmed = text.trim();
    
    // Total Characters
    const charCount = text.length;

    // Total Words
    const wordsArray = trimmed === '' ? [] : trimmed.split(/\s+/).filter(w => w.length > 0);
    const wordsCount = wordsArray.length;

    // Total Sentences: Split on .!? followed by whitespace or ending.
    // Handles multiple consecutive punctuation (like ellipsis or multiple !!) correctly.
    const countSentences = (val: string): number => {
      const clean = val.trim();
      if (!clean) return 0;
      
      const matches = clean.match(/[^.!?]+[.!?]+(?=\s+|$)/g);
      const countByMatch = matches ? matches.length : 0;
      
      if (countByMatch === 0 && clean.length > 0) {
        return 1;
      }
      
      const lastChar = clean[clean.length - 1];
      const endsWithTerminator = /[.!?]/.test(lastChar);
      if (!endsWithTerminator && countByMatch > 0) {
        return countByMatch + 1;
      }
      
      return countByMatch;
    };

    const sentencesCount = countSentences(text);

    // Reading speed: standard WPM typical for silent reading
    const readingTimeSec = Math.ceil((wordsCount / 225) * 60);

    const formatTime = (totalSec: number) => {
      if (totalSec === 0) return "0s";
      if (totalSec < 60) return `${totalSec}s`;
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
    };

    return {
      sentences: sentencesCount,
      words: wordsCount,
      chars: charCount,
      readingTime: formatTime(readingTimeSec)
    };
  };

  const metrics = calculateMetrics();

  // Actions
  const handleLoadSample = () => {
    setHistory(text);
    setText(`Are you editing an important article? Or perhaps pasting a creative block of copy? Count sentences instantly with our free online tool! 

This high-performance client-side Sentence Counter works incredibly fast. It checks periods, exclamation marks, and question marks to isolate sentences perfectly! Additionally, it tracks word totals, character details, and reading speed pacing. 

All scripts run strictly inside your browser, making it completely private. Give it a try by loading or drafting your own text templates today!`);
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
      console.warn('Unable to copy text: ', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Find related tools excluding current
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/sentence-counter' && t.id !== 'sentence-counter').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="sentence-counter-page">
      {/* Decorative Ambient Radial Glow Background */}
      <div className="glow-accent top-12 left-10"></div>
      <div className="glow-accent top-80 right-20"></div>

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
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            id="breadcrumbs-category"
          >
            Analyzers
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-800 dark:text-slate-200">Sentence Counter</span>
        </div>

        {/* Hero Header Area */}
        <div className="mb-8 md:mb-10 text-left">
          <div className="flex items-center gap-2 mb-2 w-fit">
            <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
              <AlignLeft className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </span>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-serif">
                     Local Analysis Mode
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-3">
            Sentence <span className="font-semibold text-indigo-600 dark:text-indigo-400">Counter</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Count sentences, words, characters, and estimate reading time inside an absolute local environment. Real-time scanning reveals direct stats.
          </p>
        </div>

        {/* Toolbar & Undo Segment */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
              id="sc-btn-sample"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Sample Text
            </button>
            {history && (
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition"
                id="sc-btn-undo"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Undo Change
              </button>
            )}
          </div>
        </div>

        {/* Main Interface Layout Panel Splitter */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* LEFT COLUMN: Input workspace (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              
              {/* Workspace Header */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-sans flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Drafting Sandbox
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Characters: {metrics.chars}
                </span>
              </div>

              {/* Text Input Sandbox Textarea */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text copy or start drafting your article here to count sentences instantly..."
                className="w-full min-h-[320px] md:min-h-[380px] p-5 border-none resize-y text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent text-sm sm:text-base leading-relaxed focus:ring-0 focus:outline-none"
                id="sentence-counter-textarea"
              />

              {/* Workspace Footer toolbar */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                
                {/* Clear text parameters */}
                <button
                  onClick={handleClear}
                  disabled={!text}
                  className="p-2 border border-slate-250 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl flex items-center gap-1 transition-all text-xs font-semibold disabled:opacity-35 disabled:cursor-not-allowed"
                  id="sc-btn-clear"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Clear Workspace
                </button>

                {/* Copy results */}
                <button
                  onClick={handleCopy}
                  disabled={!text}
                  className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 disabled:cursor-not-allowed ${
                    copied 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                      : 'border border-slate-200 dark:border-slate-800 bg-white hover:bg-indigo-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-indigo-950/20 dark:text-slate-200'
                  }`}
                  id="sc-btn-copy"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied Input!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" /> Copy Text
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: Multi-dimensional metrics results cards (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6" id="sc-metrics-rail">
            
            {/* Live Metrics Dashboard */}
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Real-time Metrics Dashboard
              </h3>

              {/* Core numbers block */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Total Sentences */}
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 hover:border-indigo-500/20 transition duration-200">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">Total Sentences</dt>
                  <dd className="text-3.5xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1">{metrics.sentences}</dd>
                </div>

                {/* Total Words */}
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 hover:border-indigo-500/20 transition duration-200">
                  <dt className="text-[10px] uppercase font-bold text-slate-400 font-sans">Total Words</dt>
                  <dd className="text-3.5xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{metrics.words}</dd>
                </div>

                {/* Characters */}
                <div className="col-span-2 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 hover:border-indigo-500/20 transition duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <dt className="text-[10px] uppercase font-bold text-slate-400">Total Characters</dt>
                      <dd className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{metrics.chars}</dd>
                    </div>
                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-700" />
                  </div>
                </div>

              </div>

              {/* Reading Benchmark time */}
              <div className="mt-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col gap-4">
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Silent Reading Time</span>
                  <strong className="text-sm font-bold text-indigo-600 dark:text-indigo-400 font-mono">{metrics.readingTime}</strong>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Editorial Body Segment */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Scientific Introduction details */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500">Writing Pacing</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              What is sentence structure count?
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                In copywriting and prose composition, a <strong>sentence</strong> represents a key intellectual unit of complete thoughts. It starts with an uppercase character and terminates cleanly with punctuation markers like periods, exclamation marks, or question symbols.
              </p>
              <p>
                Managing sentence totals is key to maintaining text readability. Long, run-on sentences compromise understanding, while short, fragmented entries feel abrupt. Keeping an optimal sentence density ensures that readers stay engaged.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">
              How the analysis executes
            </h3>
            <ul className="text-sm list-decimal pl-5 space-y-2 leading-relaxed">
              <li>Input raw contents by typing dynamically or pasting formatted clipboard assets.</li>
              <li>A client-side tokenizing sweep analyzes terminators (. ! ?) in real time.</li>
              <li>The calculated indices show sentence totals, words, and characters instantaneously.</li>
              <li>Everything stays inside your browser window context, ensuring total data safety.</li>
            </ul>
          </div>

          {/* Features and checklists */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 font-sans">Exhaustive Checklist</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Sentence Analyzer Features
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Real-Time Calculus</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Updates instantly on every keypress without adding background server latency.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Termination Rules</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Isolates counts containing standard sentence terminators (. ! ?) automatically.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Reading speed pacer</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculates reading durations immediately matching a silent 225 WPM benchmark.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Privacy First</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Operates 100% locally on client devices. Absolute security for secret drafts.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50/20 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/40 text-xs leading-relaxed">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1">✓ Smart Sentence Boundaries Detection:</span>
              Our parsing system detects terminal punctuation followed by proper indentation or page wraps to calculate readable text slices accurately.
            </div>
          </div>

        </section>

        {/* FAQ Accordions Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Detailed insights on how TextToolkitHub isolates writing elements.
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
                    id={`sentence-counter-faq-item-${faq.id}`}
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

        {/* Companion Tools Grid */}
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
                id={`sc-related-card-${tool.id}`}
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
