import React, { useState, useRef, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileUp, 
  Image as ImageIcon, 
  Trash2, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  ChevronDown, 
  ChevronRight, 
  SlidersHorizontal, 
  X, 
  Archive, 
  Sliders, 
  Eye, 
  ArrowRight, 
  Check, 
  Info, 
  FileCheck, 
  Layers, 
  Maximize2,
  Copy,
  Percent,
  HardDrive,
  FileImage
} from 'lucide-react';
import { getCleanPath } from '../types.ts';
import AdPlacement from './AdPlacement.tsx';

interface ImageCompressorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export interface CompressItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalType: string;
  originalPreviewUrl: string;

  // Compression results
  compressedBlob: Blob | null;
  compressedPreviewUrl: string | null;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  compressedType: string;
  isFallbackOriginal?: boolean;

  isCompressing: boolean;
  error: string | null;
}

export type OutputFormat = 'auto' | 'jpeg' | 'webp' | 'png';
export type ScaleDimension = '100' | '1920' | '1280' | '800' | '75' | '50';

export default function ImageCompressorView({ onNavigateToTool, onNavigateHome }: ImageCompressorViewProps) {
  const [items, setItems] = useState<CompressItem[]>([]);
  const [quality, setQuality] = useState<number>(75); // 1 to 100
  const [format, setFormat] = useState<OutputFormat>('auto');
  const [scale, setScale] = useState<ScaleDimension>('100');
  
  // Drag & drop and processing state
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPreviewItem, setSelectedPreviewItem] = useState<CompressItem | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef(0);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      items.forEach(item => {
        if (item.originalPreviewUrl) URL.revokeObjectURL(item.originalPreviewUrl);
        if (item.compressedPreviewUrl && item.compressedPreviewUrl !== item.originalPreviewUrl) {
          URL.revokeObjectURL(item.compressedPreviewUrl);
        }
      });
    };
  }, []);

  // Format bytes to human readable string (KB, MB)
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Canvas compression helper function with strict size fallback & PNG handling
  const compressSingleFile = useCallback(async (
    file: File,
    qualityVal: number,
    formatVal: OutputFormat,
    scaleVal: ScaleDimension
  ): Promise<{
    blob: Blob;
    width: number;
    height: number;
    type: string;
    isFallbackOriginal: boolean;
  }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = async () => {
        URL.revokeObjectURL(objectUrl);

        let width = img.naturalWidth;
        let height = img.naturalHeight;

        // Dimension scaling logic
        if (scaleVal === '1920' || scaleVal === '1280' || scaleVal === '800') {
          const maxDim = parseInt(scaleVal, 10);
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
        } else if (scaleVal === '75') {
          width = Math.round(width * 0.75);
          height = Math.round(height * 0.75);
        } else if (scaleVal === '50') {
          width = Math.round(width * 0.5);
          height = Math.round(height * 0.5);
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        // Determine output target mime type
        let targetMime = file.type || 'image/jpeg';
        if (formatVal === 'jpeg') targetMime = 'image/jpeg';
        else if (formatVal === 'webp') targetMime = 'image/webp';
        else if (formatVal === 'png') targetMime = 'image/png';
        else if (formatVal === 'auto') {
          targetMime = file.type || 'image/jpeg';
        }

        // If target is JPEG, draw a solid white background to prevent black background on transparent PNGs
        if (targetMime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Map quality 1-100 to decimal 0.01 - 1.0
        const normQuality = Math.max(0.01, Math.min(1.0, qualityVal / 100));

        const getBlob = (mime: string, qual: number): Promise<Blob | null> => {
          return new Promise(res => {
            canvas.toBlob(b => res(b), mime, qual);
          });
        };

        let generatedBlob = await getBlob(targetMime, normQuality);

        // Smart fallback checks if compression yielded larger blob
        if (generatedBlob && generatedBlob.size >= file.size) {
          if (formatVal === 'auto' && (file.type === 'image/png' || targetMime === 'image/png')) {
            // Attempt WebP as auto fallback for PNGs
            const webpBlob = await getBlob('image/webp', normQuality);
            if (webpBlob && webpBlob.size < file.size) {
              generatedBlob = webpBlob;
              targetMime = 'image/webp';
            }
          } else if (normQuality > 0.3) {
            // Try slightly lower quality to see if it reduces below original size
            const lowerBlob = await getBlob(targetMime, Math.max(0.05, normQuality * 0.7));
            if (lowerBlob && lowerBlob.size < file.size) {
              generatedBlob = lowerBlob;
            }
          }
        }

        // STRICT SIZE CHECK: Never return a file larger than the original
        if (!generatedBlob || generatedBlob.size >= file.size) {
          resolve({
            blob: file, // Fallback to original file
            width: img.naturalWidth,
            height: img.naturalHeight,
            type: file.type || 'image/jpeg',
            isFallbackOriginal: true
          });
        } else {
          resolve({
            blob: generatedBlob,
            width: canvas.width,
            height: canvas.height,
            type: targetMime,
            isFallbackOriginal: false
          });
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load image file. File may be corrupted.'));
      };

      img.src = objectUrl;
    });
  }, []);

  // Process files when added or settings updated
  const recompressItem = useCallback(async (item: CompressItem, currentQuality: number, currentFormat: OutputFormat, currentScale: ScaleDimension) => {
    try {
      const res = await compressSingleFile(item.file, currentQuality, currentFormat, currentScale);
      
      if (item.compressedPreviewUrl && item.compressedPreviewUrl !== item.originalPreviewUrl) {
        URL.revokeObjectURL(item.compressedPreviewUrl);
      }

      const compressedUrl = res.isFallbackOriginal
        ? item.originalPreviewUrl
        : URL.createObjectURL(res.blob);

      return {
        ...item,
        compressedBlob: res.blob,
        compressedPreviewUrl: compressedUrl,
        compressedSize: res.blob.size,
        compressedWidth: res.width,
        compressedHeight: res.height,
        compressedType: res.type,
        isFallbackOriginal: res.isFallbackOriginal,
        isCompressing: false,
        error: null
      };
    } catch (err: any) {
      return {
        ...item,
        isCompressing: false,
        error: err.message || 'Error compressing image'
      };
    }
  }, [compressSingleFile]);

  // Handle new incoming files
  const handleAddFiles = async (files: FileList | File[]) => {
    setErrorMessage(null);
    const validFiles: File[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      } else {
        setErrorMessage(`File "${file.name}" was skipped. Only JPG, PNG, and WebP images are supported.`);
      }
    }

    if (validFiles.length === 0) return;

    setIsProcessing(true);

    const newItems: CompressItem[] = validFiles.map(file => {
      const id = Math.random().toString(36).substring(2, 9);
      const originalPreviewUrl = URL.createObjectURL(file);
      return {
        id,
        file,
        name: file.name,
        originalSize: file.size,
        originalWidth: 0,
        originalHeight: 0,
        originalType: file.type || 'image/jpeg',
        originalPreviewUrl,
        compressedBlob: null,
        compressedPreviewUrl: null,
        compressedSize: 0,
        compressedWidth: 0,
        compressedHeight: 0,
        compressedType: file.type || 'image/jpeg',
        isCompressing: true,
        error: null
      };
    });

    setItems(prev => [...prev, ...newItems]);

    // Compress each file sequentially or in parallel
    const processedItems = await Promise.all(
      newItems.map(item => recompressItem(item, quality, format, scale))
    );

    setItems(prev => {
      return prev.map(existing => {
        const found = processedItems.find(p => p.id === existing.id);
        return found || existing;
      });
    });

    setIsProcessing(false);
  };

  // Re-run compression across all files when quality, format, or scale options change
  useEffect(() => {
    if (items.length === 0) return;

    let isMounted = true;
    const timeout = setTimeout(async () => {
      setIsProcessing(true);

      const updated = await Promise.all(
        items.map(async item => {
          return await recompressItem(item, quality, format, scale);
        })
      );

      if (isMounted) {
        setItems(updated);
        setIsProcessing(false);
      }
    }, 150);

    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [quality, format, scale]);

  // Drag & drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleAddFiles(e.dataTransfer.files);
    }
  };

  // Paste handler for Ctrl+V images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return;
      const files: File[] = [];
      for (let i = 0; i < e.clipboardData.items.length; i++) {
        const item = e.clipboardData.items[i];
        if (item.type.indexOf('image') !== -1) {
          const blob = item.getAsFile();
          if (blob) files.push(blob);
        }
      }
      if (files.length > 0) {
        handleAddFiles(files);
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [quality, format, scale]);

  // Single Item Removal
  const handleRemoveItem = (id: string) => {
    setItems(prev => {
      const itemToRemove = prev.find(i => i.id === id);
      if (itemToRemove) {
        if (itemToRemove.originalPreviewUrl) URL.revokeObjectURL(itemToRemove.originalPreviewUrl);
        if (itemToRemove.compressedPreviewUrl) URL.revokeObjectURL(itemToRemove.compressedPreviewUrl);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  // Clear All
  const handleClearAll = () => {
    items.forEach(item => {
      if (item.originalPreviewUrl) URL.revokeObjectURL(item.originalPreviewUrl);
      if (item.compressedPreviewUrl) URL.revokeObjectURL(item.compressedPreviewUrl);
    });
    setItems([]);
    setErrorMessage(null);
  };

  // Single Image Download
  const handleDownloadSingle = (item: CompressItem) => {
    if (!item.compressedBlob) return;
    const link = document.createElement('a');
    
    // Calculate new filename extension
    let ext = 'jpg';
    if (item.compressedType.includes('webp')) ext = 'webp';
    else if (item.compressedType.includes('png')) ext = 'png';
    else if (item.compressedType.includes('jpeg') || item.compressedType.includes('jpg')) ext = 'jpg';

    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    const downloadName = `${baseName}-compressed.${ext}`;

    const url = URL.createObjectURL(item.compressedBlob);
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Download All as ZIP
  const handleDownloadZip = async () => {
    if (items.length === 0) return;
    const zip = new JSZip();

    items.forEach((item, index) => {
      if (item.compressedBlob) {
        let ext = 'jpg';
        if (item.compressedType.includes('webp')) ext = 'webp';
        else if (item.compressedType.includes('png')) ext = 'png';
        else if (item.compressedType.includes('jpeg') || item.compressedType.includes('jpg')) ext = 'jpg';

        const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
        const filename = `${baseName}-compressed.${ext}`;
        zip.file(filename, item.compressedBlob);
      }
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(content);
    link.href = url;
    link.download = `compressed-images-${Date.now()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Total Statistics calculations
  const totalOriginalSize = items.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedSize = items.reduce((acc, curr) => acc + (curr.compressedSize || curr.originalSize), 0);
  const totalSavingsBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const totalSavingsPercent = totalOriginalSize > 0 
    ? Math.round((totalSavingsBytes / totalOriginalSize) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16">
      
      {/* Top Header & Breadcrumb Container */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
            <button 
              onClick={onNavigateHome} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => onNavigateToTool('tools')} 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Tools
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Image Compressor (MB to KB)</span>
          </nav>

          {/* Title & Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-cyan-50 dark:bg-cyan-950/40 rounded-xl text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-900/40">
                  <FileImage className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                  Image Compressor (MB to KB)
                </h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Compress JPG, PNG & WebP images from Megabytes (MB) to Kilobytes (KB) in seconds. 100% private client-side browser processing with zero server uploads.
              </p>
            </div>

            {/* Privacy Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% Private Local Canvas
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Main Workspace Card (Tool First) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm space-y-8">

          {/* Upload Dropzone Container */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer group ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 scale-[1.01] shadow-lg shadow-indigo-500/10'
                : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleAddFiles(e.target.files);
                  e.target.value = '';
                }
              }}
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                isDragging
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80'
              }`}>
                <FileUp className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                  <span className="text-indigo-600 dark:text-indigo-400 underline decoration-2 underline-offset-4">
                    Click to upload
                  </span>{' '}
                  or drag & drop images here
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Supports JPG, JPEG, PNG, and WebP • Paste from clipboard (`Ctrl+V`) • Multi-file batch supported
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  Max size: Unlimited
                </span>
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  100% Offline Processing
                </span>
              </div>
            </div>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm"
            >
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
              <div className="flex-1 font-medium">{errorMessage}</div>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* PNG Compression Tip Banner */}
          {items.some(i => i.originalType === 'image/png') && (format === 'auto' || format === 'png') && (
            <motion.div 
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <span className="font-bold">PNG Compression Notice:</span> PNG is a lossless format and browser canvas cannot reduce raw PNG file sizes directly via quality sliders. Switch format to <strong className="underline">WebP</strong> or <strong className="underline">JPG</strong> for up to 80% MB to KB reduction!
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => setFormat('webp')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow-sm transition-colors"
                >
                  Convert to WebP
                </button>
                <button
                  onClick={() => setFormat('jpeg')}
                  className="px-3 py-1.5 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Convert to JPG
                </button>
              </div>
            </motion.div>
          )}

          {/* Compression Controls Bar */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Compression Settings
                </h3>
              </div>
              {isProcessing && (
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Compressing Canvas...
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Quality Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                    Compression Quality: <span className="text-indigo-600 dark:text-indigo-400 text-sm font-extrabold">{quality}%</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {quality < 50 ? 'Max KB Savings' : quality < 85 ? 'Balanced' : 'High Quality'}
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:accent-indigo-500"
                />

                <div className="flex items-center justify-between gap-1 pt-1">
                  <button
                    onClick={() => setQuality(40)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                      quality === 40 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    40% Max Savings
                  </button>
                  <button
                    onClick={() => setQuality(75)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                      quality === 75 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    75% Recommended
                  </button>
                  <button
                    onClick={() => setQuality(90)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                      quality === 90 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    90% HD Quality
                  </button>
                </div>
              </div>

              {/* Output Format Selector */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Output Format
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFormat('auto')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      format === 'auto'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    Auto (Original)
                  </button>
                  <button
                    onClick={() => setFormat('jpeg')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      format === 'jpeg'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    JPG (.jpg)
                  </button>
                  <button
                    onClick={() => setFormat('webp')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      format === 'webp'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    WebP (.webp)
                  </button>
                  <button
                    onClick={() => setFormat('png')}
                    className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                      format === 'png'
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    PNG (.png)
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  {format === 'webp' 
                    ? '⚡ WebP provides up to 30% smaller KB than JPG.'
                    : format === 'jpeg'
                    ? '📄 JPEG is best for photos and maximum KB reduction.'
                    : 'Original keeps your original image format.'}
                </p>
              </div>

              {/* Max Dimension Scaling */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                  Resize / Resolution Limit
                </label>

                <select
                  value={scale}
                  onChange={(e) => setScale(e.target.value as ScaleDimension)}
                  className="w-full px-3 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="100">Original Resolution (100%)</option>
                  <option value="1920">Max 1920px (Full HD)</option>
                  <option value="1280">Max 1280px (HD)</option>
                  <option value="800">Max 800px (Web Optimized)</option>
                  <option value="75">Scale down by 25% (75% size)</option>
                  <option value="50">Scale down by 50% (Half size)</option>
                </select>

                <p className="text-[11px] text-slate-400">
                  Scaling down 4K/Large photos provides massive extra KB compression.
                </p>
              </div>

            </div>
          </div>

          {/* Active Items & Real-time Stats Section */}
          {items.length > 0 ? (
            <div className="space-y-6">

              {/* Summary Stats Header Bar */}
              <div className="bg-gradient-to-r from-indigo-50 via-cyan-50 to-emerald-50 dark:from-indigo-950/40 dark:via-cyan-950/30 dark:to-emerald-950/40 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {items.length} {items.length === 1 ? 'Image Compressed' : 'Images Compressed'}
                      </h4>
                      {totalSavingsPercent > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500 text-white animate-pulse">
                          Saved {totalSavingsPercent}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Original: <span className="font-semibold">{formatBytes(totalOriginalSize)}</span> &rarr; Compressed:{' '}
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatBytes(totalCompressedSize)}</span>
                    </p>
                  </div>
                </div>

                {/* Batch Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {items.length > 1 && (
                    <button
                      onClick={handleDownloadZip}
                      className="flex-1 sm:flex-initial px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                    >
                      <Archive className="w-4 h-4" />
                      Download All (ZIP)
                    </button>
                  )}
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>

              </div>

              {/* Side-by-Side Comparison List */}
              <div className="space-y-6">
                {items.map((item) => {
                  const savedBytes = item.originalSize - item.compressedSize;
                  const savedPercent = item.originalSize > 0 
                    ? Math.round((savedBytes / item.originalSize) * 100) 
                    : 0;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4 relative group"
                    >
                      {/* Item Top Bar */}
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 gap-3">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <FileImage className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate max-w-xs sm:max-w-md">
                            {item.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {savedPercent > 0 && !item.isFallbackOriginal ? (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              -{savedPercent}% ({formatBytes(savedBytes)} smaller)
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/40 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                              Already Optimized
                            </span>
                          )}

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Side-by-Side Comparison Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Original Image Card */}
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-3 border border-slate-200/70 dark:border-slate-800 flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>ORIGINAL IMAGE</span>
                            <span className="text-slate-700 dark:text-slate-300 font-mono">
                              {formatBytes(item.originalSize)}
                            </span>
                          </div>

                          <div className="relative h-44 rounded-lg overflow-hidden bg-slate-200/50 dark:bg-slate-950 flex items-center justify-center border border-slate-200 dark:border-slate-800">
                            {item.originalPreviewUrl ? (
                              <img
                                src={item.originalPreviewUrl}
                                alt="Original"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-slate-400" />
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between">
                            <span>Format: {item.originalType.replace('image/', '').toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Compressed Image Card */}
                        <div className="bg-emerald-50/40 dark:bg-emerald-950/20 rounded-xl p-3 border border-emerald-200/70 dark:border-emerald-900/50 flex flex-col justify-between space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                            <span>COMPRESSED RESULT</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-300 font-extrabold text-sm">
                              {formatBytes(item.compressedSize)}
                            </span>
                          </div>

                          <div className="relative h-44 rounded-lg overflow-hidden bg-slate-200/50 dark:bg-slate-950 flex items-center justify-center border border-emerald-200 dark:border-emerald-900">
                            {item.compressedPreviewUrl ? (
                              <img
                                src={item.compressedPreviewUrl}
                                alt="Compressed"
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Processing...
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-mono">
                            <span>
                              {item.compressedWidth && item.compressedHeight 
                                ? `${item.compressedWidth} × ${item.compressedHeight} px` 
                                : 'Compressed'}
                            </span>
                            <span>{item.compressedType.replace('image/', '').toUpperCase()}</span>
                          </div>
                        </div>

                      </div>

                      {/* Download Button per Item */}
                      <div className="flex items-center justify-end pt-2">
                        <button
                          onClick={() => handleDownloadSingle(item)}
                          disabled={!item.compressedBlob}
                          className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
                        >
                          <Download className="w-4 h-4" />
                          Download Compressed Image ({formatBytes(item.compressedSize)})
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </div>

            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 dark:text-slate-500 text-xs">
              Upload any JPG, PNG, or WebP photo above to begin instant MB to KB image compression.
            </div>
          )}

        </div>

        {/* Ad Placement Container */}
        <AdPlacement slot="leaderboard" className="my-8" />

        {/* Information & Educational Section (Information Second) */}
        <div className="space-y-8">
          
          {/* How to Compress Images in 3 Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How to Compress Images from MB to KB Online
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Follow three simple steps to shrink image sizes without uploading files to remote servers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Upload or Drag & Drop Photos
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select your JPG, PNG, or WebP image files from your computer or phone, or paste directly with `Ctrl+V`.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Adjust Quality & Format
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Use the quality slider (e.g. 75%), convert to WebP or JPEG, or scale resolution down to shrink MB down to KB.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Instant Local Download
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Compare original size vs. compressed size side-by-side and download optimized files individually or as a ZIP archive.
                </p>
              </div>

            </div>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Private Client-Side</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Images are processed entirely inside your browser using HTML5 Canvas. Zero photos leave your device or reach external cloud servers.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Zap className="w-8 h-8 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instant MB to KB Reduction</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Shrink 5MB or 10MB high-resolution camera photos down to 200KB or 400KB in milliseconds for fast web loading and email attachments.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Sparkles className="w-8 h-8 text-cyan-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">WebP, JPG & PNG Engine</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Convert heavy PNG transparent graphics into modern compressed WebP or JPEG files for maximum bandwidth reduction.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Archive className="w-8 h-8 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Batch ZIP Export</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Compress multiple photos simultaneously and download all optimized files cleanly in a single structured ZIP archive.
              </p>
            </div>

          </div>

          {/* Interactive FAQ Accordion */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Frequently Asked Questions (FAQ)
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Are my uploaded images saved or sent to any server?",
                  a: "No! All image compression is executed 100% locally on your computer or smartphone using HTML5 Canvas technology inside web memory. No images or media files are ever uploaded to remote cloud servers."
                },
                {
                  q: "How does the quality slider reduce image file size from MB to KB?",
                  a: "The quality slider adjusts the lossy compression ratio when rendering image pixels. Reducing quality from 100% to 75% or 80% eliminates redundant visual data that the human eye barely notices, resulting in up to 80%-90% reduction in KB file size."
                },
                {
                  q: "Can I compress PNG images to smaller KB sizes?",
                  a: "Yes. PNG files are natively lossless and can be quite heavy (often multiple MBs). You can compress PNGs by scaling dimensions down or converting them to JPEG or WebP format for massive KB savings."
                },
                {
                  q: "Why convert images to WebP format?",
                  a: "WebP is a modern image format developed by Google that provides superior lossy and lossless compression for web graphics. WebP files are typically 25%-35% smaller than JPEG files at equivalent visual quality."
                },
                {
                  q: "Is there any limit on image file sizes or upload counts?",
                  a: "Because all compression runs directly inside your local browser memory, there are no artificial file size limits or daily download caps!"
                }
              ].map((faq, idx) => (
                <div 
                  key={idx}
                  className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-850/50"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {expandedFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
