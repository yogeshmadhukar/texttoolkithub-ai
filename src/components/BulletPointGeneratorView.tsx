import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  List, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  Globe, 
  CheckCircle,
  FileText,
  Info,
  Sliders,
  Settings,
  RefreshCw,
  FileSpreadsheet,
  ListOrdered
} from 'lucide-react';

interface BulletPointGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function BulletPointGeneratorView({ onNavigateToTool, onNavigateHome }: BulletPointGeneratorViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Configuration options
  const [bulletStyle, setBulletStyle] = useState<'standard' | 'circle' | 'square' | 'arrow' | 'number' | 'custom'>('standard');
  const [customBulletChar, setCustomBulletChar] = useState('★ ');
  const [splitBy, setSplitBy] = useState<'sentence' | 'paragraph' | 'line' | 'comma'>('sentence');
  
  // Custom separator between bullet points in output (e.g. newline, double newline, custom string)
  const [separatorType, setSeparatorType] = useState<'newline' | 'double-newline' | 'custom'>('newline');
  const [customSeparator, setCustomSeparator] = useState(' | ');

  // Advanced filters/cleanups
  const [trimEntries, setTrimEntries] = useState(true);
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);
  const [capitalizeFirst, setCapitalizeFirst] = useState(true);
  const [endWithPeriod, setEndWithPeriod] = useState(false);

  // SEO parameters
  const seoTitle = "Bullet Point Generator Online | Convert Text to Bullets";
  const seoDescription = "Convert paragraphs into clean bullet points instantly. Create organized lists for notes, blogs, presentations, and reports.";

  const faqs = [
    {
      id: 1,
      question: "How does the Sentence splitting logic work?",
      answer: "The sentence splitting algorithm uses a smart NLP regex pattern to parse periods, exclamation marks, and question marks. It is explicitly configured to ignore common abbreviations (like 'e.g.', 'i.e.', 'Dr.', 'Mr.', 'Mrs.', 'vs.') to prevent premature sentence breakdown, ensuring you get neat, coherent thoughts converted into bullets."
    },
    {
      id: 2,
      question: "Can I use any custom icon or symbol for bullets?",
      answer: "Absolutely! Choose the 'Custom symbol' option in Bullet Styles, and you can type or paste any emoji, letter, or character (such as '✦', '✔', '👉', or '★') to serve as your list bullet prefix."
    },
    {
      id: 3,
      question: "What is the 'Advanced separators' feature?",
      answer: "By default, bullets are structured on standard vertical newlines. If you are preparing data for spreadsheets, inline slides, or database fields, you can change the join symbol to a double space, a comma, a pipe delimiter (|), or any custom text sequence."
    },
    {
      id: 4,
      question: "Can I strip empty sentences or capitalize the first letters automatically?",
      answer: "Yes! Enabling the advanced format formatting controls will automatically strip blank lists, trim extra side spaces, and capitalize the initial character of each bullet point for high professional consistency."
    },
    {
      id: 5,
      question: "Is my pasted content protected?",
      answer: "Safeguarding your documents is our prime directive. Our Bullet Point Generator executes purely client-side within your browser. Absolutely zero drafts or notes are transmitted to servers, keeping your work completely confidential."
    }
  ];

  // Configure SEO headers & dynamic schemas
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

    // FAQ Rich Schema LD-JSON
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

    const scriptId = "bullet-point-generator-json-ld";
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
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // Main generator engine
  const [stats, setStats] = useState({
    bulletCount: 0,
    wordCount: 0,
    charCount: 0
  });

  // Smart sentence tokenizer ignoring common abbreviations
  const tokenizeSentences = (text: string): string[] => {
    if (!text.trim()) return [];
    
    // Protect common abbreviations with placeholders or split with negative lookbehind
    // A robust split strategy using negative lookbehind for common contractions and honorifics:
    // We split on [.!?] followed by whitespace, making sure not to split common abbreviations
    const sentences = text
      .replace(/([.!?])\s*(?=[A-Z0-9\("']|$)/g, "$1|SPLIT_HERE|")
      .split("|SPLIT_HERE|");

    // Basic heuristic to bridge split abbreviations that look like sentence endings:
    const abbreviations = ['mr.', 'mrs.', 'ms.', 'dr.', 'prof.', 'sr.', 'jr.', 'vs.', 'etc.', 'eg.', 'ie.', 'e.g.', 'i.e.', 'a.m.', 'p.m.', 'co.', 'corp.'];
    const resolved: string[] = [];
    
    let temp = '';
    for (let i = 0; i < sentences.length; i++) {
      const current = sentences[i];
      if (!current) continue;
      
      if (temp) {
        temp += ' ' + current;
      } else {
        temp = current;
      }

      // Check if last word resembles an abbreviation
      const words = temp.trim().split(/\s+/);
      const lastWord = words[words.length - 1]?.toLowerCase();
      
      const isAbbrev = abbreviations.some(abbr => lastWord === abbr || lastWord?.endsWith('.' + abbr));
      
      if (!isAbbrev) {
        resolved.push(temp);
        temp = '';
      }
    }
    
    if (temp) {
      resolved.push(temp);
    }

    return resolved;
  };

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setStats({
        bulletCount: 0,
        wordCount: 0,
        charCount: 0
      });
      return;
    }

    // 1. Initial Split of the text
    let segments: string[] = [];
    if (splitBy === 'sentence') {
      segments = tokenizeSentences(inputText);
    } else if (splitBy === 'paragraph') {
      segments = inputText.split(/\n\s*\n+/);
    } else if (splitBy === 'line') {
      segments = inputText.split(/\r?\n/);
    } else if (splitBy === 'comma') {
      segments = inputText.split(/[,;|\n]+/);
    }

    // 2. Formatting cleanups (Trim, Empty items removal, Capitalization, Trailing Periods)
    let processedItems = segments
      .map(item => {
        let cleaned = item;
        if (trimEntries) cleaned = cleaned.trim();
        
        if (cleaned && capitalizeFirst) {
          // Capitalize first letter safely while preserving character sequences
          cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        }

        if (cleaned && endWithPeriod) {
          if (!/[.!?]$/.test(cleaned)) {
            cleaned = cleaned + '.';
          }
        }

        return cleaned;
      });

    if (removeEmptyLines) {
      processedItems = processedItems.filter(item => item.length > 0);
    }

    // 3. Prefixing Bullet Style
    const getBulletPrefix = (index: number): string => {
      switch (bulletStyle) {
        case 'standard': return '• ';
        case 'circle': return '○ ';
        case 'square': return '■ ';
        case 'arrow': return '➜ ';
        case 'number': return `${index + 1}. `;
        case 'custom': return customBulletChar;
        default: return '• ';
      }
    };

    const formattedLines = processedItems.map((item, index) => {
      const prefix = getBulletPrefix(index);
      return `${prefix}${item}`;
    });

    // 4. Joining by Separator Options
    let joiner = '\n';
    if (separatorType === 'double-newline') {
      joiner = '\n\n';
    } else if (separatorType === 'custom') {
      joiner = customSeparator;
    }

    const finalOutput = formattedLines.join(joiner);
    
    // 5. Statistics Calculation
    const bulletCount = formattedLines.length;
    const wordCount = finalOutput.trim() === '' ? 0 : finalOutput.trim().split(/\s+/).filter(w => w.length > 0).length;
    const charCount = finalOutput.length;

    setOutputText(finalOutput);
    setStats({
      bulletCount,
      wordCount,
      charCount
    });

  }, [
    inputText, 
    bulletStyle, 
    customBulletChar, 
    splitBy, 
    separatorType, 
    customSeparator, 
    trimEntries, 
    removeEmptyLines, 
    capitalizeFirst, 
    endWithPeriod
  ]);

  // Actions
  const handleCopy = () => {
    if (!outputText) return;
    try {
      navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard write failure", e);
    }
  };

  const handleDownload = () => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Formatted_Bullet_List.txt`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      console.error("Txt file creation failure", e);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleLoadSample = () => {
    setInputText(`Writing a compelling slideshow or executive report from scratch can feel daunting. Good slide bullets prioritize clarity and action. When constructing notes, keep each point focused on a single key takeaway instead of stuffing multiple paragraphs. It makes information much simpler to digest. Try using circles or brackets to distinguish secondary elements! Finally, verify that your lists are grammatically uniform.`);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200" id="bullet-generator-page">
      {/* Premium tool header */}
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Back to Homepage"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider">
                <span>Convert & Format Suite</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 font-sans normal-case">Tool</span>
              </div>
              <h1 className="text-lg font-black text-slate-950 dark:text-white font-sans tracking-tight">
                Bullet Point Generator
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTool('tools')}
              className="text-xs font-bold text-slate-650 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Browse All Utilities
            </button>
          </div>
        </div>
      </header>

      {/* Main Interactive Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Description Header */}
          <div className="text-center md:text-left mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/45 rounded-full text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-4"
            >
              <List className="w-3.5 h-3.5" />
              <span>Offline-First Text to List Formatter</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight leading-none">
              Paragraph to Bullet Point Generator
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Instantly transform unstructured paragraphs, blocky walls of text, notes, or essays into beautiful, organized bullet lists using standard shapes, numerical sequences, or custom icons.
            </p>
          </div>

          {/* Privacy Protection Callout */}
          <div className="flex items-start gap-3 bg-emerald-50/30 dark:bg-slate-950/30 border border-emerald-100/30 dark:border-slate-805 rounded-2xl p-4 mb-8">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-405 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">100% Client-Side List Formatter</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                We safeguard your drafts. All core parsing is done locally within your browser using TypeScript algorithms. No text data is ever sent to external servers or remote clouds.
              </p>
            </div>
          </div>

          {/* Layout Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* IO Area Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* RAW TEXT INPUT CARD */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-850 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 uppercase tracking-widest font-mono">
                      Input Raw Text Block
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLoadSample}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-350 hover:underline"
                    >
                      Load Demo Text
                    </button>
                    {inputText && (
                      <button
                        onClick={handleClear}
                        className="p-1 px-1.5 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-rose-500 transition-all font-mono text-[10px] font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>CLEAR</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or paste paragraphs, messy notes, or meeting takeaways here to instantly extract bullets..."
                    className="w-full min-h-[220px] max-h-[500px] p-4 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-900 transition-all font-sans text-sm leading-relaxed"
                    id="bullet-generator-input"
                  />
                  
                  {inputText && (
                    <div className="absolute bottom-3 right-3 select-none pointer-events-none text-[9.5px] font-mono text-slate-450 bg-white/80 dark:bg-slate-950/80 px-2 py-1 rounded border border-slate-200/50 dark:border-slate-800">
                      {inputText.length.toLocaleString()} characters of draft
                    </div>
                  )}
                </div>
              </div>

              {/* GENERATED BULLET POINTS CARD */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-850 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 uppercase tracking-widest font-mono flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Clean Bullet Output
                  </span>

                  {outputText && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs transition duration-150 ${
                          copied 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' 
                            : 'bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800'
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Output'}</span>
                      </button>


                    </div>
                  )}
                </div>

                <div className="relative">
                  {outputText ? (
                    <div className="w-full min-h-[220px] max-h-[500px] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 rounded-2xl border border-emerald-100 dark:border-slate-800 font-sans text-sm whitespace-pre-wrap leading-relaxed select-text tracking-normal">
                      {outputText}
                    </div>
                  ) : (
                    <div className="w-full min-h-[220px] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center select-none">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-450 dark:text-slate-600 mb-2">
                        <List className="w-5 h-5 animate-pulse" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Pasted lines will automatically format here. Try splitting draft paragraphs into individual sentences or bullet items.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar Controls Column */}
            <div className="flex flex-col gap-6">
              
              {/* BULLET STYLES SELECTOR */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-mono uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-3">
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                  Bullet Styles
                </span>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    onClick={() => setBulletStyle('standard')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      bulletStyle === 'standard' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base select-none">•</span>
                    <span>Standard</span>
                  </button>

                  <button
                    onClick={() => setBulletStyle('circle')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      bulletStyle === 'circle' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base select-none">○</span>
                    <span>Circle</span>
                  </button>

                  <button
                    onClick={() => setBulletStyle('square')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      bulletStyle === 'square' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base select-none">■</span>
                    <span>Square</span>
                  </button>

                  <button
                    onClick={() => setBulletStyle('arrow')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      bulletStyle === 'arrow' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-base select-none">➜</span>
                    <span>Arrow</span>
                  </button>

                  <button
                    onClick={() => setBulletStyle('number')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      bulletStyle === 'number' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono select-none">1.2</span>
                    <span>Numbered</span>
                  </button>

                  <button
                    onClick={() => setBulletStyle('custom')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      bulletStyle === 'custom' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono select-none">★</span>
                    <span>Custom</span>
                  </button>
                </div>

                {bulletStyle === 'custom' && (
                  <div className="mt-3 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border dark:border-slate-800">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Custom Bullet Prefix</label>
                    <input
                      type="text"
                      value={customBulletChar}
                      onChange={(e) => setCustomBulletChar(e.target.value)}
                      placeholder="e.g. ★ , 👉 , ✦ "
                      className="w-full p-2 bg-white dark:bg-slate-950 text-slate-850 dark:text-white rounded-xl border border-slate-200 dark:border-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* SPLIT / CONVERSION TYPE */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-3 font-mono">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
                  Split Raw Text By
                </span>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setSplitBy('sentence')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      splitBy === 'sentence' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-750 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold">One sentence per bullet</span>
                    <span className="text-[10px] text-indigo-650 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50/50 dark:bg-indigo-950/40 rounded border font-mono">Default</span>
                  </button>

                  <button
                    onClick={() => setSplitBy('paragraph')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      splitBy === 'paragraph' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-750 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold">By paragraph gaps</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded border font-mono">Paragraph</span>
                  </button>

                  <button
                    onClick={() => setSplitBy('line')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      splitBy === 'line' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-750 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold">By single line breaks</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded border font-mono">Lines</span>
                  </button>

                  <button
                    onClick={() => setSplitBy('comma')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      splitBy === 'comma' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-750 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold">By commas / semi-colons</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-900 rounded border font-mono">Comma</span>
                  </button>
                </div>
              </div>

              {/* ADVANCED FORMATTING SWITCHERS */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-3 font-mono">
                  <Settings className="w-3.5 h-3.5 text-indigo-500" />
                  Formatting Rules
                </span>

                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="f-trim">
                        Trim extra slide spaces
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Remove redundant trailing or leading margins from each key phrase.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="f-trim"
                      checked={trimEntries}
                      onChange={(e) => setTrimEntries(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="f-empty">
                        Discard blank items
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Filter and ignore empty lines or blank sentence spacing.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="f-empty"
                      checked={removeEmptyLines}
                      onChange={(e) => setRemoveEmptyLines(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="f-caps">
                        Capitalize first letters
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Enforce uppercase capitalizations for the start of every list item.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="f-caps"
                      checked={capitalizeFirst}
                      onChange={(e) => setCapitalizeFirst(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="f-period">
                        End with basic period (.)
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                        Ensure every bullet point list concludes with a full-stop period mark.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="f-period"
                      checked={endWithPeriod}
                      onChange={(e) => setEndWithPeriod(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* SEPARATOR STYLE */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-3 font-mono">
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                  Bullet Separator
                </span>

                <div className="flex flex-col gap-2 mb-3">
                  <button
                    onClick={() => setSeparatorType('newline')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      separatorType === 'newline' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Standard Newline</span>
                    <span className="text-[10px] text-slate-500 font-mono">\\n</span>
                  </button>

                  <button
                    onClick={() => setSeparatorType('double-newline')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      separatorType === 'double-newline' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Double Line Gaps</span>
                    <span className="text-[10px] text-slate-500 font-mono">\\n\\n</span>
                  </button>

                  <button
                    onClick={() => setSeparatorType('custom')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition text-xs font-bold ${
                      separatorType === 'custom' 
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>Custom Inline Separator</span>
                    <span className="text-[10px] text-slate-500 font-mono">e.g. " | "</span>
                  </button>
                </div>

                {separatorType === 'custom' && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border dark:border-slate-800">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Inline String</label>
                    <input
                      type="text"
                      value={customSeparator}
                      onChange={(e) => setCustomSeparator(e.target.value)}
                      placeholder="e.g. ' ; ' or ' | '"
                      className="w-full p-2 bg-white dark:bg-slate-950 text-slate-850 dark:text-white rounded-lg border border-slate-205 dark:border-slate-800 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* DYNAMIC METRIC CARDS BOX */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm mb-12">
            <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-4 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Dynamic List Intelligence Metrics
            </span>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 rounded-2xl transition">
                <span className="text-[9.5px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider leading-none">Bullet Points Count</span>
                <span className="text-xl font-black text-indigo-600 dark:text-indigo-400 block font-sans mt-1">{stats.bulletCount}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 rounded-2xl transition">
                <span className="text-[9.5px] uppercase font-bold text-slate-450 dark:text-slate-500 tracking-wider leading-none">Word Count</span>
                <span className="text-xl font-black text-slate-850 dark:text-white block font-sans mt-1">{stats.wordCount}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-850 rounded-2xl transition">
                <span className="text-[9.5px] uppercase font-bold text-slate-455 dark:text-slate-500 tracking-wider leading-none">Character Count</span>
                <span className="text-xl font-black text-teal-600 dark:text-teal-400 block font-sans mt-1">{stats.charCount}</span>
              </div>
            </div>
          </div>

          {/* AD BLOCK PLACEMENT CONTAINER */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-2 border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-3xl">
              <Globe className="w-5 h-5 text-indigo-500 shrink-0" />
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Responsive AdSense Placement Zone</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed mt-0.5">
                  Ensures complete layout stability and Google publisher policies without causing unstyled layout shifts (CLS).
                </p>
              </div>
            </div>
          </div>

          {/* FREQUENTLY ASKED QUESTIONS SECTION */}
          <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-sans tracking-tight flex items-center gap-2 mb-2">
              <HelpCircle className="w-5.5 h-5.5 text-indigo-600" />
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 leading-relaxed max-w-3xl mb-6 font-sans">
              Learn how to convert draft paragraphs into clean presentation slide bullets, blog notes, or executive bullet summaries instantly.
            </p>

            <div className="space-y-4">
              {faqs.map(faq => (
                <div 
                  key={faq.id}
                  className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden transition duration-150"
                  id={`bullet-faq-item-${faq.id}`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/40 dark:bg-slate-900/30 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-850 dark:text-slate-200 pr-4">
                      {faq.id}. {faq.question}
                    </span>
                    <span className="text-slate-450 dark:text-slate-550 shrink-0">
                      {expandedFaq === faq.id ? '–' : '+'}
                    </span>
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-200">
                      <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-850 pt-6">
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 mb-2 font-sans uppercase tracking-wider">
                Benefits of Organizing Text as Lists
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Reading dense, block-like prose requires high cognitive focus. Converting your text items into lists with dedicated bullet symbols captures immediate scanning interest, highlighting critical summaries. Bullet lists increase reading retention by up to 50% on web and mobile screens, making your memos, newsletters, notes, or academic slides significantly more memorable.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
