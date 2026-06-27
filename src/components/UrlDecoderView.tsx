import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Unlock, 
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
  AlertCircle
} from 'lucide-react';

interface UrlDecoderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function UrlDecoderView({ onNavigateToTool, onNavigateHome }: UrlDecoderViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Advanced configurations
  const [decodePlusAsSpace, setDecodePlusAsSpace] = useState<boolean>(true);
  const [stripQueryString, setStripQueryString] = useState<boolean>(false);

  // SEO Parameters
  const seoTitle = "URL Decoder Online Free – Extract Percent-Encoded Strings";
  const seoDescription = "Decode percent-encoded URLs and escaped web parameters instantly online. Revert %20 to spaces, %3A to colons, and safely extract plain readable text.";

  const faqs = [
    {
      id: 1,
      question: "What is URL Decoding?",
      answer: "URL decoding (often referred to as Percent-Decoding) is the reverse operation of URL encoding. It scans a Uniform Resource Identifier (URI) or parameterized string for dynamic percent sequences (such as %20 or %3D) and translates them back to their standard UTF-8 characters so they are fully readable to humans and databases."
    },
    {
      id: 2,
      question: "How does Percent Hex-Notation Translation function?",
      answer: "When standard parsers find a percent symbol (%) closely followed by two hexadecimal digits, they isolate that pairing as a base-16 numerical character code reference (e.g., %2B represents the plus character '+', while %3A translates to the colon ':'). The decoder translates that block back into printable ASCII or Unicode strings."
    },
    {
      id: 3,
      question: "Why should I toggle 'Decode Plus signs (+) as Spaces'?",
      answer: "Under historical HTML form-encoding definitions (MIME type application/x-www-form-urlencoded), space variables are habitually compressed and passed as plus signs (+) instead of standard %20 percentages. Activating our optional toggle translates both representations back to legible spaces."
    },
    {
      id: 4,
      question: "Are there security risks when decoding URLs with this tool?",
      answer: "None. All input parses entirely client-side inside your local browser script environment. We collect no logs, parse no credentials, and transmit no analytics values back to any remote analytics array, guaranteeing 100% total data privacy."
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

    const scriptId = "url-decoder-json-ld";
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

  // Live decoding logic
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setErrorText(null);
      return;
    }

    try {
      setErrorText(null);
      let parsed = inputText;

      // Conditional Step: Strip Query String parameters if selected
      if (stripQueryString) {
        const questionMarkIndex = parsed.indexOf('?');
        if (questionMarkIndex !== -1) {
          parsed = parsed.substring(0, questionMarkIndex);
        }
      }

      // Conditional Step: Address Plus Signs as standard spaces
      if (decodePlusAsSpace) {
        parsed = parsed.replace(/\+/g, '%20');
      }

      // Perform actual system decoding
      const decoded = decodeURIComponent(parsed);
      setOutputText(decoded);
    } catch (err) {
      setOutputText('');
      setErrorText(err instanceof Error ? err.message : 'Invalid URI syntax. Check that the source text does not hold isolated percent (%) tokens without the correct trailing 2-digit hexadecimal notation.');
    }
  }, [inputText, decodePlusAsSpace, stripQueryString]);

  // Handle operation states
  const handleLoadSample = () => {
    saveToHistory();
    setInputText('https%3A%2F%2Fblog.example.com%2Fsearch%3Fcategory%3Dseo-optimization%26user%3Djohn%2Bdoe%26status%3Dlive%2520stream');
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText });
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
      console.warn('Unable to copy output: ', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Find related companion tools excluding URL decoder
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/url-decoder' && t.id !== 'url-decoder').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="url-decoder-page">
      {/* Dynamic graphic glow accents */}
      <div className="glow-accent top-16 left-12"></div>
      <div className="glow-accent bottom-36 right-16"></div>

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
          <span className="text-indigo-600 dark:text-indigo-400">URL Decoder</span>
        </div>

        {/* Header Block Column */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Unlock className="w-7 h-7 text-indigo-600" />
              </span>
              URL Decoder Online Free
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Revert percent-escaped codes, spaces, or query parameters back to clean readable plain text instantly. All operations run 100% locally.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-indigo-550" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Dynamic SEO SERP Snippet Preview */}
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
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5 font-mono">
                <span>https://texttoolkithub.com/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/url-decoder</span>
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

        {/* Configuration Panel Grid */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" /> Decode Execution Presets
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Custom configure how hex notations or dynamic HTTP query parameters are extracted.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Control: Decode Plus signs */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Pluses Toggle</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-55 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={decodePlusAsSpace}
                  onChange={(e) => setDecodePlusAsSpace(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Decode '+' signs back to spaces
              </label>
            </div>

            {/* Control: Strip query parameters */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">URL Query Stripper</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-55 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={stripQueryString}
                  onChange={(e) => setStripQueryString(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Strip trailing URL query arguments
              </label>
            </div>

            {/* Instruction Context notes block */}
            <div className="p-3.5 bg-indigo-50/40 dark:bg-slate-900/40 border border-indigo-100/40 dark:border-slate-800 rounded-2xl flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
              <Settings className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-755 dark:text-slate-350 block">Active Status:</span>
                Uses custom JavaScript routines preserving nested query paths and UTF-8 escape coordinates properly.
              </div>
            </div>

          </div>
        </div>

        {/* Workspace Panels Split Layout Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* ENCODED INPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> Escaped Percent-Encoded Input Text
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Escaped URL Sample
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Paste escaped URL parameter content here (e.g., https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Durl%2520decoder)..."
                className="w-full p-5 min-h-[220px] border-0 outline-none text-base text-slate-800 dark:text-slate-105 bg-transparent resize-y font-mono leading-relaxed"
                id="url-decoder-input-textarea"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Input characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>

                <div className="flex items-center gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-650 hover:text-slate-850 dark:text-slate-350 dark:hover:text-white flex items-center gap-0.5 cursor-pointer"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore Input
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-35 cursor-pointer"
                    id="btn-clear"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DECODED OUTPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Readable Plain Text Output
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Decoded Live
              </span>
            </div>

            <div className={`border bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300 ${errorText ? 'border-rose-300 focus-within:border-rose-450' : 'border-slate-200 dark:border-slate-800 focus-within:border-emerald-500'}`}>
              <div className="p-5 min-h-[220px] flex flex-col justify-between">
                {errorText ? (
                  <div className="flex items-start gap-2.5 p-4 bg-rose-50/50 dark:bg-rose-955/20 border border-rose-100 dark:border-rose-900/30 rounded-2xl text-xs text-rose-650 dark:text-rose-400 select-none">
                    <AlertCircle className="w-4 h-4 text-rose-550 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-rose-800 dark:text-rose-300">Decode Malformed Error:</strong>
                      {errorText}
                    </div>
                  </div>
                ) : outputText ? (
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Readable plain text will appear here..."
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full h-[162px] border-0 outline-none text-base text-emerald-700 dark:text-emerald-400 bg-transparent resize-none font-mono leading-relaxed"
                    id="url-decoder-output-textarea"
                  />
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic block my-auto text-center font-sans">
                    Decoded readable outcomes revert live here instantly...
                  </span>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium">
                  Output characters: <strong className="text-slate-700 dark:text-slate-200">{outputText.length}</strong>
                </span>

                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className={`px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/25 dark:text-indigo-400'}`}
                  id="btn-copy"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied Text!
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

        {/* LONG-FORM SEO ARTICLES & CODES DESCRIPTIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
          
          {/* Column 1: Explanatory background details */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">Protocol Handbooks</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              What is URL Decoding and How Does it Function?
            </h2>
            <div className="space-y-4">
              <p>
                When a web address or query parameter transfers over standard gateways, it passes through an initial encoding translation to prevent system errors. <strong className="font-bold">URL Decoding</strong> is the vital reverse action. It interprets incoming escaped symbols (for instance, converting <code>%2F</code> back to a slash element <code>/</code>, or <code>%3F</code> back to query starters <code>?</code>) so databases, routers, and users can work with readable values.
              </p>
              <p>
                Without proper decoding parsing routines, nested text fields or custom redirection paths passed into APIs can crash site routes. For instance, putting raw parameter symbols into query blocks like <code>target=https://myhost.com</code> forces web parsers to misidentify parameter components. Encoding this to <code>target%3Dhttps%253A%252F%252Fmyhost.com</code> secures route compliance, which we then safely decode back.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Key URL Decoding Rules & Percent-Escape Lists
            </h3>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Hexadecimal Identifiers:</strong> Resolves standard percentage markers closely followed by 2-digit alphanumeric codes (e.g. <code>%20</code> maps to regular spaces).</li>
              <li><strong>UTF-8 Character Support:</strong> Seamlessly reconstructs multibyte accented representations (for example, interpreting <code>%C3%B1</code> back to <code>ñ</code> properly).</li>
              <li><strong>Safe Parsing Guards:</strong> Isolates malformed code notation structures to protect browser tabs from crashes.</li>
            </ul>
          </div>

          {/* Column 2: Step-by-Step Operation Guide */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">Operations Handbooks</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How to Decipher Encoded Web URLs Locally
            </h2>
            <div className="space-y-4">
              <p>Decoding your custom URL strings or browser addresses with our tool requires three elementary steps:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Insert or Paste Encoded Parameters</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Copy the escaped web address, parameterized script string, or query block directly into our raw input area.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Verify Advanced Formatting Options</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Define if plus characters (+) should be translated to standard spaces, or trigger the cleanup checkbox to strip trailing query parameter chains completely.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Extract Clean Decoded Content</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Click the copy button to capture translated plaintext output securely into your local clipboard buffer.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Unencoded Characters Range
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              According to RFC 3986 guidelines, characters in the unescaped range (such as capital letters <code>A</code> to <code>Z</code>, digits, or hyphen symbols <code>-</code> and <code>_</code>) never demand custom hexadecimal coding. They bypass translation entirely.
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
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans">
                Additional questions regarding trailing parameters, ASCII standards, or decoding constraints answered below.
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
                    id={`url-decoder-faq-item-${faq.id}`}
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
