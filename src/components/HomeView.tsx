import React, { useState, useMemo, useEffect } from 'react';
import { TOOLS, CATEGORIES, FAQS, searchTools } from '../data.ts';
import { Tool, ToolCategory } from '../types.ts';
import { motion } from 'motion/react';
import { analytics } from '../lib/analytics.ts';
import AdPlacement from './AdPlacement.tsx';
import HostingerNewsletter from './HostingerNewsletter.tsx';
import { 
  FileText, 
  Hash, 
  AlignLeft, 
  Eraser, 
  Type, 
  Search, 
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  TrendingUp,
  Award,
  Zap,
  Tag,
  Link2,
  Globe,
  Unlock,
  GitCompare,
  Activity,
  Layers,
  CheckCircle2,
  ArrowUpRight,
  BookOpen,
  ArrowUpDown,
  ArrowLeftRight,
  Repeat,
  SpellCheck,
  Scissors,
  FileCode,
  Sparkle,
  Pilcrow,
  Smile,
  List,
  FileSpreadsheet,
  Code,
  Clock,
  QrCode,
  FileJson,
  ArrowDownWideNarrow
} from 'lucide-react';

interface HomeViewProps {
  onNavigateToTool: (toolId: string) => void;
  onPrefetchTool?: (toolId: string) => void;
}

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight || !highlight.trim()) {
    return <span>{text}</span>;
  }
  const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-amber-100 text-amber-950 dark:bg-amber-950/60 dark:text-amber-300 px-0.5 rounded-sm font-semibold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </span>
  );
}

export default function HomeView({ onNavigateToTool, onPrefetchTool }: HomeViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const homeSearchContainerRef = React.useRef<HTMLDivElement>(null);

  // Detect and respect accessibility reduced motion parameters
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setShouldAnimate(!mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setShouldAnimate(!e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Reset active search index when query changes
  React.useEffect(() => {
    setActiveSearchIndex(-1);
  }, [searchQuery]);

  // Close autocomplete dropdown on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (homeSearchContainerRef.current && !homeSearchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const autocompleteTools = useMemo(() => {
    if (searchQuery.trim() === '') return [];
    return searchTools(searchQuery);
  }, [searchQuery]);

  // Analytics: Track home search query with 1.5s debounce to optimize event count
  React.useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') return;

    const delayDebounceId = setTimeout(() => {
      const resultsCount = autocompleteTools.length;
      analytics.trackSearchPerformed(searchQuery.trim(), resultsCount);
    }, 1500);

    return () => clearTimeout(delayDebounceId);
  }, [searchQuery, autocompleteTools.length]);

  const handleHomeSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (searchQuery.trim() === '') return;

    const visibleItemsCount = autocompleteTools.length > 5 ? 5 : autocompleteTools.length;
    const totalSelectableCount = autocompleteTools.length > 5 ? visibleItemsCount + 1 : visibleItemsCount;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsSearchFocused(true);
      setActiveSearchIndex((prev) => (prev < totalSelectableCount - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIsSearchFocused(true);
      setActiveSearchIndex((prev) => (prev > 0 ? prev - 1 : totalSelectableCount - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSearchIndex >= 0 && activeSearchIndex < visibleItemsCount) {
        onNavigateToTool(autocompleteTools[activeSearchIndex].id);
        setIsSearchFocused(false);
      } else if (activeSearchIndex === visibleItemsCount && autocompleteTools.length > 5) {
        scrollToToolbox();
        setIsSearchFocused(false);
      } else if (autocompleteTools.length > 0) {
        onNavigateToTool(autocompleteTools[0].id);
        setIsSearchFocused(false);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setActiveSearchIndex(-1);
      (e.target as HTMLInputElement).blur();
    }
  };

  // Premium, ultra-smooth motion curves inspired by Vercel & Linear design systems
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 24 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number] // Custom refined spring-like easing
      }
    }
  };

  const searchBoxVariants = {
    hidden: { opacity: 0, scale: shouldAnimate ? 0.98 : 1, y: shouldAnimate ? 16 : 0 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  const categoryGridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const categoryCardVariants = {
    hidden: { opacity: 0, y: shouldAnimate ? 20 : 0 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
      }
    }
  };

  // Quick search suggestion chips
  const quickSearchTags = [
    { label: 'Word Counter', toolId: 'tools/word-counter' },
    { label: 'Fancy Text', toolId: 'tools/fancy-text-generator' },
    { label: 'Text Compare', toolId: 'tools/text-compare' },
    { label: 'Slug Generator', toolId: 'tools/slug-generator' },
    { label: 'URL Decoder', toolId: 'tools/url-decoder' }
  ];

  // Map icon strings to React components safely
  const getToolIcon = (name: string, sizeClass = "w-5 h-5") => {
    switch (name) {
      case 'FileText': return <FileText className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'SpellCheck': return <SpellCheck className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'BookOpen': return <BookOpen className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'TrendingUp': return <TrendingUp className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'Hash': return <Hash className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'Unwrap': return <AlignLeft className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'AlignLeft': return <AlignLeft className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'Eraser': return <Eraser className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'Layers': return <Layers className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'Type': return <Type className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      case 'GitCompare': return <GitCompare className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'Link2': return <Link2 className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      case 'Globe': return <Globe className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      case 'Unlock': return <Unlock className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      case 'Sparkles': return <Sparkles className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'ArrowUpDown': return <ArrowUpDown className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'ArrowLeftRight': return <ArrowLeftRight className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      case 'Repeat': return <Repeat className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      case 'Scissors': return <Scissors className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'FileCode': return <FileCode className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'Sparkle': return <Sparkle className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'Pilcrow': return <Pilcrow className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'Smile': return <Smile className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'List': return <List className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'FileSpreadsheet': return <FileSpreadsheet className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      case 'Code': return <Code className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'Clock': return <Clock className={`${sizeClass} text-amber-500 dark:text-amber-400`} />;
      case 'QrCode': return <QrCode className={`${sizeClass} text-rose-500 dark:text-rose-400`} />;
      case 'FileJson': return <FileJson className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'ArrowDownWideNarrow': return <ArrowDownWideNarrow className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
      case 'ShieldCheck': return <ShieldCheck className={`${sizeClass} text-emerald-500 dark:text-emerald-400`} />;
      default: return <FileText className={`${sizeClass} text-indigo-500 dark:text-indigo-400`} />;
    }
  };

  const getCategoryDetails = (cat: ToolCategory) => {
    switch (cat) {
      case 'analyzer': 
        return {
          icon: <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
          bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-350',
          hoverColor: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-850',
          pill: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-350',
          borderAccent: 'border-t-[3px] border-t-emerald-500/80 dark:border-t-emerald-400/80',
          glowColor: 'hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.08)] dark:hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.15)]',
          hoverBorder: 'hover:border-emerald-500/60 dark:hover:border-emerald-400/50'
        };
      case 'cleaner': 
        return {
          icon: <Eraser className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
          bgColor: 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-350',
          hoverColor: 'group-hover:border-indigo-300 dark:group-hover:border-indigo-850',
          pill: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-355',
          borderAccent: 'border-t-[3px] border-t-indigo-500/80 dark:border-t-indigo-400/80',
          glowColor: 'hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.15)]',
          hoverBorder: 'hover:border-indigo-500/60 dark:hover:border-indigo-400/50'
        };
      case 'converter': 
        return {
          icon: <Type className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
          bgColor: 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40 text-amber-700 dark:text-amber-350',
          hoverColor: 'group-hover:border-amber-300 dark:group-hover:border-amber-850',
          pill: 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-350',
          borderAccent: 'border-t-[3px] border-t-amber-500/80 dark:border-t-amber-400/80',
          glowColor: 'hover:shadow-[0_15px_30px_-5px_rgba(245,158,11,0.08)] dark:hover:shadow-[0_15px_30px_-5px_rgba(245,158,11,0.15)]',
          hoverBorder: 'hover:border-amber-500/60 dark:hover:border-amber-400/50'
        };
      case 'encoding': 
        return {
          icon: <Globe className="w-5 h-5 text-violet-600 dark:text-violet-400" />,
          bgColor: 'bg-violet-50/50 dark:bg-violet-950/20 border-violet-100 dark:border-violet-900/40 text-violet-700 dark:text-violet-350',
          hoverColor: 'group-hover:border-violet-300 dark:group-hover:border-violet-850',
          pill: 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-350',
          borderAccent: 'border-t-[3px] border-t-violet-500/80 dark:border-t-violet-400/80',
          glowColor: 'hover:shadow-[0_15px_30px_-5px_rgba(139,92,246,0.08)] dark:hover:shadow-[0_15px_30px_-5px_rgba(139,92,246,0.15)]',
          hoverBorder: 'hover:border-violet-500/60 dark:hover:border-violet-400/50'
        };
      case 'generator': 
        return {
          icon: <Sparkle className="w-5 h-5 text-rose-600 dark:text-rose-450" />,
          bgColor: 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40 text-rose-700 dark:text-rose-350',
          hoverColor: 'group-hover:border-rose-300 dark:group-hover:border-rose-850',
          pill: 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-350',
          borderAccent: 'border-t-[3px] border-t-rose-500/80 dark:border-t-rose-400/80',
          glowColor: 'hover:shadow-[0_15px_30px_-5px_rgba(244,63,94,0.08)] dark:hover:shadow-[0_15px_30px_-5px_rgba(244,63,94,0.15)]',
          hoverBorder: 'hover:border-rose-500/60 dark:hover:border-rose-400/50'
        };
    }
  };

  // 1. Featured Tools list
  const featuredTools = useMemo(() => {
    return TOOLS.filter(t => 
      t.id === 'tools/word-counter' || 
      t.id === 'tools/text-compare' || 
      t.id === 'tools/fancy-text-generator'
    );
  }, []);

  // 2. Popular Tools list
  const popularTools = useMemo(() => {
    return TOOLS.filter(t => 
      t.id === 'tools/case-converter' || 
      t.id === 'tools/slug-generator' || 
      t.id === 'tools/character-counter'
    );
  }, []);

  // 3. Complete filter search algorithm
  const filteredTools = useMemo(() => {
    if (searchQuery.trim() === '') {
      return TOOLS.filter(t => selectedCategory === 'all' || t.category === selectedCategory);
    }
    const searched = searchTools(searchQuery);
    if (selectedCategory === 'all') {
      return searched;
    }
    return searched.filter(t => t.category === selectedCategory);
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const scrollToToolbox = () => {
    const el = document.getElementById('toolbox-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden">
      
      {/* Premium Ambient Floating Gradient Orbs Background */}
      <div className="absolute top-0 inset-x-0 h-[650px] overflow-hidden pointer-events-none z-0 mt-[-64px]">
        <div className="absolute top-0 inset-0 bg-gradient-to-b from-indigo-50/25 via-transparent to-transparent dark:from-indigo-950/10" />
        {shouldAnimate ? (
          <>
            <motion.div 
              animate={{
                x: [0, 40, -20, 0],
                y: [0, -40, 20, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: "easeInOut"
              }}
              className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] rounded-full bg-indigo-550/10 dark:bg-indigo-500/5 blur-[120px]"
            />
            <motion.div 
              animate={{
                x: [0, -30, 20, 0],
                y: [0, 50, -30, 0],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-[15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[130px]"
            />
            <motion.div 
              animate={{
                x: [0, 20, -10, 0],
                y: [0, 30, -20, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: 'reverse',
                ease: "easeInOut",
                delay: 5
              }}
              className="absolute top-[40%] left-[20%] w-[35%] h-[35%] rounded-full bg-indigo-400/5 dark:bg-indigo-400/2 blur-[100px]"
            />
          </>
        ) : (
          <>
            <div className="absolute top-[-10%] left-[-15%] w-[60%] h-[50%] rounded-full bg-indigo-550/10 dark:bg-indigo-500/5 blur-[120px]" />
            <div className="absolute top-[15%] right-[-15%] w-[50%] h-[50%] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[130px]" />
          </>
        )}
      </div>

      {/* 1. HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 text-center z-20">
        <motion.div 
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center"
        >
          
          {/* Tagline Badge */}
          <motion.div 
            variants={heroItemVariants}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 dark:bg-indigo-400/10 border border-indigo-200/40 dark:border-indigo-900/30 rounded-full text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-8 cursor-default shadow-sm hover:border-indigo-300 dark:hover:border-indigo-850 transition-colors"
            id="hero-tag-badge"
          >
            <span role="img" aria-label="rocket" className="text-sm">🚀</span>
            <span className="tracking-wide">Fast • Private • Browser-Based</span>
          </motion.div>

          {/* Product Headline */}
          <motion.h1 
            variants={heroItemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-light font-display tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6"
            id="master-hero-heading"
          >
            Text Tools Built for <br />
            <span className="relative inline-block font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 dark:from-indigo-400 dark:via-blue-400 dark:to-sky-300 drop-shadow-[0_2px_20px_rgba(99,102,241,0.15)] dark:drop-shadow-[0_4px_30px_rgba(129,140,248,0.22)]">
              Speed and Simplicity
            </span>
          </motion.h1>

          {/* Subtitle description */}
          <motion.p 
            variants={heroItemVariants}
            className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed mb-10 font-sans font-medium"
            id="master-hero-desc"
          >
            Convert, clean, compare, count, and transform text instantly with powerful browser-based utilities designed for productivity.
          </motion.p>

          {/* 2. TOOL SEARCH */}
          <motion.div 
            variants={searchBoxVariants}
            className="w-full max-w-2xl px-2 relative"
            ref={homeSearchContainerRef}
          >
            {/* Search Frame */}
            <div className="relative border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-950 p-2 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_45px_-15px_rgba(0,0,0,0.7)] focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:border-indigo-500 focus-within:shadow-[0_8px_30px_-5px_rgba(99,102,241,0.14)] transition-all duration-300">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  if (e.target.value.trim() !== '') {
                    setSelectedCategory('all');
                  }
                }}
                onKeyDown={handleHomeSearchKeyDown}
                placeholder="Search tools (e.g. word counter, text-sorter, case converter, reverser)..."
                className="w-full pl-12 pr-20 py-3 text-sm sm:text-base border-0 outline-none bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 font-sans"
                id="main-search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all font-bold"
                  id="search-clear-btn"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Real-time SaaS Autocomplete Dropdown below the input */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div 
                className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden max-h-[300px] flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                id="home-search-dropdown"
              >
                {/* Header */}
                <div className="px-5 py-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20 shrink-0 select-none">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    <span>Suggestions for "{searchQuery}"</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-500 dark:text-slate-400">
                    {autocompleteTools.length} found
                  </span>
                </div>

                {/* Scrollable list of matches */}
                <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-1 min-h-0 [scrollbar-width:thin]">
                  {autocompleteTools.length > 0 ? (
                    autocompleteTools.slice(0, 5).map((tool, idx) => {
                      const isActive = idx === activeSearchIndex;
                      return (
                        <div
                          key={tool.id}
                          onClick={() => {
                            onNavigateToTool(tool.id);
                            setIsSearchFocused(false);
                          }}
                          onMouseEnter={() => onPrefetchTool?.(tool.id)}
                          className={`flex items-start gap-3.5 p-2.5 rounded-xl cursor-pointer group transition-all duration-150 text-left border ${
                            isActive
                              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-950 dark:text-white dark:bg-indigo-500/15'
                              : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/60'
                          }`}
                        >
                          <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors shrink-0 ${
                            isActive ? 'bg-white/80 dark:bg-slate-950/80 text-indigo-600 dark:text-indigo-400' : ''
                          }`}>
                            {getToolIcon(tool.iconName, "w-4 h-4")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className={`text-xs font-bold font-sans transition-colors ${
                              isActive 
                                ? 'text-indigo-600 dark:text-indigo-400' 
                                : 'text-slate-855 dark:text-slate-150 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                            }`}>
                              <HighlightText text={tool.title} highlight={searchQuery} />
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-450 mt-0.5 line-clamp-1 leading-normal font-sans">
                              <HighlightText text={tool.description} highlight={searchQuery} />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
                      No tools match your query
                    </div>
                  )}
                </div>

                {/* Footer "View All Results" if more than 5 exist */}
                {autocompleteTools.length > 5 && (
                  <div 
                    onClick={() => {
                      scrollToToolbox();
                      setIsSearchFocused(false);
                    }}
                    className={`px-4 py-2 text-xs font-semibold text-center border-t border-slate-100 dark:border-slate-800/60 cursor-pointer transition-all shrink-0 hover:bg-slate-50/80 dark:hover:bg-slate-900/50 ${
                      activeSearchIndex === 5
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-450 font-bold'
                        : 'text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300'
                    }`}
                  >
                    View All {autocompleteTools.length} Results &rarr;
                  </div>
                )}
              </div>
            )}

            {/* Quick Helper Autocomplete Search Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 text-xs">
              <span className="text-slate-400 dark:text-slate-500 font-medium">Try searching for:</span>
              {quickSearchTags.map((tag) => (
                <button
                  key={tag.label}
                  onClick={() => {
                    onNavigateToTool(tag.toolId);
                  }}
                  onMouseEnter={() => onPrefetchTool?.(tag.toolId)}
                  className="px-3 py-1 bg-white border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl text-slate-605 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-850 hover:text-indigo-650 dark:hover:text-indigo-400 font-semibold transition text-[11px] cursor-pointer shadow-sm"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* 3. POPULAR TOOLS */}
      <section className="py-12 bg-white dark:bg-slate-900 border-y border-slate-150 dark:border-slate-850 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Trending & Popular Tools</h2>
            </div>
            <span className="text-[10px] uppercase font-mono font-bold text-indigo-500 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-lg animate-pulse">Updated Live</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="popular-tools-row">
            {popularTools.map((tool) => (
              <div 
                key={tool.id}
                onClick={() => onNavigateToTool(tool.id)}
                onMouseEnter={() => onPrefetchTool?.(tool.id)}
                className="group border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 rounded-2xl cursor-pointer hover:border-emerald-500/50 dark:hover:border-emerald-400/50 hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.06)] dark:hover:shadow-[0_15px_30px_-5px_rgba(16,185,129,0.14)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border-t-[3px] border-t-emerald-500/85 dark:border-t-emerald-400/85"
                id={`popular-${tool.id}`}
              >
                <div>
                  <h3 className="font-sans font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-sm transition-colors flex items-center justify-between">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-all duration-200" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-1.5 mt-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" /> Popular Choice
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Inline Section Leaderboard Ad Placement to reduce CLS and fulfill programmatic criteria */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AdPlacement slot="leaderboard" id="homepage-mid-lead" />
      </div>

      {/* 3.5 CENTRAL KEYWORD-RICH SEO INTRODUCTION SECTION */}
      <section className="py-16 bg-slate-50/10 dark:bg-slate-950/20 border-b border-slate-200 dark:border-slate-850 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 p-8 sm:p-12 rounded-3xl shadow-sm">
            
            <div className="lg:col-span-12 space-y-4">
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-950">
                Authorized Growth Framework
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
                All-in-One Suite of Free Online Text Tools & String Utilities
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-405 leading-relaxed max-w-5xl">
                Welcome to <strong>TextToolkitHub</strong>, your premiere destination for fast, local-first, privacy-respecting browser utilities. Standard text preparation and coding workflows require absolute reliability, which is why our entire tool catalog executes 100% inside your sandboxed web browser memory. No text or coding logs ever touch the cloud, making our platform safe for confidential corporate data and creative drafts.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6 text-xs text-slate-600 dark:text-slate-400">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> High-Performance Analyzers
                  </h3>
                  <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
                    Extract deep insights using our premium <strong>word counter</strong>, precise <strong>character counter</strong>, comprehensive <strong>readability checker</strong>, and SEO-focused <strong>keyword density checker</strong> inside a single tab.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" /> Sanitizers & Formatters
                  </h3>
                  <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
                    Purge layout noises immediately. <strong>Remove extra spaces</strong>, clean duplicate spaces, <strong>remove duplicate lines</strong>, organize tables, and <strong>remove line breaks</strong> securely.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 font-sans">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Dynamic Code Encoders
                  </h3>
                  <p className="leading-relaxed text-[11px] text-slate-500 dark:text-slate-400">
                    Bypass raw communication issues with clean format shifts. Shift text schemas using our compliant <strong>slug generator</strong>, <strong>url encoder</strong>, <strong>url decoder</strong>, <strong>base64 encoder</strong>, <strong>base64 decoder</strong>, and robust casing adjusters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MAIN CATEGORIES & DYNAMIC TOOLBOX */}
      <section className="py-16 bg-slate-50/30 dark:bg-slate-950/20 border-b border-slate-205 dark:border-slate-855 z-10 relative" id="toolbox-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center md:text-left mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
              Interactive Filter Catalog
            </h2>
            <p className="text-sm text-slate-550 mt-1.5 max-w-xl dark:text-slate-400">
              Browse professional-grade text services grouped by execution categories. Click a specialized card category to quickly filter the complete catalog list below.
            </p>
          </div>

          {/* Categories Grid */}
          <motion.div 
            variants={categoryGridVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12" 
            id="categories-cards-grid"
          >
            {CATEGORIES.map((cat) => {
              const details = getCategoryDetails(cat.id);
              const isSelected = selectedCategory === cat.id;

              return (
                <motion.div
                  key={cat.id}
                  variants={categoryCardVariants}
                  whileHover={shouldAnimate ? {
                    y: -6,
                    scale: 1.015,
                    boxShadow: "0 12px 30px -10px rgba(99, 102, 241, 0.12)",
                    borderColor: "rgba(99, 102, 241, 0.4)"
                  } : {}}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    const el = document.getElementById('catalog-grid-header');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`group p-6 bg-white dark:bg-slate-950 border rounded-3xl cursor-pointer transition-colors duration-300 flex flex-col justify-between ${isSelected ? 'ring-2 ring-indigo-550 border-indigo-550 dark:border-indigo-400 shadow-md' : 'border-slate-200 dark:border-slate-850'}`}
                  id={`cat-card-${cat.id}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                      <div className={`p-3 rounded-2xl ${details?.bgColor}`}>
                        {details?.icon}
                      </div>
                      
                      {isSelected ? (
                        <span className="text-[10px] uppercase font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">Active Filter</span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Browse Group</span>
                      )}
                    </div>

                    <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white mb-2">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-404 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-650 dark:group-hover:text-indigo-405 pt-5 mt-4 border-t border-slate-100 dark:border-slate-900">
                    <span>Show Casing Tools</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Interactive catalog title indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 mb-6 border-b border-slate-200 dark:border-slate-800" id="catalog-grid-header">
            <div>
              <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-5 h-5 text-indigo-500" /> Complete Toolkit Inventory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Currently showing {filteredTools.length} {filteredTools.length === 1 ? 'utility' : 'utilities'} list formats
              </p>
            </div>

            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                id="reset-categories-filtration-btn"
              >
                Clear Column Category Filters &rarr;
              </button>
            )}
          </div>

          {/* Catalog grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="complete-tools-render-grid">
              {filteredTools.map((tool, idx) => {
                const spec = getCategoryDetails(tool.category);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(0.2, idx * 0.03) }}
                    key={tool.id}
                    onClick={() => onNavigateToTool(tool.id)}
                    onMouseEnter={() => onPrefetchTool?.(tool.id)}
                    className={`group bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-850/80 p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 ${spec?.borderAccent || ''} ${spec?.hoverBorder || 'hover:border-indigo-500'} ${spec?.glowColor || 'hover:shadow-lg'}`}
                    id={`catalog-tool-${tool.id}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 transition-colors">
                          {getToolIcon(tool.iconName)}
                        </div>
                        <span className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${spec?.pill}`}>
                          {tool.category}
                        </span>
                      </div>

                      <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-605 dark:group-hover:text-indigo-405 transition-colors">
                        {tool.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-wider mt-4 block group-hover:translate-x-1.5 transition-transform duration-200">
                      Access Utility &rarr;
                    </span>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3 animate-pulse" />
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">No specialized tool aligns with your search filter criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-605 hover:bg-slate-900 hover:text-indigo-400 transition cursor-pointer font-sans"
              >
                Reset Search Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 5. FEATURED TOOLS SECTION */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-10 relative" id="featured-tools-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 mb-8 animate-fade-in">
            <span className="p-1 px-2.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 text-[10px] uppercase font-extrabold tracking-wider border border-indigo-100 dark:border-indigo-900/50">Must-Have</span>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Featured Tool Powerhouses</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="featured-tools-grid">
            {featuredTools.map((tool) => {
              const info = getCategoryDetails(tool.category);
              return (
                <div 
                  key={tool.id}
                  onClick={() => onNavigateToTool(tool.id)}
                  onMouseEnter={() => onPrefetchTool?.(tool.id)}
                  className="group bg-slate-50/40 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-400 dark:hover:border-indigo-500/80 p-6 rounded-3xl cursor-pointer hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.08)] dark:hover:shadow-[0_15px_30px_-5px_rgba(99,102,241,0.15)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between border-t-[3px] border-t-indigo-500/85 dark:border-t-indigo-400/85"
                  id={`featured-${tool.id}`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300" />
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-[10px] font-mono tracking-wider font-bold px-2 py-0.5 rounded-lg ${info?.pill}`}>
                        ★ Featured
                      </span>
                      <Award className="w-5 h-5 text-indigo-500 dark:text-indigo-400 group-hover:rotate-12 transition-transform" />
                    </div>

                    <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-450 transition-colors">
                      {tool.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed min-h-[48px]">
                      {tool.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400 pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1 font-sans">Open Professional Tool <ArrowRight className="w-3.5 h-3.5" /></span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase group-hover:text-slate-500 font-mono">100% Free</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. RECENTLY ADDED TOOLS */}
      <section className="py-16 bg-slate-50/20 dark:bg-slate-950/30 border-b border-slate-200 dark:border-slate-850 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-405 dark:text-slate-500">Recently Added Utilities</h2>
            </div>
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200/50">Fresh Releases</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* New Tool 1: Text Sorter */}
            <div 
              onClick={() => onNavigateToTool('tools/text-sorter')}
              className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-indigo-400 dark:hover:border-indigo-500 p-6 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300 relative flex items-start gap-4"
              id="recent-tool-sorter"
            >
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-200">
                <ArrowUpDown className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Text Sorter
                  </h3>
                  <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 text-[8px] font-bold rounded uppercase tracking-wider animate-pulse">New</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mb-2">
                  Sort lines alphabetically, reverse list configurations, randomize templates, and strip out double duplicated statements with standard clients.
                </p>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline font-sans">Launch Sorter &rarr;</span>
              </div>
            </div>

            {/* New Tool 2: Text Reverser */}
            <div 
              onClick={() => onNavigateToTool('tools/text-reverser')}
              className="group bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-indigo-400 dark:hover:border-indigo-500 p-6 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300 relative flex items-start gap-4"
              id="recent-tool-reverser"
            >
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 group-hover:scale-105 transition-transform duration-200">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Text Reverser
                  </h3>
                  <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-850 dark:text-emerald-400 text-[8px] font-bold rounded uppercase tracking-wider animate-pulse">New</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed mb-2">
                  Flip lines, backward chars, word alignments, or reverse entire essay sections with dynamic parameters and download export options.
                </p>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline font-sans">Launch Reverser &rarr;</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE TEXTTOOLKITHUB */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Platform Architectural Goals</h2>
            <h3 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Why Engineers & Copywriters Prefer TextToolkitHub
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 max-w-xl mx-auto">
              A private, optimized, non-intrusive environment built to help you format text securely.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            
            <div className="flex flex-col gap-3.5 p-6 border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/20 rounded-2xl">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 rounded-xl w-fit border border-emerald-100 dark:border-emerald-900/30">
                <ShieldCheck className="w-5.5 h-5.5" />
              </div>
              <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white">Strict Local Privacy</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We never inspect, transmit, or monetize your private documents. Absolutely zero background tracking packets or database synchronizations occur in our ecosystem.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 p-6 border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/20 rounded-2xl">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-455 rounded-xl w-fit border border-indigo-100 dark:border-indigo-900/30">
                <Cpu className="w-5.5 h-5.5" />
              </div>
              <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white">Sub-Millisecond Speed</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                By compiling all computation modules inside your sandboxed iframe, we bypass traditional internet latency. Feel metrics update live inside 5ms!
              </p>
            </div>

            <div className="flex flex-col gap-3.5 p-6 border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-900/20 rounded-2xl">
              <div className="p-3 bg-amber-50 dark:bg-amber-955/30 text-amber-600 dark:text-amber-450 rounded-xl w-fit border border-amber-100 dark:border-emerald-900/30">
                <Zap className="w-5.5 h-5.5" />
              </div>
              <h4 className="font-sans font-bold text-base text-slate-900 dark:text-white">Professional Ergonomics</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Streamlined minimalistic layout optimized for developers, authors, and SEO copywriters. Fully responsive for desktop, tablet, and mobile browsers.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* BRAND COMPARATIVE & SEO ENRICHMENT CONTENT BLOCK */}
      <section className="py-16 md:py-24 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-850 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-950">
                Competitive Comparison
              </span>
              <h2 className="text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                The Premium Standard for Modern Text Utilities
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                Many online portals like <strong>TextToolHub</strong>, <strong>TextUtilsHub</strong>, or <strong>Pixocraft Tools</strong> parse your character inputs on external web servers. This raises massive security concerns for copywriters handling NDA-restricted drafts, managers editing meeting notes, and developers handling proprietary code formats.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                At <strong>TextToolkitHub Text Tools</strong>, we have completely re-engineered online text utilities. By constructing full sandboxed, offline-capable, client-side scripts, every case change, slug generation, whitespace purge, and word count calculation happens in millisecond-intervals directly in your local browser sandbox.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-850 shadow-sm">
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-sans">TextToolkitHub Word Counter</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Analyze syllable structures, reading times, speaking tempos, and dynamic keyword density metrics. Our word count algorithms are optimized for search relevance and professional content writers.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-sans">TextToolkitHub Case Converter</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Convert complex text blocks to UPPERCASE, lowercase, Title Case, camelCase, snake_case, PascalCase, or kebab-case URL slugs with simple one-click copy integrations.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-sans">100% Privacy & Security</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  No tracking cookies, no server-side records, and absolutely no intrusive paywalls or mandatory logins to interrupt your daily creative writing or software development flow.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base font-sans">Modern SaaS Design</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Equipped with professional visual indicators, a highly precise dark-theme interface, quick copy buffers, and responsive export triggers for maximum ergonomic comfort.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION */}
      <section className="py-16 md:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 bg-transparent">
        <div className="text-center mb-12">
          <div className="inline-flex p-3 rounded-full bg-indigo-50/80 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-100/30">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display font-sans">
            Frequently Asked Queries
          </h2>
          <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto dark:text-slate-400">
            Get transparent answers regarding operations, device compatibility, and text encoding calculations.
          </p>
        </div>

        <div className="flex flex-col gap-4" id="faq-accordion-container">
          {FAQS.map((faq) => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id}
                onClick={() => toggleFaq(faq.id)}
                className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-indigo-405 dark:hover:border-indigo-500/50 cursor-pointer select-none transition-all duration-200 animate-fade-in"
                id={`faq-item-${faq.id}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-sans font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base leading-tight">
                    {faq.question}
                  </h3>
                  <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-205 flex-shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-3 flex animate-in fade-in slide-in-from-top-1 duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. CTA & BOOKMARKING INSTRUCTIONS */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-900 relative overflow-hidden z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 dark:from-slate-950 dark:to-slate-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3.5 max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-widest font-extrabold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full">
                <BookOpen className="w-3.5 h-3.5" /> Bookmarking Shortcut
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white font-sans">
                Keep TextToolkitHub Handy
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                Press <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded font-mono text-white text-[11px] font-bold">Ctrl + D</kbd> or <kbd className="bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded font-mono text-white text-[11px] font-bold">⌘ + D</kbd> to add this portal to your favorites bar for instant bookmark accessibility. 
              </p>
            </div>

            <button
              onClick={() => onNavigateToTool('tools/word-counter')}
              className="px-6 py-3.5 bg-white text-indigo-900 rounded-2xl text-xs font-extrabold tracking-wide hover:bg-slate-50 transition shadow-md shrink-0 cursor-pointer font-sans"
            >
              Start Counter Work &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* 10. TEXTTOOLKITHUB INSIDER NEWSLETTER */}
      <HostingerNewsletter />

    </div>
  );
}
