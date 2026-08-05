import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Scissors, 
  Trash2, 
  RotateCw, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Layers, 
  Lock, 
  FileUp, 
  CheckCircle2, 
  Zap, 
  ChevronDown, 
  ChevronRight, 
  SlidersHorizontal, 
  Grid, 
  CheckSquare, 
  Square, 
  Archive, 
  Info, 
  FileCheck, 
  X, 
  FileCode, 
  Settings2,
  ListFilter
} from 'lucide-react';
import { getCleanPath } from '../types.ts';
import AdPlacement from './AdPlacement.tsx';

interface PdfSplitterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export interface PageMetadata {
  pageIndex: number; // 0-based index
  pageNumber: number; // 1-based index
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
  selected: boolean;
  aspectRatio: string;
}

export interface SplitResultFile {
  id: string;
  filename: string;
  pageRangeStr: string;
  pageCount: number;
  size: number;
  blobUrl: string;
}

export type SplitMode = 'every' | 'range' | 'selected' | 'interval';

export default function PdfSplitterView({ onNavigateToTool, onNavigateHome }: PdfSplitterViewProps) {
  // Source PDF state
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
  const [pageMetadataList, setPageMetadataList] = useState<PageMetadata[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [fileSize, setFileSize] = useState<number>(0);

  // Split configurations
  const [splitMode, setSplitMode] = useState<SplitMode>('every');
  const [customRange, setCustomRange] = useState<string>('1-3, 4-6');
  const [fixedInterval, setFixedInterval] = useState<number>(2);
  const [filenamePrefix, setFilenamePrefix] = useState<string>('split-document');

  // Drag & drop & UI states
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [splitResults, setSplitResults] = useState<SplitResultFile[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Ctrl+O to upload, Ctrl+Enter to split)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && sourceFile && !isProcessing) {
        e.preventDefault();
        handleExecuteSplit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sourceFile, isProcessing, splitMode, customRange, fixedInterval, pageMetadataList]);

  // Clean up Blob URLs on unmount or reset
  useEffect(() => {
    return () => {
      splitResults.forEach(res => {
        if (res.blobUrl) URL.revokeObjectURL(res.blobUrl);
      });
    };
  }, [splitResults]);

  // Format file size helper
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load and analyze uploaded PDF file
  const loadPdfFile = async (file: File) => {
    setErrorMessage(null);
    clearSplitResults();

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage('Please upload a valid PDF file.');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage('The uploaded PDF exceeds the 100MB browser memory limit.');
      return;
    }

    setSourceFile(file);
    setFileSize(file.size);

    // Auto-generate default filename prefix without .pdf
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    setFilenamePrefix(nameWithoutExt ? `${nameWithoutExt}-part` : 'split-document');

    try {
      const buffer = await file.arrayBuffer();
      setPdfBytes(buffer);

      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      if (pdfDoc.isEncrypted) {
        setIsEncrypted(true);
        setErrorMessage('This PDF file is password protected. Please unlock it before splitting.');
        return;
      }

      setIsEncrypted(false);
      const count = pdfDoc.getPageCount();
      setTotalPages(count);

      const metadata: PageMetadata[] = [];
      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const rotationAngle = page.getRotation().angle;
        const isLandscape = width > height;

        metadata.push({
          pageIndex: i,
          pageNumber: i + 1,
          width: Math.round(width),
          height: Math.round(height),
          rotation: rotationAngle,
          selected: true,
          aspectRatio: isLandscape ? 'landscape' : 'portrait'
        });
      }

      setPageMetadataList(metadata);

      // Default custom range suggestion based on page count
      if (count > 1) {
        const mid = Math.ceil(count / 2);
        setCustomRange(`1-${mid}, ${mid + 1}-${count}`);
      } else {
        setCustomRange('1');
      }

    } catch (err: any) {
      console.error('Error reading PDF structure:', err);
      setErrorMessage('Could not load PDF document. The file may be damaged or corrupted.');
    }
  };

  const clearSplitResults = () => {
    splitResults.forEach(res => URL.revokeObjectURL(res.blobUrl));
    setSplitResults([]);
  };

  const handleReset = () => {
    setSourceFile(null);
    setPdfBytes(null);
    setPageMetadataList([]);
    setTotalPages(0);
    setIsEncrypted(false);
    clearSplitResults();
    setErrorMessage(null);
  };

  // Drag & drop counter to prevent flickering when hovering over child elements
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadPdfFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadPdfFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  // Page selection toggles
  const togglePageSelection = (index: number) => {
    setPageMetadataList(prev => prev.map((p, i) => i === index ? { ...p, selected: !p.selected } : p));
  };

  const rotatePage = (index: number) => {
    setPageMetadataList(prev => prev.map((p, i) => i === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p));
  };

  const selectAllPages = () => {
    setPageMetadataList(prev => prev.map(p => ({ ...p, selected: true })));
  };

  const deselectAllPages = () => {
    setPageMetadataList(prev => prev.map(p => ({ ...p, selected: false })));
  };

  const selectOddPages = () => {
    setPageMetadataList(prev => prev.map((p, i) => ({ ...p, selected: (i + 1) % 2 !== 0 })));
  };

  const selectEvenPages = () => {
    setPageMetadataList(prev => prev.map((p, i) => ({ ...p, selected: (i + 1) % 2 === 0 })));
  };

  const rotateAllPages = () => {
    setPageMetadataList(prev => prev.map(p => ({ ...p, rotation: (p.rotation + 90) % 360 })));
  };

  // Helper to parse page ranges e.g. "1-3, 5, 8-10" into arrays of 0-based page index groups
  const parseRangesIntoGroups = (rangeStr: string, total: number): number[][] => {
    const groups: number[][] = [];
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;

      const groupIndices: number[] = [];

      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);

        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, total)) - 1;
          const to = Math.max(1, Math.min(end, total)) - 1;
          for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
            groupIndices.push(i);
          }
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= total) {
          groupIndices.push(pageNum - 1);
        }
      }

      if (groupIndices.length > 0) {
        groups.push(groupIndices);
      }
    }

    return groups;
  };

  // Main PDF Splitter Core Logic using pdf-lib
  const handleExecuteSplit = async () => {
    if (!pdfBytes || totalPages === 0) {
      setErrorMessage('Please upload a PDF file first.');
      return;
    }

    if (isEncrypted) {
      setErrorMessage('Cannot process encrypted PDF files.');
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setProgressStatus('Initializing client-side PDF splitter...');
    setErrorMessage(null);
    clearSplitResults();

    try {
      const srcPdf = await PDFDocument.load(pdfBytes);
      const results: SplitResultFile[] = [];

      let pageGroupsToExtract: { indices: number[]; rangeLabel: string }[] = [];

      // Determine page groups based on selected split mode
      if (splitMode === 'every') {
        // Mode 1: Split every page into its own PDF
        for (let i = 0; i < totalPages; i++) {
          pageGroupsToExtract.push({
            indices: [i],
            rangeLabel: `Page ${i + 1}`
          });
        }
      } else if (splitMode === 'range') {
        // Mode 2: Split by custom page ranges
        const parsedGroups = parseRangesIntoGroups(customRange, totalPages);
        if (parsedGroups.length === 0) {
          throw new Error('Invalid page range format. Example format: "1-3, 4-6" or "1, 3, 5".');
        }
        parsedGroups.forEach((indices) => {
          const minP = Math.min(...indices) + 1;
          const maxP = Math.max(...indices) + 1;
          const label = minP === maxP ? `Page ${minP}` : `Pages ${minP}-${maxP}`;
          pageGroupsToExtract.push({ indices, rangeLabel: label });
        });
      } else if (splitMode === 'selected') {
        // Mode 3: Extract selected pages
        const selectedIndices = pageMetadataList.filter(p => p.selected).map(p => p.pageIndex);
        if (selectedIndices.length === 0) {
          throw new Error('Please select at least one page from the page preview grid.');
        }
        pageGroupsToExtract.push({
          indices: selectedIndices,
          rangeLabel: `${selectedIndices.length} Selected Pages`
        });
      } else if (splitMode === 'interval') {
        // Mode 4: Fixed interval splitting
        const interval = Math.max(1, fixedInterval);
        for (let i = 0; i < totalPages; i += interval) {
          const indices: number[] = [];
          for (let j = i; j < Math.min(i + interval, totalPages); j++) {
            indices.push(j);
          }
          const startP = i + 1;
          const endP = Math.min(i + interval, totalPages);
          const label = startP === endP ? `Page ${startP}` : `Pages ${startP}-${endP}`;
          pageGroupsToExtract.push({ indices, rangeLabel: label });
        }
      }

      const totalGroups = pageGroupsToExtract.length;

      for (let g = 0; g < totalGroups; g++) {
        const group = pageGroupsToExtract[g];
        const stepProgress = Math.round(10 + ((g + 1) / totalGroups) * 85);
        setProgress(stepProgress);
        setProgressStatus(`Extracting ${group.rangeLabel} (${g + 1} of ${totalGroups})...`);

        // Create new sub-PDF document
        const subPdf = await PDFDocument.create();

        // Copy pages
        const copiedPages = await subPdf.copyPages(srcPdf, group.indices);

        for (let k = 0; k < copiedPages.length; k++) {
          const copiedPage = copiedPages[k];
          const pageIndex = group.indices[k];
          const meta = pageMetadataList[pageIndex];

          // Apply rotation if modified in UI
          if (meta && meta.rotation !== 0) {
            const currentAngle = copiedPage.getRotation().angle;
            copiedPage.setRotation(degrees((currentAngle + meta.rotation) % 360));
          }

          subPdf.addPage(copiedPage);
        }

        const subPdfBytes = await subPdf.save();
        const blob = new Blob([subPdfBytes], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);

        const suffix = group.rangeLabel.toLowerCase().replace(/\s+/g, '-');
        const filename = `${filenamePrefix.trim() || 'split-doc'}-${suffix}.pdf`;

        results.push({
          id: `split-${g}-${Date.now()}`,
          filename,
          pageRangeStr: group.rangeLabel,
          pageCount: group.indices.length,
          size: blob.size,
          blobUrl
        });

        // Yield execution briefly for UI rendering smoothness
        await new Promise(r => setTimeout(r, 40));
      }

      setProgress(100);
      setProgressStatus('PDF splitting completed successfully!');
      setSplitResults(results);

    } catch (err: any) {
      console.error('PDF Split Error:', err);
      setErrorMessage(err?.message || 'Failed to split PDF file. Please check range parameters and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download all split files as a ZIP archive
  const handleDownloadZip = async () => {
    if (splitResults.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();

      for (const fileItem of splitResults) {
        const response = await fetch(fileItem.blobUrl);
        const blob = await response.blob();
        zip.file(fileItem.filename, blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);

      const zipFilename = `${filenamePrefix.trim() || 'split-documents'}-all.zip`;

      const downloadLink = document.createElement('a');
      downloadLink.href = zipUrl;
      downloadLink.download = zipFilename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setTimeout(() => URL.revokeObjectURL(zipUrl), 5000);
    } catch (err) {
      console.error('ZIP generation error:', err);
      setErrorMessage('Failed to construct ZIP archive. You can still download individual PDF files below.');
    } finally {
      setIsZipping(false);
    }
  };

  // FAQ Accordion Data
  const faqs = [
    {
      q: "Are my uploaded PDF documents saved on external servers?",
      a: "No! All PDF page extractions, file splits, and ZIP packaging occur 100% locally inside your web browser. Your private documents are never transmitted over the internet or stored on any server."
    },
    {
      q: "Can I extract specific page numbers like pages 1, 5, and 12-15?",
      a: "Yes! Choose the 'Custom Page Ranges' split mode and enter ranges separated by commas (e.g. '1, 5, 12-15') or create multiple output files at once."
    },
    {
      q: "Can I download all split files at once instead of one by one?",
      a: "Yes! Once splitting completes, click the 'Download All as ZIP' button to receive a single consolidated archive containing all extracted PDF parts."
    },
    {
      q: "Can I rotate pages before splitting them?",
      a: "Yes! Click the rotate icon on any thumbnail preview in the page grid to rotate individual pages by 90° increments before generating your split files."
    },
    {
      q: "Is there a page limit or file size restriction?",
      a: "There are no arbitrary page count restrictions. You can split PDFs with hundreds of pages as long as your device has sufficient memory."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Breadcrumb Navigation & Top Title Header */}
        <div className="flex flex-col gap-2">
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <button 
              onClick={onNavigateHome}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button 
              onClick={() => onNavigateToTool('tools')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Tools Directory
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-900 dark:text-white font-medium">PDF Splitter</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400">
                  <Scissors className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    PDF Split Tool
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Extract, split, or separate PDF pages into individual documents. 100% browser-based with zero server uploads.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                100% Local Privacy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 font-medium">
                <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Instant Browser Extract
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert Box */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3 shadow-sm"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="font-semibold block">Attention Needed</strong>
                <span className="text-xs">{errorMessage}</span>
              </div>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="text-rose-500 hover:text-rose-700 dark:hover:text-rose-300"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Splitter SaaS Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Upload Dropzone & Page Grid */}
          <div className="lg:col-span-8 space-y-6">

            {/* Upload Zone */}
            {!sourceFile ? (
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 backdrop-blur-md ${
                  isDragging
                    ? 'border-indigo-500 ring-4 ring-indigo-500/20 dark:ring-indigo-500/30 bg-indigo-50/90 dark:bg-indigo-950/70 scale-[1.02] shadow-xl shadow-indigo-500/10'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 bg-white/70 dark:bg-slate-900/70 shadow-sm'
                }`}
                id="pdf-split-dropzone"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="pdf-split-file-input"
                />

                <div className="flex flex-col items-center justify-center gap-4">
                  <div
                    className={`transition-all duration-300 flex items-center justify-center text-white ${
                      isDragging
                        ? 'w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-xl shadow-indigo-500/40 animate-bounce ring-4 ring-white dark:ring-slate-900'
                        : 'w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 group-hover:scale-105'
                    }`}
                  >
                    <FileUp className={isDragging ? 'w-10 h-10' : 'w-8 h-8'} />
                  </div>

                  <div>
                    {isDragging ? (
                      <div className="space-y-1">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-medium text-xs mb-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                          PDF File Detected • Ready to Drop
                        </div>
                        <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                          Release your PDF file here
                        </h2>
                        <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 max-w-sm mx-auto font-medium">
                          Your document will be loaded and split 100% privately in your browser.
                        </p>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          Select or drop a PDF file to split
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                          Separate pages into distinct documents or extract custom page ranges locally.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1">
                    <button
                      type="button"
                      className={`px-5 py-2.5 rounded-xl text-white font-medium text-xs shadow-md transition-all flex items-center gap-2 ${
                        isDragging
                          ? 'bg-indigo-700 shadow-indigo-700/30 scale-105'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                      }`}
                    >
                      <Scissors className="w-4 h-4" />
                      {isDragging ? 'Drop File Now' : 'Choose PDF File'}
                    </button>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Ctrl + O</kbd>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Loaded Document Banner */
              <div 
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="relative bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-6 overflow-hidden"
              >
                {/* Drag Overlay when replacing loaded file */}
                {isDragging && (
                  <div className="absolute inset-0 z-50 rounded-3xl bg-indigo-600/95 backdrop-blur-md border-2 border-dashed border-white text-white flex flex-col items-center justify-center p-6 text-center animate-fadeIn shadow-2xl">
                    <FileUp className="w-12 h-12 animate-bounce mb-3 text-white" />
                    <h3 className="text-lg font-bold">Drop new PDF file to replace current document</h3>
                    <p className="text-xs opacity-90 mt-1 max-w-xs">
                      100% private client-side processing • Zero server uploads
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {sourceFile.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>{formatFileSize(fileSize)}</span>
                        <span>•</span>
                        <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                          {totalPages} {totalPages === 1 ? 'Page' : 'Total Pages'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleReset}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Change Document
                  </button>
                </div>

                {/* Page Selection Controls Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={selectAllPages}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllPages}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                    >
                      Deselect All
                    </button>
                    <button
                      onClick={selectOddPages}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                    >
                      Select Odd
                    </button>
                    <button
                      onClick={selectEvenPages}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                    >
                      Select Even
                    </button>
                  </div>

                  <button
                    onClick={rotateAllPages}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Rotate All 90°
                  </button>
                </div>

                {/* Page Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[480px] overflow-y-auto pr-1">
                  {pageMetadataList.map((page, index) => (
                    <div
                      key={page.pageIndex}
                      onClick={() => togglePageSelection(page.pageIndex)}
                      className={`relative p-3 rounded-2xl border cursor-pointer transition-all ${
                        page.selected
                          ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-400 dark:border-indigo-600 shadow-sm'
                          : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      {/* Checkbox Top Left */}
                      <div className="absolute top-2 left-2 z-10">
                        {page.selected ? (
                          <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>

                      {/* Rotate Button Top Right */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          rotatePage(page.pageIndex);
                        }}
                        className="absolute top-2 right-2 z-10 p-1 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-xs"
                        title="Rotate page 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      {/* Stylized Page Thumbnail Box */}
                      <div className="w-full aspect-[3/4] bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-700/80 flex flex-col items-center justify-center gap-2 p-2 relative overflow-hidden my-1">
                        <div 
                          className="flex flex-col items-center justify-center transition-transform duration-200"
                          style={{ transform: `rotate(${page.rotation}deg)` }}
                        >
                          <FileText className="w-10 h-10 text-indigo-500/80 dark:text-indigo-400/80" />
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                            {page.width}x{page.height}
                          </span>
                        </div>

                        {page.rotation > 0 && (
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-1 rounded">
                            {page.rotation}°
                          </span>
                        )}
                      </div>

                      {/* Page Number Label */}
                      <div className="text-center font-bold text-xs text-slate-800 dark:text-slate-200 mt-1">
                        Page {page.pageNumber}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Split Generated Results Section */}
            {splitResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Extracted Files ({splitResults.length})
                    </h3>
                  </div>

                  <button
                    onClick={handleDownloadZip}
                    disabled={isZipping}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isZipping ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Packaging ZIP...
                      </>
                    ) : (
                      <>
                        <Archive className="w-4 h-4" />
                        Download All as ZIP
                      </>
                    )}
                  </button>
                </div>

                {/* File list items */}
                <div className="space-y-2.5">
                  {splitResults.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between gap-3 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                            {item.filename}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            <span>{item.pageRangeStr}</span>
                            <span>•</span>
                            <span>{formatFileSize(item.size)}</span>
                          </div>
                        </div>
                      </div>

                      <a
                        href={item.blobUrl}
                        download={item.filename}
                        className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-medium transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* Right Column: Sticky Action Control Panel */}
          <div className="lg:col-span-4 space-y-6">

            <div className="sticky top-16 md:top-20 bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-md space-y-5 backdrop-blur-md">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Settings2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Split Settings
              </h2>

              {/* Mode Selection Tabs */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Split Method
                </label>
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setSplitMode('every')}
                    className={`py-2 px-2 rounded-xl font-medium transition-all text-center ${
                      splitMode === 'every'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Every Page
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('range')}
                    className={`py-2 px-2 rounded-xl font-medium transition-all text-center ${
                      splitMode === 'range'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Custom Range
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('selected')}
                    className={`py-2 px-2 rounded-xl font-medium transition-all text-center ${
                      splitMode === 'selected'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Selected Pages
                  </button>
                  <button
                    type="button"
                    onClick={() => setSplitMode('interval')}
                    className={`py-2 px-2 rounded-xl font-medium transition-all text-center ${
                      splitMode === 'interval'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Fixed Interval
                  </button>
                </div>
              </div>

              {/* Contextual Inputs per Mode */}
              {splitMode === 'range' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Page Ranges (e.g. 1-3, 5, 7-10)
                  </label>
                  <input
                    type="text"
                    value={customRange}
                    onChange={(e) => setCustomRange(e.target.value)}
                    placeholder="1-3, 4-6"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">
                    Separate multiple range groups with commas to produce multiple files.
                  </p>
                </div>
              )}

              {splitMode === 'interval' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Split Every N Pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalPages || 100}
                    value={fixedInterval}
                    onChange={(e) => setFixedInterval(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Filename Prefix Config */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Output Filename Prefix
                </label>
                <input
                  type="text"
                  value={filenamePrefix}
                  onChange={(e) => setFilenamePrefix(e.target.value)}
                  placeholder="split-document"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Progress Indicator */}
              {isProcessing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">
                      {progressStatus}
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-500 to-violet-600 h-full"
                      style={{ width: `${progress}%` }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleExecuteSplit}
                disabled={!sourceFile || totalPages === 0 || isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                id="pdf-split-submit-btn"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing Split...
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    Split PDF Now
                  </>
                )}
              </button>

              {/* Memory Guarantee Note */}
              <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed flex items-start gap-2 border-t border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  100% private execution. Pages are split entirely inside your browser memory using WebAssembly & JS.
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Educational SEO & Guide Section at bottom */}
        <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          {/* In-Content Programmatic Ad Placement */}
          <AdPlacement slot="leaderboard" id="pdf-splitter-mid-ad" />

          {/* Educational Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              How to Split PDF Files Online
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Upload Document</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Select or drag-and-drop your PDF file into the drop zone to load all pages into memory.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Choose Split Mode</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Select 'Split Every Page', enter custom ranges (e.g. 1-3, 5), or pick pages visually from the grid.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Download Output</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Download individual PDF files or save all split pages together in a single ZIP archive.
                </p>
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div 
                    key={i}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 overflow-hidden bg-slate-50/50 dark:bg-slate-950/40"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full p-4 text-left font-semibold text-slate-900 dark:text-slate-100 text-sm flex items-center justify-between gap-4"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedFaq === i && (
                      <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
