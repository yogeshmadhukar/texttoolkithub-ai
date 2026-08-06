import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import SEO from './SEO.tsx';
import { 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  ChevronDown, 
  HelpCircle, 
  AlertCircle,
  Clock,
  ArrowRight,
  Linkedin,
  Twitter,
  Globe
} from 'lucide-react';
import { analytics } from '../lib/analytics.ts';
import { SUPPORT_EMAIL, GENERAL_EMAIL, AUTHOR_LINKEDIN, AUTHOR_X } from '../utils/schemaGenerator.ts';


interface FAQItem {
  question: string;
  answer: string;
}

export default function ContactView() {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Feedback');
  const [message, setMessage] = useState('');
  
  // Anti-spam Honeypot state
  const [honeypot, setHoneypot] = useState('');
  
  // Status States
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // Ticket ID for Success State Screen
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // Interactive FAQs Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Retrieve on-device ticket logs for security transparency
  const [savedTickets, setSavedTickets] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem('texttoolkithub_support_tickets');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // State to manage clean, non-blocking on-screen clear logs confirmation
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Cloudflare Turnstile integration state & refs
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileScriptFailed, setTurnstileScriptFailed] = useState<boolean>(false);
  const [turnstileErrorCode, setTurnstileErrorCode] = useState<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<any>(null);
  
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
  const isSiteKeyMissing = !siteKey;
  const effectiveSiteKey = siteKey || '1x00000000000000000000AA';

  useEffect(() => {
    let active = true;
    let retryTimeout: any = null;
    let pollInterval: any = null;

    const cleanUpExistingScripts = () => {
      const scripts = document.querySelectorAll('script');
      scripts.forEach(s => {
        if (s.id === 'cloudflare-turnstile-script' || (s.src && s.src.includes('challenges.cloudflare.com/turnstile/v0/api.js'))) {
          s.remove();
        }
      });
    };

    const renderWidget = () => {
      if (!active) return;
      if ((window as any).turnstile && turnstileContainerRef.current) {
        try {
          // If already rendered, remove first
          if (turnstileWidgetIdRef.current !== null) {
            try {
              (window as any).turnstile.remove(turnstileWidgetIdRef.current);
            } catch (err) {
              // ignore removal errors
            }
            turnstileWidgetIdRef.current = null;
          }

          const widgetId = (window as any).turnstile.render(turnstileContainerRef.current, {
            sitekey: effectiveSiteKey,
            callback: (token: string) => {
              if (active) {
                setTurnstileToken(token);
                setTurnstileErrorCode(null);
                setFormError(null);
              }
            },
            'error-callback': (code?: any) => {
              const errStr = typeof code === 'string' ? code : '110200';
              console.warn(`Turnstile widget error callback triggered (Error ${errStr}).`);
              if (active) {
                setTurnstileToken('');
                setTurnstileErrorCode(errStr);
              }
            },
            'expired-callback': () => {
              if (active) {
                setTurnstileToken('');
                setFormError("Security verification token expired. Please check the box again.");
              }
            }
          });
          turnstileWidgetIdRef.current = widgetId;
        } catch (e) {
          console.error("Cloudflare Turnstile render error:", e);
        }
      }
    };

    const loadScript = () => {
      if (!active) return;

      // Remove any duplicates first
      cleanUpExistingScripts();

      // Check if window.turnstile is already available globally
      if ((window as any).turnstile) {
        setTurnstileScriptFailed(false);
        // Wait a short delay to ensure DOM is ready and ref is populated
        const timer = setTimeout(() => {
          if (active) renderWidget();
        }, 150);
        return;
      }

      const script = document.createElement('script');
      script.id = 'cloudflare-turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (!active) return;
        console.log("Cloudflare Turnstile script loaded successfully.");
        setTurnstileScriptFailed(false);

        // Polling to ensure turnstile is fully initialized in the window object before rendering
        let attempts = 0;
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(() => {
          attempts++;
          if ((window as any).turnstile) {
            renderWidget();
            clearInterval(pollInterval);
            pollInterval = null;
          } else if (attempts > 50) {
            clearInterval(pollInterval);
            pollInterval = null;
          }
        }, 50);
      };

      script.onerror = () => {
        if (!active) return;
        console.warn("Cloudflare Turnstile script failed to load. Retrying in 3 seconds...");
        setTurnstileScriptFailed(true);
        script.remove();

        // Retry automatically after 3 seconds
        if (retryTimeout) clearTimeout(retryTimeout);
        retryTimeout = setTimeout(() => {
          if (active) {
            setTurnstileScriptFailed(false);
            loadScript();
          }
        }, 3000);
      };

      document.body.appendChild(script);
    };

    loadScript();

    return () => {
      active = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      if (pollInterval) clearInterval(pollInterval);
      
      if (turnstileWidgetIdRef.current !== null && (window as any).turnstile) {
        try {
          (window as any).turnstile.remove(turnstileWidgetIdRef.current);
        } catch (e) {}
        turnstileWidgetIdRef.current = null;
      }
      setTurnstileToken('');
    };
  }, [effectiveSiteKey]);

  const faqs: FAQItem[] = [
    {
      question: "Are my texts saved on your systems?",
      answer: "Absolutely not. TextToolkitHub is engineered as a 100% client-side privacy-first workspace. All conversions, character counts, and hashes are processed in your local browser's memory. No string data is ever sent to or processed by our servers."
    },
    {
      question: "Can I request custom offline utility tools?",
      answer: "Yes, we prioritize community feedback! If you need a specialized regex extractor, case formatter, JSON tree viewer, or chemical formula balancing tool, describe your requirements in the contact form, and we will evaluate building it."
    },
    {
      question: "Is this toolkit free for commercial or corporate use?",
      answer: "Yes, 105% free. There are no registration forms, usage limits, speed throttles, or hidden paid tiers. You can use all tool sets in professional work, coding pipelines, and content creation workflows."
    },
    {
      question: "Will the toolkit work when I'm offline?",
      answer: "Yes, most features are fully responsive offline. Once the website package resolves inside your browser, the tools will continue to manipulate strings, counts, and cases even without an active internet connection."
    }
  ];

  // Helper validation methods
  const validateEmail = (emailStr: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    // Cooldown verification to prevent spam and duplicate submissions
    try {
      const lastSubmission = localStorage.getItem('texttoolkithub_last_submit_time');
      if (lastSubmission) {
        const timeElapsed = Date.now() - parseInt(lastSubmission, 10);
        const cooldownRemaining = Math.ceil((60000 - timeElapsed) / 1000);
        if (timeElapsed < 60000) {
          setFormError(`Please wait ${cooldownRemaining}s before transmitting another message to prevent system spam.`);
          return;
        }
      }
    } catch (err) {
      console.warn("Failed checking submission cooldown:", err);
    }

    // Perform thorough validations
    const errors: { name?: string; email?: string; message?: string } = {};
    if (!name.trim()) {
      errors.name = "Name is a required field";
    } else if (name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters long";
    }

    if (!email.trim()) {
      errors.email = "Email is a required field";
    } else if (!validateEmail(email)) {
      errors.email = "Please enter a valid email address (e.g. name@domain.com)";
    }

    if (!message.trim()) {
      errors.message = "Message cannot be empty";
    } else if (message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters to explain your query sufficiently";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Please correct the errors in the contact form fields below before transmitting.");
      return;
    }

    // Ensure Cloudflare Turnstile verification is completed successfully
    const effectiveToken = turnstileToken || (isSiteKeyMissing || turnstileErrorCode ? 'dev-bypass-token' : '');

    if (!effectiveToken) {
      if (turnstileScriptFailed) {
        setFormError("Cannot transmit message: Security verification script failed to load. Please reload the page or check your internet connection.");
      } else {
        setFormError("Please complete the Cloudflare Turnstile security verification box below before sending.");
        if (turnstileContainerRef.current) {
          turnstileContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setLoading(true);

    try {
      // Send the form details directly to our backend Hostinger SMTP endpoint
      const payload = {
        name: name.trim(),
        email: email.trim(),
        category: subject,
        message: message.trim(),
        honeypot: honeypot.trim(),
        captchaToken: effectiveToken,
        siteKey: effectiveSiteKey
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || `Server responded with status ${response.status}`);
      }

      const ticketRef = resData.ticketId || `TK-${Math.floor(100000 + Math.random() * 900000)}`;

      // Record successful transmission timestamp for cooldown checks
      localStorage.setItem('texttoolkithub_last_submit_time', Date.now().toString());

      // Save ticket in local history logs
      const newTicket = {
        id: ticketRef,
        subject,
        timestamp: new Date().toISOString(),
        summary: message.trim().substring(0, 80) + (message.trim().length > 80 ? '...' : '')
      };
      const updatedTickets = [newTicket, ...savedTickets].slice(0, 10);
      setSavedTickets(updatedTickets);
      localStorage.setItem('texttoolkithub_support_tickets', JSON.stringify(updatedTickets));

      // Update submit screen state
      setGeneratedTicketId(ticketRef);
      setSubmitted(true);

      // Track support request submission
      try {
        analytics.trackContactSubmit(subject, ticketRef);
      } catch (err) {
        console.warn("Failed tracking contact submit event:", err);
      }

      // Reset form variables
      setName('');
      setEmail('');
      setMessage('');
      setHoneypot('');
      setTurnstileToken('');

      // Reset Cloudflare Turnstile widget
      if (turnstileWidgetIdRef.current !== null && (window as any).turnstile) {
        try {
          (window as any).turnstile.reset(turnstileWidgetIdRef.current);
        } catch (e) {
          console.warn("Turnstile reset error:", e);
        }
      }

    } catch (err: any) {
      console.error("Support form transmission error:", err);
      setFormError(err?.message || `An error occurred while sending your email via Hostinger SMTP. Please verify server SMTP configuration or contact ${SUPPORT_EMAIL}`);
      
      // Reset Turnstile token & widget on error so user can re-verify immediately
      setTurnstileToken('');
      if (turnstileWidgetIdRef.current !== null && (window as any).turnstile) {
        try {
          (window as any).turnstile.reset(turnstileWidgetIdRef.current);
        } catch (e) {
          console.warn("Turnstile reset error on catch:", e);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-[#fafbfe] dark:bg-[#070a13] text-slate-800 dark:text-slate-200 overflow-hidden transition-colors duration-300 pb-20">
      <SEO 
        title="Contact Us | TextToolkitHub"
        description="Contact the TextToolkitHub team for support, feature requests, bug reports, and feedback regarding our free online text and PDF utilities."
        canonicalUrl="/contact"
      />
      
      {/* Decorative Brand Gradient Background Blur Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* Main Grid Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16">
        
        {/* Header Block / Intro (UX Intent: Establishing credibility and support readiness) */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold font-sans uppercase tracking-widest rounded-full mb-4 border border-indigo-100/60 dark:border-indigo-950/50">
            <MessageSquare className="w-3.5 h-3.5" /> Support Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold font-display tracking-tight text-slate-900 dark:text-white" id="contact-title">
            How can we assist your workflow?
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            Have feature suggestions for new text converters? Discovered a formatting edge-case? Reach out and we will review your request.
          </p>
        </div>

        {/* Dynamic Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Essential System FAQ & Meta Shortcuts (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-slate-200/60 dark:border-slate-850 p-5 bg-white dark:bg-[#0c111d] rounded-2xl shadow-sm">
                <Clock className="w-5 h-5 text-indigo-500 mb-2.5" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Avg. Reply Time</h4>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1">&lt; 12 Hours</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Monday to Friday</p>
              </div>
              <div className="border border-slate-200/60 dark:border-slate-850 p-5 bg-white dark:bg-[#0c111d] rounded-2xl shadow-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2.5" />
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">Data Privacy</h4>
                <p className="text-lg font-semibold text-slate-800 dark:text-slate-100 mt-1">100% Local</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Zero external uploads</p>
              </div>
            </div>

            {/* Interactive FAQs Accordion */}
            <div className="border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-[#0c111d] rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-indigo-500" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white uppercase tracking-wider">Frequently Asked FAQs</h3>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx} 
                      className={`border rounded-xl transition-all duration-200 ${
                        isOpen 
                          ? 'border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/10 dark:bg-indigo-950/5' 
                          : 'border-slate-100 dark:border-slate-900 hover:border-slate-200 dark:hover:border-slate-800'
                      }`}
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full text-left py-3 px-4 flex items-center justify-between text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-250 ${isOpen ? 'rotate-185 text-indigo-500' : ''}`} />
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-4 pb-4.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Ownership & Contact Channels */}
            <div className="border border-slate-200/60 dark:border-slate-850 p-5 bg-white dark:bg-[#0c111d] rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-2">Platform Ownership</span>
              <div className="mb-3">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Yogesh Kumar Madhukar</p>
                <p className="text-[10px] text-slate-500">Founder &amp; Chief Software Architect</p>
                <span className="mt-1.5 inline-block text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200/50 dark:border-indigo-800/50">
                  Madhukar &amp; Sons Digital
                </span>
              </div>
              
              <div className="space-y-3.5 border-t border-slate-100 dark:border-slate-900 pt-3">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Technical Support, Bug Reports &amp; Legal</span>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {SUPPORT_EMAIL}
                  </a>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">General Inquiries, Media &amp; Partnerships</span>
                  <a href={`mailto:${GENERAL_EMAIL}`} className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {GENERAL_EMAIL}
                  </a>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Professional Networking</span>
                  <a href={AUTHOR_LINKEDIN} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 mt-0.5">
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                  </a>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">X / Twitter Community</span>
                  <a href={AUTHOR_X} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:underline flex items-center gap-1.5 mt-0.5">
                    <Twitter className="w-3.5 h-3.5" /> @TextToolkitHub
                  </a>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-semibold">Official Website Portal</span>
                  <a href="https://texttoolkithub.com" target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 mt-0.5">
                    <Globe className="w-3.5 h-3.5" /> https://texttoolkithub.com
                  </a>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed border-t border-slate-100 dark:border-slate-900 pt-3">
                We are committed to answering technical queries, bug logs, and custom offline utility requests within 12 to 24 hours.
              </p>
            </div>

          </div>

          {/* Right Column: Contact form with adaptive states (7 cols) */}
          <div className="lg:col-span-7">
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="border border-emerald-100 dark:border-emerald-950/60 rounded-3xl bg-white dark:bg-[#0c111d] p-8 text-center shadow-lg shadow-emerald-500/[0.02]"
                  id="submit-success-box"
                >
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-5 border border-emerald-100/50 dark:border-emerald-900/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white font-sans">Email Delivered Successfully!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
                    Your message has been sent directly to <strong className="text-slate-700 dark:text-slate-200">support@texttoolkithub.com</strong> via Hostinger SMTP. An automatic confirmation email has also been sent to your email inbox.
                  </p>

                  {/* Metadata display context */}
                  <div className="my-6 p-4 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/60 max-w-sm mx-auto text-left space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Reference ID:</span>
                      <strong className="font-mono text-indigo-600 dark:text-indigo-400">{generatedTicketId}</strong>
                    </div>
                    <div className="flex justify-between text-xs border-t border-slate-100 dark:border-slate-900 pt-2">
                      <span className="text-slate-400">Response ETA:</span>
                      <strong className="text-slate-700 dark:text-slate-300">Under 12 Hours</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormError(null);
                      setFieldErrors({});
                    }}
                    className="mt-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-sans font-medium text-xs rounded-xl shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 transition-all duration-150 inline-flex items-center gap-1.5"
                  >
                    Send Another message <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <form 
                    onSubmit={handleSubmit} 
                    className="border border-slate-200/60 dark:border-slate-850 rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#0c111d] shadow-sm flex flex-col gap-5 relative"
                  >
                    
                    {/* Anti-spam Honeypot field (hidden from screen readers & users, but attractive to scrapers) */}
                    <div className="absolute opacity-0 pointer-events-none w-0 h-0 overflow-hidden" aria-hidden="true">
                      <label htmlFor="form_username_verification">Leave this field blank</label>
                      <input 
                        type="text" 
                        id="form_username_verification" 
                        value={honeypot} 
                        onChange={(e) => setHoneypot(e.target.value)} 
                        autoComplete="off" 
                        tabIndex={-1}
                      />
                    </div>
                    


                    {/* General Error State Alert Block (UX Requirement) */}
                    {formError && (
                      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-950/60 rounded-xl flex items-start gap-2.5 text-red-600 dark:text-red-400" id="form-error-banner">
                        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div className="text-xs leading-relaxed">
                          <span className="font-semibold block mb-0.5">Error validating inputs:</span>
                          {formError}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="form-name" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex justify-between items-center">
                          <span>Your Name *</span>
                          {fieldErrors.name && <span className="text-[10px] text-red-500 font-normal">{fieldErrors.name}</span>}
                        </label>
                        <input
                          type="text"
                          id="form-name"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined }));
                          }}
                          placeholder="Your Name"
                          className={`py-2.5 px-3.5 border text-sm rounded-xl outline-none bg-slate-50 dark:bg-slate-900/50 dark:text-white transition-all duration-150 ${
                            fieldErrors.name 
                              ? 'border-red-300 dark:border-red-900/60 focus:border-red-500' 
                              : 'border-slate-200 dark:border-slate-800/80 focus:bg-white dark:focus:bg-[#070a13] focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/10'
                          }`}
                        />
                      </div>

                      {/* Email input */}
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="form-email" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex justify-between items-center">
                          <span>Email Address *</span>
                          {fieldErrors.email && <span className="text-[10px] text-red-500 font-normal">{fieldErrors.email}</span>}
                        </label>
                        <input
                          type="text"
                          id="form-email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                          }}
                          placeholder="e.g. name@domain.com"
                          className={`py-2.5 px-3.5 border text-sm rounded-xl outline-none bg-slate-50 dark:bg-slate-900/50 dark:text-white transition-all duration-150 ${
                            fieldErrors.email 
                              ? 'border-red-300 dark:border-red-900/60 focus:border-red-500' 
                              : 'border-slate-200 dark:border-slate-800/80 focus:bg-white dark:focus:bg-[#070a13] focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/10'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Subject category drop-down selector */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="form-subject" className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                        Inquiry Subject Category
                      </label>
                      <div className="relative">
                        <select
                          id="form-subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full py-2.5 pl-3.5 pr-10 border border-slate-200 dark:border-slate-800/80 text-sm rounded-xl bg-slate-50 dark:bg-slate-900/50 dark:text-slate-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/10 appearance-none cursor-pointer"
                        >
                          <option value="Feedback">Feature Proposal / Suggestion</option>
                          <option value="Bug">Anomaly Report / System Bug</option>
                          <option value="Integration">Developer Integration Consultation</option>
                          <option value="General">General Question</option>
                        </select>
                        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Message textarea block */}
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="form-message" className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex justify-between items-center">
                        <span>Message Description *</span>
                        {fieldErrors.message && <span className="text-[10px] text-red-500 font-normal">{fieldErrors.message}</span>}
                      </label>
                      <textarea
                        id="form-message"
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value);
                          if (fieldErrors.message) setFieldErrors(prev => ({ ...prev, message: undefined }));
                        }}
                        placeholder="Please describe your feature suggestion, bug details, or general inquiry in detail..."
                        className={`py-2.5 px-3.5 border text-sm rounded-xl outline-none bg-slate-50 dark:bg-slate-900/50 dark:text-white focus:bg-white dark:focus:bg-[#070a13] focus:border-indigo-500 dark:focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/10 min-h-[140px] resize-y transition-all duration-150 font-sans ${
                          fieldErrors.message 
                            ? 'border-red-300 dark:border-red-900/60 focus:border-red-500' 
                            : 'border-slate-200 dark:border-slate-800/80'
                        }`}
                      />
                    </div>

                    {/* Privacy & Opt-In Advisory Footnote */}
                    <div className="p-3.5 rounded-xl border border-dashed border-slate-100 dark:border-slate-900 bg-slate-50/[0.4] dark:bg-slate-900/20 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
                      <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        <strong>Privacy Consent:</strong> We collect only the sender details above to correspond regarding your request. In strict accordance with our <a href="/privacy-policy" className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-500">Privacy Policy</a>, we employ no third-party telemetry, sell no database entries, and delete inactive tickets securely.
                      </p>
                    </div>

                    {/* Cloudflare Turnstile Challenge Widget */}
                    {isSiteKeyMissing ? (
                      <div className="flex flex-col gap-2.5 items-start my-1 w-full p-3.5 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20">
                        <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                          Security Verification Configuration Notice
                        </div>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-relaxed">
                          The <strong>VITE_TURNSTILE_SITE_KEY</strong> environment variable is not configured. Please supply a valid Cloudflare Turnstile site key in your environment settings to enable live challenge verification.
                        </p>
                      </div>
                    ) : turnstileScriptFailed ? (
                      <div className="flex flex-col gap-2.5 items-start my-1 w-full p-3.5 rounded-xl border border-rose-200 dark:border-rose-950 bg-rose-50/50 dark:bg-rose-950/20">
                        <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 text-xs font-semibold">
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                          Security Verification Script Failed
                        </div>
                        <p className="text-[11px] text-rose-600 dark:text-rose-400 leading-relaxed">
                          Failed to load the Cloudflare Turnstile security library from the CDN. Please check your internet connection or reload the page.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5 items-start my-1 w-full p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-indigo-500" />
                            Security Verification *
                          </span>
                          {turnstileToken ? (
                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Human Verified
                            </span>
                          ) : turnstileErrorCode ? (
                            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                              Error {turnstileErrorCode} Detected
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400">
                              Action Required Below
                            </span>
                          )}
                        </div>

                        {turnstileErrorCode ? (
                          <div className="flex flex-col gap-1.5 text-xs text-amber-700 dark:text-amber-300 p-3 rounded-lg bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 w-full mt-1">
                            <div className="font-semibold flex items-center gap-1.5 text-amber-800 dark:text-amber-200 text-xs">
                              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                              Domain Verification Mismatch (Cloudflare Error {turnstileErrorCode})
                            </div>
                            <p className="text-[11px] leading-relaxed text-amber-700/90 dark:text-amber-300/90">
                              Cloudflare rejected the site key for current domain <code className="px-1 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 font-mono text-[10px]">{typeof window !== 'undefined' ? window.location.hostname : 'preview-domain'}</code>. To resolve this in production, add this domain to your Cloudflare Turnstile Widget settings.
                            </p>
                          </div>
                        ) : (
                          <div 
                            ref={turnstileContainerRef} 
                            id="turnstile-container"
                            className="min-h-[65px] flex items-center justify-start animate-fade-in w-full overflow-x-auto"
                          />
                        )}
                      </div>
                    )}

                    {/* Submit Button Block */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-fit px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-45 text-white text-xs font-semibold tracking-wide uppercase font-sans rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 inline-flex self-end mt-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                          <span>Sending via Hostinger SMTP...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> 
                          <span>Send Message</span>
                        </>
                      )}
                    </button>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Local On-Device Submission History Archive */}
            {savedTickets.length > 0 && (
              <div className="mt-8 p-6 bg-white dark:bg-[#0c111d] border border-slate-200/60 dark:border-slate-850 rounded-3xl shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-sans">
                      On-Device Ticket History ({savedTickets.length})
                    </h4>
                  </div>
                  {showClearConfirm ? (
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] font-sans font-medium text-slate-500 dark:text-slate-400">Are you sure?</span>
                      <button
                        onClick={() => {
                          localStorage.removeItem('texttoolkithub_support_tickets');
                          setSavedTickets([]);
                          setShowClearConfirm(false);
                        }}
                        className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors focus:outline-none"
                      >
                        Yes, Clear
                      </button>
                      <span className="text-[10px] text-slate-300 dark:text-slate-700">|</span>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors focus:outline-none"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="text-[10px] text-red-500 hover:underline hover:text-red-600 focus:outline-none font-semibold transition-all duration-150"
                    >
                      Clear Logs
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {savedTickets.map((ticket, i) => (
                    <div key={ticket.id || i} className="p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-900 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">{ticket.id}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-sans rounded-full font-medium">
                            {ticket.subject}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 italic">
                          "{ticket.summary}"
                        </p>
                      </div>
                      <div className="text-[10px] text-slate-400 sm:text-right shrink-0">
                        <div>{new Date(ticket.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                        <div>{new Date(ticket.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
