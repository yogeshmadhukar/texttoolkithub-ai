import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  FileText, 
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
  BookmarkCheck, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  RefreshCw,
  Sliders,
  Sparkle,
  Bookmark
} from 'lucide-react';

interface RandomTextGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

const VOCABULARY: Record<string, string[]> = {
  simple: [
    'the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog', 'happy', 'bright',
    'morning', 'sun', 'shined', 'warmly', 'on', 'green', 'grass', 'birds', 'sang', 'sweetly',
    'in', 'tall', 'trees', 'running', 'water', 'carried', 'little', 'leaf', 'down', 'river',
    'child', 'laughed', 'playing', 'with', 'colorful', 'blocks', 'on', 'floor', 'cat', 'slept',
    'peacefully', 'by', 'window', 'cup', 'of', 'hot', 'tea', 'sat', 'waiting', 'for',
    'someone', 'to', 'read', 'interesting', 'book', 'under', 'starlit', 'sky', 'night', 'was',
    'cool', 'and', 'silent', 'except', 'wind', 'blowing', 'softly', 'through', 'mountains'
  ],
  business: [
    'synergistic', 'paradigm', 'monetize', 'leverage', 'strategic', 'ROI', 'enterprise', 'stakeholder',
    'actionable', 'bandwidth', 'value-add', 'deliverables', 'framework', 'scalable', 'benchmark',
    'disruptive', 'ecosystem', 'pipeline', 'optimization', 'metrics', 'streamline', 'workflow',
    'maximize', 'proactive', 'granularity', 'vertical', 'horizon', 'mindshare', 'convergence',
    'empowerment', 'alignment', 'collaboration', 'governance', 'sustainability', 'analytics',
    'solutions', 'innovation', 'execution', 'infrastructure', 'turnkey', 'client-focused', 'synergy'
  ],
  marketing: [
    'revolutionary', 'outstanding', 'premier', 'conversions', 'custom-built', 'standard-setting',
    'user-centric', 'effortless', 'guaranteed', 'exceptional', 'elevated', 'masterclass', 'dynamic',
    'seamless', 'stunning', 'ultimate', 'exclusive', 'boost', 'unlock', 'accelerate', 'proven',
    'authentic', 'captivating', 'breathtaking', 'next-generation', 'unparalleled', 'irresistible',
    'premium', 'transformational', 'state-of-the-art', 'streamlined', 'innovative', 'pioneering',
    'inspiring', 'limitless', 'customized', 'elite', 'sparkling', 'bold', 'signature', 'essential'
  ],
  placeholder: [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sample',
    'placeholder', 'dummy', 'text', 'column', 'layout', 'grid', 'component', 'section', 'header',
    'footer', 'sidebar', 'template', 'mockup', 'design', 'prototype', 'canvas', 'boundary',
    'structure', 'element', 'spacing', 'padding', 'margin', 'typography', 'font', 'rendered',
    'alignment', 'wireframe', 'formatting', 'preview', 'testing', 'utility', 'draft', 'sandbox'
  ]
};

const CONNECTORS = [
  'and', 'but', 'while', 'as', 'because', 'although', 'so that', 'whereas', 'until', 'since'
];

export default function RandomTextGeneratorView({ onNavigateToTool, onNavigateHome }: RandomTextGeneratorViewProps) {
  const [generateUnit, setGenerateUnit] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [amount, setAmount] = useState<number>(3);
  const [textStyle, setTextStyle] = useState<'simple' | 'business' | 'marketing' | 'placeholder'>('simple');
  const [generatedText, setGeneratedText] = useState<string>('');
  
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO Parameters
  const seoTitle = "Random Text Generator Online | Free Content Generator";
  const seoDescription = "Generate random words, sentences, and paragraphs instantly with our free Random Text Generator.";

  const faqs = [
    {
      id: 1,
      question: "What is the Random Text Generator?",
      answer: "The Random Text Generator is an advanced utility that builds unique blocks of text based on your required volume. Instead of repetitive strings, it simulates natural English phrasing using curated vocabulary libraries tailored for specific genres like corporate communications or promotional copy."
    },
    {
      id: 2,
      question: "What text style modes are available?",
      answer: "We support four unique semantic variations: 'Simple text' (common relaxed terminology), 'Business text' (professional enterprise jargon), 'Marketing text' (impactful landing-page vocabulary), or 'Placeholder text' (Latin blended formatting keywords suitable for wireframing)."
    },
    {
      id: 3,
      question: "How are the sentences built?",
      answer: "The algorithm picks random terms from the specific style's word bank, joins them with occasionally placed conjunction modifiers (like and, but, while), capitalizes initial characters, and applies randomized sentence endings (periods or exclamation points)."
    },
    {
      id: 4,
      question: "Does this component require an API key or internet access?",
      answer: "No. The engine operates entirely using client-side JavaScript calculations. It is extremely fast, works 100% offline, and never sends your settings or outputs to any external servers."
    }
  ];

  // Title and FAQ Schema JSON-LD Setup
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

    const scriptId = "random-text-generator-json-ld";
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

  const handleGenerateText = () => {
    const vocab = VOCABULARY[textStyle] || VOCABULARY.simple;
    
    const getRandomWord = () => {
      return vocab[Math.floor(Math.random() * vocab.length)];
    };

    const getRandomConnector = () => {
      return CONNECTORS[Math.floor(Math.random() * CONNECTORS.length)];
    };

    // Construct single sentence
    const makeSentence = () => {
      const targetLength = Math.floor(Math.random() * 8) + 6; // 6 to 13 words
      const words: string[] = [];
      
      for (let i = 0; i < targetLength; i++) {
        let word = getRandomWord();
        if (i === 0) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        words.push(word);

        // Inject connector or commas occasionally
        if (i === Math.floor(targetLength / 2) && Math.random() > 0.4) {
          words.push(getRandomConnector() + ',');
        }
      }

      let sentence = words.join(' ');
      // Ensure clean punctuation marks
      if (sentence.endsWith(',')) {
        sentence = sentence.slice(0, -1);
      }
      return sentence + (Math.random() > 0.85 ? '!' : '.');
    };

    // Construct single paragraph
    const makeParagraph = () => {
      const sentenceCount = Math.floor(Math.random() * 4) + 4; // 4 to 7 sentences
      const sentences: string[] = [];
      for (let s = 0; s < sentenceCount; s++) {
        sentences.push(makeSentence());
      }
      return sentences.join(' ');
    };

    let result = '';

    if (generateUnit === 'words') {
      const wordsArray: string[] = [];
      while (wordsArray.length < amount) {
        let w = getRandomWord();
        if (wordsArray.length === 0) {
          w = w.charAt(0).toUpperCase() + w.slice(1);
        }
        wordsArray.push(w);
      }
      result = wordsArray.join(' ') + '.';
    } 
    else if (generateUnit === 'sentences') {
      const sentenceList: string[] = [];
      for (let s = 0; s < amount; s++) {
        sentenceList.push(makeSentence());
      }
      result = sentenceList.join(' ');
    } 
    else if (generateUnit === 'paragraphs') {
      const paragraphList: string[] = [];
      for (let p = 0; p < amount; p++) {
        paragraphList.push(makeParagraph());
      }
      result = paragraphList.join('\n\n');
    }

    setGeneratedText(result);
  };

  // Run dynamic generation on settings modifications
  useEffect(() => {
    handleGenerateText();
  }, [generateUnit, amount, textStyle]);

  // Command handlers
  const handleCopy = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to copy generated text: ', err);
    }
  };

  const handleDownload = () => {
    if (!generatedText) return;
    try {
      const element = document.createElement('a');
      const file = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(file);
      element.href = url;
      element.download = `random-generator-${amount}-${generateUnit}-${textStyle}.txt`;
      document.body.appendChild(element);
      element.click();
      setTimeout(() => {
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
      }, 150);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.warn('Unable to export text: ', err);
    }
  };

  // Helper stats values
  const getStatsText = () => {
    if (!generatedText) return { chars: 0, words: 0, lines: 0 };
    const chars = generatedText.length;
    const words = generatedText.split(/\s+/).filter(w => w.length > 0).length;
    const lines = generatedText.split(/\r?\n/).length;
    return { chars, words, lines };
  };

  const currentStats = getStatsText();

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/random-text-generator' && t.id !== 'random-text-generator').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="random-text-generator-page">
      {/* Decorative Blur Backgrounds */}
      <div className="glow-accent top-16 left-8 bg-indigo-500/10"></div>
      <div className="glow-accent top-96 right-16 bg-blue-500/10"></div>

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
            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            id="breadcrumbs-category"
          >
            Generators
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-800 dark:text-slate-200">Random Text Generator</span>
        </div>

        {/* Hero Section Banner */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 w-fit">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <Sparkle className="w-6 h-6 text-indigo-500" />
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-serif">
                Adaptive Dummy Wording
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display tracking-tight text-slate-950 dark:text-white leading-[1.1] mb-2">
              Random Text <span className="font-semibold text-indigo-600 dark:text-indigo-400">Generator</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Formulate adaptive prose blocks instantly. Configure amounts from single words to extensive sequences with business jargon or conversational wording.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            {showSeoMeta ? 'Hide SEO tags' : 'Inspect SEO Meta'}
          </button>
        </div>

        {/* Google Rank Preview Simulation */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800/80 rounded-2xl bg-indigo-55/10 dark:bg-slate-950 p-5 mb-8"
            id="seo-performance-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Bookmark className="w-4 h-4" /> Live Search Optimization Metadata
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 flex items-center gap-1 mb-1.5 font-mono">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/random-text-generator
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Dynamic Character counts strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
          <div className="p-4 border border-slate-200 dark:border-slate-805 bg-slate-50/30 dark:bg-slate-955/20 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Words Count</span>
            <span className="text-2xl font-semibold font-mono text-slate-800 dark:text-white">{currentStats.words}</span>
          </div>
          <div className="p-4 border border-slate-200 dark:border-slate-805 bg-slate-50/30 dark:bg-slate-955/20 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Paragraph Blocks</span>
            <span className="text-2xl font-semibold font-mono text-slate-800 dark:text-white">{generateUnit === 'paragraphs' ? amount : currentStats.lines}</span>
          </div>
          <div className="p-4 border border-slate-200 dark:border-slate-805 bg-slate-50/30 dark:bg-slate-955/20 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Characters Total</span>
            <span className="text-2xl font-semibold font-mono text-slate-800 dark:text-white">{currentStats.chars}</span>
          </div>
          <div className="p-4 border border-indigo-150 dark:border-indigo-950 bg-indigo-50/20 dark:bg-indigo-955/10 rounded-2xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-550 block mb-1">Calculation Runtime</span>
            <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-450 uppercase tracking-widest block mt-1.5">✓ 0ms Client-Side</span>
          </div>
        </div>

        {/* Two Columns Workspace Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT: Configuration controller (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6" id="generator-configurations-side">
            
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" /> Generator Adjusters
              </h3>

              <div className="space-y-6">
                
                {/* 1. Unit Selector */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 dark:text-slate-405 mb-2.5">
                    Generate Unit Level
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'words', title: 'Words' },
                      { id: 'sentences', title: 'Sentences' },
                      { id: 'paragraphs', title: 'Paragraphs' }
                    ].map((unit) => (
                      <button
                        key={unit.id}
                        onClick={() => {
                          setGenerateUnit(unit.id as any);
                          // Provide comfortable defaults when switching
                          if (unit.id === 'words') setAmount(100);
                          if (unit.id === 'sentences') setAmount(10);
                          if (unit.id === 'paragraphs') setAmount(3);
                        }}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                          generateUnit === unit.id
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                            : 'border-slate-150 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350'
                        }`}
                      >
                        {unit.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Amount Volume slider */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-extrabold text-slate-700 dark:text-slate-200">
                      Amount to Generate
                    </label>
                    <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 font-mono">
                      {amount} {generateUnit}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max={generateUnit === 'words' ? 500 : generateUnit === 'sentences' ? 50 : 15}
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                      className="flex-1 accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                    />

                    <input
                      type="number"
                      min="1"
                      max={generateUnit === 'words' ? 1000 : generateUnit === 'sentences' ? 100 : 30}
                      value={amount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        const maxLimit = generateUnit === 'words' ? 1000 : generateUnit === 'sentences' ? 100 : 30;
                        setAmount(Math.min(maxLimit, Math.max(1, val)));
                      }}
                      className="w-16 px-2 py-1 text-center font-mono text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* 3. Text Style Category Radios */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-650 dark:text-slate-405 mb-2.5">
                    Vocabulary Style Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'simple', label: 'Simple text', desc: 'Relaxed words' },
                      { id: 'business', label: 'Business jargon', desc: 'Enterprise terms' },
                      { id: 'marketing', label: 'Marketing Copy', desc: 'Landing callouts' },
                      { id: 'placeholder', label: 'Placeholder Mock', desc: 'Blended Latin' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setTextStyle(style.id as any)}
                        className={`p-3 border rounded-xl flex flex-col text-left transition-all ${
                          textStyle === style.id
                            ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 ring-1 ring-indigo-500/20'
                            : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                        }`}
                      >
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{style.label}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{style.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Action Button */}
                <button
                  onClick={handleGenerateText}
                  className="w-full py-3 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-2xl font-extrabold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider cursor-pointer"
                  id="btn-generate-again"
                >
                  <RefreshCw className="w-4 h-4" /> Generate Again
                </button>

              </div>
            </div>

          </div>

          {/* RIGHT: Output display preview and actions (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4" id="generator-output-viewports-side">
            
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col">
              
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-sans flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Outcome Output Box
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentStats.words} Words Generated
                </span>
              </div>

              {/* Read-only output box */}
              <textarea
                value={generatedText}
                readOnly
                placeholder="The random content text will formulate here in real-time as you tweak configurations..."
                className="w-full min-h-[354px] md:min-h-[400px] p-5 border-none resize-y text-slate-850 dark:text-slate-100 placeholder-slate-400 bg-transparent text-sm leading-relaxed focus:ring-0 focus:outline-none font-sans"
                id="random-text-generator-textarea"
              />

              {/* Bottom operational toolbar */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 relative z-10 flex-shrink-0">
                
                {/* Clear Workspace button */}
                <button
                  onClick={() => {
                    setGeneratedText('');
                  }}
                  disabled={!generatedText}
                  className="px-4 py-2 border border-slate-200 dark:border-slate-800 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:bg-slate-900 dark:hover:bg-rose-950/25 dark:hover:border-rose-900/40 text-slate-500 rounded-xl flex items-center gap-1.5 transition text-xs font-bold disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer relative z-10"
                  id="btn-clear"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Clear
                </button>

                <div className="flex items-center gap-2">


                  {/* Copy result and parameter values */}
                  <button
                    onClick={handleCopy}
                    disabled={!generatedText}
                    className={`px-5 py-2.5 rounded-xl flex items-center gap-1.5 text-xs font-extrabold tracking-wide transition-all duration-200 shadow-sm disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer relative z-10 ${
                      copied 
                        ? 'bg-emerald-600 border border-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500'
                    }`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied successfully!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Output
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Editorial Articles explaining the content design */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Column A */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550 font-sans">Product Design & Layouts</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-950 dark:text-white mt-1 mb-4">
              Why use thematic random content?
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                Standard Greeking structures (such as classical Roman text) can sometimes look out of place when demoing modern user interfaces with live stakeholders. For example, a crisp financial application filled with ancient Roman Latin looks disjointed and creates cognitive drift for clients reviewing the interface.
              </p>
              <p>
                Our <strong>Random Text Generator Online</strong> allows you to formulate dummy contents tailored strictly to the theme of your mockups. Swapping in corporate action items or punchy promotional listings instantly elevates the fidelity and perceived elegance of your layout designs.
              </p>
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-8 mb-3">
              How the algorithm generates patterns
            </h3>
            <ul className="text-sm list-decimal pl-5 space-y-2 leading-relaxed">
              <li>Select your preferred scope: Words, Sentences, or Paragraph elements.</li>
              <li>Toggle volume counts: quickly generate single phrasing or extensive pages of text.</li>
              <li>Choose the vocabulary flavor: business corporate, direct promotional marketing, or simple everyday communications.</li>
              <li>Instantly review stats, trigger regeneration cycles, or download text logs seamlessly.</li>
            </ul>
          </div>

          {/* Column B */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-550">Functional Highlights</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-950 dark:text-white mt-1 mb-4">
              Value Propositions
            </h2>

            <div className="space-y-4 text-sm leading-relaxed">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-150">Curated Vocabulary Banks</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Four distinct vocabularies capture business metrics, promotional adjectives, plain language, or placeholder text styles.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-150">Balanced Layout Spacing</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Unlike basic patterns repeating words, our generators adjust line punctuation counts to mimic natural English reading flow perfectly.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-150">100% Client Security</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Designed for internal developer sandboxes. Your draft criteria never leave your system, shielding confidential intellectual ideas.</p>
              </div>
            </div>
          </div>

        </section>

        {/* FAQs Section */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-indigo-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Learn more about how our formatting engine structures placeholder templates.
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
                    id={`random-faq-item-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-sans font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                      <div className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-205 flex-shrink-0">
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

        {/* Dynamic Related utilities grid */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Explore Companion Formatting Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`random-related-card-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors duration-200 flex items-center justify-between">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-4 block">
                  Open Utility →
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
