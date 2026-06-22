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
      answer: "Systems programmers often declare hexadecimal digits with explicit notations. For instance, in JavaScript/C, you declare hex bytes via '0x48' (0x prefix). In shell scripting or URLs, escape strings use '\x48'. Selecting these settings outputs correct code formats instantly."
    },
    {
      id: 3,
      question: "Is this tool multi-byte Unicode safe?",
      answer: "Yes. The conversion maps the full 16-bit char-code spaces of standard JavaScript strings. It maps accents, symbols, and high-plane emojis smoothly into numeric values, preserving content fidelity bidirectionally."
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
    </div>
  );
}
