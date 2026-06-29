import React, { useState, useEffect, useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { logoConfig } from '../logo-config';
import { isDevSession } from '../types';

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
  const [useImgTag, setUseImgTag] = useState<boolean>(() => {
    return localStorage.getItem('texttoolkithub_use_img_tag') === 'true';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Create unique IDs to support multiple SVG instances in the DOM
  const uniqueId = React.useId ? React.useId().replace(/:/g, '') : Math.random().toString(36).substr(2, 9);
  const clipPathId = `logo-c-${uniqueId}`;
  const brandGradId = `logo-bg-grad-${uniqueId}`;
  const bubbleGradId = `logo-bubble-grad-${uniqueId}`;
  const shadowGradId = `logo-sh-grad-${uniqueId}`;
  const bgGradId = `logo-radial-grad-${uniqueId}`;
  const dropShadowId = `logo-ds-filter-${uniqueId}`;

  useEffect(() => {
    const checkLogo = () => {
      const saved = localStorage.getItem('texttoolkithub_custom_logo');
      if (saved) {
        setCustomLogo(saved);
      } else if (logoConfig.hasCustomLogo && logoConfig.logoType !== 'svg') {
        setCustomLogo(`/logo.svg?v=${logoConfig.updatedAt}`);
      } else {
        setCustomLogo('');
      }
      setUseImgTag(localStorage.getItem('texttoolkithub_use_img_tag') === 'true');
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow file uploading in development mode
    if (!isDevSession()) return;

    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("Please upload an image smaller than 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          // Store in localStorage first for instant client-side update
          localStorage.setItem('texttoolkithub_custom_logo', base64String);
          setCustomLogo(base64String);
          window.dispatchEvent(new Event('logo-updated'));

          // Try saving to the backend filesystem if the API is running
          try {
            const response = await fetch('/api/upload-logo', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                mimeType: file.type,
                base64: base64String,
              }),
            });
            const data = await response.json();
            if (response.ok && data.success) {
              console.log("Successfully saved custom logo to server filesystem!");
            }
          } catch (serverErr) {
            console.warn("Server upload failed (expected in static environments). Saved client-side in localStorage:", serverErr);
          }
        } catch (error) {
          console.error("Failed to save logo:", error);
          alert("Failed to save custom logo.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Only allow resetting in development mode
    if (!isDevSession()) return;

    if (confirm("Reset logo to default brand logo?")) {
      localStorage.removeItem('texttoolkithub_custom_logo');
      setCustomLogo('');
      window.dispatchEvent(new Event('logo-updated'));

      try {
        await fetch('/api/reset-logo', { method: 'POST' });
      } catch (err) {
        console.warn("Server reset ignored (expected in static environments). Reset successfully in client-side localStorage.");
      }
    }
  };

  const handleSecretClick = (e: React.MouseEvent) => {
    // Secret backdoor is strictly disabled in production
    if (!isDevSession()) return;

    // Shift+Click or Ctrl+Click on the logo triggers the file upload
    if (!editable && (e.shiftKey || e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  const handleSecretDoubleClick = (e: React.MouseEvent) => {
    // Secret backdoor is strictly disabled in production
    if (!isDevSession()) return;

    // Double-click triggers the file upload
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

  const isDev = isDevSession();
  const isEditable = editable && isDev;

  const ContainerComponent = isEditable ? 'label' : 'div';

  return (
    <ContainerComponent 
      className={`relative group/logo inline-block shrink-0 ${isEditable ? 'cursor-pointer select-none' : ''} ${className}`} 
      id={`logo-container-${uniqueId}`}
      title={
        isEditable 
          ? (customLogo ? "Click to change custom logo image" : "Click to upload your image logo") 
          : "TextToolkitHub"
      }
      onClick={handleSecretClick}
      onDoubleClick={handleSecretDoubleClick}
    >
      {/* Hidden input field for custom logo upload (dev-only) */}
      {isDev && (
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
      )}

      {customLogo && useImgTag ? (
        <img 
          src={customLogo} 
          alt="TextToolkitHub Logo" 
          className={`${sizeClasses[size]} shrink-0 block transition-transform duration-200 group-hover/logo:scale-105 object-contain ${withCircleBorder ? 'rounded-full border border-indigo-600/30 p-0.5 bg-white dark:bg-slate-900 shadow-sm' : ''}`}
          id={`logo-img-${uniqueId}`}
          referrerPolicy="no-referrer"
        />
      ) : customLogo ? (
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

            <linearGradient id={bubbleGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
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
            <path d="M 140 130 
                     L 340 130 
                     C 356 130, 370 144, 370 160 
                     C 370 176, 356 190, 340 190 
                     L 275 190 
                     L 220 410 
                     C 220 429, 205 440, 185 440 
                     C 165 440, 150 429, 150 410 
                     L 205 190 
                     L 140 190 
                     C 124 190, 110 176, 110 160 
                     C 110 144, 124 130, 140 130 
                     Z" 
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
            <path d="M 140 130 
                     L 340 130 
                     C 356 130, 370 144, 370 160 
                     C 370 176, 356 190, 340 190 
                     L 275 190 
                     L 220 410 
                     C 220 429, 205 440, 185 440 
                     C 165 440, 150 429, 150 410 
                     L 205 190 
                     L 140 190 
                     C 124 190, 110 176, 110 160 
                     C 110 144, 124 130, 140 130 
                     Z" 
                  fill={`url(#${brandGradId})`} />

            {/* Chat Bubble White Mask Separator (draws a thick border underneath the fill to slice the T stem) */}
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
                  fill="none" 
                  stroke="#ffffff" 
                  strokeWidth="12" 
                  strokeLinejoin="round" 
                  strokeLinecap="round" />

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
                  fill={`url(#${bubbleGradId})`} />

            <circle cx="295" cy="305" r="14" fill="#ffffff" />
            <circle cx="335" cy="305" r="14" fill="#ffffff" />
            <circle cx="375" cy="305" r="14" fill="#ffffff" />
          </g>
        </svg>
      )}

      {/* Action triggers (dev-only) */}
      {isEditable && (
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

