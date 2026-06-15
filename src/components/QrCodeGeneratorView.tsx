import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode,
  Link as LinkIcon,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Wifi,
  Copy,
  Check,
  Download,
  Trash2,
  ArrowLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  Sliders,
  Palette,
  Maximize2,
  Image as ImageIcon,
  FileCode,
  Info
} from 'lucide-react';

interface QrCodeGeneratorViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

type QrType = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi';

export default function QrCodeGeneratorView({ onNavigateToTool, onNavigateHome }: QrCodeGeneratorViewProps) {
  // Input Selection
  const [activeType, setActiveType] = useState<QrType>('url');
  
  // Tab Input States
  const [textVal, setTextVal] = useState('');
  const [urlVal, setUrlVal] = useState('https://google.com');
  
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  const [phoneNum, setPhoneNum] = useState('');
  
  const [smsNum, setSmsNum] = useState('');
  const [smsBody, setSmsBody] = useState('');
  
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Customization States
  const [qrSize, setQrSize] = useState<number>(300);
  const [qrMargin, setQrMargin] = useState<number>(4);
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');

  // UI Status
  const [copied, setCopied] = useState(false);
  const [svgUrl, setSvgUrl] = useState<string>('');
  const [pngUrl, setPngUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // SEO configuration
  const seoTitle = "QR Code Generator Online | Free QR Creator";
  const seoDescription = "Create QR codes instantly for URLs, text, emails, phone numbers, and WiFi networks. Customize colors, sizes, borders, and download as PNG or SVG format offline.";

  const presetFgColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Navy', value: '#1e3a8a' },
    { name: 'Indigo', value: '#4f46e5' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Amber', value: '#d97706' },
  ];

  const presetBgColors = [
    { name: 'White', value: '#ffffff' },
    { name: 'Slate 50', value: '#f8fafc' },
    { name: 'Cream', value: '#fffbeb' },
    { name: 'Mint', value: '#f0fdf4' },
    { name: 'Transparent', value: 'transparent' },
  ];

  const faqs = [
    {
      id: 1,
      question: "How does the QR Code Generator work?",
      answer: "This QR Code generator takes any custom content strings (like internet addresses, geographic parameters, contact mail routers, phone triggers, short SMS structures, or WiFi configurations) and compiles the data into high-density 2D barcodes instantly in your local browser sandbox, requiring absolutely zero remote servers or APIs."
    },
    {
      id: 2,
      question: "What do the different error correction levels represent?",
      answer: "Error Correction Level (ECL) determines how much of the QR code matrix can be damaged or obscured while remaining scannable. L (Low) recovers ~7% of data, M (Medium) recovers ~15%, Q (Quartile) recovers ~25%, and H (High) recovers ~30%. Choose 'High' for codes used in rugged print environments or if you intend to layer logos/icons on top."
    },
    {
      id: 3,
      question: "How can I generate a QR code for a local WiFi network?",
      answer: "Choose the WiFi standard tab, enter your SSID (network name), security password, and encryption class (WPA/WPA2 is standard for most systems). When other users point their mobile camera at the resulting barcode, they can securely connect to authorization profiles instantly with no manual entry."
    },
    {
      id: 4,
      question: "Can I print the output or export it into vector documents?",
      answer: "Yes! Use 'Download SVG' for professional vector printing or layout design. SVG (Scalable Vector Graphics) maintains crisp lines at any magnification without losing definition. Use PNG for web uploads, digital slides, or email integration."
    }
  ];

  // Set up Page Title, Meta, and JSON-LD schema
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

    const scriptId = "qr-generator-json-ld";
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

  // Compute raw string format from types
  const computeQrPayloadString = (): string => {
    switch (activeType) {
      case 'url':
        if (!urlVal.trim()) return '';
        // auto pre-pend protocol to match standard URL rules
        try {
          if (!/^https?:\/\//i.test(urlVal.trim())) {
            return `https://${urlVal.trim()}`;
          }
          return urlVal.trim();
        } catch (_) {
          return urlVal.trim();
        }
      case 'email':
        if (!emailTo.trim()) return '';
        const subjectEsc = encodeURIComponent(emailSubject);
        const bodyEsc = encodeURIComponent(emailBody);
        return `mailto:${emailTo.trim()}?subject=${subjectEsc}&body=${bodyEsc}`;
      case 'phone':
        if (!phoneNum.trim()) return '';
        return `tel:${phoneNum.trim()}`;
      case 'sms':
        if (!smsNum.trim()) return '';
        return `sms:${smsNum.trim()}?body=${encodeURIComponent(smsBody)}`;
      case 'wifi':
        if (!wifiSsid.trim()) return '';
        // WIFI:S:SSID;T:WPA;P:PASSWORD;H:true;;
        const ssidEsc = wifiSsid.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/,/g, '\\,');
        const passEsc = wifiPassword.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/:/g, '\\:').replace(/,/g, '\\,');
        return `WIFI:S:${ssidEsc};T:${wifiEncryption};P:${wifiEncryption === 'nopass' ? '' : passEsc};H:${wifiHidden ? 'true' : 'false'};;`;
      case 'text':
      default:
        return textVal;
    }
  };

  const payload = computeQrPayloadString();

  // Draw QR code with settings
  const generateQrCode = async () => {
    setErrorMessage('');
    if (!payload.trim()) {
      setPngUrl('');
      setSvgUrl('');
      // Clear canvas if open
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    try {
      const optionsStr = {
        width: qrSize,
        margin: qrMargin,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor === 'transparent' ? '#ffffff00' : bgColor
        }
      };

      // Draw onto live Canvas reference
      const canvas = canvasRef.current;
      if (canvas) {
        await QRCode.toCanvas(canvas, payload, optionsStr);
      }

      // Generate downloadable PNG URL
      const computedPng = await QRCode.toDataURL(payload, {
        ...optionsStr,
        width: Math.max(qrSize, 512) // Ensure standard high-res output for downloading
      });
      setPngUrl(computedPng);

      // Generate downloadable SVG XML content
      // Note: Transparent bg logic for SVG output
      const computedRawSvg = await QRCode.toString(payload, {
        ...optionsStr,
        type: 'svg',
        width: Math.max(qrSize, 512)
      });
      
      const blob = new Blob([computedRawSvg], { type: 'image/svg+xml;charset=utf-8' });
      const computedSvgUrl = URL.createObjectURL(blob);
      setSvgUrl(computedSvgUrl);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Failed to render standard QR bar formatting.');
    }
  };

  // Re-generate in real-time on customizer or options updates
  useEffect(() => {
    generateQrCode();
  }, [payload, qrSize, qrMargin, errorLevel, fgColor, bgColor, activeType]);

  const handleClear = () => {
    setTextVal('');
    setUrlVal('');
    setEmailTo('');
    setEmailSubject('');
    setEmailBody('');
    setPhoneNum('');
    setSmsNum('');
    setSmsBody('');
    setWifiSsid('');
    setWifiPassword('');
    setWifiEncryption('WPA');
    setWifiHidden(false);
    setPngUrl('');
    setSvgUrl('');
    setErrorMessage('');
  };

  const handleLoadSample = () => {
    if (activeType === 'url') {
      setUrlVal('https://blog.google');
    } else if (activeType === 'text') {
      setTextVal('Hello from Google AI Studio Code Workspace! Secure, local utility tools in full action.');
    } else if (activeType === 'email') {
      setEmailTo('developer@example.com');
      setEmailSubject('Project Collaboration Proposal');
      setEmailBody('Hello! I scanned your bio QR card and would love to start partnering on open standard components.');
    } else if (activeType === 'phone') {
      setPhoneNum('+1-555-019-2834');
    } else if (activeType === 'sms') {
      setSmsNum('+1-555-019-2834');
      setSmsBody('Ping! Scanned and sent instantly.');
    } else if (activeType === 'wifi') {
      setWifiSsid('SaaS_HQ_Fiber_5G');
      setWifiPassword('developers_sandbox_pass_2026');
      setWifiEncryption('WPA');
      setWifiHidden(false);
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      const canvas = canvasRef.current;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (copyErr) {
          console.error('Immediate system ClipboardItem writing failed: ', copyErr);
          // Fallback to write link/text or show alert
          setErrorMessage('Clipboard writing is blocked in secure sandbox frames. Try using Download.');
        }
      }, 'image/png');
    } catch (err) {
      console.warn(err);
      setErrorMessage('Browser limits restricted background copying. Please use Download options.');
    }
  };

  const handleDownloadPng = () => {
    if (!pngUrl) return;
    const anchor = document.createElement('a');
    anchor.href = pngUrl;
    anchor.download = `qrcode_${activeType}.png`;
    anchor.setAttribute('download', `qrcode_${activeType}.png`);
    
    // Prevent event bubbling so global click listeners do not intercept
    anchor.addEventListener('click', (e) => e.stopPropagation());

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleDownloadSvg = async () => {
    if (!payload.trim()) return;
    try {
      const optionsStr = {
        width: Math.max(qrSize, 512),
        margin: qrMargin,
        errorCorrectionLevel: errorLevel,
        color: {
          dark: fgColor,
          light: bgColor === 'transparent' ? '#ffffff00' : bgColor
        }
      };

      const computedRawSvg = await QRCode.toString(payload, {
        ...optionsStr,
        type: 'svg'
      });

      const blob = new Blob(
        [computedRawSvg],
        { type: "image/svg+xml;charset=utf-8" }
      );

      const url = URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `qrcode_${activeType}.svg`;
      anchor.setAttribute('download', `qrcode_${activeType}.svg`);

      // Prevent event bubbling so global click listeners do not intercept
      anchor.addEventListener('click', (e) => e.stopPropagation());

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Failed to generate custom SVG vector format.');
    }
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-[#0b0f19] transition-colors duration-300 min-h-screen py-6 px-4 md:px-8 font-sans text-slate-800 dark:text-slate-100">
      
      {/* Path Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
          <button 
            id="qr-bc-home"
            onClick={onNavigateHome} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Home
          </button>
          <ChevronRight className="w-3 h-3" />
          <button 
            id="qr-bc-generators"
            onClick={() => onNavigateToTool('tools')} 
            className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Generators
          </button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-600 dark:text-slate-400">QR Code Generator</span>
        </div>

        {/* Header segment with Quick trigger operations */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="qr-back-home-btn"
              onClick={onNavigateHome}
              className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm hover:shadow"
              title="Return Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                <QrCode className="w-7 h-7 text-indigo-500 dark:text-indigo-400" />
                QR Code Generator
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Produce professional SaaS-grade scanning codes with custom branding, color arrays, and instant vector formats.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="qr-load-sample-btn"
              onClick={handleLoadSample}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-950/80 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fill Sample Data
            </button>
            <button
              id="qr-clear-btn"
              onClick={handleClear}
              className="text-xs font-medium px-3.5 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200/60 dark:border-slate-700/60"
            >
              Clear Values
            </button>
          </div>
        </div>
      </div>

      {/* Main core multi-panel app view layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* Left Side: Form variables and customizations (7cols) */}
        <div id="qr-input-customizer" className="lg:col-span-7 space-y-6">
          
          {/* Input Type selection and input container card */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            
            {/* Horizontal Input Choice selectors (SaaS look) */}
            <div className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/35 p-2 overflow-x-auto flex gap-1 scrollbar-thin">
              <button
                id="qr-tab-url"
                onClick={() => { setActiveType('url'); setErrorMessage(''); }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeType === 'url'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-100/50 dark:hover:bg-slate-900/20'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                URL Address
              </button>
              <button
                id="qr-tab-text"
                onClick={() => { setActiveType('text'); setErrorMessage(''); }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeType === 'text'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-100/50 dark:hover:bg-slate-900/20'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Plain Text
              </button>
              <button
                id="qr-tab-wifi"
                onClick={() => { setActiveType('wifi'); setErrorMessage(''); }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeType === 'wifi'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-100/50 dark:hover:bg-slate-900/20'
                }`}
              >
                <Wifi className="w-3.5 h-3.5" />
                WiFi Access
              </button>
              <button
                id="qr-tab-email"
                onClick={() => { setActiveType('email'); setErrorMessage(''); }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeType === 'email'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-100/50 dark:hover:bg-slate-900/20'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                Email Mailto
              </button>
              <button
                id="qr-tab-sms"
                onClick={() => { setActiveType('sms'); setErrorMessage(''); }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeType === 'sms'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-100/50 dark:hover:bg-slate-900/20'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                SMS Text
              </button>
              <button
                id="qr-tab-phone"
                onClick={() => { setActiveType('phone'); setErrorMessage(''); }}
                className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeType === 'phone'
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250 hover:bg-slate-100/50 dark:hover:bg-slate-900/20'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                Phone Call
              </button>
            </div>

            {/* Input fields specific per Tab selection */}
            <div className="p-6">
              
              {errorMessage && (
                <div className="mb-4 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 border border-red-150 dark:border-red-900/50">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {activeType === 'url' && (
                <div id="panel-qr-url" className="space-y-4">
                  <div>
                    <label htmlFor="input-qr-url" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Target Hyperlink URL
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <LinkIcon className="w-4 h-4" />
                      </div>
                      <input
                        id="input-qr-url"
                        type="url"
                        placeholder="e.g. www.example.com"
                        value={urlVal}
                        onChange={(e) => setUrlVal(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                      We automatically add secure web protocols if standard prefixes are left out.
                    </p>
                  </div>
                </div>
              )}

              {activeType === 'text' && (
                <div id="panel-qr-text" className="space-y-4">
                  <div>
                    <label htmlFor="input-qr-text" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Full Text Content
                    </label>
                    <textarea
                      id="input-qr-text"
                      rows={5}
                      placeholder="Write or paste paragraph details here to convert directly inside the QR block structures..."
                      value={textVal}
                      onChange={(e) => setTextVal(e.target.value)}
                      className="w-full p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white font-sans"
                    />
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                      <span>Suitable for summaries, keys, raw code segments, or static messages.</span>
                      <span>Length: {textVal.length} characters</span>
                    </div>
                  </div>
                </div>
              )}

              {activeType === 'email' && (
                <div id="panel-qr-email" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="input-qr-email-to" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Recipient Email Address
                      </label>
                      <input
                        id="input-qr-email-to"
                        type="email"
                        placeholder="e.g. hello@domain.com"
                        value={emailTo}
                        onChange={(e) => setEmailTo(e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="input-qr-email-sub" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Subject Line (Optional)
                      </label>
                      <input
                        id="input-qr-email-sub"
                        type="text"
                        placeholder="e.g. Contact Request"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="input-qr-email-body" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Pre-written Message Body (Optional)
                    </label>
                    <textarea
                      id="input-qr-email-body"
                      rows={3}
                      placeholder="Write the initial draft content..."
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="w-full p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeType === 'wifi' && (
                <div id="panel-qr-wifi" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="input-qr-wifi-ssid" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        WiFi SSID (Network Name)
                      </label>
                      <input
                        id="input-qr-wifi-ssid"
                        type="text"
                        placeholder="e.g. Home_Network_5G"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white font-mono"
                      />
                    </div>
                    <div>
                      <label htmlFor="input-qr-wifi-field" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Network Password
                      </label>
                      <input
                        id="input-qr-wifi-field"
                        type="text"
                        disabled={wifiEncryption === 'nopass'}
                        placeholder={wifiEncryption === 'nopass' ? 'No protection key needed' : 'Enter WiFi security key...'}
                        value={wifiPassword}
                        onChange={(e) => setWifiPassword(e.target.value)}
                        className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white disabled:opacity-50 font-mono"
                      />
                    </div>
                  </div>

                  <div className="md:flex gap-6 items-center justify-between pt-1">
                    <div className="mb-3 md:mb-0">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Encryption Protocol
                      </label>
                      <div className="flex gap-2">
                        {(['WPA', 'WEP', 'nopass'] as const).map((enc) => (
                          <button
                            key={enc}
                            id={`qr-wifienc-${enc}`}
                            type="button"
                            onClick={() => setWifiEncryption(enc)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              wifiEncryption === enc
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/15'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                            }`}
                          >
                            {enc === 'nopass' ? 'Unsecured (None)' : enc}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        id="input-qr-wifi-hidden"
                        type="checkbox"
                        checked={wifiHidden}
                        onChange={(e) => setWifiHidden(e.target.checked)}
                        className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800"
                      />
                      <label htmlFor="input-qr-wifi-hidden" className="text-xs font-medium text-slate-600 dark:text-slate-400 select-none">
                        SSID is hidden/non-broadcasted
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeType === 'sms' && (
                <div id="panel-qr-sms" className="space-y-4">
                  <div>
                    <label htmlFor="input-qr-sms-num" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Recipient Mobile Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="input-qr-sms-num"
                        type="tel"
                        placeholder="e.g. +14155552671"
                        value={smsNum}
                        onChange={(e) => setSmsNum(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="input-qr-sms-body" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Preset SMS Content Body
                    </label>
                    <textarea
                      id="input-qr-sms-body"
                      rows={3}
                      placeholder="Compose the initial text draft..."
                      value={smsBody}
                      onChange={(e) => setSmsBody(e.target.value)}
                      className="w-full p-4 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white"
                    />
                  </div>
                </div>
              )}

              {activeType === 'phone' && (
                <div id="panel-qr-phone" className="space-y-4">
                  <div>
                    <label htmlFor="input-qr-phone" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Mobile or Landline Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        id="input-qr-phone"
                        type="tel"
                        placeholder="e.g. +14155550192"
                        value={phoneNum}
                        onChange={(e) => setPhoneNum(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 dark:text-white"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                      When users point a camera at the barcode, their smart devices will trigger an immediate phone application prompt.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Precision Styling Controls Selection panel */}
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-slate-950 dark:text-slate-100 flex items-center gap-1.5 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/65 pb-3">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Bar Customization Parameters
            </h3>

            {/* Customization Slidings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* QR Size slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>QR Resolution (Size)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{qrSize} × {qrSize} px</span>
                </div>
                <input
                  id="range-qr-size"
                  type="range"
                  min={128}
                  max={800}
                  step={32}
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>128px (Fewer details)</span>
                  <span>800px (Extra Resolution)</span>
                </div>
              </div>

              {/* QR Margin slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  <span>Quiet Zone border (Margin)</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{qrMargin} blocks</span>
                </div>
                <input
                  id="range-qr-margin"
                  type="range"
                  min={0}
                  max={12}
                  step={1}
                  value={qrMargin}
                  onChange={(e) => setQrMargin(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0 blocks (No border)</span>
                  <span>12 blocks (Large gap)</span>
                </div>
              </div>

              {/* Error correction Level select buttons */}
              <div className="md:col-span-2">
                <div className="mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Error Correction tolerance (ECL)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'L', label: 'L - Low', damage: '~7%' },
                    { id: 'M', label: 'M - Medium', damage: '~15%' },
                    { id: 'Q', label: 'Q - Quartile', damage: '~25%' },
                    { id: 'H', label: 'H - High', damage: '~30%' }
                  ].map((level) => (
                    <button
                      key={level.id}
                      id={`qr-ecl-${level.id}`}
                      type="button"
                      onClick={() => setErrorLevel(level.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        errorLevel === level.id
                          ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                          : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-805 text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs">{level.label}</div>
                      <div className="text-[9px] font-mono opacity-70 mt-0.5">Cleans {level.damage}</div>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Colors customizing segment */}
            <div className="border-t border-slate-150 dark:border-slate-800/80 pt-6 space-y-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-indigo-505" />
                Color Palette Tuning
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Foreground customizer */}
                <div className="space-y-2.5">
                  <label htmlFor="color-qr-fg" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Marker / Foreground Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="color-qr-fg"
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
                    />
                    <input
                      id="text-qr-fg"
                      type="text"
                      value={fgColor.toUpperCase()}
                      onChange={(e) => {
                        if (/^#[0-9A-F]{6}$/i.test(e.target.value) || e.target.value.length <= 7) {
                          setFgColor(e.target.value);
                        }
                      }}
                      className="w-24 px-2 py-1 text-xs font-mono border border-slate-200 dark:border-slate-850 rounded-lg text-center dark:bg-slate-900"
                    />
                  </div>
                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {presetFgColors.map((color) => (
                      <button
                        key={color.value}
                        id={`qr-presetfg-${color.name}`}
                        type="button"
                        onClick={() => setFgColor(color.value)}
                        className="px-2 py-1 rounded text-[9px] font-bold border border-slate-205 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 bg-white dark:bg-slate-900"
                      >
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color.value }} />
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background customizer */}
                <div className="space-y-2.5">
                  <label htmlFor="color-qr-bg" className="block text-xs font-semibold text-slate-600 dark:text-slate-400">
                    Background Color Spec
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="color-qr-bg"
                      type="color"
                      disabled={bgColor === 'transparent'}
                      value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className={`w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent ${
                        bgColor === 'transparent' ? 'opacity-30 cursor-not-allowed' : ''
                      }`}
                    />
                    <input
                      id="text-qr-bg"
                      type="text"
                      disabled={bgColor === 'transparent'}
                      value={bgColor === 'transparent' ? 'TRANSPARENT' : bgColor.toUpperCase()}
                      onChange={(e) => {
                        if (/^#[0-9A-F]{6}$/i.test(e.target.value) || e.target.value.length <= 7) {
                          setBgColor(e.target.value);
                        }
                      }}
                      className="w-28 px-2 py-1 text-xs font-mono border border-slate-200 dark:border-slate-850 rounded-lg text-center dark:bg-slate-900 disabled:opacity-50"
                    />
                  </div>
                  {/* Preset quick buttons */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {presetBgColors.map((color) => (
                      <button
                        key={color.value}
                        id={`qr-presetbg-${color.name}`}
                        type="button"
                        onClick={() => setBgColor(color.value)}
                        className="px-2 py-1 rounded text-[9px] font-bold border border-slate-205 dark:border-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center gap-1 bg-white dark:bg-slate-900"
                      >
                        {color.value !== 'transparent' ? (
                          <span className="w-2 h-2 rounded-full border border-slate-200" style={{ backgroundColor: color.value }} />
                        ) : (
                          <span className="w-2 h-2 rounded-full border border-dashed border-red-500 bg-white" />
                        )}
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Right Side: QR Code Image Viewer and Export triggers (5cols) */}
        <div id="qr-live-viewer-and-actions" className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 flex flex-col items-center">
            
            <div className="w-full flex justify-between items-center border-b border-slate-100 dark:border-slate-800/80 pb-3 mb-6">
              <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                Live Dynamic Preview
              </h2>
              <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-extrabold font-mono border border-indigo-100/30">
                100% Client Local
              </span>
            </div>

            {/* Render Stage Container with Checkerboard bg for transparency display */}
            <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden bg-white shadow-inner p-4 my-2">
              <div className="absolute inset-0 select-none opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
              
              {payload.trim() ? (
                <div className="relative flex flex-col items-center animate-fade-in">
                  <canvas 
                    ref={canvasRef} 
                    id="canvas-qr-target"
                    className="max-w-full aspect-square max-h-[300px] h-full shadow-lg rounded-xl overflow-hidden" 
                  />
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                    <QrCode className="w-6 h-6 animate-pulse" />
                  </div>
                  <p className="text-xs font-medium">No input detected yet</p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Select a tab and insert custom values to compile your dynamic 2D barcode in real-time.
                  </p>
                </div>
              )}
            </div>

            {/* Payload information logs block */}
            <div className="w-full bg-slate-50 dark:bg-[#0c0f16]/60 rounded-xl p-3.5 border border-slate-150 dark:border-slate-850 mt-6 overflow-hidden">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex justify-between">
                <span>Output Data Format</span>
                <span className="font-mono">{activeType.toUpperCase()}</span>
              </div>
              <div className="font-mono text-[10px] text-slate-600 dark:text-slate-400 break-all line-clamp-2" title={payload}>
                {payload ? payload : 'Waiting for content feed...'}
              </div>
            </div>

            <button
              id="btn-trigger-generate"
              onClick={generateQrCode}
              disabled={!payload.trim()}
              className="w-full mt-6 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <QrCode className="w-4 h-4" />
              Generate QR
            </button>

            {/* Quick action buttons row */}
            <div className="grid grid-cols-1 gap-2.5 w-full mt-3">
              
              <button
                id="btn-qr-copy-clipboard"
                disabled={!payload.trim()}
                onClick={handleCopyImage}
                className={`py-3 px-4 rounded-xl text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                  !payload.trim()
                    ? 'bg-slate-105 border-slate-200 text-slate-400 dark:bg-slate-850 dark:border-slate-8000 cursor-not-allowed'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Image'}
              </button>

              <div className="grid grid-cols-2 gap-2.5 w-full">
                <button
                  id="btn-qr-download-png"
                  disabled={!payload.trim() || !pngUrl}
                  onClick={handleDownloadPng}
                  className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all text-white ${
                    !payload.trim() || !pngUrl
                      ? 'bg-slate-350 dark:bg-slate-800/60 opacity-50 cursor-not-allowed text-slate-500'
                      : 'bg-emerald-600 hover:bg-emerald-500 shadow-sm shadow-emerald-600/10'
                  }`}
                  title="Download standard PNG illustration"
                >
                  <Download className="w-3.5 h-3.5" />
                  Format PNG
                </button>

                <button
                  id="btn-qr-download-svg"
                  disabled={!payload.trim() || !svgUrl}
                  onClick={handleDownloadSvg}
                  className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    !payload.trim() || !svgUrl
                      ? 'bg-slate-100 dark:bg-slate-800/40 opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                      : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-705 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                  }`}
                  title="Download crisp vector SVG file"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-500" />
                  Vector SVG
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* Accordions Guide FAQs segment */}
      <div className="max-w-7xl mx-auto mt-12 bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-4 flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          General Instructions & Design Guide
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-150 dark:border-slate-800 pb-6 mb-6">
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-203 mb-2 font-sans">Barcode Standard formats mapping:</h3>
            <div className="font-mono text-xs bg-slate-50 dark:bg-slate-900/30 p-4 rounded-xl border border-slate-150 dark:border-slate-805 space-y-2 text-slate-700 dark:text-slate-450">
              <p><span>URL Target</span> → <span className="text-indigo-650 dark:text-indigo-400">https://domain.com/path</span></p>
              <p><span>Email Router</span> → <span className="text-indigo-650 dark:text-indigo-400">mailto:recipient?subject=...&body=...</span></p>
              <p><span>Phone Trigger</span> → <span className="text-indigo-650 dark:text-indigo-400">tel:+1-415-555-0192</span></p>
              <p><span>SMS Trigger</span> → <span className="text-indigo-650 dark:text-indigo-400">sms:+1-415-555-0192?body=draft</span></p>
              <p><span>WiFi standard</span> → <span className="text-indigo-650 dark:text-indigo-400">WIFI:S:SSID_Name;T:WPA;P:Password;;</span></p>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-203 mb-2 font-sans">Robust Offline Engineering</h3>
            <p className="leading-relaxed mb-3">
              We leverage browser native mathematical matrices to calculate QR blocks. This means your private wifi keys, business links, or draft messaging drafts are safe. No analytics, tracking or server-transit takes place.
            </p>
            <p className="leading-relaxed">
              Adjust sizing, errors, and quiet margins on the fly. The built-in vector generator matches standard GFM parsing layouts precisely for crisp outputs.
            </p>
          </div>
        </div>

        {/* Dynamic FAQs accordion segment */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {faqs.map(faq => {
            const isExpanded = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                className="border border-slate-150 dark:border-slate-805 p-4 rounded-xl hover:border-slate-300 dark:hover:border-slate-705 transition-all cursor-pointer"
                onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{faq.question}</h4>
                  <span className="text-slate-400 font-bold">
                    {isExpanded ? '−' : '+'}
                  </span>
                </div>
                {isExpanded && (
                  <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed max-w-5xl">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
