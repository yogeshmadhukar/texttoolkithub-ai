import React, { useState, useMemo, useEffect } from 'react';
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
  Sparkle as SparkleIcon,
  HelpCircle,
  Activity,
  CheckCircle,
  Code
} from 'lucide-react';

interface ToolsDirectoryViewProps {
  onNavigateToTool: (toolId: string) => void;
  onPrefetchTool?: (toolId: string) => void;
}

// Map tool icon strings to Lucide icon elements
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
    case 'ArrowLeftRight': return <ArrowLeftRight className={`${className} text-violet-500`} />;
    case 'Repeat': return <Repeat className={`${className} text-pink-500`} />;
    default: return <FileText className={`${className} text-slate-500`} />;
  }
};

const CATEGORIES_COLOR_MAP: Record<ToolCategory, { text: string; bg: string; border: string; glow: string }> = {
  analyzer: {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    glow: 'from-emerald-50/10 to-transparent dark:from-emerald-950/5',
  },
  cleaner: {
    text: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50/60 dark:bg-indigo-950/20',
    border: 'border-indigo-100 dark:border-indigo-900/30',
    glow: 'from-indigo-50/10 to-transparent dark:from-indigo-950/5',
  },
  converter: {
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    border: 'border-amber-100 dark:border-amber-900/30',
    glow: 'from-amber-50/10 to-transparent dark:from-amber-950/5',
  },
  encoding: {
    text: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50/60 dark:bg-violet-950/20',
    border: 'border-violet-100 dark:border-violet-900/30',
    glow: 'from-violet-50/10 to-transparent dark:from-violet-950/5',
  },
  generator: {
    text: 'text-rose-600 dark:text-rose-450',
    bg: 'bg-rose-50/60 dark:bg-rose-950/20',
    border: 'border-rose-100 dark:border-rose-900/30',
    glow: 'from-rose-50/10 to-transparent dark:from-rose-950/5',
  },
};

export default function ToolsDirectoryView({ onNavigateToTool, onPrefetchTool }: ToolsDirectoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');

  // Schema-Org structured markup generation for SEO list elements
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

  // Filter tools cleanly depending on selection states
  const filteredTools = useMemo(() => {
    let result = TOOLS;

    // Filter by query if search box is filled
    if (searchQuery.trim() !== '') {
      result = searchTools(searchQuery);
    }

    // Filter by category if one is isolated
    if (selectedCategory !== 'all') {
      result = result.filter(t => t.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory]);

  // Compute stats of tools per category count
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

  // Scroll header view to top upon mounting
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50/40 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-hidden pb-24">
      {/* Dynamic structured data script injected for SEO index schema */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {/* Decorative premium floating orbs */}
      <div className="absolute top-0 inset-x-0 h-[500px] overflow-hidden pointer-events-none z-0 mt-[-64px]">
        <div className="absolute top-[-100px] left-[5%] w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-400/5" />
        <div className="absolute top-[150px] right-[5%] w-[450px] h-[450px] rounded-full bg-violet-500/5 blur-[140px] dark:bg-violet-400/5" />
        <div className="absolute top-0 inset-0 bg-gradient-to-b from-indigo-50/20 via-transparent to-transparent dark:from-indigo-950/10" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-12 relative z-10">
        
        {/* Upper Hero/Header Section */}
        <div className="text-center md:text-left mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-100/60 dark:bg-indigo-950/40 border border-indigo-200/40 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-[10px] font-extrabold uppercase font-sans tracking-wider rounded-lg mb-4"
          >
            <SlidersHorizontal className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
            Suite Directory
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="text-4xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white sm:text-5xl"
            id="directory-main-title"
          >
            Free Online Text Tools & Utilities
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="text-[15px] text-slate-500 dark:text-slate-400 mt-3 max-w-2xl leading-relaxed"
          >
            A high-fidelity structured workspace designed to help coders, copywriters, and creators edit documents privately. Over 25 text services running fully inside your browser memory cache. Let’s build.
          </motion.p>
        </div>

        {/* Dynamic Tool Finder Toolbar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-14" id="directory-toolbar">
          
          {/* Instant Search Bar */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.32, delay: 0.12 }}
            className="lg:col-span-12 xl:col-span-5 relative"
          >
            <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-500">
              <Search className="w-5 h-5 dark:text-slate-500" />
            </span>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools instantly by title, keyword, or action..."
              className="w-full pl-12 pr-10 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 shadow-sm focus:border-indigo-500 dark:focus:border-indigo-400 transition-all duration-200 focus:ring-1 focus:ring-indigo-500/20"
              id="directory-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-455 dark:text-slate-500 hover:text-indigo-550 dark:hover:text-indigo-400"
              >
                Clear
              </button>
            )}
          </motion.div>

          {/* Category Quick Filter badges */}
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.32, delay: 0.15 }}
            className="lg:col-span-12 xl:col-span-7 flex flex-wrap gap-2 items-center xl:justify-end"
            id="directory-category-filters"
          >
            {/* "All" button */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-705 text-slate-600 dark:text-slate-300 hover:text-slate-905 dark:hover:text-white'
              }`}
            >
              <span>All Modules</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${selectedCategory === 'all' ? 'bg-indigo-550 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {categoryCounts.all}
              </span>
            </button>

            {/* Render Category filters */}
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategory === cat.id;
              const col = CATEGORIES_COLOR_MAP[cat.id];
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? `bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 ${col.border}`
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-705 text-slate-600 dark:text-slate-300 hover:text-slate-905 dark:hover:text-white'
                  }`}
                >
                  <span className={`${isSelected ? 'text-indigo-400 dark:text-indigo-600' : col.text}`}>•</span>
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${isSelected ? 'bg-slate-800 dark:bg-slate-200 text-slate-400 dark:text-slate-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    {categoryCounts[cat.id]}
                  </span>
                </button>
              );
            })}
          </motion.div>

        </div>

        {/* Categories & Cards Grid layout */}
        <div className="space-y-16">
          <AnimatePresence mode="popLayout">
            {CATEGORIES.map(cat => {
              // Get tools matching current category loop
              const matchesThisCategory = filteredTools.filter(t => t.category === cat.id);
              
              // Hide section if category filters are exclusive or if search returns no matches here
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
                  className="space-y-6"
                  id={`category-section-${cat.id}`}
                >
                  
                  {/* Category Header with Title, Description and Pills */}
                  <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200/60 dark:border-slate-850/60 pb-4 gap-4">
                    <div className="space-y-1.5 flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                          {cat.name}
                        </h2>
                        <span className={`text-[10px] px-2 py-0.5 font-sans font-bold uppercase tracking-wider rounded-md ${col.bg} ${col.text} border ${col.border}`}>
                          {matchesThisCategory.length} {matchesThisCategory.length === 1 ? 'Tool' : 'Tools'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-450 max-w-xl">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  {/* Tools Cards Listing */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {matchesThisCategory.map((tool) => {
                      return (
                        <div
                          key={tool.id}
                          onClick={() => onNavigateToTool(tool.id)}
                          onMouseEnter={() => onPrefetchTool?.(tool.id)}
                          className="group relative flex flex-col bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-855 rounded-2xl cursor-pointer hover:border-indigo-500/50 dark:hover:border-indigo-400/50 transition-all duration-250 p-5 shadow-sm hover:shadow-lg hover:shadow-indigo-500/[0.02]"
                          id={`dir-card-${tool.id.replace('tools/', '')}`}
                        >
                          {/* Colored Corner Ambient Glow (Linear style) */}
                          <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${col.glow} rounded-tr-2xl filter blur-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none`} />

                          {/* Top row: Icon and arrow indicators */}
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <div className="p-2.5 rounded-xl border border-slate-105 bg-slate-50 dark:border-slate-800 dark:bg-slate-900 group-hover:bg-slate-100 dark:group-hover:bg-slate-850 transition-colors">
                              {getToolIcon(tool.iconName, "w-5 h-5")}
                            </div>
                            <span className="text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1.5 group-hover:-translate-y-0.5 transition-all duration-200">
                              <ArrowRight className="w-4.5 h-4.5" />
                            </span>
                          </div>

                          {/* Text block */}
                          <div className="flex-1 text-left">
                            <h3 className="font-sans font-bold text-sm tracking-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {tool.title}
                            </h3>
                            <p className="font-sans text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 mt-2 line-clamp-3">
                              {tool.description}
                            </p>
                          </div>

                          {/* Active hover overlay line indicator */}
                          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-indigo-500 to-indigo-650 dark:from-indigo-400 dark:to-indigo-550 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </div>
                      );
                    })}
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Fallback empty view when query doesn't match any tools */}
          {filteredTools.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
              id="directory-empty-state"
            >
              <HelpCircle className="w-12 h-12 text-slate-350 dark:text-slate-650 mx-auto mb-4 animate-bounce" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">No matching text modules found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No tool matched "{searchQuery}". Try searching for alternative spellings, like "casing", "space", or "regex".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-6 px-4 py-2 bg-indigo-50 dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg border border-indigo-100 dark:border-slate-800 hover:bg-indigo-100"
              >
                Reset Search Filters
              </button>
            </motion.div>
          )}

        </div>

        {/* Feature Highlights Grid at bottom: Linear / Notion inspiration */}
        <div className="mt-24 pt-14 border-t border-slate-200 dark:border-slate-850 grid grid-cols-1 md:grid-cols-3 gap-6" id="directory-highlights">
          <div className="p-6 bg-white dark:bg-slate-950/40 border border-black dark:border-white rounded-2xl flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">COMPLIANCE</h4>
              <h5 className="font-sans font-bold text-sm text-slate-900 dark:text-white">100% Client-Side Exec</h5>
              <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Your private texts never leave your browser context. All counter loops execute securely utilizing absolute client memory isolation.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-950/40 border border-slate-105 dark:border-slate-855 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-450 shrink-0">
              <Code className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">DEVELOPER-ORIENTED</h4>
              <h5 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Structured Output Presets</h5>
              <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Supports snake_case variables, kebab-case tokens, dynamic binary encoding mappings, and escapes nested HTML tags instantly.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-950/40 border border-slate-105 dark:border-slate-855 rounded-2xl flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-450 shrink-0">
              <SparkleIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-sans font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">PRO PERFORMANCE</h4>
              <h5 className="font-sans font-bold text-sm text-slate-900 dark:text-white">Milisecond Parsing Loops</h5>
              <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Optimized with heavily memoized state buffers. Handle text packages up to 2,000,000 characters without crashing UI states.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
