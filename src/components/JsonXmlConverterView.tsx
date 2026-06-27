import React, { useState, useEffect } from 'react';
import { TOOLS } from '../data.ts';
import { motion } from 'motion/react';
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight,
  Sparkles,
  Sliders,
  FileCode,
  FileText,
  AlertTriangle
} from 'lucide-react';

interface JsonXmlConverterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type Mode = 'json-to-xml' | 'xml-to-json';

export default function JsonXmlConverterView({ onNavigateToTool, onNavigateHome }: JsonXmlConverterViewProps) {
  const [mode, setMode] = useState<Mode>('json-to-xml');
  const [inputText, setInputText] = useState('{\n  "root": {\n    "platform": "TextToolkitHub",\n    "year": 2026,\n    "features": [\n      "Privacy First",\n      "Sub-millisecond Calculations",\n      "Elegant Design"\n    ]\n  }\n}');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const seoTitle = "JSON to XML & XML to JSON Converter Online | Free Tool";
  const seoDescription = "Convert JSON files to formatted XML sheets or decode XML tags back into structured JSON objects instantly with our free offline bidirectional converter.";

  const faqs = [
    {
      id: 1,
      question: "What is the JSON to XML / XML to JSON Converter?",
      answer: "It is a bidirectional data structure translator. It allows you to transform lightweight Javascript Object Notation (JSON) structures into Extensible Markup Language (XML) tags, and vice versa, preserving nesting hierarchies and key relations."
    },
    {
      id: 2,
      question: "How do arrays convert between XML and JSON?",
      answer: "JSON arrays are converted into repeated XML tags named after the array key or a generic child wrapper. When going from XML to JSON, identical consecutive nested tags are grouped into a consolidated JSON array."
    },
    {
      id: 3,
      question: "Is there any data sent to external servers during conversion?",
      answer: "No! True to the core ethos of TextToolkitHub, all parsing algorithms and structure validations run client-side right inside your browser window. Confidential development APIs or logs are fully secure."
    },
    {
      id: 4,
      question: "How does the XML to JSON parser check syntax issues?",
      answer: "We use browser-native DOMParser to validate XML layouts. If the tags are mismatched, missing closing brackets, or contain invalid attributes, the utility displays a diagnostic error line immediately."
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

    const scriptId = "json-xml-json-ld";
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

  // Helper: Converts JS Object to XML string
  const objToXml = (obj: any, indent = 2, pad = 0): string => {
    let xml = '';
    const spaces = ' '.repeat(pad);
    
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        
        if (Array.isArray(val)) {
          val.forEach(item => {
            if (typeof item === 'object') {
              xml += `${spaces}<${key}>\n${objToXml(item, indent, pad + indent)}${spaces}</${key}>\n`;
            } else {
              xml += `${spaces}<${key}>${item}</${key}>\n`;
            }
          });
        } else if (typeof val === 'object' && val !== null) {
          xml += `${spaces}<${key}>\n${objToXml(val, indent, pad + indent)}${spaces}</${key}>\n`;
        } else {
          xml += `${spaces}<${key}>${val}</${key}>\n`;
        }
      }
    }
    return xml;
  };

  // Helper: Converts XML Node to JS Object
  const xmlToObj = (node: Node): any => {
    // If it's a text node with no children
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue?.trim() || '';
    }

    const obj: any = {};
    const childNodes = node.childNodes;

    if (childNodes.length === 1 && childNodes[0].nodeType === Node.TEXT_NODE) {
      return childNodes[0].nodeValue?.trim() || '';
    }

    for (let i = 0; i < childNodes.length; i++) {
      const child = childNodes[i];
      if (child.nodeType === Node.ELEMENT_NODE) {
        const name = child.nodeName;
        const val = xmlToObj(child);

        if (obj[name] !== undefined) {
          if (!Array.isArray(obj[name])) {
            obj[name] = [obj[name]];
          }
          obj[name].push(val);
        } else {
          obj[name] = val;
        }
      }
    }
    return obj;
  };

  // Run Conversion
  useEffect(() => {
    setError(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    if (mode === 'json-to-xml') {
      try {
        const parsed = JSON.parse(inputText);
        let xmlResult = '<?xml version="1.0" encoding="UTF-8" ?>\n';
        xmlResult += objToXml(parsed, 2, 0);
        setOutputText(xmlResult.trim());
      } catch (err: any) {
        setError(`Malformed JSON syntax: ${err.message || 'Check braces, quotes, and trailing commas.'}`);
        setOutputText('');
      }
    } else {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(inputText, 'text/xml');
        
        const parserError = doc.querySelector('parsererror');
        if (parserError) {
          throw new Error(parserError.textContent || 'XML compilation warning');
        }

        const rootNode = doc.documentElement;
        const resultObj: any = {};
        resultObj[rootNode.nodeName] = xmlToObj(rootNode);
        
        setOutputText(JSON.stringify(resultObj, null, 2));
      } catch (err: any) {
        setError(`XML Parsing failed: ${err.message || 'Verify correct opening/closing element tag matches.'}`);
        setOutputText('');
      }
    }
  }, [inputText, mode]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    if (!outputText) return;
    const extension = mode === 'json-to-xml' ? 'xml' : 'json';
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleMode = () => {
    setMode(prev => prev === 'json-to-xml' ? 'xml-to-json' : 'json-to-xml');
    setInputText(outputText);
  };

  const handleLoadSample = () => {
    if (mode === 'json-to-xml') {
      setInputText('{\n  "company": {\n    "name": "Innovate Ltd",\n    "employees": [\n      { "id": 1, "name": "John" },\n      { "id": 2, "name": "Jane" }\n    ]\n  }\n}');
    } else {
      setInputText('<?xml version="1.0" encoding="UTF-8" ?>\n<company>\n  <name>Innovate Ltd</name>\n  <employee>\n    <id>1</id>\n    <name>John</name>\n  </employee>\n  <employee>\n    <id>2</id>\n    <name>Jane</name>\n  </employee>\n</company>');
    }
  };

  const relatedTools = TOOLS.filter(t => t.id !== 'tools/json-xml-converter').slice(0, 3);

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-900 transition-colors duration-200" id="json-xml-converter-page">
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
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">JSON to XML Converter</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex p-3.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-3xl mb-4 border border-indigo-100 dark:border-indigo-900/30">
            <RefreshCw className="w-8 h-8 animate-spin-slow" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-light font-display text-slate-900 dark:text-white tracking-tight" id="tool-title">
            JSON to XML <span className="font-semibold text-indigo-600 dark:text-indigo-400">Converter</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Convert structured JSON strings to clean nested XML sheets or parse XML trees back to standard JSON instantly offline.
          </p>
        </div>

        {/* Error Alert panel */}
        {error && (
          <div className="mb-6 max-w-5xl mx-auto bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800 dark:text-rose-300">
              <span className="font-bold">Syntax Diagnostic Error:</span>
              <p className="mt-0.5 leading-relaxed font-mono">{error}</p>
            </div>
          </div>
        )}

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-16">
          
          {/* Settings Sidebar */}
          <div className="lg:col-span-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-indigo-500" />
                  Format Options
                </h3>

                {/* Switch direction Button */}
                <button
                  onClick={handleToggleMode}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer mb-5 text-xs"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{mode === 'json-to-xml' ? 'JSON ➔ XML' : 'XML ➔ JSON'}</span>
                </button>
              </div>

              <div className="text-xs text-slate-400 leading-relaxed bg-indigo-50/25 dark:bg-indigo-950/20 p-3.5 rounded-2xl border border-indigo-100/40 dark:border-indigo-900/15">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Nesting Rule:</span>
                <p className="mt-1">
                  Arrays are compiled as repeated elements. Objects are recursively parsed into valid structured sub-nodes with proper semantic indentation.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-850 mt-6">
              <button
                onClick={handleLoadSample}
                className="w-full py-2 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Load Demo Sample
              </button>
            </div>
          </div>

          {/* Code Workspaces */}
          <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Input Panel */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-indigo-500" />
                    {mode === 'json-to-xml' ? 'Raw JSON Input' : 'Raw XML Input'}
                  </span>
                  <button
                    onClick={() => setInputText('')}
                    className="text-xs text-rose-500 hover:underline cursor-pointer"
                  >
                    Clear
                  </button>
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-[320px] p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder={mode === 'json-to-xml' ? 'Paste valid JSON structure here...' : 'Paste valid XML sheet here...'}
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 font-mono flex justify-between">
                <span>SIZE: {inputText.length} bytes</span>
              </div>
            </div>

            {/* Output Panel */}
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    {mode === 'json-to-xml' ? 'Formatted XML Output' : 'Formatted JSON Output'}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopy}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center gap-1 text-xs font-medium ${
                        copied 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30' 
                          : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleDownload}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 rounded-lg transition-all flex items-center justify-center cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <textarea
                  value={outputText}
                  readOnly
                  className="w-full h-[320px] p-4 bg-slate-900 text-slate-100 border border-slate-850 rounded-2xl font-mono text-xs leading-relaxed focus:outline-none"
                  placeholder="The formatted conversion output appears here..."
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-[10px] text-slate-400 font-mono flex justify-between">
                <span>SIZE: {outputText.length} bytes</span>
              </div>
            </div>

          </div>

        </div>

        {/* Informative description tags */}
        <section className="prose max-w-none pt-12 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-600 dark:text-slate-300">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <FileCode className="w-5 h-5 text-indigo-500" />
              Preserving Hierarchy Layouts and Arrays
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Transforming nested arrays and lists between JSON and XML tags is frequently required by software developers dealing with old SOAP APIs or modern REST APIs. This offline converter processes objects and compiles repeated blocks automatically.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-emerald-500" />
              100% Secure Client-Side Conversion
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Your API parameters, confidential configuration settings, or customer records are never transferred over network nodes. Everything runs locally in browser JS thread cache.
            </p>
          </div>
        </section>

        {/* FAQs */}
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

        {/* Related footer tools */}
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
