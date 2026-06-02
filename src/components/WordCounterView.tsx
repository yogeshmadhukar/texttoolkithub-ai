import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  FileText, 
  Clock, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  Info, 
  Volume2, 
  HelpCircle, 
  ArrowUpRight, 
  BookOpen, 
  ListOrdered, 
  Globe, 
  BookmarkCheck,  
  ChevronDown, 
  ChevronUp,
  RotateCcw
} from 'lucide-react';

interface WordCounterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function WordCounterView({ onNavigateToTool, onNavigateHome }: WordCounterViewProps) {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO parameters as requested
  const seoTitle = "Word Counter Tool – Count Words, Characters & Reading Time";
  const seoDescription = "Free online word counter tool. Count words, characters, sentences, paragraphs, reading time and speaking time instantly.";

  // Frequently Asked Questions
  const faqs = [
    {
      id: 1,
      question: "What is a Word Counter?",
      answer: "A word counter is a digital tool that instantly calculates the volume of words, characters, sentences, and paragraphs in a block of text. It is crucial for copywriters, students, authors, and SEO professionals who need to maintain strict text lengths for their publications."
    },
    {
      id: 2,
      question: "How to Use This Tool?",
      answer: "Simply type directly into the workspace textarea or paste your prepared draft document. Our counter will dynamically update all statistics, reading times, speaking times, and densities in real time. You can instantly copy or clear the text with a single click."
    },
    {
      id: 3,
      question: "How are reading and speaking times estimated?",
      answer: "Our engine uses professional benchmark averages: Reading time is estimated at a speed of 225 words per minute (WPM), typical for silent reading. Speaking time is calculated at a standard conversational pacing of 150 words per minute (WPM)."
    },
    {
      id: 4,
      question: "Does TextToolkitHub save or store my text?",
      answer: "No. Absolutely none of your text or metrics are sent to foreign servers or stored in any database. The entire tool executes 100% locally client-side inside your standard web browser container. It is fully offline-safe and completely private."
    },
    {
      id: 5,
      question: "Are there any character or file limits?",
      answer: "No. Because the tool runs directly on your computer's local resources, there are no artificial boundaries. You can input whole manuscripts, papers, essays, or code files easily."
    }
  ];

  // Dynamic Page Title and Meta Tag Setup for Real SEO Support
  useEffect(() => {
    // Preserve old title to restore on unmount
    const previousTitle = document.title;
    document.title = seoTitle;

    // Dynamically insert SEO meta description
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

    const scriptId = "word-counter-json-ld";
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = JSON.stringify(schemaContent);

    return () => {
      // Restore on clean up
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
    
    // Words list (filtering out null spaces)
    const wordsArray = trimmed === '' ? [] : trimmed.split(/\s+/).filter(w => w.length > 0);
    const wordsCount = wordsArray.length;

    // Characters counts
    const charWithSpaces = text.length;
    const charNoSpaces = text.replace(/\s/g, '').length;

    // Sentences count: split by .!? followed by whitespace or ending
    const sentencesArray = text === '' ? [] : text.split(/[.!?]+(?=\s|$)/).filter(s => s.trim().length > 0);
    const sentencesCount = sentencesArray.length;

    // Paragraphs count: consecutive line breaks
    const paragraphsArray = text === '' ? [] : text.split(/\n\s*\n+/).filter(p => p.trim().length > 0);
    const paragraphsCount = paragraphsArray.length;

    // Time Estimates (Reading: 225 WPM, Speaking: 150 WPM)
    const readingTimeSec = Math.ceil((wordsCount / 225) * 60);
    const speakingTimeSec = Math.ceil((wordsCount / 150) * 60);

    const formatTime = (totalSec: number) => {
      if (totalSec === 0) return "0s";
      if (totalSec < 60) return `${totalSec}s`;
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
    };

    // Word Length Average
    const avgWordLength = wordsCount === 0 ? 0 : parseFloat((charNoSpaces / wordsCount).toFixed(1));

    // Keyword density maps
    const commonStopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'to', 'in', 'of', 'for', 'it', 'with', 
      'this', 'that', 'by', 'as', 'are', 'be', 'or', 'your', 'our', 'from', 'but', 'not', 'have', 'has'
    ]);
    const frequencies: { [key: string]: number } = {};
    wordsArray.forEach(w => {
      const clean = w.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").toLowerCase().trim();
      if (clean.length > 1 && !commonStopWords.has(clean)) {
        frequencies[clean] = (frequencies[clean] || 0) + 1;
      }
    });

    const keywordDensity = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      words: wordsCount,
      chars: charWithSpaces,
      charsNoSpaces: charNoSpaces,
      sentences: sentencesCount,
      paragraphs: paragraphsCount,
      readingTime: formatTime(readingTimeSec),
      speakingTime: formatTime(speakingTimeSec),
      avgWordLength,
      keywordDensity
    };
  };

  const metrics = calculateMetrics();

  // Toolbar Actions
  const handleLoadSample = () => {
    setHistory(text);
    setText(`TextToolkitHub is an exceptionally fast, fully-private online writing studio. This Word Counter analyzes paragraph syntax, keyword density, and speaking pacing variables on the fly. 

Crafting clean copy for SEO portals, marketing layouts, or academic papers requires maintaining strict word thresholds. By computing counts inside your local sandboxed container, absolutely zero content leaks to databases.

Try loading your blog entries to check standard silent reading and speech tempos! No cookie profiles or background tracking routines exist inside our ecosystem.`);
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
      console.warn('Unable to copy text context: ', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Recommendations
  const relatedTools = TOOLS.filter(t => t.id !== 'tools-word-counter' && t.id !== 'tools/word-counter' && t.id !== 'word-counter').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="word-counter-page">
      {/* Dynamic Ambient Background Sparkles */}
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
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400">Word Counter</span>
        </div>

        {/* Header Block Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <FileText className="w-7 h-7 text-indigo-500" />
              </span>
              Premium Word Counter
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Live text statistical analysis engine. Gain full control of character limitations, sentence spacing, paragraph structure, and voice pacing speeds instantly.
            </p>
          </div>

          {/* Inspect SEO Tag Segment */}
          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Simulated Google Snippet Preview Drawer */}
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
                https://texttoolkithub.com/tools/word-counter
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

        {/* Master Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT COLUMN: Input Workspace (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* The Work desk card layout */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              
              {/* Workspace Ribbon */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Dynamic Text Studio
                </span>
                
                <button 
                  onClick={handleLoadSample}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  id="btn-sample-load"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Load Sample Copy
                </button>
              </div>

              {/* Document input text area */}
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Start writing or paste your copy here..."
                className="w-full p-5 min-h-[300px] md:min-h-[420px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="word-counter-textarea"
              />

              {/* Footer action board */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                
                {/* Dynamically flashing text statuses */}
                <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
                  <span>Words: <strong className="text-slate-700 dark:text-slate-200">{metrics.words}</strong></span>
                  <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{metrics.chars}</strong></span>
                </div>

                {/* Operations */}
                <div className="flex items-center gap-2">
                  
                  {/* Single tier undo draft */}
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="p-2 border border-slate-250 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl flex items-center gap-1 transition-all text-xs font-semibold"
                      title="Undo last action"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Undo
                    </button>
                  )}

                  {/* Clear block */}
                  <button
                    onClick={handleClear}
                    disabled={!text}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-400"
                    title="Clear content"
                    id="btn-clear"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>

                  {/* Complete copy clipboard */}
                  <button
                    onClick={handleCopy}
                    disabled={!text}
                    className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-slate-200 dark:border-slate-800 bg-white hover:bg-indigo-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-indigo-950/20 dark:text-slate-200'}`}
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

          {/* RIGHT COLUMN: Multi-dimensional Metrics (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6" id="metrics-rail">
            
            {/* Live Metrics Card */}
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Real-time Metrics Dashboard
              </h3>

              {/* Core numbers quadrant block */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">Total Words</dt>
                  <dd className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1">{metrics.words}</dd>
                </div>
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">Characters</dt>
                  <dd className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{metrics.chars}</dd>
                </div>
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">Char (No Space)</dt>
                  <dd className="text-3xl font-extrabold text-slate-850 dark:text-slate-200 font-mono mt-1">{metrics.charsNoSpaces}</dd>
                </div>
                <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
                  <dt className="text-[10px] uppercase font-bold text-slate-400">Sentences</dt>
                  <dd className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{metrics.sentences}</dd>
                </div>
              </div>

              {/* Secondary block lists */}
              <div className="mt-4 bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 flex flex-col gap-4">
                {/* Paragraph segments stats */}
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-900">
                  <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> Paragraph Count</span>
                  <strong className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{metrics.paragraphs}</strong>
                </div>

                {/* Average word length */}
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-900">
                  <span>Avg Word Length</span>
                  <strong className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">{metrics.avgWordLength} chars</strong>
                </div>

                {/* Reading Benchmark time */}
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-900">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> Silent Reading Time</span>
                  <strong className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{metrics.readingTime}</strong>
                </div>

                {/* Speaking speech time pacing */}
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5"><Volume2 className="w-3.5 h-3.5" /> Active Speaking Pacing</span>
                  <strong className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{metrics.speakingTime}</strong>
                </div>
              </div>

              {/* Dynamic Keyword Frequencies */}
              {metrics.keywordDensity.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-850 pt-4 mt-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Top Keyword Densities</span>
                  <div className="flex flex-col gap-2.5 mt-3">
                    {metrics.keywordDensity.map(([word, freq]) => {
                      const perc = Math.min(100, Math.round((freq / metrics.words) * 100));
                      return (
                        <div key={word} className="flex flex-col gap-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-600 dark:text-slate-400">"{word}"</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-mono">{freq}x ({perc}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full" style={{ width: `${Math.max(10, perc)}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* COMPREHENSIVE REQUISITE EDITORIAL PARTS */}
        {/* Editorial Body: Content Sections */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Section 1: Editorial Introduction */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500">Writing Science</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              What is a Word Counter?
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                A <strong>word counter</strong> is a specialized parsing utility that analyzes written structures to determine the volume of components included. By isolating delimiters (such as spacing boundaries, paragraph intervals, and punctuation markers), it delivers an accurate breakdown of document structure.
              </p>
              <p>
                Whether pacing your school essay boundaries, formatting SEO content blocks to target specific search engine layouts, or refining a social media post to meet specific limit rules, understanding metrics is fundamental to premium content craft.
              </p>
            </div>
            
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">
              How to Use This Tool
            </h3>
            <ul className="text-sm list-decimal pl-5 space-y-2 leading-relaxed">
              <li>Input or copy-paste your draft into the large workspace text-area instantly.</li>
              <li>Calculators analyze density values instantly client-side without any lagging.</li>
              <li>Check reading and speaking timers on the side rails to adjust pacing benchmarks.</li>
              <li>Copy, clean, or download the formatted text straight into your document directories.</li>
            </ul>
          </div>

          {/* Section 2: Features Matrix */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500">Exhaustive Checklist</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Counter Core Features
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Real-Time Calculus</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Updates instantly on every keypress without adding background server latency.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Granular Character Check</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Isolates counts containing standard blank whitespaces and ignores spaces for limits.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Pacing Estimates</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate standard reading times alongside verbal speaking tempos instantly.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Private & Local</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">None of your private drafts are ever uploaded. All processing remains on your browser.</p>
              </div>
            </div>

            {/* Keyword Density explanation */}
            <div className="mt-6 p-4 bg-indigo-50/20 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/40 text-xs leading-relaxed">
              <span className="font-bold text-indigo-700 dark:text-indigo-400 block mb-1">✓ Keyword Frequency Density Check:</span>
              Our advanced density algorithms isolate common stop-words (such as 'the', 'is', 'a') and trace primary words that are repeated. Ideal for keyword clustering audit strategies.
            </div>
          </div>

        </section>

        {/* FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Detailed insights on how TextToolkitHub measures text variables.
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
                    id={`word-counter-faq-item-${faq.id}`}
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

        {/* Related Tools Panel */}
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
