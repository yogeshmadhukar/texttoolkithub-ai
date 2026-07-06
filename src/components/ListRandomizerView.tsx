import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shuffle, 
  Dice5,
  Trash2, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  Sliders,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  List,
  Search,
  CheckCircle,
  FileText,
  AlertTriangle,
  Award
} from 'lucide-react';

interface ListRandomizerViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

const TEMPLATES = [
  { name: '10 English Names', data: "Oliver\nEmma\nLiam\nSophia\nNoah\nIsabella\nJames\nMia\nElijah\nHarper" },
  { name: 'Numbered List (1 to 20)', data: Array.from({length: 20}, (_, i) => `Item #${i+1}`).join('\n') },
  { name: 'Coin Flip Options', data: "Heads\nTails" },
  { name: 'Dice Roll Standard', data: "1 (One)\n2 (Two)\n3 (Three)\n4 (Four)\n5 (Five)\n6 (Six)" },
];

export default function ListRandomizerView({ onNavigateToTool, onNavigateHome }: ListRandomizerViewProps) {
  const [rawInput, setRawInput] = useState("Apple\nBanana\nCherry\nDate\nElderberry\nFig\nGrape\nHoneydew\nKiwi\nLemon");
  const [items, setItems] = useState<string[]>([]);
  const [outputItems, setOutputItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [delimiter, setDelimiter] = useState<'line' | 'comma' | 'semicolon'>('line');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Formatting configs
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [enableNumbering, setEnableNumbering] = useState(false);

  // Raffle Draw Winner Configs
  const [drawSize, setDrawSize] = useState(1);
  const [allowDuplicatesInDraw, setAllowDuplicatesInDraw] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnWinners, setDrawnWinners] = useState<string[]>([]);
  const [tickerItem, setTickerItem] = useState('');
  const [showDrawModal, setShowDrawModal] = useState(false);

  // Confetti particles for offline drawer celebrations
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; delay: number }>>([]);

  const seoTitle = "List Randomizer Online | Name Picker & List Shuffler";
  const seoDescription = "Shuffle lists, sort text rows, clean empty lines, and pick random name raffle winners instantly. A powerful offline-first toolkit for giveaways, content, and data sets.";

  const faqs = [
    {
      id: 1,
      question: "What is the List Randomizer tool?",
      answer: "It is an offline-first list processing and shuffling tool. It allows you to randomize lists, sort entries alphabetically, clear duplicates, add prefixes/suffixes, and pick random winners instantly from your browser sandbox."
    },
    {
      id: 2,
      question: "How does the Raffle Draw Picker work?",
      answer: "When you click 'Draw Winners', the engine runs a high-speed slot-machine ticker simulation, cycling through candidate names for 2.5 seconds. Once finished, it locks in the mathematically random selection, triggers an offline celebration, and presents the winner card."
    },
    {
      id: 3,
      question: "Are my list items uploaded to any server?",
      answer: "No. Your privacy is fully secured. The entire sorting, shuffling, filtering, and winner-selection pipelines run exclusively inside your browser's local memory. No databases or external API services receive your data."
    },
    {
      id: 4,
      question: "Can I use custom delimiter separators for my data lists?",
      answer: "Yes. By default, the tool treats each line break as a separate list item. However, you can toggle the delimiter setting to automatically split your lists using commas or semicolons."
    }
  ];

  // Parse items from raw text
  useEffect(() => {
    let splitChar = '\n';
    if (delimiter === 'comma') splitChar = ',';
    if (delimiter === 'semicolon') splitChar = ';';

    const parsed = rawInput
      .split(splitChar)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    setItems(parsed);
    // Keep output items in sync if empty, otherwise let actions control it
    if (outputItems.length === 0 && parsed.length > 0) {
      setOutputItems(parsed);
    }
  }, [rawInput, delimiter]);

  // Sync document metadata
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

    const scriptId = "list-randomizer-json-ld";
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
      const tag = document.getElementById(scriptId);
      if (tag) tag.remove();
    };
  }, []);

  // Shuffle Action
  const handleShuffle = () => {
    if (items.length === 0) return;
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setOutputItems(shuffled);
  };

  // Sort Alphabetically
  const handleSortAZ = () => {
    const sorted = [...items].sort((a, b) => a.localeCompare(b));
    setOutputItems(sorted);
  };

  const handleSortZA = () => {
    const sorted = [...items].sort((a, b) => b.localeCompare(a));
    setOutputItems(sorted);
  };

  const handleSortLength = () => {
    const sorted = [...items].sort((a, b) => a.length - b.length);
    setOutputItems(sorted);
  };

  // Clear Duplicates (Deduplicate)
  const handleDeduplicate = () => {
    const uniques = Array.from(new Set(items));
    setOutputItems(uniques);
    // Sync back to raw input to keep unified
    setRawInput(uniques.join(delimiter === 'line' ? '\n' : delimiter === 'comma' ? ', ' : '; '));
  };

  // Trim Spaces and Clean
  const handleCleanSpaces = () => {
    const cleaned = items.map(item => item.trim()).filter(item => item.length > 0);
    setOutputItems(cleaned);
    setRawInput(cleaned.join(delimiter === 'line' ? '\n' : delimiter === 'comma' ? ', ' : '; '));
  };

  // Reverse Output List
  const handleReverse = () => {
    const reversed = [...outputItems].reverse();
    setOutputItems(reversed);
  };

  // Pick Raffle Winner with Simulated Rolling Ticker
  const triggerWinnerDraw = () => {
    if (items.length === 0) return;
    
    // Validate draw limits
    const actualDrawSize = Math.max(1, Math.min(drawSize, items.length));
    setIsDrawing(true);
    setDrawnWinners([]);
    setShowDrawModal(true);

    // Setup animated fast ticking sequence
    let tickCount = 0;
    const totalTicks = 24;
    const tickInterval = 90; // ms

    const timer = setInterval(() => {
      // Pick a random candidates for the live slot ticker look
      const randomIndex = Math.floor(Math.random() * items.length);
      setTickerItem(items[randomIndex]);
      tickCount++;

      if (tickCount >= totalTicks) {
        clearInterval(timer);
        
        // Compute final actual winners
        const winners: string[] = [];
        const availablePool = [...items];

        for (let i = 0; i < actualDrawSize; i++) {
          if (availablePool.length === 0) break;
          const winnerIdx = Math.floor(Math.random() * availablePool.length);
          winners.push(availablePool[winnerIdx]);

          // Strip if duplicate draws are not allowed
          if (!allowDuplicatesInDraw) {
            availablePool.splice(winnerIdx, 1);
          }
        }

        // Trigger celebrate confetti particles
        const colors = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#6366f1', '#3b82f6', '#10b981', '#f59e0b'];
        const listConfetti = Array.from({ length: 80 }).map((_, idx) => ({
          id: idx,
          x: Math.random() * 100, // percentage x-axis
          y: Math.random() * 40 - 20, // percentage y-axis start heights
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 6,
          delay: Math.random() * 0.8
        }));

        setConfetti(listConfetti);
        setDrawnWinners(winners);
        setIsDrawing(false);
      }
    }, tickInterval);
  };

  // Build the formatted rows (prefix/suffix/numbering)
  const getFormattedItems = () => {
    const activeList = outputItems.length > 0 ? outputItems : items;
    return activeList.map((item, index) => {
      let result = item;
      if (prefix) result = prefix + result;
      if (suffix) result = result + suffix;
      if (enableNumbering) result = `${index + 1}. ${result}`;
      return result;
    });
  };

  const formattedResults = getFormattedItems();
  const filteredResults = formattedResults.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = () => {
    if (filteredResults.length === 0) return;
    const separator = delimiter === 'line' ? '\n' : delimiter === 'comma' ? ', ' : '; ';
    navigator.clipboard.writeText(filteredResults.join(separator));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTextFile = () => {
    if (filteredResults.length === 0) return;
    const separator = delimiter === 'line' ? '\n' : delimiter === 'comma' ? ', ' : '; ';
    const element = document.createElement("a");
    const file = new Blob([filteredResults.join(separator)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "randomized_list.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetAll = () => {
    setRawInput('');
    setItems([]);
    setOutputItems([]);
    setPrefix('');
    setSuffix('');
    setEnableNumbering(false);
  };

  const loadTemplate = (text: string) => {
    setRawInput(text);
    setOutputItems([]);
  };

  // Calculate list aggregates
  const duplicateCount = items.length - new Set(items).size;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060814] text-slate-900 dark:text-slate-100 font-sans" id="list-randomizer-container">
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Toolbox Home
          </button>
          <div className="flex items-center gap-2 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/30 dark:border-emerald-900/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-emerald-650 dark:text-emerald-400 uppercase tracking-wider">100% Privacy Secure</span>
          </div>
        </div>

        {/* Title Block */}
        <div className="text-center md:text-left mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-medium mb-1">
            <Dice5 size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
            Raffle Picker & Shuffler Suite
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            List Randomizer & Picker
          </h1>
          <p className="text-sm text-slate-555 dark:text-slate-400 max-w-2xl leading-relaxed">
            Sort columns, randomize items, filter empty spacings, and build custom formats. Includes an advanced raffle draw picker for selecting random giveaway winners with zero server uploads.
          </p>
        </div>

        {/* Templates Selection Bar */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Demos:</span>
          {TEMPLATES.map((tpl, i) => (
            <button
              key={i}
              onClick={() => loadTemplate(tpl.data)}
              className="text-xs bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer text-indigo-650 dark:text-indigo-400"
            >
              {tpl.name}
            </button>
          ))}
        </div>

        {/* Core Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Panel & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Input Text Box Card */}
            <div className="bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <List size={14} className="text-indigo-650 dark:text-indigo-400" />
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Your Input List
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {/* Delimiter Selection */}
                  <select 
                    value={delimiter}
                    onChange={(e: any) => setDelimiter(e.target.value)}
                    className="text-[10px] font-bold uppercase bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md py-1 px-2 focus:outline-none"
                  >
                    <option value="line">Line Breaks</option>
                    <option value="comma">Commas</option>
                    <option value="semicolon">Semicolons</option>
                  </select>

                  <button 
                    onClick={resetAll}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded transition-colors cursor-pointer"
                    title="Reset list"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="Paste or type list items here..."
                  rows={8}
                  className="w-full text-sm bg-transparent border-0 focus:ring-0 p-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 resize-none font-mono"
                />
              </div>

              {/* Input Analytics Bar */}
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border-t border-slate-100 dark:border-slate-850 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <div>
                  Total Rows: <span className="font-bold text-slate-800 dark:text-white">{items.length}</span>
                </div>
                {duplicateCount > 0 && (
                  <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                    <AlertTriangle size={10} />
                    Duplicates: <span className="font-bold">{duplicateCount}</span>
                  </div>
                )}
                <div>
                  Delimiter: <span className="font-bold uppercase text-indigo-650 dark:text-indigo-400">{delimiter}</span>
                </div>
              </div>
            </div>

            {/* Comprehensive Toolbar Tab Box */}
            <div className="bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                <SlidersHorizontal size={15} className="text-indigo-650 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  List Operations Pipeline
                </h3>
              </div>

              {/* Actions Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Randomize Block */}
                <button
                  onClick={handleShuffle}
                  disabled={items.length === 0}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-indigo-150/10 hover:border-indigo-500/30 bg-slate-50/50 hover:bg-indigo-50/20 dark:bg-slate-900/40 dark:hover:bg-indigo-950/10 text-center transition-all cursor-pointer disabled:opacity-45 group"
                >
                  <Shuffle size={16} className="text-indigo-600 group-hover:scale-110 transition-transform mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-850 dark:text-slate-200">Shuffle List</span>
                </button>

                {/* Sort A-Z */}
                <button
                  onClick={handleSortAZ}
                  disabled={items.length === 0}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-150 hover:border-indigo-500/30 bg-slate-50/50 hover:bg-indigo-50/20 dark:bg-slate-900/40 dark:hover:bg-indigo-950/10 text-center transition-all cursor-pointer disabled:opacity-45"
                >
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-white mb-1.5">A-Z</span>
                  <span className="text-[11px] font-bold text-slate-850 dark:text-slate-200">Sort A to Z</span>
                </button>

                {/* Sort Z-A */}
                <button
                  onClick={handleSortZA}
                  disabled={items.length === 0}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-150 hover:border-indigo-500/30 bg-slate-50/50 hover:bg-indigo-50/20 dark:bg-slate-900/40 dark:hover:bg-indigo-950/10 text-center transition-all cursor-pointer disabled:opacity-45"
                >
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-white mb-1.5">Z-A</span>
                  <span className="text-[11px] font-bold text-slate-850 dark:text-slate-200">Sort Z to A</span>
                </button>

                {/* Deduplicate */}
                <button
                  onClick={handleDeduplicate}
                  disabled={items.length === 0}
                  className="flex flex-col items-center justify-center p-3 rounded-xl border border-slate-150 hover:border-indigo-500/30 bg-slate-50/50 hover:bg-indigo-50/20 dark:bg-slate-900/40 dark:hover:bg-indigo-950/10 text-center transition-all cursor-pointer disabled:opacity-45"
                >
                  <Trash2 size={16} className="text-rose-500 mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-850 dark:text-slate-200">Deduplicate</span>
                </button>
              </div>

              {/* Extra Utility Rows */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                <button 
                  onClick={handleCleanSpaces} 
                  disabled={items.length === 0}
                  className="text-[10px] bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 py-1.5 px-3 rounded-md transition-colors cursor-pointer font-bold"
                >
                  Trim Whitespaces
                </button>
                <button 
                  onClick={handleReverse} 
                  disabled={items.length === 0}
                  className="text-[10px] bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 py-1.5 px-3 rounded-md transition-colors cursor-pointer font-bold"
                >
                  Reverse List
                </button>
                <button 
                  onClick={handleSortLength} 
                  disabled={items.length === 0}
                  className="text-[10px] bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 py-1.5 px-3 rounded-md transition-colors cursor-pointer font-bold"
                >
                  Sort by Character Length
                </button>
              </div>
            </div>

            {/* Advanced Prefix/Suffix Card */}
            <div className="bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-850">
                <Sliders size={15} className="text-indigo-650 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Bulk Prefix, Suffix &amp; Numbering
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Row Prefix</label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g. USER_"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Row Suffix</label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="e.g. _DEV"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-350 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={enableNumbering}
                  onChange={(e) => setEnableNumbering(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
                <span>Enable Dynamic Numbering Format (<code className="font-mono text-[10px]">1. Item</code>)</span>
              </label>
            </div>

          </div>

          {/* Right Column: Dynamic Winner Draw & Output Preview */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Raffle Picker Card */}
            <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-150/20 dark:border-indigo-950/30 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-indigo-150/10 dark:border-indigo-950/10">
                <Award size={16} className="text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Raffle Draw Winner Picker
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Draw Winner Size</label>
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, items.length)}
                    value={drawSize}
                    onChange={(e) => setDrawSize(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Allow Duplicates?</label>
                  <select
                    value={allowDuplicatesInDraw ? 'true' : 'false'}
                    onChange={(e) => setAllowDuplicatesInDraw(e.target.value === 'true')}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="false">No (Unique)</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              <button
                onClick={triggerWinnerDraw}
                disabled={items.length === 0}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
              >
                <Sparkles size={14} className="animate-pulse" />
                Pick Random Winner(s)
              </button>
            </div>

            {/* Output Panel View */}
            <div className="bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Randomized Preview
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={copyToClipboard}
                    disabled={filteredResults.length === 0}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded transition-colors cursor-pointer"
                    title="Copy to Clipboard"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                  <button 
                    onClick={downloadTextFile}
                    disabled={filteredResults.length === 0}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded transition-colors cursor-pointer"
                    title="Download Text File"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>

              {/* Live search filtering output list */}
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-850 flex items-center gap-2">
                <Search size={12} className="text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter outputs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none text-[11px] p-0 focus:ring-0 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="text-[10px] font-bold text-slate-400 hover:text-slate-600">
                    Clear
                  </button>
                )}
              </div>

              {/* Output preview items */}
              <div className="p-4 min-h-[220px] max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
                {filteredResults.length > 0 ? (
                  filteredResults.map((item, idx) => (
                    <div key={idx} className="py-2 text-xs md:text-sm font-mono text-slate-750 dark:text-slate-300 break-all flex justify-between items-center">
                      <span>{item}</span>
                      <span className="text-[9px] text-slate-400 bg-slate-50 dark:bg-slate-900 border border-slate-150 px-1.5 py-0.5 rounded">
                        Row {idx + 1}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="h-[180px] flex flex-col items-center justify-center text-center p-4">
                    <AlertTriangle size={24} className="text-slate-400 mb-2" />
                    <p className="text-xs text-slate-400 italic">
                      {items.length === 0 ? 'Input list is empty. Add items to visualize outputs.' : 'No items match your search filter.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Informative Guide / SEO Copy */}
        <div className="mt-12 bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Educational Insights: List Shuffling &amp; Randomization Mathematics
          </h2>
          <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-650 dark:text-slate-350 leading-relaxed space-y-4">
            <p>
              Under the hood, our Shuffle feature employs a highly robust algorithm called the <strong>Fisher-Yates (Knuth) Shuffle</strong>. This algorithm runs in an optimal <strong className="font-mono">O(n)</strong> time complexity and guarantees a mathematically unbiased permutation of the input set. Every single row has an absolute equal probability of landing in any position of the output index array.
            </p>
            <p>
              When sorting alphabetically, Javascript’s local <code className="font-mono">localeCompare</code> logic checks natural language character hierarchies, meaning it sorts accented letters and special unicode characters with high semantic accuracy matching standard dictionary guidelines.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850">
            {faqs.map((faq, index) => {
              const isOpen = expandedFaq === index;
              return (
                <div key={faq.id} className={index > 0 ? "pt-4" : ""}>
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center text-left font-semibold text-xs md:text-sm text-slate-850 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-2 text-xs text-slate-555 dark:text-slate-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Draw Ticker / Confetti Overlay Modal */}
        <AnimatePresence>
          {showDrawModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Overlay Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { if(!isDrawing) setShowDrawModal(false); }}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
              />

              {/* Modal Card */}
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                className="relative bg-white dark:bg-[#0c101d] border border-slate-250 dark:border-slate-800 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl text-center overflow-hidden"
              >
                {/* Celebratory Particles */}
                {drawnWinners.length > 0 && confetti.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ y: -50, x: `${p.x}%`, rotate: 0, opacity: 1 }}
                    animate={{ 
                      y: '400px', 
                      rotate: 360, 
                      opacity: [1, 1, 0.4, 0] 
                    }}
                    transition={{ 
                      duration: 2.2, 
                      delay: p.delay,
                      ease: "linear",
                    }}
                    className="absolute w-2 h-2 rounded-full z-10"
                    style={{ 
                      backgroundColor: p.color, 
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      width: `${p.size}px`,
                      height: `${p.size}px`,
                    }}
                  />
                ))}

                {isDrawing ? (
                  /* Loading Ticker Screen */
                  <div className="space-y-6 py-8">
                    <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto animate-bounce">
                      <Dice5 size={32} className="text-indigo-600 dark:text-indigo-400 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">Raffling Database...</span>
                      <p className="text-sm text-slate-500">Shuffling candidate buckets</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-150 rounded-xl font-mono text-xl font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide truncate">
                      {tickerItem || '---'}
                    </div>
                  </div>
                ) : (
                  /* Winner Announcement Screen */
                  <div className="space-y-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto scale-110">
                      <Award size={36} className="text-emerald-500 animate-pulse" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                        Winner Drawn!
                      </h3>
                      <p className="text-xs text-slate-555 dark:text-slate-400">
                        The mathematically randomized selections are locked
                      </p>
                    </div>

                    {/* Winners Badges Area */}
                    <div className="space-y-2 max-h-[180px] overflow-y-auto p-1">
                      {drawnWinners.map((winner, idx) => (
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: idx * 0.1 }}
                          key={idx} 
                          className="flex items-center justify-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 rounded-2xl"
                        >
                          <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-mono font-black text-emerald-700 dark:text-emerald-400 text-base break-all">
                            {winner}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={triggerWinnerDraw}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Redraw
                      </button>
                      <button
                        onClick={() => setShowDrawModal(false)}
                        className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
