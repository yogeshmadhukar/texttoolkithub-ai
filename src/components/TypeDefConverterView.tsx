import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Copy,
  Check,
  Code2,
  Trash2,
  FileCode,
  FileJson,
  HelpCircle,
  Database,
  Terminal,
  Settings,
  AlertCircle
} from 'lucide-react';

interface TypeDefConverterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type OutputLanguage = 'typescript' | 'golang' | 'sql' | 'jsonschema';

export default function TypeDefConverterView({ onNavigateToTool, onNavigateHome }: TypeDefConverterViewProps) {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [outputLanguage, setOutputLanguage] = useState<OutputLanguage>('typescript');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  
  // Customization Options
  const [interfaceName, setInterfaceName] = useState<string>('RootObject');
  const [indentationSize, setIndentationSize] = useState<2 | 4>(2);
  const [optionalFields, setOptionalFields] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // SEO Metas
  const seoTitle = "JSON to TypeScript Go SQL Converter - Type Definition Generator";
  const seoDescription = "Convert JSON objects into TypeScript interfaces, Go structs, SQL CREATE TABLE scripts, and JSON Schema definitions 100% locally in your browser.";

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

    return () => {
      document.title = previousTitle;
      if (metaDescription) {
        metaDescription.setAttribute('content', previousDescription);
      }
    };
  }, []);

  // Utility to format indentation spaces
  const runIndent = (depth: number) => ' '.repeat(depth * indentationSize);

  // Helpers to format names
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
  const snakeToCamel = (str: string) => str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
  const toPascalCase = (str: string) => capitalize(snakeToCamel(str));

  // --- Generation Pipeline 1: TypeScript Interfaces ---
  const generateTypeScript = (obj: any, rootName: string): string => {
    const interfaces: string[] = [];

    const recurse = (currentObj: any, currentName: string): string => {
      if (currentObj === null) return 'any';
      if (Array.isArray(currentObj)) {
        if (currentObj.length === 0) return 'any[]';
        const itemType = recurse(currentObj[0], toPascalCase(currentName) + 'Item');
        return `${itemType}[]`;
      }
      if (typeof currentObj === 'object') {
        const interfaceKey = toPascalCase(currentName);
        let interfaceStr = `interface ${interfaceKey} {\n`;
        
        for (const key of Object.keys(currentObj)) {
          const val = currentObj[key];
          const typeStr = recurse(val, key);
          const opt = optionalFields ? '?' : '';
          interfaceStr += `${runIndent(1)}${key}${opt}: ${typeStr};\n`;
        }
        
        interfaceStr += '}';
        interfaces.push(interfaceStr);
        return interfaceKey;
      }
      return typeof currentObj; // string, number, boolean
    };

    const rootReturnedType = recurse(obj, rootName);
    
    // If root was primitive or simple array, wrap result gracefully
    if (typeof obj !== 'object' || obj === null) {
      return `type ${rootName} = ${rootReturnedType};`;
    }

    // Collect nested interfaces in order with root at the peak
    return interfaces.reverse().join('\n\n');
  };

  // --- Generation Pipeline 2: Go Structs (Golang) ---
  const generateGoStructs = (obj: any, rootName: string): string => {
    const structs: string[] = [];

    const recurse = (currentObj: any, currentName: string): string => {
      if (currentObj === null) return 'interface{}';
      if (Array.isArray(currentObj)) {
        if (currentObj.length === 0) return '[]interface{}';
        const itemType = recurse(currentObj[0], toPascalCase(currentName) + 'Item');
        return `[]${itemType}`;
      }
      if (typeof currentObj === 'object') {
        const structName = toPascalCase(currentName);
        let structStr = `type ${structName} struct {\n`;
        
        for (const key of Object.keys(currentObj)) {
          const val = currentObj[key];
          const goFieldName = toPascalCase(key);
          const typeStr = recurse(val, key);
          structStr += `${runIndent(1)}${goFieldName} ${typeStr} \`json:"${key}"\`\n`;
        }
        
        structStr += '}';
        structs.push(structStr);
        return structName;
      }
      
      // Math primitives mapping for Go
      if (typeof currentObj === 'number') {
        return Number.isInteger(currentObj) ? 'int' : 'float64';
      }
      if (typeof currentObj === 'boolean') {
        return 'bool';
      }
      return 'string';
    };

    const rootReturned = recurse(obj, rootName);
    if (typeof obj !== 'object' || obj === null) {
      return `type ${rootName} ${rootReturned}`;
    }

    return structs.reverse().join('\n\n');
  };

  // --- Generation Pipeline 3: SQL Tables Schema ---
  const generateSQLSchema = (obj: any, tableName: string): string => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return `-- Root elements must be JSON objects for SQL Table mappings`;
    }

    let sql = `CREATE TABLE ${tableName.toLowerCase()} (\n`;
    sql += `${runIndent(1)}id SERIAL PRIMARY KEY,\n`;

    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const val = obj[key];
      let sqlType = 'VARCHAR(255)';

      if (typeof val === 'number') {
        sqlType = Number.isInteger(val) ? 'INTEGER' : 'DECIMAL(10, 2)';
      } else if (typeof val === 'boolean') {
        sqlType = 'BOOLEAN';
      } else if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
        sqlType = 'JSONB';
      } else if (typeof val === 'string') {
        // Date Check
        if (!isNaN(Date.parse(val)) && val.length > 10) {
          sqlType = 'TIMESTAMP WITH TIME ZONE';
        } else if (val.length > 255) {
          sqlType = 'TEXT';
        }
      }

      sql += `${runIndent(1)}${key.toLowerCase()} ${sqlType}`;
      if (i < keys.length - 1) {
        sql += ',\n';
      } else {
        sql += '\n';
      }
    }

    sql += ');';
    return sql;
  };

  // --- Generation Pipeline 4: JSON Schema Draft v7 ---
  const generateJSONSchema = (obj: any, rootTitle: string): string => {
    const recurse = (currentObj: any, currentTitle: string): any => {
      if (currentObj === null) {
        return { type: 'null' };
      }
      if (Array.isArray(currentObj)) {
        if (currentObj.length === 0) {
          return { type: 'array', items: {} };
        }
        return {
          type: 'array',
          items: recurse(currentObj[0], currentTitle + 'Item')
        };
      }
      if (typeof currentObj === 'object') {
        const properties: Record<string, any> = {};
        const requiredKeys = Object.keys(currentObj);

        for (const key of requiredKeys) {
          properties[key] = recurse(currentObj[key], key);
        }

        const schemaObj: any = {
          type: 'object',
          properties
        };

        if (requiredKeys.length > 0 && !optionalFields) {
          schemaObj.required = requiredKeys;
        }

        return schemaObj;
      }

      let nativeType: string = typeof currentObj;
      if (nativeType === 'number') {
        nativeType = Number.isInteger(currentObj) ? 'integer' : 'number';
      }
      return { type: nativeType };
    };

    const schema = {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: rootTitle,
      ...recurse(obj, rootTitle)
    };

    return JSON.stringify(schema, null, indentationSize);
  };

  // Run the core parsing engine whenever custom triggers mutate
  useEffect(() => {
    if (!jsonInput.trim()) {
      setGeneratedCode('');
      setParseError(null);
      return;
    }

    try {
      // Validate input JSON strings
      const cleaned = jsonInput.trim();
      const parsed = JSON.parse(cleaned);
      setParseError(null);

      // Branch to correct generation layout
      const normalizedRootName = interfaceName.trim() || 'RootObject';
      
      switch (outputLanguage) {
        case 'typescript':
          setGeneratedCode(generateTypeScript(parsed, normalizedRootName));
          break;
        case 'golang':
          setGeneratedCode(generateGoStructs(parsed, normalizedRootName));
          break;
        case 'sql':
          setGeneratedCode(generateSQLSchema(parsed, normalizedRootName));
          break;
        case 'jsonschema':
          setGeneratedCode(generateJSONSchema(parsed, normalizedRootName));
          break;
      }
    } catch (e: any) {
      setParseError(`JSON Syntax Error: ${e.message}`);
      setGeneratedCode('');
    }
  }, [jsonInput, outputLanguage, interfaceName, indentationSize, optionalFields]);

  const handleCopyCode = async () => {
    if (!generatedCode) return;
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleLoadSample = () => {
    const sample = {
      id: 98416,
      username: "alex_dev",
      active: true,
      balance: 1405.62,
      profile: {
        firstName: "Alex",
        lastName: "Perez",
        tags: ["senior", "engineer", "cloud"]
      },
      emails: [
        { address: "alex@example.com", primary: true },
        { address: "alex.work@company.net", primary: false }
      ],
      createdAt: "2026-06-22T05:57:00Z"
    };
    setJsonInput(JSON.stringify(sample, null, 2));
  };

  const handleClear = () => {
    setJsonInput('');
    setGeneratedCode('');
    setParseError(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="typedef-converter-root">
      
      {/* Back button & title header */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          JSON ↔ Type Definitions & <span className="text-indigo-600 dark:text-indigo-400">Schema Converter</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Instantly transform any raw JSON payload string into fully recursive TypeScript interfaces, production-ready Go Struct configurations, transactional SQL Table schemas, or standard JSON Schema specifications.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Settings Adjusters */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
              <Settings className="w-4 h-4 text-indigo-500 hover:rotate-12 transition-transform" />
              Settings & Mapping Tags
            </h3>

            <div className="space-y-4">
              {/* TypeName input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Root Object/Table Name
                </label>
                <input 
                  type="text"
                  value={interfaceName}
                  onChange={(e) => setInterfaceName(e.target.value.replace(/[^a-zA-Z0-9_$]/g, ''))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-950 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="RootObject"
                />
              </div>

              {/* Indentations select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Indentation Space Width
                </label>
                <div className="flex gap-2">
                  {[2, 4].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setIndentationSize(sz as any)}
                      className={`flex-grow py-2 rounded-lg text-xs font-bold font-mono border ${
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

              {/* Optional values fields */}
              {(outputLanguage === 'typescript' || outputLanguage === 'jsonschema') && (
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/40 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
                  <input 
                    type="checkbox"
                    id="opt-fields-check"
                    checked={optionalFields}
                    onChange={(e) => setOptionalFields(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="opt-fields-check" className="text-[11px] font-bold text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                    {outputLanguage === 'typescript' ? 'Mark TS properties as optional (?)' : 'Generate attributes without REQUIRED values'}
                  </label>
                </div>
              )}

              {/* Sample loader */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex gap-2">
                <button
                  onClick={handleLoadSample}
                  className="flex-grow flex items-center justify-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-755 dark:hover:bg-slate-700 text-xs font-extrabold text-slate-700 dark:text-slate-200 rounded-xl transition-colors"
                >
                  <FileJson className="w-3.5 h-3.5" />
                  Load Complex JSON
                </button>
                <button
                  onClick={handleClear}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-xs font-bold rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Code Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 font-mono">
                Paste raw JSON
              </span>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-80 px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-mono text-xs leading-relaxed"
                placeholder='{ "key": "value", "list": [1, 2, 3] }'
              />
            </div>

            {/* Output card */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl mb-4 text-xs font-bold">
                  {[
                    { id: 'typescript', label: 'TS Types' },
                    { id: 'golang', label: 'Go Struct' },
                    { id: 'sql', label: 'SQL Table' },
                    { id: 'jsonschema', label: 'JSON Schema' }
                  ].map((lang) => {
                    const isSelected = outputLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        onClick={() => setOutputLanguage(lang.id as OutputLanguage)}
                        className={`flex-grow py-1.5 rounded-lg text-center transition-all ${
                          isSelected 
                            ? 'bg-indigo-600 text-white shadow-sm' 
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {lang.label}
                      </button>
                    );
                  })}
                </div>

                <div className="relative">
                  <textarea
                    value={generatedCode}
                    readOnly
                    className="w-full h-64 px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 font-mono text-xs leading-relaxed select-all"
                    placeholder="Resulting code definitions will generate here..."
                  />

                  {generatedCode && (
                    <button
                      onClick={handleCopyCode}
                      className="absolute top-2.5 right-2.5 flex items-center gap-1 px-3 py-1 bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Grammar Parser Error block */}
          {parseError && (
            <div className="bg-rose-50 dark:bg-rose-950/20 p-4 border border-rose-100 dark:border-rose-900/30 rounded-xl flex items-start gap-2 text-rose-800 dark:text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold">{parseError}</div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-sans flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Frequently Asked Questions
        </h3>
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">How are types resolved from unstructured JSON objects?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Our compiler recursively scans nested object pathways. Strings containing datetime formatting are auto-mapped inside database columns, decimals are parsed as floats, whole counts are integers, nested lists are mapped as sub-array records, and sub-objects yield brand new linked schemas.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2">Is the code conversion secure?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Yes, entirely browser-native. We perform zero network trips, queries, API connections or database storage logging. None of your database configurations, fields, keys, names or strings are transferred out of your device viewport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
