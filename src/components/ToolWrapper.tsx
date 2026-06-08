import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { Tool, ToolCategory } from '../types.ts';
import { motion } from 'motion/react';
import { analytics } from '../lib/analytics.ts';

import { 
  FileText, 
  Hash, 
  AlignLeft, 
  Eraser, 
  Type, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Undo, 
  Eye, 
  EyeOff, 
  HelpCircle,
  Clock,
  Menu,
  ChevronRight,
  BookmarkCheck,
  Flame,
  Globe,
  ShieldCheck,
  SlidersHorizontal,
  Unlock,
  Link2,
  ArrowUpDown,
  ArrowLeftRight,
  Pilcrow,
  Smile,
  List
} from 'lucide-react';

interface ToolWrapperProps {
  toolId: string;
  onNavigateHome: () => void;
  onNavigateToTool: (id: string) => void;
}

export default function ToolWrapper({ toolId, onNavigateHome, onNavigateToTool }: ToolWrapperProps) {
  const tool = TOOLS.find(t => t.id === toolId);

  // Search if tool does not exist
  if (!tool) {
    return (
      <div className="py-24 text-center">
        <h2 className="text-xl font-bold">Tool could not be located.</h2>
        <button onClick={onNavigateHome} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded">
          Return Home
        </button>
      </div>
    );
  }

  // Text inputs & state control
  const [text, setText] = useState('');
  const [history, setHistory] = useState<string>(''); // Single step restore undo history
  const [copied, setCopied] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);

  // Tool specific configuration options
  // Remove line breaks options
  const [lbReplacement, setLbReplacement] = useState<'space' | 'custom'>('space');
  const [lbCustomSeparator, setLbCustomSeparator] = useState(', ');
  const [lbPreserveParagraphs, setLbPreserveParagraphs] = useState(true);

  // Remove spacing options
  const [rsTrimSides, setRsTrimSides] = useState(true);
  const [rsDoubleSpaces, setRsDoubleSpaces] = useState(true);
  const [rsRemoveTabs, setRsRemoveTabs] = useState(true);
  const [rsBlankLines, setRsBlankLines] = useState(true);

  // Save changes to history (whenever text changes we can backup for undo if needed, 
  // but let's update simple single step history when user clicks transform) or basic guard.
  const handleTextChange = (val: string) => {
    setText(val);
  };

  const handleUndo = () => {
    if (history !== null) {
      const current = text;
      setText(history);
      setHistory(current); // swap
    }
  };

  // Helper actions
  const handleClear = () => {
    setHistory(text);
    setText('');
    try {
      analytics.trackClearWorkspace(tool.id);
    } catch (e) {
      console.warn("Failed analytics track clear workspace:", e);
    }
  };

  const handleLoadSample = () => {
    setHistory(text);
    let sample = '';
    switch (tool.id) {
      case 'word-counter':
        sample = `TextToolkitHub is an elite text formatter. The quick brown fox jumps over the lazy dog. 

Writing blog drafts or corporate press articles can be stressful when characters are limited. This offline-first utility reads your paragraph structure, estimates standard reading speed benchmarks, and isolates keywords instantly. No data ever runs on databases! Enjoy your writing workflow.`;
        break;
      case 'character-counter':
        sample = `Designing stunning layout cards with pure Tailwind CSS variables. "Good design comes from intentional pairings – not defaults." Set precise post lengths for Twitter and LinkedIn easily.`;
        break;
      case 'remove-line-breaks':
        sample = `This is a simulated OCR scan text\nthat has messy PDF newline break points.\nBy copying this segment,\nyou can easily bridge blocks\ntogether.\n\nHere is a second independent paragraph\nthat should be preserved as a multi-line format block\nif you toggle our paragraph protection checker.`;
        break;
      case 'remove-extra-spaces':
        sample = `   Messy    drafts   with    excessive    spacing, \t\t tabs that break text margins,    \n\n   and unwanted empty paragraphs.      `;
        break;
      case 'case-converter':
        sample = `the rapid innovation cycles of AI platforms. explore kebab-case and snake_case models!`;
        break;
    }
    setText(sample);
  };

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track interactive copy actions
      try {
        analytics.trackCopyToClipboard(tool.id, text.length);
      } catch (ee) {
        console.warn("Failed analytics track copy event:", ee);
      }
    } catch (err) {
      console.warn('Unable to copy text: ', err);
    }
  };

  const handleDownload = () => {
    if (!text) return;
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(file);
    element.href = url;
    element.download = `${tool.id}_export.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
  };

  // Live transformations & calculators
  // 1. Word counter calculators
  const getWordCounterMetrics = () => {
    const trimmed = text.trim();
    const words = trimmed === '' ? [] : trimmed.toLowerCase().split(/\s+/).filter(w => w.length > 0);
    const sentences = text === '' ? [] : text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text === '' ? [] : text.split(/\n+/).filter(p => p.trim().length > 0);
    
    // Keyword density calculator
    const commonStopWords = new Set(['the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'to', 'in', 'of', 'for', 'it', 'with', 'this', 'that', 'by', 'as', 'are', 'be', 'or', 'your', 'our']);
    const frequencies: { [key: string]: number } = {};
    words.forEach(word => {
      // Clean word from trailing punctuation
      const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "").trim();
      if (cleanWord.length > 1 && !commonStopWords.has(cleanWord)) {
        frequencies[cleanWord] = (frequencies[cleanWord] || 0) + 1;
      }
    });
    
    const densityList = Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const wCount = words.length;
    // Estimate reading time (average 225 words per minute)
    const readTimeMin = Math.ceil(wCount / 225);

    return {
      words: wCount,
      charactersWithSpaces: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      sentences: sentences.length,
      paragraphs: paragraphs.length,
      readTimeMin,
      avgWordLength: wCount === 0 ? 0 : parseFloat((text.replace(/\s/g, '').length / wCount).toFixed(1)),
      keywordDensity: densityList,
    };
  };

  // 2. Character counter calculators
  const getCharacterCounterMetrics = () => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).filter(w => w.length > 0).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const tabs = (text.match(/\t/g) || []).length;
    const byteSize = new Blob([text]).size;

    return {
      chars,
      charsNoSpaces,
      words,
      lines,
      tabs,
      byteSize,
    };
  };

  // 3. Transformations for Remove Line Breaks
  const runRemoveLineBreaks = () => {
    setHistory(text);
    let output = '';
    const separator = lbReplacement === 'space' ? ' ' : lbCustomSeparator;
    
    if (lbPreserveParagraphs) {
      // Split into paragraphs (defined as consecutive line breaks)
      const paragraphs = text.split(/\n\s*\n+/);
      const processedParagraphs = paragraphs.map(p => {
        // Flatten single newlines within the paragraph
        return p.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0).join(separator);
      });
      output = processedParagraphs.join('\n\n');
    } else {
      // Flatten everything entirely
      output = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0).join(separator);
    }
    setText(output);
  };

  // 4. Transformations for Remove Extra Spaces
  const runRemoveExtraSpaces = () => {
    setHistory(text);
    let output = text;

    if (rsRemoveTabs) {
      output = output.replace(/\t/g, ' ');
    }
    if (rsDoubleSpaces) {
      output = output.replace(/ {2,}/g, ' ');
    }
    if (rsBlankLines) {
      // Strip lines that only have white spacing
      output = output.split(/\r?\n/).filter(line => line.trim() !== '').join('\n');
    }
    if (rsTrimSides) {
      output = output.split(/\r?\n/).map(line => line.trim()).join('\n').trim();
    }
    
    setText(output);
  };

  // 5. Casing conversions
  const runCaseConversion = (mode: 'upper' | 'lower' | 'title' | 'sentence' | 'camel' | 'snake' | 'kebab' | 'alternating' | 'inverse') => {
    setHistory(text);
    let result = '';

    switch (mode) {
      case 'upper':
        result = text.toUpperCase();
        break;
      case 'lower':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
        break;
      case 'sentence':
        // Capitalize trailing marks
        result = text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\w)/g, c => c.toUpperCase());
        break;
      case 'camel':
        // camelCase
        const cleanWordsCamel = text.trim().toLowerCase().split(/[\s_\-]+/);
        result = cleanWordsCamel.map((w, i) => i === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
        break;
      case 'snake':
        // snake_case
        result = text.trim().toLowerCase().replace(/[\s\-]+/g, '_');
        break;
      case 'kebab':
        // kebab-case
        result = text.trim().toLowerCase().replace(/[\s_]+/g, '-');
        break;
      case 'alternating':
        result = text.split('').map((char, index) => index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
        break;
      case 'inverse':
        result = text.split('').map(char => {
          if (char === char.toUpperCase()) return char.toLowerCase();
          return char.toUpperCase();
        }).join('');
        break;
    }
    setText(result);
  };

  // Related Tools Recommendation List
  const relatedTools = TOOLS.filter(t => t.id !== toolId).slice(0, 3);

  // Icon mapping
  const getToolIconElement = (name: string, sizeClass = "w-5 h-5") => {
    switch (name) {
      case 'FileText': return <FileText className={`${sizeClass} text-emerald-500`} />;
      case 'Hash': return <Hash className={`${sizeClass} text-emerald-500`} />;
      case 'Unwrap': return <AlignLeft className={`${sizeClass} text-indigo-500`} />;
      case 'Eraser': return <Eraser className={`${sizeClass} text-indigo-500`} />;
      case 'Type': return <Type className={`${sizeClass} text-amber-500`} />;
      case 'Unlock': return <Unlock className={`${sizeClass} text-indigo-500`} />;
      case 'Link2': return <Link2 className={`${sizeClass} text-indigo-500`} />;
      case 'ArrowUpDown': return <ArrowUpDown className={`${sizeClass} text-emerald-500`} />;
      case 'ArrowLeftRight': return <ArrowLeftRight className={`${sizeClass} text-indigo-500`} />;
      case 'Pilcrow': return <Pilcrow className={`${sizeClass} text-indigo-500`} />;
      case 'Smile': return <Smile className={`${sizeClass} text-indigo-500`} />;
      case 'List': return <List className={`${sizeClass} text-indigo-500`} />;
      default: return <FileText className={`${sizeClass} text-indigo-500`} />;
    }
  };

  // Word counter metrics computation
  const wordMetrics = getWordCounterMetrics();
  // Character counter metrics computation
  const charMetrics = getCharacterCounterMetrics();

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id={`tool-wrapper-${tool.id}`}>
      
      {/* Decorative Glow background */}
      <div className="glow-accent top-10 right-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-xs font-bold font-sans text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            id="breadcrumb-home-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <button 
            onClick={onNavigateHome}
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer capitalize"
            id="breadcrumb-category-btn"
          >
            {tool.category}s
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{tool.title}</span>
        </div>

        {/* Head Block */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                {getToolIconElement(tool.iconName, "w-7 h-7")}
              </span>
              {tool.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              {tool.description}
            </p>
          </div>

          {/* Simulated SEO Tags Dropdown Trigger Button */}
          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800/80 transition shadow-inner"
            id="seo-drawer-toggle"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Collapse SEO Preview' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Mock/Simulated Google Snippet Visualizer */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800/80 rounded-2xl bg-indigo-50/20 dark:bg-slate-950/40 p-5 mb-8 overflow-hidden animate-in fade-in duration-200"
            id="seo-meta-tag-panel"
          >
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Real Search Engine Snippet Preview
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-1.5">
                <span className="w-2.5 h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full inline-block"></span>
                https://texttoolkithub.com/{tool.id}
              </div>
              <h3 className="text-lg md:text-xl font-medium text-blue-800 dark:text-blue-400 hover:underline leading-snug cursor-pointer font-sans">
                {tool.seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans mt-1">
                {tool.seoDescription}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-slate-100/50 dark:bg-slate-900/30 p-3.5 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
              <div>
                <dt className="text-[10px] font-bold uppercase text-slate-400">Keywords Map</dt>
                <dd className="flex flex-wrap gap-1.5 mt-1">
                  {tool.keywords.map((key) => (
                    <span key={key} className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {key}
                    </span>
                  ))}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold uppercase text-slate-400">Security Standard</dt>
                <dd className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  ✓ sandboxed-iframe-offline-safe
                </dd>
              </div>
            </div>
          </motion.div>
        )}

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* LEFT PANEL: Text Area & Controls (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            
            {/* Options configuration block (conditionally visible per tool) */}
            
            {/* Tool 3: Line Breaks configuration */}
            {tool.id === 'remove-line-breaks' && (
              <div className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/25 dark:bg-slate-950 p-4" id="config-remove-breaks">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
                  <AlignLeft className="w-4 h-4" /> Reformatting Variables
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Replacements inputs */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Replace Breaks With:</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setLbReplacement('space')}
                        className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold ${lbReplacement === 'space' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800 dark:text-slate-300'}`}
                      >
                        Single Space
                      </button>
                      <button 
                        onClick={() => setLbReplacement('custom')}
                        className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-semibold ${lbReplacement === 'custom' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 text-slate-600 border-slate-200 dark:border-slate-800 dark:text-slate-300'}`}
                      >
                        Custom Separator
                      </button>
                    </div>
                  </div>

                  {/* Character delimiter input */}
                  {lbReplacement === 'custom' ? (
                    <div>
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">Custom Sep / Delimiter:</label>
                      <input 
                        type="text" 
                        value={lbCustomSeparator}
                        onChange={(e) => setLbCustomSeparator(e.target.value)}
                        placeholder="e.g. , or ; or |"
                        className="w-full py-1 px-3 border border-slate-200 text-slate-800 bg-white rounded-xl text-xs dark:bg-slate-900 dark:border-slate-850 dark:text-slate-200 outline-none focus:border-indigo-500"
                      />
                    </div>
                  ) : <div />}
                </div>

                <div className="mt-4 pt-4 border-t border-indigo-100/50 dark:border-slate-800/50 flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="preserve-paragraphs"
                    checked={lbPreserveParagraphs}
                    onChange={(e) => setLbPreserveParagraphs(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 dark:border-slate-800 dark:bg-slate-900"
                  />
                  <label htmlFor="preserve-paragraphs" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                    Preserve Paragraph Breaks (Double Enter keys remain untouched)
                  </label>
                </div>
              </div>
            )}

            {/* Tool 4: Spacing configuration */}
            {tool.id === 'remove-extra-spaces' && (
              <div className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/25 dark:bg-slate-950 p-4" id="config-remove-spaces">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
                  <Eraser className="w-4 h-4" /> Spacing Configuration Setup
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="clean-double"
                      checked={rsDoubleSpaces}
                      onChange={(e) => setRsDoubleSpaces(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 dark:border-slate-800 dark:bg-slate-900"
                    />
                    <label htmlFor="clean-double" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      Convert Multiple Consecutive Spaces to Single Space
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="clean-tabs"
                      checked={rsRemoveTabs}
                      onChange={(e) => setRsRemoveTabs(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 dark:border-slate-800 dark:bg-slate-900"
                    />
                    <label htmlFor="clean-tabs" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      Erase or Space out Horizonal Tabs (\t)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="clean-trim"
                      checked={rsTrimSides}
                      onChange={(e) => setRsTrimSides(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 dark:border-slate-800 dark:bg-slate-900"
                    />
                    <label htmlFor="clean-trim" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      Trim margins (Remove Leading & Trailing line spacing)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="clean-blank"
                      checked={rsBlankLines}
                      onChange={(e) => setRsBlankLines(e.target.checked)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-0 dark:border-slate-800 dark:bg-slate-900"
                    />
                    <label htmlFor="clean-blank" className="text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                      Purge empty lines (Strip lines containing 0 characters)
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Input Desk */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm shadow-slate-100 dark:shadow-none flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-200">
              
              {/* Textarea header ribbon */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <SlidersHorizontal className="w-4 h-4 text-slate-300" /> Dynamic workspace
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleLoadSample}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    id="sample-text-btn"
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Load Sample
                  </button>
                </div>
              </div>

              {/* Real textarea */}
              <textarea
                value={text}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Insert or paste your text content here..."
                className="w-full p-5 min-h-[280px] md:min-h-[385px] border-0 outline-none text-sm sm:text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="main-toolkit-textarea"
              />

              {/* Status footer inside textarea container */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-850 flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* Instant text status helper */}
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 font-medium">
                  <span>Words: <strong className="font-semibold text-slate-800 dark:text-slate-200">{charMetrics.words}</strong></span>
                  <span>Chars: <strong className="font-semibold text-slate-800 dark:text-slate-200">{charMetrics.chars}</strong></span>
                  {text && (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                      ● Active Computation
                    </span>
                  )}
                </div>

                {/* Operations Toolbar */}
                <div className="flex items-center gap-1.5">
                  
                  {/* Restore Undo */}
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white rounded-xl flex items-center gap-1 transition"
                      title="Undo last action"
                      id="undo-action-btn"
                    >
                      <Undo className="w-3.5 h-3.5" /> Undo
                    </button>
                  )}

                  {/* Clear */}
                  <button
                    onClick={handleClear}
                    disabled={!text}
                    className="p-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-500"
                    title="Clear content text scale"
                    id="clear-action-btn"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear
                  </button>

                  {/* Copy */}
                  <button
                    onClick={handleCopy}
                    disabled={!text}
                    className={`p-2 rounded-xl flex items-center gap-1 text-xs font-bold transition disabled:opacity-40 ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'border border-slate-200 dark:border-slate-800 bg-white hover:bg-indigo-50 text-slate-700 dark:bg-slate-900 dark:hover:bg-indigo-950/20 dark:text-slate-200'}`}
                    id="copy-action-btn"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                  
                  {/* Save Draft/Download */}
                  <button
                    onClick={handleDownload}
                    disabled={!text}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 text-slate-700 dark:text-slate-200 transition disabled:opacity-40"
                    title="Export as Text file"
                    id="download-action-btn"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                </div>

              </div>

            </div>

            {/* ACTION TRIGGERS (Specific custom action panels depending on tool item) */}
            
            {/* Tool 3 Action Button */}
            {tool.id === 'remove-line-breaks' && (
              <button
                onClick={runRemoveLineBreaks}
                disabled={!text}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99] transition disabled:opacity-50"
                id="run-remove-breaks-btn"
              >
                Flatten Paragraph Wrap Lines Now
              </button>
            )}

            {/* Tool 4 Action Button */}
            {tool.id === 'remove-extra-spaces' && (
              <button
                onClick={runRemoveExtraSpaces}
                disabled={!text}
                className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold rounded-2xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 active:scale-[0.99] transition disabled:opacity-50"
                id="run-remove-spaces-btn"
              >
                Perform Whitespace Sanitization Cleanup
              </button>
            )}

            {/* Tool 5 case converter button matrix */}
            {tool.id === 'case-converter' && (
              <div className="border border-indigo-100 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-950 p-5 mt-2" id="casing-action-grid">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-4 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-amber-500" /> Capitalization Transformation Formats
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button 
                    onClick={() => runCaseConversion('upper')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700"
                    id="case-btn-upper"
                  >
                    UPPERCASE
                  </button>
                  <button 
                    onClick={() => runCaseConversion('lower')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-700"
                    id="case-btn-lower"
                  >
                    lowercase
                  </button>
                  <button 
                    onClick={() => runCaseConversion('title')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40"
                    id="case-btn-title"
                  >
                    Title Case
                  </button>
                  <button 
                    onClick={() => runCaseConversion('sentence')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40"
                    id="case-btn-sentence"
                  >
                    Sentence case
                  </button>
                  <button 
                    onClick={() => runCaseConversion('camel')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono font-semibold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40"
                    id="case-btn-camel"
                  >
                    camelCase
                  </button>
                  <button 
                    onClick={() => runCaseConversion('snake')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono font-semibold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40"
                    id="case-btn-snake"
                  >
                    snake_case
                  </button>
                  <button 
                    onClick={() => runCaseConversion('kebab')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-mono font-semibold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40"
                    id="case-btn-kebab"
                  >
                    kebab-case
                  </button>
                  <button 
                    onClick={() => runCaseConversion('alternating')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40"
                    id="case-btn-alternating"
                  >
                    aLtErNaTiNg
                  </button>
                  <button 
                    onClick={() => runCaseConversion('inverse')} 
                    disabled={!text}
                    className="py-3 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 transition disabled:opacity-40"
                    id="case-btn-inverse"
                  >
                    iNvErSe CaSe
                  </button>
                </div>
              </div>
            )}

            {/* Extra documentation helper card strictly for the active tool */}
            <div className="border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950 p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookmarkCheck className="w-5 h-5 text-indigo-500" /> How to use this Toolkit
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {tool.longDescription} Paste your character block inside the workspace textarea, verify metrics dynamically inside the live output containers on the right side-rail, and export elements instantly to your documents framework.
              </p>
            </div>

          </div>

          {/* RIGHT PANEL: Live Results & Counters (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6" id="tool-right-rail-counters">
            
            {/* Conditional Results 1: Word Counter Panel */}
            {tool.id === 'word-counter' && (
              <div className="flex flex-col gap-5 border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950 p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-emerald-500" /> Live Metrics Dashboard
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <dt className="text-[10px] uppercase font-bold text-slate-400">Total Words</dt>
                    <dd className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1">{wordMetrics.words}</dd>
                  </div>
                  <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <dt className="text-[10px] uppercase font-bold text-slate-400">Characters</dt>
                    <dd className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 font-mono mt-1">{wordMetrics.charactersWithSpaces}</dd>
                  </div>
                  <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <dt className="text-[10px] uppercase font-bold text-slate-400 font-sans">Sentences</dt>
                    <dd className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono mt-1">{wordMetrics.sentences}</dd>
                  </div>
                  <div className="bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <dt className="text-[10px] uppercase font-bold text-slate-400">Paragraphs</dt>
                    <dd className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono mt-1">{wordMetrics.paragraphs}</dd>
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-850 pt-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Est. Reading Time</span>
                    <strong className="text-slate-800 dark:text-slate-200">~ {wordMetrics.readTimeMin} min</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                    <span>Average Word Length</span>
                    <strong className="text-slate-800 dark:text-slate-200 font-mono">{wordMetrics.avgWordLength} chars</strong>
                  </div>
                </div>

                {/* Keyword density module */}
                {wordMetrics.keywordDensity.length > 0 && (
                  <div className="border-t border-slate-200 dark:border-slate-850 pt-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Keyword Freq Density</span>
                    <div className="flex flex-col gap-1.5 mt-2.5">
                      {wordMetrics.keywordDensity.map(([word, count]) => {
                        const wordPercent = Math.min(100, Math.round((count / wordMetrics.words) * 100));
                        return (
                          <div key={word} className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-700 dark:text-slate-300">"{word}"</span>
                              <span className="text-indigo-600 dark:text-indigo-400 font-mono">{count}x</span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full" style={{ width: `${Math.max(15, wordPercent)}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Conditional Results 2: Character Counter Panel */}
            {tool.id === 'character-counter' && (
              <div className="flex flex-col gap-5 border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950 p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-emerald-500" /> Live character metrics
                </h3>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-850">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Chars (with spaces)</span>
                    <strong className="text-lg font-bold text-slate-900 dark:text-white font-mono">{charMetrics.chars}</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-850">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Chars (no spaces)</span>
                    <strong className="text-lg font-bold text-slate-900 dark:text-white font-mono">{charMetrics.charsNoSpaces}</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-850">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Paragraph Line breaks</span>
                    <strong className="text-lg font-bold text-slate-900 dark:text-white font-mono">{charMetrics.lines}</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-200/50 dark:border-slate-850">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Total Tabs count</span>
                    <strong className="text-lg font-bold text-slate-900 dark:text-white font-mono">{charMetrics.tabs}</strong>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Byte Payload size</span>
                    <strong className="text-lg font-bold text-slate-900 dark:text-white font-mono">{charMetrics.byteSize} bytes</strong>
                  </div>
                </div>

                {/* Interactive Limit progression checker */}
                <div className="border-t border-slate-200 dark:border-slate-850 pt-4 flex flex-col gap-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Visual Limit check indicators</span>

                  {/* X (formerly Twitter) metric bar: limit 280 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">X Post limit (280 max)</span>
                      <strong className={`${charMetrics.chars > 280 ? 'text-rose-600' : 'text-slate-600 dark:text-slate-400'}`}>{charMetrics.chars}/280</strong>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${charMetrics.chars > 280 ? 'bg-rose-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, (charMetrics.chars / 280) * 100)}%` }}></div>
                    </div>
                  </div>

                  {/* SEO title tag: limit 60 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">SEO Header Title Limit (60 max)</span>
                      <strong className={`${charMetrics.chars > 60 ? 'text-amber-500' : 'text-slate-600 dark:text-slate-400'}`}>{charMetrics.chars}/60</strong>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${charMetrics.chars > 60 ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: `${Math.min(100, (charMetrics.chars / 60) * 100)}%` }}></div>
                    </div>
                  </div>

                  {/* SEO meta description: limit 160 */}
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">SEO Desc Tag Snippet (160 max)</span>
                      <strong className={`${charMetrics.chars > 160 ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}`}>{charMetrics.chars}/160</strong>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${charMetrics.chars > 160 ? 'bg-amber-500' : 'bg-violet-500'}`} style={{ width: `${Math.min(100, (charMetrics.chars / 160) * 100)}%` }}></div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Fallback metrics preview for clean line wraps, spacing removes, and case converters */}
            {tool.id !== 'word-counter' && tool.id !== 'character-counter' && (
              <div className="flex flex-col gap-5 border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950 p-5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-emerald-500" /> Workspace Analytics
                </h3>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Words</span>
                    <strong className="text-xl font-bold font-mono text-indigo-600 mt-1 block">{charMetrics.words}</strong>
                  </div>
                  <div className="bg-white dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-150 dark:border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Characters</span>
                    <strong className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1 block">{charMetrics.chars}</strong>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-850 flex flex-col gap-1">
                  <span>● Double spacial checks: <strong className="text-slate-700 dark:text-slate-300">{(text.match(/ {2,}/g) || []).length} items found</strong></span>
                  <span>● Segment lines: <strong className="text-slate-700 dark:text-slate-300">{charMetrics.lines} blocks</strong></span>
                </div>
              </div>
            )}

            {/* Local Security Badge for complete reliability */}
            <div className="border border-emerald-100 dark:border-emerald-900/45 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 p-5 flex items-start gap-3">
              <div className="p-2 rounded bg-emerald-500 text-white flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Strict Local Isolation</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Your raw texts remain fully isolated on client browser memory variables. Absolutely no networks packet exchanges are trace-routed.
                </p>
              </div>
            </div>

          </div>

        </div>

        {/* RELATED TOOLS SECTION */}
        <section className="border-t border-slate-200 dark:border-slate-800 pt-12 mt-12 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold font-sans tracking-tight text-slate-950 dark:text-white">
                Related Workspace Tools
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Discover alternative utilities to help improve your formatting workflows.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((relTool) => (
              <div
                key={relTool.id}
                onClick={() => {
                  setText('');
                  setHistory('');
                  onNavigateToTool(relTool.id);
                }}
                className="group border border-slate-200 dark:border-slate-850 rounded-2xl p-5 bg-white dark:bg-slate-950 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 cursor-pointer transition-all duration-200"
                id={`rel-tool-${relTool.id}`}
              >
                <div className="flex items-center gap-3.5 mb-3">
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 transition-colors">
                    {getToolIconElement(relTool.iconName, "w-5 h-5")}
                  </div>
                  <h4 className="font-sans font-bold text-sm text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {relTool.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {relTool.description}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
