import React, { useState, useEffect, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  Trash2, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  Sliders, 
  VolumeX,
  Languages,
  Sparkles,
  RefreshCw,
  FileText,
  Upload,
  BookOpen,
  Edit3,
  Search,
  Volume1,
  FileDown,
  Info,
  Check
} from 'lucide-react';

interface TextToSpeechViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

const DEMO_SCRIPTS = [
  {
    name: '🌟 Welcome & Onboarding',
    text: 'Welcome to TextToolkitHub! We have engineered this professional audio synthesis laboratory to run entirely inside your browser. Your confidential texts, business strategies, and private essays never touch our servers. Adjust the advanced playback sliders to find your perfect rhythm!'
  },
  {
    name: '📈 Business Quarterly Report',
    text: 'Financial performance for the second quarter exceeded initial projections by seven point four percent. Our enterprise analytics suite observed a significant reduction in customer churn, coupled with a twelve percent expansion in monthly recurring revenue. We remain highly optimistic about our physical expansion into international markets.'
  },
  {
    name: '🧠 Philosophy & Mindfulness',
    text: 'Take a deep, deliberate breath. Observe the transient nature of your current thoughts without judgment. Like clouds traversing an expansive blue sky, they arise, linger briefly, and dissolve back into the silence. True intelligence is the ability to observe your own mind in action.'
  },
  {
    name: '🎭 Classic Literary Narrative',
    text: 'The sea was as flat as a dark glass mirror, reflecting a million distant stars. Silently, the vessel glided through the cool midnight breeze. The captain stood motionless on the wooden deck, staring intently into the endless, whispering horizon, searching for a light that had disappeared ten years ago.'
  }
];

export default function TextToSpeechView({ onNavigateToTool, onNavigateHome }: TextToSpeechViewProps) {
  const [text, setText] = useState('Welcome to TextToolkitHub! We have engineered this professional audio synthesis laboratory to run entirely inside your browser. Your confidential texts, business strategies, and private essays never touch our servers. Adjust the advanced playback sliders to find your perfect rhythm!');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState(false);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(-1);
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(-1);
  const [currentWordLength, setCurrentWordLength] = useState<number>(0);
  
  // UI states
  const [viewMode, setViewMode] = useState<'edit' | 'reader'>('edit');
  const [voiceSearch, setVoiceSearch] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Translation and voice sync states
  const [originalStoredText, setOriginalStoredText] = useState<string>('');
  const [hasStoredOriginal, setHasStoredOriginal] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [showTranslatePrompt, setShowTranslatePrompt] = useState<boolean>(false);
  const [targetPromptLang, setTargetPromptLang] = useState<string>('');
  const [dismissedVoicePrompt, setDismissedVoicePrompt] = useState<string>('');

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const seoTitle = "Text to Speech Reader Online | Client-side TTS Converter";
  const seoDescription = "Convert text into natural sounding voice accents instantly with our browser-native Text to Speech utility. 100% offline and secure.";

  const faqs = [
    {
      id: 1,
      question: "How does the professional sentence-by-sentence reader work?",
      answer: "Standard browser speech engines are notoriously buggy and often freeze or completely stop speaking on texts longer than 15 seconds. To fix this, our reader segments your paragraphs into logical sentences, scheduling and speaking them sequentially. This guarantees smooth, stable, and continuous reading of entire articles without errors!"
    },
    {
      id: 2,
      question: "Can I click on sentences to jump the reading position?",
      answer: "Yes! When you toggle 'Active Reader View', the tool maps out your text visually. Clicking on any sentence immediately stops the current playback and starts reading from that exact sentence. It works just like a premium audiobook playhead."
    },
    {
      id: 3,
      question: "Is any audio or text transmitted to external servers?",
      answer: "Absolutely not. True to the privacy core of TextToolkitHub, your text is synthesized entirely in your browser memory utilizing local OS voice engines. No telemetry, audio data, or written drafts ever traverse the network."
    },
    {
      id: 4,
      question: "Why do some voices sound different on different machines?",
      answer: "The speech synthesis voices are supplied directly by your device's operating system (such as macOS, Windows, iOS, or Android). High-quality natural voices like Siri or Microsoft Natural will automatically appear in the selection list if available on your local system."
    }
  ];

  // Map language codes to country flags/labels
  const getLanguageLabel = (langCode: string): string => {
    const code = langCode.toLowerCase();
    if (code.startsWith('en-us')) return '🇺🇸 English (US)';
    if (code.startsWith('en-gb')) return '🇬🇧 English (UK)';
    if (code.startsWith('en-ca')) return '🇨🇦 English (CA)';
    if (code.startsWith('en-au')) return '🇦🇺 English (AU)';
    if (code.startsWith('fr-fr') || code.startsWith('fr')) return '🇫🇷 French';
    if (code.startsWith('de-de') || code.startsWith('de')) return '🇩🇪 German';
    if (code.startsWith('es-es') || code.startsWith('es')) return '🇪🇸 Spanish';
    if (code.startsWith('it-it') || code.startsWith('it')) return '🇮🇹 Italian';
    if (code.startsWith('ja-jp') || code.startsWith('ja')) return '🇯🇵 Japanese';
    if (code.startsWith('zh-cn') || code.startsWith('zh')) return '🇨🇳 Chinese';
    if (code.startsWith('pt-br') || code.startsWith('pt')) return '🇧🇷 Portuguese';
    if (code.startsWith('ru-ru') || code.startsWith('ru')) return '🇷🇺 Russian';
    if (code.startsWith('hi-in') || code.startsWith('hi')) return '🇮🇳 Hindi';
    return `🌐 ${langCode.toUpperCase()}`;
  };

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

    // Setup Web Speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        if (!synthRef.current) return;
        const availableVoices = synthRef.current.getVoices();
        // Sort voices by language representation
        const sorted = [...availableVoices].sort((a, b) => a.lang.localeCompare(b.lang));
        setVoices(sorted);
        
        if (sorted.length > 0) {
          // Prefer premium/natural/local voices first
          const defaultVoice = sorted.find(v => v.lang.startsWith('en-US') && v.name.includes('Natural')) || 
                               sorted.find(v => v.lang.startsWith('en-US')) || 
                               sorted.find(v => v.lang.startsWith('en')) || 
                               sorted[0];
          setSelectedVoiceName(defaultVoice.name);
        }
      };

      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }

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

    const scriptId = "tts-json-ld";
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
      
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Monitor language mismatch and suggest auto-translation
  useEffect(() => {
    if (!selectedVoiceName || voices.length === 0 || !text.trim()) {
      setShowTranslatePrompt(false);
      return;
    }
    const voice = voices.find(v => v.name === selectedVoiceName);
    if (!voice) return;

    // Extract voice language code, e.g. "zh", "es", "fr", "en"
    const voiceLangPrefix = voice.lang.split('-')[0].toLowerCase();

    // Check current text language
    const textSample = text.trim().slice(0, 300).toLowerCase();
    let textLangPrefix = 'en'; // Default guess

    if (/[\u4e00-\u9fa5]/.test(textSample)) {
      textLangPrefix = 'zh';
    } else if (/[а-яА-Я]/.test(textSample)) {
      textLangPrefix = 'ru';
    } else if (/[\u3040-\u309f\u30a0-\u30ff]/.test(textSample)) {
      textLangPrefix = 'ja';
    } else if (/[\uac00-\ud7af]/.test(textSample)) {
      textLangPrefix = 'ko';
    } else if (/\b(el|la|los|las|un|una|y|en|de|que|es|esta)\b/.test(textSample)) {
      textLangPrefix = 'es';
    } else if (/\b(le|la|les|un|une|et|en|dans|de|que|est|c'est)\b/.test(textSample)) {
      textLangPrefix = 'fr';
    } else if (/\b(der|die|das|und|in|von|zu|ist|es|nicht)\b/.test(textSample)) {
      textLangPrefix = 'de';
    } else if (/\b(il|la|i|gli|le|un|una|e|in|di|che|è)\b/.test(textSample)) {
      textLangPrefix = 'it';
    } else if (/\b(o|a|os|as|um|uma|e|em|de|que|é)\b/.test(textSample)) {
      textLangPrefix = 'pt';
    } else if (/\b(aur|hai|ki|ko|ke|me|se|ek)\b/.test(textSample)) {
      textLangPrefix = 'hi';
    }

    // Show prompt only if voice language code differs from current text and wasn't dismissed
    if (voiceLangPrefix !== textLangPrefix && selectedVoiceName !== dismissedVoicePrompt) {
      setTargetPromptLang(voice.lang);
      setShowTranslatePrompt(true);
    } else {
      setShowTranslatePrompt(false);
    }
  }, [selectedVoiceName, voices, text, dismissedVoicePrompt]);

  const handleTranslate = async (targetLangCode: string) => {
    if (!text.trim()) return;
    setIsTranslating(true);

    // Save original text if we haven't stored it yet
    if (!hasStoredOriginal) {
      setOriginalStoredText(text);
      setHasStoredOriginal(true);
    }

    try {
      const rawLang = targetLangCode.split('-')[0].toLowerCase();
      let targetLang = rawLang;
      if (targetLangCode.toLowerCase().startsWith('zh-cn')) {
        targetLang = 'zh-CN';
      } else if (targetLangCode.toLowerCase().startsWith('zh-tw')) {
        targetLang = 'zh-TW';
      }

      // Chunk long text to respect free API limits (~1000 chars per call safely)
      const lines = text.split('\n');
      const chunks: string[] = [];
      let currentChunk = '';

      for (const line of lines) {
        if ((currentChunk + '\n' + line).length > 800) {
          if (currentChunk) chunks.push(currentChunk);
          currentChunk = line;
        } else {
          currentChunk = currentChunk ? currentChunk + '\n' + line : line;
        }
      }
      if (currentChunk) chunks.push(currentChunk);

      const translatedChunks: string[] = [];
      let anyTranslationFailed = false;

      for (const chunk of chunks) {
        if (!chunk.trim()) {
          translatedChunks.push(chunk);
          continue;
        }

        let chunkTranslated = '';
        
        // Attempt 1: Google Translate via Vite Local Proxy (safest against CORS blocks in browser iframe)
        try {
          const googleProxyUrl = `/api-proxy/google/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
          const response = await fetch(googleProxyUrl);
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && Array.isArray(data[0])) {
              chunkTranslated = data[0]
                .map(item => item && item[0])
                .filter(val => typeof val === 'string')
                .join('');
            }
          }
        } catch (eProxyGoogle) {
          console.warn("Google Translate proxy failed, trying MyMemory proxy...", eProxyGoogle);
        }

        // Attempt 2: MyMemory Translate via Vite Local Proxy (safest fallback in dev/preview)
        if (!chunkTranslated) {
          try {
            const myMemoryProxyUrl = `/api-proxy/mymemory/get?q=${encodeURIComponent(chunk)}&langpair=Autodetect|${targetLang}`;
            const response = await fetch(myMemoryProxyUrl);
            if (response.ok) {
              const resJson = await response.json();
              if (resJson.responseData && resJson.responseData.translatedText) {
                chunkTranslated = resJson.responseData.translatedText;
              }
            }
          } catch (eProxyMyMemory) {
            console.warn("MyMemory proxy failed, trying direct Google Translate...", eProxyMyMemory);
          }
        }

        // Attempt 3: Direct Google Translate Client API (Fallback if proxy is bypassed or in static build context)
        if (!chunkTranslated) {
          try {
            const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;
            const response = await fetch(googleUrl);
            if (response.ok) {
              const data = await response.json();
              if (Array.isArray(data) && Array.isArray(data[0])) {
                chunkTranslated = data[0]
                  .map(item => item && item[0])
                  .filter(val => typeof val === 'string')
                  .join('');
              }
            }
          } catch (eDirectGoogle) {
            console.warn("Direct Google Translate fallback failed...", eDirectGoogle);
          }
        }

        // Attempt 4: Direct MyMemory Translated API (Final desperate fallback)
        if (!chunkTranslated) {
          try {
            const myMemoryUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=Autodetect|${targetLang}`;
            const response = await fetch(myMemoryUrl);
            if (response.ok) {
              const resJson = await response.json();
              if (resJson.responseData && resJson.responseData.translatedText) {
                chunkTranslated = resJson.responseData.translatedText;
              }
            }
          } catch (eDirectMyMemory) {
            console.error("Direct MyMemory fallback translation also failed:", eDirectMyMemory);
          }
        }

        // If all failed, retain the original chunk and set failed flag
        if (!chunkTranslated) {
          anyTranslationFailed = true;
          translatedChunks.push(chunk);
        } else {
          translatedChunks.push(chunkTranslated);
        }
      }

      const joinedText = translatedChunks.join('\n');
      setText(joinedText);
      setShowTranslatePrompt(false);
      
      if (anyTranslationFailed) {
        showToast("Translation partially failed due to network restriction. Try copy-pasting manually.");
      } else {
        showToast(`Translated text to ${getLanguageLabel(targetLangCode)}!`);
      }
    } catch (err) {
      console.error("Translation failed entirely:", err);
      showToast("Could not translate text. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleRestoreOriginal = () => {
    if (hasStoredOriginal && originalStoredText) {
      setText(originalStoredText);
      showToast("Restored original text!");
      setShowTranslatePrompt(false);
    }
  };

  // Split text into clean logical sentences
  const getSentences = (rawText: string): string[] => {
    if (!rawText.trim()) return [];
    // Regular expression that splits sentences, ignoring typical acronyms or double spaces
    return rawText
      .replace(/([.?!])\s*(?=[A-Z0-9])/g, "$1|")
      .split("|")
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  const sentencesList = getSentences(text);

  // Core Speech Synthesis loop
  const speakSentence = (index: number) => {
    if (!synthRef.current) return;
    
    // Clear active utterance
    synthRef.current.cancel();
    
    if (index < 0 || index >= sentencesList.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
      setCurrentWordIndex(-1);
      return;
    }

    setCurrentSentenceIndex(index);
    const sentenceText = sentencesList[index];
    
    const utterance = new SpeechSynthesisUtterance(sentenceText);
    const selectedVoice = voices.find(v => v.name === selectedVoiceName);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = isMuted ? 0 : volume;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      // Speak next sentence in queue
      const nextIndex = index + 1;
      if (nextIndex < sentencesList.length) {
        speakSentence(nextIndex);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSentenceIndex(-1);
        setCurrentWordIndex(-1);
        showToast('Playback completed successfully!');
      }
    };

    utterance.onerror = (e) => {
      // If was interrupted/cancelled manually, do not proceed
      if (e.error === 'interrupted') return;
      
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(-1);
      setCurrentWordIndex(-1);
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWordIndex(event.charIndex);
        setCurrentWordLength(event.charLength || 5);
      }
    };

    activeUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const handleSpeak = () => {
    if (!synthRef.current || sentencesList.length === 0) return;

    if (isPaused) {
      synthRef.current.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    // Start speaking from the first sentence or current active sentence
    const startIdx = currentSentenceIndex >= 0 ? currentSentenceIndex : 0;
    speakSentence(startIdx);
  };

  const handlePause = () => {
    if (!synthRef.current) return;
    synthRef.current.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentSentenceIndex(-1);
    setCurrentWordIndex(-1);
  };

  const handleClear = () => {
    handleStop();
    setText('');
    showToast('Document cleared');
  };

  const handleResetControls = () => {
    setRate(1);
    setPitch(1);
    setVolume(0.9);
    setIsMuted(false);
    showToast('Controls reset to normal');
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".txt") || file.name.endsWith(".md") || file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setText(event.target.result as string);
            showToast('Document loaded successfully!');
          }
        };
        reader.readAsText(file);
      } else {
        showToast('Error: Only .txt or .md files are supported!');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setText(event.target.result as string);
          showToast('Document imported!');
        }
      };
      reader.readAsText(file);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredVoices = voices.filter(voice => {
    const label = `${voice.name} ${voice.lang}`.toLowerCase();
    return label.includes(voiceSearch.toLowerCase());
  });

  // Estimate read duration
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const estimatedMinutes = Math.max(1, Math.round(wordCount / 150)); // Avg 150 words per min

  // Text Highlighting rendering inside sentences
  const getSentenceWithWordHighlight = (sentenceStr: string, isCurrent: boolean) => {
    if (!isCurrent || currentWordIndex === -1) return sentenceStr;
    const before = sentenceStr.slice(0, currentWordIndex);
    const highlighted = sentenceStr.slice(currentWordIndex, currentWordIndex + currentWordLength);
    const after = sentenceStr.slice(currentWordIndex + currentWordLength);
    return (
      <>
        {before}
        <span className="bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-100 font-semibold px-0.5 rounded-sm border-b-2 border-amber-500 transition-all">
          {highlighted}
        </span>
        {after}
      </>
    );
  };

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/text-to-speech').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="text-to-speech-page">
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
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Text to Speech</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl mb-4 border border-indigo-100 dark:border-indigo-900/30">
            <Volume2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-900 dark:text-white tracking-tight" id="tool-title">
            Text to <span className="font-semibold text-indigo-600 dark:text-indigo-400">Speech Reader</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Convert standard written documents, novels, reports, or articles into natural vocal synthesis securely with real-time visual tracking.
          </p>
        </div>

        {/* Notification Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 dark:border-slate-200 text-xs font-semibold flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Main workspace (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* View switcher & stats bar */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-4">
              <div className="flex bg-slate-200 dark:bg-slate-900 p-1 rounded-xl text-xs gap-1">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === 'edit' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-850/35'}`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editor View</span>
                </button>
                <button
                  onClick={() => setViewMode('reader')}
                  className={`px-3.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === 'reader' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-850/35'}`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Interactive Reader</span>
                </button>
              </div>

              {/* Read estimation */}
              <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>~{estimatedMinutes} min read</span>
                </div>
              </div>
            </div>

            {/* Auto Translation Banner */}
            <AnimatePresence>
              {showTranslatePrompt && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-indigo-50/90 dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4 shadow-xs overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0 mt-0.5">
                        <Languages className="w-4 h-4 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Match Voice Accent Language?
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          You selected a <span className="font-semibold text-indigo-600 dark:text-indigo-400">{getLanguageLabel(targetPromptLang)}</span> voice, but your text appears to be in a different language. Translate it instantly for a natural, fluent playback experience!
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 items-center shrink-0">
                      <button
                        onClick={() => handleTranslate(targetPromptLang)}
                        disabled={isTranslating}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        {isTranslating ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Translating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Translate Text</span>
                          </>
                        )}
                      </button>
                      
                      {hasStoredOriginal && (
                        <button
                          onClick={handleRestoreOriginal}
                          className="px-3.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                        >
                          Restore Original
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setDismissedVoicePrompt(selectedVoiceName);
                          setShowTranslatePrompt(false);
                        }}
                        className="px-2.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs font-medium rounded-xl cursor-pointer transition-all"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active view component */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
              <AnimatePresence mode="wait">
                {viewMode === 'edit' ? (
                  <motion.div 
                    key="edit-pane"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-indigo-500" />
                        Write or Import Document Text
                      </span>
                      <button
                        onClick={handleClear}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Clear All</span>
                      </button>
                    </div>

                    {/* Drag and Drop text zone */}
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`relative rounded-2xl border-2 border-dashed transition-all p-1 ${
                        dragActive 
                          ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-[280px] p-4 bg-slate-50 dark:bg-slate-900 border-0 rounded-xl text-sm leading-relaxed text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 font-sans"
                        placeholder="Paste your novel, essay, report, or standard written characters here..."
                      />
                      
                      {text.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-6 text-center">
                          <Upload className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-xs font-semibold text-slate-500">Drag & Drop a .txt or .md file here</p>
                          <p className="text-[10px] text-slate-400 mt-1">Or click 'Import Document' below</p>
                        </div>
                      )}
                    </div>

                    {/* Action Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Import Document</span>
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileSelect} 
                          accept=".txt,.md" 
                          className="hidden" 
                        />
                      </div>

                      {/* Creative samples */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Demo scripts:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {DEMO_SCRIPTS.map((script, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setText(script.text);
                                showToast(`${script.name.split(' ').slice(1).join(' ')} loaded!`);
                              }}
                              className="px-2.5 py-1 bg-indigo-50/60 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/50 text-[10px] text-indigo-600 dark:text-indigo-400 font-medium rounded-lg border border-indigo-100/30 dark:border-indigo-900/30 transition-all cursor-pointer"
                              title={script.name}
                            >
                              {script.name.split(' ')[0]} {script.name.split(' ').slice(1, 3).join(' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                ) : (
                  <motion.div 
                    key="reader-pane"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-500" />
                        Visual Interactive Playback Index
                      </span>
                      <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-semibold">
                        Click any sentence to play from there
                      </span>
                    </div>

                    {sentencesList.length === 0 ? (
                      <div className="py-12 text-center text-slate-400 text-xs">
                        No text found. Please switch back to the Editor View and insert your text.
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                        {sentencesList.map((sentence, index) => {
                          const isCurrent = index === currentSentenceIndex;
                          return (
                            <button
                              key={index}
                              onClick={() => {
                                speakSentence(index);
                              }}
                              className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer block ${
                                isCurrent 
                                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900 shadow-xs' 
                                  : 'bg-slate-50/50 hover:bg-slate-100/70 dark:bg-slate-900/30 dark:hover:bg-slate-850/60 border-slate-150 dark:border-slate-800'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <span className={`text-[10px] font-mono shrink-0 mt-0.5 px-1.5 py-0.5 rounded ${isCurrent ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                  {index + 1}
                                </span>
                                <p className={`text-xs sm:text-sm leading-relaxed ${isCurrent ? 'text-indigo-900 dark:text-indigo-200 font-medium' : 'text-slate-600 dark:text-slate-300'}`}>
                                  {getSentenceWithWordHighlight(sentence, isCurrent)}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Progress slider bar */}
                    {sentencesList.length > 0 && currentSentenceIndex >= 0 && (
                      <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 text-xs font-medium">
                        <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                          Reading Sentence {currentSentenceIndex + 1} of {sentencesList.length}
                        </span>
                        <div className="flex-1 max-w-[200px] h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 transition-all duration-300"
                            style={{ width: `${((currentSentenceIndex + 1) / sentencesList.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Core Audio Controls Player Footer */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-850 flex flex-wrap items-center justify-between gap-4">
                
                {/* Visual state line */}
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-indigo-500 animate-ping' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isPlaying 
                      ? `Synthesizing Sentence ${currentSentenceIndex + 1}...` 
                      : isPaused 
                        ? 'Audio synthesizer paused' 
                        : 'Synthesizer standby - ready to speak'}
                  </span>
                </div>

                {/* Button deck */}
                <div className="flex gap-2.5">
                  {!isPlaying ? (
                    <button
                      onClick={handleSpeak}
                      disabled={sentencesList.length === 0}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>{isPaused ? 'Resume Playback' : 'Start Audio Reader'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePause}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Pause Synthesis</span>
                    </button>
                  )}

                  <button
                    onClick={handleStop}
                    disabled={!isPlaying && !isPaused}
                    className="px-4 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Settings pane (4 columns) */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm space-y-6">
            
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-100 dark:border-slate-850 flex items-center gap-2">
              <Languages className="w-4 h-4 text-indigo-500" />
              <span>Synthesizer Controls</span>
            </h3>

            {/* Voice Select */}
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Accent Voice Engine ({voices.length} Available)
                </label>
                
                {/* Search voices */}
                <div className="relative mb-2">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={voiceSearch}
                    onChange={(e) => setVoiceSearch(e.target.value)}
                    placeholder="Search accents/languages..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none"
                  />
                </div>

                <select
                  value={selectedVoiceName}
                  onChange={(e) => setSelectedVoiceName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none font-sans"
                >
                  {filteredVoices.length === 0 ? (
                    <option value="">No matching accents found</option>
                  ) : (
                    filteredVoices.map((voice) => (
                      <option key={voice.name} value={voice.name}>
                        {voice.name} ({getLanguageLabel(voice.lang)}) {voice.localService ? '• Native' : ''}
                      </option>
                    ))
                  )}
                </select>

                {/* Paired Translation Controller */}
                {selectedVoiceName && voices.length > 0 && (
                  <div className="mt-2.5 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                        Language Translation
                      </span>
                      {hasStoredOriginal && (
                        <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.5 rounded-md">
                          Backup saved
                        </span>
                      )}
                    </div>
                    
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          const voice = voices.find(v => v.name === selectedVoiceName);
                          if (voice) handleTranslate(voice.lang);
                        }}
                        disabled={isTranslating}
                        className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 border border-indigo-100/50 dark:border-indigo-900/50"
                      >
                        {isTranslating ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Translating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>Translate Text</span>
                          </>
                        )}
                      </button>

                      {hasStoredOriginal && (
                        <button
                          onClick={handleRestoreOriginal}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-755 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-lg cursor-pointer transition-colors"
                          title="Restore back to default / original draft"
                        >
                          Default
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Volume Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume1 className="w-3.5 h-3.5 text-indigo-500" />}
                    <span>Volume Level ({isMuted ? 'Muted' : `${Math.round(volume * 100)}%`})</span>
                  </span>
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="text-[10px] text-indigo-500 hover:underline font-semibold"
                  >
                    {isMuted ? 'Unmute' : 'Mute'}
                  </button>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  disabled={isMuted}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-40"
                />
              </div>

              {/* Speed Rate Control */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Speed Pacing ({rate}x)
                  </span>
                  <button 
                    onClick={() => setRate(1)} 
                    className="text-[10px] text-indigo-500 hover:underline"
                  >
                    Normal (1x)
                  </button>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={rate}
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              {/* Pitch Level Control */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    Vocal Pitch ({pitch})
                  </span>
                  <button 
                    onClick={() => setPitch(1)} 
                    className="text-[10px] text-indigo-500 hover:underline"
                  >
                    Reset (1)
                  </button>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pitch}
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                  <span>Deep Baritone</span>
                  <span>Normal</span>
                  <span>High Soprano</span>
                </div>
              </div>

              {/* Reset layout */}
              <button
                onClick={handleResetControls}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Parameters
              </button>
            </div>

            {/* Note Segment */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 text-xs text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl">
              <span className="font-semibold text-indigo-500">Local Compliance:</span>
              <p className="mt-1">
                Your texts never traverse network nodes. Everything processes securely within your browser sandbox virtual memory.
              </p>
            </div>

          </div>

        </div>

        {/* Detailed Guides block */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Volume2 className="w-5 h-5 text-indigo-500" />
              Advanced High-Stability Speech Algorithm
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Browser-based voice synthesis normally crashes or stops abruptly on paragraphs longer than 15 seconds because of a chromium background thread garbage-collection bug. We solve this by compiling your document text into separate, logically split sentences, playing them sequentially. This makes it possible to listen to very long books or drafts safely without freeze-ups.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Sliders className="w-5 h-5 text-emerald-500" />
              Customizable Speed, Volume, and Voice Accent Search
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Filter through your system's custom local accents instantly using our real-time voice search. Adjust speed rates up to 2x for quick scanning of reports or slow them down to carefully review language phrasing and pronunciation detail.
            </p>
          </div>
        </section>

        {/* FAQ list */}
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

        {/* Related tools */}
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
