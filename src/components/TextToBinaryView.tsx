import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Binary, 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  Sparkles,
  Sliders,
  FileText,
  Minimize
} from 'lucide-react';

interface TextToBinaryViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type Mode = 'text-to-binary' | 'binary-to-text';
type Format = 'binary' | 'hex' | 'ascii';

export default function TextToBinaryView({ onNavigateToTool, onNavigateHome }: TextToBinaryViewProps) {
  const [mode, setMode] = useState<Mode>('text-to-binary');
  const [format, setFormat] = useState<Format>('binary');
  const [inputText, setInputText] = useState('TextToolkitHub 🛠️');
  const [outputText, setOutputText] = useState('');
  const [delimiter, setDelimiter] = useState<string>(' ');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const seoTitle = "Text to Binary Converter Online | Hex & ASCII Translator";
  const seoDescription = "Convert text to binary, hexadecimal, and ASCII codes, or decode binary bytes back to readable text instantly with our bidirectional offline converter.";

  const faqs = [
    {
      id: 1,
      question: "What is the Text to Binary Converter?",
      answer: "It is a bidirectional computer data translator. It converts standard readable alphabetic characters into binary digits (0s and 1s), Hexadecimal (base 16), or ASCII decimal integers, representing how microchips store text in RAM."
    },
    {
      id: 2,
      question: "How do I decode binary code back to text?",
      answer: "Simply switch the mode toggle to 'Binary to Text', paste your sequence of binary bytes (separated by spaces or commas), select your output format, and the decoder will instantly compute the original English letters."
    },
    {
      id: 3,
      question: "Does the tool handle UTF-8 emojis or non-English text?",
      answer: "Yes! Our engine uses native JavaScript string charCodeAt calculations, which fully supports standard UTF-8 characters, symbols, and emojis, converting them to their correct multi-byte codes."
    },
    {
      id: 4,
      question: "Why use spaces between binary bytes?",
      answer: "Binary is composed of 8-bit bytes (e.g. '01000001'). Without separation delimiters, strings of binary become an unreadable wall of digits. Setting the spacing to 'Space' or 'Comma' separates individual bytes clearly."
    }
  ];

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

    const scriptId = "text-binary-json-ld";
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

  // Conversion logic
  useEffect(() => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    if (mode === 'text-to-binary') {
      try {
        const charCodes: number[] = [];
        for (let i = 0; i < inputText.length; i++) {
          charCodes.push(inputText.charCodeAt(i));
        }

        let result = '';
        if (format === 'binary') {
          result = charCodes.map(code => code.toString(2).padStart(8, '0')).join(delimiter);
        } else if (format === 'hex') {
          result = charCodes.map(code => code.toString(16).toUpperCase().padStart(2, '0')).join(delimiter);
        } else if (format === 'ascii') {
          result = charCodes.map(code => code.toString(10)).join(delimiter);
        }
        setOutputText(result);
      } catch (err: any) {
        setError('Failed to convert text. Please check code formatting.');
      }
    } else {
      // Decode binary/hex/ascii to text
      try {
        const cleanInput = inputText.trim();
        let tokens: string[] = [];

        if (delimiter === ' ') {
          tokens = cleanInput.split(/\s+/);
        } else if (delimiter === ',') {
          tokens = cleanInput.split(',').map(t => t.trim());
        } else {
          // If no delimiter, chunk manually depending on format
          if (format === 'binary') {
            tokens = cleanInput.match(/.{1,8}/g) || [];
          } else if (format === 'hex') {
            tokens = cleanInput.match(/.{1,2}/g) || [];
          } else {
            tokens = [cleanInput]; // Unresolvable
          }
        }

        let decoded = '';
        if (format === 'binary') {
          tokens.forEach(token => {
            if (token) {
              const code = parseInt(token, 2);
              if (isNaN(code)) throw new Error('Invalid binary digit detected');
              decoded += String.fromCharCode(code);
            }
          });
        } else if (format === 'hex') {
          tokens.forEach(token => {
            if (token) {
              const code = parseInt(token, 16);
              if (isNaN(code)) throw new Error('Invalid hex sequence detected');
              decoded += String.fromCharCode(code);
            }
          });
        } else if (format === 'ascii') {
          tokens.forEach(token => {
            if (token) {
              const code = parseInt(token, 10);
              if (isNaN(code)) throw new Error('Invalid ASCII code detected');
              decoded += String.fromCharCode(code);
            }
          });
        }
        setOutputText(decoded);
      } catch (err: any) {
        setError(`Decoding failed: ${err.message || 'Make sure characters align to chosen base format.'}`);
        setOutputText('');
      }
    }
  }, [inputText, mode, format, delimiter]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = mode === 'text-to-binary' ? `encoded_${format}.txt` : 'decoded_text.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleMode = () => {
    setMode(prev => prev === 'text-to-binary' ? 'binary-to-text' : 'text-to-binary');
    setInputText(outputText); // Swap views
  };

  const handleLoadSample = () => {
    if (mode === 'text-to-binary') {
      setInputText('Code is Life 💻✨');
    } else {
      if (format === 'binary') {
        setInputText('01001000 01100101 01101100 01101100 01101111');
      } else if (format === 'hex') {
        setInputText('48 65 6C 6C 6F');
      } else {
        setInputText('72 101 108 108 111');
      }
    }
  };

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/text-to-binary').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="text-to-binary-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button 
            onClick={onNavigateHome}
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            id="back-to-home-btn"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Directory</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Tools</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Text to Binary Converter</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl mb-4 border border-indigo-100 dark:border-indigo-900/30">
            <Binary className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-900 dark:text-white tracking-tight" id="tool-title">
            Text to <span className="font-semibold text-indigo-600 dark:text-indigo-400">Binary Translator</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Convert standard text characters into binary machine code bits, Hex arrays, or ASCII decimals instantly. Bidirectional and secure.
          </p>
        </div>

        {/* Error panel */}
        {error && (
          <div className="mb-6 max-w-5xl mx-auto bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-4 flex items-start gap-3">
            <div className="text-xs text-rose-800 dark:text-rose-300">
              <span className="font-bold">Conversion Warning:</span>
              <p className="mt-0.5 leading-relaxed font-mono">{error}</p>
            </div>
          </div>
        )}

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Settings Sidebar */}
          <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-6">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Translation Options
              </h3>

              {/* Mode Switch Button */}
              <button
                onClick={handleToggleMode}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer mb-5 text-xs"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{mode === 'text-to-binary' ? 'Text ➔ Code Bits' : 'Code Bits ➔ Text'}</span>
              </button>

              {/* Format Select */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Code representation
                  </label>
                  <div className="grid grid-cols-1 gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
                    <button
                      onClick={() => setFormat('binary')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer text-left transition-all ${format === 'binary' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                    >
                      Binary (Base 2)
                    </button>
                    <button
                      onClick={() => setFormat('hex')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer text-left transition-all ${format === 'hex' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                    >
                      Hexadecimal (Base 16)
                    </button>
                    <button
                      onClick={() => setFormat('ascii')}
                      className={`py-1.5 px-3 rounded-lg text-xs font-semibold cursor-pointer text-left transition-all ${format === 'ascii' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50'}`}
                    >
                      ASCII Decimal
                    </button>
                  </div>
                </div>

                {/* Delimiter Separator selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    Byte Delimiter Spacing
                  </label>
                  <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800 text-[10px]">
                    <button
                      onClick={() => setDelimiter(' ')}
                      className={`flex-1 py-1 px-2 text-center rounded-md font-semibold cursor-pointer ${delimiter === ' ' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-500'}`}
                    >
                      Space
                    </button>
                    <button
                      onClick={() => setDelimiter(',')}
                      className={`flex-1 py-1 px-2 text-center rounded-md font-semibold cursor-pointer ${delimiter === ',' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-500'}`}
                    >
                      Comma
                    </button>
                    <button
                      onClick={() => setDelimiter('')}
                      className={`flex-1 py-1 px-2 text-center rounded-md font-semibold cursor-pointer ${delimiter === '' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-500'}`}
                    >
                      None
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-850">
              <button
                onClick={handleLoadSample}
                className="w-full py-2 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Load Sample Example
              </button>
            </div>
          </div>

          {/* Translation Workspaces */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Input Panel */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-500" />
                    {mode === 'text-to-binary' ? 'Input Text Characters' : 'Input Code Digits'}
                  </span>
                  <button
                    onClick={() => setInputText('')}
                    className="text-xs text-rose-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-[280px] p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder={mode === 'text-to-binary' ? 'Type standard text string content...' : `Paste ${format} digits...`}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 font-mono">
                CHARS: {inputText.length} | WORDS: {inputText.trim().split(/\s+/).filter(Boolean).length}
              </div>
            </div>

            {/* Output Panel */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Binary className="w-4 h-4 text-emerald-500" />
                    Translated Result
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopy}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-medium ${
                        copied 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30' 
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 rounded-lg transition-all flex items-center justify-center cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={outputText}
                  readOnly
                  className="w-full h-[280px] p-4 bg-slate-900 text-slate-100 border border-slate-850 rounded-2xl font-mono text-xs leading-relaxed focus:outline-none"
                  placeholder="Translation code output appears here..."
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 font-mono">
                OUTPUT LENGTH: {outputText.length} characters
              </div>
            </div>

          </div>

        </div>

        {/* Informative text segments */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Binary className="w-5 h-5 text-indigo-500" />
              Machine Binary Representation & Byte Construction
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Computers fundamentally represent everything as digital high or low currents. In standard systems, English text uses standard ASCII maps, where each character translates to an 8-bit block (a byte). This page converts standard text letters immediately to binary strings (0 and 1) for easy demonstration.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Minimize className="w-5 h-5 text-emerald-500" />
              Hexadecimal and ASCII Mapping Layouts
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Hexadecimal (base 16) compiles 8-bit bytes into concise two-digit groupings (e.g. `01001000` is Hex `48`), which are much simpler for software developers to verify when auditing raw protocols.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <div className="mt-16 pt-12 border-t border-slate-150 dark:border-slate-800" id="faq-section">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-light font-display text-slate-900 dark:text-white">
              Frequently Asked <span className="font-semibold text-indigo-600 dark:text-indigo-400">Questions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-4xl">
            {faqs.map((faq) => (
              <div 
                key={faq.id}
                className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/80 overflow-hidden transition-all duration-200"
                id={`faq-item-${faq.id}`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-3 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Related Text Tools</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {relatedTools.map(t => (
                <button
                  key={t.id}
                  onClick={() => onNavigateToTool(t.id)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/80 transition-all cursor-pointer"
                >
                  <span>{t.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </button>
        </div>

      </div>
    </div>
  );
}
