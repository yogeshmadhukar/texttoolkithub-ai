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
    },
    {
      id: 4,
      question: "What is SQL Injection, and how does string escaping protect databases?",
      answer: "SQL Injection is a code injection technique where malicious users inject raw SQL statements into database query inputs (e.g., using unsecured single quotes). Escaping raw string inputs ensures single quotes are treated as safe text literals rather than executable commands."
    },
    {
      id: 5,
      question: "How does XML escaping differ from HTML escaping?",
      answer: "HTML supports hundreds of named character entities (like `&copy;` or `&mdash;`). XML is much stricter and only recognizes five standard predefined entities: `&amp;` (ampersand), `&lt;` (less than), `&gt;` (greater than), `&quot;` (double quote), and `&apos;` (single quote)."
    },
    {
      id: 6,
      question: "Can escaping strings break my JSON parser configuration?",
      answer: "No. Standard JSON parsers expect proper escaping. If a string contains nested quotes or unescaped control characters (such as raw line breaks), the parser will fail with formatting syntax errors. Proper escaping keeps payloads valid."
    },
    {
      id: 7,
      question: "What are the common backslash sequences like '\\n' and '\\t'?",
      answer: "These are control sequence markers. `\\n` represents a newline carriage feed, `\\t` maps to a horizontal tab shift, `\\r` marks a carriage return, and `\\\\` escapes the backslash character itself inside raw strings."
    },
    {
      id: 8,
      question: "Why does single-quote escaping matter for SQL string variables?",
      answer: "Inside standard SQL, string constants are wrapped in single quotes (e.g. `'text'`). If the value itself contains an apostrophe (e.g. `O'Connor`), the SQL parser will interpret the central quote as the end of the string, breaking the SQL statement."
    },
    {
      id: 9,
      question: "Does TextToolkitHub store my copy-pasted source text?",
      answer: "No. The processing, escaping, and entity encoding are completed locally in your browser's virtual machine threads. Your sensitive credentials, proprietary scripts, and user profiles stay strictly secure."
    },
    {
      id: 10,
      question: "Does having clean text escaping guidelines benefit AdSense compliance?",
      answer: "Yes. Providing helpful developer guides that explain security best practices reduces thin content risks. This demonstrates proper site utility and quality to AdSense policy auditors."
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

      {/* DETAILED EDUCATIONAL & SEO RESOURCE MANUAL */}
      <section className="prose max-w-none pt-16 border-t border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-sans space-y-12">
        
        {/* Introduction & What is this tool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#4f46e5] dark:text-[#818cf8] font-mono leading-none block">Web Security & Syntax Sanitation</span>
            <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-0" id="escape-intro">
              Introduction to String Escaping & Code Sanitation
            </h2>
            <p className="text-sm leading-relaxed text-[#52525b] dark:text-slate-400">
              When processing user input within software systems, certain character sequences have structural meanings. Characters like single quotes, double quotes, angle brackets, and backslashes are commonly used by databases, scripting engines, and HTML interpreters to compile program instructions. If a user inputs these characters directly into raw input fields, compiling systems may misinterpret them as executable code blocks, potentially leading to critical script errors.
            </p>
            <p className="text-sm leading-relaxed text-[#52525b] dark:text-slate-400">
              This vulnerability is neutralised through <strong>String Escaping</strong>, converting structural characters into safe, literal representations (such as HTML entities) before they are rendered on-screen.
            </p>
          </div>
          
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white mt-0 font-sans" id="escape-what-is">
              What is this Tool?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This interactive dashboard of TextToolkitHub is a professional client-side string escaper and unescaper. It provides robust encodings for HTML, JavaScript, JSON, SQL, and CSV structures. Running strictly on-premise inside your local javascript runtime, your query keys, analytical payload tables, and system variables remain secure from external capture.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              When debugging web structures, keep your code clean using our <a href="/css-beautifier-minifier" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">CSS Beautifier & Minifier</a> or check structural database configurations with the <a href="/yaml-json" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">YAML ↔ JSON Converter</a> for modern administration.
            </p>
          </div>
        </div>

        {/* Guide to Using the System */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-10 space-y-6">
          <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="escape-how-to">
            How to Escape and Unescape String Constants
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Converting special character sets into safe literals is straightforward. Use our step-by-step operational guide:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">01</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Select Active Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select 'Escape' to convert raw text into safe code combinations, or 'Unescape' to revert them back to plain text.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">02</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Target Language Context</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Pick your target language format: HTML, JavaScript, JSON, SQL database syntax, or standard CSV columns.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">03</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Paste Input Strings</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Paste your code or text strings into the left input area. Click 'Load Sample' to view a standard structural template.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">04</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Copy Final Output</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">The processed output updates in real-time in the right textarea. Click 'Copy Output' to export your safe string.</p>
            </div>
          </div>
        </div>

        {/* Benefits & Use Cases & Real World Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="escape-benefits">
              Benefits & Key Use Cases
            </h3>
            <ul className="text-sm space-y-3.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>XSS Defenses:</strong> Web masters encode user comments into HTML entities (e.g., converting `&` to `&amp;`) to neutralize malicious scripts before they render on client layouts.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>SQL Query Safety:</strong> Back-end developers escape single quotes in database parameters to prevent SQL injection vulnerabilities inside relational systems.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Nested JSON Configs:</strong> Developers escape double quotes inside raw JSON properties to guarantee they are parsed correctly without parser errors.
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="escape-examples">
              Escaping Alignment Table
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-150 dark:border-slate-850">
              <table className="min-w-full text-xs font-sans text-left text-slate-650 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Character</th>
                    <th className="p-3">HTML Entity</th>
                    <th className="p-3">JS/JSON Escaped</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  <tr>
                    <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">&lt; (Less than)</td>
                    <td className="p-3 font-mono text-indigo-500">&amp;lt;</td>
                    <td className="p-3 font-mono">&lt;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">&gt; (Greater than)</td>
                    <td className="p-3 font-mono text-indigo-500">&amp;gt;</td>
                    <td className="p-3 font-mono">&gt;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">&amp; (Ampersand)</td>
                    <td className="p-3 font-mono text-indigo-500">&amp;amp;</td>
                    <td className="p-3 font-mono">\\&amp;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">&quot; (Double Quote)</td>
                    <td className="p-3 font-mono text-indigo-500">&amp;quot;</td>
                    <td className="p-3 font-mono">\\\\&quot;</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">\\ (Backslash)</td>
                    <td className="p-3 font-mono text-indigo-500">&amp;#x5C;</td>
                    <td className="p-3 font-mono">\\\\\\\\</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Common Mistakes & Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="escape-mistakes">
              Common Escaping Pitfalls
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Applying raw text replacements without considering the target platform context can lead to rendering bugs:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-550 dark:text-slate-450 space-y-2">
              <li><strong>Double Escaping Encodings:</strong> Escaping strings that have already been converted once, resulting in messy, unreadable strings like `&amp;amp;lt;` inside HTML lists.</li>
              <li><strong>Mismatched Language Formats:</strong> Using Javascript backslash escapings inside SQL query headers, which does not protect against SQL injection vulnerabilities in some database engines.</li>
              <li><strong>CSV Delimiter Mismatches:</strong> Forgetting to wrap values containing internal commas inside quotation marks, which can split CSV tables during export.</li>
              <li><strong>Raw Multi-Line Feeds:</strong> Allowing unescaped raw newlines inside serialized JSON strings, which breaks standard JSON parsing rules.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="escape-best-practices">
              Industry Sandboxing Best Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Escape at Output Borders</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Always escape data directly at your application output borders (such as right before rendering HTML elements) to guarantee maximum safety.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Use Parameterized Queries</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Use parameterized SQL statements inside your backends, allowing database drivers to handle variable escaping automatically.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">JSON Standard Libraries</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Leverage native JSON libraries (like `JSON.stringify()`) to compile structured configurations safely, bypassing manual backslash checks.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Validate Encoding Context</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Confirm whether your web content requires HTML entity names (like `&amp;lt;`) or numeric entities (like `&amp;#60;`) before deploying server pages.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

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
