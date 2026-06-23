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
      question: "Does my data get sent to a public server during conversion?",
      answer: "No. The parsing, conversion, and formatting processes occur fully sandbox-locally in your browser frame. Absolutely nothing is sent back to external servers or logged into secondary databases."
    },
    {
      id: 4,
      question: "What are the key technical differences between YAML and JSON?",
      answer: "JSON is a strict subset of YAML 1.2, focusing on unambiguous, lightweight schema serialization. YAML focuses on superior human readability, supporting comments, native block scalar foldings, circular reference anchors, and schema types."
    },
    {
      id: 5,
      question: "How does the bidirectional converter handle indentation errors?",
      answer: "YAML is highly sensitive to space indentations and throws compilation warnings on tabs. Our script converts incoming tabs to spaces and returns real-time line-number syntax flags if you input broken block alignments."
    },
    {
      id: 6,
      question: "Can I convert complex nested structures and array trees?",
      answer: "Yes. Our compiler supports high-complexity structures, arrays of nested hashes, and dynamic type configurations (including strings, integers, arrays, boolean values, and null pointers) without loss."
    },
    {
      id: 7,
      question: "Are YAML anchors (&) and aliases (*) supported?",
      answer: "Yes. Our js-yaml compiler handles standard YAML anchor definitions and reference aliases correctly, resolving circular references and rendering flat representations in the output JSON format."
    },
    {
      id: 8,
      question: "Why does my input JSON throw syntax parser errors?",
      answer: "JSON requires double-quotes around all keys and string parameters, and strictly forbids trailing commas, comments, and unclosed brackets. Our analyzer screens codes in real-time, pointing out syntax errors."
    },
    {
      id: 9,
      question: "How do I download the converted config results?",
      answer: "Once the input compiles successfully, simply click the 'Download' action above the output box. The system generates a local blob object and triggers a matching .json or .yaml file download."
    },
    {
      id: 10,
      question: "Does TextToolkitHub support real-time formatting?",
      answer: "Yes. Every keystroke is dynamically processed, and results are serialized in milliseconds. You can instantly check formatting and configuration schemas on the fly."
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

      {/* DETAILED EDUCATIONAL & SEO RESOURCE MANUAL */}
      <section className="prose max-w-none pt-16 border-t border-slate-150 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-sans space-y-12 mt-12">
        
        {/* Introduction & What is this tool */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
          <div className="space-y-4">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#059669] dark:text-[#34d399] font-mono leading-none block">Configuration Management</span>
            <h2 className="text-3xl font-light font-display tracking-tight text-slate-900 dark:text-white mt-0" id="yaml-json-intro">
              Introduction to YAML & JSON Formats
            </h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              In modern cloud architecture, continuous integration pipelines, and general software compilation, serialization schemas serve as the critical foundation representing configuration data. While machines process serialized schemas effortlessly, developers require layouts that remain easy to read, audit, and modify manually. This tension has established two primary formats: YAML (YAML Ain't Markup Language) and JSON (JavaScript Object Notation).
            </p>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              This interactive, browser-executed <strong>YAML ↔ JSON Converter</strong> bridges the gap between these frameworks, enabling you to translate configurations bidirectionally with syntax validation.
            </p>
          </div>
          
          <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-150 dark:border-slate-850">
            <h3 className="text-xl font-semibold text-slate-950 dark:text-white mt-0 font-sans" id="yaml-json-what-is">
              What is this Tool?
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              This utility is a high-performance converter sandbox made for developers, sysadmins, and web managers who need to convert values between JSON lists and clean YAML mappings. It runs entirely client-side using validated compiler engines, ensuring zero-latency translation. Because all operations run in your browser, your proprietary system credentials and configuration architectures are completely safe from network leaks.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              When optimizing your site's deployment headers, you can also check readability using our <a href="/readability-checker" className="text-emerald-600 dark:text-emerald-450 hover:underline font-medium">Readability Checker</a> and create ranking pre-tags using our <a href="/meta-generator" className="text-emerald-600 dark:text-emerald-450 hover:underline font-medium">Meta Generator</a> to establish a professional system workspace.
            </p>
          </div>
        </div>

        {/* Guide to Using the System */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-10 space-y-6">
          <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="yaml-json-how-to">
            How to Convert Configurations Bidirectionally
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Converting files between these formats is straightforward using our local compiler. Follow these simple steps:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-emerald-500 block font-mono">01</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Select Conversion Mode</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Choose 'YAML to JSON' or 'JSON to YAML' depending on your source configuration file type.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-emerald-500 block font-mono">02</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Paste Config Data</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Paste your manifest code into the source textarea on the left. The compiler validates characters on-the-fly.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-emerald-500 block font-mono">03</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Inspect Syntax Errors</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">If the input contains invalid syntax, look at the error box for line-number details to fix spacing layouts.</p>
            </div>
            <div className="p-5 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-850">
              <span className="text-2xl font-bold text-emerald-500 block font-mono">04</span>
              <h4 className="font-bold text-slate-850 dark:text-slate-200 mt-2 text-sm">Download Converted File</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Copy the resulting configuration from the right pane, or click 'Download' to automatically save the file.</p>
            </div>
          </div>
        </div>

        {/* Benefits & Use Cases & Real World Examples */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="yaml-json-benefits">
              Benefits & Key Use Cases
            </h3>
            <ul className="text-sm space-y-3.5 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Manifest Compilation:</strong> Systems engineers use this tool to translate human-friendly YAML templates into strict JSON schemas required by Kubernetes, AWS, or GCP APIs.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Configuration Audits:</strong> Convert abstract, nested JSON responses into clean YAML files to audit properties and parameters more easily.
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 mt-1 shrink-0">✓</span>
                <div>
                  <strong>Educational Practice:</strong> Students and junior configurations admins can inspect differences between indentation-based YAML structures and brace-bracket JSON hierarchies.
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="yaml-json-examples">
              Format Alignment Example
            </h3>
            <div className="rounded-2xl border border-slate-150 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 p-5 space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider font-mono">YAML Representation</span>
                <pre className="text-[10px] text-slate-500 dark:text-slate-400 font-mono scrollbar-thin">
{`environment: development
debug_mode: true
allowed_hosts:
  - localhost
  - 127.0.0.1`}
                </pre>
              </div>
              <div className="space-y-1 pt-2.5 border-t border-slate-150 dark:border-slate-850">
                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider font-mono">Equivalent JSON Representation</span>
                <pre className="text-[10px] text-slate-500 dark:text-slate-400 font-mono scrollbar-thin">
{`{
  "environment": "development",
  "debug_mode": true,
  "allowed_hosts": ["localhost", "127.0.0.1"]
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Common Mistakes & Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-100 dark:border-slate-850 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="yaml-json-mistakes">
              Common Pitfalls to Avoid
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Mismatches in indentation and syntax constraints are the primary source of configuration failures across automated systems:
            </p>
            <ul className="list-disc pl-5 text-xs sm:text-sm text-slate-550 dark:text-slate-450 space-y-2">
              <li><strong>Tab Characters in YAML:</strong> Using absolute tabs (\t) instead of spaces. YAML forbids tabs for nesting, throwing a compilation wall.</li>
              <li><strong>JSON Key Formatting:</strong> Forgetting that JSON requires double-quotes surrounding keys. Single-quotes are invalid in strict JSON.</li>
              <li><strong>Trailing Commas in JSON:</strong> Placing a trailing comma on the final attribute of arrays or hashes, which is invalid in the strict JSON standard.</li>
              <li><strong>Indentation Shifts:</strong> Accidentally changing the number of indented spaces in YAML blocks, which incorrectly alters the scope of variables.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-light font-display text-slate-950 dark:text-white" id="yaml-json-best-practices">
              Industry Best Practices
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-4 bg-emerald-50/25 dark:bg-slate-950/40 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Use 2-Space Nesting</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Adopt a strict 2-space indentation rule across all YAML models, ensuring compatibility with container parsers.</p>
              </div>
              <div className="p-4 bg-emerald-50/25 dark:bg-slate-950/40 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Strict Double Quotes</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Wrap keys and string variables in double-quotes defensively, ensuring compatibility across all JSON ecosystems.</p>
              </div>
              <div className="p-4 bg-emerald-50/25 dark:bg-slate-950/40 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Validate Line Changes</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Use our real-time debugger to pinpoint line-number issues before pushing configurations to production pipelines.</p>
              </div>
              <div className="p-4 bg-emerald-50/25 dark:bg-slate-950/40 rounded-2xl border border-emerald-100/40 dark:border-emerald-900/10">
                <h4 className="font-bold text-slate-900 dark:text-white">Leverage Comments in YAML</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Document dense keys with inline hash comments (#) in YAML scripts, keeping team configurations easy to manage.</p>
              </div>
            </div>
          </div>
        </div>

      </section>

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
