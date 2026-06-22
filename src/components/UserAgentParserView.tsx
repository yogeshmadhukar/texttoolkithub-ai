import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  HelpCircle,
  Sparkles,
  Info,
  Trash2,
  Settings,
  Download,
  Laptop,
  Compass,
  Cpu,
  Monitor,
  CheckCircle,
  FileText,
  Search,
  Fingerprint
} from 'lucide-react';

interface UserAgentParserViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface ParsedFeatures {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  engine: string;
  isMobile: boolean;
  isTouch: boolean;
  screenRes: string;
  colorDepth: string;
  pixelRatio: number;
  languages: string;
  cookiesEnabled: boolean;
  onlineStatus: string;
}

export default function UserAgentParserView({ onNavigateToTool, onNavigateHome }: UserAgentParserViewProps) {
  const [inputText, setInputText] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedFeatures | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // SEO parameters
  const seoTitle = "User Agent Parser Online - System Client Detector";
  const seoDescription = "Parse HTTP user-agent strings, identify client browsers, OS platforms, layout engines, and hardware display specs 100% locally.";

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

    // Schema JSON-LD Injection
    const schemaContent = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is an HTTP User-Agent string?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "An HTTP User-Agent string is a request header sent to servers to identify the client web browser, operating system platform, layout engine, and specific client device models."
          }
        },
        {
          "@type": "Question",
          "name": "Is my User-Agent or device information logged by this tool?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No! Privacy is our paramount directive. All parsing, hardware specs queries, and string dissecting are performed client-side using JavaScript, ensuring zero data storage or external server uploads."
          }
        },
        {
          "@type": "Question",
          "name": "Can I parse user-agents from other devices?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, you can copy and paste any User-Agent string from mobile, desktop, TV, or bot headers to instantly extract OS platform, engine, version, and device type statistics."
          }
        }
      ]
    };

    const scriptId = "ua-parser-json-ld";
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

  const parseUserAgentString = (ua: string): ParsedFeatures => {
    let browser = 'Unknown Browser';
    let browserVersion = 'Unknown';
    let os = 'Unknown OS';
    let osVersion = 'Unknown';
    let device = 'Desktop';
    let engine = 'Unknown Engine';

    const lowercaseUa = ua.toLowerCase();

    // 1. Detect OS
    if (lowercaseUa.includes('windows')) {
      os = 'Windows';
      const winVer = /windows nt\s+([0-9\._]+)/i.exec(ua);
      osVersion = winVer ? `NT ${winVer[1]}` : 'Unknown';
    } else if (lowercaseUa.includes('macintosh') || lowercaseUa.includes('mac os x')) {
      os = 'macOS';
      const macVer = /mac os x\s+([0-9\._]+)/i.exec(ua);
      osVersion = macVer ? macVer[1].replace(/_/g, '.') : 'Unknown';
    } else if (lowercaseUa.includes('android')) {
      os = 'Android';
      const andVer = /android\s+([0-9\._]+)/i.exec(ua);
      osVersion = andVer ? andVer[1] : 'Unknown';
      device = 'Mobile/Tablet';
    } else if (lowercaseUa.includes('iphone') || lowercaseUa.includes('ipad') || lowercaseUa.includes('ipod')) {
      os = 'iOS';
      const iosVer = /os\s+([0-9\._]+)/i.exec(ua);
      osVersion = iosVer ? iosVer[1].replace(/_/g, '.') : 'Unknown';
      device = lowercaseUa.includes('ipad') ? 'Tablet' : 'Mobile';
    } else if (lowercaseUa.includes('linux')) {
      os = 'Linux';
    }

    // 2. Detect Browser
    if (lowercaseUa.includes('firefox') && !lowercaseUa.includes('seamonkey')) {
      browser = 'Firefox';
      const match = /firefox\/([0-9\.]+)/i.exec(ua);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'Gecko';
    } else if (lowercaseUa.includes('chrome') && !lowercaseUa.includes('chromium') && !lowercaseUa.includes('edg') && !lowercaseUa.includes('opr')) {
      browser = 'Chrome';
      const match = /chrome\/([0-9\.]+)/i.exec(ua);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'Blink';
    } else if (lowercaseUa.includes('safari') && !lowercaseUa.includes('chrome') && !lowercaseUa.includes('chromium')) {
      browser = 'Safari';
      const match = /version\/([0-9\.]+)/i.exec(ua);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'WebKit';
    } else if (lowercaseUa.includes('edg/')) {
      browser = 'Edge';
      const match = /edg\/([0-9\.]+)/i.exec(ua);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'Blink';
    } else if (lowercaseUa.includes('opr/') || lowercaseUa.includes('opera')) {
      browser = 'Opera';
      const match = /opr\/([0-9\.]+)/i.exec(ua);
      browserVersion = match ? match[1] : 'Unknown';
      engine = 'Blink';
    }

    // 3. Hardware metrics from live browser environment safely loaded
    const isMobile = device === 'Mobile' || device === 'Mobile/Tablet' || lowercaseUa.includes('mobile');
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const screenRes = `${window.screen.width} x ${window.screen.height}`;
    const colorDepth = `${window.screen.colorDepth}-bit`;
    const pixelRatio = window.devicePixelRatio || 1;
    const languages = navigator.languages ? navigator.languages.join(', ') : navigator.language || 'Unknown';
    const cookiesEnabled = navigator.cookieEnabled;
    const onlineStatus = navigator.onLine ? 'Online' : 'Offline';

    return {
      browser,
      browserVersion,
      os,
      osVersion,
      device,
      engine,
      isMobile,
      isTouch,
      screenRes,
      colorDepth,
      pixelRatio,
      languages,
      cookiesEnabled,
      onlineStatus
    };
  };

  const handleParse = () => {
    if (!inputText.trim()) {
      setParsed(null);
      return;
    }
    setParsed(parseUserAgentString(inputText));
  };

  useEffect(() => {
    handleParse();
  }, [inputText]);

  // Load user default client values
  const handleDetectClient = () => {
    const rawUa = navigator.userAgent;
    setInputText(rawUa);
  };

  // Run initial loading
  useEffect(() => {
    handleDetectClient();
  }, []);

  const handleCopyReport = async () => {
    if (!parsed) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const handleLoadSample = () => {
    setInputText("Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1");
  };

  const handleDownloadReport = () => {
    if (!parsed) return;
    const blob = new Blob([JSON.stringify(parsed, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `client_system_report.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      id: 1,
      question: "What is an HTTP User-Agent string?",
      answer: "A User-Agent is an HTTP request header string containing technical details of your request's origin. It details your primary browser title, layout engines, CPU architectures, design builds, and hardware operating platform standards."
    },
    {
      id: 2,
      question: "Is my personal system fingerprint data leaked?",
      answer: "No, absolutely not. The detection, parser patterns, and client layouts execute strictly offline. This application stores zero database log traces of browser strings or locations."
    },
    {
      id: 3,
      question: "What is the Blink vs WebKit layout engine?",
      answer: "WebKit is the layout engine powering Apple Safari. Blink is a fork of WebKit built by Google that powers Chromium, Chrome, MS Edge, and Opera browsers."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="ua-parser-root">
      
      {/* Back button and header */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          User Agent Parser & <span className="text-indigo-600 dark:text-indigo-400">Client Information Analyzer</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Instantly dissect any HTTP User Agent string to extract OS components, rendering engine builds and hardware layouts, or automatically identify and query parameters of your current visitor hardware.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: String paste input and launcher */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-1.5 font-sans">
              <Search className="w-4 h-4 text-indigo-500" />
              Source String
            </h3>
            <button
              onClick={handleDetectClient}
              className="text-[10px] font-extrabold bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 transition"
            >
              Detect My Info
            </button>
          </div>

          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            Paste an HTTP User-Agent string below to run diagnosis, or let the local JavaScript load your native live parameters.
          </p>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-[180px] p-3.5 rounded-xl border border-slate-205 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs leading-relaxed"
            placeholder="Paste raw User Agent string layout here..."
          />

          <div className="flex gap-2">
            <button
              onClick={handleLoadSample}
              className="flex-grow py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-755 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-bold transition"
            >
              Load Sample iPhone UA
            </button>
            <button
              onClick={() => setInputText('')}
              className="px-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 rounded-xl text-xs font-bold transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Diagnostic Analysis dashboards */}
        <div className="lg:col-span-7 space-y-6">
          {parsed ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-6">
              
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-indigo-500" /> Core System Diagnostics
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleCopyReport}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {isCopied ? 'Report Copied' : 'Copy JSON'}
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline border-l border-slate-100 dark:border-slate-700 pl-3"
                  >
                    <Download className="w-3 h-3" />
                    Download JSON
                  </button>
                </div>
              </div>

              {/* Grid cards layout details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* OS card */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Laptop className="w-4 h-4 text-indigo-505 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-0.5">Platform OS</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-slate-200">{parsed.os}</span>
                    <span className="block text-[10px] text-slate-500 font-medium font-mono">{parsed.osVersion}</span>
                  </div>
                </div>

                {/* Browser card */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-indigo-505 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-0.5">Browser Spec</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-slate-200">{parsed.browser}</span>
                    <span className="block text-[10px] text-slate-500 font-medium font-mono">v{parsed.browserVersion}</span>
                  </div>
                </div>

                {/* Engine card */}
                <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                  <Cpu className="w-4 h-4 text-indigo-505 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase font-mono mb-0.5">Layout Engine</span>
                    <span className="block text-xs font-black text-slate-850 dark:text-slate-200">{parsed.engine}</span>
                    <span className="block text-[10px] text-slate-500 font-medium">{parsed.device}</span>
                  </div>
                </div>

              </div>

              {/* Hardware diagnostics */}
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-3 font-mono">
                  Additional Environmental Parameters (Client-Side Detection)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs leading-relaxed">
                  <div className="p-2.5 border border-slate-100 dark:border-slate-700/60 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase font-mono">Screen Area</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{parsed.screenRes}</span>
                  </div>
                  <div className="p-2.5 border border-slate-100 dark:border-slate-700/60 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase font-mono">Color Space</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{parsed.colorDepth}</span>
                  </div>
                  <div className="p-2.5 border border-slate-100 dark:border-slate-700/60 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase font-mono">Pixel Ratio (DPR)</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{parsed.pixelRatio}x</span>
                  </div>
                  <div className="p-2.5 border border-slate-100 dark:border-slate-700/60 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase font-mono">Languages</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 text-ellipsis overflow-hidden block whitespace-nowrap">{parsed.languages}</span>
                  </div>
                  <div className="p-2.5 border border-slate-100 dark:border-slate-700/60 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase font-mono">Cookies Active</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{parsed.cookiesEnabled ? 'Yes Enabled' : 'No Blocked'}</span>
                  </div>
                  <div className="p-2.5 border border-slate-100 dark:border-slate-700/60 rounded-xl">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase font-mono">Device Layout</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{parsed.isMobile ? 'Mobile' : 'Desktop Standard'}</span>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 font-bold bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 shadow-sm">
                Parse a string to view details.
            </div>
          )}
        </div>

      </div>

      {/* Guide details FAQs */}
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
