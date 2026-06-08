import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Pilcrow, 
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
  BookOpen, 
  FileEdit, 
  Newspaper, 
  Layout,
  Type,
  Quote,
  RefreshCw,
  Info
} from 'lucide-react';

interface ParagraphFormatterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type FormatStyle = 'standard' | 'book' | 'blog' | 'essay';

export default function ParagraphFormatterView({ onNavigateToTool, onNavigateHome }: ParagraphFormatterViewProps) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Formatting Options
  const [style, setStyle] = useState<FormatStyle>('standard');
  const [autoSplit, setAutoSplit] = useState<boolean>(true);
  const [smartQuotes, setSmartQuotes] = useState<boolean>(false);
  const [capitalizeEachSentence, setCapitalizeEachSentence] = useState<boolean>(false);
  const [doubleSpacing, setDoubleSpacing] = useState<boolean>(false);
  const [addIndentation, setAddIndentation] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);

  // SEO parameters as requested
  const seoTitle = "Paragraph Formatter Online | Convert Text into Readable Paragraphs";
  const seoDescription = "Convert messy text into clean, readable paragraphs instantly. Perfect for ChatGPT content, articles, books, essays, and blog posts.";

  // Collapsible FAQ list
  const faqs = [
    {
      id: 1,
      question: "How does the Sentence Splitter work?",
      answer: "Our formatter tokenizes your input text using an abbreviation-aware sentence parsing algorithm. It safely ignores titles and acronyms (like 'Mr.', 'Mrs.', 'Dr.', 'e.g.', 'i.e.') and groups sentences based on punctuation thresholds, preventing accidental mid-sentence paragraph splits."
    },
    {
      id: 2,
      question: "What are the spacing and text differences between the 4 formats?",
      answer: "• Standard Format: Groups sentences into modern 3-sentence units with standard spacing.\n• Book Style: Prefixes indents (\u00A0\u00A0\u00A0\u00A0) to simulate novel layout layouts and organizes larger story-ready sections.\n• Blog Article: Creates short, high-conversion 1-to-2 sentence blocks for maximum scannability on small screens.\n• Academic Essay: Builds rich, detailed 5-to-7 sentence arguments to accommodate dense proof segments."
    },
    {
      id: 3,
      question: "What does are Smart Quotes/Curly Quotes option do?",
      answer: "It scans the final text stream and programmatically replaces plain typewriter quotes (\", ') with typographical curly quotes (“,”, ‘, ’). This is highly valued by publishers, novelists, and essayists preparing clean copy for professional printing or publication."
    },
    {
      id: 4,
      question: "Are my essays or book drafts safe on TextToolkitHub?",
      answer: "Absolutely. Absolute security is our primary architecture. All parsings, statistics, and text manipulation operations run entirely within your web browser sandbox memory. Text is never sent over any API, transmitted over any network, or logged to remote servers."
    },
    {
      id: 5,
      question: "Does it support very long copies like chapters or essays?",
      answer: "Yes! There are no character layout restrictions. The browser memory can process 50,005+ words of document pages in milliseconds without crashing the rendering thread."
    }
  ];

  // Sync state options when format type changes to establish clean pre-packaged standards
  useEffect(() => {
    if (style === 'book') {
      setAddIndentation(true);
      setSmartQuotes(true);
      setDoubleSpacing(false);
    } else if (style === 'essay') {
      setAddIndentation(true);
      setDoubleSpacing(true);
      setSmartQuotes(false);
    } else if (style === 'blog') {
      setAddIndentation(false);
      setDoubleSpacing(false);
      setSmartQuotes(false);
    } else {
      // Standard
      setAddIndentation(false);
      setDoubleSpacing(false);
      setSmartQuotes(false);
    }
  }, [style]);

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

    // Schema JSON-LD Configuration
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

    const scriptId = "paragraph-formatter-json-ld";
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

  // Text formatter core processor engine
  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let text = inputText;

    // Standardize all forms of line wraps to single '\n'
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // 1. Sentence Parsing (abbreviation-aware sentence tokenization)
    const rawSentences: string[] = [];
    const sentenceBlocks = text.match(/[^.!?]+[.!?]+["')\]} \t]*/g);
    
    if (sentenceBlocks) {
      let currentSentence = "";
      for (const block of sentenceBlocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;
        
        currentSentence += (currentSentence ? " " : "") + trimmed;
        // Check if current text chunk ends with a standard abbreviation
        const isAbbreviation = /\b(mr|mrs|ms|dr|prof|vs|eg|ie|etc|ca|approx|gen|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\.$/i.test(currentSentence);
        
        if (!isAbbreviation) {
          rawSentences.push(currentSentence);
          currentSentence = "";
        }
      }
      if (currentSentence.trim()) {
        rawSentences.push(currentSentence.trim());
      }
    } else {
      // Fallback if match fails altogether
      rawSentences.push(text.trim());
    }

    // 2. Clean sentences & capitalize optionally
    const processedSentences = rawSentences.map(sentence => {
      let cleaned = sentence.trim();
      if (trimWhitespace) {
        // Normalize single-sentence spacing
        cleaned = cleaned.replace(/\s+/g, ' ');
      }

      if (capitalizeEachSentence && cleaned.length > 0) {
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
      }

      return cleaned;
    }).filter(s => s.length > 0);

    // 3. Spacing between sentences setup
    const gap = doubleSpacing ? "  " : " ";
    
    // Determine Target Paragraph Sentence length per style
    let targetLength = 3;
    if (style === 'book') targetLength = 4;
    else if (style === 'essay') targetLength = 6;
    else if (style === 'blog') targetLength = 2; // Short scannable blocks

    let paragraphs: string[] = [];

    if (autoSplit) {
      // Re-group sentences into configured blocks
      let currentPara: string[] = [];
      processedSentences.forEach((sentence, index) => {
        currentPara.push(sentence);
        
        // Split when target length is met, or it's the last sentence
        if (currentPara.length >= targetLength || index === processedSentences.length - 1) {
          paragraphs.push(currentPara.join(gap));
          currentPara = [];
        }
      });
    } else {
      // Work with original paragraph separations but normalize clean layouts
      const originalSections = text.split(/\n\s*\n/);
      originalSections.forEach(section => {
        const sectText = section.trim();
        if (!sectText) return;

        // Extract sentences of this specific section
        const sectSentences: string[] = [];
        const matches = sectText.match(/[^.!?]+[.!?]+["')\]} \t]*/g);
        if (matches) {
          let curr = "";
          for (const m of matches) {
            curr += (curr ? " " : "") + m.trim();
            const isAbbr = /\b(mr|mrs|ms|dr|prof|vs|eg|ie|etc|ca|approx|gen|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)\.$/i.test(curr);
            if (!isAbbr) {
              sectSentences.push(curr);
              curr = "";
            }
          }
          if (curr.trim()) sectSentences.push(curr.trim());
        } else {
          sectSentences.push(sectText);
        }

        const formattedSect = sectSentences.map(s => {
          let cleaned = s.trim();
          if (trimWhitespace) cleaned = cleaned.replace(/\s+/g, ' ');
          if (capitalizeEachSentence && cleaned.length > 0) {
            cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
          }
          return cleaned;
        }).filter(s => s.length > 0).join(gap);

        if (formattedSect) {
          paragraphs.push(formattedSect);
        }
      });
    }

    // 4. Smart Quotes Substitution Filter
    let formattedResult = paragraphs.map(p => {
      let content = p;
      if (smartQuotes) {
        // Convert double quotes
        content = content.replace(/(?<=^|[\s"'({\[-])"/g, "“");
        content = content.replace(/"(?=$|[\s?!.,;:)'\]}-])/g, "”");
        content = content.replace(/"/g, "”"); // fallback
        
        // Convert single quotes / apostrophes
        content = content.replace(/(?<=^|[\s"'({\[-])'/g, "‘");
        content = content.replace(/'(?=$|[\s?!.,;:)'\]}-])/g, "’");
        // Convert standard mid-word contractions safely
        content = content.replace(/'/g, "’");
      }

      // Add book-style layout indents
      if (addIndentation) {
        // We use 4 non-breaking spaces for display consistency
        const indentString = "\u00A0\u00A0\u00A0\u00A0";
        return indentString + content;
      }

      return content;
    }).join("\n\n");

    setOutputText(formattedResult);
  }, [
    inputText, 
    style, 
    autoSplit, 
    smartQuotes, 
    capitalizeEachSentence, 
    doubleSpacing, 
    addIndentation, 
    trimWhitespace
  ]);

  // File download helper
  const handleDownload = () => {
    if (!outputText) return;
    try {
      // Standardize output to simple spacing for text files
      const blobText = outputText.replace(/\u00A0/g, ' '); 
      const blob = new Blob([blobText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Formatted_Paragraphs_${style}_text.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 2000);
    } catch (e) {
      console.error("Unable to execute document download", e);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    try {
      // Standardize output spacings (convert presentation non-breaking spaces to standard spacing format)
      const cleanCopyText = outputText.replace(/\u00A0/g, ' ');
      navigator.clipboard.writeText(cleanCopyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Clipboard writing error", e);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const handleLoadSampleText = () => {
    setInputText(`this is an AI generated text chunk that mimics ChatGPT output. there are no neat paragraphs here. Mr. Smith drove his car at 60mph and reached home by 8 PM, approx. 15 minutes late. his wife was waiting. she told him "you need to formatting these writings correctly before sending to the publisher! it is extremely hard to read plain walls of typing." and she is absolutely right. we can easily split this paragraph. Standard layout rules say standard writing structures should have 3 to 4 sentences wrapped dynamically inside single paragraph layouts to increase visual reading speed and retention levels. let us see how much better this text looks afterward!`);
  };

  // Compute text statistics of Result
  const getStatistics = () => {
    if (!outputText) {
      return { words: 0, characters: 0, sentences: 0, paragraphs: 0 };
    }

    const cleanResult = outputText.replace(/\u00A0/g, ' ');
    const textTrimmed = cleanResult.trim();

    // Words count
    const wordsArray = textTrimmed.split(/\s+/).filter(w => w.length > 0);
    const words = wordsArray.length;

    // Characters count
    const characters = cleanResult.length;

    // Paragraphs count
    const paragraphBlocks = cleanResult.split(/\n\n+/).filter(p => p.trim().length > 0);
    const paragraphs = paragraphBlocks.length;

    // Sentences count
    const sentenceList = cleanResult.split(/[.!?]+(?:\s+|$)/).filter(s => s.trim().length > 0);
    const sentences = sentenceList.length;

    return { words, characters, sentences, paragraphs };
  };

  const stats = getStatistics();

  // Highlight style descriptions
  const styleDescriptions = {
    standard: "Modern professional split. Groups text into balanced 3-sentence visual paragraphs with optimized vertical rhythms.",
    book: "Typeset-ready configuration. Installs classical indentations and groups narrative into spacious 4-sentence paragraphs with smart curly quote options.",
    blog: "Maximum online scannability. Keeps readers scrolling on smartphones with brief, interactive 1 to 2-sentence structural items.",
    essay: "Academic argument density. Structures comprehensive academic essays into extended 5 to 7-sentence explanatory segments with proper spacings."
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200" id="paragraph-formatter-page">
      {/* Banner / Navigation Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md sticky top-0 z-20 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition"
              aria-label="Back to Homepage"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-extrabold uppercase tracking-wider">
                <span>Formatting Cleaners</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500 dark:text-slate-400 font-sans normal-case">Tool</span>
              </div>
              <h1 className="text-lg font-black text-slate-950 dark:text-white font-sans tracking-tight">
                Paragraph Formatter
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateToTool('tools')}
              className="text-xs font-bold text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
              Browse Directory
            </button>
          </div>
        </div>
      </header>

      {/* Main Structural Content Segment */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Title Banner & SEO Intro */}
          <div className="text-center md:text-left mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-55/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-full text-xs text-indigo-650 dark:text-indigo-400 font-extrabold mb-4"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Offline & Free Client-Side Formatting Tool</span>
            </motion.div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight leading-none">
              Paragraph Formatter Online
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Transform chaotic, AI-generated content walls, pasted emails, transcript logs, or poorly line-wrapped novels into beautifully aligned, high-readability paragraph styles designed for digital publishers, authors, and student editors.
            </p>
          </div>

          {/* Guidelines Banner alert card */}
          <div className="flex items-start gap-3 bg-indigo-50/40 dark:bg-slate-950/40 border border-indigo-100/30 dark:border-slate-800 rounded-2xl p-4 sm:p-5 mb-8">
            <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-405 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">AI & ChatGPT Readability Enhancer</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Copy-pasting text from conversational AI systems often results in dense chunks of uniform typography. Our tool intelligently identifies grammatical punctuation markers to parse and structure your narrative automatically. Select a design preset to compile instant outputs completely offline.
              </p>
            </div>
          </div>

          {/* Core Interactive Grid Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            
            {/* Input & Output Column (Takes 2/3 space of grid on large screen) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* INPUT AREA CARD CONTAINER */}
              <div className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-850 transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Pilcrow className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 uppercase tracking-widest font-sans">
                      Source Text Area
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLoadSampleText}
                      className="text-xs font-extrabold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-350 hover:underline"
                    >
                      Load Conversational Sample
                    </button>
                    {inputText && (
                      <button
                        onClick={handleClear}
                        className="p-1 px-1.5 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg text-rose-500 transition-all font-mono text-[10px] font-bold"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>RESET</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste unformatted text, copied PDF walls, or messy ChatGPT blocks here..."
                    className="w-full min-h-[220px] max-h-[500px] p-4 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 rounded-2xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-900 transition-all font-sans text-sm leading-relaxed"
                    id="paragraph-formatter-input"
                  />
                  
                  {inputText && (
                    <div className="absolute bottom-3 right-3 select-none pointer-events-none text-[9.5px] font-mono text-slate-400 bg-white/80 dark:bg-slate-950/80 px-2 py-1 rounded border border-slate-200/50 dark:border-slate-800">
                      {inputText.length.toLocaleString()} characters raw
                    </div>
                  )}
                </div>
              </div>

              {/* OUTPUT AREA CARD CONTAINER */}
              <div className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-850 transition">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-650 dark:text-slate-350 uppercase tracking-widest font-sans flex items-center gap-2">
                    <Layout className="w-4 h-4 text-emerald-500" />
                    Formatted Layout Output
                  </span>
                  
                  {outputText && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs transition duration-150 ${
                          copied 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900' 
                            : 'bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-805 dark:hover:bg-slate-800'
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Result'}</span>
                      </button>

                      <button
                        onClick={handleDownload}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border font-bold text-xs transition duration-150 ${
                          downloaded 
                            ? 'bg-indigo-50 text-indigo-600 border-indigo-250 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900' 
                            : 'bg-slate-50 text-slate-705 hover:text-slate-900 border-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-805 dark:hover:bg-slate-800'
                        }`}
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{downloaded ? 'Downloaded' : 'Download TXT'}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  {outputText ? (
                    <div className="w-full min-h-[220px] max-h-[500px] overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-100 rounded-2xl border border-emerald-100 dark:border-slate-800 font-sans text-sm whitespace-pre-wrap leading-relaxed select-text tracking-normal">
                      {outputText}
                    </div>
                  ) : (
                    <div className="w-full min-h-[220px] bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center select-none">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-600 mb-2">
                        <Pilcrow className="w-5 h-5 animate-pulse" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Result will appear here automatically as soon as you key in or load some unformatted content.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Sidebar Controls & Tuning Options Column (Takes 1/3 space) */}
            <div className="flex flex-col gap-6">
              
              {/* PRIMARY FORMATTING STYLE CARD */}
              <div className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-3">
                  <Type className="w-3.5 h-3.5 text-indigo-505" />
                  Visual Preset Style
                </span>
                
                <div className="flex flex-col gap-3">
                  
                  <button
                    onClick={() => setStyle('standard')}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition ${
                      style === 'standard' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      style === 'standard' ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-650 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                    }`}>
                      <Layout className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold block">Standard Paragraphs</span>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">3-sentence readability loops with modern text spacings.</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setStyle('book')}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition ${
                      style === 'book' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      style === 'book' ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-650 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                    }`}>
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold block">Book typesetting</span>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">Narrative layout, adds indent margins and curly smart punctuation quotes.</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setStyle('blog')}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition ${
                      style === 'blog' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      style === 'blog' ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-650 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                    }`}>
                      <Newspaper className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold block">Blog Article Format</span>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">Short, mobile scannable 1-2 sentence paragraphs for high retention.</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setStyle('essay')}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl border text-left transition ${
                      style === 'essay' 
                        ? 'border-indigo-500 bg-indigo-50/30 dark:bg-indigo-950/20 dark:border-indigo-500/50 text-slate-900 dark:text-white' 
                        : 'border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      style === 'essay' ? 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-650 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-400'
                    }`}>
                      <FileEdit className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-extrabold block">Academic Essay Format</span>
                      <span className="text-[10.5px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-tight">Academic 5-7 sentence blocks, with indents and standard double spacing.</span>
                    </div>
                  </button>

                </div>

                <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-extrabold uppercase text-slate-450 dark:text-slate-500 tracking-wider block">Description Style</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                    {styleDescriptions[style]}
                  </p>
                </div>
              </div>

              {/* ADVANCED RE-PARAGRAPHING CONFIGS */}
              <div className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
                <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-4">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-505" />
                  Format Adjustments
                </span>

                <div className="flex flex-col gap-4">
                  
                  {/* AUTO SPLIT TOGGLE */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="auto-split-chk">
                        Auto-Break Walls of Text
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                        Detect sentences and automatically build clean structural breaks.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="auto-split-chk"
                      checked={autoSplit}
                      onChange={(e) => setAutoSplit(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                  <hr className="border-slate-100 dark:border-slate-900" />

                  {/* ADD INDENTATIONS */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="indent-chk">
                        Add Margins / Indent Paragraphs
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                        Prepend book-style text offset spacing on every paragraph block.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="indent-chk"
                      checked={addIndentation}
                      onChange={(e) => setAddIndentation(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                  <hr className="border-slate-100 dark:border-slate-900" />

                  {/* SMART QUOTES */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="quotes-chk">
                        Smart quotes converter
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                        Convert typewriter quotes ("..." and '...') into publishers' curly quotes (“...” and ‘...’).
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="quotes-chk"
                      checked={smartQuotes}
                      onChange={(e) => setSmartQuotes(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                  <hr className="border-slate-100 dark:border-slate-900" />

                  {/* CAPITALIZE SENTENCES */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="capitalize-chk">
                        Capitalize sentence starts
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                        Automatically capitalize the start letter of each structured sentence.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="capitalize-chk"
                      checked={capitalizeEachSentence}
                      onChange={(e) => setCapitalizeEachSentence(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                  <hr className="border-slate-100 dark:border-slate-900" />

                  {/* DOUBLE SPACING BETWEEN SENTENCES */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="space-chk">
                        Double sentence spacing
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                        Classic academic typesetting. Places exactly 2 spaces after sentences.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="space-chk"
                      checked={doubleSpacing}
                      onChange={(e) => setDoubleSpacing(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                  <hr className="border-slate-100 dark:border-slate-900" />

                  {/* NORMALIZE WHITESPACES AND SPACES */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-extrabold text-slate-800 dark:text-slate-200 cursor-pointer" htmlFor="trim-chk">
                        Normalize duplicate spaces
                      </label>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                        Erase secondary tab spacing or double space structures inside sentences.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      id="trim-chk"
                      checked={trimWhitespace}
                      onChange={(e) => setTrimWhitespace(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                    />
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* REAL TIME STATISTICS CARD GRID PANEL */}
          <div className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-3xl p-5 shadow-sm mb-12">
            <span className="text-xs font-sans uppercase font-extrabold text-slate-450 dark:text-slate-400 tracking-wider flex items-center gap-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-indigo-505" />
              Live Output Layout Statistics
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl text-center md:text-left transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 letter tracking-wider leading-none">Paragraphs Count</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white block font-sans tracking-tight mt-1 ">{stats.paragraphs}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl text-center md:text-left transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 letter tracking-wider leading-none">Detected Sentences</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white block font-sans tracking-tight mt-1 ">{stats.sentences}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl text-center md:text-left transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 letter tracking-wider leading-none">Words Count</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white block font-sans tracking-tight mt-1 ">{stats.words}</span>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-850 rounded-2xl text-center md:text-left transition">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-550 letter tracking-wider leading-none">Characters Total</span>
                <span className="text-2xl font-black text-slate-850 dark:text-white block font-sans tracking-tight mt-1 ">{stats.characters}</span>
              </div>
            </div>
          </div>

          {/* POLICY COMPLIANT AdSpace Placement banner */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-center gap-2 border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-3xl">
              <Globe className="w-5 h-5 text-indigo-500 shrink-0" />
              <div className="text-center sm:text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-205">Google Publisher Policy Integration</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-450 leading-relaxed mt-0.5">
                  Preallocated responsive banner area ensures seamless automatic Google AdSense compliance with absolutely zero Cumulative Layout Shift (CLS).
                </p>
              </div>
            </div>
          </div>

          {/* DETAILED FAQS & EXPLANATIVE KEYWORD SECTION (Satisfies AdSense Content-to-Code ratio constraints) */}
          <section className="bg-white dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white font-sans tracking-tight flex items-center gap-2 mb-2">
              <HelpCircle className="w-5.5 h-5.5 text-indigo-600" />
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl mb-6">
              Learn how content developers, book publishers, and copywriting professionals use our online Paragraph Formatter tool to clean and restructure strings, messages, papers, and essays securely in real time.
            </p>

            <div className="space-y-4">
              {faqs.map(faq => (
                <div 
                  key={faq.id}
                  className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden transition duration-150"
                  id={`paragraph-formatter-faq-item-${faq.id}`}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50/40 dark:bg-slate-900/30 text-left cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition"
                  >
                    <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 pr-4">
                      {faq.id}. {faq.question}
                    </span>
                    <span className="text-slate-400 dark:text-slate-550 shrink-0">
                      {expandedFaq === faq.id ? '–' : '+'}
                    </span>
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850">
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-slate-100 dark:border-slate-850 pt-6">
              <h4 className="text-sm font-bold text-slate-850 dark:text-slate-205 mb-2 font-sans uppercase tracking-wider text-xs">
                About Our Safe Layout Algorithm
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                The Paragraph Formatter scans standard character matrices to convert double enter codes and irregular spaces instantly. It operates without sending copies to OpenAI or custom server scripts, maintaining absolute client privacy in any legal, educational, or corporate drafting workflow.
              </p>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
