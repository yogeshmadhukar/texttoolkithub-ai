import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import TurndownService from 'turndown';
import { 
  FileCode,
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  Download,
  AlertCircle,
  Sparkles,
  Eye,
  Code,
  FileText,
  Activity,
  Type,
  FileDown
} from 'lucide-react';

interface HtmlToMarkdownViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface HtmlStats {
  charCount: number;
  wordCount: number;
  tagCount: number;
  headingCount: number;
  listCount: number;
  tableCount: number;
}

export default function HtmlToMarkdownView({ onNavigateToTool, onNavigateHome }: HtmlToMarkdownViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'rendered' | 'raw'>('rendered');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Stats computed locally
  const [stats, setStats] = useState<HtmlStats>({
    charCount: 0,
    wordCount: 0,
    tagCount: 0,
    headingCount: 0,
    listCount: 0,
    tableCount: 0,
  });

  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputLinesRef = useRef<HTMLDivElement>(null);

  const inputLineCount = inputText.split('\n').length;

  const handleInputScroll = () => {
    if (inputTextAreaRef.current && inputLinesRef.current) {
      inputLinesRef.current.scrollTop = inputTextAreaRef.current.scrollTop;
    }
  };

  // SEO config
  const seoTitle = "HTML to Markdown Converter Online";
  const seoDescription = "Convert HTML into Markdown instantly with our free online HTML to Markdown converter. Real-time side-by-side editing, statistics reporting, and secure offline-first conversion.";

  const faqs = [
    {
      id: 1,
      question: "What is the HTML to Markdown Converter?",
      answer: "The HTML to Markdown Converter is a modern, high-fidelity online developer utility that translates raw HTML markup snippets into cleaner, lighter, and more coherent Markdown syntax. It is compiled fully inside your browser sandbox."
    },
    {
      id: 2,
      question: "What HTML structures can this converter handle?",
      answer: "It handles standard header classes (<h1> through <h6>), list trees (<ul>, <ol>, <li>), hyperlink attributes (<a>), table cells (<table>, <tr>, <th>, <td>), quote partitions (<blockquote>), block and inline code blocks (<pre>, <code>), italic/bold spans (<em>, <strong>), visual graphics (<img>), and horizontal dividers (<hr>)."
    },
    {
      id: 3,
      question: "Does this utility upload my proprietary source documents?",
      answer: "No. Your security code is protected. All parsing operations utilize high-speed TypeScript structures locally within your computer memory client-side. Absolutely zero packet transit or external API triggers take place."
    },
    {
      id: 4,
      question: "Why should I convert HTML back to Markdown format?",
      answer: "Markdown is highly readable, readable as raw text, and dramatically simpler to edit. It is the gold standard for readme documentation files, content management drafts, github issue boards, static engine blogs (such as Jekyll or Hugo), and developer notes."
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

    const scriptId = "html-converter-json-ld";
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

  // Compute stat matrices from original raw HTML input
  const parseHtmlStats = (rawHtml: string) => {
    if (!rawHtml.trim()) {
      setStats({
        charCount: 0,
        wordCount: 0,
        tagCount: 0,
        headingCount: 0,
        listCount: 0,
        tableCount: 0
      });
      return;
    }

    const charCount = rawHtml.length;
    
    // Simple text word estimator (stripping tags for cleaner tallying)
    const textOnly = rawHtml.replace(/<[^>]*>/g, ' ');
    const words = textOnly.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Count Tag categories
    const allTags = rawHtml.match(/<[a-zA-Z0-9!-]+/g) || [];
    const tagCount = allTags.length;

    const headings = rawHtml.match(/<h[1-6]\b[^>]*>/gi) || [];
    const headingCount = headings.length;

    const lists = rawHtml.match(/<(ul|ol)\b[^>]*>/gi) || [];
    const listCount = lists.length;

    const tables = rawHtml.match(/<table\b[^>]*>/gi) || [];
    const tableCount = tables.length;

    setStats({
      charCount,
      wordCount,
      tagCount,
      headingCount,
      listCount,
      tableCount
    });
  };

  // Convert HTML using Turndown
  const handleConvert = (htmlInput: string) => {
    if (!htmlInput.trim()) {
      setOutputText('');
      return;
    }

    try {
      // Configuration settings for professional GFM compliance
      const turndownService = new TurndownService({
        headingStyle: 'atx',
        codeBlockStyle: 'fenced',
        emDelimiter: '*',
        strongDelimiter: '**'
      });

      // Keep table structures clean
      turndownService.keep(['table', 'thead', 'tbody', 'tr', 'th', 'td']);

      const markdown = turndownService.turndown(htmlInput);
      setOutputText(markdown);
    } catch (err) {
      console.warn("Turndown conversion encountered error: ", err);
    }
  };

  // Run updates on changes
  useEffect(() => {
    handleConvert(inputText);
    parseHtmlStats(inputText);
    handleInputScroll();
  }, [inputText]);

  const loadExampleHtml = () => {
    const sample = `<article class="premium-post">
  <h1>HTML to Markdown Premium Converter</h1>
  <p>Convert your nested HTML formats into clean Markdown strings instantaneously code-side.</p>
  
  <h2>Why Choose This Compiler?</h2>
  <ul>
    <li>🚀 <strong>Microsecond Execution</strong> is fully browser native.</li>
    <li>🔒 <strong>Maximum Confidentiality</strong> with local client process memory.</li>
    <li>📊 <strong>Tag Counters</strong> compute metadata automatically.</li>
  </ul>

  <h3>Code Snippet Target</h3>
  <pre><code>const turndownService = new TurndownService();
const markdown = turndownService.turndown('&lt;strong&gt;Clean&lt;/strong&gt;');</code></pre>

  <blockquote>
    "This tool is brilliant for content migrations, blog updates, or cleaning layout code templates."
  </blockquote>

  <h3>Performance Statistics Table</h3>
  <table>
    <thead>
      <tr>
        <th>Metric Category</th>
        <th>Value Type</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Server Dependency</td>
        <td>None (Client-Only)</td>
      </tr>
      <tr>
        <td>Memory Load</td>
        <td>Minimal</td>
      </tr>
    </tbody>
  </table>
</article>`;
    setInputText(sample);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setStats({
      charCount: 0,
      wordCount: 0,
      tagCount: 0,
      headingCount: 0,
      listCount: 0,
      tableCount: 0
    });
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
      const blob = new Blob([outputText], { type: 'text/markdown;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = "converted.md";
      anchor.style.display = 'none';

      anchor.onclick = (e) => {
        e.stopPropagation();
      };

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.warn("Failed to download Markdown file:", err);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300 min-h-screen py-6 px-4 md:px-8 font-sans">
      
      {/* Path Breadcrumbs & Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
          <button 
            id="html-md-bc-home"
            onClick={onNavigateHome} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button 
            id="html-md-bc-converters"
            onClick={() => onNavigateToTool('tools')} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Converters
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-400">HTML to Markdown</span>
        </div>

        {/* Back and examples triggers list */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="html-back-home-btn"
              onClick={onNavigateHome}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow"
              title="Home viewport"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <FileCode className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                HTML to Markdown Converter
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Render and translate clean HTML layout assets back to lightweight Markdown formatting specs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="html-load-example-btn"
              onClick={loadExampleHtml}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-950/80 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Advanced Example
            </button>
            <button
              id="html-clear-btn"
              onClick={handleClear}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Clear Inputs
            </button>
          </div>
        </div>
      </div>

      {/* Real-time statistics summaries */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div id="html-stat-chars" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Characters</div>
          <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-250 mt-1">{stats.charCount}</div>
        </div>
        <div id="html-stat-words" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Words</div>
          <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-250 mt-1">{stats.wordCount}</div>
        </div>
        <div id="html-stat-tags" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Markup Tags</div>
          <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-250 mt-1">{stats.tagCount}</div>
        </div>
        <div id="html-stat-headings" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Headings</div>
          <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">{stats.headingCount}</div>
        </div>
        <div id="html-stat-lists" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lists</div>
          <div className="text-lg font-bold font-mono text-slate-850 dark:text-slate-255 mt-1">{stats.listCount}</div>
        </div>
        <div id="html-stat-tables" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tables</div>
          <div className="text-lg font-bold font-mono text-amber-500 dark:text-amber-500 mt-1">{stats.tableCount}</div>
        </div>
      </div>

      {/* Core Split-Screen Editor Workspace */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
        
        {/* Left Hand: HTML code editor box */}
        <div id="html-editor-container" className="flex flex-col bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                HTML Input Code
              </h2>
            </div>
            
            <span className="text-xs text-slate-400 font-mono">Lines: <strong className="text-slate-600 dark:text-slate-300">{inputLineCount}</strong></span>
          </div>

          <div className="flex-1 flex overflow-hidden min-h-[420px] bg-white dark:bg-[#0e131f]">
            {/* Left line tracker gutter */}
            <div 
              ref={inputLinesRef}
              className="w-12 text-right pr-3 pl-1 py-4 bg-slate-50/70 dark:bg-slate-900/10 text-slate-300 dark:text-slate-650 font-mono text-xs select-none border-r border-slate-100 dark:border-slate-850/40 overflow-hidden leading-[1.62]"
            >
              {Array.from({ length: Math.max(inputLineCount, 1) }).map((_, idx) => (
                <div key={idx} className="h-[1.62rem]">{idx + 1}</div>
              ))}
            </div>

            <textarea
              id="html-raw-textarea"
              ref={inputTextAreaRef}
              onScroll={handleInputScroll}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Paste your HTML container code here...\n\nExample:\n<h1>My Topic</h1>\n<p>This is a <strong>bold</strong> phrase.</p>\n<ul>\n  <li>List item 1</li>\n</ul>`}
              className="flex-1 outline-none border-none p-4 font-mono text-xs text-slate-700 dark:text-slate-300 bg-transparent resize-none leading-[1.62] h-full overflow-y-auto block whitespace-pre"
              spellCheck="false"
            />
          </div>

          <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/10 border-t border-slate-200 dark:border-slate-850 font-mono text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Supports tags, spans, formatted matrices, code blocks and tabular metrics</span>
            <span className="hidden sm:inline">Compiled instantly side-by-side</span>
          </div>
        </div>

        {/* Right Hand: Output Live Preview & Code inspector */}
        <div id="html-output-container" className="flex flex-col bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          
          {/* Header layout toggles */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Markdown Output Code
              </span>
            </div>

            <div className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-1 rounded tracking-wide uppercase">
              Converted Result
            </div>
          </div>

          {/* Main workspace pane */}
          <div className="flex-1 bg-[#fff] dark:bg-[#0c0f16] overflow-y-auto min-h-[420px] select-text">
            <textarea
              readOnly
              value={outputText}
              placeholder={`# Output Markdown code will compile here...\n\n- Lists, tables, and typography preserve cleanly.`}
              className="w-full h-full min-h-[420px] p-5 font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-slate-950/5 outline-none border-none resize-none leading-relaxed block select-all whitespace-pre-wrap break-all"
            />
          </div>

          {/* Controls row */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
              Client Safe • No Servers
            </span>

            <div className="flex items-center gap-2">
              <button
                id="html-markdown-copy-btn"
                disabled={!outputText}
                onClick={handleCopy}
                className={`text-xs px-4 py-2 font-semibold rounded-lg border flex items-center gap-2 transition-all ${
                  !outputText
                    ? 'bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm'
                }`}
                title="Copy converted Markdown Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied Markdown!' : 'Copy Markdown'}
              </button>

              <button
                id="html-markdown-download-btn"
                disabled={!outputText}
                onClick={handleDownload}
                className={`text-xs px-4 py-2 font-semibold rounded-lg flex items-center gap-2 transition-all ${
                  !outputText
                    ? 'bg-slate-100 dark:bg-slate-850/55 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white shadow shadow-indigo-600/10'
                }`}
              >
                <Download className="w-4 h-4" />
                Download Markdown
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions Guide FAQs segment */}
      <div className="max-w-7xl mx-auto mt-12 bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Instructions & Conversion Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800 pb-6 mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-sans">Common Conversions mapped:</h3>
            <div className="font-mono text-xs bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150 dark:border-slate-805 space-y-2 text-slate-700 dark:text-slate-350">
              <p><span>&lt;h1&gt;Header&lt;/h1&gt;</span> → <span className="text-indigo-600 dark:text-indigo-400"># Header</span></p>
              <p><span>&lt;strong&gt;text&lt;/strong&gt;</span> → <span className="text-indigo-600 dark:text-indigo-400">**text**</span></p>
              <p><span>&lt;a href="url"&gt;link&lt;/a&gt;</span> → <span className="text-indigo-600 dark:text-indigo-400">[link](url)</span></p>
              <p><span>&lt;ul&gt;&lt;li&gt;item&lt;/li&gt;&lt;/ul&gt;</span> → <span className="text-indigo-600 dark:text-indigo-400">- item</span></p>
              <p><span>&lt;blockquote&gt;quote&lt;/blockquote&gt;</span> → <span className="text-indigo-600 dark:text-indigo-400">&gt; quote</span></p>
              <p><span>&lt;img src="path"&gt;</span> → <span className="text-indigo-600 dark:text-indigo-400">![alt](path)</span></p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-sans">Strict Parsing Architecture</h3>
            <p className="leading-relaxed mb-3">
              We leverage clean JavaScript token scanning trees which allow heavy HTML markup tags, inline wrapper attributes, styles, classes, and comments to be parsed without breaking paragraphs.
            </p>
            <p className="leading-relaxed">
              This client architecture lets developers safely clean generated markup from visual page builders, rich-text WYSIWYG editors, or nested online blog databases with zero data leaks or latency.
            </p>
          </div>
        </div>

        {/* Dynamic FAQs accordion segment */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map(faq => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                className="border border-slate-150 dark:border-slate-805 p-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
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
