import React from 'react';

interface QiandaoLogoProps {
  className?: string;
  size?: number | string;
  shadow?: boolean;
}

/**
 * 千岛 (Qiandao) QDF Official Brand Icon Component
 * Vector recreation based exactly on the brand asset:
 * - Periwinkle purple rounded squircle background with cloud patterns
 * - Bold custom white '千岛' typography with the signature circle dot in '岛'
 * - 'QDF' badge typography at the bottom cloud
 * - Cute smiling yellow star mascot with trailing sparkles on the left
 * - Cute pink blob creature mascot on the right
 */
export const QiandaoLogo: React.FC<QiandaoLogoProps> = ({
  className = '',
  size = 112,
  shadow = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${
        shadow ? 'drop-shadow-[0_12px_24px_rgba(79,70,229,0.45)]' : ''
      } ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full block overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Background Gradient (Periwinkle Indigo to Royal Purple) */}
          <linearGradient id="qd-bg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6C72FC" />
            <stop offset="55%" stopColor="#5856F0" />
            <stop offset="100%" stopColor="#4A45E5" />
          </linearGradient>

          {/* Cloud Outline / Bottom Gradient */}
          <linearGradient id="qd-cloud-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EAF1FF" />
          </linearGradient>

          {/* Star Mascot Gradient */}
          <linearGradient id="qd-star-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#FACC15" />
          </linearGradient>

          {/* Pink Creature Mascot Gradient */}
          <linearGradient id="qd-pink-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>

          {/* Clip path for the squircle app icon */}
          <clipPath id="qd-squircle-clip">
            <rect width="200" height="200" rx="46" ry="46" />
          </clipPath>

          {/* Filter for subtle 3D text lift */}
          <filter id="qd-text-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#312E81" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Squircle Base with Clip */}
        <g clipPath="url(#qd-squircle-clip)">
          {/* 1. Purple App Icon Canvas */}
          <rect width="200" height="200" fill="url(#qd-bg)" />

          {/* 2. Floating Ambient Purple Clouds in Sky */}
          {/* Top Left Cloud */}
          <path
            d="M -10 38 C 5 28, 30 28, 42 38 C 52 38, 62 48, 60 58 C 58 68, 10 70, -10 65 Z"
            fill="#4F46E5"
            opacity="0.35"
          />
          {/* Top Right Cloud */}
          <path
            d="M 140 32 C 152 20, 185 20, 196 32 C 205 32, 215 42, 210 54 C 205 65, 155 64, 140 54 Z"
            fill="#4F46E5"
            opacity="0.3"
          />

          {/* 3. Bottom White Rolling Clouds Background */}
          {/* Dark outline under cloud */}
          <path
            d="M -10 148 
               C 15 130, 45 132, 60 144
               C 85 124, 125 124, 146 142
               C 165 126, 205 132, 220 156
               L 220 220 L -10 220 Z"
            fill="#3B42CE"
            opacity="0.4"
          />
          {/* White Clouds Base */}
          <path
            d="M -10 152 
               C 15 134, 45 136, 60 148
               C 85 128, 125 128, 146 146
               C 165 130, 205 136, 220 160
               L 220 220 L -10 220 Z"
            fill="url(#qd-cloud-grad)"
          />

          {/* 4. Bold White Typography: 千 岛 */}
          <g filter="url(#qd-text-shadow)">
            {/* === '千' Character === */}
            {/* Top slanted stroke: 丿 */}
            <path
              d="M 94 40 C 78 44, 48 54, 32 64"
              stroke="#FFFFFF"
              strokeWidth="15"
              strokeLinecap="round"
            />
            {/* Horizontal stroke: 一 */}
            <path
              d="M 28 84 L 94 77"
              stroke="#FFFFFF"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Vertical stroke: 丨 */}
            <path
              d="M 60 55 L 56 114"
              stroke="#FFFFFF"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* === '岛' Character === */}
            {/* Top hook / head stroke */}
            <path
              d="M 112 44 L 170 39 C 176 39, 178 43, 176 49 L 171 72 C 170 76, 166 78, 160 78 L 110 82"
              stroke="#FFFFFF"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* The signature inside circle / sun dot (●) */}
            <circle cx="140" cy="60" r="8.5" fill="#FFFFFF" />

            {/* Vertical stem stroke */}
            <path
              d="M 114 44 L 110 110"
              stroke="#FFFFFF"
              strokeWidth="15"
              strokeLinecap="round"
            />

            {/* Bottom Mountain (山) Part */}
            <path
              d="M 104 98 L 102 114 C 101 122, 108 126, 116 126 L 166 122 C 174 122, 178 116, 177 108 L 175 92"
              stroke="#FFFFFF"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path
              d="M 137 98 L 137 122"
              stroke="#FFFFFF"
              strokeWidth="14"
              strokeLinecap="round"
            />
          </g>

          {/* 5. Left Cute Yellow Star Mascot */}
          <g transform="translate(28, 134)">
            {/* Star Body */}
            <path
              d="M 0 -18 
                 L 4.5 -5.5 
                 L 18 -4 
                 L 8 5.5 
                 L 11 18 
                 L 0 11 
                 L -11 18 
                 L -8 5.5 
                 L -18 -4 
                 L -4.5 -5.5 Z"
              fill="url(#qd-star-grad)"
              stroke="#EAB308"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Eyes */}
            <circle cx="-3.5" cy="0" r="1.5" fill="#78350F" />
            <circle cx="3.5" cy="0" r="1.5" fill="#78350F" />
            {/* Smiling mouth */}
            <path
              d="M -3 3.5 Q 0 6.5 3 3.5"
              stroke="#78350F"
              strokeWidth="1.3"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* Mini trailing sparkles under star */}
          <g transform="translate(18, 164)">
            <ellipse cx="0" cy="0" rx="3.5" ry="4.5" transform="rotate(-20)" fill="#FACC15" />
          </g>
          <g transform="translate(36, 182)">
            <path
              d="M 0 -8 L 2.5 -2.5 L 8 -1.5 L 3.5 2.5 L 5 8 L 0 5 L -5 8 L -3.5 2.5 L -8 -1.5 L -2.5 -2.5 Z"
              fill="#FDE047"
            />
          </g>

          {/* 6. Right Cute Pink Mascot (Squishy round creature) */}
          <g transform="translate(170, 160)">
            {/* Body */}
            <path
              d="M -26 -16 
                 C -12 -28, 12 -26, 24 -12 
                 C 32 0, 30 18, 18 26 
                 C 6 32, -18 30, -28 20 
                 C -36 10, -36 -4, -26 -16 Z"
              fill="url(#qd-pink-grad)"
              stroke="#DB2777"
              strokeWidth="2"
            />
            {/* White big cartoon eyes */}
            <ellipse cx="-4" cy="-4" rx="4.5" ry="6" fill="#FFFFFF" />
            <circle cx="-3" cy="-4" r="2.2" fill="#0F172A" />
            <circle cx="-4" cy="-5" r="0.9" fill="#FFFFFF" />

            <ellipse cx="8" cy="-5" rx="4.5" ry="6" fill="#FFFFFF" />
            <circle cx="7" cy="-5" r="2.2" fill="#0F172A" />
            <circle cx="6" cy="-6" r="0.9" fill="#FFFFFF" />

            {/* Cute nose and open surprised mouth */}
            <ellipse cx="2" cy="1" rx="1.2" ry="1.8" fill="#BE185D" />
            <circle cx="2" cy="6" r="2.2" fill="#BE185D" />
          </g>

          {/* 7. Center Bottom "QDF" Badge */}
          <g transform="translate(100, 174)">
            {/* White Cloud Pill Background for QDF */}
            <rect
              x="-48"
              y="-18"
              width="96"
              height="36"
              rx="18"
              fill="#FFFFFF"
              stroke="#E0E7FF"
              strokeWidth="2.5"
            />
            {/* QDF Text in Bold Indigo */}
            <text
              x="0"
              y="7"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="900"
              fontSize="23"
              letterSpacing="1"
              fill="#3730A3"
            >
              QDF
            </text>
          </g>
        </g>

        {/* Outer White Border / Gloss Highlight on Squircle */}
        <rect
          width="196"
          height="196"
          x="2"
          y="2"
          rx="44"
          ry="44"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="4"
          opacity="0.85"
        />
      </svg>
    </div>
  );
};
