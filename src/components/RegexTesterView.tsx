import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import {
  Code,
  Check,
  Copy,
  Trash2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  Hash,
  Search,
  BookOpen,
  Globe,
  Settings,
  AlertTriangle,
  Play,
  Share2,
  FileText,
  ExternalLink,
  Layers,
  Sliders,
  History,
  Activity,
  UserCheck
} from 'lucide-react';

interface RegexTesterViewProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

interface MatchGroup {
  name: string | number;
  value: string;
  start: number;
  end: number;
}

interface MatchItem {
  index: number;
  fullMatch: string;
  start: number;
  end: number;
  groups: MatchGroup[];
}

interface RegexPreset {
  id: string;
  name: string;
  pattern: string;
  flags: string;
  testText: string;
  description: string;
}

export default function RegexTesterView({ onNavigateToTool, onNavigateHome }: RegexTesterViewProps) {
  // Regex pattern state
  const [patternInput, setPatternInput] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [testText, setTestText] = useState<string>(
    'Hello team, please send the telemetry spreadsheets to developers@texttoolkithub.com by tonight.\n' +
    'Alternative contacts: support.desk@texttoolkithub.org or admin_ops@domain-name.co.uk.'
  );

  // Flags state
  const [flags, setFlags] = useState({
    g: true,
    i: true,
    m: false,
    s: false,
    u: false,
    y: false,
  });

  // Display toggles
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState<boolean>(false);
  
  // Results output states
  const [regexError, setRegexError] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);
  const [catastrophicWarning, setCatastrophicWarning] = useState<string | null>(null);

  // Copy status alerts
  const [copiedPattern, setCopiedPattern] = useState<boolean>(false);
  const [copiedResults, setCopiedResults] = useState<boolean>(false);

  // SEO Constants
  const seoTitle = "Regex Tester & Visual Matcher | TextToolkitHub";
  const seoDescription = "Test regular expressions online with live visual matching, captured color-coded groups, secure syntax validation, and zero API footprints.";

  // Preset configuration dictionary
  const regexPresets: RegexPreset[] = [
    {
      id: 'email',
      name: 'Email Address',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      flags: 'gi',
      testText: 'Support query sent by mark.twain@editorial.net to system@service.com.',
      description: 'Standard, robust pattern for matching common internet email forms.'
    },
    {
      id: 'url',
      name: 'URL Link',
      pattern: 'https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)',
      flags: 'gi',
      testText: 'Navigate to https://texttoolkithub.com or check documentation at https://blog.domain.io/setup?id=99y.',
      description: 'Matches standard secure and insecure URL link addresses.'
    },
    {
      id: 'phone',
      name: 'Phone Number',
      pattern: '\\+?[1-9]\\d{1,14}(?:[-\\s()]*\\d+)*',
      flags: 'g',
      testText: 'Reach our corporate headquarter at +1-202-555-0143 or local support at (415) 555-2671.',
      description: 'E.164 and localized telephone number formatting pattern.'
    },
    {
      id: 'username',
      name: 'Username Criteria',
      pattern: '^[a-zA-Z0-9_]{3,16}$',
      flags: 'm',
      testText: 'dev_lead\nadmin\nusr_9\nsh', // 'sh' too short, matches others on multiline
      description: 'Validates usernames containing alphanumeric characters and underscores, 3-16 characters.'
    },
    {
      id: 'password',
      name: 'Secure Password Check',
      pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$',
      flags: 'm',
      testText: 'secret123\nweakpass\nsecurePassCode99', // 'weakpass' fails (no number)
      description: 'Requires minimum 8 characters, at least one alphabetic letter and one numeric digit.'
    },
    {
      id: 'ip',
      name: 'IPv4 Address',
      pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
      flags: 'g',
      testText: 'Local server mapped to 127.0.0.1. Gateways verified: 192.168.1.254 and invalid address 300.400.1.1.',
      description: 'Identifies standard IPv4 numerical addresses cleanly in strings.'
    },
    {
      id: 'date',
      name: 'Date (YYYY-MM-DD)',
      pattern: '\\b\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])\\b',
      flags: 'g',
      testText: 'The project was commissioned on 2026-06-16 and scheduled for release on 2026-10-31.',
      description: 'Recognizes ISO calendar dates formatting standard.'
    },
    {
      id: 'zip',
      name: 'US ZIP Code',
      pattern: '\\b\\d{5}(?:-\\d{4})?\\b',
      flags: 'g',
      testText: 'Please route the documents to Beverly Hills CA 90210 or Seattle offices at 98101-1234.',
      description: 'Detects typical 5-digit and extended 9-digit postal ZIP code patterns.'
    }
  ];

  // Map individual preset parameters to states
  const loadPreset = (preset: RegexPreset) => {
    setPatternInput(preset.pattern);
    setTestText(preset.testText);
    setFlags({
      g: preset.flags.includes('g'),
      i: preset.flags.includes('i'),
      m: preset.flags.includes('m'),
      s: preset.flags.includes('s'),
      u: preset.flags.includes('u'),
      y: preset.flags.includes('y'),
    });
  };

  const activeFlagsString = useMemo(() => {
    let str = '';
    if (flags.g) str += 'g';
    if (flags.i) str += 'i';
    if (flags.m) str += 'm';
    if (flags.s) str += 's';
    if (flags.u) str += 'u';
    if (flags.y) str += 'y';
    return str;
  }, [flags]);

  // Handle catastrophic backtracking sanity check to keep user thread responsive
  const checkCatastrophicBacktrackingPattern = (pStr: string) => {
    if (!pStr) return;
    
    // Check for nested repetitive groups like (a+)+, (a*)*, (a|b|c+)* or repetitive groups with overlapping matches
    const suspectPatterns = [
      /\([^)]*[*+]\)[*+]/,                     // (a+)+ or (a*)*
      /\([^)]*\|[^)]*[*+]\)[*+]/,               // (a|b+)+
      /\(.*\*.*\)\*/,                            // nested stars
      /(\\w\+\\s\*)\+\\w\+/,                     // common source for loops
      /(\(.+\)\+){2,}/                           // layered multi group loops
    ];

    const isSuspect = suspectPatterns.some(regex => regex.test(pStr));
    if (isSuspect) {
      setCatastrophicWarning(
        "Warning: The current regular expression pattern contains nested repetition structures (e.g., inside groupings like (a+)+ or (a|b)*). " +
        "These structures can trigger Catastrophic Backtracking on non-matching strings, resulting in heavy local CPU loads."
      );
    } else {
      setCatastrophicWarning(null);
    }
  };

  // Compile regular expression and calculate matches details in a memory-safe environment
  useEffect(() => {
    checkCatastrophicBacktrackingPattern(patternInput);

    if (!patternInput) {
      setRegexError(null);
      setMatches([]);
      return;
    }

    const tStart = performance.now();
    try {
      // Compile RegExp cleanly
      const compiledRegex = new RegExp(patternInput, activeFlagsString);
      setRegexError(null);

      // Perform matching with safeguards
      const tempMatches: MatchItem[] = [];
      const textToScan = testText || '';
      
      if (flags.g) {
        let matchArray;
        let iterationGuard = 0;
        const maxSafeIterations = 5000;

        while ((matchArray = compiledRegex.exec(textToScan)) !== null) {
          iterationGuard++;
          if (iterationGuard > maxSafeIterations) {
            setRegexError(`Shield Warning: Matching execution split because search iterations exceeded maximum limits (${maxSafeIterations}). Check pattern complexity.`);
            break;
          }

          const fullMatch = matchArray[0];
          const startIndex = matchArray.index;
          const endIndex = startIndex + fullMatch.length;

          // Zero-width match prevention (move index forward if zero-size matches block scanner progress)
          if (compiledRegex.lastIndex === startIndex) {
            compiledRegex.lastIndex++;
          }

          // Gather groups
          const parsedGroups: MatchGroup[] = [];
          for (let i = 1; i < matchArray.length; i++) {
            const groupVal = matchArray[i];
            if (groupVal !== undefined) {
              const grpStart = fullMatch.indexOf(groupVal); // simple best-effort offset
              parsedGroups.push({
                name: i,
                value: groupVal,
                start: startIndex + (grpStart >= 0 ? grpStart : 0),
                end: startIndex + (grpStart >= 0 ? grpStart : 0) + groupVal.length
              });
            }
          }

          tempMatches.push({
            index: tempMatches.length + 1,
            fullMatch,
            start: startIndex,
            end: endIndex,
            groups: parsedGroups
          });
        }
      } else {
        // Non-global search (executes once)
        const singleMatch = compiledRegex.exec(textToScan);
        if (singleMatch) {
          const fullMatch = singleMatch[0];
          const startIndex = singleMatch.index;
          const endIndex = startIndex + fullMatch.length;

          const parsedGroups: MatchGroup[] = [];
          for (let i = 1; i < singleMatch.length; i++) {
            const groupVal = singleMatch[i];
            if (groupVal !== undefined) {
              const grpStart = fullMatch.indexOf(groupVal);
              parsedGroups.push({
                name: i,
                value: groupVal,
                start: startIndex + (grpStart >= 0 ? grpStart : 0),
                end: startIndex + (grpStart >= 0 ? grpStart : 0) + groupVal.length
              });
            }
          }

          tempMatches.push({
            index: 1,
            fullMatch,
            start: startIndex,
            end: endIndex,
            groups: parsedGroups
          });
        }
      }

      setMatches(tempMatches);
      const tEnd = performance.now();
      setExecutionTimeMs(parseFloat((tEnd - tStart).toFixed(2)));

    } catch (err: any) {
      setRegexError(err.message || 'Error compiling original regular expression.');
      setMatches([]);
    }
  }, [patternInput, testText, activeFlagsString]);

  // Setup Document Title and SEO elements on launch
  useEffect(() => {
    const prevTitle = document.title;
    document.title = seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content') || '';
    if (metaDesc) {
      metaDesc.setAttribute('content', seoDescription);
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, []);

  // Utility logic actions
  const handleToggleFlag = (flagName: 'g' | 'i' | 'm' | 's' | 'u' | 'y') => {
    setFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }));
  };

  const handleClearAll = () => {
    setPatternInput('');
    setTestText('');
    setMatches([]);
    setRegexError(null);
  };

  const copyToClipboard = (textStr: string, setCopiedState: (v: boolean) => void) => {
    if (!textStr) return;
    navigator.clipboard.writeText(textStr).then(() => {
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    });
  };

  const handleCopyResultsReport = () => {
    if (matches.length === 0) return;
    const reportHeader = `--- REGEX MATCH REPORT ---\nPattern: /${patternInput}/${activeFlagsString}\nTotal Matches: ${matches.length}\nDate Generated: ${new Date().toLocaleDateString()}\n\n`;
    const reportBody = matches.map(m => {
      let line = `Match #${m.index}: "${m.fullMatch}" [Indices: ${m.start}-${m.end}]`;
      if (m.groups.length > 0) {
        line += `\n  Capture Groups:\n` + m.groups.map(g => `    Group ${g.name}: "${g.value}" [Indices: ${g.start}-${g.end}]`).join('\n');
      }
      return line;
    }).join('\n\n');

    copyToClipboard(reportHeader + reportBody, setCopiedResults);
  };

  // Build the dynamic highlighted interactive visual overlay representation of search text with captured groupings
  const renderVisualMatchingMarkup = () => {
    const text = testText || '';
    if (!text) {
      return (
        <div className="text-slate-400 dark:text-slate-600 italic font-mono text-xs text-center py-10 select-none">
          Live visual-match overlay displays here...
        </div>
      );
    }

    if (matches.length === 0) {
      return (
        <div className="font-mono text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-all leading-relaxed bg-white dark:bg-slate-950/40 p-1">
          {text}
        </div>
      );
    }

    // Sort all intervals to segment indices correctly (both matches levels & subgroup groups)
    // To construct non-overlapping highlighted segments we need to process character coordinates incrementally.
    const segmentsList: { start: number; end: number; type: 'match' | 'group' | 'text'; id?: number; groupName?: string | number; textStr: string }[] = [];
    
    // We can map matches sequentially and inject indices
    let lastIdx = 0;
    matches.forEach((m) => {
      if (m.start > lastIdx) {
        segmentsList.push({
          start: lastIdx,
          end: m.start,
          type: 'text',
          textStr: text.substring(lastIdx, m.start)
        });
      }

      // Inside fullMatch segment, let's check for inner captured groups
      if (m.groups.length === 0) {
        segmentsList.push({
          start: m.start,
          end: m.end,
          type: 'match',
          id: m.index,
          textStr: text.substring(m.start, m.end)
        });
      } else {
        // Handle subgroups parsing inside this main match
        let subLastIdx = m.start;
        m.groups.forEach((g) => {
          // If group is within current bounds
          if (g.start >= subLastIdx && g.end <= m.end) {
            if (g.start > subLastIdx) {
              segmentsList.push({
                start: subLastIdx,
                end: g.start,
                type: 'match',
                id: m.index,
                textStr: text.substring(subLastIdx, g.start)
              });
            }
            segmentsList.push({
              start: g.start,
              end: g.end,
              type: 'group',
              id: m.index,
              groupName: g.name,
              textStr: text.substring(g.start, g.end)
            });
            subLastIdx = g.end;
          }
        });
        if (subLastIdx < m.end) {
          segmentsList.push({
            start: subLastIdx,
            end: m.end,
            type: 'match',
            id: m.index,
            textStr: text.substring(subLastIdx, m.end)
          });
        }
      }

      lastIdx = m.end;
    });

    if (lastIdx < text.length) {
      segmentsList.push({
        start: lastIdx,
        end: text.length,
        type: 'text',
        textStr: text.substring(lastIdx, text.length)
      });
    }

    // Alternate group styles coloring parameters
    const getGroupColorStyles = (gName: string | number) => {
      const gNum = typeof gName === 'number' ? gName : parseInt(gName) || 1;
      const palettes = [
        'bg-blue-400/30 text-blue-900 dark:text-blue-200 border-b border-blue-500',
        'bg-emerald-400/30 text-emerald-900 dark:text-emerald-250 border-b border-emerald-500',
        'bg-purple-400/30 text-purple-900 dark:text-purple-250 border-b border-purple-500',
        'bg-amber-400/30 text-amber-900 dark:text-amber-250 border-b border-amber-500'
      ];
      return palettes[(gNum - 1) % palettes.length];
    };

    return (
      <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all p-3 border border-slate-205 dark:border-slate-800 rounded-2xl bg-slate-50/40 dark:bg-slate-950/20 max-h-96 overflow-y-auto">
        {segmentsList.map((seg, idx) => {
          if (seg.type === 'text') {
            return <span key={idx}>{seg.textStr}</span>;
          }
          if (seg.type === 'match') {
            return (
              <span 
                key={idx} 
                className="bg-yellow-400/25 dark:bg-yellow-500/10 text-slate-950 dark:text-amber-300 px-0.5 rounded cursor-pointer relative group/match border border-transparent hover:border-yellow-500"
                title={`Match #${seg.id}: "${seg.textStr}"`}
              >
                {seg.textStr}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[8px] font-bold px-1 rounded opacity-0 group-hover/match:opacity-100 transition pointer-events-none select-none z-10 whitespace-nowrap">
                  M#{seg.id}
                </span>
              </span>
            );
          }
          if (seg.type === 'group') {
            const classColors = getGroupColorStyles(seg.groupName || 1);
            return (
              <span 
                key={idx} 
                className={`${classColors} px-0.5 mx-0.5 rounded cursor-pointer relative group/grp`}
                title={`Match #${seg.id}, Group ${seg.groupName}: "${seg.textStr}"`}
              >
                {seg.textStr}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[8px] font-bold px-1 rounded opacity-0 group-hover/grp:opacity-100 transition pointer-events-none select-none z-10 whitespace-nowrap">
                  M#{seg.id} G{seg.groupName}
                </span>
              </span>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Dynamic documentation list
  const faqs = [
    {
      id: 1,
      question: "Are my regular expressions and text payload secrets safe inside this tool?",
      answer: "Absolutely! The Regex Tester & Visual Matcher runs 100% locally in your computer inside this secure browser sandboxed context. Zero bytes, regex patterns, or testing inputs are ever sent to our services or any external servers, guaranteeing absolute confidentiality for proprietary patterns and keys."
    },
    {
      id: 2,
      question: "What is Catastrophic Backtracking and how does this tool prevent crashes?",
      answer: "Catastrophic Backtracking happens when a regular expression engine processes complex nested repetition states (like (a+)+) on non-matching strings. The engine explores an exponential number of permutations, hanging the brower tab. In addition to a live vulnerability analyzer checks warning on matching inputs, our engine limits matching execution loops so wildcards don't crash your computer."
    },
    {
      id: 3,
      question: "What do regular expression flags like g, i, m, s, u, and y represent?",
      answer: "These flags alter pattern matching rules: 'g' (global) returns all matches rather than stopping at the first; 'i' (ignore case) bypasses case configurations; 'm' (multiline) treats ^ and $ symbols as individual line markers; 's' (dotall) allows '.' to match newlines; 'u' (unicode) supports full Unicode code points patterns; and 'y' (sticky) searches strictly starting from the current index position."
    },
    {
      id: 4,
      question: "How do capturing groups affect the visual highlighting output?",
      answer: "Capturing groups (wrapped in parenteses like (abc)) capture target subgroups inside the matching array. The Visual Matcher highlights these capturing groups in distinct color palettes (like blue, green, and purple) embedded inside the amber-colored parent match."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="regex-tester-pro-container">
      
      {/* Breadcrumb Navigation line */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 mb-6" id="regex-breadcrumb">
        <button 
          onClick={onNavigateHome} 
          className="hover:text-indigo-650 dark:hover:text-indigo-400 transition flex items-center gap-1 cursor-pointer"
          id="bread-btn-home"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button 
          onClick={() => onNavigateToTool('tools')} 
          className="hover:text-indigo-650 dark:hover:text-indigo-400 transition cursor-pointer"
          id="bread-btn-tools"
        >
          Tools
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-705 dark:text-slate-300">Regex Tester & Visual Matcher</span>
      </div>

      {/* Hero Header Presentation */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 border-b border-slate-100 dark:border-slate-800 pb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-550/10 text-indigo-655 dark:text-indigo-430 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono">
              <Code className="w-3.5 h-3.5" /> Development Tool
            </span>
            <span className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono">
              Regular Expressions
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display tracking-tight text-slate-950 dark:text-white leading-[1.1] mb-2">
            Regex Tester & <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-display">Visual Matcher</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Test regular expressions in real-time with comprehensive group tracking. Visualize capturing intervals, audit backtracking vulnerabilities, toggle regex flags, and deploy clean expressions instantly.
          </p>
        </div>

        <button
          onClick={() => setShowSeoMeta(!showSeoMeta)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-955 dark:hover:bg-slate-800 transition shrink-0 self-start md:self-auto cursor-pointer"
          id="seo-tag-toggle-btn"
        >
          <Globe className="w-4 h-4 text-indigo-500" />
          {showSeoMeta ? 'Collapse SEO Meta' : 'Verify SEO Meta'}
        </button>
      </div>

      {/* SEO Metadata Box */}
      {showSeoMeta && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border border-indigo-120 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950 p-5 mb-8 overflow-hidden"
          id="seo-status-banner-card"
        >
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <Check className="w-4 h-4 text-indigo-500" /> Page SEO Integrations Active
          </div>
          <div className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800/85 p-4 rounded-xl shadow-sm">
            <div className="text-xs text-slate-400 dark:text-slate-505 flex items-center gap-1 mb-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
              https://texttoolkithub.com/tools/regex-tester
            </div>
            <h3 className="text-lg md:text-xl font-medium text-indigo-600 dark:text-indigo-400 hover:underline leading-snug cursor-pointer font-sans">
              {seoTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-505 dark:text-slate-400 mt-1">
              {seoDescription}
            </p>
          </div>
        </motion.div>
      )}

      {/* Presets quick select selector rail */}
      <div className="border border-slate-200 dark:border-slate-850 bg-slate-50/25 dark:bg-slate-950 rounded-2xl p-4 sm:p-5 mb-8" id="preset-selector-bar">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-505 mb-3 flex items-center gap-1.5 select-none">
          <Sparkles className="w-4 h-4 text-indigo-550mr-1 text-indigo-500" /> Select Common Regex Presets
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {regexPresets.map(preset => (
            <button
              key={preset.id}
              onClick={() => loadPreset(preset)}
              className="px-2 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-350 rounded-xl transition shadow-sm text-center truncate cursor-pointer"
              title={`${preset.name}: ${preset.description}`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Grids */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* LEFT COMPILER BLOCK: REGEX PATTERN AND TESTING MULTILINES (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6" id="regex-pattern-input-hub">
          
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/45 dark:bg-slate-950 p-5 sm:p-6 rounded-3xl shadow-xs">
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 flex items-center gap-1.5 select-none">
                <Sliders className="w-4 h-4 text-indigo-500" /> regular expression pattern
              </span>
              {patternInput && (
                <button
                  onClick={handleClearAll}
                  className="text-slate-405 hover:text-rose-550 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear All
                </button>
              )}
            </div>

            {/* Pattern input block alongside raw flags labels */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800/80 rounded-2xl p-2.5 mb-5 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
              <span className="text-slate-400 font-mono text-sm px-1 select-none">/</span>
              <input
                type="text"
                value={patternInput}
                onChange={(e) => setPatternInput(e.target.value)}
                placeholder="Enter regex pattern here (e.g. [0-9]+)..."
                className="flex-1 bg-transparent border-0 outline-none text-slate-855 dark:text-white font-mono text-xs p-1"
                id="regex-pattern-input"
              />
              <span className="text-slate-400 font-mono text-sm px-1 select-none">/</span>
              <span className="text-indigo-650 dark:text-indigo-400 font-mono text-xs font-bold bg-indigo-550/10 px-2 py-1 rounded-md ml-1 select-none">
                {activeFlagsString || 'none'}
              </span>
            </div>

            {/* Flags Selector Layout */}
            <div className="mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-550 block mb-2 px-1 select-none">Regex Modifiers (Flags)</span>
              <div className="grid grid-cols-3 gap-2.5">
                {(Object.keys(flags) as Array<keyof typeof flags>).map((flag) => {
                  const flagDescriptions: Record<string, string> = {
                    g: 'global match',
                    i: 'ignore case',
                    m: 'multiline',
                    s: 'dot matches newline',
                    u: 'unicode parser',
                    y: 'sticky match'
                  };
                  return (
                    <button
                      key={flag}
                      onClick={() => handleToggleFlag(flag)}
                      className={`text-left p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-1 transition cursor-pointer ${
                        flags[flag] 
                          ? 'bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300' 
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                      title={flagDescriptions[flag]}
                    >
                      <span className="font-mono font-extrabold uppercase">{flag}</span>
                      <span className="text-[9px] text-slate-400 truncate max-w-[55px] font-normal leading-none font-sans lowercase">
                        {flagDescriptions[flag].split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Test textarea raw entries block */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-550 block mb-2 px-1 select-none">Test String Payload</span>
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Paste the target string to search matches within..."
                className="w-full h-64 p-4 border border-slate-250 dark:border-slate-805 rounded-2xl bg-white dark:bg-slate-950/45 text-slate-902 dark:text-slate-100 font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-550 transition-all outline-none resize-none leading-relaxed"
                id="regex-test-textarea"
              />
            </div>

            {/* Diagnostics Warnings or compilation errors messages */}
            {regexError && (
              <div className="mt-5 p-4 border border-rose-100 dark:border-rose-950 bg-rose-50/20 dark:bg-rose-950/15 rounded-2xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-550 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-600 dark:text-rose-455 font-semibold leading-normal">
                  <div className="font-bold mb-1 uppercase tracking-wider text-[10px] text-rose-700 dark:text-rose-400">Syntax Compile Error:</div>
                  {regexError}
                </div>
              </div>
            )}

            {catastrophicWarning && !regexError && (
              <div className="mt-5 p-4 border border-amber-200 bg-amber-50/15 dark:bg-amber-955/10 rounded-2xl flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-550 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-xs text-amber-700 dark:text-amber-400 font-semibold leading-normal">
                  <div className="font-bold mb-1 uppercase tracking-wider text-[10px]">Vulnerability Sanity Notice:</div>
                  {catastrophicWarning}
                </div>
              </div>
            )}

            {patternInput && (
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(`/${patternInput}/${activeFlagsString}`, setCopiedPattern)}
                  className="flex-1 py-2 border border-slate-205 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-705 dark:text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedPattern ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-550 animate-pulse" /> Copied Regex Pattern!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-indigo-505" /> Copy Complete Regex String
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

          {/* Quick Guide to regex meta characters */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-950">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-550" /> Regex Cheat Sheet Reference
            </h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] font-mono mt-3 text-slate-500 dark:text-slate-400">
              <div><strong className="text-slate-700 dark:text-slate-200">.</strong> - Any single character</div>
              <div><strong className="text-slate-700 dark:text-slate-200">\d</strong> - Any digit [0-9]</div>
              <div><strong className="text-slate-700 dark:text-slate-205">\w</strong> - Any word alphanumeric</div>
              <div><strong className="text-slate-705 dark:text-slate-205">\s</strong> - Whitespace spacing</div>
              <div><strong className="text-slate-705 dark:text-slate-205">^ / $</strong> - Start / End boundary</div>
              <div><strong className="text-slate-705 dark:text-slate-205">a* / a+</strong> - 0 or more / 1 or more</div>
              <div><strong className="text-slate-705 dark:text-slate-205">a?</strong> - 0 or 1 occurrence</div>
              <div><strong className="text-slate-705 dark:text-slate-205">(abc)</strong> - Capturing group</div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN BLOCK: VISUAL HIGHLIGHTING OVERLAY AND INTERACTIVE GROUP LISTINGS (7 cols) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6" id="regex-visual-markup-hub">
          
          {/* HEADER SUMMARY METRICS SPEED DISCOVERY */}
          {testText && !regexError && (
            <div className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm" id="matching-statistics-card">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-450 dark:text-slate-500 block mb-1 select-none">Live Parser Diagnostics</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold font-sans text-slate-905 dark:text-white">Execution Status:</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-555/10 text-emerald-600 dark:text-emerald-450 font-bold uppercase tracking-wider text-[10px] rounded-full border border-emerald-500/20 shadow-xs">
                    <Activity className="w-3.5 h-3.5 shrink-0" /> Checked Secure
                  </span>
                </div>
              </div>

              <div className="inline-flex gap-6 text-xs font-mono">
                <div className="border-l border-slate-105 dark:border-slate-850 pl-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Total Matches</span>
                  <span className="font-bold text-slate-901 dark:text-white text-base text-indigo-650 dark:text-indigo-400">{matches.length} hits</span>
                </div>
                <div className="border-l border-slate-105 dark:border-slate-850 pl-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 tracking-wider">Speed Delay</span>
                  <span className="font-bold text-slate-901 dark:text-white text-base">{executionTimeMs} ms</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION A: MATCH HIGHLIGHTING CANVAS VIEW */}
          <div className="border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-955/20 rounded-3xl overflow-hidden shadow-xs">
            <div className="bg-slate-100/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-501 bg-yellow-500"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-300">Live Visual Match Highlighting Overlay</span>
              </div>
            </div>

            <div className="p-5 min-h-[160px] bg-white dark:bg-slate-955/40">
              {renderVisualMatchingMarkup()}
            </div>
          </div>

          {/* SECTION B: EXTRACTED MATCH RESULTS & DETAILED GROUPS (SPREADSHEET SUBSECTION LIST) */}
          <div className="border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-955/20 rounded-3xl overflow-hidden shadow-xs" id="regex-extracted-hits">
            
            <div className="bg-slate-100/50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-805 px-5 py-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-550"></span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-605 dark:text-slate-300">Extracted Matches Summary ({matches.length})</span>
              </div>

              {matches.length > 0 && (
                <button
                  onClick={handleCopyResultsReport}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-indigo-600 hover:text-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  {copiedResults ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-550 animate-pulse" /> Copied Hit Report!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy Matches Report
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
              {matches.length === 0 ? (
                <div className="text-center py-16 text-slate-450 dark:text-slate-500 italic text-xs font-mono select-none">
                  Waiting for matches string compile sequence...
                </div>
              ) : (
                matches.map((matchItem) => (
                  <div key={matchItem.index} className="p-4 sm:p-5 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                    <div className="flex flex-wrap items-center justify-between gap-3.5 mb-2 font-mono text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 dark:bg-slate-900 dark:border-slate-800 dark:text-indigo-400 font-extrabold rounded-lg">
                        Match #{matchItem.index}
                      </span>
                      <span className="text-slate-400 font-semibold select-none">
                        Index position: {matchItem.start} to {matchItem.end}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-slate-901 dark:text-white bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-105 dark:border-slate-900 break-all leading-normal">
                      {matchItem.fullMatch}
                    </div>

                    {/* rendering inner captured subgroups list if existent in regular expression parentheses */}
                    {matchItem.groups.length > 0 && (
                      <div className="mt-3.5 pl-3 border-l-2 border-indigo-500/20 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block select-none">Captured Subgroups:</span>
                        {matchItem.groups.map((group, grpIdx) => (
                          <div key={grpIdx} className="flex flex-col sm:flex-row sm:items-center gap-1.5 text-[11px] font-mono leading-normal">
                            <span className="text-slate-400 font-semibold shrink-0">Group {group.name}:</span>
                            <span className="bg-indigo-55/10 text-indigo-650 dark:text-indigo-350 px-1.5 py-0.5 rounded font-semibold break-all leading-relaxed">
                              "{group.value}"
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 select-none">
                              ({group.start}-{group.end})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>

        </div>

      </div>

      {/* FAQs Section */}
      <div className="mt-16 max-w-4xl mx-auto border-t border-slate-100 dark:border-slate-800 pt-12" id="regex-faq-section">
        <h3 className="text-xl sm:text-2xl font-light font-display text-slate-950 dark:text-white tracking-tight mb-8 text-center flex items-center justify-center gap-1.5">
          <HelpCircle className="w-6 h-6 text-indigo-555" /> Frequently Asked Questions
        </h3>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isFaqOpen = activeFaq === faq.id;
            return (
              <div 
                key={faq.id} 
                className="border border-slate-205 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isFaqOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-left font-semibold text-xs sm:text-sm text-slate-855 dark:text-slate-150 flex items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                >
                  <span>{faq.question}</span>
                  {isFaqOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isFaqOpen && (
                  <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-855/30 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
