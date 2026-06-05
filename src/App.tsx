import React, { useState, useEffect, Suspense } from 'react';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import HomeView from './components/HomeView.tsx';
import ToolWrapper from './components/ToolWrapper.tsx';

// Dynamic lazy imports for Phase 5 bundle optimization
const AboutView = React.lazy(() => import('./components/AboutView.tsx'));
const FaqView = React.lazy(() => import('./components/FaqView.tsx'));
const ContactView = React.lazy(() => import('./components/ContactView.tsx'));
const LegalView = React.lazy(() => import('./components/LegalView.tsx'));
const WordCounterView = React.lazy(() => import('./components/WordCounterView.tsx'));
const SentenceCounterView = React.lazy(() => import('./components/SentenceCounterView.tsx'));
const CharacterCounterView = React.lazy(() => import('./components/CharacterCounterView.tsx'));
const RemoveLineBreaksView = React.lazy(() => import('./components/RemoveLineBreaksView.tsx'));
const RemoveExtraSpacesView = React.lazy(() => import('./components/RemoveExtraSpacesView.tsx'));
const CaseConverterView = React.lazy(() => import('./components/CaseConverterView.tsx'));
const TextCompareView = React.lazy(() => import('./components/TextCompareView.tsx'));
const SlugGeneratorView = React.lazy(() => import('./components/SlugGeneratorView.tsx'));
const UrlEncoderView = React.lazy(() => import('./components/UrlEncoderView.tsx'));
const UrlDecoderView = React.lazy(() => import('./components/UrlDecoderView.tsx'));
const FancyTextGeneratorView = React.lazy(() => import('./components/FancyTextGeneratorView.tsx'));
const HtmlEncoderView = React.lazy(() => import('./components/HtmlEncoderView.tsx'));
const HtmlDecoderView = React.lazy(() => import('./components/HtmlDecoderView.tsx'));
const Base64EncoderView = React.lazy(() => import('./components/Base64EncoderView.tsx'));
const Base64DecoderView = React.lazy(() => import('./components/Base64DecoderView.tsx'));
const TextSorterView = React.lazy(() => import('./components/TextSorterView.tsx'));
const TextReverserView = React.lazy(() => import('./components/TextReverserView.tsx'));
const TextRepeaterView = React.lazy(() => import('./components/TextRepeaterView.tsx'));
const GrammarCheckerView = React.lazy(() => import('./components/GrammarCheckerView.tsx'));
const ReadabilityCheckerView = React.lazy(() => import('./components/ReadabilityCheckerView.tsx'));
const RemoveDuplicateLinesView = React.lazy(() => import('./components/RemoveDuplicateLinesView.tsx'));
const RemoveEmptyLinesView = React.lazy(() => import('./components/RemoveEmptyLinesView.tsx'));
const LoremIpsumGeneratorView = React.lazy(() => import('./components/LoremIpsumGeneratorView.tsx'));
const RandomTextGeneratorView = React.lazy(() => import('./components/RandomTextGeneratorView.tsx'));
const KeywordDensityCheckerView = React.lazy(() => import('./components/KeywordDensityCheckerView.tsx'));
const NotFoundView = React.lazy(() => import('./components/NotFoundView.tsx'));
const ToolsDirectoryView = React.lazy(() => import('./components/ToolsDirectoryView.tsx'));
const HowToUseAccordion = React.lazy(() => import('./components/HowToUseAccordion.tsx'));

import { ActivePage } from './types.ts';
import { TOOLS, FAQS } from './data.ts';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { initializeAnalytics, trackPageView, analytics } from './lib/analytics.ts';
import AnalyticsConsentBanner from './components/AnalyticsConsentBanner.tsx';

// Mapping table for dynamic prefetching on card hover
const PREFETCH_MAP: Record<string, () => Promise<any>> = {
  'tools/word-counter': () => import('./components/WordCounterView.tsx'),
  'tools/sentence-counter': () => import('./components/SentenceCounterView.tsx'),
  'tools/character-counter': () => import('./components/CharacterCounterView.tsx'),
  'tools/remove-line-breaks': () => import('./components/RemoveLineBreaksView.tsx'),
  'tools/remove-extra-spaces': () => import('./components/RemoveExtraSpacesView.tsx'),
  'tools/case-converter': () => import('./components/CaseConverterView.tsx'),
  'tools/text-compare': () => import('./components/TextCompareView.tsx'),
  'tools/slug-generator': () => import('./components/SlugGeneratorView.tsx'),
  'tools/url-encoder': () => import('./components/UrlEncoderView.tsx'),
  'tools/url-decoder': () => import('./components/UrlDecoderView.tsx'),
  'tools/fancy-text-generator': () => import('./components/FancyTextGeneratorView.tsx'),
  'tools/html-encoder': () => import('./components/HtmlEncoderView.tsx'),
  'tools/html-decoder': () => import('./components/HtmlDecoderView.tsx'),
  'tools/base64-encoder': () => import('./components/Base64EncoderView.tsx'),
  'tools/base64-decoder': () => import('./components/Base64DecoderView.tsx'),
  'tools/text-sorter': () => import('./components/TextSorterView.tsx'),
  'tools/text-reverser': () => import('./components/TextReverserView.tsx'),
  'tools/text-repeater': () => import('./components/TextRepeaterView.tsx'),
  'tools/grammar-checker': () => import('./components/GrammarCheckerView.tsx'),
  'tools/readability-checker': () => import('./components/ReadabilityCheckerView.tsx'),
  'tools/remove-duplicate-lines': () => import('./components/RemoveDuplicateLinesView.tsx'),
  'tools/remove-empty-lines': () => import('./components/RemoveEmptyLinesView.tsx'),
  'tools/lorem-ipsum-generator': () => import('./components/LoremIpsumGeneratorView.tsx'),
  'tools/random-text-generator': () => import('./components/RandomTextGeneratorView.tsx'),
  'tools/keyword-density-checker': () => import('./components/KeywordDensityCheckerView.tsx'),
};

const prefetchTool = (id: string) => {
  const loader = PREFETCH_MAP[id];
  if (loader) {
    loader().catch(() => {});
  }
};


// Define explicit path normalization and redirect rules for fallback/legacy endpoints
function resolveNormalizedPath(rawPath: string): { normalized: string; redirected: boolean } {
  const path = rawPath.trim().toLowerCase().replace(/^\/+/, '').replace(/\/+$/, '');
  
  if (!path || path === 'home' || path === 'index.html' || path === '/') {
    return { normalized: 'home', redirected: rawPath !== '' && rawPath !== '/' && rawPath !== 'home' };
  }

  // Define comprehensive redirect rules for legacy, singular, or alternative aliases
  const redirectRules: Record<string, string> = {
    // legacy singular directly mapped parameters
    'word-counter': 'tools/word-counter',
    'sentence-counter': 'tools/sentence-counter',
    'sentencecounter': 'tools/sentence-counter',
    'tools/sentencecounter': 'tools/sentence-counter',
    'sentences': 'tools/sentence-counter',
    'character-counter': 'tools/character-counter',
    'remove-line-breaks': 'tools/remove-line-breaks',
    'remove-extra-spaces': 'tools/remove-extra-spaces',
    'case-converter': 'tools/case-converter',
    'text-compare': 'tools/text-compare',
    'slug-generator': 'tools/slug-generator',
    'url-encoder': 'tools/url-encoder',
    'url-decoder': 'tools/url-decoder',
    'fancy-text-generator': 'tools/fancy-text-generator',
    'html-encoder': 'tools/html-encoder',
    'html-decoder': 'tools/html-decoder',
    'base64-encoder': 'tools/base64-encoder',
    'base64-decoder': 'tools/base64-decoder',
    'text-sorter': 'tools/text-sorter',
    'text-reverser': 'tools/text-reverser',
    'text-repeater': 'tools/text-repeater',
    'textrepeater': 'tools/text-repeater',
    'tools/textrepeater': 'tools/text-repeater',
    'repeater': 'tools/text-repeater',
    'grammar-checker': 'tools/grammar-checker',
    'grammar': 'tools/grammar-checker',
    'tools/grammar': 'tools/grammar-checker',
    'tools/grammarchecker': 'tools/grammar-checker',
    'grammarchecker': 'tools/grammar-checker',

    'readability-checker': 'tools/readability-checker',
    'readability': 'tools/readability-checker',
    'tools/readability': 'tools/readability-checker',
    'tools/readability-checker': 'tools/readability-checker',

    'remove-duplicate-lines': 'tools/remove-duplicate-lines',
    'dedup-lines': 'tools/remove-duplicate-lines',
    'remove-duplicates': 'tools/remove-duplicate-lines',
    'tools/remove-duplicate-lines': 'tools/remove-duplicate-lines',
    'tools/dedup': 'tools/remove-duplicate-lines',
    'dedup': 'tools/remove-duplicate-lines',

    'remove-empty-lines': 'tools/remove-empty-lines',
    'remove-blank-lines': 'tools/remove-empty-lines',
    'empty-lines': 'tools/remove-empty-lines',
    'blank-lines': 'tools/remove-empty-lines',
    'tools/remove-empty-lines': 'tools/remove-empty-lines',

    'lorem-ipsum-generator': 'tools/lorem-ipsum-generator',
    'lorem-ipsum': 'tools/lorem-ipsum-generator',
    'lorem-generator': 'tools/lorem-ipsum-generator',
    'tools/lorem-ipsum-generator': 'tools/lorem-ipsum-generator',
    'placeholder-text': 'tools/lorem-ipsum-generator',

    'random-text-generator': 'tools/random-text-generator',
    'random-text': 'tools/random-text-generator',
    'tools/random-text-generator': 'tools/random-text-generator',
    'content-generator': 'tools/random-text-generator',

    'keyword-density-checker': 'tools/keyword-density-checker',
    'keyword-density': 'tools/keyword-density-checker',
    'tools/keyword-density': 'tools/keyword-density-checker',
    'tools/keyword-density-checker': 'tools/keyword-density-checker',
    'density-checker': 'tools/keyword-density-checker',

    // alternative/legacy spelling variants
    'tools/wordcounter': 'tools/word-counter',
    'wordcounter': 'tools/word-counter',
    'words': 'tools/word-counter',
    
    'tools/charcounter': 'tools/character-counter',
    'tools/charactercounter': 'tools/character-counter',
    'charactercounter': 'tools/character-counter',
    'charcounter': 'tools/character-counter',
    
    'tools/removebreaks': 'tools/remove-line-breaks',
    'removebreaks': 'tools/remove-line-breaks',
    'strip-breaks': 'tools/remove-line-breaks',
    
    'tools/removespaces': 'tools/remove-extra-spaces',
    'removespaces': 'tools/remove-extra-spaces',
    'strip-spaces': 'tools/remove-extra-spaces',
    
    'tools/caseconverter': 'tools/case-converter',
    'caseconverter': 'tools/case-converter',
    'case': 'tools/case-converter',
    
    'tools/diff': 'tools/text-compare',
    'diff': 'tools/text-compare',
    'diff-checker': 'tools/text-compare',
    'textcheck': 'tools/text-compare',
    
    'tools/slugify': 'tools/slug-generator',
    'slugify': 'tools/slug-generator',
    'slug': 'tools/slug-generator',
    'tools/slug': 'tools/slug-generator',
    
    'tools/urlencoder': 'tools/url-encoder',
    'urlencoder': 'tools/url-encoder',
    'tools/urldecode': 'tools/url-decoder',
    'tools/urldecoder': 'tools/url-decoder',
    'urldecoder': 'tools/url-decoder',
    
    'tools/fancytext': 'tools/fancy-text-generator',
    'fancytext': 'tools/fancy-text-generator',
    'fonts': 'tools/fancy-text-generator',
    'fancy': 'tools/fancy-text-generator',
    
    'tools/htmlencoder': 'tools/html-encoder',
    'htmlencoder': 'tools/html-encoder',
    'tools/htmldecode': 'tools/html-decoder',
    'tools/htmldecoder': 'tools/html-decoder',
    'htmldecoder': 'tools/html-decoder',
    
    'tools/base64encoder': 'tools/base64-encoder',
    'base64encoder': 'tools/base64-encoder',
    'tools/base64decode': 'tools/base64-decoder',
    'tools/base64decoder': 'tools/base64-decoder',
    'base64decoder': 'tools/base64-decoder',
    
    'tools/textsorter': 'tools/text-sorter',
    'textsorter': 'tools/text-sorter',
    'sort': 'tools/text-sorter',
    'linesort': 'tools/text-sorter',
    
    'tools/textreverser': 'tools/text-reverser',
    'textreverser': 'tools/text-reverser',
    'reverse': 'tools/text-reverser',
    'flip': 'tools/text-reverser',
    'privacy-policy': 'privacy',
    'terms-of-service': 'terms',
    'faqs': 'faq',
    'frequently-asked-questions': 'faq',
    'frequently-asked-queries': 'faq',
  };

  // Direct rule lookup (lowercase check)
  if (redirectRules[path]) {
    return { normalized: redirectRules[path], redirected: true };
  }

  // Verify matched static pages
  const defaultPages = ['tools', 'about', 'faq', 'contact', 'privacy', 'terms'];
  if (defaultPages.includes(path)) {
    return { normalized: path, redirected: rawPath !== path };
  }

  // Check valid tool paths (case-insensitive checks)
  const matchingTool = TOOLS.find(t => t.id.toLowerCase() === path);
  if (matchingTool) {
    return { normalized: matchingTool.id, redirected: rawPath !== matchingTool.id };
  }

  // Not matched to anything: let it be itself so renderViewBody resolves it as a 404 custom Not Found Page
  return { normalized: rawPath, redirected: false };
}

// Premium high-fidelity Skeleton fallback
function ViewLoadingSkeleton() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 px-4">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-900 border-t-indigo-600 dark:border-t-indigo-400 animate-spin" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
      </div>
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest animate-pulse font-sans">
        Bootstrapping Sandbox Environment...
      </p>
    </div>
  );
}

export default function App() {
  // Theme state: default checks localStorage, then falls back to media matches
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const cached = localStorage.getItem('theme-preference');
    if (cached) {
      return cached === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Initialize Google Analytics ONCE on initial module mount (with GDPR-safe defaults)
  useEffect(() => {
    initializeAnalytics();
  }, []);

  const [activePage, setActivePage] = useState<ActivePage>('home');

  // Sync dark class on document root whenever darkMode state shifts
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme-preference', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme-preference', 'light');
    }
  }, [darkMode]);

  // Browser pathname and popstate listener for clean client-side routing
  useEffect(() => {
    const parseNavigationState = () => {
      const hash = window.location.hash.trim();
      const pathname = window.location.pathname.trim();
      const search = window.location.search; // preserve query strings

      // Scenario A: Backward-compatible support for legacy Hash-based URLs (e.g. /#/word-counter)
      if (hash.startsWith('#')) {
        const rawHashPath = hash.replace(/^#\/?/, '').split('?')[0];
        let { normalized } = resolveNormalizedPath(rawHashPath);
        
        if (normalized === 'privacy-policy') normalized = 'privacy';
        let targetPathname = '/';
        if (normalized !== 'home') {
          if (normalized.startsWith('tools/')) {
            targetPathname = `/${normalized.substring(6)}`;
          } else if (normalized === 'privacy') {
            targetPathname = '/privacy-policy';
          } else {
            targetPathname = `/${normalized}`;
          }
        }

        // Redirect old hash URL to clean path in address bar
        window.history.replaceState({}, '', targetPathname + search);
        setActivePage(normalized);
        
        // Ensure visual viewport resets to the top
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        return;
      }

      // Scenario B: Load or navigate standard SEO-friendly pathname URL
      const rawPathname = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
      let { normalized } = resolveNormalizedPath(rawPathname);

      if (normalized === 'privacy-policy') normalized = 'privacy';

      let correctPathname = '/';
      if (normalized !== 'home') {
        if (normalized.startsWith('tools/')) {
          correctPathname = `/${normalized.substring(6)}`;
        } else if (normalized === 'privacy') {
          correctPathname = '/privacy-policy';
        } else {
          correctPathname = `/${normalized}`;
        }
      }

      // If they land on a nested path (like /tools/word-counter) or alternative spelling, rewrite it silently
      if (pathname !== correctPathname) {
        window.history.replaceState({}, '', correctPathname + search);
      }

      setActivePage(normalized);

      // Scroll to the top immediately upon state resolution
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Trigger state resolution on mount
    parseNavigationState();

    window.addEventListener('popstate', parseNavigationState);
    return () => window.removeEventListener('popstate', parseNavigationState);
  }, []);

  // Guarantee strict scroll-to-top whenever activePage state changes.
  // We use multiple micro-phases (immediate, RAF, and a brief layout timeout) 
  // to perfectly counteract dynamic element sizing and lazy-loading mount delays from <Suspense>
  useEffect(() => {
    const scrollToTopActions = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Phase 1: Call immediately on state transition
    scrollToTopActions();

    // Phase 2: Call on next animation frame (post-DOM paint slot)
    const rafId = requestAnimationFrame(() => {
      scrollToTopActions();
    });

    // Phase 3: Short timed offset to handle lazy loaded component imports mounting under Suspense
    const timeoutId = setTimeout(() => {
      scrollToTopActions();
    }, 85);

    // Track GA4 PageView on activePage transition
    const capitalizedName = activePage.split('/')
      .map(part => part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
      .join(' - ');

    // Determine SEO Title and Description
    let pageTitle = "TextToolkitHub | Free Online Text & String Tools";
    let pageDesc = "TextToolkitHub is a fast, free, and 100% private client-side text toolkit. Count words, change casing, compare text diffs, and format strings securely.";

    if (activePage === 'home') {
      pageTitle = "TextToolkitHub | Free Online Text & String Tools";
      pageDesc = "TextToolkitHub is a fast, free, and 100% private client-side text toolkit. Count words, change casing, compare text diffs, and format strings securely.";
    } else if (activePage === 'tools') {
      pageTitle = "Text Tools Directory | TextToolkitHub";
      pageDesc = "Discover our comprehensive directory of free online text tools and utilities. Count words, compare diffs, convert casing formats, encode/decode strings, and generate placeholders securely and 100% locally.";
    } else if (activePage === 'about') {
      pageTitle = "About TextToolkitHub | Fast, Private & Free Text Utilities";
      pageDesc = "Discover the mission and technology stack of TextToolkitHub. Standard browser-first code ensures zero text data ever leaves your computer.";
    } else if (activePage === 'faq') {
      pageTitle = "Frequently Asked Questions (FAQ) | TextToolkitHub - Help & Support";
      pageDesc = "Find clear answers to common questions about TextToolkitHub's offline-first local security, analytics tracking, tool features, and compatibility.";
    } else if (activePage === 'contact') {
      pageTitle = "Contact Us | TextToolkitHub - Support & Tool Suggestions";
      pageDesc = "Get in touch with the TextToolkitHub development team. Send bug reports, submit feature recommendations, or request technical support.";
    } else if (activePage === 'privacy') {
      pageTitle = "Privacy Policy | TextToolkitHub - 100% Local Browser Processing";
      pageDesc = "Review the TextToolkitHub Privacy Policy. All text conversions and analytics are securely handled locally inside your web browser secure viewport.";
    } else if (activePage === 'terms') {
      pageTitle = "Terms of Service | TextToolkitHub - Suite Guidelines";
      pageDesc = "Read our Terms of Service. Understand your rights, user guidelines, and terms for utilizing our free, local-first string utilities.";
    } else if (activePage.startsWith('tools/')) {
      const tool = TOOLS.find(t => t.id === activePage);
      if (tool) {
        pageTitle = tool.seoTitle || `${tool.title} Tool Online | TextToolkitHub`;
        pageDesc = tool.seoDescription || tool.description;
      } else {
        pageTitle = `${capitalizedName} | TextToolkitHub - Online Utilities`;
        pageDesc = `Free high-quality client-side ${capitalizedName} utility of TextToolkitHub. Convert, analyze, format, and filter text securely and instantly.`;
      }
    } else {
      pageTitle = "404 Page Not Found | TextToolkitHub";
      pageDesc = "We couldn't find the page or tool you are trying to reach. Go home or use search to find the correct string utility.";
    }

    // Set browser page title
    document.title = pageTitle;

    // Track page view in GA4
    trackPageView(activePage, pageTitle);

    if (activePage.startsWith('tools/')) {
      const toolId = activePage.split('/')[1];
      analytics.trackToolOpened(toolId || activePage);
    }

    // Dynamic Meta Tags (Description, Open Graph, Twitter) Injection for stateful SEO optimization
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) descMeta.setAttribute('content', pageDesc);

    // Social Metadata Tags Sync
    const getCleanUrl = (page: string) => {
      if (page === 'home') return 'https://texttoolkithub.com/';
      if (page === 'privacy') return 'https://texttoolkithub.com/privacy-policy';
      if (page.startsWith('tools/')) {
        return `https://texttoolkithub.com/${page.substring(6)}`;
      }
      return `https://texttoolkithub.com/${page}`;
    };

    const metaMap: Record<string, string> = {
      'og:title': pageTitle,
      'og:description': pageDesc,
      'og:url': getCleanUrl(activePage),
      'twitter:title': pageTitle,
      'twitter:description': pageDesc,
      'twitter:url': getCleanUrl(activePage)
    };

    Object.entries(metaMap).forEach(([property, value]) => {
      let metaEl = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (metaEl) {
        metaEl.setAttribute('content', value);
      }
    });

    // Dynamic Canonical URL Injection for SEO optimization
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    const previousCanonical = canonicalLink?.getAttribute('href') || "";
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', getCleanUrl(activePage));

    // JSON-LD Dynamic Schema Injection
    let schemaScript = document.getElementById('seo-json-ld');
    if (!schemaScript) {
      schemaScript = document.createElement('script');
      schemaScript.setAttribute('type', 'application/ld+json');
      schemaScript.setAttribute('id', 'seo-json-ld');
      document.head.appendChild(schemaScript);
    }

    const schemas: any[] = [
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://texttoolkithub.com/#organization",
        "name": "TextToolkitHub",
        "url": "https://texttoolkithub.com/",
        "logo": "https://texttoolkithub.com/logo.svg",
        "sameAs": [
          "https://x.com/TextToolkitHub",
          "https://www.linkedin.com/in/texttoolkithub"
        ]
      }
    ];

    if (activePage === 'home') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://texttoolkithub.com/#website",
        "name": "TextToolkitHub",
        "url": "https://texttoolkithub.com/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://texttoolkithub.com/?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      });

      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.slice(0, 5).map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    } else if (activePage.startsWith('tools/')) {
      const tool = TOOLS.find(t => t.id === activePage);
      if (tool) {
        schemas.push({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": `${tool.title} | TextToolkitHub`,
          "url": getCleanUrl(tool.id),
          "description": tool.seoDescription || tool.description,
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          }
        });

        schemas.push({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://texttoolkithub.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": tool.title,
              "item": getCleanUrl(tool.id)
            }
          ]
        });
      }
    } else if (activePage === 'faq') {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      });
    }

    schemaScript.innerHTML = JSON.stringify(schemas, null, 2);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
      if (canonicalLink) {
        if (previousCanonical) {
          canonicalLink.setAttribute('href', previousCanonical);
        } else {
          canonicalLink.remove();
        }
      }
      if (schemaScript) {
        schemaScript.innerHTML = '';
      }
    };
  }, [activePage]);

  // Global Analytics Listeners for custom events ("Tool Cleared", "Tool Used", "Tool Copied Result" fallback)
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    // A. Intercept keystrokes/data input inside active workspace textareas
    const handleGlobalInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isTextarea = target.tagName.toLowerCase() === 'textarea';
      const hasToolId = activePage.startsWith('tools/') || activePage !== 'home';

      if (isTextarea && hasToolId) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const toolId = activePage.startsWith('tools/') ? activePage.split('/')[1] : activePage;
          analytics.trackToolUsed(toolId, (target as HTMLTextAreaElement).value.length, (target as HTMLTextAreaElement).value.length);
        }, 2000);
      }
    };

    // B. Intercept custom interaction mouse clicks (to capture external links, Tool Cleared, Tool Used, Tool Copied buttons)
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // 1. Intercept External Link Clicks or Internal SPA path clicks
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        const rawHref = anchor.getAttribute('href') || '';
        try {
          const url = new URL(anchor.href, window.location.origin);
          if (url.origin === window.location.origin) {
            // Anchor target on the same page (e.g. #contact-title) - let browser handle local anchor jump naturally
            const isLocalAnchor = rawHref.startsWith('#') && !rawHref.startsWith('#/');
            if (!isLocalAnchor) {
              e.preventDefault();
              let targetRoute = rawHref;
              if (rawHref.startsWith('#/')) {
                targetRoute = rawHref.replace(/^#\/?/, '');
              } else if (rawHref.startsWith('/')) {
                targetRoute = rawHref.substring(1);
              }
              handlePageNavigation(targetRoute);
              return;
            }
          }
        } catch (err) {
          console.error("URL parsing error:", err);
        }

        const href = anchor.href.toLowerCase();
        if (href.includes('github.com')) {
          analytics.trackExternalLinkClick('GitHub', anchor.href);
        } else if (href.includes('linkedin.com')) {
          analytics.trackExternalLinkClick('LinkedIn', anchor.href);
        } else if (href.includes('x.com') || href.includes('twitter.com')) {
          analytics.trackExternalLinkClick('X (Twitter)', anchor.href);
        }
      }

      // 2. Resolve active workspace context
      const toolId = activePage.startsWith('tools/') ? activePage.split('/')[1] : activePage;
      const isUtilityPage = toolId && toolId !== 'home' && toolId !== 'about' && toolId !== 'faq' && toolId !== 'contact' && toolId !== 'privacy' && toolId !== 'terms';

      // If we are not on an active utility page, we don't track workspace metrics/clearing/copies
      if (!isUtilityPage) {
        return;
      }

      // Try searching for an ID to be precise
      const closestElement = target.closest('[id]');
      const id = closestElement ? closestElement.id : '';

      // 3. Tool Cleared handlers
      const isClearBtn = 
        id === 'btn-clear' || 
        id.includes('btn-clear') || 
        id === 'dedup-btn-clear' || 
        id === 'kd-btn-clear' || 
        id === 'btn-clear-drafts' || 
        id === 'readability-btn-clear' ||
        target.innerText?.toLowerCase().includes('clear') ||
        target.closest('button')?.innerText?.toLowerCase().includes('clear');

      if (isClearBtn) {
        analytics.trackToolCleared(toolId);
        return;
      }

      // 4. Tool Copied button fallback loggers
      const isCopyBtn = 
        id === 'btn-copy' || 
        id.includes('btn-copy') || 
        id === 'dedup-btn-copy-result' || 
        id === 'kd-btn-copy-result' || 
        id === 'btn-copy-left' || 
        id === 'btn-copy-right' || 
        id === 'btn-copy-report' || 
        id === 'readability-btn-copy' ||
        target.innerText?.toLowerCase().includes('copy') ||
        target.closest('button')?.innerText?.toLowerCase().includes('copy');

      if (isCopyBtn) {
        // Find text length if possible (fallback to 0)
        let len = 0;
        const textarea = document.querySelector('textarea');
        if (textarea) {
          len = textarea.value.length;
        }
        analytics.trackToolCopiedResult(toolId, len);
        return;
      }

      // 5. User interaction with standard workspace buttons indicates Tool Used
      const isHeaderOrFooter = id.startsWith('nav-') || id.startsWith('footer-') || id.startsWith('desktop-nav-') || id.startsWith('mobile-nav-');
      const isButton = target.closest('button') !== null || (closestElement && closestElement.tagName.toLowerCase() === 'button');

      if (!isHeaderOrFooter && isButton) {
        // Retrieve current text length for tool usage details
        let len = 0;
        const textarea = document.querySelector('textarea');
        if (textarea) {
          len = textarea.value.length;
        }
        analytics.trackToolUsed(toolId, len, len);
      }
    };

    document.addEventListener('input', handleGlobalInput);
    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('input', handleGlobalInput);
      document.removeEventListener('click', handleGlobalClick);
      clearTimeout(debounceTimer);
    };
  }, [activePage]);

  // Navigate page states cleanly by utilizing HTML5 pathname history API instead of old window hashes
  const handlePageNavigation = (targetView: string) => {
    let { normalized } = resolveNormalizedPath(targetView);
    
    if (normalized === 'privacy-policy') {
      normalized = 'privacy';
    }

    // Convert internal normalized state to correct clean URL
    let nextPath = '/';
    if (normalized !== 'home') {
      if (normalized.startsWith('tools/')) {
        nextPath = `/${normalized.substring(6)}`;
      } else if (normalized === 'privacy') {
        nextPath = '/privacy-policy';
      } else {
        nextPath = `/${normalized}`;
      }
    }

    const currentPath = window.location.pathname;

    // Immediate user feedback: Scroll to top of the page on route mutation
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;

    if (currentPath === nextPath) {
      // If navigating to the same page - smoothly scroll up
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.history.pushState({}, "", nextPath);
      setActivePage(normalized);
    }
  };

  const handleToggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    analytics.trackThemeToggle(nextMode);
  };

  // Render the appropriate main structural view
  const renderViewBody = () => {
    // Render the beautiful dedicated Word Counter page
    if (activePage === 'tools/word-counter' || activePage === 'word-counter') {
      return (
        <WordCounterView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated Sentence Counter page
    if (activePage === 'tools/sentence-counter' || activePage === 'sentence-counter') {
      return (
        <SentenceCounterView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated Character Counter page
    if (activePage === 'tools/character-counter' || activePage === 'character-counter') {
      return (
        <CharacterCounterView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated Remove Line Breaks page
    if (activePage === 'tools/remove-line-breaks' || activePage === 'remove-line-breaks') {
      return (
        <RemoveLineBreaksView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated Remove Extra Spaces page
    if (activePage === 'tools/remove-extra-spaces' || activePage === 'remove-extra-spaces') {
      return (
        <RemoveExtraSpacesView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated Case Converter page
    if (activePage === 'tools/case-converter' || activePage === 'case-converter') {
      return (
        <CaseConverterView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Text Compare page
    if (activePage === 'tools/text-compare' || activePage === 'text-compare') {
      return (
        <TextCompareView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Slug Generator page
    if (activePage === 'tools/slug-generator' || activePage === 'slug-generator') {
      return (
        <SlugGeneratorView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional URL Encoder / Decoder page
    if (activePage === 'tools/url-encoder' || activePage === 'url-encoder') {
      return (
        <UrlEncoderView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional URL Decoder page
    if (activePage === 'tools/url-decoder' || activePage === 'url-decoder') {
      return (
        <UrlDecoderView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Fancy Text Generator page
    if (activePage === 'tools/fancy-text-generator' || activePage === 'fancy-text-generator') {
      return (
        <FancyTextGeneratorView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional HTML Encoder page
    if (activePage === 'tools/html-encoder' || activePage === 'html-encoder') {
      return (
        <HtmlEncoderView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional HTML Decoder page
    if (activePage === 'tools/html-decoder' || activePage === 'html-decoder') {
      return (
        <HtmlDecoderView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Base64 Encoder page
    if (activePage === 'tools/base64-encoder' || activePage === 'base64-encoder') {
      return (
        <Base64EncoderView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Base64 Decoder page
    if (activePage === 'tools/base64-decoder' || activePage === 'base64-decoder') {
      return (
        <Base64DecoderView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Text Sorter page
    if (activePage === 'tools/text-sorter' || activePage === 'text-sorter') {
      return (
        <TextSorterView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Text Reverser page
    if (activePage === 'tools/text-reverser' || activePage === 'text-reverser') {
      return (
        <TextReverserView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Text Repeater page
    if (activePage === 'tools/text-repeater' || activePage === 'text-repeater') {
      return (
        <TextRepeaterView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Grammar Checker page
    if (activePage === 'tools/grammar-checker' || activePage === 'grammar-checker') {
      return (
        <GrammarCheckerView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Readability Checker page
    if (activePage === 'tools/readability-checker' || activePage === 'readability-checker') {
      return (
        <ReadabilityCheckerView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Remove Duplicate Lines page
    if (activePage === 'tools/remove-duplicate-lines' || activePage === 'remove-duplicate-lines') {
      return (
        <RemoveDuplicateLinesView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Remove Empty Lines page
    if (activePage === 'tools/remove-empty-lines' || activePage === 'remove-empty-lines') {
      return (
        <RemoveEmptyLinesView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Lorem Ipsum Generator page
    if (activePage === 'tools/lorem-ipsum-generator' || activePage === 'lorem-ipsum-generator') {
      return (
        <LoremIpsumGeneratorView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Random Text Generator page
    if (activePage === 'tools/random-text-generator' || activePage === 'random-text-generator') {
      return (
        <RandomTextGeneratorView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // Render the beautiful dedicated professional Keyword Density Checker page
    if (activePage === 'tools/keyword-density-checker' || activePage === 'keyword-density-checker') {
      return (
        <KeywordDensityCheckerView 
          onNavigateToTool={(id) => handlePageNavigation(id)}
          onNavigateHome={() => handlePageNavigation('home')}
        />
      );
    }

    // If layout view matches specific tools IDs, load the tool wrapper 
    if (TOOLS.some(t => t.id === activePage)) {
      return (
        <ToolWrapper 
          toolId={activePage} 
          onNavigateHome={() => handlePageNavigation('home')}
          onNavigateToTool={(id) => handlePageNavigation(id)}
        />
      );
    }

    switch (activePage) {
      case 'home':
        return <HomeView onNavigateToTool={(id) => handlePageNavigation(id)} onPrefetchTool={prefetchTool} />;
      case 'tools':
        return <ToolsDirectoryView onNavigateToTool={(id) => handlePageNavigation(id)} onPrefetchTool={prefetchTool} />;
      case 'about':
        return <AboutView />;
      case 'faq':
        return <FaqView />;
      case 'contact':
        return <ContactView />;
      case 'privacy':
        return <LegalView mode="privacy" />;
      case 'terms':
        return <LegalView mode="terms" />;
      default:
        // Handle unexpected route states by safely rendering 404 NotFoundView
        return (
          <NotFoundView 
            onNavigateHome={() => handlePageNavigation('home')}
            onNavigateToTool={(id) => handlePageNavigation(id)}
          />
        );
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200 ${darkMode ? 'dark' : ''}`}>
      
      {/* Universal header navigation */}
      <Navbar 
        activePage={activePage} 
        onNavigate={handlePageNavigation} 
        darkMode={darkMode}
        onToggleDarkMode={handleToggleTheme}
      />

      {/* Primary view workspace layout */}
      <main className="flex-grow">
        <ErrorBoundary>
          <Suspense fallback={<ViewLoadingSkeleton />}>
            <div className="animate-in fade-in duration-200">
              {renderViewBody()}
              {(() => {
                const currentTool = TOOLS.find(t => t.id === activePage || t.id.replace('tools/', '') === activePage);
                if (currentTool) {
                  return (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                      <HowToUseAccordion toolId={currentTool.id} />
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Universal footer brand segments */}
      <Footer onNavigate={handlePageNavigation} />

      {/* Dynamic Cookie Preference & Analytics GDPR Consent Overlay Banner */}
      <AnalyticsConsentBanner onConsentChange={(status) => {
        // If consent is dynamically granted mid-session, load trackers
        if (status === 'granted') {
          initializeAnalytics();
          const capitalizedName = activePage.split('/')
            .map(part => part.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
            .join(' - ');
          trackPageView(activePage, `TextToolkitHub - ${capitalizedName || 'Home'}`);
        }
      }} />

    </div>
  );
}
