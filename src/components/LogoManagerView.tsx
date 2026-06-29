import React, { useState, useEffect, useRef } from 'react';
import { Upload, ArrowLeft, RefreshCw, Trash2, CheckCircle2, AlertCircle, FileImage, Layers } from 'lucide-react';
import { logoConfig } from '../logo-config';
import HubLogo from './HubLogo';
import { isDevSession } from '../types';

interface LogoManagerViewProps {
  onNavigateHome: () => void;
}

export default function LogoManagerView({ onNavigateHome }: LogoManagerViewProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [currentConfig, setCurrentConfig] = useState(logoConfig);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [useImgTag, setUseImgTag] = useState<boolean>(() => {
    return localStorage.getItem('texttoolkithub_use_img_tag') === 'true';
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggleImgTag = (val: boolean) => {
    setUseImgTag(val);
    localStorage.setItem('texttoolkithub_use_img_tag', val ? 'true' : 'false');
    window.dispatchEvent(new Event('logo-updated'));
  };

  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Check if we are actually in development mode or active sandbox
  const isDev = isDevSession();

  if (!isDev) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-8 max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-rose-600 dark:text-rose-400 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Access Denied</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The Logo Management System is a secure developer utility accessible only during active development inside Google AI Studio. It is completely blocked on production builds.
          </p>
          <button 
            onClick={onNavigateHome}
            className="mt-6 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 rounded-full font-semibold text-xs hover:opacity-90 transition-opacity"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const processFile = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Unsupported file format! Please upload a PNG, SVG, JPG, or WebP logo.' });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File is too large! Please upload a file smaller than 10MB.' });
      return;
    }

    setSelectedFile(file);
    setMessage(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleSave = async () => {
    if (!previewUrl || !selectedFile) return;

    setIsSaving(true);
    setMessage(null);

    try {
      // 1. Store in localStorage first for absolute client-side reliability
      localStorage.setItem('texttoolkithub_custom_logo', previewUrl);
      window.dispatchEvent(new Event('logo-updated'));

      // 2. Try saving to the backend filesystem if the development server is active
      let serverSaved = false;
      let logoType = 'custom';
      try {
        const response = await fetch('/api/upload-logo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            mimeType: selectedFile.type,
            base64: previewUrl,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            serverSaved = true;
            logoType = data.logoType || 'custom';
          }
        }
      } catch (err) {
        console.warn("Server upload bypassed in client-side preview:", err);
      }

      setSelectedFile(null);
      setPreviewUrl('');
      setCurrentConfig({
        hasCustomLogo: true,
        logoType: logoType as any,
        updatedAt: Date.now(),
      });

      if (serverSaved) {
        setMessage({
          type: 'success',
          text: 'Logo uploaded and optimized successfully! The new logo has been written to your filesystem repository, and all responsive favicon parameters have been rebuilt. Refresh your browser to see them.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Logo updated successfully! The logo has been saved securely to your browser session and is now active across all tools on this domain. To make this permanent in the repository files, please notify the developer agent.',
        });
      }
    } catch (error) {
      console.error("Save error:", error);
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred while saving your custom logo.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetToDefault = async () => {
    if (!confirm('Are you absolutely sure you want to reset the brand logo back to the original default TextToolkitHub vector logo? This will revert all modified favicons and public files.')) {
      return;
    }

    setIsResetting(true);
    setMessage(null);

    try {
      // 1. Revert client-side state
      localStorage.removeItem('texttoolkithub_custom_logo');
      window.dispatchEvent(new Event('logo-updated'));

      // 2. Revert server state
      let serverReset = false;
      try {
        const response = await fetch('/api/reset-logo', {
          method: 'POST',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            serverReset = true;
          }
        }
      } catch (err) {
        console.warn("Server reset bypassed in client-side preview:", err);
      }

      setSelectedFile(null);
      setPreviewUrl('');
      setCurrentConfig({
        hasCustomLogo: false,
        logoType: 'default',
        updatedAt: Date.now(),
      });

      if (serverReset) {
        setMessage({
          type: 'success',
          text: 'The brand logo and all associated favicons have been successfully restored to default standards in both the browser and server repository files!',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'The brand logo has been successfully restored to the default TextToolkitHub vector logo inside your browser session!',
        });
      }
    } catch (error) {
      console.error("Reset error:", error);
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred while resetting the logo.',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="logo-manager-container">
      {/* Header Back Link */}
      <div className="mb-8">
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
          id="logo-manager-back-btn"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Toolkit Home
        </button>
      </div>

      {/* Main Grid Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white mb-10 shadow-xl border border-indigo-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-[10px] font-extrabold uppercase tracking-widest text-indigo-300">
            Developer Admin Module
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3 mb-2 font-sans">
            🔧 Logo Management System
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            This module provides live physical logo optimization and asset generation. When you upload a custom logo, the server backend automatically optimizes the pixel density, guarantees web-safe transparent PNG compressing, writes a fallback vector wrapper, and compiles all system sizes for high performance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Upload zone and settings */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Uploader Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-500" />
              Upload New Logo
            </h3>

            {/* Drag Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                dragOver 
                  ? 'border-indigo-500 bg-indigo-500/5' 
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-950/20'
              }`}
              id="logo-drag-drop-zone"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".png,.svg,.jpg,.jpeg,.webp"
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 animate-pulse" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Drag & Drop your logo file here
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Or click to browse files (PNG, SVG, JPG, or WebP)
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {['PNG', 'SVG', 'JPG', 'WebP'].map(ext => (
                    <span key={ext} className="text-[10px] font-bold px-2 py-0.5 bg-slate-200/50 dark:bg-slate-800 rounded text-slate-600 dark:text-slate-400">
                      {ext}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Selected File Details */}
            {selectedFile && (
              <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600">
                    <FileImage className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-[300px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {(selectedFile.size / 1024).toFixed(1)} KB &bull; {selectedFile.type}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded"
                  title="Remove selected file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Status Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                  : 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-400'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={!previewUrl || isSaving}
                className={`flex-grow sm:flex-grow-0 inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs font-bold transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-indigo-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Optimizing &amp; Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Save &amp; Optimize Logo
                  </>
                )}
              </button>

              <button
                onClick={handleResetToDefault}
                disabled={isResetting || !currentConfig.hasCustomLogo}
                className={`flex-grow sm:flex-grow-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isResetting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Reverting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    Reset to Default Logo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Secure Information Panel */}
          <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-500" />
              Sovereign Compilation Pipeline
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              When a custom logo is committed, our file compiler pipeline completely replaces the static content of the following public files directly in your workspace. This ensures the custom logo is natively compiled and served as a default static file across all caches and servers once the app is published.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[10px] text-slate-500 dark:text-slate-400">
              <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded flex items-center justify-between">
                <span>public/logo.svg</span>
                <span className="text-indigo-500 font-bold">Standard SVG</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded flex items-center justify-between">
                <span>public/favicon.ico</span>
                <span className="text-emerald-500 font-bold">Favicon (32x32)</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded flex items-center justify-between">
                <span>public/apple-touch-icon.png</span>
                <span className="text-amber-500 font-bold">iOS Home (180x180)</span>
              </div>
              <div className="p-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded flex items-center justify-between">
                <span>public/android-chrome-512x512.png</span>
                <span className="text-rose-500 font-bold">Manifest (512x512)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Contrast preview check */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Active Config Status */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Logo Pipeline Status
            </h3>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs text-slate-500">Pipeline Status</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-400 rounded-full text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Dev
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="text-xs text-slate-500">Active Logo Mode</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {currentConfig.hasCustomLogo ? `Customized (${currentConfig.logoType.toUpperCase()})` : 'Default Brand Vector'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Last Code Compilation</span>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-400">
                  {currentConfig.updatedAt > 0 ? new Date(currentConfig.updatedAt).toLocaleTimeString() : 'N/A (Using Code Default)'}
                </span>
              </div>
            </div>
          </div>

          {/* Only Me / Developer Exclusive Override */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              Only Me Override (yogeshmadhukar.author@gmail.com)
            </h3>
            <p className="text-[11px] text-slate-500 mb-4">
              Configure specialized logo rendering specifications for your session. This overrides standard vector wrappers with direct HTML image tags.
            </p>
            
            <div className="p-3.5 bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-950/40 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={useImgTag}
                  onChange={(e) => handleToggleImgTag(e.target.checked)}
                  className="mt-1 rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                  id="toggle-use-img-tag"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Use HTML &lt;img&gt; Layout Option
                  </span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-relaxed">
                    Force the brand logo to render via standard <code>&lt;img&gt;</code> tags rather than complex <code>&lt;svg&gt;&lt;image&gt;</code> containers. Ideal for specific browser layer optimizations.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Active Logo Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Real-Time Contrast Preview
            </h3>

            {/* Light Canvas */}
            <div className="mb-4">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                Light Background (Contrast Checker)
              </span>
              <div className="h-28 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern">
                {previewUrl ? (
                  <img src={previewUrl} className="w-16 h-16 object-contain" alt="Selected Preview" />
                ) : (
                  <HubLogo size="xl" />
                )}
              </div>
            </div>

            {/* Dark Canvas */}
            <div>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1">
                Dark Background (Contrast Checker)
              </span>
              <div className="h-28 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-center p-4 relative overflow-hidden bg-grid-pattern-dark">
                {previewUrl ? (
                  <img src={previewUrl} className="w-16 h-16 object-contain" alt="Selected Preview" />
                ) : (
                  <HubLogo size="xl" />
                )}
              </div>
            </div>

            <div className="mt-4 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-950/40 rounded-xl text-[11px] text-indigo-800 dark:text-indigo-400 leading-relaxed">
              <strong>Tip:</strong> Upload logos with <strong>transparent backgrounds</strong> (PNG or SVG format) so they render beautifully on both light and dark headers across the application.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
