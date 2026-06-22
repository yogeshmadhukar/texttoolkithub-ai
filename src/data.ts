import { Tool, CategoryInfo, FaqItem } from './types.ts';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'analyzer',
    name: 'Text Analyzers',
    description: 'Analyze word density, counts, and reading statistics with pixel perfection.',
    colorClass: 'emerald',
  },
  {
    id: 'cleaner',
    name: 'Formatting Cleaners',
    description: 'Purge noisy characters, duplicate white spaces, and broken layout wraps instantly.',
    colorClass: 'indigo',
  },
  {
    id: 'converter',
    name: 'Text Converters',
    description: 'Shift text between standard casing guidelines, camelCase, snake_case, and more.',
    colorClass: 'amber',
  },
  {
    id: 'encoding',
    name: 'Encoding & Developer Tools',
    description: 'Encode, decode, and escape strings, HTML entities, and cryptographically safe Base64 formats.',
    colorClass: 'violet',
  },
  {
    id: 'generator',
    name: 'Generators',
    description: 'Draft custom, high-fidelity English marketing content, Latin placeholders, or stylish Unicode fonts.',
    colorClass: 'rose',
  },
];

export const TOOLS: Tool[] = [
  {
    id: 'tools/readability-checker',
    title: 'Readability Checker',
    description: 'Analyze reading difficulty, readability score, and text clarity with our free Readability Checker.',
    longDescription: 'Measure your writing readability instantly. Compute standard reading ease metrics, average word/sentence lengths, estimated reading times, and receive actionable text clarity suggestions 100% locally.',
    iconName: 'BookOpen',
    category: 'analyzer',
    seoTitle: 'Readability Checker Online | TextToolkitHub',
    seoDescription: 'Analyze reading difficulty, readability score, and text clarity with our free Readability Checker.',
    keywords: ['readability checker', 'flesch reading ease', 'readability score', 'reading level tool', 'check text clarity', 'reading grade level'],
  },
  {
    id: 'tools/grammar-checker',
    title: 'Grammar Checker',
    description: 'Check grammar, punctuation, spelling, and writing mistakes instantly with our free Grammar Checker tool.',
    longDescription: 'Detect punctuation issues, capitalization errors, common spelling mistakes, and core grammatical anomalies. Get immediately highlighted suggestions and copy corrected drafts locally.',
    iconName: 'SpellCheck',
    category: 'analyzer',
    seoTitle: 'Free Grammar Checker Online | TextToolkitHub',
    seoDescription: 'Check grammar, punctuation, spelling, and writing mistakes instantly with our free Grammar Checker tool.',
    keywords: ['grammar checker', 'free online grammar checker', 'punctuation checker', 'spelling checker', 'writing mistakes', 'grammar tool'],
  },
  {
    id: 'tools/word-counter',
    title: 'Word Counter',
    description: 'Count words, sentences, paragraphs, and estimate read time.',
    longDescription: 'Our advanced word counter delivers immediate analysis of your writing. Ideal for blog articles, SEO copywriters, or essay submissions, it measures reading time, word metrics, and paragraph density instantly.',
    iconName: 'FileText',
    category: 'analyzer',
    seoTitle: 'Free Online Word Counter - Live Character & Reading Time Metrics',
    seoDescription: 'Count words, sentences, and paragraphs in real-time. Calculate estimated reading time, keyword density, and overall text statistics with our fully client-side analyzer.',
    keywords: ['word counter', 'counting words', 'reading time', 'text density', 'sentence count', 'seo toolkit'],
  },
  {
    id: 'tools/sentence-counter',
    title: 'Sentence Counter',
    description: 'Count sentences instantly with our free Sentence Counter. Analyze sentence totals, words, characters, and reading time online.',
    longDescription: 'Our advanced client-side Sentence Counter provides live, multi-metric assessments. Real-time scanning reveals the count of sentences, total words, character boundaries, and estimated reading speeds inside an absolute local environment.',
    iconName: 'AlignLeft',
    category: 'analyzer',
    seoTitle: 'Sentence Counter Online | Free Sentence Counting Tool',
    seoDescription: 'Count sentences instantly with our free Sentence Counter. Analyze sentence totals, words, characters, and reading time online.',
    keywords: ['sentence counter', 'count sentences', 'sentence count', 'sentence counting tool', 'writing counter', 'reading time calculator'],
  },
  {
    id: 'tools/keyword-density-checker',
    title: 'Keyword Density Checker',
    description: 'Check keyword frequency and keyword density percentage for SEO optimization.',
    longDescription: 'Analyze keyword distributions, term frequencies, and relative weight percentages of single words and multi-word phrases instantly. Perfect for copywriters, bloggers, and SEO researchers optimizing keyword density.',
    iconName: 'TrendingUp',
    category: 'analyzer',
    seoTitle: 'Keyword Density Checker Online | TextToolkitHub',
    seoDescription: 'Check keyword frequency and keyword density percentage for SEO optimization.',
    keywords: ['keyword density checker', 'keyword frequency', 'SEO keyword helper', 'term frequency', 'optimal keyword density', 'text analysis tool'],
  },
  {
    id: 'tools/character-counter',
    title: 'Character Counter',
    description: 'Count characters with/without spaces, tabs, lines, and bytes.',
    longDescription: 'Keep track of strict social media limits (like X/Twitter, LinkedIn, meta descriptions) by counting characters precisely, with granular breakdowns of spacing and byte weights.',
    iconName: 'Hash',
    category: 'analyzer',
    seoTitle: 'Character Counter Tool - Limit Checker for Social Media & SEO Meta',
    seoDescription: 'Count characters with and without spacing in real-time. Find byte size, tab characters, and lines helper counters for social posts, SMS, and SEO metadata.',
    keywords: ['character count', 'no spaces', 'byte counter', 'line counter', 'text limit checker', 'social media length'],
  },
  {
    id: 'tools/remove-line-breaks',
    title: 'Remove Line Breaks',
    description: 'Instantly strip standard line wraps, return characters, or double breaks.',
    longDescription: 'Tired of copy-pasting text from PDFs or e-mails containing awkward line breaks? Automatically bridge paragraphs together or flatten entire texts into a clean single line with custom separators.',
    iconName: 'Unwrap', // We will map this code icon to Lucide (e.g., AlignLeft or WrapText)
    category: 'cleaner',
    seoTitle: 'Remove Line Breaks Online - Format PDF Text & Email Wraps',
    seoDescription: 'Purge unwanted line wraps, carriage returns, and breaks. Re-format awkward PDF copy, align words, or flatten messages into single-line layouts.',
    keywords: ['strip line breaks', 'remove enter keys', 'format pdf copy', 'flatten paragraph', 'line wrapper remover'],
  },
  {
    id: 'tools/remove-extra-spaces',
    title: 'Remove Extra Spaces',
    description: 'Strip double spacings, extra tabulators, leading/trailing whitespace.',
    longDescription: 'Sanitize messy code, draft posts, or imported tables. This quick-formatting clean-up strips leading margins, trailing spacing, converts multiple blocks of spaces into standard white spacing, and cleans tabs.',
    iconName: 'Eraser',
    category: 'cleaner',
    seoTitle: 'Remove Extra Spaces & Tabs - Online Whitespace Sanitizer',
    seoDescription: 'Strip duplicate white spaces, remove trailing and leading tabs, and convert block spaces. Get clean text formatting for clean web layout drafts and coding scripts.',
    keywords: ['whitespace remover', 'strip duplicate spaces', 'trim whitespace', 'clean space spacing', 'tab remover'],
  },
  {
    id: 'tools/remove-duplicate-lines',
    title: 'Remove Duplicate Lines',
    description: 'Remove duplicate lines instantly from text lists, emails, keywords, and datasets.',
    longDescription: 'Purge duplicate entries, repeating text rows, and redundant listing lines dynamically. Preserve original content order, clean leading/trailing white space, strip empty lines, and copy or download pristine results fully locally.',
    iconName: 'Layers',
    category: 'cleaner',
    seoTitle: 'Remove Duplicate Lines Online | TextToolkitHub',
    seoDescription: 'Remove duplicate lines instantly from text lists, emails, keywords, and datasets.',
    keywords: ['remove duplicate lines', 'dedup lines', 'remove duplicates text', 'delete duplicate lines', 'deduplicate list online', 'unique line finder'],
  },
  {
    id: 'tools/remove-empty-lines',
    title: 'Remove Empty Lines',
    description: 'Remove blank lines and clean text formatting instantly with our free Remove Empty Lines tool.',
    longDescription: 'Our premium client-side Remove Empty Lines processor strips empty rows, spaced paragraphs, and excess carriage lines instantly. Clean whitespace-only rows, trim residual spacing margins, or collapse consecutive elements in one click.',
    iconName: 'Scissors',
    category: 'cleaner',
    seoTitle: 'Remove Empty Lines Online | TextToolkitHub',
    seoDescription: 'Remove blank lines and clean text formatting instantly with our free Remove Empty Lines tool.',
    keywords: ['remove empty lines', 'remove blank lines', 'strip empty lines', 'delete empty lines', 'clean spacing list', 'text paragraph cleaner'],
  },
  {
    id: 'tools/lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description: 'Generate Lorem Ipsum placeholder text instantly for websites, designs, apps, and mockups.',
    longDescription: 'Create custom Latin placeholder text on demand. Configure paragraph count, sentence length, overall word limits, and choose whether to start with classic Lorem Ipsum or run completely randomized sets.',
    iconName: 'FileCode',
    category: 'generator',
    seoTitle: 'Lorem Ipsum Generator Online | Free Placeholder Text',
    seoDescription: 'Generate Lorem Ipsum placeholder text instantly for websites, designs, apps, and mockups.',
    keywords: ['lorem ipsum generator', 'lorem ipsum', 'placeholder text generator', 'dummy text generator', 'greeking text generator', 'latin mock text'],
  },
  {
    id: 'tools/random-text-generator',
    title: 'Random Text Generator',
    description: 'Generate random words, sentences, and paragraphs instantly with our free Random Text Generator.',
    longDescription: 'Our premium client-side Random Text Generator crafts customized mock prose blocks instantly. Configure precise numbers of words, sentences, or paragraphs, and adapt vocabularies for corporate business presentations, modern bold marketing campaigns, plain relaxed chat logs, or classic dummy wireframe templates.',
    iconName: 'Sparkle',
    category: 'generator',
    seoTitle: 'Random Text Generator Online | Free Content Generator',
    seoDescription: 'Generate random words, sentences, and paragraphs instantly with our free Random Text Generator.',
    keywords: ['random text generator', 'random content generator', 'generate random paragraphs', 'free placeholder copy', 'business text generator', 'marketing dummy copy'],
  },
  {
    id: 'tools/case-converter',
    title: 'Case Converter',
    description: 'Convert text casing (UPPER, lower, Title, Sentence, camel, snake, kebab).',
    longDescription: 'Seamlessly shift your paragraphs between visual capitalization presets. Fast format code constants (UPPER_CASE), titles (Title Case), URL slugs (kebab-case), or standard email grammar layouts.',
    iconName: 'Type',
    category: 'converter',
    seoTitle: 'Online Case Converter - Toggle UPPERCASE, lowercase, Title Case',
    seoDescription: 'Convert casing formats instantly. Choose between sentence case, Title Case, camelCase, snake_case, kebab-case, or inverse casings with a single click.',
    keywords: ['case converter', 'capitalization tool', 'to lowercase', 'to uppercase', 'title case format', 'slug generator'],
  },
  {
    id: 'tools/case-converter-pro',
    title: 'Case Converter Pro',
    description: 'Professional all-in-one text case conversion suite with live preview cards.',
    longDescription: 'Complete premium formatting workspace supporting UPPERCASE, lowercase, Sentence case, Title Case, Capitalize Each Word, tOGGLE cASE, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, and path/case.',
    iconName: 'Type',
    category: 'converter',
    seoTitle: 'Case Converter Pro | Advanced Text Case Conversion Tool',
    seoDescription: 'Convert text between uppercase, lowercase, title case, camelCase, snake_case, kebab-case, PascalCase, and more with our advanced Case Converter Pro.',
    keywords: ['case converter pro', 'camelCase converter', 'snake_case generator', 'dot.case', 'path/case', 'constant_case', 'text case transformer', 'capitalize each word'],
  },
  {
    id: 'tools/text-compare',
    title: 'Text Compare',
    description: 'Compare two texts side-by-side or inline to find exact line alignments, modified sentences, and code adjustments.',
    longDescription: 'Compare your revision drafts or source code parameters instantly. Our browser-based diff engine isolates additions, deletion offsets, and character variations beautifully.',
    iconName: 'GitCompare',
    category: 'analyzer',
    seoTitle: 'Text Compare Tool – Compare Text Online Free',
    seoDescription: 'Compare two texts online and instantly find differences, changed words, added text, removed text, and character variations.',
    keywords: ['text compare', 'diff checker', 'compare texts online', 'find differences', 'text comparator', 'code difference'],
  },
  {
    id: 'tools/slug-generator',
    title: 'Slug Generator',
    description: 'Convert post titles, headers or custom strings into clean SEO-friendly URL slugs instantly.',
    longDescription: 'Convert any raw headline or blog title into a human-friendly web address token. Prune helper stopwords, clear punctuation, replace spacing with dashes, or convert character cases.',
    iconName: 'Link2',
    category: 'encoding',
    seoTitle: 'SEO Slug Generator Online',
    seoDescription: 'Generate SEO-friendly URL slugs instantly. Convert titles into clean search-engine-friendly URLs.',
    keywords: ['slug generator', 'url slug', 'seo friendly url', 'convert title to slug', 'clean url generator', 'create slug format'],
  },
  {
    id: 'tools/url-encoder',
    title: 'URL Encoder / Decoder',
    description: 'Encode or decode URL characters, safe-formatting parameters for internet transmission instantly.',
    longDescription: 'Our advanced browser URI translation tool encodes unreserved characters or decodes percent notations in real-time. Choose custom formats for spaces or custom parameters securely.',
    iconName: 'Globe',
    category: 'encoding',
    seoTitle: 'URL Encoder Online Free',
    seoDescription: 'Encode URLs instantly for safe transmission on the web.',
    keywords: ['url encoder', 'url encode online', 'percent encoding', 'decoder url', 'decode url percent', 'safe uri string'],
  },
  {
    id: 'tools/url-decoder',
    title: 'URL Decoder',
    description: 'Decode percent-encoded strings or dynamic web parameters back to clean readable text instantly.',
    longDescription: 'Extract plain legible parameters from escaped text. Configurable plus variables (+) translations and path-query cleaner options are fully supported client-side.',
    iconName: 'Unlock',
    category: 'encoding',
    seoTitle: 'URL Decoder Online Free – Decode Percent-Encoded URLs',
    seoDescription: 'Decode percent-encoded URLs and escaped web parameters instantly online. Revert %20 to spaces, %3A to colons, and safely extract plain readable text.',
    keywords: ['url decoder', 'url decode online', 'percent decoding', 'unencode string', 'decode percent text', 'readable uri parameter'],
  },
  {
    id: 'tools/fancy-text-generator',
    title: 'Fancy Text Generator',
    description: 'Generate stylish fancy text fonts for Instagram, Facebook, WhatsApp, Threads, X, and social media.',
    longDescription: 'Generate stylish font variations in standard cursive scripts, bold serifs, Fraktur Gothic structures, bubble circles, and other unique unicode blocks in one click.',
    iconName: 'Sparkles',
    category: 'generator',
    seoTitle: 'Fancy Text Generator Online',
    seoDescription: 'Generate stylish fancy text fonts for Instagram, Facebook, WhatsApp, Threads, X, and social media.',
    keywords: ['fancy text generator', 'stylish text', 'unicode fonts', 'instagram bio fonts', 'facebook text generator', 'cool text decorations'],
  },
  {
    id: 'tools/html-encoder',
    title: 'HTML Encoder',
    description: 'Convert HTML code or strings into encoded HTML entities to display nested tags safely.',
    longDescription: 'Protect your web layouts and prevent cross-site scripting vulnerabilities by translating sensitive syntax markers—such as tags, quotes, and ampersands—into fully encoded HTML entity notations.',
    iconName: 'FileText',
    category: 'encoding',
    seoTitle: 'HTML Encoder Tool Online Free',
    seoDescription: 'Convert HTML code into encoded HTML entities instantly. Free online HTML Encoder.',
    keywords: ['html encoder', 'encode html entities', 'html hex encoder', 'escape html tag', 'prevent xss string', 'special character encoder'],
  },
  {
    id: 'tools/html-decoder',
    title: 'HTML Decoder',
    description: 'Decode HTML entities back into readable HTML code instantly.',
    longDescription: 'Convert escaped character designations or numeric representations—like &amp;lt;, &amp;gt;, and &amp;quot;—into their literal character equivalents instantly, restoring clean text or original markup source code.',
    iconName: 'Unlock',
    category: 'encoding',
    seoTitle: 'HTML Decoder Tool Online',
    seoDescription: 'Decode HTML entities back into readable HTML code instantly. Free privacy-first online HTML entity decoder tool.',
    keywords: ['html decoder', 'decode html entities', 'unescape html tags', 'convert html entity', 'html code unescaper', 'entity decoder online'],
  },
  {
    id: 'tools/base64-encoder',
    title: 'Base64 Encoder',
    description: 'Encode text into Base64 format instantly using our free online Base64 Encoder.',
    longDescription: 'Secure your binary-to-text data configurations or standardize string characters cleanly into standard RFC-compliant Base64 formats. Fully client-side, offline-aware, and metadata-secure.',
    iconName: 'Link2',
    category: 'encoding',
    seoTitle: 'Base64 Encoder Online - Convert Text to Base64 Free',
    seoDescription: 'Encode text into Base64 format instantly using our free online Base64 Encoder. Compliant, safe, and operates locally.',
    keywords: ['base64 encoder', 'base64 encode', 'text to base64', 'base64 converter', 'binary to text', 'encode string to base64'],
  },
  {
    id: 'tools/base64-decoder',
    title: 'Base64 Decoder',
    description: 'Decode Base64 strings instantly and convert them back into readable text.',
    longDescription: 'Reverse Base64 encoded streams back to readable UTF-8 string outputs. Includes client-side safety verification, live error checking, and text download capabilities.',
    iconName: 'Unlock',
    category: 'encoding',
    seoTitle: 'Base64 Decoder Online Free - Convert Base64 back to Text',
    seoDescription: 'Decode Base65 strings back to clean readable text instantly using our secure, fully local client-side Base64 decoder tool.',
    keywords: ['base64 decoder', 'decode base64', 'base64 to text', 'base64 unescape', 'base64 parser', 'decrypt base64 online'],
  },
  {
    id: 'tools/text-sorter',
    title: 'Text Sorter',
    description: 'Sort text lines alphabetically, reverse order, randomize lists, and remove duplicates instantly.',
    longDescription: 'Organize list structures, files, code lines, or items alphabetically in A-Z or Z-A order. Reorder lines in reverse, shuffle randomly, and remove redundant duplicate lines instantly.',
    iconName: 'ArrowUpDown',
    category: 'cleaner',
    seoTitle: 'Text Sorter Tool Online - Sort Lines Alphabetically Free',
    seoDescription: 'Sort text lines alphabetically (A-Z, Z-A), reverse order, randomize lists, and eliminate duplicates instantly with our free online Text Sorter Tool.',
    keywords: ['text sorter', 'alphabetical sorter', 'sort lines online', 'remove duplicate lines', 'shuffle lines', 'sort text a-z'],
  },
  {
    id: 'tools/text-reverser',
    title: 'Text Reverser',
    description: 'Reverse text, words, lines, and characters instantly with our free online Text Reverser Tool.',
    longDescription: 'Flip your essays, lines, code, lists, or letters backwards with our extensive suite of text reversing filters. Support for reversing characters, reverse by line structures, preserving or reversing words, and real-time live preview.',
    iconName: 'ArrowLeftRight',
    category: 'converter',
    seoTitle: 'Text Reverser Tool Online Free - Reverse Characters & Words',
    seoDescription: 'Reverse text characters, whole word orders, lines, or paragraphs instantly with our modern, fully client-side online Text Reverser Tool.',
    keywords: ['text reverser', 'reverse characters', 'reverse words', 'reverse text online', 'backwards text generator', 'flip text generator'],
  },
  {
    id: 'tools/text-repeater',
    title: 'Text Repeater',
    description: 'Repeat words, sentences, and phrases instantly with our free Text Repeater tool. Generate repeated text with one click.',
    longDescription: 'Our premium client-side Text Repeater replicates strings, paragraphs, or lists to your specified limits instantly. Support repeating continuously (plain or with space/custom delimiters) or repeat line-by-line with dynamic output size metrics.',
    iconName: 'Repeat',
    category: 'converter',
    seoTitle: 'Text Repeater Online | Repeat Text Instantly',
    seoDescription: 'Repeat words, sentences, and phrases instantly with our free Text Repeater tool. Generate repeated text with one click.',
    keywords: ['text repeater', 'repeat text tool', 'word repeater', 'online text replicator', 'multiply text', 'repeat generator'],
  },
  {
    id: 'tools/paragraph-formatter',
    title: 'Paragraph Formatter',
    description: 'Transform messy, unformatted, AI-generated, copied, or pasted text into clean, readable book-style paragraphs.',
    longDescription: 'Our premium online Paragraph Formatter optimizes and reorganizes unstructured AI-generated text, ChatGPT outputs, or messy copied blocks into elegant, reader-friendly paragraph layouts. Automatically break long walls of text, normalize spaces, strip redundant breaks, or format text in standard web, novel, essay, or blog structures.',
    iconName: 'Pilcrow',
    category: 'cleaner',
    seoTitle: 'Paragraph Formatter Online | Convert Text into Readable Paragraphs',
    seoDescription: 'Convert messy text into clean, readable paragraphs instantly. Perfect for ChatGPT content, articles, books, essays, and blog posts.',
    keywords: ['paragraph formatter', 'format paragraphs', 'split text into paragraphs', 'readability tool', 'chatgpt paragraph splitter', 'format copied text', 'text layout sanitizer'],
  },
  {
    id: 'tools/remove-special-characters',
    title: 'Remove Special Characters',
    description: 'Remove unwanted symbols and special characters from text while preserving letters, numbers, and spaces.',
    longDescription: 'Our professional online Remove Special Characters tool strips unwanted punctuation, symbols, emojis, math equations, or non-alphanumeric details instantly. Choose target criteria to preserve letters, digits, standard spacing, or specify custom custom characters to erase or keep entirely offline.',
    iconName: 'Eraser',
    category: 'cleaner',
    seoTitle: 'Remove Special Characters Online | Free Text Cleaner',
    seoDescription: 'Remove special characters, symbols, and unwanted text instantly with our free online text cleaning tool.',
    keywords: ['remove special characters', 'text cleaner online', 'strip punctuation', 'remove symbols from text', 'alphanumeric text only', 'clean text online', 'strip non-alphanumeric'],
  },
  {
    id: 'tools/remove-emojis',
    title: 'Remove Emojis',
    description: 'Remove emojis from copied text, social media content, articles, messages, and documents.',
    longDescription: 'Our premium online Remove Emojis tool scans and purges Unicode emojis, symbols, flags, or pictographs from social posts, emails, and student copy. Clean text instantly while preserving letter structure, margins, and layouts completely offline.',
    iconName: 'Smile',
    category: 'cleaner',
    seoTitle: 'Remove Emojis Online | Free Emoji Remover',
    seoDescription: 'Remove emojis from text instantly while preserving formatting. Free online emoji remover for social media, documents, and articles.',
    keywords: ['remove emojis', 'strip emojis', 'clean emojis from text', 'social media text cleaner', 'emoji remover online', 'remove emoticons', 'text formatting preserves'],
  },
  {
    id: 'tools/bullet-point-generator',
    title: 'Bullet Point Generator',
    description: 'Convert paragraphs, sentences, keywords, and text blocks into organized bullet lists.',
    longDescription: 'Our professional online Bullet Point Generator transforms blocky papers, messy meeting notes, dense paragraphs, or brainstorming lists into beautifully formatted bulleted structures. Create organized bullet lists instantly with standard, circle, square, or custom arrow points or numbered listings.',
    iconName: 'List',
    category: 'converter',
    seoTitle: 'Bullet Point Generator Online | Convert Text to Bullets',
    seoDescription: 'Convert paragraphs into clean bullet points instantly. Create organized lists for notes, blogs, presentations, and reports.',
    keywords: ['bullet point generator', 'convert text to bullets', 'paragraph to list converter', 'make bulleted list online', 'notes list builder', 'sentence to bullet points'],
  },
  {
    id: 'tools/document-builder',
    title: 'Document Builder',
    description: 'Transform plain text into beautifully formatted, print-ready PDF documents.',
    longDescription: 'Our premium flagship Document Builder turns unstructured text, drafts, and raw copy into beautifully typeset, custom documents. Choose from layouts like Book, Essay, Report, Novel, Meeting Notes, and Blog with a professional high-fidelity rendering pipeline. Customize typography, spacing, styling presets, headers, and footers, and export perfect high-quality PDF files completely locally in your browser.',
    iconName: 'FileText',
    category: 'generator',
    seoTitle: 'Document Builder - Format Text and Create Professional PDFs Online',
    seoDescription: 'Convert plain text into beautifully formatted PDF documents. Create books, essays, reports, articles, and print-ready files instantly with our free Document Builder.',
    keywords: ['document builder', 'text to pdf converter', 'format text online', 'create pdf from text', 'book formatter', 'essay formatting tool', 'business report creator', 'format drafts', 'typesetting online'],
  },
  {
    id: 'tools/json-formatter',
    title: 'JSON Formatter',
    description: 'Format, beautify, validate, and inspect JSON instantly with our free online JSON Formatter.',
    longDescription: 'Format, beautify, and validate JSON data instantly. Detect real-time syntax errors, browse nested keys cleanly with an interactive collapsible Tree Inspector, and calculate characters, objects, and keys count safely.',
    iconName: 'FileJson',
    category: 'encoding',
    seoTitle: 'JSON Formatter Online | Beautify & Validate JSON',
    seoDescription: 'Format, beautify, validate, and inspect JSON instantly with our free online JSON Formatter.',
    keywords: ['json formatter', 'json beautifier', 'json validator', 'validate json online', 'json syntax checker', 'format json online', 'beautify json', 'json tree visualizer'],
  },
  {
    id: 'tools/json-minifier',
    title: 'JSON Minifier',
    description: 'Compress and minify JSON instantly. Reduce file size while maintaining valid JSON structure.',
    longDescription: 'Compress and minify JSON instantly of unwanted formatting spaces, tabs, and indentation gutters. Safely validate your JSON payloads against RFC-8259, view direct byte size reductions, and download minified files securely.',
    iconName: 'ArrowDownWideNarrow',
    category: 'encoding',
    seoTitle: 'JSON Minifier Online | Compress JSON Data',
    seoDescription: 'Compress and minify JSON instantly. Reduce file size while maintaining valid JSON structure.',
    keywords: ['json minifier', 'compress json', 'minify json online', 'reduce json size', 'json compression', 'beautify json', 'json structure checker'],
  },
  {
    id: 'tools/jwt-decoder',
    title: 'JWT Decoder',
    description: 'Decode, inspect, and validate JSON Web Tokens securely and locally.',
    longDescription: 'Decode JSON Web Tokens (JWT) in real-time entirely in your browser. Inspect and debug cryptographic headers, structured payload claims, and signoff algorithms under full GDPR compliance with zero external servers.',
    iconName: 'ShieldCheck',
    category: 'encoding',
    seoTitle: 'JWT Decoder & Debugger | TextToolkitHub',
    seoDescription: 'Decode, inspect, and validate JSON Web Tokens securely and 100% locally in your browser. Real-time expiration countdown and complete header & payload tree visualizers.',
    keywords: ['jwt decoder', 'jwt debugger', 'decode jwt online', 'inspect jwt', 'json web token viewer', 'jwt expiry checker', 'jwt dynamic debugger', 'base64url header parser', 'jwt payload inspector', 'secure jwt utility'],
  },
  {
    id: 'tools/markdown-to-html',
    title: 'Markdown to HTML',
    description: 'Convert Markdown content into clean HTML code instantly.',
    longDescription: 'Convert headings, lists, links, tables, quotes, code blocks, and images in Markdown format into semantic, production-ready HTML code in real-time. Inspect the live rendered document alongside code and download exports directly.',
    iconName: 'FileCode',
    category: 'converter',
    seoTitle: 'Markdown to HTML Converter Online | TextToolkitHub',
    seoDescription: 'Convert Markdown into clean HTML instantly with live preview and one-click export.',
    keywords: ['markdown to html', 'md to html', 'markdown converter', 'markdown editor', 'convert markdown online', 'convert md to html', 'markdown syntax', 'html code preview'],
  },
  {
    id: 'tools/html-to-markdown',
    title: 'HTML to Markdown',
    description: 'Convert HTML code into clean Markdown format.',
    longDescription: 'Deconstruct HTML headers, structural lists, anchors, blockquotes, tables, code blocks, images and custom font typography markers back to clean GFM Markdown formatted data instantly.',
    iconName: 'FileCode',
    category: 'converter',
    seoTitle: 'HTML to Markdown Converter Online',
    seoDescription: 'Convert HTML into Markdown instantly with our free online HTML to Markdown converter.',
    keywords: ['html to markdown', 'convert html to markdown', 'html to md converter', 'clean html to markdown', 'reverse html to markup', 'markdown format cleaner'],
  },
  {
    id: 'tools/csv-formatter',
    title: 'CSV Formatter & Column Extractor',
    description: 'Format CSV files, extract columns, convert CSV to JSON, SQL arrays and Markdown tables instantly.',
    longDescription: 'Format and sanitize tabular text files seamlessly in the browser. Easily select delimiter definitions, view row/column counts, sort data, remove duplicates, search records, and extract individual columns to formats like JSON, SQL Inserts, Markdown, TSV, or plain text.',
    iconName: 'FileSpreadsheet',
    category: 'converter',
    seoTitle: 'CSV Formatter & Column Extractor | TextToolkitHub',
    seoDescription: 'Format CSV files, extract columns, convert CSV to JSON, SQL arrays and Markdown tables instantly.',
    keywords: ['csv formatter', 'column extractor', 'convert csv to json', 'csv to markdown table', 'csv to sql insert', 'csv format utility', 'tabular data converter', 'online csv editor', 'tsv formatter', 'delimited row parser'],
  },
  {
    id: 'tools/regex-tester',
    title: 'Regex Tester & Visual Matcher',
    description: 'Test regular expressions online with live visual matching, capturing groups, and validation.',
    longDescription: 'Test and debug JavaScript regular expressions in real-time. Features structured visual highlighting of full matches and captured groups, color-coded subgroups, syntax validation status, catastrophic backtracking checks, and a set of pre-configured presets for quick validation (emails, phone numbers, passwords, etc.). All performed 100% locally inside your browser.',
    iconName: 'Code',
    category: 'analyzer',
    seoTitle: 'Regex Tester & Visual Matcher | TextToolkitHub',
    seoDescription: 'Test regular expressions online with visual matching, capturing groups and real-time validation.',
    keywords: ['regex tester', 'regex matcher', 'regular expression evaluator', 'test regex online', 'regex visual matches', 'capturing groups debugger', 'regex syntax checker', 'catastrophic backtracking scanner', 'secure regex tool', 'regex flags test'],
  },
  {
    id: 'tools/cron-builder',
    title: 'Cron Expression Builder',
    description: 'Build cron schedules visually, translate cron syntax into plain English and preview upcoming execution times.',
    longDescription: 'Create cron expressions with an intuitive visual minute, hour, day, month and weekday interface. Easily translate any cron expression into plain readable English, validate expressions for potential interval configuration errors, and preview the next execution intervals in your local timezone.',
    iconName: 'Clock',
    category: 'generator',
    seoTitle: 'Cron Expression Builder | TextToolkitHub',
    seoDescription: 'Build cron schedules visually, translate cron syntax into plain English and preview upcoming execution times.',
    keywords: ['cron expression builder', 'cron translator', 'cron parser', 'crontab generator', 'cron scheduler', 'test cron online', 'next run times', 'visual cron builder'],
  },
  {
    id: 'tools/qr-generator',
    title: 'QR Code Generator',
    description: 'Generate QR codes instantly for text, URLs, emails, phone numbers, WiFi networks, and more.',
    longDescription: 'Create customized high-fidelity QR codes with complete visual control. Style foreground and background colors, adjust margins, pick error-correction tolerances, and resize with instant live preview. Supports URLs, paragraphs, emails, SMS drafts, phone dialers, and pre-configured WiFi authentication standards. Download instantly as PNG or crisp vector SVG formats.',
    iconName: 'QrCode',
    category: 'generator',
    seoTitle: 'QR Code Generator Online | Free QR Creator',
    seoDescription: 'Create QR codes instantly for URLs, text, emails, phone numbers, and WiFi networks. Download as PNG or SVG.',
    keywords: ['qr code generator', 'qr code creator', 'make qr code', 'free qr creator', 'wifi qr code', 'url qr code', 'svg qr code', 'png qr code'],
  },
  {
    id: 'tools/meta-generator',
    title: 'Meta Tag Generator',
    description: 'Generate SEO meta tags, Open Graph tags and Twitter Card metadata instantly with live previews.',
    longDescription: 'Optimize your search presence and social sharing with our professional-grade Meta Tag Generator. Draft search titles, descriptions, canonical links, keywords, and author tags with instant Google Search, Facebook Open Graph, and Twitter Card visual previews. View optimization scores, follow automated recommendations, copy HTML codes, or export files instantly.',
    iconName: 'Globe',
    category: 'generator',
    seoTitle: 'Meta Tag Generator | TextToolkitHub',
    seoDescription: 'Generate SEO meta tags, Open Graph tags and Twitter Card metadata instantly with live previews.',
    keywords: ['meta tag generator', 'seo meta tags', 'open graph generator', 'twitter card generator', 'google search preview', 'og tags creator', 'meta tag builder'],
  },
  {
    id: 'tools/unix-timestamp-converter',
    title: 'Unix Timestamp Converter',
    description: 'Convert Unix epoch timestamps to human-readable dates and vice versa instantly.',
    longDescription: 'Our premium client-side Unix Timestamp Converter translates Epoch seconds and milliseconds to local, UTC, and relative GMT schedules. Features an active ticking ticker, quick timezone adapters, and ready-to-copy code structures fully offline.',
    iconName: 'Clock',
    category: 'converter',
    seoTitle: 'Unix Timestamp Converter Online - Live Epoch Date Tool',
    seoDescription: 'Convert Unix Epoch timestamps to human-readable dates, and dates to epoch seconds. Real-time dynamic ticker, UTC/Local timezone conversions, completely client-side.',
    keywords: ['unix timestamp converter', 'epoch converter', 'unix epoch', 'milliseconds to date', 'tick epoch ticker', 'time converter'],
  },
  {
    id: 'tools/number-base-converter',
    title: 'Binary / Hex / Octal Converter',
    description: 'Convert text characters into binary, hexadecimal, decimal, and octal codes in real-time.',
    longDescription: 'Translate standard ASCII strings into digital formats and translate codes back to readable characters instantly. Support custom separators, hexadecimal code prefix variables, and view structured bitwise-breakdown grids in one click.',
    iconName: 'AlignLeft',
    category: 'converter',
    seoTitle: 'Binary Hex Octal Text Converter - Number Base ASCII Translator',
    seoDescription: 'Convert text to binary, hexadecimal, decimal, octal and vice versa online. Includes instant bit breakdown tables and customizable separators.',
    keywords: ['binary converter', 'hex to text', 'text to binary', 'decimal to octal translator', 'number base conversion', 'binary code generator'],
  },
  {
    id: 'tools/typedef-converter',
    title: 'Code Type Def & Schema Converter',
    description: 'Transform JSON payloads into TypeScript interfaces, Go structs, SQL tables, and JSON Schema definitions.',
    longDescription: 'Translate raw JSON data recursively into robust programming models. Setup tab indentation spaces, mark fields as optional, and generate pristine databases or typesets 100% locally with zero server dependency.',
    iconName: 'Code',
    category: 'encoding',
    seoTitle: 'JSON to TypeScript Go SQL Converter - Type Definition Generator',
    seoDescription: 'Convert JSON objects into TypeScript interfaces, Go structs, SQL CREATE TABLE scripts, and JSON Schema definitions 100% locally in your browser.',
    keywords: ['json to typescript', 'json to go struct', 'convert json to sql schema', 'json schema generator', 'type definitions builder', 'model translator'],
  },
  {
    id: 'tools/string-escaper',
    title: 'String Escaper / Unescaper',
    description: 'Escape or unescape text strings for JavaScript, JSON, HTML templates, and SQL variables.',
    longDescription: 'Format raw paragraphs with correct backslashes and quotes to fit seamlessly into script parameters or database inserts. Conversely, unescape encoded raw snippets back to comfortable sentences completely offline.',
    iconName: 'Sliders',
    category: 'encoding',
    seoTitle: 'String Escaper Online - Code Text Escape Unescaper Tool',
    seoDescription: 'Escape and unescape lines of text for JavaScript, JSON, SQL queries, HTML tags and XML entities instantly. Free secure local string sanitizer.',
    keywords: ['string escaper', 'unescape text', 'html entities encoder', 'sql escape single quote', 'js literal format', 'programming character sanitizer'],
  },
  {
    id: 'tools/hash-generator',
    title: 'Cryptographic Hash Generator',
    description: 'Generate secure MD5, SHA-1, SHA-256, SHA-384, and SHA-512 checksums or verify local files.',
    longDescription: 'Draft cryptographic hex digests simultaneously in real-time. Use our matching checker to confirm target installer checksums, or drop local files to verify software downloads using highly optimized Web Crypto engines securely.',
    iconName: 'ShieldCheck',
    category: 'encoding',
    seoTitle: 'Cryptographic Hash Generator - MD5 SHA-256 Checksum Tool',
    seoDescription: 'Generate secure MD5, SHA-1, SHA-256, SHA-384 and SHA-512 checksums 100% locally in your browser. Live checksum matching and fast local file hashing.',
    keywords: ['checksum generator', 'sha256 hash', 'md5 hash online', 'verify file download checksum', 'calculate hash of file', 'crypto matching tool'],
  },
  {
    id: 'tools/yaml-json-converter',
    title: 'YAML ↔ JSON Bidirectional Converter',
    description: 'Convert YAML configuration text files to structured JSON arrays or JSON schemas back to tidy YAML configurations.',
    longDescription: 'Our premium client-side YAML ↔ JSON Bidirectional Converter lets you easily convert configurations and DevOps templates offline in real-time. Features syntax error highlight validation alerts, flexible spaces tuning, copy buttons, and standard manifest download backups.',
    iconName: 'FileCode',
    category: 'encoding',
    seoTitle: 'YAML to JSON Converter - Bidirectional Config Translator',
    seoDescription: 'Convert YAML text files to JSON objects or JSON back to clean YAML configurations 100% locally in your browser. Live validator and formatting options.',
    keywords: ['yaml to json', 'json to yaml', 'yaml validator', 'yaml configurations parser', 'translate yaml online', 'clean devops manifests format'],
  },
  {
    id: 'tools/contrast-checker',
    title: 'WCAG Color Contrast Checker & Palettes',
    description: 'Calculate visual text-to-background contrast matches, check accessibility AA/AAA scores and build responsive layouts.',
    longDescription: 'Check if foreground text sizes meet accessibility guidelines WCAG 2.1 thresholds, and automatically generate stunning monochromatic, analogous, and complementary design palettes based on any hex input.',
    iconName: 'Contrast',
    category: 'analyzer',
    seoTitle: 'Color Contrast Checker WCAG - Accessibility Palette Tool',
    seoDescription: 'Calculate text-to-background WCAG color contrast matches, check accessibility AA/AAA passes in real time, and generate beautiful color palettes.',
    keywords: ['color contrast checker', 'wcag contrast optimizer', 'accessibility colors test', 'contrast ratio calculator', 'generate contrast palettes'],
  },
  {
    id: 'tools/uuid-generator',
    title: 'Bulk UUID & GUID Generator',
    description: 'Produce high-entropy Version 4 RFC-compliant unique IDs and bulk GUID arrays securely.',
    longDescription: 'Generate secure unique database keys, transaction tracking codes and system ids. Customize string delimiters, uppercase values, braces wrappers, generate up to 500 records, and export lists as TXT configurations.',
    iconName: 'Dices',
    category: 'generator',
    seoTitle: 'Bulk UUID GUID Generator V4 - Cryptosecure Checksum Generator',
    seoDescription: 'Generate cryptographically secure RFC 4122 compliant Version 4 UUIDs or GUIDs in bulk. Customize hyphens, braces, capitals, and download lists offline.',
    keywords: ['uuid generator', 'guid creator', 'bulk uuids v4 maker', 'secure unique keys creator', 'random key checksum generator'],
  },
  {
    id: 'tools/css-formatter',
    title: 'CSS Beautifier & Minifier',
    description: 'Clean up, expand, format or compact raw stylesheets to improve Web Core Vitals load speeds.',
    longDescription: 'A double utility supporting both pretty-printing and compressing stylesheets. Adjust indentation spaces, configure open curly bracket styles, strip trailing comments, and download optimized files instantly.',
    iconName: 'Scissors',
    category: 'encoding',
    seoTitle: 'CSS Beautifier & Minifier - Instant Code Optimizer',
    seoDescription: 'Format, beautify, and compress raw CSS stylesheets instantly offline. Configure indent spacing, brace style alignments, and clear redundant lines.',
    keywords: ['css beautifier', 'css minifier online', 'format css markup', 'shrink stylesheets size', 'tidy css stylesheets code'],
  },
  {
    id: 'tools/ua-parser',
    title: 'User Agent Parser & Client Info Analyzer',
    description: 'Dissect any User-Agent header string to check OS platform, layout engine, browser and active layout permissions.',
    longDescription: 'Perform 100% offline analysis of desktop or mobile HTTP User Agent attributes. Automatically query your local browser window specs, including screen resolutions, color spaces, languages, active cookies, and device orientations.',
    iconName: 'Compass',
    category: 'analyzer',
    seoTitle: 'User Agent Parser Online - System Client Detector',
    seoDescription: 'Parse HTTP user-agent strings, identify client browsers, OS platforms, layout engines, and hardware display specs 100% locally.',
    keywords: ['user agent parser', 'parse ua headers string', 'detect browser agent spec', 'os platform client detector', 'browser engine analyzer'],
  }
];

export const FAQS: FaqItem[] = [
  {
    id: 1,
    question: 'What is TextToolkitHub?',
    answer: 'TextToolkitHub is an online suite of browser-native text utilities built to deliver sub-millisecond manipulation, counting, and cleaning with absolute local privacy. All processing runs entirely inside your web browser secure viewport.',
  },
  {
    id: 2,
    question: 'Is TextToolkitHub free to use?',
    answer: 'Yes! Every single converter, cleaner, and analyzer widget inside TextToolkitHub is 100% free with no subscription tiers, credit-card charges, paywalls, or restricted access trials.',
  },
  {
    id: 3,
    question: 'Is TextToolkitHub safe and private?',
    answer: 'Security is our absolute priority. All inputs, paste buffers, and sensitive code files are handled locally through client-side JavaScript. No data packets are transferred to external cloud storages or processed remotely.',
  },
  {
    id: 4,
    question: 'Do I need to sign up to use the tools?',
    answer: 'No signup or registration is required. You can utilize our complete toolkit of converters and counters anonymously, instantly, and freely at any time without creating accounts or matching phone validation credentials.',
  },
  {
    id: 5,
    question: 'What is the best free online text tools website?',
    answer: 'TextToolkitHub is widely recognized as the premier choice due to its absolute privacy focus, ad-free layouts, high-performance execution speed, and mobile-responsive engineering.',
  },
  {
    id: 6,
    question: 'Which website has free text formatting tools?',
    answer: 'TextToolkitHub is an all-in-one platform providing premium formatting tools to sort lines, remove extra spaces, strip empty line breaks, convert case types, and run readability analysis instantly for free.',
  },
  {
    id: 7,
    question: 'Can I use TextToolkitHub for content writing?',
    answer: 'Yes! It is optimized for copywriters, bloggers, and SEO copywriters. Use our word counter, character counter, keyword density checkers, and duplicate lines cleaners to polish and optimize blogs before submitting.',
  },
  {
    id: 8,
    question: 'Is TextToolkitHub suitable for professionals and creators?',
    answer: 'Absolutely. With clean desktop layouts, high-contrast dark theme mode, local offline responsiveness, and zero commercial popups, our tools integrate cleanly into fast developer, content creation, and office routines.',
  },
];

export function searchTools(query: string): Tool[] {
  const normQuery = query.trim().toLowerCase();
  if (!normQuery) return [];

  // Split query into lowercased tokens (words) to support multi-word search regardless of order
  const tokens = normQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  const scored = TOOLS.map(t => {
    let score = 0;
    const titleLower = t.title.toLowerCase();
    const descLower = t.description.toLowerCase();
    const longDescLower = t.longDescription ? t.longDescription.toLowerCase() : '';
    const idLower = t.id.toLowerCase();
    const seoTitleLower = (t.seoTitle || '').toLowerCase();
    const seoDescLower = (t.seoDescription || '').toLowerCase();
    const keywordArray = t.keywords.map(kw => kw.toLowerCase());

    // Exact full name match (Huge boost)
    if (titleLower === normQuery) {
      score += 1000;
    }
    // Starts with full text match
    else if (titleLower.startsWith(normQuery)) {
      score += 500;
    }
    // Title includes full text
    else if (titleLower.includes(normQuery)) {
      score += 300;
    }

    // Slug / ID match: e.g., "id" is "tools/character-counter" or "character-counter"
    const slugOnly = t.id.replace('tools/', '');
    if (slugOnly === normQuery) {
      score += 800;
    } else if (slugOnly.includes(normQuery)) {
      score += 250;
    } else if (idLower.includes(normQuery)) {
      score += 200;
    }

    // Keyword matching
    if (keywordArray.includes(normQuery)) {
      score += 400;
    } else {
      const matchedKeyword = keywordArray.some(kw => kw.includes(normQuery));
      if (matchedKeyword) {
        score += 150;
      }
    }

    // SEO title match
    if (seoTitleLower.includes(normQuery)) {
      score += 100;
    }

    // Token-based matching (handles partial queries and words in any order)
    let tokensMatched = 0;
    tokens.forEach(token => {
      let matchedInTool = false;
      if (titleLower.includes(token)) {
        score += 50;
        matchedInTool = true;
      }
      if (slugOnly.includes(token)) {
        score += 40;
        matchedInTool = true;
      }
      if (keywordArray.some(kw => kw.includes(token))) {
        score += 30;
        matchedInTool = true;
      }
      if (descLower.includes(token) || longDescLower.includes(token)) {
        score += 20;
        matchedInTool = true;
      }
      if (seoTitleLower.includes(token) || seoDescLower.includes(token)) {
        score += 10;
        matchedInTool = true;
      }

      if (matchedInTool) {
        tokensMatched++;
      }
    });

    if (tokens.length > 1 && tokensMatched === tokens.length) {
      score += 200;
    }

    return { tool: t, score, tokensMatched };
  });

  return scored
    .filter(item => item.score > 0 && item.tokensMatched > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.tool);
}
