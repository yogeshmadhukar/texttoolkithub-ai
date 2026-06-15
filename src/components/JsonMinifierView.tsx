import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  FileJson,
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  Download,
  AlertCircle,
  Zap,
  Percent,
  Database,
  ArrowDownWideNarrow,
  Sparkles,
  RefreshCw,
  Terminal,
  FileCode,
  FileDown
} from 'lucide-react';

interface JsonMinifierViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface MinifierStats {
  originalSize: number; // in bytes
  minifiedSize: number; // in bytes
  reductionPercent: number; // size reduction %
  isValid: boolean;
}

export default function JsonMinifierView({ onNavigateToTool, onNavigateHome }: JsonMinifierViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<{ message: string; line?: number } | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  // Stats
  const [stats, setStats] = useState<MinifierStats>({
    originalSize: 0,
    minifiedSize: 0,
    reductionPercent: 0,
    isValid: false
  });

  // Synced scroll references for input/output text areas
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputLinesRef = useRef<HTMLDivElement>(null);
  const outputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const outputLinesRef = useRef<HTMLDivElement>(null);

  const inputLineCount = inputText.split('\n').length;
  const outputLineCount = outputText ? outputText.split('\n').length : 1;

  const handleInputScroll = () => {
    if (inputTextAreaRef.current && inputLinesRef.current) {
      inputLinesRef.current.scrollTop = inputTextAreaRef.current.scrollTop;
    }
  };

  const handleOutputScroll = () => {
    if (outputTextAreaRef.current && outputLinesRef.current) {
      outputLinesRef.current.scrollTop = outputTextAreaRef.current.scrollTop;
    }
  };

  // SEO Configurations
  const seoTitle = "JSON Minifier Online | Compress JSON Data";
  const seoDescription = "Compress and minify JSON instantly. Reduce file size while maintaining valid JSON structure. Real-time compression metrics, instant syntax checking, and local client-only privacy.";

  const faqs = [
    {
      id: 1,
      question: "What is JSON minification?",
      answer: "JSON minification is the process of removing all unnecessary whitespace, carriage returns, tabs, and comments (if any) from a JSON dataset. This results in a fully dense single-line string that contains the exact same data but occupies significantly less bandwidth during transfer."
    },
    {
      id: 2,
      question: "How is the compression or size reduction computed?",
      answer: "We count the exact bytes of your unminified JSON string as the 'Original Size' (where 1 character equals 1 byte in UTF-8). After removing spaces and line-breaks, we compute the 'Minified Size'. The reduction percentage is calculated as: ((Original Size - Minified Size) / Original Size) * 100."
    },
    {
      id: 3,
      question: "Will minifying JSON break my code structure?",
      answer: "No! Our JSON minifier parses and validates your JSON specification strictly against RFC-8259 before compressing it. This guarantees that your JSON objects, arrays, and keys remain syntactically sound and ready to be decoded by any backend parser or client-side JSON.parse() command."
    },
    {
      id: 4,
      question: "Is raw code processed online on any external server?",
      answer: "Never! Your security is a rigid principle of our suite. All syntax validation and character-stripping calculations are done inside your browser sandbox. No file is ever sent through internet endpoints or log aggregators, making it fully safe for production tokens and API configurations."
    }
  ];

  // Set up Page Title, Meta, and FAQ JSON-LD schema
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

    const scriptId = "json-minifier-json-ld";
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

  // Sync scrolling on text changes
  useEffect(() => {
    handleInputScroll();
  }, [inputText]);

  useEffect(() => {
    handleOutputScroll();
  }, [outputText]);

  // Main processing logic
  const processMinify = (rawInput: string) => {
    if (!rawInput.trim()) {
      setOutputText('');
      setValidationError(null);
      setStats({ originalSize: 0, minifiedSize: 0, reductionPercent: 0, isValid: false });
      return;
    }

    try {
      // 1. Strict RFC validation parsing
      const parsed = JSON.parse(rawInput);
      setValidationError(null);

      // 2. Heavy compression (No formatting spacing)
      const minified = JSON.stringify(parsed);
      setOutputText(minified);

      // 3. Compute metric differences (Safe byte conversion)
      const origBytes = new Blob([rawInput]).size;
      const miniBytes = new Blob([minified]).size;
      const savedPercent = origBytes > 0 ? parseFloat((((origBytes - miniBytes) / origBytes) * 100).toFixed(2)) : 0;

      setStats({
        originalSize: origBytes,
        minifiedSize: miniBytes,
        reductionPercent: savedPercent,
        isValid: true
      });

    } catch (err: any) {
      setOutputText('');
      const errorMsg = err.message || "Invalid JSON syntax";
      let errorLine: number | undefined = undefined;

      // Pinpoint lines
      const posMatch = errorMsg.match(/position (\d+)/i);
      if (posMatch) {
         const pos = parseInt(posMatch[1], 10);
         const slice = rawInput.substring(0, pos);
         errorLine = slice.split('\n').length;
      } else {
         const lineMatch = errorMsg.match(/line (\d+)/i);
         if (lineMatch) {
           errorLine = parseInt(lineMatch[1], 10);
         }
      }

      setValidationError({
        message: errorMsg,
        line: errorLine
      });

      const origBytes = new Blob([rawInput]).size;
      setStats({
        originalSize: origBytes,
        minifiedSize: 0,
        reductionPercent: 0,
        isValid: false
      });
    }
  };

  // Run automatically on text input triggers (real-time compression)
  useEffect(() => {
    processMinify(inputText);
  }, [inputText]);

  const loadExampleJson = () => {
    const sample = {
      "product": "TextToolkitHub Minifier",
      "utility": "JSON Compression Engine",
      "authorizedCode": true,
      "statistics": {
        "overheadBytes": 1420,
        "nestedObjectCount": 8,
        "redundantSpacesCleared": ["tabs", "carriage_returns", "newlines"]
      },
      "metaTags": {
        "indexable": true,
        "robots": "follow, index"
      }
    };
    setInputText(JSON.stringify(sample, null, 4));
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setValidationError(null);
    setStats({ originalSize: 0, minifiedSize: 0, reductionPercent: 0, isValid: false });
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.warn("Copy operation failed: ", err);
    });
  };

  const handleDownload = () => {
    if (!outputText) return;

    try {
      const blob = new Blob([outputText], { type: 'application/json;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = "minified.json";
      anchor.style.display = 'none';

      // Crucial: Stop click event propagation to avoid routing interception
      anchor.onclick = (e) => {
        e.stopPropagation();
      };

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.warn("Failed to download minified JSON:", err);
    }
  };

  // Format Helper for bytes output
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300 min-h-screen py-6 px-4 md:px-8 font-sans">
      {/* breadcrumb path */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
          <button 
            id="json-minifier-bc-home"
            onClick={onNavigateHome} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button 
            id="json-minifier-bc-developer"
            onClick={() => onNavigateToTool('tools')} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Developer Tools
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-400">JSON Minifier</span>
        </div>

        {/* main header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="json-minifier-back-btn"
              onClick={onNavigateHome}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow"
              title="Back home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <ArrowDownWideNarrow className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                JSON Minifier & Compressor
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Instantly compress structural JSON payloads. Strip unwanted gutters, space offsets, and tabs securely.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="json-minifier-example-btn"
              onClick={loadExampleJson}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-950/80 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Complex Example
            </button>
            <button
              id="json-minifier-clear-top-btn"
              onClick={handleClear}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Clear Inputs
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Section columns */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div id="json-minifier-stat-original" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Original Size</div>
            <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
              {formatBytes(stats.originalSize)}
            </div>
          </div>
        </div>

        <div id="json-minifier-stat-compressed" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Minified Size</div>
            <div className="text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-0.5">
              {formatBytes(stats.minifiedSize)}
            </div>
          </div>
        </div>

        <div id="json-minifier-stat-reduction" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-500 dark:text-emerald-400">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Size Reduction</div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              {stats.reductionPercent > 0 ? `-${stats.reductionPercent}%` : '0%'}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Main body container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
        
        {/* Input Block */}
        <div id="json-minifier-input-card" className="flex flex-col bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[460px]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Raw JSON Input
              </h2>
            </div>
            
            <div className="flex items-center gap-2.5 text-slate-400 text-xs font-mono">
              <span>Lines: {inputLineCount}</span>
              {inputText && (
                <button
                  id="json-minifier-input-erase"
                  onClick={() => setInputText('')}
                  className="hover:text-rose-500 transition-colors flex items-center gap-1 font-semibold pl-2 border-l border-slate-200 dark:border-slate-850"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden min-h-[380px] bg-white dark:bg-[#0e131f]">
            {/* Line numbers Column */}
            <div 
              ref={inputLinesRef}
              className="w-12 text-right pr-3 pl-1 py-4 bg-slate-50/70 dark:bg-slate-900/10 text-slate-300 dark:text-slate-650 font-mono text-xs select-none border-r border-slate-100 dark:border-slate-850/40 overflow-hidden leading-[1.62]"
            >
              {Array.from({ length: Math.max(inputLineCount, 1) }).map((_, idx) => (
                <div key={idx} className="h-[1.62rem]">{idx + 1}</div>
              ))}
            </div>

            <textarea
              id="minifier-raw-textarea"
              ref={inputTextAreaRef}
              onScroll={handleInputScroll}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste uncompressed formatted JSON text...\nExample:\n{\n  "beautified": true,\n  "compressionReady": true\n}`}
              className="flex-1 outline-none border-none p-4 font-mono text-xs text-slate-700 dark:text-slate-300 bg-transparent resize-none leading-[1.62] h-full overflow-y-auto block whitespace-pre"
              spellCheck="false"
            />
          </div>

          {/* Real-time Syntax errors overlay */}
          {validationError ? (
            <div id="json-minifier-error-footer" className="p-3 bg-rose-50 dark:bg-rose-950/20 border-t border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Syntax Error detected:</span> {validationError.message}
                {validationError.line && (
                  <span className="ml-1.5 px-2 py-0.5 bg-rose-100 dark:bg-rose-900/50 font-semibold rounded text-[10px]">
                    Near Line {validationError.line}
                  </span>
                )}
              </div>
            </div>
          ) : inputText.trim() ? (
            <div id="json-minifier-valid-footer" className="p-3 bg-emerald-50 dark:bg-emerald-950/25 border-t border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-450 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span className="font-bold">Valid & compression ready!</span>
            </div>
          ) : null}
        </div>

        {/* Output Compressed block */}
        <div id="json-minifier-output-card" className="flex flex-col bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[460px]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Minified Output
              </h2>
            </div>
            
            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
              1 Line compressed string
            </span>
          </div>

          <div className="flex-1 flex overflow-hidden min-h-[380px] bg-slate-100/30 dark:bg-[#0c0f16]">
            {/* Output line number, which always minifies to 1 line, or stays blank */}
            <div 
              ref={outputLinesRef}
              className="w-12 text-right pr-3 pl-1 py-4 bg-slate-150/10 dark:bg-slate-950/20 text-slate-300 dark:text-slate-700 font-mono text-xs select-none border-r border-slate-100 dark:border-slate-850/20 overflow-hidden"
            >
              <div className="h-[1.62rem]">1</div>
            </div>

            <textarea
              id="minified-json-textarea"
              ref={outputTextAreaRef}
              onScroll={handleOutputScroll}
              readOnly
              value={outputText}
              placeholder="Compressed minified string will automatically appear here..."
              className="flex-1 outline-none border-none p-4 font-mono text-xs text-slate-700 dark:text-slate-310 bg-transparent resize-none leading-[1.62] h-full overflow-y-auto block select-all whitespace-pre-wrap break-all"
            />
          </div>

          {/* Controls Footer */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
              No API • Client Safe
            </span>

            <div className="flex items-center gap-2">
              <button
                id="json-minifier-copy-bottom"
                disabled={!outputText}
                onClick={handleCopy}
                className={`text-xs px-4 py-2 rounded-lg font-bold border flex items-center gap-1.5 transition-all ${
                  !outputText
                    ? 'bg-slate-100 dark:bg-slate-850 border-slate-205 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy Result'}
              </button>

              <button
                id="json-minifier-download-bottom"
                disabled={!outputText}
                onClick={handleDownload}
                className={`text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  !outputText
                    ? 'bg-slate-100 dark:bg-slate-850/55 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white shadow shadow-indigo-600/10'
                }`}
              >
                <Download className="w-4 h-4" />
                Download JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guide/Capabilities Card Section */}
      <div className="max-w-7xl mx-auto mt-12 bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-505" />
          Compression Instructions & Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800 pb-6 mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-sans">Why Minify Your JSON Strings?</h3>
            <p className="leading-relaxed">
              When serving dynamic contents, JSON documents naturally contain massive amounts of indent offsets, carriage returns, margins, and layout whitespace. While these spaces are crucial for local developers, they add heavy byte overhead when delivered over wireless APIs. Minified strings speed up packet roundtrips, reduce cloud data billing, and lower computing metrics.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-sans">Strict Client-Side Validation</h3>
            <p className="leading-relaxed">
              We process everything micro-milliseconds locally in client RAM without pinging any external databases. Our minifier immediately highlights invalid bracket coordinates, trailing arrays limits, quote mistakes, or key-value parameters mismatches—saving you valuable diagnostic time before production pipeline submissions.
            </p>
          </div>
        </div>

        {/* Dynamic FAQ Accordions */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map(faq => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                className="border border-slate-150 dark:border-slate-800 p-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
                onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{faq.question}</h4>
                  <span className="text-slate-400">
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
                {isExpanded && (
                  <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed max-w-5xl">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
