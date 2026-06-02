import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Link2, 
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
  Info,
  CheckCircle,
  Hash,
  Sliders,
  Play
} from 'lucide-react';

interface SlugGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function SlugGeneratorView({ onNavigateToTool, onNavigateHome }: SlugGeneratorViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Advanced slug options
  const [separator, setSeparator] = useState<'-' | '_' | '/'>('-');
  const [stripStopwords, setStripStopwords] = useState<boolean>(false);
  const [removeNumbers, setRemoveNumbers] = useState<boolean>(false);
  const [toLowerCase, setToLowerCase] = useState<boolean>(true);

  // SEO Parameters as requested
  const seoTitle = "SEO Slug Generator Online";
  const seoDescription = "Generate SEO-friendly URL slugs instantly. Convert titles into clean search-engine-friendly URLs.";

  const faqs = [
    {
      id: 1,
      question: "What is a URL Slug?",
      answer: "A slug is the exact portion of a URL address that identifies a particular page under a hierarchy in an easy-to-read, human-friendly format. For instance, in 'example.com/posts/seo-slug-generator', the segment 'seo-slug-generator' is the slug. They explain to search algorithms and users what the topic contains before clicking."
    },
    {
      id: 2,
      question: "Why are URL Slugs crucial for Search Engine Optimization (SEO)?",
      answer: "Search engines like Google rank web addresses holding readable context higher than cryptic databases rows (e.g. '?id=9872'). Aligning primary search keywords cleanly separated by dashes in the URL increases page CTR (Click-Through Rate) and indexing crawl speeds."
    },
    {
      id: 3,
      question: "What does the 'Strip Common Stop Words' option do?",
      answer: "Stop words like 'a', 'an', 'the', 'and', 'or', 'to', 'for' are generally ignored by ranking crawlers because they do not carry target semantics. Removing these helper words keeps your slugs extremely short, crisp, and clean for modern indexers."
    },
    {
      id: 4,
      question: "Can I generate slugs with underscores instead of hyphens?",
      answer: "Yes. While Google guidelines explicitly recommend hyphens over underscores, our tool supports customizing the separator to underscores (_) or single slashes (/) to fit custom system parameters or developers' database seeds."
    },
    {
      id: 5,
      question: "Does this utility upload or record my article titles?",
      answer: "Never. Absolutely all parsing, case lowering, regex character wipes, and string replacements run client-side in active browser script threads inside your sandbox. No cookies, trackers, or remote APIs are called."
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

    const scriptId = "slug-generator-json-ld";
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

  // Live slug generation logic
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let processed = inputText;

    // 1. Unify special characters or accented letters (e.g., é -> e, ñ -> n)
    processed = processed.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 2. Conditionally convert to lowercase
    if (toLowerCase) {
      processed = processed.toLowerCase();
    }

    // 3. Optional stop-words stripping (helps with clean SEO indexing)
    if (stripStopwords) {
      const stopwords = ['a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 'from', 'by', 'of', 'in', 'with', 'about', 'as', 'is', 'are', 'was', 'were', 'it', 'its', 'this', 'that', 'these', 'those'];
      // Match words while keeping boundary matches
      const words = processed.split(/\s+/);
      const filteredWords = words.filter(word => !stopwords.includes(word.replace(/[^a-zA-Z0-9]/g, '')));
      processed = filteredWords.join(' ');
    }

    // 4. Optional number stripping
    if (removeNumbers) {
      processed = processed.replace(/[0-9]/g, '');
    }

    // 5. Replace non-alphanumeric blocks with matching configured separator
    // Note: protect alphanumeric matching, but allow custom separator replacement
    const separatorString = separator;
    
    // Replace all non-alphanumeric characters (including spacing) with a placeholder char
    processed = processed.replace(/[^a-zA-Z0-9]+/g, separatorString);

    // 6. Tidy up repetitive separators (e.g. "my---article" -> "my-article")
    const escapedSeparator = separatorString.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regexDuplicate = new RegExp(`${escapedSeparator}{2,}`, 'g');
    processed = processed.replace(regexDuplicate, separatorString);

    // 7. Prune leading or trailing separators from boundaries
    const regexLeading = new RegExp(`^${escapedSeparator}+`);
    const regexTrailing = new RegExp(`${escapedSeparator}+$`);
    processed = processed.replace(regexLeading, '').replace(regexTrailing, '');

    setOutputText(processed);
  }, [inputText, separator, stripStopwords, removeNumbers, toLowerCase]);

  // Handle operation interactions
  const handleLoadSample = () => {
    saveToHistory();
    setInputText('How To Start A Blog In 2026! A Beginners Step-by-Step Guide');
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
      console.warn('Unable to copy slug result: ', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Find related tools excluding slug-generator
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/slug-generator' && t.id !== 'slug-generator').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="slug-generator-page">
      {/* Decorative background visual accents */}
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
          <span className="text-indigo-600 dark:text-indigo-400">Slug Generator</span>
        </div>

        {/* Header Column Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Link2 className="w-7 h-7 text-indigo-600" />
              </span>
              SEO Slug Generator Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Convert raw titles, long headlines, or manual headings into search-engine-friendly, clean URL slugs instantly. 100% private, client-side generation.
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

        {/* Dynamic SEO SERP Snippet Preview */}
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
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{outputText || 'your-seo-slug-here'}</span>
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

        {/* Advanced Options Dashboard */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-500" /> Slug Formatting Options
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Tune slug configurations live to align with your blogging framework.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Split: Custom Separator */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Separator Style</span>
              <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 p-1">
                <button
                  onClick={() => setSeparator('-')}
                  className={`flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all border border-transparent cursor-pointer ${separator === '-' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                  id="opt-sep-hyphen"
                >
                  Hyphen (-)
                </button>
                <button
                  onClick={() => setSeparator('_')}
                  className={`flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all border border-transparent cursor-pointer ${separator === '_' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                  id="opt-sep-underscore"
                >
                  Underscore (_)
                </button>
                <button
                  onClick={() => setSeparator('/')}
                  className={`flex-1 py-1 px-3 rounded-lg text-xs font-bold transition-all border border-transparent cursor-pointer ${separator === '/' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-650 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
                  id="opt-sep-slash"
                >
                  Slash (/)
                </button>
              </div>
            </div>

            {/* Switch: Remove Stop Words */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">SEO Cleanup</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-55 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={stripStopwords}
                  onChange={(e) => setStripStopwords(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Prune Stopwords (a, the, is...)
              </label>
            </div>

            {/* Switch: Strip Numbers */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Clean Numbers</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-55 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={removeNumbers}
                  onChange={(e) => setRemoveNumbers(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Strip Numerical Digits
              </label>
            </div>

            {/* Switch: Convert to lowercase */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Lowercase Normalization</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-55 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={toLowerCase}
                  onChange={(e) => setToLowerCase(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Standard Lowercase Case
              </label>
            </div>

          </div>
        </div>

        {/* Master Workspace Split Grid Areas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* TITLE INPUT AREA */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> Raw Document Title Input
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin duration-[4000ms]" /> Load SEO Sample
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Type or paste your blog title, document name, or chapter header (e.g., How To Start A Blog In 2026)..."
                className="w-full p-5 min-h-[180px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="slug-generator-input-textarea"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Title Length: <strong className="text-slate-700 dark:text-slate-200">{inputText.length} letters</strong></span>

                <div className="flex items-center gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-650 hover:text-slate-850 dark:text-slate-350 dark:hover:text-white flex items-center gap-0.5 pointer-events-auto"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-35 cursor-pointer"
                    id="btn-clear"
                  >
                    Clear Title
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC SEO URL SLUG OUTPUT */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Generated URL Slug Output
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Synced Live
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <div className="p-5 min-h-[180px] flex items-center justify-center bg-slate-50/20 dark:bg-slate-900/10">
                {outputText ? (
                  <div className="text-center space-y-3 w-full">
                    <p className="text-xs text-slate-405 select-all font-mono break-all py-3.5 px-4 bg-slate-50 border border-slate-200 dark:bg-slate-950 dark:border-slate-800 rounded-2xl w-full">
                      https://example.com/posts/<strong className="text-indigo-600 dark:text-indigo-400">{outputText}</strong>
                    </p>
                    <span className="text-[10px] block text-slate-400 dark:text-slate-500 uppercase tracking-widest font-sans font-extrabold">Final Slug output: <strong className="font-mono text-xs text-emerald-600 dark:text-emerald-400 normal-case">{outputText}</strong></span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic">Clean generated slug output will align live here...</span>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-400 font-medium">
                  Slug Length: <strong className="text-slate-700 dark:text-slate-200">{outputText.length}</strong>
                </span>

                <button
                  onClick={handleCopy}
                  disabled={!outputText}
                  className={`px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/25 dark:text-indigo-400'}`}
                  id="btn-copy"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied Slug!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Slug
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* COMPREHENSIVE REACTION LONG-FORM SECTIONS (Benefits & Guide & FAQ Grid) */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
          
          {/* Article Pillar 1: Understanding URL Slugs & SEO Importance */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">SEO Academy</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              What is a URL Slug and Why Does It Matter?
            </h2>
            <div className="space-y-4">
              <p>
                In web development, a <strong>slug</strong> is the specific string sequence located at the tail-end of a web page address. It references a unique post, page or document within a human-readable structure. For example, instead of loading a page via database IDs like <code>?p=32812</code>, it produces the clean structure <code>/seo-slug-generator</code>.
              </p>
              <p>
                URL slugs play an essential role in Google and bing search ranking indexes. Aligning keywords directly inside your slugs conveys topic relevance to ranking crawlers quickly and boosts your page's organic Click-Through-Rates (CTR) on Search Engine Results Pages (SERPs).
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Why Clean Slugs Improve Search Indexing
            </h3>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed">
              <li><strong>Enhanced Clarity:</strong> Explains page context directly within email forwards and social status text links.</li>
              <li><strong>Search Term Matching:</strong> Crawlers analyze URL tokens to establish contextual relevance when answering search terms.</li>
              <li><strong>Logical Crawling Hierarchy:</strong> Keeping directories (e.g., <code>/blog/how-to-write-scripts</code>) helps index spiders understand structure effortlessly.</li>
            </ul>
          </div>

          {/* Article Pillar 2: How to Use */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">Operations Handbooks</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How to Create Perfect URL Slugs
            </h2>
            <div className="space-y-4">
              <p>Generating URL slugs for your blog, publication, or dynamic portfolio is simple:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Aquire and Paste Your Headline</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Copy your proposed blog category, product name, or essay title directly into the input portal.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Verify Advanced SEO Presets</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Choose to prune stopwords to shorten slugs for indexers, strip unwanted digits, or switch path separators from default hyphens to underscores.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Acquire and Paste Active Output</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">In one single click, copy your formatted slug into your dashboard post parameters securely.</p>
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
              <p className="text-sm text-slate-505 dark:text-slate-400 mt-2">
                Have questions about URL parameters, trailing symbols, and index compatibility? Read our answers below.
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
                    id={`slug-generator-faq-item-${faq.id}`}
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

        {/* Related Companion Tools Bar */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6 font-sans">
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
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
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
