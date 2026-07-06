import React from 'react';

export const MarkdownGuideContent: React.FC = () => {
  return (
    <>
      {/* Premium Badge / Introduction Section */}
      <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100/25 dark:border-indigo-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-650 dark:text-indigo-400 uppercase tracking-widest">Premium Content Engineering Resource</span>
          <p className="text-xs text-slate-555 dark:text-slate-400 leading-relaxed">
            This developer guide demystifies the CommonMark and GitHub Flavored Markdown (GFM) specifications, focusing on programmatic text pipeline rendering, nested block structures, and advanced table construction. Learn to construct lightweight documentation pipelines and prevent rendering exploits.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Markdown has cemented itself as the universal markup language for developers, technical writers, and content creators alike. Its design philosophy is simple: source documents should be fully legible as cleartext without looking like they have been decorated with markup tags.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-4">
        Despite this simplicity, modern rendering engines like CommonMark and GitHub Flavored Markdown (GFM) implement intricate state-machine architectures under the hood. For developers building document pipelines, blogs, or README systems, misunderstanding syntax boundaries often leads to misaligned structures, unrendered blocks, or Cross-Site Scripting (XSS) risks.
      </p>

      {/* SECTION 1: COMMONMARK VS GFM */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="specifications">CommonMark vs. GFM: The Parser Landscape</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Originally authored by John Gruber in 2004, the initial Markdown draft lacked formal specifications, leading to divergent "flavors" across different platforms. Today, two standards dominate:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>CommonMark:</strong> A highly rigorous, unambiguous specification developed by a community of engineers to standardize Gruber's original syntax rules. It defines exact behaviors for edge cases like nested lists and blockquotes.</li>
        <li><strong>GitHub Flavored Markdown (GFM):</strong> A strict superset of CommonMark that adds support for tables, task lists, strikethrough, autolinks, and sanitized HTML embedding, reflecting the requirements of social developer environments.</li>
      </ul>

      {/* SECTION 2: SYNTAX CHEATSHEET */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="syntax-guide">High-Fidelity Syntax Reference</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Review this visual summary of syntax tokens supported under modern GFM rendering pipelines:
      </p>

      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0c1019] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
              <th className="p-3">Feature</th>
              <th className="p-3">Markdown Visual Code</th>
              <th className="p-3">HTML Output</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-650 dark:text-slate-350">
            <tr>
              <td className="p-3 font-semibold text-indigo-650 dark:text-indigo-400">Headings</td>
              <td className="p-3 font-mono"># Heading 1<br />## Heading 2</td>
              <td className="p-3 font-mono">&lt;h1&gt;Heading 1&lt;/h1&gt;<br />&lt;h2&gt;Heading 2&lt;/h2&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-indigo-650 dark:text-indigo-400">Task Lists</td>
              <td className="p-3 font-mono">- [x] Done<br />- [ ] Pending</td>
              <td className="p-3">List item with checked/unchecked checkbox inputs.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-indigo-650 dark:text-indigo-400">Code Fences</td>
              <td className="p-3 font-mono">```javascript<br />const a = 1;<br />```</td>
              <td className="p-3 font-mono">&lt;pre&gt;&lt;code class=&quot;language-javascript&quot;&gt;...&lt;/code&gt;&lt;/pre&gt;</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-indigo-650 dark:text-indigo-400">Strikethrough</td>
              <td className="p-3 font-mono">~~deleted text~~</td>
              <td className="p-3 font-mono">&lt;del&gt;deleted text&lt;/del&gt;</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 3: TABLE GENERATION MECHANICS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="tables">Mastering Markdown Table Construction</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        In GFM, tables are constructed using pipe characters (<code className="font-mono">|</code>) to delimit columns, and hyphens (<code className="font-mono">-</code>) to form the header delimiter row. Columns are aligned by placing colons (<code className="font-mono">:</code>) in the delimiter row:
      </p>

      <div className="bg-slate-50 dark:bg-[#0c1019] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-6 space-y-2">
        <div>| Column A (Left) | Column B (Center) | Column C (Right) |</div>
        <div>| :--- | :---: | ---: |</div>
        <div>| Text left | Text centered | Text right |</div>
      </div>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To prevent parsing breaks inside table blocks, follow these rules:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>Cell Line Breaks:</strong> Markdown tables do not support standard paragraph line breaks within a single cell. If you need a multiline block within a table cell, you must use HTML line break tags (<code className="font-mono">&lt;br /&gt;</code>).</li>
        <li><strong>Escaping Pipes:</strong> If you need to render a literal pipe symbol inside a cell, escape it using a backslash: <code className="font-mono">\|</code>. Otherwise, the parser treats it as a column boundary.</li>
      </ul>

      {/* SECTION 4: SECURITY */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="security">The Security Risk: Preventing Markdown XSS Exploits</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        A common trap for developers building Markdown-based CMS systems is failing to sanitize HTML outputs. Because the standard allows embedding raw HTML directly into documents, malicious actors can insert malicious inline scripts:
      </p>
      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-red-600 dark:text-red-400 my-4 text-center">
        [Click Here](javascript:alert('XSS')) or &lt;img src=x onerror=alert('hack')&gt;
      </div>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To neutralize these injection risks, always pass your rendered output through a robust sanitization library like **DOMPurify** (for client environments) or compile Markdown with strict safe-mode settings that strip raw HTML tags entirely.
      </p>

      {/* SECTION 5: FAQS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      
      <div className="space-y-4 my-6">
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Why are my list items not showing up with standard bullets?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: Most utility frameworks like Tailwind CSS reset standard browser list styles (<code className="font-mono">list-style-type</code>) to prevent unexpected layout shifts. To fix this, wrap your Markdown-rendered output in a wrapper class with custom typography styles (like <code className="font-mono">prose dark:prose-invert</code> from Tailwind's typography library), or apply list styles explicitly in your stylesheet.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Can I embed custom CSS or class names directly into Markdown?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: Standard Markdown does not support applying custom CSS classes inline. However, extended parsers (such as Kramdown) support this via attribute notation (e.g. <code className="font-mono">&#123;.my-class&#125;</code>). If you are using React, libraries like <code className="font-mono">react-markdown</code> allow you to map Markdown tags to custom styled React components seamlessly.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl text-center space-y-4 my-8">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Summary: Constructing Portable Documentation</h3>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Markdown's beauty lies in its accessibility and portability. By adopting strict CommonMark or GFM standards, structuring custom tables with correct delimiter layouts, and applying robust sanitize routines to raw HTML streams, developers can build flawless documentation engines.
        </p>
      </div>
    </>
  );
};
