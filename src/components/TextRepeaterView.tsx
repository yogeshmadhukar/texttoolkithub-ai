import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Repeat, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  Sliders, 
  FileText,
  RotateCcw
} from 'lucide-react';

interface TextRepeaterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function TextRepeaterView({ onNavigateToTool, onNavigateHome }: TextRepeaterViewProps) {
  const [inputText, setInputText] = useState('');
  const [repeatCount, setRepeatCount] = useState<number>(10);
  const [repeatMode, setRepeatMode] = useState<'line' | 'continuous' | 'space' | 'custom'>('line');
  const [customSeparator, setCustomSeparator] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ text: string; count: number; mode: 'line' | 'continuous' | 'space' | 'custom'; sep: string } | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO parameters as requested
  const seoTitle = "Text Repeater Online | Repeat Text Instantly";
  const seoDescription = "Repeat words, sentences, and phrases instantly with our free Text Repeater tool. Generate repeated text with one click.";

  // Frequently Asked Questions
  const faqs = [
    {
      id: 1,
      question: "What is a Text Repeater?",
      answer: "A text repeater is a browser-based utility that duplicates any word, phrase, sentence, or list multiple times in a fraction of a second. It is perfect for generating test data, formatting structured patterns, or creating repetitive text templates without manual typing."
    },
    {
      id: 2,
      question: "Is there a limit to how many times I can repeat text?",
      answer: "To ensure a highly responsive experience and prevent browser freezing or running out of system memory, we have set a safe client-side threshold of 10,000 repetitions. This is more than sufficient for almost all content generation and testing needs!"
    },
    {
      id: 3,
      question: "What repetition spacing settings are available?",
      answer: "You can repeat text with four distinct modes: 'Repeat by line' (multiplies text with a fresh newline between items), 'Repeat continuously' (fuses them back-to-back), 'Repeat with space' (separated by a standard space character), or 'Custom separator' where you specify your preferred delimiter like a comma, slash, or emoji."
    },
    {
      id: 4,
      question: "Does TextRepeater save or store my text?",
      answer: "No, absolutely not. Like all tools on TextToolkitHub, Text Repeater functions with a strict privacy-first framework. All operations execute strictly within your local browser window. Your text data is never sent to our servers or stored anywhere."
    }
  ];

  // Title and Meta Description optimization
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

    // Schema JSON-LD FAQ Registration
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

    const scriptId = "text-repeater-json-ld";
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

  // Compute repeated output
  const generateRepeatedOutput = (): string => {
    if (!inputText) return '';
    const validCount = Math.max(1, Math.min(10000, repeatCount));
    
    let delimiter = '';
    if (repeatMode === 'line') {
      delimiter = '\n';
    } else if (repeatMode === 'space') {
      delimiter = ' ';
    } else if (repeatMode === 'custom') {
      delimiter = customSeparator;
    }

    const items = Array(validCount).fill(inputText);
    return items.join(delimiter);
  };

  const repeatedOutput = generateRepeatedOutput();

  // Metric calculation helper functions
  const countWords = (textBlock: string): number => {
    const trimmed = textBlock.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).filter(w => w.length > 0).length;
  };

  const originalStats = {
    chars: inputText.length,
    words: countWords(inputText)
  };

  const repeatedStats = {
    chars: repeatedOutput.length,
    words: countWords(repeatedOutput)
  };

  // Actions
  const handleLoadSample = () => {
    saveToHistory();
    setInputText('Double-tap to test patterns! ⭐');
    setRepeatCount(100);
    setRepeatMode('line');
  };

  const saveToHistory = () => {
    setHistory({
      text: inputText,
      count: repeatCount,
      mode: repeatMode,
      sep: customSeparator
    });
  };

  const handleUndo = () => {
    if (!history) return;
    const tempText = inputText;
    const tempCount = repeatCount;
    const tempMode = repeatMode;
    const tempSep = customSeparator;

    setInputText(history.text);
    setRepeatCount(history.count);
    setRepeatMode(history.mode);
    setCustomSeparator(history.sep);

    setHistory({
      text: tempText,
      count: tempCount,
      mode: tempMode,
      sep: tempSep
    });
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
  };

  const handleCopy = async () => {
    if (!repeatedOutput) return;
    try {
      await navigator.clipboard.writeText(repeatedOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to copy text: ', err);
    }
  };

  const handleDownload = () => {
    if (!repeatedOutput) return;
    const blob = new Blob([repeatedOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `repeated-text-${repeatCount}-times.txt`;
    document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);
  };

  const handlePresetCount = (count: number) => {
    saveToHistory();
    setRepeatCount(count);
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Related companion tools excluding text-repeater
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/text-repeater' && t.id !== 'text-repeater').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="text-repeater-page">
      {/* Dynamic Glow Accents */}
      <div className="glow-accent top-16 left-8 bg-amber-500/10"></div>
      <div className="glow-accent top-96 right-16 bg-indigo-500/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Navigation Breadcrumb Headers */}
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
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            id="breadcrumbs-category"
          >
            Converters
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-800 dark:text-slate-200">Text Repeater</span>
        </div>

        {/* Hero Header Presentation */}
        <div className="mb-8 md:mb-10 text-left">
          <div className="flex items-center gap-2 mb-2 w-fit">
            <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
              <Repeat className="w-6 h-6 text-amber-500 dark:text-amber-400" />
            </span>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-serif">
              Instant replication
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-3">
            Text <span className="font-semibold text-amber-500 dark:text-amber-400">Repeater</span>
          </h1>
          <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Duplicate words, rows, phrases, lists, or custom formatting strings continuously or by line. Fast client-side generation that is confidential and secure.
          </p>
        </div>

        {/* Sample Actions and Undo bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={handleLoadSample}
              className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition"
              id="repeater-btn-sample"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Load Sample Pattern
            </button>
            {history && (
              <button
                onClick={handleUndo}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition"
                id="repeater-btn-undo"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Undo Change
              </button>
            )}
          </div>
        </div>

        {/* Primary Interactive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* LEFT SIDE: Configuration and Input Field (7 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* 1. Input Container */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/5 transition-all duration-300">
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-sans flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  1. Input Text Source
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {originalStats.chars} Characters • {originalStats.words} Words
                </span>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Enter or paste the text you wish to repeat here..."
                className="w-full min-h-[160px] md:min-h-[180px] p-5 border-none resize-y text-slate-850 dark:text-slate-100 placeholder-slate-400 bg-transparent text-sm sm:text-base leading-relaxed focus:ring-0 focus:outline-none"
                id="repeater-textarea-input"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={handleClear}
                  disabled={!inputText}
                  className="px-3.5 py-1.5 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-xl flex items-center gap-1.5 transition text-xs font-semibold disabled:opacity-35 disabled:cursor-not-allowed"
                  id="repeater-btn-clear"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" /> Clear
                </button>
              </div>
            </div>

            {/* 2. Configuration Settings */}
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-500" /> 2. Configuration Parameters
              </h3>

              <div className="space-y-6">
                
                {/* Repetition Limit Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Repetition Count (Max 10,000)
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={repeatCount}
                      onChange={(e) => {
                        saveToHistory();
                        const val = parseInt(e.target.value);
                        setRepeatCount(isNaN(val) ? 1 : Math.min(10000, Math.max(1, val)));
                      }}
                      className="w-28 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-mono text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900 focus:border-amber-500 focus:outline-none"
                    />
                    
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {[10, 50, 100, 500, 1000].map((num) => (
                        <button
                          key={num}
                          onClick={() => handlePresetCount(num)}
                          className={`px-3 py-2 text-xs font-semibold rounded-xl border transition ${
                            repeatCount === num
                              ? 'border-amber-500 bg-amber-50/50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {num}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spacing separators Mode */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Repetition Separation Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    
                    {/* Line by Line */}
                    <button
                      onClick={() => {
                        saveToHistory();
                        setRepeatMode('line');
                      }}
                      className={`p-3.5 border rounded-2xl flex flex-col text-left transition ${
                        repeatMode === 'line'
                          ? 'border-amber-500 bg-amber-55/20 dark:bg-amber-950/20 ring-1 ring-amber-500/20'
                          : 'border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-150">Repeat by Line</span>
                      <span className="text-[10px] text-slate-400 mt-1">Inserts a newline separator (\n)</span>
                    </button>

                    {/* Continuous */}
                    <button
                      onClick={() => {
                        saveToHistory();
                        setRepeatMode('continuous');
                      }}
                      className={`p-3.5 border rounded-2xl flex flex-col text-left transition ${
                        repeatMode === 'continuous'
                          ? 'border-amber-500 bg-amber-55/20 dark:bg-amber-950/20 ring-1 ring-amber-500/20'
                          : 'border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-150">Repeat Continuously</span>
                      <span className="text-[10px] text-slate-400 mt-1">Fused together back-to-back</span>
                    </button>

                    {/* Space */}
                    <button
                      onClick={() => {
                        saveToHistory();
                        setRepeatMode('space');
                      }}
                      className={`p-3.5 border rounded-2xl flex flex-col text-left transition ${
                        repeatMode === 'space'
                          ? 'border-amber-500 bg-amber-55/20 dark:bg-amber-950/20 ring-1 ring-amber-500/20'
                          : 'border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-150">Repeat with Space</span>
                      <span className="text-[10px] text-slate-400 mt-1">Inserts a white space character</span>
                    </button>

                    {/* Custom */}
                    <button
                      onClick={() => {
                        saveToHistory();
                        setRepeatMode('custom');
                      }}
                      className={`p-3.5 border rounded-2xl flex flex-col text-left transition ${
                        repeatMode === 'custom'
                          ? 'border-amber-500 bg-amber-55/20 dark:bg-amber-950/20 ring-1 ring-amber-500/20'
                          : 'border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-extrabold text-slate-850 dark:text-slate-150">Custom Separator</span>
                      <span className="text-[10px] text-slate-400 mt-1">Define your own custom token</span>
                    </button>

                  </div>
                </div>

                {/* Custom separator value field */}
                {repeatMode === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800"
                  >
                    <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                      Custom Separator String
                    </label>
                    <input
                      type="text"
                      value={customSeparator}
                      onChange={(e) => setCustomSeparator(e.target.value)}
                      placeholder="e.g. , or - or | or emojis"
                      className="w-full px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-sans text-slate-800 dark:text-slate-100 bg-transparent focus:border-amber-500 focus:outline-none"
                    />
                  </motion.div>
                )}

              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Repeated outputs display and metrics (5 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-6" id="repeater-output-col">
            
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 rounded-3xl overflow-hidden shadow-sm flex flex-col">
              
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-sans flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  3. Repeated Output Results
                </span>
                
                {/* Generated metrics badge */}
                <div className="flex gap-2.5 text-[10px] font-mono text-slate-500">
                  <span>Chars: <strong>{repeatedStats.chars}</strong></span>
                  <span>•</span>
                  <span>Words: <strong>{repeatedStats.words}</strong></span>
                </div>
              </div>

              {/* Read only generated repeated text box */}
              <div className="relative">
                <textarea
                  readOnly
                  value={repeatedOutput}
                  placeholder="The repeated output will automatically compile here in real time as you configure your inputs..."
                  className="w-full min-h-[300px] md:min-h-[352px] p-5 border-none resize-y text-slate-800 dark:text-slate-155 bg-white dark:bg-slate-950 font-mono text-xs sm:text-sm leading-relaxed focus:ring-0 focus:outline-none"
                  id="repeater-textarea-output"
                />
                
                {/* Empty State Banner overlay */}
                {!repeatedOutput && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-50/50 dark:bg-slate-950/50 pointer-events-none text-center">
                    <FileText className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                    <p className="text-sm font-semibold text-slate-400">Waiting for input...</p>
                    <p className="text-xs text-slate-400/80 mt-1">Insert wording on the left to review instantaneous multiplication output.</p>
                  </div>
                )}
              </div>

              {/* Bottom toolbar for copying and downloading files */}
              <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                


                {/* Copy repeatable parameters output */}
                <button
                  onClick={handleCopy}
                  disabled={!repeatedOutput}
                  className={`px-5 py-2.5 rounded-xl flex items-center gap-1.5 text-xs font-extrabold tracking-wide transition-all duration-200 shadow-sm disabled:opacity-35 disabled:cursor-not-allowed ${
                    copied 
                      ? 'bg-emerald-600 border border-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                      : 'bg-amber-500 hover:bg-amber-600 text-white dark:bg-amber-600 dark:hover:bg-amber-700'
                  }`}
                  id="repeater-btn-copy"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied Repeated Text!
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

        {/* Informative Editorial Copy Sections */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Section A: What is text repeating and usecases */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 font-sans">Composition Testing</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Why use an online Text Repeater?
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                In interface engineering, software testing, and content generation, having access to arbitrary sets of repeating text datasets is extremely useful. You can evaluate layout boundaries, mock scroll heights, stress-test storage limits, or format structured code inputs with complete accuracy in one click.
              </p>
              <p>
                Manually entering words hundreds of times represents massive human utility noise. Our high-velocity <strong>Text Repeater</strong> takes any phrase or individual digit and multiplies them up to 10,000 times safely inside milliseconds.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">
              How the local compiler runs
            </h3>
            <ul className="text-sm list-decimal pl-5 space-y-2 leading-relaxed">
              <li>Input any sequence of alphanumeric characters, symbols, and sentences.</li>
              <li>Toggle your desired repetition count safely up to 10,000 counts.</li>
              <li>Select separator spacing: newline format, space dividers, back-to-back, or a custom token.</li>
              <li>Instantly review character and word totals, copy values, or save a standard .txt file.</li>
            </ul>
          </div>

          {/* Section B: Feature checklists */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500">Benchmark Details</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Text Repeater Key Features
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Millisecond Execution</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Multiplies text blocks up to 10,000 times natively without complex engine delays.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-880 dark:text-slate-200">Custom Intermediates</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Divide rows by carriage breaks, commas, dashes, bullet dots, or specific symbols.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-880 dark:text-slate-200">Pristine Security</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Evaluates entirely inside browser state. Your secret drafts never traverse the web.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-880 dark:text-slate-200">Text File Exporters</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Save repeating characters to a standard text document directly with one click.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-amber-50/20 dark:bg-amber-955/20 rounded-2xl border border-amber-100/40 dark:border-amber-900/45 text-xs leading-relaxed">
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">✓ Smart Boundary Protection:</span>
              To prevent locking browser loops and keeping memory profiles small, counts are bound, optimizing processing metrics smoothly.
            </div>
          </div>

        </section>

        {/* FAQ Accordion Details */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Detailed insights on how TextToolkitHub replicates custom input fields.
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
                    id={`text-repeater-faq-item-${faq.id}`}
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
                className="group border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`repeater-related-card-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-amber-500 dark:group-hover:text-amber-400 text-sm transition-colors duration-200 flex items-center justify-between">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-amber-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mt-4 block">
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
