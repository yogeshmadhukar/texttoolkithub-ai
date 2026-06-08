import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Type, 
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
  Download,
  Info,
  CheckCircle,
  Hash,
  RefreshCcw,
  BookOpen
} from 'lucide-react';

interface CaseConverterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type CaseMode = 'lower' | 'upper' | 'sentence' | 'title' | 'capitalized' | 'alternating' | 'inverse';

export default function CaseConverterView({ onNavigateToTool, onNavigateHome }: CaseConverterViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeMode, setActiveMode] = useState<CaseMode>('sentence');
  const [history, setHistory] = useState<{ input: string; mode: CaseMode } | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO Info
  const seoTitle = "Case Converter Tool Online";
  const seoDescription = "Convert text to uppercase, lowercase, sentence case, title case and more instantly.";

  const CASE_MODES_META = [
    { id: 'sentence', label: 'Sentence case', desc: 'Capitalizes the first character of each sentence.' },
    { id: 'lower', label: 'lowercase', desc: 'Converts all characters to lowercase.' },
    { id: 'upper', label: 'UPPERCASE', desc: 'Converts all characters to uppercase.' },
    { id: 'title', label: 'Title Case', desc: 'Capitalizes key words (except minor prepositions).' },
    { id: 'capitalized', label: 'Capitalized Case', desc: 'Capitalizes every single word.' },
    { id: 'alternating', label: 'aLtErNaTiNg cAsE', desc: 'Alternates uppercase and lowercase letters.' },
    { id: 'inverse', label: 'iNvErSe CaSe', desc: 'Flips each character\'s existing casing.' },
  ] as const;

  const faqs = [
    {
      id: 1,
      question: "How does the Sentence Case conversion work?",
      answer: "Sentence case formats your writing for natural reading. It first lowers the entire block, then capitalizes the very first letter of sentences. It matches characters starting directly after key end punctuation marks like periods (.), question marks (?), and exclamation points (!)."
    },
    {
      id: 2,
      question: "What is the difference between Title Case and Capitalized Case?",
      answer: "Capitalized Case capitalizes the starting letter of absolutely every word. Title Case is more refined; it ignores minor function words such as conjunctions and standard short prepositions ('and', 'or', 'the', 'of', 'to', 'for') unless they begin or end a line, adhering strictly to editorial publishing guidelines."
    },
    {
      id: 3,
      question: "What is Alternating Case used for?",
      answer: "Alternating Case (often written as 'aLtErNaTiNg CaSe') is predominantly used in internet culture, social media memes, and forum posts to signify sarcasm, mockery, or playful tone."
    },
    {
      id: 4,
      question: "Is my pasted content secure?",
      answer: "100% secure. Because TextToolkitHub operates client-side inside your local browser tab, your text data is never sent to external servers, APIs, or databases. The editing and conversion process happens completely on your machine."
    },
    {
      id: 5,
      question: "Does the converter change punctuation marks or special symbols?",
      answer: "No. Only standard alphabetical characters (A-Z, a-z) have their case tags transformed. Special symbols, numeric digits, commas, and punctuation marks remain completely unaltered."
    }
  ];

  // Dynamic SEO Setup & Schema JSON-LD FAQ/Metadata Injection
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

    const scriptId = "case-converter-json-ld";
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

  // Algorithms
  const toSentenceCase = (str: string): string => {
    if (!str) return '';
    const lower = str.toLowerCase();
    // Capitalize character starting sentences or after punctuation (.!?) followed by space
    return lower.replace(/(^\s*|[.!?]\s+)([a-z0-9])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  };

  const toTitleCase = (str: string): string => {
    if (!str) return '';
    const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'with', 'about', 'as'];
    const words = str.toLowerCase().split(/(\s+)/); // Keep spaces intact
    return words.map((word, index) => {
      if (word.trim() === '') return word;
      const cleanWord = word.replace(/[^a-zA-Z0-9']/g, '');
      const isFirstOrLast = index === 0 || index === words.length - 1;
      if (!isFirstOrLast && minorWords.includes(cleanWord)) {
        return word; // Keep minor words lowercase
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
  };

  const toCapitalizedCase = (str: string): string => {
    if (!str) return '';
    const words = str.toLowerCase().split(/(\s+)/);
    return words.map(word => {
      if (word.trim() === '') return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
  };

  const toAlternatingCase = (str: string): string => {
    if (!str) return '';
    let counter = 0;
    return str.split('').map(char => {
      if (/[a-zA-Z]/.test(char)) {
        const uppercase = counter % 2 === 1;
        counter++;
        return uppercase ? char.toUpperCase() : char.toLowerCase();
      }
      return char; // Protect formatting spaces/symbols
    }).join('');
  };

  const toInverseCase = (str: string): string => {
    if (!str) return '';
    return str.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    }).join('');
  };

  const runConversion = (text: string, mode: CaseMode): string => {
    if (!text) return '';
    switch (mode) {
      case 'upper':
        return text.toUpperCase();
      case 'lower':
        return text.toLowerCase();
      case 'sentence':
        return toSentenceCase(text);
      case 'title':
        return toTitleCase(text);
      case 'capitalized':
        return toCapitalizedCase(text);
      case 'alternating':
        return toAlternatingCase(text);
      case 'inverse':
        return toInverseCase(text);
      default:
        return text;
    }
  };

  // Convert inputs dynamically on mode or input text shifts
  useEffect(() => {
    setOutputText(runConversion(inputText, activeMode));
  }, [inputText, activeMode]);

  // Operations Handlers
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`discover NEW casing patterns. WE assist COPYWRITERS, developers and students from ALL around the globe! this is sentence-level text. have an awesome day.`);
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, mode: activeMode });
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
    setOutputText('');
  };

  const handleUndo = () => {
    if (history) {
      const prevInput = inputText;
      const prevMode = activeMode;
      setInputText(history.input);
      setActiveMode(history.mode);
      setHistory({ input: prevInput, mode: prevMode });
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to copy conversion results: ', err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    try {
      const element = document.createElement('a');
      const file = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(file);
      element.href = url;
      element.download = `case_converter_${activeMode}.txt`;
      document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 150);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.warn('Unable to export text: ', err);
    }
  };

  const handleModeToggle = (mode: CaseMode) => {
    saveToHistory();
    setActiveMode(mode);
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Quick stats
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const sentenceCount = inputText.trim() ? inputText.split(/[.!?]+/).filter(Boolean).length : 0;

  // Find related tools excluding case converter
  const relatedTools = TOOLS.filter(t => t.id !== 'case-converter' && t.id !== 'tools/case-converter').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="case-converter-page">
      {/* Dynamic decoration glows */}
      <div className="glow-accent top-12 left-10"></div>
      <div className="glow-accent top-[400px] right-20"></div>

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
          <span className="text-indigo-600 dark:text-indigo-400">Case Converter</span>
        </div>

        {/* Master Heading */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Type className="w-7 h-7 text-indigo-550" />
              </span>
              Case Converter Tool
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Instantly toggle texts between UPPERCASE, lowercase, sentence case, title case, capitalization modes and more. Correct mistaken Caps Lock keys instantly.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Hide SEO Preview' : 'Show Google Rank Preview'}
          </button>
        </div>

        {/* SEO Rank Preview Block */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Live Google Rank Preview
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/case-converter
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

        {/* Casing Options Selection Panel */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-955/40 p-6 mb-8 shadow-sm">
          <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block mb-4">
            Select Capitalization Rule
          </span>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {CASE_MODES_META.map((modeMeta) => {
              const matchesActive = activeMode === modeMeta.id;
              return (
                <button
                  key={modeMeta.id}
                  onClick={() => handleModeToggle(modeMeta.id)}
                  className={`p-3.5 rounded-2xl text-xs font-bold transition-all flex flex-col justify-between text-left border cursor-pointer ${
                    matchesActive 
                      ? 'bg-indigo-600 text-white border-transparent shadow-[0_4px_16px_-4px_rgba(79,70,229,0.3)] scale-[1.02]' 
                      : 'bg-white hover:bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-350 dark:hover:border-slate-700'
                  }`}
                  id={`mode-selector-btn-${modeMeta.id}`}
                >
                  <span className="truncate">{modeMeta.label}</span>
                  <span className={`text-[9px] font-medium leading-normal mt-2 block ${matchesActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {matchesActive ? '✓ Selected' : 'Convert'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Master Workspace Split Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* INPUT PORTAL */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-550 rounded-full"></span> Raw Input Text
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5" /> Load Draft Demo
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Type, write or paste your documents here. The case toggling operations will synchronize instantly..."
                className="w-full p-5 min-h-[350px] md:min-h-[440px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="case-converter-input"
              />

              {/* Input details footer */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex gap-4">
                  <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>
                  <span>Words: <strong className="text-slate-700 dark:text-slate-200">{wordCount}</strong></span>
                  <span>Sentences: <strong className="text-slate-700 dark:text-slate-200">{sentenceCount}</strong></span>
                </div>
                
                <div className="flex items-center gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-650 hover:text-slate-850 dark:text-slate-350 dark:hover:text-white flex items-center gap-0.5"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Undo Action
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-35 cursor-pointer"
                    id="btn-clear"
                  >
                    Clear Text
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT PORTAL */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Converted Output
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Casing Synced
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <textarea
                value={outputText}
                readOnly
                placeholder="Transformed outcomes will render instantly depending on chosen Case rules..."
                className="w-full p-5 min-h-[350px] md:min-h-[440px] border-0 outline-none text-base text-slate-700 dark:text-slate-250 bg-slate-50/20 dark:bg-slate-900/10 resize-y font-sans leading-relaxed"
                id="case-converter-output"
              />

              {/* Output Actions controls */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-400 font-medium">
                  Active Mode: <strong className="text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">{activeMode}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={!outputText}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-650 hover:text-slate-850 dark:text-slate-300 dark:hover:text-white rounded-xl transition disabled:opacity-35 flex items-center gap-1 text-xs font-bold cursor-pointer"
                    id="btn-download"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloaded ? 'Downloaded!' : 'Download .txt'}
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`px-4.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/20 dark:text-indigo-400'}`}
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

        {/* DETAILED USAGE GUIDE AND COHESIVE OUTLINE */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Guide pillar */}
          <div id="usage-handbook">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550 flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" /> Operational Manual
            </span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Everything You Need to Know About Case Conversions
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                When typing reports, coding parameters, compiling essays, or reviewing emails, it is easy to leave the Caps Lock key toggled on by mistake, or end up with a chaotic block of misaligned uppercase and lowercase words copied from online PDFs.
              </p>
              <p>
                Our professional <strong>Case Converter</strong> offers deep structural casing algorithms that translate messy paragraphs into standard structures. Perfect for authors, technical programmers, marketers, and students trying to align with standard style rules (such as APA, MLA, or Chicago formats).
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">
              Quick Step-by-Step Instructions:
            </h3>
            <ul className="text-sm list-decimal pl-5 space-y-2.5 leading-relaxed">
              <li><strong>Import:</strong> Drag, paste, or type your raw draft draft directly into the left side textarea.</li>
              <li><strong>Select Mode:</strong> Click any of the top 7 styling preset cards (Sentence case, UPPERCASE, Title Case, etc.) to trigger formatting rules instantly.</li>
              <li><strong>Live Check:</strong> The right side output window will update instantly as you change text or swap modes.</li>
              <li><strong>Save Output:</strong> Copy the text to your clipboard with a single click, or download it formatted as a `.txt` file onto your device.</li>
            </ul>
          </div>

          {/* Definitions and Benefits pillar */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Formatting Cheat-Sheet</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Casing Rules Explained
            </h2>

            <div className="space-y-4 text-xs leading-relaxed">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Sentence Case</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Converts the entire text into lowercase, then capitalizes the first letter of each sentence. Ideal for standard readable prose.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Title Case</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Capitalizes major words while keeping prepositions, coordinating conjunctions, and articles ('for', 'to', 'in', 'and') lowercase. Recommended for blog headings.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Inverse Case & Alternating Case</h4>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Inverse flips the current casing status of every letter (A ⇄ a). Alternating offsets uppercase and lowercase bounds repeatedly (aLtErNaTiNg) for sarcastic internet speak.</p>
              </div>
            </div>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-550 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Get helpful details about spelling, capitalization rules, and text compatibility.
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
                    id={`case-converter-faq-item-${faq.id}`}
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

        {/* Related Tools Selection */}
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
