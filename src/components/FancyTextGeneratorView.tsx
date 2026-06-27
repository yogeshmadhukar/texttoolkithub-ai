import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  ChevronRight, 
  HelpCircle, 
  ArrowUpRight, 
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Search,
  CheckCircle,
  Hash,
  Share2,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  Type
} from 'lucide-react';

interface FancyTextGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface FancyStyle {
  id: string;
  name: string;
  category: 'unicode' | 'decoration' | 'social';
  transform: (text: string) => string;
}

export default function FancyTextGeneratorView({ onNavigateToTool, onNavigateHome }: FancyTextGeneratorViewProps) {
  const [inputText, setInputText] = useState('Type your stylish text here...');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [history, setHistory] = useState<string | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'unicode' | 'decoration' | 'social'>('all');

  // SEO Parameters
  const seoTitle = "Fancy Text Generator Online";
  const seoDescription = "Generate stylish fancy text fonts for Instagram, Facebook, WhatsApp, Threads, X, and social media.";

  const faqs = [
    {
      id: 1,
      question: "What is a Fancy Text Generator?",
      answer: "A Fancy Text Generator is a client-side utility that takes regular plain keyboard text and translates it into elaborate, decorative unicode font symbols in real-time. Because these are standard mathematical symbols representing different visual families (like script, bold, italic, or double-struck) rather than actual graphic files, you can copy and paste them into any bio or status update that supports UTF-8 characters."
    },
    {
      id: 2,
      question: "Will these stylish styles work on Instagram, Facebook, and WhatsApp?",
      answer: "Yes, almost entirely. Since modern apps (Instagram, Facebook, X, WhatsApp, TikTok, Threads) rely on Unicode as their display core standard, they support the full spectrum of mathematical blocks. However, a small subset of older devices running obsolete operating systems might render some advanced styles as empty rectangles or question marks."
    },
    {
      id: 3,
      question: "How does copy-pasting the text work without losing formatting?",
      answer: "When you change word fonts on conventional word processors like MS Word, the editor applies custom style markups (HTML or rich styling tags). If you paste that text elsewhere, the style gets stripped. Our generator solves this because absolutely each character itself is a unique, standalone Unicode symbol. Copying the text copies the core symbols, preserving the design everywhere."
    },
    {
      id: 4,
      question: "Is this tool SEO-friendly and safe for bios?",
      answer: "Absolutely. Our app converts character streams side-by-side using secure local Javascript scripts. There are no tracking scripts, database recording logs, or remote calls. It has zero impact on page load speed and is 100% private to use."
    }
  ];

  // Map plain text to custom Unicode collections
  const unicodeMap = (text: string, uppercaseOffset: number, lowercaseOffset: number, numberOffset?: number): string => {
    return text.split('').map(char => {
      const code = char.charCodeAt(0);
      // Uppercase letters
      if (code >= 65 && code <= 90) {
        return char.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Ensure no accent anomalies
      }
      // Lowercase letters
      if (code >= 97 && code <= 122) {
        return char;
      }
      // Numbers
      if (numberOffset && code >= 48 && code <= 57) {
        return String.fromCodePoint(code - 48 + numberOffset);
      }
      return char;
    }).map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        return String.fromCodePoint(code - 65 + uppercaseOffset);
      }
      if (code >= 97 && code <= 122) {
        return String.fromCodePoint(code - 97 + lowercaseOffset);
      }
      return char;
    }).join('');
  };

  const customReplacerMap = (text: string, alphabetMap: { [key: string]: string }): string => {
    return text.split('').map(char => {
      const lowerChar = char.toLowerCase();
      if (alphabetMap[lowerChar]) {
        // Match case if possible
        const target = alphabetMap[lowerChar];
        return char === char.toUpperCase() ? target.toUpperCase() : target;
      }
      return char;
    }).join('');
  };

  // Generate 30 distinct fancy text styles
  const styles: FancyStyle[] = [
    {
      id: 'bold-serif',
      name: 'Bold Serif 𝕾',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D400, 0x1D41A, 0x1D7CE)
    },
    {
      id: 'italic-serif',
      name: 'Italic Serif 𝘚',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D434, 0x1D44E)
    },
    {
      id: 'bold-italic-serif',
      name: 'Bold Italic Serif 𝑱',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D468, 0x1D482)
    },
    {
      id: 'bold-sans',
      name: 'Bold Sans 𝖲',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D5EE, 0x1D608, 0x1D7EC)
    },
    {
      id: 'italic-sans',
      name: 'Italic Sans 𝘚',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D622, 0x1D63C)
    },
    {
      id: 'bold-italic-sans',
      name: 'Bold Italic Sans 𝙅',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D656, 0x1D670)
    },
    {
      id: 'double-struck',
      name: 'Double Struck / Blackboard 𝔾',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D538, 0x1D552, 0x1D7D8)
    },
    {
      id: 'monospace',
      name: 'Monospace / Teletype 𝙼',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D670, 0x1D68A, 0x1D7F6)
    },
    {
      id: 'fraktur-gothic',
      name: 'Gothic Fraktur 𝔖',
      category: 'unicode',
      transform: (txt) => {
        // Fraktur has some special holes in Unicode standard, let's map them safely
        return unicodeMap(txt, 0x1D504, 0x1D51E);
      }
    },
    {
      id: 'script-cursive',
      name: 'Cursive / Script 𝓢',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x1D4D0, 0x1D4EA)
    },
    {
      id: 'small-caps',
      name: 'Small Caps ꜱ',
      category: 'unicode',
      transform: (txt) => {
        const smallCapsMap: { [key: string]: string } = {
          'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ', 'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
        };
        return txt.split('').map(char => {
          const lower = char.toLowerCase();
          return smallCapsMap[lower] || char;
        }).join('');
      }
    },
    {
      id: 'bubbles-circled',
      name: 'Circled Bubbles Ⓢ',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0x24B6, 0x24D0, 0x24F5)
    },
    {
      id: 'black-bubbles',
      name: 'Filled/Negative Bubbles 🅢',
      category: 'unicode',
      transform: (txt) => {
        const uppercaseMap = (c: string): string => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1F150); // negative circle A
          if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1F150);
          if (code >= 48 && code <= 57) return String.fromCodePoint(code - 48 + 0x2776); // negative 1-9
          return c;
        };
        return txt.split('').map(uppercaseMap).join('');
      }
    },
    {
      id: 'squared-normal',
      name: 'Squared Outline 🅂',
      category: 'unicode',
      transform: (txt) => {
        const codeMap = (c: string): string => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1F130); // squared A
          if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1F130);
          return c;
        };
        return txt.split('').map(codeMap).join('');
      }
    },
    {
      id: 'squared-filled',
      name: 'Filled Squared 🆂',
      category: 'unicode',
      transform: (txt) => {
        const codeMap = (c: string): string => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x1F170); // negative squared A
          if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x1F170);
          return c;
        };
        return txt.split('').map(codeMap).join('');
      }
    },
    {
      id: 'parenthesized',
      name: 'Parenthesized ⒮',
      category: 'unicode',
      transform: (txt) => {
        const codeMap = (c: string): string => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return String.fromCodePoint(code - 65 + 0x249C);
          if (code >= 97 && code <= 122) return String.fromCodePoint(code - 97 + 0x249C);
          return c;
        };
        return txt.split('').map(codeMap).join('');
      }
    },
    {
      id: 'aesthetic-spaced',
      name: 'Aesthetic Spaced Ａ',
      category: 'unicode',
      transform: (txt) => unicodeMap(txt, 0xFF01 - 32, 0xFF01 - 32 + 32, 0xFF10 - 48)
    },
    {
      id: 'strikethrough',
      name: 'Slash Strikethrough ̶',
      category: 'decoration',
      transform: (txt) => txt.split('').map(char => char + '\u0336').join('')
    },
    {
      id: 'underlined-double',
      name: 'Double Underline ̲',
      category: 'decoration',
      transform: (txt) => txt.split('').map(char => char + '\u0333').join('')
    },
    {
      id: 'slashed-through',
      name: 'Slashed Through ̸',
      category: 'decoration',
      transform: (txt) => txt.split('').map(char => char + '\u0338').join('')
    },
    {
      id: 'mirror-backwards',
      name: 'Mirror Text ɘbixa',
      category: 'unicode',
      transform: (txt) => {
        const mirrorAlphabet: { [key: string]: string } = {
          'a': 'ɒ', 'b': 'd', 'c': 'ɔ', 'd': 'b', 'e': 'ɘ', 'f': 'ɟ', 'g': 'g', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
          '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0'
        };
        return txt.split('').map(char => mirrorAlphabet[char.toLowerCase()] || char).reverse().join('');
      }
    },
    {
      id: 'upside-down',
      name: 'Upside Down Text ʇxǝʇ',
      category: 'unicode',
      transform: (txt) => {
        const upsideAlphabet: { [key: string]: string } = {
          'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z',
          '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '0': '0',
          '.': '˙', ',': '`', '?': '¿', '!': '¡', '\'': ',', '"': '„', '_': '¯'
        };
        return txt.split('').map(char => upsideAlphabet[char.toLowerCase()] || char).reverse().join('');
      }
    },
    {
      id: 'sparkle-star',
      name: 'Sparkle Star Elegant ✨',
      category: 'decoration',
      transform: (txt) => {
        const boldText = unicodeMap(txt, 0x1D5EE, 0x1D608);
        return `✨ ${boldText} ✨`;
      }
    },
    {
      id: 'heart-romance',
      name: 'Heart Romance 💖',
      category: 'decoration',
      transform: (txt) => {
        const serifText = unicodeMap(txt, 0x1D4D0, 0x1D4EA);
        return `💖 ${serifText} 💖`;
      }
    },
    {
      id: 'wingdings-bracket',
      name: 'Wingdings Bio Crown ꧁...꧂',
      category: 'social',
      transform: (txt) => {
        const sanText = unicodeMap(txt, 0x1D400, 0x1D41A);
        return `꧁༒ ${sanText} ༒꧂`;
      }
    },
    {
      id: 'cyberpunk-matrix',
      name: 'Cyberpunk Matrix ⚔️',
      category: 'social',
      transform: (txt) => `[ ${txt.toUpperCase().split('').join(' ')} ] ⚔️`
    },
    {
      id: 'vaporwave-glitch',
      name: 'Vaporwave Grid 彡',
      category: 'social',
      transform: (txt) => `彡 ${txt.toUpperCase().split('').join(' ')} 彡`
    },
    {
      id: 'instagram-profile-bio',
      name: 'Instagram Elegant Bio 𖤍',
      category: 'social',
      transform: (txt) => {
        const formatted = unicodeMap(txt, 0x1D4D0, 0x1D4EA);
        return `𖤍 ${formatted} 𖤍`;
      }
    },
    {
      id: 'facebook-status-bold',
      name: 'Facebook Impact Accent 🌟',
      category: 'social',
      transform: (txt) => `🌟 【${unicodeMap(txt, 0x1D5EE, 0x1D608)}】 🌟`
    },
    {
      id: 'threads-minimalist',
      name: 'Threads Minimalist Circle •',
      category: 'social',
      transform: (txt) => {
        const monoclose = unicodeMap(txt, 0x1D670, 0x1D68A);
        return `• ${monoclose} •`;
      }
    },
    {
      id: 'arrows-pointing',
      name: 'Arrow Sidebars 箭 ➢',
      category: 'decoration',
      transform: (txt) => `➢ ${txt} ➢`
    },
    {
      id: 'diamond-encased',
      name: 'Diamond Encased ◈',
      category: 'decoration',
      transform: (txt) => `◈ ${unicodeMap(txt, 0x1D538, 0x1D552)} ◈`
    }
  ];

  // Dynamic SEO Page Settings & Structured FAQ Scheme injection
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

    // Schema FAQ injection
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

    const scriptId = "fancy-text-json-ld";
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

  // Handle live interaction copy action
  const handleCopyStyle = async (id: string, textOutput: string) => {
    if (!textOutput) return;
    try {
      await navigator.clipboard.writeText(textOutput);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (err) {
      console.warn('Unable to copy fancy style: ', err);
    }
  };

  const handleClear = () => {
    setHistory(inputText);
    setInputText('');
  };

  const handleUndo = () => {
    if (history !== null) {
      const current = inputText;
      setInputText(history);
      setHistory(current);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Filter styles based on category selector and search query
  const filteredStyles = styles.filter(style => {
    const matchesCategory = activeCategoryFilter === 'all' || style.category === activeCategoryFilter;
    const matchesQuery = style.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         style.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/fancy-text-generator' && t.id !== 'fancy-text-generator').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="fancy-text-page">
      {/* Dynamic Graphic Background Details */}
      <div className="glow-accent top-14 left-10"></div>
      <div className="glow-accent bottom-32 right-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold font-sans">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            id="breadcrumbs-home"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <button 
            onClick={() => onNavigateToTool('tools')}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400 font-sans">Fancy Text Generator</span>
        </div>

        {/* Header Block Rows */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3 font-sans">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Sparkles className="w-7 h-7 text-indigo-600" />
              </span>
              Fancy Text Generator Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Generate visual, unique custom fonts for Instagram biografies, Facebook updates, Threads captions, and WhatsApp messages in one click.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Type className="w-4 h-4 text-pink-500 animate-pulse" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Dynamic SEO Block Row */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overscroll-none overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Live Google Search Result Page (SERP) Mockup
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5 font-mono">
                <span>https://texttoolkithub.com/</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/fancy-text-generator</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-sans">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* RAW CONTROL INPUT PORTAL */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3 text-xs font-extrabold uppercase tracking-widest text-slate-450 dark:text-slate-400">
            <span>Input Your Custom Text Row</span>
            {history !== null && (
              <button
                onClick={handleUndo}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 pointer-events-auto cursor-pointer"
                id="btn-undo"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Restore Previous
              </button>
            )}
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Start drafting your text sequence here (e.g., Cool Bio Status)..."
              className="w-full p-6 text-base md:text-lg border-0 outline-none text-slate-800 dark:text-slate-100 bg-transparent font-sans"
              id="fancy-text-input-field"
            />

            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Standard Character Weight: <strong className="text-slate-700 dark:text-slate-200">{inputText.length} letters</strong></span>

              <button
                onClick={handleClear}
                disabled={!inputText}
                className="p-1 px-3.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-450 hover:text-rose-600 rounded-lg transition disabled:opacity-30 cursor-pointer"
                id="btn-clear"
              >
                Clear Input
              </button>
            </div>
          </div>
        </div>

        {/* SYSTEM SEARCH BAR AND CATEGORY TABS FILTRATION */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-5 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            
            {/* Category selection tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 w-fit">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeCategoryFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                id="tab-filter-all"
              >
                All Styles ({styles.length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('unicode')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeCategoryFilter === 'unicode' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                id="tab-filter-unicode"
              >
                Unicode Fonts
              </button>
              <button
                onClick={() => setActiveCategoryFilter('decoration')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeCategoryFilter === 'decoration' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                id="tab-filter-decoration"
              >
                Decorated Frames
              </button>
              <button
                onClick={() => setActiveCategoryFilter('social')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${activeCategoryFilter === 'social' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                id="tab-filter-social"
              >
                Social Networks
              </button>
            </div>

            {/* Live Search style option */}
            <div className="relative min-w-[240px]">
              <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search styles (e.g. bold, bubble)..."
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-indigo-500 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200 transition shadow-inner"
                id="fancy-style-search"
              />
            </div>

          </div>
        </div>

        {/* FANCY MULTILINE STYLES OUTPUT CONTAINER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16" id="stylish-font-outputs-grid">
          {filteredStyles.map((style) => {
            // Apply safety transformations guard
            const activeText = inputText.trim() || 'Sample Text';
            const converted = style.transform(activeText);
            const isCopied = copiedId === style.id;

            return (
              <div
                key={style.id}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50/40 dark:hover:bg-slate-950/70 p-5 rounded-3xl transition-all duration-300 flex flex-col justify-between shadow-sm relative group hover:border-indigo-400 dark:hover:border-indigo-500"
                id={`style-card-${style.id}`}
              >
                <div className="flex items-center justify-between gap-4 mb-3">
                  <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-400 bg-slate-100/50 dark:bg-slate-900 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Hash className="w-3 h-3 text-indigo-500" /> {style.category}
                  </span>

                  <span className="text-xs font-bold text-slate-700 dark:text-slate-350">{style.name}</span>
                </div>

                {/* Styled Output block */}
                <div className="py-4 my-2 px-4 rounded-2xl bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-900/60 font-medium text-slate-900 dark:text-slate-100 break-all select-all select-none min-h-[58px] flex items-center text-lg">
                  {converted}
                </div>

                <div className="flex items-center justify-between gap-4 mt-1.5">
                  <div className="flex items-center gap-3">
                    <Instagram className="w-3.5 h-3.5 text-slate-300 group-hover:text-pink-500 transition-colors" />
                    <Facebook className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    <Twitter className="w-3.5 h-3.5 text-slate-300 group-hover:text-sky-500 transition-colors" />
                  </div>

                  <button
                    onClick={() => handleCopyStyle(style.id, converted)}
                    className={`px-4.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold transition cursor-pointer ${isCopied ? 'bg-emerald-600 text-white shadow-sm' : 'border border-indigo-200 dark:border-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400'}`}
                    id={`btn-copy-${style.id}`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Text
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredStyles.length === 0 && (
            <div className="col-span-full text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl" id="empty-search-fallback">
              <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-bold text-slate-600 dark:text-slate-400">No fancy styles found match other your search string.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategoryFilter('all');
                }}
                className="text-xs text-indigo-600 hover:underline mt-2 font-bold cursor-pointer"
              >
                Reset Filters & Search Query
              </button>
            </div>
          )}
        </div>

        {/* LONG-FORM COMPREHENSIVE SEO CONTENT SECTIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
          
          {/* Article 1: What is Fancy Text */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">Unicode Chronicles</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              What is Fancy Text and How it Works
            </h2>
            <div className="space-y-4">
              <p>
                A <strong className="font-bold">Fancy Text Generator</strong> converts standard writing and keyboard characters into dynamic aesthetic symbols. These symbols correspond to distinct visual character blocks inside the vast <strong>Unicode standard system</strong>. 
              </p>
              <p>
                Contrary to general fonts (like Arial or Calibri) which demand styling templates or CSS, unicode-styled letters are standalone mathematical and linguistic entities. This means when you copy and paste them into your Instagram bio, WhatsApp profiles, YouTube status rails or X posts, they look exactly identical on mobile, tablets, or desktop browsers without converting back to regular text.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              A Closer Look at Unicode Blocks
            </h3>
            <p className="leading-relaxed">
              Unicode defines unique codepoint locations for over 30,000 distinct symbol patterns. These include Gothic/Fraktur families, double-struck blackboard designs, subscripts, circled bubble digits, and brackets. Our generator operates by detecting code offsets and swapping active characters live in under 5 milliseconds.
            </p>
          </div>

          {/* Article 2: How to Use */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600">Execution Guides</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              How to Generate and Paste Custom Social Media Bios
            </h2>
            <div className="space-y-4">
              <p>Copy-pasting fancy unicode text characters into social media applications is immediate:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Aquire and Type Your Message</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Input your bio text, system status, or promotional headline in our raw input field above.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">Filter and Refine Styles</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Filter styles by browsing between Unicode scripts, fancy borders, or social bios. Use live search parameters to locate precise alignments.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-200 text-xs">One-Click Clipboard Copy</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Hit the "Copy Text" button. Open your target application profile, and click paste parameter to lock in your custom layout.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800 animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white font-sans">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans font-medium">
                FAQ Answers regarding compatibility, symbol representations, and system rendering.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id}
                    onClick={() => toggleFaq(faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer select-none transition-all duration-200"
                    id={`fancy-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                      <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-3.5 flex animate-in fade-in slide-in-from-top-1 duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Companion Tools Layout Shelf */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6 font-sans">
            Explore Companion Text Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`related-card-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-4 block">
                  Open Utility &rarr;
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
