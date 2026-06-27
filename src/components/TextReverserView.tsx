import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  ArrowLeftRight, 
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
  Download,
  ShieldCheck,
  FileText,
  AlignLeft,
  Wrench,
  Sparkle
} from 'lucide-react';

interface TextReverserViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type ReversalMode = 'characters' | 'words' | 'lines' | 'words-per-line' | 'characters-in-words';

export default function TextReverserView({ onNavigateToTool, onNavigateHome }: TextReverserViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [reversalMode, setReversalMode] = useState<ReversalMode>('characters');
  const [preservePunctuation, setPreservePunctuation] = useState(false);
  const [history, setHistory] = useState<{ input: string; output: string; mode: ReversalMode } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO Parameters
  const seoTitle = "Text Reverser Tool Online Free - Reverse Characters & Words";
  const seoDescription = "Reverse text, words, lines, and characters instantly with our free online Text Reverser Tool. Privacy-first, fully client-side tool with live preview.";

  const faqs = [
    {
      id: 1,
      question: "What is a Text Reverser?",
      answer: "A Text Reverser is an online text utility that flips string characters, words, sentences, or line positions backwards. It is commonly used for formatting code, generating palindromes, solving cryptographic puzzle configurations, or creating stylized captions for social posts."
    },
    {
      id: 2,
      question: "How does the 'Reverse Words only' filter function?",
      answer: "Instead of reversing single alphabet characters, the 'Reverse Words' engine splits paragraphs by spacing boundaries and reverses the sequence of words. For example, 'Hello World' becomes 'World Hello'. It preserves grammatical character spelling inside each word while reversing their relative positioning scale."
    },
    {
      id: 3,
      question: "What is the difference between reversing words and reversing lines?",
      answer: "Reversing lines flips vertical line positions (keeping paragraph 1 at the bottom and the last paragraph at the top) while keeping horizontal text layout intact. Reversing words operates horizontally, shuffling sequence coordinates within single line fields."
    },
    {
      id: 4,
      question: "Is my text data safe when reversing private logs or passwords?",
      answer: "Yes, 100% of the conversions run inside your local browser memory layer using JavaScript. No external server requests are made, protecting your source scripts or sensitive data securely."
    },
    {
      id: 5,
      question: "Can I reverse localized languages or emojis?",
      answer: "Yes! Modern JavaScript string splitting supports Unicode symbols. When reversing complex characters or composite emojis, standard array splits may occasionally disconnect markers. Enabling our standards preserves standard accents and emojis beautifully."
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

    const scriptId = "text-reverser-json-ld";
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

  // Live transformation engine
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let result = '';

    switch (reversalMode) {
      case 'characters':
        // Reverse entire text character-by-character
        // Using Array.from to properly handle emoji sequences and multibyte characters
        result = Array.from(inputText).reverse().join('');
        break;

      case 'words':
        // Reverse standard words overall
        const words = inputText.trim().split(/\s+/);
        result = words.reverse().join(' ');
        break;

      case 'lines':
        // Reverse lines vertically
        const lines = inputText.split(/\r?\n/);
        result = lines.reverse().join('\n');
        break;

      case 'words-per-line':
        // Reverse the order of words within each line independently
        const wplLines = inputText.split(/\r?\n/);
        const wplProcessed = wplLines.map(line => {
          const w = line.trim().split(/\s+/);
          return w.reverse().join(' ');
        });
        result = wplProcessed.join('\n');
        break;

      case 'characters-in-words':
        // Reverse characters inside each individual word, whilst keeping general word layout sequence
        const ciwLines = inputText.split(/\r?\n/);
        const ciwProcessed = ciwLines.map(line => {
          const w = line.split(/(\s+)/); // Preserve spaces exactly
          return w.map(wordSpec => {
            // Check if spacer block
            if (/^\s+$/.test(wordSpec)) return wordSpec;
            return Array.from(wordSpec).reverse().join('');
          }).join('');
        });
        result = ciwProcessed.join('\n');
        break;

      default:
        result = inputText;
        break;
    }

    setOutputText(result);
  }, [inputText, reversalMode]);

  // Actions
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`Hello World
The quick brown fox jumps over the lazy dog.
A man, a plan, a canal: Panama!`);
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText, mode: reversalMode });
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
      const prevMode = reversalMode;
      setInputText(history.input);
      setOutputText(history.output);
      setReversalMode(history.mode);
      setHistory({ input: prevInput, output: prevOutput, mode: prevMode });
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to copy reversed text:', err);
    }
  };

  const handleDownloadTxt = () => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reversed_text_output.txt';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);
    } catch (err) {
      console.error('File generation error:', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Select companion related tools specified in requirements:
  // Text Sorter, Text Compare, Remove Line Breaks, Case Converter
  const relatedTools = TOOLS.filter(t => 
    t.id === 'tools/text-sorter' || 
    t.id === 'tools/text-compare' || 
    t.id === 'tools/remove-line-breaks' || 
    t.id === 'tools/case-converter'
  ).slice(0, 4);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 animate-fade-in" id="text-reverser-page">
      {/* Background glow enhancements */}
      <div className="glow-accent top-20 right-10"></div>
      <div className="glow-accent bottom-20 left-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10 animate-fade-in">
        
        {/* Navigation Breadcrumbs Accordion */}
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
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">Text Reverser</span>
        </div>

        {/* Title Header Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <ArrowLeftRight className="w-7 h-7 text-indigo-600" />
              </span>
              Text Reverser Tool Online Free
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Flip sentences inside out instantly. Reverse entire sequences, shuffle word placements, invert line order vertically, or mirror characters within words.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            {showSeoMeta ? 'Collapse SEO tags' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Google SERP Snippet Preview */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Live Google Search Result Page (SERP) Mockup
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5 font-mono">
                <span>https://texttoolkithub.com/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/text-reverser</span>
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

        {/* Configurations Dashboard Panel */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-5">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
              <Sliders className="w-4 h-4 text-indigo-500" /> Reversal Methods configurations
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">Select how the letters, symbols, or word-blocks should be inverted.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <button
              onClick={() => { saveToHistory(); setReversalMode('characters'); }}
              className={`p-3.5 border rounded-2xl flex flex-col items-start gap-1.5 transition text-left cursor-pointer ${reversalMode === 'characters' ? 'border-indigo-650 bg-indigo-50/30 border-indigo-600 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50'}`}
              id="mode-characters"
            >
              <span className="text-xs font-bold block">Flip Characters</span>
              <span className="text-[10px] text-slate-400 block font-normal leading-tight">Reverse entire text from back to front character-by-character.</span>
            </button>

            <button
              onClick={() => { saveToHistory(); setReversalMode('words'); }}
              className={`p-3.5 border rounded-2xl flex flex-col items-start gap-1.5 transition text-left cursor-pointer ${reversalMode === 'words' ? 'border-indigo-650 bg-indigo-50/30 border-indigo-600 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50'}`}
              id="mode-words"
            >
              <span className="text-xs font-bold block">Reverse Words</span>
              <span className="text-[10px] text-slate-400 block font-normal leading-tight">Keeps spelling correct, but flips word placements horizontally.</span>
            </button>

            <button
              onClick={() => { saveToHistory(); setReversalMode('lines'); }}
              className={`p-3.5 border rounded-2xl flex flex-col items-start gap-1.5 transition text-left cursor-pointer ${reversalMode === 'lines' ? 'border-indigo-650 bg-indigo-50/30 border-indigo-600 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50'}`}
              id="mode-lines"
            >
              <span className="text-xs font-bold block">Reverse Line Order</span>
              <span className="text-[10px] text-slate-400 block font-normal leading-tight">Flips vertical lines ordering. Line 1 goes to bottom.</span>
            </button>

            <button
              onClick={() => { saveToHistory(); setReversalMode('words-per-line'); }}
              className={`p-3.5 border rounded-2xl flex flex-col items-start gap-1.5 transition text-left cursor-pointer ${reversalMode === 'words-per-line' ? 'border-indigo-650 bg-indigo-50/30 border-indigo-600 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50'}`}
              id="mode-words-per-line"
            >
              <span className="text-xs font-bold block">Words Per Line</span>
              <span className="text-[10px] text-slate-400 block font-normal leading-tight">Flips word order inside each line individually.</span>
            </button>

            <button
              onClick={() => { saveToHistory(); setReversalMode('characters-in-words'); }}
              className={`p-3.5 border rounded-2xl flex flex-col items-start gap-1.5 transition text-left cursor-pointer ${reversalMode === 'characters-in-words' ? 'border-indigo-650 bg-indigo-50/30 border-indigo-600 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 text-slate-600 dark:text-slate-350 hover:bg-slate-50'}`}
              id="mode-characters-in-words"
            >
              <span className="text-xs font-bold block">Letters In Words</span>
              <span className="text-[10px] text-slate-400 block font-normal leading-tight">Flips individual character directions within each word.</span>
            </button>

          </div>
        </div>

        {/* Split Screen Workspace Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* INPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> Raw Input Paragraphs
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Sample Phrases
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Type or paste your text to reverse here..."
                className="w-full p-5 min-h-[280px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-mono tracking-wide leading-relaxed"
                id="text-reverser-input-textarea"
                aria-label="Text Reverser Input Editor"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium font-mono">
                <div className="flex items-center gap-4">
                  <span>Chars: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>
                  <span>Words: <strong className="text-slate-700 dark:text-slate-200">{inputText ? inputText.trim().split(/\s+/).length : 0}</strong></span>
                  <span>Lines: <strong className="text-slate-700 dark:text-slate-200">{inputText ? inputText.split(/\n/).length : 0}</strong></span>
                </div>

                <div className="flex items-center gap-2 font-sans">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-0.5 cursor-pointer"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore Previous
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-450 hover:text-rose-600 rounded-lg transition disabled:opacity-35 cursor-pointer"
                    id="btn-clear"
                  >
                    Clear Text
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* OUTPUT LIVE VIEW AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Mirror Live Preview
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 font-sans">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Live Rendering
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <div className="p-5 min-h-[280px] flex flex-col justify-between">
                {outputText ? (
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Output text will render live here..."
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full h-[210px] border-0 outline-none text-base text-emerald-700 dark:text-emerald-450 bg-transparent resize-none font-mono leading-relaxed"
                    id="text-reverser-output-textarea"
                    aria-label="Reverser Output Display View"
                  />
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic block my-auto text-center font-sans">
                    The reversed characters, words or line selections will translate live here...
                  </span>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-3 items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Output Method: <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{reversalMode.toUpperCase()}</strong>
                </span>

                <div className="flex gap-2 shrink-0">


                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer font-sans ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/25 dark:text-indigo-400'}`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Flipped content!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Reversed Output
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* LONG-FORM INFORMATION SECTIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
          
          {/* Column 1: Background explanations */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-650 text-indigo-600 font-sans">Educational Resource</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              What is a Text Reverser?
            </h2>
            <div className="space-y-4 font-sans">
              <p>
                A Text Reverser is a technical string formatting tool that reads alphanumeric logs, strings, documents, or paragraphs and transforms their byte order values cleanly backwards. From simple display reversals to micro-structural adjustments required for specific data streams, it is a versatile utility in any developer’s toolkit.
              </p>
              <p>
                Unlike basic reversing algorithms that corrupt Unicode symbols or break accented letters and emojis by simple indexes, our engine implements <code>Array.from()</code> iteration to preserve multi-byte character alignments seamlessly in all layouts.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Common Use Cases Explained
            </h3>
            <div className="space-y-3 font-sans">
              <p>Why would someone flip text sequences?</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Palindrome Verification:</strong> Quickly check if strings, sentences, or word definitions read the exact same forward and backward.</li>
                <li><strong>Log Analysis & Re-ordering:</strong> Flip system tracing errors or logs vertically to read active runtime errors chronological from bottom to top.</li>
                <li><strong>Social Formatting styling:</strong> Create stylized layout symbols, fun captions, puzzles, or creative writing templates.</li>
                <li><strong>Code Debugging:</strong> Verify string splitting rules, parser logic, or encoding boundaries across localized Unicode blocks.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: User Actionable Steps */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">How-To Instructions</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How to Use This Tool
            </h2>
            <div className="space-y-4 font-sans">
              <p>Follow a simple 3-phase re-formatting execution:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Enter Your Text Document</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Paste letters, code listings, lists, or sentences inside the raw paragraphs input viewport.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Select Your Mirror Path</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Toggle between Character Flip, Reverse Word ordering, Verical Line order, or Words-Per-line configurations.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs text-indigo-600">Export Decoded Sequences</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Directly copy the live rendering window, or download it immediately as a `.txt` layout document.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Privacy-First Security Mandate
            </h3>
            <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-xs tracking-wide">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-800 dark:text-emerald-350 block">100% Offline Parsing Guard:</strong>
                TextToolkitHub is an isolated sandbox workspace. Your raw string datasets, passwords, or personal credentials never exit your device structure.
              </div>
            </div>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto font-sans">
            <div className="text-center mb-12 animate-fade-in">
              <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked FAQ Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Have questions about complex character mappings, layouts or security? Find clarifications immediately below.
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
                    id={`text-reverser-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4 font-sans">
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

        {/* Companion Tools shelves */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800 font-sans">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6 font-medium">
            Explore Companion Text Utilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
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
