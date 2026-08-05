import React from 'react';
import { ShieldCheck, Lock, Zap, WifiOff, FileText, Server, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const ClientSidePdfGuideContent: React.FC = () => {
  return (
    <article className="prose dark:prose-invert max-w-none space-y-8 font-sans text-slate-700 dark:text-slate-300 leading-relaxed">
      
      {/* Intro Hero Box */}
      <div className="p-6 md:p-8 bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/30 dark:via-slate-900/60 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/40 rounded-3xl shadow-sm">
        <p className="text-base md:text-lg text-slate-800 dark:text-slate-200 font-medium leading-relaxed m-0">
          Every day, millions of legal contracts, tax forms, medical records, and internal business presentations are uploaded to free online PDF converters. Most users click &quot;Upload&quot; without a second thought, assuming the site simply performs the task and discards the file. But behind the sleek user interfaces of traditional web tools lies a troubling reality: your private documents are often sent to remote cloud servers, stored in temporary caches, and potentially retained for analytics or automated model training.
        </p>
      </div>

      {/* 1. Hidden Privacy Risks */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3" id="privacy-risks">
          <AlertTriangle className="w-6 h-6 text-amber-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
          The Hidden Privacy Risks of Traditional Server-Side PDF Tools
        </h2>
        
        <p>
          For over two decades, web utilities operated under a legacy client-server architecture: the user&apos;s browser was merely a thin display layer, while the actual computation happened on a remote server. When you split, merge, or convert a PDF on a server-side web utility, your document travels across the public internet to an external data center.
        </p>

        <p>
          While many legitimate services promise to delete files after one hour, server-side PDF processing introduces significant security vectors that users are rarely warned about:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 mt-0 mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Unintended File Retention
            </h3>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 m-0 leading-relaxed">
              Files buffered in temporary server memory, edge caching proxies, or serverless logs can persist long after your session ends due to backup routines or failed garbage collection cycles.
            </p>
          </div>

          <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 mt-0 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Man-in-the-Middle Risks
            </h3>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 m-0 leading-relaxed">
              Transmitting confidential documents over public Wi-Fi or networks exposes raw PDF data payload packets to potential interception if SSL/TLS certificates or DNS configurations are compromised.
            </p>
          </div>

          <div className="p-5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl">
            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-300 mt-0 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Regulatory Non-Compliance
            </h3>
            <p className="text-xs text-amber-800/90 dark:text-amber-300/80 m-0 leading-relaxed">
              Uploading customer records, financial statements, or patient data to unverified third-party servers can directly violate strict regulatory frameworks like GDPR, HIPAA, and CCPA.
            </p>
          </div>
        </div>
      </section>

      {/* 2. How Client-Side Processing Works */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3" id="how-client-side-works">
          <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
          Under the Hood: How Modern Client-Side Processing Works
        </h2>
        
        <p>
          In 2026, web browser engines (V8, JavaScriptCore, Gecko) have evolved into hyper-efficient local operating environments. Breakthroughs in <strong>WebAssembly (Wasm)</strong>, multithreaded <strong>Web Workers</strong>, and modern JavaScript PDF parsing libraries allow web applications to execute heavy computation entirely inside the user&apos;s device RAM.
        </p>

        <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl my-6 border border-slate-800 font-mono text-xs space-y-3">
          <div className="text-emerald-400 font-bold">// Legacy Server-Side Flow (High Risk):</div>
          <div className="text-slate-400">User PDF File ➔ Public Network ➔ Remote Server Disk ➔ Processing ➔ Network Download ➔ User</div>
          
          <div className="h-px bg-slate-800 my-3" />
          
          <div className="text-indigo-400 font-bold">// TextToolkitHub Client-Side Flow (Zero Risk):</div>
          <div className="text-slate-200">User PDF File ➔ Browser Sandboxed Memory (RAM) ➔ Local Wasm/JS Processing ➔ Instant Output</div>
        </div>

        <p>
          When you drag and drop a document into a browser-native tool, the web app reads the file as an array buffer directly in local memory. The PDF structure is parsed, edited, or converted locally, and the modified PDF binary is compiled directly inside your browser. No file data ever leaves your device, and no network requests are dispatched to any external backend server.
        </p>
      </section>

      {/* 3. The Benefits */}
      <section className="space-y-4 pt-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3" id="benefits">
          <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
          Key Advantages of On-Device PDF Utilities
        </h2>

        <div className="space-y-4">
          <div className="p-5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0 mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              1. Blazing Fast Speed and Zero Network Delay
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 m-0 leading-relaxed">
              Because files are processed directly on your computer or mobile CPU, there is no network upload or download lag. A 50MB image-heavy PDF that would take 30 seconds to upload over average Wi-Fi processes in under 500 milliseconds locally.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0 mb-1 flex items-center gap-2">
              <WifiOff className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              2. Complete Off-Grid and Offline Capability
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 m-0 leading-relaxed">
              Client-side web applications leverage Progressive Web App (PWA) caching architectures. Once loaded in your browser tab, tools like Image-to-PDF or PDF Splitter remain fully operational on flights, remote job sites, or during network outages without requiring internet connectivity.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-slate-850/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0 mb-1 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              3. Uncompromising Zero-Knowledge Privacy
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 m-0 leading-relaxed">
              Client-side execution provides absolute zero-knowledge security. Neither the platform operators nor any third-party analytics provider can view, store, or inspect the contents of your documents. When you close the browser tab, the temporary memory heap is completely erased by the browser runtime.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Conclusion & Commitment */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3" id="conclusion">
          <FileText className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
          TextToolkitHub&apos;s Unwavering Commitment to Local Privacy
        </h2>

        <p>
          At TextToolkitHub, we believe data privacy should be built into software architecture by default rather than treated as an afterthought in legal fine print. Every tool across our platform—from our PDF Splitter and Image to PDF converter to our JSON formatters and Regex testers—is engineered to run 100% locally in your browser.
        </p>

        <p>
          By removing remote servers from the equation entirely, we empower students, legal teams, software engineers, and privacy-conscious professionals worldwide to manipulate text and document files with total peace of mind.
        </p>

        <div className="p-6 bg-indigo-600 text-white rounded-3xl shadow-lg my-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mt-0 mb-1">Ready to experience true browser-native utility?</h3>
            <p className="text-xs md:text-sm text-indigo-100 m-0">Try our free PDF utilities today with zero server uploads and instant processing.</p>
          </div>
          <a 
            href="/tools/pdf-splitter" 
            className="px-5 py-3 bg-white text-indigo-600 hover:bg-indigo-50 font-bold text-xs rounded-xl transition shrink-0 no-underline shadow-md"
          >
            Explore PDF Utilities ➔
          </a>
        </div>
      </section>

    </article>
  );
};

export default ClientSidePdfGuideContent;
