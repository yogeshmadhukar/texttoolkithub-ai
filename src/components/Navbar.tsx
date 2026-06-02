import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data.ts';
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
  ArrowLeftRight
} from 'lucide-react';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({ activePage, onNavigate, darkMode, onToggleDarkMode }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Filter tools based on search query
  const filteredTools = searchQuery.trim() === '' 
    ? [] 
    : TOOLS.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map icon name to Lucide components
  const getToolIcon = (name: string) => {
    switch (name) {
      case 'FileText': return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'Hash': return <Hash className="w-4 h-4 text-emerald-500" />;
      case 'Unwrap': return <AlignLeft className="w-4 h-4 text-indigo-500" />;
      case 'Eraser': return <Eraser className="w-4 h-4 text-indigo-500" />;
      case 'Type': return <Type className="w-4 h-4 text-amber-500" />;
      case 'Unlock': return <Unlock className="w-4 h-4 text-indigo-505 text-indigo-500" />;
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
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-100 dark:shadow-none overflow-hidden max-h-80 overflow-y-auto z-50">
                <div className="px-4 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Direct Matching Tools
                </div>
                {filteredTools.length > 0 ? (
                  <div className="p-1.5">
                    {filteredTools.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => handleToolSelect(tool.id)}
                        className="flex items-start gap-3 p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer group transition-colors duration-150"
                        id={`search-result-${tool.id}`}
                      >
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-950 transition-colors duration-150">
                          {getToolIcon(tool.iconName)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-150">
                            {tool.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                            {tool.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    No tools found for "{searchQuery}"
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
              <div className="mt-2 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl max-h-52 overflow-y-auto p-1">
                {filteredTools.length > 0 ? (
                  filteredTools.map((tool) => (
                    <div
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className="flex items-center gap-2 p-2.5 hover:bg-white dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                    >
                      {getToolIcon(tool.iconName)}
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{tool.title}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-xs text-center text-slate-500">No tools found</div>
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
