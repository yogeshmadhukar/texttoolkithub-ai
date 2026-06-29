import React, { useState, useEffect, useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';

interface HubLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withCircleBorder?: boolean;
  editable?: boolean;
}

export default function HubLogo({ 
  className = '', 
  size = 'md', 
  withCircleBorder = true,
  editable = false
}: HubLogoProps) {
  const [customLogo, setCustomLogo] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Create unique IDs to support multiple SVG instances in the DOM
  const uniqueId = React.useId ? React.useId().replace(/:/g, '') : Math.random().toString(36).substr(2, 9);
  const clipPathId = `logo-c-${uniqueId}`;
  const brandGradId = `logo-bg-grad-${uniqueId}`;
  const shadowGradId = `logo-sh-grad-${uniqueId}`;
  const bgGradId = `logo-radial-grad-${uniqueId}`;
  const dropShadowId = `logo-ds-filter-${uniqueId}`;

  useEffect(() => {
    const checkLogo = () => {
      const saved = localStorage.getItem('texttoolkithub_custom_logo');
      setCustomLogo(saved || '');
    };
    checkLogo();

    // Listen to local storage updates within current window
    window.addEventListener('logo-updated', checkLogo);
    // Listen to storage events from other tabs
    window.addEventListener('storage', checkLogo);

    return () => {
      window.removeEventListener('logo-updated', checkLogo);
      window.removeEventListener('storage', checkLogo);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please upload an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        try {
          localStorage.setItem('texttoolkithub_custom_logo', base64String);
          setCustomLogo(base64String);
          window.dispatchEvent(new Event('logo-updated'));
        } catch (error) {
          console.error("Failed to save logo to localStorage (likely too large or quota exceeded):", error);
          alert("Failed to save custom logo. Try uploading a smaller image (under 1MB is recommended).");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Reset logo to default brand logo?")) {
      localStorage.removeItem('texttoolkithub_custom_logo');
      setCustomLogo('');
      window.dispatchEvent(new Event('logo-updated'));
    }
  };

  const handleSecretClick = (e: React.MouseEvent) => {
    // Secret backdoor: Shift+Click or Ctrl+Click on the logo triggers the file upload
    if (!editable && (e.shiftKey || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  const handleSecretDoubleClick = (e: React.MouseEvent) => {
    // Secret backdoor: Double-click triggers the file upload on live website
    if (!editable) {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const ContainerComponent = editable ? 'label' : 'div';

  return (
    <ContainerComponent 
      className={`relative group/logo inline-block shrink-0 ${editable ? 'cursor-pointer select-none' : ''} ${className}`} 
      id={`logo-container-${uniqueId}`}
      title={
        editable 
          ? (customLogo ? "Click to change custom logo image" : "Click to upload your image logo") 
          : "TextToolkitHub"
      }
      onClick={handleSecretClick}
      onDoubleClick={handleSecretDoubleClick}
    >
      {/* Hidden input field for custom logo upload */}
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id={`logo-file-input-${uniqueId}`}
        onClick={(e) => {
          // Prevent file input click from bubbling back up to the label component
          e.stopPropagation();
        }}
      />

      {customLogo ? (
        <svg 
          viewBox="0 0 100 100" 
          className={`${sizeClasses[size]} shrink-0 block transition-transform duration-200 group-hover/logo:scale-105`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipPathId}>
              <circle cx="50" cy="50" r="44" />
            </clipPath>
          </defs>

          {withCircleBorder && (
            <>
              {/* Subtle outer soft ring */}
              <circle 
                cx="50" 
                cy="50" 
                r="48.5" 
                fill="#ffffff" 
                className="dark:fill-slate-900 transition-colors"
              />
              <circle 
                cx="50" 
                cy="50" 
                r="46" 
                stroke="#1066e2" 
                strokeWidth="3.2" 
                fill="#ffffff" 
                className="dark:fill-slate-900 transition-colors"
              />
            </>
          )}

          <image 
            href={customLogo} 
            x="6" 
            y="6" 
            width="88" 
            height="88" 
            clipPath={`url(#${clipPathId})`}
            preserveAspectRatio="xMidYMid slice" 
          />
        </svg>
      ) : (
        /* Brand new vector SVG representing the "T" and Chat bubble logo precisely */
        <svg 
          viewBox="0 0 512 512" 
          className={`${sizeClasses[size]} shrink-0 block transition-transform duration-200 group-hover/logo:scale-105 rounded-full`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id={bgGradId} cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#f8faff" />
            </radialGradient>

            <linearGradient id={brandGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3da2ff" />
              <stop offset="40%" stopColor="#1a7eff" />
              <stop offset="100%" stopColor="#0052d9" />
            </linearGradient>

            <linearGradient id={shadowGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a4dbd" />
              <stop offset="100%" stopColor="#05338a" />
            </linearGradient>

            <filter id={dropShadowId} x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="3" dy="10" stdDeviation="8" floodColor="#0a3fa0" floodOpacity="0.18" />
            </filter>
          </defs>

          <circle cx="256" cy="256" r="238" fill={`url(#${bgGradId})`} stroke="#1066e2" strokeWidth="15" />

          <g transform="translate(6, 12)">
            <path d="M 115 190 
                     C 102 190, 96 178, 102 165 
                     L 132 105 
                     C 137 95, 148 90, 162 90 
                     L 380 90 
                     C 395 90, 408 100, 400 118 
                     L 372 178 
                     C 367 190, 354 195, 340 195 
                     L 270 195 
                     L 190 380 
                     C 182 398, 166 408, 142 408 
                     C 118 408, 108 395, 115 378 
                     L 175 240 
                     L 115 240 
                     C 102 240, 96 230, 102 218 
                     L 115 190 Z" 
                  fill={`url(#${shadowGradId})`} />

            <path d="M 260 230 
                     L 390 230 
                     Q 420 230, 420 260 
                     L 420 350 
                     Q 420 380, 390 380 
                     L 300 380 
                     L 245 415 
                     L 260 375 
                     Q 250 370, 250 350 
                     L 250 260 
                     Q 250 230, 260 230 Z" 
                  fill={`url(#${shadowGradId})`} />
          </g>

          <g filter={`url(#${dropShadowId})`}>
            <path d="M 115 190 
                     C 102 190, 96 178, 102 165 
                     L 132 105 
                     C 137 95, 148 90, 162 90 
                     L 380 90 
                     C 395 90, 408 100, 400 118 
                     L 372 178 
                     C 367 190, 354 195, 340 195 
                     L 270 195 
                     L 190 380 
                     C 182 398, 166 408, 142 408 
                     C 118 408, 108 395, 115 378 
                     L 175 240 
                     L 115 240 
                     C 102 240, 96 230, 102 218 
                     L 115 190 Z" 
                  fill={`url(#${brandGradId})`} />

            <path d="M 260 230 
                     L 390 230 
                     Q 420 230, 420 260 
                     L 420 350 
                     Q 420 380, 390 380 
                     L 300 380 
                     L 245 415 
                     L 260 375 
                     Q 250 370, 250 350 
                     L 250 260 
                     Q 250 230, 260 230 Z" 
                  fill={`url(#${brandGradId})`} />

            <circle cx="295" cy="305" r="14" fill="#ffffff" />
            <circle cx="335" cy="305" r="14" fill="#ffffff" />
            <circle cx="375" cy="305" r="14" fill="#ffffff" />
          </g>
        </svg>
      )}

      {/* Action triggers */}
      {editable && (
        <>
          {/* Bottom-right Camera Icon Upload Trigger */}
          <span
            className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-full text-white shadow-md border-2 border-white dark:border-slate-900 opacity-0 group-hover/logo:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer hover:bg-indigo-700 hover:scale-110 active:scale-95 z-20 flex items-center justify-center"
            title={customLogo ? "Change logo image" : "Upload your image logo"}
            aria-label="Upload custom logo image"
            id={`logo-upload-btn-${uniqueId}`}
          >
            <Camera className="w-3.5 h-3.5" />
          </span>

          {/* Top-right Trash Icon Reset Trigger */}
          {customLogo && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute -top-1 -right-1 p-1 bg-rose-600 rounded-full text-white shadow-md border-2 border-white dark:border-slate-900 opacity-0 group-hover/logo:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer hover:bg-rose-500 hover:scale-110 active:scale-95 z-20 flex items-center justify-center"
              title="Reset logo to default"
              aria-label="Reset logo to default"
              id={`logo-reset-btn-${uniqueId}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </>
      )}
    </ContainerComponent>
  );
}
