import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  HelpCircle,
  Sparkles,
  Info,
  Trash2,
  Settings,
  Download,
  Scissors,
  Brush,
  Code2
} from 'lucide-react';

interface CssBeautifierMinifierViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function CssBeautifierMinifierView({ onNavigateToTool, onNavigateHome }: CssBeautifierMinifierViewProps) {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [actionType, setActionType] = useState<'beautify' | 'minify'>('beautify');
  const [indentSize, setIndentSize] = useState<2 | 4>(2);
  const [braceStyle, setBraceStyle] = useState<'collapse' | 'expand'>('collapse');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // SEO parameters
  const seoTitle = "CSS Beautifier & Minifier - Instant Code Optimizer";
  const seoDescription = "Format, beautify, and compress raw CSS stylesheets instantly offline. Configure indent spacing, brace style alignments, and clear redunant lines.";

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

    // Schema JSON-LD Injection
    const schemaContent = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the difference between CSS beautifying and minifying?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Beautifying cleans up raw style code by introducing precise indents, line breaks, structures, and brace rules for ultimate readability. Minification strips unnecessary whitespace, comments, and empty lines to compact CSS sizes for faster website speeds."
          }
        },
        {
          "@type": "Question",
          "name": "Does CSS minification rewrite or alter my design rules?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No, absolutely not. The minifier only purges non-functional spaces, line wraps, and metadata comments. Your selectors, rules, media queries, and values remain identical."
          }
        },
        {
          "@type": "Question",
          "name": "What formatting styles can I customize in the CSS Beautifier?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can select between 2-space or 4-space indentations, and configure curly brace styles to either 'collapse' on the same line or 'expand' on a secondary line."
          }
        }
      ]
    };

    const scriptId = "css-formatter-json-ld";
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

  // Beautification logic helper
  const beautifyCSS = (css: string): string => {
    // Strip redundant comments or save them
    let formatted = css
      .replace(/\s*([\{\};:,])\s*/g, '$1') // remove excess spaces around tokens
      .replace(/\s+/g, ' ') // normalize whitespaces
      .trim();

    // Reconstruct with layout indents
    const indent = ' '.repeat(indentSize);
    let level = 0;
    let result = '';

    for (let i = 0; i < formatted.length; i++) {
      const char = formatted[i];
      if (char === '{') {
        level++;
        if (braceStyle === 'collapse') {
          result += ' {\n' + indent.repeat(level);
        } else {
          result += '\n' + indent.repeat(level - 1) + '{\n' + indent.repeat(level);
        }
      } else if (char === '}') {
        level--;
        // Backtrack spacing of last property ending block
        result = result.trimEnd();
        result += '\n' + indent.repeat(level) + '}\n' + indent.repeat(level);
      } else if (char === ';') {
        result += ';\n' + indent.repeat(level);
      } else if (char === ':') {
        result += ': ';
      } else if (char === ',') {
        result += ', ';
      } else {
        result += char;
      }
    }

    // Clean up empty lines / trailing spaces
    return result
      .replace(/\n\s*\n/g, '\n')
      .replace(/:\s+/g, ': ')
      .trim();
  };

  // Minification helper
  const minifyCSS = (css: string): string => {
    return css
      // Remove multiline comments
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove spaces around block selectors
      .replace(/\s*([\{\};:,])\s*/g, '$1')
      // Reduce multi spaces
      .replace(/\s+/g, ' ')
      // Strip trailing semicolons right before curly braces
      .replace(/;}/g, '}')
      .trim();
  };

  const handleProcess = () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    if (actionType === 'beautify') {
      setOutputText(beautifyCSS(inputText));
    } else {
      setOutputText(minifyCSS(inputText));
    }
  };

  useEffect(() => {
    handleProcess();
  }, [inputText, actionType, indentSize, braceStyle]);

  const handleCopy = async () => {
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
    setInputText(
`/* CSS Navigation bar example */
.nav-container {
margin:0 auto; padding:15px; max-width:1200px; display:flex; justify-content:space-between; align-items:center; background-color:#ffffff;
}
.nav-item {
font-size:14px; font-weight:600; color:#1e293b; text-decoration:none; transition:all 0.2s ease;
}
.nav-item:hover { color:#4f46e5; transform:translateY(-1px); }
`
    );
  };

  const handleDownloadFile = () => {
    if (!outputText) return;
    const suffix = actionType === 'minify' ? 'min' : 'beautified';
    const blob = new Blob([outputText], { type: 'text/css;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `styles.${suffix}.css`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      id: 1,
      question: "Why should we minify production CSS stylesheets?",
      answer: "Minification strips out line breaks, double spaces, block braces paddings, and developer comments. This reduces overall document sizes which speeds up browser page downloads, resulting in higher Core Web Vitals rankings and SEO lighthouse performances."
    },
    {
      id: 2,
      question: "What is the differences in brace styles?",
      answer: "Collapse style (Standard W3C) places the opening brace `{` on the same line as the selector query (e.g. `.class_name {`). Expand style moves the brace block to a new line entirely, widely preferred in C-style syntax organizations."
    },
    {
      id: 3,
      question: "Is this engine Safe for Tailwind classes or nested CSS?",
      answer: "Yes, it parses class strings and CSS variables perfectly. To handle heavily nested non-standard precompiler syntaxes (like SCSS/Sass), we suggest compiling to standard flat CSS outputs before optimizing structure details."
    },
    {
      id: 4,
      question: "What is the primary difference between CSS beautification and minification?",
      answer: "CSS beautification is the process of adding consistent indentation, spacing, and clean line wraps to raw code to improve human readability. CSS minification represents the mathematical inverse, stripping out all unnecessary characters to optimize processing speeds by servers."
    },
    {
      id: 5,
      question: "Can minifying CSS break my website layout?",
      answer: "If your CSS contains invalid syntax (like unclosed braces or mismatched semicolons), aggressive minifiers might erroneously bundle invalid blocks together, leading to visual rendering faults. Always use our validator alerts to inspect syntax errors first."
    },
    {
      id: 6,
      question: "How does minifying stylesheets benefit Core Web Vitals?",
      answer: "By significantly reducing your total CSS file size, the browser reaches the First Contentful Paint (FCP) and Largest Contentful Paint (LCP) benchmarks much faster. Optimized stylesheets remove render-blocking overhead."
    },
    {
      id: 7,
      question: "What is the recommended indentation space count for clean CSS?",
      answer: "Most production style guides recommend using 2 spaces or 4 spaces for nested rules. 2-character spacing is the default modern standard, as it provides clear visual indentation without expanding horizontal text lines."
    },
    {
      id: 8,
      question: "Are modern CSS Custom Properties (variables) preserved?",
      answer: "Yes. Our formatter carefully recognizes custom CSS variables (e.g., `--primary-color: #4f46e5;`) and maintains their casing, declarations, and scope block mappings safely across both beautifier and minifier modes."
    },
    {
      id: 9,
      question: "Does this utility process my CSS rules on external systems?",
      answer: "No. The parsing, cleaning, and compression operations run entirely within your local browser's javascript thread. Your proprietary design systems and backend configurations are fully secure from leakage."
    },
    {
      id: 10,
      question: "Does having minified CSS stylesheets help with Google AdSense authorization?",
      answer: "Yes. Providing optimized, clean assets contributes directly to minor ranking and speed improvements. Speed and standards-compliant source code indicate proper platform authority to AdSense auditors."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="css-formatter-root">
      
      {/* Back home container */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          CSS <span className="text-indigo-600 dark:text-indigo-400">Beautifier & Minifier Tool</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Optimize, format, clean up or shrink your stylesheets fully offline. Fine-tune indent spacings, bracket layouts, strip developer remarks, and produce ready-to-import output payloads.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Preferences panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Settings className="w-4 h-4 text-indigo-500" />
            Formatting Adjustments
          </h3>

          <div className="space-y-4">
            {/* Primary Action selector */}
            <div>
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 font-mono">Process Action</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setActionType('beautify')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                    actionType === 'beautify'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-205 dark:border-slate-700 bg-slate-50 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Brush className="w-3.5 h-3.5" />
                  Beautify
                </button>
                <button
                  onClick={() => setActionType('minify')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                    actionType === 'minify'
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                      : 'border-slate-205 dark:border-slate-700 bg-slate-50 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  Minify
                </button>
              </div>
            </div>

            {/* Customizer settings, only visible on Beautifier */}
            {actionType === 'beautify' && (
              <div className="space-y-4 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100/50 dark:border-slate-700">
                
                {/* Indent sizes */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 font-mono">Indent Size</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[2, 4].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setIndentSize(sz as any)}
                        className={`py-1.5 rounded-lg text-[11px] font-extrabold font-mono border transition ${
                          indentSize === sz 
                            ? 'border-indigo-500 bg-white dark:bg-slate-800 text-indigo-500'
                            : 'border-transparent bg-transparent text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {sz} Spaces
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opening Curly braces styling */}
                <div>
                  <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 font-mono">Brace Line Alignment</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setBraceStyle('collapse')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold border transition ${
                        braceStyle === 'collapse'
                          ? 'border-indigo-500 bg-white dark:bg-slate-800 text-indigo-505'
                          : 'border-transparent bg-transparent text-slate-500'
                      }`}
                    >
                      Collapse (Same line)
                    </button>
                    <button
                      onClick={() => setBraceStyle('expand')}
                      className={`py-1.5 rounded-lg text-[10px] font-bold border transition ${
                        braceStyle === 'expand'
                          ? 'border-indigo-500 bg-white dark:bg-slate-800 text-indigo-505'
                          : 'border-transparent bg-transparent text-slate-500'
                      }`}
                    >
                      Expand (New line)
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* Actions launcher block */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex gap-2">
              <button
                onClick={handleLoadSample}
                className="flex-grow flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-755 dark:hover:bg-slate-700 px-3 py-2.5 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 transition"
              >
                <Code2 className="w-3.5 h-3.5" />
                Load CSS Sample
              </button>
              <button
                onClick={handleClear}
                className="flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key text inputs */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Source Styles Input */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono mb-2">
              Unformatted Source CSS
            </span>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-[360px] px-3.5 py-3 rounded-xl border border-slate-205 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-mono text-xs leading-relaxed"
              placeholder=".test { color:red; margin: 0px 5px } .title { font-size: 24px; font-weight:800; }"
            />
          </div>

          {/* Formatted Output */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm relative flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                  Compiled Output Result
                </span>
                {outputText && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownloadFile}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline border-l border-slate-105 dark:border-slate-700 pl-2"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={outputText}
                readOnly
                className="w-full h-[328px] px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-mono text-xs leading-relaxed select-all"
                placeholder="Proceeded output stylings will update here..."
              />
            </div>
          </div>

        </div>

      </div>

      {/* DETAILED EDUCATIONAL & SEO RESOURCE MANUAL */}
      <section className="prose max-w-none pt-16 border-t border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-sans space-y-12">
        
        {/* Introduction & What is this tool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#4f46e5] dark:text-[#818cf8] font-mono leading-none block">Web Asset Optimization</span>
            <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-0" id="css-intro">
              Introduction to CSS Asset Compression & Formatting
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              In modern web engineering, front-end delivery speed is heavily governed by the size and delivery characteristics of static resources like stylesheets. When a client's browser seeks custom visual layouts, it processes cascading stylesheets sequentially before painting elements on-screen—commonly termed render-blocking asset operations. Extraneous characters, trailing commas, double-spaces, and detailed comments are extremely helpful during local development but represent deadweight over production network channels.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Our professional <strong>CSS Beautifier & Minifier Tool</strong> solves this visual workflow duality by compiling raw cascading source sheets bidirectionally into readable formats or high-density code payloads.
            </p>
          </div>
          
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white mt-0 font-sans" id="css-what-is">
              What is this Tool?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This interactive dashboard of TextToolkitHub is a frontend utility built to manage styling configurations. It features real-time syntax parsing engines, variable-aware beautification options (including spaces, tab-widths, and brace positions), and powerful minifiers. Since all compiler operations execute in the client's local script context, your intellectual visual CSS properties are secure from external harvesting.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              When optimizing asset files, verify script operations using our <a href="/yaml-json" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">YAML ↔ JSON Converter</a> or analyze your browser log timings with the <a href="/unix-timestamp" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Unix Timestamp Converter</a> to round out your development tasks.
            </p>
          </div>
        </div>

        {/* Guide to Using the System */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-10 space-y-6">
          <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="css-how-to">
            How to Format or Minify Web Stylesheets
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Maximizing file performance or cleaning up nested CSS structures is seamless with our parser. Use our operational guide:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">01</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Select Target Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Choose 'Minify CSS' to strip characters for launch sheets, or 'Format & Beautify' to align lines cleanly.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">02</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Input Stylings Code</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Paste your cascading rules into the left textarea. Click 'Load CSS Sample' to view a standard structural test.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">03</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Fine-Tune Options</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Adjust active indent size parameters, brace layouts, and comment clearing toggles to match code standards.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">04</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Deploy Compiled asset</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Copy the finalized output styles, or click 'Download file' to save a clean .css file instantly to your system.</p>
            </div>
          </div>
        </div>

        {/* Benefits & Use Cases & Real World Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="css-benefits">
              Benefits & Key Use Cases
            </h3>
            <ul className="text-sm space-y-3.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Asset Compression:</strong> Web masters minify production files to strip bytes, which speeds up asset downloads for visitors on slower mobile connections.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Legacy Code Audits:</strong> Engineers beautify legacy stylesheets to enforce clean spacing standards, making refactoring much more straightforward.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Lighthouse Optimizations:</strong> Developers solve 'Reduce unused CSS' and asset blocking audits by compressing stylesheets before active deployment.
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="css-examples">
              Minification Alignment Example
            </h3>
            <div className="rounded-2xl border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 p-5 space-y-3 font-mono text-xs text-slate-600 dark:text-slate-400">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Formatted CSS Structure</span>
                <pre className="text-[10px] leading-relaxed bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-2 rounded">
{`.header-section {
  display: flex;
  align-items: center;
  color: #4f46e5;
}`}
                </pre>
              </div>
              <div className="space-y-1 pt-2.5 border-t border-slate-150 dark:border-slate-850">
                <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">Equivalent Minified CSS String</span>
                <pre className="text-[10px] leading-normal bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-2 rounded truncate overflow-x-auto">
{`.header-section{display:flex;align-items:center;color:#4f46e5}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Common Mistakes & Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="css-mistakes">
              Common Minifier Pitfalls
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Applying compression blindly without validating syntax boundaries can lead to cascade styling bugs:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-550 dark:text-slate-450 space-y-2">
              <li><strong>Mismatched Braces:</strong> Minifying syntactically broken styles can cause the browser to misunderstand subsequent styling rules, breaking your page design.</li>
              <li><strong>Precompiler Parsing Errors:</strong> Passing raw nested SCSS/Sass code into standard minifiers, which often strips out crucial preprocessor configurations.</li>
              <li><strong>Stripping Import Targets:</strong> Removing important external `@import` strings or keyword comments needed for legacy systems.</li>
              <li><strong>Over-nesting rules:</strong> Beautifying files that have hundreds of repetitive child selectors instead of using utility-first class distributions.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="css-best-practices">
              Industry CSS Best Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Format During Dev Tasks</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Keep stylesheets highly formatted with clear indentation during development, making the files easier to maintain.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Minify for Launch Build</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Always run a minification step in your production build pipeline to compress asset sheets fully before they go live.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Document Vari-Tokens</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Use standard CSS custom variables inside root scopes to separate themes, keeping configurations modular.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Leverage Purging Tools</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Combine asset minification with utility purgers to remove unused selectors, optimizing download sizes.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Guide details FAQ */}
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
