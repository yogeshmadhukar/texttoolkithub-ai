import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  ArrowLeftRight,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  HelpCircle,
  Code,
  Sparkles,
  Info,
  Trash2,
  Settings,
  FileText
} from 'lucide-react';

interface StringEscaperViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type EscaperTarget = 'javascript' | 'html' | 'sql' | 'json';

export default function StringEscaperView({ onNavigateToTool, onNavigateHome }: StringEscaperViewProps) {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [targetLang, setTargetLang] = useState<EscaperTarget>('javascript');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'escape' | 'unescape'>('escape');
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);

  // SEO parameters
  const seoTitle = "String Escaper Online - Code Text Escape Unescaper Tool";
  const seoDescription = "Escape and unescape lines of text for JavaScript, JSON, SQL queries, HTML tags and XML entities instantly. Free secure local string sanitizer.";

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

    return () => {
      document.title = previousTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, []);

  // Escape handlers
  const escapeString = (text: string, target: EscaperTarget): string => {
    if (!text) return '';

    switch (target) {
      case 'javascript':
        // Standard JS / Java backslash-escaping
        return text
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t');
      
      case 'json':
        // Safe JSON values formatting escape rules
        try {
          return JSON.stringify(text).slice(1, -1);
        } catch {
          return text.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
        }

      case 'html':
        // standard HTML entities encoding safe for templates
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/`/g, '&#x60;');

      case 'sql':
        // ANSI SQL / SQLite single-quote escaping
        return text.replace(/'/g, "''");

      default:
        return text;
    }
  };

  // Unescape handlers
  const unescapeString = (text: string, target: EscaperTarget): string => {
    if (!text) return '';

    switch (target) {
      case 'javascript':
      case 'json':
        // Parse escaped string sequences
        try {
          // Wrapped inside double quotes to let native parsed JSON restore code sequences
          let mockStr = text;
          if (!mockStr.startsWith('"')) {
            mockStr = `"${mockStr.replace(/([^\\])"/g, '$1\\"')}"`;
          }
          return JSON.parse(mockStr);
        } catch {
          // Fallback regex replacement
          return text
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, '\\');
        }

      case 'html':
        // Parse basic HTML entities
        return text
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#x27;/g, "'")
          .replace(/&#x60;/g, '`')
          .replace(/&amp;/g, '&');

      case 'sql':
        // Revert double single-quotes back to standard single quotes
        return text.replace(/''/g, "'");

      default:
        return text;
    }
  };

  // Convert whenever input, language, or mode changes
  useEffect(() => {
    if (actionType === 'escape') {
      setOutputText(escapeString(inputText, targetLang));
    } else {
      setOutputText(unescapeString(inputText, targetLang));
    }
  }, [inputText, targetLang, actionType]);

  const handleCopyResult = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleLoadSample = () => {
    if (actionType === 'escape') {
      if (targetLang === 'html') {
        setInputText('<div class="header">Hello "World" & \'Team\'</div>');
      } else if (targetLang === 'sql') {
        setInputText("SELECT * FROM users WHERE name = 'John O'Connor'");
      } else {
        setInputText('Hello "Alex".\nThis is a code string:\n\tConsole.log("Ready");');
      }
    } else {
      if (targetLang === 'html') {
        setInputText('&lt;div class=&quot;header&quot;&gt;Hello &amp; Welcome&lt;/div&gt;');
      } else if (targetLang === 'sql') {
        setInputText("SELECT * FROM tasks WHERE desc = ''High Priority''");
      } else {
        setInputText('Hello \\"Alex\\".\\nThis is a code string:\\n\\tReady!');
      }
    }
  };

  const faqs = [
    {
      id: 1,
      question: "Why do we escape strings in programming?",
      answer: "In programming, specific characters like double quotes (\"), single quotes ('), and backslashes (\\) have special structural meanings in source code compilers or query interpreters. Escaping converts these characters into safe, harmless literals (like \\\" or Entity notation) so they do not break script compilation or cause SQL injection vulnerabilities."
    },
    {
      id: 2,
      question: "What is the difference between HTML escaping and JSON escaping?",
      answer: "HTML escaping translates markup tags (like <, >) and ampersands into fully encoded browser character entities (like &lt;, &gt;) to prevent cross-site scripting (XSS). JSON/JavaScript escaping uses standard backslash control markers (\\n, \\t) to preserve code spaces cleanly within string constants."
    },
    {
      id: 3,
      question: "Is this tool secure to sanitize database constants?",
      answer: "Yes. All actions are executed in real-time inside your browser's standard memory sandbox using client-side JavaScript. This ensures total privacy as none of your query structures, sensitive user records, or code snippets are sent to any remote database or third-party analytical API."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="string-escaper-root">
      
      {/* Back link & header */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          String <span className="text-indigo-600 dark:text-indigo-400">Escaper & Unescaper</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          A robust local conversion space to instantly encode raw text strings into safe programming literals, and easily unescape nested sequences back to pristine readable layouts. Supports HTML entities, SQL constants, and JS/JSON literals.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Layout settings switches */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-3 font-sans">
            <Settings className="w-4 h-4 text-indigo-500" />
            Format Settings
          </h3>

          <div className="space-y-5">
            {/* Action option */}
            <div>
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Operation Type</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'escape', label: 'Escape Lit' },
                  { id: 'unescape', label: 'Unescape Text' }
                ].map((act) => {
                  const isActive = actionType === act.id;
                  return (
                    <button
                      key={act.id}
                      onClick={() => {
                        setActionType(act.id as any);
                        setInputText('');
                        setOutputText('');
                      }}
                      className={`py-2 rounded-lg text-xs font-bold border transition ${
                        isActive 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'border-slate-200 dark:border-slate-750 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {act.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Language selector */}
            <div>
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Target Code Syntax</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'javascript', label: 'JS / Java / C#' },
                  { id: 'json', label: 'JSON String' },
                  { id: 'html', label: 'HTML Entities' },
                  { id: 'sql', label: 'SQL Constant' }
                ].map((lang) => {
                  const isActive = targetLang === lang.id;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => setTargetLang(lang.id as EscaperTarget)}
                      className={`px-2 py-2.5 rounded-lg border text-[11px] font-mono transition text-center font-bold ${
                        isActive 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'border-slate-200 dark:border-slate-750 bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {lang.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Practical loader utils */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex gap-2">
              <button
                onClick={handleLoadSample}
                className="flex-grow flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-755 dark:hover:bg-slate-700 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Load Sample
              </button>
              <button
                onClick={handleClear}
                className="flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 px-3.5 py-2 rounded-xl text-xs font-extrabold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right column: Workspaces */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input area */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 font-mono">
                {actionType === 'escape' ? 'Source string' : 'Escaped code sequence'}
              </span>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-80 px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-mono text-xs leading-relaxed"
                placeholder={
                  actionType === 'escape'
                    ? "Enter beautiful code formulas, symbols or tag blocks to escape..."
                    : "Enter escaped characters to unescape..."
                }
              />
            </div>

            {/* Output area */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                    {actionType === 'escape' ? 'Escaped literal translation' : 'Unescaped plain characters'}
                  </span>
                  {outputText && (
                    <button
                      onClick={handleCopyResult}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? 'Copied' : 'Copy Output'}
                    </button>
                  )}
                </div>
                <textarea
                  value={outputText}
                  readOnly
                  className="w-full h-72 px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-mono text-xs leading-relaxed select-all"
                  placeholder="Escaped output values will generate here in real-time..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Guide FAQs Accordion */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-sans flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
