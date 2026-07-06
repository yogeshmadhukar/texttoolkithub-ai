import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
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
  BookOpen,
  Info
} from 'lucide-react';

interface MorseCodeTranslatorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type Mode = 'text-to-morse' | 'morse-to-text';

// Standard International Morse Code Dictionary
const MORSE_DICTIONARY: Record<string, string> = {
  'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
  'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
  'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
  'y': '-.--', 'z': '--..',
  '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
  '8': '---..', '9': '----.', '0': '-----',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
  ' ': '/'
};

const REVERSE_DICTIONARY: Record<string, string> = {};
Object.entries(MORSE_DICTIONARY).forEach(([char, code]) => {
  REVERSE_DICTIONARY[code] = char;
});

export default function MorseCodeTranslatorView({ onNavigateToTool, onNavigateHome }: MorseCodeTranslatorViewProps) {
  const [mode, setMode] = useState<Mode>('text-to-morse');
  const [inputText, setInputText] = useState('SOS Hello World');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [dotSymbol, setDotSymbol] = useState('.');
  const [dashSymbol, setDashSymbol] = useState('-');
  const [charSeparator, setCharSeparator] = useState(' ');
  const [wordSeparator, setWordSeparator] = useState(' / ');
  const [wpm, setWpm] = useState(15); // Words Per Minute (timing speed)
  const [pitch, setPitch] = useState(600); // Frequency in Hz
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [activePlayIndex, setActivePlayIndex] = useState<number>(-1);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const currentOscillatorsRef = useRef<OscillatorNode[]>([]);
  const timeoutsRef = useRef<number[]>([]);

  const seoTitle = "Morse Code Translator Online | Audio Player & Text Decoder";
  const seoDescription = "Convert text to Morse code and decode Morse code back to readable text instantly. Play real-time audio beeps, configure custom symbols, and adjust WPM/pitch fully locally.";

  const faqs = [
    {
      id: 1,
      question: "What is Morse Code?",
      answer: "Morse code is a communication system developed in the 1830s by Samuel Morse and Alfred Vail. It translates alphabetic characters, digits, and punctuation into sequences of short pulses (dots) and long pulses (dashes)."
    },
    {
      id: 2,
      question: "How is Morse Code timing calculated (WPM)?",
      answer: "Timing is measured in Words Per Minute (WPM) using the word 'PARIS' as a baseline. A single dot is 1 unit. A dash is 3 units. The gap between dots/dashes in a character is 1 unit, the gap between characters is 3 units, and the gap between words is 7 units."
    },
    {
      id: 3,
      question: "How does the Morse Audio Player work offline?",
      answer: "The player uses the HTML5 Web Audio API to synthesize sine wave frequencies (beeps) directly in your browser. Since it runs 100% locally in JavaScript, it requires no internet connection or third-party APIs to generate sound."
    },
    {
      id: 4,
      question: "How should I structure Morse Code for decoding?",
      answer: "To decode Morse code to text, write dots as '.' and dashes as '-', with spaces between letters (e.g. '.... . .-.. .-.. ---') and a forward slash '/' between words (e.g. '.... . .-.. .-.. --- / .-- --- .-. .-.. -..')."
    }
  ];

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

    const scriptId = "morse-translator-json-ld";
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

  // Live translation handler
  useEffect(() => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    if (mode === 'text-to-morse') {
      const normalized = inputText.toLowerCase();
      const words = normalized.split(/\s+/);
      const translatedWords = words.map(word => {
        const letters = word.split('');
        const translatedLetters = letters
          .map(char => {
            const code = MORSE_DICTIONARY[char];
            if (!code) return ''; // Skip unknown characters
            return code
              .replace(/\./g, dotSymbol)
              .replace(/-/g, dashSymbol);
          })
          .filter(code => code !== '');
        return translatedLetters.join(charSeparator);
      });
      setOutputText(translatedWords.join(wordSeparator));
    } else {
      // Decode: Morse to Text
      // Clean separators
      const cleanWordSep = wordSeparator.trim();
      const cleanCharSep = charSeparator;
      
      // Escape symbols for regex
      const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Match words
      const wordPattern = cleanWordSep ? escapeRegExp(cleanWordSep) : '/';
      const words = inputText.trim().split(new RegExp(`\\s*${wordPattern}\\s*`));
      
      const decodedWords = words.map(word => {
        const charPattern = cleanCharSep ? escapeRegExp(cleanCharSep) : '\\s+';
        const characters = word.trim().split(new RegExp(charPattern));
        const decodedChars = characters.map(code => {
          // Normalize custom symbols back to standard dots and dashes
          const standardCode = code
            .replace(new RegExp(escapeRegExp(dotSymbol), 'g'), '.')
            .replace(new RegExp(escapeRegExp(dashSymbol), 'g'), '-');
          return REVERSE_DICTIONARY[standardCode] || '';
        });
        return decodedChars.join('');
      });
      
      setOutputText(decodedWords.join(' ').toUpperCase());
    }
  }, [inputText, mode, dotSymbol, dashSymbol, charSeparator, wordSeparator]);

  // Clean timeouts on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Stop the audio synthesis
  const stopAudio = () => {
    setAudioPlaying(false);
    setActivePlayIndex(-1);
    
    // Cancel all planned audio synthesis nodes
    currentOscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {}
    });
    currentOscillatorsRef.current = [];

    // Clear react timeouts
    timeoutsRef.current.forEach(id => window.clearTimeout(id));
    timeoutsRef.current = [];

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
  };

  // Play Morse Code Audio using browser AudioContext
  const playAudio = () => {
    if (audioPlaying) {
      stopAudio();
      return;
    }

    const morseToPlay = mode === 'text-to-morse' ? outputText : inputText;
    if (!morseToPlay.trim()) return;

    // Initialize clean audio context
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) {
      alert("Web Audio API is not supported in this browser.");
      return;
    }
    
    const ctx = new AudioCtx();
    audioCtxRef.current = ctx;
    setAudioPlaying(true);

    // Calculate timing in seconds based on PARIS standard (1 dot unit)
    // 1 dot = 1.2 / WPM seconds
    const dotDuration = 1.2 / wpm; 
    const dashDuration = dotDuration * 3;
    const elementSpacing = dotDuration; // space between dots/dashes in a character
    const charSpacing = dotDuration * 3; // space between characters
    const wordSpacing = dotDuration * 7; // space between words

    let currentTime = ctx.currentTime + 0.1; // Add brief padding buffer

    // Parse the actual dots, dashes, and gaps
    const tokens: Array<{ type: 'dot' | 'dash' | 'char-space' | 'word-space'; index: number }> = [];
    let absoluteIndex = 0;

    // Read the text sequentially
    for (let i = 0; i < morseToPlay.length; i++) {
      const char = morseToPlay[i];
      if (char === dotSymbol) {
        tokens.push({ type: 'dot', index: i });
      } else if (char === dashSymbol) {
        tokens.push({ type: 'dash', index: i });
      } else if (char === charSeparator || char === ' ') {
        // Only append space if the last token wasn't already a space
        if (tokens.length > 0 && tokens[tokens.length - 1].type !== 'char-space') {
          tokens.push({ type: 'char-space', index: i });
        }
      } else if (char === wordSeparator.trim() || char === '/') {
        if (tokens.length > 0 && tokens[tokens.length - 1].type !== 'word-space') {
          // Replace char-space with word-space for cleaner hierarchy
          if (tokens[tokens.length - 1].type === 'char-space') {
            tokens.pop();
          }
          tokens.push({ type: 'word-space', index: i });
        }
      }
    }

    // Schedule audio beeps
    tokens.forEach((token, tIdx) => {
      if (token.type === 'dot' || token.type === 'dash') {
        const duration = token.type === 'dot' ? dotDuration : dashDuration;
        
        // Setup oscillator and gain nodes for clean volume envelope
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(pitch, currentTime);
        
        // Attack envelope
        gainNode.gain.setValueAtTime(0, currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.005);
        
        // Release envelope
        gainNode.gain.setValueAtTime(0.3, currentTime + duration - 0.005);
        gainNode.gain.linearRampToValueAtTime(0, currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        // Schedule start and stop
        osc.start(currentTime);
        osc.stop(currentTime + duration);
        currentOscillatorsRef.current.push(osc);

        // Visual flash synchronization timeout
        const startDelayMs = (currentTime - ctx.currentTime) * 1000;
        const endDelayMs = (currentTime + duration - ctx.currentTime) * 1000;

        const startTimeout = window.setTimeout(() => {
          setActivePlayIndex(token.index);
        }, startDelayMs);

        const endTimeout = window.setTimeout(() => {
          setActivePlayIndex(-1);
        }, endDelayMs);

        timeoutsRef.current.push(startTimeout, endTimeout);

        currentTime += duration + elementSpacing;
      } else if (token.type === 'char-space') {
        currentTime += charSpacing;
      } else if (token.type === 'word-space') {
        currentTime += wordSpacing;
      }
    });

    // Schedule automatic playback stop at end of stream
    const totalDurationMs = (currentTime - ctx.currentTime) * 1000;
    const finalTimeout = window.setTimeout(() => {
      stopAudio();
    }, totalDurationMs);
    timeoutsRef.current.push(finalTimeout);
  };

  const copyToClipboard = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTextFile = () => {
    if (!outputText) return;
    const element = document.createElement("a");
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${mode === 'text-to-morse' ? 'translated_morse' : 'decoded_text'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const resetFields = () => {
    setInputText('');
    setOutputText('');
    stopAudio();
  };

  const switchMode = () => {
    stopAudio();
    // Swap inputs/outputs cleanly
    setInputText(outputText);
    setOutputText(inputText);
    setMode(prev => prev === 'text-to-morse' ? 'morse-to-text' : 'text-to-morse');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#060814] text-slate-900 dark:text-slate-100 font-sans" id="morse-translator-container">
      {/* Dynamic Workspace Container */}
      <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Toolbox Home
          </button>
          <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/20 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">100% Client-Side Engine</span>
          </div>
        </div>

        {/* Title Block */}
        <div className="text-center md:text-left mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-1">
            <Sparkles size={12} />
            Offline Morse Audio Synthesizer
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Morse Code Translator Pro
          </h1>
          <p className="text-sm text-slate-555 dark:text-slate-400 max-w-2xl leading-relaxed">
            Bidirectionally encode words into international Morse symbols or decode pulse combinations back to English. Fine-tune duration settings (WPM), audio pitches, and stream high-fidelity audio beeps with no latency.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Controls Card */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Mode Selector Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
              <button 
                onClick={() => { if(mode !== 'text-to-morse') switchMode(); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'text-to-morse' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-white shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Text to Morse Code
              </button>
              <button 
                onClick={() => { if(mode !== 'morse-to-text') switchMode(); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mode === 'morse-to-text' 
                    ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-white shadow-sm border border-slate-200/20' 
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Morse Code to Text
              </button>
            </div>

            {/* Input Form Area */}
            <div className="bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {mode === 'text-to-morse' ? 'Input Plain Text' : 'Input Morse Code'}
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={resetFields}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                    title="Clear fields"
                  >
                    <RotateCcw size={14} />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'text-to-morse' ? 'Enter text to encode...' : 'Enter Morse code to decode (use space or / as separators)...'}
                  rows={6}
                  className="w-full text-sm md:text-base bg-transparent border-0 focus:ring-0 p-0 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 resize-none font-mono"
                />
              </div>
            </div>

            {/* Live Visualizer Envelope & Action Tray */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100/80 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={playAudio}
                  disabled={!outputText}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                    !outputText 
                      ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-850 text-slate-400'
                      : audioPlaying 
                        ? 'bg-red-500 hover:bg-red-650 text-white animate-pulse'
                        : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
                >
                  {audioPlaying ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  {audioPlaying ? 'Stop Synthesis' : 'Play Morse Audio'}
                </button>
                
                {/* Visualizer bars */}
                {audioPlaying && (
                  <div className="flex items-center gap-0.5 h-6">
                    <span className="w-1 bg-emerald-500 h-3 rounded-full animate-[bounce_0.8s_infinite_100ms]"></span>
                    <span className="w-1 bg-emerald-500 h-5 rounded-full animate-[bounce_0.8s_infinite_300ms]"></span>
                    <span className="w-1 bg-emerald-500 h-2 rounded-full animate-[bounce_0.8s_infinite_200ms]"></span>
                    <span className="w-1 bg-emerald-500 h-4 rounded-full animate-[bounce_0.8s_infinite_400ms]"></span>
                  </div>
                )}
              </div>

              {/* Dynamic word/letter stats */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {mode === 'text-to-morse' ? (
                  <span>
                    Words: <strong className="text-slate-700 dark:text-slate-300">{inputText.split(/\s+/).filter(Boolean).length}</strong> | 
                    Characters: <strong className="text-slate-700 dark:text-slate-300">{inputText.length}</strong>
                  </span>
                ) : (
                  <span>
                    Morse Groups: <strong className="text-slate-700 dark:text-slate-300">{inputText.trim().split(/\s+/).filter(Boolean).length}</strong>
                  </span>
                )}
              </div>
            </div>

            {/* Translated Output View */}
            <div className="bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {mode === 'text-to-morse' ? 'Translated Morse Code' : 'Decoded Plain Text'}
                </span>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={copyToClipboard}
                    disabled={!outputText}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                    title="Copy output"
                  >
                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  </button>
                  <button 
                    onClick={downloadTextFile}
                    disabled={!outputText}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                    title="Download Text File"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
              
              <div className="p-5 min-h-[140px] max-h-[300px] overflow-y-auto font-mono text-sm md:text-base leading-relaxed break-all whitespace-pre-wrap select-text bg-slate-50/30 dark:bg-slate-900/10">
                {outputText ? (
                  mode === 'text-to-morse' ? (
                    // In Text to Morse, highlight letters as sound synthesizes
                    outputText.split('').map((char, index) => (
                      <span 
                        key={index}
                        className={`transition-colors duration-100 ${
                          activePlayIndex === index 
                            ? 'bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold border-b-2 border-emerald-500 scale-110 inline-block px-0.5' 
                            : ''
                        }`}
                      >
                        {char}
                      </span>
                    ))
                  ) : (
                    outputText
                  )
                ) : (
                  <span className="text-slate-400 dark:text-slate-600 italic">
                    {mode === 'text-to-morse' ? 'Translated Morse symbols will render here...' : 'Decoded message letters will render here...'}
                  </span>
                )}
              </div>
            </div>

          </div>

          {/* Settings Sidebar Panel */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
                <Sliders size={16} className="text-indigo-650 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Audio & Symbol Settings
                </h3>
              </div>

              {/* Slider Settings */}
              <div className="space-y-4">
                {/* Timing Speed (WPM) */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Transmission Speed (WPM)
                    </label>
                    <span className="text-xs font-mono font-bold text-indigo-650 dark:text-indigo-400">
                      {wpm} WPM
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={5} 
                    max={35} 
                    value={wpm} 
                    onChange={(e) => setWpm(Number(e.target.value))}
                    className="w-full accent-indigo-600 dark:accent-indigo-400 h-1.5 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>5 WPM (Slow)</span>
                    <span>15 WPM (Default)</span>
                    <span>35 WPM (Fast)</span>
                  </div>
                </div>

                {/* Pitch Frequency */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Pitch Frequency
                    </label>
                    <span className="text-xs font-mono font-bold text-indigo-650 dark:text-indigo-400">
                      {pitch} Hz
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min={400} 
                    max={1000} 
                    value={pitch} 
                    step={50}
                    onChange={(e) => setPitch(Number(e.target.value))}
                    className="w-full accent-indigo-600 dark:accent-indigo-400 h-1.5 bg-slate-150 dark:bg-slate-800 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>400 Hz (Bass)</span>
                    <span>600 Hz (Standard)</span>
                    <span>1000 Hz (Treble)</span>
                  </div>
                </div>
              </div>

              {/* Custom Symbols Configuration */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-850">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Symbol Configuration
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Dot Symbol</label>
                    <input 
                      type="text" 
                      maxLength={3} 
                      value={dotSymbol} 
                      onChange={(e) => setDotSymbol(e.target.value || '.')}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-mono text-center text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Dash Symbol</label>
                    <input 
                      type="text" 
                      maxLength={3} 
                      value={dashSymbol} 
                      onChange={(e) => setDashSymbol(e.target.value || '-')}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-mono text-center text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Character Space</label>
                    <input 
                      type="text" 
                      value={charSeparator} 
                      onChange={(e) => setCharSeparator(e.target.value)}
                      placeholder="[space]"
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-mono text-center text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block mb-1">Word Space</label>
                    <input 
                      type="text" 
                      value={wordSeparator} 
                      onChange={(e) => setWordSeparator(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-mono text-center text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Reference Chart */}
            <div className="bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850 mb-3">
                <BookOpen size={16} className="text-indigo-650 dark:text-indigo-400" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                  Quick Morse Reference
                </h3>
              </div>
              <div className="grid grid-cols-4 gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">A</span> .-
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">B</span> -...
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">C</span> -.-.
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">D</span> -..
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">E</span> .
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">F</span> ..-.
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">G</span> --.
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">H</span> ....
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">I</span> ..
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">J</span> .---
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">K</span> -.-
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">L</span> .-..
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">M</span> --
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">N</span> -.
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">O</span> ---
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">P</span> .--.
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">Q</span> --.-
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">R</span> .-.
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">S</span> ...
                </div>
                <div className="p-1.5 rounded bg-slate-50 dark:bg-slate-900 text-center">
                  <span className="font-bold text-slate-800 dark:text-white block">T</span> -
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative Content & Guide */}
        <div className="mt-12 bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 md:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Linguistic and Syntactic Analysis of Morse Code
          </h2>
          
          <div className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-650 dark:text-slate-350 leading-relaxed space-y-4">
            <p>
              In Morse Code, each letter is designed to optimize transmission bandwidth depending on standard letter frequency in english literature. For instance, the letter <strong className="text-slate-800 dark:text-white font-mono">E</strong>, which is the most frequent character in normal prose, is allocated the shortest sequence of all: a single dot (<code className="font-mono">.</code>). Conversely, rarer letters like <strong className="text-slate-800 dark:text-white font-mono">Q</strong> are allocated longer weights (<code className="font-mono">--.-</code>).
            </p>
            <p>
              To maintain structural integrity during translation:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Spacing Standards:</strong> Character transitions require a precise gap to prevent the listener from blending adjacent symbols into wrong letters. A default spacing of one word separator (<code className="font-mono">/</code>) is essential to signify sentence words division.</li>
              <li><strong>Error Tolerance:</strong> The decoder checks for invalid combinations. Any cluster that doesn&apos;t match an established international code standard is filtered out cleanly to prevent pipeline failures.</li>
            </ul>
          </div>
        </div>

        {/* Dynamic FAQ Section */}
        <div className="mt-8 bg-white dark:bg-[#0b0e1a]/80 border border-slate-200 dark:border-slate-850 rounded-2xl p-6 md:p-8 shadow-sm" id="faq-section">
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

        {/* Bottom Banner */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-150/10 dark:border-indigo-950/25 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[10px] font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest block">Complete Your Workflow</span>
            <p className="text-xs text-slate-555 dark:text-slate-400 max-w-xl">
              Need other developer utility decoders? Convert characters instantly to binary arrays or secure base64 string streams.
            </p>
          </div>
          <button 
            onClick={() => onNavigateToTool('tools/text-to-binary')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-650 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-350 cursor-pointer"
          >
            Open Binary Converter
            <span className="text-xs">→</span>
          </button>
        </div>

      </div>
    </div>
  );
}
