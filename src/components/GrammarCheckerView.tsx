import React, { useState, useEffect, useMemo } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import {
  SpellCheck,
  FileText,
  Sparkles,
  Copy,
  Check,
  Trash2,
  ArrowLeft,
  ChevronRight,
  Info,
  HelpCircle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Globe,
  BookmarkCheck,
  Wand2,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRightLeft
} from 'lucide-react';
import { analyzeGrammar, getCorrectedText, GrammarIssue } from '../utils/grammar-engine.ts';

interface GrammarCheckerViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function GrammarCheckerView({ onNavigateToTool, onNavigateHome }: GrammarCheckerViewProps) {
  const [text, setText] = useState('');
  const [history, setHistory] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedCorrected, setCopiedCorrected] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'compare' | 'ledger'>('editor');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // SEO parameters as requested by the user
  const seoTitle = "Free Grammar Checker Online | TextToolkitHub";
  const seoDescription = "Check grammar, punctuation, spelling, and writing mistakes instantly with our free Grammar Checker tool.";

  const faqs = [
    {
      id: 1,
      question: "What is the Free Grammar Checker Tool?",
      answer: "The Grammar Checker is an online processing application designed to analyze your paragraph structure, spelling variables, punctuation configurations, and core capitalization rules. It helps writers, editors, students, and SEO managers correct their copy instantly."
    },
    {
      id: 2,
      question: "How does the local analysis work?",
      answer: "Unlike expensive and intrusive online services that collect your personal essays to train AI datasets, our grammar checking engine executes 100% locally. Your private writing drafts never leave your device, ensuring total privacy."
    },
    {
      id: 3,
      question: "What issues can this grammar check identify?",
      answer: "Our local scanner captures four primary categories of issues: Spelling errors (using a common typographical correction database), Capitalization (such as sentence start corrections, day/month properties, and capital 'I' pronoun rules), Punctuation anomalies (such as duplicate commas, extraneous spacing, and missing intervals), and Grammar anomalies (such as 'a' vs 'an' prefixes and singular third-person auxiliary agreements)."
    },
    {
      id: 4,
      question: "How do I fix errors in the Interactive Editor?",
      answer: "Simply paste your writing and head to the 'Interactive Highlight Editor'. Words with suspected errors are marked with wavy lines. Click any highlighted segment to open a helper popup showing the explanation and recommended fix, and click 'Fix Issue' to apply it in real-time."
    }
  ];

  // Dynamic SEO Setup with JSON-LD Schema
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

    const scriptId = "grammar-checker-json-ld";
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

  // Compute live issues using the modular grammar engine
  const issues = useMemo(() => {
    return analyzeGrammar(text);
  }, [text]);

  // Generate fully corrected version of the text
  const correctedVersion = useMemo(() => {
    return getCorrectedText(text, issues);
  }, [text, issues]);

  // Statistics summaries
  const stats = useMemo(() => {
    const categories = {
      grammar: 0,
      spelling: 0,
      punctuation: 0,
      capitalization: 0,
    };
    issues.forEach(issue => {
      categories[issue.type] = (categories[issue.type] || 0) + 1;
    });

    return {
      total: issues.length,
      ...categories
    };
  }, [issues]);

  // Toolbar Actions
  const handleLoadSample = () => {
    setHistory(text);
    setText(`This are a sample text to show how the grammar checker works. teh engine can detect spelling mistakes recieve errors, punctuation issues ,and missing capitalization of months like january and pronouns like i.

when you paste your writeups under the Interactive Editor, you will see immediate highlights. your welcoming to try fixing these rules! It's color and standard pacing will guide you to write more better then before.`);
    setSelectedIssueId(null);
  };

  const handleClear = () => {
    setHistory(text);
    setText('');
    setSelectedIssueId(null);
  };

  const handleUndo = () => {
    const current = text;
    setText(history);
    setHistory(current);
    setSelectedIssueId(null);
  };

  const handleCopyOriginal = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write error: ', err);
    }
  };

  const handleCopyCorrected = async () => {
    if (!correctedVersion) return;
    try {
      await navigator.clipboard.writeText(correctedVersion);
      setCopiedCorrected(true);
      setTimeout(() => setCopiedCorrected(false), 2000);
    } catch (err) {
      console.warn('Clipboard write error: ', err);
    }
  };

  // Safe apply of a single issue correction
  const handleApplyCorrection = (issue: GrammarIssue) => {
    setHistory(text);
    
    // Stitch corrections around the issue offset offset
    const beforeSegment = text.substring(0, issue.offset);
    const correctedSegment = issue.correction;
    const afterSegment = text.substring(issue.offset + issue.length);
    const nextText = beforeSegment + correctedSegment + afterSegment;
    
    setText(nextText);
    setSelectedIssueId(null);
  };

  // Safe apply all corrections
  const handleApplyAllCorrections = () => {
    if (issues.length === 0) return;
    setHistory(text);
    setText(correctedVersion);
    setSelectedIssueId(null);
  };

  // Segmenting chunks for high-fidelity inline highlighting inside the Interactive Editor
  const textChunks = useMemo(() => {
    if (!text) return [];
    const chunks: { text: string; issue?: GrammarIssue }[] = [];
    let lastIndex = 0;

    issues.forEach(issue => {
      // If there's overlapping offset indices due to dynamic issues indexing, resolve safely
      if (issue.offset < lastIndex) {
        return;
      }
      
      // Plain text segment before the error
      if (issue.offset > lastIndex) {
        chunks.push({ text: text.substring(lastIndex, issue.offset) });
      }

      // Suspicious error segment
      chunks.push({
        text: text.substring(issue.offset, issue.offset + issue.length),
        issue
      });

      lastIndex = issue.offset + issue.length;
    });

    if (lastIndex < text.length) {
      chunks.push({ text: text.substring(lastIndex) });
    }

    return chunks;
  }, [text, issues]);

  const activeSelectedIssue = useMemo(() => {
    if (!selectedIssueId) return null;
    return issues.find(i => i.id === selectedIssueId) || null;
  }, [selectedIssueId, issues]);

  // Color mapping utilities based on mistake types
  const getIssueStyles = (type: GrammarIssue['type']) => {
    switch (type) {
      case 'spelling':
        return {
          borderClass: 'border-red-500/80 dark:border-red-400/80 hover:bg-red-500/10 dark:hover:bg-red-955/20',
          textClass: 'decoration-red-500 dark:decoration-red-400',
          bgClass: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-100',
          badgeText: 'Spelling'
        };
      case 'capitalization':
        return {
          borderClass: 'border-sky-500/80 dark:border-sky-400/80 hover:bg-sky-500/10 dark:hover:bg-sky-950/20',
          textClass: 'decoration-sky-500 dark:decoration-sky-400',
          bgClass: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-100',
          badgeText: 'Capitalization'
        };
      case 'punctuation':
        return {
          borderClass: 'border-amber-500/80 dark:border-amber-400/80 hover:bg-amber-500/10 dark:hover:bg-amber-950/20',
          textClass: 'decoration-amber-500 dark:decoration-amber-400',
          bgClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-100',
          badgeText: 'Punctuation'
        };
      case 'grammar':
        return {
          borderClass: 'border-indigo-500/80 dark:border-indigo-400/80 hover:bg-indigo-550/10 dark:hover:bg-indigo-950/20',
          textClass: 'decoration-indigo-500 dark:decoration-indigo-405',
          bgClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-750 dark:text-indigo-400 border-indigo-150',
          badgeText: 'Grammar'
        };
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/grammar-checker').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="grammar-checker-page">
      {/* Ambient background glowing elements */}
      <div className="glow-accent top-12 left-10"></div>
      <div className="glow-accent top-96 right-16"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">

        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold font-sans">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
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
          <span className="text-indigo-600 dark:text-indigo-400">Grammar Checker</span>
        </div>

        {/* Header Title segment */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <SpellCheck className="w-7 h-7 text-indigo-500" />
              </span>
              Grammar Checker Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Scan your compositions for typographical mistakes, spelling issues, punctuation bugs, and concord errors securely with our browser-authoritative parser.
            </p>
          </div>

          {/* Inspect SEO Tag Segment */}
          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-952 dark:hover:bg-slate-800 transition shadow-inner cursor-pointer"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Hide Search Preview' : 'Show Search Preview'}
          </button>
        </div>

        {/* Real Google Snippet Preview Drawer */}
        {showSeoMeta && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Real Google Search Result Snippet
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-404 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/grammar-checker
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-620 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Master Workspace Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">

          {/* LEFT SIDE: Workspace Card (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">

            {/* Main Workspace Workspace Box */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-501 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              
              {/* Ribbon header segment */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  Privacy-Safe proofreading station
                </span>

                <button
                  onClick={handleLoadSample}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  id="btn-sample-load"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Sample Raw Text
                </button>
              </div>

              {/* Dynamic Tab Toggle */}
              <div className="px-5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950 flex gap-1.5 flex-wrap">
                <button
                  onClick={() => { setActiveTab('editor'); setSelectedIssueId(null); }}
                  className={`py-2 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'editor' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-405 hover:text-slate-800 dark:hover:text-slate-100'}`}
                >
                  Interactive Highlight Editor
                </button>
                <button
                  onClick={() => { setActiveTab('compare'); setSelectedIssueId(null); }}
                  className={`py-2 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'compare' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-405 hover:text-slate-800 dark:hover:text-slate-100'}`}
                >
                  Side-by-Side Diff View
                </button>
                <button
                  onClick={() => { setActiveTab('ledger'); setSelectedIssueId(null); }}
                  className={`py-2 px-3.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'ledger' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold' : 'border-transparent text-slate-405 hover:text-slate-800 dark:hover:text-slate-100'}`}
                >
                  Detailed Issues Ledger ({stats.total})
                </button>
              </div>

              {/* Dual Layout: Textarea & Rich Highlights Preview depending on active tab */}
              <div className="relative min-h-[320px] md:min-h-[400px] flex flex-col">
                {activeTab === 'editor' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-850 flex-grow">
                    
                    {/* Input Block Column */}
                    <div className="p-5 flex flex-col">
                      <label htmlFor="grammar-textarea" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                        Edit Draft Here
                      </label>
                      <textarea
                        id="grammar-textarea"
                        value={text}
                        onChange={(e) => {
                          setText(e.target.value);
                          setSelectedIssueId(null);
                        }}
                        placeholder="Paste your paragraph or write your sentence here..."
                        className="w-full h-full min-h-[200px] md:min-h-[300px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-none font-sans leading-relaxed"
                      />
                    </div>

                    {/* Preview Highlights Column */}
                    <div className="p-5 bg-slate-50/20 dark:bg-slate-950/25 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-indigo-500" /> Interactive Review Canvas
                        </span>

                        {issues.length > 0 && (
                          <button
                            onClick={handleApplyAllCorrections}
                            className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                            id="apply-all-corrections-top"
                          >
                            <Wand2 className="w-3 h-3" /> Quick Fix All
                          </button>
                        )}
                      </div>

                      {!text ? (
                        <div className="flex items-center justify-center flex-grow text-slate-400 dark:text-slate-550 text-xs italic font-sans py-12">
                          Your draft highlights will display in real time.
                        </div>
                      ) : (
                        <div className="text-base text-slate-800 dark:text-slate-100 leading-relaxed font-sans whitespace-pre-wrap flex-grow p-1 rounded-xl">
                          {textChunks.map((chunk, idx) => {
                            if (!chunk.issue) {
                              return <span key={idx} className="text-slate-700 dark:text-slate-200">{chunk.text}</span>;
                            }

                            const details = getIssueStyles(chunk.issue.type);
                            const isSelected = selectedIssueId === chunk.issue.id;

                            return (
                              <span
                                key={idx}
                                onClick={() => setSelectedIssueId(chunk.issue!.id)}
                                className={`cursor-pointer underline decoration-wavy underline-offset-4 decoration-2 transition-all p-0.5 rounded-sm select-auto ${details.textClass} ${isSelected ? 'bg-indigo-100/40 dark:bg-indigo-950/30 border border-indigo-500/30' : 'hover:bg-slate-100 dark:hover:bg-slate-805'}`}
                                title={`Click to fix: ${details.badgeText}`}
                              >
                                {chunk.text}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {activeTab === 'compare' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-850 flex-grow">
                    
                    {/* Left Panel: Original Draft */}
                    <div className="p-5 flex flex-col">
                      <span className="text-[10px] uppercase font-bold text-red-500 tracking-wider mb-2 block flex items-center gap-1 font-sans">
                        <AlertCircle className="w-3.5 h-3.5" /> Original Version
                      </span>

                      {!text ? (
                        <div className="text-slate-400 dark:text-slate-550 text-xs italic py-12 flex-grow flex items-center justify-center">
                          Input text to view side-by-side comparison.
                        </div>
                      ) : (
                        <div className="text-sm font-sans text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap flex-grow p-3 bg-slate-50/20 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-slate-800">
                          {textChunks.map((chunk, idx) => {
                            if (!chunk.issue) {
                              return <span key={idx}>{chunk.text}</span>;
                            }
                            return (
                              <mark key={idx} className="bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 px-0.5 rounded line-through">
                                {chunk.text}
                              </mark>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Right Panel: Fully Corrected Copy */}
                    <div className="p-5 flex flex-col bg-slate-50/10 dark:bg-slate-950/20">
                      <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider mb-2 flex items-center justify-between font-sans">
                        <span className="flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Beautifully Corrected version</span>
                        {text && (
                          <button
                            onClick={handleCopyCorrected}
                            className="bg-white hover:bg-slate-50 border border-slate-205 dark:bg-slate-900 dark:border-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-600 dark:text-slate-300 shadow-sm flex items-center gap-1 transition"
                          >
                            {copiedCorrected ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                            {copiedCorrected ? 'Copied!' : 'Copy Corrected'}
                          </button>
                        )}
                      </span>

                      {!text ? (
                        <div className="text-slate-405 dark:text-slate-550 text-xs italic py-12 flex-grow flex items-center justify-center">
                          Clean typography will show here.
                        </div>
                      ) : (
                        <div className="text-sm font-sans text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-wrap flex-grow p-3 bg-slate-50/20 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                          {textChunks.map((chunk, idx) => {
                            if (!chunk.issue) {
                              return <span key={idx}>{chunk.text}</span>;
                            }
                            return (
                              <mark key={idx} className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 px-0.5 rounded font-bold">
                                {chunk.issue.correction}
                              </mark>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}

                {activeTab === 'ledger' && (
                  <div className="p-5 flex-grow">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 block">
                      Exhaustive review breakdown
                    </span>

                    {issues.length === 0 ? (
                      <div className="text-center py-20 text-slate-400 dark:text-slate-605">
                        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3 animate-bounce" />
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">Aesthetic Copy Clean!</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No grammatical inconsistencies, spelling bugs, or layout spacing alerts were raised.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[450px] overflow-y-auto pr-1">
                        {issues.map((issue) => {
                          const details = getIssueStyles(issue.type);
                          return (
                            <div
                              key={issue.id}
                              className={`p-4 border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/40 ${details.bgClass}`}
                            >
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`text-[10px] uppercase font-mono tracking-wider font-extrabold px-2 py-0.5 rounded-md ${details.bgClass} border`}>
                                    {details.badgeText}
                                  </span>
                                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Offset: {issue.offset} char</span>
                                </div>

                                <div className="text-sm font-sans">
                                  Change <strong className="text-red-600 dark:text-red-400 line-through">"{issue.original}"</strong> to <strong className="text-emerald-605 dark:text-emerald-450">"{issue.correction}"</strong>
                                </div>
                                <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">{issue.explanation}</p>
                              </div>

                              <button
                                onClick={() => handleApplyCorrection(issue)}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl text-xs font-bold transition flex items-center gap-1 self-end md:self-auto cursor-pointer font-sans"
                              >
                                Accept Fix
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action and Metrics board */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                
                {/* Real-time Dynamic Metrics Status Line */}
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">Total Issues: <strong className="text-slate-700 dark:text-slate-200 font-mono">{stats.total}</strong></span>
                  {stats.spelling > 0 && <span>Spelling: <strong className="text-red-500 font-mono">{stats.spelling}</strong></span>}
                  {stats.capitalization > 0 && <span>Capital: <strong className="text-sky-500 font-mono">{stats.capitalization}</strong></span>}
                  {stats.grammar > 0 && <span>Grammar: <strong className="text-indigo-500 font-mono">{stats.grammar}</strong></span>}
                  {stats.punctuation > 0 && <span>Punctuation: <strong className="text-amber-500 font-mono">{stats.punctuation}</strong></span>}
                </div>

                {/* Operations board */}
                <div className="flex items-center gap-2">
                  
                  {/* Single tier undo drawer */}
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="p-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-350 rounded-xl flex items-center gap-1 transition text-xs font-semibold"
                      title="Undo last statement"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Undo
                    </button>
                  )}

                  {/* Clear block */}
                  <button
                    onClick={handleClear}
                    disabled={!text}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-952/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition disabled:opacity-35 disabled:hover:bg-white disabled:hover:text-slate-400 cursor-pointer"
                    title="Clear paragraph contents"
                    id="btn-clear"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>

                  {/* Complete copy blueprint */}
                  <button
                    onClick={handleCopyOriginal}
                    disabled={!text}
                    className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-slate-205 dark:border-slate-800 bg-white hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:text-slate-250 dark:hover:bg-indigo-950/20 shadow-sm'}`}
                    id="btn-copy-original"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Original!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Original
                      </>
                    )}
                  </button>

                  {/* Complete copy corrected text button */}
                  <button
                    onClick={handleCopyCorrected}
                    disabled={!text || issues.length === 0}
                    className={`px-4 py-2 rounded-xl flex items-center gap-1.5 text-xs font-extrabold transition shadow-md disabled:hidden cursor-pointer ${copiedCorrected ? 'bg-emerald-600 hover:bg-emerald-750 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600'}`}
                    id="btn-copy-corrected"
                  >
                    {copiedCorrected ? (
                      <>
                        <Check className="w-3.5 h-3.5 font-bold" /> Copied Corrected!
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" /> Copy Corrected Text
                      </>
                    )}
                  </button>

                </div>

              </div>

            </div>

            {/* Dynamic Interactive contextual popover card under the highlight text context */}
            <AnimatePresence>
              {activeSelectedIssue && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className={`border p-4 rounded-2xl shadow-sm hover:shadow relative ${getIssueStyles(activeSelectedIssue.type).bgClass}`}
                  id="active-issue-dock"
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 border rounded-md font-mono">
                      {getIssueStyles(activeSelectedIssue.type).badgeText} Inaccuracy
                    </span>
                    <button
                      onClick={() => setSelectedIssueId(null)}
                      className="text-slate-400 hover:text-slate-650 dark:hover:text-white text-xs font-bold"
                    >
                      Dismiss
                    </button>
                  </div>

                  <h4 className="text-sm font-bold font-sans">
                    Change <strong className="text-red-650 bg-red-150 px-1.5 py-0.5 rounded line-through">"{activeSelectedIssue.original}"</strong> to <strong className="text-emerald-700 bg-emerald-150 px-1.5 py-0.5 rounded font-extrabold">"{activeSelectedIssue.correction}"</strong>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{activeSelectedIssue.explanation}</p>

                  <div className="flex gap-2.5 mt-3 justify-end">
                    <button
                      onClick={() => handleApplyCorrection(activeSelectedIssue)}
                      className="px-4 py-2 bg-indigo-605 hover:bg-indigo-900 text-white dark:bg-indigo-550 dark:hover:bg-indigo-600 rounded-xl text-xs font-extrabold transition cursor-pointer"
                    >
                      Instant Fix &rarr;
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* RIGHT SIDE: Dynamic Metrics Dashboard Info Column (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6" id="metrics-rail">
            
            {/* Live Issues distribution metrics chart card */}
            <div className="border border-slate-205 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950 rounded-3xl p-5 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-1.5">
                <Wand2 className="w-4 h-4 text-indigo-500" /> Writing Quality Meter
              </h3>

              {/* Core summary indicator */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-150 dark:border-slate-800 mb-4">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 font-sans">Grammar Health Score</span>
                  <span className="text-2xl font-extrabold text-slate-800 dark:text-white font-mono">
                    {text ? Math.max(0, Math.min(100, Math.round(100 - (stats.total * 6)))) : 100}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${text && stats.total > 5 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${text ? Math.max(10, Math.min(100, Math.round(100 - (stats.total * 6)))) : 100}%` }}
                  />
                </div>
              </div>

              {/* Breakdown Distribution blocks */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-404 bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="font-semibold flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Spelling Inaccuracies</span>
                  <strong className="text-slate-700 dark:text-slate-200 font-mono text-sm">{stats.spelling}</strong>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-404 bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="font-semibold flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> Capitalization Rules</span>
                  <strong className="text-slate-700 dark:text-slate-200 font-mono text-sm">{stats.capitalization}</strong>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-404 bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="font-semibold flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Grammar Anomalies</span>
                  <strong className="text-slate-700 dark:text-slate-200 font-mono text-sm">{stats.grammar}</strong>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-404 bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="font-semibold flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Punctuation Alerts</span>
                  <strong className="text-slate-700 dark:text-slate-200 font-mono text-sm">{stats.punctuation}</strong>
                </div>
              </div>

              {/* Multi action apply all card helper */}
              {issues.length > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-850 pt-4 mt-4">
                  <button
                    onClick={handleApplyAllCorrections}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-bold transition shadow flex items-center justify-center gap-1.5 cursor-pointer font-sans"
                    id="btn-apply-all-sidebar"
                  >
                    <Wand2 className="w-4 h-4" /> Apply All Recommendations
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>

        {/* COMPREHENSIVE EDITORIAL ARTICLE SEGMENT */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Col 1: Writing Science and Grammar Checker values */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500">Writing Science</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              The Science of Pristine Grammar Checker
            </h2>

            <div className="text-sm leading-relaxed space-y-4 font-sans">
              <p>
                Grammar checkers leverage a systemic lookup lexicon and syntax rule parameters to inspect your copy's coherence, spelling rules, and layout parameters. Typographical and agreement mistakes quickly distract audiences, resulting in loss of message authority.
              </p>
              <p>
                Our Free Grammar Checker has been developed with advanced text parsing heuristics. By highlighting spelling slipups, tense matching errors, lowercase pronoun outliers, or duplicate punctuation points locally, it is the safest solution for daily essays, coding readmes, and blog postings.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              How to Leverage Grammar Checker Heuristics
            </h3>
            <ul className="text-sm list-decimal pl-5 space-y-2 leading-relaxed">
              <li>Input or copy-paste raw essays instantly into our proofreader textarea.</li>
              <li>Toggle 'Interactive Highlight Editor' to select colored warning underline spans.</li>
              <li>Click each wavy underline to fetch targeted repair explanations and change parameters.</li>
              <li>Inspect compare version tabs to look up exact character modifications before saving drafts.</li>
            </ul>
          </div>

          {/* Col 2: In-browser Heuristics breakdown */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">Checker Core Benefits</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Local Verification Benchmarks
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">100% Secure & Local</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">We bypass server uploads completely. Zero training scrapers inspect your papers or letters.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Sentence Start Alerts</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Guarantees that lowercase sentence-initial words are flagged automatically for quick capitalizing.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Pronoun Agreements</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Identifies auxiliary verb anomalies like single third-person concord slipups.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-200">Side-by-Side Diffs</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Proofread original vs recommended corrections easily under formatted cards.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50/20 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/40 text-xs leading-relaxed font-sans">
              <span className="font-bold text-indigo-720 dark:text-indigo-400 block mb-1">✓ Precision Grammatical Diagnostics:</span>
              Our contextual logic isolates a vs an prefixes based on surrounding phonetic letter agreements, protecting content formats against common spelling overlaps.
            </div>
          </div>

        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white font-sans">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Learn how TextToolkitHub identifies spelling discrepancies and grammatical rules.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    onClick={() => toggleFaq(faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-indigo-400 dark:hover:border-slate-700 cursor-pointer select-none transition-all duration-200 font-sans"
                    id={`grammar-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                      <div className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-205 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3.5 text-sm text-slate-500 dark:text-slate-404 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-3.5 flex animate-in fade-in slide-in-from-top-1 duration-155">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* RELATED TOOLS RECOMMENDATIONS */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Explore Companion Text Utilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-202 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`related-card-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-indigo-610 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between font-sans">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-404 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-4 block font-sans">
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
