import React from 'react';

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
}

export default function AdPlacement({ slot = 'leaderboard', id = 'gen-ad-slot', className = '' }: AdPlacementProps) {
  // We specify strict, standard minimum heights recommended by Google Publisher Guidelines 
  // to pre-allocate DOM dimension parameters, completely eliminating Cumulative Layout Shift (CLS)
  const minHeightStyle = 
    slot === 'leaderboard' 
      ? 'min-h-[90px] sm:min-h-[100px]' 
      : 'min-h-[250px]';

  return (
    <div 
      className={`relative w-full overflow-hidden bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${minHeightStyle} ${className}`}
      id={`${id}-container`}
    >
      {/* Policy-mandated Advertiser Label (Google Publisher Policy strictly requires ad disclosures) */}
      <span className="absolute top-2 left-3 select-none text-[9px] uppercase tracking-wider font-mono font-semibold text-slate-400 dark:text-slate-500">
        ADVERTISEMENT
      </span>

      {/* Local sandboxed structural preview element */}
      <div className="flex flex-col items-center justify-center text-center p-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80 dark:bg-indigo-455 animate-pulse" />
          <p className="text-xs font-bold text-slate-400 dark:text-slate-500 font-sans tracking-wide">
            Responsive {slot === 'leaderboard' ? 'Leaderboard Block' : 'Container Banner'}
          </p>
        </div>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 max-w-[280px] sm:max-w-md font-sans leading-relaxed">
          Google AdSense automatic displays dynamic programmatic banners in this pre-computed spacing container safely.
        </p>
      </div>

      <span className="absolute bottom-2 right-3 select-none text-[8.5px] font-mono font-medium text-slate-350 dark:text-slate-550">
        TextToolkitHub - Ad-Ready Page
      </span>
    </div>
  );
}
