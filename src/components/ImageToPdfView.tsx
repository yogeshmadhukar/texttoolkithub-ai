import React, { useState, useRef, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileUp, 
  Image as ImageIcon, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  ChevronDown, 
  ChevronRight, 
  Settings2, 
  SlidersHorizontal, 
  X, 
  Maximize2, 
  Layout, 
  Maximize, 
  FileText,
  RotateCw
} from 'lucide-react';
import { getCleanPath } from '../types.ts';
import AdPlacement from './AdPlacement.tsx';

interface ImageToPdfViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  width: number;
  height: number;
  rotation: number; // 0, 90, 180, 270
}

export type PageSizeOption = 'a4' | 'fit' | 'letter';
export type PageOrientation = 'portrait' | 'landscape' | 'auto';
export type MarginOption = 'none' | 'small' | 'medium';

export default function ImageToPdfView({ onNavigateToTool, onNavigateHome }: ImageToPdfViewProps) {
  const [imageFiles, setImageFiles] = useState<ImageFileItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<PageOrientation>('auto');
  const [margin, setMargin] = useState<MarginOption>('small');
  const [outputFilename, setOutputFilename] = useState('images-document');

  // Drag & drop & UI states
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfBlobResult, setPdfBlobResult] = useState<{ url: string; filename: string; size: number; pageCount: number } | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Keyboard shortcuts (Ctrl+O to upload, Ctrl+Enter to convert)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && imageFiles.length > 0 && !isProcessing) {
        e.preventDefault();
        handleConvertToPdf();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [imageFiles, isProcessing]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imageFiles.forEach(img => URL.revokeObjectURL(img.previewUrl));
      if (pdfBlobResult?.url) URL.revokeObjectURL(pdfBlobResult.url);
    };
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Process uploaded images
  const processUploadedFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
    const fileArray = Array.from(files).filter(f => 
      validImageTypes.includes(f.type) || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(f.name)
    );

    if (fileArray.length === 0) {
      setErrorMessage('Please upload valid image files (JPG, PNG, WebP, GIF, BMP).');
      return;
    }

    const newItems: ImageFileItem[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      if (file.size > 50 * 1024 * 1024) {
        setErrorMessage(`"${file.name}" exceeds the 50MB file size limit.`);
        continue;
      }

      try {
        const previewUrl = URL.createObjectURL(file);
        
        // Load image dimensions
        const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
          const img = new Image();
          img.onload = () => resolve({ width: img.naturalWidth || 800, height: img.naturalHeight || 600 });
          img.onerror = () => resolve({ width: 800, height: 600 });
          img.src = previewUrl;
        });

        newItems.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type || 'image/jpeg',
          previewUrl,
          width,
          height,
          rotation: 0
        });
      } catch (err) {
        console.error(`Error loading image ${file.name}:`, err);
      }
    }

    if (newItems.length > 0) {
      setImageFiles(prev => [...prev, ...newItems]);
      if (pdfBlobResult) {
        URL.revokeObjectURL(pdfBlobResult.url);
        setPdfBlobResult(null);
      }
    }
  };

  // Drag & drop handlers with counter
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
    if (!isDragging) setIsDragging(true);
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
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUploadedFiles(e.target.files);
      e.target.value = '';
    }
  };

  // Queue item reorder & controls
  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= imageFiles.length) return;

    const updated = [...imageFiles];
    const [moved] = updated.splice(index, 1);
    updated.splice(newIndex, 0, moved);
    setImageFiles(updated);
  };

  const removeImage = (id: string) => {
    setImageFiles(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(i => i.id !== id);
    });
    if (pdfBlobResult) {
      URL.revokeObjectURL(pdfBlobResult.url);
      setPdfBlobResult(null);
    }
  };

  const clearAllImages = () => {
    imageFiles.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImageFiles([]);
    if (pdfBlobResult) {
      URL.revokeObjectURL(pdfBlobResult.url);
      setPdfBlobResult(null);
    }
    setErrorMessage(null);
  };

  const rotateImage = (id: string) => {
    setImageFiles(prev => prev.map(img => {
      if (img.id === id) {
        return { ...img, rotation: (img.rotation + 90) % 360 };
      }
      return img;
    }));
  };

  // Convert image to JPEG array buffer using Canvas to safely support WebP, GIF, PNG, etc.
  const imageFileToJpegBuffer = (item: ImageFileItem): Promise<Uint8Array> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let w = img.naturalWidth || 800;
          let h = img.naturalHeight || 600;

          // Handle 90° or 270° rotations
          if (item.rotation === 90 || item.rotation === 270) {
            canvas.width = h;
            canvas.height = w;
          } else {
            canvas.width = w;
            canvas.height = h;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas 2D context unavailable'));
            return;
          }

          // Draw white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Apply rotation transform
          ctx.save();
          if (item.rotation === 90) {
            ctx.translate(canvas.width, 0);
            ctx.rotate((90 * Math.PI) / 180);
          } else if (item.rotation === 180) {
            ctx.translate(canvas.width, canvas.height);
            ctx.rotate((180 * Math.PI) / 180);
          } else if (item.rotation === 270) {
            ctx.translate(0, canvas.height);
            ctx.rotate((270 * Math.PI) / 180);
          }

          ctx.drawImage(img, 0, 0, w, h);
          ctx.restore();

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Failed to encode image to Blob'));
              return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
              const arrayBuffer = reader.result as ArrayBuffer;
              resolve(new Uint8Array(arrayBuffer));
            };
            reader.readAsArrayBuffer(blob);
          }, 'image/jpeg', 0.92);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error(`Failed to load image "${item.name}"`));
      img.src = item.previewUrl;
    });
  };

  // Main PDF Generation Logic
  const handleConvertToPdf = async () => {
    if (imageFiles.length === 0) {
      setErrorMessage('Please add at least one image file.');
      return;
    }

    setIsProcessing(true);
    setProgress(5);
    setProgressStatus('Initializing PDF compilation engine...');
    setErrorMessage(null);

    try {
      const pdfDoc = await PDFDocument.create();

      // Standard page dimensions (in points: 72 points = 1 inch)
      // A4 = 595.28 x 841.89 pt, Letter = 612 x 792 pt
      let baseWidth = 595.28;
      let baseHeight = 841.89;

      if (pageSize === 'letter') {
        baseWidth = 612;
        baseHeight = 792;
      }

      let marginPt = 0;
      if (margin === 'small') marginPt = 18; // ~0.25 in
      if (margin === 'medium') marginPt = 36; // ~0.5 in

      const totalCount = imageFiles.length;

      for (let i = 0; i < totalCount; i++) {
        const item = imageFiles[i];
        const stepProgress = Math.round(10 + ((i + 1) / totalCount) * 80);
        setProgress(stepProgress);
        setProgressStatus(`Processing image ${i + 1} of ${totalCount}: "${item.name}"...`);

        // Convert image to JPEG buffer
        const jpegBytes = await imageFileToJpegBuffer(item);
        const embeddedImage = await pdfDoc.embedJpg(jpegBytes);

        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth = baseWidth;
        let pageHeight = baseHeight;

        if (pageSize === 'fit') {
          pageWidth = imgWidth + marginPt * 2;
          pageHeight = imgHeight + marginPt * 2;
        } else {
          // Adjust portrait vs landscape based on setting
          const isImgLandscape = imgWidth > imgHeight;
          if (orientation === 'landscape' || (orientation === 'auto' && isImgLandscape)) {
            pageWidth = Math.max(baseWidth, baseHeight);
            pageHeight = Math.min(baseWidth, baseHeight);
          } else if (orientation === 'portrait') {
            pageWidth = Math.min(baseWidth, baseHeight);
            pageHeight = Math.max(baseWidth, baseHeight);
          }
        }

        // Calculate fitted image dimensions
        const maxDrawW = pageWidth - marginPt * 2;
        const maxDrawH = pageHeight - marginPt * 2;

        let drawW = imgWidth;
        let drawH = imgHeight;

        if (pageSize !== 'fit') {
          const scale = Math.min(maxDrawW / imgWidth, maxDrawH / imgHeight);
          drawW = imgWidth * scale;
          drawH = imgHeight * scale;
        }

        // Center on page
        const drawX = marginPt + (maxDrawW - drawW) / 2;
        const drawY = marginPt + (maxDrawH - drawH) / 2;

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(embeddedImage, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });

        await new Promise(resolve => setTimeout(resolve, 30));
      }

      setProgress(95);
      setProgressStatus('Finalizing PDF binary structure...');

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const blobUrl = URL.createObjectURL(blob);

      const finalName = outputFilename.trim() !== '' 
        ? (outputFilename.endsWith('.pdf') ? outputFilename : `${outputFilename}.pdf`)
        : 'images-document.pdf';

      setPdfBlobResult({
        url: blobUrl,
        filename: finalName,
        size: blob.size,
        pageCount: totalCount
      });

      setProgress(100);
      setProgressStatus('PDF compilation completed!');

    } catch (err: any) {
      console.error('Image to PDF conversion error:', err);
      setErrorMessage(err?.message || 'An error occurred while compiling your images into a PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalBytesSize = imageFiles.reduce((acc, f) => acc + f.size, 0);

  // FAQs
  const faqs = [
    {
      q: "Are my uploaded photos or images sent to any server?",
      a: "No! Your images are processed 100% locally inside your browser memory using WebAssembly & JavaScript. Your files never leave your computer or touch any server."
    },
    {
      q: "Which image formats are supported?",
      a: "Our Image to PDF converter supports JPG, JPEG, PNG, WebP, GIF, and BMP formats. You can mix and match different formats in a single PDF document."
    },
    {
      q: "Will images automatically scale to fit A4 paper sizes?",
      a: "Yes! By default, images are centered and resized proportionally to fit standard A4 pages with clean margins. You can also set Page Size to 'Fit to Image' if you prefer exact image dimensions."
    },
    {
      q: "Can I reorder or rotate images before converting?",
      a: "Yes! Use the Up/Down arrow buttons to rearrange image sequence or click the Rotate button to turn any image by 90° increments before generating your PDF."
    },
    {
      q: "Is there any limit on how many images I can convert?",
      a: "There are no artificial limits on the number of images. You can combine 5, 20, or 50+ images as long as your device has sufficient RAM."
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
            <span className="text-slate-900 dark:text-white font-medium">Image to PDF</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Image to PDF Converter
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Convert JPG, PNG, and WebP images into a single clean PDF document. 100% private, browser-based.
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
                JPG, PNG, WebP Support
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

          {/* Left Column: Drag & Drop Zone + Image Queue */}
          <div className="lg:col-span-8 space-y-6">

            {/* Drag & Drop Upload Zone */}
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
              id="image-dropzone"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/bmp"
                multiple
                onChange={handleFileInputChange}
                className="hidden"
                id="image-file-input"
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
                        Images Detected • Ready to Drop
                      </div>
                      <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        Release image files here
                      </h2>
                      <p className="text-xs text-indigo-700/80 dark:text-indigo-300/80 max-w-sm mx-auto font-medium">
                        Images will be organized and converted 100% privately in your browser.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        Drop image files here to convert
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                        Supports JPG, PNG, WebP, GIF, and BMP. Combine multiple photos into a single PDF.
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
                    <ImageIcon className="w-4 h-4" />
                    {isDragging ? 'Drop Images Now' : 'Select Image Files'}
                  </button>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Shortcut: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono text-[10px]">Ctrl + O</kbd>
                  </span>
                </div>
              </div>
            </div>

            {/* Uploaded Images List Header */}
            {imageFiles.length > 0 && (
              <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      Images Queue ({imageFiles.length})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {formatFileSize(totalBytesSize)}
                    </span>
                  </div>

                  <button
                    onClick={clearAllImages}
                    className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                </div>

                {/* Queue Grid Items */}
                <div className="space-y-3">
                  {imageFiles.map((item, index) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 rounded-2xl border bg-slate-50/80 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Image details */}
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-xs font-bold text-slate-400 w-5 text-center shrink-0">
                            #{index + 1}
                          </span>

                          {/* Thumbnail preview */}
                          <div className="w-14 h-14 rounded-xl bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 border border-slate-200 dark:border-slate-600 relative group">
                            <img 
                              src={item.previewUrl} 
                              alt={item.name}
                              className="w-full h-full object-cover transition-transform duration-200"
                              style={{ transform: `rotate(${item.rotation}deg)` }}
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm truncate" title={item.name}>
                              {item.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                              <span>{formatFileSize(item.size)}</span>
                              <span>•</span>
                              <span className="font-mono">{item.width}x{item.height} px</span>
                              {item.rotation > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                                    Rotated {item.rotation}°
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Controls (Rotate, Order, Remove) */}
                        <div className="flex items-center justify-between sm:justify-end gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200 dark:border-slate-700">
                          
                          <button
                            onClick={() => rotateImage(item.id)}
                            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                            title="Rotate image 90° clockwise"
                          >
                            <RotateCw className="w-4 h-4" />
                          </button>

                          <div className="flex items-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5">
                            <button
                              onClick={() => moveImage(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move image up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveImage(index, 'down')}
                              disabled={index === imageFiles.length - 1}
                              className="p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move image down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeImage(item.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-300 transition-colors"
                            title="Remove image"
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

          {/* Right Column: Sticky Action Panel */}
          <div className="lg:col-span-4 space-y-6">

            <div className="sticky top-16 md:top-20 bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-md space-y-5 backdrop-blur-md">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Settings2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                Page Layout Settings
              </h2>

              {/* Page Size Config */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Page Size
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setPageSize('a4')}
                    className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                      pageSize === 'a4'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    A4 Page
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageSize('letter')}
                    className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                      pageSize === 'letter'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    US Letter
                  </button>
                  <button
                    type="button"
                    onClick={() => setPageSize('fit')}
                    className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                      pageSize === 'fit'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Fit Image
                  </button>
                </div>
              </div>

              {/* Orientation Config */}
              {pageSize !== 'fit' && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Page Orientation
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                    <button
                      type="button"
                      onClick={() => setOrientation('auto')}
                      className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                        orientation === 'auto'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('portrait')}
                      className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                        orientation === 'portrait'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Portrait
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrientation('landscape')}
                      className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                        orientation === 'landscape'
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Landscape
                    </button>
                  </div>
                </div>
              )}

              {/* Margin Config */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Page Margin
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setMargin('none')}
                    className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                      margin === 'none'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    No Margin
                  </button>
                  <button
                    type="button"
                    onClick={() => setMargin('small')}
                    className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                      margin === 'small'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Small
                  </button>
                  <button
                    type="button"
                    onClick={() => setMargin('medium')}
                    className={`py-2 px-1 rounded-xl font-medium transition-all text-center ${
                      margin === 'medium'
                        ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Medium
                  </button>
                </div>
              </div>

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
                    placeholder="images-document"
                    className="w-full px-3 py-2.5 pr-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                    .pdf
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
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

              {/* Submit/Download Action */}
              {!pdfBlobResult ? (
                <button
                  onClick={handleConvertToPdf}
                  disabled={imageFiles.length === 0 || isProcessing}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                  id="image-to-pdf-submit-btn"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Converting Images...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Convert to PDF Now
                    </>
                  )}
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    PDF Document Ready!
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 font-mono bg-white/80 dark:bg-slate-900/80 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    <div><span className="text-slate-400">File:</span> {pdfBlobResult.filename}</div>
                    <div><span className="text-slate-400">Pages:</span> {pdfBlobResult.pageCount}</div>
                    <div><span className="text-slate-400">Size:</span> {formatFileSize(pdfBlobResult.size)}</div>
                  </div>

                  <a
                    href={pdfBlobResult.url}
                    download={pdfBlobResult.filename}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                    id="image-pdf-download-btn"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF Document
                  </a>

                  <button
                    onClick={() => setPdfBlobResult(null)}
                    className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                  >
                    Modify Selection & Convert Again
                  </button>
                </div>
              )}

              {/* Local Browser Memory Guarantee */}
              <div className="pt-2 text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed flex items-start gap-2 border-t border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  No files uploaded to any servers. All image conversions happen 100% inside your browser memory.
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* Educational SEO & Guide Section at bottom */}
        <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800">
          {/* Ad placement */}
          <AdPlacement slot="leaderboard" id="image-to-pdf-mid-ad" />

          {/* How It Works & Educational Section */}
          <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              How to Convert Images to PDF Online
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  1
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Upload Photos</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Select or drag-and-drop JPG, PNG, or WebP images into the upload area.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  2
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Arrange & Layout</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Reorder image queue, set page sizes (A4/Letter), orientations, and margins.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center mb-3">
                  3
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">Compile & Download</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Click "Convert to PDF" to compile your multi-page PDF locally and save instantly.
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
