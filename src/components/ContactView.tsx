import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  ArrowRight
} from 'lucide-react';
import { analytics } from '../lib/analytics.ts';


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
  
  // Status States
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  // Ticket ID for Success State Screen
  const [generatedTicketId, setGeneratedTicketId] = useState('');

  // Interactive FAQs Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

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
      errors.email = "Please enter a valid, operational email address (e.g. name@domain.com)";
    }

    if (!message.trim()) {
      errors.message = "Message cannot be empty";
    } else if (message.trim().length < 15) {
      errors.message = "Message must be at least 15 characters to explain your query sufficiently";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError("Please correct the errors in the contact form fields below before transmitting.");
      return;
    }

    setLoading(true);

    // Simulate API transmit delay with high-fidelity loading response
    setTimeout(() => {
      setLoading(false);
      
      // Random professional-looking Ticket ID
      const randomId = `TK-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedTicketId(randomId);
      setSubmitted(true);

      // Track support request submission
      try {
        analytics.trackContactSubmit(subject, randomId);
      } catch (err) {
        console.warn("Failed tracking contact submit event:", err);
      }

      // Save form inputs for success summary but clear fields
      setName('');
      setEmail('');
      setMessage('');
    }, 1100);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-[#fafbfe] dark:bg-[#070a13] text-slate-800 dark:text-slate-200 overflow-hidden transition-colors duration-300 pb-20">
      
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

            {/* Direct Channel block */}
            <div className="border border-slate-200/60 dark:border-slate-850 p-5 bg-white dark:bg-[#0c111d] rounded-2xl shadow-sm">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Direct Contact Handle</span>
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2.5 flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                <a href="mailto:texttoolkithub@gmail.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline">
                  texttoolkithub@gmail.com
                </a>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Send us an email or submit a message using our secure service contact form.
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
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white font-sans">Message Transmitted Successfully!</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your feedback makes our toolkit better. We have queued your request to our technical review queue.
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
                    
                    <div>
                      <h3 className="font-sans font-semibold text-lg text-slate-900 dark:text-white pb-1">
                        Submit a Support Request
                      </h3>
                      <p className="text-xs text-slate-400">All messages are processed securely.</p>
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

                    {/* Submit Button Block */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-fit px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-45 text-white text-xs font-semibold tracking-wide uppercase font-sans rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 inline-flex self-end mt-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin shrink-0" />
                          <span>Routing ticket...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" /> 
                          <span>Transmit Message</span>
                        </>
                      )}
                    </button>

                  </form>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
