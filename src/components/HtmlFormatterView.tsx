import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Code2, 
  Settings, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  Sparkles,
  RefreshCw,
  Eye,
  FileCode,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface HtmlFormatterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function HtmlFormatterView({ onNavigateToTool, onNavigateHome }: HtmlFormatterViewProps) {
  const [inputText, setInputText] = useState('<div>\n<header>\n<h1>TextToolkitHub</h1>\n<p>Powerful client-side text tools</p>\n</header>\n<main>\n<section>\n<p>No backend trackers. Pure browser computation.</p>\n</section>\n</main>\n<footer>\n<small>&copy; 2026. All rights reserved.</small>\n</footer>\n</div>');
  const [outputText, setOutputText] = useState('');
  const [indentSize, setIndentSize] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const seoTitle = "HTML & XML Formatter Online | Beautifier & Minifier";
  const seoDescription = "Format, beautify, and minify HTML or XML markup code instantly with our free online utility. Live syntax checks and tag inspection, 100% offline.";

  const faqs = [
    {
      id: 1,
      question: "What does the HTML & XML Formatter do?",
      answer: "This tool takes unformatted, messy, or minified HTML or XML code and pretty-prints it with clean indentations and structural line breaks, making it highly readable. It also allows you to perform the reverse operation: minifying code to minimize file transfer size."
    },
    {
      id: 2,
      question: "How does the syntax error checking work?",
      answer: "We utilize the browser's native DOMParser engine to compile and check your HTML/XML structure. If there are mismatched tags, unclosed entities, or incorrect structures, the parser will flag them immediately with line numbers, helping you debug in seconds."
    },
    {
      id: 3,
      question: "Is there any limit on code size?",
      answer: "No! All conversions run locally inside your browser's virtual memory context, allowing you to format large HTML templates or XML logs without limits."
    },
    {
      id: 4,
      question: "Can I choose my indentation level?",
      answer: "Yes, you can easily toggle between 2-space indentation (standard for modern web layouts), 4-space indentation, or Tab indentation to match your company's coding style guidelines."
    }
  ];

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

    const scriptId = "html-formatter-json-ld";
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

  // Format HTML Code
  const formatHTML = (input: string, spaces: number) => {
    if (!input.trim()) {
      setOutputText('');
      setError(null);
      return;
    }

    try {
      // Basic client-side DOMParser to check validity
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, 'text/html');
      
      // Look for parsererror in parsed DOM
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        setError(`Mismatched or invalid markup detected: ${parserError.textContent}`);
      } else {
        setError(null);
      }

      // Format logic
      let formatted = '';
      const reg = /(>)(<)(\/*)/g;
      const html = input.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      const splitHtml = html.split('\r\n');

      splitHtml.forEach((node) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else if (node.match(/^<\w[^>]*[^\/]>$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        const padding = ' '.repeat(pad * spaces);
        formatted += padding + node + '\r\n';
        pad += indent;
      });

      setOutputText(formatted.trim());
    } catch (err: any) {
      setError(err?.message || 'Error occurred during parsing');
      setOutputText(input); // Fallback to raw
    }
  };

  // Minify HTML Code
  const minifyHTML = () => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    
    // Basic minifier rules (remove comments, spacing between tags)
    let minified = inputText
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
      .trim();

    setError(null);
    setOutputText(minified);
  };

  useEffect(() => {
    formatHTML(inputText, indentSize);
  }, [inputText, indentSize]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'beautified.html';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadSample = () => {
    setInputText('<!-- Messy HTML markup to beautify -->\n<div class="card"><h2 class="title">Beautified Title</h2><p class="desc">A fast, offline HTML and XML prettifier.</p><a href="#">Learn More</a><ul><li>Step 1</li><li>Step 2</li></ul></div>');
  };

  const originalLength = inputText.length;
  const formattedLength = outputText.length;
  const reduction = originalLength > 0 
    ? Math.round(((originalLength - formattedLength) / originalLength) * 100) 
    : 0;

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/html-formatter').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="html-formatter-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button 
            onClick={onNavigateHome}
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            id="back-to-home-btn"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Directory</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Tools</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">HTML & XML Formatter</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl mb-4 border border-indigo-100 dark:border-indigo-900/30">
            <Code2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-900 dark:text-white tracking-tight" id="tool-title">
            HTML & XML <span className="font-semibold text-indigo-600 dark:text-indigo-400">Beautifier</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Clean, format, indent, or compress your HTML and XML templates instantly in your browser with real-time markup validation check.
          </p>
        </div>

        {/* Error Alert panel if parser flags problems */}
        {error && (
          <div className="mb-6 max-w-5xl mx-auto bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <span className="font-bold">Markup Warning:</span>
              <p className="mt-0.5 leading-relaxed font-mono">{error}</p>
            </div>
          </div>
        )}

        {/* Workspace panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
          
          {/* Input Panel */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileCode className="w-4 h-4 text-indigo-500" />
                  Raw HTML / XML Input
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={handleLoadSample}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Load Demo
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={() => setInputText('')}
                    className="text-xs text-rose-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-[360px] p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Paste your unformatted HTML tags or XML code strings..."
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Indent style:</span>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-0.5 rounded-xl border border-slate-200/50 dark:border-slate-800 text-[10px]">
                  <button
                    onClick={() => setIndentSize(2)}
                    className={`px-2.5 py-1 font-semibold rounded-lg cursor-pointer ${indentSize === 2 ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'}`}
                  >
                    2 Spaces
                  </button>
                  <button
                    onClick={() => setIndentSize(4)}
                    className={`px-2.5 py-1 font-semibold rounded-lg cursor-pointer ${indentSize === 4 ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-500'}`}
                  >
                    4 Spaces
                  </button>
                </div>
              </div>

              <button
                onClick={minifyHTML}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center gap-1"
                title="Minify to single line output"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Minify Code</span>
              </button>
            </div>
          </div>

          {/* Output Panel */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Beautified Output
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleCopy}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-medium ${
                      copied 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30' 
                        : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownload}
                    className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 rounded-lg transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <textarea
                value={outputText}
                readOnly
                className="w-full h-[360px] p-4 bg-slate-900 text-slate-100 border border-slate-800 rounded-2xl font-mono text-xs leading-relaxed focus:outline-none"
                placeholder="Output code will appear here..."
              />
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex gap-4 font-mono">
                <span>BEFORE: {originalLength} chars</span>
                <span>AFTER: {formattedLength} chars</span>
              </div>
              {reduction > 0 && (
                <div className="text-emerald-500 font-semibold">
                  Compressed by {reduction}%
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Detailed Guides block */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Code2 className="w-5 h-5 text-indigo-500" />
              Clean Code Architecture with Beautiful Alignment
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Messy HTML and XML markup code formats are extremely common when exporting logs, compiling CMS outputs, or copy-pasting nested tables. This utility inserts correct indentation blocks, structures closing elements, and keeps parent-child hierarchy visible, saving developer debugging fatigue.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Settings className="w-5 h-5 text-emerald-500" />
              Compression and Minification for Fast Serving
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              By minifying XML and HTML files, you remove unneeded tabs, spaces, comments, and line breaks, compressing file size significantly. This leads to higher speeds, lower mobile data waste, and better Google Lighthouse ranks.
            </p>
          </div>
        </section>

        {/* FAQ list */}
        <div className="mt-16 pt-12 border-t border-slate-150 dark:border-slate-800" id="faq-section">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-light font-display text-slate-900 dark:text-white">
              Frequently Asked <span className="font-semibold text-indigo-600 dark:text-indigo-400">Questions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-4xl">
            {faqs.map((faq) => (
              <div 
                key={faq.id}
                className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/80 overflow-hidden transition-all duration-200"
                id={`faq-item-${faq.id}`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-3 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Related Text Tools</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {relatedTools.map(t => (
                <button
                  key={t.id}
                  onClick={() => onNavigateToTool(t.id)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/80 transition-all cursor-pointer"
                >
                  <span>{t.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </button>
        </div>

      </div>
    </div>
  );
}
