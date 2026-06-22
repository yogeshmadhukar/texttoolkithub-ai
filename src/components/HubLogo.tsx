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
  const gradientId = `logo-g-${uniqueId}`;
  const clipPathId = `logo-c-${uniqueId}`;

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
      if (file.size > 3 * 1024 * 1024) {
        alert("Please upload an image smaller than 3MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        localStorage.setItem('texttoolkithub_custom_logo', base64String);
        setCustomLogo(base64String);
        window.dispatchEvent(new Event('logo-updated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTriggerUpload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Reset logo to default Brand T icon?")) {
      localStorage.removeItem('texttoolkithub_custom_logo');
      setCustomLogo('');
      window.dispatchEvent(new Event('logo-updated'));
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <div className="relative group/logo inline-block shrink-0" id={`logo-container-${uniqueId}`}>
      {editable && (
        <input 
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id={`logo-file-input-${uniqueId}`}
        />
      )}

      <svg 
        viewBox="0 0 100 100" 
        className={`${sizeClasses[size]} ${className} shrink-0 block transition-transform duration-200`}
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2575fc" />
            <stop offset="100%" stopColor="#0052ec" />
          </linearGradient>
          <clipPath id={clipPathId}>
            <circle cx="50" cy="50" r="44" />
          </clipPath>
        </defs>

        {/* Circle Background & Border */}
        {withCircleBorder && (
          <>
            {/* Subtle outer soft ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="48.5" 
              fill="#ffffff" 
            />
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              stroke="#0052ec" 
              strokeWidth="3.2" 
              fill="#ffffff" 
            />
          </>
        )}

        {customLogo ? (
          <image 
            href={customLogo} 
            x="6" 
            y="6" 
            width="88" 
            height="88" 
            clipPath={`url(#${clipPathId})`}
            preserveAspectRatio="xMidYMid slice" 
          />
        ) : (
          <>
            {/* Default T-logo layout elements */}
            {/* T Shadow (gives the 3D bevel depth effect matching original layout) */}
            <path 
              d="M 23 37.5 C 23 33.5, 26 32, 33 32 L 72 32 C 78 32, 80 34, 77 38 C 74 42, 68 44, 60 44 L 51 44 L 43 76 C 41.5 82, 37 85, 30 85 L 26 85 C 23 85, 22 82, 23 78 L 32 44 L 26 44 C 22 44, 21 41, 23 37.5 Z" 
              fill="#093fbd"
              transform="translate(1.5, 2.5)"
            />

            {/* Bubble Shadow */}
            <path 
              d="M 58 54 C 54 54, 52 56, 52 60 L 52 70 C 52 74, 54 76, 58 76 L 61 76 L 56 83 C 55.5 83.8, 56.5 84.5, 57.5 84 L 66 79 L 82 79 C 86 79, 88 77, 88 73 L 88 60 C 88 56, 86 54, 82 54 Z"
              fill="#093fbd"
              transform="translate(1.5, 2.5)"
            />

            {/* T Main Face */}
            <path 
              d="M 23 37.5 C 23 33.5, 26 32, 33 32 L 72 32 C 78 32, 80 34, 77 38 C 74 42, 68 44, 60 44 L 51 44 L 43 76 C 41.5 82, 37 85, 30 85 L 26 85 C 23 85, 22 82, 23 78 L 32 44 L 26 44 C 22 44, 21 41, 23 37.5 Z" 
              fill={`url(#${gradientId})`} 
            />

            {/* Bubble Main Face */}
            <path 
              d="M 58 54 C 54 54, 52 56, 52 60 L 52 70 C 52 74, 54 76, 58 76 L 61 76 L 56 83 C 55.5 83.8, 56.5 84.5, 57.5 84 L 66 79 L 82 79 C 86 79, 88 77, 88 73 L 88 60 C 88 56, 86 54, 82 54 Z"
              fill={`url(#${gradientId})`}
            />

            {/* Dots Centered Inside Speech Bubble */}
            <circle cx="63.5" cy="65.5" r="2.8" fill="#ffffff" />
            <circle cx="70.5" cy="65.5" r="2.8" fill="#ffffff" />
            <circle cx="77.5" cy="65.5" r="2.8" fill="#ffffff" />
          </>
        )}
      </svg>

      {/* Hover action overlays */}
      {editable && (
        <>
          {/* Bottom-right Camera Icon Upload Trigger */}
          <button
            type="button"
            onClick={handleTriggerUpload}
            className="absolute -bottom-1 -right-1 p-1 bg-indigo-600 rounded-full text-white shadow-md border-2 border-white dark:border-slate-900 opacity-0 group-hover/logo:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer hover:bg-indigo-500 hover:scale-110 active:scale-95 z-20 flex items-center justify-center"
            title={customLogo ? "Change custom logo image" : "Upload your image logo"}
            aria-label="Upload custom image logo"
            id={`logo-upload-btn-${uniqueId}`}
          >
            <Camera className="w-3 h-3" />
          </button>

          {/* Top-right Trash Icon Reset Trigger (only if customLogo is present) */}
          {customLogo && (
            <button
              type="button"
              onClick={handleReset}
              className="absolute -top-1 -right-1 p-1 bg-rose-600 rounded-full text-white shadow-md border-2 border-white dark:border-slate-900 opacity-0 group-hover/logo:opacity-100 focus:opacity-100 transition-all duration-200 cursor-pointer hover:bg-rose-500 hover:scale-110 active:scale-95 z-20 flex items-center justify-center"
              title="Reset logo to default Brand T icon"
              aria-label="Reset logo to default"
              id={`logo-reset-btn-${uniqueId}`}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
