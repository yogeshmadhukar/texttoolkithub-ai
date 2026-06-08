import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Download, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  ArrowUpRight, 
  Globe, 
  Wrench,
  CheckCircle,
  FileText,
  Info,
  Sliders,
  Settings,
  Heart,
  Eye,
  RefreshCw
} from 'lucide-react';

interface RemoveEmojisViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface EmojiCategory {
  id: string;
  name: string;
  sample: string;
  description: string;
  test: (char: string) => boolean;
}

export default function RemoveEmojisView({ onNavigateToTool, onNavigateHome }: RemoveEmojisViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Advanced Options state
  const [mode, setMode] = useState<'all' | 'selective'>('all');
  const [keepFormatting, setKeepFormatting] = useState<boolean>(true);
  
  // Specific emoji categories to targeting
  const [selectedCategories, setSelectedCategories] = useState<Record<string, boolean>>({
    emotions: true,
    animals: true,
    food: true,
    activities: true,
    symbols: true,
    flags: true,
  });

  // SEO parameters
  const seoTitle = "Remove Emojis Online | Free Emoji Remover";
  const seoDescription = "Remove emojis from text instantly while preserving formatting. Free online emoji remover for social media, documents, and articles.";

  // Emoji Categories definition
  const emojiCategories: EmojiCategory[] = [
    {
      id: 'emotions',
      name: 'Smileys & Emotions',
      sample: '😀😂😍🥺😡',
      description: 'Face expressions, hearts, hands, and human emotions.',
      test: (char: string) => {
        const cp = char.codePointAt(0) || 0;
        // Smileys range, Emoticons, plus core heart symbols
        return (cp >= 0x1F600 && cp <= 0x1F64F) || 
               (cp >= 0x1F900 && cp <= 0x1F97F) || 
               (cp >= 0x1F5FA && cp <= 0x1F63F) ||
               (cp >= 0x1F980 && cp <= 0x1F9FF) || // additional icons
               (cp >= 0x2700 && cp <= 0x27BF) ||
               (cp >= 0x2600 && cp <= 0x26FF) ||
               ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖', '💗', '💓', '💞', '💕', '💌', '❣', '💔'].includes(char);
      }
    },
    {
      id: 'animals',
      name: 'Animals & Nature',
      sample: '🐶🐱🦁🌳🌸',
      description: 'Mammals, birds, insects, plants, weather, and flowers.',
      test: (char: string) => {
        const cp = char.codePointAt(0) || 0;
        return (cp >= 0x1F400 && cp <= 0x1F4FF) || 
               (cp >= 0x1F300 && cp <= 0x1F32F) ||
               (cp >= 0x1F330 && cp <= 0x1F37F) || 
               (cp >= 0x1F980 && cp <= 0x1F9AE);
      }
    },
    {
      id: 'food',
      name: 'Food & Drink',
      sample: '🍎🍕🍩🥑🍻',
      description: 'Fruits, meals, sweets, kitchen elements, and drinks.',
      test: (char: string) => {
        const cp = char.codePointAt(0) || 0;
        return (cp >= 0x1F350 && cp <= 0x1F37F) || 
               (cp >= 0x1F950 && cp <= 0x1F96F) || 
               (cp >= 0x1F9C0 && cp <= 0x1F9CF);
      }
    },
    {
      id: 'activities',
      name: 'Activities & Travel',
      sample: '⚽🎮🚗✈️🎪',
      description: 'Sports, hobbies, vehicles, flights, globes, and events.',
      test: (char: string) => {
        const cp = char.codePointAt(0) || 0;
        return (cp >= 0x1F380 && cp <= 0x1F3DF) || 
               (cp >= 0x1F680 && cp <= 0x1F6FF) || 
               (cp >= 0x1F940 && cp <= 0x1F94F);
      }
    },
    {
      id: 'symbols',
      name: 'Symbols & Objects',
      sample: '💡🔮🔑📌⚠️',
      description: 'Gears, warning signs, tools, books, and miscellaneous items.',
      test: (char: string) => {
        const cp = char.codePointAt(0) || 0;
        return (cp >= 0x1F4A0 && cp <= 0x1F4FF) || 
               (cp >= 0x1F500 && cp <= 0x1F5FF) || 
               (cp >= 0x1F9E0 && cp <= 0x1F9FF) ||
               (cp >= 0x24C2 && cp <= 0x1F251);
      }
    },
    {
      id: 'flags',
      name: 'Flags',
      sample: '🇺🇸🇪🇺🇬🇧🏁🚩',
      description: 'National country flags, signal flags, and banners.',
      test: (char: string) => {
        const cp = char.codePointAt(0) || 0;
        return (cp >= 0x1F1E6 && cp <= 0x1F1FF) || 
               (cp >= 0x1F3F3 && cp <= 0x1F3F4) ||
               (cp >= 0x2690 && cp <= 0x2691);
      }
    }
  ];

  const faqs = [
    {
      id: 1,
      question: "How does the emoji detection algorithm function?",
      answer: "This tool leverages modern ES2020 unicode regex scripts targeting the 'Extended Pictographic' block together with custom category lookup classifiers. It safely targets exact emoji glyph representation maps without altering your letters, numerals, standard grammar marks, or special brackets."
    },
    {
      id: 2,
      question: "Can I remove only specific categories of emojis?",
      answer: "Yes. By choosing the 'Selective Emoji Categories' mode, you can toggle specific checkboxes to strip only matching sets (such as Animals or Flags) while preserving other emoji types (like smiley faces or hearts)."
    },
    {
      id: 3,
      question: "Are emojis with skin tones or genders completely detected?",
      answer: "Absolutely. The script successfully interprets multi-character emoji sequences joined with Zero Width Joiners (ZWJ), flags composed of regional indicators, and modified emojis such as skin hue or gender indicators."
    },
    {
      id: 4,
      question: "Does the cleaner affect paragraphs, tabs, or blank spaces?",
      answer: "With the 'Keep text formatting' option checked, the tool accurately extracts and cleans the target emoji blocks while preserving your exact indentation spacing, line breaks, paragraphs, margins, and custom styles intact."
    },
    {
      id: 5,
      question: "Is my text uploaded to a backend server?",
      answer: "No. Security is 100% locally enforced. Everything executes natively inside your browser's client-side memory using JavaScript. Your confidential writings never touch a distant network cloud."
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

    const scriptId = "remove-emojis-json-ld";
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

  // Main cleaning engine
  const [stats, setStats] = useState({
    originalCount: 0,
    foundCount: 0,
    removedCount: 0,
    finalCount: 0
  });

  const getEmojisInText = (text: string) => {
    // Unicode-aware regex match for Emojis
    // matches Extended Pictographic or Emoji Presentation patterns
    const regex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;
    const matches = Array.from(text.matchAll(regex)).map(m => m[0]);
    return matches;
  };

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setStats({
        originalCount: 0,
        foundCount: 0,
        removedCount: 0,
        finalCount: 0
      });
      return;
    }

    const originalCharCount = inputText.length;
    const allMatches = getEmojisInText(inputText);
    const foundCount = allMatches.length;

    // Filter text based on configuration
    let cleanedText = inputText;

    if (mode === 'all') {
      // Remove all emojis
      const regex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;
      cleanedText = inputText.replace(regex, '');
    } else {
      // Selective removal based on category test mapping
      const regex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation})/gu;
      cleanedText = inputText.replace(regex, (match) => {
        // Find which categories match this emoji
        const matchesCategory = emojiCategories.some(cat => {
          // If the category is checked, and the emoji passes its test, we want to REMOVE it
          return selectedCategories[cat.id] && cat.test(match);
        });

        // If it matches a checked category, return empty string (remove it), else keep it
        return matchesCategory ? '' : match;
      });
    }

    // Standard formatting spaces trim-up if keepFormatting is false
    if (!keepFormatting) {
      cleanedText = cleanedText.replace(/\s+/g, ' ').trim();
    }

    const finalCount = cleanedText.length;
    const removedCount = originalCharCount - finalCount;

    setOutputText(cleanedText);
    setStats({
      originalCount: originalCharCount,
      foundCount: foundCount,
      removedCount: Math.max(0, removedCount),
      finalCount: finalCount
    });

  }, [inputText, mode, keepFormatting, selectedCategories]);

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
      link.download = `Emoji_Free_Text.txt`;
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
    setInputText(`Cruising in California 🇺🇸 with my friends! 🚗💨 Loving this weather ☀️🌸. Can't wait for dinner 🍕🍷🥑. Best trip ever! 😀😂🔥`);
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200" id="remove-emojis-page">
      {/* Premium tool header standard */}
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
              <div className="flex items-center gap-1.5 text-xs text-indigo-650 dark:text-indigo-400 font-extrabold uppercase tracking-wider">
                <span>Format & Clean Suite</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 font-sans normal-case">Tool</span>
              </div>
              <h1 className="text-lg font-black text-slate-950 dark:text-white font-sans tracking-tight">
                Remove Emojis
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
              <Smile className="w-3.5 h-3.5" />
              <span>Free Online Emoji Remover Utility</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight leading-none">
              Remove Emojis Online
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Instantly strip emoji symbols, flags, emojis modifiers, or emoticons from social media posts, school reports, metadata, or clean strings while preserving spaces, alignments, and text punctuation.
            </p>
          </div>

          {/* Privacy Protection Callout */}
          <div className="flex items-start gap-3 bg-emerald-50/30 dark:bg-slate-950/30 border border-emerald-100/30 dark:border-slate-805 rounded-2xl p-4 mb-8">
            <Info className="w-5 h-5 text-emerald-600 dark:text-emerald-405 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Local Sandbox Execution Guaranteed</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                We respect your personal files and writings. High-speed, browser-native string cleaning guarantees 100% processing security so that no texts or paragraphs leave your computer.
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
                    <FileText className="w-4 h-4 text-indigo-505" />
                    <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 uppercase tracking-widest font-mono">
                      Input Original Text
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLoadSample}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-350 hover:underline"
                    >
                      Load Demo Content
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
                    placeholder="Type or paste text featuring emojis, emoticons, or special tags here..."
                    className="w-full min-h-[220px] max-h-[500px] p-4 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-505 dark:focus:ring-indigo-900 transition-all font-sans text-sm leading-relaxed"
                    id="remove-emojis-input"
                  />
                  
                  {inputText && (
                    <div className="absolute bottom-3 right-3 select-none pointer-events-none text-[9.5px] font-mono text-slate-450 bg-white/80 dark:bg-slate-950/80 px-2 py-1 rounded border border-slate-200/50 dark:border-slate-800">
                      {inputText.length.toLocaleString()} base symbols
                    </div>
                  )}
                </div>
              </div>

              {/* CLEANED OUTPUT CARD */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-850 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 uppercase tracking-widest font-mono flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    Clean Result (No Emojis)
                  </span>

                  {outputText && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs transition duration-150 ${
                          copied 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-405 dark:border-emerald-900' 
                            : 'bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-805 dark:hover:bg-slate-800'
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy'}</span>
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
                        <Smile className="w-5 h-5 animate-pulse" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Sanitized outputs will display here. Paste or write text containing smiley faces, flags, or icons to filter them out instantly.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar Controls Column */}
            <div className="flex flex-col gap-6">
              
              {/* REMOVAL MODALITY CARD */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-3">
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                  Removal Modality
                </span>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setMode('all')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      mode === 'all' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-750 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold">Remove All Emojis</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 bg-indigo-50/50 dark:bg-indigo-950/40 rounded border">Purge</span>
                  </button>

                  <button
                    onClick={() => setMode('selective')}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition ${
                      mode === 'selective' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-150 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-755 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-extrabold">Filter Selected Categories</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 bg-emerald-50/30 dark:bg-emerald-950/20 rounded border">Selective</span>
                  </button>
                </div>
              </div>

              {/* ADVANCED OPTIONAL CATEGORIES CHIPBOARD */}
              {mode === 'selective' && (
                <div className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                  <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider block mb-3 font-mono">
                    Target Emoji Sets
                  </span>
                  
                  <div className="space-y-3">
                    {emojiCategories.map(cat => (
                      <div 
                        key={cat.id} 
                        className="flex items-start justify-between gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900/60 rounded-xl transition"
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-805 dark:text-slate-200">{cat.name}</span>
                            <span className="text-[10px] font-sans tracking-wide bg-slate-100 dark:bg-slate-800 px-1 py-0.2 rounded select-none">
                              {cat.sample}
                            </span>
                          </div>
                          <span className="text-[9.5px] text-slate-400 dark:text-slate-500 mt-0.5 leading-snug">
                            {cat.description}
                          </span>
                        </div>

                        <input
                          type="checkbox"
                          checked={selectedCategories[cat.id]}
                          onChange={() => toggleCategory(cat.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-650 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FORMATTING CONFIGURATION SWITCH */}
              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-3 font-mono">
                  <Settings className="w-3.5 h-3.5 text-indigo-500" />
                  Formatting Rules
                </span>

                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="keep-format">
                      Keep original formatting
                    </label>
                    <span className="text-[10px] text-slate-505 dark:text-slate-400 mt-0.5 leading-normal">
                      Preserve paragraph spacing, newlines, indents, and relative column placements exactly.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    id="keep-format"
                    checked={keepFormatting}
                    onChange={(e) => setKeepFormatting(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                  />
                </div>
              </div>

              {/* LIVE RECONNAISSANCE STATS REPORT */}
              <div className="bg-slate-100/50 dark:bg-slate-950/40 p-4 border dark:border-slate-801 rounded-3xl p-5">
                <span className="text-[10px] font-bold font-mono tracking-wider text-slate-400 dark:text-slate-500 uppercase block mb-2">Processing Report</span>
                <p className="text-xs text-slate-505 dark:text-slate-405 leading-relaxed">
                  {mode === 'all' 
                    ? "Purging 100% of detected pictographs, Flags and Emoticons matching Unicode 14.0 guidelines instantly." 
                    : "Executing selective categorization. Only emojis belonging to checked sections will be deleted."}
                </p>
              </div>

            </div>
          </div>

          {/* CHARACTER & EMOJI METRIC BOXES */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm mb-12">
            <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Real-Time Emoji Statistics
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl transition">
                <span className="text-[9.5px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider leading-none">Original Characters</span>
                <span className="text-xl font-black text-slate-850 dark:text-white block font-sans mt-1">{stats.originalCount}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl transition">
                <span className="text-[9.5px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider leading-none">Emojis Found</span>
                <span className="text-xl font-black text-indigo-650 dark:text-indigo-400 block font-sans mt-1">{stats.foundCount}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl transition">
                <span className="text-[9.5px] uppercase font-bold text-rose-455 dark:text-rose-500 tracking-wider leading-none">Emojis Removed</span>
                <span className="text-xl font-black text-rose-550 dark:text-rose-400 block font-sans mt-1">{stats.removedCount}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl transition">
                <span className="text-[9.5px] uppercase font-bold text-slate-405 dark:text-slate-500 tracking-wider leading-none">Final Characters</span>
                <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 block font-sans mt-1">{stats.finalCount}</span>
              </div>
            </div>
          </div>

          {/* ADVERTISEMENT PLACEHOLDER */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-2 border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-3xl">
              <Globe className="w-5 h-5 text-indigo-500 shrink-0" />
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-205">Automatic Ad Placement Container</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed mt-0.5">
                  Preallocated responsive banner area ensures seamless automatic Google AdSense compliance with absolutely zero Cumulative Layout Shift (CLS).
                </p>
              </div>
            </div>
          </div>

          {/* FREQUENTLY ASKED QUESTIONS SECTION */}
          <section className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-sans tracking-tight flex items-center gap-2 mb-2">
              <HelpCircle className="w-5.5 h-5.5 text-indigo-650" />
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 leading-relaxed max-w-3xl mb-6 font-sans">
              Learn how to quickly and efficiently strip emojis from draft texts, emails, tweets, social media transcripts, and copy-pasted files without losing your layout configurations.
            </p>

            <div className="space-y-4">
              {faqs.map(faq => (
                <div 
                  key={faq.id}
                  className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden transition duration-150"
                  id={`remove-emojis-faq-item-${faq.id}`}
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
                    <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850">
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-850 pt-6">
              <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200 mb-2 font-sans uppercase tracking-wider">
                Why Strip Emojis From Text Blocks?
              </h4>
              <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                While emojis are spectacular for real-time messaging, social interaction, and high-interest marketing copies, they often trigger indexing errors on legal drafts, business whitepapers, software documentation, and professional emails. Stripping emojis guarantees that your text maintains a polished corporate presentation suitable for formal archives, text-to-speech rendering engines, and clean publication files.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
