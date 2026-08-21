import React from 'react';
import { appIconMaster } from '../assets/images';

interface AppIconProps {
  className?: string;
  size?: number | string;
  useImage?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({ className = "w-full h-full", size, useImage = true }) => {
  const style = size ? { width: size, height: size } : undefined;

  if (useImage) {
    return (
      <img
        src={appIconMaster}
        alt="AgriMach App Icon"
        className={`object-contain rounded-2xl ${className}`}
        style={style}
        onError={(e) => {
          // Fallback if image fails to load
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 512 512" 
      className={className}
      style={style}
      fill="currentColor"
    >
      <defs>
        <linearGradient id="appIconBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id="appIconGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="appIconMetallicGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="50%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>
        <linearGradient id="appIconOrangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffedd5" />
          <stop offset="30%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>
      </defs>

      {/* Background Rounded Shield */}
      <rect width="512" height="512" rx="115" fill="url(#appIconBgGrad)" />
      <rect x="8" y="8" width="496" height="496" rx="107" fill="none" stroke="url(#appIconGoldGrad)" strokeWidth="6" strokeOpacity="0.5" />

      {/* Outer Heavy Industrial Gear Ring */}
      <g transform="translate(256, 256)">
        {/* 8 Gear Teeth */}
        <path d="M-30,-190 L30,-190 L24,-150 L-24,-150 Z" fill="url(#appIconGoldGrad)" />
        <path d="M-30,-190 L30,-190 L24,-150 L-24,-150 Z" transform="rotate(45)" fill="url(#appIconGoldGrad)" />
        <path d="M-30,-190 L30,-190 L24,-150 L-24,-150 Z" transform="rotate(90)" fill="url(#appIconGoldGrad)" />
        <path d="M-30,-190 L30,-190 L24,-150 L-24,-150 Z" transform="rotate(135)" fill="url(#appIconGoldGrad)" />
        <path d="M-30,-190 L30,-190 L24,-150 L-24,-150 Z" transform="rotate(180)" fill="url(#appIconGoldGrad)" />
        <path d="M-30,-190 L30,-190 L24,-150 L-24,-150 Z" transform="rotate(225)" fill="url(#appIconGoldGrad)" />
        <path d="M-30,-190 L30,-190 L24,-150 L-24,-150 Z" transform="rotate(270)" fill="url(#appIconGoldGrad)" />
        <path d="M-30,-190 L30,-190 L24,-150 L-24,-150 Z" transform="rotate(315)" fill="url(#appIconGoldGrad)" />

        {/* Gear Body Circle */}
        <circle r="155" fill="url(#appIconGoldGrad)" />
        <circle r="120" fill="#0f172a" />
        <circle r="112" fill="none" stroke="url(#appIconGoldGrad)" strokeWidth="4" strokeDasharray="8,8" />
      </g>

      {/* Tractor Tire Tread Marks */}
      <g fill="url(#appIconGoldGrad)" opacity="0.95">
        <path d="M210,130 L256,165 L302,130 L314,146 L256,190 L198,146 Z" />
        <path d="M210,382 L256,347 L302,382 L314,366 L256,322 L198,366 Z" />
      </g>

      {/* Center Crossed Heavy Wrench Emblem */}
      <g transform="translate(256, 256)">
        {/* Crossed Mechanical Wrench 1 */}
        <g transform="rotate(45)">
          <rect x="-14" y="-105" width="28" height="210" rx="14" fill="url(#appIconMetallicGrad)" />
          <path d="M-35,-105 C-35,-135 35,-135 35,-105 C35,-90 20,-85 20,-85 L-20,-85 C-20,-85 -35,-90 -35,-105 Z" fill="url(#appIconMetallicGrad)" />
          <circle cx="0" cy="-105" r="16" fill="#0f172a" />
          <circle cx="0" cy="100" r="30" fill="url(#appIconMetallicGrad)" />
          <circle cx="0" cy="100" r="15" fill="#0f172a" />
        </g>

        {/* Crossed Mechanical Wrench 2 */}
        <g transform="rotate(-45)">
          <rect x="-14" y="-105" width="28" height="210" rx="14" fill="url(#appIconOrangeGrad)" />
          <path d="M-35,-105 C-35,-135 35,-135 35,-105 C35,-90 20,-85 20,-85 L-20,-85 C-20,-85 -35,-90 -35,-105 Z" fill="url(#appIconOrangeGrad)" />
          <circle cx="0" cy="-105" r="16" fill="#0f172a" />
          <circle cx="0" cy="100" r="30" fill="url(#appIconOrangeGrad)" />
          <circle cx="0" cy="100" r="15" fill="#0f172a" />
        </g>

        {/* Center Core Hub Nut */}
        <circle r="38" fill="#0f172a" stroke="url(#appIconGoldGrad)" strokeWidth="8" />
        <polygon points="0,-18 16,-9 16,9 0,18 -16,9 -16,-9" fill="url(#appIconGoldGrad)" />
      </g>
    </svg>
  );
};
