import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { marked } from 'marked';
import { sanitizeHtml } from '../utils/security.ts';
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
  FileText,
  Activity,
  Maximize2,
  Minimize2,
  Sparkles,
  RefreshCw,
  Terminal,
  Eye,
  Code,
  Code2,
  FileCheck,
  List
} from 'lucide-react';

interface MarkdownToHtmlViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface MarkdownStats {
  charCount: number;
  wordCount: number;
  paragraphCount: number;
  headingCount: number;
  listCount: number;
  codeBlockCount: number;
}

export default function MarkdownToHtmlView({ onNavigateToTool, onNavigateHome }: MarkdownToHtmlViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'rendered' | 'html'>('rendered');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Stats computed locally
  const [stats, setStats] = useState<MarkdownStats>({
    charCount: 0,
    wordCount: 0,
    paragraphCount: 0,
    headingCount: 0,
    listCount: 0,
    codeBlockCount: 0
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const inputLinesRef = useRef<HTMLDivElement>(null);

  const inputLineCount = inputText.split('\n').length;

  const handleInputScroll = () => {
    if (inputTextAreaRef.current && inputLinesRef.current) {
      inputLinesRef.current.scrollTop = inputTextAreaRef.current.scrollTop;
    }
  };

  // SEO config
  const seoTitle = "Markdown to HTML Converter Online | TextToolkitHub";
  const seoDescription = "Convert Markdown into clean HTML instantly with live preview and one-click export. Full support for lists, tables, codes, headings, quotes, and images.";

  const faqs = [
    {
      id: 1,
      question: "What is the Markdown to HTML Converter?",
      answer: "The Markdown to HTML Converter is a premium browser-native utility designed to instantly compile standard Markdown markup files into semantic, production-ready HTML code. It offers immediate side-by-side split screen previews, code inspection, and download exports."
    },
    {
      id: 2,
      question: "What elements are supported during conversion?",
      answer: "The parsing system fully supports standard GFM (GitHub Flavored Markdown) components, including all heading sizes (H1 - H6), bulleted and numbered lists, anchor links, styled tables, blockquotes, inline and block code sections, image declarations, bold/italic highlights, and horizontal rulers."
    },
    {
      id: 3,
      question: "Does this tool use a database or send code to an API server?",
      answer: "No! All processes compile instantly in your browser's local sandbox memory using high-speed client-side processors. Absolutely no text payload is transmitted to any cloud servers or trackers, preserving the integrity of proprietary documentation drafts."
    },
    {
      id: 4,
      question: "How are the count statistics calculated?",
      answer: "The analyzer scans the raw Markdown string in real-time. It counts total characters and total words, parses newlines to assess paragraphs, detects lines initiating with '#' tags for headings, lists via asterisks/numbers, and triple backticks (```) for code blocks."
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

    const scriptId = "markdown-converter-json-ld";
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

  // Compute stats on-the-fly
  const parseMarkdownStats = (rawMarkdown: string) => {
    if (!rawMarkdown.trim()) {
      setStats({
        charCount: 0,
        wordCount: 0,
        paragraphCount: 0,
        headingCount: 0,
        listCount: 0,
        codeBlockCount: 0
      });
      return;
    }

    const charCount = rawMarkdown.length;
    const words = rawMarkdown.trim().split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Split by empty lines to find real paragraphs
    const paragraphs = rawMarkdown.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const paragraphCount = paragraphs.length;

    const lines = rawMarkdown.split('\n');
    let headingCount = 0;
    let listCount = 0;
    let codeBlockCount = 0;
    let inCodeBlock = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Headings check
      if (trimmed.startsWith('#')) {
        const match = trimmed.match(/^#{1,6}\s/);
        if (match) headingCount++;
      }

      // Lists check (bullet point or numbered)
      if (/^[-*+]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed)) {
        listCount++;
      }

      // Block Code blocks check
      if (trimmed.startsWith('```')) {
        if (!inCodeBlock) {
          codeBlockCount++;
          inCodeBlock = true;
        } else {
          inCodeBlock = false;
        }
      }
    });

    setStats({
      charCount,
      wordCount,
      paragraphCount,
      headingCount,
      listCount,
      codeBlockCount
    });
  };

  // Live Conversion
  const handleConvert = (markdownInput: string) => {
    if (!markdownInput.trim()) {
      setOutputText('');
      return;
    }

    try {
      // Synchronous client compile using marked
      const compiledHTML = marked.parse(markdownInput, { async: false });
      const safeHTML = sanitizeHtml(compiledHTML as string);
      setOutputText(safeHTML);
    } catch (err) {
      console.warn("Markdown parsing encounter error: ", err);
    }
  };

  // Convert on input changes
  useEffect(() => {
    handleConvert(inputText);
    parseMarkdownStats(inputText);
    handleInputScroll();
  }, [inputText]);

  const loadExampleMarkdown = () => {
    const sample = `# Markdown to HTML Converter Demo 🚀

TextToolkitHub delivers immediate compilation of GFM structures with absolute offline local privacy!

## Key Tool Features Included:
- **Real-time Live Previews**: View changes dynamically side-by-side.
- **Accurate Statistics Tracker**: Measure paragraph limits, heading tallies, and words.
- **Full styling layout sheets**: Rendered typography adjusts automatically in dark mode.

### Sample Code Block
\`\`\`html
<div class="developer-box">
  <p>Hello web developer! Copy this clean HTML code instantly.</p>
</div>
\`\`\`

### Styled GFM Table Example

| Metric Class | Client Output | Speed Rating | Secure |
| :--- | :---: | :---: | :---: |
| Latency | Sub-milliseconds | Maximum | 100% |
| API Dependency | None | Independent | 100% |

> "This is a premium, lightweight tool to convert drafts easily without typical server transit leaks."

Enjoy converting text structures locally with zero data leakages!
`;
    setInputText(sample);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setStats({
      charCount: 0,
      wordCount: 0,
      paragraphCount: 0,
      headingCount: 0,
      listCount: 0,
      codeBlockCount: 0
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
      const blob = new Blob([outputText], { type: 'text/html;charset=utf-8' });
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = "converted.html";
      anchor.style.display = 'none';

      anchor.onclick = (e) => {
        e.stopPropagation();
      };

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.warn("Failed to download HTML file:", err);
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300 min-h-screen py-6 px-4 md:px-8 font-sans">
      {/* Dynamic CSS injections to make preview element styling beautiful */}
      <style>{`
        .markdown-preview-area h1 { font-size: 1.8em; font-weight: 700; margin-top: 0.5em; margin-bottom: 0.5em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
        .markdown-preview-area h2 { font-size: 1.4em; font-weight: 600; margin-top: 1.25em; margin-bottom: 0.5em; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.2em; }
        .markdown-preview-area h3 { font-size: 1.2em; font-weight: 600; margin-top: 1.1em; margin-bottom: 0.4em; }
        .markdown-preview-area p { margin-bottom: 1em; line-height: 1.62; }
        .markdown-preview-area ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1em; }
        .markdown-preview-area ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1em; }
        .markdown-preview-area li { margin-bottom: 0.3rem; }
        .markdown-preview-area a { color: #4338ca; text-decoration: underline; font-weight: 500; }
        .markdown-preview-area blockquote { border-left: 4px solid #4f46e5; padding-left: 1em; color: #475569; font-style: italic; margin: 1.2em 0; background-color: #f8fafc; padding-top: 0.5rem; padding-bottom: 0.5rem; border-top-right-radius: 4px; border-bottom-right-radius: 4px; }
        .markdown-preview-area table { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-size: 0.9em; }
        .markdown-preview-area th { background-color: #f1f5f9; border: 1px solid #e2e8f0; padding: 8px 12px; font-weight: 600; text-align: left; }
        .markdown-preview-area td { border: 1px solid #e2e8f0; padding: 8px 12px; }
        .markdown-preview-area pre { background-color: #0f172a; color: #f8fafc; padding: 1.1em; border-radius: 8px; overflow-x: auto; font-family: monospace; font-size: 0.85em; margin: 1.2em 0; }
        .markdown-preview-area code { background-color: #e2e8f0; color: #1e293b; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 0.9em; font-weight: 500; }
        .markdown-preview-area pre code { background-color: transparent; color: inherit; padding: 0; border-radius: 0; font-size: inherit; font-weight: normal; }
        .markdown-preview-area img { max-width: 100%; height: auto; border-radius: 6px; margin: 1.2em 0; }
        .markdown-preview-area hr { border: 0; border-top: 1.5px solid #e2e8f0; margin: 1.5em 0; }
        
        /* Dark mode overrides */
        .dark .markdown-preview-area h1,
        .dark .markdown-preview-area h2 { border-color: #1e293b; color: #f1f5f9; }
        .dark .markdown-preview-area h3 { color: #f1f5f9; }
        .dark .markdown-preview-area p { color: #cbd5e1; }
        .dark .markdown-preview-area a { color: #818cf8; }
        .dark .markdown-preview-area blockquote { border-color: #6366f1; color: #94a3b8; background-color: #0f172a/40; }
        .dark .markdown-preview-area th { background-color: #1e293b; border-color: #334155; color: #f1f5f9; }
        .dark .markdown-preview-area td { border-color: #334155; color: #cbd5e1; }
        .dark .markdown-preview-area code { background-color: #1e293b; color: #cbd5e1; }
        .dark .markdown-preview-area pre code { background-color: transparent; color: inherit; }
        .dark .markdown-preview-area hr { border-color: #334155; }
      `}</style>

      {/* Path Breadcrumbs & Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
          <button 
            id="md-html-bc-home"
            onClick={onNavigateHome} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button 
            id="md-html-bc-converters"
            onClick={() => onNavigateToTool('tools')} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Converters
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-400">Markdown to HTML</span>
        </div>

        {/* Back and examples triggers list */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="markdown-back-home-btn"
              onClick={onNavigateHome}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow"
              title="Home viewport"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <FileCode className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                Markdown to HTML Converter
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Author Markdown documentation and output optimized, responsive semantic HTML code with zero latency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="markdown-load-example-btn"
              onClick={loadExampleMarkdown}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-950/80 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Premium Sample
            </button>
            <button
              id="markdown-clear-btn"
              onClick={handleClear}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-605 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Real-time statistics summaries */}
      <div className="max-w-7xl mx-auto mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div id="md-stat-chars" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Characters</div>
          <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-250 mt-1">{stats.charCount}</div>
        </div>
        <div id="md-stat-words" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Words</div>
          <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-250 mt-1">{stats.wordCount}</div>
        </div>
        <div id="md-stat-paragraphs" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Paragraphs</div>
          <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-250 mt-1">{stats.paragraphCount}</div>
        </div>
        <div id="md-stat-headings" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Headings</div>
          <div className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 mt-1">{stats.headingCount}</div>
        </div>
        <div id="md-stat-lists" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">List Rows</div>
          <div className="text-lg font-bold font-mono text-slate-850 dark:text-slate-255 mt-1">{stats.listCount}</div>
        </div>
        <div id="md-stat-codeblocks" className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 p-3.5 rounded-xl shadow-sm">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Code Blocks</div>
          <div className="text-lg font-bold font-mono text-amber-500 dark:text-amber-500 mt-1">{stats.codeBlockCount}</div>
        </div>
      </div>

      {/* Core Split-Screen Editor Workspace */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-8">
        
        {/* Left Hand: Markdown editor box */}
        <div id="markdown-editor-container" className="flex flex-col bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Markdown Editor (Input)
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
              id="markdown-raw-textarea"
              ref={inputTextAreaRef}
              onScroll={handleInputScroll}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Write or paste your Markdown here...\n\nExample:\n# Heading 1\n## Heading 2\n- Simple list item\n- Another list item\n\n**Bold Text** and [Anchor Link](https://google.com)`}
              className="flex-1 outline-none border-none p-4 font-mono text-xs text-slate-700 dark:text-slate-300 bg-transparent resize-none leading-[1.62] h-full overflow-y-auto block whitespace-pre"
              spellCheck="false"
            />
          </div>

          <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/10 border-t border-slate-200 dark:border-slate-850 font-mono text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Supports standard headings, code fragments, bold items, quotes, tables, lists, links</span>
            <span className="hidden sm:inline">Press compile or type freely</span>
          </div>
        </div>

        {/* Right Hand: Output Live Preview & Code inspector */}
        <div id="markdown-output-container" className="flex flex-col bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[500px]">
          
          {/* Header layout toggles */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40">
            <div className="bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg flex gap-0.5">
              <button
                id="markdown-rendered-tab"
                onClick={() => setActiveTab('rendered')}
                className={`px-3.5 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'rendered' 
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Preview
              </button>
              <button
                id="markdown-code-tab"
                onClick={() => setActiveTab('html')}
                className={`px-3.5 py-1.5 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'html' 
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                HTML Source Code
              </button>
            </div>

            <div className="text-[10px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-1 rounded tracking-wide uppercase">
              Real-time Output
            </div>
          </div>

          {/* Main workspace pane */}
          <div className="flex-1 bg-[#fff] dark:bg-[#0c0f16] overflow-y-auto min-h-[420px] select-text">
            {activeTab === 'rendered' ? (
              // Live styled preview window
              <div id="markdown-rendered-viewport" className="p-6 markdown-preview-area max-w-none text-slate-700 dark:text-slate-300">
                {outputText.trim() ? (
                  <div dangerouslySetInnerHTML={{ __html: outputText }} />
                ) : (
                  <div className="text-slate-400 italic text-xs py-8 text-center bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-dashed border-slate-150 dark:border-slate-800">
                    Your formatted rendered document preview will show up here as you type.
                  </div>
                )}
              </div>
            ) : (
              // HTML Raw markup output scroll view
              <div id="markdown-html-viewport" className="relative h-full flex flex-col">
                <textarea
                  readOnly
                  value={outputText}
                  placeholder={`<div class="sample">\n  <h1>Output code will output here</h1>\n</div>`}
                  className="w-full h-full min-h-[420px] p-5 font-mono text-xs text-indigo-600 dark:text-indigo-400 bg-slate-950/5 outline-none border-none resize-none leading-relaxed block select-all whitespace-pre-wrap break-all"
                />
              </div>
            )}
          </div>

          {/* Controls row */}
          <div className="p-3 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
              Client Safe • No Servers
            </span>

            <div className="flex items-center gap-2">
              <button
                id="markdown-copy-btn"
                disabled={!outputText}
                onClick={handleCopy}
                className={`text-xs px-4 py-2 font-semibold rounded-lg border flex items-center gap-2 transition-all ${
                  !outputText
                    ? 'bg-slate-100 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 shadow-sm'
                }`}
                title="Copy generated HTML Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied HTML!' : 'Copy HTML'}
              </button>

              <button
                id="markdown-download-btn"
                disabled={!outputText}
                onClick={handleDownload}
                className={`text-xs px-4 py-2 font-semibold rounded-lg flex items-center gap-2 transition-all ${
                  !outputText
                    ? 'bg-slate-100 dark:bg-slate-850/55 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white shadow shadow-indigo-600/10'
                }`}
              >
                <Download className="w-4 h-4" />
                Download HTML
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions Guide FAQs segment */}
      <div className="max-w-7xl mx-auto mt-12 bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Instructions & Syntax Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800 pb-6 mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-sans">Common Markdown syntax:</h3>
            <div className="font-mono text-xs bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150 dark:border-slate-805 space-y-2">
              <p><span className="text-indigo-600 dark:text-indigo-400"># Heading 1</span></p>
              <p><span className="text-indigo-600 dark:text-indigo-400">## Heading 2</span></p>
              <p>This is <span className="text-indigo-605 dark:text-indigo-405">**bold text**</span> and <span className="text-indigo-600 dark:text-indigo-400">*italic text*</span></p>
              <p><span className="text-indigo-600 dark:text-indigo-400">- Bullet List Item 1</span></p>
              <p><span className="text-indigo-600 dark:text-indigo-400">1. Numbered List Item 1</span></p>
              <p><span className="text-indigo-600 dark:text-indigo-400">&gt; This represents a quote segment</span></p>
              <p><span className="text-indigo-600 dark:text-indigo-400">Inline code: \`const test = "val"\`</span></p>
              <p><span className="text-indigo-600 dark:text-indigo-400">[Google Link](https://google.com)</span></p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 font-sans">Premium Code Generation</h3>
            <p className="leading-relaxed mb-3">
              The compiled HTML follows semantic styling structure so that you can drop the generated layout strings straight into your own content management systems, blogs, static site generators, and emails.
            </p>
            <p className="leading-relaxed">
              No remote servers process any segment of your files. All analytics calculators, word parsers, code block matching, and compilation are loaded locally inside your browser sandbox viewport.
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
