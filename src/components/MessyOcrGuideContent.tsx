import React from 'react';

export const MessyOcrGuideContent: React.FC = () => {
  return (
    <>
      {/* Premium Badge / Introduction Section */}
      <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100/25 dark:border-indigo-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Premium Content Operations Resource</span>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            This comprehensive guide provides an authoritative, expert-level examination of the spatial layout mechanics of Portable Document Format (PDF) files and Optical Character Recognition (OCR) systems. It details why copying text from these formats ruins sentence flow, and provides step-by-step programmatic frameworks, regular expression patterns, and complete TypeScript engines to restore text continuities instantly.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Have you ever selected a block of text from an e-book, a scanned PDF research paper, or an image parsed via an Optical Character Recognition (OCR) tool, pasted it into your word processor or content management system (CMS), and watched in frustration as your beautifully formatted paragraph fractured into twenty jagged, single-sentence fragments? 
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-4">
        This structural layout corruption is one of the most pervasive digital bottlenecks in modern office environments, academic research, legal documentation, and creative copywriting workflows. Copying text from formatted media should be instantaneous, yet it frequently results in 15 to 30 minutes of tedious manual editing—pressing <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs text-slate-700 dark:text-slate-300">Backspace</kbd> and <kbd className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-xs text-slate-700 dark:text-slate-300">Space</kbd> at the boundary of every line to stitch sentences back together.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        To fix this issue permanently without resorting to slow manual labor, we must look at the underlying spatial architectures of PDF canvases and OCR layout recognition engines. By understanding the math and mechanics of text encoding, we can design robust, browser-side algorithmic pipelines that distinguish between mid-sentence soft line wraps and actual paragraph transitions, restoring text to its native fluid flow in milliseconds.
      </p>

      {/* SECTION 1: WHY COPYING FROM PDFS BREAKS LAYOUT */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="causes">Why Does Copying from PDFs Break Layouts?</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Unlike web pages, Markdown drafts, or rich text documents, Portable Document Format (PDF) files are **not flow-based formats**. When you write a document in a standard text editor, the program treats the text as a continuous, linear stream of characters. Lines wrap dynamically based on the width of your viewport or page margins. 
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Conversely, a PDF file is fundamentally designed to act as digital paper—preserving **absolute, fixed spatial dimensions** across different operating systems, devices, and printers. To achieve this rigid visual consistency, the internal structure of a PDF does not store paragraphs or fluid lines. Instead, it places text characters at absolute spatial coordinates (X and Y positions) on a physical canvas.
      </p>

      <blockquote className="border-l-4 border-indigo-500 pl-4 py-2 text-slate-650 dark:text-slate-350 font-serif italic text-sm my-6 bg-indigo-50/10 dark:bg-indigo-950/5 p-4 rounded-r-xl">
        &quot;A PDF document has no structural concept of a continuous sentence or a paragraph. Internally, it is simply a collection of instructions that tell the rendering engine to place specific letters at exact coordinate vectors on a canvas.&quot;
      </blockquote>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        When a PDF compiler converts a text document into a PDF, it determines where words must wrap to fit within the physical margins of the page. It then outputs each line of text as an independent spatial element. When you highlight and copy text from a PDF viewer:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li>The viewer extracts the characters line-by-line based on their vertical and horizontal boundaries.</li>
        <li>To mark the end of each physical line, the viewer&apos;s copy-paste routine appends a raw **carriage return (CR, `\r`)** or **line feed (LF, `\n`)** byte directly into the clipboard buffer.</li>
        <li>When you paste this text, your target application interprets these line-endings as literal paragraph breaks, splitting a single, fluid sentence into multiple fragmented lines.</li>
      </ul>

      {/* SECTION 2: THE MECHANICS OF OCR LINE SEGMENTATION */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="ocr-mechanics">The Mechanics of OCR: Optical Character Recognition Line Segmentation</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        The challenge of broken layout lines is amplified when dealing with Optical Character Recognition (OCR) engines (e.g., Tesseract OCR, Google Cloud Vision, or Adobe Acrobat Scan). OCR systems convert physical documents, paper books, or flat images back into editable text using a sophisticated multi-stage computer vision pipeline:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-indigo-500 font-mono">PHASE 1</span>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Layout & Column Analysis</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            The OCR engine processes the image to isolate dark text elements from the light background. It identifies blocks, columns, and embedded images to build a reading grid.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-indigo-500 font-mono">PHASE 2</span>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Line Segmentation</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            The engine calculates horizontal projection profiles to divide text blocks into individual lines, isolating bounding boxes for every line.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <span className="text-xs font-bold text-indigo-500 font-mono">PHASE 3</span>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Character Tokenization</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            Neural networks analyze characters within each line box, converting visual pixels into digital Unicode characters, then appending line-end breaks to output files.
          </p>
        </div>
      </div>

      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Because the segmentation step is critical to preserving reading order, OCR systems prioritize dividing text into discrete, horizontal rows. However, they rarely reconstruct the original paragraph flow. When saving or copying OCR outputs, the system appends a hard line break (`\n`) at the end of every recognized line, creating fragmented clipboard chunks.
      </p>

      {/* SECTION 3: THE INTUITIVE RESTORATION PIPELINE */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="restoration-pipeline">The Programmatic Restoration Pipeline: Preserving Intent</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Simply removing every line break from a copied text buffer is a flawed approach. While it successfully merges fragmented lines, it also collapses actual paragraph boundaries, flattening your multi-paragraph article, chapter, or legal brief into a single, unreadable wall of text.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        To preserve the author&apos;s original formatting, our <a href="/tools/remove-line-breaks" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Remove Line Breaks</a> utility uses a multi-phase string-cleaning pipeline. This algorithm distinguishes between mid-sentence soft line wraps and actual paragraph transitions:
      </p>

      <div className="my-6 space-y-4">
        <div className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">1</div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Paragraph Boundary Tokenization</h4>
            <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
              Real paragraphs are separated by empty lines (double line breaks: `\n\n` or `\n\r\n`). The engine first matches these double breaks and replaces them with a unique, secure placeholder token, such as `[PARAGRAPH_PLACEHOLDER]`.
            </p>
          </div>
        </div>
        <div className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">2</div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Single Line-Wrap Cleansing</h4>
            <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
              With real paragraph boundaries protected by placeholder tokens, the algorithm strips all remaining single line breaks (`\n`), replacing them with a single space character to stitch the broken sentence fragments back together.
            </p>
          </div>
        </div>
        <div className="flex gap-4 p-5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">3</div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Token Restitution & Spacing Normalization</h4>
            <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
              Finally, the algorithm swaps the `[PARAGRAPH_PLACEHOLDER]` tokens back to standard double line breaks (`\n\n`). It then runs a secondary normalization pass to remove any duplicate spaces or trailing whitespace, leaving you with perfectly structured paragraphs.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 4: STEP-BY-STEP PARAGRAPH CLEANING GUIDE */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="restoring">Step-by-Step Paragraph Cleaning Workflow</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Follow this simple, professional workflow to instantly repair messy clipboard layouts:
      </p>

      <ol className="list-decimal pl-5 space-y-4 text-slate-650 dark:text-slate-350 my-6">
        <li>
          <strong className="text-slate-800 dark:text-slate-200 text-xs block mb-1">Step 1: Copy from the Source Document</strong>
          <p className="text-xs leading-relaxed">
            Highlight the fragmented, multi-line text inside your PDF reader, web browser, or OCR scanner window and copy it to your clipboard.
          </p>
        </li>
        <li>
          <strong className="text-slate-800 dark:text-slate-200 text-xs block mb-1">Step 2: Paste Into the Formatting Workspace</strong>
          <p className="text-xs leading-relaxed">
            Navigate to our <a href="/tools/remove-line-breaks" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Remove Line Breaks</a> tool and paste the text into the large input workspace.
          </p>
        </li>
        <li>
          <strong className="text-slate-800 dark:text-slate-200 text-xs block mb-1">Step 3: Enable Paragraph Preservation</strong>
          <p className="text-xs leading-relaxed">
            Ensure the **&quot;Preserve Paragraph Breaks&quot;** option is checked. This tells the tool to keep real paragraph divisions while removing soft line wraps. You can also customize your separator character (defaults to a standard space).
          </p>
        </li>
        <li>
          <strong className="text-slate-800 dark:text-slate-200 text-xs block mb-1">Step 4: Execute and Clean Spacing</strong>
          <p className="text-xs leading-relaxed">
            Click the format button. The tool will process your text in milliseconds. If your OCR engine also added messy double or triple spaces between words, route the clean text through our <a href="/tools/remove-extra-spaces" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Remove Extra Spaces</a> tool to normalize spacing.
          </p>
        </li>
      </ol>

      {/* SECTION 5: ADVANCED EDGE CASES: HYPHENATION AND LIGATURES */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="advanced-edge-cases">Advanced Edge Cases: Resolving Hyphenation, Ligatures, and Column Spills</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        While removing simple line breaks solves 80% of layout issues, processing high-fidelity academic or medical papers introduces several complex typographic edge cases:
      </p>

      <div className="space-y-4 my-6">
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">1. End-of-Line Hyphenation Split</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Issue:</strong> To justify text columns, PDF engines often hyphenate words at the end of a line (e.g., splitting *&quot;multi-dimensional&quot;* into *&quot;multi-&quot;* on line 1 and *&quot;dimensional&quot;* on line 2). If you simply strip the line break, the hyphen remains, resulting in the misspelled word *&quot;multi-dimensional&quot;* containing unnecessary hyphens or trailing spaces.
            <br />
            <strong>The Programmatic Solution:</strong> A professional-grade cleaning engine uses a pre-processing regular expression to identify hyphens immediately preceding a line break and remove them, stitching the split word back together seamlessly.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">2. Unicode Ligature Collapses</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Issue:</strong> To optimize typography, PDF rendering engines often combine adjacent letters into a single visual glyph, known as a **ligature** (e.g., merging &quot;fi&quot;, &quot;fl&quot;, or &quot;ae&quot;). When copying text, some PDF parsers fail to translate these back to standard characters, resulting in missing letters or corrupt symbols.
            <br />
            <strong>The Programmatic Solution:</strong> Standardizing text encoding via clean Unicode normalization and mapping common ligature characters (such as `ﬁ` back to `f` + `i`) prevents spelling errors during the formatting process.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">3. Multi-Column Flow Overlaps</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Issue:</strong> When copying across dual-column journal pages, the clipboard reader may capture text horizontally across columns instead of reading down column 1 first, resulting in scrambled, unreadable sentences.
            <br />
            <strong>The Programmatic Solution:</strong> To prevent this, copy text from each column individually rather than selecting the entire page at once, allowing the layout cleaning tool to process each column&apos;s flow cleanly.
          </p>
        </div>
      </div>

      {/* SECTION 6: DEVELOPER BLUEPRINT - TYPESCRIPT ALGORITHM */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="developer-blueprint">Developer Blueprint: Building a Custom PDF & OCR Repair Engine in TypeScript</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        For software engineers, database managers, or developer advocates, automating text formatting within internal pipelines is critical. Below is a production-ready TypeScript implementation of a robust **PDF & OCR Layout Repair Engine** that handles paragraph preservation, removes end-of-line hyphens, and cleans up extra spacing in browser memory.
      </p>

      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-slate-700 dark:text-slate-300 my-4 whitespace-pre-wrap">
{`interface CleanTextOptions {
  preserveParagraphs: boolean;
  joinHyphenatedWords: boolean;
  normalizeWhiteSpaces: boolean;
}

export function repairPdfLayout(rawText: string, options: CleanTextOptions): string {
  if (!rawText) return '';

  let processed = rawText;

  // 1. Standardize all carriage returns to standard line feed characters
  processed = processed.replace(/\\r\\n/g, '\\n').replace(/\\r/g, '\\n');

  // 2. Handle end-of-line hyphenation splits (e.g., "coordi-\\nnate" -> "coordinate")
  if (options.joinHyphenatedWords) {
    // Matches a hyphen followed immediately by a single line break and optional whitespace
    processed = processed.replace(/(\\w+)-\\n\\s*(\\w+)/g, '$1$2');
  }

  // 3. Preserve or strip line breaks
  if (options.preserveParagraphs) {
    // Step A: Replace multi-break paragraph divisions with a secure placeholder
    const placeholder = '___PARAGRAPH_BOUNDARY_TOKEN___';
    
    // Catch double line breaks or line breaks separated by visual horizontal spacing
    processed = processed.replace(/\\n\\s*\\n/g, placeholder);

    // Step B: Replace all remaining single line breaks with a standard space
    processed = processed.replace(/\\n/g, ' ');

    // Step C: Restore the paragraph boundaries
    processed = processed.split(placeholder).join('\\n\\n');
  } else {
    // If not preserving paragraphs, convert all line breaks to single spaces
    processed = processed.replace(/\\n/g, ' ');
  }

  // 4. Normalize double spacing and trailing whitespace
  if (options.normalizeWhiteSpaces) {
    // Replace multiple spaces/tabs with a single space
    processed = processed.replace(/[ \\t]+/g, ' ');
    // Remove space padding immediately preceding or following line breaks
    processed = processed.replace(/ +\\n/g, '\\n').replace(/\\n +/g, '\\n');
    // Trim leading and trailing document whitespaces
    processed = processed.trim();
  }

  return processed;
}`}
      </div>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        This program uses clean string manipulation and regular expressions to resolve the primary layout issues introduced by PDF visual formatting engines.
      </p>

      {/* SECTION 7: COMMON PRODUCTIVITY PITFALLS */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="pitfalls">Common Layout Cleaning Pitfalls and How to Avoid Them</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        Optimizing your layout workflow requires avoiding several common formatting traps:
      </p>

      <div className="space-y-4 my-6">
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">1. Collapsing Code Snippets or Pre-Formatted Data</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Problem:</strong> Passing a technical document containing code snippets, tabular data, or bulleted lists through a line-break removal tool. Because code and lists rely on single line endings, stripping breaks ruins their structure.
            <br />
            <strong>The Fix:</strong> Format your text in sections. Copy and clean prose paragraphs using the line-break tool, but bypass code snippets or structured tables to preserve their formatting.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">2. Blindly stripping all hyphens</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Problem:</strong> Stripping all hyphens indiscriminately can accidentally merge words that are meant to be hyphenated (e.g., converting *&quot;self-esteem&quot;* to *&quot;selfesteem&quot;*).
            <br />
            <strong>The Fix:</strong> Use a selective regular expression (like the one in our developer blueprint) that only targets hyphens directly adjacent to line-ending bytes (`\n`), leaving mid-line hyphens untouched.
          </p>
        </div>
        <div className="p-5 bg-slate-50 dark:bg-[#111622] rounded-xl border border-slate-200 dark:border-slate-800">
          <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">3. Over-reliance on Auto-Formatting in Destination Editors</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            <strong>The Problem:</strong> Relying on standard word processors to fix layout issues. Most editors do not have tools to distinguish between soft line wraps and actual paragraph breaks, often creating messy double-spaces or broken layouts.
            <br />
            <strong>The Fix:</strong> Clean and format your text in a dedicated layout tool before pasting it into your final editor, ensuring clean, predictable formatting.
          </p>
        </div>
      </div>

      {/* SECTION 8: FAQs */}
      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mb-6">
        Explore detailed, expert answers to the most common questions about PDF visual architectures, OCR scanning, and clipboard formatting:
      </p>

      <div className="space-y-4 my-6">
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Why does pasting copied text into notepad sometimes keep lines broken, but Microsoft Word flows them naturally?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Notepad is a plain-text editor that renders every raw carriage return or line feed byte literally. Rich editors like Microsoft Word or Google Docs use formatting helpers that try to guess if a line break is a real paragraph break, but these guesses are often inaccurate and can lead to inconsistent formatting.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: How can I clean up double or triple spaces created by OCR text readers?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: OCR engines often add extra spaces to match the visual margins of the original page. After cleaning your line breaks, paste your text into our <a href="/tools/remove-extra-spaces" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Remove Extra Spaces</a> tool to quickly reduce all multiple spaces back to standard, clean single spaces.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: What is the difference between Carriage Return (\r) and Line Feed (\n)?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: These terms date back to physical typewriters. A **Carriage Return (`\r`)** returned the typewriter carriage to the start of the current line, while a **Line Feed (`\n`)** advanced the paper down by one line. Modern operating systems handle line endings differently: Windows uses both (`\r\n`), while macOS and Linux use just a line feed (`\n`). Our tools automatically standardize all line endings to prevent formatting errors.
          </p>
        </div>
        <div className="p-5 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Can I use this formatting workflow for languages other than English?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: Yes, our line-break removal algorithms are completely language-independent. They will clean text in French, Spanish, German, and other languages. However, some languages (like Chinese or Japanese) do not use spaces between words, so you should set the separator character to an empty string instead of a space.
          </p>
        </div>
      </div>

      {/* SECTION 9: SUMMARY & CHECKLIST */}
      <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 p-6 md:p-8 rounded-2xl text-center space-y-4 my-8" id="summary">
        <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans">Summary Checklist: Your Clipboard Formatting Routine</h3>
        <p className="text-xs text-slate-650 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Speed up your document workflow and keep your formatting clean with this quick checklist before pasting text into your editor:
        </p>
        <ul className="list-disc pl-5 text-left text-xs text-slate-650 dark:text-slate-450 space-y-2 max-w-lg mx-auto">
          <li><strong>Extract Columns Individually:</strong> Copy text column-by-column in multi-column PDFs to prevent scrambled sentences.</li>
          <li><strong>Preserve Paragraph Toggles:</strong> Keep &quot;Preserve Paragraph Breaks&quot; checked to maintain your document&apos;s structure.</li>
          <li><strong>Clean End-of-Line Hyphens:</strong> Remove hyphens at the end of lines to prevent spelling errors.</li>
          <li><strong>Normalize White Spaces:</strong> Use a spacing cleanup tool to remove any duplicate spaces or trailing whitespace.</li>
        </ul>
      </div>
    </>
  );
};
