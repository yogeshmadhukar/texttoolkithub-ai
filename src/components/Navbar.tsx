import React, { useState, useEffect, useRef } from 'react';
import { TOOLS, searchTools } from '../data.ts';
import { ActivePage, Tool, isDevSession } from '../types.ts';
import { motion } from 'motion/react';
import { analytics } from '../lib/analytics.ts';
import HubLogo from './HubLogo.tsx';
import { 
  Wrench, 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  FileText, 
  Type, 
  Hash, 
  AlignLeft, 
  Eraser,
  HelpCircle,
  Sparkles,
  Unlock,
  Link2,
  ArrowUpDown,
  ArrowLeftRight,
  Repeat,
  SpellCheck,
  BookOpen,
  Layers,
  TrendingUp,
  Bell,
  BellRing,
  Info,
  Linkedin,
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
  ArrowDownWideNarrow,
  ShieldCheck,
  ChevronRight,
  CheckCheck,
  ExternalLink,
  ArrowRight,
  ArrowUpRight,
  Image
} from 'lucide-react';
import updatesData from '../updates.json';

interface AppUpdate {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  toolId?: string;
}

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
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

export default function Navbar({ activePage, onNavigate, darkMode, onToggleDarkMode }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeSearchIndex, setActiveSearchIndex] = useState(-1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  const [updates] = useState<AppUpdate[]>(updatesData as AppUpdate[]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [readNotifIds, setReadNotifIds] = useState<string[]>([]);
  const [notifTab, setNotifTab] = useState<'all' | 'new-tools' | 'improvements' | 'upcoming' | 'news'>('all');
  const notifDropdownRef = useRef<HTMLDivElement>(null);

  const upcomingTools = [
    {
      id: "upcoming-1",
      title: "Markdown to PDF Exporter",
      description: "Convert rich markdown files directly into styled, downloadable PDF assets with standardized layouts. Scales our processing suite into secure corporate document formats.",
      eta: "Q3 2026",
      category: "Upcoming Tool"
    },
    {
      id: "upcoming-2",
      title: "Regex Helper Playground",
      description: "A complete browser-native test harness to write, debug, and test regular expressions with visual capture groups. Accelerates regex editing with interactive validation presets.",
      eta: "Q4 2026",
      category: "Upcoming Tool"
    },
    {
      id: "upcoming-3",
      title: "SQL Formatter & AST Validator",
      description: "Standardize and beautify messy nested SQL queries. To increase our tools, we're building a modular tokenizer that enables rapid expansion into multiple specialized database query parsers.",
      eta: "Q4 2026",
      category: "Upcoming Tool"
    },
    {
      id: "upcoming-4",
      title: "Safe Password Entropy & Strength Meter",
      description: "Safely parse password criteria fully locally in-browser to measure active bit entropy levels. Expands our footprint into browser security auditing and secure text analysis.",
      eta: "Q1 2027",
      category: "Upcoming Tool"
    },
    {
      id: "upcoming-5",
      title: "XML & SVG Scalable Optimizer",
      description: "Beautify and parse complex hierarchical XML strings or minify visual inline SVG coordinates. We increase our tool count by isolating lightweight rendering rules into safe worker threads.",
      eta: "Q1 2027",
      category: "Upcoming Tool"
    },
    {
      id: "upcoming-6",
      title: "CSV-to-SQL INSERT Script Generator",
      description: "Compute database schema layouts and map structured CSV datasets directly into safe SQL table creation and INSERT scripts. Enhances structural conversions for relational tables.",
      eta: "Q2 2027",
      category: "Upcoming Tool"
    },
    {
      id: "upcoming-7",
      title: "Unicode Character & HTML Glyph Matrix",
      description: "Deconstruct and inspect text strings into direct Unicode hex numbers, ASCII indices, or HTML entities. Simplifies advanced debugging of hidden/zero-width whitespace symbols.",
      eta: "Q2 2027",
      category: "Upcoming Tool"
    }
  ];

  const websiteNews = [
    {
      id: "news-pdf-suite-2026",
      title: "New Local PDF Processing Suite Released!",
      description: "TextToolkitHub now features a powerful local PDF suite! Convert images to PDF, split PDF page ranges, or merge multiple PDFs into one document — 100% locally in your browser with zero server uploads.",
      date: "2026-08-05",
      category: "Website News"
    },
    {
      id: "news-milestone-63",
      title: "63 Core Tools Hub Live!",
      description: "TextToolkitHub has officially reached 63 fully custom, browser-native tools! Check out our brand-new utilities: SRT & VTT Subtitle Cleaner and UTM Parameter & Link Builder, designed for fast client-side transcript cleaning and marketing tracking.",
      date: "2026-08-05",
      category: "Website News"
    },
    {
      id: "news-milestone-58",
      title: "58 Core Tools Hub Live!",
      description: "TextToolkitHub has officially reached 58 fully custom, browser-native tools! Enjoy our brand-new utilities: Morse Code Translator Pro and List Randomizer & Raffle Picker, designed for high-performance translations, audio feedback, and beautiful collection shuffling.",
      date: "2026-07-05",
      category: "Website News"
    },
    {
      id: "news-legal-framework-2026",
      title: "New Legal & Copyright Framework Live",
      description: "We have updated our site's legal documentation and compliance standards! Review our completely customized, browser-native Cookie Policy and DMCA & Copyright Policy sections.",
      date: "2026-06-30",
      category: "Website News"
    },
    {
      id: "news-milestone-56",
      title: "56 Core Tools Hub Live!",
      description: "TextToolkitHub has officially reached 56 fully custom, browser-native tools! Enjoy our brand-new utilities: Markdown Table Generator & Editor, Text-to-Speech Reader, HTML & XML Formatter, Text ↔ Binary Translator, and JSON ↔ XML Converter.",
      date: "2026-06-27",
      category: "Website News"
    },
    {
      id: "news-milestone-51",
      title: "51 Core Tools Hub Live!",
      description: "TextToolkitHub has officially reached 51 fully custom, browser-native tools! Enjoy our new tools: YAML/JSON, Color Contrast, UUID Generator, CSS Beautifier, User Agent Parser, Unix Timestamp, and more.",
      date: "2026-06-22",
      category: "Website News"
    },
    {
      id: "news-milestone-36",
      title: "36 Core Tools Hub Live",
      description: "TextToolkitHub has officially deployed 36 fully custom, completely browser-native tools, including our brand-new suite: QR Code Generator, JSON Formatter, JSON Minifier, Markdown to HTML, and HTML to Markdown.",
      date: "2026-06-15",
      category: "Website News"
    },
    {
      id: "news-1",
      title: "30 Core Tools Released",
      description: "TextToolkitHub has officially deployed 30 fully custom, completely browser-native text string cleaning, converting, and analysis tools.",
      date: "2026-06-08",
      category: "Website News"
    },
    {
      id: "news-2",
      title: "Cookieless Privacy Update",
      description: "All client-side interactions are completely anonymous and aggregate, protecting and preserving 100% of your personal assets.",
      date: "2026-06-05",
      category: "Website News"
    }
  ];

  const [notifSearchQuery, setNotifSearchQuery] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('texttoolkit_read_notifs');
      if (saved) {
        setReadNotifIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to parse read notification storage', e);
    }
  }, []);

  const unreadCount = updates.filter(up => !readNotifIds.includes(up.id)).length;
  const hasUnread = unreadCount > 0;

  const handleToggleNotifications = () => {
    setIsNotifOpen(!isNotifOpen);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = updates.map(up => up.id);
    setReadNotifIds(allIds);
    try {
      localStorage.setItem('texttoolkit_read_notifs', JSON.stringify(allIds));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  };

  const handleNotificationClick = (update: AppUpdate) => {
    if (!readNotifIds.includes(update.id)) {
      const updatedRead = [...readNotifIds, update.id];
      setReadNotifIds(updatedRead);
      try {
        localStorage.setItem('texttoolkit_read_notifs', JSON.stringify(updatedRead));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
    }

    if (update.toolId) {
      onNavigate(update.toolId);
      setIsNotifOpen(false);
      setMobileMenuOpen(false);
      analytics.trackToolOpened(update.toolId);
    }
  };

  // Filter tools based on search query
  const filteredTools = searchQuery.trim() === '' 
    ? [] 
    : searchTools(searchQuery);

  // Reset active search index when query changes
  useEffect(() => {
    setActiveSearchIndex(-1);
  }, [searchQuery]);

  // Global key bindings Ctrl+K, Cmd+K, or "/"
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('nav-search-desktop') as HTMLInputElement | null;
        input?.focus();
        setIsSearchFocused(true);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        const input = document.getElementById('nav-search-desktop') as HTMLInputElement | null;
        input?.focus();
        setIsSearchFocused(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Analytics: Track Navbar quick search query with 1.5s debounce to optimize event count
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') return;

    const delayDebounceId = setTimeout(() => {
      const resultsCount = filteredTools.length;
      analytics.trackSearchPerformed(searchQuery.trim(), resultsCount);
    }, 1500);

    return () => clearTimeout(delayDebounceId);
  }, [searchQuery, filteredTools.length]);

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredTools.length === 0) return;

    const visibleItemsCount = filteredTools.length > 5 ? 5 : filteredTools.length;
    const totalSelectableCount = filteredTools.length > 5 ? visibleItemsCount + 1 : visibleItemsCount;

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
        handleToolSelect(filteredTools[activeSearchIndex].id);
      } else if (activeSearchIndex === visibleItemsCount && filteredTools.length > 5) {
        handleLinkSelect('home');
        setIsSearchFocused(false);
      } else if (filteredTools.length > 0) {
        handleToolSelect(filteredTools[0].id);
      }
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
      setActiveSearchIndex(-1);
      (e.target as HTMLInputElement).blur();
    }
  };

  // Close search/notification dropdown on click outside or Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsSearchFocused(false);
        setIsNotifOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Map icon name to Lucide components
  const getToolIcon = (name: string) => {
    switch (name) {
      case 'FileText': return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'SpellCheck': return <SpellCheck className="w-4 h-4 text-indigo-500" />;
      case 'BookOpen': return <BookOpen className="w-4 h-4 text-emerald-500" />;
      case 'TrendingUp': return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'Hash': return <Hash className="w-4 h-4 text-emerald-500" />;
      case 'Unwrap': return <AlignLeft className="w-4 h-4 text-indigo-500" />;
      case 'AlignLeft': return <AlignLeft className="w-4 h-4 text-emerald-500" />;
      case 'Eraser': return <Eraser className="w-4 h-4 text-indigo-500" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-500" />;
      case 'Type': return <Type className="w-4 h-4 text-amber-500" />;
      case 'Unlock': return <Unlock className="w-4 h-4 text-indigo-500" />;
      case 'Link2': return <Link2 className="w-4 h-4 text-indigo-500" />;
      case 'ArrowUpDown': return <ArrowUpDown className="w-4 h-4 text-emerald-500" />;
      case 'ArrowLeftRight': return <ArrowLeftRight className="w-4 h-4 text-indigo-500" />;
      case 'Repeat': return <Repeat className="w-4 h-4 text-amber-500" />;
      case 'Scissors': return <Scissors className="w-4 h-4 text-indigo-500" />;
      case 'FileCode': return <FileCode className="w-4 h-4 text-indigo-500" />;
      case 'Sparkle': return <Sparkle className="w-4 h-4 text-indigo-500" />;
      case 'Pilcrow': return <Pilcrow className="w-4 h-4 text-indigo-500" />;
      case 'Smile': return <Smile className="w-4 h-4 text-indigo-500" />;
      case 'List': return <List className="w-4 h-4 text-indigo-500" />;
      case 'FileSpreadsheet': return <FileSpreadsheet className="w-4 h-4 text-emerald-500" />;
      case 'Code': return <Code className="w-4 h-4 text-indigo-500" />;
      case 'Clock': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'QrCode': return <QrCode className="w-4 h-4 text-rose-500" />;
      case 'FileJson': return <FileJson className="w-4 h-4 text-indigo-500" />;
      case 'ArrowDownWideNarrow': return <ArrowDownWideNarrow className="w-4 h-4 text-indigo-500" />;
      case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      default: return <Wrench className="w-4 h-4 text-blue-500" />;
    }
  };

  const handleToolSelect = (toolId: string) => {
    onNavigate(toolId);
    setSearchQuery('');
    setIsSearchFocused(false);
    setMobileMenuOpen(false);
  };

  const handleLinkSelect = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  const newToolsCount = updates.filter(u => u.category === 'New Tool').length;
  const improvementsCount = updates.filter(u => u.category === 'Improvement' || u.category === 'Feature Update').length;

  const getFilteredUpdates = () => {
    let list: AppUpdate[] = [];
    switch (notifTab) {
      case 'new-tools':
        list = updates.filter(u => u.category === 'New Tool');
        break;
      case 'improvements':
        list = updates.filter(u => u.category === 'Improvement' || u.category === 'Feature Update');
        break;
      case 'upcoming':
        return [];
      case 'news':
        return [];
      default:
        list = updates;
        break;
    }

    if (notifSearchQuery.trim() !== '') {
      const q = notifSearchQuery.toLowerCase();
      list = list.filter(u => 
        u.title.toLowerCase().includes(q) || 
        u.description.toLowerCase().includes(q) || 
        u.category.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filteredUpdatesList = getFilteredUpdates();

  const filteredUpcomingTools = upcomingTools.filter(t => {
    if (!notifSearchQuery.trim()) return true;
    const q = notifSearchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
  });

  const filteredWebsiteNews = websiteNews.filter(n => {
    if (!notifSearchQuery.trim()) return true;
    const q = notifSearchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.description.toLowerCase().includes(q);
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Logo & Brand */}
          <div 
            className="flex items-center gap-1.5 min-[350px]:gap-2 sm:gap-2.5 flex-shrink-0 animate-fade-in"
            id="nav-logo-link"
          >
            <div className="hover:scale-105 transition-transform duration-200 shrink-0">
              <HubLogo size="md" editable={true} style={{ width: '51px', height: '46px' }} />
            </div>
            <span 
              onClick={() => handleLinkSelect('home')} 
              className="font-sans font-extrabold text-[13px] min-[350px]:text-[15px] sm:text-lg md:text-xl tracking-tight text-slate-950 dark:text-white cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors select-none"
            >
              Text<span className="text-indigo-600 dark:text-indigo-400">Toolkit</span><span className="hidden min-[350px]:inline">Hub</span>
            </span>
          </div>





          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center md:gap-0.5 lg:gap-1 xl:gap-1.5 relative">
            {(['home', 'tools', 'guides', 'about', 'faq', 'contact'] as const).map((page) => {
              const isActive = activePage === page;
              const labels = { home: 'Home', tools: 'Tools', guides: 'Guides', about: 'About', faq: 'FAQ', contact: 'Contact' };
              return (
                <button
                  key={page}
                  onClick={() => handleLinkSelect(page)}
                  className={`relative md:px-2 lg:px-3 xl:px-4 py-2 md:text-xs lg:text-sm font-semibold transition-colors duration-250 rounded-full z-10 cursor-pointer ${
                    isActive 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100'
                  }`}
                  id={`desktop-nav-${page}`}
                >
                  <span className="relative z-10">{labels[page]}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-slate-100/70 dark:bg-slate-800/60 rounded-full border border-slate-200/40 dark:border-slate-800/40"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Premium Desktop Search Input */}
          <div className="relative hidden md:block md:w-36 lg:w-56 xl:w-72" ref={searchDropdownRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
              <input
                id="nav-search-desktop"
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search tools... (⌘K)"
                className="w-full pl-9 pr-10 py-1.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-full text-xs text-slate-850 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition focus:border-indigo-500 dark:focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-505/5"
              />
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveSearchIndex(-1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-605 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200/20 dark:border-slate-700/60 pointer-events-none select-none">
                  ⌘K
                </div>
              )}
            </div>

            {/* Premium Floating Search suggestions list */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div 
                className="absolute top-full right-0 mt-2 w-[280px] sm:w-[360px] md:w-[440px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-1 duration-150"
                id="desktop-search-suggestions"
              >
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 flex justify-between items-center text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  <span>Suggestions Match</span>
                  <span className="font-mono text-[9px] normal-case text-slate-400">
                    Use ↑↓ and Enter
                  </span>
                </div>
                <div className="p-2 max-h-[300px] overflow-y-auto space-y-1">
                  {filteredTools.length > 0 ? (
                    filteredTools.slice(0, 5).map((tool, index) => {
                      const isActive = index === activeSearchIndex;
                      return (
                        <div
                          key={tool.id}
                          onMouseEnter={() => setActiveSearchIndex(index)}
                          onClick={() => handleToolSelect(tool.id)}
                          className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors duration-155 ${
                            isActive 
                              ? 'bg-indigo-50/80 dark:bg-slate-800/85 text-indigo-600 dark:text-indigo-300' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-350'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                              {getToolIcon(tool.iconName)}
                            </div>
                            <div className="text-left min-w-0">
                              <span className={`text-xs font-bold block ${isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-800 dark:text-slate-100'}`}>
                                <HighlightText text={tool.title} highlight={searchQuery} />
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 block line-clamp-1 mt-0.5">
                                <HighlightText text={tool.description} highlight={searchQuery} />
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-505">
                      No matching tools found.
                    </div>
                  )}
                </div>
                {filteredTools.length > 5 && (
                  <div 
                    onClick={() => {
                      handleLinkSelect('home');
                      setIsSearchFocused(false);
                    }}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-900 border-t border-slate-105 cursor-pointer text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition"
                  >
                    View all {filteredTools.length} results &rarr;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Redesigned Notification Bell with Categorizations & Direct Tool Access */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                id="notification-bell-btn"
                onClick={handleToggleNotifications}
                className="relative p-1.5 min-[350px]:p-2 sm:p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-650 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-300 hover:text-slate-900 group dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                title="Recent Updates & News"
                aria-label="Open notifications center"
                aria-expanded={isNotifOpen}
              >
                {hasUnread ? (
                  <BellRing className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 animate-pulse" />
                ) : (
                  <Bell className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-600 dark:text-slate-350 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                )}
                {hasUnread && (
                  <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {/* Glassmorphic Notification Dropdown Menu */}
              {isNotifOpen && (
                <div 
                  className="fixed top-16 left-3 right-3 md:absolute md:top-full md:right-0 md:left-auto mt-2 w-auto md:w-[420px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-2xl shadow-slate-300/30 dark:shadow-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col"
                  id="notifications-dropdown-menu"
                >
                  {/* Header */}
                  <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-500" />
                      <span className="font-sans font-extrabold text-sm text-slate-900 dark:text-white">
                        Notification Center
                      </span>
                      {hasUnread ? (
                        <span className="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Up to date
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {hasUnread && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                          title="Mark all notifications as read"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Mark read
                        </button>
                      )}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        v1.6.0
                      </span>
                    </div>
                  </div>

                  {/* Search Filter Box Inside Dropdown */}
                  <div className="px-3 pt-2.5 pb-1 relative border-b border-slate-100 dark:border-slate-850/80 bg-slate-50/30 dark:bg-slate-950/30">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-6 top-1/2 -translate-y-[calc(50%-3px)]" />
                    <input
                      type="text"
                      value={notifSearchQuery}
                      onChange={(e) => setNotifSearchQuery(e.target.value)}
                      placeholder="Search updates & tools..."
                      className="w-full pl-8 pr-7 py-1.5 bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-100 placeholder-slate-400"
                    />
                    {notifSearchQuery && (
                      <button 
                        onClick={() => setNotifSearchQuery('')}
                        className="absolute right-5 top-1/2 -translate-y-[calc(50%-3px)] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Selector Tabs with Item Counts */}
                  <div className="flex items-center gap-1 border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 px-2.5 py-2 overflow-x-auto scrollbar-none select-none shrink-0">
                    {(['all', 'new-tools', 'improvements', 'upcoming', 'news'] as const).map((tab) => {
                      const isActive = notifTab === tab;
                      const countMap = {
                        all: updates.length,
                        'new-tools': newToolsCount,
                        improvements: improvementsCount,
                        upcoming: upcomingTools.length,
                        news: websiteNews.length
                      };
                      const tabLabels = {
                        all: 'All',
                        'new-tools': 'New Tools',
                        improvements: 'Updates',
                        upcoming: 'Roadmap',
                        news: 'News'
                      };
                      return (
                        <button
                          key={tab}
                          onClick={() => setNotifTab(tab)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all duration-150 cursor-pointer flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-indigo-400/20 ${
                            isActive
                              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <span>{tabLabels[tab]}</span>
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-extrabold ${
                            isActive 
                              ? 'bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950' 
                              : 'bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                          }`}>
                            {countMap[tab]}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Body List */}
                  <div className="max-h-80 overflow-y-auto p-2.5 flex flex-col gap-1.5 min-h-[180px] max-w-full">
                    {/* All / New Tools / Improvements Tabs */}
                    {(notifTab === 'all' || notifTab === 'new-tools' || notifTab === 'improvements') && (
                      filteredUpdatesList.length > 0 ? (
                        [...filteredUpdatesList]
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((update) => {
                            const isUnread = !readNotifIds.includes(update.id);
                            return (
                              <div 
                                key={update.id}
                                onClick={() => handleNotificationClick(update)}
                                className={`p-3 rounded-xl transition-all duration-150 flex flex-col border text-left group ${
                                  update.toolId ? 'cursor-pointer hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-200/80 dark:hover:border-indigo-800/50' : 'hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:border-slate-200 dark:hover:border-slate-800'
                                } ${
                                  isUnread 
                                    ? 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/40' 
                                    : 'border-slate-100 dark:border-slate-850 bg-white/50 dark:bg-slate-900/20'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-1.5">
                                    {isUnread && (
                                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0" title="Unread" />
                                    )}
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider select-none ${
                                      update.category === 'New Tool' 
                                        ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40'
                                        : update.category === 'Feature Update'
                                        ? 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/40'
                                        : update.category === 'Improvement'
                                        ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-400 border border-sky-200/50 dark:border-sky-800/40'
                                        : 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/40'
                                    }`}>
                                      {update.category}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                      {update.date}
                                    </span>
                                    {update.toolId && (
                                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 shrink-0">
                                        Try <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 font-sans flex items-center gap-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  <span>{update.title}</span>
                                  {update.toolId && (
                                    <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                                  )}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-sans">
                                  {update.description}
                                </p>
                              </div>
                            );
                          })
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400">
                          <Info className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="font-sans">No matching updates found for "{notifSearchQuery}".</p>
                        </div>
                      )
                    )}

                    {/* Upcoming Tools / Roadmap Tab */}
                    {notifTab === 'upcoming' && (
                      <div className="flex flex-col gap-2">
                        {/* Interactive strategy banner to answer how we increase our tools */}
                        <div className="p-3.5 mb-1 bg-gradient-to-br from-indigo-50/60 to-violet-50/40 dark:from-indigo-950/30 dark:to-violet-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-left">
                          <div className="flex items-center gap-1.5 mb-1 text-indigo-700 dark:text-indigo-300">
                            <TrendingUp className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                            <span className="font-sans font-extrabold text-[11px] uppercase tracking-wider">How We Scale to 100+ Tools</span>
                          </div>
                          <p className="text-[10px] text-slate-600 dark:text-slate-350 leading-relaxed font-sans">
                            We deploy client-side tools via modular browser WebWorker architectures without server bottlenecks:
                          </p>
                          <ul className="mt-2 space-y-1 text-[9.5px] text-slate-600 dark:text-slate-400 list-none font-sans">
                            <li className="flex items-start gap-1">
                              <span className="text-indigo-500 font-bold shrink-0">1.</span>
                              <span><strong>Client-Side Engine:</strong> Zero-network JS/Wasm processing for instant speed.</span>
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-indigo-500 font-bold shrink-0">2.</span>
                              <span><strong>Community Driven:</strong> Direct tool requests prioritized via Support Desk.</span>
                            </li>
                          </ul>
                        </div>

                        {filteredUpcomingTools.length > 0 ? (
                          filteredUpcomingTools.map((tool) => (
                            <div 
                              key={tool.id}
                              className="p-3 bg-white/50 dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition flex flex-col border border-slate-100 dark:border-slate-850 text-left"
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <span className="px-2 py-0.5 bg-violet-50 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300 text-[8.5px] font-extrabold uppercase tracking-wider rounded-full border border-violet-200/50 dark:border-violet-800/40">
                                  {tool.category}
                                </span>
                                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold font-mono">ETA: {tool.eta}</span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 font-sans">{tool.title}</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-sans">{tool.description}</p>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400">
                            <Info className="w-8 h-8 text-slate-300 mb-2" />
                            <p className="font-sans">No upcoming tools match "{notifSearchQuery}".</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* News Tab */}
                    {notifTab === 'news' && (
                      filteredWebsiteNews.length > 0 ? (
                        filteredWebsiteNews.map((news) => (
                          <div 
                            key={news.id}
                            className="p-3 bg-white/50 dark:bg-slate-900/20 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition flex flex-col border border-slate-100 dark:border-slate-850 text-left"
                          >
                            <div className="flex items-center justify-between gap-2.5">
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[8.5px] font-extrabold uppercase tracking-wider rounded-full border border-amber-200/50 dark:border-amber-800/40">
                                {news.category}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{news.date}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 font-sans">{news.title}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-sans">{news.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400">
                          <Info className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="font-sans">No news match "{notifSearchQuery}".</p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
                    {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="hidden md:inline-flex p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-650 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle layout theme"
              id="theme-toggle"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>

            {/* Mobile menu toggle (Hamburger - Minimum 44x44px Touch Target) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-11 h-11 flex-shrink-0 md:hidden rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50/60 text-slate-650 dark:bg-slate-800/50 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              id="mobile-menu-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
              aria-expanded={mobileMenuOpen}
              title={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-4.5 h-4.5 animate-in spin-in-12 duration-200" />
              ) : (
                <Menu className="w-4.5 h-4.5 animate-in fade-in duration-200" />
              )}
            </button>
          </div>

        </div>
      </div>
        {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-5 px-4 shadow-xl flex flex-col gap-5 animate-in fade-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-4.5rem)] overflow-y-auto" id="mobile-menu-drawer">
          
          {/* Quick search inside mobile menu */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search 58 browser tools..."
              className="w-full pl-10 pr-8 py-2.5 border rounded-xl text-sm outline-none bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
              id="search-input-mobile"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Search dropdown list for mobile */}
            {searchQuery.trim() !== '' && (
              <div className="mt-2 border border-slate-150 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl max-h-64 overflow-y-auto p-1.5 flex flex-col gap-1 z-50 relative shadow-lg">
                {filteredTools.length > 0 ? (
                  <>
                    {filteredTools.slice(0, 5).map((tool, idx) => {
                      const isActive = idx === activeSearchIndex;
                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleToolSelect(tool.id)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl cursor-pointer group transition-all duration-150 ${
                            isActive 
                              ? 'bg-slate-100 dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 font-semibold' 
                              : 'hover:bg-white dark:hover:bg-slate-800/80'
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0 group-hover:bg-white dark:group-hover:bg-slate-900 transition-colors">
                            {getToolIcon(tool.iconName)}
                          </div>
                          <div className="min-w-0 text-left flex-1">
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                              <HighlightText text={tool.title} highlight={searchQuery} />
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                              <HighlightText text={tool.description} highlight={searchQuery} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {filteredTools.length > 5 && (
                      <div 
                        onClick={() => {
                          handleLinkSelect('home');
                          setIsSearchFocused(false);
                        }}
                        className={`px-3 py-2 text-[11px] font-semibold text-center border-t border-slate-100 dark:border-slate-800/60 cursor-pointer text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors ${
                          activeSearchIndex === 5 ? 'bg-slate-100 dark:bg-slate-850 font-bold' : ''
                        }`}
                      >
                        View All {filteredTools.length} Results &rarr;
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-xs text-center text-slate-450 dark:text-slate-500">No tools found</div>
                )}
              </div>
            )}
          </div>

          {/* Quick Navigation Pages (Grid format for high-contrast touch targets on mobile) */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Main Directories</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'home', label: 'Home Feed' },
                { name: 'tools', label: 'All 58 Tools' },
                { name: 'guides', label: 'Guides Hub' },
                { name: 'about', label: 'Our Story' },
                { name: 'faq', label: 'Help & FAQ' },
                { name: 'contact', label: 'Support Desk' }
              ].map((pg) => {
                const isActive = activePage === pg.name;
                return (
                  <button
                    key={pg.name}
                    onClick={() => handleLinkSelect(pg.name)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition duration-150 ${
                      isActive 
                        ? 'bg-indigo-50/70 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-bold' 
                        : 'bg-white dark:bg-[#111622] border-slate-150 dark:border-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <span className="text-xs">{pg.label}</span>
                    <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-indigo-500' : ''}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* QUICK ACCESS: POPULAR TOOLS (The "Important Things" requested by the user) */}
          <div className="space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Popular Utilities</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'tools/word-counter', title: 'Word Counter', icon: <FileText className="w-4 h-4 text-emerald-500" /> },
                { id: 'tools/readability-checker', title: 'Readability Checker', icon: <BookOpen className="w-4 h-4 text-emerald-500" /> },
                { id: 'tools/json-formatter', title: 'JSON Formatter', icon: <FileJson className="w-4 h-4 text-indigo-500" /> },
                { id: 'tools/paragraph-formatter', title: 'Paragraph Formatter', icon: <Pilcrow className="w-4 h-4 text-indigo-500" /> },
                { id: 'tools/regex-tester', title: 'Regex Matcher', icon: <Code className="w-4 h-4 text-indigo-500" /> },
                { id: 'tools/csv-formatter', title: 'CSV Formatter', icon: <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleToolSelect(item.id)}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-[#111622] hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 transition duration-150 text-left"
                >
                  <div className="p-1 rounded-lg bg-slate-50 dark:bg-slate-900 shrink-0 border border-slate-100 dark:border-slate-800">
                    {item.icon}
                  </div>
                  <span className="text-xs font-semibold leading-tight line-clamp-1">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compact Footnote (Privacy & Terms only, NO SOCIAL MEDIA ICONS) */}
          <div className="border-t border-slate-150 dark:border-slate-800/80 pt-4 mt-1 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 px-1">
              <div className="flex gap-3">
                <button onClick={() => handleLinkSelect('privacy')} className="hover:underline hover:text-indigo-500 dark:hover:text-indigo-400">Privacy Policy</button>
                <span>•</span>
                <button onClick={() => handleLinkSelect('terms')} className="hover:underline hover:text-indigo-500 dark:hover:text-indigo-400">Terms of Service</button>
              </div>
              <span>© 2026 Toolkit</span>
            </div>
          </div>

        </div>
      )}
    </header>
  );
}
