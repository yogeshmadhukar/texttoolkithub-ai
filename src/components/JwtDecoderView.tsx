import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TOOLS } from '../data.ts';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Trash2, 
  Copy, 
  Check, 
  Clock, 
  Download, 
  Eye, 
  EyeOff, 
  Sliders, 
  Search, 
  Key, 
  Code, 
  Lock, 
  Sparkles, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  BookmarkCheck, 
  Globe, 
  Terminal, 
  ArrowUpRight, 
  Layers,
  AlertTriangle,
  Info,
  Calendar,
  AlertCircle,
  FileCheck,
  CheckCircle,
  FolderTree,
  Scale,
  Cpu,
  BookOpen,
  XCircle,
  RefreshCw
} from 'lucide-react';

interface JwtDecoderViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

// Resilient browser-native unicode-safe Base64URL decoder with multi-layer fallback
function base64UrlDecode(str: string): string {
  // Normalize base64url characters back to standard base64 equivalents
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  
  try {
    // 1. Primary path: Decode standard base64 bytes to a Uint8Array then use TextDecoder for flawless UTF-8 handling
    const binaryStr = window.atob(base64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    try {
      // 2. Secondary fallback path: Standard decodeURIComponent escape approach
      const raw = window.atob(base64);
      return decodeURIComponent(
        Array.prototype.map.call(raw, (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')
      );
    } catch (e2) {
      // 3. Final raw binary characters decode
      return window.atob(base64);
    }
  }
}

// Resilient Base64URL encoder helper for generating presets and demos locally
function base64UrlEncode(obj: object): string {
  const jsonStr = JSON.stringify(obj);
  try {
    const bytes = new TextEncoder().encode(jsonStr);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = window.btoa(binary);
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  } catch (e) {
    const base64 = window.btoa(encodeURIComponent(jsonStr).replace(/%([0-9A-F]{2})/g, (match, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    }));
    return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  }
}

// Interactive JSON Tree Node with custom expand/collapse state overrides
interface JsonTreeNodeProps {
  name: string | number;
  value: any;
  depth?: number;
  isLast?: boolean;
  forceExpand?: boolean | null;
}

function JsonTreeNode({ name, value, depth = 0, isLast = true, forceExpand = null }: JsonTreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const isObject = value !== null && typeof value === 'object';

  // Synchronize expansion states on parent force overrides
  useEffect(() => {
    if (forceExpand !== null) {
      setIsExpanded(forceExpand);
    }
  }, [forceExpand]);

  if (isObject) {
    const keys = Object.keys(value);
    const isArrayByCheck = Array.isArray(value);
    const openBrack = isArrayByCheck ? '[' : '{';
    const closeBrack = isArrayByCheck ? ']' : '}';

    if (keys.length === 0) {
      return (
        <div className="font-mono text-[11px] sm:text-xs py-0.5" style={{ paddingLeft: `${depth * 12}px` }}>
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{name !== '' ? `"${name}": ` : ''}</span>
          <span className="text-slate-500 dark:text-slate-400">{openBrack}{closeBrack}</span>
          {!isLast && <span className="text-slate-400">,</span>}
        </div>
      );
    }

    return (
      <div className="font-mono text-[11px] sm:text-xs">
        <div 
          onClick={() => setIsExpanded(!isExpanded)} 
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { setIsExpanded(!isExpanded); e.preventDefault(); } }}
          className="flex items-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 py-0.5 rounded px-1 -ml-1 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label={`Toggle key ${name}`}
        >
          <span className="text-slate-400 dark:text-slate-500">
            {isExpanded ? <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> : <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />}
          </span>
          {name !== '' && (
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
              {typeof name === 'number' ? name : `"${name}"`}:{' '}
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400 font-bold">{openBrack}</span>
          {!isExpanded && (
            <span className="text-slate-400 dark:text-slate-500 text-[10px] ml-1 select-none">
              {keys.length} {keys.length === 1 ? 'item' : 'items'} ... {closeBrack}
              {!isLast && <span className="text-slate-400">,</span>}
            </span>
          )}
        </div>
        
        {isExpanded && (
          <div className="border-l border-slate-200 dark:border-slate-800 ml-1.5 pl-3.5 space-y-0.5">
            {keys.map((k, i) => (
              <JsonTreeNode 
                key={k} 
                name={isArrayByCheck ? i : k} 
                value={value[k]} 
                depth={depth + 1} 
                isLast={i === keys.length - 1} 
                forceExpand={forceExpand}
              />
            ))}
          </div>
        )}
        
        {isExpanded && (
          <div className="pl-4 text-slate-500 dark:text-slate-400 select-none">
            {closeBrack}
            {!isLast && <span className="text-slate-400">,</span>}
          </div>
        )}
      </div>
    );
  }

  // Formatting values for primitives
  let formattedValue = '';
  let valueStyle = 'text-green-600 dark:text-green-400';

  if (value === null) {
    formattedValue = 'null';
    valueStyle = 'text-slate-400 dark:text-slate-500 font-bold';
  } else if (typeof value === 'boolean') {
    formattedValue = value ? 'true' : 'false';
    valueStyle = 'text-amber-600 dark:text-amber-400 font-bold';
  } else if (typeof value === 'number') {
    formattedValue = value.toString();
    valueStyle = 'text-blue-600 dark:text-blue-400';
  } else if (typeof value === 'string') {
    formattedValue = `"${value}"`;
    valueStyle = 'text-green-600 dark:text-green-400 break-all whitespace-pre-wrap';
  } else {
    formattedValue = String(value);
  }

  // Check if standard key triggers timing labels (exp, iat, nbf)
  const isTimeClaim = typeof name === 'string' && ['exp', 'iat', 'nbf'].includes(name) && typeof value === 'number';

  return (
    <div className="font-mono text-[11px] sm:text-xs py-0.5 flex flex-wrap items-baseline" style={{ paddingLeft: `${depth * 12}px` }}>
      <span className="text-purple-600 dark:text-purple-400 font-semibold">
        {typeof name === 'number' ? name : `"${name}"`}:{' '}
      </span>
      <span className={`ml-1 ${valueStyle}`}>{formattedValue}</span>
      {!isLast && <span className="text-slate-400 mr-2">,</span>}
      {isTimeClaim && (
        <span className="text-[10px] text-slate-400 dark:text-slate-505 bg-slate-100 dark:bg-slate-900/80 px-1 py-0.5 rounded italic ml-2 select-none">
          ({new Date(value * 1000).toLocaleString()})
        </span>
      )}
    </div>
  );
}

// Pretty print syntax highlights for fallback purely visual views
function highlightJsonCode(text: string): React.ReactNode {
  try {
    const parsed = JSON.parse(text);
    const formatted = JSON.stringify(parsed, null, 2);
    const lines = formatted.split('\n');
    return (
      <div className="font-mono text-[11px] sm:text-xs space-y-0.5 whitespace-pre overflow-x-auto leading-relaxed">
        {lines.map((line, idx) => {
          let styledLine: React.ReactNode = line;
          const matchKeyValue = line.match(/^(\s*)("([^"]+)")(\s*:\s*)(.*)$/);
          
          if (matchKeyValue) {
            const spaces = matchKeyValue[1];
            const keyStr = matchKeyValue[2];
            const colon = matchKeyValue[4];
            const valPart = matchKeyValue[5];

            let styledVal: React.ReactNode = valPart;
            if (valPart.endsWith(',')) {
              const cleanedVal = valPart.slice(0, -1);
              styledVal = (
                <>
                  {renderValElement(cleanedVal)}
                  <span className="text-slate-400">,</span>
                </>
              );
            } else {
              styledVal = renderValElement(valPart);
            }

            styledLine = (
              <>
                {spaces}
                <span className="text-purple-500 dark:text-purple-400 font-semibold">{keyStr}</span>
                <span className="text-slate-500">{colon}</span>
                {styledVal}
              </>
            );
          }

          return <div key={idx}>{styledLine}</div>;
        })}
      </div>
    );
  } catch (e) {
    return <div className="font-mono text-[11px] sm:text-xs break-all whitespace-pre-wrap">{text}</div>;
  }
}

function renderValElement(valStr: string): React.ReactNode {
  const trimmed = valStr.trim();
  if (trimmed === 'null') {
    return <span className="text-slate-400 dark:text-slate-500 font-bold">null</span>;
  }
  if (trimmed === 'true' || trimmed === 'false') {
    return <span className="text-amber-600 dark:text-amber-400 font-bold">{trimmed}</span>;
  }
  if (/^-?\d+\.?\d*$/.test(trimmed)) {
    return <span className="text-blue-500 dark:text-blue-400">{trimmed}</span>;
  }
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return <span className="text-green-600 dark:text-green-400 break-all">{trimmed}</span>;
  }
  return <span className="text-slate-600 dark:text-slate-350">{trimmed}</span>;
}

// Standalone performance-friendly relative expiration timer
// This isolates 1-second state updates, protecting the main JWT trees and parser outputs from lag
interface ExpirationTickerProps {
  expEpoch: number | undefined;
  nbfEpoch: number | undefined;
  onStatusChange?: (status: 'active' | 'expired' | 'not-active' | 'none') => void;
}

function ExpirationTicker({ expEpoch, nbfEpoch, onStatusChange }: ExpirationTickerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!expEpoch) {
      setSecondsRemaining(null);
      if (onStatusChange) onStatusChange('none');
      return;
    }

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      
      // Determine overall state status
      if (nbfEpoch && now < nbfEpoch) {
        if (onStatusChange) onStatusChange('not-active');
      } else if (now > expEpoch) {
        if (onStatusChange) onStatusChange('expired');
      } else {
        if (onStatusChange) onStatusChange('active');
      }

      setSecondsRemaining(expEpoch - now);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expEpoch, nbfEpoch]);

  const getStatusDisplay = () => {
    const now = Math.floor(Date.now() / 1000);
    
    if (nbfEpoch && now < nbfEpoch) {
      const diff = nbfEpoch - now;
      return {
        badge: (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px] rounded-full border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            Not Yet Active
          </span>
        ),
        text: `Becomes valid in ${formatTimeSpan(diff)}`
      };
    }

    if (!expEpoch) {
      return {
        badge: (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] rounded-full border border-slate-500/20">
            <Info className="w-3.5 h-3.5" />
            No Expiration Claim
          </span>
        ),
        text: "Infinite lifetime (Risky session model)"
      };
    }

    const difference = expEpoch - now;
    if (difference < 0) {
      return {
        badge: (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold uppercase tracking-wider text-[10px] rounded-full border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            Session Expired
          </span>
        ),
        text: `Expired ${formatTimeSpan(Math.abs(difference))} ago`
      };
    }

    return {
      badge: (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-555/10 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px] rounded-full border border-emerald-500/20">
          <FileCheck className="w-3.5 h-3.5" />
          Token Active & Valid
        </span>
      ),
      text: `Expires in ${formatTimeSpan(difference)}`
    };
  };

  const formatTimeSpan = (secCount: number) => {
    const days = Math.floor(secCount / 86400);
    const hours = Math.floor((secCount % 86400) / 3600);
    const mins = Math.floor((secCount % 3600) / 60);
    const secs = secCount % 60;

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0 || days > 0) parts.push(`${hours}h`);
    if (mins > 0 || hours > 0 || days > 0) parts.push(`${mins}m`);
    parts.push(`${secs}s`);

    return parts.join(' ');
  };

  const display = getStatusDisplay();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 bg-slate-50 dark:bg-slate-900/70 rounded-2xl border border-slate-150 dark:border-slate-850 shadow-inner">
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Active Lifecycle Verification
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status Score:</span>
          {display.badge}
        </div>
      </div>
      
      <div className="flex flex-col sm:text-right gap-1 pt-3 sm:pt-0 border-t sm:border-0 border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 flex items-center gap-1 sm:justify-end">
          <Clock className="w-3 h-3 text-indigo-500" /> Dynamic Remaining Lifecycle
        </span>
        <span className="font-mono text-xs sm:text-sm font-bold text-indigo-650 dark:text-indigo-400 leading-none">
          {display.text}
        </span>
      </div>
    </div>
  );
}

export default function JwtDecoderView({ onNavigateToTool, onNavigateHome }: JwtDecoderViewProps) {
  const [tokenInput, setTokenInput] = useState<string>('');
  
  // Custom Character Diagnostic Errors
  const [characterDiagnostic, setCharacterDiagnostic] = useState<{
    type: 'error' | 'warning' | null;
    message: string;
  }>({ type: null, message: '' });

  // Decoded payload segments state
  const [headerText, setHeaderText] = useState<string>('');
  const [payloadText, setPayloadText] = useState<string>('');
  const [signatureHex, setSignatureHex] = useState<string>('');
  const [signatureAlgorithm, setSignatureAlgorithm] = useState<string>('');
  const [signatureType, setSignatureType] = useState<string>('');
  
  const [parsedHeader, setParsedHeader] = useState<any>(null);
  const [parsedPayload, setParsedPayload] = useState<any>(null);

  // Toggle tree styles override overrides
  const [headerForceExpand, setHeaderForceExpand] = useState<boolean | null>(null);
  const [payloadForceExpand, setPayloadForceExpand] = useState<boolean | null>(null);

  // Toggle code representation tabs
  const [headerTab, setHeaderTab] = useState<'tree' | 'raw'>('tree');
  const [payloadTab, setPayloadTab] = useState<'tree' | 'raw'>('tree');

  // Copy success status triggers
  const [copiedToken, setCopiedToken] = useState<boolean>(false);
  const [copiedHeader, setCopiedHeader] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);

  // Accordion lists and meta sliders
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState<boolean>(false);

  // Selected custom explainer tab
  const [activeGlossaryTab, setActiveGlossaryTab] = useState<'all' | 'header' | 'payload' | 'security'>('all');

  const seoTitle = "JWT Decoder & Debugger – Decode JWT Tokens Securely Online";
  const seoDescription = "Decode JWT tokens instantly in your browser. Inspect JWT headers, payloads, expiration dates, claims, and security details without sending data to any server.";

  // Dynamic preset trigger injection
  const loadDynamicPresetTokens = (type: 'active' | 'expired' | 'insecure') => {
    const epochNow = Math.floor(Date.now() / 1000);
    
    if (type === 'active') {
      const h = { alg: "RS256", typ: "JWT", kid: "public-signing-key-v1" };
      const p = {
        iss: "https://auth.texttoolkithub.com",
        sub: "dev_user_77a911e3b",
        aud: "https://api.texttoolkithub.com",
        name: "Yogesh Madhukar",
        email: "yogeshmadhukar.author@gmail.com",
        role: "Premium Enterprise Developer",
        permissions: ["read:tools", "write:sandbox", "execute:local"],
        iat: epochNow - 60, 
        nbf: epochNow - 60,
        exp: epochNow + 7200, // 2 hours duration
        jti: "jwt_serial_887e2b61f"
      };
      setTokenInput(createDemoJwt(h, p));
    } else if (type === 'expired') {
      const h = { alg: "ES256", typ: "JWT", kid: "key-ecdsa-p256" };
      const p = {
        iss: "https://corporate.identity.internal",
        sub: "guest_session_9138",
        aud: "https://secure-portal.internal",
        iat: epochNow - 86400, // Created 24 hours ago
        exp: epochNow - 1800 // Expired 30 minutes ago
      };
      setTokenInput(createDemoJwt(h, p, 'MEYCIQCc-6C_W7uWd1LptvLz_G0z-hLp_0XgPy4C66E_Dq0gMQIhANY5fM7K7Xv9gS_hX_fX_rT8Z_wG8P_D1C'));
    } else if (type === 'insecure') {
      const h = { alg: "none", typ: "JWT" };
      const p = {
        sub: "unauthorized_root_escalation",
        auth_level: "unlimited_su_bypass",
        notice: "WARNING: This token is signature-free and missing exp/iss/aud tags. Absolute design risk."
      };
      setTokenInput(createDemoJwt(h, p, ''));
    }
  };

  const createDemoJwt = (header: object, payload: object, sig: string = 'yS_YnIqgWh7V0LwS_x6F2bZ8hN_vP_uG3O_k4-tL8_A') => {
    try {
      const hEnc = base64UrlEncode(header);
      const pEnc = base64UrlEncode(payload);
      return `${hEnc}.${pEnc}.${sig}`;
    } catch (e) {
      return '';
    }
  };

  // Perform character-set compliance check and split segments cleanly
  const parsedSegments = useMemo(() => {
    const trimmed = tokenInput.trim();
    if (!trimmed) {
      return {
        hasStructureError: false,
        errorMessage: '',
        parts: [] as string[],
        isValidCharSet: true
      };
    }

    const dotsCount = (trimmed.match(/\./g) || []).length;
    if (dotsCount !== 2) {
      return {
        hasStructureError: true,
        errorMessage: `Unrecognized formatting sequence: A valid JWT requires exactly 2 dots dividing 3 individual blocks (Header, Payload, and Signature). Your currently pasted text contains ${dotsCount} dots (${dotsCount + 1} segments).`,
        parts: [],
        isValidCharSet: false
      };
    }

    const segments = trimmed.split('.');
    
    // Check validation of Base64URL characters: alphanumeric, hyphen, and underscores ONLY
    const base64UrlPattern = /^[A-Za-z0-9_-]*$/;
    let malformedSegmentIndex = -1;
    let explicitCodeMsg = '';

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      if (seg.length > 0 && !base64UrlPattern.test(seg)) {
        malformedSegmentIndex = i;
        if (/\s/.test(seg)) {
          explicitCodeMsg = `Segment ${i + 1} contains illegal spacing/whitespace characters. Please copy and paste clean token values.`;
        } else if (/[+=/]/.test(seg)) {
          explicitCodeMsg = `Segment ${i + 1} appears to use default standard Base64 characters ("+", "/", or "="). A JWT requires strictly URL-Safe Base64URL notation ("-" and "_" instead).`;
        } else {
          explicitCodeMsg = `Segment ${i + 1} holds unacceptable illegal symbol characters. Real JWTs use strictly alphanumeric, hyphen, and underscore markers.`;
        }
        break;
      }
    }

    if (malformedSegmentIndex !== -1) {
      return {
        hasStructureError: true,
        errorMessage: explicitCodeMsg,
        parts: segments,
        isValidCharSet: false
      };
    }

    return {
      hasStructureError: false,
      errorMessage: '',
      parts: segments,
      isValidCharSet: true
    };
  }, [tokenInput]);

  // Decode the token updates as soon as the parsedSegments memo changes
  useEffect(() => {
    if (!tokenInput.trim() || parsedSegments.hasStructureError) {
      setHeaderText('');
      setPayloadText('');
      setSignatureHex('');
      setSignatureAlgorithm('');
      setSignatureType('');
      setParsedHeader(null);
      setParsedPayload(null);
      return;
    }

    const [headerB64, payloadB64, signatureB64] = parsedSegments.parts;

    // 1. Decapsulate Header Segment
    if (headerB64) {
      try {
        const decoded = base64UrlDecode(headerB64);
        setHeaderText(decoded);
        const parsed = JSON.parse(decoded);
        setParsedHeader(parsed);
        setSignatureAlgorithm(parsed.alg || 'unknown');
        setSignatureType(parsed.typ || 'JWT');
      } catch (e) {
        setHeaderText('/* MALFORMED HEADER DATA: Could not decode segment into correct JSON */');
        setParsedHeader(null);
        setSignatureAlgorithm('malformed');
      }
    }

    // 2. Decapsulate Payload Segment
    if (payloadB64) {
      try {
        const decoded = base64UrlDecode(payloadB64);
        setPayloadText(decoded);
        const parsed = JSON.parse(decoded);
        setParsedPayload(parsed);
      } catch (e) {
        setPayloadText('/* MALFORMED PAYLOAD DATA: Could not decode segment into correct JSON */');
        setParsedPayload(null);
      }
    }

    // 3. Set signature hex
    setSignatureHex(signatureB64 || '');

  }, [tokenInput, parsedSegments]);

  // Sync Document properties for SEO values
  useEffect(() => {
    const previousTitle = document.title;
    document.title = seoTitle;

    const previousDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const descriptionElement = document.querySelector('meta[name="description"]');
    if (descriptionElement) {
      descriptionElement.setAttribute('content', seoDescription);
    }

    return () => {
      document.title = previousTitle;
      if (descriptionElement) {
        descriptionElement.setAttribute('content', previousDescription);
      }
    };
  }, []);

  // Pre-load default preset active demo on initial mount
  useEffect(() => {
    loadDynamicPresetTokens('active');
  }, []);

  // Cleanup local state variables fully
  const handleClearAll = () => {
    setTokenInput('');
    setHeaderForceExpand(null);
    setPayloadForceExpand(null);
  };

  const copyToClipboard = (text: string, triggerCopyState: (v: boolean) => void) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      triggerCopyState(true);
      setTimeout(() => triggerCopyState(false), 2000);
    });
  };

  // Safe file export using Blob constructs and clear mime attributes
  const handleDownloadFile = (filename: string, textContent: string) => {
    if (!textContent) return;
    
    let formattedBlobContent = textContent;
    try {
      // Re-format JSON with correct double-space outputs for readability
      formattedBlobContent = JSON.stringify(JSON.parse(textContent), null, 2);
    } catch (e) {}

    const blob = new Blob([formattedBlobContent], { type: 'application/json;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    
    // Explicit anchor mapping preventing router hooks
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = filename;
    downloadAnchor.style.display = 'none';
    
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    
    // Remove element and revoke blob URL
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(blobUrl);
  };

  // Run structured evaluation for local vulnerability checks
  const calculatedSecurityAudits = useMemo(() => {
    const audits: {
      id: string;
      status: 'critical' | 'warning' | 'success';
      title: string;
      desc: string;
      remedy: string;
    }[] = [];

    if (!parsedHeader) return audits;

    // 1. None Algorithm Attack Check
    const algorithm = (parsedHeader.alg || '').toLowerCase();
    if (algorithm === 'none') {
      audits.push({
        id: 'exploit-none',
        status: 'critical',
        title: 'Critical "none" Signing Vulnerability',
        desc: 'The token explicitly specifies "none" as the cryptographic signature algorithm. This instructs the verification handler to bypass authentication controls entirely. Attackers can alter names, scopes, and su privileges without sign verification.',
        remedy: 'Reject any incoming JWT using algorithm "none" at the gateway API level.'
      });
    } else if (algorithm === 'hs256' || algorithm === 'hs384' || algorithm === 'hs512') {
      audits.push({
        id: 'weak-symmetric',
        status: 'warning',
        title: 'Symmetric Cryptography Algorithm Detected',
        desc: `This token uses symmetric ${algorithm.toUpperCase()} signing. Server validators and clients share the exact same key. If client environments are compromised, attackers can forge custom tokens.`,
        remedy: 'Transition to asymmetric key-pairs (RS256, ES256, or EdDSA) where clients can only read public keys.'
      });
    } else {
      audits.push({
        id: 'secure-asymmetric',
        status: 'success',
        title: `Secure Asymmetric Algorithm (${algorithm.toUpperCase()})`,
        desc: 'Decoupled cryptographic signing mechanisms ensure public keys alone cannot forge signatures.',
        remedy: 'Maintain modern key rotation.'
      });
    }

    // 2. Expiration Time checks
    if (parsedPayload) {
      if (!parsedPayload.exp) {
        audits.push({
          id: 'missing-exp',
          status: 'critical',
          title: 'Missing "exp" Expiration Timestamp Claim',
          desc: 'This token does not carry an exp claim. This means the token never expires and remains cryptographically valid indefinitely. Intercepted tokens allow infinite session hijacking.',
          remedy: 'Enforce a reasonable, short-lived exp value (e.g. 15m to 2h) for client-access tokens.'
        });
      } else {
        const span = parsedPayload.exp - (parsedPayload.iat || Math.floor(Date.now() / 1000));
        if (span > 86450 * 14) {
          audits.push({
            id: 'long-expiration',
            status: 'warning',
            title: 'Excessive Token Lifespan Lifetime',
            desc: `This token carries an expiration duration surpassing 14 days (${Math.floor(span / 86400)} days total). Extended lifespan increases exposure surface for storage leakage.`,
            remedy: 'Reduce life window, and pair client credentials with server-side validation rotation tokens.'
          });
        }
      }

      // 3. Issuer and Audience existence Checks
      if (!parsedPayload.iss) {
        audits.push({
          id: 'missing-iss',
          status: 'warning',
          title: 'Missing "iss" (Issuer) Identity parameters',
          desc: 'Without an iss claim, clients and middleware cannot deterministically audit the security authority that signed this credentials.',
          remedy: 'Set a unique domain URL identifier as the issuer authority.'
        });
      }
      if (!parsedPayload.aud) {
        audits.push({
          id: 'missing-aud',
          status: 'warning',
          title: 'Missing "aud" (Audience) Target parameters',
          desc: 'No audience bound matches this token. It can be potentially reused across different microservices, facilitating credentials reflection attacks.',
          remedy: 'Verify the audience against recipient API addresses during checking pipelines.'
        });
      }
    }

    // 4. Confidentiality alert
    audits.push({
      id: 'payload-plaintext-warning',
      status: 'warning',
      title: 'Decoded Token in Plaintext (No Data Encryption)',
      desc: 'Base64URL formatting is NOT encryption. This header and body can be instantly interpreted by anyone with base64 utilities.',
      remedy: 'Do not include passwords, API key credentials, or financial numbers inside claims.'
    });

    return audits;
  }, [parsedHeader, parsedPayload]);

  // Interactive visual token splitter representation
  const renderVisualSplitterSegments = () => {
    if (!tokenInput.trim()) {
      return (
        <div className="text-center py-6 text-slate-400 dark:text-slate-500 italic text-xs select-none">
          Waiting for JSON Web Token segments...
        </div>
      );
    }
    
    if (parsedSegments.hasStructureError && parsedSegments.parts.length === 0) {
      return (
        <div className="text-xs text-rose-500 bg-rose-500/5 p-3 rounded-xl border border-rose-500/20 font-mono break-all leading-normal">
          {parsedSegments.errorMessage}
        </div>
      );
    }

    const segmentsText = tokenInput.split('.');
    return (
      <div className="font-mono text-[11px] sm:text-xs break-all leading-6 text-slate-700 dark:text-slate-300 p-1 select-text">
        <span 
          className="text-rose-600 dark:text-rose-400 font-bold bg-rose-500/5 dark:bg-rose-500/10 hover:bg-rose-500/20 p-1 rounded-md transition cursor-help border border-rose-500/20"
          title="Header (Algorithms used and Typ identification)"
        >
          {segmentsText[0]}
        </span>
        <span className="text-slate-400 font-bold select-none p-0.5">.</span>
        {segmentsText[1] && (
          <span 
            className="text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-500/5 dark:bg-indigo-500/10 hover:bg-indigo-500/20 p-1 rounded-md transition cursor-help border border-indigo-500/18"
            title="Payload body content (Custom and reserved claims)"
          >
            {segmentsText[1]}
          </span>
        )}
        {segmentsText[2] !== undefined && (
          <>
            <span className="text-slate-400 font-bold select-none p-0.5">.</span>
            <span 
              className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/5 dark:bg-emerald-500/10 hover:bg-emerald-500/20 p-1 rounded-md transition cursor-help border border-emerald-500/18"
              title="Signature authentication block"
            >
              {segmentsText[2] || '[Empty Signature block]'}
            </span>
          </>
        )}
      </div>
    );
  };

  // Structured claims glossary directory
  const claimsGlossary = [
    {
      segment: 'header',
      name: 'alg',
      fullName: 'Algorithm',
      desc: 'The cryptographic algorithm used to secure the signature (e.g. RS256, ES256, HS256, or none).'
    },
    {
      segment: 'header',
      name: 'typ',
      fullName: 'Type',
      desc: 'The media type of this complete token. Almost always set as JWT.'
    },
    {
      segment: 'header',
      name: 'kid',
      fullName: 'Key ID',
      desc: 'A unique identifier referencing the exact cryptographic public validator key used to trace the signature.'
    },
    {
      segment: 'payload',
      name: 'iss',
      fullName: 'Issuer',
      desc: 'Identifies the security authority/identity provider that issued the JWT.'
    },
    {
      segment: 'payload',
      name: 'sub',
      fullName: 'Subject',
      desc: 'The unique local identifier of the user, account, or microservice profile whom the token belongs to.'
    },
    {
      segment: 'payload',
      name: 'aud',
      fullName: 'Audience',
      desc: 'Identifies the recipient servers, target clients, or micro-API scopes that accept the token payload.'
    },
    {
      segment: 'payload',
      name: 'exp',
      fullName: 'Expiration Time',
      desc: 'Defines the exact Unix epoch time after which the token must be rejected as invalid.'
    },
    {
      segment: 'payload',
      name: 'nbf',
      fullName: 'Not Before',
      desc: 'Specifies the earliest Unix epoch time before which the token cannot be accepted.'
    },
    {
      segment: 'payload',
      name: 'iat',
      fullName: 'Issued At',
      desc: 'Logs the exact Unix epoch time indicating when the signoff authority compiled and outputted this token.'
    },
    {
      segment: 'payload',
      name: 'jti',
      fullName: 'JWT ID',
      desc: 'A unique serial number string for the token, ideal for tracking and preventing replay attacks.'
    }
  ];

  const filteredGlossary = useMemo(() => {
    if (activeGlossaryTab === 'all') return claimsGlossary;
    if (activeGlossaryTab === 'header') return claimsGlossary.filter(item => item.segment === 'header');
    if (activeGlossaryTab === 'payload') return claimsGlossary.filter(item => item.segment === 'payload');
    return []; // For custom filters if any
  }, [activeGlossaryTab]);

  const faqs = [
    {
      id: 1,
      question: "Are my JSON Web Tokens securely cached or saved?",
      answer: "No. The JWT Decoder is designed and built 100% locally using standard web browser sandbox containers. No external server receives, stores or logs any data. Your keys stay in browser memory and are wiped clean immediately upon exit or resetting."
    },
    {
      id: 2,
      question: "Why does standard Base64 decoding fail on JWS segments?",
      answer: "JSON Web Tokens rely on 'Base64URL' format. Unlike typical Base64 encoding, Base64URL discards trailing padding '=' markers and replaces '+' with '-' and '/' with '_'. This ensures safety inside HTTP headers and query strings without manual escaping."
    },
    {
      id: 3,
      question: "What is the difference between symmetrically and asymmetrically signed JWTs?",
      answer: "Symmetric algorithms like HS256 utilize a single shared client secret key to both sign and verify the token. Any leak allows attackers to forge tokens. Asymmetric algorithms like RS256/ES256 decouple security: they use a private key to sign the JWT, and a public key for validation, eliminating client signature exploits."
    },
    {
      id: 4,
      question: "How should I safeguard storage of client-side JWTs?",
      answer: "Avoid storing sensitive authentication tokens in LocalStorage or SessionStorage since they are vulnerable to Cross-Site Scripting (XSS). Prefer secure HttpOnly cookies coupled with SameSite attributes to defend against XSS and CSRF hijacking."
    },
    {
      id: 5,
      question: "Why should we include 'exp' and 'jti' parameters in standard builds?",
      answer: "Including 'exp' guarantees tokens expire, avoiding permanent session compromises. Coupling this with JWT IDs ('jti') allows server validators to track used serial tokens, flagging any replay execution instantly."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="jwt-debugger-parent-container">
      
      {/* JSON-LD Schema structures for Search Engine Optimization crawls */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "JWT Decoder & Debugger",
          "description": "Decode, inspect, and validate JSON Web Tokens securely and locally with real-time expiration checks.",
          "applicationCategory": "DeveloperApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires HTML5 compatible browser",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          },
          "author": {
            "@type": "Organization",
            "name": "TextToolkitHub"
          }
        })}
      </script>

      {/* SEO Faq schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          }))
        })}
      </script>

      {/* Structured Breadcrumbs */}
      <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-450 dark:text-slate-500 mb-6" aria-label="Breadcrumb" id="jwt-nav-breadcrumbs">
        <button 
          onClick={onNavigateHome} 
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1 cursor-pointer"
          id="btn-nav-home"
        >
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-slate-350" />
        <button 
          onClick={() => onNavigateToTool('tools')} 
          className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
          id="btn-nav-tools"
        >
          Tools
        </button>
        <ChevronRight className="w-3 h-3 text-slate-350" />
        <span className="text-slate-800 dark:text-slate-350 font-medium" aria-current="page">JWT Decoder</span>
      </nav>

      {/* Hero Visual Header */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 mb-8 border-b border-slate-150 dark:border-slate-800">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Pro Security
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full">
              GDPR-Compliant Sandbox
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-tight">
            JWT Decoder & <span className="text-indigo-600 dark:text-indigo-400">Debugger</span>
          </h1>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mt-2 leading-relaxed">
            Decode, analyze, and validate cryptographic tokens entirely in raw sandbox memory. Audit claim lifecycles, parse custom token claims, evaluate warnings, and export structures locally.
          </p>
        </div>

        {/* Dynamic SEO Inspector Accordion button */}
        <button
          onClick={() => setShowSeoMeta(!showSeoMeta)}
          className="flex items-center gap-1.5 px-3.5 py-2 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-300 bg-white dark:bg-slate-950 dark:hover:bg-slate-905 transition shrink-0 self-start lg:self-auto cursor-pointer"
          id="btn-inspect-meta"
          aria-expanded={showSeoMeta}
          aria-controls="seo-inspector-card-panel"
        >
          <Globe className="w-4 h-4 text-indigo-500" />
          {showSeoMeta ? 'Collapse Search Previews' : 'Inspect Google Previews'}
        </button>
      </header>

      {/* SEO Engine Previews Block */}
      <AnimatePresence>
        {showSeoMeta && (
          <motion.section 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.25 }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-indigo-150 dark:border-slate-800 bg-indigo-50/5 dark:bg-slate-950 p-6 rounded-2xl mb-8 overflow-hidden"
            id="seo-inspector-card-panel"
            aria-label="SEO Metadata Audits"
          >
            <div className="flex items-center gap-2 mb-4 text-xs font-extrabold text-indigo-650 dark:text-indigo-400 uppercase tracking-wider">
              <BookmarkCheck className="w-4.5 h-4.5" /> High-Performance SEO Tag indexation Previews
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2 font-mono">Google search results</span>
                <div className="text-xs text-emerald-600 dark:text-emerald-500 font-mono mb-1 truncate">
                  https://texttoolkithub.com/tools/jwt-decoder
                </div>
                <h3 className="text-base sm:text-lg font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer mb-1.5">
                  JWT Decoder & Debugger – Decode JWT Tokens Securely Online
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  Decode JWT tokens instantly in your browser. Inspect JWT headers, payloads, expiration dates, claims, and security details without sending data to any server.
                </p>
              </div>

              <div className="p-4 bg-slate-100/50 dark:bg-slate-900/40 rounded-xl flex flex-col justify-center text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-350 block mb-1">Target Keywords Optimization:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {['jwt decoder', 'jwt debugger', 'decode jwt token', 'jwt parser', 'jwt token analyzer', 'jwt payload decoder', 'jwt inspector', 'jwt validator'].map((k, i) => (
                    <span key={i} className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px] rounded text-slate-600 dark:text-slate-350">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Preset Token Injectors Dashboard */}
      <section className="border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950 p-4.5 sm:p-5 rounded-2xl mb-8" aria-label="Demo presets injector widget">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 mb-3 flex items-center gap-1.5 select-none">
          <Sparkles className="w-4.5 h-4.5 text-indigo-500" /> Choose Interactive Sandbox Presets
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => loadDynamicPresetTokens('active')}
            className="px-3 py-2 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
            title="Load valid token with RS256 signing keys and active lifetime"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-550 animate-pulse"></span> Valid Admin JWT (Active)
          </button>
          
          <button
            onClick={() => loadDynamicPresetTokens('expired')}
            className="px-3 py-2 text-xs font-bold bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
            title="Load ECDSA signed token expired 30 minutes ago"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-550"></span> Session Expired JWT
          </button>

          <button
            onClick={() => loadDynamicPresetTokens('insecure')}
            className="px-3 py-2 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
            title="Inject insecure JWT with none algorithm to test vulnerability triggers"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Insecure "none" Algorithm JWT
          </button>
        </div>
      </section>

      {/* Main Splits workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        
        {/* LEFT COMPONENT: Pasted Input segment panel (5 columns on desktop) */}
        <section className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6" aria-label="JWT Raw Input">
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 rounded-2xl shadow-sm flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <label htmlFor="jwt-bearer-textarea" className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 flex items-center gap-2 select-none">
                <Terminal className="w-4 h-4 text-indigo-500" /> Enter Encoded JWT String
              </label>
              
              {tokenInput && (
                <button
                  onClick={handleClearAll}
                  className="text-slate-400 hover:text-rose-600 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  title="Clear inputs completely"
                  id="btn-clear-token"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {/* Input area wrap */}
            <div className="relative">
              <textarea
                id="jwt-bearer-textarea"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Paste your base64 URL encoded JWT credentials here (header.payload.signature)..."
                className="w-full h-80 p-4 border border-slate-250 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 text-slate-900 dark:text-slate-100 font-mono text-[11px] sm:text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-550 transition-all outline-none resize-none"
                aria-required="true"
                aria-invalid={parsedSegments.hasStructureError}
              />
              {!tokenInput && (
                <div className="absolute inset-x-4 top-20 pointer-events-none text-center py-6 select-none">
                  <Key className="w-10 h-10 text-slate-350 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Paste raw credentials, or select a pre-populated sandbox preset. Let the local parsing engine dissect payloads instantly.
                  </p>
                </div>
              )}
            </div>

            {/* Action panel triggers for copying the input */}
            {tokenInput && (
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(tokenInput, setCopiedToken)}
                  className="flex-1 py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  aria-label="Copy input token"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" /> Saved to Clipboard!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-indigo-500" /> Copy Paste Values
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Parsing error Alerts */}
            {parsedSegments.hasStructureError && (
              <div className="p-4 border border-rose-150 dark:border-rose-950 bg-rose-50/30 dark:bg-rose-950/15 rounded-xl flex items-start gap-3" role="alert">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-550 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold leading-relaxed">
                  {parsedSegments.errorMessage}
                </div>
              </div>
            )}

            {/* Segment Highlighting Block */}
            {tokenInput && !parsedSegments.hasStructureError && (
              <div className="border-t border-slate-150 dark:border-slate-850 pt-4" id="segment-splitter-wrapper">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2 select-none">
                  Segment Coloring Breakdown
                </span>
                <div className="bg-slate-50/60 dark:bg-slate-900/10 border border-slate-150 dark:border-slate-900 p-4 rounded-xl leading-relaxed font-semibold">
                  {renderVisualSplitterSegments()}
                </div>
              </div>
            )}

          </div>

          {/* Secure Environment Guarantee note */}
          <section className="border border-slate-150 dark:border-slate-800 p-5 rounded-2xl bg-white dark:bg-slate-950">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 mb-2 select-none">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" /> Decentralized Security Standards
            </h4>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Every cryptographic decode routine, claims dissection tab, and compliance countdown tracker compiles directly inside memory registers configured strictly within your local browsing agent. Zero token data ever transverses our network.
            </p>
          </section>
        </section>

        {/* RIGHT COMPONENT: Output parameters tabs & glossaries (7 columns on desktop) */}
        <section className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6" aria-label="JWT Decoding Results">
          
          {/* Real-time Status Hud isolated to handle self-contained ticks without triggering lag */}
          {tokenInput && parsedPayload && (
            <ExpirationTicker 
              expEpoch={parsedPayload?.exp} 
              nbfEpoch={parsedPayload?.nbf} 
            />
          )}

          {/* SECTION A: DECODED HEADER GROUP */}
          <div className="border border-slate-205 dark:border-slate-800/80 bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-50/80 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 px-4.5 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-350 select-none">
                  Decoded Header Block
                </span>
              </div>

              {headerText && (
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-150 dark:bg-slate-900 p-0.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">
                    <button
                      onClick={() => setHeaderTab('tree')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer focus-visible:ring-1 focus-visible:ring-indigo-550 ${headerTab === 'tree' ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'hover:text-slate-900'}`}
                      role="tab"
                      aria-selected={headerTab === 'tree'}
                    >
                      Tree View
                    </button>
                    <button
                      onClick={() => setHeaderTab('raw')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer focus-visible:ring-1 focus-visible:ring-indigo-550 ${headerTab === 'raw' ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-sm' : 'hover:text-slate-900'}`}
                      role="tab"
                      aria-selected={headerTab === 'raw'}
                    >
                      Raw JSON
                    </button>
                  </div>

                  {/* Expand/Collapse overrides for header tree */}
                  {headerTab === 'tree' && parsedHeader && (
                    <div className="flex border-l border-slate-200 dark:border-slate-800 pl-2 gap-1.5">
                      <button
                        onClick={() => setHeaderForceExpand(true)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400"
                        title="Expand all header parameters"
                      >
                        Expand
                      </button>
                      <button
                        onClick={() => setHeaderForceExpand(false)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400"
                        title="Collapse all header parameters"
                      >
                        Collapse
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDownloadFile('jwt-header.json', headerText)}
                    className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-850 rounded-lg text-slate-500 hover:text-slate-805 transition cursor-pointer"
                    title="Export Header as JSON file"
                    aria-label="Download Header JSON"
                    id="btn-download-header"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => copyToClipboard(headerText, setCopiedHeader)}
                    className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-850 rounded-lg text-slate-500 hover:text-slate-805 transition cursor-pointer"
                    title="Copy Header representation to clipboard"
                    aria-label="Copy Header JSON"
                    id="btn-copy-header"
                  >
                    {copiedHeader ? <Check className="w-4 h-4 text-emerald-550" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 bg-white dark:bg-slate-950 min-h-[140px] max-h-[300px] overflow-y-auto select-text">
              {!headerText ? (
                <div className="text-center py-12 text-slate-450 dark:text-slate-500 italic text-xs font-mono select-none">
                  Awaiting active base64 segment parsing...
                </div>
              ) : (
                <>
                  {headerTab === 'tree' && parsedHeader ? (
                    <div className="pl-1 border-l-2 border-rose-500/15">
                      <JsonTreeNode name="" value={parsedHeader} forceExpand={headerForceExpand} />
                    </div>
                  ) : (
                    <div className="pl-1 border-l-2 border-rose-500/15">
                      {highlightJsonCode(headerText)}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* SECTION B: DECODED PAYLOAD GROUP */}
          <div className="border border-slate-205 dark:border-slate-800/80 bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm flex flex-col">
            <div className="bg-slate-50/80 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 px-4.5 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700 dark:text-slate-350 select-none">
                  Decoded Payload Block
                </span>
              </div>

              {payloadText && (
                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-150 dark:bg-slate-900 p-0.5 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400">
                    <button
                      onClick={() => setPayloadTab('tree')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer focus-visible:ring-1 focus-visible:ring-indigo-550 ${payloadTab === 'tree' ? 'bg-white dark:bg-slate-800 text-indigo-655 dark:text-indigo-400 shadow-sm' : 'hover:text-slate-900'}`}
                      role="tab"
                      aria-selected={payloadTab === 'tree'}
                    >
                      Tree View
                    </button>
                    <button
                      onClick={() => setPayloadTab('raw')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer focus-visible:ring-1 focus-visible:ring-indigo-550 ${payloadTab === 'raw' ? 'bg-white dark:bg-slate-800 text-indigo-655 dark:text-indigo-400 shadow-sm' : 'hover:text-slate-900'}`}
                      role="tab"
                      aria-selected={payloadTab === 'raw'}
                    >
                      Raw JSON
                    </button>
                  </div>

                  {/* Expand/Collapse overrides for payload tree */}
                  {payloadTab === 'tree' && parsedPayload && (
                    <div className="flex border-l border-slate-200 dark:border-slate-800 pl-2 gap-1.5">
                      <button
                        onClick={() => setPayloadForceExpand(true)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400"
                        title="Expand all payload claims"
                      >
                        Expand
                      </button>
                      <button
                        onClick={() => setPayloadForceExpand(false)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400"
                        title="Collapse all payload claims"
                      >
                        Collapse
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDownloadFile('jwt-payload.json', payloadText)}
                    className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-850 rounded-lg text-slate-500 hover:text-slate-805 transition cursor-pointer"
                    title="Export Payload as JSON file"
                    aria-label="Download Payload JSON"
                    id="btn-download-payload"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => copyToClipboard(payloadText, setCopiedPayload)}
                    className="p-1.5 hover:bg-slate-200/50 dark:hover:bg-slate-850 rounded-lg text-slate-500 hover:text-slate-855 transition cursor-pointer"
                    title="Copy Payload representation to clipboard"
                    aria-label="Copy Payload JSON"
                    id="btn-copy-payload"
                  >
                    {copiedPayload ? <Check className="w-4 h-4 text-emerald-555" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 bg-white dark:bg-slate-950 min-h-[190px] max-h-[500px] overflow-y-auto select-text">
              {!payloadText ? (
                <div className="text-center py-12 text-slate-450 dark:text-slate-500 italic text-xs font-mono select-none">
                  Awaiting active base64 segment parsing...
                </div>
              ) : (
                <>
                  {payloadTab === 'tree' && parsedPayload ? (
                    <div className="pl-1 border-l-2 border-indigo-500/15">
                      <JsonTreeNode name="" value={parsedPayload} forceExpand={payloadForceExpand} />
                    </div>
                  ) : (
                    <div className="pl-1 border-l-2 border-indigo-500/15">
                      {highlightJsonCode(payloadText)}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* SECTION C: SIGNATURE RECOGNITION DISPLAY */}
          <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 flex items-center gap-1.5 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span> Decoded Cryptographic Signature Block
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center gap-3">
                <Sliders className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-none mb-1">Method ID</span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-white capitalize">
                    {signatureAlgorithm || 'No signing alg'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50/50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center gap-3">
                <Lock className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block leading-none mb-1 font-sans">Verification Size</span>
                  <span className="font-mono text-xs font-semibold text-slate-800 dark:text-white">
                    {signatureHex ? `${signatureHex.length} URL-Safe bytes` : '0 bytes (Unsigned)'}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              * The third segment verifies token authenticity. Server applications check the signature against local keys to assure the claims payload wasn't tampered with mid-flight.
            </p>
          </div>

          {/* SECTION D: STRENGTH AUDITS & VULNERABILITIES INDEX */}
          {tokenInput && !parsedSegments.hasStructureError && parsedHeader && (
            <section className="border border-slate-200 dark:border-slate-800 p-6 rounded-2xl bg-white dark:bg-slate-950 flex flex-col gap-5 shadow-sm" aria-label="Cryptographic analysis audits">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5.5 h-5.5 text-indigo-650 dark:text-indigo-400" />
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-800 dark:text-slate-200 select-none">
                  Local Security and Claims Analysis
                </h3>
              </div>

              <div className="space-y-4">
                {calculatedSecurityAudits.map((item, idx) => (
                  <div 
                    key={item.id} 
                    className={`p-4 border rounded-xl leading-relaxed ${
                      item.status === 'critical' 
                        ? 'border-rose-150 bg-rose-50/15 dark:bg-rose-950/10 dark:border-rose-950/40' 
                        : item.status === 'warning' 
                        ? 'border-amber-150 bg-amber-50/15 dark:bg-amber-950/10 dark:border-amber-950/40' 
                        : 'border-emerald-150 bg-emerald-50/15 dark:bg-emerald-950/10 dark:border-emerald-950/45'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {item.status === 'critical' ? (
                        <AlertTriangle className="w-4.5 h-4.5 text-rose-500 shrink-0 mt-0.5" />
                      ) : item.status === 'warning' ? (
                        <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
                      )}

                      <div className="flex-1">
                        <h4 className={`text-xs md:text-sm font-bold ${
                          item.status === 'critical' 
                            ? 'text-rose-700 dark:text-rose-400' 
                            : item.status === 'warning' 
                            ? 'text-amber-700 dark:text-amber-400' 
                            : 'text-emerald-700 dark:text-emerald-400'
                        }`}>
                          {item.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                        <div className="mt-2.5 flex items-start gap-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wide bg-slate-100 dark:bg-slate-850 p-1 rounded text-slate-500 select-none mr-2">Remedy:</span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                            {item.remedy}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DYNAMIC RESERVED CLAIMS GLOSSARY PANEL */}
          {tokenInput && (
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 rounded-2xl shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 flex items-center gap-1.5 select-none">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-500" /> Interactive Claims Directory
                </span>
                
                {/* Selector filters */}
                <div className="flex flex-wrap bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg text-xs font-semibold text-slate-650 dark:text-slate-400">
                  <button 
                    onClick={() => setActiveGlossaryTab('all')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${activeGlossaryTab === 'all' ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-800'}`}
                  >
                    All Claims
                  </button>
                  <button 
                    onClick={() => setActiveGlossaryTab('header')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${activeGlossaryTab === 'header' ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-800'}`}
                  >
                    Headers
                  </button>
                  <button 
                    onClick={() => setActiveGlossaryTab('payload')}
                    className={`px-2.5 py-1 rounded transition cursor-pointer ${activeGlossaryTab === 'payload' ? 'bg-white dark:bg-slate-800 text-indigo-650 dark:text-indigo-400 shadow-xs' : 'hover:text-slate-800'}`}
                  >
                    Payloads
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
                {filteredGlossary.map((item, idx) => {
                  const isPresentInCurrentToken = 
                    item.segment === 'header' 
                      ? parsedHeader && parsedHeader[item.name] !== undefined
                      : parsedPayload && parsedPayload[item.name] !== undefined;

                  return (
                    <div 
                      key={item.name} 
                      className={`p-3 rounded-xl border leading-relaxed transition-all ${
                        isPresentInCurrentToken 
                          ? 'bg-indigo-500/5 border-indigo-200/50 dark:border-indigo-900/40' 
                          : 'bg-slate-50/40 dark:bg-slate-900/20 border-slate-150 dark:border-slate-850'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                          {item.name}
                        </span>
                        {isPresentInCurrentToken && (
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-bold uppercase select-none">
                            Found in Token
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                        {item.fullName}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </section>

      </div>

      {/* SEO-Rich Educational Guide Sections (Bento Layout) */}
      <section className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl mb-16" aria-labelledby="educational-guide-title">
        <div className="max-w-3xl mb-8">
          <span className="text-[10px] font-bold bg-indigo-550/10 text-indigo-650 dark:text-indigo-400 px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit mb-3 select-none">
            JWT Academy Course
          </span>
          <h2 id="educational-guide-title" className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Comprehensive JSON Web Token (JWT) Guide
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Understand standard design token characteristics, token lifecycles, structured algorithms, and security guidelines to defend digital operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="p-5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col gap-3">
            <Cpu className="w-6 h-6 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">What is JWT?</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A JSON Web Token (JWT) is an open internet standard (RFC-7519) that defines an exceptionally compact and completely self-contained approach for securely transferring information between server APIs and web apps as a structured JSON object.
            </p>
          </div>

          <div className="p-5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col gap-3">
            <RefreshCw className="w-6 h-6 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">How JWT Works</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              When users successfully log in via security portals, the authorization server compiles a JWT token containing claim properties. The client stores it locally, then appends it within the HTTP 'Authorization: Bearer [Token]' header for subsequent requests.
            </p>
          </div>

          <div className="p-5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col gap-3">
            <Code className="w-6 h-6 text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">JWT Header Explained</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The first segment of every token is the Header. It specifies the cryptographic standard metadata representing how the subsequent signatures must be validated, including algorithm type ('alg') and schema format ('typ').
            </p>
          </div>

          <div className="p-5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col gap-3">
            <Layers className="w-6 h-6 text-indigo-505" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">JWT Payload Explained</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The middle segment holds the claims. Claims represent statements describing the verified user profile (such as email, permissions, accounts) and token metadata properties (including exp, iat, or iss).
            </p>
          </div>

          <div className="p-5 bg-slate-50/50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col gap-3">
            <Lock className="w-6 h-6 text-indigo-505" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">JWT Signature Explained</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The third segment secures token validation. It leverages cryptographic hashing (e.g. SHA-256) referencing the Base64URL outputs of Header and Payload, assuring incoming parameters didn't experience manipulation.
            </p>
          </div>

          <div className="p-5 bg-slate-50/50 dark:bg-slate-905/20 border border-slate-150 dark:border-slate-850 rounded-2xl flex flex-col gap-3">
            <Scale className="w-6 h-6 text-indigo-505" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">JWT Security Best Practices</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Never place plain confidential credentials inside parameters. Incorporate strict session lifetimes ('exp' claim), enforce HttpOnly cookie storage, reject signature-less claims, and rotate private keys.
            </p>
          </div>

        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950 p-6 md:p-8 rounded-3xl" aria-labelledby="faq-section-title">
        <h2 id="faq-section-title" className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-indigo-505" /> Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpened = expandedFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                className="border-b border-slate-100 dark:border-slate-850 pb-4 last:border-0 last:pb-0"
              >
                <button
                  onClick={() => setExpandedFaq(isOpened ? null : faq.id)}
                  aria-expanded={isOpened}
                  aria-controls={`faq-answer-block-${faq.id}`}
                  className="w-full flex items-center justify-between text-left py-2 hover:text-indigo-600 dark:hover:text-indigo-400 group cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-550 rounded"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                    {faq.question}
                  </span>
                  <span className="text-slate-400 group-hover:text-indigo-500 transition-transform duration-250 shrink-0">
                    {isOpened ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                
                {isOpened && (
                  <div 
                    id={`faq-answer-block-${faq.id}`}
                    className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 pl-1 select-text"
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
