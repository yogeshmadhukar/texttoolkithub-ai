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
  ]
};

// Smart template builders for different tool categories to generate 100% accurate, highly relevant FAQs for any of the 51+ tools
export function getFaqsForTool(toolId: string, toolTitle: string, toolDescription: string, toolCategory: string, keywords: string[]): FaqItem[] {
  // Return the handcrafted list if it exists
  if (SPECIFIC_TOOL_FAQS[toolId]) {
    return SPECIFIC_TOOL_FAQS[toolId];
  }

  // Fallback to tools ID matching without "tools/" prefix
  const cleanedId = toolId.replace('tools/', '');
  if (SPECIFIC_TOOL_FAQS[cleanedId]) {
    return SPECIFIC_TOOL_FAQS[cleanedId];
  }

  const primeKeyword = keywords && keywords.length > 0 ? keywords[0] : toolTitle.toLowerCase();
  const secondaryKeyword = keywords && keywords.length > 1 ? keywords[1] : 'text formatting';

  // Construct a beautiful category-specific list
  const faqs: FaqItem[] = [];

  // Question 1: What is the tool & what does it do? (Universal & Searchable)
  faqs.push({
    id: 1,
    question: `What is the ${toolTitle} tool and how does it work?`,
    answer: `The ${toolTitle} is a free, web-based text utility on TextToolkitHub designed to ${toolDescription.toLowerCase().replace(/\.$/, '')}. It processes your input values dynamically in real-time, performing all calculations and text updates locally in your browser.`
  });

  // Question 2: Privacy (Universal & highly relevant for compliance)
  faqs.push({
    id: 2,
    question: `Is my text secure when using the online ${toolTitle}?`,
    answer: `Absolutely. TextToolkitHub is designed with an offline-first privacy model. When you use the ${toolTitle}, all data computations are executed directly on your local device using standard client-side JavaScript. No text buffers, custom keys, or files are ever sent over the network or saved to our servers.`
  });

  // Question 3: How to use (Practical & Natural)
  faqs.push({
    id: 3,
    question: `How do I format or generate text using this online ${toolTitle}?`,
    answer: `Using the ${toolTitle} is incredibly simple: 1. Paste, type, or load sample text inside the central input area. 2. Adjust any optional formatting parameters or configuration toggle checkers. 3. Watch the results update instantly, or click the action trigger button. 4. Click copy or download your pristine results.`
  });

  // Category-specific Question 4
  if (toolCategory === 'analyzer') {
    faqs.push({
      id: 4,
      question: `How accurate are the counts and calculations generated by the ${toolTitle}?`,
      answer: `The ${toolTitle} uses highly accurate string segmentation algorithms that conform to professional coding standards. It accurately counts characters, words, sentences, or other metrics instantly. While robust for blogging and SEO, we recommend validating output metrics for official legal or corporate compliance requirements.`
    });
  } else if (toolCategory === 'cleaner') {
    faqs.push({
      id: 4,
      question: `Can the ${toolTitle} handle large datasets without lagging?`,
      answer: `Yes, the underlying cleanup algorithms are highly optimized in-memory scripts. The ${toolTitle} can easily parse, sanitize, and format massive lists or documents containing thousands of rows instantly without causing any browser stutter or freeze.`
    });
  } else if (toolCategory === 'converter') {
    faqs.push({
      id: 4,
      question: `What formats does the ${toolTitle} support and can I undo changes?`,
      answer: `The ${toolTitle} is built to support popular developer and writer formats. Yes, you can instantly undo any changes! As soon as you apply a casing or formatting conversion, our interface shows a quick 'Undo' action button to reverse the change.`
    });
  } else if (toolCategory === 'encoding') {
    faqs.push({
      id: 4,
      question: `Why should I use this browser-based ${toolTitle} over command-line scripts?`,
      answer: `This online ${toolTitle} provides a friendly, high-contrast visual user interface that highlights syntax errors and allows interactive inspections (such as collapsible trees or byte size indicators) without requiring any complex software installs.`
    });
  } else {
    // generator
    faqs.push({
      id: 4,
      question: `Can I customize the generated results from the ${toolTitle}?`,
      answer: `Yes, the ${toolTitle} offers sliders, checkboxes, and style pickers to let you customize the output volume, length, vocabulary theme, or characters. You can generate exactly what you need with pixel-perfect control.`
    });
  }

  // Question 5: Licensing & Commercial Use (Searchable & extremely relevant for users)
  faqs.push({
    id: 5,
    question: `Can I use the output of the ${toolTitle} for commercial projects?`,
    answer: `Yes, 100%. All formatted content, code snippets, generated placeholders, or files created with the ${toolTitle} are completely free to use. There are no licensing restrictions, usage limits, or attribution requirements whatsoever.`
  });

  return faqs;
}
