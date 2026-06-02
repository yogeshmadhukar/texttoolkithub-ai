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
  AlertCircle,
  Download,
  ShieldCheck,
  FileDigit,
  Skull
} from 'lucide-react';

interface Base64DecoderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function Base64DecoderView({ onNavigateToTool, onNavigateHome }: Base64DecoderViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Settings
  const [autoCleanSpacings, setAutoCleanSpacings] = useState(true);
  const [decodeAsUtf8, setDecodeAsUtf8] = useState(true);

  // SEO Parameters
  const seoTitle = "Base64 Decoder Online Free - Convert Base64 back to Text";
  const seoDescription = "Decode Base64 strings instantly and convert them back into readable text. Free privacy-first online tool with live validation and error check.";

  const faqs = [
    {
      id: 1,
      question: "What is Base64 Decoding?",
      answer: "Base64 decoding is the exact inverse of Base64 encoding. It interprets groups of four ASCII printable symbols (6 bits each) from an encoded stream of characters and reconstructs them into their original 8-bit byte representations, transforming unreadable Base64 characters back into standard text or binary files."
    },
    {
      id: 2,
      question: "How do I identify if a string is encoded in Base64?",
      answer: "Base64 encoded strings typically consist strictly of alphanumeric characters (A-Z, a-z, 0-9), along with plus signs (+), forward slashes (/), and are often padded with one or two equals signs (=) at the end. They also have lengths that are multiples of 4 (unless padding has been stripped)."
    },
    {
      id: 3,
      question: "What causes 'Invalid Base64 sequence' errors?",
      answer: "This error is thrown when the decoding engine encounters characters outside the standard Base64 alphabet (such as spaces, tabs, dashes, or special characters), or when the string's length is structurally malformed. Enabling our 'Auto-clean Spacing & Newlines' feature can automatically trim out line breaks and whitespaces from email copies or code snippets before parsing, bypassing common layout alignment issues."
    },
    {
      id: 4,
      question: "Why should I choose the 'Decode as UTF-8' setting?",
      answer: "Standard legacy browser decoding engines (`atob`) decode characters into simple 8-bit Latin-1 representations. If your original text contained multi-byte characters like emojis, accented letters, or non-English alphabets, it would display corrupted symbol text. By enabling UTF-8 parsing, we properly translate raw bytes back to modern Unicode symbols cleanly."
    },
    {
      id: 5,
      question: "Is it safe to decode passwords or sensitive JSON payloads here?",
      answer: "Absolutely. All processing occurs locally in your device's browser memory context. No backend connection is invoked, ensuring your sensitive credentials, API keys, or JWT tokens are never sent to any external server."
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

    const scriptId = "base64-decoder-json-ld";
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

  // Live decoding controller
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setValidationError(null);
      return;
    }

    try {
      let cleaned = inputText;

      // 1. Spacing and Carriage-return cleaning if matching the configuration
      if (autoCleanSpacings) {
        cleaned = cleaned.replace(/\s+/g, '');
      }

      // Check for illegal characters in Base64 alphabet: [^A-Za-z0-9+/=_-]
      // We accept both standard (+) and URL-safe (-) variations
      const normalizedBase64 = cleaned
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      // Check if candidate string matches length structures without being flat invalid
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(normalizedBase64)) {
        setValidationError("Warning: Input contains characters not found in standard Base64 alphabet (A-Z, a-z, 0-9, +, /, =). Check for extra spaces, non-ASCII text, or symbol breaks.");
      } else {
        setValidationError(null);
      }

      // Restore padding if stripped
      let padded = normalizedBase64;
      while (padded.length % 4 !== 0) {
        padded += '=';
      }

      // Perform actual Decode Operation
      const binaryString = atob(padded);
      
      let decoded = '';
      if (decodeAsUtf8) {
        // UTF-8 conversion mapping to avoid corrupted foreign bytes/emojis
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        decoded = new TextDecoder('utf-8').decode(bytes);
      } else {
        decoded = binaryString;
      }

      setOutputText(decoded);
    } catch (err: any) {
      console.warn("Base64 Decode Error:", err);
      setOutputText('');
      setValidationError(`Error: Unable to decode input. Please make sure the string is a valid Base64 encoded format. (${err.message || 'Invalid sequence'})`);
    }
  }, [inputText, autoCleanSpacings, decodeAsUtf8]);

  // Actions
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`VGV4dFRvb2xraXRIdWI6IFB1cmUgY2xpZW50LXNpZGUgcHJpdmFjeS4g8J+bofKSpark\nbGVzXQpVUkw6IGh0dHBzOi8vdGV4dHRvb2xraXRodWIuY29tL3Rvb2xzL2Jhc2U2NC1l\nbmNvZGVyCktleSBQYXJhbWV0ZXJzOgotIFN0YW5kYXJkIFJGQyA0NjQ4Ci0gU2FmZSBV\nUkwgZW5jb2RpbmcKLSBGYXN0IG9mZmxpbmUgVFhUIGRvd25sb2Fkcw==`);
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText });
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
    setOutputText('');
    setValidationError(null);
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
      console.warn('Unable to copy output:', err);
    }
  };

  const handleDownloadTxt = () => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'base64_decoded_output.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('File generation error:', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Exclude current tool from relates list
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/base64-decoder').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 animate-fade-in" id="base64-decoder-page">
      {/* Dynamic ambient background glow sparkles */}
      <div className="glow-accent top-20 right-10"></div>
      <div className="glow-accent bottom-20 left-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 animate-fade-in">
        
        {/* Navigation Breadcrumbs Accordion */}
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
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Base64 Decoder</span>
        </div>

        {/* Title Header Row Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Unlock className="w-7 h-7 text-indigo-600" />
              </span>
              Base64 Decoder Online Free
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Convert Base64-encoded character arrays, parameter tokens, or text streams back into original, human-readable UTF-8 text formats instantly.
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

        {/* Dynamic Mockup of Search Listing Snippet (SERP) */}
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
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/base64-decoder</span>
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

        {/* Options Configurations Dashboard Panel */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
              <Sliders className="w-4 h-4 text-indigo-500" /> Advanced Decoding Configurations
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Adjust parsing algorithms to handle non-ASCII letters or spacing symbols smoothly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Control: Auto trim spacings */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 dark:text-slate-400 font-sans">Sanitize Inputs</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={autoCleanSpacings}
                  onChange={(e) => setAutoCleanSpacings(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Auto-clean spaces & layout lines
              </label>
            </div>

            {/* Control: Decode with UTF8 decoder */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 dark:text-slate-400 font-sans">Encoding Standard</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-100 transition">
                <input
                  type="checkbox"
                  checked={decodeAsUtf8}
                  onChange={(e) => setDecodeAsUtf8(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Decode as UTF-8 (Unicode & Emojis)
              </label>
            </div>

            {/* Strategy definition blocks */}
            <div className="p-3.5 bg-indigo-50/45 dark:bg-slate-900/40 border border-indigo-100/40 dark:border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
              <Settings className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-200 block">Parsing Mode:</span>
                {decodeAsUtf8 ? 'UTF-8 is active. Multibyte characters, localized alphabets, and symbols are decoded flawlessly.' : 'Standard Latin-1 (classical ASCII maps only).'}
              </div>
            </div>

          </div>
        </div>

        {/* Real-time Workspace Panels Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* BASE64 ENCODED INPUT */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-indigo-650 bg-indigo-600 rounded-full"></span> Base64 Input String
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Sample Base64 Block
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Paste your Base64 encoded string sequence here (e.g. SGVsbG8gV29ybGQ=)..."
                className="w-full p-5 min-h-[250px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-mono tracking-wide leading-relaxed break-all"
                id="base64-decoder-input-textarea"
                aria-label="Base64 encoded input"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>

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

          {/* DECODED OUTPUT RESULT */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Human-Readable Text Output
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 font-sans">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Decoded Live
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <div className="p-5 min-h-[250px] flex flex-col justify-between">
                
                {/* Live validation notification & error check block */}
                {validationError && (
                  <div className="flex items-start gap-2.5 p-3.5 mb-3 bg-rose-500/10 dark:bg-rose-950/25 border border-rose-200 dark:border-rose-900 rounded-2xl text-xs text-rose-700 dark:text-rose-300 select-none animate-in fade-in duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>{validationError}</div>
                  </div>
                )}
                
                {outputText ? (
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Decoded text strings will render live..."
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full h-[180px] border-0 outline-none text-base text-emerald-700 dark:text-emerald-450 bg-transparent resize-none font-sans leading-relaxed"
                    id="base64-decoder-output-textarea"
                    aria-label="Raw decoded text output string"
                  />
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic block my-auto text-center font-sans">
                    {validationError ? (
                      <span className="text-rose-450 flex items-center justify-center gap-1.5">
                        <Skull className="w-4 h-4 text-rose-500" /> Output blocked due to character encoding format fault.
                      </span>
                    ) : (
                      "Your standard ASCII converted text strings will render live here..."
                    )}
                  </span>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-3 items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Output Length: <strong className="text-slate-700 dark:text-slate-200">{outputText.length}</strong>
                </span>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={handleDownloadTxt}
                    disabled={!outputText}
                    className="px-3 py-2 border border-slate-200 dark:border-slate-800 hover:border-slate-350 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1 cursor-pointer transition"
                    title="Download output as simple .txt format layout"
                    id="btn-download-txt"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-500" /> Save as TXT
                  </button>

                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer font-sans ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/25 dark:text-indigo-400'}`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Text!
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

        </div>

        {/* LONG-FORM INFORMATION SECTIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
          
          {/* Column 1: Background explanations */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">Developer Handbook</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              What is Base64 Format Encoding?
            </h2>
            <div className="space-y-4 font-sans">
              <p>
                Base64 is a generalized binary-to-text formatting protocol defined by standard <strong>RFC 4648</strong>. Systems historically designed to route standard characters and messages (such as SMTP mail servers, XML parameters, or web forms) often corrupt raw binary data because specific bytes act as control signals.
              </p>
              <p>
                By chunking raw byte sequences into clean, non-interpreted visual ASCII representations using an alphabet of 64 characters (<code>A-Z</code>, <code>a-z</code>, <code>0-9</code>, <code>+</code>, <code>/</code>, and padding <code>=</code>), Base64 ensures data gets sent, routed, and retrieved across platforms with absolute zero structural decay.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Common Validation Issues Encountered
            </h3>
            <div className="space-y-3 font-sans">
              <p>When unescaping code sequences, look out for common layout bugs:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Broken Spacing Formatting:</strong> Emails or forum boxes will automatically include spaces, line breaks, or margin tabs. Check 'Auto-clean spaces' to trim these automatically in the viewport.</li>
                <li><strong>URL Safe Conversions:</strong> Some links utilize the modified websafe parameters (replacing <code>+</code> and <code>/</code> with <code>-</code> and <code>_</code>). We seamlessly auto-detect these URL safe layouts.</li>
                <li><strong>Stripped Padding Marks:</strong> Handlers sometimes discard trailing <code>=</code> characters. Our smart unescaper automatically appends standard padding lengths to prevent structural error throws.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: User Actionable Steps */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">Step-by-Step Directions</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How to Safely Decode Base64 Text
            </h2>
            <div className="space-y-4 font-sans">
              <p>Converting values is fast, intuitive, and secure:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Insert Encoded String</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Paste target characters (like <code>Y29kZQ==</code>) inside the left viewport input area.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs text-indigo-600">Dynamic Error Checking</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The engine automatically highlights parsing abnormalities or unrecognized alphabet characters instantly in the alert sub-menu.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Extract Sanitized Text</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Instantly copy converted UTF-8 string, or download it as a dedicated <code>base64_decoded_output.txt</code> file layout with a single click.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Privacy-First Security Mandate
            </h3>
            <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-505/20 rounded-2xl flex items-start gap-3 text-xs tracking-wide">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-800 dark:text-emerald-350 block">100% Offline Parsing Guard:</strong>
                TextToolkitHub is an isolated sandbox workspace. Your API tokens, password strings, and JSON objects do not exit your local computer instance.
              </div>
            </div>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto font-sans">
            <div className="text-center mb-12 animate-fade-in">
              <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked FAQ Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Curious about UTF-8 translations, layout breaks, or security protections? Let's clarify.
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
                    id={`base64-faq-item-${faq.id}`}
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

        {/* Cohesive Companion Tools layout shelves */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800 font-sans">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6 font-medium">
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
