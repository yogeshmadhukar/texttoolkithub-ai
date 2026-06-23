import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Clock, 
  Calendar, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  RotateCcw, 
  HelpCircle, 
  ArrowLeftRight, 
  Settings, 
  Globe, 
  RefreshCw, 
  AlertCircle, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  BookmarkCheck
} from 'lucide-react';

interface UnixTimestampConverterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function UnixTimestampConverterView({ onNavigateToTool, onNavigateHome }: UnixTimestampConverterViewProps) {
  // Current dynamic time state
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [isTickerMilli, setIsTickerMilli] = useState<boolean>(false);
  const [tickerPaused, setTickerPaused] = useState<boolean>(false);
  const [tickerCopied, setTickerCopied] = useState<boolean>(false);

  // Conversion inputs
  const [epochInput, setEpochInput] = useState<string>(Math.floor(Date.now() / 1000).toString());
  const [epochUnit, setEpochUnit] = useState<'seconds' | 'milliseconds'>('seconds');
  
  // Date-to-epoch inputs
  const [yearInput, setYearInput] = useState<string>(new Date().getFullYear().toString());
  const [monthInput, setMonthInput] = useState<string>((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [dayInput, setDayInput] = useState<string>(new Date().getDate().toString().padStart(2, '0'));
  const [hourInput, setHourInput] = useState<string>(new Date().getHours().toString().padStart(2, '0'));
  const [minuteInput, setMinuteInput] = useState<string>(new Date().getMinutes().toString().padStart(2, '0'));
  const [secondInput, setSecondInput] = useState<string>(new Date().getSeconds().toString().padStart(2, '0'));
  const [timezoneSelect, setTimezoneSelect] = useState<'UTC' | 'Local'>('Local');

  // Outputs
  const [epochToDateResults, setEpochToDateResults] = useState<{
    gmt: string;
    utc: string;
    local: string;
    relative: string;
    iso: string;
    isValid: boolean;
    error?: string;
  } | null>(null);

  const [dateToEpochResult, setDateToEpochResult] = useState<{
    seconds: number;
    milliseconds: number;
    isValid: boolean;
    error?: string;
  } | null>(null);

  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const tickerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // SEO Parameters
  const seoTitle = "Unix Timestamp Converter Online - Live Epoch Date Tool";
  const seoDescription = "Convert Unix Epoch timestamps to human-readable dates, and dates to epoch seconds. Real-time dynamic ticker, UTC/Local timezone conversions, completely client-side.";

  useEffect(() => {
    // Page Title & SEO setup
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

  // Set up the current time ticker
  useEffect(() => {
    if (tickerPaused) {
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
      return;
    }

    tickerIntervalRef.current = setInterval(() => {
      const now = Date.now();
      setCurrentEpoch(isTickerMilli ? now : Math.floor(now / 1000));
    }, isTickerMilli ? 47 : 1000);

    return () => {
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
    };
  }, [tickerPaused, isTickerMilli]);

  // Handle live conversion of Epoch Input
  useEffect(() => {
    if (!epochInput.trim()) {
      setEpochToDateResults(null);
      return;
    }

    const val = parseInt(epochInput.trim(), 10);
    if (isNaN(val)) {
      setEpochToDateResults({
        gmt: '', utc: '', local: '', relative: '', iso: '',
        isValid: false,
        error: "Please enter a valid numeric value."
      });
      return;
    }

    try {
      // Determine time in milliseconds
      const ms = epochUnit === 'seconds' ? val * 1000 : val;
      const date = new Date(ms);

      if (isNaN(date.getTime())) {
        throw new Error("Invalid range or date specification.");
      }

      // Format UTC & Local formats
      const utcString = date.toUTCString();
      const localString = date.toLocaleString();
      const isoString = date.toISOString();

      // Relative Time Calculation
      const secondsDiff = Math.floor((date.getTime() - Date.now()) / 1000);
      let relativeText = '';
      if (Math.abs(secondsDiff) < 5) {
        relativeText = 'just now';
      } else {
        const units = [
          { label: 'year', secs: 31536000 },
          { label: 'month', secs: 2592000 },
          { label: 'day', secs: 86400 },
          { label: 'hour', secs: 3600 },
          { label: 'minute', secs: 60 },
          { label: 'second', secs: 1 }
        ];

        let matched = false;
        const absDiff = Math.abs(secondsDiff);
        for (const u of units) {
          if (absDiff >= u.secs) {
            const count = Math.floor(absDiff / u.secs);
            relativeText = secondsDiff > 0 
              ? `in ${count} ${u.label}${count > 1 ? 's' : ''}` 
              : `${count} ${u.label}${count > 1 ? 's' : ''} ago`;
            matched = true;
            break;
          }
        }
        if (!matched) relativeText = 'just now';
      }

      setEpochToDateResults({
        gmt: utcString.replace("GMT", "UTC"),
        utc: utcString,
        local: localString,
        relative: relativeText,
        iso: isoString,
        isValid: true
      });
    } catch {
      setEpochToDateResults({
        gmt: '', utc: '', local: '', relative: '', iso: '',
        isValid: false,
        error: "Numerical value is out of system range bounds."
      });
    }
  }, [epochInput, epochUnit]);

  // Handle Date To Epoch conversion
  useEffect(() => {
    const y = parseInt(yearInput, 10);
    const m = parseInt(monthInput, 10);
    const d = parseInt(dayInput, 10);
    const h = parseInt(hourInput, 10);
    const min = parseInt(minuteInput, 10);
    const s = parseInt(secondInput, 10);

    if (isNaN(y) || isNaN(m) || isNaN(d) || isNaN(h) || isNaN(min) || isNaN(s)) {
      setDateToEpochResult({
        seconds: 0, milliseconds: 0,
        isValid: false,
        error: "All fields must contain integers."
      });
      return;
    }

    if (m < 1 || m > 12 || d < 1 || d > 31 || h < 0 || h > 23 || min < 0 || min > 59 || s < 0 || s > 59) {
      setDateToEpochResult({
        seconds: 0, milliseconds: 0,
        isValid: false,
        error: "Calendar fields are out of bounds (e.g., months 1-12, hours 0-23)."
      });
      return;
    }

    try {
      let targetDate: Date;
      if (timezoneSelect === 'UTC') {
        targetDate = new Date(Date.UTC(y, m - 1, d, h, min, s));
      } else {
        targetDate = new Date(y, m - 1, d, h, min, s);
      }

      const ms = targetDate.getTime();
      if (isNaN(ms)) {
        throw new Error("Calendar bounds represent an invalid date.");
      }

      setDateToEpochResult({
        seconds: Math.floor(ms / 1000),
        milliseconds: ms,
        isValid: true
      });
    } catch {
      setDateToEpochResult({
        seconds: 0, milliseconds: 0,
        isValid: false,
        error: "Date specs resolved to an non-existent date configuration."
      });
    }
  }, [yearInput, monthInput, dayInput, hourInput, minuteInput, secondInput, timezoneSelect]);

  const handleCopyText = async (val: string, fieldId: string) => {
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 1800);
    } catch (e) {
      console.warn("Clipboard copy failure", e);
    }
  };

  const handleCopyTicker = async () => {
    try {
      await navigator.clipboard.writeText(currentEpoch.toString());
      setTickerCopied(true);
      setTimeout(() => setTickerCopied(false), 1500);
    } catch {}
  };

  const handleInsertTickerToInput = () => {
    setEpochInput(currentEpoch.toString());
    setEpochUnit(isTickerMilli ? 'milliseconds' : 'seconds');
  };

  const handleSetToCurrentTime = () => {
    const now = new Date();
    setYearInput(now.getFullYear().toString());
    setMonthInput((now.getMonth() + 1).toString().padStart(2, '0'));
    setDayInput(now.getDate().toString().padStart(2, '0'));
    setHourInput(now.getHours().toString().padStart(2, '0'));
    setMinuteInput(now.getMinutes().toString().padStart(2, '0'));
    setSecondInput(now.getSeconds().toString().padStart(2, '0'));
    setTimezoneSelect('Local');
  };

  const faqs = [
    {
      id: 1,
      question: "What is Unix Epoch time?",
      answer: "Unix epoch time (or Unix timestamp) is the total number of seconds that have elapsed since Thursday, 1 January 1970 at 00:00:00 Coordinated Universal Time (UTC), minus leap seconds. It is a unified standard system to represent absolute timestamps mathematically in computer programs."
    },
    {
      id: 2,
      question: "How do seconds versus milliseconds timestamps differ?",
      answer: "Most older or C-style computer platforms track standard epoch times in seconds. Modern environments (like JavaScript or Java) represent times inside milliseconds APIs (1 second = 1000 milliseconds). If your timestamp consists of 10 digits (e.g., 1740000000), it is likely seconds. If it features 13 digits (e.g., 1745000000000), it represents milliseconds."
    },
    {
      id: 3,
      question: "Does the Unix Time count leap seconds?",
      answer: "No. The standard Unix Epoch system handles everyday UTC calendar minutes smoothly by assuming each day contains exactly 86,400 seconds. When a leap second occurs, standard Unix clocks repeat or offset the last second of standard day boundaries to align properly."
    },
    {
      id: 4,
      question: "Is this timestamp converter secure?",
      answer: "Yes, 100% of the conversions other than relative offsets are completed locally inside your web browser secure script context. No database queries, analytics identifiers, or private dates are sent over networks or APIs."
    },
    {
      id: 5,
      question: "What is the Year 2038 Problem (Y2K38)?",
      answer: "The Year 2038 problem is a time-formatting issue in 32-bit systems where timestamps are stored as signed 32-bit integers. On January 19, 2038, the value will overflow, wrapping back to 1901. Modern environments mitigate this by upgrading to 64-bit coordinate spaces, which can measure times for trillions of years."
    },
    {
      id: 6,
      question: "How do timezones affect Unix timestamps?",
      answer: "Unix timestamps represent absolute, timezone-independent elapsed durations from UTC. Regardless of your actual local timezone offset, the absolute Unix timestamp value remains identical globally at any single moment. Timezones only affect the visual formatting of the date."
    },
    {
      id: 7,
      question: "How can I format a Unix timestamp to local date string in JS?",
      answer: "You can convert a standard epoch seconds value into a Javascript Date object by multiplying the value by 1000: `const date = new Date(timestampSeconds * 1000)`. Then, you can use `toLocaleString()` to output a localized string tailored to your browser's language format."
    },
    {
      id: 8,
      question: "Why does my numeric timestamp return a year in 1970?",
      answer: "This usually occurs when you pass a standard 10-digit epoch seconds value directly into a millisecond-based Date API (like JS `new Date(epoch)`). Since the API expects 13 digits, it interprets your seconds as milliseconds—representing the first few days of January 1970."
    },
    {
      id: 9,
      question: "What is Coordinated Universal Time (UTC)?",
      answer: "Coordinated Universal Time (UTC) is a high-precision, atomic standard time system used to regulate world clocks. It forms the standard foundation for Unix time tracking and is unaffected by seasonal changes like daylight saving offsets."
    },
    {
      id: 10,
      question: "Does this utility support negative Unix timestamps?",
      answer: "Yes. Negative timestamps represent absolute calendar offsets that occurred prior to January 1, 1970. For example, epoch seconds value `-315900000` translates to a date in 1960."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="unix-converter-root">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            onClick={onNavigateHome}
            className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to Tools
          </button>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
            Unix Epoch <span className="text-indigo-600 dark:text-indigo-400">Timestamp Converter</span>
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
            A high-fidelity developer utility to convert between Unix timestamps and calendar dates in parallel. Includes live accurate millisecond ticking, timezone mappings, and quick translation cards.
          </p>
        </div>

        {/* Live Ticker Component */}
        <div className="bg-gradient-to-br from-indigo-50 to-white dark:from-slate-800 dark:to-slate-900 border border-indigo-100 dark:border-slate-700/60 p-4 rounded-2xl shadow-sm text-center md:text-right min-w-[280px]">
          <div className="flex items-center justify-center md:justify-end gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-1 uppercase tracking-wider">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 ${tickerPaused ? 'hidden' : ''}`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${tickerPaused ? 'bg-amber-400' : 'bg-indigo-600'}`}></span>
            </span>
            Live Unix Ticker
          </div>
          <div className="font-mono text-xl font-black text-slate-900 dark:text-white tracking-widest tabular-nums">
            {currentEpoch}
          </div>
          <div className="mt-2 flex items-center justify-center md:justify-end gap-1.5">
            <button 
              onClick={() => {
                setIsTickerMilli(!isTickerMilli);
                setCurrentEpoch(isTickerMilli ? Math.floor(Date.now() / 1000) : Date.now());
              }}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {isTickerMilli ? 'Seconds' : 'Millis'}
            </button>
            <button 
              onClick={() => setTickerPaused(!tickerPaused)}
              className="text-[10px] px-2 py-0.5 rounded bg-slate-200/80 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              {tickerPaused ? <Play className="w-2.5 h-2.5 inline mr-1" /> : <Pause className="w-2.5 h-2.5 inline mr-1" />}
              {tickerPaused ? 'Resume' : 'Pause'}
            </button>
            <button 
              onClick={handleCopyTicker}
              className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white font-extrabold hover:bg-indigo-700 transition-colors"
            >
              {tickerCopied ? 'Copied!' : 'Copy'}
            </button>
            <button 
              onClick={handleInsertTickerToInput}
              className="text-[10px] px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold hover:bg-emerald-700 transition-colors"
            >
              Use Input
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Unit 1: Epoch to Date */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/85 p-6 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
              Convert Unix timestamp to Human Date
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Enter Timestamp
              </label>
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={epochInput}
                  onChange={(e) => setEpochInput(e.target.value)}
                  className="flex-grow font-mono px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  placeholder="e.g. 1740000000"
                />
                <select 
                  value={epochUnit}
                  onChange={(e) => setEpochUnit(e.target.value as 'seconds' | 'milliseconds')}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none text-slate-700 dark:text-slate-200"
                >
                  <option value="seconds">Seconds (10-digits)</option>
                  <option value="milliseconds">Milliseconds (13-digits)</option>
                </select>
              </div>
            </div>

            {epochToDateResults ? (
              epochToDateResults.isValid ? (
                <div className="mt-6 space-y-3.5 bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-xl border border-slate-100 dark:border-slate-700/50">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Result Formats</span>
                    <span className="font-mono text-xs font-bold text-slate-400 tabular-nums">Resolved correctly</span>
                  </div>

                  <div className="space-y-3">
                    {/* UTC / GMT */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                          <Globe className="w-3 h-3 text-emerald-500" /> UTC Time
                        </span>
                        <button 
                          onClick={() => handleCopyText(epochToDateResults.utc, 'to-utc')}
                          className="text-[10px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold font-mono transition-colors flex items-center gap-0.5"
                        >
                          {copiedField === 'to-utc' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedField === 'to-utc' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-mono text-sm bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 break-all select-all">
                        {epochToDateResults.utc}
                      </div>
                    </div>

                    {/* Local Time */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-indigo-500" /> Your Local Time
                        </span>
                        <button 
                          onClick={() => handleCopyText(epochToDateResults.local, 'to-local')}
                          className="text-[10px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold font-mono transition-colors flex items-center gap-0.5"
                        >
                          {copiedField === 'to-local' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedField === 'to-local' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-mono text-sm bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-all">
                        {epochToDateResults.local}
                      </div>
                    </div>

                    {/* ISO String */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3 text-purple-500" /> ISO-8601
                        </span>
                        <button 
                          onClick={() => handleCopyText(epochToDateResults.iso, 'to-iso')}
                          className="text-[10px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold font-mono transition-colors flex items-center gap-0.5"
                        >
                          {copiedField === 'to-iso' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedField === 'to-iso' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-mono text-sm bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 select-all">
                        {epochToDateResults.iso}
                      </div>
                    </div>

                    {/* Relative difference */}
                    <div className="flex items-center gap-2 bg-indigo-50/50 dark:bg-indigo-950/20 px-3 py-2 rounded-lg text-xs border border-indigo-50 dark:border-slate-800">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">Relative Offset:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium font-sans italic">{epochToDateResults.relative}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold">
                    {epochToDateResults.error || "Fatal formatting error."}
                  </div>
                </div>
              )
            ) : (
              <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 py-6 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl font-mono">
                Awaiting valid numeric input string
              </div>
            )}
          </div>
        </div>

        {/* Unit 2: Date to Epoch */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/85 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-violet-50 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                Convert Calendar Date to Unix Timestamp
              </h2>
            </div>
            <button 
              onClick={handleSetToCurrentTime}
              className="text-xs flex items-center gap-1 font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Use Current
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Year</label>
                <input 
                  type="number"
                  value={yearInput}
                  onChange={(e) => setYearInput(e.target.value)}
                  className="w-full text-center font-mono px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="YYYY"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Month (01-12)</label>
                <input 
                  type="number"
                  value={monthInput}
                  onChange={(e) => setMonthInput(e.target.value)}
                  className="w-full text-center font-mono px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="MM"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Day (01-31)</label>
                <input 
                  type="number"
                  value={dayInput}
                  onChange={(e) => setDayInput(e.target.value)}
                  className="w-full text-center font-mono px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="DD"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Hr (00-23)</label>
                <input 
                  type="number"
                  value={hourInput}
                  onChange={(e) => setHourInput(e.target.value)}
                  className="w-full text-center font-mono px-1.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="HH"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Min (00-59)</label>
                <input 
                  type="number"
                  value={minuteInput}
                  onChange={(e) => setMinuteInput(e.target.value)}
                  className="w-full text-center font-mono px-1.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="MM"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Sec (00-59)</label>
                <input 
                  type="number"
                  value={secondInput}
                  onChange={(e) => setSecondInput(e.target.value)}
                  className="w-full text-center font-mono px-1.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="SS"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">Zone</label>
                <select 
                  value={timezoneSelect}
                  onChange={(e) => setTimezoneSelect(e.target.value as 'UTC' | 'Local')}
                  className="w-full px-1.5 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-bold text-xs text-indigo-600 dark:text-indigo-400 h-[38px] cursor-pointer"
                >
                  <option value="Local">Local</option>
                  <option value="UTC">UTC (GMT)</option>
                </select>
              </div>
            </div>

            {dateToEpochResult ? (
              dateToEpochResult.isValid ? (
                <div className="mt-6 space-y-3.5 bg-slate-50 dark:bg-slate-900/50 p-4.5 rounded-xl border border-slate-100 dark:border-slate-700/50 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <span className="text-xs font-semibold text-violet-500 uppercase tracking-wide">Epoch Output Timestamps</span>
                    <span className="font-mono text-xs font-bold text-slate-400 capitalize">{timezoneSelect.toLowerCase()} coordinates</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Seconds */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                          Epoch Seconds (10-digits)
                        </span>
                        <button 
                          onClick={() => handleCopyText(dateToEpochResult.seconds.toString(), 'epoch-sec')}
                          className="text-[10px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono font-bold transition-colors flex items-center gap-0.5"
                        >
                          {copiedField === 'epoch-sec' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedField === 'epoch-sec' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-mono text-sm bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-center font-bold tabular-nums">
                        {dateToEpochResult.seconds}
                      </div>
                    </div>

                    {/* Milliseconds */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">
                          Epoch Milliseconds (13-digits)
                        </span>
                        <button 
                          onClick={() => handleCopyText(dateToEpochResult.milliseconds.toString(), 'epoch-ms')}
                          className="text-[10px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-mono font-bold transition-colors flex items-center gap-0.5"
                        >
                          {copiedField === 'epoch-ms' ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                          {copiedField === 'epoch-ms' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="font-mono text-sm bg-white dark:bg-slate-950 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-center font-semibold tabular-nums">
                        {dateToEpochResult.milliseconds}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-xl border border-rose-100 dark:border-rose-900/30 text-rose-800 dark:text-rose-300 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="text-xs font-semibold">
                    {dateToEpochResult.error || "Calendar decoding error."}
                  </div>
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {/* Cheat Sheet & Conversions Table */}
      <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 mb-12">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-1.5 font-sans">
          <Settings className="w-4.5 h-4.5 text-indigo-500" />
          Epoch Code Snippets Cheatsheet
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-slate-300">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">JavaScript / TypeScript</span>
            <code className="font-mono text-indigo-600 dark:text-indigo-400 block bg-slate-50 dark:bg-slate-950 p-2 rounded leading-relaxed border border-slate-100 dark:border-slate-805 select-all">
              {"// Get Epoch Seconds\nMath.floor(Date.now() / 1000);\n\n// Date from Timestamp\nnew Date(timestampSeconds * 1000);"}
            </code>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Python</span>
            <code className="font-mono text-indigo-600 dark:text-indigo-400 block bg-slate-50 dark:bg-slate-950 p-2 rounded leading-relaxed border border-slate-100 dark:border-slate-805 select-all">
              {"import time\n# Get Epoch Seconds\nepoch = int(time.time())\n\n# Date from Timestamp\nimport datetime\ndatetime.datetime.fromtimestamp(epoch)"}
            </code>
          </div>
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">Java / C#</span>
            <code className="font-mono text-indigo-600 dark:text-indigo-400 block bg-slate-50 dark:bg-slate-950 p-2 rounded leading-relaxed border border-slate-100 dark:border-slate-805 select-all">
              {"// Java Epoch Seconds\nlong epoch = System.currentTimeMillis() / 1000;\n\n// C# Epoch Seconds\nlong epoch = DateTimeOffset.UtcNow.ToUnixTimeSeconds();"}
            </code>
          </div>
        </div>
      </div>

      {/* DETAILED EDUCATIONAL & SEO RESOURCE MANUAL */}
      <section className="prose max-w-none pt-4 border-t border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-sans space-y-12">
        
        {/* Introduction & What is this tool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#4f46e5] dark:text-[#818cf8] font-mono leading-none block">System Engineering Chronometry</span>
            <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-0" id="unix-intro">
              Introduction to Unix Timestamp Chronology
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Across system logs, distributed database schemas, network protocols, and application sessions, keeping a uniform track of time represents a primary technical challenge. If each server logged durations based on local variable definitions—incorporating custom local timezone rules and daylight saving alignments—merging server events would result in logical chronometric chaos. To prevent database alignment discrepancies, modern cloud systems record absolute time as a single real-time integer coordinate.
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              This universal metric is called <strong>Unix Time</strong>, also termed Epoch Time. It measures the absolute duration of seconds elapsed since the designated standard epoch of January 1, 1970 00:00:00 UTC.
            </p>
          </div>
          
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white mt-0 font-sans" id="unix-what-is">
              What is this Tool?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This interactive utility of TextToolkitHub is a developer sandbox designed to convert abstract Unix epochs into human-readable calendar times, and vice versa. It features dynamic millisecond trackers, automated time zone conversions (supporting local, UTC, GMT, and custom offsets), and code generators for several platforms like Node, Python, and Java. It executes entirely in your browser window to guarantee secure log analysis.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              When verifying network requests or logs, parse your payloads safely with our <a href="/user-agent" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">User Agent Parser</a> or convert complex structured data formats using our <a href="/yaml-json" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">YAML ↔ JSON Converter</a> for modern system administration.
            </p>
          </div>
        </div>

        {/* Guide to Using the System */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-10 space-y-6">
          <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="unix-how-to">
            How to Convert Epoch Timestamps and Calendar Dates
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Translating timestamps to localized human formats is immediate with our chronological toolkit. Use our simple operational steps:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">01</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Input Source Timestamp</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Paste your epoch seconds or milliseconds integer into the input area. The engine auto-detects length formats.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">02</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Pick Target Timezone</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Toggle between local device settings, UTC, GMT, or defined UTC offsets to inspect date visual shifts instantly.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">03</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Decode Calendar to Epoch</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Use the calendar pickers to select years, months, and hours to generate direct epoch mappings in real-time.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">04</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Copy Code Templates</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select snippet tabs representing programming platforms to paste robust date-manipulation code inside projects.</p>
            </div>
          </div>
        </div>

        {/* Benefits & Use Cases & Real World Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="unix-benefits">
              Benefits & Key Use Cases
            </h3>
            <ul className="text-sm space-y-3.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Database Audits:</strong> Data analysts translate cryptic audit database timestamps into local readable calendar strings to sequence events cleanly.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>API Troubleshooting:</strong> Web engineers convert timestamps found in REST headers to verify parameters like security token expirations.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Log Merging:</strong> Devops merge timestamps from different server channels into a unified timeframe, making systematic error finding fast.
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="unix-conversions">
              Epoch Alignment Table
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-150 dark:border-slate-850">
              <table className="min-w-full text-xs font-sans text-left text-slate-650 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-200 font-bold">
                  <tr>
                    <th className="p-3">Reference Duration</th>
                    <th className="p-3">Equivalent Seconds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">1 Minute</td>
                    <td className="p-3 font-mono">60 Seconds</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">1 Hour</td>
                    <td className="p-3 font-mono">3,600 Seconds</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">1 Day</td>
                    <td className="p-3 font-mono">86,400 Seconds</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">1 Week</td>
                    <td className="p-3 font-mono">604,800 Seconds</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">1 Month (Average)</td>
                    <td className="p-3 font-mono">2,629,743 Seconds</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Common Mistakes & Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="unix-mistakes">
              Common Chronology Pitfalls
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mishandling timezone boundaries and coordinate units are critical developer mistakes when building real-time applications:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-550 dark:text-slate-450 space-y-2">
              <li><strong>Scale Unit Discrepancy:</strong> Passing standard 10-digit seconds directly into APIs expecting 13-digit millisecond parameters, resulting in dates stuck in early 1970.</li>
              <li><strong>Local Clock Dependencies:</strong> Computing absolute epochs from local server times without normalizing timezone offsets to UTC, splitting schedules.</li>
              <li><strong>Truncating Leap Seconds:</strong> Failing to use defensive time intervals in synchronization scripts, which can lead to minor timing issues on calendar boundaries.</li>
              <li><strong>32-Bit Overflow Caps:</strong> Relying on unsigned 32-bit integers in legacy infrastructures, risking calendar database lockups in 2038.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="unix-best-practices">
              Industry Chrono Best Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Store strictly in UTC</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Always save timestamps strictly in UTC parameters. Let the client browser calculate offsets for display formatting.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Upgrade to 64-Bit Time</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Upgrade legacy applications and schemas to 64-bit integer values to bypass any Year 2038 overflow faults safely.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Validate Lengths</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Check the lengths of incoming numeric values (10 digits vs 13 digits) to prevent multiplication issues in background code.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Verify Dynamic Clocks</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Utilize our timezone sandbox previews to cross-check offsets before saving system cron triggers.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* FAQ Accordion Section */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-sans flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          {faqs.map((faq) => {
            const isExpanded = faqExpanded === faq.id;
            return (
              <div 
                key={faq.id}
                className="bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700/80 overflow-hidden"
              >
                <button
                  onClick={() => setFaqExpanded(isExpanded ? null : faq.id)}
                  className="w-full flex items-center justify-between p-4 text-left font-bold text-sm text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {isExpanded && (
                  <div className="p-4 border-t border-slate-50 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-900/10">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
