import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSpreadsheet, 
  FileText, 
  FileUp, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Zap, 
  ChevronDown, 
  SlidersHorizontal, 
  X, 
  Eye, 
  Info, 
  Table as TableIcon, 
  Layers, 
  Grid, 
  Sliders,
  Check,
  FileCheck,
  ArrowRight,
  HelpCircle,
  FileSearch,
  ScanLine,
  Database
} from 'lucide-react';
import AdPlacement from './AdPlacement.tsx';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure pdfjs worker locally via Vite asset URL
if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
}

interface PdfToExcelViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export type SheetModeOption = 'combined' | 'separate';

interface ExtractedTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ExtractedSheet {
  name: string;
  headers: string[];
  rows: string[][];
  totalRows: number;
  totalCols: number;
}

export default function PdfToExcelView({ onNavigateToTool, onNavigateHome }: PdfToExcelViewProps) {
  // File & State
  const [file, setFile] = useState<File | null>(null);
  const [extractedSheets, setExtractedSheets] = useState<ExtractedSheet[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);
  
  // Settings
  const [sheetMode, setSheetMode] = useState<SheetModeOption>('combined');
  const [yTolerance, setYTolerance] = useState<number>(4);
  const [firstRowIsHeader, setFirstRowIsHeader] = useState<boolean>(true);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  
  // Processing States
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [currentParsingPage, setCurrentParsingPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isScannedWarning, setIsScannedWarning] = useState<boolean>(false);

  // Drag & drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef<number>(0);

  // Parse PDF and convert to table rows & columns
  const parsePdfToTables = useCallback(async (
    pdfFile: File,
    mode: SheetModeOption,
    toleranceY: number,
    useFirstRowHeader: boolean,
    doTrim: boolean
  ) => {
    setIsParsing(true);
    setErrorMessage(null);
    setIsScannedWarning(false);
    setCurrentParsingPage(0);
    setTotalPages(0);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      // Load PDF document
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version || '6.2.108'}/cmaps/`,
        cMapPacked: true,
      });

      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      setTotalPages(numPages);

      let totalCharCount = 0;
      const pageResults: { pageNum: number; rows: string[][] }[] = [];

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        setCurrentParsingPage(pageNum);
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        // Extract raw items with position
        const items: ExtractedTextItem[] = [];

        for (const item of textContent.items as any[]) {
          if (!item.str) continue;
          const strVal = doTrim ? item.str.trim() : item.str;
          if (!strVal) continue;

          totalCharCount += strVal.length;

          // Matrix transform [a, b, c, d, e, f] -> e is X, f is Y
          const transform = item.transform || [1, 0, 0, 1, 0, 0];
          const x = transform[4] || 0;
          const y = transform[5] || 0;
          const width = item.width || 0;
          const height = item.height || Math.abs(transform[3]) || 10;

          items.push({ str: strVal, x, y, width, height });
        }

        if (items.length === 0) {
          pageResults.push({ pageNum, rows: [] });
          continue;
        }

        // Sort items by Y descending (top of page to bottom)
        items.sort((a, b) => b.y - a.y);

        // Group items into rows using yTolerance
        const rawRows: ExtractedTextItem[][] = [];
        let currentRow: ExtractedTextItem[] = [];
        let currentY = items[0].y;

        for (const item of items) {
          if (Math.abs(item.y - currentY) <= toleranceY) {
            currentRow.push(item);
          } else {
            if (currentRow.length > 0) {
              // Sort items in current row by X ascending (left to right)
              currentRow.sort((a, b) => a.x - b.x);
              rawRows.push(currentRow);
            }
            currentRow = [item];
            currentY = item.y;
          }
        }
        if (currentRow.length > 0) {
          currentRow.sort((a, b) => a.x - b.x);
          rawRows.push(currentRow);
        }

        // Collect column X boundaries across rows to construct aligned grid
        const allXCoords: number[] = [];
        rawRows.forEach(row => {
          row.forEach(item => allXCoords.push(item.x));
        });
        allXCoords.sort((a, b) => a - b);

        // Cluster X coords into distinct columns (xTolerance ~ 12px)
        const colClusters: number[] = [];
        const xTolerance = 12;
        for (const x of allXCoords) {
          if (colClusters.length === 0) {
            colClusters.push(x);
          } else {
            const lastColX = colClusters[colClusters.length - 1];
            if (x - lastColX > xTolerance) {
              colClusters.push(x);
            }
          }
        }

        // Map row items into column slots
        const stringRows: string[][] = [];

        rawRows.forEach(row => {
          const rowCells = new Array(Math.max(1, colClusters.length)).fill('');
          row.forEach(item => {
            // Find closest column index
            let bestColIdx = 0;
            let minDiff = Math.abs(item.x - colClusters[0]);
            for (let c = 1; c < colClusters.length; c++) {
              const diff = Math.abs(item.x - colClusters[c]);
              if (diff < minDiff) {
                minDiff = diff;
                bestColIdx = c;
              }
            }

            if (rowCells[bestColIdx]) {
              rowCells[bestColIdx] += ' ' + item.str;
            } else {
              rowCells[bestColIdx] = item.str;
            }
          });

          // Trim cell values
          const cleanRow = rowCells.map(c => c.trim());
          // Only add row if not completely empty
          if (cleanRow.some(c => c !== '')) {
            stringRows.push(cleanRow);
          }
        });

        pageResults.push({ pageNum, rows: stringRows });
      }

      // Check if text count is extremely low (scanned image PDF)
      if (totalCharCount < 15) {
        setIsScannedWarning(true);
      }

      // Build Sheet Data objects
      const sheetsList: ExtractedSheet[] = [];

      if (mode === 'combined') {
        let combinedRows: string[][] = [];
        pageResults.forEach(pr => {
          combinedRows = combinedRows.concat(pr.rows);
        });

        if (combinedRows.length > 0) {
          let headers: string[] = [];
          let bodyRows: string[][] = [];

          if (useFirstRowHeader && combinedRows.length > 1) {
            headers = combinedRows[0];
            bodyRows = combinedRows.slice(1);
          } else {
            const maxCols = Math.max(...combinedRows.map(r => r.length), 1);
            headers = Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`);
            bodyRows = combinedRows;
          }

          sheetsList.push({
            name: 'Extracted Data',
            headers,
            rows: bodyRows,
            totalRows: bodyRows.length,
            totalCols: headers.length
          });
        } else {
          sheetsList.push({
            name: 'Extracted Data',
            headers: ['Information'],
            rows: [['No text content could be extracted from this PDF.']],
            totalRows: 0,
            totalCols: 1
          });
        }
      } else {
        // Separate sheets per page
        pageResults.forEach(pr => {
          if (pr.rows.length > 0) {
            let headers: string[] = [];
            let bodyRows: string[][] = [];

            if (useFirstRowHeader && pr.rows.length > 1) {
              headers = pr.rows[0];
              bodyRows = pr.rows.slice(1);
            } else {
              const maxCols = Math.max(...pr.rows.map(r => r.length), 1);
              headers = Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`);
              bodyRows = pr.rows;
            }

            sheetsList.push({
              name: `Page ${pr.pageNum}`,
              headers,
              rows: bodyRows,
              totalRows: bodyRows.length,
              totalCols: headers.length
            });
          } else {
            sheetsList.push({
              name: `Page ${pr.pageNum}`,
              headers: ['Information'],
              rows: [['Page is empty or contains no selectable text layer.']],
              totalRows: 0,
              totalCols: 1
            });
          }
        });
      }

      setExtractedSheets(sheetsList);
      setSelectedSheetIndex(0);

    } catch (err: any) {
      console.error('PDF parsing error:', err);
      if (err.name === 'PasswordException' || err.message?.includes('password')) {
        setErrorMessage('This PDF document is password-protected or encrypted. Please remove the password protection and try again.');
      } else {
        setErrorMessage(err.message || 'Failed to parse PDF document. Ensure the file is a valid PDF.');
      }
      setExtractedSheets([]);
    } finally {
      setIsParsing(false);
    }
  }, []);

  // Handle incoming file selection
  const handleProcessFile = (uploadedFile: File) => {
    if (!uploadedFile.name.toLowerCase().endsWith('.pdf')) {
      setErrorMessage(`Invalid file type "${uploadedFile.name}". Please upload a valid PDF document.`);
      return;
    }
    setFile(uploadedFile);
    parsePdfToTables(uploadedFile, sheetMode, yTolerance, firstRowIsHeader, trimWhitespace);
  };

  // Re-run parsing when settings change
  const handleApplySettings = () => {
    if (file) {
      parsePdfToTables(file, sheetMode, yTolerance, firstRowIsHeader, trimWhitespace);
    }
  };

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
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Reset tool
  const handleReset = () => {
    setFile(null);
    setExtractedSheets([]);
    setSelectedSheetIndex(0);
    setErrorMessage(null);
    setIsScannedWarning(false);
  };

  // Download Excel (.xlsx)
  const handleDownloadExcel = () => {
    if (extractedSheets.length === 0 || !file) return;

    const wb = XLSX.utils.book_new();

    extractedSheets.forEach((sheet) => {
      const fullAoa = [sheet.headers, ...sheet.rows];
      const ws = XLSX.utils.aoa_to_sheet(fullAoa);
      XLSX.utils.book_append_sheet(wb, ws, sheet.name.substring(0, 31)); // 31 char max limit in Excel
    });

    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    XLSX.writeFile(wb, `${cleanName}_extracted.xlsx`);
  };

  // Download CSV (.csv)
  const handleDownloadCsv = () => {
    if (extractedSheets.length === 0 || !file) return;

    const currentSheet = extractedSheets[selectedSheetIndex] || extractedSheets[0];
    const fullAoa = [currentSheet.headers, ...currentSheet.rows];
    const ws = XLSX.utils.aoa_to_sheet(fullAoa);
    const csvContent = XLSX.utils.sheet_to_csv(ws);

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.setAttribute('download', `${cleanName}_${currentSheet.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeSheet = extractedSheets[selectedSheetIndex] || extractedSheets[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16">
      
      {/* Top Header & Breadcrumb Container */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800/80 pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-4">
          
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center text-xs text-slate-500 dark:text-slate-400 space-x-2">
            <button 
              onClick={onNavigateHome} 
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Home
            </button>
            <span>/</span>
            <button 
              onClick={() => onNavigateToTool('tools')} 
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
            >
              Tools
            </button>
            <span>/</span>
            <span className="text-slate-900 dark:text-slate-200 font-semibold">PDF to Excel Converter</span>
          </nav>

          {/* Title & Badges */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                  PDF to Excel Converter
                </h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Extract tables and formatted data from PDF documents directly into Excel (.xlsx) and CSV spreadsheets. 100% private local processing.
              </p>
            </div>

            {/* Privacy Badge */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% Local Browser Engine
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* Scanned PDF Warning Banner Required by Spec */}
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs">
          <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <strong>Note:</strong> Works best with text-based native PDFs. Scanned image-only PDFs require server-side OCR and are not supported in this purely client-side local browser version.
          </p>
        </div>

        {/* Main Workspace Card (Tool First) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm space-y-8">

          {/* Upload Dropzone Container */}
          {!file ? (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer group ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 scale-[1.01] shadow-lg shadow-emerald-500/10'
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950/50 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleProcessFile(e.target.files[0]);
                    e.target.value = '';
                  }
                }}
                accept=".pdf"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className={`p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                  isDragging
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80'
                }`}>
                  <FileText className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-emerald-600 dark:text-emerald-400 underline decoration-2 underline-offset-4">
                      Click to upload
                    </span>{' '}
                    or drag & drop PDF file here
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Extract structured tables from PDF financial statements, invoices, and reports
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    PDF.js Spatial Coordinate Extraction
                  </span>
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    Zero Server Uploads
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* File Uploaded Header Card */
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 w-full sm:w-auto">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-200 dark:border-emerald-900/60 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB • {totalPages} {totalPages === 1 ? 'Page' : 'Pages'} total
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <X className="w-4 h-4" />
                Change File
              </button>
            </div>
          )}

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

          {/* Scanned Image Warning */}
          {isScannedWarning && (
            <motion.div 
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-start gap-3 text-amber-800 dark:text-amber-200 text-xs"
            >
              <ScanLine className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-sm mb-0.5">Scanned or Image-Based PDF Detected</span>
                No selectable text layers were found in this PDF. It appears to be a scanned document or image file. Scanned files require OCR (Optical Character Recognition) to extract text into Excel.
              </div>
            </motion.div>
          )}

          {/* Parsing Progress Indicator */}
          {isParsing && (
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4 text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="font-bold text-sm">
                  Parsing PDF Pages & Aligning Spatial Coordinates...
                </span>
              </div>

              {totalPages > 0 && (
                <div className="space-y-2 max-w-md mx-auto">
                  <div className="flex justify-between text-xs font-mono text-slate-500">
                    <span>Page {currentParsingPage} of {totalPages}</span>
                    <span>{Math.round((currentParsingPage / totalPages) * 100)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full transition-all duration-300"
                      style={{ width: `${(currentParsingPage / totalPages) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Extraction Settings & Interactive Table Preview */}
          {file && !isParsing && extractedSheets.length > 0 && (
            <div className="space-y-8">
              
              {/* Extraction Tuning Controls */}
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      Table Extraction & Alignment Settings
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Sheet Combine Strategy */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Multi-Page Output Strategy
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSheetMode('combined');
                          parsePdfToTables(file, 'combined', yTolerance, firstRowIsHeader, trimWhitespace);
                        }}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          sheetMode === 'combined'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Single Combined Sheet
                      </button>
                      <button
                        onClick={() => {
                          setSheetMode('separate');
                          parsePdfToTables(file, 'separate', yTolerance, firstRowIsHeader, trimWhitespace);
                        }}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          sheetMode === 'separate'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Sheet Per PDF Page
                      </button>
                    </div>
                  </div>

                  {/* Y-Tolerance Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Row Alignment Tolerance ({yTolerance}pt)
                      </label>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      step="0.5"
                      value={yTolerance}
                      onChange={(e) => setYTolerance(parseFloat(e.target.value))}
                      onMouseUp={handleApplySettings}
                      onTouchEnd={handleApplySettings}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Strict (2pt)</span>
                      <span>Balanced (4pt)</span>
                      <span>Relaxed (10pt)</span>
                    </div>
                  </div>

                  {/* Worksheet Selector if Multi-Sheet */}
                  {extractedSheets.length > 1 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                        Active Worksheet Preview
                      </label>
                      <select
                        value={selectedSheetIndex}
                        onChange={(e) => setSelectedSheetIndex(parseInt(e.target.value, 10))}
                        className="w-full px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                      >
                        {extractedSheets.map((s, idx) => (
                          <option key={idx} value={idx}>
                            {s.name} ({s.totalRows} rows, {s.totalCols} cols)
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                </div>

                {/* Additional Toggles */}
                <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={firstRowIsHeader}
                      onChange={(e) => {
                        setFirstRowIsHeader(e.target.checked);
                        parsePdfToTables(file, sheetMode, yTolerance, e.target.checked, trimWhitespace);
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>Use First Extracted Row as Column Header</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trimWhitespace}
                      onChange={(e) => {
                        setTrimWhitespace(e.target.checked);
                        parsePdfToTables(file, sheetMode, yTolerance, firstRowIsHeader, e.target.checked);
                      }}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>Auto-Trim Cell Whitespace</span>
                  </label>
                </div>

              </div>

              {/* Instant Download Action Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Data Extracted Successfully ({activeSheet?.totalRows || 0} rows found)
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Export your extracted spreadsheet as an Excel (.xlsx) workbook or CSV file.
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleDownloadCsv}
                    className="w-full sm:w-auto px-4 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>

                  <button
                    onClick={handleDownloadExcel}
                    className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    Download Excel (.xlsx)
                  </button>
                </div>
              </div>

              {/* Extracted Data Table Preview */}
              {activeSheet && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Extracted Data Preview: <span className="text-emerald-600 dark:text-emerald-400">{activeSheet.name}</span>
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      Showing {activeSheet.rows.length} rows, {activeSheet.totalCols} columns
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-inner max-h-96">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-800 text-white dark:bg-slate-900 border-b border-slate-700">
                          <th className="py-2.5 px-3 font-mono text-[10px] text-slate-400 border-r border-slate-700 w-12 text-center">
                            #
                          </th>
                          {activeSheet.headers.map((h, i) => (
                            <th key={i} className="py-2.5 px-3 font-bold border-r border-slate-700/60 whitespace-nowrap">
                              {h || `Col ${i + 1}`}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {activeSheet.rows.length === 0 ? (
                          <tr>
                            <td colSpan={activeSheet.headers.length + 1} className="py-8 text-center text-slate-400 font-mono">
                              No data rows extracted for this page/sheet.
                            </td>
                          </tr>
                        ) : (
                          activeSheet.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                              <td className="py-2 px-3 font-mono text-[10px] text-slate-400 text-center border-r border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50">
                                {rIdx + 1}
                              </td>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="py-2 px-3 border-r border-slate-100 dark:border-slate-850 whitespace-nowrap text-slate-700 dark:text-slate-300">
                                  {cell !== '' ? cell : <span className="text-slate-300 dark:text-slate-700 font-mono">—</span>}
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Ad Placement Container */}
        <AdPlacement slot="leaderboard" className="my-8" />

        {/* Information & Educational Section (Information Second) */}
        <div className="space-y-8">
          
          {/* How to Convert PDF to Excel in 3 Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How to Extract PDF Tables into Excel Online
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Follow three simple steps to convert PDF tables into editable Excel (.xlsx) spreadsheets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Upload PDF Document
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select your PDF file containing data tables, invoices, or financial statements, or drag and drop into the upload box.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Verify Table Preview
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Inspect the extracted table preview in real-time. Adjust row alignment tolerance if necessary to align columns.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Download Excel (.xlsx) or CSV
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Download your extracted spreadsheet directly to your device with 100% client-side privacy.
                </p>
              </div>

            </div>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Local Privacy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Bank statements, pay stubs, and tax documents stay completely inside your web browser. No remote uploads.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Database className="w-8 h-8 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Spatial Alignment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Uses 2D spatial coordinate mapping (X/Y axis) to reconstruct cell locations into Excel columns accurately.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Layers className="w-8 h-8 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Multi-Sheet Options</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Combine entire multi-page PDFs into one master sheet or generate separate Excel tabs for each page.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Zap className="w-8 h-8 text-cyan-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instant Download</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Extract tables in seconds without waiting for server queue processing or email links.
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
                  q: "Are my sensitive PDF bank statements uploaded to any server?",
                  a: "No! All PDF parsing and coordinate extraction runs 100% inside your local browser memory using PDF.js and SheetJS. Your files are never uploaded to any cloud server."
                },
                {
                  q: "Does this tool support scanned PDFs or photo documents?",
                  a: "This tool is optimized for native, text-based PDFs (e.g. digital invoices, generated bank statements, exported reports). Scanned photos or flattened image PDFs require Optical Character Recognition (OCR), which is not included in this client-side local version."
                },
                {
                  q: "What if the extracted columns look slightly misaligned?",
                  a: "You can adjust the 'Row Alignment Tolerance' slider in the Extraction Settings bar to tweak how strictly text elements on the same horizontal line are grouped together."
                },
                {
                  q: "Can I export to both Excel (.xlsx) and CSV?",
                  a: "Yes! You can choose to download as an Excel workbook (.xlsx) or export the active worksheet as a clean CSV file."
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
