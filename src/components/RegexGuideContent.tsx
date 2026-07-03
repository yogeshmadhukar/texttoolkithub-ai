import React from 'react';

export const RegexGuideContent: React.FC = () => {
  return (
    <>
      {/* Premium Badge / Introduction Section */}
      <div className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-100/25 dark:border-blue-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Premium Developer Technical Resource</span>
          <p className="text-xs text-slate-555 dark:text-slate-400 leading-relaxed">
            This deep-dive guide explores the mathematical theory, token mechanics, and practical implementation of Regular Expressions (Regex). From basic anchors and character classes to advanced non-backtracking patterns, negative lookarounds, and browser performance optimization, this resource equips you with enterprise-grade parsing patterns.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Regular expressions (regex) are among the most versatile and powerful utilities in a software engineer's toolkit. They operate as a high-density domain-specific language for pattern matching, parsing, scrubbing, and validating strings.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-4">
        However, regex is notoriously double-edged. While a finely crafted pattern can replace dozens of lines of tedious manual string slicing, a poorly optimized expression can introduce severe performance bottlenecks, crash servers through catastrophic backtracking, or lead to cryptic, unmaintainable codebases.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        To build robust, modern text processing pipelines, developers must move beyond trial-and-error copying and fully master the deterministic mechanics of regular expression engines.
      </p>

      {/* SECTION 1: THE CORE THEORY */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="theory">The Core Theory: Deterministic vs. Non-Deterministic Automata</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Under the hood, a regular expression represents a state machine. When you compile a regex, the environment translates your visual pattern into an internal graph called a **Finite Automaton**.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        There are two main classes of engines that execute this matching logic:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>DFA (Deterministic Finite Automata):</strong> These engines read each input character exactly once, transitioning between states deterministically. They are incredibly fast, run in linear time, and never backtrack. However, they do not support advanced features like backreferences or lookarounds.</li>
        <li><strong>NFA (Non-Deterministic Finite Automata):</strong> NFAs (including the engines used in JavaScript, Python, and Java) are relation-driven. They actively explore potential matching branches, and if a branch fails, they backtrack to try another path. This flexibility powers lookarounds, but exposes them to performance pitfalls.</li>
      </ul>

      {/* SECTION 2: SYNTAX REFERENCE */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="syntax">Enterprise Syntax Reference Guide</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To design secure validation layers, let us review the essential blocks that compose professional-grade regular expressions:
      </p>

      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0c1019] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
              <th className="p-3">Token Group</th>
              <th className="p-3">Visual Code</th>
              <th className="p-3">Description &amp; Use Case</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-650 dark:text-slate-350">
            <tr>
              <td className="p-3 font-semibold text-blue-650 dark:text-blue-400">Anchors</td>
              <td className="p-3 font-mono">^ and $</td>
              <td className="p-3">Ensures matches align strictly to the start (^) or end ($) of strings, preventing bypass vulnerabilities.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-blue-650 dark:text-blue-400">Quantifiers</td>
              <td className="p-3 font-mono">* , + , ? , &#123;m,n&#125;</td>
              <td className="p-3">Controls occurrence matching. Add a trailing ? (e.g. +?) to toggle from greedy (match maximum) to lazy (match minimum).</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-blue-650 dark:text-blue-400">Character Classes</td>
              <td className="p-3 font-mono">\d , \w , \s , [A-Z]</td>
              <td className="p-3">Matches sets of symbols. \d captures digits, \w captures alphanumeric + underscore, and \s targets spaces.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold text-blue-650 dark:text-blue-400">Lookarounds</td>
              <td className="p-3 font-mono">(?=...) , (?!...)</td>
              <td className="p-3">Asserts condition presence (positive lookahead) or absence (negative lookahead) without consuming the buffer.</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION 3: CATASTROPHIC BACKTRACKING */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="catastrophic-backtracking">Preventing ReDoS: Catastrophic Backtracking Explained</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        One of the most critical security exploits in web development is **Regular Expression Denial of Service (ReDoS)**. This occurs when an NFA engine takes exponential time to process a non-matching string due to nested, overlapping quantifiers.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Consider the fragile pattern:
      </p>
      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-red-600 dark:text-red-400 my-4 text-center">
        ^(A+)+B$
      </div>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        If you pass the input <code className="bg-slate-100 dark:bg-slate-900 px-1 py-0.5 rounded font-mono">AAAA...AAAAX</code> (a long chain of 'A's ending in an 'X' instead of 'B'), the engine will recursively attempt every possible combination of grouping the 'A's before determining there is no match. For a string of just 30 characters, the engine will perform billions of calculations, freezing the browser thread or node process instantly.
      </p>

      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 text-slate-650 dark:text-slate-350 font-serif italic text-sm my-6 bg-blue-50/10 dark:bg-blue-950/5 p-4 rounded-r-xl">
        &quot;Rule of thumb: Always ensure your nested repetitions are mutually exclusive. If a character could match multiple parts of your subpatterns, rewrite the regex to prevent overlapping states.&quot;
      </blockquote>

      {/* SECTION 4: STEP-BY-STEP PATTERN BUILDING */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="building-patterns">Step-by-Step: Crafting a Robust ISO 8601 Date Validator</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Let us construct a strict pattern to validate a date in the format <code className="font-mono">YYYY-MM-DD</code>:
      </p>

      <div className="bg-slate-50 dark:bg-[#0c1019] p-5 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-6 space-y-3">
        <div className="font-bold border-b border-slate-200 dark:border-slate-800 pb-1.5 text-slate-900 dark:text-white">
          Incremental Regex Design Process
        </div>
        <div>
          <span className="text-blue-650 dark:text-blue-400 font-bold">1. Simple Numeric Matching:</span>
          <br />
          <code className="bg-slate-100 dark:bg-slate-900/50 px-1.5 py-0.5 rounded">^\d&#123;4&#125;-\d&#123;2&#125;-\d&#123;2&#125;$</code>
          <p className="text-[10px] text-slate-450 mt-1">Accepts any 4-digit number, followed by 2-digit pairs. However, it permits invalid months like '99' or days like '88'.</p>
        </div>
        <div>
          <span className="text-blue-650 dark:text-blue-400 font-bold">2. Restricting Month Scope (01 to 12):</span>
          <br />
          <code className="bg-slate-100 dark:bg-slate-900/50 px-1.5 py-0.5 rounded">^\d&#123;4&#125;-(0[1-9]|1[0-2])-\d&#123;2&#125;$</code>
          <p className="text-[10px] text-slate-450 mt-1">Forces the month column to match either '0' followed by '1-9', or '1' followed by '0-2'.</p>
        </div>
        <div>
          <span className="text-blue-650 dark:text-blue-400 font-bold">3. Restricting Day Scope (01 to 31):</span>
          <br />
          <code className="bg-slate-100 dark:bg-slate-900/50 px-1.5 py-0.5 rounded">^\d&#123;4&#125;-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$</code>
          <p className="text-[10px] text-slate-450 mt-1">Completes the validator by allowing days 01–09, 10–29, and 30–31.</p>
        </div>
      </div>

      {/* SECTION 5: FAQS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      
      <div className="space-y-4 my-6">
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Why does my regex run fine locally but freeze on production servers?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: This is almost certainly due to catastrophic backtracking triggered by specific, non-matching edge case inputs. While matching strings complete instantly, the engine must explore every combination of alternatives for certain non-matching strings. Always review your quantifiers and remove overlapping character definitions.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: What is the difference between greedy and lazy quantifiers?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: Greedy quantifiers (like <code className="font-mono">*</code> or <code className="font-mono">+</code>) expand as far as possible, eating up characters up to the very last match in a line. Lazy quantifiers (like <code className="font-mono">*?</code> or <code className="font-mono">+?</code>) halt at the very first opportunity. For example, in <code className="font-mono">"&lt;p&gt;Hello&lt;/p&gt;&lt;p&gt;World&lt;/p&gt;"</code>, the greedy pattern <code className="font-mono">&lt;.+&gt;</code> matches the entire line, while the lazy pattern <code className="font-mono">&lt;.+?&gt;</code> correctly extracts individual HTML tags.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Are lookaround groups safe to use in performant client-side validation?</h4>
          <p className="text-[11px] text-slate-555 dark:text-slate-400 leading-relaxed">
            A: Yes. Lookaround groups (like lookaheads <code className="font-mono">(?=...)</code>) are fully supported in modern ECMAScript engines. They are extremely valuable for multi-criteria validation (e.g., password checkers ensuring there is at least one digit, one special symbol, and one uppercase letter) without needing to write complex nested conditional loops.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl text-center space-y-4 my-8">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Summary: Integrating Pattern-Matching Wisely</h3>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Regular expressions are exceptionally powerful when designed with mechanical awareness. By understanding DFA and NFA engines, avoiding ReDoS vulnerabilities, and testing patterns locally with rich edge cases, you can integrate high-fidelity validators that scale flawlessly.
        </p>
      </div>
    </>
  );
};
