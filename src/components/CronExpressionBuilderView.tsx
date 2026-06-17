import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
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
  Layers,
  Sliders,
  History,
  Calendar,
  Activity,
  UserCheck,
  RotateCcw,
  Download
} from 'lucide-react';

interface CronExpressionBuilderProps {
  onNavigateToTool: (toolId: string) => void;
  onNavigateHome: () => void;
}

// Allowed ranges for fields
const FIELDS_LIMITS = {
  minute: { min: 0, max: 59, label: 'Minutes' },
  hour: { min: 0, max: 23, label: 'Hours' },
  dayOfMonth: { min: 1, max: 31, label: 'Days of Month' },
  month: { min: 1, max: 12, label: 'Months' },
  dayOfWeek: { min: 0, max: 7, label: 'Days of Week' } // 0 or 7 = Sunday, 1 = Monday, etc.
};

const MONTH_NAMES_UI = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_PARSING = [
  '',
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_NAMES_UI = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const WEEKDAY_NAMES_PARSING = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

// Presets registry definition
interface CronPreset {
  id: string;
  name: string;
  expression: string;
  description: string;
}

const CRON_PRESETS: CronPreset[] = [
  { id: 'every-minute', name: 'Every Minute', expression: '* * * * *', description: 'Run once per minute continuously.' },
  { id: 'every-hour', name: 'Every Hour', expression: '0 * * * *', description: 'Run at minute 0 of every hour.' },
  { id: 'every-day', name: 'Every Day', expression: '0 0 * * *', description: 'Run at 12:00 AM (midnight) every day.' },
  { id: 'every-week', name: 'Every Week', expression: '0 0 * * 0', description: 'Run at 12:00 AM every Sunday.' },
  { id: 'every-month', name: 'Every Month', expression: '0 0 1 * *', description: 'Run at 12:00 AM on the 1st of every month.' },
  { id: 'weekdays', name: 'Weekdays Only', expression: '0 0 * * 1-5', description: 'Run at 12:00 AM Monday through Friday.' },
  { id: 'weekends', name: 'Weekends Only', expression: '0 0 * * 0,6', description: 'Run at 12:00 AM Saturday and Sunday.' },
  { id: 'every-15-min-business', name: 'Every 15 Min during Business Hours', expression: '*/15 9-17 * * 1-5', description: 'Run every 15 mins weekdays from 9 AM to 5 PM.' }
];

// Helper to expand ranges, lists & steps like "1-5", "*/15", "0,15,30" for match testing
function parseCronField(pattern: string, min: number, max: number): Set<number> | string {
  const result = new Set<number>();
  if (pattern === '*') return '*';

  const parts = pattern.split(',');
  for (const part of parts) {
    if (part === '*') {
      return '*';
    }

    // Step option, e.g., */15 or 1-30/5
    if (part.includes('/')) {
      const [range, stepStr] = part.split('/');
      const step = parseInt(stepStr, 10);
      if (isNaN(step) || step <= 0) return `Invalid step: ${stepStr}`;

      let start = min;
      let end = max;

      if (range !== '*') {
        if (range.includes('-')) {
          const [startStr, endStr] = range.split('-');
          const s = parseInt(startStr, 10);
          const e = parseInt(endStr, 10);
          if (isNaN(s) || isNaN(e) || s < min || e > max || s > e) {
            return `Invalid range: ${range}`;
          }
          start = s;
          end = e;
        } else {
          const s = parseInt(range, 10);
          if (isNaN(s) || s < min || s > max) {
            return `Invalid range start: ${range}`;
          }
          start = s;
        }
      }

      for (let i = start; i <= end; i += step) {
        result.add(i);
      }
    } else if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);
      if (isNaN(start) || isNaN(end) || start < min || end > max || start > end) {
        return `Invalid range: ${part}`;
      }
      for (let i = start; i <= end; i++) {
        result.add(i);
      }
    } else {
      const val = parseInt(part, 10);
      if (isNaN(val) || val < min || val > max) {
        return `Invalid value: ${part}`;
      }
      result.add(val);
    }
  }

  return result;
}

// High comfort English translator logic representation
function translateCronFieldToHuman(
  pattern: string, 
  min: number, 
  max: number, 
  unitName: string, 
  namesArray?: string[]
): string {
  if (pattern === '*') {
    return `every ${unitName}`;
  }

  // Handle steps like */15 or 1-30/5
  if (pattern.includes('/')) {
    const [range, stepStr] = pattern.split('/');
    const step = parseInt(stepStr, 10);
    const stepLabel = step === 1 ? `every ${unitName}` : `every ${step} ${unitName}s`;

    if (range === '*') {
      return stepLabel;
    } else if (range.includes('-')) {
      const [start, end] = range.split('-');
      const startVal = parseInt(start, 10);
      const endVal = parseInt(end, 10);
      const startLabel = namesArray ? namesArray[startVal] : startVal;
      const endLabel = namesArray ? namesArray[endVal] : endVal;
      return `${stepLabel} from ${startLabel} to ${endLabel}`;
    } else {
      const startVal = parseInt(range, 10);
      const startLabel = namesArray ? namesArray[startVal] : startVal;
      return `${stepLabel} starting from ${startLabel}`;
    }
  }

  // Handle individual lists like 0,15,30 or Sunday,Saturday
  const parts = pattern.split(',');
  if (parts.length > 1) {
    const labels = parts.map(p => {
      if (p.includes('-')) {
        const [start, end] = p.split('-');
        const sv = parseInt(start, 10);
        const ev = parseInt(end, 10);
        const startLabel = namesArray ? namesArray[sv] : sv;
        const endLabel = namesArray ? namesArray[ev] : ev;
        return `${startLabel} through ${endLabel}`;
      }
      const val = parseInt(p, 10);
      return namesArray ? (namesArray[val] || p) : p;
    });

    const last = labels.pop();
    return `${labels.join(', ')} and ${last}`;
  }

  // Handle singular ranges like 1-5 or 9-17
  if (pattern.includes('-')) {
    const [start, end] = pattern.split('-');
    const sv = parseInt(start, 10);
    const ev = parseInt(end, 10);
    const startLabel = namesArray ? namesArray[sv] : sv;
    const endLabel = namesArray ? namesArray[ev] : ev;
    if (unitName === 'weekday') {
      return `${startLabel} through ${endLabel}`;
    }
    if (unitName === 'hour') {
      return `between ${startLabel} and ${endLabel}`;
    }
    return `from ${startLabel} to ${endLabel}`;
  }

  // Singly-defined integers like 15 or 5
  const singleVal = parseInt(pattern, 10);
  const singleLabel = namesArray ? namesArray[singleVal] : singleVal;
  if (unitName === 'weekday') {
    return `on ${singleLabel}`;
  }
  if (unitName === 'hour') {
    return `at ${singleLabel}`;
  }
  return `${singleLabel}`;
}

function translateCronToEnglish(cronStr: string): { isValid: boolean; summary?: string; error?: string } {
  const parts = cronStr.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { isValid: false, error: 'Expression must consist of exactly 5 parameters separated by spaces (minute hour day month weekday).' };
  }

  const [minPattern, hourPattern, dayPattern, monthPattern, weekdayPattern] = parts;

  // Let's validate values
  const minParsed = parseCronField(minPattern, FIELDS_LIMITS.minute.min, FIELDS_LIMITS.minute.max);
  if (typeof minParsed === 'string' && minParsed !== '*') return { isValid: false, error: `Minutes field error: ${minParsed}` };

  const hrParsed = parseCronField(hourPattern, FIELDS_LIMITS.hour.min, FIELDS_LIMITS.hour.max);
  if (typeof hrParsed === 'string' && hrParsed !== '*') return { isValid: false, error: `Hours field error: ${hrParsed}` };

  const dayParsed = parseCronField(dayPattern, FIELDS_LIMITS.dayOfMonth.min, FIELDS_LIMITS.dayOfMonth.max);
  if (typeof dayParsed === 'string' && dayParsed !== '*') return { isValid: false, error: `Day of Month field error: ${dayParsed}` };

  const monthParsed = parseCronField(monthPattern, FIELDS_LIMITS.month.min, FIELDS_LIMITS.month.max);
  if (typeof monthParsed === 'string' && monthParsed !== '*') return { isValid: false, error: `Month field error: ${monthParsed}` };

  const weekdayParsed = parseCronField(weekdayPattern, FIELDS_LIMITS.dayOfWeek.min, FIELDS_LIMITS.dayOfWeek.max);
  if (typeof weekdayParsed === 'string' && weekdayParsed !== '*') return { isValid: false, error: `Weekday field error: ${weekdayParsed}` };

  // Generate formatting details
  try {
    let dayText = '';
    let monthText = '';

    const renderTimeSpec = (): string => {
      // If singular hour and singular minute
      const isSingularMin = !minPattern.includes(',') && !minPattern.includes('-') && !minPattern.includes('/');
      const isSingularHr = !hourPattern.includes(',') && !hourPattern.includes('-') && !hourPattern.includes('/');

      if (isSingularMin && isSingularHr && minPattern !== '*' && hourPattern !== '*') {
        const hh = parseInt(hourPattern, 10);
        const mm = parseInt(minPattern, 10).toString().padStart(2, '0');
        const suffix = hh >= 12 ? 'PM' : 'AM';
        let displayHr = hh % 12;
        if (displayHr === 0) displayHr = 12;
        return `At ${displayHr}:${mm} ${suffix}`;
      }

      const hrsPart = translateCronFieldToHuman(
        hourPattern, 
        FIELDS_LIMITS.hour.min, 
        FIELDS_LIMITS.hour.max, 
        'hour',
        Array.from({ length: 24 }, (_, i) => {
          if (i === 0) return '12 AM';
          if (i === 12) return '12 PM';
          return i > 12 ? `${i - 12} PM` : `${i} AM`;
        })
      );

      const minsPart = translateCronFieldToHuman(
        minPattern, 
        FIELDS_LIMITS.minute.min, 
        FIELDS_LIMITS.minute.max, 
        'minute'
      );

      if (hourPattern === '*' && minPattern === '*') {
        return 'Every minute';
      }
      if (hourPattern === '*' && minPattern !== '*') {
        const minVal = parseInt(minPattern, 10);
        if (!isNaN(minVal)) {
          if (minVal === 0) return 'At the start of every hour';
          return `At minute ${minVal} of every hour`;
        }
      }
      if (hourPattern === '*') {
        return `${minsPart} of every hour`;
      }
      if (minPattern === '*') {
        return `Every minute during the hours of ${hrsPart}`;
      }

      // Both restricted but complex
      if (hrsPart.startsWith('between') || hrsPart.startsWith('at')) {
        return `${minsPart} ${hrsPart}`;
      }
      return `${minsPart} during ${hrsPart}`;
    };

    const timeSummary = renderTimeSpec();

    // Days representation
    if (dayPattern === '*' && weekdayPattern === '*') {
      dayText = 'every day';
    } else if (dayPattern !== '*' && weekdayPattern !== '*') {
      const selectDays = translateCronFieldToHuman(dayPattern, FIELDS_LIMITS.dayOfMonth.min, FIELDS_LIMITS.dayOfMonth.max, 'day', undefined);
      const selectWeekdays = translateCronFieldToHuman(weekdayPattern, FIELDS_LIMITS.dayOfWeek.min, FIELDS_LIMITS.dayOfWeek.max, 'weekday', WEEKDAY_NAMES_PARSING);
      dayText = `on day ${selectDays} of the month and strictly on ${selectWeekdays}`;
    } else if (dayPattern !== '*') {
      const selectDays = translateCronFieldToHuman(dayPattern, FIELDS_LIMITS.dayOfMonth.min, FIELDS_LIMITS.dayOfMonth.max, 'day', undefined);
      if (dayPattern.startsWith('*/')) {
        dayText = `${selectDays}`;
      } else {
        dayText = `on day ${selectDays} of the month`;
      }
    } else {
      const selectWeekdays = translateCronFieldToHuman(weekdayPattern, FIELDS_LIMITS.dayOfWeek.min, FIELDS_LIMITS.dayOfWeek.max, 'weekday', WEEKDAY_NAMES_PARSING);
      if (weekdayPattern === '1-5') {
        dayText = `on weekdays`;
      } else if (weekdayPattern === '0,6' || weekdayPattern === '6,0') {
        dayText = `on weekends`;
      } else if (selectWeekdays.startsWith('on ')) {
        dayText = `${selectWeekdays}`;
      } else {
        dayText = `on ${selectWeekdays}`;
      }
    }

    // Months specification
    if (monthPattern === '*') {
      monthText = '';
    } else {
      const monthsExpanded = translateCronFieldToHuman(monthPattern, FIELDS_LIMITS.month.min, FIELDS_LIMITS.month.max, 'month', MONTH_NAMES_PARSING);
      monthText = `in ${monthsExpanded}`;
    }

    // Stitch together
    let finalSentence = '';
    if (dayText === 'every day') {
      finalSentence = monthText ? `${timeSummary} every day ${monthText}.` : `${timeSummary} every day.`;
    } else {
      finalSentence = monthText ? `${timeSummary} ${dayText} ${monthText}.` : `${timeSummary} ${dayText}.`;
    }
    
    // Clean redundant spacing
    const parsedCleanSkins = finalSentence.replace(/\s+/g, ' ').replace(/, ,/g, ',').trim();
    
    // Capitalize first character
    const capitalized = parsedCleanSkins.charAt(0).toUpperCase() + parsedCleanSkins.slice(1);

    return { isValid: true, summary: capitalized };
  } catch (err: any) {
    return { isValid: false, error: `Compilation error: ${err.message}` };
  }
}

// Next executions calculator starting from point of time in future
function calculateNextExecutions(cronStr: string, limitCount: number = 5): Date[] {
  const parts = cronStr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minPat, hrPat, domPat, monPat, dowPat] = parts;

  // Helpers to check parsing sets safely
  const parseToSetOrStar = (pat: string, min: number, max: number): Set<number> | null => {
    const val = parseCronField(pat, min, max);
    if (typeof val === 'string') {
      return null;
    }
    return val;
  };

  const minSet = parseToSetOrStar(minPat, FIELDS_LIMITS.minute.min, FIELDS_LIMITS.minute.max);
  const hourSet = parseToSetOrStar(hrPat, FIELDS_LIMITS.hour.min, FIELDS_LIMITS.hour.max);
  const domSet = parseToSetOrStar(domPat, FIELDS_LIMITS.dayOfMonth.min, FIELDS_LIMITS.dayOfMonth.max);
  const monthSet = parseToSetOrStar(monPat, FIELDS_LIMITS.month.min, FIELDS_LIMITS.month.max);
  
  // Parse weekday correctly supporting Sunday as 0 or 7
  let dowSet: Set<number> | null = null;
  const rawDow = parseCronField(dowPat, FIELDS_LIMITS.dayOfWeek.min, FIELDS_LIMITS.dayOfWeek.max);
  if (typeof rawDow !== 'string') {
    dowSet = new Set<number>();
    rawDow.forEach(v => {
      // handle normalization of 7 to 0
      if (v === 7) dowSet?.add(0);
      else dowSet?.add(v);
    });
  }

  const results: Date[] = [];
  let runner = new Date();
  
  // Set minutes forward by 1 so we calculate strictly starting from the NEXT minute
  runner.setMinutes(runner.getMinutes() + 1);
  runner.setSeconds(0);
  runner.setMilliseconds(0);

  // Safeguard scan limiter to avoid endless looping
  let attempts = 0;
  const maxAttempts = 200000; // scan max minutes forward (around 4.5 months)

  while (results.length < limitCount && attempts < maxAttempts) {
    attempts++;

    const min = runner.getMinutes();
    const hr = runner.getHours();
    const dom = runner.getDate();
    const mon = runner.getMonth() + 1; // 1-12
    const dow = runner.getDay(); // 0-6

    // 1. Check Month restriction
    if (monthSet && !monthSet.has(mon)) {
      // Jump to start of next month to remain performance optimized
      runner.setMonth(runner.getMonth() + 1);
      runner.setDate(1);
      runner.setHours(0);
      runner.setMinutes(0);
      continue;
    }

    // 2. Check Day Restriction
    // Standard Unix Cron Day restriction logic:
    // If BOTH day-of-month (dom) and day-of-week (dow) are restricted (i.e. not '*'),
    // then the schedule runs if EITHER satisfies.
    // If only one is restricted, then it must satisfy the restriction.
    let dayMatches = true;
    if (domSet && dowSet) {
      dayMatches = domSet.has(dom) || dowSet.has(dow);
    } else if (domSet) {
      dayMatches = domSet.has(dom);
    } else if (dowSet) {
      dayMatches = dowSet.has(dow);
    }

    if (!dayMatches) {
      // Advance to next day midnight, reset minutes and hours
      runner.setDate(runner.getDate() + 1);
      runner.setHours(0);
      runner.setMinutes(0);
      continue;
    }

    // 3. Check Hour restriction
    if (hourSet && !hourSet.has(hr)) {
      runner.setHours(runner.getHours() + 1);
      runner.setMinutes(0);
      continue;
    }

    // 4. Check Minute restriction
    if (minSet && !minSet.has(min)) {
      runner.setMinutes(runner.getMinutes() + 1);
      continue;
    }

    // If matches all requirements, commit coordinate date
    results.push(new Date(runner));
    runner.setMinutes(runner.getMinutes() + 1);
  }

  return results;
}

export default function CronExpressionBuilderView({ onNavigateToTool, onNavigateHome }: CronExpressionBuilderProps) {
  // Configurable states
  const [cronExpression, setCronExpression] = useState<string>('*/15 9-17 * * 1-5');

  // Multi-tab interactive visual builders config
  const [activeTab, setActiveTab] = useState<'minutes' | 'hours' | 'days' | 'months' | 'weekdays'>('minutes');

  // visual individual inputs builders
  // Minutes properties
  const [minutesMode, setMinutesMode] = useState<'any' | 'step' | 'specific'>('step');
  const [minutesStep, setMinutesStep] = useState<number>(15);
  const [specificMinutes, setSpecificMinutes] = useState<number[]>([0, 15, 30, 45]);

  // Hours properties
  const [hoursMode, setHoursMode] = useState<'any' | 'range' | 'specific'>('range');
  const [hoursRangeStart, setHoursRangeStart] = useState<number>(9);
  const [hoursRangeEnd, setHoursRangeEnd] = useState<number>(17);
  const [specificHours, setSpecificHours] = useState<number[]>([9, 10, 11, 12, 13, 14, 15, 16, 17]);

  // DaysOfMonth properties
  const [daysMode, setDaysMode] = useState<'any' | 'step' | 'specific'>('any');
  const [daysStep, setDaysStep] = useState<number>(2);
  const [specificDays, setSpecificDays] = useState<number[]>([1, 15]);

  // Months properties
  const [monthsMode, setMonthsMode] = useState<'any' | 'specific'>('any');
  const [specificMonths, setSpecificMonths] = useState<number[]>([1, 6, 12]);

  // Weekdays properties
  const [weekdaysMode, setWeekdaysMode] = useState<'specific' | 'any'>('specific');
  const [specificWeekdays, setSpecificWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);

  // Copy status variables
  const [copiedExpression, setCopiedExpression] = useState<boolean>(false);
  const [copiedTranslation, setCopiedTranslation] = useState<boolean>(false);

  // Accordion guides & SEO status displays
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showSeoMeta, setShowSeoMeta] = useState<boolean>(false);

  // SEO Info Constants
  const seoTitle = "Cron Expression Builder | TextToolkitHub";
  const seoDescription = "Build cron schedules visually, translate cron syntax into plain English and preview upcoming execution times.";

  // Sync visual configuration elements into target cron output
  const assembleCronFromVisualInput = () => {
    let minPart = '*';
    let hrPart = '*';
    let domPart = '*';
    let monPart = '*';
    let dowPart = '*';

    // Minutes
    if (minutesMode === 'step') {
      minPart = `*/${minutesStep}`;
    } else if (minutesMode === 'specific') {
      if (specificMinutes.length === 0) minPart = '0';
      else minPart = [...specificMinutes].sort((a, b) => a - b).join(',');
    }

    // Hours
    if (hoursMode === 'range') {
      hrPart = `${hoursRangeStart}-${hoursRangeEnd}`;
    } else if (hoursMode === 'specific') {
      if (specificHours.length === 0) hrPart = '0';
      else hrPart = [...specificHours].sort((a, b) => a - b).join(',');
    }

    // DaysOfMonth
    if (daysMode === 'step') {
      domPart = `*/${daysStep}`;
    } else if (daysMode === 'specific') {
      if (specificDays.length === 0) domPart = '*';
      else domPart = [...specificDays].sort((a, b) => a - b).join(',');
    }

    // Months
    if (monthsMode === 'specific') {
      if (specificMonths.length === 0) monPart = '*';
      else monPart = [...specificMonths].sort((a, b) => a - b).join(',');
    }

    // Weekdays
    if (weekdaysMode === 'specific') {
      if (specificWeekdays.length === 0) dowPart = '*';
      else dowPart = [...specificWeekdays].sort((a, b) => a - b).join(',');
    }

    const assembled = `${minPart} ${hrPart} ${domPart} ${monPart} ${dowPart}`;
    setCronExpression(prev => {
      const normPrev = prev.trim().split(/\s+/).join(' ');
      const normAssembled = assembled.trim().split(/\s+/).join(' ');
      if (normPrev === normAssembled) return prev;
      return assembled;
    });
  };

  // Synchronise components whenever visual state changes
  useEffect(() => {
    assembleCronFromVisualInput();
  }, [
    minutesMode, minutesStep, specificMinutes,
    hoursMode, hoursRangeStart, hoursRangeEnd, specificHours,
    daysMode, daysStep, specificDays,
    monthsMode, specificMonths,
    weekdaysMode, specificWeekdays
  ]);

  // Try to reverse parse typed expression back into visual builder values if possible
  const syncVisualStatesFromCronString = (expr: string) => {
    const parts = expr.trim().split(/\s+/);
    if (parts.length !== 5) return;

    const [mStr, hStr, dStr, monStr, dowStr] = parts;

    // Minute sync
    if (mStr === '*') {
      setMinutesMode('any');
    } else if (mStr.startsWith('*/')) {
      setMinutesMode('step');
      const stepVal = parseInt(mStr.split('/')[1], 10);
      if (!isNaN(stepVal)) setMinutesStep(stepVal);
    } else {
      setMinutesMode('specific');
      const specVals = mStr.split(',').flatMap(p => {
        if (p.includes('-')) {
          const [s, e] = p.split('-').map(Number);
          return Array.from({ length: e - s + 1 }, (_, index) => s + index);
        }
        return Number(p);
      }).filter(n => !isNaN(n));
      setSpecificMinutes(specVals);
    }

    // Hours sync
    if (hStr === '*') {
      setHoursMode('any');
    } else if (hStr.includes('-') && !hStr.includes(',')) {
      setHoursMode('range');
      const [s, e] = hStr.split('-').map(Number);
      if (!isNaN(s)) setHoursRangeStart(s);
      if (!isNaN(e)) setHoursRangeEnd(e);
    } else {
      setHoursMode('specific');
      const specVals = hStr.split(',').flatMap(p => {
        if (p.includes('-')) {
          const [s, e] = p.split('-').map(Number);
          return Array.from({ length: e - s + 1 }, (_, index) => s + index);
        }
        return Number(p);
      }).filter(n => !isNaN(n));
      setSpecificHours(specVals);
    }

    // Days sync
    if (dStr === '*') {
      setDaysMode('any');
    } else if (dStr.startsWith('*/')) {
      setDaysMode('step');
      const stepVal = parseInt(dStr.split('/')[1], 10);
      if (!isNaN(stepVal)) setDaysStep(stepVal);
    } else {
      setDaysMode('specific');
      const specVals = dStr.split(',').flatMap(p => {
        if (p.includes('-')) {
          const [s, e] = p.split('-').map(Number);
          return Array.from({ length: e - s + 1 }, (_, index) => s + index);
        }
        return Number(p);
      }).filter(n => !isNaN(n));
      setSpecificDays(specVals);
    }

    // Months sync
    if (monStr === '*') {
      setMonthsMode('any');
    } else {
      setMonthsMode('specific');
      const specVals = monStr.split(',').flatMap(p => {
        if (p.includes('-')) {
          const [s, e] = p.split('-').map(Number);
          return Array.from({ length: e - s + 1 }, (_, index) => s + index);
        }
        return Number(p);
      }).filter(n => !isNaN(n));
      setSpecificMonths(specVals);
    }

    // Weekdays sync
    if (dowStr === '*') {
      setWeekdaysMode('any');
    } else {
      setWeekdaysMode('specific');
      const specVals = dowStr.split(',').flatMap(p => {
        if (p.includes('-')) {
          const [s, e] = p.split('-').map(Number);
          return Array.from({ length: e - s + 1 }, (_, index) => s + index);
        }
        return Number(p);
      }).filter(n => !isNaN(n));
      setSpecificWeekdays(specVals);
    }
  };

  // Live human translation generator
  const translationResult = useMemo(() => {
    return translateCronToEnglish(cronExpression);
  }, [cronExpression]);

  // Compute future execution times
  const upcomingExecutions = useMemo(() => {
    if (!translationResult.isValid) return [];
    return calculateNextExecutions(cronExpression, 5);
  }, [cronExpression, translationResult.isValid]);

  // Setup Document details on mounted hook cycle
  useEffect(() => {
    const originalTitle = document.title;
    document.title = seoTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content') || '';
    if (metaDesc) {
      metaDesc.setAttribute('content', seoDescription);
    }

    return () => {
      document.title = originalTitle;
      if (metaDesc) metaDesc.setAttribute('content', originalDesc);
    };
  }, []);

  // Utility copy handler
  const copyTextToClipboard = (textStr: string, flagSetter: (b: boolean) => void) => {
    if (!textStr) return;
    navigator.clipboard.writeText(textStr).then(() => {
      flagSetter(true);
      setTimeout(() => flagSetter(false), 2000);
    });
  };

  const downloadTextRepresentation = () => {
    if (!cronExpression) return;
    const contents = `Cron Expression: ${cronExpression}\nDescription: ${translationResult.summary || 'None'}\n\nUpcoming Executions Times (Local Browser Timezone):\n` +
      upcomingExecutions.map((date, index) => `  ${index + 1}. ${date.toLocaleString()}`).join('\n');
    
    const blob = new Blob([contents], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cron-execution-report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Multi toggler helpers
  const toggleSpecificInt = (val: number, list: number[], setter: (v: number[]) => void) => {
    if (list.includes(val)) {
      setter(list.filter(v => v !== val));
    } else {
      setter([...list, val]);
    }
  };

  // Handle preset loaders
  const handleLoadPreset = (preset: CronPreset) => {
    setCronExpression(preset.expression);
    syncVisualStatesFromCronString(preset.expression);
  };

  const handleReset = () => {
    setCronExpression('* * * * *');
    setMinutesMode('any');
    setHoursMode('any');
    setDaysMode('any');
    setMonthsMode('any');
    setWeekdaysMode('any');
  };

  const faqs = [
    {
      id: 1,
      question: "Are there any server limitations or dependencies with text translations?",
      answer: "No. The Cron Expression Builder and Translator is built to execute 100% locally inside this single-view application sandbox. Language expansion rules, timezone matching matrices, and upcoming executions calendars are handled directly by client-side browser JavaScript engine safely with zero external API footprints."
    },
    {
      id: 2,
      question: "How does the timezone calculation handle Daylight Savings transitions (DST)?",
      answer: "Our execution prediction calculations use local native Date constructor parameters. When identifying next match schedules, it respects standard daylight savings timezone increments in real time according to your local computer's system settings."
    },
    {
      id: 3,
      question: "What is the non-standard 6th parameter (seconds) behavior?",
      answer: "TextToolkitHub targets standard high-compatibility UNIX crontab conventions consisting of exactly 5 fields (minutes hours days months weekdays). Some modern systems (like Spring Framework or AWS EventBridge) expand this to include seconds or years; however, standard enterprise system daemons default to the standard 5-part structure mapped here."
    },
    {
      id: 4,
      question: "How does Unix crontab evaluate conflicting Day of Month and Day of Week rules?",
      answer: "By default, Unix cron daemons trigger whenever EITHER of the fields matches the current date if both parameters are explicitly restricted. For example, '0 0 1 * 0' translates to running on the first day of the month AND every Sunday regardless of calendar intersection. Our translator humanizes this rule accurately."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12" id="cron-builder-app-container">
      
      {/* Breadcrumb line navigation */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-505 mb-6" id="cron-breadcrumb">
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
        <span className="text-slate-705 dark:text-slate-300 font-sans">Cron Expression Builder</span>
      </div>

      {/* Main Presentation Hero */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 border-b border-slate-105 dark:border-slate-800 pb-8">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5 select-none">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-550/10 text-indigo-655 dark:text-indigo-430 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono">
              <Clock className="w-3.5 h-3.5" /> Client Utility
            </span>
            <span className="px-3 py-1 bg-violet-500/10 text-violet-600 dark:text-violet-400 text-[10px] font-extrabold uppercase tracking-widest rounded-full font-mono">
              Visual Builder & Parser
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display tracking-tight text-slate-950 dark:text-white leading-[1.1] mb-2">
            Cron Expression <span className="font-semibold text-indigo-600 dark:text-indigo-400 font-display">Builder & Translator</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Construct regular cron job scheduler rules in a clean interactive workspace. Translate expression strings into plain English, review errors instantly, and predict timezone-aware executions.
          </p>
        </div>

        <button
          onClick={() => setShowSeoMeta(!showSeoMeta)}
          className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-205 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 hover:bg-slate-100 dark:bg-slate-955 dark:hover:bg-slate-800 transition shrink-0 self-start md:self-auto cursor-pointer"
          id="seo-tag-toggle-btn"
        >
          <Globe className="w-4 h-4 text-indigo-501 text-indigo-500" />
          {showSeoMeta ? 'Collapse SEO Meta' : 'Verify SEO Meta'}
        </button>
      </div>

      {/* SEO Integration Information */}
      {showSeoMeta && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border border-indigo-120 dark:border-slate-800 rounded-2xl bg-indigo-50/10 dark:bg-slate-950/30 p-5 mb-8 overflow-hidden"
          id="seo-status-banner-card"
        >
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 select-none">
            <Check className="w-4 h-4" /> Header Integration Active
          </div>
          <div className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800/85 p-4 rounded-xl shadow-xs">
            <div className="text-xs text-slate-400 dark:text-slate-505 flex items-center gap-1 mb-1 font-mono">
              <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block"></span>
              https://texttoolkithub.com/tools/cron-builder
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

      {/* Common presets quick-load rail */}
      <div className="border border-slate-200 dark:border-slate-850 bg-slate-50/25 dark:bg-slate-950 rounded-2xl p-4 sm:p-5 mb-8" id="preset-selector-bar">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-550 mb-3 flex items-center gap-1.5 select-none">
          <Sparkles className="w-4 h-4 text-indigo-500 mr-1" /> Quick-Apply Cron Presets
        </h3>
        <div className="flex flex-wrap gap-2">
          {CRON_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleLoadPreset(preset)}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-705 dark:text-slate-300 rounded-xl hover:bg-indigo-50/40 dark:hover:bg-slate-800/65 shadow-sm transition cursor-pointer"
              title={preset.description}
            >
              {preset.name} ({preset.expression})
            </button>
          ))}
        </div>
      </div>

      {/* Main workspace layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
        
        {/* LEFT COLUMN: INTERACTIVE VISUAL BUILDER (7 cols) */}
        <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6" id="cron-visual-builder-panel">
          
          <div className="border border-slate-200 dark:border-slate-800 bg-slate-50/45 dark:bg-slate-950 p-5 sm:p-6 rounded-3xl shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-105 dark:border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-500" /> Interactive visual step builder
              </span>
              <button
                onClick={handleReset}
                className="text-slate-405 hover:text-indigo-650 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Default
              </button>
            </div>

            {/* TAB SELECTOR PANELS */}
            <div className="flex flex-wrap gap-1.5 mb-6 bg-slate-101 dark:bg-slate-900 p-1 rounded-2xl border border-slate-201 dark:border-slate-801/60">
              {(['minutes', 'hours', 'days', 'months', 'weekdays'] as const).map(tab => {
                const isActive = activeTab === tab;
                const tabTitles = {
                  minutes: 'Minutes',
                  hours: 'Hours',
                  days: 'Days of Month',
                  months: 'Months',
                  weekdays: 'Weekdays'
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[70px] py-2 rounded-xl text-xs font-bold text-center tracking-tight transition cursor-pointer ${
                      isActive 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-805 dark:hover:text-slate-300'
                    }`}
                  >
                    {tabTitles[tab]}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT CARDS BOX */}
            <div className="bg-white dark:bg-slate-955/45 border border-slate-201 dark:border-slate-800 p-5 rounded-2xl min-h-[300px]">
              
              {/* TAB 1: MINUTES SELECTOR */}
              {activeTab === 'minutes' && (
                <div className="space-y-6" id="minute-configurator-tab">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">Minutes Settings:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMinutesMode('any')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${minutesMode === 'any' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Every Minute ( * )
                      </button>
                      <button
                        onClick={() => setMinutesMode('step')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${minutesMode === 'step' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Step Interval ( */n )
                      </button>
                      <button
                        onClick={() => setMinutesMode('specific')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${minutesMode === 'specific' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Specific Minutes
                      </button>
                    </div>
                  </div>

                  {minutesMode === 'any' && (
                    <p className="text-xs text-slate-455 dark:text-slate-400 italic">
                      The job runs once per individual minute value (every 60 seconds).
                    </p>
                  )}

                  {minutesMode === 'step' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Trigger execution value every:</label>
                      <div className="flex items-center gap-3">
                        <select
                          value={minutesStep}
                          onChange={(e) => setMinutesStep(Number(e.target.value))}
                          className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-xs font-bold py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 outline-none"
                        >
                          <option value="1">1 minute</option>
                          <option value="2">2 minutes</option>
                          <option value="5">5 minutes</option>
                          <option value="10">10 minutes</option>
                          <option value="15">15 minutes (quarterly)</option>
                          <option value="20">20 minutes (thrice an hour)</option>
                          <option value="30">30 minutes (half hourly)</option>
                        </select>
                        <span className="text-xs text-slate-400 font-mono">Formula output: */{minutesStep}</span>
                      </div>
                    </div>
                  )}

                  {minutesMode === 'specific' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold select-none">Select minute values (0-59):</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSpecificMinutes([0, 15, 30, 45])} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Quarterly
                          </button>
                          <button 
                            onClick={() => setSpecificMinutes(Array.from({ length: 60 }, (_, i) => i))} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Select All
                          </button>
                          <button 
                            onClick={() => setSpecificMinutes([])} 
                            className="text-[10px] uppercase font-bold text-slate-400 hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 max-h-48 overflow-y-auto p-1 border border-slate-100 dark:border-slate-800 rounded-xl">
                        {Array.from({ length: 60 }, (_, i) => {
                          const isSelected = specificMinutes.includes(i);
                          return (
                            <button
                              key={i}
                              onClick={() => toggleSpecificInt(i, specificMinutes, setSpecificMinutes)}
                              className={`py-1 text-center font-mono text-[11px] font-bold rounded-lg transition-all border cursor-pointer ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white border-indigo-650' 
                                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-201 dark:border-slate-801 hover:bg-slate-50'
                              }`}
                            >
                              {i.toString().padStart(2, '0')}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: HOURS CONFIGURATOR */}
              {activeTab === 'hours' && (
                <div className="space-y-6" id="hours-configurator-tab">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">Hours Settings:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setHoursMode('any')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${hoursMode === 'any' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Every Hour ( * )
                      </button>
                      <button
                        onClick={() => setHoursMode('range')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${hoursMode === 'range' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Range Interval ( a-b )
                      </button>
                      <button
                        onClick={() => setHoursMode('specific')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${hoursMode === 'specific' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Specific Hours
                      </button>
                    </div>
                  </div>

                  {hoursMode === 'any' && (
                    <p className="text-xs text-slate-455 dark:text-slate-400 italic">
                      The scheduler runs on hour increments continually, matching minutes field checks.
                    </p>
                  )}

                  {hoursMode === 'range' && (
                    <div className="space-y-3.5">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Restrict executions within hours limit range:</label>
                      <div className="flex flex-wrap items-center gap-4 bg-slate-55/40 dark:bg-slate-900/40 p-3.5 rounded-xl">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Start Hour:</span>
                          <select
                            value={hoursRangeStart}
                            onChange={(e) => setHoursRangeStart(Number(e.target.value))}
                            className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>
                                {i === 0 ? '12:00 AM (midnight)' : i === 12 ? '12:00 PM (noon)' : i > 12 ? `${i - 12}:00 PM` : `${i}:00 AM`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="text-xs text-slate-400 font-semibold self-end mb-2">through</span>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">End Hour:</span>
                          <select
                            value={hoursRangeEnd}
                            onChange={(e) => setHoursRangeEnd(Number(e.target.value))}
                            className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-xs font-bold py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>
                                {i === 0 ? '12:00 AM (midnight)' : i === 12 ? '12:00 PM (noon)' : i > 12 ? `${i - 12}:00 PM` : `${i}:05 PM`}
                              </option>
                            ))}
                          </select>
                        </div>
                        <span className="text-xs text-slate-400 font-mono self-end mb-2 ml-auto">Formula output: {hoursRangeStart}-{hoursRangeEnd}</span>
                      </div>
                    </div>
                  )}

                  {hoursMode === 'specific' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 border border-slate-100 p-2.5 rounded-lg">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold select-none">Select hours values (0-23):</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSpecificHours([9, 10, 11, 12, 13, 14, 15, 16, 17])} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Business (9AM - 5PM)
                          </button>
                          <button 
                            onClick={() => setSpecificHours(Array.from({ length: 24 }, (_, i) => i))} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            All
                          </button>
                          <button 
                            onClick={() => setSpecificHours([])} 
                            className="text-[10px] uppercase font-bold text-slate-400 hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {Array.from({ length: 24 }, (_, i) => {
                          const isSelected = specificHours.includes(i);
                          const ampm = i === 0 ? '12 AM' : i === 12 ? '12 PM' : i > 12 ? `${i - 12} PM` : `${i} AM`;
                          return (
                            <button
                              key={i}
                              onClick={() => toggleSpecificInt(i, specificHours, setSpecificHours)}
                              className={`py-2 text-center text-[10px] font-bold rounded-xl transition border cursor-pointer ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white border-indigo-650 shadow-sm' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              <span className="block font-mono text-[11px]">{i.toString().padStart(2, '0')}:00</span>
                              <span className="block text-[8px] opacity-75 font-sans leading-none">{ampm}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: DAYS OF MONTH */}
              {activeTab === 'days' && (
                <div className="space-y-6" id="days-configurator-tab">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">Day of Month Settings:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDaysMode('any')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${daysMode === 'any' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Every Day ( * )
                      </button>
                      <button
                        onClick={() => setDaysMode('step')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${daysMode === 'step' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Step Interval ( */n )
                      </button>
                      <button
                        onClick={() => setDaysMode('specific')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${daysMode === 'specific' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Specific Dates
                      </button>
                    </div>
                  </div>

                  {daysMode === 'any' && (
                    <p className="text-xs text-slate-455 dark:text-slate-400 italic">
                      Job runs every single day of the month consistently.
                    </p>
                  )}

                  {daysMode === 'step' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 block">Trigger executions every:</label>
                      <div className="flex items-center gap-3">
                        <select
                          value={daysStep}
                          onChange={(e) => setDaysStep(Number(e.target.value))}
                          className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 text-xs font-bold py-2 px-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          <option value="2">2 days (even/odd offset)</option>
                          <option value="3">3 days (tri-daily)</option>
                          <option value="5">5 days</option>
                          <option value="7">7 days (weekly intervals)</option>
                          <option value="10">10 days (decade cycles)</option>
                          <option value="15">15 days (bi-weekly)</option>
                        </select>
                        <span className="text-xs text-slate-400 font-mono">Formula: */{daysStep}</span>
                      </div>
                    </div>
                  )}

                  {daysMode === 'specific' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold select-none">Select calendar dates (1-31):</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSpecificDays([1, 15])} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Bi-weekly (1st & 15th)
                          </button>
                          <button 
                            onClick={() => setSpecificDays([1, 10, 20, 30])} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Decade Days
                          </button>
                          <button 
                            onClick={() => setSpecificDays([])} 
                            className="text-[10px] uppercase font-bold text-slate-400 hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
                        {Array.from({ length: 31 }, (_, i) => {
                          const val = i + 1;
                          const isSelected = specificDays.includes(val);
                          return (
                            <button
                              key={val}
                              onClick={() => toggleSpecificInt(val, specificDays, setSpecificDays)}
                              className={`py-1.5 text-center font-mono text-xs font-bold rounded-lg transition border cursor-pointer ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white border-indigo-650 shadow-xs' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                              }`}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: MONTHS CONFIGURATOR */}
              {activeTab === 'months' && (
                <div className="space-y-6" id="months-configurator-tab">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">Months Settings:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setMonthsMode('any')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${monthsMode === 'any' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Every Month ( * )
                      </button>
                      <button
                        onClick={() => setMonthsMode('specific')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${monthsMode === 'specific' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Specific Months
                      </button>
                    </div>
                  </div>

                  {monthsMode === 'any' && (
                    <p className="text-xs text-slate-455 dark:text-slate-400 italic">
                      The job runs in all 12 calendar months continuously.
                    </p>
                  )}

                  {monthsMode === 'specific' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold select-none">Select target months (1-12):</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSpecificMonths([3, 6, 9, 12])} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Quarterly (End Month)
                          </button>
                          <button 
                            onClick={() => setSpecificMonths([1, 4, 7, 10])} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Quarterly (Start Month)
                          </button>
                          <button 
                            onClick={() => setSpecificMonths([])} 
                            className="text-[10px] uppercase font-bold text-slate-400 hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {MONTH_NAMES_UI.map((name, index) => {
                          const val = index + 1;
                          const isSelected = specificMonths.includes(val);
                          return (
                            <button
                              key={val}
                              onClick={() => toggleSpecificInt(val, specificMonths, setSpecificMonths)}
                              className={`py-2 px-3 text-left text-xs font-bold rounded-xl transition border flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white border-indigo-650 shadow-sm' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50/50'
                              }`}
                            >
                              <span>{name}</span>
                              <span className="font-mono text-[10px] opacity-75">#{val.toString().padStart(2, '0')}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: WEEKDAYS CONFIGURATOR */}
              {activeTab === 'weekdays' && (
                <div className="space-y-6" id="weekdays-configurator-tab">
                  <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 select-none">Days of Week Settings:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setWeekdaysMode('any')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${weekdaysMode === 'any' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Every Day ( * )
                      </button>
                      <button
                        onClick={() => setWeekdaysMode('specific')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${weekdaysMode === 'specific' ? 'bg-indigo-550/10 text-indigo-650 border border-indigo-200' : 'bg-slate-50 dark:bg-slate-900 text-slate-500'}`}
                      >
                        Specific Weekdays
                      </button>
                    </div>
                  </div>

                  {weekdaysMode === 'any' && (
                    <p className="text-xs text-slate-455 dark:text-slate-400 italic">
                      The job runs in all week indices cleanly (Sunday through Saturday).
                    </p>
                  )}

                  {weekdaysMode === 'specific' && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold select-none">Select day indicators (0-6):</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => setSpecificWeekdays([1, 2, 3, 4, 5])} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Weekdays (Mon-Fri)
                          </button>
                          <button 
                            onClick={() => setSpecificWeekdays([0, 6])} 
                            className="text-[10px] uppercase font-bold text-indigo-600 hover:underline cursor-pointer"
                          >
                            Weekends (Sat-Sun)
                          </button>
                          <button 
                            onClick={() => setSpecificWeekdays([])} 
                            className="text-[10px] uppercase font-bold text-slate-400 hover:underline cursor-pointer"
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {WEEKDAY_NAMES_UI.map((name, index) => {
                          const isSelected = specificWeekdays.includes(index);
                          return (
                            <button
                              key={index}
                              onClick={() => toggleSpecificInt(index, specificWeekdays, setSpecificWeekdays)}
                              className={`py-2.5 px-4 text-left text-xs font-bold rounded-xl transition border flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? 'bg-indigo-600 text-white border-indigo-650 shadow-sm' 
                                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50/50'
                              }`}
                            >
                              <span>{name}</span>
                              <span className="font-mono text-[10px] opacity-75">#{index}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Quick-reference documentation block */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 bg-white dark:bg-slate-950">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3.5 flex items-center gap-1.5 select-none">
              <BookOpen className="w-4 h-4 text-indigo-550 text-indigo-500" /> Cron Special Characters Guide
            </h4>
            <div className="space-y-2.5 text-xs text-slate-500 dark:text-slate-400">
              <p>
                <code className="text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold mr-1.5">*</code> 
                Matches any value (e.g., wildcard for every hour or month).
              </p>
              <p>
                <code className="text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold mr-1.5">,</code> 
                Used to separate individual items in a list (e.g., <code className="font-mono bg-slate-50 dark:bg-slate-900 px-1 px-1.5">1,3,5</code> for Monday, Wednesday, and Friday).
              </p>
              <p>
                <code className="text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold mr-1.5">-</code> 
                Defines boundaries range ranges (e.g., <code className="font-mono bg-slate-50 dark:bg-slate-900 px-1 px-1.5">9-17</code> to execute during active daytime business hours).
              </p>
              <p>
                <code className="text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.5 rounded font-mono font-bold mr-1.5">/</code> 
                Configures standard cycle step increments increments (e.g., <code className="font-mono bg-slate-50 dark:bg-slate-900 px-1 px-1.5">*/15</code> to execute every 15 consecutive minutes).
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: CRON TRANSLATION AND UPCOMING RUNS (5 cols) */}
        <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6" id="cron-translation-panel">
          
          <div className="border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 rounded-3xl shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 block mb-3.5 select-none">Active schedule pattern</span>
            
            {/* Live Interactive Text Input */}
            <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-3 rounded-2xl mb-6">
              <Clock className="w-5 h-5 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={cronExpression}
                onChange={(e) => {
                  setCronExpression(e.target.value);
                  syncVisualStatesFromCronString(e.target.value);
                }}
                placeholder="Enter cron pattern (e.g., * * * * *)..."
                className="flex-1 bg-transparent border-0 font-mono text-base font-semibold tracking-wide text-slate-950 dark:text-white outline-none focus:ring-0 p-1"
                id="cron-expression-input"
              />
              <button
                onClick={() => copyTextToClipboard(cronExpression, setCopiedExpression)}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition text-slate-400 hover:text-slate-700 cursor-pointer"
                title="Copy Cron Expression"
              >
                {copiedExpression ? <Check className="w-4 h-4 text-emerald-555" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Translation description box */}
            <div className="mb-6">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 block mb-2.5 select-none">English Translation Summary</span>
              {translationResult.isValid ? (
                <div className="bg-emerald-50/10 dark:bg-slate-900/40 border border-emerald-100 dark:border-emerald-950/40 rounded-2xl p-4 relative group">
                  <p className="text-xs sm:text-sm text-slate-805 dark:text-slate-200 leading-relaxed font-semibold">
                    {translationResult.summary}
                  </p>
                  
                  <button
                    onClick={() => copyTextToClipboard(translationResult.summary || '', setCopiedTranslation)}
                    className="absolute top-2 right-2 p-1 hover:bg-emerald-100/40 dark:hover:bg-slate-800/80 rounded-lg transition opacity-0 group-hover:opacity-100 text-slate-400 flex items-center cursor-pointer"
                    title="Copy English Translation"
                  >
                    {copiedTranslation ? <Check className="w-3.5 h-3.5 text-emerald-550" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <div className="bg-rose-50/20 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-950 px-4 py-3.5 rounded-2xl flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-555 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-600 dark:text-rose-455 font-semibold">
                    {translationResult.error}
                  </div>
                </div>
              )}
            </div>

            {/* Utilities panel */}
            {translationResult.isValid && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={downloadTextRepresentation}
                  className="py-2 px-3 border border-slate-201 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl text-xs font-bold text-slate-705 dark:text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-indigo-500" /> Export Schedule TXT
                </button>
                <button
                  onClick={() => copyTextToClipboard(cronExpression, setCopiedExpression)}
                  className="py-2 px-3 border border-indigo-200 dark:border-indigo-900 bg-indigo-50/20 hover:bg-indigo-60/40 dark:bg-slate-900 rounded-xl text-xs font-bold text-indigo-650 dark:text-indigo-400 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-500" /> Copy Pattern
                </button>
              </div>
            )}

          </div>

          {/* NEXT FIVE PLANNED RUNS CALENDAR */}
          {translationResult.isValid && upcomingExecutions.length > 0 && (
            <div className="border border-slate-205 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 sm:p-6 rounded-3xl" id="execution-planner-card">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500 mb-4 flex items-center gap-11.5 gap-1.5 select-none">
                <Calendar className="w-4 h-4 text-indigo-500" /> Planned upcoming executions
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {upcomingExecutions.map((date, idx) => {
                  return (
                    <div 
                      key={idx} 
                      className="p-3 border border-slate-100 dark:border-slate-900 bg-slate-50/40 dark:bg-slate-955/15 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-550/10 text-indigo-650 text-[10px] font-bold flex items-center justify-center font-sans select-none">
                          {idx + 1}
                        </span>
                        <div className="text-slate-855 dark:text-slate-200 font-bold">
                          {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </div>
                      </div>

                      <div className="text-slate-500 dark:text-indigo-350 font-bold">
                        {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 leading-relaxed font-sans select-none">
                <Info className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
                <span>Computed in browser timezone context: <strong>{Intl.DateTimeFormat().resolvedOptions().timeZone}</strong>. Upcoming schedules update dynamically on client tick.</span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* FAQs Section */}
      <div className="mt-16 max-w-4xl mx-auto border-t border-slate-100 dark:border-slate-800 pt-12" id="cron-faq-section">
        <h3 className="text-xl sm:text-2xl font-light font-display text-slate-950 dark:text-white tracking-tight mb-8 text-center flex items-center justify-center gap-1.5 select-none">
          <HelpCircle className="w-6 h-6 text-indigo-555 text-indigo-500" /> Frequently Asked Questions
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
                  <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-850/30 bg-white dark:bg-slate-950 text-xs sm:text-sm text-slate-505 dark:text-slate-400 leading-relaxed">
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
