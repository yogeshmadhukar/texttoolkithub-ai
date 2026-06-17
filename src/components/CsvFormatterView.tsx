import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  FileText,
  Table,
  Check,
  Copy,
  Download,
  Trash2,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  DownloadCloud,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Info,
  HelpCircle,
  Hash,
  LineChart,
  Eye,
  FileSpreadsheet,
  Globe,
  Settings,
  CheckCircle2,
  X,
  FileJson
} from 'lucide-react';

interface CsvFormatterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

// Simple robust CSV parser to avoid external dependencies, supporting quotes and escapes
function parseCSV(text: string, delimiter: string = ','): string[][] {
  const lines: string[][] = [];
  if (!text) return lines;

  let row: string[] = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote
          currentVal += '"';
          i++;
        } else {
          // Closing quote
          inQuotes = false;
        }
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        row.push(currentVal);
        currentVal = '';
      } else if (char === '\r' || char === '\n') {
        row.push(currentVal);
        currentVal = '';
        if (row.length > 0 || (row.length === 1 && row[0] !== '')) {
          lines.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip LF if CRLF
        }
      } else {
        currentVal += char;
      }
    }
  }

  // Handle last line without ending carriage structures
  if (currentVal || row.length > 0) {
    row.push(currentVal);
    lines.push(row);
  }

  return lines;
}

// Convert dataset grid back into CSV format
function serializeToCSV(grid: string[][], delimiter: string = ','): string {
  return grid.map(row => {
    return row.map(val => {
      let cell = val === undefined || val === null ? '' : String(val);
      // Escape inner quotes
      if (cell.includes('"') || cell.includes(delimiter) || cell.includes('\n') || cell.includes('\r')) {
        cell = `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(delimiter);
  }).join('\n');
}

export default function CsvFormatterView({ onNavigateToTool, onNavigateHome }: CsvFormatterViewProps) {
  const [rawInput, setRawInput] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>('auto');
  const [hasHeaders, setHasHeaders] = useState<boolean>(true);
  
  // Data Grid Processing structures
  const [parsedGrid, setParsedGrid] = useState<string[][]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pagination Controls
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Search filter query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Column Extraction toggles (map of index -> boolean)
  const [selectedColumns, setSelectedColumns] = useState<Record<number, boolean>>({});

  // Active Sorting Config
  const [sortConfig, setSortConfig] = useState<{ colIndex: number; direction: 'asc' | 'desc' } | null>(null);

  // Filter modifiers checkboxes
  const [filterEmptyRows, setFilterEmptyRows] = useState<boolean>(false);
  const [removeDuplicateRows, setRemoveDuplicateRows] = useState<boolean>(false);

  // Output configuration state
  const [targetFormat, setTargetFormat] = useState<'csv' | 'tsv' | 'json' | 'sql' | 'markdown' | 'text'>('markdown');
  const [outputDelimiter, setOutputDelimiter] = useState<string>(',');
  const [sqlTableName, setSqlTableName] = useState<string>('my_imported_table');

  // Copy status indicators
  const [copiedRaw, setCopiedRaw] = useState<boolean>(false);
  const [copiedResult, setCopiedResult] = useState<boolean>(false);

  // Accordion guides & SEO toggler
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState<boolean>(false);

  // Constants
  const seoTitle = "CSV Formatter & Column Extractor | TextToolkitHub";
  const seoDescription = "Format CSV files, extract columns, convert CSV to JSON, SQL arrays and Markdown tables instantly with 100% browser-side privacy.";

  // Dynamic sample data injector
  const loadPresetData = (presetType: 'sales' | 'contacts' | 'devices') => {
    if (presetType === 'sales') {
      setRawInput(
        `Transaction ID,Product,Region,Quantity,Price,Order Date,Delivered\n` +
        `TX99102,MacBook Air M3,North America,2,1199.00,2026-06-12,true\n` +
        `TX99103,iPad Pro OLED,Europe,1,999.00,2026-06-14,false\n` +
        `TX99104,iPhone 17 Pro,Asia-Pacific,5,1099.00,2026-06-15,true\n` +
        `TX99105,Studio Display,North America,,1599.00,2026-06-16,true\n` +
        `TX99106,Mac mini M4,Europe,3,599.00,2026-06-16,false\n` +
        `TX99107,Vision Pro Pro,Asia-Pacific,1,3499.00,2026-06-17,true\n` +
        `TX99102,MacBook Air M3,North America,2,1199.00,2026-06-12,true\n` + // deliberate duplicate
        `TX99108,Apple Watch Ultra,Latin America,4,799.00,2026-06-17,true\n` +
        `,,,,,,\n` + // deliberate empty line
        `TX99109,AirPods Max 2,Europe,10,549.00,2026-06-17,true`
      );
      setDelimiter('auto');
      setHasHeaders(true);
    } else if (presetType === 'contacts') {
      setRawInput(
        `First Name\tLast Name\tEmail Address\tRole\tCreated Year\n` +
        `Aris\tVanderbilt\taris.v@corp.co\tAdmin\t2501\n` +
        `Lyra\tMendoza\tlyram@dev.io\tDeveloper\t2025\n` +
        `Kenji\tSato\tkenjis@market.jp\tDesigner\t2026\n` +
        `Elena\tRostova\telena.ros@union.ua\tProduct\t2024\n` +
        `Devon\tArch\tdevon@cloud.net\tSRE\t2026`
      );
      setDelimiter('auto');
      setHasHeaders(true);
    } else if (presetType === 'devices') {
      setRawInput(
        `device_id;os;version;battery_status;last_ping\n` +
        `D001;iOS;19.1;Good;2026-06-16T22:15:00Z\n` +
        `D002;Android;16;Critical;2026-06-16T23:45:00Z\n` +
        `D003;macOS;16.4;Good;2026-06-17T03:00:00Z\n` +
        `D004;Windows;12;Unknown;2026-06-17T03:10:00Z`
      );
      setDelimiter('auto');
      setHasHeaders(true);
    }
  };

  // Automatically detect delimiters if selected to do so
  const resolveDelimiter = (text: string, selected: string): string => {
    if (selected !== 'auto') return selected;
    if (!text) return ',';
    
    // Count common delimiters on the first line
    const sample = text.split('\n')[0] || '';
    const commas = (sample.match(/,/g) || []).length;
    const tabs = (sample.match(/\t/g) || []).length;
    const semicolons = (sample.match(/;/g) || []).length;
    const pipes = (sample.match(/\|/g) || []).length;

    const max = Math.max(commas, tabs, semicolons, pipes);
    if (max === 0) return ','; // Fallback
    if (max === commas) return ',';
    if (max === tabs) return '\t';
    if (max === semicolons) return ';';
    return '|';
  };

  // Run initial setup for parsed Grid
  useEffect(() => {
    const trimmed = rawInput;
    if (!trimmed) {
      setParsedGrid([]);
      setErrorMessage(null);
      return;
    }

    try {
      const detectedDelim = resolveDelimiter(trimmed, delimiter);
      const parsed = parseCSV(trimmed, detectedDelim);
      setParsedGrid(parsed);
      setErrorMessage(null);

      // Extract all columns by default when new file/data arrives
      if (parsed.length > 0) {
        const headerRow = parsed[0] || [];
        const initialSelection: Record<number, boolean> = {};
        headerRow.forEach((_, idx) => {
          initialSelection[idx] = true;
        });
        setSelectedColumns(initialSelection);
      }
      setCurrentPage(1);
    } catch (e: any) {
      setErrorMessage(`Error parsing data input: ${e.message || 'Malformed values or unmatched quote marks found.'}`);
      setParsedGrid([]);
    }
  }, [rawInput, delimiter]);

  // Set document SEO tags
  useEffect(() => {
    const previousTitle = document.title;
    document.title = seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content') || '';
    if (metaDesc) {
      metaDesc.setAttribute('content', seoDescription);
    }

    // Default load sales demo preset
    loadPresetData('sales');

    return () => {
      document.title = previousTitle;
      if (metaDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, []);

  // Process rows through sorting, search, duplicates removal and filters
  const processedData = useMemo(() => {
    if (parsedGrid.length === 0) return { headers: [], rows: [] };

    let headers: string[] = [];
    let rows: string[][] = [];

    if (hasHeaders) {
      headers = parsedGrid[0] || [];
      rows = parsedGrid.slice(1);
    } else {
      // Generate synthetic placeholders (Col 1, Col 2..)
      const maxColLength = Math.max(...parsedGrid.map(r => r.length), 0);
      headers = Array.from({ length: maxColLength }, (_, i) => `Column ${i + 1}`);
      rows = parsedGrid;
    }

    // Clean rows if empty removal requested
    if (filterEmptyRows) {
      rows = rows.filter(row => {
        return row.some(cell => cell && cell.trim() !== '');
      });
    }

    // Remove duplicates rows entirely
    if (removeDuplicateRows) {
      const seen = new Set<string>();
      rows = rows.filter(row => {
        const serialized = JSON.stringify(row);
        if (seen.has(serialized)) return false;
        seen.add(serialized);
        return true;
      });
    }

    // Global text queries filter across cells
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter(row => {
        return row.some(cell => cell.toLowerCase().includes(q));
      });
    }

    // Implement sorting config
    if (sortConfig) {
      const { colIndex, direction } = sortConfig;
      rows = [...rows].sort((a, b) => {
        const valA = (a[colIndex] || '').trim();
        const valB = (b[colIndex] || '').trim();

        // Check if numeric sorts should trigger
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return direction === 'asc' ? numA - numB : numB - numA;
        }

        // Lexicographical string sort
        return direction === 'asc' 
          ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' })
          : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return { headers, rows };
  }, [parsedGrid, hasHeaders, filterEmptyRows, removeDuplicateRows, searchQuery, sortConfig]);

  // Statistics calculation helpers
  const stats = useMemo(() => {
    const rawRowsCount = parsedGrid.length;
    const headerRow = parsedGrid[0] || [];
    const colsCount = headerRow.length;

    let emptyCellsCount = 0;
    const uniqueValuesSet = new Set<string>();

    parsedGrid.forEach((row, rIdx) => {
      // Skip headers for tracking stats values if desired, or count raw distribution
      row.forEach((cell) => {
        const isHeader = hasHeaders && rIdx === 0;
        if (!cell || cell.trim() === '') {
          emptyCellsCount++;
        } else if (!isHeader) {
          uniqueValuesSet.add(cell.trim());
        }
      });
    });

    return {
      totalRows: rawRowsCount,
      totalColumns: colsCount,
      emptyCells: emptyCellsCount,
      uniqueValues: uniqueValuesSet.size
    };
  }, [parsedGrid, hasHeaders]);

  // Handle paginate index segments
  const paginatedRows = useMemo(() => {
    const startIdx = (currentPage - 1) * rowsPerPage;
    return processedData.rows.slice(startIdx, startIdx + rowsPerPage);
  }, [processedData.rows, currentPage, rowsPerPage]);

  const totalPagesCount = Math.ceil(processedData.rows.length / rowsPerPage) || 1;

  // Toggle dynamic single column switch
  const handleToggleColumn = (index: number) => {
    setSelectedColumns(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleSelectAllColumns = () => {
    const initialSelection: Record<number, boolean> = {};
    processedData.headers.forEach((_, idx) => {
      initialSelection[idx] = true;
    });
    setSelectedColumns(initialSelection);
  };

  const handleDeselectAllColumns = () => {
    setSelectedColumns({});
  };

  // Reset core sorting filters
  const handleClearSort = () => {
    setSortConfig(null);
  };

  const handleTriggerSort = (index: number) => {
    setSortConfig(prev => {
      if (prev?.colIndex === index) {
        if (prev.direction === 'asc') {
          return { colIndex: index, direction: 'desc' };
        }
        return null; // toggle off
      }
      return { colIndex: index, direction: 'asc' };
    });
  };

  // Convert and project processed grids to target output formats
  const formattedOutput = useMemo(() => {
    const { headers, rows } = processedData;
    if (headers.length === 0 && rows.length === 0) return '';

    // Index coordinates of currently mapped headers & selected cells
    const activeColIndices = headers
      .map((_, idx) => idx)
      .filter(idx => selectedColumns[idx] === true);

    if (activeColIndices.length === 0) {
      return '/* Please select at least one column to preview extraction */';
    }

    // Build subheaders & row values using extracted coordinates
    const extractedHeaders = activeColIndices.map(idx => headers[idx]);
    const extractedRows = rows.map(row => activeColIndices.map(idx => row[idx] || ''));

    const gridForSerialization: string[][] = [];
    if (hasHeaders) {
      gridForSerialization.push(extractedHeaders);
    }
    extractedRows.forEach(row => gridForSerialization.push(row));

    switch (targetFormat) {
      case 'csv':
        return serializeToCSV(gridForSerialization, outputDelimiter);

      case 'tsv':
        return serializeToCSV(gridForSerialization, '\t');

      case 'json': {
        // Output format mapping either keyed JSON row array or tuple values
        if (hasHeaders) {
          const arr = extractedRows.map(row => {
            const rowObj: Record<string, string> = {};
            extractedHeaders.forEach((h, hIdx) => {
              rowObj[h || `column_${hIdx + 1}`] = row[hIdx] || '';
            });
            return rowObj;
          });
          return JSON.stringify(arr, null, 2);
        } else {
          return JSON.stringify(extractedRows, null, 2);
        }
      }

      case 'sql': {
        const cleanTableName = sqlTableName.trim().replace(/[^a-zA-Z0-9_]/g, '_') || 'my_table';
        const colsSql = extractedHeaders.map(h => `\`${(h || 'col').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '_')}\``).join(', ');
        const valLines = extractedRows.map(row => {
          const cells = row.map(cell => {
            const escaped = cell.replace(/'/g, "''");
            return `'${escaped}'`;
          }).join(', ');
          return `  (${cells})`;
        }).join(',\n');

        return `INSERT INTO ${cleanTableName}\n  (${colsSql})\nVALUES\n${valLines};`;
      }

      case 'markdown': {
        // Construct markdown representation table layout
        let md = '';
        const widths = extractedHeaders.map((h, idx) => {
          const cellWidths = extractedRows.map(r => (r[idx] || '').length);
          return Math.max((h || '').length, ...cellWidths, 3);
        });

        // Header Names line
        md += '| ' + extractedHeaders.map((h, i) => (h || '').padEnd(widths[i])).join(' | ') + ' |\n';
        // Dividers line
        md += '| ' + widths.map(w => '-'.repeat(w)).join(' | ') + ' |\n';
        // Rows data lines
        extractedRows.forEach(row => {
          md += '| ' + row.map((cell, i) => (cell || '').padEnd(widths[i])).join(' | ') + ' |\n';
        });
        return md;
      }

      case 'text':
      default: {
        // Merged formatted strings separated by spaces line-by-line
        return extractedRows.map(r => r.join(' ')).join('\n');
      }
    }
  }, [processedData, selectedColumns, targetFormat, hasHeaders, outputDelimiter, sqlTableName]);

  // Global action commands
  const handleClearInput = () => {
    setRawInput('');
    setParsedGrid([]);
  };

  const copyToClipboard = (text: string, triggerStateSetter: (v: boolean) => void) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      triggerStateSetter(true);
      setTimeout(() => triggerStateSetter(false), 2000);
    });
  };

  const handleDownloadOutput = () => {
    if (!formattedOutput) return;
    
    let extension = 'txt';
    let mimeType = 'text/plain';

    if (targetFormat === 'csv') {
      extension = 'csv';
      mimeType = 'text/csv';
    } else if (targetFormat === 'tsv') {
      extension = 'tsv';
      mimeType = 'text/tab-separated-values';
    } else if (targetFormat === 'json') {
      extension = 'json';
      mimeType = 'application/json';
    } else if (targetFormat === 'sql') {
      extension = 'sql';
      mimeType = 'application/sql';
    } else if (targetFormat === 'markdown') {
      extension = 'md';
      mimeType = 'text/markdown';
    }

    const blob = new Blob([formattedOutput], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `extracted-data-grid.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      id: 1,
      question: "Will my pasted CSV or TSV data be uploaded to external servers?",
      answer: "No, absolutely not. All parsing, delimiter detection, pagination sorting, searching, column extractions, and Markdown output formats occur 100% locally inside your web browser. Sensitive dataset files never touch any backends or cloud-hosting pipelines."
    },
    {
      id: 2,
      question: "How does the auto-detect delimiter algorithm handle mismatched characters?",
      answer: "The tool analyzes the first row of your pasted text content and calculates frequencies of popular delimiter signatures including commas (,), tabs (\\t), semicolons (;), and pipes (|). It automatically pairs the grid structure with the characters yielding the highest counts."
    },
    {
      id: 3,
      question: "Can I extract non-consecutive columns or custom sort numeric coordinates?",
      answer: "Yes! Use the Column Extractor check-box widgets below the data preview to select any arbitrary indexes you wish to project. Sorting dynamically detects floats or integers, maintaining proper scale instead of strict lexicographical string alignments."
    },
    {
      id: 4,
      question: "How do I format nested quote markers on exported CSV strings?",
      answer: "Our serialized CSV generator automatically wraps fields in double quotes whenever commas, carriage returns, or quote signs populate target values. It simultaneously escapes preexisting double quotes safely (doubling them to \"\") to preserve compatibility."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="csv-formatter-pro-container">
      
      {/* Breadcrumb Navigation Line */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6" id="csv-breadcrumb">
        <button 
          onClick={onNavigateHome} 
          className="hover:text-indigo-650 dark:hover:text-indigo-400 transition flex items-center gap-1 cursor-pointer"
          id="bread-btn-home"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button 
          onClick={() => onNavigateToTool('tools')} 
          className="hover:text-indigo-650 dark:hover:text-indigo-400 transition cursor-pointer"
          id="bread-btn-tools"
        >
          Tools
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-705 dark:text-slate-300">CSV Formatter & Column Extractor</span>
      </div>

      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-550/10 text-indigo-655 dark:text-indigo-430 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono">
              <FileSpreadsheet className="w-3.5 h-3.5" /> Client Utility
            </span>
            <span className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono">
              Data & Operations
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display tracking-tight text-slate-950 dark:text-white leading-[1.1] mb-2">
            CSV Formatter & <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-display">Column Extractor</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Quickly format, clean, preview, and slice tabular text datasets. Filter empty lines, search row values, isolate specific columns, and convert inputs into Markdown tables, SQL arrays, and nested JSON.
          </p>
        </div>

        <button
          onClick={() => setShowSeoMeta(!showSeoMeta)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 transition shrink-0 self-start md:self-auto cursor-pointer"
          id="seo-tag-toggle-btn"
        >
          <Globe className="w-4 h-4 text-indigo-500" />
          {showSeoMeta ? 'Hide Page SEO Meta' : 'Verify SEO Meta'}
        </button>
      </div>

      {/* SEO metadata dashboard */}
      {showSeoMeta && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border border-indigo-120 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
          id="seo-status-banner-card"
        >
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="w-4 h-4" /> SEO Header Integration Preview
          </div>
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/85 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
              https://texttoolkithub.com/tools/csv-formatter
            </div>
            <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
              {seoTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 mt-1">
              {seoDescription}
            </p>
          </div>
        </motion.div>
      )}

      {/* Demo helper preset injectors bar */}
      <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-950 rounded-2xl p-4 sm:p-5 mb-8" id="preset-selector shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5 select-none">
          <Sparkles className="w-4 h-4 text-indigo-550 mr-1" /> Load Demonstration CSV / TSV Presets
        </h3>
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => loadPresetData('sales')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-550/10 hover:bg-indigo-555/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Sales Data (Comma Separated CSV)
          </button>
          <button
            onClick={() => loadPresetData('contacts')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-550/10 hover:bg-emerald-555/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> User Accounts (Tab Separated TSV)
          </button>
          <button
            onClick={() => loadPresetData('devices')}
            className="px-3.5 py-1.5 text-xs font-semibold bg-amber-550/10 hover:bg-amber-555/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Device Logs (Semicolon Delimited)
          </button>
        </div>
      </div>

      {/* Core Split Workbenches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* LEFT COLUMN PANEL: Data input area & parameters configurations (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6" id="dataset-input-panel">
          
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/45 dark:bg-slate-950 p-5 sm:p-6 rounded-3xl shadow-sm">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 flex items-center gap-1.5">
                <Table className="w-4 h-4 text-indigo-550" /> Tabular Dataset Input
              </h3>
              {rawInput && (
                <button
                  onClick={handleClearInput}
                  className="text-slate-400 hover:text-rose-550 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Clear raw input dataset"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Data
                </button>
              )}
            </div>

            {/* Input Delimiter configurations row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                  Input Delimiter
                </label>
                <select
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="w-full text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-550 outline-none transition-all cursor-pointer"
                >
                  <option value="auto">Auto-Detect Delimiter</option>
                  <option value=",">Comma ( , )</option>
                  <option value="\t">Tab ( \t )</option>
                  <option value=";">Semicolon ( ; )</option>
                  <option value="|">Pipe ( | )</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
                  Headers Row
                </label>
                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setHasHeaders(true)}
                    className={`flex-1 py-1.5 rounded-lg text-center font-bold tracking-tight transition cursor-pointer ${hasHeaders ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-805'}`}
                  >
                    CSV Has Headers
                  </button>
                  <button
                    onClick={() => setHasHeaders(false)}
                    className={`flex-1 py-1.5 rounded-lg text-center font-bold tracking-tight transition cursor-pointer ${!hasHeaders ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-805'}`}
                  >
                    No Headers Row
                  </button>
                </div>
              </div>
            </div>

            {/* Textarea Entry block */}
            <div className="relative">
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Paste your CSV, TSV, or custom delimited dataset text here..."
                className="w-full h-80 p-4 border border-slate-250 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950/45 text-slate-904 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-550 transition-all outline-none resize-none leading-relaxed"
                id="csv-entry-textarea"
              />
              {!rawInput && (
                <div className="absolute inset-x-4 top-16 pointer-events-none text-center py-8">
                  <FileText className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                  <p className="text-xs text-slate-400 dark:text-slate-550 max-w-sm mx-auto leading-normal">
                    Drag/paste structured plain-text database content, or click any of our demonstration presets listed above to instant test layouts!
                  </p>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mt-4 p-4 border border-rose-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/10 rounded-2xl flex items-start gap-2.5">
                <X className="w-4 h-4 text-rose-550 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-600 dark:text-rose-455 font-semibold leading-normal">
                  {errorMessage}
                </div>
              </div>
            )}

            {rawInput && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(rawInput, setCopiedRaw)}
                  className="flex-1 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-705 dark:text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer animate"
                >
                  {copiedRaw ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-550 animate-pulse" /> Copied Input Text!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-505" /> Copy Input Content
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

          {/* REALTIME DATASET METRICS OR STATISTICS CARD */}
          {parsedGrid.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 p-6 rounded-3xl shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-550 mb-4 flex items-center gap-1.5">
                <LineChart className="w-4 h-4 text-emerald-555" /> Real-Time Database Metrics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-955/10 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Total Rows</span>
                  <span className="font-mono text-xl font-semibold text-slate-855 dark:text-white flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-indigo-550" /> {stats.totalRows}
                  </span>
                </div>

                <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-955/10 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Total Columns</span>
                  <span className="font-mono text-xl font-semibold text-slate-855 dark:text-white flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-550" /> {stats.totalColumns}
                  </span>
                </div>

                <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-955/10 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Empty Cells</span>
                  <span className="font-mono text-xl font-semibold text-slate-855 dark:text-white">
                    {stats.emptyCells > 0 ? (
                      <span className="text-amber-500 font-bold">{stats.emptyCells} Empty</span>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400">0 Cells</span>
                    )}
                  </span>
                </div>

                <div className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/30 dark:bg-slate-955/10 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-1">Unique Values</span>
                  <span className="font-mono text-xl font-semibold text-slate-855 dark:text-white text-emerald-600 dark:text-emerald-400">
                    {stats.uniqueValues} unique
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Informational client notice card */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-950">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2.5 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-550" /> Privacy & Local Sandbox
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Unlike typical CSV-to-JSON or sitemap extractors which route structured lists to cloud endpoints, TextToolkitHub processes all rows inside local browser-native memory space. No dataset arrays or records are ever saved or transmitted.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN PANEL: Preview Grid, Column Filter & Target conversion outputs (7 cols) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6" id="dataset-output-panel">
          
          {/* CONTROL BAR: SEARCH, CLEANERS, FILTERS */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pr-5 pl-5 pt-4 pb-4 rounded-3xl shadow-xs flex flex-col gap-4" id="utility-grid-controls">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Query records search (realtime row matching)..."
                  className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-205 dark:border-slate-800 text-xs rounded-xl pl-9 pr-4 py-2.5 outline-none focus:ring-1 focus:ring-indigo-550 focus:border-indigo-550 transition-all text-slate-800 dark:text-slate-150"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-650 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {sortConfig && (
                <button
                  onClick={handleClearSort}
                  className="px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 transition cursor-pointer self-start sm:self-auto"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-indigo-500" /> Default Order
                </button>
              )}
            </div>

            {/* Checkbox Operations Row toggles */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-100 dark:border-slate-800/60 pt-3.5 text-xs text-slate-550 dark:text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={filterEmptyRows}
                  onChange={(e) => setFilterEmptyRows(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-550 accent-indigo-550 cursor-pointer w-4 h-4"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Filter Empty Rows</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  checked={removeDuplicateRows}
                  onChange={(e) => setRemoveDuplicateRows(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-550 accent-indigo-550 cursor-pointer w-4 h-4"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">Remove Duplicates ({stats.totalRows - processedData.rows.length} duplicate rows)</span>
              </label>
            </div>

          </div>

          {/* spreadsheet style interactive table view */}
          {parsedGrid.length > 0 && (
            <div className="border border-slate-250 dark:border-slate-800/80 bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-xs">
              
              <div className="bg-slate-100/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Table className="w-4 h-4 text-indigo-550" />
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Spreadsheet-Style Grid Preview ({processedData.rows.length} rows loaded)</span>
                </div>
              </div>

              {/* Spread-sheet data rendering container */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-450 dark:text-slate-400 select-none">
                      <th className="py-3 px-4 border-r border-slate-200 dark:border-slate-800/80 w-12 text-center text-[10px] uppercase font-bold text-slate-400">
                        No.
                      </th>
                      {processedData.headers.map((hdr, hIdx) => {
                        const isSorted = sortConfig?.colIndex === hIdx;
                        const direction = isSorted ? sortConfig.direction : '';
                        return (
                          <th 
                            key={hIdx} 
                            className="py-3 px-4 border-r border-slate-200 dark:border-slate-800/80 last:border-r-0 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold tracking-tight text-slate-700 dark:text-slate-300 truncate max-w-[140px] block" title={hdr}>
                                {hdr || `Col ${hIdx + 1}`}
                              </span>
                              <button
                                onClick={() => handleTriggerSort(hIdx)}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition cursor-pointer"
                                title={`Sort by ${hdr || 'Column'}`}
                              >
                                <ArrowUpDown className={`w-3.5 h-3.5 ${isSorted ? 'text-indigo-550' : 'text-slate-400'}`} />
                              </button>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td 
                          colSpan={processedData.headers.length + 1} 
                          className="py-12 text-center text-slate-450 dark:text-slate-500 italic font-mono"
                        >
                          No active cells match original search criteria query...
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((row, rIdx) => {
                        const absoluteIndex = (currentPage - 1) * rowsPerPage + rIdx + 1;
                        return (
                          <tr 
                            key={rIdx} 
                            className="border-b border-slate-100 dark:border-slate-850 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/40 text-slate-800 dark:text-slate-300 font-mono text-[11px]"
                          >
                            <td className="py-2.5 px-4 text-center border-r border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/60 font-bold text-slate-400">
                              {absoluteIndex}
                            </td>
                            {processedData.headers.map((_, colIdx) => {
                              const cellValue = row[colIdx];
                              const isEmpty = cellValue === undefined || cellValue.trim() === '';
                              return (
                                <td 
                                  key={colIdx} 
                                  className={`py-2.5 px-4 border-r border-slate-100 dark:border-slate-850 last:border-r-0 truncate max-w-[180px] ${isEmpty ? 'bg-amber-500/[0.03] dark:bg-amber-500/[0.01]' : ''}`}
                                  title={cellValue}
                                >
                                  {isEmpty ? (
                                    <span className="text-slate-305 dark:text-slate-600 italic">empty</span>
                                  ) : (
                                    cellValue
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Data Prev Grid Pagination controls widget */}
              <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-5 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold">
                
                <div className="text-slate-450 dark:text-slate-500 flex items-center gap-1.5">
                  <span>Displaying rows:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 py-1 px-2 rounded-lg text-slate-800 dark:text-slate-300 font-bold"
                  >
                    <option value="5">5 Rows</option>
                    <option value="10">10 Rows</option>
                    <option value="25">25 Rows</option>
                    <option value="50">50 Rows</option>
                  </select>
                  <span>of {processedData.rows.length} matched records</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-1 px-2.5 bg-white hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-350 disabled:opacity-40 select-none cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-slate-500 font-bold font-mono">
                    Page {currentPage} of {totalPagesCount}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesCount))}
                    disabled={currentPage === totalPagesCount}
                    className="p-1 px-2.5 bg-white hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-600 dark:text-slate-350 disabled:opacity-40 select-none cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* COLUMN EXTRACTOR CONTROLLER BOARD */}
          {processedData.headers.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 rounded-3xl" id="column-extractor-hub">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 flex items-center gap-1.5 mb-1.5">
                    <Layers className="w-4 h-4 text-indigo-550" /> Select Target Columns to Project / Extract
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500">
                    Extract specific subsets of columns dynamically into your chosen formats. Keep desired headers checked.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSelectAllColumns}
                    className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-650 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Select All
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    onClick={handleDeselectAllColumns}
                    className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {/* Column check-box elements row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {processedData.headers.map((hdr, hIdx) => {
                  const isChecked = selectedColumns[hIdx] === true;
                  return (
                    <label 
                      key={hIdx}
                      className={`flex items-start gap-2 p-2.5 border rounded-xl cursor-pointer select-none transition-all ${isChecked ? 'bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-200 dark:border-indigo-900/60' : 'bg-slate-50/25 dark:bg-slate-950/20 border-slate-200 dark:border-slate-850 hover:bg-slate-100/50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleColumn(hIdx)}
                        className="rounded border-slate-305 text-indigo-650 focus:ring-indigo-550 accent-indigo-550 cursor-pointer w-4 h-4 shrink-0 mt-0.5"
                      />
                      <div className="text-xs leading-none">
                        <span className="block font-bold text-slate-705 dark:text-slate-200 truncate pr-1" title={hdr}>
                          {hdr || `Col ${hIdx + 1}`}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-505 block mt-1">
                          Index {hIdx + 1}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>

            </div>
          )}

          {/* DYNAMIC CONVERSION EXPORTER WORKBENCH */}
          <div className="border border-slate-250 dark:border-slate-800/80 bg-slate-50/20 dark:bg-slate-955/20 rounded-3xl overflow-hidden shadow-xs">
            
            <div className="bg-slate-100/55 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              
              <div className="flex items-center bg-slate-200 dark:bg-slate-900 p-0.5 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-400 overflow-x-auto max-w-full">
                <button
                  onClick={() => setTargetFormat('markdown')}
                  className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${targetFormat === 'markdown' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  MD Table
                </button>
                <button
                  onClick={() => setTargetFormat('json')}
                  className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${targetFormat === 'json' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  JSON Array
                </button>
                <button
                  onClick={() => setTargetFormat('sql')}
                  className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${targetFormat === 'sql' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  SQL Insert
                </button>
                <button
                  onClick={() => setTargetFormat('csv')}
                  className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${targetFormat === 'csv' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  CSV Format
                </button>
                <button
                  onClick={() => setTargetFormat('tsv')}
                  className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${targetFormat === 'tsv' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  TSV Format
                </button>
                <button
                  onClick={() => setTargetFormat('text')}
                  className={`px-3 py-1.5 rounded-lg transition shrink-0 cursor-pointer ${targetFormat === 'text' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-900'}`}
                >
                  Plain Text
                </button>
              </div>

              {/* download copy buttons */}
              {formattedOutput && (
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <button
                    onClick={handleDownloadOutput}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white transition cursor-pointer"
                    title={`Download extracted file`}
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => copyToClipboard(formattedOutput, setCopiedResult)}
                    className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-805 rounded-lg text-slate-500 hover:text-slate-850 transition flex items-center justify-center cursor-pointer"
                    title="Copy output format"
                  >
                    {copiedResult ? <Check className="w-4 h-4 text-emerald-500 animate-pulse" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}

            </div>

            {/* Config Sub Bars depending on chosen formats */}
            <div className="bg-white dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 px-5 py-2.5 flex flex-wrap items-center gap-4 text-[11px] font-semibold text-slate-500">
              {targetFormat === 'sql' && (
                <div className="flex items-center gap-2">
                  <span>SQL Table Target Name:</span>
                  <input
                    type="text"
                    value={sqlTableName}
                    onChange={(e) => setSqlTableName(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded py-1 px-2.5 font-mono text-[11px] text-slate-800 dark:text-white leading-none outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              {targetFormat === 'csv' && (
                <div className="flex items-center gap-2">
                  <span>Output CSV Delimiter:</span>
                  <select
                    value={outputDelimiter}
                    onChange={(e) => setOutputDelimiter(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded py-1 px-2 text-[11px]"
                  >
                    <option value=",">Comma ( , )</option>
                    <option value=";">Semicolon ( ; )</option>
                    <option value="|">Pipe ( | )</option>
                  </select>
                </div>
              )}

              <div className="ml-auto text-slate-400 font-mono text-[10px]">
                {formattedOutput.split('\n').length} lines • {formattedOutput.length} characters
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-slate-955/25 min-h-[190px] max-h-[500px] overflow-y-auto">
              {!formattedOutput ? (
                <div className="text-center py-12 text-slate-450 dark:text-slate-500 italic text-xs font-mono">
                  Loading sliced columns format output...
                </div>
              ) : (
                <pre className="font-mono text-xs text-slate-800 dark:text-slate-100 whitespace-pre-wrap break-all leading-normal">
                  {formattedOutput}
                </pre>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Accordion list details */}
      <div className="border border-slate-250 dark:border-slate-800/80 rounded-3xl bg-white dark:bg-slate-950 p-6 sm:p-8" id="faqs-accordion">
        <h3 className="text-lg font-bold font-sans text-slate-950 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-550" /> Structured FAQs & Guidelines
        </h3>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={faq.id} 
                className="border border-slate-100 dark:border-slate-850/60 rounded-2xl overflow-hidden transition-all bg-slate-50/10 dark:bg-slate-955/10"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-805 dark:text-slate-200 text-sm hover:text-indigo-650 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-850/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
