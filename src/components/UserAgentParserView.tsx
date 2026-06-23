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
    },
    {
      id: 4,
      question: "How do web servers use User-Agent files to deliver layouts?",
      answer: "Web server hosts examine incoming User-Agent headers before composing responses. For example, if the header includes 'Mobile' strings, servers can route requests to mobile-responsive templates, optimizing media sizing files."
    },
    {
      id: 5,
      question: "Why do Chrome or Safari User-Agents still list Mozilla and Safari versions?",
      answer: "This is a form of legacy compatibility mapping. Early browsers blocked access to content unless they recognized specific strings (like 'Mozilla'). To bypassed this block, newer browsers added those parent keywords to identify safely."
    },
    {
      id: 6,
      question: "Can a client spoof or change their User-Agent string?",
      answer: "Yes. Most browsers allow developers to toggle custom developer tools presets or spoof headers via command line arguments. Spoofing is commonly used to debug responsive layouts or bypass scraping blocker policies."
    },
    {
      id: 7,
      question: "What are User-Agent Client Hints (UA-CH)?",
      answer: "User-Agent Client Hints is a modern W3C system designed to gradually replace classic User-Agent strings. It allows browsers to share specific specifications (like CPU platform) on-demand, reducing user fingerprinting risks."
    },
    {
      id: 8,
      question: "How does our local engine extract operating platforms?",
      answer: "Our parser runs custom regex evaluations against pasted strings, searching for key system identifiers (such as 'Windows NT 10.0', 'Macintosh', or 'Android') and parsing match indices to display versions instantly."
    },
    {
      id: 9,
      question: "Does TextToolkitHub track my network IP or system profiles?",
      answer: "No. The parsing engine, resolution lookups, and cookie detection are done on-premise inside your safe sandbox browser context. Zero external telemetry packets are sent to our servers."
    },
    {
      id: 10,
      question: "Is analyzing user agent signatures useful for Google AdSense compliance?",
      answer: "Yes, ensuring that your server serves identical content across different user-agent strings is important. Discrepancies can lead to crawling errors or index blocking during AdSense content compliance checks."
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

      {/* DETAILED EDUCATIONAL & SEO RESOURCE MANUAL */}
      <section className="prose max-w-none pt-16 border-t border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-sans space-y-12">
        
        {/* Introduction & What is this tool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#4f46e5] dark:text-[#818cf8] font-mono leading-none block">HTTP Request Context</span>
            <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-0" id="ua-intro">
              Introduction to HTTP User-Agent Signatures
            </h2>
            <p className="text-sm leading-relaxed text-[#52525b] dark:text-slate-400">
              When software programs launch connection queries to retrieve online files, they identify their identity, version scope, and layout capacity using web standards. This technical identity is encapsulated inside a standard HTTP browser header request labeled the <strong>User-Agent</strong>. This descriptive string operates as a digital passport, explaining details like CSS layout engines, device forms, and operating system kernels.
            </p>
            <p className="text-sm leading-relaxed text-[#52525b] dark:text-slate-400">
              For example, web administrators inspect these strings to verify traffic origins, confirm responsiveness, identify crawler bots, and target secure updates to compatibility layers.
            </p>
          </div>
          
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white mt-0 font-sans" id="ua-what-is">
              What is this Tool?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This interactive dashboard of TextToolkitHub is an advanced client-side diagnostic string parser. It decomposes complex User-Agent headers to display OS versions, client browsers, active layout engines, device form factors (mobile vs desktop), screen area ratios, color depth coordinates, and browser language parameters. All parsing runs entirely within local javascript threads, ensuring your system identities stay safe.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              When analyzing client properties, also consider checking system timestamps using our <a href="/unix-timestamp" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">Unix Timestamp Converter</a> or format structured configurations with our <a href="/yaml-json" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">YAML ↔ JSON Converter</a> for web diagnostics.
            </p>
          </div>
        </div>

        {/* Guide to Using the System */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-10 space-y-6">
          <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="ua-how-to">
            How to Parse and Inspect User-Agent Strings
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Extracting device parameters and layouts is rapid with our diagnostics engine. Use our step-by-step developer guide:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">01</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Retrieve Client String</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Our system automatically loads your local device's active User-Agent string as a quick starting point.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">02</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Paste Custom Header</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">To analyze remote visitor issues, paste their specific browser string into the unparsed header input area.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">03</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Inspect Diagnostics</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Review the decomposed diagnostic cards showing Operating System, layout engines, DPR, and cookie states.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-indigo-500 block font-mono">04</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Download JSON Report</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Export your structured device profile by clicking 'Download JSON', saving the results cleanly to your desk.</p>
            </div>
          </div>
        </div>

        {/* Benefits & Use Cases & Real World Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="ua-benefits">
              Benefits & Key Use Cases
            </h3>
            <ul className="text-sm space-y-3.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Debugging Visual Layouts:</strong> Frontend engineers parse exact client strings to match rendering issues against known mobile browser engine versions.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Bot Detection:</strong> Security experts audit web server records to distinguish standard human visitors from custom web scraper bots.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-indigo-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Analytics Enrichment:</strong> Marketing coordinators analyze bulk client signatures to optimize design choices for the most common devices.
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="ua-comparison">
              Famous User-Agent Patterns
            </h3>
            <div className="rounded-2xl border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 p-5 space-y-3.5 font-mono text-xs text-slate-600 dark:text-slate-400">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Standard Google Chrome (Desktop Windows)</span>
                <pre className="text-[9.5px] leading-relaxed bg-white dark:bg-slate-900 border border-slate-105 dark:border-slate-850 p-2 rounded truncate max-w-full">
                  Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36
                </pre>
              </div>
              <div className="space-y-1 pt-2 border-t border-slate-150 dark:border-slate-850">
                <span className="text-[10px] font-bold text-[#10b981] uppercase tracking-wider">Apple Safari (iPhone iOS Mobile)</span>
                <pre className="text-[9.5px] leading-relaxed bg-white dark:bg-slate-900 border border-slate-105 dark:border-slate-850 p-2 rounded truncate max-w-full">
                  Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Common Mistakes & Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="ua-mistakes">
              Common Parsing Missteps
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mishandling user-agent parameters can lead to false platform classifications and broken web experiences:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-550 dark:text-slate-450 space-y-2">
              <li><strong>Rigid Substring Checking:</strong> Searching strictly for 'Safari' to match iOS platforms without realizing that Chrome's UA also contains 'Safari' tokens, misrouting visits.</li>
              <li><strong>Assuming Version Sequences:</strong> Writing naive parsing logic that assumes single-digit browser version sequences, failing to handle double-digit major versions properly.</li>
              <li><strong>Ignoring Client Hints:</strong> Designing new analytics systems without planning for User-Agent Client Hints integrations, which can make long-term tracking difficult.</li>
              <li><strong>Disabling Fallbacks:</strong> Blocking visitor browsers that report nonstandard user-agent headers, reducing accessibility.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="ua-best-practices">
              Industry User-Agent Best Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Feature Detecting first</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Prioritize modern JavaScript feature detection (e.g., `'serviceWorker' in navigator`) over legacy user-agent parsing checks for browser support.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Use Standard Parsers</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Integrate well-maintained, industry-standard parsing libraries to handle complex custom browser signatures accurately.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Safeguard Client Data</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">Avoid storing raw user-agent strings linked directly to full IP addresses inside public databases to respect privacy guidelines.</p>
              </div>
              <div className="p-4 bg-indigo-50/25 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Support Modern Hints</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Design backend microservices to support modern `Sec-CH-UA` headers, ensuring future-proof browser identification.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

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
