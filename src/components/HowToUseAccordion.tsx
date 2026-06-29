import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { getFaqsForTool } from '../data/toolFaqs.ts';
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
  Settings
} from 'lucide-react';

interface HowToUseAccordionProps {
  toolId: string;
}

// Dedicated dynamic context instructions mapping
const TOOL_INSTRUCTIONS: {
  [key: string]: {
    summary: string;
    steps: string[];
    tips: string[];
    cases: string[];
  };
} = {
  'tools/readability-checker': {
    summary: 'The Readability Checker uses mathematical linguistics (Flesch-Kincaid) to score text readability and suggest style improvements locally.',
    steps: [
      'Enter or paste your text draft inside the large sandbox workspace.',
      'Analyze the Flesch Reading Ease score, grade level levels, and average structural lengths.',
      'Polish difficult sentences highlighted by the editor guidelines to optimize reading clarity.'
    ],
    tips: [
      'Target a Flesch score between 60 and 70 for general public blogs to maximize readability.',
      'Shorten long sentences exceeding 25 words to immediately boost grade level readability.'
    ],
    cases: [
      'Refining SEO web articles and medical/legal copy for lay audiences.',
      'Checking academic papers, essays, or public speeches for clear syntactic flows.'
    ]
  },
  'tools/grammar-checker': {
    summary: 'Analyze text spelling, basic grammar boundaries, typo patterns, and casing mistakes instantly within your sandboxed browser.',
    steps: [
      'Paste your content buffers directly into the sandboxed editor.',
      'Check standard mistake highlights indicating punctuation, typography, or spacing errors.',
      'Click highlighted errors to apply suggestions, or manually refine lines before copying.'
    ],
    tips: [
      'Use the "Load Sample" button to test standard punctuation and vocabulary corrections.',
      'Double-check spacing errors if your text comes from OCR scans or raw PDF documents.'
    ],
    cases: [
      'Polishing client-facing email drafts, marketing blogs, or school essay submissions.',
      'Locating accidental typos, weird capitalization, or incorrect spacing in raw text blocks.'
    ]
  },
  'tools/word-counter': {
    summary: 'The live Word Counter measures total words, characters, paragraph intervals, estimation timings, and isolates keyword occurrence densities.',
    steps: [
      'Begin typing or paste your content in the central input terminal.',
      'Read counts, including character boundaries, lines, and silent reading time on the sidebar.',
      'Inspect the Top Keyword Densities panel to analyze repeating terms and maintain professional density balance.'
    ],
    tips: [
      'Silent reading pacing is benchmarked at 225 WPM, while conversational speaking speeds track closer to 150 WPM.',
      'Filter keyword density results to ensure primary keywords do not exceed 2% limit guidelines.'
    ],
    cases: [
      'Writing essays, novels, or articles targeting precise word length milestones.',
      'Pacing presentation scripts, podcast narratives, and YouTube drafts with exact speaking time.'
    ]
  },
  'tools/sentence-counter': {
    summary: 'The Sentence Counter uses intelligent delimiters to compute the exact count of sentences in any pasted or written paragraph structure.',
    steps: [
      'Paste or draft your documentation inside the central workspace.',
      'Dynamic counters will instantly extract sentence amounts, total words, and structural densities.',
      'Check sentence lengths on the metrics board to see if sections are overly verbose.'
    ],
    tips: [
      'Our tool identifies endings (.!?), ignores consecutive symbols like ellipses (...), and processes unfinished terminal sentences.',
      'Vary your sentence lengths in a single paragraph to create an elegant reading rhythm.'
    ],
    cases: [
      'Optimizing marketing copy, where shorter, punchier sentences increase conversion metrics.',
      'Academic structural editing, where sentence density patterns signify paragraph maturity.'
    ]
  },
  'tools/keyword-density-checker': {
    summary: 'Isolate optimal term distribution percentages and compute repeating semantic weights for advanced SEO content optimization.',
    steps: [
      'Paste your draft copy or product descriptions into the sandboxed terminal.',
      'Verify the keyword frequency table categorizing single words, 2-word, or 3-word recurring phrases.',
      'Adjust counts by rewriting matching sentences to hit your target density metrics.'
    ],
    tips: [
      'Keep focus keyword density between 1% and 2.5% to avoid keyword stuffing penalties on search engines.',
      'Analyze 2-word and 3-word phrases to discover matching long-tail content alignment.'
    ],
    cases: [
      'Pre-auditing blog drafts, guest articles, or sales pages before publishing on the web.',
      'Analyzing landing page competitor text to discover repeating clusters and long-tail topics.'
    ]
  },
  'tools/character-counter': {
    summary: 'The Character Counter tracks strict limits containing or ignoring space structures, line tabs, and byte counts for absolute accuracy.',
    steps: [
      'Insert your social handles copy or SEO meta titles inside the editor.',
      'Review side numbers, checking limits against standard platforms (such as Twitter, SEO titles, SMS limits).',
      'Trim trailing spaces and double elements in one click to fit inside targeted limits.'
    ],
    tips: [
      'SEO meta titles should stay under 60 characters, and meta descriptions under 155-160 characters for ideal search layouts.',
      'Remember that Unicode symbols, emojis, and special accents can double character byte sizes in UTF-8 systems.'
    ],
    cases: [
      'Drafting short-form social posts (Twitter, LinkedIn) with hard character counts.',
      'Structuring website header variables, title tags, and meta descriptors during bulk updates.'
    ]
  },
  'tools/remove-line-breaks': {
    summary: 'Instantly flatten scrambled PDF, scan, or OCR copy layouts containing broken return characters and newline spaces.',
    steps: [
      'Paste the broken multiline text block inside the workspace.',
      'Choose whether to swap breaks with standard spaces, or specify a custom delimiter.',
      'Toggle paragraph preservation to protect double spacing, then click "Flatten paragraph wrap lines".'
    ],
    tips: [
      'Use custom separator delimiters like commas or vertical bars (|) to parse list columns into single-line formats.',
      'Double-check "Preserve Paragraph Breaks" when flattening multi-page eBook documents.'
    ],
    cases: [
      'Reformatting jagged PDF files, scanned emails, and optical character recognition (OCR) captures.',
      'Preparing raw data dumps, addresses, or numeric sets for Excel tables and coding scripts.'
    ]
  },
  'tools/remove-extra-spaces': {
    summary: 'A whitespace sanitizer tool that wipes trailing, multiple consecutive, or tab spaces from text layouts.',
    steps: [
      'Paste your messy code elements, markdown notes, or tables inside the text terminal.',
      'Checkbox spacing rules such as trimming lines, collapsing multiple spaces, or removing empty tabs.',
      'Click the whitespace purification button to acquire pristine, uniform line spaces.'
    ],
    tips: [
      'Clean double spaces and lines frequently if your content comes from scanning apps.',
      'Turn on "Trim margins" to strip residual empty space before pasting code constants.'
    ],
    cases: [
      'Cleaning draft documents filled with confusing paragraph distances and double space keys.',
      'Formatting code scripts, SQL dumps, or lists before executing compiler runs.'
    ]
  },
  'tools/remove-duplicate-lines': {
    summary: 'Filter listing datasets and strip redundant duplicate rows while keeping the original ordering sequence fully locally.',
    steps: [
      'Insert your raw directory indices, list strings, or email lines inside the textbox.',
      'Configure options to trim trailing spaces or ignore case states when identifying duplicates.',
      'Wipe duplicates and copy/download your unique list instantly.'
    ],
    tips: [
      'Use the case-insensitive toggle to treat "SampleData" and "sampledata" as direct duplicates.',
      'Our tool operates 100% locally: it can deduplicate massive 10,000-line datasets without lagging.'
    ],
    cases: [
      'Cleaning newsletter email lists, contacts, or catalog indices containing duplicate entries.',
      'Filtering keyword lists or programmatic sitemaps during search engine campaigns.'
    ]
  },
  'tools/remove-empty-lines': {
    summary: 'Strip blank paragraphs and redundant return lines from code sheets, records, or plain text articles.',
    steps: [
      'Paste your content showing excessive vertical gaps and line breaks into the sandbox.',
      'Toggle whether to delete completely empty rows or lines containing only spaces.',
      'Clean remaining content blocks to get beautifully compact text layouts.'
    ],
    tips: [
      'Collapse consecutive white rows into a single space layout to achieve subtle vertical breathing room.',
      'Pair this utility with space cleaners when correcting formatted output logs.'
    ],
    cases: [
      'Reducing massive space blocks in text parsed from scanned PDF manuscripts.',
      'Condensing scattered array code lines or dataset rows to make files highly readable.'
    ]
  },
  'tools/lorem-ipsum-generator': {
    summary: 'Draft custom, lightweight Latin placeholder texts structured as sentences, lists, or multiple paragraph blocks.',
    steps: [
      'Adjust generation sliders mapping paragraph blocks, sentence density, and line lengths.',
      'Choose standard Latin Lorem Ipsum, or run randomized mock words.',
      'Copy output text or save as a file for immediate wireframe integration.'
    ],
    tips: [
      'Check "Start with Lorem Ipsum" if you want the classic industry standard beginning.',
      'Vary paragraph and sentence sizes to mock natural-looking text on responsive card screens.'
    ],
    cases: [
      'Mocking web columns, bento grids, layout grids, or product components during design.',
      'Filling staging database profiles with clean mockup text variables.'
    ]
  },
  'tools/random-text-generator': {
    summary: 'Create custom placeholder English, corporate, business, or marketing dummy text with responsive paragraph bounds.',
    steps: [
      'Select a vocabulary theme (English Prose, Corporate Consulting, Marketing Pitch, or Plain Chat).',
      'Input the volume of paragraph, word, or line elements you need.',
      'Click generate to instantly review and copy stylized mock content.'
    ],
    tips: [
      'Use the "Corporate" style to generate dummy copy that sounds like standard business language.',
      'Use the "Marketing" profile to test typography blocks with punchy sales terminology.'
    ],
    cases: [
      'Drafting mockups, marketing wireframes, and design components with realistic copy structures.',
      'Testing client-facing layout prototypes using actual themed business placeholder texts.'
    ]
  },
  'tools/case-converter': {
    summary: 'Convert capitalization structures seamlessly between UPPER, lower, Title Case, Sentence Case, camelCase, snake_case, and kebab-case.',
    steps: [
      'Paste your text or coding lines inside the main input area.',
      'Choose your formatting model inside the capitalizer button grid.',
      'Extract the customized text straight back to your workspace.'
    ],
    tips: [
      'Use Sentence Case to fix broken lowercase emails or message drafts instantly.',
      'Use snake_case or kebab-case when converting plain strings to programmers standard codes.'
    ],
    cases: [
      'Correcting accidental Caps Lock text or messy, random-casing paragraphs.',
      'Formatting constants, CSS variables, URL paths, and file handles during software projects.'
    ]
  },
  'tools/text-compare': {
    summary: 'Double-check differences between two documents side-by-side. Highlights line modifications, added rows, and removed sentences.',
    steps: [
      'Insert your original source text inside the Left panel.',
      'Insert your revised draft or code inside the Right panel.',
      'Review green highlighted additions and red deletions, syncing alignments instantly.'
    ],
    tips: [
      'Use line-by-line comparison views to debug code lines or legal documents.',
      'Our comparison diff script executes natively in memory, keeping confidential documents completely private.'
    ],
    cases: [
      'Auditing content revisions, legal agreement versions, or code edits.',
      'Verifying if translation files or localization files correspond perfectly.'
    ]
  },
  'tools/slug-generator': {
    summary: 'Convert custom strings, headlines, or article titles into clean, lowercase, SEO-friendly URL slug strings.',
    steps: [
      'Insert your raw headline or blog title inside the input box.',
      'Configure options such as stripping stop-words (and, the, or) and removing custom punctuation.',
      'Review and copy the resulting lowercase slug (e.g. "how-to-optimize-seo-slug").'
    ],
    tips: [
      'Strip common stop-words when creating paths to keep slugs short and high-impact for SEO.',
      'Ensure slugs use only lowercase letters, numbers, and dashes. Avoid emojis or weird accents.'
    ],
    cases: [
      'Creating clean URL structures and file paths during bulk blogging processes.',
      'Setting folder names or API route path tags cleanly without spacing issues.'
    ]
  },
  'tools/url-encoder': {
    summary: 'Encode raw text or web tags into compliant percent notation for safe, secure internet transmission.',
    steps: [
      'Input the raw parameter values, headers, or URLs you wish to transmit.',
      'Choose encoding scope (Encode Full URL to preserve structure, or Encode All Special Characters).',
      'Copy the output percent-notation string to prevent transmission errors.'
    ],
    tips: [
      'Use full-url encode modes to preserve the core protocol header structures (http://, https://).',
      'Pair with decoders to verify query strings passed into backend services.'
    ],
    cases: [
      'Escaping API request payloads containing spaces, ampersands, or custom variables.',
      'Constructing robust social redirect links containing nested metadata parameters.'
    ]
  },
  'tools/url-decoder': {
    summary: 'Parse escaped percent-encoded strings back into legible, plain readable plain text.',
    steps: [
      'Insert your website link or escaped parameter string inside the text terminal.',
      'Toggle option parameters, including plus-to-space (+) replacement rules.',
      'Click decode to instantly recover clear UTF-8 characters.'
    ],
    tips: [
      'Plus symbols (+) in URL queries often represent spaces; keep "Plus to Space" active to fix them.',
      'If code has been encoded multiple times, pass the decoded output back through to clear remaining tags.'
    ],
    cases: [
      'Decrypting and reading tracking parameters in Google Analytics clicks.',
      'Extracting plain variables from complex email referral codes and search queries.'
    ]
  },
  'tools/fancy-text-generator': {
    summary: 'Generate stylish unicode fonts for social media profiles, bios, custom comments, and gaming nicks.',
    steps: [
      'Input plain letters or words inside the master textbox.',
      'Scroll through the custom previews displaying italic script, bold monospaces, double-struck, and gothic styles.',
      'Click any styled layout to copy the unicode design instantly to your clipboard.'
    ],
    tips: [
      'These are unicode variations, not standard fonts, so they will display correctly in emails and on platforms like Instagram.',
      'Use callout layouts sparingly to maximize screen reader accessibility for visually impaired users.'
    ],
    cases: [
      'Stylizing bio tags on platforms like Instagram, X, TikTok, and WhatsApp.',
      'Creating attention-grabbing headings for email newsletters, custom graphics, or game nicks.'
    ]
  },
  'tools/html-encoder': {
    summary: 'Translate raw markup code characters into secure HTML entities to prevent execution vulnerabilities.',
    steps: [
      'Paste your raw markup or nested coding lines inside the sandboxed editor.',
      'Choose encoding levels (Encode all special tags or only basic brackets).',
      'Acquire escaped entities that can be safely rendered on websites.'
    ],
    tips: [
      'Use complete hex entity formatting when publishing documentation code blocks.',
      'Escaping tags (< to &lt;) prevents platforms from executing foreign javascript programs.'
    ],
    cases: [
      'Formatting code components to display code snippets inside blog tutorials.',
      'Validating form inputs to block malicious cross-site scripting (XSS) actions.'
    ]
  },
  'tools/html-decoder': {
    summary: 'Revert HTML entity formulas back to original, readable web codes and scripting parameters.',
    steps: [
      'Enter escaped HTML datasets or raw entity terms into the viewport.',
      'Review realtime decoded source codes instantly.',
      'Copy or download original coding markups with correct tags.'
    ],
    tips: [
      'Decoded markup will show raw tags. Keep it inside the sandbox area to prevent security warnings.',
      'Our offline parser handles complex entity representations securely (like &amp;amp;, &amp;trade;, &amp;copy;).'
    ],
    cases: [
      'Restoring scrambled HTML layouts from copy-pasted email headers or log files.',
      'Inspecting template codes from web scrapers or analytics packages.'
    ]
  },
  'tools/base64-encoder': {
    summary: 'Encode UTF-8 texts safely into standard compliance, web-safe Base64 binaries.',
    steps: [
      'Paste your API auth keys, configs, or plain strings into the input container.',
      'Select format mode: Standard RFC 4648 or URL-safe character arrays.',
      'Click encode to preview and copy compliant base64 strings.'
    ],
    tips: [
      'Base64 strings are ideal for securely transmitting data over networks without losing metadata formatting.',
      'Use URL-safe mode to replace + and / with - and _ to prevent HTTP routing issues.'
    ],
    cases: [
      'Setting HTTP Basic Authentication headers or encoding web auth keys.',
      'Embedding small metadata strings or settings objects directly into link variables.'
    ]
  },
  'tools/base64-decoder': {
    summary: 'Decode encoded Base64 streams back into original, human-readable UTF-8 string text.',
    steps: [
      'Enter raw base64 data cards inside the sandboxed workspace.',
      'Our engine tests for valid padding, throwing readable warnings if there are typos.',
      'Copy recovered UTF-8 strings or export directly as a .txt document.'
    ],
    tips: [
      'Make sure that base64 padding markers (e.g. trailing = characters) are kept in the pasted text.',
      'If values are nested, use multiple passes to extract the underlying plain text.'
    ],
    cases: [
      'Unpacking config values, JSON tokens, tracking pixels, and encoded API keys.',
      'Verifying the underlying plain text of base64 values generated by system scripts.'
    ]
  },
  'tools/text-sorter': {
    summary: 'A fast list-arranger that organizes text rows alphabetically, sequentially, or randomly.',
    steps: [
      'Input raw listings, keywords, directories, or numeric lines inside the editor.',
      'Select sorting criteria (A-Z standard, Z-A descending, reverse line sequence, or shuffle randomized).',
      'Toggle helper controls like merging duplicate entries, and copy clean files.'
    ],
    tips: [
      'Our sort algorithm includes proper natural sorting: "Step 2" sorts before "Step 11".',
      'Use "Shuffle lines" to randomly distribute items, which is great for selecting random entries.'
    ],
    cases: [
      'Organizing shopping checklists, names lists, inventory sheets, or directory guides.',
      'Alphabetizing sitemap URL blocks, vocabulary items, or keyword lists.'
    ]
  },
  'tools/yaml-json-converter': {
    summary: 'A secure, bidirectional config translator that shifts datasets between YAML markup and JSON variables locally.',
    steps: [
      'Select your target conversion mode: YAML to JSON or JSON to YAML.',
      'Paste your configuration text (like Kubernetes manifests or docker-compose schemes) into the active textarea.',
      'Observe real-time validation and syntax highlight feedback. Address any parsing warnings if highlighted.',
      'Adjust indentation parameters (2-space or 4-space indent) and download or copy your converted schema.'
    ],
    tips: [
      'YAML is highly indentation-sensitive; ensure you do not mix tabs and spaces as this raises parser syntax errors.',
      'Use our bidirectional mode to quickly convert JSON API responses into YAML files for your local DevOps pipelines.'
    ],
    cases: [
      'Converting docker-compose configuration files or Kubernetes helm charts to structured JSON.',
      'Translating database schemas or API payloads back to clean YAML declarations for DevOps pipelines.'
    ]
  },
  'tools/uuid-generator': {
    summary: 'A cryptographically secure bulk generator that produces high-entropy Version 4 RFC-compliant UUIDs.',
    steps: [
      'Specify the number of unique identifiers you need to generate (up to 500 in a single batch).',
      'Toggle style checkboxes such as adding hyphens, converting to uppercase, or wrapping IDs inside curly brackets.',
      'Review generated UUID arrays printed in the local output box.',
      'Click Copy to clipboard or download the list as a clean, text-formatted registry file.'
    ],
    tips: [
      'Version 4 UUIDs use randomized hex combinations, offering a 1-in-2^122 chance of collisions, which is perfect for database primaries.',
      'Keep hyphens enabled if your database strictly conforms to standard string-based GUID/UUID formats.'
    ],
    cases: [
      'Generating high-entropy primary keys for relational databases like PostgreSQL or MySQL.',
      'Creating unique request tracking correlation IDs for distributed microservices or transaction logging.'
    ]
  },
  'tools/unix-timestamp-converter': {
    summary: 'An interactive date-time translator that decodes Unix epoch numbers into human-readable ISO stamps bidirectionally.',
    steps: [
      'Input your raw 10-digit (seconds) or 13-digit (milliseconds) epoch timestamp.',
      'View human-readable date strings parsed instantly in local timezones and UTC formats.',
      'To convert a human date back to Unix, utilize our interactive calendar form fields.',
      'Copy the output epoch seconds or formatted calendar ISO date stamp instantly.'
    ],
    tips: [
      'Epoch time represents the number of seconds elapsed since January 1, 1970 (UTC). Remember to adjust for timezone offsets.',
      'If your raw timestamp contains 13 characters, it is in millisecond format; toggle our millisecond checkbox for accurate conversions.'
    ],
    cases: [
      'Debugging API response logs displaying unformatted Unix timestamp metrics.',
      'Converting calendar scheduling dates to raw Epoch integers for storage in database tables.'
    ]
  },
  'tools/markdown-table-generator': {
    summary: 'An interactive visual table generator and grid editor that creates beautifully aligned Markdown, HTML, and CSV sheets.',
    steps: [
      'Use our visual grid interface to specify your desired row and column amounts.',
      'Click directly into any cell to type, format, or edit cell text.',
      'Configure visual formatting options like column text alignment (Left, Center, Right).',
      'Select your output tab (Markdown, HTML table markup, or standard CSV) and copy the generated tables.'
    ],
    tips: [
      'Visual alignment tags in Markdown use trailing colons (e.g. :---: for centered). Let our tool handle syntax spacing automatically.',
      'You can paste raw CSV text directly to load and visually format legacy tables inside our editor.'
    ],
    cases: [
      'Creating clean documentation tables for GitHub README files or technical project wikis.',
      'Formatting plain tabular text or spreadsheet copy into web-compliant HTML tables.'
    ]
  },
  'tools/text-to-speech': {
    summary: 'A secure offline TTS reader that synthesizes plain text blocks into natural-sounding voices locally in your browser.',
    steps: [
      'Write, edit, or paste your article drafts, scripts, or school essays into the textbox.',
      'Select your preferred synthesis voice from the dropdown menu populated with your device\'s local system voices.',
      'Adjust sliders for vocal speed (pacing rate) and frequency pitch to match your ideal tone.',
      'Click Play to hear your text read aloud, and use Pause or Stop controls to manage playback.'
    ],
    tips: [
      'Reading your draft text aloud using TTS is one of the most effective proofreading hacks for identifying passive voice and structural flow issues.',
      'Since we use your browser\'s native Web Speech API, this tool works entirely offline without consuming internet bandwidth.'
    ],
    cases: [
      'Proofreading blog drafts and essays by listening to vocal flows and sentence structures.',
      'Generating verbal instructions or vocal aids for users with visual or reading impairments.'
    ]
  },
  'tools/regex-tester': {
    summary: 'An interactive regular expression editor that tests, matches, and captures string patterns in real-time.',
    steps: [
      'Enter your regular expression pattern (e.g. ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-0.-]+\\.[a-zA-Z]{2,}$) into the regex bar.',
      'Input test strings or mock documents in the large content workspace.',
      'Configure regex flags such as Global (g), Case-insensitive (i), and Multiline (m).',
      'Instantly view highlighted expression matches, captured group listings, and syntax validity logs.'
    ],
    tips: [
      'Use the case-insensitive flag (i) to simplify your regex patterns instead of manually declaring upper and lower characters.',
      'Hover over matched highlights to view precise capture index indexes and matched word lengths.'
    ],
    cases: [
      'Validating form input fields (emails, zip codes, phone numbers) before writing production code.',
      'Parsing unstructured log datasets to isolate specific warning strings or system telemetry flags.'
    ]
  },
  'tools/jwt-decoder': {
    summary: 'A local sandbox utility that decodes JSON Web Token structures, extracting header attributes, payload parameters, and signatures securely.',
    steps: [
      'Paste your encoded three-part JSON Web Token (separated by dots) into the token input area.',
      'Observe immediate decoded outputs parsing headers, claims payload, and signature schemas.',
      'Verify expiration dates, issuer credentials, and user permissions printed in formatted JSON grids.',
      'Check the token state indicator representing active, expired, or malformed states.'
    ],
    tips: [
      'JSON Web Tokens are Base64Url encoded, not encrypted. Never store sensitive, private keys inside JWT claims payloads.',
      'Hover over individual fields to view ISO date conversions of expiration (exp) and issued-at (iat) time markers.'
    ],
    cases: [
      'Debugging user authentication credentials and token authorization claims during API integrations.',
      'Checking whether a client-side JSON Web Token is expired or carries invalid scopes.'
    ]
  },
  'tools/html-formatter': {
    summary: 'A local code beautifier that formats, pretty-prints, and indents nested HTML and XML markups or minifies them for speed.',
    steps: [
      'Insert your messy, unformatted, or single-line HTML/XML markup into the editor sandbox.',
      'Choose your preferred formatting structure: Pretty-Print Beautify or Compress Minify.',
      'Select indentation rules (2 spaces, 4 spaces, or Tab alignments) to match your codebase styles.',
      'Click the transform button to acquire neatly aligned tag hierarchies and clean nesting.'
    ],
    tips: [
      'Minification strips unnecessary whitespace, line feeds, and comment tags, which can reduce raw document load times up to 35%.',
      'Our formatter highlights unbalanced or unclosed HTML tags to prevent broken layouts on your production site.'
    ],
    cases: [
      'Cleaning cluttered markup generated by visual page builders or nested WYSIWYG editors.',
      'Compressing templates and email markups before deployment to maximize site delivery speeds.'
    ]
  }
};

const DEFAULT_INSTRUCTIONS = {
  summary: 'This fast, privacy-first text utility runs entirely in your web browser memory to compute metrics and format strings.',
  steps: [
    'Insert, write, or copy-paste your plain text blocks inside the workspace.',
    'Configure individual adjustment parameters to match your guidelines.',
    'Click transform buttons to apply formats dynamically without lagging.'
  ],
  tips: [
    'Your input data remains 100% private in memory. No files ever touch foreign databases.',
    'Use standard copy & clear workspace controls to speed up your content editing.'
  ],
  cases: [
    'Cleaning up drafts, code bases, CSV strings, or text logs.',
    'Polishing web articles or preparing files for publication.'
  ]
};

export default function HowToUseAccordion({ toolId }: HowToUseAccordionProps) {
  const [activeTab, setActiveTab] = useState<number | null>(0);
  const tool = TOOLS.find(t => t.id === toolId);
  const instruction = TOOL_INSTRUCTIONS[toolId] || DEFAULT_INSTRUCTIONS;

  if (!tool) return null;

  const faqs = getFaqsForTool(tool.id, tool.title, tool.description, tool.category, tool.keywords || []);

  // Dynamically inject the SEO-friendly Google FAQPage structured JSON-LD into the head
  useEffect(() => {
    const schemaId = `faq-schema-${tool.id.replace(/\//g, '-')}`;
    
    // Remove existing script if present to avoid duplications when navigating
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

  const toggleAccordion = (index: number) => {
    setActiveTab(activeTab === index ? null : index);
  };

  const sections = [
    {
      id: 0,
      title: 'Step-by-Step Practical Guide',
      icon: <Play className="w-4 h-4 text-emerald-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-medium">
            Follow these simple steps inside our application workspace to get flawless results instantly with our high-contrast interface:
          </p>
          <ol className="list-decimal pl-5 space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-sans font-medium leading-relaxed">
            {instruction.steps.map((step, idx) => (
              <li key={idx} className="marker:text-indigo-500 marker:font-bold">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )
    },
    {
      id: 1,
      title: 'Professional Tips & Pacing Hacks',
      icon: <Lightbulb className="w-4 h-4 text-amber-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-medium">
            Optimize your writing flow and boost utility performance with these specialized hacks:
          </p>
          <div className="flex flex-col gap-3">
            {instruction.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-2xl shadow-sm">
                <CheckCircle className="w-4 h-4 text-indigo-550 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: 'Common Enterprise Use Cases',
      icon: <Award className="w-4 h-4 text-indigo-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans font-medium">
            See how content writers, developers, and data specialists leverage other companion text utilities:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instruction.cases.map((useCase, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-850">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-xs uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" /> Case #{idx + 1}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 font-sans">
                  {useCase}
                </p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: 'Local Privacy & Security Architecture',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      content: (
        <div className="space-y-3.5">
          <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/15 border border-emerald-100/40 dark:border-emerald-900/30 rounded-2xl text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-405">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 block mb-1">✓ Sandboxed browser execution guarantee:</span>
            All calculation procedures are performed 100% locally client-side inside your own browser window. Absolute secrecy means no text buffers, custom keys, code constants, or draft essays are ever transmitted over network vectors or saved to any database. You are completely safe from data leaks.
          </div>
          <div className="flex items-center gap-3.5 flex-wrap pt-1.5 justify-center md:justify-start">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
              <Cpu className="w-3.5 h-3.5" /> Client-Side Memory Only
            </span>
            <span className="text-slate-300 dark:text-slate-800">|</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5" /> No Cookies Tracking
            </span>
            <span className="text-slate-300 dark:text-slate-800">|</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-450 dark:text-slate-500">
              <Sparkles className="w-3.5 h-3.5" /> GDPR Compliant
            </span>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16" id="tool-how-to-use-wrapper">
      <section className="py-8 pt-12 md:py-16 border-t border-slate-150 dark:border-slate-800" id="tool-how-to-use-section">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Block of informational layout */}
          <div className="text-center mb-10 select-none">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-705 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-900/40">
              <BookOpen className="w-3.5 h-3.5 animate-pulse" /> Dynamic User Guide
            </span>
            <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-3.5">
              How to Use our <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">{tool.title}</span> Tool
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed">
              {instruction.summary}
            </p>
          </div>

          {/* Dynamic Accordion list layout */}
          <div className="flex flex-col gap-4">
            {sections.map((section) => {
              const isExpanded = activeTab === section.id;
              return (
                <div 
                  key={section.id}
                  className={`border rounded-2xl bg-white dark:bg-slate-950 transition-all duration-300 ${
                    isExpanded 
                      ? 'border-indigo-500/50 ring-2 ring-indigo-500/5 dark:border-indigo-400/50 shadow-md' 
                      : 'border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-750'
                  }`}
                  id={`how-to-use-item-${section.id}`}
                >
                  {/* Accordion Trigger Button */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(section.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left font-sans select-none focus:outline-none"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl transition-colors ${
                        isExpanded 
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650' 
                          : 'bg-slate-50 dark:bg-slate-900 text-slate-504'
                      }`}>
                        {section.icon}
                      </div>
                      <span className={`text-sm sm:text-base font-bold transition-colors ${
                        isExpanded ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-105'
                      }`}>
                        {section.title}
                      </span>
                    </div>
                    
                    <div className={`text-slate-400 hover:text-slate-650 dark:hover:text-slate-205 transition-transform duration-250 ${
                      isExpanded ? 'rotate-180 text-indigo-500' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4 sm:w-5 h-5" />
                    </div>
                  </button>

                  {/* Animated content pane */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1, transition: { height: { duration: 0.25, ease: 'easeOut' }, opacity: { duration: 0.2, delay: 0.05 } } }}
                        exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.2, ease: 'easeIn' }, opacity: { duration: 0.15 } } }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-1 border-t border-slate-150 dark:border-slate-900 leading-relaxed">
                          {section.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Visually Appealing, Always-Visible FAQs Section */}
      <section className="py-12 border-t border-slate-150 dark:border-slate-800" id="tool-faqs-visible-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 select-none">
            <span className="inline-flex items-center gap-1.5 py-1 px-3 bg-indigo-55/10 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold font-sans uppercase tracking-widest rounded-full border border-indigo-100 dark:border-indigo-950">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-500" /> Frequently Asked Questions
            </span>
            <h3 className="text-3xl font-light font-display tracking-tight text-slate-950 dark:text-white mt-3.5">
              Answers &amp; Insights about <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-400">{tool.title}</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto leading-relaxed font-sans">
              Find immediate answers regarding the utilities, local browser calculations, and privacy features of our free online {tool.title} suite.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq) => (
              <div 
                key={faq.id} 
                className="p-5 bg-white dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 hover:border-indigo-500/20 dark:hover:border-indigo-400/20 rounded-2xl flex flex-col gap-2.5 shadow-sm hover:shadow-md transition-all duration-300 group"
                id={`faq-item-${faq.id}`}
              >
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-start gap-2.5">
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-lg shrink-0 mt-0.5 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-950/60 transition-colors">Q{faq.id}</span>
                  <span className="leading-snug">{faq.question}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-1 sm:pl-9 font-sans">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
