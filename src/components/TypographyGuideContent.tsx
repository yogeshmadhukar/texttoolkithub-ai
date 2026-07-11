import React from 'react';

export const TypographyGuideContent: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100/25 dark:border-indigo-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Aesthetic & Accessibility Standard</span>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            This comprehensive resource details the mathematics, ergonomics, and implementation specifications of web-first typography, fluid text scaling, and WCAG-compliant line dimensions.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Typography is the invisible interface of the digital world. While visual graphics and interactive controls capture initial attention, over 95% of all web information is transmitted through written text. The structure of your typography directly influences cognitive processing speed, comprehension levels, and visual fatigue during prolonged reading sessions. Inaccurate typographic alignment represents a significant barrier for neurodivergent audiences and visually impaired users.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="line-height-math">The Mathematics of Line Heights and Leading</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Line height (traditionally termed "leading" in hot-metal typesetting) defines the vertical distance between adjacent baselines of text. Proper leading prevents line-collisions and ensures the reader's eye can seamlessly track from the end of one line to the beginning of the next.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        In modern CSS, <code>line-height</code> can be declared using absolute units (px), relative units (em, rem, %), or unitless numbers. Unitless numbers (e.g., <code>line-height: 1.5</code>) are strictly preferred because they function as multiplicative scale factors that adapt dynamically to any inherited or customized <code>font-size</code>.
      </p>
      <div className="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-xs text-left border-collapse font-sans">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#0c1019] border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
              <th className="p-3">Typographic Element</th>
              <th className="p-3">Ideal Size Range</th>
              <th className="p-3">Recommended Line-Height</th>
              <th className="p-3">Aesthetic Rationale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-slate-650 dark:text-slate-350">
            <tr>
              <td className="p-3 font-semibold">Body Copy (Paragraphs)</td>
              <td className="p-3">15px – 18px / 0.95rem – 1.125rem</td>
              <td className="p-3 font-mono text-indigo-650 dark:text-indigo-400">1.50 – 1.65</td>
              <td className="p-3">Provides ample vertical breathing space, lowering cognitive friction during long-form reading.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">Display Headings (H1, H2)</td>
              <td className="p-3">32px – 48px / 2.0rem – 3.0rem</td>
              <td className="p-3 font-mono">1.15 – 1.25</td>
              <td className="p-3">Larger font sizes naturally require tighter line grouping to maintain cohesive structural shapes.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">Sub-Headings (H3, H4)</td>
              <td className="p-3">20px – 24px / 1.25rem – 1.5rem</td>
              <td className="p-3 font-mono">1.30 – 1.40</td>
              <td className="p-3">Bridges the gap between title prominence and reading flow.</td>
            </tr>
            <tr>
              <td className="p-3 font-semibold">Technical / Code Blocks</td>
              <td className="p-3">13px – 15px / 0.8125rem – 0.9375rem</td>
              <td className="p-3 font-mono">1.40 – 1.50</td>
              <td className="p-3">Ensures clear separation of syntax symbols and nesting indents.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="wcag-standards">WCAG 2.1 Success Criteria 1.4.12: Text Spacing</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        To achieve high accessibility ratings, text containers must support custom user overrides without truncating layout containers or clipping elements. The Web Content Accessibility Guidelines (WCAG) dictate that users must be able to adjust spacing properties up to the following thresholds:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>Line height (leading):</strong> Must be adjustable to at least 1.5 times the font size.</li>
        <li><strong>Spacing following paragraphs:</strong> Must be adjustable to at least 2 times the font size.</li>
        <li><strong>Letter spacing (tracking):</strong> Must be adjustable to at least 0.12 times the font size.</li>
        <li><strong>Word spacing:</strong> Must be adjustable to at least 0.16 times the font size.</li>
      </ul>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        When using our <a href="/tools/paragraph-formatter" className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">Paragraph Formatter</a> or our <a href="/tools/fancy-text-generator" className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">Fancy Text Generator</a>, maintaining these guidelines ensures that your formatted copy remains perfectly readable when copied across modern word processors, mail clients, and social platforms.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="optimal-reading-line">The Optimal Measure: Reading Line Length</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        The horizontal length of a text block (known as the "measure") plays a crucial role in cognitive fatigue. If a line of text is too narrow, the reader's eyes must constantly dart back and forth, breaking reading rhythm. If a line is too wide, it becomes difficult for the eye to find the start of the next line, causing "double-reading" lines.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        The golden rule for standard desktop displays is to target a measure of **50 to 75 characters per line**, including spaces. In CSS layout design, this can be programmatically achieved using the <code>ch</code> character unit:
      </p>
      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-4 whitespace-pre-wrap">
{`.readable-article {
  max-width: 65ch; /* Caps container width at exactly 65 characters wide */
  margin-left: auto;
  margin-right: auto;
}`}
      </div>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      <div className="space-y-4 my-6">
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Why are sans-serif fonts preferred for standard screen reading?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Standard digital displays rely on pixels. Traditional serif fonts (with thin decorative terminal strokes) can render awkwardly on low-density screens, causing visual "blurriness". Modern sans-serif fonts have uniform line weight, keeping them crisp and legible across standard resolutions.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Should I use absolute pixels or rem for web typography sizing?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Always use relative <code>rem</code> units. Root em units dynamically respect the browser's base font configuration, allowing visually impaired users who scale up their baseline system fonts to navigate your application seamlessly without breaking visual layouts.
          </p>
        </div>
      </div>
    </>
  );
};
