import React from 'react';
import { Cpu, Terminal, Shield, Zap, RefreshCw } from 'lucide-react';

interface TechnicalExplanationProps {
  toolTitle: string;
  technologyUsed?: string;
  customExplanation?: string;
}

export default function TechnicalExplanation({
  toolTitle,
  technologyUsed = 'Client-Side JavaScript & WebAssembly (Wasm)',
  customExplanation
}: TechnicalExplanationProps) {
  return (
    <section className="w-full border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 rounded-3xl p-6 sm:p-8 my-8 transition-colors duration-200" id="technical-under-the-hood" aria-label="Technical Architecture">
      
      <header className="flex items-center gap-2 mb-3">
        <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">
            Transparent Engineering Architecture
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-sans">
            How {toolTitle} Works Under the Hood
          </h3>
        </div>
      </header>

      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
        {customExplanation || `${toolTitle} executes 100% locally within your browser using modern ${technologyUsed}. Unlike conventional online tools that transmit your documents or strings to remote cloud servers, our zero-knowledge engine processes everything directly in your device's RAM thread. This eliminates network latency, guarantees confidentiality, and ensures full operational availability even when working offline or in air-gapped environments.`}
      </p>

      {/* 4-Step Technical Flow Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        <article className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-mono font-bold text-xs mb-2">
              01
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Local RAM Allocation
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Input text or binary data streams are allocated directly into transient client memory buffers within your browser.
            </p>
          </div>
        </article>

        <article className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-mono font-bold text-xs mb-2">
              02
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              On-Device CPU Execution
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Native JavaScript engines and compiled WebAssembly routines perform mathematical computations directly on your CPU.
            </p>
          </div>
        </article>

        <article className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-mono font-bold text-xs mb-2">
              03
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Zero Network Transmission
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              No API requests, telemetry payloads, or document data leave your device. Complete end-to-end privacy guaranteed.
            </p>
          </div>
        </article>

        <article className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-7 h-7 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-mono font-bold text-xs mb-2">
              04
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Instant Memory Sanitization
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Navigating away or closing the tab triggers browser garbage collection, immediately purging all temporary memory buffers.
            </p>
          </div>
        </article>

      </div>

    </section>
  );
}
