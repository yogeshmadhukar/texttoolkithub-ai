import React, { useState, useEffect, useRef } from 'react';
import { TOOLS, searchTools } from '../data.ts';
import { ActivePage, Tool } from '../types.ts';
import { motion } from 'motion/react';
import { analytics } from '../lib/analytics.ts';
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
  ShieldCheck
} from 'lucide-react';
import updatesData from '../updates.json';

interface AppUpdate {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
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
      description: "Convert rich markdown files directly into styled, downloadable PDF assets with standardized layouts.",
      eta: "Q3 2026",
      category: "Upcoming Tool"
    },
    {
      id: "upcoming-2",
      title: "Regex Helper Playground",
      description: "A complete browser-native test harness to write, debug, and test regular expressions with visual capture groups.",
      eta: "Q4 2026",
      category: "Upcoming Tool"
    }
  ];

  const websiteNews = [
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
    if (!isNotifOpen) {
      // Mark current update IDs as read when opened
      const allIds = updates.map(up => up.id);
      setReadNotifIds(allIds);
      try {
        localStorage.setItem('texttoolkit_read_notifs', JSON.stringify(allIds));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
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

  const getFilteredUpdates = () => {
    switch (notifTab) {
      case 'new-tools':
        return updates.filter(u => u.category === 'New Tool');
      case 'improvements':
        return updates.filter(u => u.category === 'Improvement' || u.category === 'Feature Update');
      case 'upcoming':
        return [];
      case 'news':
        return [];
      default:
        return updates;
    }
  };

  const filteredUpdatesList = getFilteredUpdates();

  return (
    <header className="sticky top-0 z-50 w-full border-b backdrop-blur-md border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleLinkSelect('home')} 
            className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
            id="nav-logo-link"
          >
            <div className="p-2 rounded-xl bg-indigo-500 text-white group-hover:scale-105 transition-transform duration-200 shadow-md shadow-indigo-500/20">
              <Wrench className="w-5 h-5" />
            </div>
            <span className="font-sans font-extrabold text-xl tracking-tight text-slate-950 dark:text-white">
              Text<span className="text-indigo-600 dark:text-indigo-400">Toolkit</span>Hub
            </span>
          </div>



          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1.5 relative">
            {(['home', 'tools', 'about', 'faq', 'contact'] as const).map((page) => {
              const isActive = activePage === page;
              const labels = { home: 'Home', tools: 'Tools', about: 'About', faq: 'FAQ', contact: 'Contact' };
              return (
                <button
                  key={page}
                  onClick={() => handleLinkSelect(page)}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors duration-250 rounded-full z-10 cursor-pointer ${
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
          <div className="relative hidden lg:block w-60 xl:w-72" ref={searchDropdownRef}>
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
                className="absolute top-full right-0 mt-2 w-[440px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 animate-in fade-in slide-in-from-top-1 duration-150"
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
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Redesigned Notification Bell with Categorizations */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                id="notification-bell-btn"
                onClick={handleToggleNotifications}
                className="relative p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-650 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-305 hover:text-slate-900 group dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-705 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-505/40"
                title="Recent Updates & News"
                aria-label="Open notifications center"
                aria-expanded={isNotifOpen}
              >
                {hasUnread ? (
                  <BellRing className="w-4.5 h-4.5 text-indigo-550 dark:text-indigo-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110 animate-pulse" />
                ) : (
                  <Bell className="w-4.5 h-4.5 text-slate-600 dark:text-slate-350 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                )}
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-910 animate-pulse" />
                )}
              </button>

              {/* Redesigned Glassmorphic Notification Dropdown Menu */}
              {isNotifOpen && (
                <div 
                  className="fixed top-16 left-4 right-4 md:absolute md:top-full md:right-0 md:left-auto mt-2 w-auto md:w-96 min-w-[340px] md:min-w-[420px] bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 flex flex-col"
                  id="notifications-dropdown-menu"
                >
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-slate-101 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-extrabold text-sm text-slate-900 dark:text-white">
                        Notifications Center
                      </span>
                      {hasUnread && (
                        <span className="bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-450 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      v1.5.0
                    </span>
                  </div>

                  {/* Redesigned Category Selector Tabs */}
                  <div className="flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 px-3 py-2 overflow-x-auto scrollbar-none select-none shrink-0">
                    {(['all', 'new-tools', 'improvements', 'upcoming', 'news'] as const).map((tab) => {
                      const isActive = notifTab === tab;
                      const tabLabels = {
                        all: 'All',
                        'new-tools': 'New Tools',
                        improvements: 'Improvements',
                        upcoming: 'Roadmap',
                        news: 'News'
                      };
                      return (
                        <button
                          key={tab}
                          onClick={() => setNotifTab(tab)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all duration-155 cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-400/20 ${
                            isActive
                              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-955 shadow-sm'
                              : 'text-slate-505 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                          }`}
                        >
                          {tabLabels[tab]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Body List */}
                  <div className="max-h-80 overflow-y-auto p-2.5 flex flex-col gap-1.5 min-h-[160px] max-w-full">
                    {/* All Updates Tab */}
                    {notifTab === 'all' && (
                      filteredUpdatesList.length > 0 ? (
                        [...filteredUpdatesList]
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((update) => (
                            <div 
                              key={update.id}
                              className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition-all duration-150 flex flex-col border border-transparent hover:border-slate-100 dark:hover:border-slate-850 text-left"
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[8.5px] font-extrabold select-none ${
                                  update.category === 'New Tool' 
                                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/30'
                                    : update.category === 'Feature Update'
                                    ? 'bg-indigo-50 text-indigo-805 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/30'
                                    : update.category === 'Improvement'
                                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    : 'bg-amber-50 text-amber-801 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100/30'
                                }`}>
                                  {update.category}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                  {update.date}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 font-sans">
                                {update.title}
                              </h4>
                              <p className="text-[11px] text-slate-505 dark:text-slate-400 mt-1 leading-relaxed font-sans">
                                {update.description}
                              </p>
                            </div>
                          ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-404">
                          <Info className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="font-sans">You're using the latest version of TextToolkitHub.</p>
                        </div>
                      )
                    )}

                    {/* New Tools Tab */}
                    {notifTab === 'new-tools' && (
                      filteredUpdatesList.length > 0 ? (
                        [...filteredUpdatesList]
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((update) => (
                            <div 
                              key={update.id}
                              className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition-all duration-150 flex flex-col border border-transparent hover:border-slate-100 dark:hover:border-slate-850 text-left"
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-805 dark:bg-emerald-950/40 dark:text-emerald-400 text-[8.5px] font-extrabold rounded-full border border-emerald-100/30">
                                  {update.category}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono">{update.date}</span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 font-sans">{update.title}</h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-404 mt-1 leading-relaxed font-sans">{update.description}</p>
                            </div>
                          ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-405">
                          <Info className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="font-sans">You're using the latest version of TextToolkitHub.</p>
                        </div>
                      )
                    )}

                    {/* Improvements Tab */}
                    {notifTab === 'improvements' && (
                      filteredUpdatesList.length > 0 ? (
                        [...filteredUpdatesList]
                          .sort((a, b) => b.date.localeCompare(a.date))
                          .map((update) => (
                            <div 
                              key={update.id}
                              className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition flex flex-col border border-transparent hover:border-slate-101 dark:hover:border-slate-850 text-left"
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 text-[8.5px] font-extrabold rounded-full border border-indigo-100/30">
                                  {update.category}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono">{update.date}</span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 font-sans">{update.title}</h4>
                              <p className="text-[11px] text-slate-505 dark:text-slate-400 mt-1 leading-relaxed font-sans">{update.description}</p>
                            </div>
                          ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400">
                          <Info className="w-8 h-8 text-slate-305 mb-2" />
                          <p className="font-sans">You're using the latest version of TextToolkitHub.</p>
                        </div>
                      )
                    )}

                    {/* Upcoming Tools Tab */}
                    {notifTab === 'upcoming' && (
                      upcomingTools.length > 0 ? (
                        upcomingTools.map((tool) => (
                          <div 
                            key={tool.id}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition flex flex-col border border-transparent hover:border-slate-100 dark:hover:border-slate-850 text-left"
                          >
                            <div className="flex items-center justify-between gap-2.5">
                              <span className="px-2 py-0.5 bg-violet-50 text-violet-800 dark:bg-violet-955/40 dark:text-violet-400 text-[8.5px] font-extrabold rounded-full border border-violet-100/30">
                                {tool.category}
                              </span>
                              <span className="text-[10px] text-indigo-500 dark:text-indigo-400 font-bold font-mono">ETA: {tool.eta}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1.5 font-sans">{tool.title}</h4>
                            <p className="text-[11px] text-slate-505 dark:text-slate-400 mt-1 leading-relaxed font-sans">{tool.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400">
                          <Info className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="font-sans">You're using the latest version of TextToolkitHub.</p>
                        </div>
                      )
                    )}

                    {/* News Tab */}
                    {notifTab === 'news' && (
                      websiteNews.length > 0 ? (
                        websiteNews.map((news) => (
                          <div 
                            key={news.id}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition flex flex-col border border-transparent hover:border-slate-100 dark:hover:border-slate-850 text-left"
                          >
                            <div className="flex items-center justify-between gap-2.5">
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 dark:bg-amber-955/40 dark:text-amber-400 text-[8.5px] font-extrabold rounded-full border border-amber-100/30">
                                {news.category}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">{news.date}</span>
                            </div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-101 mt-1.5 font-sans">{news.title}</h4>
                            <p className="text-[11px] text-slate-550 dark:text-slate-404 mt-1 leading-relaxed font-sans">{news.description}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-center text-xs text-slate-400">
                          <Info className="w-8 h-8 text-slate-300 mb-2" />
                          <p className="font-sans">You're using the latest version of TextToolkitHub.</p>
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
              className="p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition"
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle layout theme"
              id="theme-toggle"
            >
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-405" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>

            {/* X (Twitter) Social Icon Link for Desktop */}
            <a
              href="https://x.com/TextToolkitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              title="Follow TextToolkitHub on X (Twitter)"
              aria-label="Follow TextToolkitHub on X (Twitter)"
              id="desktop-x-link"
            >
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* LinkedIn Social Icon Link for Desktop */}
            <a
              href="https://www.linkedin.com/in/texttoolkithub"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:text-[#0077b5] dark:hover:text-[#0a66c2] hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer items-center justify-center focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              title="Connect with TextToolkitHub on LinkedIn"
              aria-label="Connect with TextToolkitHub on LinkedIn"
              id="desktop-linkedin-link"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 md:hidden rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 shadow-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Quick search inside mobile menu */}
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search tools..."
              className="w-full pl-10 pr-8 py-2 border rounded-full text-sm outline-none bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 focus:bg-white focus:ring-1 focus:ring-indigo-500"
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
              <div className="mt-2 border border-slate-150 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/95 backdrop-blur-md rounded-2xl max-h-64 overflow-y-auto p-1.5 flex flex-col gap-1 z-50 relative">
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

          <div className="flex flex-col gap-2 font-medium">
            <button
              onClick={() => handleLinkSelect('home')}
              className={`w-full text-left py-2 px-3.5 rounded-xl text-sm ${activePage === 'home' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              id="mobile-nav-home"
            >
              Home
            </button>
            <button
              onClick={() => handleLinkSelect('tools')}
              className={`w-full text-left py-2 px-3.5 rounded-xl text-sm ${activePage === 'tools' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              id="mobile-nav-tools"
            >
              Tools
            </button>
            <button
              onClick={() => handleLinkSelect('about')}
              className={`w-full text-left py-2 px-3.5 rounded-xl text-sm ${activePage === 'about' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              id="mobile-nav-about"
            >
              About
            </button>
            <button
              onClick={() => handleLinkSelect('faq')}
              className={`w-full text-left py-2 px-3.5 rounded-xl text-sm ${activePage === 'faq' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              id="mobile-nav-faq"
            >
              FAQ
            </button>
            <button
              onClick={() => handleLinkSelect('contact')}
              className={`w-full text-left py-2 px-3.5 rounded-xl text-sm ${activePage === 'contact' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              id="mobile-nav-contact"
            >
              Contact
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 text-xs text-slate-400">
              <button onClick={() => handleLinkSelect('privacy')} className="hover:underline">Privacy Policy</button>
              <span>•</span>
              <button onClick={() => handleLinkSelect('terms')} className="hover:underline">Terms of Service</button>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile X (Twitter) Link */}
              <a
                href="https://x.com/TextToolkitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                title="Follow TextToolkitHub on X"
                aria-label="Follow TextToolkitHub on X"
                id="mobile-x-link"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-xs font-semibold">X</span>
              </a>

              {/* Mobile LinkedIn Link */}
              <a
                href="https://www.linkedin.com/in/texttoolkithub"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:text-[#0077b5] dark:hover:text-[#0a66c2] hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                title="Connect with TextToolkitHub on LinkedIn"
                aria-label="Connect with TextToolkitHub on LinkedIn"
                id="mobile-linkedin-link"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
