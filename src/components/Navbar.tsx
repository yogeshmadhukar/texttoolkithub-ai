import React, { useState, useEffect, useRef } from 'react';
import { TOOLS, searchTools } from '../data.ts';
import { ActivePage, Tool } from '../types.ts';
import { motion } from 'motion/react';
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
  SpellCheck,
  BookOpen,
  Layers,
  TrendingUp,
  Bell,
  Info
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
  const notifDropdownRef = useRef<HTMLDivElement>(null);

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
      case 'Eraser': return <Eraser className="w-4 h-4 text-indigo-500" />;
      case 'Layers': return <Layers className="w-4 h-4 text-indigo-500" />;
      case 'Type': return <Type className="w-4 h-4 text-amber-500" />;
      case 'Unlock': return <Unlock className="w-4 h-4 text-indigo-500" />;
      case 'Link2': return <Link2 className="w-4 h-4 text-indigo-500" />;
      case 'ArrowUpDown': return <ArrowUpDown className="w-4 h-4 text-emerald-500" />;
      case 'ArrowLeftRight': return <ArrowLeftRight className="w-4 h-4 text-indigo-500" />;
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

          {/* Search bar - Middle area */}
          <div className="hidden md:flex flex-1 max-w-md relative" ref={searchDropdownRef}>
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search word count, convert case, space remover..."
                className="w-full pl-10 pr-4 py-2 border rounded-full text-sm outline-none bg-slate-50 border-slate-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:focus:bg-slate-950 dark:focus:border-indigo-400 transition-all duration-200"
                id="search-input-desktop"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dropdown with search results */}
            {isSearchFocused && searchQuery.trim() !== '' && (
              <div 
                className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden max-h-[300px] flex flex-col z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                id="navbar-search-dropdown"
              >
                {/* Header */}
                <div className="px-5 py-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20 shrink-0 select-none">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                    <span>Suggestions for "{searchQuery}"</span>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-500 dark:text-slate-400">
                    {filteredTools.length} found
                  </span>
                </div>

                {/* Scrollable list of matches */}
                <div className="flex-1 overflow-y-auto p-1.5 flex flex-col gap-1 min-h-0 [scrollbar-width:thin]">
                  {filteredTools.length > 0 ? (
                    filteredTools.slice(0, 5).map((tool, idx) => {
                      const isActive = idx === activeSearchIndex;
                      return (
                        <div
                          key={tool.id}
                          onClick={() => handleToolSelect(tool.id)}
                          className={`flex items-start gap-3.5 p-2.5 rounded-xl cursor-pointer group transition-all duration-150 text-left border ${
                            isActive
                              ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-950 dark:text-white dark:bg-indigo-500/15'
                              : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/60'
                          }`}
                          id={`search-result-${tool.id}`}
                        >
                          <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors shrink-0 ${
                            isActive ? 'bg-white/80 dark:bg-slate-950/80 text-indigo-600 dark:text-indigo-400' : ''
                          }`}>
                            {getToolIcon(tool.iconName)}
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
                {filteredTools.length > 5 && (
                  <div 
                    onClick={() => {
                      handleLinkSelect('home');
                      setIsSearchFocused(false);
                    }}
                    className={`px-4 py-2 text-xs font-semibold text-center border-t border-slate-100 dark:border-slate-800/60 cursor-pointer transition-all shrink-0 hover:bg-slate-50/80 dark:hover:bg-slate-900/50 ${
                      activeSearchIndex === 5
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-450 font-bold'
                        : 'text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300'
                    }`}
                  >
                    View All {filteredTools.length} Results &rarr;
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden md:flex items-center gap-1.5 relative">
            {(['home', 'about', 'contact'] as const).map((page) => {
              const isActive = activePage === page;
              const labels = { home: 'Home', about: 'About', contact: 'Contact' };
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

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notification Bell */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                id="notification-bell-btn"
                onClick={handleToggleNotifications}
                className="relative p-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                title="Recent Updates"
                aria-label="Open notifications center"
                aria-expanded={isNotifOpen}
              >
                <Bell className="w-4.5 h-4.5 text-slate-600 dark:text-slate-350" />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                )}
              </button>

              {/* Notification Dropdown Menu */}
              {isNotifOpen && (
                <div 
                  className="fixed top-16 left-4 right-4 md:absolute md:top-full md:right-0 md:left-auto mt-2 w-auto md:w-96 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  id="notifications-dropdown-menu"
                >
                  {/* Header */}
                  <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="font-sans font-extrabold text-sm text-slate-900 dark:text-white">
                        Updates & Features
                      </span>
                      {hasUnread && (
                        <span className="bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      v1.4.0
                    </span>
                  </div>

                  {/* Body List */}
                  <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1">
                    {updates.length > 0 ? (
                      [...updates]
                        .sort((a, b) => b.date.localeCompare(a.date))
                        .map((update) => {
                          return (
                            <div 
                              key={update.id}
                              className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-xl transition duration-150 flex flex-col border border-transparent hover:border-slate-100 dark:hover:border-slate-850"
                            >
                              <div className="flex items-center justify-between gap-2.5">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-extrabold select-none ${
                                  update.category === 'New Tool' 
                                    ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-900/20'
                                    : update.category === 'Feature Update'
                                    ? 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/20'
                                    : update.category === 'Improvement'
                                    ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100/30 dark:border-amber-900/20'
                                }`}>
                                  {update.category}
                                </span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-550 font-mono">
                                  {update.date}
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-2 font-sans text-left">
                                {update.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-sans text-left">
                                {update.description}
                              </p>
                            </div>
                          );
                        })
                    ) : (
                      <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-600">
                        <Info className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                        <p className="font-sans">No recent updates</p>
                      </div>
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
              {darkMode ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-600" />}
            </button>

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
                              ? 'bg-slate-100 dark:bg-slate-850 text-indigo-650 dark:text-indigo-400 font-semibold' 
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
              onClick={() => handleLinkSelect('about')}
              className={`w-full text-left py-2 px-3.5 rounded-xl text-sm ${activePage === 'about' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              id="mobile-nav-about"
            >
              About
            </button>
            <button
              onClick={() => handleLinkSelect('contact')}
              className={`w-full text-left py-2 px-3.5 rounded-xl text-sm ${activePage === 'contact' ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              id="mobile-nav-contact"
            >
              Contact
            </button>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-wrap gap-2 text-xs text-slate-400">
            <button onClick={() => handleLinkSelect('privacy')} className="hover:underline">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => handleLinkSelect('terms')} className="hover:underline">Terms of Service</button>
          </div>
        </div>
      )}
    </header>
  );
}
