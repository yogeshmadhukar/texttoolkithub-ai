import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TOOLS, CATEGORIES, searchTools } from '../data.ts';
import { Tool, ToolCategory } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  SpellCheck, 
  FileText, 
  AlignLeft, 
  TrendingUp, 
  Hash, 
  Eraser, 
  Layers, 
  Scissors, 
  FileCode, 
  Sparkle, 
  Type, 
  GitCompare, 
  Link2, 
  Globe, 
  Unlock, 
  Sparkles, 
  ArrowUpDown, 
  ArrowLeftRight, 
  Repeat, 
  Search, 
  SlidersHorizontal,
  ArrowRight,
  HelpCircle,
  Activity,
  CheckCircle,
  Code,
  Command,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  Grid,
  List,
  Sparkles as SparklesIcon,
  X,
  History,
  ArrowUpRight,
  Pilcrow,
  Smile,
  FileSpreadsheet,
  QrCode,
  FileJson,
  ArrowDownWideNarrow,
  ShieldCheck
} from 'lucide-react';

interface ToolsDirectoryViewProps {
  onNavigateToTool: (toolId: string) => void;
  onPrefetchTool?: (toolId: string) => void;
}

// Map tool icon strings to Lucide icon elements with themed container styling (No black outlines)
const getToolIcon = (name: string, className: string = 'w-5 h-5') => {
  switch (name) {
    case 'BookOpen': return <BookOpen className={`${className} text-emerald-500`} />;
    case 'SpellCheck': return <SpellCheck className={`${className} text-blue-500`} />;
    case 'FileText': return <FileText className={`${className} text-teal-500`} />;
    case 'AlignLeft': return <AlignLeft className={`${className} text-sky-500`} />;
    case 'TrendingUp': return <TrendingUp className={`${className} text-emerald-500`} />;
    case 'Hash': return <Hash className={`${className} text-indigo-500`} />;
    case 'Unwrap': return <AlignLeft className={`${className} text-cyan-500`} />;
    case 'Eraser': return <Eraser className={`${className} text-rose-500`} />;
    case 'Layers': return <Layers className={`${className} text-violet-500`} />;
    case 'Scissors': return <Scissors className={`${className} text-amber-500`} />;
    case 'FileCode': return <FileCode className={`${className} text-purple-500`} />;
    case 'Sparkle': return <Sparkle className={`${className} text-rose-500`} />;
    case 'Type': return <Type className={`${className} text-amber-500`} />;
    case 'GitCompare': return <GitCompare className={`${className} text-orange-500`} />;
    case 'Link2': return <Link2 className={`${className} text-indigo-500`} />;
    case 'Globe': return <Globe className={`${className} text-indigo-500`} />;
    case 'Unlock': return <Unlock className={`${className} text-violet-500`} />;
    case 'Sparkles': return <Sparkles className={`${className} text-amber-500`} />;
    case 'ArrowUpDown': return <ArrowUpDown className={`${className} text-emerald-500`} />;
    case 'ArrowLeftRight': return <ArrowLeftRight className={`${className} text-pink-500`} />;
    case 'Repeat': return <Repeat className={`${className} text-pink-500`} />;
    case 'Pilcrow': return <Pilcrow className={`${className} text-indigo-500`} />;
    case 'Smile': return <Smile className={`${className} text-indigo-505`} />;
    case 'List': return <List className={`${className} text-indigo-500`} />;
    case 'FileSpreadsheet': return <FileSpreadsheet className={`${className} text-emerald-500`} />;
    case 'Code': return <Code className={`${className} text-blue-500`} />;
    case 'Clock': return <Clock className={`${className} text-amber-500`} />;
    case 'QrCode': return <QrCode className={`${className} text-rose-500`} />;
    case 'FileJson': return <FileJson className={`${className} text-violet-500`} />;
    case 'ArrowDownWideNarrow': return <ArrowDownWideNarrow className={`${className} text-indigo-500`} />;
    case 'ShieldCheck': return <ShieldCheck className={`${className} text-emerald-500`} />;
    default: return <FileText className={`${className} text-slate-500`} />;
  }
};

const CATEGORIES_COLOR_MAP: Record<ToolCategory, { text: string; bg: string; border: string; glow: string; accent: string }> = {
  analyzer: {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    border: 'border-emerald-500/20 dark:border-emerald-500/10',
    accent: 'bg-emerald-500',
    glow: 'from-emerald-500/5 to-transparent dark:from-emerald-950/10',
  },
  cleaner: {
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-500/10 dark:bg-indigo-500/15',
    border: 'border-indigo-500/20 dark:border-indigo-500/10',
    accent: 'bg-indigo-600',
    glow: 'from-indigo-500/5 to-transparent dark:from-indigo-950/10',
  },
  converter: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    border: 'border-amber-500/20 dark:border-amber-500/10',
    accent: 'bg-amber-500',
    glow: 'from-amber-500/5 to-transparent dark:from-amber-950/10',
  },
  encoding: {
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-500/10 dark:bg-violet-500/15',
    border: 'border-violet-500/20 dark:border-violet-500/10',
    accent: 'bg-violet-600',
    glow: 'from-violet-500/5 to-transparent dark:from-violet-950/10',
  },
  generator: {
    text: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10 dark:bg-rose-500/15',
    border: 'border-rose-500/20 dark:border-rose-500/10',
    accent: 'bg-rose-500',
    glow: 'from-rose-500/5 to-transparent dark:from-rose-950/10',
  },
};

// Popular searches suggested as quick chips
const POPULAR_SEARCH_SUGGESTIONS = [
  { label: 'Word count', query: 'word count' },
  { label: 'Grammar Checker', query: 'grammar' },
  { label: 'Line wrap removal', query: 'line break' },
  { label: 'Base64 coding', query: 'base64' },
  { label: 'Case format keys', query: 'case' },
  { label: 'Flesch Readability', query: 'readability' }
];

// Regexp escaping helper for highlights
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export default function ToolsDirectoryView({ onNavigateToTool, onPrefetchTool }: ToolsDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grouped' | 'compact'>('grouped');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  
  // Track open/collapsed categories for modular layout spacing
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Load recently used tools from localStorage securely
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentlyUsedTools');
      if (stored) {
        setRecentlyUsed(JSON.parse(stored));
      } else {
        // Fallback default suggestions for first load
        setRecentlyUsed(['tools/word-counter', 'tools/grammar-checker', 'tools/case-converter']);
      }
    } catch {
      setRecentlyUsed(['tools/word-counter', 'tools/grammar-checker', 'tools/case-converter']);
    }
  }, []);

  // Track page view and setup key binders
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus on Cmd+K or Ctrl+K or backslash or slash
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        setIsSearchFocused(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save selection interaction dynamically
  const handleLaunchTool = (toolId: string) => {
    onNavigateToTool(toolId);
    try {
      let current = [toolId, ...recentlyUsed.filter(id => id !== toolId)].slice(0, 4);
      setRecentlyUsed(current);
      localStorage.setItem('recentlyUsedTools', JSON.stringify(current));
    } catch (_) {}
  };

  // Structured markup metadata representation for SEO indexing
  const schemaMarkup = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Free Online Text Tools & Utilities",
      "description": "Discover our comprehensive directory of free online text tools and utilities by TextToolkitHub. Count words, compare diffs, convert casing formats, encode/decode strings, and generate placeholders securely and 100% locally.",
      "url": "https://texttoolkithub.com/tools",
      "numberOfItems": TOOLS.length,
      "itemListElement": TOOLS.map((t, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://texttoolkithub.com/${t.id}`,
        "name": t.title,
        "description": t.description
      }))
    };
  }, []);

  // Soft fuzzy matched search with scores ranking high-priority terms
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchTools(searchQuery);
  }, [searchQuery]);

  // Combined search filtering and fallback cataloging
  const filteredTools = useMemo(() => {
    if (searchQuery.trim()) {
      let results = searchResults;
      if (selectedCategory !== 'all') {
        results = results.filter(t => t.category === selectedCategory);
      }
      return results;
    }
    
    // Normal directory flow (no query)
    let result = TOOLS;
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }
    return result;
  }, [searchQuery, searchResults, selectedCategory]);

  // Suggestions list derived from current search query word matching
  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    // Up to 5 suggestions
    return searchResults.slice(0, 5);
  }, [searchQuery, searchResults]);

  // Compute tool counts per category to match Raycast count filters
  const categoryCounts = useMemo(() => {
    const counts: Record<ToolCategory | 'all', number> = {
      all: TOOLS.length,
      analyzer: 0,
      cleaner: 0,
      converter: 0,
      encoding: 0,
      generator: 0
    };
    TOOLS.forEach(t => {
      if (counts[t.category] !== undefined) {
        counts[t.category]++;
      }
    });
    return counts;
  }, []);

  // Match recently used items to real tool metadata arrays
  const recentlyUsedToolsData = useMemo(() => {
    return recentlyUsed
      .map(id => TOOLS.find(t => t.id === id))
      .filter((t): t is Tool => t !== undefined);
  }, [recentlyUsed]);

  // Handle suggestion arrow keys list navigation
  const handleSuggestionKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSuggestionIndex(prev => (prev + 1 >= suggestions.length ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSuggestionIndex(prev => (prev - 1 < 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestionIndex >= 0 && suggestionIndex < suggestions.length) {
        handleLaunchTool(suggestions[suggestionIndex].id);
      } else if (suggestions.length > 0) {
        handleLaunchTool(suggestions[0].id);
      }
    }
  };

  // Keyboard suggestion item index reset on query change
  useEffect(() => {
    setSuggestionIndex(-1);
  }, [searchQuery]);

  // Toggle category group expand collapse states
  const toggleCategory = (catId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Interactive component helper to mark up matched substrings (Linear standard)
  const highlightSearchMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    try {
      const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
      return (
        <span>
          {parts.map((part, i) => 
            part.toLowerCase() === query.trim().toLowerCase() 
              ? <mark key={i} className="bg-indigo-500/15 text-indigo-600 dark:bg-indigo-400/25 dark:text-indigo-300 font-semibold px-0.5 rounded-[3px]">{part}</mark> 
              : part
          )}
        </span>
      );
    } catch {
      return text;
    }
  };

  // Pre-configured popular featured modules to display at layout center
  const featuredTools = useMemo(() => {
    const featuredIds = ['tools/readability-checker', 'tools/grammar-checker', 'tools/text-compare', 'tools/base64-encoder'];
    return featuredIds
      .map(id => TOOLS.find(t => t.id === id))
      .filter((t): t is Tool => t !== undefined);
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50/45 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 overflow-hidden pb-24 font-sans">
      {/* Search structured markup index */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {/* Modern atmospheric background layout glows */}
      <div className="absolute top-0 inset-x-0 h-[650px] overflow-hidden pointer-events-none z-0 mt-[-64px]">
        <div className="absolute top-[-150px] left-[15%] w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 blur-[130px] dark:from-indigo-600/5 dark:to-violet-600/5" />
        <div className="absolute top-[200px] right-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 blur-[150px] dark:from-emerald-500/5 dark:to-teal-500/5" />
        <div className="absolute bottom-0 inset-x-0 h-[100px] bg-gradient-to-t from-slate-50/45 to-transparent dark:from-slate-950 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 relative z-10">
        
        {/* Upper Hero Panel: Styled in elegant Vercel/Linear display spacing */}
        <div className="text-center md:text-left mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-indigo-100/40 dark:border-slate-800/80 mb-5"
          >
            <SparklesIcon className="w-3 h-3 text-indigo-500 animate-spin-slow" />
            Suite Workspace Directory
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3.5">
              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.05 }}
                className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white"
                id="directory-main-title"
              >
                Free Online Text Tools & Utilities
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="text-base text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed"
              >
                A dynamic, desktop-first workspace optimized for developers, copywriters, and content creators. 
                Experience millisecond calculations powered entirely inside your browser cache. Secure. Safe. Local.
              </motion.p>
            </div>

            {/* View layout mode toggler */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="flex items-center bg-slate-100/80 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800/80 self-center md:self-end"
            >
              <button
                onClick={() => setViewMode('grouped')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'grouped'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Group tools under category sections"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grouped Cards</span>
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  viewMode === 'compact'
                    ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-450 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Sleek Raycast-inspired unified list"
              >
                <List className="w-3.5 h-3.5" />
                <span>Compact List</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Dynamic Interactive Toolbar Search (Linear-inspired sticky block) */}
        <div className="sticky top-4 z-40 bg-slate-50/45 dark:bg-slate-950/70 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg shadow-slate-100/10 dark:shadow-none p-4 mb-10 transition-all duration-300">
          <div className="relative">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            
            <input 
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onKeyDown={handleSuggestionKeyDown}
              placeholder="Search tools, aliases, formatting keys, metadata tags... (Press '/' to search)"
              className="w-full pl-12 pr-28 py-3.5 bg-white/70 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5"
              id="directory-search-input"
            />

            {/* Clear button and desktop shortcut indicators */}
            <div className="absolute right-4.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery ? (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestionIndex(-1);
                    searchInputRef.current?.focus();
                  }}
                  className="p-1 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition"
                  title="Clear query"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-extrabold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/40 dark:border-slate-700/60 font-mono pointer-events-none">
                  <Command className="w-2.5 h-2.5" />
                  <span>K</span>
                </div>
              )}
            </div>
          </div>

          {/* Suggested quick chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mr-1">Trending:</span>
            {POPULAR_SEARCH_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearchQuery(sug.query);
                  setIsSearchFocused(false);
                  onPrefetchTool?.(TOOLS.find(t => t.title.toLowerCase().includes(sug.query) || t.id.includes(sug.query))?.id || '');
                }}
                className="px-2.5 py-1 bg-white hover:bg-indigo-50 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-350 hover:text-indigo-650 dark:hover:text-indigo-400 transition"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Raycast Suggestion floating drop panel */}
          <AnimatePresence>
            {isSearchFocused && suggestions.length > 0 && (
              <motion.div 
                ref={suggestionsRef}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 right-0 top-[102%] mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800"
              >
                <div className="p-3 bg-slate-50/50 dark:bg-slate-950/20 flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <span>Matched Tool Suggestions</span>
                  <span className="font-mono text-[9px] lowercase normal-case flex items-center gap-1 font-normal text-slate-400">
                    Use <span className="p-0.5 rounded bg-slate-100 dark:bg-slate-800 border">↑↓</span> and <span className="p-0.5 rounded bg-slate-100 dark:bg-slate-800 border">Enter</span> to fly
                  </span>
                </div>
                <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
                  {suggestions.map((tool, index) => {
                    const col = CATEGORIES_COLOR_MAP[tool.category];
                    const isActive = index === suggestionIndex;
                    return (
                      <div
                        key={tool.id}
                        onMouseEnter={() => {
                          setSuggestionIndex(index);
                          onPrefetchTool?.(tool.id);
                        }}
                        onClick={() => handleLaunchTool(tool.id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transitionIndex duration-150 ${
                          isActive 
                            ? 'bg-indigo-50/70 dark:bg-slate-800/80 text-indigo-650 dark:text-indigo-300' 
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${col.bg} ${col.text}`}>
                            {getToolIcon(tool.iconName, "w-4.5 h-4.5")}
                          </div>
                          <div>
                            <span className="text-xs font-bold font-sans">
                              {highlightSearchMatch(tool.title, searchQuery)}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 block line-clamp-1">
                              {highlightSearchMatch(tool.description, searchQuery)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${col.bg} ${col.text}`}>
                            {tool.category}
                          </span>
                          <ArrowRight className={`w-3.5 h-3.5 transition-transform duration-200 ${isActive ? 'translate-x-1 text-indigo-600 dark:text-indigo-400' : 'text-slate-350'}`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Search suggestion outside toggle footer */}
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Command className="w-3 h-3 text-slate-400" /> Close suggestions by pressing <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-sm">Esc</kbd>
                  </span>
                  <button 
                    onClick={() => setIsSearchFocused(false)}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                  >
                    Lock overlay
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category horizontal scrolling chips for quick touch navigation (Awesome Mobile UX) */}
        <div className="mb-10 block xl:hidden">
          <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none select-none scroll-smooth">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350'
              }`}
            >
              <span>All Modules</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${selectedCategory === 'all' ? 'bg-indigo-750 text-indigo-100' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {categoryCounts.all}
              </span>
            </button>
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              const col = CATEGORIES_COLOR_MAP[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350'
                  }`}
                >
                  <span className={col.text}>•</span>
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${isSelected ? 'bg-slate-800 dark:bg-slate-200 text-slate-400 dark:text-slate-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    {categoryCounts[cat.id]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Large Bento Feature Layout — Only visible when search query is blank */}
        {!searchQuery.trim() && selectedCategory === 'all' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
            
            {/* Bento Block 1: Featured Premium Highlight */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 to-violet-500/5 dark:from-indigo-400/5 dark:to-transparent rounded-bl-full pointer-events-none filter blur-xl group-hover:scale-105 transition-transform duration-300" />
              
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 dark:bg-slate-800 rounded-md text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <Zap className="w-3 h-3 text-indigo-500 animate-pulse" />
                  Editor's Pick
                </span>
                
                <h3 className="text-lg font-bold sm:text-xl tracking-tight text-slate-900 dark:text-white mt-3.5">
                  Grammar & Style Guard
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                  Avoid formatting slip-ups, auxiliary verb inaccuracies, and capital initials mistakes. 
                  Get localized, side-by-side reviews and correct spelling rules with pixel-perfection.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleLaunchTool('tools/grammar-checker')}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  <span>Launch Checker Core</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleLaunchTool('tools/readability-checker')}
                  className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-350 rounded-xl text-xs font-bold transition flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <span>Readability index</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Bento Block 2: Quick Launch / Visited History Column */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm flex flex-col justify-between relative overflow-hidden">
              <div className="top-row">
                <div className="flex items-center justify-between text-left">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-405 dark:text-slate-400">
                    <History className="w-3.5 h-3.5 text-slate-400" />
                    Quick Launch Panel
                  </span>
                  <span className="text-[10px] text-slate-400">Most visited</span>
                </div>
                
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-4">
                  Recently Visited
                </h4>
                
                <div className="mt-4 space-y-2">
                  {recentlyUsedToolsData.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-left">Your launched workspace items will display here for instant navigation.</p>
                  ) : (
                    recentlyUsedToolsData.map(tool => {
                      const col = CATEGORIES_COLOR_MAP[tool.category];
                      return (
                        <div 
                          key={tool.id}
                          onClick={() => handleLaunchTool(tool.id)}
                          className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-900 hover:bg-indigo-50/40 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer border border-transparent hover:border-indigo-500/10 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${col.bg} ${col.text}`}>
                              {getToolIcon(tool.iconName, "w-4 h-4")}
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{tool.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            Open <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Counter status label */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Secure Local SSL</span>
                <span>{TOOLS.length} modules loaded</span>
              </div>
            </div>

          </div>
        )}

        {/* Categories Navigation Badges Sidebar for Desktop (In Notion/Stripe layout rhythm) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Rail Sidebar for Filters (Only on large screens) */}
          <div className="hidden xl:block xl:col-span-3 space-y-6 sticky top-48">
            <div className="bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 shadow-sm text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-4">
                Directory Modules
              </span>
              
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-indigo-50/70 dark:bg-slate-800 text-indigo-650 dark:text-indigo-350'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/40 dark:hover:bg-slate-850/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>All System Tools</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {categoryCounts.all}
                  </span>
                </button>

                {CATEGORIES.map(cat => {
                  const isSelected = selectedCategory === cat.id;
                  const col = CATEGORIES_COLOR_MAP[cat.id];
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-slate-150 dark:text-slate-950'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/40 dark:hover:bg-slate-850/60 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${col.accent}`} />
                        <span>{cat.name}</span>
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? 'bg-slate-800 dark:bg-slate-200 text-slate-400 dark:text-slate-650' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                        {categoryCounts[cat.id]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick stats mini credit card line (Linear inspiration) */}
            <div className="p-4 bg-gradient-to-tr from-slate-50 to-slate-100/30 dark:from-slate-900/20 dark:to-transparent rounded-2xl border border-slate-200/50 dark:border-slate-850 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3 h-3 text-slate-400" /> Key Shortcuts
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-450 mt-2 leading-normal">
                Press <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-mono mx-0.5 shadow-inner">⌘ K</kbd> or <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-mono mx-0.5 shadow-inner">/</kbd> in the workspace to pop the finder index.
              </p>
            </div>
          </div>

          {/* Right Core Directory Workspace listing Column */}
          <div className="xl:col-span-9 space-y-12">
            <AnimatePresence mode="popLayout">
              {viewMode === 'grouped' ? (
                // Grouped Card view
                CATEGORIES.map(cat => {
                  const matchesThisCategory = filteredTools.filter(t => t.category === cat.id);
                  const isCollapsed = !!collapsedCategories[cat.id];
                  
                  // Hide section if exclusive category filter or search misses
                  if ((selectedCategory !== 'all' && selectedCategory !== cat.id) || matchesThisCategory.length === 0) {
                    return null;
                  }

                  const col = CATEGORIES_COLOR_MAP[cat.id];

                  return (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="space-y-4 bg-white dark:bg-slate-900/25 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850/40"
                      id={`category-section-${cat.id}`}
                    >
                      {/* Section header containing title descriptive elements and expand triggers */}
                      <div 
                        onClick={() => toggleCategory(cat.id)}
                        className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 gap-4 cursor-pointer select-none group"
                      >
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2.5">
                            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                              {cat.name}
                            </h2>
                            <span className={`text-[9px] px-2 py-0.5 font-sans font-bold uppercase tracking-wider rounded-md ${col.bg} ${col.text} border ${col.border}`}>
                              {matchesThisCategory.length} {matchesThisCategory.length === 1 ? 'Task' : 'Tasks'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-slate-450">
                            {cat.description}
                          </p>
                        </div>
                        <button 
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-350 transition-colors"
                          title={isCollapsed ? "Expand Category" : "Collapse Category"}
                        >
                          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Display tools grid inside category */}
                      {!isCollapsed && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                          {matchesThisCategory.map((tool) => (
                            <div
                              key={tool.id}
                              onClick={() => handleLaunchTool(tool.id)}
                              onMouseEnter={() => onPrefetchTool?.(tool.id)}
                              className="group relative flex flex-col justify-between bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850 rounded-2xl cursor-pointer hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-300 p-5 shadow-sm hover:shadow-md"
                              id={`dir-card-${tool.id.replace('tools/', '')}`}
                            >
                              {/* Glowing cell corner ambient highlights */}
                              <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${col.glow} rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none filter blur-lg`} />

                              <div className="text-left">
                                {/* Glassmorphism themed logo frames instead of harsh dark bounds */}
                                <div className="flex items-center justify-between gap-3 mb-4">
                                  <div className={`p-2 rounded-xl bg-slate-50 border border-slate-200/50 dark:border-slate-800 dark:bg-slate-900/60 group-hover:bg-white dark:group-hover:bg-slate-800 transition shadow-inner`}>
                                    {getToolIcon(tool.iconName, "w-4.5 h-4.5")}
                                  </div>
                                  <span className="text-slate-350 dark:text-slate-600 group-hover:text-indigo-550 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all duration-200">
                                    <ArrowRight className="w-4 h-4" />
                                  </span>
                                </div>

                                <h3 className="font-sans font-bold text-xs tracking-tight text-slate-850 dark:text-white group-hover:text-indigo-650 dark:group-hover:text-indigo-400 transition-colors">
                                  {highlightSearchMatch(tool.title, searchQuery)}
                                </h3>
                                <p className="font-sans text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                                  {highlightSearchMatch(tool.description, searchQuery)}
                                </p>
                              </div>

                              <div className="mt-4 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                                <span className={`h-1.5 w-1.5 rounded-full ${col.accent}`} />
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold text-indigo-600 dark:text-indigo-400">Launch now &rarr;</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  );
                })
              ) : (
                // Raycast flat slate Compact list view
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-inner"
                >
                  <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between text-[11px] text-slate-450 uppercase tracking-wider font-extrabold text-left">
                    <span>Tool Module list</span>
                    <span>{filteredTools.length} found</span>
                  </div>
                  
                  <div className="divide-y divide-slate-100 dark:divide-slate-850/80">
                    {filteredTools.map((tool) => {
                      const col = CATEGORIES_COLOR_MAP[tool.category];
                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleLaunchTool(tool.id)}
                          onMouseEnter={() => onPrefetchTool?.(tool.id)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 hover:bg-slate-50/75 dark:hover:bg-slate-850/50 cursor-pointer transition duration-150 text-left gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg shrink-0 ${col.bg} ${col.text}`}>
                              {getToolIcon(tool.iconName, "w-4 h-4")}
                            </div>
                            <div>
                              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {highlightSearchMatch(tool.title, searchQuery)}
                              </h3>
                              <p className="text-[10px] text-slate-400 dark:text-slate-450 line-clamp-1 mt-0.5">
                                {highlightSearchMatch(tool.description, searchQuery)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end gap-2.5 shrink-0 self-end sm:self-auto">
                            <span className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${col.bg} ${col.text} border ${col.border}`}>
                              {tool.category}
                            </span>
                            <div className="p-1 px-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-550 rounded-lg text-[10px] font-bold text-slate-605 dark:text-slate-250 transition-colors">
                              Open 
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error empty state placeholder (Raycast empty flow) */}
            {filteredTools.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900/10"
                id="directory-empty-state"
              >
                <HelpCircle className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-4" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">No matching text modules found</h3>
                <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  No tool matches "{searchQuery}" under the current configuration filter. Try looking for other common names like "casing", "breaks", "characters", or "diff".
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-6 px-4 py-2 bg-indigo-50 hover:bg-indigo-105 dark:bg-slate-800 dark:text-indigo-300 text-indigo-650 text-xs font-bold rounded-lg border border-indigo-100 dark:border-slate-800 cursor-pointer"
                >
                  Reset Workspace filters
                </button>
              </motion.div>
            )}

          </div>
        </div>

        {/* Feature Highlights Grid at bottom: Linear / Notion inspiration elements */}
        <div className="mt-28 pt-14 border-t border-slate-200/80 dark:border-slate-850/60 grid grid-cols-1 md:grid-cols-3 gap-6" id="directory-highlights">
          <div className="p-6 bg-white dark:bg-slate-900/35 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-slate-400 mb-1">COMPLIANCE</h4>
              <h5 className="font-sans font-bold text-sm text-slate-900 dark:text-white">100% Client-Side Exec</h5>
              <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Your private texts never leave your browser context. All loops executes securely utilizing browser memory heap isolation. No training data scraper bots will inspect your drafts.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/35 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-450 shrink-0">
              <Code className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-slate-400 mb-1">DEVELOPER-ORIENTED</h4>
              <h5 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Structured Output Presets</h5>
              <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Seamlessly format casing elements, generate camelCase variables, remove double white spacing, escape unescaped XML files, and process URLs in websafe percent notations instantly.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900/35 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-sans font-extrabold text-[10px] uppercase tracking-widest text-slate-400 mb-1">PRO PERFORMANCE</h4>
              <h5 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Sub-millisecond Loops</h5>
              <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Optimized with heavily memoized state arrays. Supports deep text documents up to 2,000,000 character iterations inside standard frame rates without trailing lags.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
