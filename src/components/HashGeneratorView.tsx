import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
  FileDigit,
  Trash2,
  FileCode,
  Upload,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface HashGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

// ----------------- Self-Contained High-Performance MD5 Script -----------------
function rotateLeft(v: number, s: number): number {
  return (v << s) | (v >>> (32 - s));
}

function md5(string: string): string {
  function k(n: number) { return Math.sin(n) * 0x100000000 | 0; }
  const b = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476;
  const words: number[] = [];
  const utf8 = unescape(encodeURIComponent(string));
  for (let i = 0; i < utf8.length; i++) {
    words[i >> 2] |= utf8.charCodeAt(i) << ((i % 4) * 8);
  }
  words[utf8.length >> 2] |= 0x80 << ((utf8.length % 4) * 8);
  const n = ((utf8.length + 8) >> 6) * 16 + 14;
  words[n] = utf8.length * 8;
  for (let i = 0; i < words.length; i += 16) {
    let a = h0, c = h1, d = h2, e = h3;
    for (let j = 0; j < 64; j++) {
      let f = 0, g = 0;
      if (j < 16) {
        f = (c & d) | (~c & e); g = j;
      } else if (j < 32) {
        f = (e & c) | (~e & d); g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = c ^ d ^ e; g = (3 * j + 5) % 16;
      } else {
        f = d ^ (c | ~e); g = (7 * j) % 16;
      }
      const temp = e;
      e = d;
      d = c;
      c = (c + rotateLeft(a + f + k(j + 1) + (words[i + g] || 0), s[j])) | 0;
      a = temp;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + c) | 0; h2 = (h2 + d) | 0; h3 = (h3 + e) | 0;
  }
  return [h0, h1, h2, h3].map(v => {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      hex += ((v >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  }).join('');
}

// Self-contained fast MD5 for raw file buffer hash computing
function md5ArrayBuffer(buffer: ArrayBuffer): string {
  const words = new Uint32Array(Math.ceil(buffer.byteLength / 4) + 16);
  const view = new DataView(buffer);
  const byteLen = buffer.byteLength;
  for (let i = 0; i < byteLen; i++) {
    words[i >> 2] |= view.getUint8(i) << ((i % 4) * 8);
  }
  words[byteLen >> 2] |= 0x80 << ((byteLen % 4) * 8);
  const n = ((byteLen + 8) >> 6) * 16 + 14;
  words[n] = byteLen * 8;
  function k(n: number) { return Math.sin(n) * 0x100000000 | 0; }
  const s = [
    7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
    5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
    4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
    6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
  ];
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476;
  for (let i = 0; i < words.length; i += 16) {
    let a = h0, c = h1, d = h2, e = h3;
    for (let j = 0; j < 64; j++) {
      let f = 0, g = 0;
      if (j < 16) {
        f = (c & d) | (~c & e); g = j;
      } else if (j < 32) {
        f = (e & c) | (~e & d); g = (5 * j + 1) % 16;
      } else if (j < 48) {
        f = c ^ d ^ e; g = (3 * j + 5) % 16;
      } else {
        f = d ^ (c | ~e); g = (7 * j) % 16;
      }
      const temp = e;
      e = d;
      d = c;
      c = (c + rotateLeft(a + f + k(j + 1) + (words[i + g] || 0), s[j])) | 0;
      a = temp;
    }
    h0 = (h0 + a) | 0; h1 = (h1 + c) | 0; h2 = (h2 + d) | 0; h3 = (h3 + e) | 0;
  }
  return [h0, h1, h2, h3].map(v => {
    let hex = '';
    for (let i = 0; i < 4; i++) {
      hex += ((v >> (i * 8)) & 0xff).toString(16).padStart(2, '0');
    }
    return hex;
  }).join('');
}


// ----------------- Core Component -----------------
export default function HashGeneratorView({ onNavigateToTool, onNavigateHome }: HashGeneratorViewProps) {
  const [inputText, setInputText] = useState<string>('');
  const [expectedHash, setExpectedHash] = useState<string>('');
  const [copiedAlg, setCopiedAlg] = useState<string | null>(null);

  // File analysis state
  const [analyzedFile, setAnalyzedFile] = useState<File | null>(null);
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [fileProgress, setFileProgress] = useState<number>(0);

  // All calculated hashes
  const [hashes, setHashes] = useState<{
    md5: string;
    sha1: string;
    sha256: string;
    sha384: string;
    sha512: string;
  }>({
    md5: '',
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // SEO params
  const seoTitle = "Cryptographic Hash Generator - MD5 SHA-256 Checksum Tool";
  const seoDescription = "Generate secure MD5, SHA-1, SHA-256, SHA-384 and SHA-512 checksums 100% locally in your browser. Live checksum matching and fast local file hashing.";

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

  // Utility to convert ArrayBuffer to Hex representation
  const bufferToHex = (buffer: ArrayBuffer): string => {
    const array = new Uint8Array(buffer);
    return Array.from(array)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Convert raw text strings using Web Crypto API and local MD5
  const computeTextHashes = async (text: string) => {
    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha384: '', sha512: '' });
      return;
    }

    try {
      const msgBuffer = new TextEncoder().encode(text);

      // Compute standard Web Crypto SHA algorithms
      const hash1 = await crypto.subtle.digest('SHA-1', msgBuffer);
      const hash256 = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hash384 = await crypto.subtle.digest('SHA-384', msgBuffer);
      const hash512 = await crypto.subtle.digest('SHA-512', msgBuffer);

      // Calculate custom client-side MD5
      const calculatedMd5 = md5(text);

      setHashes({
        md5: calculatedMd5,
        sha1: bufferToHex(hash1),
        sha256: bufferToHex(hash256),
        sha384: bufferToHex(hash384),
        sha512: bufferToHex(hash512),
      });
    } catch (e) {
      console.warn("Hashing error:", e);
    }
  };

  // Run on input string changing
  useEffect(() => {
    if (analyzedFile) return; // ignore typed inputs if a file is uploaded
    computeTextHashes(inputText);
  }, [inputText, analyzedFile]);

  // Handle local File Hashing dynamically
  const parseSelectedFile = (file: File) => {
    if (!file) return;

    setAnalyzedFile(file);
    setIsFileLoading(true);
    setFileProgress(0);

    const reader = new FileReader();

    reader.onprogress = (evt) => {
      if (evt.lengthComputable) {
        const percent = Math.floor((evt.loaded / evt.total) * 100);
        setFileProgress(percent);
      }
    };

    reader.onload = async (evt) => {
      try {
        const arrayBuffer = evt.target?.result as ArrayBuffer;
        if (!arrayBuffer) throw new Error("File array buffer empty.");

        // Calculate SHA values from arrayBuffer in parallel
        const hash1 = await crypto.subtle.digest('SHA-1', arrayBuffer);
        const hash256 = await crypto.subtle.digest('SHA-256', arrayBuffer);
        const hash384 = await crypto.subtle.digest('SHA-384', arrayBuffer);
        const hash512 = await crypto.subtle.digest('SHA-512', arrayBuffer);

        const calculatedMd5 = md5ArrayBuffer(arrayBuffer);

        setHashes({
          md5: calculatedMd5,
          sha1: bufferToHex(hash1),
          sha256: bufferToHex(hash256),
          sha384: bufferToHex(hash384),
          sha512: bufferToHex(hash512),
        });
      } catch (err) {
        console.warn("File scanning failure:", err);
      } finally {
        setIsFileLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleCopyHash = async (val: string, label: string) => {
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      setCopiedAlg(label);
      setTimeout(() => setCopiedAlg(null), 1800);
    } catch {}
  };

  const handleLoadSample = () => {
    setAnalyzedFile(null);
    setInputText("The quick brown fox jumps over the lazy dog");
  };

  const handleReset = () => {
    setAnalyzedFile(null);
    setInputText('');
    setExpectedHash('');
    setHashes({ md5: '', sha1: '', sha256: '', sha384: '', sha512: '' });
  };

  // Drag and drop events mapping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      parseSelectedFile(files[0]);
    }
  };

  // Matcher evaluation
  const checkMatches = (hashValue: string): boolean => {
    if (!expectedHash.trim()) return false;
    const cleanExpect = expectedHash.trim().toLowerCase();
    return hashValue === cleanExpect;
  };

  const isAnyMatchFound = (): boolean => {
    if (!expectedHash.trim()) return false;
    const h = expectedHash.trim().toLowerCase();
    return h === hashes.md5 || h === hashes.sha1 || h === hashes.sha256 || h === hashes.sha384 || h === hashes.sha512;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="hash-generator-root">
      
      {/* Back link & Title */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          Secure Hash Generator & <span className="text-indigo-600 dark:text-indigo-400">Checksum Matcher</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Instantly compute MD5, SHA-1, SHA-256, SHA-384, and SHA-512 cryptographic digests. Paste strings directly or upload files securely (hashing is compiled entirely sandbox-locally inside your browser context).
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Workspace Control Inputs */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Option A: Text Textarea input */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                Method A: Enter String Literal
              </span>
              <button 
                onClick={handleLoadSample}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Load Sample Text
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => {
                setAnalyzedFile(null);
                setInputText(e.target.value);
              }}
              disabled={!!analyzedFile}
              className={`w-full h-32 px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-mono text-xs leading-relaxed ${
                analyzedFile ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              placeholder="Type or paste your text content here to generate parallel hashes..."
            />
          </div>

          {/* Option B: Local File Checksum Dropzone */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5 font-mono">
              Method B: Drag & Drop File Loader
            </span>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                analyzedFile 
                  ? 'border-indigo-500 bg-indigo-50/20 dark:bg-slate-900/40' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-750'
              }`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) parseSelectedFile(files[0]);
                }}
                className="hidden"
              />
              <Upload className={`w-8 h-8 mx-auto mb-2 ${analyzedFile ? 'text-indigo-500' : 'text-slate-400'}`} />
              
              {analyzedFile ? (
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block break-all">
                    {analyzedFile.name}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {(analyzedFile.size / 1024 / 1024).toFixed(3)} MB
                  </span>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 block">
                    Choose local file or drop here
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Operates 100% offline, file never leaves your computer.
                  </span>
                </div>
              )}
            </div>

            {/* Parsing Progress Bar */}
            {isFileLoading && (
              <div className="mt-4">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold mb-1">
                  <span>Scanning complete blocks...</span>
                  <span>{fileProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${fileProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Option C: Checksum Matcher Input */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm">
            <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 font-mono">
              Expected Checksum Matcher (Compare)
            </span>
            <input 
              type="text"
              value={expectedHash}
              onChange={(e) => setExpectedHash(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs tracking-wider"
              placeholder="Paste original checksum here to verify integrity matches..."
            />

            {expectedHash.trim() && (
              <div className="mt-3">
                {isAnyMatchFound() ? (
                  <div className="flex items-center gap-1.5 p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-lg text-emerald-800 dark:text-emerald-400 text-xs font-bold">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    Checksum match found! Integrity verified successfully.
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 p-2.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-lg text-rose-800 dark:text-rose-400 text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    None of calculated values match. Possible file alteration.
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleReset}
              className="mt-4 w-full flex items-center justify-center gap-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-755 text-slate-700 dark:text-slate-200 py-2 rounded-xl text-xs font-extrabold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Inputs & Checksums
            </button>
          </div>

        </div>

        {/* Right Hand: Output Hashes Lists */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Calculated Digests</span>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> Checked Cryptographically
            </span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'MD5', val: hashes.md5 },
              { label: 'SHA-1', val: hashes.sha1 },
              { label: 'SHA-256', val: hashes.sha256 },
              { label: 'SHA-384', val: hashes.sha384 },
              { label: 'SHA-512', val: hashes.sha512 }
            ].map((item) => {
              const isMatch = checkMatches(item.val);
              return (
                <div 
                  key={item.label}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isMatch 
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-500' 
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 font-sans tracking-wide">{item.label} Checksum</span>
                    <div className="flex items-center gap-2">
                      {isMatch && <span className="text-[9px] font-extrabold uppercase bg-emerald-500 text-white px-1.5 py-0.5 rounded leading-none">Match</span>}
                      <button
                        onClick={() => handleCopyHash(item.val, item.label)}
                        className="text-[11px] text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-bold flex items-center gap-0.5 font-mono"
                      >
                        {copiedAlg === item.label ? <Check className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                        {copiedAlg === item.label ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] leading-relaxed break-all py-1 px-2.5 bg-white dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-850 text-slate-800 dark:text-slate-200 select-all font-semibold select-none">
                    {item.val || 'Awaiting input data sequence...'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Guide FAQs section */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-8 mt-12">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 font-sans flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          Frequently Asked Questions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">How are file digests checked securely browser-side?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When you load or drop a file, we read the blocks of bytes locally inside standard HTML5 Array Buffers. Next, using standard native APIs of the modern web viewport (`crypto.subtle.digest`), we compile high-performance cryptographical checksums. This means no bytes, packets or file content metadata ever leaves your device or goes to database pipelines.
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">When do I verify a zip or binary checksum?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When installing code libraries or system-level updates, authors post safe hashes on release pages. Running those downloads through our checksum checker lets you confirm that download streams completed 100% without corrupt blocks or rogue alterations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
