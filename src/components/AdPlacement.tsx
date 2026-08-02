import React, { useEffect, useRef, useState } from 'react';

interface AdPlacementProps {
  /**
   * The type/slot orientation of the ad unit.
   * 'leaderboard' is horizontal (728x90 on desktop / 320x50 on mobile)
   * 'rectangle' is standard card (300x250)
   * 'mobile' is mobile horizontal banner (320x50)
   * 'native' is Adsterra Native Banner
   */
  slot?: 'leaderboard' | 'rectangle' | 'mobile' | 'native';
  /**
   * Safe unique identifier for the programmatic ad container
   */
  id?: string;
  className?: string;
  /**
   * Optional custom Google AdSense slot ID. If not provided, standard formats will be used.
   */
  adSlot?: string;
}

export default function AdPlacement({ 
  slot = 'leaderboard', 
  id = 'gen-ad-slot', 
  className = '',
  adSlot
}: AdPlacementProps) {
  const [isReady, setIsReady] = useState(false);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const adRef = useRef<HTMLDivElement>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // We specify strict, standard minimum heights recommended by Publisher Guidelines 
  // to pre-allocate DOM dimension parameters, completely eliminating Cumulative Layout Shift (CLS)
  const minHeightStyle = 
    slot === 'rectangle'
      ? 'min-h-[250px]'
      : slot === 'mobile'
      ? 'min-h-[50px] sm:min-h-[60px]'
      : slot === 'native'
      ? 'min-h-[220px]'
      : 'min-h-[90px] sm:min-h-[100px]';

  useEffect(() => {
    let observer: ResizeObserver | null = null;
    let timerId: NodeJS.Timeout | null = null;

    const checkWidth = () => {
      const element = adRef.current;
      if (!element) return;

      const width = element.getBoundingClientRect().width || element.offsetWidth || window.innerWidth;
      if (width > 0) {
        setContainerWidth(width);
        setIsReady(true);
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    };

    if (typeof window !== 'undefined') {
      if ('ResizeObserver' in window) {
        observer = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const w = entry.contentRect.width || entry.target.getBoundingClientRect().width;
            if (w > 0) {
              setContainerWidth(w);
              checkWidth();
            }
          }
        });
        if (adRef.current) {
          observer.observe(adRef.current);
        }
      }

      checkWidth();

      timerId = setTimeout(() => {
        checkWidth();
      }, 300);
    }

    return () => {
      if (observer) (observer as ResizeObserver).disconnect();
      if (timerId) clearTimeout(timerId);
    };
  }, [slot, adSlot]);

  // Inject Adsterra Ad Unit inside an isolated container iframe to prevent script collisions,
  // document.write issues, and layout shift across React re-renders.
  useEffect(() => {
    if (!isReady || !adContainerRef.current) return;

    const container = adContainerRef.current;
    container.innerHTML = '';

    const width = containerWidth || container.getBoundingClientRect().width || window.innerWidth;

    let unitKey = '';
    let unitWidth = 300;
    let unitHeight = 250;
    let isNative = false;

    if (slot === 'native') {
      isNative = true;
      unitWidth = Math.min(Math.floor(width - 16), 728);
      unitHeight = 220;
    } else if (slot === 'rectangle') {
      unitKey = '3399cdafd9f50601438b6c9ed1757d72'; // Adsterra 300x250
      unitWidth = 300;
      unitHeight = 250;
    } else if (slot === 'mobile') {
      unitKey = '9f24dc40dc17859560f0d7a472108134'; // Adsterra 320x50
      unitWidth = 320;
      unitHeight = 50;
    } else {
      // Leaderboard slot
      if (width >= 728) {
        unitKey = '6b41126cf4dd1cebd68d0f7af445a03f'; // Adsterra 728x90 Desktop
        unitWidth = 728;
        unitHeight = 90;
      } else {
        unitKey = '9f24dc40dc17859560f0d7a472108134'; // Adsterra 320x50 Mobile
        unitWidth = 320;
        unitHeight = 50;
      }
    }

    // Create an isolated sandboxed iframe for seamless execution in Vite/React
    const iframe = document.createElement('iframe');
    iframe.style.width = `${unitWidth}px`;
    iframe.style.height = `${unitHeight}px`;
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';
    iframe.style.margin = '0 auto';
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('aria-label', 'Advertisement');
    iframe.title = 'Advertisement';

    container.appendChild(iframe);

    try {
      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        if (isNative) {
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                  }
                </style>
              </head>
              <body>
                <div id="container-04b5dcdd20f3c45687b80e75f693ab5b"></div>
                <script async="async" data-cfasync="false" src="https://pl30654143.effectivecpmnetwork.com/04b5dcdd20f3c45687b80e75f693ab5b/invoke.js"></script>
              </body>
            </html>
          `);
        } else {
          doc.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8" />
                <style>
                  html, body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background: transparent;
                  }
                </style>
              </head>
              <body>
                <script type="text/javascript">
                  atOptions = {
                    'key': '${unitKey}',
                    'format': 'iframe',
                    'height': ${unitHeight},
                    'width': ${unitWidth},
                    'params': {}
                  };
                </script>
                <script type="text/javascript" src="https://www.highperformanceformat.com/${unitKey}/invoke.js"></script>
              </body>
            </html>
          `);
        }
        doc.close();
      }
    } catch (err) {
      console.warn('Adsterra frame script insertion notice:', err);
    }

    // Secondary Google AdSense fallback / companion push trigger if AdSense is active on window
    if (!initialized.current && typeof window !== 'undefined') {
      try {
        const adsbygoogle = (window as any).adsbygoogle;
        if (adsbygoogle) {
          adsbygoogle.push({});
          initialized.current = true;
        }
      } catch {
        // Safe silent catch
      }
    }

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [isReady, slot, containerWidth]);

  // Unified ca-pub identifier from verification script
  const adClient = "ca-pub-5005679225743658";
  const activeAdSlot = adSlot || (slot === 'leaderboard' ? '8249685324' : '3958614257');

  return (
    <div 
      ref={adRef}
      className={`relative w-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${minHeightStyle} ${className}`}
      id={`${id}-container`}
    >
      {/* Policy-mandated Advertiser Label (Publisher Policy strictly requires clear ad disclosures) */}
      <span className="absolute top-2 left-3 select-none text-[9px] uppercase tracking-wider font-mono font-semibold text-slate-400 dark:text-slate-500 z-10">
        ADVERTISEMENT
      </span>

      {/* Primary Adsterra Ad Container Unit */}
      <div 
        ref={adContainerRef} 
        className="w-full h-full flex items-center justify-center z-10 py-3 overflow-hidden" 
      />

      {/* Optional AdSense responsive tag for dual-network compatibility */}
      {typeof window !== 'undefined' && (window as any).adsbygoogle && isReady && (
        <div className="w-full h-full hidden items-center justify-center z-0">
          <ins 
            className="adsbygoogle"
            style={{ 
              display: 'block', 
              width: '100%', 
              minHeight: slot === 'rectangle' ? '250px' : '90px' 
            }}
            data-ad-client={adClient}
            data-ad-slot={activeAdSlot}
            data-ad-format={slot === 'rectangle' ? 'rectangle' : 'horizontal'}
            data-full-width-responsive="true"
          />
        </div>
      )}

      {/* Behind-the-ad background guide text - stays behind in production */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-transparent pointer-events-none select-none -z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 dark:bg-indigo-400 animate-pulse" />
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 font-sans tracking-wide">
            {slot === 'rectangle' ? 'Adsterra 300x250 Banner' : slot === 'mobile' ? 'Adsterra 320x50 Mobile Banner' : slot === 'native' ? 'Adsterra Native Banner' : 'Adsterra 728x90 / 320x50 Leaderboard'}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[280px] sm:max-w-md font-sans leading-relaxed">
          Adsterra ad network automatically serves programmatic units inside this container.
        </p>
      </div>

      <span className="absolute bottom-2 right-3 select-none text-[8.5px] font-mono font-medium text-slate-350 dark:text-slate-550 z-10">
        TextToolkitHub - Ad-Ready Page
      </span>
    </div>
  );
}


