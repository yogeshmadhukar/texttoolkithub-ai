import React, { useEffect, useRef, useState } from 'react';

interface AdPlacementProps {
  /**
   * The type/slot orientation of the ad unit.
   * 'leaderboard' is horizontal (height: 90px to 100px)
   * 'rectangle' is standard card (height: 250px)
   */
  slot?: 'leaderboard' | 'rectangle';
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
  const [isAdBlockEnabled, setIsAdBlockEnabled] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // We specify strict, standard minimum heights recommended by Google Publisher Guidelines 
  // to pre-allocate DOM dimension parameters, completely eliminating Cumulative Layout Shift (CLS)
  const minHeightStyle = 
    slot === 'leaderboard' 
      ? 'min-h-[90px] sm:min-h-[100px]' 
      : 'min-h-[250px]';

  useEffect(() => {
    if (initialized.current) return;

    const pushAd = () => {
      try {
        if (typeof window !== 'undefined') {
          const adsbygoogle = (window as any).adsbygoogle;
          if (adsbygoogle) {
            adsbygoogle.push({});
            initialized.current = true;
          } else {
            // If window.adsbygoogle is not loaded yet, retry a bit later
            const checkTimer = setTimeout(() => {
              if ((window as any).adsbygoogle && !initialized.current) {
                ((window as any).adsbygoogle).push({});
                initialized.current = true;
              }
            }, 1000);
            return () => clearTimeout(checkTimer);
          }
        }
      } catch (err) {
        console.warn('AdSense init warning (this is normal during local testing or if an ad blocker is enabled):', err);
        setIsAdBlockEnabled(true);
      }
    };

    // Delay initialization slightly to prevent React rendering race conditions
    const timer = setTimeout(pushAd, 350);
    return () => clearTimeout(timer);
  }, [adSlot]);

  // Unified ca-pub identifier from the verification script
  const adClient = "ca-pub-5005679225743658";

  // Standard safe format mapping
  const activeAdSlot = adSlot || (slot === 'leaderboard' ? '8249685324' : '3958614257');

  return (
    <div 
      ref={adRef}
      className={`relative w-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${minHeightStyle} ${className}`}
      id={`${id}-container`}
    >
      {/* Policy-mandated Advertiser Label (Google Publisher Policy strictly requires clear ad disclosures) */}
      <span className="absolute top-2 left-3 select-none text-[9px] uppercase tracking-wider font-mono font-semibold text-slate-400 dark:text-slate-500 z-10">
        ADVERTISEMENT
      </span>

      {/* Real Google AdSense responsive tag */}
      <div className="w-full h-full flex items-center justify-center z-0">
        <ins 
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%' }}
          data-ad-client={adClient}
          data-ad-slot={activeAdSlot}
          data-ad-format={slot === 'leaderboard' ? 'horizontal' : 'rectangle'}
          data-full-width-responsive="true"
        />
      </div>

      {/* Behind-the-ad background guide text - acts as placeholder during local dev, and stays behind in production */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-transparent pointer-events-none select-none -z-10">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 dark:bg-indigo-400 animate-pulse" />
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 font-sans tracking-wide">
            Responsive {slot === 'leaderboard' ? 'Leaderboard Block' : 'Container Banner'}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[280px] sm:max-w-md font-sans leading-relaxed">
          Google AdSense automatically serves programmatic banners inside this container safely.
        </p>
      </div>

      <span className="absolute bottom-2 right-3 select-none text-[8.5px] font-mono font-medium text-slate-350 dark:text-slate-550 z-10">
        TextToolkitHub - Ad-Ready Page
      </span>
    </div>
  );
}

