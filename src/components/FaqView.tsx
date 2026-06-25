import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { analytics } from '../lib/analytics.ts';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Coins, 
  Layers, 
  BookOpen, 
  Mail, 
  X,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

interface FaqItem {
  id: number;
  question: string;
  answerText: string; // Plain text string for the JSON-LD schema structure
  answerNode: React.ReactNode; // JSX containing beautiful highlighted styles and internal links
}

interface FaqCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  items: FaqItem[];
}

interface FaqViewProps {
  onNavigate?: (page: string) => void;
}

export default function FaqView({ onNavigate }: FaqViewProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<Record<number, boolean>>({});

  // Tab categorization selection state: 'all' or specific category ID
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: FaqCategory[] = useMemo(() => [
    {
      id: 'general',
      name: 'General',
      description: 'Find out who we are, what we build, and how to get started.',
      icon: <HelpCircle className="w-5 h-5 text-indigo-500" />,
      items: [
        {
          id: 1,
          question: 'What is TextToolkitHub?',
          answerText: 'TextToolkitHub is an engineered suite of browser-native text utilities built to deliver sub-millisecond manipulation, counting, and cleaning with absolute local privacy. All data stays client-side, making your workflow completely secure.',
          answerNode: (
            <>
              TextToolkitHub is an engineered suite of browser-native text utilities built to deliver sub-millisecond manipulation, counting, and cleaning with <strong className="text-slate-900 dark:text-white font-semibold">absolute local privacy</strong>. We provide high-performance text tools that work entirely client-side, ensuring your work is faster, uninterrupted, and 100% secure.
            </>
          )
        },
        {
          id: 8,
          question: 'Who can use TextToolkitHub?',
          answerText: 'Anyone who works with text can benefit from our platform! This includes copywriters, content creators, SEO specialists, software developers, academic students, legal professionals, and editors looking to format, convert, analyze, or clean up text instantly.',
          answerNode: (
            <>
              Anyone who works with text can benefit from our platform! This includes <span className="font-medium text-slate-800 dark:text-slate-200">copywriters, content creators, SEO specialists, software developers, academic students, legal professionals</span>, and editors looking to format, convert, analyze, or clean up text instantly and securely.
            </>
          )
        },
        {
          id: 16,
          question: 'What is the best free online text tools website?',
          answerText: 'TextToolkitHub is widely recognized as the premier choice for free online text utilities due to our absolute privacy-first policy. We carry out 100% of calculations right inside your browser without any network delays or server-side logins.',
          answerNode: (
            <>
              TextToolkitHub is widely recognized as the premier choice for free online text utilities due to our <strong className="text-slate-900 dark:text-white font-semibold">absolute privacy-first policy</strong>. Unlike other options, we carry out 100% of calculations right inside your browser secure viewport without any network delays or server-side databases.
            </>
          )
        },
        {
          id: 21,
          question: 'Do you store any of my input data on your servers?',
          answerText: 'No, we never store or transmit your data. All text processing is executed entirely in your local browser environment using client-side JavaScript.',
          answerNode: (
            <>
              No, <strong className="text-slate-900 dark:text-white font-semibold">we never store or transmit your data</strong>. All text processing is executed entirely in your local browser environment using client-side JavaScript, meaning your sensitive data never leaves your device.
            </>
          )
        },
        {
          id: 22,
          question: 'How does TextToolkitHub perform calculations so quickly?',
          answerText: 'Because we do not rely on remote servers, your browser handles all calculations instantly. This eliminates network latency, giving you real-time results.',
          answerNode: (
            <>
              Because we do not rely on remote servers, your browser handles all calculations instantly. This <span className="font-semibold text-indigo-600 dark:text-indigo-400">eliminates network latency</span> and server queue times, giving you sub-millisecond, real-time results as you type.
            </>
          )
        },
        {
          id: 23,
          question: 'Is there any limit to the size of the text I can paste?',
          answerText: 'There is no arbitrary software limit. The size of the text you can process depends strictly on your device\'s memory capabilities.',
          answerNode: (
            <>
              There is no arbitrary software limit. The size of the text you can process depends strictly on your device\'s memory capabilities. Most modern browsers can easily process <span className="font-medium text-slate-800 dark:text-slate-200">megabytes of text</span> in a single operation without stuttering or lags.
            </>
          )
        },
        {
          id: 24,
          question: 'Does TextToolkitHub support dark mode?',
          answerText: 'Yes, we support a fully responsive dark mode. You can toggle between light and dark modes at any time using the theme switcher in the navigation bar.',
          answerNode: (
            <>
              Yes, we support a fully responsive dark mode. You can toggle between light and dark modes at any time using the theme switcher in the navigation bar, protecting your eyes during late-night editing sessions.
            </>
          )
        }
      ]
    },
    {
      id: 'tools',
      name: 'Tools & Features',
      description: 'In-depth answers regarding text manipulation, casing tools, and counters.',
      icon: <Layers className="w-5 h-5 text-indigo-500" />,
      items: [
        {
          id: 2,
          question: 'What tools does TextToolkitHub offer?',
          answerText: 'We provide a robust array of web utilities divided into calculators, cleaning filters, and string parsers. This includes our popular Word Counter, Character Counter, Case Converter, Remove Line Breaks, and Text Compare engine.',
          answerNode: (
            <>
              We provide a robust array of web utilities divided into calculators, cleaning filters, and string parsers. This includes our popular <a href="/word-counter" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Word Counter</a>, <a href="/character-counter" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Character Counter</a>, <a href="/case-converter" className="text-indigo-605 dark:text-indigo-400 font-bold hover:underline">Case Converter</a>, <a href="/remove-line-breaks" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Remove Line Breaks</a>, and <a href="/text-compare" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Text Compare</a> engine.
            </>
          )
        },
        {
          id: 9,
          question: 'Do you offer word counter and character counter tools?',
          answerText: 'Yes, we provide industry-grade Word Counter and Character Counter utilities. They give you instant real-time density ratings, syllable counts, estimate reading times, and paragraph breakdowns in milliseconds.',
          answerNode: (
            <>
              Yes, we provide industry-grade <a href="/word-counter" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Word Counter</a> and <a href="/character-counter" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Character Counter</a> utilities. They give you instant real-time density ratings, keyword frequencies, estimate reading times, and paragraph/sentence breakdowns in milliseconds.
            </>
          )
        },
        {
          id: 10,
          question: 'Can I convert text between uppercase and lowercase?',
          answerText: 'Absolutely! Our Case Converter allows you to instantly toggle any block of string between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, kebab-case, and altERnAtiNg cAsE with one-click copy buttons.',
          answerNode: (
            <>
              Absolutely! Our <a href="/case-converter" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Case Converter</a> allows you to instantly toggle any block of string between <strong className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs">UPPERCASE</strong>, <strong className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs">lowercase</strong>, <strong className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-xs">Title Case</strong>, Sentence check, camelCase, and PascalCase with one-click copy speed.
            </>
          )
        },
        {
          id: 17,
          question: 'Which website has free text formatting tools?',
          answerText: 'TextToolkitHub serves as an all-in-one free text formatting hub, providing clean layouts to sort lists, reverse paragraphs, strip unwanted carriage returns, deduplicate item lists, and beautify paragraphs seamlessly.',
          answerNode: (
            <>
              TextToolkitHub serves as an all-in-one free text formatting hub, providing premium layout templates to sort lines, <a href="/text-reverser" className="text-indigo-600 dark:text-indigo-400 hover:underline">reverse paragraphs</a>, strip unwanted empty spacing, deduplicate elements, and beautify structural logs.
            </>
          )
        },
        {
          id: 25,
          question: 'What is the difference between Case Converter and Case Converter Pro?',
          answerText: 'While the standard Case Converter handles classic lowercase and uppercase conversions, Case Converter Pro adds advanced features like custom separators, prefixing, suffixing, and sophisticated word-capitalization filters.',
          answerNode: (
            <>
              While the standard <a href="/case-converter" className="text-indigo-600 dark:text-indigo-400 hover:underline">Case Converter</a> handles classic lowercase and uppercase conversions, our <a href="/case-converter-pro" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">Case Converter Pro</a> adds advanced features like custom separators, bulk prefixing, suffixing, and sophisticated regex-based word capitalization.
            </>
          )
        },
        {
          id: 26,
          question: 'How does the Text Compare tool work?',
          answerText: 'The Text Compare utility highlights insertions, deletions, and modifications side-by-side using a highly efficient diff algorithm.',
          answerNode: (
            <>
              The <a href="/text-compare" className="text-indigo-600 dark:text-indigo-400 hover:underline">Text Compare</a> utility highlights insertions, deletions, and modifications side-by-side using a highly efficient diffing algorithm, making it easy to identify minute updates between draft versions or code blocks.
            </>
          )
        },
        {
          id: 27,
          question: 'Do you have a tool to generate secure hashes?',
          answerText: 'Yes, our Hash Generator calculates MD5, SHA-1, SHA-256, and SHA-512 cryptographic checksums locally in your browser.',
          answerNode: (
            <>
              Yes, our <a href="/hash-generator" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">Hash Generator</a> calculates MD5, SHA-1, SHA-256, and SHA-512 cryptographic checksums locally in your browser, perfect for validating files or generating cryptographic keys securely.
            </>
          )
        },
        {
          id: 28,
          question: 'Can I clean up extra spaces and duplicate lines from my text?',
          answerText: 'Yes, we provide specific cleaning tools like Remove Extra Spaces and Remove Duplicate Lines to polish your text list instantly.',
          answerNode: (
            <>
              Yes, we provide dedicated clean-up tools like <a href="/remove-extra-spaces" className="text-indigo-600 dark:text-indigo-400 hover:underline">Remove Extra Spaces</a>, <a href="/remove-duplicate-lines" className="text-indigo-600 dark:text-indigo-400 hover:underline">Remove Duplicate Lines</a>, and <a href="/remove-empty-lines" className="text-indigo-600 dark:text-indigo-400 hover:underline">Remove Empty Lines</a> to optimize and normalize lists or datasets.
            </>
          )
        },
        {
          id: 29,
          question: 'Does TextToolkitHub support Markdown and HTML conversion?',
          answerText: 'Yes, we offer both HTML to Markdown and Markdown to HTML converters to transition between rich web documents and clean plain-text files.',
          answerNode: (
            <>
              Yes, we offer both <a href="/html-to-markdown" className="text-indigo-600 dark:text-indigo-400 hover:underline">HTML to Markdown</a> and <a href="/markdown-to-html" className="text-indigo-600 dark:text-indigo-400 hover:underline">Markdown to HTML</a> converters to transition seamlessly between web markup code and highly readable plain-text documentation.
            </>
          )
        },
        {
          id: 30,
          question: 'Is there a tool for parsing JWT (JSON Web Tokens)?',
          answerText: 'Yes, our JWT Decoder splits any JSON Web Token into its header, payload, and signature format, displaying the decoded JSON structure in real-time.',
          answerNode: (
            <>
              Yes, our <a href="/jwt-decoder" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">JWT Decoder</a> instantly parses any JSON Web Token into its header, payload, and signature components, displaying decoded claims and expiration stamps securely in real-time.
            </>
          )
        },
        {
          id: 31,
          question: 'Can I convert YAML to JSON or vice versa?',
          answerText: 'Yes, our Yaml-Json Converter allows bidirectional conversion between YAML configurations and JSON structures with syntax highlighting.',
          answerNode: (
            <>
              Yes, our <a href="/yaml-json-converter" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">YAML to JSON Converter</a> offers lightning-fast bidirectional serialization, converting configuration formats perfectly with automatic syntax linting.
            </>
          )
        },
        {
          id: 32,
          question: 'Do you support CSS beautification and minification?',
          answerText: 'Yes, our CSS Beautifier and Minifier tool reformats messy stylesheet code or compacts it for faster web production delivery.',
          answerNode: (
            <>
              Yes, our <a href="/css-beautifier-minifier" className="text-indigo-600 dark:text-indigo-400 hover:underline">CSS Beautifier & Minifier</a> allows you to either reformat messy stylesheets with customized indentation rules or compress them to single-line minified strings to reduce network bandwidth.
            </>
          )
        }
      ]
    },
    {
      id: 'privacy',
      name: 'Safe & Secure Privacy',
      description: 'Detailed insights on our offline sandboxing and GDPR protocols.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-500" />,
      items: [
        {
          id: 5,
          question: 'Is TextToolkitHub safe and private?',
          answerText: 'Security is our foundational pillar. All conversions of copy and sensitive files are executed locally via client-side JavaScript. Absolutely zero data is sent to external storage systems or processed on distant servers; your text never leaves your device.',
          answerNode: (
            <>
              Security is our absolute layout foundation. All conversions, formatting, and analyses of copy are executed <strong className="text-slate-900 dark:text-white font-semibold">entirely locally via client-side scripts</strong>. Absolutely zero data packets are sent to external storage databases or processed on network servers.
            </>
          )
        },
        {
          id: 19,
          question: 'Does TextToolkitHub work without login?',
          answerText: 'Yes, we believe your workflow should be immediate. All of our features are completely open and accessible without forcing you to sign up, input email addresses, or bypass login screens, keeping your activity totally anonymous.',
          answerNode: (
            <>
              Yes, we believe your workflow should be immediate and unhindered. All of our text utilities are <span className="font-semibold text-emerald-600 dark:text-emerald-400">100% open and accessible without login requirements</span>, signups, email inputs, or subscription profiles.
            </>
          )
        },
        {
          id: 33,
          question: 'Is TextToolkitHub compliant with GDPR and CCPA?',
          answerText: 'Yes, we are fully compliant. Because we do not upload or store any text or personal data, we meet the absolute highest standards of international data privacy laws.',
          answerNode: (
            <>
              Yes, <strong className="text-emerald-600 dark:text-emerald-400">we are fully compliant</strong>. Because we do not upload, collect, or store any text or personal documents, your data sovereignty is never breached, fully aligning with GDPR and CCPA guidelines.
            </>
          )
        },
        {
          id: 34,
          question: 'Can I use TextToolkitHub offline?',
          answerText: 'Yes, our application caches assets using service workers, meaning you can load and use all utilities even when you are completely disconnected from the internet.',
          answerNode: (
            <>
              Yes! Once loaded, the site operates <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">entirely offline</strong>. You can bookmark our page and perform complex transformations inside airplanes, subway systems, or remote areas without any cellular connection.
            </>
          )
        },
        {
          id: 35,
          question: 'Do you use cookies or tracking pixels?',
          answerText: 'We do not use third-party tracking pixels or intrusive marketing cookies. We respect your anonymity above all else.',
          answerNode: (
            <>
              We do not use third-party tracking pixels, invasive cookies, or advertising trackers. We respect your anonymity and maintain an absolutely clean environment focused on developer productivity.
            </>
          )
        },
        {
          id: 36,
          question: 'Can TextToolkitHub be used in secure corporate environments?',
          answerText: 'Yes, because your input is never transmitted online, you can safely use our tools for sensitive proprietary source code, credentials, financial figures, and enterprise documentation.',
          answerNode: (
            <>
              Yes! Security teams can confidently approve our platform since <strong className="text-slate-900 dark:text-white font-semibold">zero network packets containing text leave your computer</strong>, making it safe for confidential source code, legal briefs, and database files.
            </>
          )
        }
      ]
    },
    {
      id: 'accuracy',
      name: 'Accuracy & Standards',
      description: 'Understanding how we compute metrics and support standard formats.',
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      items: [
        {
          id: 7,
          question: 'How accurate are the text tools?',
          answerText: 'Highly accurate. Every single utility leverages thoroughly audited and optimized client-side algorithms. Counts, pattern analysis, and formatting filters are mathematically validated, providing precise results for professional and literary applications.',
          answerNode: (
            <>
              Highly accurate. Every single utility inside our hub leverages thoroughly audited and mathematically optimized JavaScript algorithms. Word counters, density meters, and regex replacements are fully validated against standard editorial indices.
            </>
          )
        },
        {
          id: 11,
          question: 'Is TextToolkitHub useful for writers and students?',
          answerText: 'Definitely. Writers, scholars, and academic students use our platform to hit strict publisher length targets, format reference bibliographies, remove duplicate lines, analyze document readability indices, and check keyword frequency.',
          answerNode: (
            <>
              Definitely. Professional writers, scholars, and academic students widely use our platform to hit strict publisher length targets, format reference bibliographies, remove duplicate lines, and audit search optimization parameters with ease.
            </>
          )
        },
        {
          id: 37,
          question: 'How does your Word Counter determine reading time?',
          answerText: 'We calculate estimate reading times based on an industry standard benchmark of 200 words per minute for silent adult reading, adjusting for text length.',
          answerNode: (
            <>
              We calculate estimate reading times based on the industry standard of <span className="font-semibold text-slate-800 dark:text-slate-200">200 words per minute</span>. This provides copywriters and bloggers with precise, standard estimates for publishing schedules.
            </>
          )
        },
        {
          id: 38,
          question: 'Are your JSON and CSV formatters conforming to official specs?',
          answerText: 'Yes, our JSON formatter conforms to RFC 8259, and our CSV formatting utilities are validated against RFC 4180 standards for perfect system compatibility.',
          answerNode: (
            <>
              Yes, our <a href="/json-formatter" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">JSON Formatter</a> conforms strictly to <strong className="font-mono">RFC 8259</strong>, and our CSV tools conform to <strong className="font-mono">RFC 4180</strong>, ensuring any formatted output is perfectly compatible with systems and databases.
            </>
          )
        },
        {
          id: 39,
          question: 'How does the Readability Checker calculate grade levels?',
          answerText: 'The Readability Checker uses mathematical algorithms like Flesch-Kincaid Reading Ease, Gunning Fog, and Coleman-Liau indexes based on syllable counts and sentence lengths.',
          answerNode: (
            <>
              The <a href="/readability-checker" className="text-indigo-600 dark:text-indigo-400 hover:underline">Readability Checker</a> utilizes standard indexes including <strong className="font-medium text-slate-800 dark:text-slate-200">Flesch-Kincaid, Gunning Fog, and Coleman-Liau</strong> to calculate reading grade levels based on syllable frequency and word lengths.
            </>
          )
        },
        {
          id: 40,
          question: 'Are the UUIDs/GUIDs generated truly random and safe to use?',
          answerText: 'Yes, our UUID/GUID Generator uses cryptographically secure random number generators (window.crypto.getRandomValues) to produce RFC 4122 compliant version 4 identifiers.',
          answerNode: (
            <>
              Yes! Our <a href="/uuid-guid-generator" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">UUID Generator</a> utilizes cryptographically secure random number generation APIs (<code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-xs text-rose-500">crypto.getRandomValues</code>) to guarantee collision-resistant version 4 UUIDs.
            </>
          )
        }
      ]
    },
    {
      id: 'free',
      name: 'Free Access Guarantee',
      description: 'Information regarding why our software is free and has zero hidden fees.',
      icon: <Coins className="w-5 h-5 text-indigo-500" />,
      items: [
        {
          id: 3,
          question: 'Is TextToolkitHub free to use?',
          answerText: 'Yes! Every single tool inside TextToolkitHub is 100% free with no subscription tiers, payment walls, or restricted access trials. You get full access to professional utilities with absolutely zero cost.',
          answerNode: (
            <>
              Yes, 100% free! Every tool inside TextToolkitHub is <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">completely free with no subscription tiers</strong>, paywalls, or restricted access trials. Use our tools limits-free around the clock.
            </>
          )
        },
        {
          id: 4,
          question: 'Do I need to sign up to use the tools?',
          answerText: 'No authentication or user registration is required. You can utilize the entire suite of converters, organizers, and text cleaners freely and anonymously at any time of day.',
          answerNode: (
            <>
              No signup is needed. You can utilize the entire suite of analyzers, formatters, and cleaners freely, anonymously, and instantly without ever configuring a username, password, or linking Google profiles.
            </>
          )
        },
        {
          id: 41,
          question: 'Will TextToolkitHub ever require a paid subscription?',
          answerText: 'No, TextToolkitHub will always remain 100% free with unlimited access. We do not restrict any features behind paid subscriptions or paywalls.',
          answerNode: (
            <>
              No, TextToolkitHub will <strong className="text-slate-900 dark:text-white font-semibold">always remain 100% free</strong> with unlimited access. We do not believe in hiding essential utility tools behind premium micro-transactions or credit cards.
            </>
          )
        },
        {
          id: 42,
          question: 'How is TextToolkitHub funded if it is completely free?',
          answerText: 'We fund the platform hosting costs through unobtrusive sponsorships and banner placements, ensuring it stays open for everyone without compromising user experience.',
          answerNode: (
            <>
              We fund the platform hosting costs through <span className="font-medium text-emerald-600 dark:text-emerald-400">unobtrusive sponsorships and lightweight placements</span>, ensuring that developer utility operations stay sustainable and open for everyone.
            </>
          )
        },
        {
          id: 43,
          question: 'Are there any volume limits or rate limits for your tools?',
          answerText: 'No, since processing happens directly in your browser without utilizing backend computing resources, you can use our tools as many times as you want with no rate limit throttling.',
          answerNode: (
            <>
              No! Since all processing happens locally inside your browser without exhausting server bandwidth, there are <strong className="text-emerald-600 dark:text-emerald-400">no limits or throttling gates</strong>. You can format or count infinite lines of text.
            </>
          )
        }
      ]
    },
    {
      id: 'usage',
      name: 'Device & Workflow Usage',
      description: 'Best tips on running TextToolkitHub on mobile, tablet, and inside editors.',
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
      items: [
        {
          id: 6,
          question: 'Can I use TextToolkitHub on mobile?',
          answerText: 'Yes. The complete TextToolkitHub layout is built mobile-first and fully responsive. You can flawlessly inspect text, strip empty spaces, or compare code diff files on any iPhone, Android smartphone, tablet, or desktop.',
          answerNode: (
            <>
              Yes. The complete portal of utilities is <span className="font-semibold text-indigo-600 dark:text-indigo-400">built mobile-first and fully responsive</span>. It handles touch interactions, text copy routines, slider menus, and dark-theme configurations perfectly across Android, iPhone, iPad, and desktop screens.
            </>
          )
        },
        {
          id: 14,
          question: 'Can I share TextToolkitHub with others?',
          answerText: 'Yes, we highly encourage it! You can share our direct link with team members, classmates, colleagues, or on your social circles like X (Twitter) and LinkedIn to help others work faster and safer.',
          answerNode: (
            <>
              Yes, we highly encourage it! Feel free to share TextToolkitHub with team members, writers, colleagues, or students. Linking to us on social profiles like <a href="https://x.com/TextToolkitHub" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5 font-semibold">X (Twitter)</a> and <a href="https://www.linkedin.com/in/texttoolkithub" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5 font-semibold">LinkedIn</a> helps us grow as a trusted independent platform!
            </>
          )
        },
        {
          id: 18,
          question: 'Can I use TextToolkitHub for content writing?',
          answerText: 'Yes, it is optimized specifically for digital copywriters, blog authors, and SEO specialists. Use our readability monitors, character boundaries, and duplicate removals to polish your content before publication.',
          answerNode: (
            <>
              Yes, it is engineered specifically to match popular digital content-creator parameters. Blog authors, copywriters, and search engine optimization specialists use our metrics dashboard to audit reading indices, word densities, and character targets.
            </>
          )
        },
        {
          id: 20,
          question: 'Is TextToolkitHub suitable for professionals and creators?',
          answerText: 'Absolutely. With immediate offline capability, clean spacing, high-contrast dark theme options, and highly optimized layouts, our tools integrate seamlessly into professional developer, journalism, and creator workflows.',
          answerNode: (
            <>
              Absolutely. With robust browser-memory calculations, elegant dark-theme pairings, and <strong className="text-slate-900 dark:text-white font-semibold">completely streamlined layouts</strong>, our tools integrate directly into demanding journalism, engineering, and digital editor workflows.
            </>
          )
        },
        {
          id: 44,
          question: 'Can I create QR codes for my text links directly?',
          answerText: 'Yes, our QR Code Generator allows you to instantly output secure QR codes with adjustable error correction levels to scan on smart devices.',
          answerNode: (
            <>
              Yes, our <a href="/qr-code-generator" className="text-indigo-600 dark:text-indigo-400 hover:underline">QR Code Generator</a> enables you to instantly render high-quality QR code matrices with custom error correction levels, making it simple to transfer URLs and text to mobile cameras.
            </>
          )
        },
        {
          id: 45,
          question: 'Is there a way to generate dummy text like Lorem Ipsum?',
          answerText: 'Yes, our Lorem Ipsum Generator lets you generate customized placeholders by choosing the exact number of paragraphs, sentences, or words needed.',
          answerNode: (
            <>
              Yes, our <a href="/lorem-ipsum-generator" className="text-indigo-600 dark:text-indigo-400 hover:underline">Lorem Ipsum Generator</a> allows designers to generate dummy text by choosing paragraph counts, sentence lengths, or lists to format layouts.
            </>
          )
        },
        {
          id: 46,
          question: 'Does TextToolkitHub offer a Cron expression builder?',
          answerText: 'Yes, we provide a visual Cron Expression Builder to help you construct schedule syntax for server automated cron tasks with intuitive controls.',
          answerNode: (
            <>
              Yes, we provide an intuitive <a href="/cron-expression-builder" className="text-indigo-600 dark:text-indigo-400 hover:underline">Cron Expression Builder</a>, which allows you to visually select minutes, hours, days, and months to output standard cron scheduler expressions.
            </>
          )
        },
        {
          id: 47,
          question: 'How do I format paragraphs and adjust line breaks?',
          answerText: 'You can use Paragraph Formatter and Remove Line Breaks to control line length, join split blocks, or re-wrap sentences according to specific width requirements.',
          answerNode: (
            <>
              You can use our <a href="/paragraph-formatter" className="text-indigo-600 dark:text-indigo-400 hover:underline">Paragraph Formatter</a> and <a href="/remove-line-breaks" className="text-indigo-600 dark:text-indigo-400 hover:underline">Remove Line Breaks</a> tools to control line wrapping, join fragmented text files, or align blocks according to targeted widths.
            </>
          )
        }
      ]
    },
    {
      id: 'support',
      name: 'Updates & Help Contact',
      description: 'Contact details, feature suggestion queues, and upcoming updates schedules.',
      icon: <Mail className="w-5 h-5 text-indigo-500" />,
      items: [
        {
          id: 12,
          question: 'Will more tools be added in the future?',
          answerText: 'Yes, we are constantly expanding our collection of text helpers. We regularly analyze search-volume queries and user feedback to develop and implement new client-side string parsers and productivity widgets.',
          answerNode: (
            <>
              Yes, our utility portfolio is constantly expanding. We regularly analyze popular formatting problems and user suggestions to build and implement high-efficiency browser-native parsers, validators, and filters.
            </>
          )
        },
        {
          id: 13,
          question: 'How often are the tools updated?',
          answerText: 'TextToolkitHub is actively maintained. We issue weekly updates to enhance performance speed, design ergonomics, accessibility features, and overall web-browser compatibility.',
          answerNode: (
            <>
              TextToolkitHub is actively updated. We ship weekly refinements focusing on Core Web Vitals, dark-theme contrast balances, mobile viewport responsiveness, keyboard navigation, and browser parser compatibility.
            </>
          )
        },
        {
          id: 15,
          question: 'How do I contact support?',
          answerText: 'If you have any feature requests, bug discoveries, or feedback, you can instantly message our support team by navigating to our dedicated Contact page or connecting on our official social profiles on X and LinkedIn.',
          answerNode: (
            <>
              If you have any suggestions or feature requests, feel free to instantly get in touch by navigating to our dedicated <a href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Contact Page</a>. You can also connect with our community on <a href="https://www.linkedin.com/in/texttoolkithub" target="_blank" rel="noopener noreferrer" className="text-[#0077b5] dark:text-[#0a66c2] font-semibold hover:underline">LinkedIn</a> or follow us on <a href="https://x.com/TextToolkitHub" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">X</a>.
            </>
          )
        },
        {
          id: 48,
          question: 'How can I suggest a new tool or feature?',
          answerText: 'We love suggestions! You can submit any tool proposals directly through our support logs on the Contact view, or mention us on X.',
          answerNode: (
            <>
              We love suggestions! You can submit tool proposals directly through our support portal on the <a href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact page</a>, or tag us publicly on <a href="https://x.com/TextToolkitHub" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">X (@TextToolkitHub)</a>.
            </>
          )
        },
        {
          id: 49,
          question: 'What should I do if I find a bug in one of the tools?',
          answerText: 'Please contact us with reproduction steps. Since our tools run completely on-device, sharing your operating system and browser type is extremely helpful for our engineers.',
          answerNode: (
            <>
              Please reach out via the <a href="/contact" className="text-indigo-600 dark:text-indigo-400 hover:underline">Contact page</a> with reproduction steps. Since our utilities run completely on-device, mentioning your operating system and browser version helps our team deploy hotfixes quickly.
            </>
          )
        },
        {
          id: 50,
          question: 'Is the source code of TextToolkitHub open for contribution?',
          answerText: 'We are currently preparing our repository for open-source contributions. Stay tuned to our weekly updates and newsletter for the launch announcement!',
          answerNode: (
            <>
              We are actively preparing our codebase for public open-source contributions. Stay tuned to our weekly updates and newsletter for the GitHub repository launch announcement!
            </>
          )
        }
      ]
    }
  ], []);

  // SEO setup and JSON-LD schema FAQPage injection
  useEffect(() => {
    const previousTitle = document.title;
    const seoTitle = 'Frequently Asked Questions (FAQ) - TextToolkitHub';
    const seoDescription = 'Find answers regarding TextToolkitHub text converter tools, word count calculations, browser-native client privacy, offline capabilities, and contact support.';
    
    document.title = seoTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') || "";
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoDescription);

    // Schema FAQ Content Injection (Full 50 QA set)
    const allItems = categories.flatMap(cat => cat.items);
    const schemaContent = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": allItems.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answerText
        }
      }))
    };

    const scriptId = "faq-view-json-ld";
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.innerHTML = JSON.stringify(schemaContent);

    return () => {
      document.title = previousTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [categories]);

  const toggleFaq = (id: number) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Filter FAQs according to search strings and selected categories
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    
    return categories.map(cat => {
      // If we selected a single category and it does not match, return empty-items placeholder
      if (selectedCategory !== 'all' && cat.id !== selectedCategory) {
        return { ...cat, items: [] };
      }

      // No query: return all
      if (!query) {
        return cat;
      }

      // Filter category items
      const matchingItems = cat.items.filter(item => 
        item.question.toLowerCase().includes(query) || 
        item.answerText.toLowerCase().includes(query)
      );

      return {
        ...cat,
        items: matchingItems
      };
    }).filter(cat => cat.items.length > 0);
  }, [categories, searchQuery, selectedCategory]);

  const totalResultsCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  // Analytics: Track FAQ filtering search with 1.5s debounce to optimize event count
  useEffect(() => {
    if (!searchQuery || searchQuery.trim() === '') return;

    const delayDebounceId = setTimeout(() => {
      analytics.trackSearchPerformed(searchQuery.trim(), totalResultsCount);
    }, 1500);

    return () => clearTimeout(delayDebounceId);
  }, [searchQuery, totalResultsCount]);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-200">
      
      {/* Background Accent Gradients */}
      <div className="glow-accent top-12 left-10"></div>
      <div className="glow-accent top-96 right-20"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
        
        {/* Page Heading Section */}
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 py-1 px-3.5 bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 text-xs font-bold font-sans uppercase tracking-widest rounded-full mb-4 border border-indigo-100 dark:border-indigo-950"
          >
            <Sparkles className="w-3.5 h-3.5" /> Support Center & Help Hub
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-light font-display tracking-tight text-slate-950 dark:text-white sm:text-5xl"
            id="faq-page-main-title"
          >
            Frequently Asked <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-300">Questions</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-4 max-w-xl mx-auto leading-relaxed"
          >
            Find immediate answers on text-handling compliance, speed benchmark metrics, privacy paradigms, and search optimization values.
          </motion.p>
        </div>

        {/* Dynamic Search & Navigation controls */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-10 p-5 bg-slate-50/80 dark:bg-slate-950/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/80 flex flex-col md:flex-row items-stretch md:items-center gap-4"
        >
          {/* FAQ Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g., security, case, speed, contact...)"
              className="w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm outline-none bg-white border-slate-200 text-slate-800 hover:border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-200 dark:focus:border-indigo-400 transition-all duration-200"
              aria-label="Search frequently asked questions"
              id="faq-hub-search-input"
            />
            {searchQuery && (
              <button 
                onClick={handleClearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                title="Clear FAQ search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Stats or clear indicator */}
          <div className="flex items-center gap-2 px-3 text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap justify-center select-none font-sans">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{searchQuery ? `${totalResultsCount} matches found` : 'Fully Indexed (50 FAQs)'}</span>
          </div>
        </motion.div>

        {/* Promotional banner redirecting to Security FAQ for specialized corporate users */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mb-8 p-4 bg-linear-to-r from-indigo-50 to-emerald-50 dark:from-indigo-950/20 dark:to-emerald-950/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50/10 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans font-bold text-slate-900 dark:text-white text-xs sm:text-sm">Looking for technical compliance or detailed sovereignty questions?</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Read our professional offline compliance answers, HIPAA, and GDPR integration guidelines.</p>
            </div>
          </div>
          <a
            href="/security-faq"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('security-faq');
              }
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl font-bold font-sans text-xs transition whitespace-nowrap shadow-xs cursor-pointer inline-flex items-center gap-1.5"
            id="faq-pbl-security-link"
          >
            Read Security FAQ <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </motion.div>

        {/* Categories Tab Selector */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none] -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs font-semibold rounded-full border transition cursor-pointer select-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500/35 ${
              selectedCategory === 'all'
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/10'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
            }`}
          >
            All Questions
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition cursor-pointer select-none whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-indigo-500/35 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/15'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </motion.div>

        {/* FAQ Category Blocks and Question Accordions */}
        <div className="space-y-12">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((cat, catIdx) => (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIdx * 0.05 }}
                className="space-y-4"
                id={`faq-category-${cat.id}`}
              >
                {/* Category Header */}
                <div className="border-b border-slate-100 dark:border-slate-800/60 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-sans">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-400 dark:text-slate-500">
                    {cat.items.length} {cat.items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Accordions Container */}
                <div className="grid grid-cols-1 gap-3">
                  {cat.items.map((item) => {
                    const isExpanded = !!expandedFaqs[item.id];
                    return (
                      <div 
                        key={item.id}
                        onClick={() => toggleFaq(item.id)}
                        className={`group border rounded-2xl p-5 cursor-pointer select-none text-left transition-all duration-300 ${
                          isExpanded 
                            ? 'bg-indigo-50/10 border-indigo-500/30 dark:bg-indigo-950/5 dark:border-indigo-500/25 shadow-sm' 
                            : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50/40 dark:bg-slate-950 dark:border-slate-800 dark:hover:border-slate-700/80'
                        }`}
                        id={`faq-accordion-item-${item.id}`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <h3 className={`font-sans font-bold text-sm sm:text-base leading-tight transition-colors duration-200 ${
                            isExpanded 
                              ? 'text-indigo-600 dark:text-indigo-400' 
                              : 'text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                          }`}>
                            {item.question}
                          </h3>
                          <div className={`p-1 rounded-full text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-all duration-200 ${
                            isExpanded ? 'rotate-180 text-indigo-500 bg-indigo-50 dark:bg-indigo-900/35 dark:text-indigo-400' : 'rotate-0 bg-transparent'
                          }`}>
                            <ChevronDown className="w-4 h-4 shrink-0 transition-transform" />
                          </div>
                        </div>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0, marginTop: 0 }}
                              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                              exit={{ height: 0, opacity: 0, marginTop: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-900/60 pt-3">
                                {item.answerNode}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 border rounded-3xl border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20"
            >
              <HelpCircle className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Questions Found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto mb-4">
                We couldn't find any questions matching "{searchQuery}". Try using simpler terms like "security" or "uppercase".
              </p>
              <button 
                onClick={handleClearSearch}
                className="px-3.5 py-1.5 inline-flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition"
              >
                Clear Search Filter
              </button>
            </motion.div>
          )}
        </div>

        {/* Dynamic Help Center Footer Contact Segment */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/30 rounded-3xl p-8 text-center"
          id="faq-help-segment-footer"
        >
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit mx-auto mb-4 border border-indigo-100/50 dark:border-indigo-900/10">
            <Mail className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-sans">
            Still Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
            Our support and engineering teams are here to handle custom workspace requests, bug discoveries, and enterprise telemetry integration queries.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-6">
            <a 
              href="/contact" 
              className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-sm shadow-indigo-600/15 cursor-pointer transition flex items-center justify-center gap-2"
            >
              Contact Support Team <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a 
              href="https://x.com/TextToolkitHub"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-850 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer transition flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow on X
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
