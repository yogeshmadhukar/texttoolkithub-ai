import React, { useState, useMemo } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  FileText, 
  Copy, 
  Check, 
  Trash2, 
  ArrowLeft, 
  Download, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  RotateCcw,
  Upload,
  Settings,
  Sparkles,
  BookOpen,
  Eye,
  AlignLeft,
  Scissors
} from 'lucide-react';

interface SubtitleCleanerViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

const SAMPLE_SRT = `1
00:00:01,000 --> 00:00:04,500
<v Speaker 1>Welcome back to <i>TextToolkitHub</i>! [Music]

2
00:00:05,000 --> 00:00:08,200
<b>Today</b> we are demonstrating our new Subtitle Cleaner utility.

3
00:00:08,500 --> 00:00:12,000
It strips timestamp blocks, frame counters, and sound effect tags. [Applause]

4
00:00:12,200 --> 00:00:16,000
All transcript parsing runs 100% locally in your web browser. (Cheering)`;

export default function SubtitleCleanerView({ onNavigateToTool, onNavigateHome }: SubtitleCleanerViewProps) {
  const [inputText, setInputText] = useState(SAMPLE_SRT);
  const [stripTimestamps, setStripTimestamps] = useState(true);
  const [stripLineNumbers, setStripLineNumbers] = useState(true);
  const [stripHtmlTags, setStripHtmlTags] = useState(true);
  const [stripSoundEffects, setStripSoundEffects] = useState(true);
  const [mergeParagraphs, setMergeParagraphs] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(true);

  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Clean Subtitle Logic
  const cleanedText = useMemo(() => {
    if (!inputText.trim()) return '';

    let text = inputText;

    // Remove WebVTT headers if present
    text = text.replace(/^WEBVTT.*?\n+/i, '');

    const lines = text.split(/\r?\n/);
    const processedLines: string[] = [];

    const timestampRegex = /^\d{1,2}:\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{1,2}:\d{2}:\d{2}[.,]\d{3}/;
    const vttTimestampRegex = /^\d{2}:\d{2}[.,]\d{3}\s*-->\s*\d{2}:\d{2}[.,]\d{3}/;
    const lineNumberRegex = /^\d+$/;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();

      // Skip line numbers if enabled
      if (stripLineNumbers && lineNumberRegex.test(line)) {
        // Check if next line is a timestamp line to confirm it's a subtitle index
        const nextLine = lines[i + 1]?.trim() || '';
        if (timestampRegex.test(nextLine) || vttTimestampRegex.test(nextLine)) {
          continue;
        }
      }

      // Skip timestamp lines if enabled
      if (stripTimestamps && (timestampRegex.test(line) || vttTimestampRegex.test(line))) {
        continue;
      }

      // Strip HTML / VTT tags
      if (stripHtmlTags) {
        line = line.replace(/<[^>]*>/g, '');
        line = line.replace(/&nbsp;/gi, ' ');
        line = line.replace(/&amp;/gi, '&');
        line = line.replace(/&lt;/gi, '<');
        line = line.replace(/&gt;/gi, '>');
      }

      // Strip Sound Effects and Speaker Music Tags in brackets or parens
      if (stripSoundEffects) {
        line = line.replace(/\[[^\]]*\]/g, '');
        line = line.replace(/\([^)]*\)/g, '');
      }

      line = line.replace(/\s+/g, ' ').trim();

      if (line) {
        if (removeDuplicates && processedLines.length > 0 && processedLines[processedLines.length - 1] === line) {
          continue;
        }
        processedLines.push(line);
      }
    }

    if (mergeParagraphs) {
      return processedLines.join(' ');
    } else {
      return processedLines.join('\n');
    }
  }, [
    inputText,
    stripTimestamps,
    stripLineNumbers,
    stripHtmlTags,
    stripSoundEffects,
    mergeParagraphs,
    removeDuplicates
  ]);

  // Calculated Metrics
  const metrics = useMemo(() => {
    const rawWords = cleanedText.trim() ? cleanedText.trim().split(/\s+/).length : 0;
    const chars = cleanedText.length;
    // Estimate speaking duration based on 150 WPM standard speaking rate
    const minutes = rawWords > 0 ? (rawWords / 150) : 0;
    const minPart = Math.floor(minutes);
    const secPart = Math.round((minutes - minPart) * 60);

    return {
      words: rawWords,
      characters: chars,
      speakingTime: `${minPart}m ${secPart}s`,
      readingTime: `${Math.ceil(rawWords / 220)} min read`
    };
  }, [cleanedText]);

  const handleCopy = () => {
    if (!cleanedText) return;
    navigator.clipboard.writeText(cleanedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'txt' | 'md') => {
    if (!cleanedText) return;
    const mimeType = format === 'md' ? 'text/markdown' : 'text/plain';
    const blob = new Blob([cleanedText], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cleaned-transcript.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setInputText(content);
    };
    reader.readAsText(file);
  };

  const faqs = [
    {
      q: 'How does the SRT & VTT Subtitle Cleaner work?',
      a: 'The cleaner parses SRT, WebVTT, or SBV caption files line-by-line, isolating timestamp markers, sequence numbers, speaker labels, and formatting tags. It strips unwanted clutter and formats the output into clean, continuous plain text.'
    },
    {
      q: 'Does my subtitle file get uploaded to a remote server?',
      a: 'No. All processing is carried out 100% locally inside your web browser using client-side JavaScript string manipulation. Your transcripts and audio captions never leave your device.'
    },
    {
      q: 'Can I convert YouTube SRT captions into a blog article or transcript?',
      a: 'Yes! Download the SRT or VTT caption file from YouTube or Zoom, paste or upload it here, and turn on "Merge into Paragraphs". You will immediately receive a clean article-ready transcript.'
    },
    {
      q: 'What subtitle formats are supported?',
      a: 'This tool supports SubRip (.srt), WebVTT (.vtt), YouTube SBV, and general timestamped transcript logs.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <button 
          onClick={onNavigateHome}
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-medium">SRT & VTT Subtitle Cleaner</span>
      </div>

      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/40 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <Scissors className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  SRT & VTT Subtitle Cleaner
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                  100% Client-Side
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Strip timestamps, line indices, speaker tags, and HTML formatting from SRT and VTT captions to extract clean transcripts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar & Toggles */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <Settings className="w-4 h-4 text-indigo-500" /> Cleaning Preferences
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
          <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <input 
              type="checkbox" 
              checked={stripTimestamps} 
              onChange={(e) => setStripTimestamps(e.target.checked)} 
              className="rounded text-indigo-600 focus:ring-indigo-500" 
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Strip Timestamps</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <input 
              type="checkbox" 
              checked={stripLineNumbers} 
              onChange={(e) => setStripLineNumbers(e.target.checked)} 
              className="rounded text-indigo-600 focus:ring-indigo-500" 
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Strip Line Numbers</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <input 
              type="checkbox" 
              checked={stripHtmlTags} 
              onChange={(e) => setStripHtmlTags(e.target.checked)} 
              className="rounded text-indigo-600 focus:ring-indigo-500" 
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Strip HTML Tags</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <input 
              type="checkbox" 
              checked={stripSoundEffects} 
              onChange={(e) => setStripSoundEffects(e.target.checked)} 
              className="rounded text-indigo-600 focus:ring-indigo-500" 
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Strip [Music] / Tags</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <input 
              type="checkbox" 
              checked={mergeParagraphs} 
              onChange={(e) => setMergeParagraphs(e.target.checked)} 
              className="rounded text-indigo-600 focus:ring-indigo-500" 
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Merge Paragraphs</span>
          </label>

          <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <input 
              type="checkbox" 
              checked={removeDuplicates} 
              onChange={(e) => setRemoveDuplicates(e.target.checked)} 
              className="rounded text-indigo-600 focus:ring-indigo-500" 
            />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Remove Duplicates</span>
          </label>
        </div>
      </div>

      {/* Main Grid: Input and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Subtitle Input Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-indigo-500" />
              Raw Subtitle / Caption Text
            </label>
            <div className="flex items-center gap-2">
              <label className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition-colors flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                Upload File (.srt, .vtt)
                <input 
                  type="file" 
                  accept=".srt,.vtt,.txt,.sbv" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
              <button
                onClick={() => setInputText(SAMPLE_SRT)}
                className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                Sample SRT
              </button>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  title="Clear input"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your SRT, VTT, or YouTube caption text here or upload a file..."
            className="w-full h-80 p-4 font-mono text-xs bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
          />
        </div>

        {/* Clean Transcript Output Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              Clean Transcript Output
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!cleanedText}
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
              <button
                onClick={() => handleDownload('txt')}
                disabled={!cleanedText}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                .txt
              </button>
              <button
                onClick={() => handleDownload('md')}
                disabled={!cleanedText}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                .md
              </button>
            </div>
          </div>

          <textarea
            readOnly
            value={cleanedText}
            placeholder="Cleaned plain-text transcript will appear here automatically..."
            className="w-full h-80 p-4 font-sans text-sm bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 rounded-xl border border-slate-200 dark:border-slate-800 outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Transcript Analytics Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-8 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <AlignLeft className="w-4 h-4 text-indigo-500" />
          Transcript Stats & Readability Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Word Count</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {metrics.words.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Characters</div>
            <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {metrics.characters.toLocaleString()}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Speech Time</div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
              {metrics.speakingTime}
            </div>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Reading Time</div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              {metrics.readingTime}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Guide & FAQs */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          How to Convert Subtitles into Plain Text Transcripts
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
          Video and audio subtitle files like SRT, WebVTT, and YouTube captions are packed with line index numbers, timestamp timecodes (&quot;00:01:23,456 --&gt; 00:01:26,789&quot;), speaker tags (&lt;v Speaker 1&gt;), and sound effect notes ([Music]). When copy-pasting subtitle content directly into a blog post, essay, or summary document, these unwanted markers create chaotic whitespace. Our Subtitle Cleaner parses caption structures locally and provides clean, article-ready text.
        </p>

        <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-indigo-500" />
          Frequently Asked Questions
        </h4>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full px-4 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {expandedFaq === idx && (
                <div className="px-4 py-3.5 text-xs text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
