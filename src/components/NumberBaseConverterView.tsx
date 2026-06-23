import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  ArrowLeftRight,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Info,
  Trash2,
  FileText
} from 'lucide-react';

interface NumberBaseConverterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type ConversionMode = 'TextToCode' | 'CodeToText';
type SelectedBase = 'binary' | 'hex' | 'decimal' | 'octal';

export default function NumberBaseConverterView({ onNavigateToTool, onNavigateHome }: NumberBaseConverterViewProps) {
  const [mode, setMode] = useState<ConversionMode>('TextToCode');
  const [selectedBase, setSelectedBase] = useState<SelectedBase>('binary');
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  
  // Settings
  const [separator, setSeparator] = useState<'space' | 'comma' | 'none' | 'prefix-0x' | 'prefix-hx'>('space');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);

  // Tabular breakout state of individual characters (for visual beauty!)
  const [breakdownList, setBreakdownList] = useState<Array<{
    char: string;
    code: number;
    binary: string;
    hex: string;
    dec: string;
    octal: string;
  }>>([]);

  // SEO Metas
  const seoTitle = "Binary Hex Octal Text Converter - Number Base ASCII Translator";
  const seoDescription = "Convert text to binary, hexadecimal, decimal, octal and vice versa online. Includes instant bit breakdown tables and customizable separators.";

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

    return () => {
      document.title = previousTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, []);

  // Format Helper depending on Separator Setting
  const formatCodeValues = (values: string[], base: SelectedBase): string => {
    let joiner = ' ';
    let prefix = '';

    if (separator === 'comma') joiner = ', ';
    else if (separator === 'none') joiner = '';
    else if (separator === 'prefix-0x') {
      joiner = ' ';
      prefix = '0x';
    } else if (separator === 'prefix-hx') {
      joiner = ' ';
      prefix = '\\x';
    }

    if (prefix) {
      return values.map(v => `${prefix}${v}`).join(joiner);
    }
    return values.join(joiner);
  };

  // Convert Text To Code representations
  const translateTextToCode = () => {
    if (!inputText) {
      setOutputText('');
      setBreakdownList([]);
      setValidationError(null);
      return;
    }

    try {
      const rawValues: string[] = [];
      const breakdown: typeof breakdownList = [];

      for (let i = 0; i < inputText.length; i++) {
        const char = inputText.charAt(i);
        const code = inputText.charCodeAt(i);

        // Compute string representations
        const b = code.toString(2).padStart(8, '0');
        const h = code.toString(16).toUpperCase().padStart(2, '0');
        const d = code.toString(10);
        const o = code.toString(8).padStart(3, '0');

        breakdown.push({ char, code, binary: b, hex: h, dec: d, octal: o });

        // Select the active base standard format representation
        switch (selectedBase) {
          case 'binary':
            rawValues.push(b);
            break;
          case 'hex':
            rawValues.push(h);
            break;
          case 'decimal':
            rawValues.push(d);
            break;
          case 'octal':
            rawValues.push(o);
            break;
        }
      }

      setOutputText(formatCodeValues(rawValues, selectedBase));
      setBreakdownList(breakdown.slice(0, 100)); // limit visualization to first 100 chars
      setValidationError(null);
    } catch (err: any) {
      setValidationError("Failed to translate: " + err.message);
    }
  };

  // Clean raw code prefixes/separators back into simple index array
  const cleanCodeInput = (input: string): string[] => {
    let cleaned = input.trim();
    // Neutralize standard hex/unicode string prefix variants like 0x, \x
    cleaned = cleaned.replace(/0x/g, ' ');
    cleaned = cleaned.replace(/\\x/g, ' ');
    cleaned = cleaned.replace(/,/g, ' ');
    return cleaned.split(/\s+/).filter(Boolean);
  };

  // Convert Code representations To Text
  const translateCodeToText = () => {
    if (!inputText) {
      setOutputText('');
      setBreakdownList([]);
      setValidationError(null);
      return;
    }

    try {
      const tokens = cleanCodeInput(inputText);
      let textResult = '';
      const breakdown: typeof breakdownList = [];
      let radix = 10;
      let padLen = 1;

      switch (selectedBase) {
        case 'binary':
          radix = 2;
          padLen = 8;
          break;
        case 'hex':
          radix = 16;
          padLen = 2;
          break;
        case 'decimal':
          radix = 10;
          break;
        case 'octal':
          radix = 8;
          padLen = 3;
          break;
      }

      for (const token of tokens) {
        const val = parseInt(token, radix);
        if (isNaN(val) || val < 0 || val > 65535) {
          throw new Error(`Encountered illegal character sequence token: "${token}" for base ${selectedBase.toUpperCase()}`);
        }

        const char = String.fromCharCode(val);
        textResult += char;

        const b = val.toString(2).padStart(8, '0');
        const h = val.toString(16).toUpperCase().padStart(2, '0');
        const d = val.toString(10);
        const o = val.toString(8).padStart(3, '0');

        breakdown.push({ char, code: val, binary: b, hex: h, dec: d, octal: o });
      }

      setOutputText(textResult);
      setBreakdownList(breakdown.slice(0, 100));
      setValidationError(null);
    } catch (err: any) {
      setValidationError(err.message || 'Verification Error during decoding.');
    }
  };

  // Trigger main translation when inputs, mode or selected base shifts
  useEffect(() => {
    if (mode === 'TextToCode') {
      translateTextToCode();
    } else {
      translateCodeToText();
    }
  }, [inputText, mode, selectedBase, separator]);

  const handleCopyResult = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const handleClearAll = () => {
    setInputText('');
    setOutputText('');
    setBreakdownList([]);
    setValidationError(null);
  };

  const handleLoadSample = () => {
    if (mode === 'TextToCode') {
      setInputText("Hello, World! 🚀");
    } else {
      if (selectedBase === 'binary') {
        setInputText("01001000 01100101 01101100 01101100 01101111");
      } else if (selectedBase === 'hex') {
        setInputText("48 65 6C 6C 6F");
      } else if (selectedBase === 'decimal') {
        setInputText("72 101 108 108 111");
      } else {
        setInputText("110 145 154 154 157");
      }
    }
  };

  const handleToggleMode = () => {
    const nextMode = mode === 'TextToCode' ? 'CodeToText' : 'TextToCode';
    setMode(nextMode);
    setInputText('');
    setOutputText('');
    setBreakdownList([]);
    setValidationError(null);
  };

  const faqs = [
    {
      id: 1,
      question: "What does code compilation to binary or hex mean?",
      answer: "Every character inside digital text strings represents a numeric index (such as Unicode or ASCII code points). A Number Base converter decodes those indices into alternative mathematical notations. For example, the character 'A' corresponds to ASCII index 65, which corresponds to Binary 01000001 or Hexadecimal 41."
    },
    {
      id: 2,
      question: "How do custom output prefix rules help?",
      answer: "Systems programmers often declare hexadecimal digits with explicit notations. For instance, in JavaScript/C, you declare hex bytes via '0x48' (0x prefix). In shell scripting or URLs, escape strings use '\\x48'. Selecting these settings outputs correct code formats instantly."
    },
    {
      id: 3,
      question: "Is this tool multi-byte Unicode safe?",
      answer: "Yes. The conversion maps the full 16-bit char-code spaces of standard JavaScript strings. It maps accents, symbols, and high-plane emojis smoothly into numeric values, preserving content fidelity bidirectionally."
    },
    {
      id: 4,
      question: "What is the difference between Binary (Base 2) and Hexadecimal (Base 16)?",
      answer: "Binary is a base-2 positional notation system representing numeric values using only two states: 0 and 1. Hexadecimal is a base-16 calculation system using digits from 0-9 and characters A-F, which provides a compact format representing four binary bits in a single digit."
    },
    {
      id: 5,
      question: "Why is Octal (Base 8) useful in modern operating systems?",
      answer: "Octal is primarily used in Unix and Linux filesystem permissions. Because each octal digit corresponds exactly to three binary symbols, you can represent read (4), write (2), and execute (1) permissions using a simple 3-digit octal value like `755`."
    },
    {
      id: 6,
      question: "How do you convert Decimal integers (Base 10) into Hexadecimal?",
      answer: "Divide the decimal value by 16 repeatedly, keeping track of the remainders. Translate remainders from 10 to 15 into letters A to F, and read the remainders upwards from last to first to construct your final hexadecimal string."
    },
    {
      id: 7,
      question: "What is the history of the ASCII Standard?",
      answer: "ASCII (American Standard Code for Information Interchange) was established in 1963 as a standard telegraph code system. It defines 128 unique character slots containing English letters, numeric digits, and control characters."
    },
    {
      id: 8,
      question: "Does TextToolkitHub track my conversion records or strings?",
      answer: "No. The parsing, base conversions, and byte visualization are done locally in your browser workspace memory. Your binary sequences, decrypted keys, and proprietary scripts are fully secure."
    },
    {
      id: 9,
      question: "Why does my Hex-to-Text conversion output look broken or corrupted?",
      answer: "This is typically caused by incorrect byte spacing configurations, missing character codes, or passing non-hex digits (like G or H) into base-16 decoders. Standard hex sequences must use characters from 0-9 and A-F."
    },
    {
      id: 10,
      question: "Is having educational guidelines for number systems helpful for Google AdSense?",
      answer: "Yes. Adding detailed step-by-step guides, math formulas, and practical examples demonstrates clear educational value to manual AdSense assessors, improving approval eligibility."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="number-base-root">
      {/* Header section */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          ASCII Text ↔ <span className="text-indigo-600 dark:text-indigo-400">Binary | Hex | Dec | Octal Converter</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          An intuitive dual-engine translation suite to convert textual sentences into binary codes, hexadecimal arrays, decimal integers, or octal digits. Includes detailed computer science bitwise-breakdown visualizations.
        </p>
      </div>

      {/* Primary translation control workspace */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Settings Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-3">
            <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
            Conversion Settings
          </h3>

          <div className="space-y-5">
            {/* Mode Switcher */}
            <div>
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Translation Path</span>
              <button
                onClick={handleToggleMode}
                className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-100/80 dark:bg-slate-900/40 p-3 rounded-xl border border-indigo-100/50 dark:border-slate-700 font-bold text-xs text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                <span>{mode === 'TextToCode' ? 'Plain Text ➔ Digital Code' : 'Digital Code ➔ Plain Text'}</span>
                <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

            {/* Target base selection */}
            <div>
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Selected Number Base</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'binary', label: 'Binary (Base 2)' },
                  { id: 'hex', label: 'Hex (Base 16)' },
                  { id: 'decimal', label: 'Decimal (Base 10)' },
                  { id: 'octal', label: 'Octal (Base 8)' }
                ].map((baseOption) => {
                  const isActive = selectedBase === baseOption.id;
                  return (
                    <button
                      key={baseOption.id}
                      onClick={() => {
                        setSelectedBase(baseOption.id as SelectedBase);
                        if (mode === 'CodeToText') setInputText('');
                      }}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-bold font-mono transition-all text-center ${
                        isActive 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'border-slate-200 dark:border-slate-750 bg-slate-50/50 hover:bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {baseOption.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Delimiters selector */}
            {mode === 'TextToCode' && (
              <div>
                <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Format Separators</span>
                <select
                  value={separator}
                  onChange={(e) => setSeparator(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="space">Space (" ")</option>
                  <option value="comma">Comma (", ")</option>
                  <option value="none">None (No gap)</option>
                  <option value="prefix-0x">0x Identifier Prefix (hex)</option>
                  <option value="prefix-hx">\x Identifier Prefix (hex)</option>
                </select>
              </div>
            )}

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex gap-2">
              <button
                onClick={handleLoadSample}
                className="flex-grow flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-755 dark:hover:bg-slate-700/80 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Sample
              </button>
              <button
                onClick={handleClearAll}
                className="flex-grow flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 px-3 py-2 rounded-xl text-xs font-extrabold transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Workstations */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 font-mono">
                {mode === 'TextToCode' ? 'Input ASCII Text' : `Input ${selectedBase.toUpperCase()} Values`}
              </span>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-44 px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-mono text-sm leading-relaxed"
                placeholder={
                  mode === 'TextToCode'
                    ? "Enter standard raw text characters here..."
                    : `Enter separated ${selectedBase} sequence values. E.g. ${
                        selectedBase === 'binary' ? '01001000 01100101' : '48 65'
                      }`
                }
              />
            </div>

            {/* Output card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm relative">
              <div className="flex justify-between items-center mb-2">
                <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                  {mode === 'TextToCode' ? `Output ${selectedBase.toUpperCase()} Array` : 'Output Decoded Text'}
                </span>
                {outputText && (
                  <button
                    onClick={handleCopyResult}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {isCopied ? 'Copied' : 'Copy Result'}
                  </button>
                )}
              </div>
              <textarea
                value={outputText}
                readOnly
                className="w-full h-44 px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-mono text-sm leading-relaxed select-all"
                placeholder="Resulting sequence output will generate live here..."
              />
            </div>
          </div>

          {/* Verification Warning */}
          {validationError && (
            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-2 text-rose-800 dark:text-rose-300">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold">{validationError}</p>
            </div>
          )}

          {/* Character Breakout Byte Visualizer */}
          {breakdownList.length > 0 && (
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Character String Byte Breakdown Grid
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-[11px] font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <th className="py-2 text-left">Char</th>
                      <th className="py-2 text-center">ASCII Code</th>
                      <th className="py-2 text-center">Binary</th>
                      <th className="py-2 text-center">Hex</th>
                      <th className="py-2 text-center">Dec</th>
                      <th className="py-2 text-center">Octal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdownList.map((item, idx) => {
                      const isWhitespace = idx % 2 === 0;
                      return (
                        <tr 
                          key={idx} 
                          className={`border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-750 ${
                            isWhitespace ? 'bg-slate-50/20' : ''
                          }`}
                        >
                          <td className="py-2 text-left font-sans font-extrabold text-slate-900 dark:text-white">
                            {item.char === ' ' ? <span className="text-indigo-500 bg-indigo-50 px-1 py-0.5 rounded italic">space</span> : item.char}
                          </td>
                          <td className="py-2 text-center text-slate-500">{item.code}</td>
                          <td className="py-2 text-center tabular-nums text-indigo-600 dark:text-indigo-400">{item.binary}</td>
                          <td className="py-2 text-center tabular-nums text-emerald-600 dark:text-emerald-400">{item.hex}</td>
                          <td className="py-2 text-center tabular-nums text-amber-600 dark:text-amber-400">{item.dec}</td>
                          <td className="py-2 text-center tabular-nums text-purple-600 dark:text-purple-400">{item.octal}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 italic">
                Only the first 100 character segments are rendered in this dynamic analytical log grid.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* FAQs */}
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

      {/* DETAILED EDUCATIONAL & SEO RESOURCE MANUAL */}
      <section className="prose max-w-none pt-16 border-t border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-sans space-y-12">
        
        {/* Introduction & What is this tool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#4f46e5] dark:text-[#818cf8] font-mono leading-none block">Mathematical Informatics</span>
            <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-0" id="base-intro">
              Introduction to Positional Number Base Systems
            </h2>
            <p className="text-sm leading-relaxed text-[#52525b] dark:text-slate-400">
              Modern computer hardware is built on billions of microscopic transistors that toggle between two electrical states: on and off. These states are mapped to binary digits: 0 and 1. To organize these basic states into useful symbols, programmers map characters to specific numeric codes (using registries like ASCII or Unicode). Representing these codes in daily work requires converting values between different base formats.
            </p>
            <p className="text-sm leading-relaxed text-[#52525b] dark:text-slate-400">
              This includes converting between <strong>Binary (Base-2)</strong> for physical circuits, <strong>Octal (Base-8)</strong> for Unix file permissions, <strong>Decimal (Base-10)</strong> for human calculation, and <strong>Hexadecimal (Base-16)</strong> for compact, readable code representations.
            </p>
          </div>
          
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white mt-0 font-sans" id="base-what-is">
              What is this Tool?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This interactive dashboard of TextToolkitHub is a professional high-precision number base converter. It converts ASCII strings into binary digits, hexadecimal values, decimal values, and octal codes, and decodes them back seamlessly. It features a custom byte breakdown table that visualizes exactly how each letter is represented across systems. All conversions run locally inside your browser window, keeping your data confidential.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              When sanitizing system configurations, you can also format your CSS layouts using our <a href="/css-beautifier-minifier" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">CSS Beautifier & Minifier</a> or convert complex structured data lists using our <a href="/yaml-json" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">YAML ↔ JSON Converter</a> for modern administration.
            </p>
          </div>
        </div>

        {/* Guide to Using the System */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-10 space-y-6">
          <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="base-how-to">
            How to Convert text to Binary, Hex, Dec, or Octal
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Converting text strings into standard positional bases is instant with our engine. Use our operational guide:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">01</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Pick Conversion Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use the primary headers to toggle between 'Text-to-Code' encoding or 'Code-to-Text' decoding modes.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">02</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Select Target Base</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Choose your target mathematical base: Binary (Base-2), Hex (Base-16), Decimal (Base-10), or Octal (Base-8).</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">03</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Input Strings or Code</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Type or paste your text values into the input field. Adjust advanced prefixes or custom space delimiters as needed.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">04</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Copy Visual Layout</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review the generated byte breakdown table. Click 'Copy Result' to export the formatted strings directly.</p>
            </div>
          </div>
        </div>

        {/* Benefits & Use Cases & Real World Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="base-benefits">
              Benefits & Key Use Cases
            </h3>
            <ul className="text-sm space-y-3.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Embedded Engineering:</strong> IoT developers convert variable strings to binary arrays to write to low-level hardware registers.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Payload Auditing:</strong> Security analysts translate hexadecimal data from network logs to verify request content safely.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>CS Education:</strong> Students inspect the byte breakdown table to visually learn the relationships between binary, octal, decimal, and hexadecimal bases.
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="base-examples">
              Mathematical Bases Breakdown
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-150 dark:border-slate-850">
              <table className="min-w-full text-xs font-sans text-left text-slate-650 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Character</th>
                    <th className="p-3">Binary (Base-2)</th>
                    <th className="p-3">Hex (Base-16)</th>
                    <th className="p-3">Decimal (Base-10)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-mono">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 font-sans">A (Capital A)</td>
                    <td className="p-3">01000001</td>
                    <td className="p-3 text-indigo-500">41</td>
                    <td className="p-3">65</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 font-sans">a (Lowercase a)</td>
                    <td className="p-3">01100001</td>
                    <td className="p-3 text-indigo-500">61</td>
                    <td className="p-3">97</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 font-sans">0 (Number zero)</td>
                    <td className="p-3">00110000</td>
                    <td className="p-3 text-indigo-500">30</td>
                    <td className="p-3">48</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200 font-sans">! (Exclamation)</td>
                    <td className="p-3">00100001</td>
                    <td className="p-3 text-indigo-500">21</td>
                    <td className="p-3">33</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Common Mistakes & Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="base-mistakes">
              Common Positional Base Pitfalls
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mishandling string types and character encodings can lead to configuration bugs:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-550 dark:text-slate-450 space-y-2">
              <li><strong>Hex Digit Capitalization:</strong> Mixing uppercase and lowercase hex letters (`0xAF` vs `0xaf`) inside code strings without standardizing the format.</li>
              <li><strong>Character Set Mismatches:</strong> Attempting to map high-plane emojis into low-byte ASCII parameters, corrupting the multi-byte sequences.</li>
              <li><strong>Assuming Constant Spacings:</strong> Creating manual regex tools that expect exact 8-bit binary spacings, which can fail inside variable 7-digit telemetry environments.</li>
              <li><strong>Forgetting Prefixes:</strong> Omitting prefixes (such as `0x` or `\x`) in compiled code inputs, leading compiler engines to parse hex strings as decimal values.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="base-best-practices">
              Industry Positional Best Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Use Native Parse Int</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Leverage JavaScript's native parsing helper, `parseInt(value, radix)`, to convert between other mathematical bases cleanly.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Pad Binary Values</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Use padding methods (like `String.padStart(8, '0')`) to ensure your generated binary strings consistently represent 8-bit bytes.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Adopt UTF-8 Standards</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Prioritize standardized UTF-8 string decoders over obsolete ASCII character codes to prevent multi-byte symbol errors.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Validate Prefix Input</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Confirm whether your project compilers require base prefixes like `0x` or raw hexadecimal values before deploying your configurations.</p>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
