import React from 'react';

interface HubLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withCircleBorder?: boolean;
}

export default function HubLogo({ className = '', size = 'md', withCircleBorder = true }: HubLogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  return (
    <svg 
      viewBox="0 0 100 100" 
      className={`${sizeClasses[size]} ${className} shrink-0`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2575fc" />
          <stop offset="100%" stopColor="#0052ec" />
        </linearGradient>
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
        fill="url(#logo-blue-gradient)" 
      />

      {/* Bubble Main Face */}
      <path 
        d="M 58 54 C 54 54, 52 56, 52 60 L 52 70 C 52 74, 54 76, 58 76 L 61 76 L 56 83 C 55.5 83.8, 56.5 84.5, 57.5 84 L 66 79 L 82 79 C 86 79, 88 77, 88 73 L 88 60 C 88 56, 86 54, 82 54 Z"
        fill="url(#logo-blue-gradient)"
      />

      {/* Dots Centered Inside Speech Bubble */}
      <circle cx="63.5" cy="65.5" r="2.8" fill="#ffffff" />
      <circle cx="70.5" cy="65.5" r="2.8" fill="#ffffff" />
      <circle cx="77.5" cy="65.5" r="2.8" fill="#ffffff" />
    </svg>
  );
}
