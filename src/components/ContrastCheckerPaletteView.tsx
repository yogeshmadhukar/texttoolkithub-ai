import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  HelpCircle,
  Sparkles,
  Info,
  Trash2,
  Settings,
  Eye,
  CheckCircle2,
  XCircle,
  Contrast,
  Palette
} from 'lucide-react';

interface ContrastCheckerPaletteViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

export default function ContrastCheckerPaletteView({ onNavigateToTool, onNavigateHome }: ContrastCheckerPaletteViewProps) {
  const [bgColor, setBgColor] = useState<string>('#1E293B'); // Slate 800
  const [fgColor, setFgColor] = useState<string>('#F8FAFC'); // Slate 50
  const [isCopied, setIsCopied] = useState<string | null>(null);

  // Computed guidelines
  const [contrastRatio, setContrastRatio] = useState<number>(0);
  const [passAASmall, setPassAASmall] = useState<boolean>(false);
  const [passAALarge, setPassAALarge] = useState<boolean>(false);
  const [passAAASmall, setPassAAASmall] = useState<boolean>(false);
  const [passAAALarge, setPassAAALarge] = useState<boolean>(false);

  // Palettes list
  const [harmonies, setHarmonies] = useState<Array<{ name: string; hexCodes: string[] }>>([]);

  // SEO parameters
  const seoTitle = "Color Contrast Checker WCAG - Accessibility Palette Tool";
  const seoDescription = "Calculate text-to-background WCAG color contrast matches, check accessibility AA/AAA passes in real time, and generate beautiful color palettes.";

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
          "name": "What is the minimum WCAG AA contrast ratio for standard text?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "For standard text size, WCAG 2.1 AA guidelines require a visual contrast ratio of at least 4.5:1. For large text (18pt or larger, or 14pt bold), the minimum ratio is 3:1."
          }
        },
        {
          "@type": "Question",
          "name": "What contrast ratio is needed to pass the WCAG AAA premium compliance?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "To achieve WCAG AAA compliance, a contrast ratio of at least 7:1 is required for standard text, while large text calls for a minimum of 4.5:1 ratio."
          }
        },
        {
          "@type": "Question",
          "name": "Does this tool generate color palettes with accessible contrast?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! Our tool automatically generates monochromatic, analogous, and complementary design palettes. You can query and compare contrast ratings in real time for any element selection."
          }
        }
      ]
    };

    const scriptId = "contrast-checker-json-ld";
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

  // Helper conversions
  const hexToRgb = (hex: string): [number, number, number] | null => {
    const clean = hex.replace(/^#/, '');
    if (clean.length === 3) {
      const r = parseInt(clean[0] + clean[0], 16);
      const g = parseInt(clean[1] + clean[1], 16);
      const b = parseInt(clean[2] + clean[2], 16);
      return [r, g, b];
    }
    if (clean.length === 6) {
      const r = parseInt(clean.substring(0, 2), 16);
      const g = parseInt(clean.substring(2, 4), 16);
      const b = parseInt(clean.substring(4, 6), 16);
      return [r, g, b];
    }
    return null;
  };

  const getLuminance = (r: number, g: number, b: number): number => {
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  const calculateContrast = (hex1: string, hex2: string): number => {
    const rgb1 = hexToRgb(hex1);
    const rgb2 = hexToRgb(hex2);
    if (!rgb1 || !rgb2) return 1;

    const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
    const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    return Math.round(ratio * 100) / 100;
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
    return "#" + [clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  // Convert Hex to HSL
  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return { h: 0, s: 0, l: 0 };
    let r = rgb[0] / 255;
    let g = rgb[1] / 255;
    let b = rgb[2] / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  };

  // Convert HSL to HEX
  const hslToHex = (h: number, s: number, l: number): string => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r = l, g = l, b = l;

    if (s !== 0) {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      const hue2rgb = (pTemp: number, qTemp: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return pTemp + (qTemp - pTemp) * 6 * t;
        if (t < 1/2) return qTemp;
        if (t < 2/3) return pTemp + (qTemp - pTemp) * (2/3 - t) * 6;
        return pTemp;
      };
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return rgbToHex(r * 255, g * 255, b * 255);
  };

  // Harmonization generator
  const generateColorHarmonies = (hex: string) => {
    const hsl = hexToHsl(hex);
    if (!hsl) return;

    const monochromatic = [
      hslToHex(hsl.h, hsl.s, Math.max(10, hsl.l - 30)),
      hslToHex(hsl.h, hsl.s, Math.max(20, hsl.l - 15)),
      hex,
      hslToHex(hsl.h, hsl.s, Math.min(90, hsl.l + 15)),
      hslToHex(hsl.h, hsl.s, Math.min(98, hsl.l + 30))
    ];

    const analogous = [
      hslToHex((hsl.h + 330) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 345) % 360, hsl.s, hsl.l),
      hex,
      hslToHex((hsl.h + 15) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l)
    ];

    const complementaryList = [
      hslToHex(hsl.h, hsl.s, Math.max(15, hsl.l - 20)),
      hslToHex(hsl.h, Math.max(10, hsl.s - 20), hsl.l),
      hex,
      hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      hslToHex((hsl.h + 180) % 360, hsl.s, Math.min(90, hsl.l + 15))
    ];

    setHarmonies([
      { name: 'Monochromatic Layout', hexCodes: monochromatic },
      { name: 'Analogous Balance', hexCodes: analogous },
      { name: 'Complementary Contrast', hexCodes: complementaryList }
    ]);
  };

  // Re-calculate results when color values change
  useEffect(() => {
    const ratio = calculateContrast(bgColor, fgColor);
    setContrastRatio(ratio);

    // WCAG standard matching ratios:
    // Pass AA small text: >= 4.5:1
    // Pass AA large text: >= 3.0:1
    // Pass AAA small text: >= 7.0:1
    // Pass AAA large text: >= 4.5:1
    setPassAASmall(ratio >= 4.5);
    setPassAALarge(ratio >= 3.0);
    setPassAAASmall(ratio >= 7.0);
    setPassAAALarge(ratio >= 4.5);

    generateColorHarmonies(bgColor);
  }, [bgColor, fgColor]);

  const handleCopyHex = async (hex: string, label: string) => {
    try {
      await navigator.clipboard.writeText(hex);
      setIsCopied(label);
      setTimeout(() => setIsCopied(null), 1500);
    } catch {}
  };

  const handleFlipColors = () => {
    const temp = bgColor;
    setBgColor(fgColor);
    setFgColor(temp);
  };

  const loadPreset = (bg: string, fg: string) => {
    setBgColor(bg);
    setFgColor(fg);
  };

  const faqs = [
    {
      id: 1,
      question: "What are WCAG 2.1 color contrast criteria?",
      answer: "The WCAG guidelines ensure visual presentation of text stands out clearly against the background. For standard normal-size text, AA requires a contrast ratio of 4.5:1, and AAA requires 7:1. For large text (18pt / 24px and above), AA requires 3:1 and AAA requires 4.5:1."
    },
    {
      id: 2,
      question: "How is relative luminance computed?",
      answer: "Relative luminance corresponds to the relative brightness of any color channel normalized to a scale with black as 0 and white as 1. RGB channels are calculated using non-linear standard sRGB transforms."
    },
    {
      id: 3,
      question: "Does this tool work with CSS alpha transparencies?",
      answer: "No, contrast algorithms calculate direct flat hex arrays. For alpha levels, it calculates standard visual blending against opaque default layers. We suggest utilizing fully opaque source constants."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="contrast-palette-root">
      
      {/* Back button and title */}
      <div>
        <button 
          onClick={onNavigateHome}
          className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Tools
        </button>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-sans sm:text-4xl">
          WCAG Color <span className="text-indigo-600 dark:text-indigo-400">Contrast Checker & Palettes</span>
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
          Validate design components meets official WCAG AA and AAA accessibility thresholds. Tweak values with responsive interactive inputs and construct gorgeous contrasting color schemes.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm space-y-6">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <span className="flex items-center gap-1.5"><Sliders className="w-4 h-4 text-indigo-500" /> Color Adjuster</span>
            <button 
              onClick={handleFlipColors}
              className="text-[11px] bg-slate-100 hover:bg-slate-250 dark:bg-slate-900 px-2 py-1 rounded font-extrabold text-slate-600 dark:text-slate-300 transition-all"
            >
              Flip colors ⇄
            </button>
          </h3>

          <div className="space-y-4">
            {/* Background input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                Background Color (HEX)
              </label>
              <div className="flex gap-2.5">
                <input 
                  type="color" 
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value.toUpperCase())}
                  className="w-10 h-10 border-0 rounded-lg cursor-pointer shrink-0"
                />
                <input 
                  type="text" 
                  value={bgColor}
                  maxLength={7}
                  onChange={(e) => {
                    let hex = e.target.value;
                    if (!hex.startsWith('#')) hex = '#' + hex;
                    setBgColor(hex);
                  }}
                  className="w-full px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Foreground input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 font-mono">
                Text/Foreground Color (HEX)
              </label>
              <div className="flex gap-2.5">
                <input 
                  type="color" 
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value.toUpperCase())}
                  className="w-10 h-10 border-0 rounded-lg cursor-pointer shrink-0"
                />
                <input 
                  type="text" 
                  value={fgColor}
                  maxLength={7}
                  onChange={(e) => {
                    let hex = e.target.value;
                    if (!hex.startsWith('#')) hex = '#' + hex;
                    setFgColor(hex);
                  }}
                  className="w-full px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm uppercase font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Direct Presets */}
            <div>
              <span className="block text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-2 font-mono">Accessibility Presets</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: 'Dark Mode Blue', bg: '#0F172A', fg: '#F8FAFC' },
                  { label: 'High Contrast', bg: '#000000', fg: '#FFFFFF' },
                  { label: 'Warm Cream', bg: '#FFFDF9', fg: '#1C1917' },
                  { label: 'Forest Mint', bg: '#022C22', fg: '#ECFDF5' }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadPreset(p.bg, p.fg)}
                    className="p-2 border border-slate-205 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-left transition"
                  >
                    <span className="block text-[10px] font-bold text-slate-700 dark:text-slate-200">{p.label}</span>
                    <div className="flex gap-1 mt-1">
                      <span className="w-3.5 h-3.5 rounded border border-slate-100" style={{ backgroundColor: p.bg }} />
                      <span className="w-3.5 h-3.5 rounded border border-slate-100" style={{ backgroundColor: p.fg }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Display Analysis / Visual Mockups */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Left Box: Mock Preview */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3 flex items-center gap-1 font-mono">
                  <Eye className="w-3.5 h-3.5" /> Component Live Preview
                </span>
                
                {/* Visual rendering canvas */}
                <div 
                  className="rounded-xl p-6 border border-slate-100/50 shadow-inner flex flex-col justify-center min-h-[220px]"
                  style={{ backgroundColor: bgColor }}
                >
                  <h4 
                    className="font-extrabold tracking-tight mb-2" 
                    style={{ color: fgColor, fontSize: '24px' }}
                  >
                    Large Headline Preview (24px)
                  </h4>
                  <p 
                    className="leading-relaxed"
                    style={{ color: fgColor, fontSize: '14px' }}
                  >
                    This is normal paragraph text. In this canvas box we display your customized contrast settings instantly. Toggle back and background details above to test out.
                  </p>
                </div>
              </div>

              {/* Hex copies */}
              <div className="pt-4 flex gap-3 text-[11px] font-mono border-t border-slate-100 dark:border-slate-700 mt-2">
                <button 
                  onClick={() => handleCopyHex(bgColor, 'bg')}
                  className="flex items-center gap-1 text-slate-500 hover:text-indigo-500"
                >
                  {isCopied === 'bg' ? <Check className="w-3 h-3 text-emerald-500" /> : <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: bgColor }} />}
                  BG: {bgColor}
                </button>
                <button 
                  onClick={() => handleCopyHex(fgColor, 'fg')}
                  className="flex items-center gap-1 text-slate-500 hover:text-indigo-500 border-l border-slate-100 dark:border-slate-700 pl-3"
                >
                  {isCopied === 'fg' ? <Check className="w-3 h-3 text-emerald-500" /> : <span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: fgColor }} />}
                  FG: {fgColor}
                </button>
              </div>
            </div>

            {/* Right Box: Diagnostic Checklist metrics */}
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
              <span className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-3 font-mono">
                Diagnostic Analysis
              </span>

              {/* Large Score Circle */}
              <div className="flex items-center gap-4 border-b border-slate-105 dark:border-slate-700 pb-5">
                <div className="bg-indigo-50 dark:bg-indigo-950/20 px-5 py-4 rounded-xl text-center">
                  <span className="block text-xs font-bold text-indigo-500 uppercase tracking-widest leading-none mb-1 font-mono">Contrast</span>
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">{contrastRatio}:1</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white">WCAG Accessibility Score</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    {contrastRatio >= 7.0 
                      ? "Outstanding! Passes all AAA guidelines with flying colors." 
                      : contrastRatio >= 4.5 
                        ? "Passes normal Web standard guidelines (AA) safely."
                        : contrastRatio >= 3.0 
                          ? "Passes AA Large size criteria. Fails normal text sizing."
                          : "Poor readability. Fails essential accessibility rules."}
                  </p>
                </div>
              </div>

              {/* Checklist list */}
              <div className="mt-5 space-y-3">
                {[
                  { label: 'AA Small General Text (>= 4.5:1)', pass: passAASmall },
                  { label: 'AA Large Title Text (>= 3.0:1)', pass: passAALarge },
                  { label: 'AAA Small General Text (>= 7.0:1)', pass: passAAASmall },
                  { label: 'AAA Large Title Text (>= 4.5:1)', pass: passAAALarge }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item.label}</span>
                    <div className="flex items-center gap-1 font-bold">
                      {item.pass ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-sans"><CheckCircle2 className="w-4 h-4" /> Pass</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-0.5 font-sans"><XCircle className="w-4 h-4" /> Fail</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Color Harmonies & Palettes Builder bottom */}
          <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/80 rounded-2xl p-5 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-1.5 font-mono">
              <Palette className="w-4 h-4" /> Contrasting Layout Scheme Harmonies
            </h4>

            <div className="space-y-4">
              {harmonies.map((scheme, sIdx) => (
                <div key={sIdx} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700 rounded-xl">
                  <span className="block text-[10px] font-bold text-slate-500 uppercase mb-2 font-mono">{scheme.name}</span>
                  <div className="grid grid-cols-5 gap-1 sm:gap-2">
                    {scheme.hexCodes.map((hex, hexIdx) => (
                      <button
                        key={hexIdx}
                        onClick={() => handleCopyHex(hex, `scheme-${sIdx}-${hexIdx}`)}
                        className="group relative h-12 rounded-lg border border-slate-200 dark:border-slate-800 focus:outline-none transition-transform active:scale-95"
                        style={{ backgroundColor: hex }}
                      >
                        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-150 rounded-lg text-[9px] font-black text-white font-mono uppercase">
                          {isCopied === `scheme-${sIdx}-${hexIdx}` ? 'Copied' : hex}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* FAQs */}
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
