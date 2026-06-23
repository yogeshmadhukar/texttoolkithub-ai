import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Lock, 
  ServerCrash, 
  EyeOff, 
  Check, 
  Search, 
  ArrowLeft,
  ChevronDown,
  Info,
  Server,
  Globe,
  Database,
  Cpu
} from 'lucide-react';

interface SecurityFaqItem {
  id: string;
  category: 'data' | 'compliance' | 'architecture' | 'privacy';
  question: string;
  answer: React.ReactNode;
}

interface SecurityFaqViewProps {
  onNavigateHome?: () => void;
  onNavigateToTool?: (id: string) => void;
}

export default function SecurityFaqView({ onNavigateHome, onNavigateToTool }: SecurityFaqViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<string, boolean>>({
    'sec-1': true // Expand the first one by default for strong first impression of visual layout
  });
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'data', name: 'Data & Sovereignty' },
    { id: 'compliance', name: 'Compliance & Standards' },
    { id: 'architecture', name: 'Local Architecture' },
    { id: 'privacy', name: 'Privacy Checks' }
  ];

  const faqs: SecurityFaqItem[] = useMemo(() => [
    {
      id: 'sec-1',
      category: 'data',
      question: "Is my copy-pasted text, source code, or JSON schema sent to any remote server?",
      answer: (
        <div className="space-y-3">
          <p>
            <strong>Absolutely not.</strong> All string operations, regex matches, syntax conversions, minifications, and formatting computations are executed strictly client-side on your own device.
          </p>
          <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <ServerCrash className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>Technical Proof:</strong> You can completely disconnect your internet connection (Wi-Fi or ethernet cable) or toggle airplane mode on your device after loading TextToolkitHub, and the tools will continue to process your data flawlessly. No raw text packets or binary streams ever exit your local browser layer.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-2',
      category: 'data',
      question: "Does TextToolkitHub save my session data or formatting history in a persistent database?",
      answer: (
        <p>
          No session history or data inputs are stored on any persistent cloud servers. Raw input text, configurations, and outputs exist only inside transient JavaScript local engine memory (on-heap/off-heap allocations) within your browser tab. Closing or reloading the tab instantly purging all variables and frees allocated memory blocks, leaving zero physical or digital traces.
        </p>
      )
    },
    {
      id: 'sec-3',
      category: 'compliance',
      question: "How does 100% on-device client processing help my company comply with GDPR, HIPAA, and ISO 27001?",
      answer: (
        <div className="space-y-3">
          <p>
            When engineers or writers paste proprietary documentation, JWT credentials, or customer rosters into traditional online tools, they are technically transferring data to third-party central servers, violating enterprise security and compliance protocols.
          </p>
          <p>
            Because TextToolkitHub operates completely on-device, your organization maintains <strong>complete data sovereignty</strong>. There is no transfer of Personal Data (PII) or Protected Health Information (PHI) to remote endpoints. Therefore, using our client-side tools fully aligns with:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-450 mt-2">
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> GDPR Art. 5 (Data Protection by Design)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> HIPAA Security Rule (Administrative Safeguards)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> SOC 2 / ISO 27001 (Zero External Data Leakage)
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-500" /> CCPA (Strictly no data selling or sharing)
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'sec-4',
      category: 'architecture',
      question: "Why should my company trust TextToolkitHub over standard server-side APIs?",
      answer: (
        <div className="space-y-3.5">
          <p>
            Traditional server-side web tools introduce heavy security risks and critical network delays. TextToolkitHub addresses these issues inside an architectural sandbox:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-2">
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-150 dark:border-slate-800">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-indigo-500" /> No Network Latency
              </div>
              Bypassing server hops and round-trips lets your browser format and process larger string volumes under 4 milliseconds.
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-150 dark:border-slate-800">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-500" /> Direct Sandbox
              </div>
              Code runs strictly inside the standard browser heap containment, isolating inputs from server hijacking or sniffing.
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-150 dark:border-slate-800">
              <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-500" /> Immutable Bundles
              </div>
              The utilities are compiled securely via modern bundler systems with strict static checks to prevent unauthorized scripts injection.
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'sec-5',
      category: 'privacy',
      question: "Do you deploy intrusive advertisement cookies, server trackers, or commercial logs?",
      answer: (
        <div className="space-y-2">
          <p>
            No. We do not use user fingerprinting, or tracking arrays to monitor specific raw data payloads. We maintain high privacy-focused configurations and keep standard HTML5 storage values strictly bound to transient settings (like your light or dark theme choices) to provide a consistent and coherent visual environment.
          </p>
          <p>
            Any basic analytics configurations on the application are strictly optimized to comply with maximum GDPR privacy measures, operating under explicit consent.
          </p>
        </div>
      )
    },
    {
      id: 'sec-6',
      category: 'architecture',
      question: "Does TextToolkitHub support complete offline support?",
      answer: (
        <p>
          Yes, fully. We bundle and cache our core calculation engines utilizing highly optimized client-side structures. Once the website is initially loaded, you are free to format line breaks, parse JSON schemas, validate RegExp, evaluate readability formulas, and decode Base64 buffers smoothly—completely disconnected from the internet.
        </p>
      )
    },
    {
      id: 'sec-7',
      category: 'compliance',
      question: "Are underlying libraries and parsing engines audited?",
      answer: (
        <p>
          Our development team implements industry-standard utilities, strict TypeScript compilers, and secure static code analyzers. Standard checkers are verified regularly during deployment workflows to isolate modules, defend against potential cross-site scripting (XSS), and prevent downstream template injections.
        </p>
      )
    },
    {
      id: 'sec-8',
      category: 'privacy',
      question: "How can I permanently delete or clear the data inside my browser tab?",
      answer: (
        <p>
          You are always in absolute command of your data. To permanently purge text states, you can click the visual "Reset" or "Clear" buttons inside any tool workspace. Alternatively, closing the active tab or reloading your viewport completely clears the memory allocation in the system.
        </p>
      )
    }
  ], []);

  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (typeof faq.answer === 'string' && (faq.answer as string).toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || faq.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchQuery, filterCategory]);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200 selection:bg-indigo-500/20 py-12 md:py-20">
      
      {/* Decorative Orbs */}
      <div className="absolute top-10 left-12 w-80 h-80 bg-indigo-200/30 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-100/20 dark:bg-emerald-950/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-8">
          <button 
            onClick={() => onNavigateHome ? onNavigateHome() : window.history.back()}
            className="inline-flex items-center gap-2 text-xs font-bold font-sans uppercase tracking-wider text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition cursor-pointer"
            id="back-to-home-security"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Workspace
          </button>
        </div>

        {/* Hero Section */}
        <header className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[11px] font-bold font-sans uppercase tracking-wider rounded-full mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            Security & Data Sovereignty Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-sans tracking-tight text-slate-950 dark:text-white" id="security-faq-title">
            Security & Privacy FAQ
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed max-w-2xl">
            In-depth disclosure on local processing mechanics, code engine architecture, and compliance standards designed for enterprise engineers, creators, and analysts.
          </p>
        </header>

        {/* Security Pillars Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl w-fit">
              <Lock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm">100% Client-Side</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every operation runs entirely locally in-memory inside your standard web browser container.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl w-fit">
              <EyeOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm">Zero Data Collection</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No server database, no records retention, and zero transmission of sensitive string variables.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-sans font-bold text-slate-900 dark:text-white text-sm">Compliance Friendly</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Aligns instantly with standard requirements such as GDPR, HIPAA, and corporate ISO 27001 policies.
            </p>
          </div>
        </section>

        {/* Categories Tabs & Search */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 mb-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-sans font-bold text-xs transition shrink-0 cursor-pointer ${
                    filterCategory === cat.id 
                    ? 'bg-indigo-650 text-white dark:bg-indigo-600' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-350'
                  }`}
                  id={`cat-btn-${cat.id}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search input to keep page highly usable */}
            <div className="relative min-w-0 sm:max-w-xs flex-1">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search security questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pl-9 pr-4 py-2 rounded-xl transition font-sans outline-hidden text-slate-800 dark:text-slate-100"
                id="sec-search-input"
              />
            </div>

          </div>
        </div>

        {/* FAQs Accordion */}
        <section className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isExpanded = !!expandedFaqs[faq.id];
              return (
                <div 
                  key={faq.id}
                  className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition duration-150"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left font-sans font-bold text-slate-900 dark:text-white hover:bg-slate-50/50 dark:hover:bg-slate-900/50/20 transition cursor-pointer select-none"
                    id={`sec-faq-trigger-${faq.id}`}
                    aria-expanded={isExpanded}
                  >
                    <span className="text-sm md:text-base pr-4 leading-snug">{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-indigo-500' : ''}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15, ease: "easeInOut" }}
                      >
                        <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-900 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50/20 dark:bg-slate-950/10">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
              <Info className="w-8 h-8 text-slate-400 dark:text-slate-500 mx-auto mb-3" />
              <p className="text-sm font-sans font-bold text-slate-800 dark:text-slate-100">No matching security questions found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your category filter or search query.</p>
            </div>
          )}
        </section>

        {/* Informative Footer Box */}
        <section className="mt-12 bg-indigo-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg shadow-indigo-950/20">
          <div className="absolute top-0 right-0 w-48 h-48 bg-radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent) pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h3 className="font-sans font-bold text-lg">Need custom self-hosted solutions?</h3>
              <p className="text-xs text-indigo-200 leading-relaxed max-w-xl">
                We are exploring enterprise-grade on-premise desktop binaries (macOS / Windows / Linux ELF) and completely decoupled corporate intranet deployments under customized licenses. Talk to our staff directly.
              </p>
            </div>
            <button 
              onClick={() => onNavigateToTool ? onNavigateToTool('contact') : undefined}
              className="px-5 py-3 bg-white hover:bg-slate-100 text-slate-900 dark:text-slate-900 hover:scale-102 active:scale-98 rounded-xl font-sans font-extrabold text-xs shrink-0 shadow-md transition-all duration-150 border border-transparent cursor-pointer relative z-50 inline-flex items-center justify-center min-w-[120px]"
              id="security-action-contact"
            >
              Contact Team
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
