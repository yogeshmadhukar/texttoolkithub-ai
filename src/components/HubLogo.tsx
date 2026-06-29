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
                stroke="#6366f1" 
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
        /* Default brand wrench logo SVG from public/logo.svg, updated to premium brand indigo */
        <svg 
          viewBox="0 0 512 512" 
          className={`${sizeClasses[size]} shrink-0 block transition-transform duration-200 group-hover/logo:scale-105 rounded-xl shadow-sm`}
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Rounded Squircle Background in Royal Indigo #6366f1 */}
          <rect width="512" height="512" rx="116" fill="#6366f1" />
          
          {/* White Wrench Silhouette */}
          {/* Main Head Circle */}
          <circle cx="256" cy="180" r="74" fill="#ffffff" />
          
          {/* Neck Connection */}
          <rect x="220" y="220" width="72" height="40" fill="#ffffff" />
          
          {/* Handle Grip */}
          <rect x="212" y="250" width="88" height="136" rx="28" fill="#ffffff" />
          
          {/* Tapered Bottom End (Screwdriver / Wedge tip) */}
          <path d="M 226,380 L 286,380 L 274,420 C 273,423 270,425 266,425 L 246,425 C 242,425 239,423 238,420 Z" fill="#ffffff" />
          
          {/* Indigo Cuts/Carvings representing empty details */}
          {/* Rotated head cutout (opening at 30 degrees) */}
          <g transform="rotate(30, 256, 180)">
            <rect x="234" y="90" width="44" height="90" rx="6" fill="#6366f1" />
            <circle cx="256" cy="180" r="22" fill="#6366f1" />
          </g>
          
          {/* Two vertical slots on the handle grip */}
          <rect x="230" y="276" width="16" height="84" rx="8" fill="#6366f1" />
          <rect x="266" y="276" width="16" height="84" rx="8" fill="#6366f1" />
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
