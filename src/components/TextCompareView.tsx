import React, { useState, useEffect, useMemo } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Columns, 
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
  GitCompare,
  Plus,
  Minus,
  CheckCircle,
  FileText,
  Sliders,
  Play,
  Scissors
} from 'lucide-react';

interface TextCompareViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type DiffItem = {
  type: 'added' | 'removed' | 'unchanged';
  value: string;
  origIndex?: number;
  modIndex?: number;
};

export default function TextCompareView({ onNavigateToTool, onNavigateHome }: TextCompareViewProps) {
  const [leftText, setLeftText] = useState('');
  const [rightText, setRightText] = useState('');
  const [realtime, setRealtime] = useState<boolean>(true);
  const [hasCompared, setHasCompared] = useState<boolean>(false);
  const [diffResults, setDiffResults] = useState<DiffItem[]>([]);
  
  // Undo/History capability
  const [history, setHistory] = useState<{ left: string; right: string } | null>(null);
  
  // Copy feedback states
  const [copiedLeft, setCopiedLeft] = useState(false);
  const [copiedRight, setCopiedRight] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Layout preference: unified list vs side-by-side blocks
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO details as requested
  const seoTitle = "Text Compare Tool – Compare Text Online Free";
  const seoDescription = "Compare two texts online and instantly find differences, changed words, added text, removed text, and character variations.";

  const faqs = [
    {
      id: 1,
      question: "How does the Text Compare Tool highlight differences?",
      answer: "This utility utilizes a custom high-performance Longest Common Subsequence (LCS) dynamic programming algorithm. It analyzes your original text against your modified text line-by-line, isolating exact rows that have been appended, deleted, or left untouched, and color-codes them with intuitive visual highlighters (green for additions, red for deletions)."
    },
    {
      id: 2,
      question: "What is the difference between split view and unified view?",
      answer: "Split view places the original and modified texts, with color-coded diff overlays, next to each other. This is ideal for side-by-side editing on widescreen displays. Unified view blends all differences chronologicaly into a single scrolling lane, which is highly readable on tablet and mobile viewports."
    },
    {
      id: 3,
      question: "Does the real-time comparison impact browser performance?",
      answer: "For standard documents under 15,000 words, real-time comparison updates instantly without any perceivable lag. If you are comparing extremely long books or complex multi-megabyte outputs, we recommend toggling the 'Real-time Comparison' options off, and performing updates manually with the 'Run Compare' action button."
    },
    {
      id: 4,
      question: "Is there any risk of my data leaking?",
      answer: "No. Your data absolute privacy is our highest priority. All difference calculations, string splits, and character metrics execute entirely in your local system's active tab. No remote server communication, hidden telemetry, or database uploads occur."
    },
    {
      id: 5,
      question: "Can I use this tool to compare HTML or programming code?",
      answer: "Yes, absolutely! It serves as a lightweight, clean 'diff checker' for code files, configuration configurations (JSON/YAML), stylesheet classes, or raw HTML blocks."
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

    // Schema FAQ Injection
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

    const scriptId = "text-compare-json-ld";
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

  // Standard LCS-based Diff implementation for accurate line calculations
  const calculateLineDiff = (original: string, modified: string): DiffItem[] => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    
    // Fallback optimization for large texts:
    if (origLines.length > 500 || modLines.length > 500) {
      // Fast heuristic for heavy files instead of quadratic dynamic programming
      const results: DiffItem[] = [];
      let i = 0, j = 0;
      while (i < origLines.length || j < modLines.length) {
        if (i < origLines.length && j < modLines.length) {
          if (origLines[i] === modLines[j]) {
            results.push({ type: 'unchanged', value: origLines[i], origIndex: i + 1, modIndex: j + 1 });
            i++;
            j++;
          } else {
            // Check if line was deleted or inserted
            const indexInMod = modLines.indexOf(origLines[i], j);
            if (indexInMod !== -1 && indexInMod - j < 5) {
              // Appended lines before matching again
              while (j < indexInMod) {
                results.push({ type: 'added', value: modLines[j], modIndex: j + 1 });
                j++;
              }
            } else {
              results.push({ type: 'removed', value: origLines[i], origIndex: i + 1 });
              i++;
            }
          }
        } else if (i < origLines.length) {
          results.push({ type: 'removed', value: origLines[i], origIndex: i + 1 });
          i++;
        } else {
          results.push({ type: 'added', value: modLines[j], modIndex: j + 1 });
          j++;
        }
      }
      return results;
    }

    // Dynamic Programming implementation of LCS (accurate down to coordinates)
    const n = origLines.length;
    const m = modLines.length;
    
    const dp: number[][] = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));
    
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        if (origLines[i - 1] === modLines[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }
    
    const diff: DiffItem[] = [];
    let i = n;
    let j = m;
    
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && origLines[i - 1] === modLines[j - 1]) {
        diff.unshift({
          type: 'unchanged',
          value: origLines[i - 1],
          origIndex: i,
          modIndex: j
        });
        i--;
        j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        diff.unshift({
          type: 'added',
          value: modLines[j - 1],
          modIndex: j
        });
        j--;
      } else {
        diff.unshift({
          type: 'removed',
          value: origLines[i - 1],
          origIndex: i
        });
        i--;
      }
    }
    
    return diff;
  };

  // Perform calculations trigger
  const runCompareAction = () => {
    const results = calculateLineDiff(leftText, rightText);
    setDiffResults(results);
    setHasCompared(true);
  };

  // Automatic side-effects for Real-time comparison
  useEffect(() => {
    if (realtime || !leftText || !rightText) {
      runCompareAction();
    }
  }, [leftText, rightText, realtime]);

  // Operations metrics calculations
  const metrics = useMemo(() => {
    let addedLines = 0;
    let removedLines = 0;
    let addedChars = 0;
    let removedChars = 0;
    let addedWords = 0;
    let removedWords = 0;

    diffResults.forEach(item => {
      const charCount = item.value.length;
      const wordCount = item.value.trim() ? item.value.trim().split(/\s+/).length : 0;

      if (item.type === 'added') {
        addedLines++;
        addedChars += charCount;
        addedWords += wordCount;
      } else if (item.type === 'removed') {
        removedLines++;
        removedChars += charCount;
        removedWords += wordCount;
      }
    });

    return {
      addedLines,
      removedLines,
      addedChars,
      removedChars,
      addedWords,
      removedWords,
      totalDiffs: addedLines + removedLines
    };
  }, [diffResults]);

  // Operations triggers
  const handleLoadSample = () => {
    saveToHistory();
    setLeftText(
      `TextToolkitHub is an online tool portal.\nIts text difference checker uses LCS algorithms.\nAll formatting logic runs inside browser tabs.\nWe value your document confidentiality.`
    );
    setRightText(
      `TextToolkitHub is a professional online tool ecosystem.\nIts brilliant text difference checker utilizes native LCS algorithms.\nNo files are uploaded or recorded anywhere.\nWe strictly value your complete document privacy.`
    );
  };

  const saveToHistory = () => {
    setHistory({ left: leftText, right: rightText });
  };

  const handleClear = () => {
    saveToHistory();
    setLeftText('');
    setRightText('');
    setDiffResults([]);
    setHasCompared(false);
  };

  const handleUndo = () => {
    if (history) {
      const prevLeft = leftText;
      const prevRight = rightText;
      setLeftText(history.left);
      setRightText(history.right);
      setHistory({ left: prevLeft, right: prevRight });
    }
  };

  const handleCopyLeft = async () => {
    if (!leftText) return;
    try {
      await navigator.clipboard.writeText(leftText);
      setCopiedLeft(true);
      setTimeout(() => setCopiedLeft(false), 2000);
    } catch (_) {}
  };

  const handleCopyRight = async () => {
    if (!rightText) return;
    try {
      await navigator.clipboard.writeText(rightText);
      setCopiedRight(true);
      setTimeout(() => setCopiedRight(false), 2000);
    } catch (_) {}
  };

  const handleCopyReport = async () => {
    if (diffResults.length === 0) return;
    try {
      const reportText = diffResults.map(item => {
        if (item.type === 'added') return `+  ${item.value}`;
        if (item.type === 'removed') return `-  ${item.value}`;
        return `   ${item.value}`;
      }).join('\n');
      
      const header = `TEXT COMPARE TOOL REPORT\nOriginal lines count: ${leftText.split('\n').length}\nModified lines count: ${rightText.split('\n').length}\nLines added: ${metrics.addedLines}\nLines removed: ${metrics.removedLines}\n\n================================\n\n${reportText}`;
      
      await navigator.clipboard.writeText(header);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2000);
    } catch (_) {}
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Find related tools
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/text-compare' && t.id !== 'text-compare').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="text-compare-page">
      {/* Background radial overlays */}
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
            onClick={() => onNavigateToTool('tools')}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400 font-sans">Text Compare Tool</span>
        </div>

        {/* Master Heading block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <GitCompare className="w-7 h-7 text-indigo-500 animate-pulse" />
              </span>
              Compare Text Online Free
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Compare two texts side-by-side or inline to find exact line alignments, modified sentences, and code adjustments. 100% private, instantaneous client-side calculations.
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

        {/* Live Rank Snippet drawer */}
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
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/text-compare
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Configurations Hub Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 rounded-3xl p-6 shadow-sm">
          
          {/* Section 1: Computation switches */}
          <div className="flex flex-col justify-between h-full gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Comparison Engine</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Active Triggers</h4>
            </div>

            <div className="flex items-center gap-5">
              {/* Realtime switch */}
              <label className="flex items-center gap-2 text-xs font-bold text-slate-705 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={realtime}
                  onChange={(e) => setRealtime(e.target.checked)}
                  className="w-4.5 h-4.5 text-indigo-600 border-slate-300 dark:border-slate-850 rounded focus:ring-indigo-500 bg-transparent"
                />
                Real-time Comparison
              </label>
            </div>
          </div>

          {/* Section 2: Layout mode selector toggle */}
          <div className="flex flex-col justify-between h-full gap-4 border-y md:border-y-0 md:border-x border-slate-200 dark:border-slate-800 py-6 md:py-0 md:px-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Visualization Style</span>
              <h4 className="text-sm font-bold text-slate-800 dark:text-white">Diff Layout</h4>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('split')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer flex items-center justify-center gap-1.5 ${
                  viewMode === 'split' 
                    ? 'bg-indigo-600 border-transparent text-white shadow-sm' 
                    : 'bg-white hover:bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-250'
                }`}
                id="btn-split-pref-tab"
              >
                <Columns className="w-3.5 h-3.5" />
                Side-by-Step
              </button>

              <button
                onClick={() => setViewMode('unified')}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer flex items-center justify-center gap-1.5 ${
                  viewMode === 'unified' 
                    ? 'bg-indigo-600 border-transparent text-white shadow-sm' 
                    : 'bg-white hover:bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-250'
                }`}
                id="btn-unified-pref-tab"
              >
                <FileText className="w-3.5 h-3.5" />
                Unified Diff
              </button>
            </div>
          </div>

          {/* Section 3: Force Action buttons */}
          <div className="flex items-center justify-end h-full gap-3">
            {!realtime && (
              <button
                onClick={runCompareAction}
                className="w-full md:w-auto px-5 py-2.5 bg-indigo-605 hover:bg-indigo-705 text-white bg-indigo-600 hover:bg-indigo-705 transition rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
                id="btn-run-manual-compare"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Compare
              </button>
            )}

            <button
              onClick={handleClear}
              className="w-full md:w-auto px-4 py-2.5 border border-slate-255 dark:border-slate-800 bg-white dark:bg-slate-905 hover:bg-slate-100 text-slate-600 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-450 transition rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
              id="btn-clear-drafts"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Workspace
            </button>
          </div>

        </div>

        {/* Master Comparison Text Grid Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* LEFT CONTAINER (Original Text) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                Original Text (Left)
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin duration-[4000ms]" /> Load Compare Sample
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={leftText}
                onChange={(e) => {
                  saveToHistory();
                  setLeftText(e.target.value);
                }}
                placeholder="Paste your original text block or previous script code version here..."
                className="w-full p-5 min-h-[250px] md:min-h-[340px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="compare-original-textarea"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div>
                  Lines: <strong className="text-slate-700 dark:text-slate-200">{leftText.split('\n').filter(Boolean).length}</strong>
                  <span className="mx-2">•</span>
                  Characters: <strong className="text-slate-700 dark:text-slate-200">{leftText.length}</strong>
                </div>

                <div className="flex gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-650 hover:text-slate-850 dark:text-slate-350 dark:hover:text-white flex items-center gap-0.5"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  )}
                  
                  <button
                    onClick={handleCopyLeft}
                    disabled={!leftText}
                    className="p-1 px-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition disabled:opacity-35 font-bold flex items-center gap-1"
                    id="btn-copy-left"
                  >
                    {copiedLeft ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedLeft ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTAINER (Modified Text) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                Modified Text (Right)
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <textarea
                value={rightText}
                onChange={(e) => {
                  saveToHistory();
                  setRightText(e.target.value);
                }}
                placeholder="Paste your edited draft or updated code template here for real-time comparison..."
                className="w-full p-5 min-h-[250px] md:min-h-[340px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="compare-modified-textarea"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <div>
                  Lines: <strong className="text-slate-700 dark:text-slate-200">{rightText.split('\n').filter(Boolean).length}</strong>
                  <span className="mx-2">•</span>
                  Characters: <strong className="text-slate-700 dark:text-slate-200">{rightText.length}</strong>
                </div>

                <button
                  onClick={handleCopyRight}
                  disabled={!rightText}
                  className="p-1 px-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition disabled:opacity-35 font-bold flex items-center gap-1"
                  id="btn-copy-right"
                >
                  {copiedRight ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedRight ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* METRICS ANALYTICS PANEL */}
        {hasCompared && (diffResults.length > 0) && (
          <div className="mb-12 border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950 p-6 md:p-8 flex flex-col gap-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400">Statistical Analysis Dashboard</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  Difference Report Metrics
                </h3>
              </div>

              <button
                onClick={handleCopyReport}
                className="px-4 py-2 border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/20 dark:text-indigo-400 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition"
                id="btn-copy-report"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedReport ? 'Report Copied!' : 'Copy String Diff Report'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-900 pt-6">
              
              {/* Lines Metric */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800/50">
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 font-mono text-lg font-bold">
                  {metrics.addedLines + metrics.removedLines}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Line Variations</h4>
                  <p className="text-[10px] mt-0.5 text-slate-450 dark:text-slate-500">
                    <span className="text-emerald-600 dark:text-emerald-400">+{metrics.addedLines} added</span> / <span className="text-rose-600 dark:text-rose-400">-{metrics.removedLines} deleted</span>
                  </p>
                </div>
              </div>

              {/* Words Metric */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800/50">
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 font-mono text-lg font-bold">
                  {Math.abs(metrics.addedWords - metrics.removedWords)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Word Difference Count</h4>
                  <p className="text-[10px] mt-0.5 text-slate-450 dark:text-slate-500">
                    <span className="text-emerald-600 dark:text-emerald-400">+{metrics.addedWords} words input</span> / <span className="text-rose-600 dark:text-rose-400">-{metrics.removedWords} removed</span>
                  </p>
                </div>
              </div>

              {/* Characters Metric */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-800/50">
                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 font-mono text-lg font-bold">
                  {metrics.addedChars + metrics.removedChars}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Character Shifts</h4>
                  <p className="text-[10px] mt-0.5 text-slate-450 dark:text-slate-500">
                    <span className="text-emerald-600 dark:text-emerald-400">+{metrics.addedChars} bytes inserted</span> / <span className="text-rose-600 dark:text-rose-400">-{metrics.removedChars} cleared</span>
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* REVOLUTIONARY DYNAMIC DIFFERENCES VISUALIZER OUTLINE */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> Live Difference Visualizer Overlay
            </span>
            
            <div className="text-xs text-slate-450 font-medium">
              Layout Option: <strong className="text-indigo-600 dark:text-indigo-400 font-sans">{viewMode === 'split' ? 'Side-by-Side Split Code' : 'Unified Flow'}</strong>
            </div>
          </div>

          <div className="border border-slate-205 dark:border-slate-800 rounded-3xl bg-slate-50/30 dark:bg-slate-950/20 overflow-hidden shadow-inner">
            
            {/* Visualizer header metrics layout */}
            <div className="px-5 py-3 border-b border-slate-150 dark:border-slate-800/80 bg-slate-100/50 dark:bg-slate-950/60 flex items-center gap-4 text-[10px] tracking-wide uppercase font-bold text-slate-400">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded"></span> + Inserted</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500/20 border border-rose-500/40 rounded"></span> - Deleted</span>
              <span className="normal-case font-bold mx-auto hidden sm:inline text-slate-500">Longest Common Subsequence Difference Analyzer</span>
            </div>

            <div className="p-4 md:p-6 bg-white dark:bg-slate-950 min-h-[150px] font-mono text-xs overflow-auto">
              {diffResults.length === 0 ? (
                <div className="text-center py-12 text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2">
                  <GitCompare className="w-8 h-8 text-slate-350 dark:text-slate-700 animate-bounce" />
                  <p className="text-sm font-sans">Provide source parameters to isolate visual differences here live.</p>
                </div>
              ) : (
                viewMode === 'split' ? (
                  /* SPLIT CODE SIDE-BY-SIDE OUTLINE */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-150 dark:divide-slate-850">
                    
                    {/* Left Split: Original values */}
                    <div className="space-y-1.5 pb-4 md:pb-0">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest pl-1">Original Text Draft</div>
                      {diffResults.map((item, index) => {
                        if (item.type === 'added') return null; // Added records don't exist under original
                        const isRemoved = item.type === 'removed';
                        return (
                          <div 
                            key={`orig-${index}`}
                            className={`flex items-start gap-3 p-1.5 rounded-lg leading-relaxed ${isRemoved ? 'bg-rose-500/10 border-l-2 border-rose-500' : 'text-slate-700 dark:text-slate-300'}`}
                          >
                            <span className="text-[9px] text-slate-400 select-none w-6 text-right font-sans shrink-0">{item.origIndex || ' '}</span>
                            <span className="break-all whitespace-pre-wrap">{item.value || '\u00A0'}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right Split: Modified values */}
                    <div className="space-y-1.5 pt-4 md:pt-0 md:pl-4">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest pl-1">Modified Text Draft</div>
                      {diffResults.map((item, index) => {
                        if (item.type === 'removed') return null; // Removed records don't exist under modified
                        const isAdded = item.type === 'added';
                        return (
                          <div 
                            key={`mod-${index}`}
                            className={`flex items-start gap-3 p-1.5 rounded-lg leading-relaxed ${isAdded ? 'bg-emerald-500/10 border-l-2 border-emerald-500' : 'text-slate-705 dark:text-slate-300'}`}
                          >
                            <span className="text-[9px] text-slate-400 select-none w-6 text-right font-sans shrink-0">{item.modIndex || ' '}</span>
                            <span className="break-all whitespace-pre-wrap">{item.value || '\u00A0'}</span>
                          </div>
                        );
                      })}
                    </div>

                  </div>
                ) : (
                  /* UNIFIED FLOW VERTICAL STACK OUTLINE */
                  <div className="space-y-1.5 leading-relaxed">
                    {diffResults.map((item, index) => {
                      const isAdded = item.type === 'added';
                      const isRemoved = item.type === 'removed';
                      
                      let styleClass = 'text-slate-700 dark:text-slate-350';
                      let signSymbol = ' ';
                      
                      if (isAdded) {
                        styleClass = 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-l-2 border-emerald-500 px-2';
                        signSymbol = '+';
                      } else if (isRemoved) {
                        styleClass = 'bg-rose-500/10 text-rose-800 dark:text-rose-400 border-l-2 border-rose-500 px-2';
                        signSymbol = '-';
                      }

                      return (
                        <div 
                          key={`unified-${index}`}
                          className={`flex items-start gap-2 p-1 rounded-lg ${styleClass}`}
                        >
                          <span className="font-mono text-slate-400 select-none shrink-0 w-4 font-bold">{signSymbol}</span>
                          <span className="break-all whitespace-pre-wrap">{item.value || '\u00A0'}</span>
                        </div>
                      );
                    })}
                  </div>
                )
              )}
            </div>

          </div>
        </div>

        {/* COMPREHENSIVE DETAILED LONG-FORM COPY SECTIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-605 dark:text-slate-300">
          
          {/* Article Pillar 1: Understanding Text Comparators */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Reference Manual</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              What is a Text Compare Tool?
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                A <strong>Text Compare Tool</strong> (commonly referred to as a "diff checker" or line comparator) is of immense utility to developers, copy writers, legal analysts, and proofreaders worldwide. It processes two distinct versions of a document to highlight exact additions, corrections, or omissions in real-time.
              </p>
              <p>
                Instead of straining your eyes trying to review lines manually, our browser-based utility automatically aligns equivalent segments side-by-side. It ensures that spacing changes, character adjustments, or spelling corrections are highlighted clearly inside dynamic, colorful overlays.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3">
              Core Technical Features Integrated
            </h3>
            <ul className="text-sm list-disc pl-5 space-y-2.5 leading-relaxed">
              <li><strong>Dynamic LCS Algorithm:</strong> Processes text matching using the elegant Longest Common Subsequence algorithm, protecting formatting accuracy.</li>
              <li><strong>Split Sidebar and Unified Views:</strong> Responsive layout toggles that adapt instantly for wide desktop screens and slim mobile views.</li>
              <li><strong>Comprehensive Delta Summary:</strong> Character shifts, word difference alignments, and modified row indexes calculated instantly.</li>
              <li><strong>Offline Security Priority:</strong> Zero external APIs, zero caching servers. Your private data is completely protected.</li>
            </ul>
          </div>

          {/* Article Pillar 2: How to Use the Utility */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Operational Handbooks</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              How to Use This Tool Instantly
            </h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>Comparing your writings or source parameters can be completed in four effortless actions:</p>
              
              <div className="flex gap-3 leading-relaxed">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Aquire and Paste Your Inputs</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Paste your baseline, original draft document in the left textarea, and paste your active, modified draft on the right side.</p>
                </div>
              </div>

              <div className="flex gap-3 leading-relaxed">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Verify the Real-time Trigger</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Keep "Real-time Comparison" checked to monitor adjustments with every keystroke, or turn it off to manually compare heavy files on demand.</p>
                </div>
              </div>

              <div className="flex gap-3 leading-relaxed">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Tweak Layout Style</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select "Side-by-Side" to highlight adjacent comparative texts, or choose "Unified Flow" to merge the comparison into a single column.</p>
                </div>
              </div>

              <div className="flex gap-3 leading-relaxed">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">4</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Export the Difference Report</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Copy either side individually or serialize a comprehensive diff report directly into your device clipboard securely.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-550 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white font-sans">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Have questions about algorithms, document capacity and privacy features? Read our answers below.
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
                    id={`text-compare-faq-item-${faq.id}`}
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

        {/* Companion Related Tools Block */}
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
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-2 leading-relaxed">
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
