import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  FileCode,
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  ArrowUpRight, 
  Folder, 
  FolderOpen, 
  Code2, 
  Settings,
  AlertCircle,
  Download,
  Terminal,
  Minimize2,
  Maximize2,
  Columns,
  Eye,
  FileJson,
  Hash,
  Activity,
  FileDown
} from 'lucide-react';

interface JsonFormatterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

// Stats interface
interface JsonStats {
  charCount: number;
  objectCount: number;
  arrayCount: number;
  keyCount: number;
}

export default function JsonFormatterView({ onNavigateToTool, onNavigateHome }: JsonFormatterViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState<{ message: string; line?: number } | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [indentSize, setIndentSize] = useState<'2' | '4' | 'tab' | 'compact'>('2');
  const [viewMode, setViewMode] = useState<'formatted' | 'tree'>('formatted');
  const [globalTreeExpanded, setGlobalTreeExpanded] = useState<boolean>(true);
  
  // Line numbering heights or calculations
  const inputLineCount = inputText.split('\n').length;
  const outputLineCount = outputText.split('\n').length;

  const [stats, setStats] = useState<JsonStats>({
    charCount: 0,
    objectCount: 0,
    arrayCount: 0,
    keyCount: 0
  });

  // Synced scroll references for input/output IDE-like viewports
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputLinesRef = useRef<HTMLDivElement>(null);
  const outputPreRef = useRef<HTMLPreElement>(null);
  const outputLinesRef = useRef<HTMLDivElement>(null);

  const handleInputScroll = () => {
    if (inputTextAreaRef.current && inputLinesRef.current) {
      inputLinesRef.current.scrollTop = inputTextAreaRef.current.scrollTop;
    }
  };

  const handleOutputScroll = () => {
    if (outputPreRef.current && outputLinesRef.current) {
      outputLinesRef.current.scrollTop = outputPreRef.current.scrollTop;
    }
  };

  // SEO parameters
  const seoTitle = "JSON Formatter Online | Beautify & Validate JSON";
  const seoDescription = "Format, beautify, validate, and inspect JSON instantly with our free online JSON Formatter. Real-time syntax validation, interactive tree inspector, and local-first memory privacy.";

  const faqs = [
    {
      id: 1,
      question: "What does the JSON Formatter do?",
      answer: "Our premium JSON Formatter online utility takes raw, unformatted, or minified JSON strings and converts them into structured, beautifully formatted, human-readable representations. It validates code compliance in real time and handles indentation spacing customizable for developers."
    },
    {
      id: 2,
      question: "How does the syntax error tracking pinpoint errors?",
      answer: "When invalid JSON is pasted, the parsing engine detects structural violations—such as trailing commas, single quotes, unclosed objects, or missing colons—and calculates the approximate line number of the malfunction. It instantly highlights the exact line so you can fix it inside the IDE."
    },
    {
      id: 3,
      question: "What is the Interactive Tree Viewer?",
      answer: "Instead of just viewing static formatted JSON blocks, our tool renders a secure nested file-explorer tree of your data. You can expand or collapse nested objects and arrays inline, browse complex JSON branches with ease, and view colorized types instantly."
    },
    {
      id: 4,
      question: "Is there a file or character limit for formatting?",
      answer: "Since your JSON data is processed entirely client-side on your device's processor, there is no set system limit! It easily handles files containing thousands of lines and complex hierarchical nested structures without typical network delivery lag."
    },
    {
      id: 5,
      question: "Is my JSON data uploaded or recorded anywhere?",
      answer: "Absolutely not! Absolute privacy is the core design philosophy of our framework. None of your logs, config files, keys, or proprietary data are ever sent through API keys, remote servers, or external trackers. Everything operates within your browser secure sandbox memory."
    }
  ];

  // Initialize SEO and JSON-LD FAO Schema
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

    const scriptId = "json-formatter-json-ld";
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

  // Sync scroll on text updates
  useEffect(() => {
    handleInputScroll();
  }, [inputText]);

  useEffect(() => {
    handleOutputScroll();
  }, [outputText]);

  // JSON Analysis/Traverser for accurate statistics
  const extractStats = (value: any, rawStr: string): JsonStats => {
    let charCount = rawStr.length;
    let objectCount = 0;
    let arrayCount = 0;
    let keyCount = 0;

    const traverse = (node: any) => {
      if (node === null || typeof node !== 'object') {
        return;
      }
      if (Array.isArray(node)) {
        arrayCount++;
        node.forEach(item => traverse(item));
      } else {
        objectCount++;
        Object.keys(node).forEach(key => {
          keyCount++;
          traverse(node[key]);
        });
      }
    };

    try {
      traverse(value);
    } catch (e) {
      console.warn("Cycle detected during stats extraction:", e);
    }

    return {
      charCount,
      objectCount,
      arrayCount,
      keyCount
    };
  };

  // Perform formatting & validation automatically as user types or requests it
  const handleProcessJson = (rawInput: string) => {
    if (!rawInput.trim()) {
      setOutputText('');
      setParsedData(null);
      setValidationError(null);
      setStats({ charCount: 0, objectCount: 0, arrayCount: 0, keyCount: 0 });
      return;
    }

    try {
      // 1. Parse JSON
      const parsed = JSON.parse(rawInput);
      setParsedData(parsed);
      setValidationError(null);

      // 2. Format based on settings
      let formatted = '';
      if (indentSize === 'compact') {
        formatted = JSON.stringify(parsed);
      } else if (indentSize === 'tab') {
        formatted = JSON.stringify(parsed, null, '\t');
      } else {
        formatted = JSON.stringify(parsed, null, parseInt(indentSize, 10));
      }
      
      setOutputText(formatted);

      // 3. Extract complete stats
      const computedStats = extractStats(parsed, rawInput);
      setStats(computedStats);

    } catch (err: any) {
      setParsedData(null);
      setOutputText('');
      
      // Determine precise error line and user friendly message
      const errorMsg = err.message || "Invalid JSON format";
      let errorLine: number | undefined = undefined;

      // jsPDF / Standard browser JSON parse errors often include "at position X"
      const posMatch = errorMsg.match(/position (\d+)/i);
      if (posMatch) {
         const pos = parseInt(posMatch[1], 10);
         const slice = rawInput.substring(0, pos);
         errorLine = slice.split('\n').length;
      } else {
         // Fallback checks for common V8 / Safari errors
         const lineMatch = errorMsg.match(/line (\d+)/i);
         if (lineMatch) {
           errorLine = parseInt(lineMatch[1], 10);
         }
      }

      setValidationError({
        message: errorMsg,
        line: errorLine
      });

      // Character count stat is still valid even if parsing fails
      setStats({
        charCount: rawInput.length,
        objectCount: 0,
        arrayCount: 0,
        keyCount: 0
      });
    }
  };

  // Run on input text or indent configurations change
  useEffect(() => {
    handleProcessJson(inputText);
  }, [inputText, indentSize]);

  // Pre-load a sample JSON data snippet for user testing
  const loadExampleJson = () => {
    const demo = {
      "toolName": "JSON Formatter",
      "version": "1.0.0",
      "isOfflineSecure": true,
      "features": [
        "Interactive Tree View",
        "Line-by-line syntax error tracking",
        "Indentation Spacing Customizer",
        "Recursive data stats"
      ],
      "stats": {
        "efficiencyPercent": 100.0,
        "securityApproved": true,
        "submodules": null
      },
      "tips": "Click the node triangles in the Tree View to collapse segments dynamically."
    };
    setInputText(JSON.stringify(demo, null, 2));
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setParsedData(null);
    setValidationError(null);
    setStats({ charCount: 0, objectCount: 0, arrayCount: 0, keyCount: 0 });
  };

  const handleCopy = () => {
    const textToCopy = viewMode === 'formatted' ? outputText : JSON.stringify(parsedData, null, 2);
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.warn("Copy failed: ", err);
    });
  };

  const handleDownload = () => {
    let textToDownload = '';
    
    if (parsedData) {
      if (indentSize === 'compact') {
        textToDownload = JSON.stringify(parsedData);
      } else if (indentSize === 'tab') {
        textToDownload = JSON.stringify(parsedData, null, '\t');
      } else {
        textToDownload = JSON.stringify(parsedData, null, parseInt(indentSize, 10) || 2);
      }
    } else {
      textToDownload = outputText;
    }

    if (!textToDownload) return;

    try {
      const blob = new Blob([textToDownload], { type: 'application/json;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = "formatted.json";
      anchor.style.display = 'none';
      
      // Stop the global click interceptor in App.tsx from preventing default and routing to the blob path
      anchor.onclick = (e) => {
        e.stopPropagation();
      };
      
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.warn("Failed to download JSON:", err);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300 min-h-screen py-6 px-4 md:px-8 font-sans">
      {/* Title Breadcrumbs & Header bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
          <button 
            id="json-formatter-bc-home"
            onClick={onNavigateHome} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button 
            id="json-formatter-bc-encoding"
            onClick={() => onNavigateToTool('tools')} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Developer Tools
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-400">JSON Formatter</span>
        </div>

        {/* Back Buttons & Action Rail */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="json-formatter-back-btn"
              onClick={onNavigateHome}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow"
              title="Return Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <FileJson className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                JSON Formatter & Validator
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Format, validate, beautify, and inspect parsed JSON parameters cleanly with zero remote leakages.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="json-formatter-example-btn"
              onClick={loadExampleJson}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-950/80 transition-all flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              Load Interactive Demo
            </button>
            <button
              id="json-formatter-clear-top-btn"
              onClick={handleClear}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Counter Cards Section */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div id="json-formatter-stat-chars" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400">
            <Hash className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Char Count</div>
            <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">{stats.charCount}</div>
          </div>
        </div>

        <div id="json-formatter-stat-objects" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Object Nodes</div>
            <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">{stats.objectCount}</div>
          </div>
        </div>

        <div id="json-formatter-stat-arrays" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Array Nodes</div>
            <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">{stats.arrayCount}</div>
          </div>
        </div>

        <div id="json-formatter-stat-keys" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-500 dark:text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Keys</div>
            <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-0.5">{stats.keyCount}</div>
          </div>
        </div>
      </div>

      {/* Editor Body Panel (Double Column IDE-like layout) */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
        
        {/* Left column (Code Paste / Input Editor Container) */}
        <div id="json-formatter-input-container" className="flex flex-col bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[480px]">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <h2 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Raw JSON Input
              </h2>
            </div>
            
            <div className="flex items-center gap-3 text-slate-400 text-xs">
              <span>Lines: <strong className="font-mono text-slate-600 dark:text-slate-400">{inputLineCount}</strong></span>
              {inputText.length > 0 && (
                <button
                  id="json-formatter-clear-input"
                  onClick={() => setInputText('')}
                  className="hover:text-rose-500 transition-colors flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Erase
                </button>
              )}
            </div>
          </div>

          {/* IDE Content Area (Code and Line Column) */}
          <div className="flex-1 flex overflow-hidden min-h-[400px] relative bg-[#fff] dark:bg-[#0e131f]">
            {/* Left Gutter (Line numbers) */}
            <div 
              ref={inputLinesRef}
              className="w-12 text-right pr-3 pl-1 py-4 bg-slate-50/70 dark:bg-slate-900/20 text-slate-300 dark:text-slate-600 font-mono text-xs select-none border-r border-slate-100 dark:border-slate-850/45 overflow-hidden leading-[1.62]"
            >
              {Array.from({ length: Math.max(inputLineCount, 1) }).map((_, idx) => (
                <div key={idx} className="h-[1.62rem]">{idx + 1}</div>
              ))}
            </div>

            {/* Editing Textarea */}
            <textarea
              id="raw-json-textarea"
              ref={inputTextAreaRef}
              onScroll={handleInputScroll}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste your JSON parameters here...\nExample:\n{\n  "string": "value",\n  "array": [1, 2, 3]\n}`}
              className="flex-1 outline-none border-none p-4 font-mono text-xs text-slate-700 dark:text-slate-350 bg-transparent resize-none leading-[1.62] h-full overflow-y-auto block whitespace-pre"
              spellCheck="false"
            />
          </div>

          {/* Error and validation tracker message box */}
          {validationError ? (
            <div id="json-formatter-error-block" className="p-3 bg-rose-50 dark:bg-rose-950/20 border-t border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-450 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Syntax Invalid:</span> {validationError.message}
                {validationError.line && (
                  <span className="ml-1 px-1.5 py-0.5 bg-rose-100 dark:bg-rose-900/60 font-semibold rounded text-[10px]">
                    Near Line {validationError.line}
                  </span>
                )}
              </div>
            </div>
          ) : inputText.trim() ? (
            <div id="json-formatter-valid-block" className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border-t border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
              <Check className="w-4.5 h-4.5" />
              <span className="font-bold">JSON Syntax Valid!</span>
            </div>
          ) : null}
        </div>

        {/* Right column (Formatted Code / Interactive Tree View) */}
        <div id="json-formatter-output-container" className="flex flex-col bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[480px]">
          
          {/* Header Action bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40 gap-3">
            
            <div className="flex items-center gap-2">
              {/* Toggle Format View Type buttons */}
              <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex gap-0.5">
                <button
                  id="json-formatter-formatted-view-tab"
                  onClick={() => setViewMode('formatted')}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    viewMode === 'formatted' 
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  Beautified
                </button>
                <button
                  id="json-formatter-tree-view-tab"
                  onClick={() => {
                    if (parsedData) {
                      setViewMode('tree');
                    }
                  }}
                  disabled={!parsedData}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                    !parsedData ? 'opacity-40 cursor-not-allowed' : ''
                  } ${
                    viewMode === 'tree' 
                      ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  title={!parsedData ? 'Input valid JSON parameter first' : 'Interactive JSON Tree'}
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  Tree Inspector
                </button>
              </div>
            </div>

            {/* Indent option parameters */}
            <div className="flex items-center gap-3">
              {viewMode === 'formatted' ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Spacing:</span>
                  <select
                    id="indent-size-select"
                    value={indentSize}
                    onChange={(e) => setIndentSize(e.target.value as any)}
                    className="text-xs bg-slate-100 dark:bg-indigo-950/20 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-800 rounded px-2 py-1 outline-none font-semibold"
                  >
                    <option value="2">2 Spaces</option>
                    <option value="4">4 Spaces</option>
                    <option value="tab">1 Tab</option>
                    <option value="compact">Minified (Compact)</option>
                  </select>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    id="json-formatter-expand-all"
                    onClick={() => setGlobalTreeExpanded(true)}
                    className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
                  >
                    Expand All
                  </button>
                  <button
                    id="json-formatter-collapse-all"
                    onClick={() => setGlobalTreeExpanded(false)}
                    className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-all"
                  >
                    Collapse All
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Render Beautified view */}
          {viewMode === 'formatted' ? (
            <div className="flex-1 flex overflow-hidden min-h-[400px] relative bg-[#fafafb] dark:bg-[#0c0f16]">
              {/* Output Gutter line counts */}
              <div 
                ref={outputLinesRef}
                className="w-12 text-right pr-3 pl-1 py-4 bg-slate-150/10 dark:bg-slate-900/30 text-slate-300 dark:text-slate-700 font-mono text-xs select-none border-r border-slate-100 dark:border-slate-850/30 overflow-hidden leading-[1.62]"
              >
                {Array.from({ length: Math.max(outputLineCount, 1) }).map((_, idx) => (
                  <div key={idx} className="h-[1.62rem]">{idx + 1}</div>
                ))}
              </div>

              {/* Readonly preview container */}
              <pre
                id="beautified-json-pre"
                ref={outputPreRef}
                onScroll={handleOutputScroll}
                className="flex-1 p-4 font-mono text-xs text-slate-700 dark:text-slate-300 overflow-y-auto overflow-x-auto whitespace-pre leading-[1.62] select-text select-all"
              >
                {outputText || <span className="text-slate-400 italic">No output yet. Input valid JSON data on the left panel.</span>}
              </pre>
            </div>
          ) : (
            /* Render Interactive Tree view */
            <div className="flex-1 p-5 min-h-[400px] overflow-auto bg-[#fafafb] dark:bg-[#0c0f16]">
              {parsedData ? (
                <div className="font-mono text-xs text-slate-700 dark:text-slate-300">
                  <JsonTreeNode 
                    label="Root" 
                    value={parsedData} 
                    isLast={true} 
                    initiallyExpanded={globalTreeExpanded} 
                    isRoot={true}
                    forceExpandState={globalTreeExpanded}
                  />
                </div>
              ) : (
                <div className="text-slate-400 italic text-xs">No tree parsed yet. Fix raw validation errors first.</div>
              )}
            </div>
          )}

          {/* Action buttons footer */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
              Client-Side Local
            </div>
            
            <div className="flex items-center gap-2">
              <button
                id="json-formatter-copy-btn"
                disabled={!parsedData}
                onClick={handleCopy}
                className={`text-xs px-4 py-2 rounded-lg font-bold border flex items-center gap-2 transition-all ${
                  !parsedData 
                    ? 'bg-slate-100 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-605 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-300 shadow-sm'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Result'}
              </button>

              <button
                id="json-formatter-download-btn"
                disabled={!parsedData}
                onClick={handleDownload}
                className={`text-xs px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all ${
                  !parsedData
                    ? 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-605 cursor-not-allowed'
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

      {/* Guide segment / Description FAQ Accordion */}
      <div className="max-w-7xl mx-auto mt-12 bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Instructions & Tool Capabilities
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800 pb-6 mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">How to format & validate:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Type or paste your raw minified JSON string into the left-hand text area.</li>
              <li>The tool instantly compiles it to make sure it complies with RFC-7159 standards.</li>
              <li>Syntax validation updates dynamically as you type—meaning any unclosed markers, arrays, or bad quotation models get listed right away with estimated line hints.</li>
              <li>Pick your preferred indentation layouts: 2-space padding, 4-space, tabs, or complete minification.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Tree Inspector & Statistics:</h3>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Click the <strong className="text-indigo-600 dark:text-indigo-400">Tree Inspector</strong> tab in the formatted section.</li>
              <li>Instantly browse nodes, objects, and nested keys as collapsible directories.</li>
              <li>View values cleanly categorized: strings, digits, logic symbols, arrays, or null.</li>
              <li>Review precise parameters counters of characters, objects, and cumulative key values.</li>
            </ul>
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

// Highly stylized dynamic Tree View node explorer component
interface TreeNodeProps {
  label: string;
  value: any;
  isLast: boolean;
  initiallyExpanded: boolean;
  isRoot?: boolean;
  forceExpandState?: boolean;
}

function JsonTreeNode({ label, value, isLast, initiallyExpanded, isRoot = false, forceExpandState }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  
  // Keep tree node expanding/collapsing local state relative to parent global controllers changes
  useEffect(() => {
    if (forceExpandState !== undefined) {
      setExpanded(forceExpandState);
    }
  }, [forceExpandState]);

  const type = typeof value;
  const isObj = value !== null && type === 'object';
  const isArr = Array.isArray(value);

  // Render collapsible Object or Array parent node
  if (isObj) {
    const keys = Object.keys(value || {});
    const nodeCount = isArr ? value.length : keys.length;
    const bracketOpen = isArr ? '[' : '{';
    const bracketClose = isArr ? ']' : '}';

    return (
      <div className="pl-4 border-l border-slate-200/50 dark:border-slate-800/40 my-1 font-mono">
        <div className="flex items-center gap-1 py-0.5 group">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all flex items-center justify-center shrink-0"
          >
            {expanded ? (
              <span className="text-[10px] transform rotate-90 block">▶</span>
            ) : (
              <span className="text-[10px] block font-semibold">▶</span>
            )}
          </button>
          
          <span className="text-slate-400 dark:text-slate-500 mr-1 select-none">
            {isArr ? <FolderOpen className="w-3.5 h-3.5 inline text-indigo-400 dark:text-indigo-500 mr-1" /> : <Folder className="w-3.5 h-3.5 inline text-amber-500 dark:text-amber-600 mr-1" />}
          </span>

          {!isRoot && (
            <span className="text-slate-800 dark:text-slate-300 font-bold mr-1">
              "{label}":
            </span>
          )}

          <span className="text-slate-400 dark:text-slate-500 font-semibold select-none">
            {bracketOpen}
            <span className="text-[10px] ml-1 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-800 text-slate-500 px-1 py-0.5 rounded">
              {nodeCount} {nodeCount === 1 ? 'item' : 'items'}
            </span>
            {!expanded && ` ... ${bracketClose}`}
          </span>
        </div>

        {expanded && (
          <div className="pl-2">
            {isArr ? (
              value.map((item: any, idx: number) => (
                <JsonTreeNode
                  key={idx}
                  label={idx.toString()}
                  value={item}
                  isLast={idx === value.length - 1}
                  initiallyExpanded={initiallyExpanded}
                  forceExpandState={forceExpandState}
                />
              ))
            ) : (
              keys.map((key, idx) => (
                <JsonTreeNode
                  key={key}
                  label={key}
                  value={value[key]}
                  isLast={idx === keys.length - 1}
                  initiallyExpanded={initiallyExpanded}
                  forceExpandState={forceExpandState}
                />
              ))
            )}
            <div className="text-slate-400 dark:text-slate-500 pl-4">{bracketClose}{!isLast && ','}</div>
          </div>
        )}
      </div>
    );
  }

  // Render leaf simple primitives (String, Number, Boolean, Null)
  let renderValue = null;
  if (value === null) {
    renderValue = <span className="text-slate-400 dark:text-slate-500 italic">null</span>;
  } else if (type === 'string') {
    renderValue = <span className="text-emerald-600 dark:text-emerald-400 font-semibold break-all">"{value}"</span>;
  } else if (type === 'number') {
    renderValue = <span className="text-sky-600 dark:text-sky-400 font-bold">{value}</span>;
  } else if (type === 'boolean') {
    renderValue = <span className={`font-black ${value ? 'text-amber-600 dark:text-amber-500' : 'text-rose-500 dark:text-rose-400'}`}>{value.toString()}</span>;
  } else {
    renderValue = <span className="text-slate-500">{value.toString()}</span>;
  }

  return (
    <div className="pl-8 py-0.5 hover:bg-slate-100/50 dark:hover:bg-slate-900/30 rounded flex items-start flex-wrap font-mono leading-relaxed">
      <span className="text-slate-800 dark:text-indigo-400 font-semibold mr-1.5 shrink-0">
        "{label}":
      </span>
      <span className="mr-0.5">{renderValue}</span>
      {!isLast && <span className="text-slate-400 dark:text-slate-600">,</span>}
    </div>
  );
}
