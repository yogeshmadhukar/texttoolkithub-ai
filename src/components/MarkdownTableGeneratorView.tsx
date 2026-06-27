import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  Table, 
  Plus, 
  Minus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';

interface MarkdownTableGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type Alignment = 'left' | 'center' | 'right';

export default function MarkdownTableGeneratorView({ onNavigateToTool, onNavigateHome }: MarkdownTableGeneratorViewProps) {
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  const [alignments, setAlignments] = useState<Alignment[]>(['left', 'left', 'left']);
  const [grid, setGrid] = useState<string[][]>([
    ['Header 1', 'Header 2', 'Header 3'],
    ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
    ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
  ]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'markdown' | 'html' | 'csv'>('markdown');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const seoTitle = "Markdown Table Generator Online | Free Table Creator";
  const seoDescription = "Create beautifully aligned Markdown, HTML, and CSV tables instantly with our visual, interactive grid creator tool. Free & client-side offline.";

  const faqs = [
    {
      id: 1,
      question: "What is a Markdown Table Generator?",
      answer: "It is an interactive visual creator tool that allows you to configure rows, columns, alignment, and cell content in a simple spreadsheet-like grid, then exports the structure immediately as optimized GitHub-Flavored Markdown tables."
    },
    {
      id: 2,
      question: "How do I align text columns in Markdown tables?",
      answer: "In Markdown, column alignment is controlled by colons within the separator row. Our generator supports Left align (':---'), Center align (':---:'), and Right align ('---:'). You can set alignment easily by clicking the alignment buttons above each column."
    },
    {
      id: 3,
      question: "Can I copy the tables as HTML or CSV too?",
      answer: "Yes! Our generator is a versatile multi-exporter. You can toggle between Markdown format, clean HTML table tags, or standard raw CSV spreadsheet format and download or copy them instantly."
    },
    {
      id: 4,
      question: "Is my input data safe and private?",
      answer: "Yes, 100%. Like all utilities on TextToolkitHub, all editing actions are calculated strictly in your local browser sandbox memory using local JavaScript. No information is ever submitted or stored on external servers."
    }
  ];

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

    const scriptId = "markdown-table-json-ld";
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

  // Update rows and columns count
  const handleCellChange = (r: number, c: number, value: string) => {
    const updatedGrid = grid.map((row, ri) => 
      ri === r ? row.map((cell, ci) => ci === c ? value : cell) : row
    );
    setGrid(updatedGrid);
  };

  const handleAddRow = () => {
    const newRow = Array(cols).fill('');
    setGrid([...grid, newRow]);
    setRows(rows + 1);
  };

  const handleRemoveRow = () => {
    if (rows <= 2) return;
    setGrid(grid.slice(0, -1));
    setRows(rows - 1);
  };

  const handleAddCol = () => {
    const updatedGrid = grid.map(row => [...row, '']);
    setGrid(updatedGrid);
    setAlignments([...alignments, 'left']);
    setCols(cols + 1);
  };

  const handleRemoveCol = () => {
    if (cols <= 1) return;
    const updatedGrid = grid.map(row => row.slice(0, -1));
    setGrid(updatedGrid);
    setAlignments(alignments.slice(0, -1));
    setCols(cols - 1);
  };

  const toggleAlignment = (colIndex: number, align: Alignment) => {
    const updated = [...alignments];
    updated[colIndex] = align;
    setAlignments(updated);
  };

  const handleReset = () => {
    setRows(3);
    setCols(3);
    setAlignments(['left', 'left', 'left']);
    setGrid([
      ['Header 1', 'Header 2', 'Header 3'],
      ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
      ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3'],
    ]);
  };

  // Code generation helpers
  const getMarkdownOutput = (): string => {
    if (grid.length === 0 || cols === 0) return '';
    
    // Find max widths for pretty printing
    const colWidths = Array(cols).fill(0);
    grid.forEach(row => {
      row.forEach((cell, colIndex) => {
        colWidths[colIndex] = Math.max(colWidths[colIndex], cell.length);
      });
    });

    const formatCell = (text: string, width: number, alignment: Alignment) => {
      const padded = text.padEnd(width, ' ');
      if (alignment === 'right') {
        return text.padStart(width, ' ');
      }
      if (alignment === 'center') {
        const totalPadding = width - text.length;
        const leftPadding = Math.floor(totalPadding / 2);
        return ' '.repeat(leftPadding) + text + ' '.repeat(totalPadding - leftPadding);
      }
      return padded;
    };

    // Header row
    const headers = grid[0].map((cell, idx) => formatCell(cell, colWidths[idx], alignments[idx]));
    const headerLine = '| ' + headers.join(' | ') + ' |';

    // Alignment separator row
    const separators = colWidths.map((width, idx) => {
      const align = alignments[idx];
      const minDash = Math.max(3, width);
      if (align === 'center') {
        return ':' + '-'.repeat(minDash - 2) + ':';
      }
      if (align === 'right') {
        return '-'.repeat(minDash - 1) + ':';
      }
      return ':' + '-'.repeat(minDash - 1);
    });
    const sepLine = '| ' + separators.join(' | ') + ' |';

    // Data rows
    const dataLines = grid.slice(1).map(row => {
      const formattedCells = row.map((cell, idx) => formatCell(cell, colWidths[idx], alignments[idx]));
      return '| ' + formattedCells.join(' | ') + ' |';
    });

    return [headerLine, sepLine, ...dataLines].join('\n');
  };

  const getHtmlOutput = (): string => {
    if (grid.length === 0 || cols === 0) return '';
    const lines: string[] = [];
    lines.push('<table border="1" style="border-collapse: collapse; width: 100%;">');
    
    // Header
    lines.push('  <thead>');
    lines.push('    <tr>');
    grid[0].forEach((cell, colIdx) => {
      const align = alignments[colIdx];
      lines.push(`      <th style="text-align: ${align}; padding: 8px;">${cell || '&nbsp;'}</th>`);
    });
    lines.push('    </tr>');
    lines.push('  </thead>');

    // Body
    if (grid.length > 1) {
      lines.push('  <tbody>');
      grid.slice(1).forEach(row => {
        lines.push('    <tr>');
        row.forEach((cell, colIdx) => {
          const align = alignments[colIdx];
          lines.push(`      <td style="text-align: ${align}; padding: 8px;">${cell || '&nbsp;'}</td>`);
        });
        lines.push('    </tr>');
      });
      lines.push('  </tbody>');
    }
    
    lines.push('</table>');
    return lines.join('\n');
  };

  const getCsvOutput = (): string => {
    return grid.map(row => 
      row.map(cell => {
        const sanitized = cell.replace(/"/g, '""');
        return sanitized.includes(',') || sanitized.includes('"') || sanitized.includes('\n') 
          ? `"${sanitized}"` 
          : sanitized;
      }).join(',')
    ).join('\n');
  };

  const getOutputText = (): string => {
    if (activeTab === 'html') return getHtmlOutput();
    if (activeTab === 'csv') return getCsvOutput();
    return getMarkdownOutput();
  };

  const handleCopy = () => {
    const text = getOutputText();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const text = getOutputText();
    if (!text) return;
    const extension = activeTab === 'markdown' ? 'md' : activeTab === 'html' ? 'html' : 'csv';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `table.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/markdown-table-generator').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="markdown-table-generator-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button 
            onClick={onNavigateHome}
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            id="back-to-home-btn"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Directory</span>
          </button>
          
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>Tools</span>
            <span className="text-slate-300 dark:text-slate-700">/</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Markdown Table Generator</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl mb-4 border border-indigo-100 dark:border-indigo-900/30">
            <Table className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-900 dark:text-white tracking-tight" id="tool-title">
            Visual <span className="font-semibold text-indigo-600 dark:text-indigo-400">Table Generator</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Create beautifully styled Markdown, HTML, and CSV tables with an interactive spreadsheet grid. Fully offline and instant.
          </p>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Controls and Interactive Visual Table */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            
            {/* Table Configuration Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-100 dark:border-slate-850">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Visual Spreadsheet Grid</h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-150 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Rows:</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-100">{rows}</span>
                  <button 
                    onClick={handleAddRow}
                    className="ml-2 p-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Add Row"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={handleRemoveRow}
                    className="p-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Remove Row"
                    disabled={rows <= 2}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-150 dark:border-slate-800 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Cols:</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-100">{cols}</span>
                  <button 
                    onClick={handleAddCol}
                    className="ml-2 p-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Add Column"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={handleRemoveCol}
                    className="p-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
                    title="Remove Column"
                    disabled={cols <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  onClick={handleReset}
                  className="p-1.5 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl transition-colors border border-rose-100 dark:border-rose-900/30 cursor-pointer"
                  title="Reset Grid"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Editor Table Container */}
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50 p-3 max-h-[480px] overflow-y-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="p-2 w-8 text-[10px] font-mono font-bold text-slate-400 select-none">#</th>
                    {Array(cols).fill(0).map((_, colIdx) => (
                      <th key={`head-${colIdx}`} className="p-2 min-w-[120px] text-left">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1 justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5">
                            <button
                              onClick={() => toggleAlignment(colIdx, 'left')}
                              className={`p-1 rounded cursor-pointer ${alignments[colIdx] === 'left' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
                              title="Align Left"
                            >
                              <AlignLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleAlignment(colIdx, 'center')}
                              className={`p-1 rounded cursor-pointer ${alignments[colIdx] === 'center' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
                              title="Align Center"
                            >
                              <AlignCenter className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleAlignment(colIdx, 'right')}
                              className={`p-1 rounded cursor-pointer ${alignments[colIdx] === 'right' ? 'bg-indigo-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500'}`}
                              title="Align Right"
                            >
                              <AlignRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.map((row, rowIdx) => (
                    <tr 
                      key={`row-${rowIdx}`} 
                      className={`border-b border-slate-150 dark:border-slate-800/80 last:border-0 ${rowIdx === 0 ? 'bg-slate-100/60 dark:bg-slate-900' : ''}`}
                    >
                      <td className="p-2 text-center text-xs font-mono font-bold text-slate-400 bg-slate-100/20 dark:bg-slate-950/20 select-none">
                        {rowIdx === 0 ? 'H' : rowIdx}
                      </td>
                      {row.map((cell, colIdx) => (
                        <td key={`cell-${rowIdx}-${colIdx}`} className="p-1">
                          <input
                            type="text"
                            value={cell}
                            onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                            className={`w-full px-2.5 py-1.5 text-xs rounded-lg border bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-shadow ${
                              rowIdx === 0 
                                ? 'font-bold border-indigo-200/50 dark:border-indigo-900/30' 
                                : 'border-slate-200 dark:border-slate-800'
                            }`}
                            placeholder={rowIdx === 0 ? `Header ${colIdx + 1}` : `Row ${rowIdx} Col ${colIdx + 1}`}
                            style={{ textAlign: alignments[colIdx] }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-slate-400 flex items-center gap-1.5 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-850">
              <span className="text-indigo-500 font-bold font-mono">Tip:</span>
              <span>Double-click or edit the cells inside the table to immediately sync with output formats on the right pane. The alignment settings will format cells automatically.</span>
            </div>
          </div>

          {/* Code output preview block */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800">
                <button
                  onClick={() => setActiveTab('markdown')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'markdown' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  Markdown
                </button>
                <button
                  onClick={() => setActiveTab('html')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'html' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  HTML
                </button>
                <button
                  onClick={() => setActiveTab('csv')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${activeTab === 'csv' ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                  CSV
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopy}
                  className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-medium ${
                    copied 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-400' 
                      : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                  title="Copy Table Code"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="p-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl transition-all flex items-center justify-center cursor-pointer"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Output code syntax viewport */}
            <div className="relative">
              <pre className="w-full h-[380px] p-4 bg-slate-900 text-slate-100 rounded-2xl overflow-auto font-mono text-[11px] leading-relaxed border border-slate-800 shadow-inner">
                <code>{getOutputText() || '// Add content to the left spreadsheet to generate beautiful output!'}</code>
              </pre>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/20">
              <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">Live Structure Stats</h4>
              <div className="grid grid-cols-3 gap-3 text-center mt-2">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500">ROWS</span>
                  <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300">{rows}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500">COLUMNS</span>
                  <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300">{cols}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-100 dark:border-slate-850">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500">CELLS</span>
                  <span className="text-sm font-bold font-mono text-slate-700 dark:text-slate-300">{rows * cols}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informative description text segment */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <Table className="w-5 h-5 text-indigo-500" />
              Comprehensive Markdown Table Formatting Guide
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Markdown represents tabular information using lines separated by pipes (<code className="bg-slate-50 dark:bg-slate-850 px-1 py-0.5 rounded font-mono text-xs text-rose-500">|</code>) and headers separated by dashes. Our live editor formats this spacing beautifully, ensuring clean text alignments that align to the widest value of each column automatically. This keeps raw code visually legible.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              By exporting as pure semantic HTML tables, you can integrate formatted grids inside custom web newsletters, documentation hubs, or corporate mail clients directly.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
              Advanced CSV Alignment Matrix Options
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Comma-Separated Values (CSV) are widely used for bulk tabular data exchange. By structuring lists on this page, you can easily bridge text layouts to database imports, Excel sheets, and visual markdown documents seamlessly, saving significant manual labor.
            </p>
          </div>
        </section>

        {/* Frequently Asked Questions */}
        <div className="mt-16 pt-12 border-t border-slate-150 dark:border-slate-800" id="faq-section">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-light font-display text-slate-900 dark:text-white">
              Frequently Asked <span className="font-semibold text-indigo-600 dark:text-indigo-400">Questions</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 max-w-4xl">
            {faqs.map((faq) => (
              <div 
                key={faq.id}
                className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-150 dark:border-slate-800/80 overflow-hidden transition-all duration-200"
                id={`faq-item-${faq.id}`}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-5 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850 pt-3 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Section */}
        <div className="mt-20 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Related Text Tools</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {relatedTools.map(t => (
                <button
                  key={t.id}
                  onClick={() => onNavigateToTool(t.id)}
                  className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-800/80 transition-all cursor-pointer"
                >
                  <span>{t.title}</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-2xl shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </button>
        </div>

      </div>
    </div>
  );
}
