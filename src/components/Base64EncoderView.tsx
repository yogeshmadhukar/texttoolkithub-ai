import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Link2, 
  Globe, 
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
  Sliders,
  Settings,
  AlertCircle,
  Download,
  ShieldCheck
} from 'lucide-react';

interface Base64EncoderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function Base64EncoderView({ onNavigateToTool, onNavigateHome }: Base64EncoderViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [validationInfo, setValidationInfo] = useState<string | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Custom configuration modes
  const [urlSafe, setUrlSafe] = useState(false);
  const [stripPadding, setStripPadding] = useState(false);

  // SEO Parameters
  const seoTitle = "Base64 Encoder Online - Convert Text to Base64 Free";
  const seoDescription = "Encode text into Base64 format instantly using our free online Base64 Encoder. Compliant, safe, and operates locally.";

  const faqs = [
    {
      id: 1,
      question: "What is Base64 Encoding?",
      answer: "Base64 encoding is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation. In simpler terms, it takes 8-bit binary characters and restructures them into 6-bit chunks, resulting in a predictable set of 64 standard characters (A-Z, a-z, 0-9, +, and /) that can be easily stored or transmitted across systems."
    },
    {
      id: 2,
      question: "How does Base64 encoding work?",
      answer: "Base64 works by dividing every three bytes (24 bits) of raw input into four 6-bit blocks. Each of these 6-bit blocks holds a value between 0 and 63, which direct-maps to a index value in the standard Base64 alphabet sequence. If the final block of input holds less than three bytes, '=' padding characters are appended to the tail of the encoded string to satisfy the 24-bit block alignment."
    },
    {
      id: 3,
      question: "Why do we use Base64?",
      answer: "Systems such as Email (SMTP), URL query parameters, and XML/JSON documents were historically designed to transmit text data and can experience corrupted characters when sending raw binary files (like images, keys, or attachments). Base64 converts binary assets into safe string arrays, ensuring they survive routing transitions unaltered."
    },
    {
      id: 4,
      question: "What is the URL Safe Base64 encoding option?",
      answer: "The URL-safe variation replaces standard '+' and '/' characters with '-' and '_' respectively. This prevents web servers and routing engines from misinterpreting those values as directory dividers, plus spaces, or query splitters, enabling direct insertion into URLs without percent-encoding."
    },
    {
      id: 5,
      question: "Is there any risk of exposing my sensitive codes or text?",
      answer: "None! TextToolkitHub values your absolute confidentiality. All converters, parsers, and encoders are processed locally inside your web browser. No network requests are made, which means your text never exits your system."
    }
  ];

  // Dynamic SEO Setup & Schema FAQ JSON-LD script injection
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

    // Schema FAQ Content Injection
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

    const scriptId = "base64-encoder-json-ld";
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

  // Standard Base64 live encoder controller
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      setValidationInfo(null);
      return;
    }

    try {
      // In JS, btoa takes a binary-encoded string. To support UTF-8 correctly (emojis, letters, non-ASCII):
      const utf8Bytes = new TextEncoder().encode(inputText);
      let binaryString = '';
      for (let i = 0; i < utf8Bytes.length; i++) {
        binaryString += String.fromCharCode(utf8Bytes[i]);
      }
      
      let base64 = btoa(binaryString);

      // URL Safe check
      if (urlSafe) {
        base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');
      }

      // Strip padding check
      if (stripPadding) {
        base64 = base64.replace(/=+$/, '');
      }

      setOutputText(base64);
      setValidationInfo(null);
    } catch (err) {
      console.error(err);
      setValidationInfo("An unexpected error occurred during Base64 rendering. Make sure the text length fits memory limits.");
    }
  }, [inputText, urlSafe, stripPadding]);

  // Actions
  const handleLoadSample = () => {
    saveToHistory();
    setInputText(`TextToolkitHub: Pure client-side privacy. 🛠️✨\nURL: https://texttoolkithub.com/tools/base64-encoder\nKey Parameters:\n- Standard RFC 4648\n- Safe URL encoding\n- Fast offline TXT downloads`);
  };

  const saveToHistory = () => {
    setHistory({ input: inputText, output: outputText });
  };

  const handleClear = () => {
    saveToHistory();
    setInputText('');
    setOutputText('');
    setValidationInfo(null);
  };

  const handleUndo = () => {
    if (history) {
      const prevInput = inputText;
      const prevOutput = outputText;
      setInputText(history.input);
      setOutputText(history.output);
      setHistory({ input: prevInput, output: prevOutput });
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to copy output: ', err);
    }
  };

  const handleDownloadTxt = () => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'base64_encoded_output.txt';
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 150);
    } catch (err) {
      console.error('File generation error: ', err);
    }
  };

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Exclude current tool from relates list
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/base64-encoder').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200 animate-fade-in" id="base64-encoder-page">
      {/* Dynamic visual accents */}
      <div className="glow-accent top-20 right-10"></div>
      <div className="glow-accent bottom-20 left-10"></div>

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
            onClick={onNavigateHome}
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-indigo-600 dark:text-indigo-400">Base64 Encoder</span>
        </div>

        {/* Header Title Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Link2 className="w-7 h-7 text-indigo-600" />
              </span>
              Base64 Encoder Online
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed font-sans">
              Encode text strings, numbers, or code structures safely into standardized RFC-compliant Base64 parameters instantly. 
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* Dynamic SEO snippet mockup */}
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
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">tools/base64-encoder</span>
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-700 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Configuration Panel Grid */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-950/40 p-6 mb-8 shadow-sm">
          <div className="flex flex-col gap-1 mb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
              <Sliders className="w-4 h-4 text-indigo-500" /> Encoder Configuration Options
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium">Fine-tune characters layout rules and padding strings for your production environment standards.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Control: URL Safe */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 dark:text-slate-400 font-sans">Alphabet Characters</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-200 transition">
                <input
                  type="checkbox"
                  checked={urlSafe}
                  onChange={(e) => setUrlSafe(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Use URL Safe characters (- and _)
              </label>
            </div>

            {/* Control: Strip padding */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-450 dark:text-slate-400 font-sans">Output Padding</span>
              <label className="flex items-center gap-2 px-3.5 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-50 hover:dark:bg-slate-800 select-none text-xs font-bold text-slate-700 dark:text-slate-100 transition">
                <input
                  type="checkbox"
                  checked={stripPadding}
                  onChange={(e) => setStripPadding(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                />
                Omit trailing '=' padding markers
              </label>
            </div>

            {/* Status indicators */}
            <div className="p-3.5 bg-indigo-50/45 dark:bg-slate-900/40 border border-indigo-100/40 dark:border-slate-800 rounded-2xl flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
              <Settings className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-750 dark:text-slate-350 block">Output Standard:</span>
                {urlSafe ? 'Generates web-safe string formats replacing "+" and "/" characters.' : 'Appends standard base alphabet representations with RFC byte groups.'}
              </div>
            </div>

          </div>
        </div>

        {/* Conversion Panel Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* RAW TEXT INPUT */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> Raw Text Input String
              </span>

              <button 
                onClick={handleLoadSample}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                id="btn-sample-load"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Load Sample Paragraph
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all duration-300">
              <textarea
                value={inputText}
                onChange={(e) => {
                  saveToHistory();
                  setInputText(e.target.value);
                }}
                placeholder="Type or paste any characters to encode..."
                className="w-full p-5 min-h-[250px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-y font-sans leading-relaxed"
                id="base64-encoder-input-textarea"
                aria-label="Raw text to encode in Base64"
              />

              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Characters: <strong className="text-slate-700 dark:text-slate-200">{inputText.length}</strong></span>

                <div className="flex items-center gap-2">
                  {history && (
                    <button
                      onClick={handleUndo}
                      className="text-xs font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-0.5 cursor-pointer font-sans"
                      id="btn-undo"
                    >
                      <RotateCcw className="w-3 h-3" /> Restore Input
                    </button>
                  )}

                  <button
                    onClick={handleClear}
                    disabled={!inputText}
                    className="p-1 px-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-450 hover:text-rose-600 rounded-lg transition disabled:opacity-35 cursor-pointer font-sans"
                    id="btn-clear"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* BASE64 ENCODED OUTPUT */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 flex items-center gap-1.5 font-sans">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Base64 Encoded Format Output
              </span>

              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-lg flex items-center gap-1 font-sans">
                <RefreshCw className="w-3 h-3 animate-spin duration-[4000ms]" /> Encoded Live
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
              <div className="p-5 min-h-[250px] flex flex-col justify-between">
                {validationInfo && (
                  <div className="flex items-start gap-2.5 p-3.5 mb-3 bg-red-50 dark:bg-rose-950/20 border border-red-100 dark:border-rose-900 rounded-2xl text-xs text-red-700 dark:text-rose-400 select-none">
                    <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>{validationInfo}</div>
                  </div>
                )}
                
                {outputText ? (
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Encoded strings will output here..."
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                    className="w-full h-[180px] border-0 outline-none text-base text-emerald-700 dark:text-emerald-400 bg-transparent resize-none font-mono tracking-all break-all leading-relaxed"
                    id="base64-encoder-output-textarea"
                    aria-label="Base64 encoded output string"
                  />
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500 italic block my-auto text-center font-sans">
                    Your Base64 converted tokens will populate live here...
                  </span>
                )}
              </div>

              <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap gap-3 items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Output Length: <strong className="text-slate-705 dark:text-slate-200">{outputText.length}</strong>
                </span>

                <div className="flex gap-2 shrink-0">


                  <button
                    onClick={handleCopy}
                    disabled={!outputText}
                    className={`px-5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-35 cursor-pointer font-sans ${copied ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md' : 'border border-indigo-200 dark:border-slate-800 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 dark:bg-slate-900 dark:hover:bg-indigo-950/25 dark:text-indigo-400'}`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Base64!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Result
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* LONG-FORM SEO ARTICLES & DOCUMENTATIONS */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-350 leading-relaxed text-sm">
          
          {/* Column 1: Explanatory background details */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">Developer Handbook</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              What is Base64 Encoding?
            </h2>
            <div className="space-y-4 font-sans">
              <p>
                In standard computer memory architectures, data is stored as raw 8-bit binary structures called bytes. When transferring files (like images, zip packets, or database keys) across legacy protocols like Email (SMTP) or URL parameter formats which were designed to handle simple 7-bit ASCII text, some characters can be stripped or misconstrued.
              </p>
              <p>
                That is why <strong className="font-bold text-slate-850 dark:text-white">Base64 Encoding</strong> is standard industry practice. It converts binary bytes into safe subsets of ASCII characters (A-Z, a-z, 0-9, and two accessory symbols). This guarantees that files stay unaltered and completely clean.
              </p>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              How the Encoding Logic Works Below the Hood
            </h3>
            <div className="space-y-3 font-sans">
              <p>When you input characters in our generator, the browser executes this sequence:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Byte Extraction:</strong> Reads characters as a byte array sequence.</li>
                <li><strong>Bit Splitting:</strong> Pairs three groups of bytes (24 bits) and restructures them into four 6-bit allocations.</li>
                <li><strong>Alphabet Translation:</strong> Maps the value of each 6-bit allocation (holding values up to 63) to index positions in the alphabet.</li>
                <li><strong>Padding Check:</strong> Appends '=' signs if trailing bytes do not align perfectly with bit groups, indicating structural length.</li>
              </ul>
            </div>
          </div>

          {/* Column 2: Step-by-Step Operation Guide */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-600 font-sans">User Instructions</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              Key Use Cases & Quick Guidelines
            </h2>
            <div className="space-y-4 font-sans">
              <p>Our tool runs fully client-side and can be used across multiple business settings:</p>
              
              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Pasting Web Credentials Safely</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quickly encode Basic Auth tokens (such as matching username:password formats) to insert safely into developer HTTP Header headers.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Embedding Data URIs in HTML</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Translate compact svg styles or configuration variables into inline parameters containing Base64 markers.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="w-5.5 h-5.5 bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-mono text-xs font-bold flex items-center justify-center rounded-full mt-0.5 shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs">Generating Base64URL Strings</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Toggle our URL Safe parameter setting to safely insert token metadata directly inside query links easily.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-medium text-slate-900 dark:text-white mt-8 mb-3 font-sans">
              Aesthetic Privacy Guarantee
            </h3>
            <div className="p-4 bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl flex items-start gap-3 text-xs tracking-wide">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-800 dark:text-emerald-350 block">Compliant with Local Dev Security Laws:</strong>
                Our app utilizes zero cloud components. UTF-8 conversions and calculations happen sandbox-isolated inside your device memory context. Data is 100% private.
              </div>
            </div>
          </div>

        </section>

        {/* Structured FAQ Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 animate-fade-in">
              <HelpCircle className="w-10 h-10 text-indigo-600 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white font-sans">
                Frequently Asked FAQ Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-sans">
                Have auxiliary thoughts regarding padding configurations, binary data capabilities, or browser limitations? Here are answers.
              </p>
            </div>

            <div className="flex flex-col gap-4 font-sans">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div 
                    key={faq.id}
                    onClick={() => toggleFaq(faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer select-none transition-all duration-200"
                    id={`base64-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-slate-850 dark:text-slate-100 text-sm sm:text-base leading-snug">
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
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800 font-sans">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
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
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mt-4 block">
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
