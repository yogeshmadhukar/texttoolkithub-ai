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

interface HtmlDecoderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function HtmlDecoderView({ onNavigateToTool, onNavigateHome }: HtmlDecoderViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationInfo, setValidationInfo] = useState<string | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Advanced configurations
  const [decodeMode, setDecodeMode] = useState<'smart' | 'strict'>('smart');
  const [entitiesCount, setEntitiesCount] = useState(0);

  // SEO Parameters
  const seoTitle = "HTML Decoder Tool Online - Safe Entity Unescaper";
  const seoDescription = "Decode HTML entities back into readable HTML code instantly. Convert &amp;lt;, &amp;gt;, &amp;amp; and safe numeric unicode sequences in real-time with our free client-side tool.";

  const faqs = [
    {
      id: 1,
      question: "What is HTML Decoding?",
      answer: "HTML decoding is the reverse of HTML encoding. It parses textual representations of reserved code strings (such as '&lt;', '&gt;', or '&amp;quot;') and converts them back into their literal symbol equivalents (such as '<', '>', or '\"'). This restores the original HTML tags, code constructs, and strings."
    },
    {
      id: 2,
      question: "How does the 'Smart Browser Decoding' engine work?",
      answer: "The 'Smart Browser Decoding' preset leverages the browser's built-in sandbox HTML parser. By parsing inputs safely client-side, it natively unescapes every standard character entity, decimal entity (like '&#60;'), and hexadecimal entity (like '&#x3C;') that the browser understands, with no external server involvement."
    },
    {
      id: 3,
      question: "What is the 'Brute-force Strict Map Only' decoding preset?",
      answer: "This preset runs a highly controlled regex filter that converts ONLY the five core HTML entities: '&amp;amp;', '&amp;lt;', '&amp;gt;', '&amp;quot;', and '&amp;#39;' (plus '&#x27;'). It leaves all other Unicode characters, foreign letters, currency formats, and auxiliary entity elements completely untouched in their encoded output shape."
    },
    {
      id: 4,
      question: "Are my secure inputs uploaded or sent to any endpoints?",
      answer: "Never! TextToolkitHub is built strictly on privacy-first offline-capable foundations. All unescaping algorithms and string replacements operate directly in the javascript engine of your local device browser. No network payloads or telemetry profiles are ever created."
    },
    {
      id: 5,
      question: "What happens if I try to decode malicious code tags?",
      answer: "Because our decoder prints outputs inside a secure plain-text textarea, any decoded HTML tags (including nested <script> blocks) remain strictly static strings and are never executed as active scripts in your browser workspace. It is fully secure."
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

    const scriptId = "html-decoder-json-ld";
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

  // Strict Decoder Dictionary (Leaves other symbols untouched)
  const strictEntityMap: { [key: string]: string } = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x26;': '&',
    '&#x3C;': '<',
    '&#x3E;': '>',
    '&#x22;': '"',
  };

  // Live decoding controller
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setEntitiesCount(0);
      setValidationInfo(null);
      return;
    }

    // Count entities present in the input: matches something like &name; or &#123; or &#xabc;
    const matches = inputText.match(/&[#a-zA-Z0-9]+;/g);
    const count = matches ? matches.length : 0;
    setEntitiesCount(count);

    if (count === 0) {
      setValidationInfo("Information: No obvious HTML entity patterns (&amp;, &lt;, etc.) were found in your text. The text will pass through unchanged.");
    } else {
      setValidationInfo(null);
    }

    let decoded = '';

    if (decodeMode === 'strict') {
      // Decode only core elements strictly inside the map
      decoded = inputText.replace(/&[#a-zA-Z0-9]+;/g, (match) => {
        // Normalize match keys to handle case-insensitive or exact standard comparisons
        const normalized = match.toLowerCase();
        
        // Exact match check
        if (strictEntityMap[match]) {
          return strictEntityMap[match];
        }
        if (strictEntityMap[normalized]) {
          return strictEntityMap[normalized];
        }
        return match;
      });
    } else {
      // Smart Browser Decoding via DOMParser
      try {
        if (typeof window !== 'undefined' && window.DOMParser) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(inputText, 'text/html');
          decoded = doc.body.textContent || doc.documentElement.textContent || '';
        } else {
          // Fallback if DOMParser is unavailable
          decoded = inputText.replace(/&[#a-zA-Z0-9]+;/g, (match) => {
            const normalized = match.toLowerCase();
            if (strictEntityMap[match]) return strictEntityMap[match];
            if (strictEntityMap[normalized]) return strictEntityMap[normalized];
            return match;
          });
        }
      } catch (err) {
        console.error("DOMParser error: ", err);
        decoded = inputText;
      }
    }

    setOutputText(decoded);
  }, [inputText, decodeMode]);

  // Actions
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`&lt;!-- Escaped HTML layout sample --&gt;\n&lt;div class=&quot;container shadow&quot; id=&quot;profile-badge&quot;&gt;\n  &lt;h2 class=&quot;text-xl font-bold text-slate-800&quot;&gt;User Info &amp;amp; Stats&lt;/h2&gt;\n  &lt;p&gt;Copyright &amp;copy; 2026 TextToolkitHub &amp;trade;. All rights reserved.&lt;/p&gt;\n  &lt;span class=&quot;tag&quot;&gt;Level &#x26;#x32;&#x26;#x30; &amp;#128640;&lt;/span&gt;\n&lt;/div&gt;`);
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText });
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
    setOutputText('');
    setEntitiesCount(0);
    setValidationInfo(null);
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

  // Exclude current tool from relates list
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/html-decoder').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 animate-fade-in" id="html-decoder-page">
      {/* Dynamic graphic glow accents */}
      <div className="glow-accent top-20 right-10"></div>
      <div className="glow-accent bottom-20 left-10"></div>

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
          <span className="text-indigo-600 dark:text-indigo-400">HTML Decoder</span>
        </div>

        {/* Header Block Column */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Unlock className="w-7 h-7 text-indigo-600" />
              </span>
              HTML Decoder Tool Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Convert escaped HTML entities, unicode decimal, and hexadecimal representations back into clean readable HTML code instantly and 100% privately.
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
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/html-decoder</span>
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

        {/* Configuration Panel Grid */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
              <Sliders className="w-4 h-4 text-indigo-500" /> Decoding Engine Architecture Presets
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Decoded text renders instantly in real-time. Choose whether to unescape all characters natively or strictly target the core alignment symbols.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Control: Decoding Engine */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 dark:text-slate-400 font-sans">Decoding Mechanism</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDecodeMode('smart')}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    decodeMode === 'smart'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-slate-800/80 dark:text-indigo-400 dark:border-indigo-500/50'
                      : 'border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                  id="engine-smart-btn"
                >
                  Smart Browser Decodes
                </button>
                <button
                  onClick={() => setDecodeMode('strict')}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    decodeMode === 'strict'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-slate-800/80 dark:text-indigo-400 dark:border-indigo-500/50'
                      : 'border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                  id="engine-strict-btn"
                >
                  Strict Core Symbols Only
                </button>
              </div>
            </div>

            {/* Config Status Info Block */}
            <div className="p-3.5 bg-indigo-50/45 dark:bg-slate-900/40 border border-indigo-100/40 dark:border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
              <Settings className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-200 block">Active Strategy:</span>
                {decodeMode === 'smart' 
                  ? 'Decodes every browser-compliant entity automatically (including emojis, non-ASCII letters, copyright indicators, and mathematical markup).'
                  : 'Triggers a focused filter replacing only standard core tags (&lt;, &gt;, &amp;, &quot;, &#39;). Keeps symbols like &copy; or &trade; intact in original markup details.'
                }
              </div>
            </div>

          </div>
        </div>

        {/* Workspace Panels Split Layout Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* RAW ENCODED INPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> Encoded HTML Entities Input
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Sample HTML Entities
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Paste your escaped HTML code tokens here (e.g. &amp;lt;h1&amp;gt;Hello World&amp;lt;/h1&amp;gt;)..."
                className="w-full p-5 min-h-[250px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-mono leading-relaxed"
                id="html-decoder-input-textarea"
                aria-label="Encoded HTML input"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex gap-4">
                  <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>
                  <span>Entities Detected: <strong className="text-indigo-600 dark:text-indigo-400">{entitiesCount}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-0.5 cursor-pointer font-sans"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore Input
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-450 hover:text-rose-600 rounded-lg transition disabled:opacity-35 cursor-pointer font-sans"
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
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Decoded HTML Output
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 font-sans">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Decoded Live
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <div className="p-5 min-h-[250px] flex flex-col justify-between">
                {validationInfo && (
                  <div className="flex items-start gap-2.5 p-3.5 mb-3 bg-indigo-50/50 dark:bg-slate-900 border border-indigo-100/60 dark:border-slate-800 rounded-2xl text-xs text-indigo-700 dark:text-indigo-300 select-none">
                    <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>{validationInfo}</div>
                  </div>
                )}
                
                {outputText ? (
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Readable code tags will display here..."
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full h-[180px] border-0 outline-none text-base text-emerald-700 dark:text-emerald-450 bg-transparent resize-none font-mono leading-relaxed"
                    id="html-decoder-output-textarea"
                    aria-label="Decoded HTML output"
                  />
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic block my-auto text-center font-sans">
                    Your unescaped layout strings and codes will display live here...
                  </span>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium">
                  Output length: <strong className="text-slate-700 dark:text-slate-200">{outputText.length}</strong>
                </span>

                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className={`px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer font-sans ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/25 dark:text-indigo-400'}`}
                  id="btn-copy"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied Code!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Decoded Result
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
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">Developer Handbook</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              What is HTML Entity Decoding?
            </h2>
            <div className="space-y-4 font-sans">
              <p>
                HTML entity decoding is the critical inverse operations cycle of HTML escaping. While encoders transform structural syntax elements like <code>&lt;</code> and <code>&gt;</code> into non-runnable visual symbols to isolate them from layout rendering passes, decoders read these safe tokens and re-establish their original raw source code.
              </p>
              <p>
                For example, converting a piece of code text containing <code>&amp;amp;lt;div&amp;amp;gt;</code> translates back to <code>&lt;div&gt;</code> which your IDE, code editors, or browser tags engine can now parse natively.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Primary Use Cases for Unescaping HTML Entities
            </h3>
            <div className="space-y-3 font-sans">
              <p>Typical scenarios requiring robust, client-side HTML decoding:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Source Code Restoration:</strong> Converting HTML examples pasted from tutorials, forums, or PDFs back into runnable development code.</li>
                <li><strong>Debugging Encoded Database Outages:</strong> Parsing raw data payloads retrieved from storage arrays that were escaped by back-end middleware before transmission.</li>
                <li><strong>API Payload Sanitization:</strong> Inspecting raw JSON fields containing character strings formatted in numeric, unicode, or hex styles.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: Step-by-Step Operation Guide */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">User Instructions</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How To Use the HTML Decoder Tool
            </h2>
            <div className="space-y-4 font-sans">
              <p>Trimming your escaped text blocks back into compliant code blocks is straightforward:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Pasted Encoded Inputs</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Paste or drag text containing markup entities (e.g., <code>&amp;amp;lt;</code>, <code>&amp;amp;copy;</code>, <code>&amp;amp;#x3C;</code>) inside the left workspace editor panel.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Set Unescaping Preset</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Toggle 'Smart Browser Decodes' for full entity-range translations, or select 'Strict Core Symbols Only' to map only the five foundational format markers.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Extract Cleansed Results</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instantly grab the unescaped code snippets via the Copy button, styled elegantly using our eye-safe responsive layouts.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Entity Conversion Mappings Reference
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse border border-slate-200 dark:border-slate-800 rounded-xl">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900">
                    <th className="border border-slate-200 dark:border-slate-800 p-2 text-left font-sans text-slate-550">Entity String</th>
                    <th className="border border-slate-200 dark:border-slate-800 p-2 text-left font-sans text-slate-550">Alternate Decimal</th>
                    <th className="border border-slate-200 dark:border-slate-800 p-2 text-left font-sans text-slate-550">Decoded Character</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;amp;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2">&amp;#38;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&amp; (Ampersand)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;lt;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2">&amp;#60;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&lt; (Less-Than)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;gt;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2">&amp;#62;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&gt; (Greater-Than)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;quot;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2">&amp;#34;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&quot; (Double Quote)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;#39;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2">&amp;#39;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&#39; (Single Quote)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white font-sans">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans">
                Curious about local safety parameters, multi-byte encoding thresholds, or strict text representations? Let's clarify.
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
                    id={`html-decoder-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
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

        {/* Companion Tools Layout Shelf */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800 font-sans">
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
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between">
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
