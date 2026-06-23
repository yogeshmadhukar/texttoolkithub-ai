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
    },
    {
      id: 4,
      question: "What is the difference between UUID and GUID?",
      answer: "A GUID (Globally Unique Identifier) is Microsoft's implementation of the standardized UUID (Universally Unique Identifier) specification. While they represent the exact same 128-bit format structure, 'GUID' is common in Enterprise Microsoft ecosystems while 'UUID' is standard in Unix/web environments."
    },
    {
      id: 5,
      question: "How does a Version 1 UUID differ from Version 4?",
      answer: "Version 1 UUIDs are generated deterministically using the physical MAC address of the host machine and a precise chronological timestamp. Version 4 is entirely derived from pseudo-random noise, which prevents the leakage of hardware identities over the network."
    },
    {
      id: 6,
      question: "What are the exact odds of generating duplicate UUIDs?",
      answer: "To trigger a 50% probability of a collision, you would need to generate over 1 billion UUIDs every single second for approximately 85 consecutive years. It is mathematically virtually impossible to encounter a duplicate in production."
    },
    {
      id: 7,
      question: "Where are UUIDs typically used in modern backends?",
      answer: "UUIDs are used as decoupled primary keys inside distributed databases, unique transaction IDs, session keys, storage filename hashes, and message queue handles, removing any coordination constraints."
    },
    {
      id: 8,
      question: "Are UUIDs index-safe inside relational databases?",
      answer: "Yes, but they are larger than standard auto-incrementing integers (16 bytes vs 4 or 8 bytes) and their random distribution can lead to page fragmentation in b-tree indexes. You can mitigate this by storing UUIDs in native UUID data types."
    },
    {
      id: 9,
      question: "Does TextToolkitHub save or track my generated keys?",
      answer: "No. The UUID generation runs entirely on-premise inside your browser memory using cryptographically secure client APIs. No network calls or logs are triggered, keeping your operational keys completely private."
    },
    {
      id: 10,
      question: "Why would I wrap UUIDs in curly braces?",
      answer: "Curly brace wrapping (for example, `{xxxxxxxx-xxxx...}`) is a legacy convention requirement inside registry configurations, active directory setups, and classic Windows COM/OLE programming modules."
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

      {/* DETAILED EDUCATIONAL & SEO RESOURCE MANUAL */}
      <section className="prose max-w-none pt-16 border-t border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-sans space-y-12">
        
        {/* Introduction & What is this tool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-650 dark:text-indigo-400 font-mono leading-none block">System Architecture</span>
            <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-0" id="uuid-intro">
              Introduction to Universally Unique Identifiers (UUID)
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              In centralized database designs, tables typically key records using sequential, auto-incrementing integers (e.g., 1, 2, 3...). While simple, this approach causes issues in distributed microservices, multi-region clusters, and decoupled offline clients. If two independent nodes write new client entries simultaneously, both assign identifier 4, creating duplicate collisions when records merge. Solving this requires decentralized unique key assignment.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              The solution is the <strong>Universally Unique Identifier (UUID / GUID)</strong>, a 128-bit key format designed to be generated independently on separate systems without a central coordinating server.
            </p>
          </div>
          
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white mt-0 font-sans" id="uuid-what-is">
              What is this Tool?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This interactive utility of TextToolkitHub is a professional high-entropy GUID generator dashboard. It compiles arrays of standard Version 4 keys, offering options for uppercase conversions, hyphen stripping, and native curly brace brackets. Leveraging the browser's local Web Cryptography module ensures high-quality randomness and secure sandbox operations without network leaks.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              When verifying records in your logs, you can also translate time coordinates with our <a href="/unix-timestamp" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Unix Timestamp Converter</a> or format JSON structures with our <a href="/yaml-json" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">YAML ↔ JSON Converter</a> to maintain clean configurations.
            </p>
          </div>
        </div>

        {/* Guide to Using the System */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-10 space-y-6">
          <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="uuid-how-to">
            How to Compile and Export Bulk UUID Lists
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Generating high-entropy bulk identifier arrays is simple. Follow this step-by-step developer guide:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">01</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Select Quantity</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Specify how many unique UUID values you need in your list (from a single value up to 500 in one batch).</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">02</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Configure Parameters</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Toggle switches for uppercase transformations, stripping separator dashes, or adding wrapping curly braces.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">03</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Verify Identifiers</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inspect the generated values in the scrolling array preview on the right. Copy individual IDs on-the-fly.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">04</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Export TXT File</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Click the 'Download TXT' action, or copy the entire list to your clipboard to paste inside your codebase.</p>
            </div>
          </div>
        </div>

        {/* Benefits & Use Cases & Real World Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="uuid-benefits">
              Benefits & Key Use Cases
            </h3>
            <ul className="text-sm space-y-3.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Decoupled Clients:</strong> Offline mobile applications generate localized UUID primary keys upon client interaction, syncing to servers later without duplicate collisions.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Crawl Mitigation:</strong> Using random UUIDs as public URL routes instead of predictable serial values, preventing competitors from crawling your customer pages sequentially.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Microservice Correlation:</strong> Distributed systems stamp cross-network payloads with a single transaction UUID to trace processing times in centralized logs.
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="uuid-mechanics">
              Format Anatomy Breakdown
            </h3>
            <div className="rounded-2xl border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 p-5 font-mono text-xs text-slate-600 dark:text-slate-400 space-y-3">
              <span className="block text-indigo-600 dark:text-indigo-400">UUIDv4 Hexadecimal Block Structure:</span>
              <p className="leading-relaxed bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-3.5 rounded-xl text-[10.5px]">
                f81d4fae - 7dec - <span className="font-bold text-indigo-500">4</span>d13 - <span className="font-bold text-[#10b981]">8</span>e08 - 18751d0037f0
              </p>
              <ul className="text-[10px] space-y-1 pl-3.5 list-disc leading-relaxed text-slate-500 dark:text-slate-400">
                <li><strong>f81d4fae (8 hex):</strong> Low-entropy character block.</li>
                <li><strong>7dec (4 hex):</strong> Mid-entropy character block.</li>
                <li><strong>4d13 (4 hex):</strong> High-entropy block with first digit <strong className="text-indigo-500 font-bold">4</strong> defining the UUID Version.</li>
                <li><strong>8e08 (4 hex):</strong> High-entropy block with first digit <strong className="text-[#10b981] font-bold">8, 9, a, or b</strong> defining RFC 4122 Variant.</li>
                <li><strong>18751d0037f0 (12 hex):</strong> Continuous high-entropy node block.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Common Mistakes & Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="uuid-mistakes">
              Common Key Pitfalls
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mishandling string sizes and database structures can negatively impact index retrieval performance:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-550 dark:text-slate-450 space-y-2">
              <li><strong>Plain String Storage:</strong> Storing raw 36-character UUID strings inside VARCHAR columns instead of the database's native, optimized 16-byte binary types.</li>
              <li><strong>Auto-Increment Replacements:</strong> Indiscriminately replacing sorting integers with random UUIDs across massive transaction tables, increasing clustered index fragmentation.</li>
              <li><strong>Low-Entropy Math.random():</strong> Relying on standard math random generators instead of the modern, high-entropy Crypto API, raising collision risks in large datasets.</li>
              <li><strong>Stripping Sep-Checks:</strong> Stripping dashes before storage and then writing custom regex format handlers, creating operational overhead.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="uuid-best-practices">
              Industry Best Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Use Cryptographic APIs</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Always generate UUID blocks using cryptographically high-entropy APIs rather than standard Math.random.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Native Column Types</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Leverage native UUID data types inside modern databases like PostgreSQL or MySQL for storage efficiency.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Stamp Versions Wisely</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Use Version 4 for random client keys. Use Version 5 when you need deterministic hashes from specific names or namespaces.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Lower Case Standardization</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Maintain lowercase representations for UUID strings inside index columns to prevent timezone-like collation mismatches.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

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
