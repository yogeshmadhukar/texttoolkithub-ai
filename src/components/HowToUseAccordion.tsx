import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { getFaqsForTool } from '../data/toolFaqs.ts';
import { getEducationalGuideForTool } from '../data/toolEducationalGuides.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  CheckCircle, 
  Lightbulb, 
  Award, 
  ShieldCheck, 
  Cpu, 
  Sparkles,
  Play,
  Settings,
  AlertTriangle,
  ArrowRight,
  Code,
  FileText,
  Terminal,
  ArrowUpRight
} from 'lucide-react';

interface HowToUseAccordionProps {
  toolId: string;
  onNavigateToTool?: (toolId: string) => void;
}

export default function HowToUseAccordion({ toolId, onNavigateToTool }: HowToUseAccordionProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  const tool = TOOLS.find(t => t.id === toolId);
  if (!tool) return null;

  // Retrieve rich handcrafted or dynamic educational data
  const profile = getEducationalGuideForTool(tool.id);
  const faqs = getFaqsForTool(tool.id, tool.title, tool.description, tool.category, tool.keywords || []);

  // Dynamically inject Google FAQPage JSON-LD into head for real SEO & AdSense compliance
  useEffect(() => {
    const schemaId = `faq-schema-${tool.id.replace(/\//g, '-')}`;
    
    // Remove existing script if present to avoid duplication on router change
    const oldScript = document.getElementById(schemaId);
    if (oldScript) {
      oldScript.remove();
    }

    const faqSchema = {
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

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = schemaId;
    script.innerHTML = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById(schemaId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [tool.id, faqs]);

  // Handle clicking on related companion tools
  const handleToolClick = (relatedId: string) => {
    if (onNavigateToTool) {
      onNavigateToTool(relatedId);
    } else {
      // Fallback: reload hash route if navigation handler not provided
      const cleanId = relatedId.replace('tools/', '');
      window.location.hash = `#/${cleanId}`;
    }
  };

  // Handle clicking on related guide card
  const handleGuideClick = () => {
    if (onNavigateToTool) {
      onNavigateToTool('guides');
    } else {
      window.location.hash = '#/guides';
    }
  };

  return (
    <div className="space-y-16 border-t border-slate-150 dark:border-slate-850 pt-16 mt-16" id="educational-landing-wrapper">
      
      {/* SECTION 1: What is this Tool & How It Works */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8" id="educational-overview">
        {/* Left Column: What is this tool? */}
        <div className="p-6 md:p-8 bg-slate-50/40 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-3xl space-y-4 shadow-sm hover:border-slate-200 dark:hover:border-slate-800 transition-colors">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
            <BookOpen className="w-3.5 h-3.5" /> Concept Definition
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            What is the <span className="text-indigo-650 dark:text-indigo-400">{tool.title}</span>?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {profile.whatIsThis}
          </p>
        </div>

        {/* Right Column: How it works */}
        <div className="p-6 md:p-8 bg-slate-50/40 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-3xl space-y-4 shadow-sm hover:border-slate-200 dark:hover:border-slate-800 transition-colors">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-55/10 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
            <Cpu className="w-3.5 h-3.5" /> Technology &amp; Mechanics
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            How Does the Tool Work?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            {profile.howItWorks}
          </p>
        </div>
      </section>

      {/* SECTION 2: Interactive Practical Example (Step-by-Step) */}
      <section className="p-6 md:p-8 bg-slate-50/30 dark:bg-slate-950/10 border border-slate-150 dark:border-slate-850 rounded-3xl space-y-6" id="practical-examples">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
            <Play className="w-3.5 h-3.5" /> Step-by-Step Demonstration
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Step-by-Step Practical Example
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans max-w-2xl leading-relaxed">
            Review this concrete demonstration displaying raw input transitions into fully processed layouts inside our browser workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Sample Input */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" /> Sample Workspace Input
            </span>
            <div className="bg-slate-100/75 dark:bg-[#0c101b] border border-slate-200 dark:border-slate-900 p-4 rounded-2xl font-mono text-xs sm:text-sm text-slate-600 dark:text-slate-300 min-h-[100px] whitespace-pre-wrap select-all hover:bg-slate-150/40 dark:hover:bg-[#080b13] transition-colors">
              {profile.exampleInput}
            </div>
          </div>

          {/* Sample Output */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Processed Output Results
            </span>
            <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 p-4 rounded-2xl font-mono text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 min-h-[100px] whitespace-pre-wrap select-all">
              {profile.exampleOutput}
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed font-sans flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold text-slate-900 dark:text-white">Example Analysis:</strong> {profile.exampleExplanation}
          </div>
        </div>
      </section>

      {/* SECTION 3: Methodology (Best Practices vs. Common Mistakes) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8" id="professional-methodology">
        {/* Column 1: Best Practices */}
        <div className="p-6 md:p-8 bg-emerald-50/5 dark:bg-emerald-950/5 border border-emerald-100/20 dark:border-emerald-900/20 rounded-3xl space-y-5">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-emerald-50 dark:bg-emerald-950/35 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-emerald-100/30 dark:border-emerald-900/30">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Best Practices
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Professional Best Practices
          </h3>
          <ul className="flex flex-col gap-3.5">
            {profile.bestPractices.map((practice, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                <span className="p-1 rounded bg-emerald-100/50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-450 text-[10px] font-extrabold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{practice}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 2: Common Mistakes */}
        <div className="p-6 md:p-8 bg-amber-50/5 dark:bg-amber-950/5 border border-amber-100/20 dark:border-amber-900/20 rounded-3xl space-y-5">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-amber-50 dark:bg-amber-950/35 text-amber-700 dark:text-amber-450 text-[10px] font-bold uppercase tracking-wider rounded-full border border-amber-100/30 dark:border-amber-900/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Pitfalls to Avoid
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Common Mistakes &amp; Hazards
          </h3>
          <ul className="flex flex-col gap-3.5">
            {profile.commonMistakes.map((mistake, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                <span className="p-1 rounded bg-amber-100/50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-450 text-[10px] font-extrabold shrink-0 mt-0.5">
                  ✗
                </span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* SECTION 4: Professional Tips & Hacks */}
      <section className="p-6 md:p-8 bg-gradient-to-br from-indigo-50/10 via-slate-50/10 to-blue-50/10 dark:from-indigo-950/10 dark:via-slate-950/5 dark:to-blue-950/10 border border-slate-200 dark:border-slate-850 rounded-3xl space-y-4" id="expert-tips">
        <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
          <Lightbulb className="w-3.5 h-3.5 text-indigo-500" /> Expert Hacks
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Professional Tips &amp; Optimization Tactics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {profile.professionalTips.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-white/70 dark:bg-slate-900/60 border border-slate-150/80 dark:border-slate-800/80 rounded-2xl">
              <Sparkles className="w-4 h-4 text-indigo-550 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-355 leading-relaxed font-sans">
                {tip}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Real-World Use Cases */}
      <section className="space-y-6" id="real-world-use-cases">
        <div className="space-y-1.5">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
            <Award className="w-3.5 h-3.5 text-indigo-500" /> Commercial Workflows
          </span>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Real-World Enterprise Use Cases
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans max-w-2xl leading-relaxed">
            See how content writers, developers, and data specialists leverage the {tool.title} to optimize their professional workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {profile.useCases.map((useCase, idx) => {
            const [titlePart, descPart] = useCase.split(': ');
            return (
              <div key={idx} className="p-5 bg-slate-50/40 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col gap-2.5">
                <span className="text-[10px] font-bold uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
                  Workflow Scenario #{idx + 1}
                </span>
                <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm">
                  {titlePart}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  {descPart || useCase}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 6: Frequently Asked Questions */}
      <section className="space-y-6" id="faq-section">
        <div className="text-center max-w-2xl mx-auto space-y-2 select-none">
          <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-550" /> Frequently Asked Questions
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Answers &amp; Expert Insights
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Immediate, detailed technical guidance explaining local browser calculations, security boundaries, and capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className="p-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-2xl flex flex-col gap-2.5 hover:border-indigo-500/20 dark:hover:border-indigo-400/20 hover:shadow-sm transition-all duration-200 group"
              id={`faq-${faq.id}`}
            >
              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-start gap-2.5 leading-snug">
                <span className="text-indigo-650 dark:text-indigo-400 font-mono text-xs bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-lg shrink-0 mt-0.5 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/60 transition-colors">Q{faq.id}</span>
                <span>{faq.question}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-1 sm:pl-9 font-sans">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 7: Related Educational Guide */}
      <section className="space-y-4" id="educational-guides">
        <h4 className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
          Related Educational Article
        </h4>
        <div 
          onClick={handleGuideClick}
          className="group p-6 bg-indigo-50/10 hover:bg-indigo-50/25 dark:bg-indigo-950/5 dark:hover:bg-indigo-950/15 border border-indigo-100/30 hover:border-indigo-500/30 dark:border-indigo-900/20 dark:hover:border-indigo-500/20 rounded-3xl cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          id={`related-guide-card-${profile.relatedGuide.id}`}
        >
          <div className="space-y-2 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-705 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-wider rounded-full border border-indigo-100/30 dark:border-indigo-900/30">
              <BookOpen className="w-3.5 h-3.5" /> Featured Deep-Dive Tutorial
            </span>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {profile.relatedGuide.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
              {profile.relatedGuide.excerpt}
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:translate-x-1.5 transition-transform shrink-0">
            Read Free Guide <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </section>

      {/* SECTION 8: Related Tools (Companion Utilities) */}
      <section className="space-y-6 pt-4 border-t border-slate-150 dark:border-slate-850" id="companion-utilities">
        <div className="space-y-1">
          <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Explore Companion Text Utilities
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed">
            Speed up your content editing workflows by pairing this tool with our other local formatting utilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
          {profile.relatedTools.map((relId) => {
            const relTool = TOOLS.find(t => t.id === relId);
            if (!relTool) return null;
            return (
              <div 
                key={relTool.id} 
                onClick={() => handleToolClick(relTool.id)}
                className="group border border-slate-200 dark:border-slate-850 hover:border-indigo-400 dark:hover:border-indigo-500/40 p-5 bg-white dark:bg-slate-950/40 rounded-2xl cursor-pointer hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                id={`related-tool-${relTool.id}`}
              >
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-850 dark:text-slate-150 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-sm transition-colors flex items-center justify-between">
                    {relTool.title}
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    {relTool.description}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-4 block">
                  Open Utility →
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* GDPR Sandboxed Local Storage Guarantee stamp */}
      <section className="flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-950/20 border border-slate-150 dark:border-slate-850 rounded-2xl gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal font-sans">
            <strong className="font-bold text-slate-900 dark:text-white">GDPR-Compliant Local Sandbox Guarantee:</strong> None of your drafts, inputs, or generated variables are ever uploaded, recorded, or saved. Processing executes 100% inside your own browser tab.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 shrink-0">
          <span>Client-Side Only</span>
          <span>•</span>
          <span>Zero Cookies Tracking</span>
        </div>
      </section>

    </div>
  );
}
