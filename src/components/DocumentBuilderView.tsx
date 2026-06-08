import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Settings, 
  Download, 
  Copy, 
  Check, 
  Trash2, 
  RotateCcw, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft, 
  HelpCircle, 
  Info, 
  Sliders, 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify, 
  Layers, 
  Printer, 
  Maximize2,
  FileDown,
  ArrowUpRight,
  BookOpen,
  Calendar,
  Briefcase,
  Users
} from 'lucide-react';
import { TOOLS } from '../data.ts';

interface DocumentBuilderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface DocumentTemplate {
  id: string;
  name: string;
  tagline: string;
  icon: React.ReactNode;
  defaultText: string;
  fontFamily: 'times' | 'helvetica' | 'courier';
  fontSize: number;
  lineHeight: number;
  alignment: 'left' | 'center' | 'right' | 'justify';
  marginSize: 'normal' | 'narrow' | 'wide';
  pageSize: 'letter' | 'legal' | 'a3' | 'a4' | 'a5' | 'executive';
  headerOn: boolean;
  footerOn: boolean;
  pageNumbersOn: boolean;
  title: string;
  headerText: string;
  footerText: string;
  indentParagraphs: boolean;
}

interface LineItem {
  text: string;
  isParagraphStart: boolean;
  isParagraphEnd: boolean;
  isHeading?: boolean;
  headingLevel?: number;
  isListItem?: boolean;
}

interface PageItem {
  lines: LineItem[];
  pageNumber: number;
  computedTitleSize?: number;
}

export type PageSizeType = 'letter' | 'legal' | 'a3' | 'a4' | 'a5' | 'executive';

export const PAGE_DIMENSIONS: Record<PageSizeType, { width: number; height: number; name: string }> = {
  letter: { width: 612.0, height: 792.0, name: 'US Letter (8.5" x 11")' },
  legal: { width: 612.0, height: 1008.0, name: 'US Legal (8.5" x 14")' },
  a3: { width: 841.89, height: 1190.55, name: 'A3 Standard (297mm x 420mm)' },
  a4: { width: 595.28, height: 841.89, name: 'A4 Standard (210mm x 297mm)' },
  a5: { width: 419.53, height: 595.28, name: 'A5 Standard (148mm x 210mm)' },
  executive: { width: 521.86, height: 756.0, name: 'Executive (7.25" x 10.5")' }
};

export default function DocumentBuilderView({ onNavigateToTool, onNavigateHome }: DocumentBuilderViewProps) {
  // Mobile active tab: 'edit' or 'preview'
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  // Left side options tab: 'content' or 'appearance'
  const [optionsTab, setOptionsTab] = useState<'content' | 'appearance'>('content');

  // Document customization states
  const [inputText, setInputText] = useState('');
  const [titleText, setTitleText] = useState('My Documents Blueprint');
  const [headerText, setHeaderText] = useState('Document Draft');
  const [footerText, setFooterText] = useState('Created with Document Builder');
  
  const [fontFamily, setFontFamily] = useState<'times' | 'helvetica' | 'courier'>('helvetica');
  const [fontSize, setFontSize] = useState<number>(11);
  const [lineHeight, setLineHeight] = useState<number>(1.5);
  const [alignment, setAlignment] = useState<'left' | 'center' | 'right' | 'justify'>('left');
  const [marginSize, setMarginSize] = useState<'normal' | 'narrow' | 'wide'>('normal');
  const [pageSize, setPageSize] = useState<PageSizeType>('letter');
  
  const [headerOn, setHeaderOn] = useState<boolean>(true);
  const [footerOn, setFooterOn] = useState<boolean>(true);
  const [pageNumbersOn, setPageNumbersOn] = useState<boolean>(true);
  const [indentParagraphs, setIndentParagraphs] = useState<boolean>(false);
  const [coverTitleOn, setCoverTitleOn] = useState<boolean>(true);
  const [watermark, setWatermark] = useState<'none' | 'draft' | 'confidential'>('none');
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('clean');
  
  const [copied, setCopied] = useState(false);
  const [txtDownloaded, setTxtDownloaded] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Pagination results state
  const [pages, setPages] = useState<PageItem[]>([]);

  // SEO Parameters
  const seoTitle = "Document Builder - Format Text and Create Professional PDFs Online";
  const seoDescription = "Convert plain text into beautifully formatted PDF documents. Create books, essays, reports, articles, and print-ready files instantly with our free Document Builder.";

  // Templates Definitions
  const templates: DocumentTemplate[] = [
    {
      id: 'clean',
      name: 'Clean Professional',
      tagline: 'Standard geometric design suitable for general copywriting.',
      icon: <FileText className="w-4 h-4 text-slate-500" />,
      fontFamily: 'helvetica',
      fontSize: 11,
      lineHeight: 1.5,
      alignment: 'left',
      marginSize: 'normal',
      pageSize: 'letter',
      headerOn: true,
      headerText: 'TEXTTOOLKITHUB OFFICE REQUISITE',
      footerOn: true,
      footerText: 'Confidentiality Guaranteed | Client-Side Security',
      pageNumbersOn: true,
      indentParagraphs: false,
      title: 'Commercial Draft Design',
      defaultText: `Executive Concept Overview\n\nThis workflow optimizes unstructured documents into print-ready typeset formats completely inside your sandboxed web browser. Utilizing high-fidelity client-side alignment mathematics, elements compute with real-time feedback corresponding perfectly to physical paper spacing.\n\nAll modifications respect safety and absolute local parameters. No data packets traverse remote connections, keeping confidential copy protected and integrated safely. Use this clean layout for letters, quick drafts, and corporate documentation layouts.`
    },
    {
      id: 'book',
      name: 'Book Format',
      tagline: 'Classic literary style with indented paragraphs.',
      icon: <BookOpen className="w-4 h-4 text-emerald-500" />,
      fontFamily: 'times',
      fontSize: 11,
      lineHeight: 1.5,
      alignment: 'justify',
      marginSize: 'normal',
      pageSize: 'letter',
      headerOn: true,
      headerText: 'CHAPTER ONE — THE ECHO STORY',
      footerOn: true,
      footerText: 'THE CHRONICLES OF MODERN CORE',
      pageNumbersOn: true,
      indentParagraphs: true,
      title: 'Chapter 1: The New Paradigm',
      defaultText: `The wind had a sharp edge to it, carrying the salt and moisture of the harbor up through the narrow avenues. Arthur made his way quickly through the heavy oak doors, though not quickly enough to prevent a swirl of golden aspen leaves from trailing in behind him.\n\nThe tall hallway smelled of old mahogany and polished brass. At one end, a large grandfather clock beat a steady, deep rhythm that echoed off the white wainscoting. It was a familiar, grounding tone, a song of constants in a rapidly changing world. He paused to tighten his collar, contemplating the letters waiting on his desk.\n\nHis study was nested several flights up, and he stepped slowly, tracing the elegant contours of the wooden bannister. Each floor boasted high ceilings and wide windows that looked out over the sloping rooftops of the seaside colony. Today the harbor was covered in a soft pewter haze, and the quiet ships bobbed like dreams upon the slate waves.`
    },
    {
      id: 'essay',
      name: 'Academic Essay',
      tagline: 'Formal double-spaced theme matching academic criteria.',
      icon: <Sliders className="w-4 h-4 text-indigo-500" />,
      fontFamily: 'times',
      fontSize: 12,
      lineHeight: 2.0,
      alignment: 'left',
      marginSize: 'normal',
      pageSize: 'letter',
      headerOn: false,
      headerText: '',
      footerOn: true,
      footerText: 'Department of Humanities & Rhetoric',
      pageNumbersOn: true,
      indentParagraphs: true,
      title: 'Post-Digital Communication Paradigms',
      defaultText: `A Critical Analysis of Client-Side Web Architecture\n\nThe expansion of immediate browser-native computing represents a paradigm shift in data transmission methodologies. By migrating procedural operations from remote servers directly into browser viewport memory, applications can preserve the integrity of user information while mitigating latencies associated with standard RESTful api Handshakes.\n\nFurthermore, this architecture introduces a robust defense mechanism against transactional data breaches. Traditional servers act as massive hubs for potential data harvesting; conversely, client-only utility pipelines ensure that information is processed, rendered, and disposed of locally within the client's private volatile storage layers. Consequently, safety metrics scale exponentially as decentralized local nodes supersede monolithic backends.`
    },
    {
      id: 'report',
      name: 'Business Report',
      tagline: 'High-density blueprint with headers and page splits.',
      icon: <Briefcase className="w-4 h-4 text-blue-500" />,
      fontFamily: 'helvetica',
      fontSize: 10,
      lineHeight: 1.3,
      alignment: 'justify',
      marginSize: 'normal',
      pageSize: 'letter',
      headerOn: true,
      headerText: 'ANNUAL STRATEGIC PRODUCTIVITY REVIEW',
      footerOn: true,
      footerText: 'TextToolkitHub Corporates | Q2 Executive Audit',
      pageNumbersOn: true,
      indentParagraphs: false,
      title: 'Q2 Performance & Operations Strategy',
      defaultText: `1.0 EXECUTIVE SUMMARY\n\nThe purpose of this report is to review procedural workflows and standardize document conversion across all operational verticals. Data indicates that adopting client-side text sanitization models has reduced document formatting times by 42% across corporate design benches, resulting in immediate efficiency gains.\n\n2.0 KEY PRODUCTIVITY INDICATORS\n\n• User Productivity Index: Increased by 15.4% due to responsive local processing speeds.\n• Security Incidence Rate: Maintained at 0.0% as a result of our strictly offline-first processing protocol.\n• Standardized Documentation Formats: 100% compliance achieved utilizing the preloaded Document templates.\n\n3.0 NEXT STEPS AND RECOMMENDATIONS\n\nIt is highly recommended that departments fully phase out third-party cloud-based typesetting proxies. Replacing them with localized client-side suites will protect trade assets, secure strategic legal drafts, and eliminate overhead bandwidth costs.`
    },
    {
      id: 'notes',
      name: 'Meeting Notes',
      tagline: 'Structured monospaced layout for agendas and records.',
      icon: <Users className="w-4 h-4 text-violet-500" />,
      fontFamily: 'courier',
      fontSize: 10,
      lineHeight: 1.3,
      alignment: 'left',
      marginSize: 'normal',
      pageSize: 'letter',
      headerOn: true,
      headerText: 'CORE TEAM WEEKLY SYNC NOTES',
      footerOn: true,
      footerText: 'Weekly Review Record - Confidential Internals Only',
      pageNumbersOn: true,
      indentParagraphs: false,
      title: 'TextToolkitHub Developer Sync Meeting',
      defaultText: `DATE: June 8, 2026\nFACILITATOR: Senior Architect\nPARTICIPANTS: Engineering Team, Product, SEO Specialist\n\nAGENDA ITEMS:\n1. Release of Document Builder Premium Tool\n2. Validation of Offline PDF Generation Engines\n3. Search Optimization Verification\n\nDISCUSSION DIGEST:\n- The Document Builder is successfully running client-side with jsPDF integrations. Lines split dynamically depending on font family and margin pt dimensions.\n- Live preview is executing with sub-millisecond lag, ensuring editing is highly fluid.\n\nACTION ASSIGNMENTS:\n[TASK 01] Launch Document Builder to tools/document-builder URL path. (Dev - Complete)\n[TASK 02] Verify canonical tags, JSON-LD faq integration, and robots indexing. (SEO - Complete)\n[TASK 03] Audit and run lint validation to confirm zero viewport errors. (QA - Complete)`
    }
  ];

  // FAQ Dataset
  const faqs = [
    {
      id: 1,
      question: "Is my text data safe when generating PDFs?",
      answer: "Absolutely. Security is our absolute priority. This Document Builder runs 100% locally in your browser workspace. All text formatting, page layouts, and PDF generation calculations are handled in client-side memory using jsPDF. No information is ever uploaded to a server or sent through external APIs."
    },
    {
      id: 2,
      question: "How does the Document Builder format paragraphs automatically?",
      answer: "When you click 'Auto-Optimize Format' or type text, our formatting engine runs smart typographical filters: it converts straight quotes into elegant curly quotes, collapses multiple adjacent blank lines, trims trailing whitespaces, and ensures correct grammatical spacing after terminal punctuation marks (.!?)."
    },
    {
      id: 3,
      question: "Why does the Document Builder's live preview look pixel-perfect?",
      answer: "We use a headless instance of the actual jsPDF library inside our state logic to split and wrap text according to your chosen font family, size, line spacing, and margin padding. Because the exact same rendering algorithm calculates the pages for both the browser preview and the exported file, they match perfectly down to the single line!"
    },
    {
      id: 4,
      question: "Which document size presets are supported?",
      answer: "We currently support standard physical page dimensions: A4 (210mm x 297mm / 595.28 pt x 841.89 pt) and US Letter (215.9mm x 279.4mm / 612.0 pt x 792.0 pt) in Portrait orientation, supporting standard corporate, legal, and literary layouts."
    },
    {
      id: 5,
      question: "Can I copy the formatted text instead of downloading a PDF?",
      answer: "Yes! There are dedicated buttons to export your optimized text. You can copy the cleaned/formatted text with typographical curly quotes directly to your clipboard, download it as a standard Plain Text (.txt) file, or download the full print-ready vectorized PDF document."
    }
  ];

  // Set default text based on template on mount
  useEffect(() => {
    const defaultTpl = templates.find(t => t.id === 'clean') || templates[0];
    setInputText(defaultTpl.defaultText);
    setTitleText(defaultTpl.title);
    setHeaderText(defaultTpl.headerText);
    setFooterText(defaultTpl.footerText);
    setFontFamily(defaultTpl.fontFamily);
    setFontSize(defaultTpl.fontSize);
    setLineHeight(defaultTpl.lineHeight);
    setAlignment(defaultTpl.alignment);
    setMarginSize(defaultTpl.marginSize);
    setPageSize(defaultTpl.pageSize);
    setHeaderOn(defaultTpl.headerOn);
    setFooterOn(defaultTpl.footerOn);
    setPageNumbersOn(defaultTpl.pageNumbersOn);
    setIndentParagraphs(defaultTpl.indentParagraphs);
  }, []);

  // Recalculate Page Pagination on Option / Input Changes
  useEffect(() => {
    if (!inputText) {
      setPages([]);
      return;
    }

    // Call pagination logic with title content
    const calculatedPages = paginateText(
      inputText,
      fontFamily,
      fontSize,
      lineHeight,
      pageSize,
      marginSize,
      indentParagraphs,
      coverTitleOn ? titleText : ''
    );
    setPages(calculatedPages);
  }, [inputText, fontFamily, fontSize, lineHeight, pageSize, marginSize, indentParagraphs, titleText, coverTitleOn]);

  // Handle template selection change
  const handleTemplateSelect = (templateId: string) => {
    const tpl = templates.find(t => t.id === templateId);
    if (!tpl) return;

    setSelectedTemplate(templateId);
    setInputText(tpl.defaultText);
    setTitleText(tpl.title);
    setHeaderText(tpl.headerText);
    setFooterText(tpl.footerText);
    setFontFamily(tpl.fontFamily);
    setFontSize(tpl.fontSize);
    setLineHeight(tpl.lineHeight);
    setAlignment(tpl.alignment);
    setMarginSize(tpl.marginSize);
    setPageSize(tpl.pageSize);
    setHeaderOn(tpl.headerOn);
    setFooterOn(tpl.footerOn);
    setPageNumbersOn(tpl.pageNumbersOn);
    setIndentParagraphs(tpl.indentParagraphs);
  };

  // Typographical Text Optimizer Action
  const handleAutoFormat = () => {
    if (!inputText) return;
    
    let text = inputText;

    // A. Standardize line breaks
    text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // B. Trim spacing on each individual row line
    text = text.split('\n').map(l => l.trim()).join('\n');

    // C. Collapse excessive empty rows (limit to double newline)
    text = text.replace(/\n{3,}/g, '\n\n');

    // D. Normalize duplicate inner spaces
    text = text.replace(/[ \t]+/g, ' ');

    // E. Apply Smart Typographical Curly Quotes
    // Double quotes
    text = text.replace(/"([^"]*)"/g, '“$1”');
    // Single quotes
    text = text.replace(/'([^']*)'/g, '‘$1’');
    // Catch-all trailing curly double quotes
    text = text.replace(/(\w)"/g, '$1”').replace(/"(\w)/g, '“$1');
    // Ensure clean single space after terminal punctuation (sentence wrapping spacing helper)
    text = text.replace(/([.!?])([A-Za-z“‘])/g, '$1 $2');

    setInputText(text);

    // Track analytics using custom event tracking
    try {
      const toolId = 'document-builder';
      (window as any).gtag && (window as any).gtag('event', 'tool_optimized', {
        tool_id: toolId,
        word_count: text.split(/\s+/).filter(Boolean).length
      });
    } catch (e) {}
  };

  // Download PDF completely client-side with high-precision vectorial fonts
  const handleDownloadPDF = () => {
    if (pages.length === 0) return;

    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: pageSize
      });

      const fontStyle = fontFamily === 'times' ? 'times' : fontFamily === 'courier' ? 'courier' : 'helvetica';
      const pageDims = PAGE_DIMENSIONS[pageSize] || PAGE_DIMENSIONS.letter;
      const pageHeight = pageDims.height;
      const pageWidth = pageDims.width;

      let margins = { x: 72, y: 72 };
      if (marginSize === 'narrow') {
        margins = { x: 36, y: 54 };
      } else if (marginSize === 'wide') {
        margins = { x: 108, y: 90 };
      }

      const textWidth = pageWidth - (margins.x * 2);
      const paragraphGap = fontSize * 0.6;

      pages.forEach((page, pageIdx) => {
        if (pageIdx > 0) {
          doc.addPage();
        }

        // DRAW WATERMARK OVERLAY (Behind the content)
        if (watermark !== 'none') {
          const hasGState = typeof (doc as any).saveGraphicsState === 'function';
          let opacityApplied = false;
          if (hasGState) {
            try {
              (doc as any).saveGraphicsState();
              // Get the GState constructor from the document instance or standard jsPDF
              const GStateConstructor = (doc as any).GState || (jsPDF as any).GState || ((doc as any).internal && (doc as any).internal.GState);
              if (GStateConstructor) {
                (doc as any).setGState(new GStateConstructor({ opacity: 0.10 }));
                opacityApplied = true;
              }
            } catch (e) {
              console.warn("Could not apply GState opacity:", e);
            }
          }

          doc.setFont(fontStyle, 'bold');
          doc.setFontSize(48 + Math.floor(pageWidth / 12));
          
          if (opacityApplied) {
            // When real opacity is applied, we use a darker gray color (slate-400) which becomes beautifully lightened
            doc.setTextColor(148, 163, 184); // slate-400
          } else {
            // Fallback: If opacity could not be applied via GState, we use an extremely light grey color directly
            doc.setTextColor(240, 242, 245);
          }
          
          const wText = watermark === 'draft' ? 'DRAFT' : 'CONFIDENTIAL';
          doc.text(wText, pageWidth / 2, pageHeight / 2, {
            align: 'center',
            angle: 45 // 45 degrees counter-clockwise in jsPDF (starts bottom-left to top-right)
          });

          if (hasGState) {
            try {
              (doc as any).restoreGraphicsState();
            } catch (e) {
              // ignore
            }
          }
        }

        let yCursor = margins.y;

        // If page 1, draw the beautiful main document title
        if (page.pageNumber === 1 && coverTitleOn && titleText.trim()) {
          let titleSize = page.computedTitleSize;
          if (!titleSize) {
            titleSize = Math.max(16, fontSize * 1.85);
            let titleLineHeight = titleSize * 1.25;
            doc.setFont(fontStyle, 'bold');
            doc.setFontSize(titleSize);
            let titleLines = doc.splitTextToSize(titleText.trim(), textWidth);
            const availableHeight = pageHeight - (margins.y * 2);
            let attempts = 0;
            while (titleLines.length * (titleSize * 1.25) > availableHeight * 0.35 && titleSize > 10 && attempts < 10) {
              titleSize -= 1;
              titleLineHeight = titleSize * 1.25;
              doc.setFontSize(titleSize);
              titleLines = doc.splitTextToSize(titleText.trim(), textWidth);
              attempts++;
            }
          }

          const titleLineHeight = titleSize * 1.25;
          doc.setFont(fontStyle, 'bold');
          doc.setFontSize(titleSize);
          doc.setTextColor(15, 23, 42); // slate-900

          const titleLines = doc.splitTextToSize(titleText.trim(), textWidth);
          titleLines.forEach((titleLine) => {
            let drawTitleX = margins.x;
            let alignTitle: 'left' | 'center' | 'right' = 'left';
            if (alignment === 'center') {
              drawTitleX = pageWidth / 2;
              alignTitle = 'center';
            } else if (alignment === 'right') {
              drawTitleX = pageWidth - margins.x;
              alignTitle = 'right';
            }
            doc.text(titleLine, drawTitleX, yCursor + titleSize, { align: alignTitle });
            yCursor += titleLineHeight;
          });

          // Draw an elegant, thin professional decorative ruled separator
          yCursor += 12;
          doc.setDrawColor(99, 102, 241); // indigo-500
          doc.setLineWidth(1.5);
          doc.line(margins.x, yCursor, margins.x + 40, yCursor); // Nice minimalist accent bar
          
          doc.setDrawColor(226, 232, 240); // slate-200
          doc.setLineWidth(0.5);
          doc.line(margins.x, yCursor + 1, margins.x + textWidth, yCursor + 1); // Full thin border rule

          yCursor += 28; // Gap before first line
        }

        page.lines.forEach((line, lineIdx) => {
          const isHeading = line.isHeading;
          const level = line.headingLevel || 0;
          const isListItem = line.isListItem;

          // Compute font settings for this line
          let currentStyle: 'normal' | 'bold' = 'normal';
          let currentSize = fontSize;
          let currentLineHeight = fontSize * lineHeight;

          if (isHeading) {
            currentStyle = 'bold';
            if (level === 1) currentSize = fontSize * 1.35;
            else if (level === 2) currentSize = fontSize * 1.18;
            else currentSize = fontSize * 1.08;
            currentLineHeight = currentSize * lineHeight;
          }

          // Apply font size and style
          doc.setFont(fontStyle, currentStyle);
          doc.setFontSize(currentSize);

          if (isHeading) {
            doc.setTextColor(15, 23, 42); // slate-900
          } else {
            doc.setTextColor(30, 41, 59); // zinc-800
          }

          // Gap before paragraph / heading
          if (line.isParagraphStart && lineIdx > 0) {
            if (isHeading) {
              yCursor += paragraphGap * 1.8;
            } else {
              yCursor += paragraphGap;
            }
          }

          // Compute draw coordinates (X & alignment)
          let drawX = margins.x;
          let alignArg: 'left' | 'center' | 'right' | 'justify' = 'left';

          if (isListItem) {
            drawX = margins.x + 15; // Indent lists
          } else if (alignment === 'center') {
            drawX = pageWidth / 2;
            alignArg = 'center';
          } else if (alignment === 'right') {
            drawX = pageWidth - margins.x;
            alignArg = 'right';
          } else if (alignment === 'justify') {
            if (line.isParagraphEnd) {
              drawX = margins.x;
              alignArg = 'left';
            } else {
              drawX = margins.x;
              alignArg = 'justify';
            }
          }

          // Draw list bullet dot
          if (isListItem && line.isParagraphStart) {
            doc.setFont(fontStyle, 'bold');
            doc.setFontSize(fontSize);
            doc.setTextColor(99, 102, 241); // indigo-500
            doc.text('•', margins.x + 3, yCursor + fontSize - 1);
            // Restore font representation
            doc.setFont(fontStyle, currentStyle);
            doc.setFontSize(currentSize);
            doc.setTextColor(30, 41, 59);
          }

          // Draw lines
          const textOptions: any = { align: alignArg };
          if (alignArg === 'justify') {
            textOptions.maxWidth = isListItem ? textWidth - 15 : textWidth;
          }
          doc.text(line.text, drawX, yCursor + currentSize, textOptions);

          yCursor += currentLineHeight;
        });

        // DRAW HEADER (If enabled)
        if (headerOn) {
          doc.setFont(fontStyle, 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139); // slate-500
          
          let cleanHeaderStr = headerText ? headerText.toUpperCase() : (titleText ? titleText.toUpperCase() : "DOCUMENT DRAFT");
          if (cleanHeaderStr.length > 55) {
            cleanHeaderStr = cleanHeaderStr.slice(0, 52) + "...";
          }
          doc.text(cleanHeaderStr, pageWidth / 2, margins.y - 32, { align: 'center' });
          
          doc.setDrawColor(203, 213, 225); // slate-300
          doc.setLineWidth(0.5);
          doc.line(margins.x, margins.y - 20, pageWidth - margins.x, margins.y - 20);
        }

        // DRAW FOOTER / PAGE NUMBERS (If enabled)
        if (footerOn || pageNumbersOn) {
          doc.setDrawColor(203, 213, 225); // slate-300
          doc.setLineWidth(0.5);
          doc.line(margins.x, pageHeight - margins.y + 12, pageWidth - margins.x, pageHeight - margins.y + 12);

          doc.setFont(fontStyle, 'normal');
          doc.setFontSize(8);
          doc.setTextColor(100, 116, 139); // slate-500

          if (footerOn) {
            doc.text(footerText || "TextToolkitHub Document Builder", margins.x, pageHeight - margins.y + 24, { align: 'left' });
          }

          if (pageNumbersOn) {
            const pageStr = `${page.pageNumber} of ${pages.length}`;
            doc.text(pageStr, pageWidth - margins.x, pageHeight - margins.y + 24, { align: 'right' });
          }
        }
      });

      const fileSafeTitle = titleText.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const dateStr = new Date().toISOString().slice(0, 10);
      doc.save(`${fileSafeTitle || 'typeset-document'}_${dateStr}.pdf`);
      
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 2000);
    } catch (e) {
      console.error("PDF generation error: ", e);
    }
  };

  // Copy structured optimized text to clipboard
  const handleCopyText = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download raw plain text file
  const handleDownloadTXT = () => {
    if (!inputText) return;
    const blob = new Blob([inputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileSafeTitle = titleText.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    link.download = `${fileSafeTitle || 'document'}.txt`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 150);
    setTxtDownloaded(true);
    setTimeout(() => setTxtDownloaded(false), 2000);
  };

  // Clear Editor Canvas
  const handleClear = () => {
    setInputText('');
    setTitleText('');
    setHeaderText('');
    setFooterText('');
  };

  // Metric calculation
  const getWordCount = () => inputText.split(/\s+/).filter(Boolean).length;
  const getCharCount = () => inputText.length;
  const getEstimatedReadingTime = () => {
    const w = getWordCount();
    return Math.max(1, Math.ceil(w / 200)); // ~200 WPM
  };

  // React page preview coordinates calculations
  const pageDims = PAGE_DIMENSIONS[pageSize] || PAGE_DIMENSIONS.letter;
  
  // Base dimensions in pt
  const pageWidthPt = pageDims.width;
  const pageHeightPt = pageDims.height;
  
  let margins = { x: 72, y: 72 };
  if (marginSize === 'narrow') {
    margins = { x: 36, y: 54 };
  } else if (marginSize === 'wide') {
    margins = { x: 108, y: 90 };
  }

  // Calculate percentages for inline absolute layouts
  const padXPref = `${(margins.x / pageWidthPt) * 100}%`;
  const padYPref = `${(margins.y / pageHeightPt) * 100}%`;

  // Dynamic SEO Setup & Schema-FAQ JSON-LD Injection
  useEffect(() => {
    const previousTitle = document.title;
    document.title = seoTitle;

    let metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute('content') || "";
    
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', seoDescription);

    const schemaContent = {
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

    const scriptId = "document-builder-json-ld";
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
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/55 dark:bg-slate-900/60 pb-16 pt-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SEO Breadcrumb Navigation */}
        <nav className="flex px-1 mb-5 text-xs text-slate-400 dark:text-slate-500 font-sans" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <button 
                onClick={onNavigateHome} 
                className="inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer font-semibold transition"
              >
                Home
              </button>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-600" />
                <button 
                  onClick={() => onNavigateToTool('tools')} 
                  className="ml-1 md:ml-2 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer font-semibold transition"
                >
                  Tools
                </button>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="w-3.5 h-3.5 text-slate-350 dark:text-slate-600" />
                <span className="ml-1 md:ml-2 text-slate-500 dark:text-slate-400 font-bold select-none">
                  Document Builder
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Header Hero Title Section */}
        <div className="text-center md:text-left mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100/50 dark:border-indigo-900/40 rounded-full mb-3 shadow-sm select-none">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span className="text-[10.5px] font-extrabold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
              Flagship Premium Utility
            </span>
          </div>
          <h1 className="text-2xl md:text-3.5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none font-sans">
            Document Builder
          </h1>
          <p className="max-w-3xl text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Transform plain text into beautifully formatted, print-ready PDF documents completely client-side. Convert books, essays, business reports, and assign templates instantly with local browser security.
          </p>
        </div>

        {/* Global Progress Workflow Metrics Segment */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 select-none font-sans">
          <div className="p-3 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 rounded-xl relative overflow-hidden backdrop-blur-md">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest block">Phase 1</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">1. Paste Raw Text</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-10"><Type className="w-8 h-8" /></div>
          </div>
          <div className="p-3 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 rounded-xl relative overflow-hidden backdrop-blur-md">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest block">Phase 2</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">2. Choose Template</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-10"><Layers className="w-8 h-8" /></div>
          </div>
          <div className="p-3 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 rounded-xl relative overflow-hidden backdrop-blur-md">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest block">Phase 3</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">3. Adjust Styles</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-10"><Sliders className="w-8 h-8" /></div>
          </div>
          <div className="p-3 bg-white/60 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/60 rounded-xl relative overflow-hidden backdrop-blur-md">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-extrabold tracking-widest block">Phase 4</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 block">4. Live Preview</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-10"><Printer className="w-8 h-8" /></div>
          </div>
          <div className="col-span-2 md:col-span-1 p-3 bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100/50 dark:border-indigo-900/30 rounded-xl relative overflow-hidden backdrop-blur-md">
            <span className="text-[10px] text-indigo-500 dark:text-indigo-400 uppercase font-extrabold tracking-widest block">Phase 5</span>
            <span className="text-xs font-bold text-indigo-750 dark:text-indigo-300 mt-1 block">5. Download PDF</span>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-10 text-indigo-500"><Download className="w-8 h-8" /></div>
          </div>
        </div>

        {/* Mobile View tab Switcher */}
        <div className="flex md:hidden p-1 bg-slate-200/40 dark:bg-slate-800/30 rounded-full border border-slate-200/20 max-w-sm mx-auto mb-6 select-none shadow-sm text-xs font-bold">
          <button 
            type="button"
            onClick={() => setMobileTab('edit')}
            className={`flex-1 py-2 rounded-full transition cursor-pointer ${
              mobileTab === 'edit' 
                ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            Editor & Styles
          </button>
          <button 
            type="button"
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2 rounded-full transition cursor-pointer relative ${
              mobileTab === 'preview' 
                ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-100'
            }`}
          >
            Digital Preview ({pages.length})
            {pages.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold animate-pulse">
                {pages.length}p
              </span>
            )}
          </button>
        </div>

        {/* Primary Workspace: Desktop 2-Column Split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Inputs & Configuration Workspace */}
          <div className={`md:col-span-5 space-y-6 ${mobileTab !== 'edit' ? 'hidden md:block' : ''}`}>
            
            {/* Glassmorphic Options & Preset Toggles Wrapper */}
            <div className="bg-white/80 dark:bg-slate-950/40 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 rounded-2.5xl shadow-xl overflow-hidden shadow-slate-200/30 dark:shadow-none flex flex-col p-4 md:p-5">
              
              {/* Controls Category Tabs */}
              <div className="flex bg-slate-100/70 dark:bg-slate-900/60 p-1 rounded-2xl border border-slate-200/10 dark:border-slate-800/30 mb-5 select-none text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setOptionsTab('content')}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    optionsTab === 'content'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Draft Canvas
                </button>
                <button
                  type="button"
                  onClick={() => setOptionsTab('appearance')}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    optionsTab === 'appearance'
                      ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-705 dark:hover:text-slate-350'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Styles & Presets
                </button>
              </div>

              {/* TAB CONTENT: Draft Canvas & Template Chooser */}
              {optionsTab === 'content' ? (
                <div className="space-y-4 animate-in fade-in duration-150 flex flex-col">
                  
                  {/* Template Chooser Grid Grid-layout */}
                  <div className="flex flex-col select-none">
                    <label className="text-[10.5px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 block">
                      Choose Presets Template
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {templates.map(tpl => {
                        const isSel = selectedTemplate === tpl.id;
                        return (
                          <div
                            key={tpl.id}
                            onClick={() => handleTemplateSelect(tpl.id)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-2.5 ${
                              isSel
                                ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-500/80 ring-2 ring-indigo-500/10'
                                : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-850/50'
                            }`}
                          >
                            <div className="p-1.5 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-lg shrink-0">
                              {tpl.icon}
                            </div>
                            <div className="min-w-0">
                              <span className="text-[11.5px] font-bold block text-slate-800 dark:text-slate-200 leading-tight">
                                {tpl.name}
                              </span>
                              <span className="text-[9px] text-slate-400 dark:text-slate-500 block truncate leading-relaxed">
                                {tpl.tagline}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Input Fields Area */}
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-1.5 select-none">
                      <label htmlFor="doc-input-editor" className="text-[10.5px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider block">
                        Main Paste Canvas Text
                      </label>
                      <button
                        onClick={handleAutoFormat}
                        disabled={!inputText}
                        className="text-[10.5px] font-extrabold text-indigo-600 dark:text-indigo-400 hover:opacity-80 transition flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Optimize paragraphs and format smart quotes of pasted content"
                      >
                        <Sparkles className="w-3 h-3" />
                        Auto Format Layout
                      </button>
                    </div>
                    <textarea
                      id="doc-input-editor"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Paste your raw unstructured text or draft chapters here..."
                      className="w-full h-80 min-h-[220px] p-3.5 bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl text-[12.5px] text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 font-sans leading-relaxed focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 resize-none"
                    />
                  </div>

                  {/* Operational Character Counters metadata metrics */}
                  <div className="grid grid-cols-4 gap-2 bg-slate-50/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200/10 dark:border-slate-800/30 text-center select-none font-sans">
                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 tracking-wider block">Words</span>
                      <span className="text-[13px] font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">{getWordCount()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 tracking-wider block">Characters</span>
                      <span className="text-[13px] font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">{getCharCount()}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 tracking-wider block">Reading Time</span>
                      <span className="text-[13px] font-extrabold text-slate-800 dark:text-slate-200 block mt-0.5">{getEstimatedReadingTime()}m</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-450 dark:text-slate-500 tracking-wider block">Est. Pages</span>
                      <span className="text-[13px] font-extrabold text-indigo-600 dark:text-indigo-400 block mt-0.5">
                        {pages.length || 1}
                      </span>
                    </div>
                  </div>

                </div>
              ) : (
                
                // TAB CONTENT: Detailed Appearance Properties
                <div className="space-y-4 animate-in fade-in duration-150 text-left">
                  
                  {/* General Details Fields Customization */}
                  <div className="grid grid-cols-1 gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3.5">
                    <div>
                      <label htmlFor="title-field" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                        Cover Title Header
                      </label>
                      <input
                        id="title-field"
                        type="text"
                        value={titleText}
                        onChange={(e) => setTitleText(e.target.value)}
                        placeholder="Document Title"
                        className="w-full px-3 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:border-indigo-505"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="header-field" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                          Top Header Left Text
                        </label>
                        <input
                          id="header-field"
                          type="text"
                          value={headerText}
                          onChange={(e) => setHeaderText(e.target.value)}
                          placeholder="Header Label"
                          disabled={!headerOn}
                          className="w-full px-3 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:border-indigo-505 disabled:opacity-40"
                        />
                      </div>
                      <div>
                        <label htmlFor="footer-field" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                          Bottom Footer Center Text
                        </label>
                        <input
                          id="footer-field"
                          type="text"
                          value={footerText}
                          onChange={(e) => setFooterText(e.target.value)}
                          placeholder="Footer Label"
                          disabled={!footerOn}
                          className="w-full px-3 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-800 dark:text-slate-100 font-sans focus:outline-none focus:border-indigo-505 disabled:opacity-40"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Typography options selectors */}
                  <div className="grid grid-cols-2 gap-3 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                    
                    {/* Font Family Selection */}
                    <div>
                      <label htmlFor="font-family-select" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                        Font Family
                      </label>
                      <select
                        id="font-family-select"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value="helvetica">Helvetica (Sans-Serif)</option>
                        <option value="times">Times Roman (Serif)</option>
                        <option value="courier">Courier (Monospace)</option>
                      </select>
                    </div>

                    {/* Font Size Selector */}
                    <div>
                      <label htmlFor="font-size-select" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                        Font Size
                      </label>
                      <select
                        id="font-size-select"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value={10}>10 pt (High Density)</option>
                        <option value={11}>11 pt (Standard Brief)</option>
                        <option value={12}>12 pt (Academic Scholarly)</option>
                        <option value={14}>14 pt (Large Readability)</option>
                        <option value={16}>16 pt (Executive View)</option>
                      </select>
                    </div>

                    {/* Line spacing heights */}
                    <div>
                      <label htmlFor="line-spacing-select" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                        Line spacing
                      </label>
                      <select
                        id="line-spacing-select"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                      >
                        <option value={1.15}>1.15 px (Compact Line)</option>
                        <option value={1.3}>1.30 px (Standard Line)</option>
                        <option value={1.5}>1.50 px (Loose Space)</option>
                        <option value={2.0}>2.00 px (Academic Double)</option>
                      </select>
                    </div>

                    {/* General Page layout sizes standard */}
                    <div>
                      <label htmlFor="page-size-select" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                        Page standard size
                      </label>
                      <select
                        id="page-size-select"
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value as any)}
                        className="w-full px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                      >
                        <option value="letter">US Letter (8.5" x 11")</option>
                        <option value="legal">US Legal (8.5" x 14")</option>
                        <option value="executive">Executive (7.25" x 10.5")</option>
                        <option value="a3">A3 Standard (297mm x 420mm)</option>
                        <option value="a4">A4 Standard (210mm x 297mm)</option>
                        <option value="a5">A5 Standard (148mm x 210mm)</option>
                      </select>
                    </div>
                  </div>

                  {/* Alignments & Border Setup Margins controls */}
                  <div className="space-y-3.5 pb-2 border-b border-slate-100 dark:border-slate-800">
                    
                    {/* Aligns layout row */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                        Justification Alignment
                      </span>
                      <div className="flex bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-0.5 select-none text-xs">
                        {(['left', 'center', 'right', 'justify'] as const).map(align => {
                          const isSel = alignment === align;
                          return (
                            <button
                              key={align}
                              type="button"
                              onClick={() => setAlignment(align)}
                              className={`flex-1 py-1.5 rounded-md transition flex items-center justify-center cursor-pointer capitalize ${
                                isSel 
                                  ? 'bg-white dark:bg-slate-950 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold' 
                                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                              }`}
                            >
                              {align === 'left' && <AlignLeft className="w-3.5 h-3.5 mr-1" />}
                              {align === 'center' && <AlignCenter className="w-3.5 h-3.5 mr-1" />}
                              {align === 'right' && <AlignRight className="w-3.5 h-3.5 mr-1" />}
                              {align === 'justify' && <AlignJustify className="w-3.5 h-3.5 mr-1" />}
                              {align}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Margins selection segment */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="margin-sizes-select" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                          Border Margin Padding
                        </label>
                        <select
                          id="margin-sizes-select"
                          value={marginSize}
                          onChange={(e) => setMarginSize(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="normal">Normal (1.0 inch)</option>
                          <option value="narrow">Narrow (0.5 inch)</option>
                          <option value="wide">Wide (1.5 inch)</option>
                        </select>
                      </div>

                      {/* Traditional indents */}
                      <div className="flex flex-col justify-end">
                        <label className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block select-none">
                          Paragraph Indents
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer select-none py-1">
                          <input 
                            type="checkbox"
                            checked={indentParagraphs}
                            onChange={(e) => setIndentParagraphs(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                          <span className="ml-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                            First line indent
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Watermark Selection */}
                    <div className="grid grid-cols-1 gap-3 pt-2">
                       <div>
                        <label htmlFor="watermark-select" className="text-[10px] font-extrabold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                          Document Watermark Overlay
                        </label>
                        <select
                          id="watermark-select"
                          value={watermark}
                          onChange={(e) => setWatermark(e.target.value as any)}
                          className="w-full px-2.5 py-1.5 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-705 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="none">None (Clean Page)</option>
                          <option value="draft">Draft watermark (Diagonal)</option>
                          <option value="confidential">Confidential watermark (Diagonal)</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* Switches for page numbers and dividers */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 py-1 select-none">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={headerOn}
                        onChange={(e) => setHeaderOn(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3.5px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ml-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Header On
                      </span>
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={footerOn}
                        onChange={(e) => setFooterOn(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3.5px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ml-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Footer On
                      </span>
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={pageNumbersOn}
                        onChange={(e) => setPageNumbersOn(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3.5px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ml-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Page Numbers
                      </span>
                    </label>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={coverTitleOn}
                        onChange={(e) => setCoverTitleOn(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3.5px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
                      <span className="ml-2 text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        Cover Title
                      </span>
                    </label>
                  </div>

                </div>
              )}

              {/* Universal Action operational row buttons */}
              <div className="border-t border-slate-100 dark:border-slate-800/80 mt-5 pt-4">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!inputText && !titleText}
                  className="w-full px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900/30 dark:hover:bg-slate-800/20 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>

            </div>

            {/* Quick Helper Tip banner */}
            <div className="bg-gradient-to-r from-indigo-50/40 to-slate-50/50 dark:from-indigo-950/10 dark:to-slate-950/10 border border-indigo-100/30 dark:border-indigo-900/20 p-4 rounded-2xl flex gap-3 text-left">
              <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 block">Typographical Tip</span>
                <span className="text-[11.5px] text-slate-500 dark:text-slate-400 block leading-relaxed mt-1">
                  Use the <strong>Smart Quote converter</strong> under 'Draft Canvas &rarr; Auto Format Layout' to translate typewriter quotation marks into published book-style curly quotes (“curly quotes”) before exporting!
                </span>
              </div>
            </div>

          </div>

          {/* Right Panel: Genuinely formatted physically scaled preview */}
          <div className={`md:col-span-7 flex flex-col items-center gap-4 ${mobileTab !== 'preview' ? 'hidden md:flex' : ''}`}>
            
            {/* Top Preview action menu */}
            <div className="w-full flex justify-between items-center bg-white/70 dark:bg-slate-950/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shadow-md shadow-slate-200/10 dark:shadow-none select-none font-sans">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-350 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200/10">
                  {PAGE_DIMENSIONS[pageSize]?.name.split(' (')[0] || pageSize.toUpperCase()} Portrait Layout
                </span>
              </div>
              
              {/* Copy / TXT / PDF Export actions */}
              <div className="flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={handleCopyText}
                  disabled={!inputText}
                  className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-250 dark:border-slate-800 text-[10.5px] font-bold text-slate-600 dark:text-slate-300 rounded-lg transition flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Copy unpaginated plain text"
                >
                  {copied ? <Check className="w-3" /> : <Copy className="w-3" />}
                  {copied ? 'Copied' : 'Copy Plain'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={!inputText}
                  className="p-1 px-2.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 border border-blue-100/50 dark:border-blue-900/50 text-[10.5px] font-bold text-blue-600 dark:text-blue-400 rounded-lg transition flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Download professional PDF document"
                >
                  {pdfDownloaded ? <Check className="w-3 text-emerald-500 animate-bounce" /> : <FileDown className="w-3" />}
                  {pdfDownloaded ? 'Exported!' : 'Download PDF'}
                </button>
              </div>
            </div>

            {/* Simulated paper pagination canvas blocks */}
            {pages.length > 0 ? (
              <div className="w-full space-y-8 max-h-[850px] overflow-y-auto pr-1 select-text scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {(() => {
                  const toLayoutSize = (ptVal: number) => `calc(${ptVal} * 100cqw / ${pageWidthPt})`;
                  return pages.map((page, pageIdx) => {
                    return (
                      <motion.div
                        key={page.pageNumber}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: Math.min(pageIdx * 0.05, 0.3) }}
                        className="w-full relative shadow-2xl border border-slate-200/50 dark:border-slate-800 bg-white text-slate-800 dark:text-slate-900 overflow-hidden text-left flex flex-col font-sans transition-shadow hover:shadow-indigo-500/5"
                        style={{ 
                          aspectRatio: `${pageWidthPt} / ${pageHeightPt}`,
                          containerType: 'inline-size'
                        }}
                      >
                        {/* WATERMARK OVERLAY */}
                        {watermark !== 'none' && (
                          <div 
                            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
                          >
                            <div 
                              className="text-slate-400 dark:text-slate-500 font-extrabold select-none tracking-[0.25em] text-center whitespace-nowrap"
                              style={{
                                transform: 'rotate(-45deg)',
                                fontSize: '11cqw',
                                opacity: 0.10
                              }}
                            >
                              {watermark === 'draft' ? 'DRAFT' : 'CONFIDENTIAL'}
                            </div>
                          </div>
                        )}

                        {/* Inner margin padding simulator */}
                        <div 
                          className="w-full h-full relative flex flex-col pointer-events-none select-text z-10"
                          style={{
                            paddingLeft: toLayoutSize(margins.x),
                            paddingRight: toLayoutSize(margins.x),
                            paddingTop: toLayoutSize(margins.y),
                            paddingBottom: toLayoutSize(margins.y)
                          }}
                        >
                          
                          {/* ABSOLUTE HEADER DIVIDERS */}
                          {headerOn && (
                            <div 
                              className="absolute left-0 right-0 border-b border-slate-200 flex items-center justify-center pointer-events-none select-none font-bold text-slate-400 font-sans whitespace-nowrap overflow-hidden text-ellipsis px-2"
                              style={{
                                top: toLayoutSize(margins.y - 32),
                                left: toLayoutSize(margins.x),
                                right: toLayoutSize(margins.x),
                                height: toLayoutSize(18),
                                fontSize: toLayoutSize(8)
                              }}
                            >
                              <span>
                                {(() => {
                                  let str = headerText ? headerText.toUpperCase() : (titleText ? titleText.toUpperCase() : "DOCUMENT OUTLINE");
                                  if (str.length > 55) return str.slice(0, 52) + "...";
                                  return str;
                                })()}
                              </span>
                            </div>
                          )}

                          {/* DIGITAL PAGINATED LINES GRID */}
                          <div 
                            className="w-full flex-grow flex flex-col justify-start text-left select-text"
                            style={{
                              fontFamily: fontFamily === 'times' ? 'Georgia, serif' : fontFamily === 'courier' ? '"Courier New", Courier, monospace' : 'Arial, Helvetica, sans-serif',
                              lineHeight: lineHeight,
                              textAlign: alignment === 'justify' ? 'justify' : alignment
                            }}
                          >
                            {/* Page 1 Document Title Banner block */}
                            {page.pageNumber === 1 && coverTitleOn && titleText.trim() && (
                              <div 
                                className="w-full text-slate-900"
                                style={{ marginBottom: toLayoutSize(28) }}
                              >
                                <h1 
                                  className="font-bold text-slate-900 tracking-tight"
                                  style={{
                                    fontSize: toLayoutSize(page.computedTitleSize || Math.max(16, fontSize * 1.85)),
                                    lineHeight: 1.25,
                                    textAlign: alignment === 'justify' ? 'left' : alignment
                                  }}
                                >
                                  {titleText}
                                </h1>
                                <div 
                                  className="flex flex-col mt-1"
                                  style={{ marginTop: toLayoutSize(12) }}
                                >
                                  <div 
                                    className="bg-indigo-500 rounded-full" 
                                    style={{
                                      alignSelf: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
                                      height: toLayoutSize(2.5),
                                      width: toLayoutSize(40)
                                    }}
                                  />
                                  <div 
                                    className="w-full bg-slate-200" 
                                    style={{
                                      height: toLayoutSize(0.5),
                                      marginTop: toLayoutSize(4)
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                            {page.lines.map((line, lineIdx) => {
                              const isHeading = line.isHeading;
                              const level = line.headingLevel || 0;
                              const isListItem = line.isListItem;

                              let currentSize = fontSize;
                              let fontWeight = 'bold' as const;
                              if (isHeading) {
                                if (level === 1) currentSize = fontSize * 1.35;
                                else if (level === 2) currentSize = fontSize * 1.18;
                                else currentSize = fontSize * 1.08;
                              } else {
                                fontWeight = 'normal' as any;
                              }

                              let gapSize = '0px';
                              if (line.isParagraphStart && lineIdx > 0) {
                                gapSize = isHeading ? toLayoutSize(fontSize * 1.18) : toLayoutSize(fontSize * 0.6);
                              }

                              // Alignments and justification implementation for block line divs
                              let lineAlign: any = undefined;
                              let lineAlignLast: any = undefined;
                              if (alignment === 'justify') {
                                if (line.isParagraphEnd) {
                                  lineAlign = 'left';
                                } else {
                                  lineAlign = 'justify';
                                  lineAlignLast = 'justify';
                                }
                              }

                              return (
                                <div 
                                  key={lineIdx}
                                  className="block relative"
                                  style={{
                                    fontSize: toLayoutSize(currentSize),
                                    fontWeight: fontWeight,
                                    marginTop: gapSize,
                                    paddingLeft: isListItem ? toLayoutSize(15) : '0px',
                                    color: isHeading ? '#0f172a' : '#1e293b',
                                    textAlign: lineAlign,
                                    textAlignLast: lineAlignLast
                                  }}
                                >
                                  {isListItem && line.isParagraphStart && (
                                    <span 
                                      className="absolute text-indigo-500 font-sans font-bold"
                                      style={{
                                        left: '0px',
                                        fontSize: toLayoutSize(fontSize)
                                      }}
                                    >
                                      •
                                    </span>
                                  )}
                                  {line.text}
                                </div>
                              );
                            })}
                          </div>

                          {/* ABSOLUTE FOOTER METRICS DIVIDER */}
                          {(footerOn || pageNumbersOn) && (
                            <div 
                              className="absolute left-0 right-0 border-t border-slate-200 flex justify-between items-center pointer-events-none select-none font-bold text-slate-400 font-sans"
                              style={{
                                bottom: toLayoutSize(margins.y - 28),
                                left: toLayoutSize(margins.x),
                                right: toLayoutSize(margins.x),
                                height: toLayoutSize(18),
                                fontSize: toLayoutSize(8)
                              }}
                            >
                              <span>{footerOn ? (footerText || "TextToolkitHub") : ""}</span>
                              <span>{pageNumbersOn ? `${page.pageNumber} of ${pages.length}` : ""}</span>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    );
                  });
                })()}
              </div>
            ) : (
              
              // Empty editor canvas layout preview state
              <div 
                className="w-full relative shadow-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-950/20 rounded-2xl flex flex-col items-center justify-center text-center p-8 select-none transition-all"
                style={{ aspectRatio: `${pageWidthPt} / ${pageHeightPt}` }}
              >
                <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse mb-3" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 block">
                  Write or paste text to build your paper
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 block max-w-sm leading-relaxed mt-1">
                  Once you add copy to the paste canvas workspace, your pixel-perfect document paginator will dynamically layout page sheets here.
                </span>
              </div>
            )}

            {/* Document stats summary badge */}
            {pages.length > 0 && (
              <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest select-none">
                End of typeset document — {pages.length} physical {pages.length === 1 ? 'page' : 'pages'} computed
              </span>
            )}

          </div>

        </div>

        {/* RELATED TOOLS COMPONENT Segment (Pixel-perfect inline catalog integration) */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 mt-14 pt-10 text-left">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">
            Recommended Formatting Utilities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 select-none font-sans mb-10">
            {TOOLS.filter(t => [
              'tools/paragraph-formatter',
              'tools/grammar-checker',
              'tools/readability-checker',
              'tools/word-counter',
              'tools/sentence-counter',
              'tools/case-converter-pro'
            ].includes(t.id)).slice(0, 6).map(tool => (
              <div 
                key={tool.id}
                onClick={() => onNavigateToTool(tool.id)}
                className="p-4 bg-white dark:bg-slate-950/35 border border-slate-200/60 dark:border-slate-800 rounded-2xl hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/5 transition duration-155 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-250 block text-[13px]">
                    {tool.title}
                  </span>
                  <span className="text-[11px] text-slate-450 dark:text-slate-500 block leading-relaxed mt-1 line-clamp-2">
                    {tool.description}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] font-bold text-indigo-500 hover:text-indigo-600 transition mt-2.5">
                  Launch Tool
                  <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ COLLAPSIBLE COMPONENT COLLAPSING SEGMENTS */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 mt-12 pt-10 text-left">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block select-none">Help & Support Guide</span>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 dark:text-white mt-1.5 font-sans leading-none">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3.5 select-none font-sans text-xs">
              {faqs.map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <div 
                    key={faq.id}
                    className="bg-white/50 dark:bg-slate-950/20 border border-slate-200/50 dark:border-slate-800/60 rounded-xl overflow-hidden transition-all duration-150"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full p-4 text-left flex justify-between items-center font-bold text-[12.5px] text-slate-850 dark:text-slate-200 cursor-pointer focus:outline-none"
                    >
                      <span>{faq.question}</span>
                      <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 select-text text-[11.5px] text-slate-500 dark:text-slate-400 leading-relaxed text-left border-t border-transparent pt-1 animate-in fade-in duration-100 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// core text splits calculations based page properties programmatically program
export function paginateText(
  text: string,
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  pageSize: PageSizeType,
  marginSize: 'normal' | 'narrow' | 'wide',
  indentParagraphs: boolean = false,
  titleText: string = ''
): PageItem[] {
  // Prevent crash on blank content
  if (!text.trim()) return [];

  // Instantiate dummy jsPDF context with specific configuration options orientation portrait
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: pageSize
  });

  const fontStyle = fontFamily === 'times' ? 'times' : fontFamily === 'courier' ? 'courier' : 'helvetica';
  doc.setFont(fontStyle, 'normal');
  doc.setFontSize(fontSize);

  // Constants conversion pt from dynamic PAGE_DIMENSIONS map
  const pageDims = PAGE_DIMENSIONS[pageSize] || PAGE_DIMENSIONS.letter;
  const pageHeight = pageDims.height;
  const pageWidth = pageDims.width;

  let margins = { x: 72, y: 72 };
  if (marginSize === 'narrow') {
    margins = { x: 36, y: 54 };
  } else if (marginSize === 'wide') {
    margins = { x: 108, y: 90 };
  }

  const maxTextWidth = pageWidth - (margins.x * 2);
  const availableHeight = pageHeight - (margins.y * 2);
  const singleLineHeight = fontSize * lineHeight;
  const paragraphGap = fontSize * 0.6; // spacing gap vertical height

  // Helper patterns detection
  const detectHeading = (pText: string) => {
    const trimmed = pText.trim();
    if (trimmed.startsWith('# ')) {
      return { isHeading: true, level: 1, cleanText: trimmed.substring(2).trim() };
    }
    if (trimmed.startsWith('## ')) {
      return { isHeading: true, level: 2, cleanText: trimmed.substring(3).trim() };
    }
    if (trimmed.startsWith('### ')) {
      return { isHeading: true, level: 3, cleanText: trimmed.substring(4).trim() };
    }
    // Numbered, boldish upper short lines (business style headings)
    const isSingleLine = !trimmed.includes('\n') && trimmed.length < 120;
    if (isSingleLine) {
      const hasSectionNumbering = /^[0-9]+(\.[0-9]+)*\.?\s+[A-Za-z\s]{4,}/.test(trimmed) || /^[A-Z]\.\s+[A-Z\s]{4,}/.test(trimmed);
      const isAllCaps = trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed) && trimmed.length > 3 && trimmed.length < 60;
      const startsWithChapter = /^(chapter|section|part)\s+[0-9a-z]+/i.test(trimmed);

      if (hasSectionNumbering || isAllCaps || startsWithChapter) {
        const level = isAllCaps && trimmed.length < 30 ? 1 : 2;
        return { isHeading: true, level, cleanText: trimmed };
      }
    }
    return { isHeading: false, level: 0, cleanText: pText };
  };

  const detectListItem = (pText: string) => {
    const trimmed = pText.trim();
    if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return { isListItem: true, cleanText: trimmed.substring(2).trim() };
    }
    return { isListItem: false, cleanText: pText };
  };

  // Normalize string breaks
  const cleanInput = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const paragraphs = cleanInput.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  const pagesResult: PageItem[] = [];
  let currentPageLines: LineItem[] = [];
  
  // Calculate Initial Y offset for first page with beautiful cover header title
  let currentY = 0;
  let finalTitleSize = fontSize * 1.85;
  if (titleText.trim()) {
    let titleSize = Math.max(16, fontSize * 1.85);
    let titleLineHeight = titleSize * 1.25;
    doc.setFont(fontStyle, 'bold');
    doc.setFontSize(titleSize);
    let titleLines = doc.splitTextToSize(titleText.trim(), maxTextWidth);
    
    let attempts = 0;
    while (titleLines.length * (titleSize * 1.25) > availableHeight * 0.35 && titleSize > 10 && attempts < 10) {
      titleSize -= 1;
      titleLineHeight = titleSize * 1.25;
      doc.setFontSize(titleSize);
      titleLines = doc.splitTextToSize(titleText.trim(), maxTextWidth);
      attempts++;
    }
    finalTitleSize = titleSize;
    currentY = (titleLines.length * titleLineHeight) + 12 + 28; // lines + decorative spacer rule + gap
  }

  paragraphs.forEach((paragraph) => {
    const headingInfo = detectHeading(paragraph);
    const listItemInfo = detectListItem(paragraph);

    let pText = paragraph;
    let isHeading = false;
    let headingLevel = 0;
    let isListItem = false;

    if (headingInfo.isHeading) {
      pText = headingInfo.cleanText;
      isHeading = true;
      headingLevel = headingInfo.level;
    } else if (listItemInfo.isListItem) {
      pText = listItemInfo.cleanText;
      isListItem = true;
    }

    if (indentParagraphs && !isHeading && !isListItem) {
      pText = "      " + pText;
    }

    // Set font size/style dynamically to compute exact pixel-perfect widths and line count
    const currentStyle = isHeading ? 'bold' : 'normal';
    let currentSize = fontSize;
    if (isHeading) {
      if (headingLevel === 1) currentSize = fontSize * 1.35;
      else if (headingLevel === 2) currentSize = fontSize * 1.18;
      else currentSize = fontSize * 1.08;
    }

    doc.setFont(fontStyle, currentStyle);
    doc.setFontSize(currentSize);

    const actualSingleLineHeight = currentSize * lineHeight;
    const maxTextWidthForBlock = isListItem ? maxTextWidth - 15 : maxTextWidth;

    const phraseLines: string[] = doc.splitTextToSize(pText, maxTextWidthForBlock);

    phraseLines.forEach((textLine, lineIdx) => {
      const isStart = lineIdx === 0;
      const isEnd = lineIdx === phraseLines.length - 1;

      let necessaryHeight = actualSingleLineHeight;
      if (isStart && currentPageLines.length > 0) {
        necessaryHeight += isHeading ? paragraphGap * 1.8 : paragraphGap;
      }

      // Check overflow page break
      if (currentY + necessaryHeight > availableHeight) {
        pagesResult.push({
          lines: currentPageLines,
          pageNumber: pagesResult.length + 1,
          computedTitleSize: pagesResult.length === 0 && titleText.trim() ? finalTitleSize : undefined
        });
        currentPageLines = [];
        // Subsequent pages start from y cursor = 0, no cover title
        currentY = 0;
      }

      if (isStart && currentPageLines.length > 0) {
        currentY += isHeading ? paragraphGap * 1.8 : paragraphGap;
      }

      currentPageLines.push({
        text: textLine,
        isParagraphStart: isStart,
        isParagraphEnd: isEnd,
        isHeading,
        headingLevel,
        isListItem
      });

      currentY += actualSingleLineHeight;
    });

    // Reset back
    doc.setFont(fontStyle, 'normal');
    doc.setFontSize(fontSize);
  });

  // Flush trailing leftover lines
  if (currentPageLines.length > 0) {
    pagesResult.push({
      lines: currentPageLines,
      pageNumber: pagesResult.length + 1,
      computedTitleSize: pagesResult.length === 0 && titleText.trim() ? finalTitleSize : undefined
    });
  }

  return pagesResult;
}
