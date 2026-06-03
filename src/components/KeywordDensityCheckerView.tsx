import React, { useState, useEffect, useMemo } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Copy,
  Check,
  Trash2,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Globe,
  BookmarkCheck,
  CheckCircle2,
  Sparkles,
  Settings,
  FileText,
  Info,
  ListFilter,
  Search,
  ArrowUpDown
} from 'lucide-react';

interface KeywordDensityCheckerViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface KeywordEntry {
  keyword: string;
  count: number;
  density: number;
}

type KeywordType = '1-word' | '2-word' | '3-word';
type SortField = 'keyword' | 'count' | 'density';
type SortOrder = 'asc' | 'desc';

export default function KeywordDensityCheckerView({ onNavigateToTool, onNavigateHome }: KeywordDensityCheckerViewProps) {
  const [inputText, setInputText] = useState('');
  const [copiedResults, setCopiedResults] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Configuration options
  const [keywordType, setKeywordType] = useState<KeywordType>('1-word');
  const [excludeStopwords, setExcludeStopwords] = useState(true);
  const [tableSearch, setTableSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // SEO specifications
  const seoTitle = "Keyword Density Checker Online | TextToolkitHub";
  const seoDescription = "Check keyword frequency and keyword density percentage for SEO optimization.";

  const faqs = [
    {
      id: 1,
      question: "What is Keyword Density?",
      answer: "Keyword density is the percentage of times a keyword or phrase appears in a text compared to the total number of words. In search engine optimization (SEO), it is used to measure content relevance and prevent keyword stuffing anomalies."
    },
    {
      id: 2,
      question: "What is the optimal Keyword Density for SEO?",
      answer: "While search engine algorithms do not specify a single magic percentage, SEO experts generally recommend keeping primary keywords between 1% to 2.5% of total text. Going higher might trigger search penalties for keyword stuffing."
    },
    {
      id: 3,
      question: "How do the multi-word options work?",
      answer: "Our checker extracts multi-word phrases (2-word bigrams and 3-word trigrams) sequentially from your text. This allows you to evaluate long-tail key phrases (e.g., 'artificial intelligence tool', 'organic search results') along with individual words."
    },
    {
      id: 4,
      question: "What are 'Stopwords' and why exclude them?",
      answer: "Stopwords are common structural words like 'the', 'and', 'a', 'in', 'is', 'of', 'to'. If you run a keywords density search without excluding them, these conversational filler terms will dominate results. Excluding them helps reveal the true topical subjects of your content."
    }
  ];

  // Configure SEO metadata and FAQ schema dynamic injection
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

    const scriptId = "keyword-density-json-ld";
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

  // Standard SEO English stopwords set
  const STOPWORDS = useMemo(() => new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
    'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant',
    'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during',
    'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having',
    'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how',
    'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets',
    'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only',
    'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'shed',
    'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their',
    'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre',
    'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we',
    'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 'which',
    'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 'youll',
    'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
  ]), []);

  // Analyze text and create keyword stats
  const analysis = useMemo(() => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      return {
        totalWords: 0,
        totalChars: 0,
        keywords: [] as KeywordEntry[]
      };
    }

    const totalChars = inputText.length;

    // Split text into alphanumeric words, ignoring punctuation but matching standard contractions
    const rawWords = trimmed
      .toLowerCase()
      .replace(/([^a-z0-9'\s]|_)+/gi, ' ') // Strip special chars except apostrophe
      .split(/\s+/)
      .filter(w => w.length > 0);

    const totalWords = rawWords.length;

    if (totalWords === 0) {
      return {
        totalWords: 0,
        totalChars,
        keywords: [] as KeywordEntry[]
      };
    }

    const frequencyMap = new Map<string, number>();

    if (keywordType === '1-word') {
      rawWords.forEach((word) => {
        // Exclude terms in stopwords set if enabled
        if (excludeStopwords && STOPWORDS.has(word)) return;
        // Ignore single alphanumeric remnants or numbers optionally (keep length check)
        if (word.length <= 1 && isNaN(Number(word))) return;

        frequencyMap.set(word, (frequencyMap.get(word) || 0) + 1);
      });
    } else if (keywordType === '2-word') {
      for (let i = 0; i < rawWords.length - 1; i++) {
        const w1 = rawWords[i];
        const w2 = rawWords[i + 1];

        // Skip bigram if either word is empty or both are stopwords (if setting selected)
        if (excludeStopwords && (STOPWORDS.has(w1) || STOPWORDS.has(w2))) continue;

        const bigram = `${w1} ${w2}`;
        frequencyMap.set(bigram, (frequencyMap.get(bigram) || 0) + 1);
      }
    } else if (keywordType === '3-word') {
      for (let i = 0; i < rawWords.length - 2; i++) {
        const w1 = rawWords[i];
        const w2 = rawWords[i + 1];
        const w3 = rawWords[i + 2];

        // Skip trigram if either matches stopword rule
        if (excludeStopwords && (STOPWORDS.has(w1) || STOPWORDS.has(w2) || STOPWORDS.has(w3))) continue;

        const trigram = `${w1} ${w2} ${w3}`;
        frequencyMap.set(trigram, (frequencyMap.get(trigram) || 0) + 1);
      }
    }

    // Convert map to formatted KeywordEntry list
    const keywords: KeywordEntry[] = [];
    frequencyMap.forEach((count, keyword) => {
      // Calculate SEO Keyword Density
      // For phrase: count / total words or relative density
      const density = parseFloat(((count / totalWords) * 100).toFixed(2));
      keywords.push({ keyword, count, density });
    });

    return {
      totalWords,
      totalChars,
      keywords
    };
  }, [inputText, keywordType, excludeStopwords, STOPWORDS]);

  // Apply searching and sorting parameters on keywords list
  const processedKeywords = useMemo(() => {
    let result = [...analysis.keywords];

    // Filter by table search string (if applicable)
    if (tableSearch.trim()) {
      const query = tableSearch.toLowerCase().trim();
      result = result.filter(item => item.keyword.includes(query));
    }

    // Sort keywords sequentially
    result.sort((a, b) => {
      let valA: string | number = a[sortField];
      let valB: string | number = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB as string)
          : (valB as string).localeCompare(valA);
      } else {
        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });

    return result;
  }, [analysis.keywords, tableSearch, sortField, sortOrder]);

  // Extract top 20 keywords for fast visual display
  const topKeywordsList = useMemo(() => {
    // Sort analysis.keywords by count descending to get top 20 standard
    return [...analysis.keywords]
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [analysis.keywords]);

  // Handle Sort Toggle
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // default sort descending for numbers
    }
  };

  // Clear workspace
  const handleClear = () => {
    setInputText('');
    setTableSearch('');
  };

  // Copy results in tidy text table layout
  const handleCopyResults = async () => {
    if (topKeywordsList.length === 0) return;
    try {
      let outputText = `TextToolkitHub Keyword Density Analytics Table (${keywordType})\n`;
      outputText += `Total Words: ${analysis.totalWords} | Total Characters: ${analysis.totalChars}\n\n`;
      outputText += `Rank | Keyword Phrase | Frequency Count | Density Percentage\n`;
      outputText += `---------------------------------------------------------\n`;

      topKeywordsList.forEach((item, index) => {
        outputText += `${index + 1}. | ${item.keyword} | x${item.count} | ${item.density}%\n`;
      });

      await navigator.clipboard.writeText(outputText);
      setCopiedResults(true);
      setTimeout(() => setCopiedResults(false), 2000);
    } catch (err) {
      console.warn('Failed to copy results:', err);
    }
  };

  // Pre-load benchmark SEO copy
  const handleLoadSample = () => {
    setInputText(`Search engine optimization, commonly known as SEO, is the active process of improving organic search website visibility. Web managers optimize SEO keyword choices to index higher on search engine portals. If your pages feature optimal keyword density, search engines can easily categorize your blog posts. However, heavy website keyword stuffing will prompt severe search engine penalties. Keep search key phrases organic, relevant, and write high-quality copy to rank on standard search networks.`);
  };

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/keyword-density-checker').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="keyword-density-root">
      {/* Background gradients */}
      <div className="glow-accent top-12 right-20 bg-emerald-400/10"></div>
      <div className="glow-accent bottom-36 left-8 bg-indigo-400/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold font-sans">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            id="kd-breadcrumbs-home"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <button
            onClick={onNavigateHome}
            className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            id="kd-breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-emerald-600 dark:text-emerald-400">Keyword Density Checker</span>
        </div>

        {/* Page Title Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <TrendingUp className="w-7 h-7 text-emerald-500" />
              </span>
              Keyword Density Checker
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Scan custom copywriting, articles, or keywords lists. Measure word density percentages, isolate long-tail search phrases, and refine content metrics to boost SEO ranks.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner cursor-pointer"
            id="kd-seo-btn"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Hide Search Preview' : 'Show Search Preview'}
          </button>
        </div>

        {/* SEO tag preview visualizer */}
        {showSeoMeta && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-emerald-100 dark:border-slate-800 rounded-2xl bg-emerald-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="kd-seo-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <BookmarkCheck className="w-4 h-4" /> Google Search Result Visualizer
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/keyword-density-checker
              </div>
              <h3 className="text-lg md:text-xl font-medium text-emerald-600 dark:text-emerald-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Workspace Dual-Split Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* LEFT SECTION: User Input Form (7 Cols on desktop) */}
          <div className="lg:col-span-7 flex flex-col justify-between border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300 shadow-sm">
            
            <div className="p-5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                Copy Input Area
              </span>
              <button
                onClick={handleLoadSample}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="kd-btn-sample"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Load Sample Copy
              </button>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <textarea
                id="kd-input-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Insert or paste your blog text, page transcript, or article review here. The keyword distribution, counts, and statistical density table will update in real-time..."
                className="w-full h-full min-h-[300px] md:min-h-[440px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-none font-sans leading-relaxed"
              />
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/20 flex items-center justify-between gap-3 pt-4">
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  disabled={!inputText}
                  className="p-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 rounded-2xl transition disabled:opacity-35 cursor-pointer"
                  title="Clear original text"
                  id="kd-btn-clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-4 text-xs font-mono text-slate-400 dark:text-slate-400 select-none">
                <span>Characters: {analysis.totalChars}</span>
                <span>Words: {analysis.totalWords}</span>
              </div>
            </div>

          </div>

          {/* RIGHT SECTION: Control Settings & Keyword Results Grid Table (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            
            {/* Customizer Configurations */}
            <div className="p-6 border border-slate-200 dark:border-slate-800 bg-slate-50/25 dark:bg-slate-950/30 rounded-3xl">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mb-4 font-sans">
                <Settings className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                Scan Parameters
              </span>

              <div className="space-y-4">
                {/* Keyword Type Selection Tabs */}
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-2 font-mono">
                    Keyword Length
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                    {(['1-word', '2-word', '3-word'] as KeywordType[]).map((type) => (
                      <button
                        key={type}
                        onClick={() => setKeywordType(type)}
                        className={`py-1.5 rounded-lg text-xs font-bold transition cursor-pointer select-none ${
                          keywordType === type
                            ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                        }`}
                        id={`kd-tab-${type}`}
                      >
                        {type === '1-word' ? '1 Word' : type === '2-word' ? '2 Words' : '3 Words'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exclude Stopwords Toggle */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  <div>
                    <label htmlFor="exclude-stopwords-toggle" className="text-xs font-bold text-slate-800 dark:text-slate-200 block cursor-pointer select-none">
                      Filter Stopwords
                    </label>
                    <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">Omit common articles & particles (the, an, to, of)</span>
                  </div>
                  <input
                    id="exclude-stopwords-toggle"
                    type="checkbox"
                    checked={excludeStopwords}
                    onChange={(e) => setExcludeStopwords(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 bg-white dark:bg-slate-950 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Keyword Density Table Result Container */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex-grow flex flex-col justify-between">
              
              <div className="p-5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                  Keyword Analytics Table
                </span>

                {/* Keyword search filter */}
                {inputText.trim() && (
                  <div className="relative w-full sm:w-44">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Filter keyword..."
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      className="w-full pl-8 pr-2 py-1 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Dynamic scrollable table area */}
              <div className="p-4 flex-grow max-h-[300px] overflow-y-auto bg-slate-50/30 dark:bg-transparent">
                {inputText.trim() ? (
                  processedKeywords.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse leading-normal font-sans">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 font-bold text-slate-400 select-none">
                            <th 
                              onClick={() => toggleSort('keyword')}
                              className="p-2 pl-1 cursor-pointer hover:text-slate-650 dark:hover:text-slate-200"
                            >
                              <div className="flex items-center gap-1">
                                Phrase / Term <ArrowUpDown className="w-3 h-3 text-slate-350" />
                              </div>
                            </th>
                            <th 
                              onClick={() => toggleSort('count')}
                              className="p-2 cursor-pointer hover:text-slate-650 dark:hover:text-slate-200 text-right w-20"
                            >
                              <div className="flex items-center justify-end gap-1">
                                Freq <ArrowUpDown className="w-3 h-3 text-slate-350" />
                              </div>
                            </th>
                            <th 
                              onClick={() => toggleSort('density')}
                              className="p-2 pr-1 cursor-pointer hover:text-slate-650 dark:hover:text-slate-200 text-right w-24"
                            >
                              <div className="flex items-center justify-end gap-1">
                                Density <ArrowUpDown className="w-3 h-3 text-slate-350" />
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-600 dark:text-slate-300">
                          {processedKeywords.slice(0, 20).map((item, idx) => (
                            <tr key={`${item.keyword}-${idx}`} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                              <td className="p-2 pl-1 font-mono text-slate-800 dark:text-slate-200 break-all select-all">
                                {item.keyword}
                              </td>
                              <td className="p-2 text-right font-medium text-slate-900 dark:text-slate-100">
                                x{item.count}
                              </td>
                              <td className="p-2 pr-1 text-right font-bold text-emerald-600 dark:text-emerald-400">
                                {item.density}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {processedKeywords.length > 20 && (
                        <div className="text-[10px] text-slate-400 text-center mt-3 font-mono">
                          Showing top 20 of {processedKeywords.length} terms in catalog
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center text-slate-400 dark:text-slate-600">
                      <p className="text-xs">No matching keyword terms found.</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Try altering your custom table filter keyword.</p>
                    </div>
                  )
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-600 select-none py-12">
                    <ListFilter className="w-8 h-8 text-slate-300 dark:text-slate-705 mb-2" />
                    <p className="text-xs font-sans">Awaiting keyword analytical action</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 max-w-xs px-2">Type or copy paragraphs on the left to measure standard densities.</p>
                  </div>
                )}
              </div>

              {/* Action output buttons */}
              <div className="p-5 border-t border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/20 flex gap-3">
                <button
                  onClick={handleCopyResults}
                  disabled={topKeywordsList.length === 0}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition flex items-center justify-center gap-1.5 disabled:opacity-35 cursor-pointer shadow-md shadow-emerald-500/10"
                  id="kd-btn-copy-result"
                >
                  {copiedResults ? (
                    <>
                      <Check className="w-4 h-4 animate-pulse" /> Copied Table!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" /> Copy Top Keywords
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

        {/* SCIENTIFIC INFORMATION & STRATEGIC EXPOSITIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">SEO Best Practices</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Understanding Keyword Distributions
            </h2>

            <div className="text-sm leading-relaxed space-y-4 font-sans">
              <p>
                In SEO copywriting, keywords provide vital clues for search crawlers indexing web relevance. However, placing target terms unnaturally is flagged as keyword stuffing. Modern search engines value human readability metrics paired with an organic distribution of primary and secondary key terms.
              </p>
              <p>
                This interactive Keyword Density Checker calculates exactly what percentages of single-words, double-word bigrams, or triple-word trigrams appear in your writings. Toggle stopwords filtration and search output libraries client-side securely.
              </p>
            </div>

            <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Optimal SEO Weight Guide
            </h3>
            <ul className="text-xs space-y-2 text-slate-500 dark:text-slate-400 pl-4 list-disc font-sans leading-relaxed">
              <li><strong>Secondary Modifiers:</strong> Words under 1% density. Useful for adding supporting background details without clogging conversational flow.</li>
              <li><strong>Target Key Terms:</strong> Maintain at 1.2% to 2.2% frequency. Ideal baseline density representing clear content topic focus.</li>
              <li><strong>Potential Over-Optimization:</strong> Words exceeding 3% frequency. Review these to prevent algorithms from marking your pages as artificial or robotic copy.</li>
            </ul>
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400 font-mono font-mono">Advanced Features</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4">
              Phrase Analysis & Stopping Words
            </h2>

            <p className="text-sm text-slate-550 dark:text-slate-300 leading-relaxed mb-6 font-sans">
              Optimizing your copy requires matching terms to natural human search phrases. Real-time controls make editing easier:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-sans">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">1-Word Terms</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Measures individual noun frequencies. Helps confirm your content remains anchored to core subjects.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Phrase Bigrams</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Analyzes couples of consecutive words. Perfect for measuring focus on compound subjects like 'digital media'.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Trigrams (3 words)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Identifies long-tail structures such as 'free writing tools' representing exact query goals.</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Sortable Columns</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Order table lists alphabetically, by total query frequency, or density level with robust headers.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-50/25 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/40 text-xs leading-relaxed font-sans">
              <span className="font-bold text-emerald-800 dark:text-emerald-400 block mb-1">🔒 Local Privacy Secured:</span>
              Your original text strings are analyzed purely in-client in your browser memory context. Absolutely none of your essays or keyword catalogs traverse public networks.
            </div>
          </div>
        </section>

        {/* FAQ ACCORDION DISPLAY */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800 animate-fade-in" id="kd-faq-section">
          <div className="max-w-4xl mx-auto font-sans">
            
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Discover how the analyzer counts terms, computes density, and filters common articles.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-emerald-400 dark:hover:border-slate-800 cursor-pointer select-none transition-all duration-200"
                    id={`kd-faq-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                      <div className="text-slate-350 hover:text-slate-550 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3.5 text-sm text-slate-500 dark:text-slate-404 leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-3.5 flex animate-in fade-in slide-in-from-top-1 duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* RELATED COMPANION PRODUCTS RECOMMENDATION */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800" id="kd-related-section">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Companion Text Utilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`kd-related-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center justify-between font-sans">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-4 block font-mono">
                  Browse Tool &rarr;
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
