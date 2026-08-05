import React, { useState, useEffect, useRef } from 'react';
import { TOOLS, searchTools } from '../data.ts';
import { getCleanPath } from '../types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Wrench, 
  Search, 
  BookOpen, 
  Zap, 
  X, 
  Sun, 
  Moon, 
  ChevronRight, 
  Sparkles,
  FileText,
  Type,
  Code,
  QrCode,
  FileJson,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface MobileBottomNavProps {
  activePage: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function MobileBottomNav({
  activePage,
  onNavigate,
  darkMode,
  onToggleDarkMode
}: MobileBottomNavProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when search modal opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isSearchOpen]);

  // Prevent scrolling behind modal when open
  useEffect(() => {
    if (isSearchOpen || isQuickMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen, isQuickMenuOpen]);

  const filteredTools = searchQuery.trim() === '' 
    ? [] 
    : searchTools(searchQuery);

  const topQuickTools = [
    { id: 'tools/word-counter', name: 'Word Counter', icon: FileText, desc: 'Count words & characters' },
    { id: 'tools/case-converter', name: 'Case Converter', icon: Type, desc: 'UPPER, lower, Title Case' },
    { id: 'tools/json-formatter', name: 'JSON Formatter', icon: FileJson, desc: 'Format & validate JSON' },
    { id: 'tools/base64-encoder', name: 'Base64 Encoder', icon: Code, desc: 'Encode & decode strings' },
    { id: 'tools/qr-code-generator', name: 'QR Code Generator', icon: QrCode, desc: 'Create custom QR codes' },
    { id: 'tools/grammar-checker', name: 'Grammar Checker', icon: CheckCircle2, desc: 'Check syntax & spelling' },
  ];

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      setIsSearchOpen(false);
      setIsQuickMenuOpen(false);
      onNavigate(page);
    }
  };

  const isHomeActive = activePage === 'home' || activePage === '';
  const isToolsActive = activePage === 'tools';
  const isGuidesActive = activePage === 'guides';

  return (
    <>
      {/* Persistent Bottom Action Bar (Visible only on touch / small mobile screens < 768px) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1 pb-[calc(0.25rem+env(safe-area-inset-bottom,0px))] transition-colors duration-200"
        aria-label="Mobile Bottom Navigation"
        id="mobile-bottom-nav"
      >
        <div className="flex items-center justify-around max-w-md mx-auto relative">
          
          {/* Item 1: Home */}
          <a
            href={getCleanPath('home')}
            onClick={(e) => handleLinkClick(e, 'home')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
              isHomeActive 
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            id="mobile-nav-home"
            aria-label="Home page"
          >
            <div className="relative">
              <Home className={`w-5 h-5 ${isHomeActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              {isHomeActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" 
                />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Home</span>
          </a>

          {/* Item 2: All Tools Directory */}
          <a
            href={getCleanPath('tools')}
            onClick={(e) => handleLinkClick(e, 'tools')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
              isToolsActive 
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            id="mobile-nav-tools"
            aria-label="All tools directory"
          >
            <div className="relative">
              <Wrench className={`w-5 h-5 ${isToolsActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              {isToolsActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" 
                />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">All Tools</span>
          </a>

          {/* Center Key Action: Search Modal Trigger Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center -mt-4 relative group"
            id="mobile-nav-search-trigger"
            aria-label="Open tool search"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 group-active:scale-95 transition-transform duration-150 ring-4 ring-white dark:ring-slate-900">
              <Search className="w-5 h-5 stroke-[2.2px]" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium text-indigo-600 dark:text-indigo-400">Search</span>
          </button>

          {/* Item 4: Guides */}
          <a
            href={getCleanPath('guides')}
            onClick={(e) => handleLinkClick(e, 'guides')}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
              isGuidesActive 
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            id="mobile-nav-guides"
            aria-label="Guides page"
          >
            <div className="relative">
              <BookOpen className={`w-5 h-5 ${isGuidesActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
              {isGuidesActive && (
                <motion.div 
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-400" 
                />
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">Guides</span>
          </a>

          {/* Item 5: Quick Menu Sheet */}
          <button
            onClick={() => setIsQuickMenuOpen(true)}
            className={`flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-2 py-1 rounded-xl transition-all ${
              isQuickMenuOpen
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
            id="mobile-nav-quick-menu"
            aria-label="Open quick menu"
          >
            <Zap className="w-5 h-5 stroke-[1.8px]" />
            <span className="text-[10px] mt-1 tracking-tight">Quick Suite</span>
          </button>

        </div>
      </nav>

      {/* Full-screen Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/60 backdrop-blur-sm md:hidden">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="mt-auto bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-4 max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-base">
                    Quick Tool Finder
                  </h2>
                </div>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  id="mobile-search-close"
                  aria-label="Close search"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar Input */}
              <div className="mt-3 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 63 text utilities (e.g. Word Counter, JSON)..."
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  id="mobile-search-input"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results or Shortcuts */}
              <div className="mt-4 flex-1 overflow-y-auto space-y-2 max-h-[50vh] pr-1">
                {searchQuery.trim() !== '' ? (
                  filteredTools.length > 0 ? (
                    filteredTools.map((tool) => (
                      <a
                        key={tool.id}
                        href={getCleanPath(tool.id)}
                        onClick={(e) => handleLinkClick(e, tool.id)}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50/60 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {tool.title}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {tool.description}
                          </span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 ml-2" />
                      </a>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
                      No tools found matching "{searchQuery}"
                    </div>
                  )
                ) : (
                  <div>
                    <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                      Popular Utilities
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {topQuickTools.map((tool) => {
                        const ToolIcon = tool.icon;
                        return (
                          <a
                            key={tool.id}
                            href={getCleanPath(tool.id)}
                            onClick={(e) => handleLinkClick(e, tool.id)}
                            className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/40 dark:hover:bg-slate-800/80 transition-all text-left"
                          >
                            <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                              <ToolIcon className="w-4 h-4" />
                            </div>
                            <div className="overflow-hidden">
                              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                                {tool.name}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                {tool.desc}
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* View All Button */}
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={getCleanPath('tools')}
                  onClick={(e) => handleLinkClick(e, 'tools')}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  Browse All 63 Text Tools
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Suite Menu Drawer Overlay */}
      <AnimatePresence>
        {isQuickMenuOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/60 backdrop-blur-sm md:hidden">
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="mt-auto bg-white dark:bg-slate-900 rounded-t-3xl border-t border-slate-200 dark:border-slate-800 p-4 max-h-[80vh] flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="font-semibold text-slate-900 dark:text-white text-base">
                    Quick Access & Settings
                  </h2>
                </div>
                <button
                  onClick={() => setIsQuickMenuOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  id="mobile-quick-menu-close"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Theme Toggle Option */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-100 dark:bg-slate-700 text-amber-600 dark:text-amber-300">
                    {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">
                      {darkMode ? 'Dark Theme' : 'Light Theme'}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      Toggle contrast display
                    </div>
                  </div>
                </div>
                <button
                  onClick={onToggleDarkMode}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  id="mobile-theme-toggle"
                >
                  Switch
                </button>
              </div>

              {/* Navigation Shortcuts */}
              <div className="mt-4 space-y-1">
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Navigation Shortcuts
                </div>
                {[
                  { page: 'home', label: 'Home Page' },
                  { page: 'tools', label: 'All Tools Directory' },
                  { page: 'guides', label: 'Educational Guides' },
                  { page: 'about', label: 'About Platform' },
                  { page: 'faq', label: 'FAQ' },
                  { page: 'privacy', label: 'Privacy Policy' },
                  { page: 'contact', label: 'Contact Support' },
                ].map((item) => (
                  <a
                    key={item.page}
                    href={getCleanPath(item.page)}
                    onClick={(e) => handleLinkClick(e, item.page)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                ))}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
