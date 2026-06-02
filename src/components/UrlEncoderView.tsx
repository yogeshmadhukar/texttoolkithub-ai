import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
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
  Link,
  Unlock,
  Lock,
  ArrowRightLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface UrlEncoderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function UrlEncoderView({ onNavigateToTool, onNavigateHome }: UrlEncoderViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [history, setHistory] = useState<{ input: string; output: string; mode: 'encode' | 'decode' } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Advanced configurations
  const [encodeModeType, setEncodeModeType] = useState<'uriComponent' | 'fullUri'>('uriComponent');
  const [spaceAsPlus, setSpaceAsPlus] = useState<boolean>(false);
  const [decodePlusAsSpace, setDecodePlusAsSpace] = useState<boolean>(true);

  // SEO Parameters as requested
  const seoTitle = "URL Encoder Online Free";
  const seoDescription = "Encode URLs instantly for safe transmission on the web.";

  const faqs = [
    {
      id: 1,
      question: "What is URL Encoding?",
      answer: "URL encoding, or percent-encoding, is a standard mechanism used to translate arbitrary text or binary characters into a safe format that can be reliably transmitted over the Internet within a Uniform Resource Identifier (URI). It replaces non-ASCII or reserved characters with a percent symbol (%) followed by their corresponding two-digit hexadecimal ASCII representation (e.g., spaces are replaced by %20)."
    },
    {
      id: 2,
      question: "Why do URLs require encoding?",
      answer: "URLs can only hold characters from a limited safe set defined in RFC 3986 (alphanumeric characters, and a few symbols like '-', '_', '.', '~'). Other characters, such as spaces, accented letters (like é, ñ), emojis, or reserved control query-symbols (like '?', '&', '=', '#') can break browsers or server routers if they are not parsed correctly. Percent-encoding preserves these semantics safely."
    },
    {
      id: 3,
      question: "What is the difference between Encode URI vs Encode URI Component?",
      answer: "The 'Encode URI' option (encodeURI) assumes you are encoding a full, complete URL address. It leaves necessary query path structures untouched—such as 'http://', slashes '/', query indicators '?', and parameters '&'. 'Encode URI Component' (encodeURIComponent) is more rigorous; it encodes absolutely all non-alphanumeric characters. It is used to safe-package isolated parameters (like a dynamic website address inside a query parameter, e.g., ?target=http%3A%2F%2Fexample.com)."
    },
    {
      id: 4,
      question: "What is the '+ / %20' spacing difference?",
      answer: "In standard RFC 3986 URL specs (used in path directories), a space is always encoded as '%20'. However, under form data transmission media rules (application/x-www-form-urlencoded specs), a space is historically formatted as a plus sign '+'. Our encoder lets you configure both to align with different server requirements."
    },
    {
      id: 5,
      question: "Is my input text uploaded or processed securely?",
      answer: "We guarantee complete data confidentiality. Absolutely all string encoding, decoding, regex conversions, and error captures are executed client-side in your active browser session. No outbound web requests, logs, or analytical trackers capture your sensitive addresses."
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

    const scriptId = "url-encoder-json-ld";
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

  // Live conversion logic
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setErrorText(null);
      return;
    }

    try {
      setErrorText(null);
      if (mode === 'encode') {
        let converted = '';
        if (encodeModeType === 'uriComponent') {
          converted = encodeURIComponent(inputText);
        } else {
          converted = encodeURI(inputText);
        }

        // Apply space replacements if requested
        if (spaceAsPlus) {
          // Replace %20 with standard plus sign +
          converted = converted.replace(/%20/g, '+');
        }
        setOutputText(converted);
      } else {
        let decodingInput = inputText;
        if (decodePlusAsSpace) {
          // Replace pluses with %20 so decodeURIComponent translates them to actual space
          decodingInput = decodingInput.replace(/\+/g, '%20');
        }
        
        const decoded = decodeURIComponent(decodingInput);
        setOutputText(decoded);
      }
    } catch (err) {
      setOutputText('');
      setErrorText(err instanceof Error ? err.message : 'Malformed URI syntax. Check percent notation sequence.');
    }
  }, [inputText, mode, encodeModeType, spaceAsPlus, decodePlusAsSpace]);

  // Handle operation interactions
  const handleLoadSample = () => {
    saveToHistory();
    if (mode === 'encode') {
      setInputText('https://texttoolkithub.com/search?q=url encoder & free online tool=yes & value=hello world!');
    } else {
      setInputText('https%3A%2F%2Ftexttoolkithub.com%2Fsearch%3Fq%3Durl%20encoder%20%26%20free%20online%20tool%3Dyes%20%26%20value%3Dhello%20world%21');
    }
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText, mode });
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
    setOutputText('');
    setErrorText(null);
  };

  const handleUndo = () => {
    if (history) {
      const prevInput = inputText;
      const prevOutput = outputText;
      const prevMode = mode;
      
      setMode(history.mode);
      setInputText(history.input);
      setOutputText(history.output);
      setHistory({ input: prevInput, output: prevOutput, mode: prevMode });
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to copy output: ', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Find related tools excluding url-encoder
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/url-encoder' && t.id !== 'url-encoder').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="url-encoder-page">
      {/* Dynamic background accent elements */}
      <div className="glow-accent top-20 right-10"></div>
      <div className="glow-accent bottom-40 left-10"></div>

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
          <span className="text-indigo-600 dark:text-indigo-400">URL Encoder Decoder</span>
        </div>

        {/* Header Block Column */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Globe className="w-7 h-7 text-indigo-600" />
              </span>
              URL Encoder Online Free
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Encode or decode web addresses and path parameters instantly. Clean, private, and fully RFC 3986 compliant browser utility.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Google SERP Snippet Preview */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overscroll-none overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Live Google Search Result Page (SERP) Mockup
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-405 dark:text-slate-500 flex items-center gap-1 mb-1.5 font-mono">
                <span>https://texttoolkithub.com/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/url-encoder</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Master Selector mode selector tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 p-1 bg-slate-50 dark:bg-slate-950/60 rounded-2xl gap-2 w-fit">
          <button
            onClick={() => {
              saveToHistory();
              setMode('encode');
              const currentInput = inputText;
              setInputText(outputText);
              setOutputText(currentInput);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${mode === 'encode' ? 'bg-indigo-650 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'}`}
            id="mode-encode-tab"
          >
            <Lock className="w-3.5 h-3.5" /> Encode Mode
          </button>
          <button
            onClick={() => {
              saveToHistory();
              setMode('decode');
              const currentInput = inputText;
              setInputText(outputText);
              setOutputText(currentInput);
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${mode === 'decode' ? 'bg-indigo-650 text-white shadow-sm' : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-white'}`}
            id="mode-decode-tab"
          >
            <Unlock className="w-3.5 h-3.5" /> Decode Mode
          </button>
        </div>

        {/* Advanced Options Dashboard */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" /> Format & Safety Settings
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Configure how the encoder addresses punctuation characters, slash systems, or spacing blocks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Split Options Conditional to mode selection */}
            {mode === 'encode' ? (
              <>
                {/* Encode Type Selection option */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Character Range Mode</span>
                  <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 p-1">
                    <button
                      onClick={() => setEncodeModeType('uriComponent')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all border border-transparent cursor-pointer ${encodeModeType === 'uriComponent' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                      id="opt-encode-component"
                    >
                      URI Component (Aggressive)
                    </button>
                    <button
                      onClick={() => setEncodeModeType('fullUri')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all border border-transparent cursor-pointer ${encodeModeType === 'fullUri' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                      id="opt-encode-fulluri"
                    >
                      Full URL (Leaves / & ? safe)
                    </button>
                  </div>
                </div>

                {/* Space Handling switches */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Space Encoding Notation</span>
                  <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-55 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                    <input
                      type="checkbox"
                      checked={spaceAsPlus}
                      onChange={(e) => setSpaceAsPlus(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                    />
                    Encode Spacing as '+' (Form specs)
                  </label>
                </div>

                {/* Info block */}
                <div className="p-3.5 bg-indigo-50/40 dark:bg-slate-900/40 border border-indigo-100/40 dark:border-slate-800 rounded-2xl flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
                  <Settings className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-750 dark:text-slate-350 block">Live Spec Sync:</span>
                    {encodeModeType === 'uriComponent' 
                      ? 'Encodes even ?, &, =, # so it can be passed safely as query data arguments.' 
                      : 'Preserves fully addresses structures (leaves http, slash, query marks alone).'}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Decode plus option */}
                <div className="flex flex-col gap-2.5 col-span-2">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">URL Decoding Decoders</span>
                  <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-55 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                    <input
                      type="checkbox"
                      checked={decodePlusAsSpace}
                      onChange={(e) => setDecodePlusAsSpace(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                    />
                    Decode Plus signs (+) back to Standard Spaces
                  </label>
                </div>

                {/* Status Indicator */}
                <div className="p-3.5 bg-indigo-50/40 dark:bg-slate-900/40 border border-indigo-100/40 dark:border-slate-800 rounded-2xl flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
                  <Unlock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5 animate-pulse" />
                  <div>
                    <span className="font-bold text-slate-750 dark:text-slate-350 block">Strict Mode Parsing:</span>
                    Translates percent notations such as <code>%20</code>, <code>%3A</code>, and optional <code>+</code> strings into standard text.
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Workspace Split Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* TEXT AREA INPUT */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> 
                {mode === 'encode' ? 'Raw Address or Text for Encoding' : 'Encoded URI percent-text to decode'}
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Sample Input
              </button>
            </div>

            <div className="border border-slate-202 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder={mode === 'encode' ? "Paste here (e.g., https://example.com/search?q=hello world)..." : "Paste percent encoded string here (e.g., http%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world)..."}
                className="w-full p-5 min-h-[220px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-mono leading-relaxed"
                id="url-encoder-input-textarea"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>

                <div className="flex items-center gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-650 hover:text-slate-850 dark:text-slate-350 dark:hover:text-white flex items-center gap-0.5 cursor-pointer"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-35 cursor-pointer"
                    id="btn-clear"
                  >
                    Clear Text
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT TEXT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Converted Converted Output Result
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Live Streamed
              </span>
            </div>

            <div className={`border bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300 ${errorText ? 'border-rose-300 focus-within:border-rose-450' : 'border-slate-200 dark:border-slate-800 focus-within:border-emerald-500'}`}>
              <div className="p-5 min-h-[220px] flex flex-col justify-between">
                {errorText ? (
                  <div className="flex items-start gap-2.5 p-4 bg-rose-50/50 dark:bg-rose-950/25 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs text-rose-650 dark:text-rose-400 select-none">
                    <AlertCircle className="w-4 h-4 text-rose-550 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-rose-800 dark:text-rose-305">Compilation Conversion Error:</strong>
                      {errorText}
                    </div>
                  </div>
                ) : outputText ? (
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Result..."
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full h-[162px] border-0 outline-none text-base text-teal-700 dark:text-emerald-450 bg-transparent resize-none font-mono leading-relaxed"
                    id="url-encoder-output-textarea"
                  />
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic block my-auto text-center">
                    {mode === 'encode' ? 'Percent encoded string answers will generate online instantly...' : 'Decoded characters will revert live here...'}
                  </span>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium">
                  Result Characters: <strong className="text-slate-700 dark:text-slate-200">{outputText.length}</strong>
                </span>

                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className={`px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/25 dark:text-indigo-400'}`}
                  id="btn-copy"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Converted Result
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* LONG-FORM EDUCATIONAL SECTIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
          
          {/* Section 1: What is URL Encoding */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">Web Standards Glossary</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              What is URL Encoding?
            </h2>
            <div className="space-y-4">
              <p>
                URL encoding (widely known as <strong className="font-bold">Percent Encoding</strong>) is an Internet standard protocol specified in RFC 3986. It maps arbitrary textual symbols and characters into standard ASCII structures so they can navigate online networks without data loss.
              </p>
              <p>
                This ensures that servers and browser routers do not mistake variables parameters for actual network directory structures. For instance, putting a raw space directly inside a file link (e.g. <code>my file.pdf</code>) causes browsers to truncate transmission. Coding this as <code>my%20file.pdf</code> keeps links clean and valid.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Frequently Encoded Special Characters
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse text-left border border-slate-100 dark:border-slate-800 mt-2">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-105 dark:border-slate-800">
                    <th className="p-2 border-r border-slate-100 dark:border-slate-800">Char</th>
                    <th className="p-2 border-r border-slate-100 dark:border-slate-800">HTML Named Entity</th>
                    <th className="p-2">Hex Encoded Match</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-800 font-bold">Space</td>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-800 text-slate-450">&amp;nbsp; / +</td>
                    <td className="p-2 text-indigo-600 dark:text-indigo-400 font-bold">%20</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-800 font-bold">:</td>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-850 text-slate-450">Colon</td>
                    <td className="p-2 text-indigo-600 dark:text-indigo-400 font-bold">%3A</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-800 font-bold">/</td>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-850 text-slate-450">Forward Slash</td>
                    <td className="p-2 text-indigo-600 dark:text-indigo-400 font-bold">%2F</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-800 font-bold">?</td>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-850 text-slate-450">Question Mark</td>
                    <td className="p-2 text-indigo-600 dark:text-indigo-400 font-bold">%3F</td>
                  </tr>
                  <tr>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-800 font-bold">&amp;</td>
                    <td className="p-2 border-r border-slate-100 dark:border-slate-850 text-slate-450">Ampersand</td>
                    <td className="p-2 text-indigo-600 dark:text-indigo-400 font-bold">%26</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: How URL Encoding Works */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">Mechanics Handbook</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How URL Encoding Works
            </h2>
            <div className="space-y-4">
              <p>
                When a browser or program encounters a symbol outside of the allowed RFC 3986 range during transmission, it relies on a simple, uniform mechanism:
              </p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Convert to UTF-8 Bytes</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The non-standard character is mapped into its constituent binary UTF-8 byte representation.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Translate to Hexadecimal</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Each numeric byte matches an equivalent base-16 two-digit hexadecimal sequence.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Prefix with a Percent Symbol</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The final string is outputted with percentage marks inline, guaranteeing web crawler compatibility (such as converting <code>é</code> to <code>%C3%A9</code>).</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Reserved vs Unreserved Characters
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unreserved letters (A-Z, a-z, 0-9, and symbols <code>_</code> <code>-</code> <code>.</code> <code>~</code>) never demand encoding. Reserved punctuation (e.g. <code>?</code>, <code>#</code>, <code>/</code>, <code>@</code>) carry functional query controls; they must ONLY be encoded when they do not serve their active control purposes.
            </p>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white font-sans">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Have questions regarding query parameter transmission, RFC guidelines, or formatting rules? Browse our FAQ dashboard below.
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
                    id={`url-encoder-faq-item-${faq.id}`}
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

        {/* Companion Tools Layout Shelf */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6 font-sans">
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
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-505 dark:text-slate-450 mt-2 leading-relaxed">
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
