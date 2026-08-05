import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  Maximize2, 
  Grid, 
  ListFilter,
  Check,
  FileCheck,
  ArrowRight,
  Printer,
  Type,
  Layout,
  FileCode
} from 'lucide-react';
import AdPlacement from './AdPlacement.tsx';

interface ExcelToPdfViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export type TableStyleOption = 'grid' | 'striped' | 'plain';
export type OrientationOption = 'landscape' | 'portrait';
export type PageSizeOption = 'a4' | 'letter' | 'a3';
export type FontSizeOption = '8' | '9' | '10' | '12';

interface SheetData {
  name: string;
  headers: string[];
  rows: string[][];
  totalRows: number;
  totalCols: number;
}

export default function ExcelToPdfView({ onNavigateToTool, onNavigateHome }: ExcelToPdfViewProps) {
  // File & Excel State
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(-1); // -1 = All Sheets Combined
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // PDF Layout Options
  const [docTitle, setDocTitle] = useState<string>('');
  const [orientation, setOrientation] = useState<OrientationOption>('landscape');
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [tableStyle, setTableStyle] = useState<TableStyleOption>('grid');
  const [fontSize, setFontSize] = useState<FontSizeOption>('9');
  const [includeHeaderTitle, setIncludeHeaderTitle] = useState<boolean>(true);
  const [includePageNumbers, setIncludePageNumbers] = useState<boolean>(true);

  // Drag & drop state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounter = useRef<number>(0);

  // Clean up object URLs if any
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Handle incoming file selection
  const handleProcessFile = async (uploadedFile: File) => {
    setErrorMessage(null);
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileNameLower = uploadedFile.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileNameLower.endsWith(ext));

    if (!isValid) {
      setErrorMessage(`Invalid file format "${uploadedFile.name}". Please upload a valid Excel (.xlsx, .xls) or CSV (.csv) spreadsheet.`);
      return;
    }

    setIsParsing(true);
    setFile(uploadedFile);
    setDocTitle(uploadedFile.name.replace(/\.[^/.]+$/, ''));

    try {
      const buffer = await uploadedFile.arrayBuffer();
      const parsedWorkbook = XLSX.read(buffer, { type: 'array' });
      
      if (!parsedWorkbook.SheetNames || parsedWorkbook.SheetNames.length === 0) {
        throw new Error('The uploaded file does not contain any readable sheets or data.');
      }

      const parsedSheets: SheetData[] = [];

      parsedWorkbook.SheetNames.forEach((sheetName) => {
        const worksheet = parsedWorkbook.Sheets[sheetName];
        // Parse sheet to array of arrays
        const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1, defval: '' });

        if (rawRows && rawRows.length > 0) {
          // Find first non-empty row as header
          let headerIdx = 0;
          while (headerIdx < rawRows.length && (!rawRows[headerIdx] || rawRows[headerIdx].length === 0 || rawRows[headerIdx].every(c => c === ''))) {
            headerIdx++;
          }

          if (headerIdx < rawRows.length) {
            const rawHeaders = rawRows[headerIdx].map((h: any, i: number) => h !== undefined && h !== null && String(h).trim() !== '' ? String(h) : `Col ${i + 1}`);
            const dataRows = rawRows.slice(headerIdx + 1).map((r: any[]) => 
              r.map((cell: any) => cell !== undefined && cell !== null ? String(cell) : '')
            );

            parsedSheets.push({
              name: sheetName,
              headers: rawHeaders,
              rows: dataRows,
              totalRows: dataRows.length,
              totalCols: rawHeaders.length
            });
          } else {
            parsedSheets.push({
              name: sheetName,
              headers: ['Information'],
              rows: [['Sheet contains no data rows']],
              totalRows: 0,
              totalCols: 1
            });
          }
        } else {
          parsedSheets.push({
            name: sheetName,
            headers: ['Information'],
            rows: [['Sheet is empty']],
            totalRows: 0,
            totalCols: 1
          });
        }
      });

      setWorkbook(parsedWorkbook);
      setSheets(parsedSheets);
      setSelectedSheetIndex(parsedSheets.length > 1 ? -1 : 0); // Default to "All" if multi-sheet, else Sheet 1
    } catch (err: any) {
      console.error('Parsing error:', err);
      setErrorMessage(
        err.message || 'Failed to parse Excel file. The file may be password-protected, encrypted, or corrupted.'
      );
      setFile(null);
      setWorkbook(null);
      setSheets([]);
    } finally {
      setIsParsing(false);
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
    setWorkbook(null);
    setSheets([]);
    setSelectedSheetIndex(-1);
    setErrorMessage(null);
    setDocTitle('');
  };

  // PDF Generation Function
  const handleGeneratePdf = async () => {
    if (sheets.length === 0) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      // Instantiate jsPDF
      const doc = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: pageSize,
      });

      const sheetsToProcess = selectedSheetIndex === -1 
        ? sheets 
        : [sheets[selectedSheetIndex]];

      let isFirstSheet = true;

      sheetsToProcess.forEach((sheet) => {
        if (!isFirstSheet) {
          doc.addPage();
        }
        isFirstSheet = false;

        let startY = 15;

        // Custom Document / Sheet Header Title
        if (includeHeaderTitle) {
          const titleText = docTitle.trim() ? docTitle.trim() : sheet.name;
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 41, 59); // Slate 800
          doc.text(titleText, 14, startY);

          if (sheetsToProcess.length > 1) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139); // Slate 500
            doc.text(`Sheet: ${sheet.name}`, 14, startY + 6);
            startY += 12;
          } else {
            startY += 8;
          }
        }

        // Table Theme configuration
        let themeVal: 'grid' | 'striped' | 'plain' = 'grid';
        if (tableStyle === 'striped') themeVal = 'striped';
        else if (tableStyle === 'plain') themeVal = 'plain';

        const numFontSize = parseInt(fontSize, 10);

        autoTable(doc, {
          head: [sheet.headers],
          body: sheet.rows,
          startY: startY,
          theme: themeVal,
          styles: {
            fontSize: numFontSize,
            cellPadding: 2.5,
            overflow: 'linebreak', // Wraps text inside cell gracefully
            halign: 'left',
            valign: 'middle',
            font: 'helvetica',
          },
          headStyles: {
            fillColor: [30, 41, 59], // Dark slate header background
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: numFontSize + 0.5,
          },
          alternateRowStyles: tableStyle === 'striped' ? {
            fillColor: [248, 250, 252] // Cool light slate
          } : undefined,
          margin: { top: 15, right: 12, bottom: 15, left: 12 },
          didDrawPage: (data) => {
            if (includePageNumbers) {
              const totalPages = (doc as any).internal.getNumberOfPages();
              doc.setFontSize(8);
              doc.setTextColor(148, 163, 184); // Slate 400
              const pageStr = `Page ${data.pageNumber} of ${totalPages}`;
              const pageWidth = doc.internal.pageSize.width;
              doc.text(pageStr, pageWidth - 14, doc.internal.pageSize.height - 8, { align: 'right' });
            }
          }
        });
      });

      // Download PDF
      const cleanFileName = (docTitle.trim() || 'converted-spreadsheet')
        .replace(/[^a-zA-Z0-9_-]/g, '_');
      doc.save(`${cleanFileName}.pdf`);

    } catch (err: any) {
      console.error('PDF Generation error:', err);
      setErrorMessage(
        err.message || 'An error occurred while building the PDF table layout.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Currently active sheet preview
  const activeSheetForPreview = sheets.length > 0 
    ? (selectedSheetIndex === -1 ? sheets[0] : sheets[selectedSheetIndex])
    : null;

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
            <span className="text-slate-900 dark:text-slate-200 font-semibold">Excel to PDF Converter</span>
          </nav>

          {/* Title & Badge */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-slate-900 dark:text-white">
                  Excel to PDF Converter
                </h1>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                Convert Excel spreadsheets (.xlsx, .xls, .csv) into clean, beautifully formatted PDF documents. 100% private client-side browser processing.
              </p>
            </div>

            {/* Privacy Badges */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/40">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                100% Local SheetJS & jsPDF Engine
              </span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
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
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className={`p-4 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${
                  isDragging
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200/80 dark:border-slate-700/80'
                }`}>
                  <FileSpreadsheet className="w-8 h-8" />
                </div>

                <div className="space-y-1">
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    <span className="text-emerald-600 dark:text-emerald-400 underline decoration-2 underline-offset-4">
                      Click to upload
                    </span>{' '}
                    or drag & drop Excel file here
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Supports Microsoft Excel (.xlsx, .xls) and CSV (.csv) spreadsheets
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-[11px] px-2.5 py-1 rounded-md bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    Multi-sheet Auto Detection
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
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {file.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {(file.size / 1024).toFixed(1)} KB • {sheets.length} {sheets.length === 1 ? 'Worksheet' : 'Worksheets'} detected
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

          {/* Parsing Loading Indicator */}
          {isParsing && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Parsing spreadsheet structure and worksheets...
              </p>
            </div>
          )}

          {/* Layout Controls & Table Preview Section */}
          {sheets.length > 0 && !isParsing && (
            <div className="space-y-8">
              
              {/* Controls Configuration Grid */}
              <div className="bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 space-y-6">
                
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      PDF Layout & Formatting Settings
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Sheet Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Select Worksheet to Convert
                    </label>
                    <select
                      value={selectedSheetIndex}
                      onChange={(e) => setSelectedSheetIndex(parseInt(e.target.value, 10))}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      {sheets.length > 1 && (
                        <option value={-1}>All Worksheets ({sheets.length} sheets combined)</option>
                      )}
                      {sheets.map((s, idx) => (
                        <option key={idx} value={idx}>
                          {s.name} ({s.totalRows} rows, {s.totalCols} cols)
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400">
                      Choose a specific sheet or merge all sheets into a single multi-page PDF document.
                    </p>
                  </div>

                  {/* PDF Orientation */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Page Orientation
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOrientation('landscape')}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                          orientation === 'landscape'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <Layout className="w-3.5 h-3.5 rotate-90" />
                        Landscape (Best)
                      </button>
                      <button
                        onClick={() => setOrientation('portrait')}
                        className={`px-3 py-2 text-xs font-semibold rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                          orientation === 'portrait'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <Layout className="w-3.5 h-3.5" />
                        Portrait
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Landscape orientation is strongly recommended for wide Excel data tables.
                    </p>
                  </div>

                  {/* Table Visual Style */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Table Visual Style
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => setTableStyle('grid')}
                        className={`px-2 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          tableStyle === 'grid'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setTableStyle('striped')}
                        className={`px-2 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          tableStyle === 'striped'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Striped
                      </button>
                      <button
                        onClick={() => setTableStyle('plain')}
                        className={`px-2 py-2 text-xs font-semibold rounded-xl border text-center transition-all ${
                          tableStyle === 'plain'
                            ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        Minimal
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Striped adds alternating row backgrounds for easier reading.
                    </p>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Text Font Size
                    </label>
                    <select
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value as FontSizeOption)}
                      className="w-full px-3.5 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="8">Small (8pt) - Best for wide tables</option>
                      <option value="9">Compact (9pt) - Recommended</option>
                      <option value="10">Standard (10pt)</option>
                      <option value="12">Large (12pt)</option>
                    </select>
                  </div>

                  {/* Document Title Header Input */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
                      Document Title Header (Optional)
                    </label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      placeholder="e.g. Q3 Financial Report 2026"
                      className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                </div>

                {/* Additional Toggles */}
                <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includeHeaderTitle}
                      onChange={(e) => setIncludeHeaderTitle(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>Include Title Header on PDF</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includePageNumbers}
                      onChange={(e) => setIncludePageNumbers(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                    />
                    <span>Include Footer Page Numbers</span>
                  </label>
                </div>

              </div>

              {/* Instant Convert & Download Primary Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Ready to generate PDF document
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Converting {selectedSheetIndex === -1 ? `all ${sheets.length} worksheets` : `Sheet "${sheets[selectedSheetIndex]?.name}"`} into PDF ({orientation.toUpperCase()}, {pageSize.toUpperCase()}).
                  </p>
                </div>

                <button
                  onClick={handleGeneratePdf}
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 hover:scale-[1.02]"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Convert & Download PDF
                    </>
                  )}
                </button>
              </div>

              {/* Data Table Preview Section */}
              {activeSheetForPreview && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TableIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        Sheet Data Preview: <span className="text-emerald-600 dark:text-emerald-400">{activeSheetForPreview.name}</span>
                      </h4>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      Showing preview of {Math.min(15, activeSheetForPreview.rows.length)} of {activeSheetForPreview.totalRows} rows
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-inner max-h-96">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-800 text-white dark:bg-slate-900 border-b border-slate-700">
                          <th className="py-2.5 px-3 font-mono text-[10px] text-slate-400 border-r border-slate-700 w-12 text-center">
                            #
                          </th>
                          {activeSheetForPreview.headers.map((h, i) => (
                            <th key={i} className="py-2.5 px-3 font-bold border-r border-slate-700/60 whitespace-nowrap">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {activeSheetForPreview.rows.slice(0, 15).map((row, rIdx) => (
                          <tr 
                            key={rIdx} 
                            className={rIdx % 2 === 1 && tableStyle === 'striped' 
                              ? 'bg-slate-50/70 dark:bg-slate-900/40' 
                              : 'hover:bg-slate-50 dark:hover:bg-slate-900/20'}
                          >
                            <td className="py-2 px-3 font-mono text-[10px] text-slate-400 text-center border-r border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50">
                              {rIdx + 1}
                            </td>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2 px-3 border-r border-slate-100 dark:border-slate-850 whitespace-nowrap text-slate-700 dark:text-slate-300">
                                {cell !== '' ? cell : <span className="text-slate-300 dark:text-slate-700 font-mono">—</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
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
          
          {/* How to Convert Excel to PDF in 3 Steps */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                How to Convert Excel Spreadsheets to PDF Online
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Follow three simple steps to transform Excel workbooks and CSV files into polished PDF documents.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  1
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Upload Excel or CSV File
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Select your `.xlsx`, `.xls`, or `.csv` spreadsheet file from your device or drag and drop into the upload dropzone.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  2
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Configure Layout & Worksheet
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Choose specific sheets or combine all sheets. Adjust landscape orientation, table grid style, and font sizes.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center text-sm">
                  3
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Instant Local Download
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Click Convert to PDF to generate and download your formatted PDF document instantly without sending data to servers.
                </p>
              </div>

            </div>
          </div>

          {/* Key Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Your financial reports, payroll data, and confidential spreadsheets stay entirely inside your browser memory. Zero files uploaded.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Layers className="w-8 h-8 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Multi-Sheet Support</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Seamlessly convert individual sheets or compile all worksheets in a multi-tab workbook into a unified PDF file.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Layout className="w-8 h-8 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Landscape & Auto-Fit</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Smart text-wrapping prevents column overflow on wide tables, keeping every column aligned and legible.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <Zap className="w-8 h-8 text-cyan-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Instant Browser Speed</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Powered by compiled SheetJS and jsPDF engines for blazing fast conversion without queue times or server bottlenecks.
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
                  q: "Are my confidential Excel files uploaded to any external server?",
                  a: "No! All spreadsheet parsing and PDF rendering takes place 100% locally in your web browser. No files or cell values ever touch remote servers."
                },
                {
                  q: "What spreadsheet file formats are supported?",
                  a: "The tool supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv) spreadsheets."
                },
                {
                  q: "How does the tool handle wide tables with many columns?",
                  a: "By default, the tool sets the page orientation to Landscape and utilizes automatic text-wrapping (linebreak) with compact font sizes to ensure all columns fit neatly onto PDF pages without clipping."
                },
                {
                  q: "Can I convert all sheets in a multi-sheet workbook at once?",
                  a: "Yes! Simply select 'All Worksheets' from the sheet dropdown menu, and the converter will automatically render each worksheet sequentially into a single PDF document."
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
