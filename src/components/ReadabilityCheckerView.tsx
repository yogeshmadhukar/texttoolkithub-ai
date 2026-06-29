import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Clock,
  Sparkles,
  Copy,
  Check,
  Trash2,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Globe,
  BookmarkCheck,
  AlertCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  TrendingUp,
  Award,
  CheckCircle2,
  Info
} from 'lucide-react';

interface ReadabilityCheckerViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface ReadabilityMetrics {
  wordsCount: number;
  sentencesCount: number;
  charactersCount: number;
  syllablesCount: number;
  avgSentenceLength: number;
  avgWordLength: number;
  fleschScore: number;
  readingEaseRating: 'Easy' | 'Medium' | 'Difficult';
  readingTimeSec: number;
}

interface SuggestionItem {
  id: string;
  type: 'long-sentence' | 'passive-voice' | 'long-word' | 'filler-word';
  text: string;
  context?: string;
  explanation: string;
}

export default function ReadabilityCheckerView({ onNavigateToTool, onNavigateHome }: ReadabilityCheckerViewProps) {
  const [inputText, setInputText] = useState('');
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [showSeoMeta, setShowSeoMeta] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // SEO specifications
  const seoTitle = "Readability Checker Online | TextToolkitHub";
  const seoDescription = "Analyze reading difficulty, readability score, and text clarity with our free Readability Checker.";

  const faqs = [
    {
      id: 1,
      question: "What is a Readability Checker?",
      answer: "A readability checker is a utility that analyzes the clarity, complexity, and reading difficulty of written text. It evaluates factors like sentence length, syllable count, and grammatical structures to estimate how easily a general audience can comprehend the material."
    },
    {
      id: 2,
      question: "How is the Readability Score calculated?",
      answer: "Our tool calculates readability using the globally recognized Flesch Reading Ease formula. This mathematical model analyzes the relationships between total words, sentences, and syllables in your text. The calculation outputs a core score ranging from 0 to 100."
    },
    {
      id: 3,
      question: "What do the Easy, Medium, and Difficult ratings correspond to?",
      answer: "Our ratings map directly to the Flesch scale. 'Easy' (70-100 score) corresponds to a 5th to 7th-grade reading level. 'Medium' (50-69 score) matches an 8th to 12th-grade level, suitable for general consumers. 'Difficult' (0-49 score) represents university or professional-grade academic and legal text."
    },
    {
      id: 4,
      question: "Are my analyzed essays and documents secure?",
      answer: "Absolutely. TextToolkitHub does not run any server-side database or cloud synchronization API. All text analytics processing occurs 100% locally in your web browser's virtual memory context. No text is uploaded, tracked, or transmitted to any external server."
    },
    {
      id: 5,
      question: "How can I quickly improve a low readability rating?",
      answer: "To improve your readability ease rating, systematically shorten your sentences, split long compound clauses into independent statements, replace three-syllable jargon words with simple alternatives, and remove passive voice elements."
    },
    {
      id: 6,
      question: "What is the Flesch-Kincaid Grade Level?",
      answer: "Flesch-Kincaid Grade Level is a variation that translates the raw reading ease score into equivalent US school grade levels. For example, a reading ease score of 65 translates roughly to an 8th-grade level, making it easy to see exactly who can comprehend your work."
    },
    {
      id: 7,
      question: "What readability score should I aim for on my corporate website?",
      answer: "For consumer websites, standard blogs, and digital marketing, you should aim for a score between 60 and 70 (8th to 9th-grade reading level). Studies show that clear, easily digestible writing leads to higher conversions and lower bounce rates."
    },
    {
      id: 8,
      question: "Does using heavy vocabulary automatically lower my readability score?",
      answer: "Yes, because the readability difficulty rating relies directly on syllable count. Polysyllabic words (e.g., 'unambiguously' or 'institutionalized') signal a higher educational requirement to algorithms, resulting in a lower score."
    },
    {
      id: 9,
      question: "Can I use this checker for creative writing or novels?",
      answer: "Absolutely. Authors and editors use readability checkers to verify stylistic consistency across chapters, ensuring prose remains highly engaging, simple, and matches the target demographic's comprehension level."
    },
    {
      id: 10,
      question: "Is the calculated reading time speed accurate for all users?",
      answer: "The estimated reading time is based on an industry-standard benchmark speed of 225 words per minute. Although individual reading speeds vary significantly, this standard offers a reliable baseline measurement for content planning."
    }
  ];

  // Configure SEO metadata and FAQ schema dynamic injection
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

    const scriptId = "readability-checker-json-ld";
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

  // Robust client-side syllable counter for Flesch score approximation
  const countSyllablesInWord = (word: string): number => {
    let cleanWord = word.toLowerCase().trim();
    if (cleanWord.length <= 2) return 1;
    
    // Remove non-alphabetic endings
    cleanWord = cleanWord.replace(/[^a-z]/g, '');
    if (!cleanWord) return 0;

    // Remove silent 'e', 'ed', and simple plural endings
    cleanWord = cleanWord.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    cleanWord = cleanWord.replace(/^y/, '');

    const vowelCount = cleanWord.match(/[aeiouy]{1,2}/g);
    let syllables = vowelCount ? vowelCount.length : 1;

    return Math.max(1, syllables);
  };

  // Run comprehensive readability evaluation
  const metrics: ReadabilityMetrics = (() => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      return {
        wordsCount: 0,
        sentencesCount: 0,
        charactersCount: 0,
        syllablesCount: 0,
        avgSentenceLength: 0,
        avgWordLength: 0,
        fleschScore: 100,
        readingEaseRating: 'Easy',
        readingTimeSec: 0
      };
    }

    const words = trimmed.split(/\s+/).filter(w => w.length > 0);
    const wordsCount = words.length;
    const charactersCount = textCleanedForLength(inputText).length;

    // Sentence splitting: split on dot, exclamation or question mark followed by whitespace/end
    const sentences = trimmed.split(/[.!?]+(?=\s|$)/).filter(s => s.trim().length > 0);
    const sentencesCount = Math.max(1, sentences.length);

    // Sum syllables over all words
    let totalSyllables = 0;
    words.forEach(w => {
      totalSyllables += countSyllablesInWord(w);
    });

    const avgSentenceLength = parseFloat((wordsCount / sentencesCount).toFixed(1));
    const avgWordLength = parseFloat((charactersCount / wordsCount).toFixed(1));

    // Calculate Flesch Reading Ease score
    // Flesch formula = 206.835 - 1.015 * (total_words / total_sentences) - 84.6 * (total_syllables / total_words)
    let score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * (totalSyllables / wordsCount));
    score = Math.max(0, Math.min(100, score)); // Bound score between 0 and 100
    const fleschScore = parseFloat(score.toFixed(1));

    // Define ease rating categories
    let readingEaseRating: 'Easy' | 'Medium' | 'Difficult' = 'Easy';
    if (fleschScore < 50) {
      readingEaseRating = 'Difficult';
    } else if (fleschScore < 70) {
      readingEaseRating = 'Medium';
    }

    // Typical silent reading time calculations (average 225 WPM)
    const readingTimeSec = Math.ceil((wordsCount / 225) * 60);

    return {
      wordsCount,
      sentencesCount,
      charactersCount,
      syllablesCount: totalSyllables,
      avgSentenceLength,
      avgWordLength,
      fleschScore,
      readingEaseRating,
      readingTimeSec
    };
  })();

  function textCleanedForLength(str: string): string {
    return str.replace(/[^A-Za-z0-9]/g, '');
  }

  // Generate actionable readability improvement tips dynamically
  const suggestions: SuggestionItem[] = (() => {
    const list: SuggestionItem[] = [];
    const trimmed = inputText.trim();
    if (!trimmed) return list;

    // 1. Long sentences checker (>20 words)
    const rawSentences = trimmed.split(/[.!?]+(?=\s|$)/);
    rawSentences.forEach((sentenceText, idx) => {
      const cleanSentence = sentenceText.trim();
      if (!cleanSentence) return;
      const sentenceWordsCount = cleanSentence.split(/\s+/).filter(w => w.length > 0).length;
      if (sentenceWordsCount > 20) {
        list.push({
          id: `long-sentence-${idx}`,
          type: 'long-sentence',
          text: `Sentence has ${sentenceWordsCount} words. Consider breaking it into shorter components.`,
          context: `"${cleanSentence.substring(0, 60)}..."`,
          explanation: `Long sentences degrade user retention and are harder to parse on smaller displays. Aim for 12–15 words per sentence.`
        });
      }
    });

    // 2. Complex or wordy words checker (>=4 syllables)
    const words = trimmed.split(/[\s,.:;!?"'(){}[\]]+/).filter(w => w.length > 4);
    const processedLongWords = new Set<string>();
    words.forEach((wordClean) => {
      const lowerWord = wordClean.toLowerCase();
      if (processedLongWords.has(lowerWord)) return;
      
      const syllables = countSyllablesInWord(wordClean);
      if (syllables >= 4) {
        processedLongWords.add(lowerWord);
        list.push({
          id: `long-word-${lowerWord}`,
          type: 'long-word',
          text: `"${wordClean}" has ${syllables} syllables.`,
          explanation: `Frequent use of polysyllabic words reduces reading ease. Try to substitute with a simpler synonym if possible.`
        });
      }
    });

    // 3. Passive voice warning parser (be/is/was... + past participle endings)
    const passiveVoiceRegex = /\b(am|is|are|was|were|be|been|being)\b\s+([a-z]+ed|written|done|taken|chosen|seen|given|kept|found|built|made|known)\b/gi;
    let matchPassive;
    let passiveMatchCount = 0;
    while ((matchPassive = passiveVoiceRegex.exec(trimmed)) !== null && passiveMatchCount < 5) {
      passiveMatchCount++;
      list.push({
        id: `passive-${passiveMatchCount}-${matchPassive[0]}`,
        type: 'passive-voice',
        text: `Passive formulation detected: "${matchPassive[0]}"`,
        explanation: 'Active voice engages readers directly and keeps layouts clear. Rephrase from "was written by XYZ" to "XYZ wrote..."'
      });
    }

    // 4. Wordy filler word flags
    const fillerWords = [
      { word: 'basically', alt: 'simply' },
      { word: 'actually', alt: 'in fact' },
      { word: 'very', alt: 'highly or delete' },
      { word: 'really', alt: 'significantly' },
      { word: 'literally', alt: 'eliminate' },
      { word: 'absolutely', alt: 'eliminate' },
      { word: 'totally', alt: 'primarily' },
      { word: 'just', alt: 'eliminate' }
    ];

    fillerWords.forEach(f => {
      const regex = new RegExp(`\\b${f.word}\\b`, 'gi');
      if (regex.test(trimmed)) {
        list.push({
          id: `filler-${f.word}`,
          type: 'filler-word',
          text: `Weak filler word: "${f.word}"`,
          explanation: `Filter phrases weaken sentence authority. Omit "${f.word}" or replace with an active synonym.`
        });
      }
    });

    return list.slice(0, 8); // Display at most 8 suggestions
  })();

  // Clear work interface
  const handleClear = () => {
    setInputText('');
  };

  // Copy content
  const handleCopyInput = async () => {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
      setCopiedOriginal(true);
      setTimeout(() => setCopiedOriginal(false), 2000);
    } catch (err) {
      console.warn('Failed to copy input content:', err);
    }
  };

  // Pre-load benchmark sample paragraph
  const handleLoadSample = () => {
    setInputText('Readability formulas help copywriters measure text clarity. If you write overly complex paragraphs with massive sentences, your client will be confused. In order to optimize your marketing conversion rates, keep sentences short and clear. Choose simple words instead of pretentious academic vocabulary.');
  };

  const getScoreColorClass = (score: number) => {
    if (score >= 70) return { text: 'text-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-950/20', border: 'border-emerald-250 dark:border-emerald-900', ring: 'ring-emerald-500/10' };
    if (score >= 50) return { text: 'text-amber-500', bg: 'bg-amber-50/50 dark:bg-amber-950/20', border: 'border-amber-250 dark:border-amber-900', ring: 'ring-amber-500/10' };
    return { text: 'text-rose-500', bg: 'bg-rose-50/50 dark:bg-rose-950/20', border: 'border-rose-250 dark:border-rose-900', ring: 'ring-rose-500/10' };
  };

  const scoreUiTheme = getScoreColorClass(metrics.fleschScore);
  const relatedTools = TOOLS.filter(t => t.id !== 'tools/readability-checker').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="readability-checker-root">
      {/* Visual background gradients */}
      <div className="glow-accent top-12 right-20 bg-indigo-400/10"></div>
      <div className="glow-accent bottom-36 left-8 bg-emerald-400/10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative z-10">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-xs font-bold font-sans">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-1 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            id="breadcrumbs-home"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Portal Home
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <button
            onClick={() => onNavigateToTool('tools')}
            className="text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition cursor-pointer"
            id="breadcrumbs-tools"
          >
            Tools
          </button>
          <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-700" />
          <span className="text-emerald-600 dark:text-emerald-450">Readability Checker</span>
        </div>

        {/* Page Title Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white flex items-center gap-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-slate-800 rounded-2xl w-fit inline-block">
                <BookOpen className="w-7 h-7 text-emerald-500" />
              </span>
              Readability Checker
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Analyze paragraph clarity, syllable density, and reading levels instantly. Get dynamic metrics and suggestions to improve reading ease.
            </p>
          </div>

          <button
            onClick={() => setShowSeoMeta(!showSeoMeta)}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shadow-inner cursor-pointer"
            id="readability-seo-btn"
          >
            <Globe className="w-4 h-4 text-emerald-500" />
            {showSeoMeta ? 'Hide Search Preview' : 'Show Search Preview'}
          </button>
        </div>

        {/* SEO tag preview visualizer */}
        {showSeoMeta && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border border-emerald-100 dark:border-slate-800 rounded-2xl bg-emerald-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
            id="readability-seo-card"
          >
            <div className="flex items-center gap-2 mb-3.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <BookmarkCheck className="w-4 h-4" /> Google Search Result Visualizer
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
              <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1.5">
                <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
                https://texttoolkithub.com/tools/readability-checker
              </div>
              <h3 className="text-lg md:text-xl font-medium text-emerald-600 dark:text-emerald-400 hover:underline leading-snug cursor-pointer font-sans">
                {seoTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {seoDescription}
              </p>
            </div>
          </motion.div>
        )}

        {/* Workspace Dual-Split Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">

          {/* LEFT COLUMN: Input form layout */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/5 transition-all duration-300">
            <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between flex-wrap gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">
                Analyze Paragraph Complexity
              </span>
              <button
                onClick={handleLoadSample}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                id="readability-btn-load-sample"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Paste Sample Copy
              </button>
            </div>

            <div className="p-6 flex-grow flex flex-col">
              <textarea
                id="readability-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Insert or paste your writings here (emails, blog drafts, essays, or technical content) to calculate instant clarity scores..."
                className="w-full h-full min-h-[260px] md:min-h-[340px] border-0 outline-none text-base text-slate-800 dark:text-slate-100 bg-transparent resize-none font-sans leading-relaxed"
              />

              <div className="flex justify-between items-center text-[11px] text-slate-400 dark:text-slate-500 mt-4 leading-none select-none font-mono">
                <span>Characters: {inputText.length}</span>
                <span>Words: {metrics.wordsCount}</span>
                <span>Sentences: {metrics.sentencesCount}</span>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/20 flex items-center justify-between gap-3 pt-4">
              <div className="flex gap-2">
                <button
                  onClick={handleClear}
                  disabled={!inputText}
                  className="p-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-rose-50 dark:bg-slate-900 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-600 dark:hover:text-rose-450 rounded-2xl transition disabled:opacity-35 cursor-pointer"
                  title="Clear workspace"
                  id="readability-btn-clear"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCopyInput}
                  disabled={!inputText}
                  className="p-3 border border-slate-200 dark:border-slate-800 bg-white hover:bg-slate-50 dark:bg-slate-900 text-slate-500 rounded-2xl transition disabled:opacity-35 cursor-pointer"
                  title="Copy entered copy text"
                  id="readability-btn-copy"
                >
                  {copiedOriginal ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-405 dark:text-slate-500 select-none">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Reading Time: {metrics.readingTimeSec}s</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Calculated outcomes & suggestions list */}
          <div className="flex flex-col justify-between gap-6">
            
            {/* Readability Score Gauge Panel */}
            <div className={`p-6 border rounded-3xl ${scoreUiTheme.bg} ${scoreUiTheme.border} relative overflow-hidden transition-all duration-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6`}>
              
              <div className="flex-grow text-center md:text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1.5 block font-mono">
                  Flesch Reading Ease
                </span>
                
                <h3 className="text-4xl font-extrabold flex items-baseline justify-center md:justify-start gap-1">
                  <span className={`${scoreUiTheme.text}`} id="readability-score-display">
                    {inputText.trim() ? metrics.fleschScore : "—"}
                  </span>
                  <span className="text-xs text-slate-400 font-light">/ 100</span>
                </h3>

                <div className="mt-3.5 flex items-center justify-center md:justify-start gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${
                    metrics.readingEaseRating === 'Easy' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' :
                    metrics.readingEaseRating === 'Medium' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400' :
                    'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-450'
                  }`}>
                    {inputText.trim() ? `${metrics.readingEaseRating} Audience` : "Paste text to evaluate"}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-450 mt-3 leading-relaxed max-w-sm">
                  {inputText.trim() 
                    ? (metrics.fleschScore >= 70 ? 'Very clear and comprehensible. Appropriate for conversational media and children articles.' :
                       metrics.fleschScore >= 50 ? 'Fairly easy to standard text level. Standard business and blog communications.' :
                       'Complex academic structure. High focus needed. Great for scientific records, research and legal definitions.')
                    : 'Analyze readability index metrics automatically. Type or paste your document on the left.'}
                </p>
              </div>

              {/* Progress Bar visual indicator */}
              <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-slate-100 dark:text-slate-800"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (inputText.trim() ? metrics.fleschScore : 0) / 100)}
                    className={`${scoreUiTheme.text} transition-all duration-500`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute text-center select-none">
                  <span className="text-xs font-bold text-slate-400 block uppercase leading-none mb-1 font-mono">Score</span>
                  <span className="text-xl font-extrabold text-slate-600 dark:text-slate-200">
                    {inputText.trim() ? Math.round(metrics.fleschScore) : 0}%
                  </span>
                </div>
              </div>

            </div>

            {/* Quick Stats Bento Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-slate-150 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/25 rounded-2xl text-center md:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1 font-mono">Avg Sentence Length</span>
                <span className="text-xl font-bold text-slate-805 dark:text-slate-200 block" id="stat-avg-sent-len">
                  {inputText.trim() ? `${metrics.avgSentenceLength} words` : "—"}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Aim for 12–15 average</span>
              </div>

              <div className="p-4 border border-slate-150 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/25 rounded-2xl text-center md:text-left">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1 font-mono">Avg Word Length</span>
                <span className="text-xl font-bold text-slate-805 dark:text-slate-200 block" id="stat-avg-word-len">
                  {inputText.trim() ? `${metrics.avgWordLength} chars` : "—"}
                </span>
                <span className="text-[10px] text-slate-400 block mt-1">Shorter words are clearer</span>
              </div>
            </div>

            {/* Readability suggestions Panel */}
            <div className="border border-slate-200 dark:border-slate-850 bg-slate-50/30 dark:bg-slate-950/30 rounded-3xl p-6 flex-grow flex flex-col justify-start">
              <div className="flex items-center justify-between mb-4 border-b border-slate-200/50 dark:border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 font-sans">
                  <Lightbulb className="w-4 h-4 text-emerald-500 animate-pulse" />
                  Readability Suggestions
                </span>
                <span className="text-[11px] font-mono text-slate-400 select-none">
                  {suggestions.length} issues highlighted
                </span>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                <AnimatePresence mode="popLayout">
                  {suggestions.length > 0 ? (
                    suggestions.map((sug, sIndex) => (
                      <motion.div
                        key={sug.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15, delay: sIndex * 0.05 }}
                        className="p-3.5 border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-950 rounded-xl shadow-xs hover:border-emerald-250 dark:hover:border-emerald-900 transition flex items-start gap-2.5"
                      >
                        {sug.type === 'long-sentence' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        ) : sug.type === 'long-word' ? (
                          <Info className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" fill="none" />
                        )}
                        
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between flex-wrap">
                            {sug.text}
                          </p>
                          {sug.context && (
                            <p className="text-[11px] italic text-slate-400 mt-1 dark:text-slate-500 font-mono">
                              {sug.context}
                            </p>
                          )}
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            {sug.explanation}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-600">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-xs font-medium font-sans">Excellent! Your text is clear.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs mx-auto">Either enter copy on the left, or optimize sentence complexity variables to remove warnings.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>

              {/* DETAILED EDUCATIONAL & SEO RESOURCE MANUAL */}
        <section className="prose max-w-none pt-16 border-t border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-sans space-y-12">
          
          {/* Introduction & What is this tool */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-[#059669] dark:text-[#34d399] font-mono leading-none block">Comprehensive Overview</span>
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-0" id="readability-intro">
                Introduction to Readability metrics
              </h2>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                In today's fast-paced digital ecosystem, human attention is one of the most highly contested resources. Whether you are crafting an informative blog article, a technical software manual, an academic essay, or a corporate marketing newsletter, the readability of your copy directly governs its ultimate success. Readers are naturally quick to abandon materials that feel needlessly dense or verbally convoluted.
              </p>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                This client-side <strong>Readability Checker</strong> functions as an on-device content auditor. It evaluates structural parameters within your writing, including average sentence weights, character densities, and syllable counts, returning structured ease ratings and immediately actionable styling suggestions.
              </p>
            </div>
            
            <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850">
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white mt-0 font-sans" id="readability-what-is">
                What is this Tool?
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                At its core, this online readability system represents an interactive spelling and structural analyzer specialized for high-fidelity cognitive pacing. Utilizing the standard Flesch Reading Ease algorithm, it strips away the subjective guesswork of editing. It parses pasted copy in real-time, calculates detailed readability metrics within your home tab, and returns a raw score between 0 and 100.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                By processing your data entirely in local memory, it bypasses network latency and guarantees total manuscript confidentiality. If you are refining web copy, it is highly recommended to pair this with our <a href="/keyword-density" className="text-emerald-600 dark:text-emerald-450 hover:underline font-medium">Keyword Density Tool</a> and prepare associated head metrics using our <a href="/meta-generator" className="text-emerald-600 dark:text-emerald-450 hover:underline font-medium">Meta Generator</a> to secure your search rankings.
              </p>
            </div>
          </div>

          {/* Guide to Using the System & Flesch Chart */}
          <div className="border-t border-slate-100 dark:border-slate-850 pt-10 space-y-6">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="readability-how-to">
              How to Use the Readability Analyzer
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Transforming dense text blocks into elegant and legible communication is easy with our browser-executed workspace. Follow these basic developmental steps to optimize your copy:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
                <span className="text-2xl font-bold text-emerald-500 block font-mono">01</span>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Paste Content</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Copy and paste your manuscript, blog guidelines, or press release into the client-side input field.</p>
              </div>
              <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
                <span className="text-2xl font-bold text-emerald-500 block font-mono">02</span>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Check Live Score</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Observe the readability scores, average word counts, sentence lengths, and reading times update in milliseconds.</p>
              </div>
              <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
                <span className="text-2xl font-bold text-emerald-500 block font-mono">03</span>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Review Warnings</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Examine suggested highlights pointing out long sentences, polysyllabic words, or dense passive clauses.</p>
              </div>
              <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
                <span className="text-2xl font-bold text-emerald-500 block font-mono">04</span>
                <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Refine & Apply</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Shorten noted phrases, split complex paragraphs, and copy out your polished text safely.</p>
              </div>
            </div>
          </div>

          {/* Benefits & Use Cases & Real World Examples */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="readability-benefits">
                Benefits & Use Cases
              </h3>
              <ul className="text-sm space-y-3.5 text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                  <div>
                    <strong>SEO Content Optimization:</strong> Clear copy correlates with longer user engagement. Keeping readability in the 'Medium' to 'Easy' ranges prevents user friction, lowers site bounce rates, and signaling supreme quality to search engines.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                  <div>
                    <strong>Technical Documentation:</strong> Engineers and developers use our parser to convert dense, difficult systemic jargon into lightweight, direct guidelines suitable for support forums.
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                  <div>
                    <strong>Academic Essays & Research:</strong> Students evaluate thesis drafts to ensure vocabulary densities match structural parameters without turning incomprehensibly wordy.
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="readability-examples">
                Real-World Examples
              </h3>
              <div className="rounded-2xl border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 p-5 space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider font-mono">Example A: Unoptimized (Score: 24 - Difficult)</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    "When a content manager attempts the implementation of search search-engine optimization without a system tool, they run the high risk of over-optimization which causes user frustration."
                  </p>
                </div>
                <div className="space-y-1 pt-2.5 border-t border-slate-150 dark:border-slate-850">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider font-mono">Example B: Optimized (Score: 78 - Easy)</span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    "Web managers use SEO tools to help rank their blog posts. Short sentences and clear terms keep readers happy. This lowers bounce rates and boosts search visibility."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Common Mistakes & Best Practices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="readability-mistakes">
                Common Writing Mistakes to Avoid
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Many well-meaning writers fall prey to predictable stylistic traps that severely compromise readability scores:
              </p>
              <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-550 dark:text-slate-450 space-y-2">
                <li><strong>Heavy Nominalizations:</strong> Converting active verbs to abstract nouns (e.g. using "make a decision" instead of "decide").</li>
                <li><strong>Run-on Sentence Formations:</strong> Stacking multiple relative clauses within a single sentence, straining the reader's short-term memory capacity.</li>
                <li><strong>Overuse of Passive Structures:</strong> Obscuring the acting subject of sentences, which automatically results in longer and more robotic phrase constructions.</li>
                <li><strong>Cliche and Jargon Padding:</strong> Relying on terms like "paradigm shift" or "synergy" which expand syllable metrics without contributing logical value.</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="readability-best-practices">
                Editorial Best Practices
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="p-4 bg-emerald-50/25 dark:bg-slate-950/40 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10">
                  <h4 className="font-bold text-slate-900 dark:text-white">Write to Under-15 Words</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Structure your sentences around a single primary premise. Break excessive clauses into separate sentences.</p>
                </div>
                <div className="p-4 bg-emerald-50/25 dark:bg-slate-950/40 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10">
                  <h4 className="font-bold text-slate-900 dark:text-white">Active Voice Focus</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Structure statements with clear active subjects which improves pacing and reduces spelling complexities.</p>
                </div>
                <div className="p-4 bg-emerald-50/25 dark:bg-slate-950/40 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10">
                  <h4 className="font-bold text-slate-900 dark:text-white">Replace Polysyllables</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Swap highly complex Latinate or academic phrasing for simpler Anglo-Saxon root terms whenever possible.</p>
                </div>
                <div className="p-4 bg-emerald-50/25 dark:bg-slate-950/40 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10">
                  <h4 className="font-bold text-slate-900 dark:text-white">Consistent Verification</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Conduct regular readability diagnostics during drafts, ensuring you adhere strictly to reading ease guidelines.</p>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* FAQ ACCORDION SECTION */}
        <section className="py-16 mt-16 border-t border-slate-150 dark:border-slate-800" id="readability-faq-section">
          <div className="max-w-4xl mx-auto">
            
            <div className="text-center mb-12">
              <HelpCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white font-sans">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Discover how the Readability Checker scores sentences, syllables, and text readability.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                    className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 p-5 hover:border-emerald-400 dark:hover:border-slate-700 cursor-pointer select-none transition-all duration-200 font-sans"
                    id={`readability-faq-${faq.id}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm sm:text-base leading-snug">
                        {faq.question}
                      </h3>
                      <div className="text-slate-300 hover:text-slate-500 flex-shrink-0">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-3.5 text-sm text-slate-500 dark:text-slate-404 leading-relaxed border-t border-slate-100 dark:border-slate-850 pt-3.5 flex animate-in fade-in slide-in-from-top-1 duration-150">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* RELATED TOOL RECOMMENDATIONS */}
        <section className="pt-16 border-t border-slate-150 dark:border-slate-800" id="readability-related-section">
          <h3 className="text-xl font-light font-display tracking-tight text-slate-900 dark:text-white mb-6">
            Companion Text Utilities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onNavigateToTool(tool.id)}
                className="group border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 p-5 bg-white dark:bg-slate-950 rounded-2xl cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                id={`readability-related-${tool.id}`}
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-sm transition-colors duration-200 flex items-center justify-between font-sans">
                    {tool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mt-4 block font-mono">
                  Browse Tool &rarr;
                </span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
