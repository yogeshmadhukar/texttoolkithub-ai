import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  HelpCircle,
  Sparkles,
  Info,
  Trash2,
  Settings,
  Download,
  Dices,
  Clipboard,
  FileCode
} from 'lucide-react';

interface UuidGuidGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function UuidGuidGeneratorView({ onNavigateToTool, onNavigateHome }: UuidGuidGeneratorViewProps) {
  const [uuids, setUuids] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(10);
  const [useUppercase, setUseUppercase] = useState<boolean>(false);
  const [useHyphens, setUseHyphens] = useState<boolean>(true);
  const [useBraces, setUseBraces] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  // SEO parameters
  const seoTitle = "Bulk UUID GUID Generator V4 - Cryptosecure Checksum Generator";
  const seoDescription = "Generate cryptographically secure RFC 4122 compliant Version 4 UUIDs or GUIDs in bulk. Customize hyphens, braces, capitals, and download lists offline.";

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

    // Schema JSON-LD Injection
    const schemaContent = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are the UUIDs generated here cryptographically secure?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, absolutely! The generator utilizes the standard browser 'window.crypto.getRandomValues()' API, producing cryptographically secure, high-entropy RFC 4122 compliant Version 4 identifiers."
          }
        },
        {
          "@type": "Question",
          "name": "What is the maximum bulk size for GUID generation?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can generate up to 500 UUIDs or GUIDs in a single batch, then export them cleanly as individual items or export the entire list as a standard TXT layout file."
          }
        },
        {
          "@type": "Question",
          "name": "What customization constraints are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our platform supports toggling characters to UPPERCASE formats, adding standard bracket wraps, or stripping hyphens completely to meet custom database or programming syntax standards."
          }
        }
      ]
    };

    const scriptId = "uuid-generator-json-ld";
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

  // Secure UUID generator logic
  const generateSingleUuid = (): string => {
    // RFC4122 Version 4 Guid template using secure crypto API
    const arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);

    // Set UUID v4 bits:
    arr[6] = (arr[6] & 0x0f) | 0x40; // set bits 12-15 to 0100 (v4 flag)
    arr[8] = (arr[8] & 0x3f) | 0x80; // set bits 6-7 to 10 (variant flag)

    const hex: string[] = [];
    for (let i = 0; i < 16; i++) {
      hex.push(arr[i].toString(16).padStart(2, '0'));
    }

    let uuidStr = '';
    if (useHyphens) {
      uuidStr = `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
    } else {
      uuidStr = hex.join('');
    }

    if (useUppercase) {
      uuidStr = uuidStr.toUpperCase();
    }

    if (useBraces) {
      uuidStr = `{${uuidStr}}`;
    }

    return uuidStr;
  };

  const handleGenerateList = () => {
    const qty = Math.max(1, Math.min(500, quantity));
    const result: string[] = [];
    for (let i = 0; i < qty; i++) {
      result.push(generateSingleUuid());
    }
    setUuids(result);
  };

  // Generate automatically on startup
  useEffect(() => {
    handleGenerateList();
  }, [quantity, useUppercase, useHyphens, useBraces]);

  const handleCopySingle = async (val: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(val);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch {}
  };

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    try {
      const allText = uuids.join('\n');
      await navigator.clipboard.writeText(allText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {}
  };

  const handleDownloadTxt = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuid_guid_list_${quantity}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      id: 1,
      question: "What is a Version 4 UUID (GUID)?",
      answer: "A Version 4 Universally Unique Identifier is a 128-bit key generated entirely using random numbers. It offers 5.3 x 10^36 possible combinations, which is so massive that the possibility of a collision (generating identical IDs twice) is mathematically negligible, making them ideal for transaction keys, database keys, and tracking IDs."
    },
    {
      id: 2,
      question: "Are these UUIDs cryptographically secure?",
      answer: "Yes, our engine integrates the standard W3C Web Cryptography specification (`crypto.getRandomValues`) to retrieve highly secure pseudo-random entropy values provided natively by your operating system, ensuring standard cryptographic safety margins."
    },
    {
      id: 3,
      question: "Why would I specify non-hyphenated formats?",
      answer: "Certain microservices, hash maps, index buffers, and database architectures (like MongoDB ObjectIDs) store raw keys in compressed hexadecimal arrays without dashed separators to optimize storage blocks or network speed."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="uuid-generator-root">
      
      {/* Back to index title block */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          Cryptographically Secure <span className="text-indigo-600 dark:text-indigo-400">Bulk UUID & GUID Generator</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Produce high-entropy Version 4 RFC-compliant unique IDs. Choose dashes, curly brackets, upper case letters, configure custom list counts, and download arrays instantly offline.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Config settings */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Settings className="w-4 h-4 text-indigo-500" />
            Config Parameters
          </h3>

          <div className="space-y-4">
            {/* Quantity Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase font-mono">Bulk Quantity</span>
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">{quantity} strings</span>
              </div>
              <input 
                type="range"
                min={1}
                max={150}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full accent-indigo-600 bg-slate-100 dark:bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Formatting settings checkboxes */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-100/50 dark:border-slate-700">
              <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 font-mono">Output Rules</span>
              
              {/* Capitals checkbox */}
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox"
                  id="chk-upper"
                  checked={useUppercase}
                  onChange={(e) => setUseUppercase(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="chk-upper" className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                  Uppercase Characters (A-F)
                </label>
              </div>

              {/* Hyphens checkbox */}
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox"
                  id="chk-dashes"
                  checked={useHyphens}
                  onChange={(e) => setUseHyphens(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="chk-dashes" className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                  Include Dash separators (-)
                </label>
              </div>

              {/* Braces checkbox */}
              <div className="flex items-center gap-2.5">
                <input 
                  type="checkbox"
                  id="chk-braces"
                  checked={useBraces}
                  onChange={(e) => setUseBraces(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <label htmlFor="chk-braces" className="text-xs font-bold text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                  Wrap in Curly Braces {"{}"}
                </label>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
              <button
                onClick={handleGenerateList}
                className="flex-grow flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-xs font-extrabold transition-colors shadow-sm"
              >
                <Dices className="w-3.5 h-3.5" />
                Re-Generate
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key listings Display */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Generated ID Array</span>
            <div className="flex gap-3">
              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {copiedAll ? <Check className="w-3 h-3 text-emerald-500" /> : <Clipboard className="w-3 h-3" />}
                {copiedAll ? 'Copied list!' : 'Copy entire list'}
              </button>
              <button
                onClick={handleDownloadTxt}
                className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline border-l border-slate-100 dark:border-slate-700 pl-3"
              >
                <Download className="w-3 h-3" />
                Download TXT
              </button>
            </div>
          </div>

          {/* List display pane */}
          <div className="max-h-[380px] overflow-y-auto pr-1 space-y-2 font-mono text-xs">
            {uuids.map((uuid, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-indigo-50/30 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-bold select-none w-5 text-right">{idx + 1}.</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 select-all tracking-wide">{uuid}</span>
                </div>
                <button
                  onClick={() => handleCopySingle(uuid, idx)}
                  className="text-[10px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold py-1 px-2 rounded-lg transition"
                >
                  {copiedIndex === idx ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Guide FAQ sections */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-sans flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
