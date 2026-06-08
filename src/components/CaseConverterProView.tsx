import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Type, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  Globe, 
  Download, 
  Keyboard, 
  Zap, 
  Undo, 
  CheckCircle,
  Scissors, 
  FileText,
  BookmarkCheck,
  RotateCcw,
  Sliders,
  Maximize2
} from 'lucide-react';

interface CaseConverterProViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type CaseMode = 
  | 'upper' 
  | 'lower' 
  | 'sentence' 
  | 'title' 
  | 'capitalize_each' 
  | 'toggle' 
  | 'camel' 
  | 'pascal' 
  | 'snake' 
  | 'kebab' 
  | 'constant' 
  | 'dot' 
  | 'path';

interface ModeMeta {
  id: CaseMode;
  label: string;
  desc: string;
  placeholder: string;
  category: 'Standard' | 'Programming';
}

export default function CaseConverterProView({ onNavigateToTool, onNavigateHome }: CaseConverterProViewProps) {
  const [inputText, setInputText] = useState('');
  const [activeMode, setActiveMode] = useState<CaseMode>('sentence');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [history, setHistory] = useState<string | null>(null);
  
  // Custom states
  const [copiedCardId, setCopiedCardId] = useState<CaseMode | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Keyboard shortcut active states tracker
  const [lastShortcut, setLastShortcut] = useState<string | null>(null);

  // Meta configuration for the 13 supported styles
  const CASE_MODES_META: ModeMeta[] = [
    { id: 'upper', label: 'UPPERCASE', desc: 'Converts all characters to capital letters.', placeholder: 'HI THERE FRIEND', category: 'Standard' },
    { id: 'lower', label: 'lowercase', desc: 'Converts all characters to lowercase letters.', placeholder: 'hi there friend', category: 'Standard' },
    { id: 'sentence', label: 'Sentence case', desc: 'Capitalizes the first character of each sentence.', placeholder: 'Hi there friend.', category: 'Standard' },
    { id: 'title', label: 'Title Case', desc: 'Capitalizes major words, skipping minor ones.', placeholder: 'Hi There Friend', category: 'Standard' },
    { id: 'capitalize_each', label: 'Capitalize Each Word', desc: 'Converts the first letter of every single word.', placeholder: 'Hi There Friend', category: 'Standard' },
    { id: 'toggle', label: 'tOGGLE cASE', desc: 'Flips existing casing (A ⇄ a) on each character.', placeholder: 'hI tHERE fRIEND', category: 'Standard' },
    { id: 'camel', label: 'camelCase', desc: 'Joined words with initial lowercase, subsequent caps.', placeholder: 'hiThereFriend', category: 'Programming' },
    { id: 'pascal', label: 'PascalCase', desc: 'Joined words with initial capital on every word.', placeholder: 'HiThereFriend', category: 'Programming' },
    { id: 'snake', label: 'snake_case', desc: 'Lowercase words connected by underscores.', placeholder: 'hi_there_friend', category: 'Programming' },
    { id: 'kebab', label: 'kebab-case', desc: 'Lowercase words connected by hyphens/dashes.', placeholder: 'hi-there-friend', category: 'Programming' },
    { id: 'constant', label: 'CONSTANT_CASE', desc: 'Uppercase letters connected by underscores.', placeholder: 'HI_THERE_FRIEND', category: 'Programming' },
    { id: 'dot', label: 'dot.case', desc: 'Lowercase words connected by single periods.', placeholder: 'hi.there.friend', category: 'Programming' },
    { id: 'path', label: 'path/case', desc: 'Lowercase words connected by folder slashes.', placeholder: 'hi/there/friend', category: 'Programming' },
  ];

  const seoTitle = "Case Converter Pro | Advanced Text Case Conversion Tool";
  const seoDescription = "Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case, PascalCase, and more with our advanced Case Converter Pro.";

  const faqs = [
    {
      id: 1,
      question: "Which casing formats are supported in Case Converter Pro?",
      answer: "We support a robust set of 13 conversions:\n• Standard: UPPERCASE, lowercase, Sentence case, Title Case, Capitalize Each Word, tOGGLE cASE.\n• Programming tokens: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, and path/case.\nAll options execute instantly fully client-side."
    },
    {
      id: 2,
      question: "How does the camelCase, snake_case, and kebab-case compiler organize text?",
      answer: "Our engine uses a smart regex parser that separates terms by spaces, hyphens, underscores, slashes, or dots. It also detects existing lowercase-to-uppercase (camelHumps) boundaries, letting you transition seamlessly from camelCase to snake_case, CONSTANT_CASE, or path/case without manual editing."
    },
    {
      id: 3,
      question: "How do the keyboard shortcuts work?",
      answer: "We support rapid SaaS hotkeys to expedite your workflow:\n• Alt + S: Load draft demo text\n• Alt + X: Reset workspace inputs\n• Alt + C: Copy the primary converted output\n• Alt + D: Download text file (.txt)\n• Alt + K: Open or close the shortcuts information pane\nThese allow you to manipulate paragraphs at lightning speeds."
    },
    {
      id: 4,
      question: "Does Title Case comply with standard stylebooks?",
      answer: "Yes. Our Title Case converter is optimized for content editors. It automatically capitalizes all major headings while protecting short articles, conjunctions, and prepositions ('a', 'an', 'the', 'and', 'but', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'with') from uppercase capitalization unless they begin or end the input."
    },
    {
      id: 5,
      question: "Are there size limits or safety concerns when pasting raw texts?",
      answer: "No. Since the Case Converter Pro processes code and prose locally within your browser tab using highly optimized TypeScript loops, there is virtually no size limit. Because 100% of the conversions are completed client-side, zero character data ever leaves your computer, ensuring total safety."
    }
  ];

  // Dynamic SEO Setup & Schema JSON-LD FAQ/Metadata Injection
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

    const scriptId = "case-converter-pro-json-ld";
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

  // Listen for keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // We check for Alt + key combos
      if (e.altKey) {
        const key = e.key.toLowerCase();
        if (key === 'c') {
          e.preventDefault();
          handleCopy();
          triggerShortcutFeedback('Copied Main Output (Alt + C)');
        } else if (key === 'd') {
          e.preventDefault();
          handleDownload();
          triggerShortcutFeedback('Downloaded .txt File (Alt + D)');
        } else if (key === 'x') {
          e.preventDefault();
          handleClear();
          triggerShortcutFeedback('Cleared Terminal (Alt + X)');
        } else if (key === 's') {
          e.preventDefault();
          handleLoadSample();
          triggerShortcutFeedback('Loaded Draft Sample (Alt + S)');
        } else if (key === 'k') {
          e.preventDefault();
          setShowShortcuts(prev => !prev);
          triggerShortcutFeedback('Toggled Help Menu (Alt + K)');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [outputText, inputText, activeMode]);

  const triggerShortcutFeedback = (actionText: string) => {
    setLastShortcut(actionText);
    setTimeout(() => setLastShortcut(null), 3000);
  };

  // ----------------------------------------------------
  // CONVERSION ALGORITHMS
  // ----------------------------------------------------

  const toSentenceCase = (str: string): string => {
    if (!str) return '';
    const lower = str.toLowerCase();
    // Capitalize character starting sentences or after punctuation (.!?) followed by space
    return lower.replace(/(^\s*|[.!?]\s+)([a-z0-9])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  };

  const toTitleCase = (str: string): string => {
    if (!str) return '';
    const minorWords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'with', 'about', 'as'];
    const words = str.toLowerCase().split(/(\s+)/); // Keep spaces intact
    return words.map((word, index) => {
      if (word.trim() === '') return word;
      const cleanWord = word.replace(/[^a-zA-Z0-9']/g, '');
      const isFirstOrLast = index === 0 || index === words.length - 1;
      if (!isFirstOrLast && minorWords.includes(cleanWord)) {
        return word; // Keep minor words lowercase
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
  };

  const toCapitalizedCase = (str: string): string => {
    if (!str) return '';
    const words = str.toLowerCase().split(/(\s+)/);
    return words.map(word => {
      if (word.trim() === '') return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    }).join('');
  };

  const toToggleCase = (str: string): string => {
    if (!str) return '';
    return str.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    }).join('');
  };

  // Advanced word tokenization that splits by spaces, dash, underscore, dot, slashes and camel bounds
  const getWords = (str: string): string[] => {
    if (!str) return [];
    const cleaned = str
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Camel splits
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Splitting caps streaks
      .replace(/[-_.\/]+/g, ' '); // Strip separators
    return cleaned.trim().split(/\s+/).filter(Boolean);
  };

  const toCamelCase = (words: string[]): string => {
    if (words.length === 0) return '';
    return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  };

  const toPascalCase = (words: string[]): string => {
    return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
  };

  const toSnakeCase = (words: string[]): string => {
    return words.map(w => w.toLowerCase()).join('_');
  };

  const toKebabCase = (words: string[]): string => {
    return words.map(w => w.toLowerCase()).join('-');
  };

  const toConstantCase = (words: string[]): string => {
    return words.map(w => w.toUpperCase()).join('_');
  };

  const toDotCase = (words: string[]): string => {
    return words.map(w => w.toLowerCase()).join('.');
  };

  const toPathCase = (words: string[]): string => {
    return words.map(w => w.toLowerCase()).join('/');
  };

  // Convert text depending on selected configuration line-by-line
  const runConversion = (text: string, mode: CaseMode): string => {
    if (!text) return '';
    const lines = text.split('\n');
    const processed = lines.map(line => {
      if (!line.trim()) return line;

      switch (mode) {
        case 'upper':
          return line.toUpperCase();
        case 'lower':
          return line.toLowerCase();
        case 'sentence':
          return toSentenceCase(line);
        case 'title':
          return toTitleCase(line);
        case 'capitalize_each':
          return toCapitalizedCase(line);
        case 'toggle':
          return toToggleCase(line);
        default: {
          const words = getWords(line);
          if (words.length === 0) return line;
          switch (mode) {
            case 'camel':
              return toCamelCase(words);
            case 'pascal':
              return toPascalCase(words);
            case 'snake':
              return toSnakeCase(words);
            case 'kebab':
              return toKebabCase(words);
            case 'constant':
              return toConstantCase(words);
            case 'dot':
              return toDotCase(words);
            case 'path':
              return toPathCase(words);
            default:
              return line;
          }
        }
      }
    });

    return processed.join('\n');
  };

  // Auto trigger conversions on inputs
  useEffect(() => {
    setOutputText(runConversion(inputText, activeMode));
  }, [inputText, activeMode]);

  // Operations
  const handleLoadSample = () => {
    setHistory(inputText);
    setInputText(`discover NEW casing patterns. WE assist developers and students from ALL around the globe!\nthis is sentence-level text. write camelCase, snake_case or CONSTANT_CASE variables.`);
    triggerShortcutFeedback("Loaded demo draft");
  };

  const handleClear = () => {
    setHistory(inputText);
    setInputText('');
    setOutputText('');
    triggerShortcutFeedback("Cleared raw inputs");
  };

  const handleUndo = () => {
    if (history !== null) {
      const temp = inputText;
      setInputText(history);
      setHistory(temp);
      triggerShortcutFeedback("Undid last action");
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      triggerShortcutFeedback("Copied output");
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  const handleCopySpecificCard = async (mode: CaseMode, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the card
    const converted = runConversion(inputText || 'Quick Demo Text', mode);
    try {
      await navigator.clipboard.writeText(converted);
      setCopiedCardId(mode);
      setTimeout(() => setCopiedCardId(null), 2000);
      triggerShortcutFeedback(`Copied ${mode} conversion!`);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `case_converter_pro_${activeMode}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Calculate stats
  const getStats = () => {
    if (!inputText.trim()) return { chars: 0, words: 0, sentences: 0 };
    const chars = inputText.length;
    const words = inputText.trim().split(/\s+/).filter(Boolean).length;
    const sentences = inputText.split(/[.!?]+/).filter(line => line.trim().length > 0).length;
    return { chars, words, sentences };
  };

  const stats = getStats();

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-200" id="case-converter-pro-container">
      
      {/* SaaS Alert bar / Banner for Shortcut Notification */}
      <AnimatePresence>
        {lastShortcut && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-slate-950 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full text-xs font-mono font-bold shadow-2xl flex items-center gap-2"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            {lastShortcut}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary Sticky Header */}
      <header className="bg-white/80 dark:bg-slate-950/80 border-b border-slate-205 dark:border-slate-800 backdrop-blur-md sticky top-0 z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="p-1.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Portal Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-widest font-mono">
                <span>Text Transformation</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
                <span className="text-slate-505 dark:text-slate-500">Workspace</span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-950 dark:text-white flex items-center gap-1.5 font-sans tracking-tight">
                Case Converter Pro
                <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Pro Suite
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShortcuts(prev => !prev)}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 leading-none ${
                showShortcuts 
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white' 
                  : 'bg-white hover:bg-slate-50 text-slate-650 dark:bg-slate-950 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
              title="Keyboard Shortcuts Guide"
            >
              <Keyboard className="w-4 h-4" />
              <span className="hidden sm:inline">Shortcuts (Alt+K)</span>
            </button>

            <button
              onClick={() => setShowSeoMeta(prev => !prev)}
              className={`p-2 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 leading-none ${
                showSeoMeta 
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-300 dark:bg-emerald-950/30' 
                  : 'bg-white hover:bg-slate-50 text-slate-650 dark:bg-slate-950 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Globe className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">Google Preview</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Keyboard shortcuts helper panel */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900 text-slate-100 dark:bg-slate-950 rounded-2xl border border-indigo-900 p-5 mb-8 overflow-hidden shadow-xl"
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 flex items-center gap-2">
                  <Keyboard className="w-4 h-4" /> Power-User System Shortcuts
                </span>
                <button 
                  onClick={() => setShowShortcuts(false)}
                  className="text-slate-450 hover:text-white font-mono text-[11px]"
                >
                  ✕ Close
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-3 bg-slate-850 dark:bg-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-mono">LOAD DEMO</span>
                  <kbd className="inline-block px-2 py-1 bg-slate-800 border border-slate-700 text-xs font-sans rounded-md select-none mt-1 font-bold text-white">Alt + S</kbd>
                </div>
                <div className="p-3 bg-slate-850 dark:bg-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-mono">COPY OUTPUT</span>
                  <kbd className="inline-block px-2 py-1 bg-slate-800 border border-slate-700 text-xs font-sans rounded-md select-none mt-1 font-bold text-white">Alt + C</kbd>
                </div>
                <div className="p-3 bg-slate-850 dark:bg-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-mono">DOWNLOAD FILE</span>
                  <kbd className="inline-block px-2 py-1 bg-slate-800 border border-slate-700 text-xs font-sans rounded-md select-none mt-1 font-bold text-white">Alt + D</kbd>
                </div>
                <div className="p-3 bg-slate-850 dark:bg-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-mono">RESET ALL</span>
                  <kbd className="inline-block px-2 py-1 bg-slate-800 border border-slate-700 text-xs font-sans rounded-md select-none mt-1 font-bold text-white">Alt + X</kbd>
                </div>
                <div className="p-3 bg-slate-850 dark:bg-slate-900 rounded-xl">
                  <span className="text-[10px] text-slate-400 block font-mono">INFO TOGGLE</span>
                  <kbd className="inline-block px-2 py-1 bg-slate-800 border border-slate-700 text-xs font-sans rounded-md select-none mt-1 font-bold text-white">Alt + K</kbd>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEO Sniper Meta Preview */}
        <AnimatePresence>
          {showSeoMeta && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-indigo-50/20 dark:bg-slate-950 border border-indigo-150 dark:border-slate-800 rounded-3xl p-5 mb-8 overflow-hidden shadow-inner"
            >
              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <BookmarkCheck className="w-4 h-4 text-emerald-500" /> Search Engine Google SERP Simulation
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1">
                  <span>https://texttoolkithub.com</span>
                  <span className="text-slate-350">/</span>
                  <span>case-converter-pro</span>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-indigo-650 dark:text-indigo-400 hover:underline leading-tight cursor-pointer">
                  {seoTitle}
                </h3>
                <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {seoDescription}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Area / Titles */}
        <div className="text-center md:text-left mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-full text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-4">
            <Sliders className="w-3.5 h-3.5 text-indigo-500" />
            <span>Premium Text Transformation Workbench</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white font-sans tracking-tight">
            Case Converter Pro
          </h2>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-405 mt-2 max-w-4xl leading-relaxed">
            Convert any block of text or variable name into 13 unique standard and programmer configurations instantly. Live, high-fidelity responsive layout with zero cloud dependencies.
          </p>
        </div>

        {/* Master Workspace Panel (Raw input + Converter outputs) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* INPUT WRAPPER */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider font-mono text-slate-450 dark:text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                Raw Document Input
              </span>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleLoadSample}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-405 dark:hover:text-indigo-300 transition flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Load Sample Text
                </button>

                {inputText && (
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-xs font-extrabold text-rose-500 px-2 py-1 rounded-xl transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Input
                  </button>
                )}
              </div>
            </div>

            <div className="relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-4 shadow-sm hover:border-slate-350 dark:hover:border-slate-750 transition focus-within:ring-2 focus-within:ring-indigo-500 dark:focus-within:ring-indigo-900">
              <textarea
                value={inputText}
                onChange={(e) => {
                  setHistory(inputText);
                  setInputText(e.target.value);
                }}
                placeholder="Type or paste paragraphs, essays, lists, or programming parameters here..."
                className="w-full min-h-[240px] md:min-h-[300px] bg-transparent outline-none border-0 text-sm md:text-base text-slate-850 dark:text-slate-100 leading-relaxed font-sans"
                id="converter-pro-raw-input"
              />

              {/* Dynamic word metrics bar */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-900 text-[11px] text-slate-450">
                <div className="flex items-center gap-4">
                  <span>Characters: <strong className="text-slate-700 dark:text-slate-300 font-mono">{stats.chars}</strong></span>
                  <span>Words: <strong className="text-slate-700 dark:text-slate-300 font-mono">{stats.words}</strong></span>
                  <span>Sentences: <strong className="text-slate-700 dark:text-slate-300 font-mono">{stats.sentences}</strong></span>
                </div>

                {history !== null && (
                  <button
                    onClick={handleUndo}
                    className="text-[10px] uppercase font-bold text-slate-650 hover:text-slate-850 dark:text-slate-300 dark:hover:text-white flex items-center gap-1"
                  >
                    <Undo className="w-3 h-3" /> Undo Last
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ACTIVE PRIMARY OUTPUT PANEL */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between animate-fade-in">
              <span className="text-xs uppercase font-extrabold tracking-wider font-mono text-slate-450 dark:text-slate-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                Active Output: <span className="text-indigo-650 dark:text-indigo-400 normal-case font-bold">{CASE_MODES_META.find(m => m.id === activeMode)?.label}</span>
              </span>

              <div className="flex items-center gap-2">
                {outputText && (
                  <button
                    onClick={handleDownload}
                    className="p-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> .TXT
                  </button>
                )}

                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className={`px-4.5 py-1.5 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 ${
                    copied 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                      : 'bg-indigo-650 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Master'}</span>
                </button>
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 rounded-3xl p-4 shadow-sm h-full flex flex-col justify-between">
              <textarea
                value={outputText}
                readOnly
                placeholder="Synchronized converted outputs will populate instantly as you write or choose presets..."
                className="w-full min-h-[240px] md:min-h-[300px] h-full bg-transparent outline-none border-0 text-sm md:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-sans resize-none"
              />

              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-850/60 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                <span>ACTIVE SCHEME: <strong>{activeMode.toUpperCase()}</strong></span>
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  <CheckCircle className="w-3 h-3" /> Fully Local
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Grid Selector with 13 Live Preview Conversion Cards */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-lg font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-indigo-550" />
                Live Conversion Preview Cards
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Displaying real-time casing conversions of your typed paragraph. Click any card to apply the case as primary or copy it directly!
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-2 py-1 font-mono">13 Formats Available</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CASE_MODES_META.map(meta => {
              const isActive = activeMode === meta.id;
              
              // Get transformed text for preview
              const sampleText = inputText.trim() || "The quick brown fox jumps over the lazy dog";
              // We truncate the preview to keep card clean and readable
              const truncateLength = 80;
              const formattedOutput = runConversion(sampleText, meta.id);
              const isTruncated = formattedOutput.length > truncateLength;
              const miniPreview = isTruncated 
                ? formattedOutput.slice(0, truncateLength) + '...'
                : formattedOutput;

              const isCardCopied = copiedCardId === meta.id;

              return (
                <div
                  key={meta.id}
                  onClick={() => setActiveMode(meta.id)}
                  className={`group relative p-4 rounded-2xl border text-left cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                    isActive
                      ? 'bg-indigo-600 dark:bg-indigo-700 text-white border-transparent shadow-[0_12px_24px_-10px_rgba(79,70,229,0.45)] scale-[1.02] z-10'
                      : 'bg-white hover:bg-slate-100/60 dark:bg-slate-950 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                  id={`conversion-card-${meta.id}`}
                >
                  <div>
                    {/* Header line of the card */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider font-mono ${isActive ? 'text-indigo-150' : 'text-indigo-650 dark:text-indigo-400'}`}>
                        {meta.label}
                      </span>

                      <span className={`text-[9px] font-mono font-medium px-1.5 py-0.5 rounded border inline-block select-none ${
                        isActive 
                        ? 'bg-indigo-700/60 border-indigo-500 text-indigo-100' 
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {meta.category}
                      </span>
                    </div>

                    <p className={`text-[10px] leading-relaxed mb-3 ${isActive ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {meta.desc}
                    </p>

                    {/* Previews panel */}
                    <div className={`p-2.5 rounded-xl border font-mono text-[11px] leading-normal break-all mb-4 ${
                      isActive 
                        ? 'bg-indigo-700/50 border-indigo-600 text-white' 
                        : 'bg-slate-50 dark:bg-slate-900/40 border-slate-150 dark:border-slate-900 text-slate-700 dark:text-slate-350'
                    }`}>
                      {miniPreview}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-900/60 pt-2.5 mt-auto">
                    <span className={`text-[10px] font-extrabold ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-600 dark:text-slate-500'}`}>
                      {isActive ? '✓ Assigned' : 'Select Casing'}
                    </span>

                    <button
                      onClick={(e) => handleCopySpecificCard(meta.id, e)}
                      className={`p-1.5 rounded-lg border flex items-center gap-1 text-[10px] font-extrabold transition ${
                        isActive
                          ? 'border-indigo-400/30 bg-indigo-500 hover:bg-indigo-400 text-white'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-550 dark:text-slate-300'
                      }`}
                      title="Instant copy formatted text from this card"
                    >
                      {isCardCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{isCardCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cheat sheet explanation and definition panel */}
        <section className="border-t border-slate-205 dark:border-slate-800 pt-12 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <span className="text-xs uppercase font-extrabold font-mono tracking-wider text-indigo-650 dark:text-indigo-400 block mb-2">Cheat Sheet Reference</span>
              <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white leading-tight">
                Understand Format Casing Rules
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                Clean text converters help standardize datasets. See how the formatting suite coordinates your words based on editorial stylebooks, variable standards, or file architectures.
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-855 rounded-2xl flex gap-3">
                <span className="text-indigo-550 font-bold font-mono">1.</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">camelCase & PascalCase</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-410 mt-1 leading-relaxed">
                    Used heavily in languages like JavaScript and Java. camelCase starts with lower character, then capitalizes words (`camelCase`). PascalCase capitalizes every single word (`PascalCase`).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-855 rounded-2xl flex gap-3">
                <span className="text-indigo-550 font-bold font-mono">2.</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">snake_case & kebab-case</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-410 mt-1 leading-relaxed">
                    snake_case joins words using standard underscores, frequently used in Python or SQL databases. kebab-case formats inputs with hyphens, common in CSS properties or SEO URL slugs.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-855 rounded-2xl flex gap-3">
                <span className="text-indigo-550 font-bold font-mono">3.</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">CONSTANT_CASE</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-410 mt-1 leading-relaxed">
                    Uses all uppercase letters glued together by low underscores. This is the universal standard for declaring global environment variables, constants, or microservice keys.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-855 rounded-2xl flex gap-3">
                <span className="text-indigo-550 font-bold font-mono">4.</span>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-100">dot.case & path/case</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-410 mt-1 leading-relaxed">
                    dot.case constructs keys with dots, which matches config formats like YAML/properties labels. path/case connects directory folders using slashes (`dir/path/file`).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Structured Accordion FAQs */}
        <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-805 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-sans tracking-tight flex items-center gap-2 mb-2">
              <HelpCircle className="w-5.5 h-5.5 text-indigo-500" />
              Frequently Asked Questions (FAQs)
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Find solutions regarding case converters, string formatting, abbreviation controls, and local browser execution details.
            </p>

            <div className="space-y-4">
              {faqs.map(faq => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                    className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden transition-all duration-150 cursor-pointer"
                  >
                    <button
                      className="w-full flex items-center justify-between p-4 bg-slate-50/40 dark:bg-slate-900/30 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                      aria-expanded={isExpanded}
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200 pr-4">
                        {faq.id}. {faq.question}
                      </span>
                      <span className="text-slate-450 dark:text-slate-500 shrink-0 font-bold">
                        {isExpanded ? '–' : '+'}
                      </span>
                    </button>

                    {isExpanded && (
                      <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900">
                        <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
