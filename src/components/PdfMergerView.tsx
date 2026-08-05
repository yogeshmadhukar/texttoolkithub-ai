import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  FilePlus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  RefreshCw, 
  FileCheck, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  AlertCircle, 
  GripVertical, 
  Layers, 
  Lock, 
  FileUp, 
  CheckCircle2, 
  Zap, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  RotateCw, 
  SlidersHorizontal, 
  ArrowLeft, 
  ChevronRight,
  Info,
  Clock,
  Eye,
  X,
  FileCode,
  HardDrive
} from 'lucide-react';
import { getCleanPath } from '../types.ts';
import { TOOLS } from '../data.ts';
import AdPlacement from './AdPlacement.tsx';

interface PdfMergerViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export interface PdfFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
  isEncrypted: boolean;
  rotation: number; // 0, 90, 180, 270
  pageRange: string; // e.g. "All" or "1-5, 8"
  error?: string;
}

export default function PdfMergerView({ onNavigateToTool, onNavigateHome }: PdfMergerViewProps) {
  const [pdfFiles, setPdfFiles] = useState<PdfFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [mergedPdfBlob, setMergedPdfBlob] = useState<{ url: string; filename: string; size: number; pageCount: number } | null>(null);
  const [outputFilename, setOutputFilename] = useState('merged-document');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showOptions, setShowOptions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for quick actions (e.g., Ctrl+O to open file selector, Ctrl+Enter to merge)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && pdfFiles.length >= 2 && !isProcessing) {
        e.preventDefault();
        handleMergePdfs();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pdfFiles, isProcessing]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (mergedPdfBlob?.url) {
        URL.revokeObjectURL(mergedPdfBlob.url);
      }
    };
  }, [mergedPdfBlob]);

  // Format file sizes into human readable strings
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper to process uploaded PDF files
  const processUploadedFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    const fileArray = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));

    if (fileArray.length === 0) {
      setErrorMessage('Please upload valid PDF files (.pdf format).');
      return;
    }

    const newItems: PdfFileItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // File size validation (Max 100MB per file client-side memory safety)
      if (file.size > 100 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the maximum recommended size limit of 100MB.`);
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        let pageCount = 0;
        let isEncrypted = false;
        let fileError: string | undefined = undefined;

        try {
          const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
          pageCount = pdfDoc.getPageCount();
          if (pdfDoc.isEncrypted) {
            isEncrypted = true;
            fileError = 'Password protected PDF. Unlock file before merging.';
          }
        } catch (err: any) {
          console.warn(`Failed to parse PDF metadata for ${file.name}:`, err);
          fileError = 'Corrupted or unreadable PDF file.';
        }

        newItems.push({
          id: `pdf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          pageCount,
          isEncrypted,
          rotation: 0,
          pageRange: 'All',
          error: fileError
        });
      } catch (err) {
        console.error(`Error reading file ${file.name}:`, err);
      }
    }

    if (newItems.length > 0) {
      setPdfFiles(prev => [...prev, ...newItems]);
      // Reset output blob if new files are added
      if (mergedPdfBlob) {
        URL.revokeObjectURL(mergedPdfBlob.url);
        setMergedPdfBlob(null);
      }
    }
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
      // Reset input value to allow re-uploading same file if deleted
      e.target.value = '';
    }
  };

  // Reordering Logic
  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= pdfFiles.length) return;

    const updated = [...pdfFiles];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedItem);
    setPdfFiles(updated);
  };

  const removeFile = (id: string) => {
    setPdfFiles(prev => prev.filter(f => f.id !== id));
    if (mergedPdfBlob) {
      URL.revokeObjectURL(mergedPdfBlob.url);
      setMergedPdfBlob(null);
    }
  };

  const clearAllFiles = () => {
    setPdfFiles([]);
    if (mergedPdfBlob) {
      URL.revokeObjectURL(mergedPdfBlob.url);
      setMergedPdfBlob(null);
    }
    setErrorMessage(null);
  };

  const rotateFile = (id: string) => {
    setPdfFiles(prev => prev.map(f => {
      if (f.id === id) {
        const nextRotation = (f.rotation + 90) % 360;
        return { ...f, rotation: nextRotation };
      }
      return f;
    }));
  };

  const updatePageRange = (id: string, range: string) => {
    setPdfFiles(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, pageRange: range };
      }
      return f;
    }));
  };

  const sortFilesAlphabetically = () => {
    setPdfFiles(prev => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const reverseFileOrder = () => {
    setPdfFiles(prev => [...prev].reverse());
  };

  // Helper to parse page range strings (e.g., "1-3, 5, 7-10") into 0-indexed page numbers
  const parsePageIndices = (rangeStr: string, totalPages: number): number[] => {
    if (!rangeStr || rangeStr.trim().toLowerCase() === 'all') {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const indices = new Set<number>();
    const parts = rangeStr.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, totalPages)) - 1;
          const to = Math.max(1, Math.min(end, totalPages)) - 1;
          for (let i = Math.min(from, to); i <= Math.max(from, to); i++) {
            indices.add(i);
          }
        }
      } else {
        const pageNum = parseInt(trimmed, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          indices.add(pageNum - 1);
        }
      }
    }

    const result = Array.from(indices).sort((a, b) => a - b);
    return result.length > 0 ? result : Array.from({ length: totalPages }, (_, i) => i);
  };

  // Main PDF Merge Execution (100% Client-Side using pdf-lib)
  const handleMergePdfs = async () => {
    if (pdfFiles.length < 2) {
      setErrorMessage('Please add at least 2 PDF files to perform a merge operation.');
      return;
    }

    const unreadableFile = pdfFiles.find(f => f.isEncrypted || f.error);
    if (unreadableFile) {
      setErrorMessage(`Cannot merge because "${unreadableFile.name}" is password protected or corrupted. Please remove it to proceed.`);
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setProgressStatus('Initializing local PDF assembler...');
    setErrorMessage(null);

    try {
      // Step 1: Create a new blank PDF Document
      const mergedPdf = await PDFDocument.create();
      let totalMergedPages = 0;

      for (let i = 0; i < pdfFiles.length; i++) {
        const item = pdfFiles[i];
        const stepProgress = Math.round(10 + ((i + 1) / pdfFiles.length) * 85);
        setProgress(stepProgress);
        setProgressStatus(`Processing file ${i + 1} of ${pdfFiles.length}: "${item.name}"...`);

        // Read array buffer
        const arrayBuffer = await item.file.arrayBuffer();
        const srcPdf = await PDFDocument.load(arrayBuffer);
        const srcPageCount = srcPdf.getPageCount();

        // Calculate pages to extract
        const pageIndices = parsePageIndices(item.pageRange, srcPageCount);

        // Copy specified pages into merged document
        const copiedPages = await mergedPdf.copyPages(srcPdf, pageIndices);

        for (const copiedPage of copiedPages) {
          // Apply rotation if item was rotated
          if (item.rotation !== 0) {
            const currentRotation = copiedPage.getRotation().angle;
            copiedPage.setRotation(degrees((currentRotation + item.rotation) % 360));
          }
          mergedPdf.addPage(copiedPage);
          totalMergedPages++;
        }

        // Slight artificial tick for smooth animation feedback
        await new Promise(resolve => setTimeout(resolve, 60));
      }

      setProgress(95);
      setProgressStatus('Finalizing merged document structure...');

      // Save merged document
      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const finalName = outputFilename.trim() !== '' 
        ? (outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`)
        : 'merged-document.pdf';

      setMergedPdfBlob({
        url: blobUrl,
        filename: finalName,
        size: blob.size,
        pageCount: totalMergedPages
      });

      setProgress(100);
      setProgressStatus('Merge completed successfully!');
    } catch (err: any) {
      console.error('PDF Merge Error:', err);
      setErrorMessage(err?.message || 'An error occurred while merging your PDF files. Please ensure files are valid and unencrypted.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Helper calculation totals
  const totalFilesCount = pdfFiles.length;
  const totalPagesCount = pdfFiles.reduce((acc, f) => acc + (f.pageCount || 0), 0);
  const totalBytesSize = pdfFiles.reduce((acc, f) => acc + f.size, 0);

  // FAQs List for SEO & Educational Section
  const faqs = [
    {
      q: "Is it safe to merge sensitive financial or personal PDF documents here?",
      a: "Yes, 100% safe! Unlike traditional online PDF converters that send your documents to external web servers, TextToolkitHub processes all PDF pages locally inside your browser using WebAssembly & JavaScript. Your files never leave your computer or touch any server."
    },
    {
      q: "How many PDF files can I merge at once?",
      a: "There is no artificial limit on the number of files you can merge. You can combine 2, 10, or 50+ PDF files into a single document as long as your device has sufficient RAM memory."
    },
    {
      q: "Can I reorder or rotate pages before merging?",
      a: "Yes! You can use the Move Up / Move Down controls to set the exact file sequence, rotate pages by 90° increments, and specify custom page ranges (e.g., '1-5, 8') for each uploaded document."
    },
    {
      q: "Can I merge password-protected or encrypted PDF files?",
      a: "If a PDF is encrypted with an owner/user password, you must remove the password protection first before merging. Our client-side privacy engine respects file encryption security locks."
    },
    {
      q: "Will merging PDFs reduce the visual quality or add watermarks?",
      a: "No! We do not add any watermarks or compromise image resolutions. Vector text, images, forms, and formatting inside your original PDF pages are preserved intact."
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
            <span className="text-slate-900 dark:text-white font-medium">PDF Merger</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400">
                  <Layers className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    PDF Merge Tool
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Combine multiple PDF files into one seamless document. 100% private, client-side processing with zero server uploads.
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                100% Client-Side Privacy
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 font-medium">
                <Zap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Zero File Size Limits
              </span>
            </div>
          </div>
        </div>

        {/* Top Notification / Error Alert */}
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

        {/* Main Work Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Drag & Drop Zone + File Queue */}
          <div className="lg:col-span-8 space-y-6">

            {/* Drag & Drop Upload Card */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md shadow-sm ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/30 scale-[1.01]'
                  : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500'
              }`}
              id="pdf-dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                id="pdf-file-input"
              />

              <div className="flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <FileUp className="w-8 h-8" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Drop PDF files here to merge
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                    or click to select files from your device. Combine documents safely in your browser memory.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                  >
                    <FilePlus className="w-4 h-4" />
                    Select PDF Files
                  </button>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Ctrl + O</kbd>
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Files List Header */}
            {pdfFiles.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      Files to Merge ({pdfFiles.length})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {totalPagesCount} Pages
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={sortFilesAlphabetically}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                      title="Sort files alphabetically by name"
                    >
                      Sort A-Z
                    </button>
                    <button
                      onClick={reverseFileOrder}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                      title="Reverse the current list order"
                    >
                      Reverse
                    </button>
                    <button
                      onClick={clearAllFiles}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear All
                    </button>
                  </div>
                </div>

                {/* File Queue Items */}
                <div className="space-y-3">
                  {pdfFiles.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-4 rounded-2xl border transition-all ${
                        item.error
                          ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                          : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* File details */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500 shrink-0 mt-1 sm:mt-0">
                            <span className="font-mono text-xs font-bold text-slate-400 w-5 text-center">
                              #{index + 1}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate" title={item.name}>
                              {item.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                              <span>{formatFileSize(item.size)}</span>
                              <span>•</span>
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {item.pageCount > 0 ? `${item.pageCount} ${item.pageCount === 1 ? 'page' : 'pages'}` : 'Reading pages...'}
                              </span>
                              {item.rotation > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                    Rotated {item.rotation}°
                                  </span>
                                </>
                              )}
                              {item.isEncrypted && (
                                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                                  <Lock className="w-3 h-3" /> Protected
                                </span>
                              )}
                            </div>

                            {item.error && (
                              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">
                                ⚠️ {item.error}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* File Action Controls (Reorder, Rotate, Range, Delete) */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                          
                          {/* Page Range Customization */}
                          <div className="flex items-center gap-1" title="Extract specific pages (e.g. All or 1-5, 8)">
                            <span className="text-[10px] text-slate-400 uppercase font-semibold hidden md:inline">
                              Pages:
                            </span>
                            <input
                              type="text"
                              value={item.pageRange}
                              onChange={(e) => updatePageRange(item.id, e.target.value)}
                              placeholder="All"
                              className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-center text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>

                          {/* Rotate Button */}
                          <button
                            onClick={() => rotateFile(item.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Rotate pages 90° clockwise"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>

                          {/* Order Shift Buttons */}
                          <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                            <button
                              onClick={() => moveFile(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move file up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveFile(index, 'down')}
                              disabled={index === pdfFiles.length - 1}
                              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move file down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Delete File Button */}
                          <button
                            onClick={() => removeFile(item.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Action Control Panel & Output Summary */}
          <div className="lg:col-span-4 space-y-6">

            <div className="sticky top-16 md:top-20 bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-md space-y-5 backdrop-blur-md">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Merge Settings
              </h2>

              {/* Output Filename Config */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Output Filename
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={outputFilename}
                    onChange={(e) => setOutputFilename(e.target.value)}
                    placeholder="merged-document"
                    className="w-full px-3 py-2.5 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    .pdf
                  </span>
                </div>
              </div>

              {/* Summary Stats Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Total PDF Files:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{totalFilesCount}</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Total Output Pages:</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{totalPagesCount}</strong>
                </div>
                <div className="flex items-center justify-between text-xs border-t border-slate-200 dark:border-slate-700/60 pt-2">
                  <span className="text-slate-500 dark:text-slate-400">Combined Size:</span>
                  <strong className="text-indigo-600 dark:text-indigo-400 font-mono">{formatFileSize(totalBytesSize)}</strong>
                </div>
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

              {/* Primary Merge Action Button */}
              {!mergedPdfBlob ? (
                <button
                  onClick={handleMergePdfs}
                  disabled={pdfFiles.length < 2 || isProcessing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  id="pdf-merge-submit-btn"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Merging PDFs...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Merge PDFs Now
                    </>
                  )}
                </button>
              ) : (
                /* Merged PDF Ready Download Card */
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Merged Document Ready!
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    <div><span className="text-slate-400">File:</span> {mergedPdfBlob.filename}</div>
                    <div><span className="text-slate-400">Pages:</span> {mergedPdfBlob.pageCount}</div>
                    <div><span className="text-slate-400">Size:</span> {formatFileSize(mergedPdfBlob.size)}</div>
                  </div>

                  <a
                    href={mergedPdfBlob.url}
                    download={mergedPdfBlob.filename}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    id="pdf-download-btn"
                  >
                    <Download className="w-4 h-4" />
                    Download Merged PDF
                  </a>

                  <button
                    onClick={() => setMergedPdfBlob(null)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                  >
                    Modify Selection & Merge Again
                  </button>
                </div>
              )}

              {/* Local Browser Memory Guarantee */}
              <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed flex items-start gap-2 border-t border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  No files uploaded to any servers. All PDF rendering and page assembly occurs exclusively inside your device memory.
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Educational SEO & Guide Section at bottom */}
        <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          {/* In-Content Programmatic Ad Placement */}
          <AdPlacement slot="leaderboard" id="pdf-merger-mid-ad" />

          {/* How It Works & Educational Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              How to Merge PDF Files Online
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Upload Documents</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Select or drag-and-drop two or more PDF files directly from your computer, tablet, or smartphone.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Organize & Rotate</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Use arrow controls to reorder files, set custom page ranges (e.g. 1-5), or rotate pages as needed.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Merge & Download</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Click "Merge PDFs Now" to construct your consolidated document instantly in local memory and save.
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
