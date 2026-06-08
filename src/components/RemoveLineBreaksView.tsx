import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  AlignLeft, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  ArrowUpRight, 
  Globe, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Info
} from 'lucide-react';

interface RemoveLineBreaksViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function RemoveLineBreaksView({ onNavigateToTool, onNavigateHome }: RemoveLineBreaksViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Formatting configurations mapping
  const [mode, setMode] = useState<'remove' | 'space'>('space'); // 'remove' = remove completely, 'space' = replace with space
  const [preserveParagraphs, setPreserveParagraphs] = useState<boolean>(true);

  // SEO Parameters as requested
  const seoTitle = "Remove Line Breaks Online Free";
  const seoDescription = "Remove line breaks, paragraph breaks and unwanted formatting from text instantly.";

  // Collapsible FAQ list
  const faqs = [
    {
      id: 1,
      question: "Why do line breaks appear in copied PDF texts?",
      answer: "PDF layouts are formatted using hard coordinate boundaries. When you copy sentences from a double-column paper or narrow PDF column, the system treats each line wrap as an intentional carriage return (\\n). This causes disjointed text when pasting into Microsoft Word, Google Docs, or text translation utilities."
    },
    {
      id: 2,
      question: "What is the 'Preserve Paragraphs' option?",
      answer: "This is a specialized smart mode. When turned on, the utility preserves double returns (\\n\\n) which represent intentional paragraph separations, while cleansing single line wraps inside your content block. This bridges sentences effortlessly while maintaining structural organization."
    },
    {
      id: 3,
      question: "What is the difference between removing and replacing with spaces?",
      answer: "Removing line breaks completely fuses sentences directly together (e.g., 'word1\\nword2' becomes 'word1word2'). Replacing with spaces bridges them with a standard space character (e.g., becomes 'word1 word2'). Spaces are recommended for standard e-mail copies or PDF paragraphs."
    },
    {
      id: 4,
      question: "Is there an input length restriction?",
      answer: "No. Absolutely all sanitization operations run on client-side JS memory modules inside your sandbox browser container. There are no size maximum limits. You can process heavy reports, books, or emails with total privacy."
    },
    {
      id: 5,
      question: "Is my cleared text accessible to anyone else?",
      answer: "Never. We do not use remote databases or analytics engines. All files, metrics, and formatted outputs operate on your hardware without external network queries."
    }
  ];

  // Dynamic SEO Setup & Schema-FAQ JSON-LD Injection
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
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };

    const scriptId = "remove-breaks-json-ld";
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

  // Run formatting core processor whenever input or configuration shifts
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let processed = inputText;

    // Standardize all line breaks to standard '\n'
    processed = processed.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    if (preserveParagraphs) {
      // 1. Isolate double line breaks (paragraphs marker) with a unique secure hash key
      const paraMarker = '___PARAGRAPH_MARKER_xyz_123___';
      processed = processed.replace(/\n\s*\n/g, paraMarker);

      // 2. Erase or replace single line breaks inside paragraphs
      if (mode === 'space') {
        processed = processed.replace(/\n/g, ' ');
      } else {
        processed = processed.replace(/\n/g, '');
      }

      // 3. Keep consecutive spaces clean (collapse standard double spaces caused by space replacements)
      processed = processed.replace(/[ \t]+/g, ' ');

      // 4. Restore paragraph markers back into clean double line returns
      const paragraphs = processed.split(paraMarker);
      processed = paragraphs
        .map(p => p.trim())
        .filter(p => p.length > 0)
        .join('\n\n');
    } else {
      // Flatten completely
      if (mode === 'space') {
        processed = processed.replace(/\n/g, ' ');
      } else {
        processed = processed.replace(/\n/g, '');
      }
      // Collapse excessive blank space blocks
      processed = processed.replace(/[ \t]+/g, ' ');
    }

    setOutputText(processed.trim());
  }, [inputText, mode, preserveParagraphs]);

  // Handle Operations
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`TextToolkitHub is an exceptionally quick\nand fully client-side ecosystem.\nOur Remove Line Breaks utility\nis designed specifically to bridge\nsegmented paragraphs together.\n\nHere is an independent second group block\nof text which will stay formatted separately\nif you checked the "Preserve Paragraphs"\ntoggle constraint inside parameters.`);
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText });
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
    setOutputText('');
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
      console.warn('Unable to copy text output: ', err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    try {
      const element = document.createElement('a');
      const file = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(file);
      element.href = url;
      element.download = 'cleaned_text_toolkit_hub.txt';
      document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 150);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.warn('Unable to release download file: ', err);
    }
  };

  // Metric info helpers
  const countNewlines = (str: string) => (str.match(/\n/g) || []).length;
  const inputLineCount = countNewlines(inputText) + (inputText ? 1 : 0);
  const outputLineCount = countNewlines(outputText) + (outputText ? 1 : 0);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Related Tools Display
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/remove-line-breaks' && t.id !== 'remove-line-breaks').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="remove-breaks-page">
      {/* Dynamic glow design features */}
      <div className="glow-accent top-12 left-10"></div>
      <div className="glow-accent top-96 right-20"></div>

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
            onClick={onNavigateHome}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400">Remove Line Breaks</span>
        </div>

        {/* Master Column Header block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <AlignLeft className="w-7 h-7 text-indigo-500" />
              </span>
              Remove Line Breaks Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Format, bridge, and clean messy line wraps from PDFs, scanned OCR documents, or old emails into polished paragraph blocks in real-time.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Simulated Google Search Preview */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Live Google Rank Preview
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/remove-line-breaks
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Tool Options Configuration Panel */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 p-5 mb-8 flex flex-col md:flex-row flex-wrap items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col gap-1.5 self-start md:self-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Formatting Algorithm Options</span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select how newline tags are processed dynamically.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            {/* Mode Radios */}
            <div className="flex border border-slate-250 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 p-1">
              <button
                onClick={() => setMode('space')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'space' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                id="opt-mode-space"
              >
                Replace with Spaces
              </button>
              <button
                onClick={() => setMode('remove')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'remove' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'}`}
                id="opt-mode-remove"
              >
                Remove Completely
              </button>
            </div>

            {/* Preserve Paragraph Checkbox */}
            <label 
              className="flex items-center gap-2 px-3.5 py-2 border border-slate-250 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-850 select-none text-xs font-bold text-slate-750 dark:text-slate-200 transition-all"
              id="opt-preserve-label"
            >
              <input
                type="checkbox"
                checked={preserveParagraphs}
                onChange={(e) => setPreserveParagraphs(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-350 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
              />
              Preserve Paragraph Markers (\n\n)
            </label>
          </div>
        </div>

        {/* Master Workspace Section (Input and Output Comparators) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* INPUT PORTAL */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-550 rounded-full"></span> Source Document Input
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5" /> Load PDF Sample
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Paste messy copy scripts, scanned rows, list items or standard e-mails here with carriage returns..."
                className="w-full p-5 min-h-[350px] md:min-h-[440px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="remove-breaks-input"
              />

              {/* Input Analytics Indicators */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div className="flex gap-4">
                  <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>
                  <span>Lines: <strong className="text-slate-700 dark:text-slate-200">{inputLineCount}</strong></span>
                </div>
                
                <div className="flex items-center gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-650 hover:text-slate-850 dark:text-slate-350 dark:hover:text-white flex items-center gap-0.5"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Undo Action
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-35"
                    id="btn-clear"
                  >
                    Clear Workspace
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT PORTAL */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Formatted Clean Outputs
              </span>
              
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Synchronized Live
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <textarea
                value={outputText}
                readOnly
                placeholder="Synchronously formatted outputs will map live here..."
                className="w-full p-5 min-h-[350px] md:min-h-[440px] border-0 outline-none text-base text-slate-700 dark:text-slate-250 bg-slate-50/20 dark:bg-slate-900/10 resize-y font-sans leading-relaxed"
                id="remove-breaks-output"
              />

              {/* Output Controls Bar */}
              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-4 text-xs text-slate-400 font-medium">
                  <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{outputText.length}</strong></span>
                  <span>Lines: <strong className="text-slate-700 dark:text-slate-200">{outputLineCount}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Download output file */}
                  <button
                    onClick={handleDownload}
                    disabled={!outputText}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-650 hover:text-slate-850 dark:text-slate-300 dark:hover:text-white rounded-xl transition disabled:opacity-35 flex items-center gap-1 text-xs font-bold"
                    id="btn-download"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {downloaded ? 'Downloaded!' : 'Download .txt'}
                  </button>

                  {/* Copy button */}
                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/20 dark:text-indigo-400'}`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Output
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COMPREHENSIVE TEXT SECTIONS (Usage Guide & Editorial) */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Segment 1: Usage Guide */}
          <div id="usage-guide">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Operations Handbooks</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Complete Copy-Paste Formatting Guide
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                PDF e-readers and text scanners often place severe line-break markers on copy-pasted blocks. This makes reviewing, editing, translating, or indexing texts frustrating. That's why our automated <strong>line-break cleaner</strong> lets you bridge these gaps in real-time.
              </p>
              <p>
                To format your text, choose between placing clean standard spacings during paragraph merges, or erasing the line ends completely.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">
              Step-by-Step Instructions
            </h3>
            <ul className="text-sm list-decimal pl-5 space-y-2.5 leading-relaxed">
              <li><strong>Input Draft:</strong> Copy your clumsy text directly from any scanning OCR, e-book reader, or double-column PDF document.</li>
              <li><strong>Set Configuration:</strong> Choose whether you want to preserve paragraphs. (Recommended to keep paragraphs untouched).</li>
              <li><strong>Review Dynamic Outputs:</strong> Examine the synchronized output textarea. See how the word boundaries fuse smoothly into sentences.</li>
              <li><strong>Save Flawless Content:</strong> Click "Copy" to lock the results into your clipboard, or click "Download .txt" to export a clean UTF-8 document.</li>
            </ul>
          </div>

          {/* Segment 2: Benefits & Features Review */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550 font-sans">Why use this cleaner</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Key Formatting Advantages
            </h2>

            <div className="space-y-4 text-sm leading-relaxed">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Bridge Fragmented Sentences</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Erase structural single-returns so translation engines and word processors read continuous lines without clipping.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Preserve Double Returns</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Our smart double-line monitor ensures paragraph blocks remain isolated. It only bridges lines within paragraphs.</p>
              </div>

              <div className="p-4 bg-indigo-550/10 dark:bg-indigo-950/20 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl">
                <h4 className="font-bold text-indigo-805 dark:text-indigo-400 text-xs">✓ Ideal for Translation Engines</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Modern translation tools interpret random paragraph line breaks poorly. Stripping carriage wraps allows smooth contextual paragraph translations.</p>
              </div>
            </div>
          </div>

        </section>

        {/* Accordion FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto items-center">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Learn how double spacing, tabs and enter keys are treated during text cleaning.
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
                    id={`remove-breaks-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
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

        {/* Companion / Related Tools Block */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
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
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-4 block">
                  Open Utility →
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
