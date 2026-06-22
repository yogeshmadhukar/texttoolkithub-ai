import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  ArrowLeftRight,
  Copy,
  Check,
  Download,
  Trash2,
  FileCode,
  HelpCircle,
  Settings,
  AlertCircle,
  FileText
} from 'lucide-react';
import * as yaml from 'js-yaml';

interface YamlJsonConverterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type ConversionMode = 'YamlToJson' | 'JsonToYaml';

export default function YamlJsonConverterView({ onNavigateToTool, onNavigateHome }: YamlJsonConverterViewProps) {
  const [mode, setMode] = useState<ConversionMode>('YamlToJson');
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  
  // Customization Options
  const [indentationSize, setIndentationSize] = useState<2 | 4>(2);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // SEO parameters
  const seoTitle = "YAML to JSON Converter - Bidirectional Config Translator";
  const seoDescription = "Convert YAML text files to JSON objects or JSON back to clean YAML configurations 100% locally in your browser. Live validator and formatting options.";

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

    // Schema JSON-LD Injection
    const schemaContent = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is this YAML to JSON converter safe for enterprise API secrets?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, absolutely! All parsing, validation, and conversions are executed entirely inside your browser's local sandbox, ensuring zero server uploads or credential exposures."
          }
        },
        {
          "@type": "Question",
          "name": "Can I convert JSON back to YAML format?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, the tool is bidirectional. You can translate YAML text blocks to formatted JSON configurations and serialize JSON blocks back to clean, comment-safe YAML documents."
          }
        },
        {
          "@type": "Question",
          "name": "Which indentation rules are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We support customized indentation sizes including 2-space and 4-space styles, which is standard for Kubernetes manifests, docker-compose systems, and YAML files."
          }
        }
      ]
    };

    const scriptId = "yaml-json-json-ld";
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

  const runConvert = () => {
    if (!inputText.trim()) {
      setOutputText('');
      setParseError(null);
      return;
    }

    try {
      if (mode === 'YamlToJson') {
        // YAML -> JSON
        const parsed = yaml.load(inputText);
        if (parsed === undefined) {
          setOutputText('');
          setParseError('The input YAML returned undefined content.');
          return;
        }
        setOutputText(JSON.stringify(parsed, null, indentationSize));
      } else {
        // JSON -> YAML
        const parsedJson = JSON.parse(inputText);
        const generatedYaml = yaml.dump(parsedJson, {
          indent: indentationSize,
          noRefs: true,
          lineWidth: -1
        });
        setOutputText(generatedYaml);
      }
      setParseError(null);
    } catch (err: any) {
      setParseError(err.message || 'Syntax formatting error occurred during conversion.');
      setOutputText('');
    }
  };

  useEffect(() => {
    runConvert();
  }, [inputText, mode, indentationSize]);

  const handleCopyResult = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {}
  };

  const handleToggleMode = () => {
    const nextMode = mode === 'YamlToJson' ? 'JsonToYaml' : 'YamlToJson';
    setMode(nextMode);
    setInputText('');
    setOutputText('');
    setParseError(null);
  };

  const handleClearAll = () => {
    setInputText('');
    setOutputText('');
    setParseError(null);
  };

  const handleLoadSample = () => {
    if (mode === 'YamlToJson') {
      setInputText(
`server:
  port: 8080
  host: "0.0.0.0"
  enable_ssl: false
database:
  driver: "postgresql"
  pool: 15
  credentials:
    username: "admin_user"
    secret_key_ref: "PROD_SECRET"
features:
  - "background-workers"
  - "api-gateway"
  - "live-telemetry"
metadata:
  created_at: 2026-06-22T06:00:00Z`
      );
    } else {
      setInputText(
JSON.stringify({
  api: {
    version: "v1",
    base_url: "/api/v1",
    timeout_ms: 5000
  },
  cors: {
    allowed_origins: ["*", "https://example.com"],
    allow_credentials: true
  },
  rate_limiting: {
    enabled: true,
    max_requests_per_min: 120
  }
}, null, 2)
      );
    }
  };

  const handleDownloadFile = () => {
    if (!outputText) return;
    const extension = mode === 'YamlToJson' ? 'json' : 'yaml';
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `config_transformed.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const faqs = [
    {
      id: 1,
      question: "Why use YAML instead of JSON in deployment manifests?",
      answer: "YAML (YAML Ain't Markup Language) was designed to be highly readable for humans. It omits curly braces, brackets, and quotes, making configurations like Docker Compose files, Kubernetes manifests, and CI/CD pipelines cleaner to view and inspect than verbose JSON schemas."
    },
    {
      id: 2,
      question: "Is this tool multi-line block and comment safe?",
      answer: "Yes, our native js-yaml compiler handles YAML folds (>, |), safe single-quotes, anchors, array hierarchies, and native typed parsing seamlessly. Commented lines inside raw YAML inputs are processed reliably during runtime."
    },
    {
      id: 3,
      question: "Does my data get sent to a public server?",
      answer: "No. The parsing, conversion, and formatting processes occur fully sandbox-locally in your browser frame. Absolutely nothing is sent back to external servers or logged into secondary databases."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="yaml-json-root">
      {/* Header section */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          YAML ↔ JSON <span className="text-indigo-600 dark:text-indigo-400">Bidirectional Converter</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Instantly convert raw YAML strings into validated JSON strings and vice versa. Safe offline execution with custom tab indentation widths, copyable code layouts, and error validations.
        </p>
      </div>

      {/* Main Container */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Config Panel */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-700 pb-3">
            <Settings className="w-4 h-4 text-indigo-500" />
            Translation Settings
          </h3>

          <div className="space-y-5">
            {/* Conversion Path */}
            <div>
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Conversion Path</span>
              <button
                onClick={handleToggleMode}
                className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-100/80 dark:bg-slate-900/40 p-3 rounded-xl border border-indigo-100/50 dark:border-slate-700 font-bold text-xs text-indigo-600 dark:text-indigo-400 transition-colors"
              >
                <span>{mode === 'YamlToJson' ? 'YAML ➔ JSON Configuration' : 'JSON ➔ YAML Configuration'}</span>
                <ArrowLeftRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

            {/* Indentation selector */}
            <div>
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Format Indentation</span>
              <div className="flex gap-2">
                {[2, 4].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setIndentationSize(sz as any)}
                    className={`flex-grow py-2 rounded-lg text-xs font-bold font-mono border transition ${
                      indentationSize === sz 
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-200 dark:border-slate-750 bg-slate-50 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    {sz} Spaces
                  </button>
                ))}
              </div>
            </div>

            {/* Practical loader utils */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex gap-2">
              <button
                onClick={handleLoadSample}
                className="flex-grow flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-755 dark:hover:bg-slate-700 px-3 py-2 rounded-xl text-xs font-extrabold text-slate-700 dark:text-slate-200 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Load Sample
              </button>
              <button
                onClick={handleClearAll}
                className="flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 px-3.5 py-2 rounded-xl text-xs font-extrabold transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Key Workspaces */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Input Box */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 font-mono">
                {mode === 'YamlToJson' ? 'Source YAML Config' : 'Source JSON Payload'}
              </span>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-[360px] px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-mono text-xs leading-relaxed"
                placeholder={
                  mode === 'YamlToJson'
                    ? "Paste valid YAML content here...\n\nkey:\n  subkey: true\n  items:\n    - \"apple\"\n    - \"banana\""
                    : "Paste valid JSON content here...\n\n{\n  \"key\": {\n    \"subkey\": true,\n    \"items\": [\"apple\", \"banana\"]\n  }\n}"
                }
              />
            </div>

            {/* Output Box */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm relative flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                    {mode === 'YamlToJson' ? 'Compiled JSON Result' : 'Compiled YAML Result'}
                  </span>
                  <div className="flex gap-2">
                    {outputText && (
                      <>
                        <button
                          onClick={handleCopyResult}
                          className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {isCopied ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={handleDownloadFile}
                          className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline border-l border-slate-200 dark:border-slate-700 pl-2"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <textarea
                  value={outputText}
                  readOnly
                  className="w-full h-[328px] px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white font-mono text-xs leading-relaxed select-all"
                  placeholder="Output conversion result will generate here in real-time..."
                />
              </div>
            </div>
          </div>

          {/* Validation Parser Error */}
          {parseError && (
            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-2 text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold">{parseError}</div>
            </div>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-sans flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{faq.question}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
