import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  FileCode, 
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
  FileText
} from 'lucide-react';

interface HtmlEncoderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function HtmlEncoderView({ onNavigateToTool, onNavigateHome }: HtmlEncoderViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationInfo, setValidationInfo] = useState<string | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Advanced configurations
  const [encodeMode, setEncodeMode] = useState<'core' | 'all'>('core');
  const [useHexadecimal, setUseHexadecimal] = useState<boolean>(false);

  // SEO Parameters
  const seoTitle = "HTML Encoder Tool Online Free - Live Entity Converter";
  const seoDescription = "Convert HTML code into encoded HTML entities instantly. Protect layouts and prevent cross-site scripting with our safe offline-first free HTML Encoder.";

  const faqs = [
    {
      id: 1,
      question: "What is HTML Encoding?",
      answer: "HTML encoding is the process of translating special characters (sometimes called markup characters) within HTML source code into their corresponding browser-safe HTML entity representations. For example, the less-than sign (<) is converted into '&lt;' and the greater-than sign (>) is converted into '&gt;'. This allows browsers to print the symbols literally, rather than interpreting them as active nested layout commands."
    },
    {
      id: 2,
      question: "Why should I use HTML Encoding?",
      answer: "HTML encoding serves two primary purposes: Security and Rendering. Security-wise, it mitigates Cross-Site Scripting (XSS) injection vectors by neutralizing malicious user input containing harmful script tags. Rendering-wise, it prevents the layout parser from parsing textual markup code literally, ensuring that tutorial code blocks, samples, and math text display exactly as written."
    },
    {
      id: 3,
      question: "What is the difference between 'Core Tags Only' and 'Encode All Characters' presets?",
      answer: "The 'Core Tags Only' preset converts only key structural symbols: the ampersand (&), less-than (<), greater-than (>), straight double quotes (\"), and apostrophe ('). The 'Encode All Characters' preset converts those five primary characters plus any other non-ASCII, accented, or punctuation symbols (such as ©, ®, ñ, and ™) into safe numerical unicode entities."
    },
    {
      id: 4,
      question: "How does the Hexadecimal entities toggle work?",
      answer: "By default, HTML tools use named references (like '&lt;') or decimal unicode mappings (like '&#60;'). Activating the Hexadecimal preset formats numerical mappings in hexadecimal notation (like '&#x3C;'). Both formats are fully compliant with modern browser rendering specs."
    },
    {
      id: 5,
      question: "Is my HTML code uploaded to any external server?",
      answer: "Absolutely not! To guarantee 100% data privacy and compliance, all computations and text encoding conversions are processed entirely client-side inside your own local browser javascript context. No inputs ever touch a network backend."
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

    const scriptId = "html-encoder-json-ld";
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

  // Standard entity dictionary
  const coreEntities: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  const coreHexEntities: { [key: string]: string } = {
    '&': '&#x26;',
    '<': '&#x3C;',
    '>': '&#x3E;',
    '"': '&#x22;',
    "'": '&#x27;',
  };

  // Live HTML encoding logic
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setValidationInfo(null);
      return;
    }

    // Input Validation check: Does it look like they pasted HTML tags?
    const hasHtmlTags = /<[a-z/][^>]*>/gi.test(inputText);
    const hasSpecialChars = /[&<>"']/.test(inputText);

    if (!hasHtmlTags && hasSpecialChars) {
      setValidationInfo("Information: Your text holds raw structural characters (like & or quotes) but does not appear to contain full HTML markup tags (<tag>). It will still be encoded cleanly.");
    } else if (!hasSpecialChars && inputText.trim() !== '') {
      setValidationInfo("Notice: No characters requiring HTML escaping (&, <, >, \", or ') detected in the text.");
    } else {
      setValidationInfo(null);
    }

    let encoded = '';

    if (encodeMode === 'core') {
      // Loop or replace only core five characters
      encoded = inputText.replace(/[&<>"']/g, (char) => {
        if (useHexadecimal) {
          return coreHexEntities[char] || char;
        }
        return coreEntities[char] || char;
      });
    } else {
      // Encode ALL characters index-by-index 
      for (let i = 0; i < inputText.length; i++) {
        const char = inputText[i];
        const code = char.charCodeAt(0);

        if (coreEntities[char]) {
          encoded += useHexadecimal ? coreHexEntities[char] : coreEntities[char];
        } else if (code > 127 || (code < 32 && code !== 10 && code !== 13 && code !== 9)) {
          // Accented, non-ASCII, or control characters
          if (useHexadecimal) {
            encoded += `&#x${code.toString(16).toUpperCase()};`;
          } else {
            encoded += `&#${code};`;
          }
        } else {
          encoded += char;
        }
      }
    }

    setOutputText(encoded);
  }, [inputText, encodeMode, useHexadecimal]);

  // Actions
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`<!-- Sample HTML Layout to escape -->\n<div class="card shadow" id="hero-banner">\n  <h1 class="text-3xl font-bold font-sans">Hello & Welcome!</h1>\n  <p class="mt-2 text-slate-500">Enjoy 100% private text tools.</p>\n  <a href="/get-started?user=true&referrer=home" class="btn">Get Started &rarr;</a>\n</div>`);
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText });
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
    setOutputText('');
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
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/html-encoder').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 animate-fade-in" id="html-encoder-page">
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
            onClick={() => onNavigateToTool('tools')}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400">HTML Encoder</span>
        </div>

        {/* Header Block Column */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <FileCode className="w-7 h-7 text-indigo-600" />
              </span>
              HTML Encoder Tool Online Free
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Convert raw HTML code tags, characters, and structures into encoded HTML entities instantly and 100% privately in your browser.
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
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/html-encoder</span>
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
              <Sliders className="w-4 h-4 text-indigo-500" /> HTML Custom Escape Presets
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans">Choose between targeting structural tag markers or applying full-character hexadecimal entity conversions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Control: Encoding Mode selector */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 dark:text-slate-400 font-sans">Encoding Threshold</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setEncodeMode('core')}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    encodeMode === 'core'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-slate-800/80 dark:text-indigo-400 dark:border-indigo-500/50'
                      : 'border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                  id="preset-core-btn"
                >
                  Core Tags Only
                </button>
                <button
                  onClick={() => setEncodeMode('all')}
                  className={`px-3 py-2 border rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer ${
                    encodeMode === 'all'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-slate-800/80 dark:text-indigo-400 dark:border-indigo-500/50'
                      : 'border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                  id="preset-all-btn"
                >
                  Encode All Characters
                </button>
              </div>
            </div>

            {/* Control: Hex format option */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 dark:text-slate-400 font-sans">Entity Code Type</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={useHexadecimal}
                  onChange={(e) => setUseHexadecimal(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Use Hexadecimal entities (e.g. &#x3C;)
              </label>
            </div>

            {/* Config Status Info Block */}
            <div className="p-3.5 bg-indigo-50/45 dark:bg-slate-900/40 border border-indigo-100/40 dark:border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
              <Settings className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-300 block">Encoding Active:</span>
                {encodeMode === 'core' 
                  ? 'Transpiles five core symbols (&, <, >, ", \') to keep tag structures safely non-executable.'
                  : 'Encodes tags and converts every non-ASCII character to its secure numerical unicode value.'
                }
              </div>
            </div>

          </div>
        </div>

        {/* Workspace Panels Split Layout Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* RAW INPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> Raw HTML Code or Text Input
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Sample HTML Code
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Paste raw HTML code blocks here (e.g. <h1>Hello World</h1>)..."
                className="w-full p-5 min-h-[250px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-mono leading-relaxed"
                id="html-encoder-input-textarea"
                aria-label="Raw HTML input"
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

          {/* ENCODED OUTPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Encoded HTML Entities Output
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 font-sans">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Encoded Live
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
                    placeholder="Encoded entities will display here..."
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full h-[180px] border-0 outline-none text-base text-emerald-700 dark:text-emerald-450 bg-transparent resize-none font-mono leading-relaxed"
                    id="html-encoder-output-textarea"
                    aria-label="Encoded HTML output"
                  />
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic block my-auto text-center font-sans">
                    Your escaped HTML entity tokens will populate live here...
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
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">Developer Handbook</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              What is HTML Encoding?
            </h2>
            <div className="space-y-4 font-sans">
              <p>
                When a web browser encounters markup tags such as <code>&lt;h1&gt;</code> or <code>&lt;script&gt;</code>, it immediately interprets them as instructions to render styling, formats, or execute code. But what if you explicitly want to display the code tags themselves on your page, perhaps for a blog tutorial or documentation example?
              </p>
              <p>
                That is where <strong className="font-bold text-slate-850 dark:text-white">HTML Entity Encoding</strong> becomes crucial. It parses raw code strings and replaces structural reserved tags and special symbols with unique character sequences called HTML entities (for example, mapping <code>&lt;</code> as <code>&amp;lt;</code>). When a browser sees these encoded representations, it bypasses executing the tag and safely renders the plain-text symbols literally inside your layout.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Why Use HTML Encoding?
            </h3>
            <div className="space-y-3 font-sans">
              <p>Primary use cases for encoding HTML code strings:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Securing Web Applications (Anti-XSS):</strong> Escaping untrusted user inputs (like blog comment fields) is a core line of defense against Cross-Site Scripting (XSS) code injections.</li>
                <li><strong>Tutorial & Documentation Layouts:</strong> Perfect for software developers, publishers, bloggers, and forum operators who need to insert raw HTML, XML, or JavaScript snippet samples safely.</li>
                <li><strong>Accurate Special Characters Mapping:</strong> Converts non-ASCII glyphs correctly to prevent weird rendering anomalies across different server platforms and browsers.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: Step-by-Step Operation Guide */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">User Instructions</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How To Use the HTML Encoder Tool
            </h2>
            <div className="space-y-4 font-sans">
              <p>Encoding your files or HTML code structures locally involves these fast, simple steps:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Enter or Paste HTML Code</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Simply paste your raw markup snippet, web anchor link, nested divs, or rich text parameters directly inside our input panel.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Choose Your Conversion Presets</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select 'Core Tags Only' for standard layout safety, or 'Encode All Characters' to escape all accented glyphs. Toggle the Hexadecimal checkbox for hex entities.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Copy Your Secure Output</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">The translated HTML entities render in real-time. Use the copy button to capture result strings securely to your local clip buffer.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Key Character Entity Map Table
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono border-collapse border border-slate-200 dark:border-slate-800 rounded-xl">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900">
                    <th className="border border-slate-200 dark:border-slate-800 p-2 text-left font-sans text-slate-550">Character</th>
                    <th className="border border-slate-200 dark:border-slate-800 p-2 text-left font-sans text-slate-550">Entity Name</th>
                    <th className="border border-slate-200 dark:border-slate-800 p-2 text-left font-sans text-slate-550">Hex Mappings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&amp; (Ampersand)</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;amp;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-emerald-600 dark:text-emerald-400">&amp;#x26;</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&lt; (Less-Than)</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;lt;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-emerald-600 dark:text-emerald-400">&amp;#x3C;</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&gt; (Greater-Than)</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;gt;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-emerald-600 dark:text-emerald-400">&amp;#x3E;</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&quot; (Double Quote)</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;quot;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-emerald-600 dark:text-emerald-400">&amp;#x22;</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 font-sans font-bold text-slate-850 dark:text-slate-200">&#39; (Single Quote)</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-indigo-600 dark:text-indigo-400">&amp;#39;</td>
                    <td className="border border-slate-200 dark:border-slate-800 p-2 text-emerald-600 dark:text-emerald-400">&amp;#x27;</td>
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
                Have additional questions about entities standard, ASCII boundaries, or security policies? Let's answer them.
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
                    id={`html-encoder-faq-item-${faq.id}`}
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
