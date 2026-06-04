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
  Layers,
  FileCode
} from 'lucide-react';

interface LoremIpsumGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

// Classic Lorem Ipsum vocabulary array to generate grammatically paced sentences
const LOREM_VOCABULARY = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'ut', 
  'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 
  'nisi', 'ut', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 
  'in', 'reprehenderit', 'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 
  'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 
  'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum',
  'auctor', 'ornare', 'feugiat', 'pretium', 'viverra', 'suspendisse', 'potenti', 'habitant', 
  'morbi', 'tristique', 'senectus', 'netus', 'et', 'malesuada', 'fames', 'ac', 'turpis', 'egestas', 
  'gravida', 'in', 'fermentum', 'et', 'sollicitudin', 'ac', 'orci', 'phasellus', 'egestas', 'tellus', 
  'rutrum', 'tellor', 'scelerisque', 'felis', 'imperdiet', 'proin', 'fermentum', 'leo', 'vel', 
  'orci', 'porta', 'non', 'pulvinar', 'neque', 'laoreet', 'suspendisse', 'interdum', 'consectetur', 
  'libero', 'id', 'faucibus', 'nisl', 'tincidunt', 'eget', 'nullam', 'non', 'nisi', 'est', 
  'sit', 'amet', 'facilisis', 'magna', 'etiam', 'tempor', 'orci', 'eu', 'lobortis', 'elementum'
];

export default function LoremIpsumGeneratorView({ onNavigateToTool, onNavigateHome }: LoremIpsumGeneratorViewProps) {
  // Generation criteria state variable parameters
  const [generateType, setGenerateType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(5);
  
  // Custom structure boundaries per item
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState<number>(6);
  const [wordsPerSentence, setWordsPerSentence] = useState<number>(12);
  
  const [startWithLorem, setStartWithLorem] = useState<boolean>(true);
  const [generatedText, setGeneratedText] = useState<string>('');
  
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO Info Config
  const seoTitle = "Lorem Ipsum Generator Online | Free Placeholder Text";
  const seoDescription = "Generate Lorem Ipsum placeholder text instantly for websites, designs, apps, and mockups.";

  const faqs = [
    {
      id: 1,
      question: "What is Lorem Ipsum placeholder text?",
      answer: "Lorem Ipsum is standard mock-up layout placeholder copy used across printing, graphic design, and engineering fields. It replaces meaningful, readable prose so design components—their typography, grid heights, and spacing balances—can be assessed without linguistic distraction."
    },
    {
      id: 2,
      question: "How does this generator compute sentences and paragraphs?",
      answer: "Our client-side tool contains a classic standard Latin word library. It dynamically compiles words into balanced sentence groupings (ending randomly with periods, exclamation marks, or question symbols) and aggregates sentences into cohesive placeholder paragraphs."
    },
    {
      id: 3,
      question: "Can I choose not to start with the standard 'Lorem ipsum dolor...' phrase?",
      answer: "Absolutely! By turning off 'Start with Lorem ipsum', the engine randomizes the initial words of your generated chunk, giving you a completely refreshed variety of layout copy."
    },
    {
      id: 4,
      question: "Is there an output limits threshold?",
      answer: "To prevent memory overload or system latency inside the browser tab, the maximum thresholds are set to 100 Paragraphs, 250 Sentences, or 5,000 Words. This handles any layout, screen size, or stress-testing requirement seamlessly."
    },
    {
      id: 5,
      question: "Is this tool completely private and free?",
      answer: "Yes, 100%! All computing algorithms run completely client-side in safety inside your own browser window space. Your content is never synced over external databases, ensuring complete developer data anonymity."
    }
  ];

  // Dynamic SEO Setup & Schema-FAQ JSON-LD Injection
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

    const scriptId = "lorem-ipsum-generator-json-ld";
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

  // Text Generator core function logic
  const handleGenerate = () => {
    // Limits safeguard structures
    const validCount = Math.max(1, Math.min(5000, count));
    const validSentencesPerPara = Math.max(2, Math.min(20, sentencesPerParagraph));
    const validWordsPerSent = Math.max(4, Math.min(30, wordsPerSentence));

    let result = '';

    // Helper: Select random classic latin term
    const getRandomWord = () => {
      return LOREM_VOCABULARY[Math.floor(Math.random() * LOREM_VOCABULARY.length)];
    };

    // Helper: Generate a single cohesive sentence
    const generateSentence = (wordLimit: number, forceStartingLorem: boolean = false) => {
      let sentenceWords: string[] = [];
      
      if (forceStartingLorem) {
        sentenceWords = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        while (sentenceWords.length < wordLimit) {
          sentenceWords.push(getRandomWord());
        }
      } else {
        // Construct standard random sentence words
        for (let i = 0; i < wordLimit; i++) {
          const w = getRandomWord();
          if (i === 0) {
            sentenceWords.push(w.charAt(0).toUpperCase() + w.slice(1));
          } else {
            sentenceWords.push(w);
          }
        }
      }

      // Add comma splits occasionally for syntactic flow
      if (sentenceWords.length > 8) {
        const splitIndex = Math.floor(sentenceWords.length / 2);
        sentenceWords[splitIndex] = sentenceWords[splitIndex] + ',';
      }

      // Add a period terminator at the end
      let finalSentence = sentenceWords.join(' ');
      
      // Assure ending punctuation
      if (!finalSentence.endsWith('.') && !finalSentence.endsWith(',')) {
        finalSentence += '.';
      } else if (finalSentence.endsWith(',')) {
        finalSentence = finalSentence.slice(0, -1) + '.';
      }

      return finalSentence;
    };

    // Case 1: Paragraphs Mode
    if (generateType === 'paragraphs') {
      const paragraphChunks: string[] = [];
      for (let p = 0; p < validCount; p++) {
        const sentenceChunks: string[] = [];
        
        // Randomize count slightly per paragraph to look human/natural
        const sentenceLimit = Math.max(2, validSentencesPerPara + Math.floor(Math.random() * 3) - 1);

        for (let s = 0; s < sentenceLimit; s++) {
          const wordLimit = Math.max(4, validWordsPerSent + Math.floor(Math.random() * 5) - 2);
          const isAbsoluteFirst = p === 0 && s === 0;
          sentenceChunks.push(generateSentence(wordLimit, isAbsoluteFirst && startWithLorem));
        }
        paragraphChunks.push(sentenceChunks.join(' '));
      }
      result = paragraphChunks.join('\n\n');
    } 
    // Case 2: Sentences Mode
    else if (generateType === 'sentences') {
      const sentenceChunks: string[] = [];
      for (let s = 0; s < validCount; s++) {
        const wordLimit = Math.max(4, validWordsPerSent + Math.floor(Math.random() * 5) - 2);
        const isAbsoluteFirst = s === 0;
        sentenceChunks.push(generateSentence(wordLimit, isAbsoluteFirst && startWithLorem));
      }
      result = sentenceChunks.join(' ');
    } 
    // Case 3: Words Mode
    else if (generateType === 'words') {
      let wordsBag: string[] = [];
      
      if (startWithLorem && validCount >= 5) {
        wordsBag = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
      } else if (startWithLorem && validCount > 0) {
        const starters = ['lorem', 'ipsum', 'dolor', 'sit', 'amet'];
        wordsBag = starters.slice(0, validCount).map((w, index) => index === 0 ? 'Lorem' : w);
      }

      while (wordsBag.length < validCount) {
        wordsBag.push(getRandomWord());
      }

      // Format words bag nicely
      let textLine = wordsBag.join(' ');
      // Capitalize first letter of outcome
      textLine = textLine.charAt(0).toUpperCase() + textLine.slice(1);
      // Terminate with period at very end
      if (textLine && !textLine.endsWith('.')) {
        textLine += '.';
      }
      result = textLine;
    }

    setGeneratedText(result);
  };

  // Run dynamic compilation on setting mutations
  useEffect(() => {
    handleGenerate();
  }, [generateType, count, sentencesPerParagraph, wordsPerSentence, startWithLorem]);

  // Operations Tool handles
  const handleCopy = async () => {
    if (!generatedText) return;
    try {
      await navigator.clipboard.writeText(generatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Unable to write to clipboard: ', err);
    }
  };

  const handleDownload = () => {
    if (!generatedText) return;
    try {
      const element = document.createElement('a');
      const file = new Blob([generatedText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(file);
      element.href = url;
      element.download = `lorem-ipsum-placeholder-${count}-${generateType}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (err) {
      console.warn('Unable to deliver txt file export: ', err);
    }
  };

  // Helper dynamic statistics counts
  const getStats = () => {
    if (!generatedText) return { chars: 0, words: 0, paragraphs: 0 };
    const chars = generatedText.length;
    const words = generatedText.split(/\s+/).filter(w => w.length > 0).length;
    const paragraphs = generatedText.split('\n\n').filter(p => p.trim().length > 0).length;
    return { chars, words, paragraphs };
  };

  const stats = getStats();

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Exclude current lorem generator from relevant related companion tools grid
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/lorem-ipsum-generator' && t.id !== 'lorem-ipsum-generator').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="lorem-ipsum-generator-page">
      {/* Glow Ambient Effects */}
      <div className="glow-accent top-12 left-10 bg-indigo-500/10"></div>
      <div className="glow-accent top-80 right-20 bg-emerald-500/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Navigation Breadcrumb Rail */}
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
            id="breadcrumbs-category"
          >
            Generators
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-slate-800 dark:text-slate-200">Lorem Ipsum Generator</span>
        </div>

        {/* Hero Section Banner */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2 w-fit">
              <span className="p-2.5 bg-indigo-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <FileCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </span>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-serif">
                Layout Dummy Text
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display tracking-tight text-slate-950 dark:text-white leading-[1.1] mb-2">
              Lorem Ipsum <span className="font-semibold text-indigo-600 dark:text-indigo-400">Generator</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Generate customizable, classic placeholder dummy texts instantly. Fine-tune sentence length, paragraph density, word count ratios, and starting signatures.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition"
            id="seo-inspector-btn"
          >
            <Globe className="w-4 h-4 text-indigo-500" />
            {showSeoMeta ? 'Collapse SEO Meta' : 'Inspect SEO Meta Tags'}
          </button>
        </div>

        {/* SEO Metadata Box */}
        {showSeoMeta && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-indigo-100 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="seo-snippet-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <BookmarkCheck className="w-4 h-4" /> Real-time search engine optimization (SEO) Preview
            </div>
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/lorem-ipsum-generator
              </div>
              <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Dynamic Analytics & Live Generated Stats display banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          
          <div className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-955/20 rounded-2xl flex flex-col justify-between">
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400">Total Paragraphs</span>
            <span className="text-2.5xl font-bold font-mono font-display text-slate-900 dark:text-white mt-1">{stats.paragraphs}</span>
          </div>

          <div className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-955/20 rounded-2xl flex flex-col justify-between">
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400">Total Words</span>
            <span className="text-2.5xl font-bold font-mono font-display text-slate-900 dark:text-white mt-1">{stats.words}</span>
          </div>

          <div className="p-4 border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-955/20 rounded-2xl flex flex-col justify-between">
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-slate-400">Total Characters</span>
            <span className="text-2.5xl font-bold font-mono font-display text-slate-900 dark:text-white mt-1">{stats.chars}</span>
          </div>

          <div className="p-4 border border-indigo-150 dark:border-indigo-950 bg-indigo-50/20 dark:bg-indigo-955/10 rounded-2xl flex flex-col justify-between">
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-indigo-500">Generation Level</span>
            <span className="text-base font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide mt-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Fast-Local
            </span>
          </div>

        </div>

        {/* Outer Split layout columns container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* LEFT COLUMN: Parametric customization controller (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6" id="lorem-generator-config">
            
            <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950 rounded-3xl p-6 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" /> Generator Criteria Settings
              </h3>

              <div className="space-y-6">
                
                {/* 1. Unit Selector Category Toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-2.5">
                    Generate By
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'paragraphs', title: 'Paragraphs' },
                      { id: 'sentences', title: 'Sentences' },
                      { id: 'words', title: 'Words' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => {
                          setGenerateType(type.id as any);
                          // Provide suitable base counts matching choice
                          if (type.id === 'paragraphs') setCount(5);
                          if (type.id === 'sentences') setCount(15);
                          if (type.id === 'words') setCount(250);
                        }}
                        className={`py-2 px-3 border rounded-xl text-xs font-bold transition-all ${
                          generateType === type.id
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                            : 'border-slate-200 bg-white hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350'
                        }`}
                      >
                        {type.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Volume quantity control */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Amount to Generate
                    </label>
                    <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 font-mono">
                      {count} {generateType}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max={generateType === 'paragraphs' ? 50 : generateType === 'sentences' ? 100 : 1000}
                      value={count}
                      onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                      className="flex-1 accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                    />
                    <input
                      type="number"
                      min="1"
                      max={generateType === 'paragraphs' ? 100 : generateType === 'sentences' ? 250 : 5000}
                      value={count}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        const maxLimit = generateType === 'paragraphs' ? 100 : generateType === 'sentences' ? 250 : 5000;
                        setCount(Math.min(maxLimit, Math.max(1, val)));
                      }}
                      className="w-16 px-2 py-1 text-center font-mono text-xs border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Dynamic advanced paragraph settings */}
                {generateType === 'paragraphs' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-4 border-t border-slate-150 dark:border-slate-800/80 space-y-4"
                  >
                    {/* Sentences per paragraph */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-slate-650 dark:text-slate-350">
                          Sentences per Paragraph
                        </label>
                        <span className="text-xs text-slate-500 font-mono font-bold">{sentencesPerParagraph}</span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="15"
                        value={sentencesPerParagraph}
                        onChange={(e) => setSentencesPerParagraph(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Advanced words settings common for paragraph and sentence modes */}
                {generateType !== 'words' && (
                  <div className="pt-4 border-t border-slate-150 dark:border-slate-800/80 space-y-4">
                    {/* Words per sentence slider */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-xs font-bold text-slate-650 dark:text-slate-350">
                          Average Sentence Length
                        </label>
                        <span className="text-xs text-slate-500 font-mono font-bold">{wordsPerSentence} words</span>
                      </div>
                      <input
                        type="range"
                        min="4"
                        max="25"
                        value={wordsPerSentence}
                        onChange={(e) => setWordsPerSentence(parseInt(e.target.value))}
                        className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                      />
                    </div>
                  </div>
                )}

                {/* 3. Prefix Option Settings */}
                <div className="pt-4 border-t border-slate-150 dark:border-slate-800/80 space-y-3">
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                    Formatting Parameters
                  </label>

                  <label className="flex items-center gap-3 p-3 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 cursor-pointer hover:bg-slate-100 select-none transition-all">
                    <input
                      type="checkbox"
                      checked={startWithLorem}
                      onChange={(e) => setStartWithLorem(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-slate-300 dark:border-slate-700 rounded focus:ring-indigo-500 bg-transparent"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Start with "Lorem ipsum"</span>
                      <span className="text-[10px] text-slate-400">Begins output with matching standard Latin phrase signature</span>
                    </div>
                  </label>
                </div>

                {/* Generate Action Button */}
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-2xl font-bold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all text-sm uppercase tracking-wider"
                  id="btn-lorem-regenerate"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate Text
                </button>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Output display area with copy and download exports (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4" id="lorem-generator-output">
            
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col">
              
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest font-sans flex items-center gap-1.51 bg-indigo-50/10 px-2 py-1 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Dynamic Generated Output
                </span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  Units generated: {count} {generateType}
                </span>
              </div>

              {/* Generated dummy outcome viewport */}
              <textarea
                value={generatedText}
                readOnly
                placeholder="Lorem ipsum placeholder outputs will formulate here instantly..."
                className="w-full min-h-[350px] md:min-h-[432px] p-5 border-none resize-y text-slate-850 dark:text-slate-100 placeholder-slate-400 bg-transparent text-sm leading-relaxed focus:bg-transparent focus:ring-0 focus:outline-none font-sans"
                id="lorem-generator-textarea"
              />

              {/* Bottom operational exporters bar */}
              <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 relative z-10 flex-shrink-0">
                
                {/* Clear Workspace button */}
                <button
                  onClick={() => {
                    setGeneratedText('');
                  }}
                  disabled={!generatedText}
                  className="px-4 py-2 border border-slate-205 dark:border-slate-800 bg-white hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 dark:bg-slate-950 dark:hover:bg-rose-950/25 dark:hover:border-rose-900/40 text-slate-500 rounded-xl flex items-center gap-1.5 transition text-xs font-bold disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer relative z-10"
                  id="btn-clear"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Clear
                </button>

                <div className="flex items-center gap-2">
                  {/* Download repeated text file */}
                  <button
                    onClick={handleDownload}
                    disabled={!generatedText}
                    className="px-4 py-2 border border-slate-205 dark:border-slate-800 bg-white hover:bg-slate-100 dark:bg-slate-950 text-slate-650 dark:text-slate-200 rounded-xl flex items-center gap-1.5 transition text-xs font-bold disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer relative z-10"
                    id="btn-download"
                  >
                    <Download className="w-3.5 h-3.5 text-indigo-500" />
                    {downloaded ? 'Downloaded!' : 'Download TXT File'}
                  </button>

                  {/* Copy repeatable parameters output */}
                  <button
                    onClick={handleCopy}
                    disabled={!generatedText}
                    className={`px-5 py-2.5 rounded-xl flex items-center gap-1.5 text-xs font-extrabold tracking-wide transition-all duration-250 shadow-sm disabled:opacity-35 disabled:cursor-not-allowed cursor-pointer relative z-10 ${
                      copied 
                        ? 'bg-emerald-600 border border-emerald-600 hover:bg-emerald-700 text-white shadow-md' 
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500'
                    }`}
                    id="btn-copy"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied Placeholder!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Dummy Text
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* Informative Editorial Copy Articles Section */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          
          {/* Section A: Description and History */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 font-sans">Visual Presentation</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-950 dark:text-white mt-1 mb-4">
              What is the origin of Lorem Ipsum?
            </h2>
            <div className="text-sm leading-relaxed space-y-4">
              <p>
                The standard **Lorem Ipsum** text passages are loosely constructed from classic Latin academic writings composed by Roman philosopher **Marcus Tullius Cicero** in 45 BC. Cicero wrote "De Finibus Bonorum et Malorum" (On the Extremes of Good and Evil), where phrases looking similar to contemporary dummy structures take form.
              </p>
              <p>
                In the 1500s, an anonymous typographer compiled layout blocks from these writings into an unreadable Latin specimen book to test printing presses safely. Intriguingly, this formatting framework survived centuries, eventually becoming integrated into computer and graphic software today.
              </p>
            </div>

            <h3 className="text-base font-semibold text-slate-900 dark:text-white mt-8 mb-3">
              Why use placeholder text?
            </h3>
            <p className="text-sm leading-relaxed">
              When reviewing layouts containing familiar, coherent English prose, viewers focus overwhelmingly on the semantic messages and grammatical meaning. This "reading cognitive workload" distracts from evaluating column flow heights, kerning properties, letter sizes, responsive box heights, or bento layout breaks. Replacing meaningful text with random scrambled Latin preserves absolute aesthetic focus.
            </p>
          </div>

          {/* Section B: Feature matrices */}
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500">Value Checklist</span>
            <h2 className="text-2xl font-light font-display tracking-tight text-slate-950 dark:text-white mt-1 mb-4">
              Lorem Ipsum Key Features
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-150">Perfect Word Distribution</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Simulates standard typographic spacing distributions far more effectively than basic patterns or words repeating endlessly.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-150">Parametric Sliders</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enforce tailored boundaries: adjust word quantities, custom sentence averages, and exact paragraph counts on the fly.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-150">Zero Networking Latency</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Generates extensive volumes of mockup templates with zero wait periods since everything processes locally client-side.</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                <h4 className="font-bold text-slate-850 dark:text-slate-150">Safe Layout Testing</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">No risk of exposing confidential corporate projects or raw private contents. Everything lives and dies inside random mock-up structures.</p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-indigo-50/20 dark:bg-indigo-955/20 border border-indigo-100/40 dark:border-indigo-900/40 rounded-2xl text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">✓ Smart Seed Randomization:</span>
              Our vocabulary arrays randomize word structures cleanly, delivering unique paragraphs every single time you hit the "Regenerate" trigger button.
            </div>
          </div>

        </section>

        {/* FAQ Accordion Details */}
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
                    id={`lorem-faq-item-${faq.id}`}
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

        {/* Related utilities navigation footer footer */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Explore Companion Copywriting Utilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div 
                key={tool.id} 
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 bg-white dark:bg-slate-955 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`lorem-related-card-${tool.id}`}
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
