import { FaqItem } from '../types.ts';

// Handcrafted, highly optimized FAQs for major tools to guarantee top-tier SEO and AdSense compliance
export const SPECIFIC_TOOL_FAQS: Record<string, FaqItem[]> = {
  'tools/word-counter': [
    {
      id: 1,
      question: 'How does the Word Counter calculate estimated reading time?',
      answer: 'Our Word Counter calculates reading time based on an industry-standard benchmark of 225 words per minute (WPM) for silent reading. For speaking time estimates, it adjusts the calculation to approximately 150 words per minute to match normal conversational pacing.'
    },
    {
      id: 2,
      question: 'Is my text safe and confidential when using this online word counter?',
      answer: 'Absolutely. TextToolkitHub runs entirely offline and client-side. When you paste your article, manuscript, or essay into our Word Counter, all computations are performed locally inside your browser memory. No text is ever uploaded, transmitted, or stored on any server.'
    },
    {
      id: 3,
      question: 'What is keyword density and how should I use the frequency tracker?',
      answer: 'Keyword density is the percentage of times a word appears in a text compared to the total word count. Our tool isolates the top recurring terms (filtering out common stop-words like "the", "and", "is"). To prevent search engine keyword-stuffing penalties, aim to keep your primary keywords between 1% and 2.5% density.'
    },
    {
      id: 4,
      question: 'Does this word counter support counting characters with and without spaces?',
      answer: 'Yes. The Word Counter tracks both metrics simultaneously. The sidebar displays "Characters with Spaces" for formatting constraints like social posts, alongside "Characters (No Spaces)" which is often required for academic papers and professional copy benchmarks.'
    },
    {
      id: 5,
      question: 'Can I copy or export the analyzed text once I am finished?',
      answer: 'Yes, you can easily copy your fully analyzed text to your clipboard with a single click using the copy button, or export it instantly as a clean text file (.txt) using our download action.'
    }
  ],
  'tools/readability-checker': [
    {
      id: 1,
      question: 'What readability formulas are used to calculate the reading ease score?',
      answer: 'Our Readability Checker computes readability based on the Flesch Reading Ease formula and Flesch-Kincaid Grade Level guidelines. These algorithms analyze average sentence lengths and syllable counts per word to estimate reading comprehension levels.'
    },
    {
      id: 2,
      question: 'What is a good Flesch Reading Ease score for general web articles?',
      answer: 'For public blogs, articles, and general SEO web content, a Flesch Reading Ease score between 60 and 70 is ideal. This corresponds to an 8th to 9th-grade reading level, which is easily understood by a broad adult audience.'
    },
    {
      id: 3,
      question: 'How can I improve my readability grade level score?',
      answer: 'To improve and lower your reading grade level (making it easier to read), try shortening your sentences, avoiding complex multi-syllable jargon, and breaking down passive voice walls of text into direct, active sentences.'
    },
    {
      id: 4,
      question: 'Is my confidential draft text safe from being saved or leaked?',
      answer: 'Yes. Like all tools on TextToolkitHub, the Readability Checker is fully sandboxed. All text analysis, syllable counting, and grade estimations run completely inside your local browser. Your data never touches any external servers or databases.'
    },
    {
      id: 5,
      question: 'Does this tool support scanning academic and technical papers?',
      answer: 'Yes. It handles long text blocks seamlessly. It is an excellent tool for scholars, student essayists, and technical writers who want to check syntactic flows and sentence-length variances.'
    }
  ],
  'tools/grammar-checker': [
    {
      id: 1,
      question: 'How does the free online Grammar Checker identify spelling mistakes?',
      answer: 'The Grammar Checker uses local dictionary files and lightweight pattern-matching algorithms within your browser context to highlight potential spelling mistakes, double spacing issues, and punctuation errors in real-time.'
    },
    {
      id: 2,
      question: 'Will this online proofreading tool store or collect my essays?',
      answer: 'Never. TextToolkitHub maintains an offline-first privacy standard. Your writings, drafts, business letters, and emails are processed directly in your web browser memory. No data is ever transmitted, indexed, or stored online.'
    },
    {
      id: 3,
      question: 'How do I apply punctuation and spelling suggestions?',
      answer: 'Our tool automatically scans your text and highlights errors. You can review the highlighted mistakes directly in the editor and click on them to accept the recommended fix, or refine your paragraphs manually before copying.'
    },
    {
      id: 4,
      question: 'Can I check drafts imported from PDFs or scanned documents?',
      answer: 'Yes. PDF and OCR scanning apps frequently introduce jagged line wraps, extra spacing, or typos. Pasting your text into our Grammar Checker is a fast way to identify and purge these formatting errors.'
    },
    {
      id: 5,
      question: 'Is there a character limit when checking grammar on this platform?',
      answer: 'There is no strict character limit. However, for the fastest in-browser parsing performance, we recommend checking your text in segments of under 10,000 words at a time.'
    }
  ],
  'tools/remove-line-breaks': [
    {
      id: 1,
      question: 'Why do PDF documents copy and paste with weird line breaks?',
      answer: 'PDF files utilize fixed-layout formatting, inserting hard carriage returns or line break symbols at the end of each physical line on the page. When you copy this text into a text editor, it treats those line endings as new paragraphs, creating a jagged reading layout.'
    },
    {
      id: 2,
      question: 'How does the Remove Line Breaks tool fix awkward PDF paragraphs?',
      answer: 'Our tool identifies single carriage returns and replaces them with a single space or your chosen delimiter (like a comma). By bridging those lines together, it restores fluid, continuous text paragraphs instantly.'
    },
    {
      id: 3,
      question: 'Can I preserve actual paragraph breaks while removing single lines?',
      answer: 'Yes. By enabling the "Preserve Paragraph Breaks" option, the tool will intelligently leave double line breaks (consecutive enter keys) untouched while flattening single line breaks. This keeps your overall article structure intact.'
    },
    {
      id: 4,
      question: 'Is my data private when cleaning scanned text or transcripts?',
      answer: 'Yes. All formatting, flattening, and separator replacements are done in-memory on your device. Absolutely no text logs, transcripts, or confidential summaries are sent over the internet or saved to our databases.'
    },
    {
      id: 5,
      question: 'What delimiters can I use to replace line endings?',
      answer: 'You can swap line breaks with a standard space, or specify custom delimiters like commas, semicolons, vertical bars (|), or tabs, which is perfect for converting list rows into single-line formats for spreadsheets.'
    }
  ],
  'tools/remove-extra-spaces': [
    {
      id: 1,
      question: 'What does a whitespace sanitizer tool do?',
      answer: 'A whitespace sanitizer scans your text and purges unnecessary spacing structures. It removes leading and trailing padding, collapses multiple consecutive spaces into a single space, strips tab characters, and removes empty blank lines.'
    },
    {
      id: 2,
      question: 'How do double spaces and tabs get created in text files?',
      answer: 'Double spacing and messy margins are commonly generated when copying from spreadsheets, scanning physical paper with OCR apps, or copying raw code layouts. Our tool cleans up these messy alignment blocks in one click.'
    },
    {
      id: 3,
      question: 'Is it safe to clean code scripts and formatted lists here?',
      answer: 'Absolutely. Because all calculations run fully locally inside your own browser window, your scripts, SQL tables, and draft articles remain private. No data is sent to external servers.'
    },
    {
      id: 4,
      question: 'Does this tool remove empty blank lines?',
      answer: 'Yes. You can toggle the "Purge empty lines" checkbox to strip lines that contain zero characters, leaving you with a clean, compact text layout.'
    },
    {
      id: 5,
      question: 'Can I undo a spacing cleanup if it breaks my formatting?',
      answer: 'Yes. Our interface includes a dynamic "Undo" button that appears as soon as you apply a transformation, allowing you to quickly restore your original text layout if needed.'
    }
  ],
  'tools/case-converter': [
    {
      id: 1,
      question: 'What text casing formats does the Case Converter support?',
      answer: 'It supports all major casing transformations: UPPERCASE, lowercase, Title Case, Sentence Case, camelCase, snake_case, kebab-case, alternating cAsE, and inverse CaSe.'
    },
    {
      id: 2,
      question: 'What is the difference between camelCase, snake_case, and kebab-case?',
      answer: 'camelCase joins words with capitalized initials (except the first word, e.g., myVariableName). snake_case joins lowercase words with underscores (my_variable_name), commonly used in database schema names. kebab-case joins lowercase words with hyphens (my-variable-name), which is ideal for SEO-friendly URL slugs.'
    },
    {
      id: 3,
      question: 'How does the Sentence Case converter work?',
      answer: 'The Sentence Case logic automatically converts all text to lowercase, then capitalizes the very first letter of your paragraphs and any letter directly following ending punctuation marks (like periods, question marks, or exclamation points).'
    },
    {
      id: 4,
      question: 'Does the Title Case converter capitalize minor words like "and" or "the"?',
      answer: 'To ensure a versatile layout, our Title Case tool capitalizes the first letter of every word. This ensures clean, uniform headers for blog posts, email subject lines, and book titles.'
    },
    {
      id: 5,
      question: 'Is there a text size limit for converting cases?',
      answer: 'No. The conversion scripts execute instantly in-memory inside your browser, making it capable of handling large articles or developer code files containing thousands of characters without any lag.'
    }
  ],
  'tools/text-compare': [
    {
      id: 1,
      question: 'How does the Text Compare tool calculate differences between documents?',
      answer: 'The Text Compare tool uses a high-performance, browser-based diff algorithm that compares two texts side-by-side or inline. It instantly identifies added characters or rows (highlighted in green) and deleted elements (highlighted in red).'
    },
    {
      id: 2,
      question: 'Is my document text uploaded to servers for diff comparison?',
      answer: 'Never. Both text sources are compared 100% locally inside your browser memory. Your confidential documents, code adjustments, or legal agreements never touch our servers, protecting your privacy.'
    },
    {
      id: 3,
      question: 'Does this diff checker support comparing programming source code?',
      answer: 'Yes, it is highly optimized for comparing source code configurations, system configurations, CSS classes, markdown draft lines, and SQL outputs to easily find code variations.'
    },
    {
      id: 4,
      question: 'Can I see character-level differences or only line differences?',
      answer: 'Our comparison engine performs line-by-line alignments and highlights word and character differences within those lines, making it easy to see exactly what characters were added, removed, or edited.'
    },
    {
      id: 5,
      question: 'Does the Text Compare tool support merging changes?',
      answer: 'It is primarily designed to visualize differences side-by-side. You can easily copy individual corrected lines or download the revised text using our built-in controls.'
    }
  ],
  'tools/contrast-checker': [
    {
      id: 1,
      question: 'What is WCAG 2.1 and how does the Contrast Checker verify compliance?',
      answer: 'WCAG 2.1 (Web Content Accessibility Guidelines) outlines contrast benchmarks to ensure readability for users with visual impairments. Our tool calculates the contrast ratio between foreground text and background colors, checking compliance for AA (minimum 4.5:1 ratio) and AAA (enhanced 7:1 ratio) standards.'
    },
    {
      id: 2,
      question: 'Why is color contrast important for SEO and web usability?',
      answer: 'High contrast ensures that your website content is easily readable by all visitors. Search engines like Google prioritize user experience and accessibility, meaning WCAG-compliant color pairings can indirectly boost your SEO ranking.'
    },
    {
      id: 3,
      question: 'Does this tool support real-time color palettes and color scheme generation?',
      answer: 'Yes! Our Contrast Checker includes interactive sliders for RGB and HSL values, hex code inputs, a list of curated accessible color palettes, and a dynamic recommendation engine that suggests compliant color adjustments.'
    },
    {
      id: 4,
      question: 'Are my custom colors and brand hex codes stored on any server?',
      answer: 'No. The Color Contrast Checker operates entirely inside your local browser. All contrast calculations, color translations, and palette selections are kept fully local to protect your proprietary brand guidelines.'
    },
    {
      id: 5,
      question: 'How do I test color contrast for both small and large text sizes?',
      answer: 'The results board displays compliance badges for small text (under 18pt or 14pt bold) and large text (18pt or 14pt bold and above), because larger text sizes require slightly lower contrast ratios (3:1 for AA) to remain accessible.'
    }
  ],
  'tools/yaml-json-converter': [
    {
      id: 1,
      question: 'Is this YAML to JSON converter safe for enterprise API secrets?',
      answer: 'Yes, absolutely! All parsing, validation, and conversions are executed entirely inside your browser\'s local sandbox, ensuring zero server uploads or credential exposures.'
    },
    {
      id: 2,
      question: 'Can I convert JSON back to YAML format?',
      answer: 'Yes, the tool is bidirectional. You can translate YAML text blocks to formatted JSON configurations and serialize JSON blocks back to clean, comment-safe YAML documents.'
    },
    {
      id: 3,
      question: 'Which indentation rules are supported?',
      answer: 'We support customized indentation sizes including 2-space and 4-space styles, which is standard for Kubernetes manifests, docker-compose systems, and YAML files.'
    },
    {
      id: 4,
      question: 'Does this converter validate nested schemas and highlight errors?',
      answer: 'Yes. It features a real-time validator that checks for common issues such as unbalanced quotes, improper indent spaces, mixed tabs, or missing key-value colon separators, highlighting the exact error line.'
    },
    {
      id: 5,
      question: 'Does it support multi-document YAML conversion?',
      answer: 'Our local converter supports standard single-document YAML maps and arrays, which is highly optimized for standard developer payloads, config files, and JSON payloads.'
    }
  ],
  'tools/uuid-generator': [
    {
      id: 1,
      question: 'What is a Version 4 UUID and how is it generated?',
      answer: 'A Version 4 UUID (Universally Unique Identifier) is a 128-bit identifier generated using cryptographically strong random numbers. It contains 32 hexadecimal characters grouped into five segments separated by hyphens (e.g., 8-4-4-4-12).'
    },
    {
      id: 2,
      question: 'Are the generated UUIDs truly unique and safe for database primary keys?',
      answer: 'Yes. Since they are generated using the browser\'s cryptographically secure Web Crypto API (`window.crypto.getRandomValues`), the probability of a collision is virtually zero, making them highly reliable for distributed database tables.'
    },
    {
      id: 3,
      question: 'Does this UUID generator require an active internet connection?',
      answer: 'No. The entire generation runs client-side in your browser. This offline capability ensures maximum generation speed and complete data privacy.'
    },
    {
      id: 4,
      question: 'What customization options are available for bulk UUID generation?',
      answer: 'You can generate up to 500 UUIDs per batch. Options include toggling uppercase/lowercase styling, adding or removing standard hyphens, and wrapping each ID in custom curly brackets.'
    },
    {
      id: 5,
      question: 'Is there a cost or license restriction for using these UUIDs?',
      answer: 'No. All generated UUIDs are completely in the public domain. You can use them in any personal, open-source, or commercial application without attribution or licensing fees.'
    }
  ],
  'tools/unix-timestamp-converter': [
    {
      id: 1,
      question: 'What is a Unix epoch timestamp?',
      answer: 'A Unix timestamp (epoch time) represents the number of elapsed seconds since January 1, 1970 (00:00:00 UTC), excluding leap seconds. It is a universal integer used in computing systems to track dates independently of timezones.'
    },
    {
      id: 2,
      question: 'Does this converter support both seconds and millisecond timestamps?',
      answer: 'Yes. The converter dynamically detects if your input is a standard 10-digit timestamp (seconds) or a 13-digit timestamp (milliseconds) and displays accurate dates for both styles.'
    },
    {
      id: 3,
      question: 'Can I translate a local calendar date back to raw Unix time?',
      answer: 'Yes, our tool is fully bidirectional. You can use the interactive calendar inputs to specify any date and timezone, and it will instantly calculate the corresponding Unix epoch seconds.'
    },
    {
      id: 4,
      question: 'Is the conversion calculated based on my local timezone or UTC?',
      answer: 'Both! The results panel displays the translated date in your device\'s local timezone as well as the standard Coordinated Universal Time (UTC) to simplify server logs troubleshooting.'
    },
    {
      id: 5,
      question: 'How do I fetch the active current Unix timestamp?',
      answer: 'The page features an active digital clock that displays the current epoch seconds ticking in real-time. You can pause the ticking clock or copy the current timestamp with a single click.'
    }
  ],
  'tools/markdown-table-generator': [
    {
      id: 1,
      question: 'How do I create and edit table content inside this generator?',
      answer: 'Our Markdown Table Generator provides an interactive visual grid editor. Simply use the column and row adder buttons to resize your table, then click directly inside any grid cell to write or edit your values.'
    },
    {
      id: 2,
      question: 'Does this generator support text alignments for columns?',
      answer: 'Yes. You can click on the alignment controls above each column to set text alignment to left-aligned, centered, or right-aligned. The generated Markdown and HTML codes will automatically apply the correct alignment markup.'
    },
    {
      id: 3,
      question: 'Can I import existing CSV files into this visual grid editor?',
      answer: 'Yes, we support backward CSV parsing. You can paste standard comma-separated values into the raw text input tab, and our tool will automatically populate the interactive visual grid for easy editing.'
    },
    {
      id: 4,
      question: 'Does this tool generate Github-Flavored Markdown (GFM) tables?',
      answer: 'Yes. The default output conforms to GitHub-Flavored Markdown tables, which are fully supported on GitHub, GitLab, Reddit, Slack, and almost all major Markdown editors.'
    },
    {
      id: 5,
      question: 'Can I copy the output as clean web-compliant HTML tables?',
      answer: 'Yes, the results panel features a dedicated "HTML Output" tab that instantly renders standard, clean `<table>` markup complete with aligned headers and cells.'
    }
  ],
  'tools/regex-tester': [
    {
      id: 1,
      question: 'How does real-time regex pattern testing work on this platform?',
      answer: 'As you type your regular expression, our sandboxed engine compiles it in real-time. It instantly scans your test text block and highlights all matching strings, captured groups, and match ranges on the fly.'
    },
    {
      id: 2,
      question: 'Which regex flags can I customize inside the tester?',
      answer: 'We support standard RegExp flags: Global (g) for finding all matches, Case-insensitive (i) to ignore uppercase/lowercase bounds, and Multiline (m) to let ^ and $ anchors match line starts and ends.'
    },
    {
      id: 3,
      question: 'Does the tool highlight regular expression syntax errors?',
      answer: 'Yes! If you write an incomplete or invalid regex pattern, our built-in analyzer catches the error and displays a detailed, friendly warning message explaining what is wrong (e.g., unmatched brackets).'
    },
    {
      id: 4,
      question: 'Is my input text secure when testing sensitive logs or user datasets?',
      answer: 'Absolutely. All testing is handled locally by your browser\'s standard JavaScript engine. Your regular expressions, test logs, and personal test files never leave your device.'
    },
    {
      id: 5,
      question: 'What are captured groups and how do I view them?',
      answer: 'Captured groups are sub-expressions enclosed in parentheses `( )`. When matches are found, our tester lists all captured groupings in a dedicated results panel, displaying the precise matched strings alongside their capture indexes.'
    }
  ]
};

// Category-based FAQ generators to provide contextual, relevant FAQs for any tool on the platform
export function getFaqsForTool(
  toolId: string,
  toolTitle: string,
  toolDescription: string,
  toolCategory: string,
  keywords: string[]
): FaqItem[] {
  let faqs: FaqItem[] = [];
  const cleanedId = toolId.replace('tools/', '');
  
  if (SPECIFIC_TOOL_FAQS[toolId]) {
    faqs = [...SPECIFIC_TOOL_FAQS[toolId]];
  } else if (SPECIFIC_TOOL_FAQS[cleanedId]) {
    faqs = [...SPECIFIC_TOOL_FAQS[cleanedId]];
  }

  // If we found a handcrafted list, let's append 2 more custom detailed FAQs to reach 7 FAQs!
  if (faqs.length > 0) {
    if (faqs.length < 7) {
      const extraFaqs = getExtraFaqsForHandcraftedTool(toolId, toolTitle, toolCategory, keywords);
      faqs = [...faqs, ...extraFaqs];
    }
    // Re-index IDs to be sequential 1-7
    return faqs.map((faq, index) => ({
      ...faq,
      id: index + 1
    }));
  }

  // For any other tool, generate a fully unique, highly specific set of 7 FAQs dynamically!
  return generateDynamicFaqsForTool(toolId, toolTitle, toolDescription, toolCategory, keywords);
}

function getExtraFaqsForHandcraftedTool(
  toolId: string,
  toolTitle: string,
  toolCategory: string,
  keywords: string[]
): FaqItem[] {
  const cleanId = toolId.replace('tools/', '');
  
  if (cleanId === 'word-counter') {
    return [
      {
        id: 6,
        question: 'Does the Word Counter track paragraph distributions and grammatical structures?',
        answer: 'Yes. In addition to measuring word frequency distributions, our Word Counter tracks paragraph counts and average sentence lengths. This is valuable for writers aiming to maintain structural balance and clear readability inside their chapters or essays.'
      },
      {
        id: 7,
        question: 'Can I run this Word Counter on mobile phone browsers like Safari or Chrome?',
        answer: 'Absolutely. The entire counter is fully responsive and optimized for mobile screens. You can paste texts, check real-time character lists, and view reading times on your iPhone, iPad, or Android device with zero layout shifting.'
      }
    ];
  }

  if (cleanId === 'readability-checker') {
    return [
      {
        id: 6,
        question: 'How does the Readability Checker handle headings and short paragraphs?',
        answer: 'The checker intelligently filters out bullet lists, headings, and single-phrase titles to prevent them from skewing your readability scores. It focuses specifically on full, continuous sentence structures for mathematical accuracy.'
      },
      {
        id: 7,
        question: 'Is there an option to analyze readability for different age groups or grading systems?',
        answer: 'Yes. The results panel translates the raw Flesch Reading Ease score into standard grade levels (e.g., 5th grade, 8th grade, college graduate) and offers actionable tips to tailor your content for your target audience.'
      }
    ];
  }

  if (cleanId === 'grammar-checker') {
    return [
      {
        id: 6,
        question: 'Does the Grammar Checker automatically save my editing progress?',
        answer: 'Yes, your active editing draft is preserved in temporary browser memory so you don\'t lose progress if you accidentally refresh the page. However, we recommend copying your finalized writing to a local document for permanent storage.'
      },
      {
        id: 7,
        question: 'Can I check files containing programming code mixed with English paragraphs?',
        answer: 'Yes. Our parser handles mixed-content files, though it might flag code structures as spelling slips. You can easily ignore these flags or focus on specific prose sections inside your document.'
      }
    ];
  }

  if (cleanId === 'remove-line-breaks') {
    return [
      {
        id: 6,
        question: 'Does removing line breaks affect special formatting symbols or emojis?',
        answer: 'No. The stripping algorithm targets only carriage returns (\\r) and line feed characters (\\n). All your emojis, symbols, spaces, and custom characters are kept perfectly intact.'
      },
      {
        id: 7,
        question: 'How does the tool handle double line breaks when stripping single line endings?',
        answer: 'When "Preserve Paragraphs" is enabled, the tool treats double line endings as intended paragraph dividers, and only flattens single, wrapped line endings, keeping your overall article structured.'
      }
    ];
  }

  if (cleanId === 'remove-extra-spaces') {
    return [
      {
        id: 6,
        question: 'Can the extra space sanitizer remove empty whitespace rows inside lists?',
        answer: 'Yes. You can toggle the custom "Purge empty lines" checkbox to clean up any blank or whitespace-only rows in your list, giving you a compact, continuous text block.'
      },
      {
        id: 7,
        question: 'How does this space cleaner handle tab indentations inside code snippets?',
        answer: 'You can choose whether to strip tabs entirely or preserve them. If you are cleaning code layouts, we recommend keeping tab spaces to preserve block indentations.'
      }
    ];
  }

  if (cleanId === 'case-converter' || cleanId === 'case-converter-pro') {
    return [
      {
        id: 6,
        question: 'Can the Case Converter handle international characters and special accents?',
        answer: 'Yes! It fully supports unicode casing transitions, meaning letters with accents (like é, ö, or ç) are accurately converted to upper or lower case according to global standards.'
      },
      {
        id: 7,
        question: 'Does the Case Converter support converting list rows in bulk?',
        answer: 'Yes, it easily converts multi-line blocks, list items, and entire code scripts, executing all capitalization transformations in milliseconds inside browser memory.'
      }
    ];
  }

  if (cleanId === 'text-compare') {
    return [
      {
        id: 6,
        question: 'How does the Text Compare engine align paragraphs of different lengths?',
        answer: 'The diff engine uses a longest common subsequence (LCS) algorithm to find structural similarities and align corresponding rows, showing insertions and deletions side-by-side.'
      },
      {
        id: 7,
        question: 'Can I compare documents containing confidential commercial contracts or financial audits?',
        answer: 'Yes, completely. Since the diff comparison is performed strictly on your local processor threads with no server interaction, your proprietary business agreements remain entirely confidential.'
      }
    ];
  }

  if (cleanId === 'contrast-checker') {
    return [
      {
        id: 6,
        question: 'Does the Contrast Checker support testing transparent or semi-transparent colors?',
        answer: 'The tool is optimized for solid hexadecimal values. For transparent elements, we recommend inputting the estimated blended color against the underlying background to get an accurate ratio.'
      },
      {
        id: 7,
        question: 'Can I export my accessible color palettes to CSS stylesheet formats?',
        answer: 'Yes, you can copy the generated hexadecimal values directly from the palette cards to paste them straight into your CSS variables or Tailwind utility configurations.'
      }
    ];
  }

  if (cleanId === 'yaml-json-converter') {
    return [
      {
        id: 6,
        question: 'How does the YAML bidirectional converter handle comments?',
        answer: 'JSON specifications do not support comments, so when converting YAML to JSON, any comments are parsed out. However, converting back to YAML produces a clean, structured YAML map.'
      },
      {
        id: 7,
        question: 'Does this converter support formatting nested arrays inside YAML files?',
        answer: 'Yes. The parser handles complex multi-nested structures, arrays, objects, and configurations smoothly, outputting standard indented YAML or beautified JSON objects.'
      }
    ];
  }

  if (cleanId === 'uuid-generator') {
    return [
      {
        id: 6,
        question: 'What is the structural difference between a UUID and a GUID?',
        answer: 'Historically, GUIDs were Microsoft\'s implementation of UUIDs. Today, both terms are used interchangeably, and our generator produces standard Version 4 identifiers compliant with RFC-4122.'
      },
      {
        id: 7,
        question: 'Can I generate custom prefix or suffix strings for my bulk UUID array?',
        answer: 'Yes, you can configure standard uppercase transformations, braces wrappers, and comma or hyphen separators to tailor the output list to fit your database loading scripts.'
      }
    ];
  }

  if (cleanId === 'unix-timestamp-converter') {
    return [
      {
        id: 6,
        question: 'Does the Epoch converter support handling historical or future millisecond dates?',
        answer: 'Yes. It accurately parses and calculates Unix dates ranging from several decades in the past to many years in the future, displaying precise UTC and local time alignments.'
      },
      {
        id: 7,
        question: 'How does this Unix converter manage daylight saving time (DST) shifts?',
        answer: 'It relies on your browser\'s local timezone settings, which automatically adjust to daylight saving transitions, ensuring your local calendar readouts are always correct.'
      }
    ];
  }

  if (cleanId === 'markdown-table-generator') {
    return [
      {
        id: 6,
        question: 'Can I add bold or italic styling inside the visual grid cells?',
        answer: 'Yes. You can type standard Markdown syntax (such as **bold** or *italics*) directly inside the table cell editor, and it will render perfectly in the generated Markdown and HTML.'
      },
      {
        id: 7,
        question: 'What happens if I paste messy, unformatted tabular rows into the CSV import box?',
        answer: 'The converter parses the text row-by-row, automatically detecting delimiters (commas or tabs) and populating the interactive grid, allowing you to clean up and re-align cells visually.'
      }
    ];
  }

  if (cleanId === 'regex-tester') {
    return [
      {
        id: 6,
        question: 'Can I test global search and case-insensitive regular expressions together?',
        answer: 'Yes, you can toggle both the global (g) and case-insensitive (i) flags in the control bar to test matching and capturing across your entire text sample without casing constraints.'
      },
      {
        id: 7,
        question: 'Is there a visual guide or cheatsheet for common regular expression selectors?',
        answer: 'Yes, the page includes handy visual indicators and status highlights to help you quickly verify standard match ranges, capturing brackets, and word boundary anchors.'
      }
    ];
  }

  // Fallback if no specific match
  return [
    {
      id: 6,
      question: `Is there any subscription fee or API quota limit for using this ${toolTitle}?`,
      answer: `No. All features are completely free with zero subscription requirements, credit card processing fees, or daily execution limits.`
    },
    {
      id: 7,
      question: `Does the ${toolTitle} require a constant internet connection to function?`,
      answer: `No. Once loaded, the browser cache handles all operations. You can disconnect your internet entirely, and the tool will continue to process your parameters smoothly.`
    }
  ];
}

function generateDynamicFaqsForTool(
  toolId: string,
  toolTitle: string,
  toolDescription: string,
  toolCategory: string,
  keywords: string[]
): FaqItem[] {
  const cleanTitle = toolTitle.replace(/\s*\(.*\)/, '');
  const primaryKw = keywords && keywords.length > 0 ? keywords[0] : cleanTitle.toLowerCase();
  const secondaryKw = keywords && keywords.length > 1 ? keywords[1] : 'online utility';

  // Determine the archetype based on ID and category
  let archetype = 'text'; // fallback
  if (
    toolCategory === 'pdf-utilities' || 
    toolCategory === 'converter' || 
    toolId.includes('pdf') || 
    toolId.includes('excel') || 
    toolId.includes('csv') || 
    toolId.includes('table') || 
    toolId.includes('document-builder')
  ) {
    archetype = 'pdf-excel';
  } else if (
    toolCategory === 'image-media' || 
    toolId.includes('image') || 
    toolId.includes('compressor') || 
    toolId.includes('speech') || 
    toolId.includes('audio') || 
    toolId.includes('morse') || 
    toolId.includes('contrast')
  ) {
    archetype = 'image';
  } else if (
    toolCategory === 'developer-encoding' || 
    toolCategory === 'encoding' || 
    toolId.includes('json') || 
    toolId.includes('jwt') || 
    toolId.includes('regex') || 
    toolId.includes('yaml') || 
    toolId.includes('cron') || 
    toolId.includes('hash') || 
    toolId.includes('uuid') || 
    toolId.includes('escaper') || 
    toolId.includes('base64') || 
    toolId.includes('url') || 
    toolId.includes('html-encoder') || 
    toolId.includes('html-decoder') || 
    toolId.includes('css') || 
    toolId.includes('ua-parser') || 
    toolId.includes('typedef') || 
    toolId.includes('binary')
  ) {
    archetype = 'developer';
  }

  const faqs: FaqItem[] = [];

  if (archetype === 'pdf-excel') {
    faqs.push(
      {
        id: 1,
        question: `How does the ${cleanTitle} handle file parsing and vector table extractions?`,
        answer: `The ${cleanTitle} integrates optimized JavaScript binary compilers and document parsers right inside your browser window. When you select a document, sheet, or file, our engine reads the binary byte structure directly in local RAM. It instantly extracts page layers, grid structures, alignments, or cell values, ensuring high-speed formatting and razor-sharp outputs without waiting for server queues or remote processing.`
      },
      {
        id: 2,
        question: `Is my confidential business data or PDF file secure when using the ${cleanTitle}?`,
        answer: `Yes, completely secure. TextToolkitHub is designed with an offline-first browser sandbox model. Unlike typical converters that upload spreadsheets or PDF drafts to cloud servers, our ${cleanTitle} processes 100% of your data locally on your device. Absolutely no file data, clipboard strings, or private information ever leave your browser, making it safe for corporate financial reports, legal drafts, and sensitive database uploads.`
      },
      {
        id: 3,
        question: `What are the maximum file sizes, page limits, and layout parameters supported?`,
        answer: `This tool supports high-volume documents and multi-tab layouts seamlessly. For optimal browser thread responsiveness, we suggest processing file bundles under 100MB. The engine accurately retains complex cell borders, multi-lingual unicode characters, and page orientations. You can tailor formatting parameters, margins, landscapes, or column selections unhindered, with zero limits or throttling.`
      },
      {
        id: 4,
        question: `Why is a browser-based ${cleanTitle} superior to remote cloud converters?`,
        answer: `Standard cloud tools upload your documents to shared queue systems, which creates privacy vulnerabilities and delays. The ${cleanTitle} executes instantly inside your local hardware environment, saving you massive network bandwidth and avoiding queue counters or subscription advertisements. It serves as a light, premium, and private desktop-class utility.`
      },
      {
        id: 5,
        question: `What are the most common formatting errors to avoid during ${primaryKw} processing?`,
        answer: `A frequent pitfall is uploading sheets with missing header references, corrupted cell arrays, or overlapping page range inputs (e.g. '1-3, 2-5'), which duplicate PDF pages. Before converting or split operations, ensure your cell data is organized, empty margins are cleaned, and custom page ranges are specified clearly to avoid layout shifting.`
      },
      {
        id: 6,
        question: `Can I download the processed files instantly, and are there any usage charges?`,
        answer: `Yes, you can download your compiled PDF files or Excel tables immediately after processing with a single tap. All features of the ${cleanTitle} are 100% free for both personal and high-volume commercial use, with zero registration barriers, premium licensing requirements, or promotional branding watermarks on your files.`
      },
      {
        id: 7,
        question: `Does the ${cleanTitle} require a constant network connection to function?`,
        answer: `No. Once the web page loads in your browser, the entire formatting, merging, splitting, or compiling logic is cached locally. You can disconnect your internet entirely, and the ${cleanTitle} will continue to parse, align, and generate files smoothly, making it ideal for offline travel or highly secure corporate environments.`
      }
    );
  } else if (archetype === 'image') {
    faqs.push(
      {
        id: 1,
        question: `How does the ${cleanTitle} process visual media or system audio layouts?`,
        answer: `The ${cleanTitle} utilizes high-performance browser-native graphics threads and local hardware APIs (such as GPU canvas contexts, Web Audio synthesis, or local speech engines) to process elements in real-time. By running computations in-memory on your device, it translates signals, scales pixels, or plays custom vocalizations with zero network lag, offering interactive controls and instant feedback.`
      },
      {
        id: 2,
        question: `How does the ${cleanTitle} ensure complete privacy for my photo or voice data?`,
        answer: `Privacy is our absolute priority. Unlike typical media processors that transmit audio or photos to cloud servers, the ${cleanTitle} executes entirely client-side. Your images, coordinates, synthesized speech lines, or color contrast values remain strictly inside your browser sandbox. No telemetry, media logs, or confidential details are shared or saved online.`
      },
      {
        id: 3,
        question: `What formats, character guidelines, or quality boundaries are supported?`,
        answer: `Our ${cleanTitle} is fully optimized for standard WebP, PNG, JPEG, and system voice formats. For fast on-device rendering, we recommend keeping file uploads under 50MB. All sliders, timing speeds, pitch levels, and error-correction variables can be customized in real-time, allowing you to run bulk optimizations and reach professional results with ease.`
      },
      {
        id: 4,
        question: `How does this browser-native ${cleanTitle} compare to paid design suites?`,
        answer: `It provides a completely visual, interactive workspace with the privacy of offline processing without requiring complex installations, registration, or command-line scripts. There is no software bloat or commercial popups, giving you a streamlined, lightweight utility for rapid daily workflow optimizations.`
      },
      {
        id: 5,
        question: `What is a common pitfall when configuring parameters for ${primaryKw}?`,
        answer: `A frequent error is repeatedly converting or compressing already-optimized visual files, which can degrade quality. For audio elements, setting timing speeds too high can scramble beeps or vocal rhythms. Always preview your outputs inside our responsive cards and adjust variables incrementally to maintain pristine visual and auditory clarity.`
      },
      {
        id: 6,
        question: `Can I export the results easily, and are there any commercial usage restrictions?`,
        answer: `Yes, you can copy codes, download optimized WebP/PNG graphics, or export files instantly with single-click buttons. All generated files and outputs from the ${cleanTitle} are 100% free for both personal and unrestricted commercial distribution with no attribution, subscription paywalls, or fees.`
      },
      {
        id: 7,
        question: `Does the ${cleanTitle} run offline or require an API license key?`,
        answer: `No API keys or accounts are needed. The ${cleanTitle} is completely offline-capable. Once cached in your browser, you can disconnect from the internet and utilize the entire interface to resize photos, synthesize beeps, or check layouts safely in secure, private offline workspaces.`
      }
    );
  } else if (archetype === 'developer') {
    faqs.push(
      {
        id: 1,
        question: `What programming schemas, standards, and syntax does the ${cleanTitle} support?`,
        answer: `The ${cleanTitle} is engineered to fully comply with modern development specifications, including RFC-8259 for JSON formatting, standard JWT cryptographic token headers, regex match captures, and web-safe encoding protocols. It features a high-performance monospaced syntax editor with real-time token validation, indentation tuning, and collapsible key maps.`
      },
      {
        id: 2,
        question: `Is my sensitive code, database credentials, or secret API keys secure here?`,
        answer: `Absolutely. Since the ${cleanTitle} executes 100% in your local browser thread, your API secret keys, database credentials, active tokens, and raw configurations are kept completely secure in your physical RAM. No telemetry requests or analytics trackers are used, protecting your parameters from server leaks or network exposures.`
      },
      {
        id: 3,
        question: `How does the ${cleanTitle} continuous validator detect and flag parsing errors?`,
        answer: `Our browser-based parser compiles and scans your strings in real-time as you type or paste. If it detects a missing curly bracket, a trailing comma, an unescaped symbol, or an invalid character sequence, it instantly highlights the exact line with visual warnings and outputs a detailed error message.`
      },
      {
        id: 4,
        question: `How does this local developer utility benefit dev-ops and full-stack engineering?`,
        answer: `It provides an isolated, secure playground to quickly decode, format, minify, or hash variables without configuring local Python scripts, npm packages, or command-line utilities. It handles complex, multi-nested database structures effortlessly and includes instant clipboard copy and text backups.`
      },
      {
        id: 5,
        question: `What is a common error developers should avoid when working with ${primaryKw}?`,
        answer: `A frequent mistake is pasting JSON payloads with trailing commas, which are invalid under standard RFC validation, or testing complex regular expressions that trigger catastrophic backtracking in browsers. For encodings like Base64 or URL percent-escapes, always distinguish between plain layout formatting and actual data encryption.`
      },
      {
        id: 6,
        question: `Is there any API rate-limiting, daily quota, or commercial license fee?`,
        answer: `No. Every feature of the ${cleanTitle} is completely free, open-source, and unthrottled. You can generate, format, or convert infinite tokens and configurations anonymously without creating an account or subscribing to any plan. All outputs are in the public domain and ready for deployment.`
      },
      {
        id: 7,
        question: `Can I use the ${cleanTitle} offline in secure or isolated corporate networks?`,
        answer: `Yes, easily. The ${cleanTitle} works 100% offline. Once loaded, the browser cached files handle all validation, formatting, and cryptography locally. You can completely disconnect from external networks, giving you a quiet, isolated workspace to inspect proprietary server configs with absolute peace of mind.`
      }
    );
  } else {
    // text archetype
    faqs.push(
      {
        id: 1,
        question: `How does the ${cleanTitle} analyze, clean, or format text rows?`,
        answer: `The ${cleanTitle} employs optimized string processing scripts that run directly in your browser. By utilizing regular expression search patterns and Unicode segmenters, the tool splits lines, deletes duplicates, cleans spaces, reformats text casings, or tracks readability counts instantly, ensuring fluid performance even with long documents.`
      },
      {
        id: 2,
        question: `Is my written article, essay draft, or contact list secure from data scraping?`,
        answer: `Yes, 100% safe. All parsing, cleaning, and formatting processes are sandboxed inside your local browser memory. None of your drafts, manuscripts, or customer contact listings are ever sent over the network or recorded to server logs, giving you a secure, private text workspace.`
      },
      {
        id: 3,
        question: `Does the ${cleanTitle} support international characters and Unicode accents?`,
        answer: `Yes. Our engine fully supports international character sets, accented letters, emojis, and special punctuation symbols. While there is no strict input limit, we recommend pasting texts of under 50,000 words at a time to maintain optimal browser responsiveness and instant calculation speeds.`
      },
      {
        id: 4,
        question: `How does the ${cleanTitle} assist content writers, editors, and digital marketers?`,
        answer: `It removes the tedious, manual effort of restructuring or sanitizing messy drafts. In a single tap, you can deduplicate large email lists, strip line breaks from copy-pasted PDF documents, format casing, organize lists alphabetically, or analyze reading time, accelerating your writing and publication process.`
      },
      {
        id: 5,
        question: `What editing pitfall should I avoid when running a ${primaryKw} check?`,
        answer: `A frequent error is applying a deep sanitizing filter (like stripping spaces or lines) to code layouts or data arrays that rely on precise tab spacing and alignments, which can break execution. Always keep a copy of your raw text draft before applying extensive formatting or sorting operations.`
      },
      {
        id: 6,
        question: `How do I export my finished writing, and are there any licensing restrictions?`,
        answer: `Our clean, high-contrast interface features direct 'Copy to Clipboard' buttons and single-tap text file exports. All formatted drafts, cleaned lists, and structured copy are 100% yours to distribute, publish, or use commercially without any license restrictions, fees, or branding watermarks.`
      },
      {
        id: 7,
        question: `Can I run the ${cleanTitle} offline in remote areas or flights?`,
        answer: `Yes, the ${cleanTitle} is completely offline-capable. Once the application page is loaded in your browser cache, you can disconnect from the internet and continue to edit, format, count, and sanitize your content smoothly in any location, with zero cell data consumption.`
      }
    );
  }

  return faqs;
}
