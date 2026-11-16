import React from 'react';

interface FlagProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

/**
 * Official Flag of Cambodia (ទង់ជាតិកម្ពុជា)
 * Blue - Red (with Angkor Wat in white) - Blue
 */
export function CambodiaFlag({ className = 'w-5 h-3.5', ...props }: FlagProps) {
  return (
    <svg
      viewBox="0 0 640 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ទង់ជាតិកម្ពុជា (Cambodia Flag)"
      {...props}
    >
      {/* Top Blue Stripe (1/4 height) */}
      <rect width="640" height="100" fill="#032EA1" />
      {/* Middle Red Stripe (2/4 height) */}
      <rect y="100" width="640" height="200" fill="#E00025" />
      {/* Bottom Blue Stripe (1/4 height) */}
      <rect y="300" width="640" height="100" fill="#032EA1" />

      {/* Angkor Wat Silhouette in White */}
      <g fill="#FFFFFF" transform="translate(195, 120) scale(0.42)">
        {/* Base foundation platform */}
        <path d="M 30,260 L 570,260 L 585,275 L 585,290 L 15,290 L 15,275 Z" />
        <rect x="40" y="240" width="520" height="20" />
        <rect x="70" y="215" width="460" height="25" />
        <rect x="90" y="195" width="420" height="20" />

        {/* Central main tower (tallest) */}
        <path d="M 300,10 L 290,40 L 285,70 L 275,100 L 270,140 L 265,195 L 335,195 L 330,140 L 325,100 L 315,70 L 310,40 Z" />
        {/* Central tower spire */}
        <polygon points="300,0 297,12 303,12" />
        {/* Center tower tiers detail */}
        <rect x="280" y="65" width="40" height="4" fill="#E00025" />
        <rect x="276" y="100" width="48" height="4" fill="#E00025" />
        <rect x="272" y="140" width="56" height="5" fill="#E00025" />

        {/* Left inner tower */}
        <path d="M 210,65 L 202,90 L 198,115 L 190,145 L 185,195 L 235,195 L 230,145 L 222,115 L 218,90 Z" />
        <polygon points="210,55 208,66 212,66" />
        <rect x="200" y="112" width="20" height="3" fill="#E00025" />
        <rect x="194" y="145" width="32" height="4" fill="#E00025" />

        {/* Right inner tower */}
        <path d="M 390,65 L 382,90 L 378,115 L 370,145 L 365,195 L 415,195 L 410,145 L 402,115 L 398,90 Z" />
        <polygon points="390,55 388,66 392,66" />
        <rect x="380" y="112" width="20" height="3" fill="#E00025" />
        <rect x="374" y="145" width="32" height="4" fill="#E00025" />

        {/* Far left flank tower */}
        <path d="M 130,110 L 124,130 L 120,155 L 115,195 L 145,195 L 140,155 L 136,130 Z" />
        <polygon points="130,102 128,111 132,111" />

        {/* Far right flank tower */}
        <path d="M 470,110 L 464,130 L 460,155 L 455,195 L 485,195 L 480,155 L 476,130 Z" />
        <polygon points="470,102 468,111 472,111" />
      </g>
    </svg>
  );
}

/**
 * Flag of the United Kingdom (Union Jack) for English
 */
export function UkFlag({ className = 'w-5 h-3.5', ...props }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Flag of the United Kingdom"
      {...props}
    >
      <clipPath id="uk-clip">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <g clipPath="url(#uk-clip)">
        {/* Dark Blue Field */}
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        {/* White Diagonals */}
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        {/* Red Diagonals (saltire) */}
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          stroke="#C8102E"
          strokeWidth="4"
          strokeDasharray="30 30"
        />
        {/* Broad White Cross */}
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        {/* Central Red Cross */}
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
