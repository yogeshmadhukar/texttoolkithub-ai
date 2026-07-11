import React from 'react';

export const CsvGuideContent: React.FC = () => {
  return (
    <>
      <div className="bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-100/25 dark:border-indigo-950/25 p-6 rounded-2xl mb-8 flex flex-col md:flex-row gap-6 items-center" id="introduction">
        <div className="space-y-2">
          <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">Data Engineering & Processing Standard</span>
          <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
            This comprehensive technical reference details the parsing pipelines, escape mechanics, and delimiter structures of Comma-Separated Values (CSV) under formal RFC 4180 specifications.
          </p>
        </div>
      </div>

      <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
        Despite the rise of structured, hierarchical formats like JSON, XML, and YAML, the humble Comma-Separated Values (CSV) file remains the absolute foundation of corporate data transfer and business analytics. Because of its flat tabular model, CSV files can be processed with extremely low CPU and RAM footprint, making them ideal for exporting millions of relational database rows, processing high-velocity bank logs, and loading datasets into Python, R, or Microsoft Excel. However, because CSV was used for decades before being officially standardized, implementing a robust, crash-free CSV parsing parser is highly complex.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="rfc-4180">Demystifying the RFC 4180 Specification</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        In 2005, the Internet Engineering Task Force (IETF) published **RFC 4180** in an effort to standardize the fragmented CSV implementations across different operating systems. This document outlines the formal grammar and parsing expectations for compliant CSV processors:
      </p>
      <ul className="list-disc pl-5 space-y-2 text-xs text-slate-650 dark:text-slate-350 my-4">
        <li><strong>Line Breaks:</strong> Each logical row must be terminated by a Carriage Return Line Feed (<code>CRLF</code> / <code>\r\n</code>). While many modern parsers tolerate standard Unix newline characters (<code>LF</code> / <code>\n</code>), compliant generators should output CRLF.</li>
        <li><strong>Header Row:</strong> The first line of the file may optionally contain column header labels matching the physical column structure of subsequent rows.</li>
        <li><strong>Column Balance:</strong> Each row in the file must contain exactly the same number of fields. A row with missing fields or trailing commas is considered syntactically invalid.</li>
        <li><strong>Delimiter Selection:</strong> Fields must be separated by a single delimiter, traditionally a comma (<code>,</code>). However, regional variants (especially in Europe) use semicolons (<code>;</code>) because they use commas as decimal indicators in numeric values.</li>
      </ul>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="escapement">The Mechanics of Escape Sequences and Text Qualifiers</h2>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350">
        The primary challenge in CSV parsing arises when a field's textual content contains characters that are also used as syntax symbols. For example, if a "Street Address" field contains a comma (e.g., <code>123 Main St, Suite 400</code>), a basic split-on-comma parser will misinterpret the comma as a new column, shifting all subsequent fields and corrupting the dataset.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        RFC 4180 solves this by defining **Text Qualifiers** (double quotes, <code>"</code>). Any field containing a comma, a semicolon, or a line break must be entirely enclosed in double quotes. This tells the parser to treat everything inside the quotes as literal text rather than structure delimiters.
      </p>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        But what happens if the textual value *itself* contains a double quote (e.g., a customer feedback column saying: <code>He said, "Excellent work!"</code>)? The RFC 4180 rule dictates that **internal double quotes must be escaped by doubling them**:
      </p>
      <div className="bg-slate-50 dark:bg-[#0c1019] p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 font-mono text-xs text-indigo-650 dark:text-indigo-400 my-4 whitespace-pre-wrap">
{`"ID","Name","Comments"
"101","Jane Doe","She said, ""Excellent work!"""
"102","John Smith","12, Market Street, London"
"103","Bob Johnson","Line 1
Line 2 with active line break inside field"`}
      </div>
      <p className="leading-relaxed text-slate-650 dark:text-slate-350 mt-3">
        Properly processing nested quotes and multiline fields requires stateful parser engines (like PapaParse or our native client-side parser) that scan characters sequentially rather than using a simple <code>string.split(",")</code> statement. Our dedicated <a href="/tools/csv-formatter" className="text-indigo-650 dark:text-indigo-400 font-semibold hover:underline">CSV Formatter &amp; Column Extractor</a> processes complex text-qualified CSVs locally, allowing you to filter, re-arrange, and export clean, standardized CSV files securely.
      </p>

      <h2 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white mt-10 mb-4 font-sans border-b border-slate-100 dark:border-slate-850 pb-2" id="faqs">Frequently Asked Questions (FAQ)</h2>
      <div className="space-y-4 my-6">
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: What is CSV Injection and how can I prevent it?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: CSV Injection (or Formula Injection) happens when a field starts with characters like <code>=</code>, <code>+</code>, <code>-</code>, or <code>@</code>. When a business user opens the CSV in Excel, the spreadsheet interprets the text as an active formula (e.g., <code>=CMD|' /C calc'!A1</code>) and executes malicious code. To prevent this, always sanitize or prepend a single apostrophe (<code>'</code>) to any untrusted string starting with active operators.
          </p>
        </div>
        <div className="p-4 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">Q: Why do some CSV files show strange characters when opened in Excel?</h4>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed">
            A: This is usually caused by character encoding mismatches. While modern applications save CSV files in UTF-8 encoding, legacy Excel versions default to system local encodings (like ANSI or Windows-1252). To force Excel to read a CSV in UTF-8, you can prepend a **Byte Order Mark (BOM)**—specifically the hex bytes <code>0xEF, 0xBB, 0xBF</code>—to the very start of the file stream.
          </p>
        </div>
      </div>
    </>
  );
};
