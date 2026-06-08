import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Eraser, 
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
  RefreshCw, 
  Scissors,
  Wrench,
  CheckCircle,
  FileText,
  Info
} from 'lucide-react';

interface RemoveSpecialCharactersViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type PreservationMode = 'all' | 'letters-only' | 'letters-numbers-only' | 'custom';

export default function RemoveSpecialCharactersView({ onNavigateToTool, onNavigateHome }: RemoveSpecialCharactersViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Configuration settings
  const [removePunctuation, setRemovePunctuation] = useState<boolean>(true);
  const [removeSymbols, setRemoveSymbols] = useState<boolean>(true);
  const [removeNumbers, setRemoveNumbers] = useState<boolean>(false);
  const [preservationMode, setPreservationMode] = useState<PreservationMode>('all');
  
  // Custom characters configuration
  const [customAction, setCustomAction] = useState<'remove' | 'keep'>('remove');
  const [customCharacters, setCustomCharacters] = useState<string>('');

  // SEO parameters as requested
  const seoTitle = "Remove Special Characters Online | Free Text Cleaner";
  const seoDescription = "Remove special characters, symbols, and unwanted text instantly with our free online text cleaning tool.";

  const faqs = [
    {
      id: 1,
      question: "What counts as a 'special character' in this tool?",
      answer: "Special characters include mathematical operators (+, =, <, >), currency symbols ($, €, £, ¥), brackets/braces ((), [], {}), slashes, asterisks, hashtags (#), emojis, and various other typographical shapes. Standard punctuation (like dots, commas, exclamation marks, and hyphens) can be toggled separately."
    },
    {
      id: 2,
      question: "How does Custom Character Removal work?",
      answer: "When set to Custom Character removal, you can select whether to explicitly STRIP only the letters/symbols you specify (e.g., stripping specific accents, hash tags, or dollar signs) or to KEEP only those specified characters while wiping everything else. It renders customized text parsing exceptionally straightforward."
    },
    {
      id: 3,
      question: "Will emojis be stripped by this cleaner?",
      answer: "Yes, toggling 'Remove Symbols' automatically parses and strips common Unicode emoji matrices, including complicated multi-code sequences, custom flags, and modern graphic representations."
    },
    {
      id: 4,
      question: "Is this safe for cleaning high-security database strings or code?",
      answer: "Absolutely. Absolute sandboxed security is guaranteed since 100% of the string manipulation executes directly inside your browser's virtual memory context. No backend logs, API servers, or diagnostic scripts inspect or store your text data."
    },
    {
      id: 5,
      question: "Does this preserve standard spacing and line breaks?",
      answer: "Yes, standard spaces, tabs, and line return structures are preserved so that your paragraphs, itemized list copies, or code segments remain clean and recognizable in their relative shapes."
    }
  ];

  // Configure meta details & schema JSON-LD
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

    // Dynamic FAQ Schema injection
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

    const scriptId = "remove-special-chars-json-ld";
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

  // Sync state settings dynamically based on preset preservation matches
  useEffect(() => {
    if (preservationMode === 'letters-only') {
      setRemovePunctuation(true);
      setRemoveSymbols(true);
      setRemoveNumbers(true);
    } else if (preservationMode === 'letters-numbers-only') {
      setRemovePunctuation(true);
      setRemoveSymbols(true);
      setRemoveNumbers(false);
    } else if (preservationMode === 'all') {
      // Allow flexible toggles
      setRemoveNumbers(false);
    }
  }, [preservationMode]);

  // Main cleaning process engine
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let result = inputText;

    // 1. Check Preservation Mode presets
    if (preservationMode === 'letters-only') {
      // Only keep letters a-z/A-Z, whitespace, and newlines
      result = result.replace(/[^a-zA-Z\s]/g, '');
    } else if (preservationMode === 'letters-numbers-only') {
      // Keep letters, counts, spaces and newlines
      result = result.replace(/[^a-zA-Z0-9\s]/g, '');
    } else if (preservationMode === 'custom') {
      if (customCharacters) {
        // Build regex escape for custom list
        const escapedList = customCharacters.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        if (customAction === 'remove') {
          // Remove exact specified characters
          const regex = new RegExp(`[${escapedList}]`, 'g');
          result = result.replace(regex, '');
        } else {
          // Keep only specified custom characters AND whitespace
          const regex = new RegExp(`[^${escapedList}\\s]`, 'g');
          result = result.replace(regex, '');
        }
      }
    } else {
      // 2. Perform Standard Modular Category Filtering
      if (removeNumbers) {
        result = result.replace(/[0-9]/g, '');
      }

      if (removePunctuation) {
        // Remove common punctuation: . , ! ? : ; ' " - ( ) [ ] { } etc.
        // Keep spaces/tabs/newlines
        result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]|"'\\?<>+]/g, '');
      }

      if (removeSymbols) {
        // Strip other symbols, currency signs, maths operators, emojis
        // Punctuation is already cleared or toggled, this clears special glyphs
        // Let's use clean Unicode block filters for symbols
        result = result.replace(/[^\w\s\d.,\/#!$%\^&\*;:{}=\-_`~()\[\]|"'\\?<>+]/gu, '');
      }
    }

    setOutputText(result);
  }, [
    inputText, 
    removePunctuation, 
    removeSymbols, 
    removeNumbers, 
    preservationMode, 
    customAction, 
    customCharacters
  ]);

  // Statistics calculation helper
  const getStatistics = () => {
    const originalLength = inputText.length;
    const cleanedLength = outputText.length;
    const removedLength = Math.max(0, originalLength - cleanedLength);

    return {
      original: originalLength,
      cleaned: cleanedLength,
      removed: removedLength
    };
  };

  const statistics = getStatistics();

  const handleCopy = () => {
    if (!outputText) return;
    try {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard writing operations failed", e);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cleaned_Text_Output.txt`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      console.error("Download text file generation failed", e);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleLoadSample = () => {
    setInputText(`Hello, Admin! 🎉 Welcome to TextToolkitHub#2026. The price for premium formatting is $19.99/mo (includes +/- 5 tools!!!). Let's start cleansing! [123_abc_@_#_*]`);
  };

  return (
    <div className="relative min-h-screen bg-slate-55 dark:bg-slate-900 transition-colors duration-200" id="remove-special-chars-page">
      {/* Universal header layout standard */}
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Back to Homepage"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-indigo-650 dark:text-indigo-400 font-extrabold uppercase tracking-wider">
                <span>Text Cleaning Suite</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 font-sans normal-case">Tool</span>
              </div>
              <h1 className="text-lg font-black text-slate-950 dark:text-white font-sans tracking-tight">
                Remove Special Characters
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTool('tools')}
              className="text-xs font-bold text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Browse Directory
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Description Title */}
          <div className="text-center md:text-left mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/45 rounded-full text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Free Online Text Cleansing & Sanitizing Utility</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight leading-none">
              Remove Special Characters Online
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Strip unwanted symbols, currency math glyphs, foreign typographical signs, and custom special characters instantly while preserving basic alphanumeric characters, spaces, and line layouts cleanly.
            </p>
          </div>

          {/* Privacy Alert Box */}
          <div className="flex items-start gap-3 bg-emerald-50/30 dark:bg-slate-950/30 border border-emerald-100/30 dark:border-slate-805 rounded-2xl p-4 mb-8">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-405 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">100% Client-Side Privacy Protection</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Your character formatting, cleaning configurations, and document inputs are restricted inside your local web browser. No remote API connections carry, store, or serialize your logs or sensitive database strings.
              </p>
            </div>
          </div>

          {/* Cleaners Interactive Platform Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* IO Workspace Section */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* INPUT AREA WRAPPER */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-850 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-505" />
                    <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 uppercase tracking-widest font-mono">
                      Dirty Raw Text
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLoadSample}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-350 hover:underline"
                    >
                      Load Sample Content
                    </button>
                    {inputText && (
                      <button
                        onClick={handleClear}
                        className="p-1 px-1.5 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-rose-500 transition-all font-mono text-[10px] font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>CLEAR</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter or paste text with unwanted special characters..."
                    className="w-full min-h-[220px] max-h-[500px] p-4 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-505 dark:focus:ring-indigo-900 transition-all font-sans text-sm leading-relaxed"
                    id="remove-special-chars-input"
                  />
                  
                  {inputText && (
                    <div className="absolute bottom-3 right-3 select-none pointer-events-none text-[9.5px] font-mono text-slate-400 bg-white/80 dark:bg-slate-950/80 px-2 py-1 rounded border border-slate-200/50 dark:border-slate-800">
                      {inputText.length.toLocaleString()} raw symbols
                    </div>
                  )}
                </div>
              </div>

              {/* OUTPUT CLEANED CONTAINER */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-850 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 uppercase tracking-widest font-mono flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Clean Sanitized Copy
                  </span>

                  {outputText && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs transition duration-150 ${
                          copied 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-405 dark:border-emerald-900' 
                            : 'bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-805 dark:hover:bg-slate-800'
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Clean Result'}</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs transition duration-150 ${
                          downloaded 
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-405 dark:border-indigo-900' 
                            : 'bg-slate-50 text-slate-705 hover:text-slate-900 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-850 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloaded ? 'Downloaded' : 'Download Output'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  {outputText ? (
                    <div className="w-full min-h-[220px] max-h-[500px] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 rounded-2xl border border-emerald-100 dark:border-slate-800 font-sans text-sm whitespace-pre-wrap leading-relaxed select-text tracking-normal">
                      {outputText}
                    </div>
                  ) : (
                    <div className="w-full min-h-[220px] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center select-none">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-2">
                        <Eraser className="w-5 h-5 animate-pulse" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sanitized results appear instantly. Copy-paste some text with symbols or currencies to begin.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar Controls Layout */}
            <div className="flex flex-col gap-6">
              
              {/* STRIPPING OPTIONS SELECTOR */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-3">
                  <Wrench className="w-3.5 h-3.5 text-indigo-500" />
                  Preservation Targets
                </span>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setPreservationMode('all')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      preservationMode === 'all' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-750 dark:text-slate-305'
                    }`}
                  >
                    <span className="text-xs font-extrabold">Selective / Custom Modular Mode</span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-900 rounded border">Regular</span>
                  </button>

                  <button
                    onClick={() => setPreservationMode('letters-only')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      preservationMode === 'letters-only' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-755 dark:text-slate-305'
                    }`}
                  >
                    <span className="text-xs font-extrabold">Keep Letters Only</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50/50 dark:bg-indigo-950/40 rounded border">Preset A</span>
                  </button>

                  <button
                    onClick={() => setPreservationMode('letters-numbers-only')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      preservationMode === 'letters-numbers-only' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-755 dark:text-slate-305'
                    }`}
                  >
                    <span className="text-xs font-extrabold">Keep Letters & Numbers Only</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50/50 dark:bg-indigo-950/40 rounded border">Preset B</span>
                  </button>

                  <button
                    onClick={() => setPreservationMode('custom')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      preservationMode === 'custom' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-755 dark:text-slate-305'
                    }`}
                  >
                    <span className="text-xs font-extrabold">Specify Characters Manually</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 bg-emerald-50/30 dark:bg-emerald-950/20 rounded border">Custom</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC MODALS BASED ON SELECTION */}
              {preservationMode === 'all' && (
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                  <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-4 font-mono">
                    <Scissors className="w-3.5 h-3.5 text-indigo-500" />
                    Cleansing Switches
                  </span>

                  <div className="flex flex-col gap-4">
                    {/* TOGGLE 1 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="punc-strip-chk">
                          Strip Standard Punctuation
                        </label>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                          Removes dots, commas, exclamation points, colons, hyphens, and brackets.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        id="punc-strip-chk"
                        checked={removePunctuation}
                        onChange={(e) => setRemovePunctuation(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                      />
                    </div>

                    <hr className="border-slate-100 dark:border-slate-900" />

                    {/* TOGGLE 2 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="sym-strip-chk">
                          Strip Symbols & Emojis
                        </label>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                          Removes currency signs, math operators, hashtags (#), stars, and vector emojis.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        id="sym-strip-chk"
                        checked={removeSymbols}
                        onChange={(e) => setRemoveSymbols(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                      />
                    </div>

                    <hr className="border-slate-100 dark:border-slate-900" />

                    {/* TOGGLE 3 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="num-strip-chk">
                          Strip Numeric Characters
                        </label>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                          Erase all digit figures (0-9) from your raw input string.
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        id="num-strip-chk"
                        checked={removeNumbers}
                        onChange={(e) => setRemoveNumbers(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* CUSTOM CHARACTER ACTIONS ACCORDION */}
              {preservationMode === 'custom' && (
                <div className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                  <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider block mb-3 font-mono">
                    Custom Character Rules
                  </span>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800 mb-2">
                      <button
                        onClick={() => setCustomAction('remove')}
                        className={`flex-1 text-center py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          customAction === 'remove' 
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Strip These Characters
                      </button>
                      <button
                        onClick={() => setCustomAction('keep')}
                        className={`flex-1 text-center py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                          customAction === 'keep' 
                            ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        Keep Only These
                      </button>
                    </div>

                    <label className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400">
                      Enter specific letters / symbols with no spaces:
                    </label>
                    <input
                      type="text"
                      value={customCharacters}
                      onChange={(e) => setCustomCharacters(e.target.value)}
                      placeholder="e.g. @#$%~"
                      className="w-full text-xs p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 text-slate-905 dark:text-white focus:outline-none"
                    />
                    <p className="text-[9.5px] text-slate-400 dark:text-slate-500 leading-normal mt-1 italic">
                      Whitespace characters, returns, and tabs are preserved automatically by default so structural shapes remain intact.
                    </p>
                  </div>
                </div>
              )}

              {/* VISUAL REPORT INDICATORS */}
              <div className="bg-slate-50 dark:bg-slate-950/40 p-4 border rounded-3xl p-5">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-2">Preservation Info</span>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  {preservationMode === 'letters-only' && "Preset: High-grade literary strip. Restricts the document to pure alphabetical letters (A-Z/a-z) and workspace pacing structures."}
                  {preservationMode === 'letters-numbers-only' && "Preset: Cleanses dirty symbols, emojis, and punctuation completely, while preserving plain text characters and numeric values."}
                  {preservationMode === 'custom' && `Customized filter: Will seek to ${customAction === 'remove' ? 'remove only' : 'strip everything except'} '${customCharacters || '(none)'}'.`}
                  {preservationMode === 'all' && `Modular layout: Toggled filters will instantly strip specified brackets, emojis or numbers while protecting other values.`}
                </p>
              </div>

            </div>
          </div>

          {/* DYNAMIC STATISTICS METRIC GRID */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm mb-12">
            <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Real-Time Characters Report
            </span>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl text-center md:text-left transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 letter tracking-wider leading-none">Original Characters</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white block font-sans tracking-tight mt-1 ">{statistics.original}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl text-center md:text-left transition">
                <span className="text-[10px] uppercase font-bold text-slate-450 dark:text-slate-500 letter tracking-wider leading-none">Cleaned Output</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block font-sans tracking-tight mt-1 ">{statistics.cleaned}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl text-center md:text-left transition">
                <span className="text-[10px] uppercase font-bold text-rose-400 dark:text-rose-500 letter tracking-wider leading-none">Stripped Items</span>
                <span className={`text-2xl font-black block font-sans tracking-tight mt-1 ${statistics.removed > 0 ? 'text-rose-500' : 'text-slate-400'}`}>{statistics.removed}</span>
              </div>
            </div>
          </div>

          {/* ADSENSE INTEGRATION AD PLACEMENT PLACEHOLDER */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-2 border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-3xl">
              <Globe className="w-5 h-5 text-indigo-500 shrink-0" />
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-205">Automatic Ad Placement Container</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed mt-0.5">
                  Preallocated responsive banner area ensures seamless automatic Google AdSense compliance with absolutely zero Cumulative Layout Shift (CLS).
                </p>
              </div>
            </div>
          </div>

          {/* DETAILED FAQS & CONTENT TEXT (Prevents Thin-content rejections) */}
          <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-sans tracking-tight flex items-center gap-2 mb-2">
              <HelpCircle className="w-5.5 h-5.5 text-indigo-650" />
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl mb-6 font-sans">
              Find answers to common questions about sanitizing raw lists, filtering copywriters' text, stripping special characters, cleaning CSV metrics, and securing metadata properties completely offline.
            </p>

            <div className="space-y-4">
              {faqs.map(faq => (
                <div 
                  key={faq.id}
                  className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden transition duration-150"
                  id={`remove-special-chars-faq-item-${faq.id}`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/40 dark:bg-slate-900/30 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200 pr-4">
                      {faq.id}. {faq.question}
                    </span>
                    <span className="text-slate-400 dark:text-slate-550 shrink-0">
                      {expandedFaq === faq.id ? '–' : '+'}
                    </span>
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850">
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-850 pt-6">
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 mb-2 font-sans uppercase tracking-wider">
                Why Clean Strings & Text Content?
              </h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                When copying draft texts from OCR generators, emails, spreadsheets, PDF manuals, or custom web portals, formatting anomalies such as trailing backlashes, math parameters, non-breaking symbols, and broken punctuation often pollute the clipboard. Our tool lets you isolate specific items cleanly, creating ready-to-publish strings formatted perfectly for websites, ebooks, and blog structures.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
