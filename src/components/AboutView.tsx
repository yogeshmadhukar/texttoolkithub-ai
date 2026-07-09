import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ChevronDown, 
  Heart, 
  Sparkles, 
  Terminal, 
  Code2, 
  Zap, 
  Database, 
  Activity, 
  Compass, 
  RefreshCw, 
  Eye, 
  ArrowRight,
  Award,
  Globe2,
  FileCode,
  BookOpen,
  MousePointerClick,
  Mail,
  User,
  Linkedin
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

interface StatCardProps {
  number: string;
  label: string;
  sub: string;
  icon: React.ReactNode;
}

interface CategoryCard {
  title: string;
  count: string;
  description: string;
  icon: React.ReactNode;
  items: string[];
}

interface AboutViewProps {
  onNavigate?: (page: string) => void;
}

export default function AboutView({ onNavigate }: AboutViewProps = {}) {
  // Simple state to handle individual FAQ items
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  // Interactive tab state for the Tool Categories showcase
  const [activeCategoryTab, setActiveCategoryTab] = useState<number>(0);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(target);
    }
  };

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Why Choose Grid Data
  const features: FeatureCard[] = [
    {
      title: "Browser-Based Processing",
      description: "Perform real-time computations entirely within your own local browser environment. Avoid the round-trip latency, bandwidth costs, and server failures inherent in standard cloud APIs.",
      icon: <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      badge: "On-Device"
    },
    {
      title: "Privacy First Architecture",
      description: "Our sandboxed framework ensures your raw inputs, credentials, or code snippets never leave your terminal. There are no background data leaks, no corporate mining, and no remote caching.",
      icon: <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      badge: "100% Sealed"
    },
    {
      title: "No Registration Required",
      description: "Unlock immediate premium utility access without signing up, entering credit cards, or tracking email subscriptions. Simply launch a tool and get work done in milliseconds.",
      icon: <MousePointerClick className="w-6 h-6 text-amber-600 dark:text-amber-400" />,
      badge: "Zero Commitment"
    },
    {
      title: "Enterprise Performance",
      description: "Utilize highly optimized parsing algorithms capable of processing multi-megabyte payloads in fractions of a second, with Instant FCP (First Contentful Paint) benchmarks.",
      icon: <Zap className="w-6 h-6 text-rose-600 dark:text-rose-400" />,
      badge: "Sub-Millisecond"
    },
    {
      title: "Mobile Friendly Layouts",
      description: "Every converter, calculator, parser, and builder is designed responsiveness-first. Access pristine tool interfaces seamlessly on multi-monitor workstations, tablets, or phones.",
      icon: <Globe2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      badge: "Universal"
    },
    {
      title: "Completely Free Access",
      description: "We are committed to maintaining a comprehensive baseline toolkit completely free of charge. No hidden fees, paywalls, or feature limits on core productivity calculators.",
      icon: <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />,
      badge: "Forever Free"
    }
  ];

  // Tool Categories Data
  const categories: CategoryCard[] = [
    {
      title: "Text & Document Tools",
      count: "15 Active",
      description: "High-throughput text sanitization, case alteration, duplicate filter, and comprehensive layout tools built for editors and developers.",
      icon: <BookOpen className="w-5 h-5" />,
      items: ["Word & Character Counter", "Case Converter Pro", "Sentence Extractor", "Format Sanitizer", "Remove Duplicate/Empty Lines", "Lorem Ipsum Suite"]
    },
    {
      title: "Developer & Sandbox Utilities",
      count: "12 Active",
      description: "Secure decoding, sandbox testing, token interpretation, and compiler utilities targeting daily systems engineering tasks.",
      icon: <Terminal className="w-5 h-5" />,
      items: ["JWT Token Decoder", "Regex Sandbox Tester", "TypeScript Interface Converter", "CSS Beautifier/Minifier", "Base64 & Hex Encoder", "JSON Schema Validator"]
    },
    {
      title: "SEO & Copywriters Suite",
      count: "8 Active",
      description: "Meta tag creators, keywords analysis density, layout slugs makers, and readability performance trackers to boost digital search positions.",
      icon: <Sparkles className="w-5 h-5" />,
      items: ["Slug Generator", "Keyword Density Analyzer", "Flesch Readability Grader", "HTML Meta Tag Builder", "Sitemap Reference Planner"]
    },
    {
      title: "Productivity & Encoding Utilities",
      count: "16 Active",
      description: "Instant data structures converters, standard format transformers, timestamp translation widgets, and high-performance visual utilities.",
      icon: <Layers className="w-5 h-5" />,
      items: ["CSV-JSON Bi-directional Converter", "YAML-JSON Formatter", "Unix Epoch Timestamp Converter", "Number Base Converter (Hex/Oct/Dec)", "QR Vector Generator"]
    }
  ];

  // FAQ data (10 professional questions)
  const faqData: FAQItem[] = [
    {
      id: "faq-1",
      question: "Is my pasted content or file input sent to any remote servers?",
      answer: "No. TextToolkitHub operates under a strict offline-first architectural model. All manipulations, regex testing, parsing, minification, and encodings occur in-memory directly inside your browser cache. No raw string variables, code files, or binary uploads are ever transferred to a server or stored in a persistent remote database. Your information exists only within your active document viewport layer."
    },
    {
      id: "faq-2",
      question: "How does 100% on-device client processing protect company secrets?",
      answer: "Enterprise software teams often leak sensitive proprietary code, API endpoints, or user records to central server databases by using public copy-paste formatting websites. Because TextToolkitHub processes all computations securely locally on your local machine, sensitive keys or draft spreadsheets are never dispatched across public networks. This keeps your company completely aligned with ISO 27001, GDPR, and strict internal security policies."
    },
    {
      id: "faq-3",
      question: "Will the premium suite of tools ever require a paid subscription?",
      answer: "No. The standard core portfolio comprising our 56+ utilities—including formatting, converters, count tables, and dev tools—is, and will remain, 100% free to use. There are no plans to introduce mandatory registration, user thresholds, or artificial limitations on basic system functions. We may introduce premium cloud collaboration features in the future, but on-device local utilities remain public, unlimited, and free of paywalls."
    },
    {
      id: "faq-4",
      question: "Why should I choose on-device utilities rather than traditional server-side APIs?",
      answer: "On-device processing provides three critical advantages over server-side options: 1) Instantaneous metrics: bypassing network round-trip bottlenecks enables you to format heavy files in less than 5 milliseconds. 2) Secure isolated sandboxing: zero network data transit guarantees your intellectual property won't be collected or cataloged. 3) Perfect offline portability: our browser integrations work seamlessly without an active internet connection once loaded."
    },
    {
      id: "faq-5",
      question: "What web browsers and client platforms are officially certified?",
      answer: "TextToolkitHub is fully optimized and rigorously regression tested to support Chrome, Firefox, Safari, Edge, Opera, and chromium-based mobile viewports. We integrate modern ES6+ engine features and fully decoupled styling, meaning you can access responsive tools with equal accuracy on absolute top-tier desktop screens or mobile interfaces."
    },
    {
      id: "faq-6",
      question: "How reliable and accurate are the underlying code parsers?",
      answer: "Our developer utilities use industry-best standardized parsing libraries, WebAssembly bindings, and fully typed TypeScript algorithms. Tools such as our YAML/JSON Formatter, JSON Minifier, and Regex testers run standard diagnostic checkers to guarantee 100% syntax compliance, generating outcomes suitable for active production environments."
    },
    {
      id: "faq-7",
      question: "What is the long-term plan to expand the tool architecture?",
      answer: "We are actively executing our platform roadmap to scale TextToolkitHub from our current stable suite of 56+ active utilities up to an expansive ecosystem of over 200+ dedicated tools. Our next development cycles center on advanced cryptography analyzers, binary structures parsers, deep CSV validators, and richer accessibility performance builders."
    },
    {
      id: "faq-8",
      question: "Do you utilize cookies, tracking arrays, or record user behavior?",
      answer: "We do not deploy intrusive data-harvesting trackers or user fingerprinting scripts. We maintain lightweight, privacy-preserving, localized configurations using standard HTML5 sessionStorage (such as user visual dark/light mode preference) to sustain a consistent viewport experience and ensure seamless offline navigation. No PII (Personally Identifiable Information) is tracked or kept."
    },
    {
      id: "faq-9",
      question: "Can I use these tools in professional offline environments?",
      answer: "Yes, fully. Because we bundle and cache the core JavaScript client engines in a highly modern, static Single Page Application architecture, loaded sections continue to format, decode, converter, and calculate successfully even if your device loses its network connection entirely."
    },
    {
      id: "faq-10",
      question: "How can teams integrate these tools into their daily developer workflow?",
      answer: "TextToolkitHub is designed to be kept open in an adjacent browser tab as an on-demand virtual toolkit. Teams use it as a highly responsive, secure utility workspace to clear formatting anomalies, audit JWT tokens, run cron syntax validations, or assemble structured documents in privacy-regulated environments."
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 selection:bg-indigo-500/20">
      
      {/* Absolute Decorative Glow Orbs */}
      <div className="absolute top-12 left-10 w-96 h-96 bg-indigo-200/40 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 right-20 w-[30rem] h-[30rem] bg-emerald-100/30 dark:bg-emerald-950/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-1/3 w-[25rem] h-[25rem] bg-rose-100/30 dark:bg-rose-950/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Structural Wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* SECTION 1: HERO SECTION */}
        <header className="text-center mb-20 max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 py-1 px-4 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold font-sans uppercase tracking-widest rounded-full mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" /> 
            Enterprise-Grade Browser Sandbox
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-sans tracking-tight text-slate-950 dark:text-white"
            id="about-hero-title"
          >
            The Ultimate Privacy-Shielded <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 dark:from-indigo-400 dark:via-indigo-300 dark:to-emerald-400">
              Web Utility Workspace
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-6 leading-relaxed max-w-3xl mx-auto"
          >
            TextToolkitHub is engineered to serve as a fast, highly accessible standard for local text sanitization, encoding, parsing, and digital productivity calculations. Our mission is to democratize high-throughput digital workflows without ever tracking, logging, or commercializing client metadata.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <a 
              href="/" 
              onClick={(e) => handleLinkClick(e, 'home')}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 transition flex items-center gap-2"
              id="hero-ctx-btn"
            >
              Explore 56+ Tools <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="/security-faq" 
              onClick={(e) => handleLinkClick(e, 'security-faq')}
              className="px-6 py-3 bg-white dark:bg-slate-950/80 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-sm transition"
              id="hero-faq-btn"
            >
              Read Security FAQ
            </a>
          </motion.div>
        </header>

        {/* SECTION 7: PLATFORM STATISTICS */}
        <section className="mb-24">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl p-4 text-center shadow-xs">
              <span className="block text-2xl md:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-sans">56+</span>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">Active Tools</span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Online Now</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl p-4 text-center shadow-xs">
              <span className="block text-2xl md:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-sans">100%</span>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">On-Device</span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Local Storage</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl p-4 text-center shadow-xs">
              <span className="block text-2xl md:text-3xl font-extrabold text-rose-650 dark:text-rose-400 font-sans">0ms</span>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">API Latency</span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Instant Parse</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl p-4 text-center shadow-xs">
              <span className="block text-2xl md:text-3xl font-extrabold text-amber-600 dark:text-amber-400 font-sans">PWA</span>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">Optimized</span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Mobile-Ready</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl p-4 text-center shadow-xs">
              <span className="block text-2xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 font-sans">Zero</span>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">Tracking</span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">No Signups</span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl p-4 text-center shadow-xs">
              <span className="block text-2xl md:text-3xl font-extrabold text-indigo-500 dark:text-indigo-300 font-sans">200+</span>
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 mt-1 uppercase tracking-wider">Roadmap Goal</span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Ongoing Growth</span>
            </div>

          </div>
        </section>

        {/* SECTION 2: PLATFORM OVERVIEW & VALUE PROPOSITION */}
        <section className="mb-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold font-sans uppercase tracking-widest text-indigo-600 dark:text-indigo-400">01 / Comprehensive Directory</span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-2 mb-6 font-sans">
              Revisiting the Paradigm of Internet Tools
            </h2>
            <div className="space-y-4 text-slate-600 dark:text-slate-350 leading-relaxed">
              <p>
                In the modern developer ecosystem, simple formatting tasks—such as prettifying a JSON tree, converting YAML columns, extracting strings, calculating Unix durations, or decoding Base64 keys—should not require risking confidential customer data across public networks. 
              </p>
              <p>
                TextToolkitHub provides immediate, high-fidelity browser-based alternatives. Built upon a unified sandboxed pipeline and modern memory isolation hooks, every formatting action remains 100% inside your current browser context. 
              </p>
              <p>
                We remove unnecessary corporate telemetry, endless loading headers, cookie consent fields, and distracting paywalls. What you get is an elite workspace designed to process raw material with zero delay and deep privacy assurance.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Lightweight Execution</h4>
                  <p className="text-xs text-slate-500 mt-1">Pre-cached modules load in milliseconds with pristine visual smoothness.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">WCAG 2.1 Compliant</h4>
                  <p className="text-xs text-slate-500 mt-1">Sufficient contrasts, clear focus indicators, structured aria configurations.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 bg-gradient-to-br from-slate-100 to-white dark:from-slate-950 dark:to-slate-900/50 shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Terminal className="w-4.5 h-4.5 text-indigo-500" /> Sandboxed Execution Engine
            </h3>
            
            <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-850 overflow-x-auto text-left">
              <div><span className="text-indigo-400">const</span> pipeline = TextToolkitHub.initSession();</div>
              <div><span className="text-emerald-400">// Secure isolated process:</span></div>
              <div>pipeline.setSecurityPolicy(<span className="text-amber-300">"isolate-client-memory"</span>);</div>
              <div>pipeline.setNetworkConfig(<span className="text-amber-300">"zero-data-transfer"</span>);</div>
              <div className="text-slate-600">// Process paste buffer:</div>
              <div><span className="text-cyan-400">const</span> result = pipeline.parseTextContent(buffer);</div>
              <div>console.log(result.metrics.latency); <span className="text-emerald-500">// output: 0.14ms</span></div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-normal">
              Because TextToolkitHub leverages local JavaScript execution streams and typed data buffers, memory is immediately released upon viewport closure or browser refreshes. No files are retained.
            </p>
          </div>
        </section>

        {/* SECTION 3: VISION */}
        <section className="mb-24 bg-indigo-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-indigo-900/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-800/60 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold tracking-widest uppercase text-indigo-300">02 / Scaling Future Horizons</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans mt-2 mb-6 tracking-tight">
              Our Vision: Building a 200+ Private Tool Ecosystem
            </h2>
            <p className="text-indigo-100 text-base leading-relaxed mb-6">
              Our vision is simple yet vastly ambitious: we are actively building the world's most stable, reliable, and privacy-shielded web-utility resource. We started with essential text formatting, but are expanding dynamically week-by-week.
            </p>
            <p className="text-indigo-200 text-sm leading-relaxed mb-8">
              Whether you are a developer formatting raw schema, a writer counting detailed character densities, a marketer building SEO slugs, an accountant translating Base64 formats, or a student compiling complex logs, TextToolkitHub guarantees a consistent, baseline utility structure. No barriers, no corporate collection—just raw utility.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-indigo-800">
              <div>
                <span className="block text-2xl font-bold text-emerald-400">Developers</span>
                <span className="block text-xs text-indigo-200 mt-1">Audit tokens, reformat JSON tables, map JSON objects.</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-amber-300">Writers & Editors</span>
                <span className="block text-xs text-indigo-200 mt-1">Count syllables, evaluate readability formulas, clear double blank rows.</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-cyan-300">Businesses</span>
                <span className="block text-xs text-indigo-200 mt-1">Format localized raw documents safely under data compliance standards.</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: WHY CHOOSE TEXTTOOLKITHUB (GRID) */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <span className="text-xs font-bold font-sans uppercase tracking-widest text-indigo-600 dark:text-indigo-400">03 / Platform Pillars</span>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white mt-1 mb-4 font-sans">
              Designed for Speed, Security, and Trust
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Every detail of our workspace has been crafted around the workflow requirements of security-conscious specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div 
                key={idx}
                className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between group hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-2xl w-fit group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/20 group-hover:border-indigo-150 transition">
                      {feat.icon}
                    </div>
                    {feat.badge && (
                      <span className="text-[10px] font-bold py-0.5 px-2 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-md uppercase tracking-wider">
                        {feat.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white font-sans text-base mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: PRIVACY & SECURITY COMMITMENT */}
        <section className="mb-24 border border-slate-200 dark:border-slate-800 bg-linear-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-indigo-600" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <span className="text-xs font-bold font-sans uppercase tracking-widest text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-500" /> Data Privacy Blueprint & Isolated Architecture
              </span>
              <h2 className="text-3xl font-bold text-slate-950 dark:text-white mt-2 mb-6 font-sans">
                Our Absolute Security Commitment
              </h2>
              <div className="space-y-4 text-xs md:text-sm text-slate-500 dark:text-slate-450 leading-relaxed">
                <p>
                  At TextToolkitHub, privacy is not a feature setting—it is the foundational pillar of our existence. Traditional internet utilities often load your screens with telemetry scripts that inspect raw values, monitor keyboard entry speeds, or record formatting histories to cloud files to optimize advertisement profiles.
                </p>
                <p>
                  We run a zero-persistence framework. When you parse a string, convert raw Unix epochs, or check keyword density, all transformations occur strictly on your client CPU.
                </p>
                <p>
                  Our codebase undergoes strict architectural hygiene checks to prevent server-side integrations, payload transmissions, or cookie leakage. Your text workspace remains completely secure, private, and localized.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-6 mt-8">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Local Processing Only
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Zero Cookie Tracking
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sandboxed Browser Memory
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center relative flex flex-col justify-center items-center">
              <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-white font-bold text-base font-sans">ISO-Standard Security</h4>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                We employ no database stores or backdoors, offering the ultimate protection for safe data processing.
              </p>
              <span className="mt-4 text-[9px] uppercase tracking-wider font-bold py-1 px-2.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded-full">
                Active Client Lock Active
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 6: TOOL ECOSYSTEM SHOWCASE WITH TABS */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <span className="text-xs font-bold font-sans uppercase tracking-widest text-indigo-600 dark:text-indigo-400">04 / Unified Categories</span>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-1 mb-4 font-sans">
              Our Expanding Multi-Core Ecosystem
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              We group our 56+ active tools into cohesive structural blocks, allowing specialists to move from converters to encoders inside a clean interface.
            </p>
          </div>

          {/* Interactive tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategoryTab(idx)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition duration-150 ${
                  activeCategoryTab === idx
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                id={`cat-tab-${idx}`}
              >
                {cat.icon}
                {cat.title}
              </button>
            ))}
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-150 dark:border-slate-900">
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                  {categories[activeCategoryTab].count}
                </span>
                <h3 className="text-2xl font-bold text-slate-950 dark:text-white font-sans mt-1">
                  {categories[activeCategoryTab].title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl">
                  {categories[activeCategoryTab].description}
                </p>
              </div>
              <div className="py-2.5 px-4 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 rounded-2xl text-xs font-bold shrink-0 self-start md:self-center">
                Fully sandboxed client rendering
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                Core Module Highlights:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categories[activeCategoryTab].items.map((item, itemIdx) => (
                  <div 
                    key={itemIdx}
                    className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-150 dark:border-slate-850 rounded-xl"
                  >
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-350">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: QUALITY STANDARDS */}
        <section className="mb-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 shadow-xs text-center lg:text-left">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mx-auto lg:mx-0 mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white font-sans text-lg">Performance Benchmarks</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-2 leading-relaxed">
              We compile code to optimize execution vectors, achieving a Lighthouse Core Web Vitals score of 100/100 for First Contentful Paint. Payloads process in-memory seamlessly.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 shadow-xs text-center lg:text-left">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl w-fit mx-auto lg:mx-0 mb-4">
              <FileCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white font-sans text-lg font-display">Rigorous Code Testing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-2 leading-relaxed">
              Every formatting library, regular expression sandbox, and mathematical converter goes through extensive automated regression check structures, ensuring accurate outcomes.
            </p>
          </div>

          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 shadow-xs text-center lg:text-left">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl w-fit mx-auto lg:mx-0 mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white font-sans text-lg">Accessibility Compliant</h3>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-2 leading-relaxed">
              TextToolkitHub supports fully responsive responsive viewports, sufficient contrast ratios, and structured layout landmarks, adhering strictly to WCAG 2.1 specifications.
            </p>
          </div>

        </section>

        {/* SECTION 9: ROADMAP SECTION (TIMELINE) */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <span className="text-xs font-bold font-sans uppercase tracking-widest text-indigo-600 dark:text-indigo-400">05 / Projected Timelines</span>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white mt-1 mb-4 font-sans">
              Our Platform Growth Roadmap
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              We continue to iterate quickly, expanding visual categories and implementing deep features under our offline sandbox model.
            </p>
          </div>

          <div className="relative border-l border-slate-200 dark:border-slate-800 ml-4 md:ml-8 space-y-12">
            
            {/* Phase 1 */}
            <div className="relative pl-6 md:pl-10">
              <div className="absolute top-1 -left-[9px] w-4.5 h-4.5 rounded-full bg-indigo-600 border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center" />
              <div>
                <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Phase 1: Completed
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-2">
                  Launch Visual Core Utilities (56+ Tools)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 max-w-2xl leading-relaxed">
                  Establish client-first environment infrastructure. Incorporate robust visual components for characters scanning, text case adjustments, URL decoder systems, JWT audits, formatting parsers, duplicate cleaners, and light/dark theme models.
                </p>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-6 md:pl-10">
              <div className="absolute top-1 -left-[9px] w-4.5 h-4.5 rounded-full bg-emerald-500 border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center animate-pulse" />
              <div>
                <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Phase 2: Active Cycle
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-2">
                  SaaS & Professional Expansion (100+ Tools)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 max-w-2xl leading-relaxed">
                  Extend database transformations, file-based conversions directly in-browser, expand color palette accessibility checklists, implement custom offline sitemap compilers, and build code schema generators.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-6 md:pl-10">
              <div className="absolute top-1 -left-[9px] w-4.5 h-4.5 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-slate-50 dark:border-slate-900" />
              <div>
                <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Phase 3: Upcoming
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-2">
                  Advanced Security & Crypto Suites (150+ Tools)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 max-w-2xl leading-relaxed">
                  Introduce robust visual sandboxed code diff tools, sub-resource integrity generators, cryptographic cert hash parsing checkers, detailed secure key generators, and secure base binary converters.
                </p>
              </div>
            </div>

            {/* Phase 4 */}
            <div className="relative pl-6 md:pl-10">
              <div className="absolute top-1 -left-[9px] w-4.5 h-4.5 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-slate-50 dark:border-slate-900" />
              <div>
                <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  Phase 4: Design Goal
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans mt-2">
                  Ultimate Unified Utility Ecosystem (200+ Tools)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-450 mt-1.5 max-w-2xl leading-relaxed">
                  Achieve complete coverage across standard design formats, code transformation syntaxes, mathematical structures, developer formatting presets, and localized developer sandboxes.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 13: PLATFORM FOUNDER & TECHNICAL LEADERSHIP */}
        <section className="mb-24" id="founder-section">
          <div className="text-center mb-16">
            <span className="text-xs font-bold font-sans uppercase tracking-widest text-indigo-600 dark:text-indigo-400">08 / Leadership & Ownership</span>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white mt-1 mb-4 font-sans">
              The Mind Behind TextToolkitHub
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              TextToolkitHub is an independent, founder-owned platform dedicated to developer utilities, linguistics computations, and absolute data privacy.
            </p>
          </div>

          <div className="max-w-4xl mx-auto border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-10 shadow-xs flex flex-col md:flex-row gap-8 items-center md:items-start transition duration-200 hover:border-slate-300 dark:hover:border-slate-700">
            {/* Visual Avatar Card */}
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-indigo-550 to-indigo-600 flex flex-col items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-500/10 border-4 border-white dark:border-slate-900 relative group overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent)]" />
              <User className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-100 group-hover:scale-105 transition-transform duration-200" />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold bg-slate-950/40 px-2 py-0.5 rounded-full text-indigo-100 backdrop-blur-xs">
                  FOUNDER
                </span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-sans">
                    Yogesh Kumar Madhukar
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5 font-sans">
                    Founder, Software Developer & Editorial Director
                  </p>
                </div>
                {/* Social Connect buttons */}
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 sm:mt-0">
                  <a
                    href="mailto:texttoolkithub@gmail.com"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                    title="Contact Yogesh Kumar Madhukar"
                    aria-label="Contact Yogesh Kumar Madhukar"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/texttoolkithub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-50 hover:bg-[#0077b5]/10 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 hover:text-[#0077b5] transition"
                    title="Connect on LinkedIn"
                    aria-label="Connect on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Biography content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                <p>
                  Yogesh Kumar Madhukar is the founder of TextToolkitHub, an independent software developer, technical writer, and digital publishing entrepreneur focused on building fast, privacy-first web applications.
                </p>
                <p>
                  He created TextToolkitHub with a simple goal: to provide writers, developers, students, marketers, and professionals with reliable browser-based utilities that process data entirely on the user’s device. Every tool on the platform is designed to perform its operations locally, helping users work with sensitive text and documents without sending their data to external servers whenever technically possible.
                </p>
                <p>
                  As the platform’s Editorial Director, Yogesh researches, writes, and reviews educational content covering text processing, SEO, readability, encoding, formatting, and developer workflows. His focus is on publishing practical, easy-to-understand resources that help users solve real-world problems while maintaining technical accuracy.
                </p>
                <p>
                  TextToolkitHub continues to evolve with a commitment to privacy, performance, accessibility, and high-quality educational content alongside professional productivity tools.
                </p>
              </div>

              {/* Professional Credentials Badge bar */}
              <div className="mt-6 flex flex-wrap gap-2.5 justify-center md:justify-start">
                <span className="text-[10px] font-bold tracking-wider py-1 px-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-850 rounded-lg">
                  ✓ Verified Website Owner
                </span>
                <span className="text-[10px] font-bold tracking-wider py-1 px-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-850 rounded-lg">
                  ✓ Founder of TextToolkitHub
                </span>
                <span className="text-[10px] font-bold tracking-wider py-1 px-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-850 rounded-lg">
                  ✓ Independent Software Developer
                </span>
                <span className="text-[10px] font-bold tracking-wider py-1 px-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-850 rounded-lg">
                  ✓ Technical Writer & Digital Publisher
                </span>
                <span className="text-[10px] font-bold tracking-wider py-1 px-2.5 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-850 rounded-lg">
                  ✓ Privacy-First Web Application Advocate
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 14: EDITORIAL POLICY & CONTENT INTEGRITY STANDARDS */}
        <section className="mb-24" id="editorial-policy-section">
          <div className="text-center mb-16">
            <span className="text-xs font-bold font-sans uppercase tracking-widest text-indigo-600 dark:text-indigo-400">09 / Content Standards</span>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white mt-1 mb-4 font-sans">
              Editorial Policy &amp; Integrity Standards
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              We hold our software and educational publications to the highest standards of accuracy, transparency, and clinical technical utility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Column 1: Core Content Pillars */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-indigo-500" /> Content Accuracy &amp; Sourcing
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  The educational guides on TextToolkitHub exist to provide clear, actionable instructions on systems engineering, encoding standards, and technical writing rules. To avoid "low-value content" or inaccurate summaries, we enforce rigorous sourcing guidelines:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong>Primary Sourcing:</strong> All guides reference official technical documentation—such as RFCs, W3C standards, Unicode charts, and the WCAG Guidelines—guaranteeing academic-level authority.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong>Technical Sandboxing:</strong> Every single formula (e.g. Flesch Readability) and formatting blueprint is tested in clean browser environments before writing.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                    <span><strong>Zero Generative Padding:</strong> Our editorial material is fully original, high-value content drafted specifically to answer actual, practical developer and writing challenges.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Column 2: Peer Review & Lifecycle Updates */}
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-emerald-500" /> Fact-Checking &amp; Update Cadence
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Ensuring that tool descriptions and educational guidelines remain up-to-date with current browser parameters and security compliance is essential to our reputation as an expert reference platform:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Peer Review Process:</strong> All technical updates and guides undergo rigorous peer reviews by security engineers and professional copywriters before launch to eliminate errors.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Continuous Iteration:</strong> We audit the functional math, character analysis frameworks, and cryptographic hash suites quarterly to maintain compatibility with new specs.</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                    <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Reader Correction channel:</strong> If our readers detect an outdated specification or code bug, they can reach the Chief Editor directly at <a href="mailto:texttoolkithub@gmail.com" className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">texttoolkithub@gmail.com</a> for immediate auditing.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 11: TRUST & TRANSPARENCY SEGMENT */}
        <section className="mb-24 bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center md:text-left mb-8 pb-8 border-b border-slate-800">
            <span className="text-xs font-bold font-sans uppercase tracking-widest text-indigo-400">06 / Full Visibility Policy</span>
            <h2 className="text-3xl font-bold font-sans mt-1">Trust & Transparency Audit</h2>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              We believe in total disclosure. Here is precisely how TextToolkitHub treats user content variables and analytical frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/50">
              <div className="p-2 w-fit bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Data actively processed</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Raw pasted strings, uploaded text tables, JSON scripts, Base64 keys, and regex search values. Everything calculated loads temporarily in transient javascript memory.
              </p>
            </div>

            <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/50">
              <div className="p-2 w-fit bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl mb-3">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 text-sm">Data never recorded or stored</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Raw text scripts, user keys, intellectual logs, and paste history buffer items. There are absolutely no remote server logs, telemetry writes, or trace storage records.
              </p>
            </div>

            <div className="p-5 border border-slate-800 rounded-2xl bg-slate-900/50">
              <div className="p-2 w-fit bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-100 text-sm">How you remain in command</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Clear states instantly using our native 'Reset' button interfaces, or simply reload your tab. Closing the viewport immediately releases memory allocations.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 10: FREQUENTLY ASKED QUESTIONS (ACCORDION - 10 PROFESSIONAL FAQS) */}
        <section className="mb-24" id="platform-faq">
          <div className="text-center mb-16">
            <span className="text-xs font-bold font-sans uppercase tracking-widest text-indigo-600 dark:text-indigo-400">07 / Knowledge Hub</span>
            <h2 className="text-3xl font-bold text-slate-950 dark:text-white mt-1 mb-4 font-sans">
              Frequently Asked Security Questions
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
              Find transparent, in-depth architectural answers regarding security, capabilities, and future ecosystem development.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqData.map((faq) => {
              const isExpanded = expandedFaq === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl overflow-hidden transition-all duration-150 shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition focus:outline-none"
                    id={`faq-btn-${faq.id}`}
                  >
                    <span className="font-sans text-sm md:text-base pr-4">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                      >
                        <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-900 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/50 dark:bg-slate-950/20">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 12: CLOSING CTA SECTION */}
        <section className="relative rounded-3xl p-8 md:p-16 border border-slate-200 dark:border-slate-800 bg-linear-to-br from-indigo-600 to-indigo-700 text-white text-center shadow-2xl shadow-indigo-600/10 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent)] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-bold py-1 px-3 bg-indigo-500 border border-indigo-400 rounded-full tracking-widest text-indigo-100">
              Instant Secure Tools Terminal
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-sans mt-4 mb-6 leading-tight">
              Unlock the Power of Privacy-Shielded Operations
            </h2>
            <p className="text-indigo-100 text-sm md:text-base leading-relaxed mb-8">
              Join thousands of systems engineers, copywriters, researchers, and specialists who trust daily text configurations to TextToolkitHub. 100% on-device, fast, and free.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/" 
                onClick={(e) => handleLinkClick(e, 'home')}
                className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-indigo-700 dark:text-indigo-400 rounded-xl font-bold text-sm transition shadow-md flex items-center justify-center gap-2"
                id="cta-directory-link"
              >
                Go to Homepage Directory <ArrowRight className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </a>
              <a 
                href="/word-counter" 
                onClick={(e) => handleLinkClick(e, 'word-counter')}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-100 border border-indigo-400/30 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
                id="cta-analyzer-link"
              >
                Launch Words Counter
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
