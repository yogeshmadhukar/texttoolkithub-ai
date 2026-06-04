/**
 * TextToolkitHub GA4 Analytics Integration System
 * Fully optimized for GDPR, dynamic client-side consent overrides, 
 * environment variables, and future-proof custom metric tracking.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

// Read GA Measurement ID safely from Vite public environment variables, falling back to production default
export const GA_MEASUREMENT_ID = (((import.meta as any).env)?.VITE_GA_MEASUREMENT_ID || 'G-CMM0H0B48G').trim();


// LocalStorage Consent key
const ANALYTICS_CONSENT_KEY = 'texttoolkithub-analytics-consent';

export type ConsentStatus = 'granted' | 'denied' | 'pending';

/**
 * Retrieves the current persisted analytics consent status from localStorage.
 * Default is 'pending' if the user hasn't chosen yet.
 */
export function getSavedConsentStatus(): ConsentStatus {
  try {
    const saved = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    if (saved === 'granted' || saved === 'denied') {
      return saved;
    }
  } catch (e) {
    console.warn("[Analytics] Unable to read consent status from storage:", e);
  }
  return 'pending';
}

/**
 * Persists user's consent choice to local storage and updates gtag consent configurations.
 */
export function setAnalyticsConsent(consent: boolean) {
  try {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, consent ? 'granted' : 'denied');
  } catch (e) {
    console.warn("[Analytics] Unable to save consent choice to storage:", e);
  }

  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: consent ? 'granted' : 'denied',
      ad_storage: 'denied', // Strictly turn off advertising cookies for maximum GDPR protection
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });
    console.log(`[Analytics] Updated gtag consent status to: ${consent ? 'granted' : 'denied'}`);
  }
}

/**
 * Dynamically loads Google Analytics gtag script and initializes the tracking queue.
 * Fully compatible with direct script loads inside index.html head.
 */
export function initializeAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    console.log("[Analytics] VITE_GA_MEASUREMENT_ID not configured. Skipping GA4 initialization.");
    return;
  }

  // Prevent double script insertion but allow configuration of global gtag if loaded from head
  if (window.gtag) {
    console.log("[Analytics] Google Analytics 4 is already globally loaded and configured.");
    return;
  }

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };

  const initialConsent = getSavedConsentStatus();

  // 1. Establish GDPR default consent parameters before loading GA scripts
  window.gtag('consent', 'default', {
    analytics_storage: initialConsent === 'granted' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500, // Safe delay buffer for late updates
  });

  // 2. Load the external script file dynamically
  const scriptId = 'google-analytics-gtag-script';
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  // 3. Configure the tracker with strict privacy overrides
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    anonymize_ip: true,                    // Anonymize IP addresses for GDPR compliance
    allow_google_signals: false,           // Disable cross-device tracking profiles
    allow_ad_personalization_signals: false, // Disable target advertisement features
    send_page_view: false,                 // Turn off automatic tracking to track SPA hash updates perfectly
  });

  console.log(`[Analytics] Initialized GA4 fallback tag successfully with ID ${GA_MEASUREMENT_ID}. Consent level: ${initialConsent}`);
}

/**
 * Tracks a custom page view in the SPA route context.
 * Useful on hash-changes or activePage mutations.
 */
export function trackPageView(pagePath: string, pageTitle: string) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  const resolvedPath = pagePath.startsWith('#') ? pagePath.substring(1) : pagePath;

  // Double check consent level before transmitting track parameters
  const activeConsent = getSavedConsentStatus();
  if (activeConsent !== 'granted') {
    console.log(`[Analytics] Track PageView blocked (Consent is currently ${activeConsent})`);
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: resolvedPath || '/',
    page_title: pageTitle,
    send_to: GA_MEASUREMENT_ID,
  });

  console.log(`[Analytics] Transmitted PageView: path="${resolvedPath || '/'}" title="${pageTitle}"`);
}

/**
 * Tracks generic interactive events (e.g. tool usage, copy counters, form submits).
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number,
  additionalParams: Record<string, any> = {}
) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;

  // Double check consent level before transmitting event parameters
  const activeConsent = getSavedConsentStatus();
  if (activeConsent !== 'granted') {
    return;
  }

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
    ...additionalParams,
  });

  console.log(`[Analytics] Transmitted Event: action="${action}" category="${category}" label="${label || ''}"`, additionalParams);
}

/**
 * Built-in event managers to standardize core user behaviors.
 */
export const analytics = {
  // Trace which specific tool the user utilized (with text length context)
  trackToolUsage: (toolId: string, inputLength: number, outputLength: number, optionsUsed: string[] = []) => {
    trackEvent('use_tool', 'Utilities', toolId, inputLength, {
      tool_id: toolId,
      input_character_count: inputLength,
      output_character_count: outputLength,
      options_count: optionsUsed.length,
      options_list: optionsUsed.join(','),
    });
    // Trigger explicit "Tool Used" event as well
    analytics.trackToolUsed(toolId, inputLength, outputLength);
  },

  // Trace when user copies computed content back to their clipboard
  trackCopyToClipboard: (toolId: string, characterCount: number) => {
    trackEvent('copy_content', 'Interactions', toolId, characterCount, {
      tool_id: toolId,
      copied_length: characterCount,
    });
    // Trigger explicit "Tool Copied Result" event as well
    analytics.trackToolCopiedResult(toolId, characterCount);
  },

  // Trace when user clears active workspaces
  trackClearWorkspace: (toolId: string) => {
    trackEvent('clear_workspace', 'Interactions', toolId);
    // Trigger explicit "Tool Cleared" event as well
    analytics.trackToolCleared(toolId);
  },

  // Trace contact ticket submissions
  trackContactSubmit: (subjectCategory: string, ticketRef: string) => {
    trackEvent('submit_contact_form', 'FormSubmission', subjectCategory, undefined, {
      ticket_id: ticketRef,
    });
  },

  // Trace diagnostic crash states from the Error Boundary
  trackErrorBoundaryCrash: (errorMessage: string, errorId?: string) => {
    trackEvent('system_crash', 'ErrorBoundary', errorMessage, undefined, {
      error_id: errorId || 'Unknown',
    });
  },

  // Trace toggles of visual dark mode
  trackThemeToggle: (isDarkMode: boolean) => {
    trackEvent('toggle_theme', 'Settings', isDarkMode ? 'dark' : 'light');
  },

  /* =========================================================================
     EXPLICITLY REQUESTED GA4 CUSTOM EVENTS
     ========================================================================= */

  // 1. Tool Opened: Log when a user navigates or opens a specific tool viewport
  trackToolOpened: (toolId: string) => {
    trackEvent('Tool Opened', 'Utilities', toolId, undefined, {
      tool_id: toolId,
    });
  },

  // 2. Tool Used: Log when the tool successfully analyzes or processes text
  trackToolUsed: (toolId: string, inputLength?: number, outputLength?: number) => {
    trackEvent('Tool Used', 'Utilities', toolId, inputLength, {
      tool_id: toolId,
      input_character_count: inputLength || 0,
      output_character_count: outputLength || 0,
    });
  },

  // 3. Tool Cleared: Log when the editor workspace is completely cleared
  trackToolCleared: (toolId: string) => {
    trackEvent('Tool Cleared', 'Interactions', toolId, undefined, {
      tool_id: toolId,
    });
  },

  // 4. Tool Copied Result: Log when computational answers are copied back to clipboard
  trackToolCopiedResult: (toolId: string, characterCount: number) => {
    trackEvent('Tool Copied Result', 'Interactions', toolId, characterCount, {
      tool_id: toolId,
      copied_length: characterCount,
    });
  },

  // 5. Search Performed: Log when queries are entered inside global or page search fields
  trackSearchPerformed: (query: string, resultCount?: number) => {
    trackEvent('Search Performed', 'Interactions', query, undefined, {
      search_query: query,
      result_count: resultCount || 0,
    });
  }
};

// Auto-intercept clipboard copies globally for "Tool Copied Result" analytics tracking
try {
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    const originalWriteText = navigator.clipboard.writeText;
    navigator.clipboard.writeText = function (text: string) {
      try {
        const hash = window.location.hash;
        let toolId = '';
        if (hash.includes('#/tools/')) {
          toolId = hash.substring(hash.indexOf('#/tools/') + 8).split('?')[0];
        } else if (hash.includes('#/')) {
          toolId = hash.substring(hash.indexOf('#/') + 2).split('?')[0];
        }
        
        // Ensure we only track actual toolkit routes
        if (toolId && toolId !== 'home' && toolId !== 'about' && toolId !== 'faq' && toolId !== 'contact' && toolId !== 'privacy' && toolId !== 'terms') {
          analytics.trackToolCopiedResult(toolId, text.length);
        }
      } catch (innerErr) {
        console.warn('[Analytics] Intercept writeText error:', innerErr);
      }
      return originalWriteText.apply(this, [text]);
    };
  }
} catch (outerErr) {
  console.warn('[Analytics] Clipboard intercept injection failed:', outerErr);
}
