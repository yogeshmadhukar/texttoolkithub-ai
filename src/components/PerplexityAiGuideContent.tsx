import React from 'react';

export const PerplexityAiGuideContent: React.FC<{ onNavigateToTool?: (toolId: string) => void }> = ({ onNavigateToTool }) => {
  return (
    <>
      {/* Premium Badge / Introduction Section */}
      <div className="bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-indigo-500/5 border border-emerald-100/25 dark:border-emerald-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Digital Productivity & AI Briefing</span>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            This authoritative guide evaluates the rapid transformation of information retrieval, mapping the transition from legacy, ad-supported indexes to intelligent, citation-backed Answer Engines. Learn how to configure Perplexity AI to automate deep technical synthesis, verify citations in real-time, leverage elite large language models under one subscription, and supercharge your technical writing and development workflows.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        For over two decades, the process of finding information on the internet has remained virtually unchanged. Users enter a string of words into a query bar and are presented with pages of blue links—many of which are heavily saturated with advertising, search engine optimization (SEO) fluff, and sponsored placements. 
      </p>
      
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-4">
        As the volume of web-published content continues to explode, this manual search process has become increasingly friction-filled. Finding high-quality, verified facts now requires clicking through multiple websites, scanning dozens of paragraphs, and filtering out marketing noise. The modern digital workspace demands a more efficient paradigm. 
      </p>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Enter Perplexity AI. Positioned at the vanguard of the search revolution, Perplexity functions not as a passive index of URLs, but as an active, conversational <strong>Answer Engine</strong>. By combining real-time web crawling with state-of-the-art natural language processing, it reads, synthesizes, and directly answers queries while anchoring every claim to reliable online citations. For writers, developers, analysts, and tech enthusiasts, this shift represents a profound upgrade in research utility.
      </p>

      {/* SECTION 2: CORE FEATURES */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="core-features">Core Features That Make Perplexity AI Stand Out</h2>
      
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Unlike standard chatbots that rely entirely on static, pre-trained datasets—or traditional search engines that delegate content analysis to the end-user—Perplexity AI bridges the gap. It couples real-time crawling with conversational context, yielding four distinct structural advantages.
      </p>

      <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-6 mb-2" id="real-time-indexing">1. Real-Time Web Indexing &amp; Live Citations</h3>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        One of the biggest issues with standard generative AI is "hallucination"—the tendency of models to invent confident but completely fabricated facts. Perplexity solves this problem by integrating a robust live search pipeline. 
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-2">
        When a query is received, the system queries the live web, extracts relevant text snippets from trusted domains, and feeds those verified sources directly into the model's context window. Each claim in the final answer is linked with a numeric inline footnote. Users can immediately click these footnotes to verify the primary source, ensuring maximum academic integrity and fact-checking speed.
      </p>

      <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-6 mb-2" id="deep-research">2. Deep Research &amp; Multi-Source Analysis</h3>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Complex questions rarely have single-sentence answers. Perplexity's "Pro Search" (or Deep Research) agent automates multi-step research journeys. Instead of executing a single search, it analyzes the prompt, formulates a multi-part execution plan, raises clarifying follow-up questions to the user, and runs multiple concurrent web searches. 
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-2">
        The system then aggregates, filters, and cross-references data from hundreds of sources to construct a comprehensive, structured briefing. This transforms what would typically be a multi-hour manual compilation task into a clean, 30-second automated operation.
      </p>

      <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-6 mb-2" id="model-council">3. Multi-Model Support (The Model Council)</h3>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Rather than locking users into a single proprietary model architecture, Perplexity Pro functions as an open gateway to elite generative models. Users can actively switch the underlying model engine driving their searches depending on their current task needs.
      </p>
      <ul className="list-disc pl-6 space-y-2 text-xs text-slate-600 dark:text-slate-355 mt-3">
        <li><strong>GPT-4o (OpenAI):</strong> Ideal for high-level creative writing, complex technical tasks, and balanced semantic logic.</li>
        <li><strong>Claude 3.5 Sonnet (Anthropic):</strong> The industry leader for intricate coding tasks, long-form content structuring, and deep technical synthesis.</li>
        <li><strong>Sonar (Perplexity's Custom Model):</strong> Highly optimized specifically for ultra-fast, search-grounded conversational responses.</li>
      </ul>

      <h3 className="text-sm font-bold text-slate-850 dark:text-slate-200 mt-6 mb-2" id="spaces-knowledge">4. Spaces &amp; Knowledge Search</h3>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Organization is essential for high-volume research. Through the "Spaces" feature, users can establish dedicated directories for specific projects (e.g., "Market Analysis 2026," "TypeScript Architecture"). 
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-2">
        Within these Spaces, you can upload PDFs, text files, CSV databases, or code repositories. When you query within a Space, Perplexity cross-references your uploaded documents alongside real-time web results, delivering a hyper-personalized, context-aware information portal.
      </p>

      {/* SECTION 3: STEP-BY-STEP WORKFLOWS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="step-by-step">Step-by-Step Guide: How to Use Perplexity AI for Maximum Productivity</h2>
      
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To move past casual inquiries and tap into Perplexity's full potential, you must learn how to direct its search vectors. Here are three highly optimized workflows tailored for technical, content, and market researchers.
      </p>

      <div className="space-y-6 mt-6">
        <div className="p-5 bg-slate-50 dark:bg-[#0c1019] rounded-xl border border-slate-200 dark:border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Workflow A: Advanced Technical Research &amp; Code Review</h4>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-3">
            Developers can bypass outdated stack-overflow posts and read fresh, official documentation pages instantly.
          </p>
          <div className="bg-white dark:bg-[#111622] p-4 rounded-lg border border-slate-150 dark:border-slate-850 font-mono text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">PROMPT TEMPLATE:</span>
            "Compare the latest features of [Library X] and [Library Y] as of mid-2026. Focus specifically on bundle size, tree-shaking performance, and native support for React 19 server components. Provide actual code snippets and cite official documentation pages."
          </div>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-[#0c1019] rounded-xl border border-slate-200 dark:border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Workflow B: SEO Content Planning &amp; Semantic Mapping</h4>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-3">
            SEO specialists can map intent, identify content gaps, and analyze competitor headings without leaving the platform.
          </p>
          <div className="bg-white dark:bg-[#111622] p-4 rounded-lg border border-slate-150 dark:border-slate-850 font-mono text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">PROMPT TEMPLATE:</span>
            "Analyze the top 5 ranking articles for the keyword '[Target Keyword]'. Outline their visual hierarchy, identify key questions they fail to answer, and suggest a comprehensive, E-E-A-T-compliant outline that incorporates relevant semantic vocabulary."
          </div>
        </div>

        <div className="p-5 bg-slate-50 dark:bg-[#0c1019] rounded-xl border border-slate-200 dark:border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-2">Workflow C: Market Analysis &amp; Competitor Intelligence</h4>
          <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-3">
            Analysts can synthesize corporate earnings, regulatory files, and trade publications in minutes.
          </p>
          <div className="bg-white dark:bg-[#111622] p-4 rounded-lg border border-slate-150 dark:border-slate-850 font-mono text-xs text-slate-700 dark:text-slate-300">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">PROMPT TEMPLATE:</span>
            "Research recent market trends for [Industry Sector] in Q1/Q2 of 2026. Extract concrete revenue figures, citation links to financial SEC filings, and summarize the key drivers of growth in a highly readable markdown table."
          </div>
        </div>
      </div>

      {/* SECTION 4: COMPARISON TABLE */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="comparison">Comparison: The Search &amp; Research Landscape</h2>
      
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mb-4">
        To understand exactly where Perplexity fits, we must evaluate it across the axes of data currency, source verifiability, automation, and model versatility. Here is how it measures up against traditional search and legacy conversational chatbots:
      </p>

      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0c1019] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
              <th className="p-3">Feature Metric</th>
              <th className="p-3">Traditional Search (e.g., Google)</th>
              <th className="p-3">Standard AI Chatbot (e.g., ChatGPT)</th>
              <th className="p-3">Perplexity AI Engine</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-600 dark:text-slate-355">
            <tr>
              <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">Real-Time Access</td>
              <td className="p-3">Instantaneous (Manual clicking required)</td>
              <td className="p-3">Often delayed or limited to static training cutoff</td>
              <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Yes, dynamic query-triggered web crawling</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">Direct Source Citations</td>
              <td className="p-3">Displays individual site URLs, no synthesized claims</td>
              <td className="p-3">Rarely cites sources; prone to silent hallucination</td>
              <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Yes, robust inline footnotes pointing to source domains</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">Deep Research Automation</td>
              <td className="p-3">None. User must manually open and aggregate tabs</td>
              <td className="p-3">Limited. Generally processes single-turn answers</td>
              <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Yes, multi-step agent planning with Pro Search</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-slate-850 dark:text-slate-200">Model Flexibility</td>
              <td className="p-3">Fixed algorithmic indexing</td>
              <td className="p-3">Bound strictly to proprietary ecosystem (e.g., GPT)</td>
              <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">Yes, toggle between Claude, GPT, and custom models</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 5: FAQS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQs)</h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 mb-1">Is Perplexity AI completely free to use?</h3>
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
            Perplexity offers a highly capable free tier that includes unlimited standard Copilot searches and basic model answers. Upgrading to Perplexity Pro unlocks elite large models (Claude 3.5 Sonnet, GPT-4o), advanced document upload capabilities, dedicated image generation engines, and increased daily allowances for multi-step Pro Searches.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 mb-1">How does Perplexity AI verify the accuracy of its answers?</h3>
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
            Perplexity enforces rigorous factual grounding. By querying high-authority indexes, pulling verbatim text extracts from those sites, and passing those snippets directly into the LLM's active prompt memory, the model is strictly constrained to write responses backed by the fetched data. This citation-first architecture virtually eliminates typical generative hallucinations.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 mb-1">Can I upload my own documents, spreadsheets, and files?</h3>
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
            Yes. Through both standard threads and customized project Spaces, users can upload complex documents including PDFs, text files, CSV files, and programming source files. Perplexity will thoroughly parse your local materials and allow you to search, query, and merge that internal data with the live, open web.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 mb-1">Does Perplexity track my search query history?</h3>
          <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
            By default, Perplexity stores a history of your threads so you can reference and build upon past research. However, you can manage your data settings to disable AI model training on your prompts. If privacy is your primary operational mandate, utilizing local-first text processing utilities remains the absolute safest option for sensitive materials.
          </p>
        </div>
      </div>

      {/* SECTION 6: CONCLUSION & CTA */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="conclusion">Conclusion: Transitioning to an Answer-First Workflow</h2>
      
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        The ultimate goal of research is not to gather an endless pile of links, but to acquire clear, contextual, and actionable answers. By automating the mechanical tasks of searching, browsing, and content aggregation, Perplexity AI allows creators and technical writers to focus their cognitive energy on what truly matters: editing, synthesizing, and writing.
      </p>
      
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Integrating conversational search tools into your creative pipeline represents a major productivity shift. For developers and technical writers who handle sensitive data, combining AI search engines with completely local, browser-based utilities ensures you enjoy maximum analytical insight without compromising data security.
      </p>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-4 font-medium text-slate-800 dark:text-slate-200">
        Ready to optimize your text and coding workflows further? Explore TextToolkitHub's comprehensive suite of 100% offline developer utilities, including our local <button onClick={() => onNavigateToTool?.('tools/json-formatter')} className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">JSON Formatter</button>, <button onClick={() => onNavigateToTool?.('tools/regex-tester')} className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">Regex Tester</button>, and specialized SEO tools designed to keep your private research perfectly secure.
      </p>
    </>
  );
};
