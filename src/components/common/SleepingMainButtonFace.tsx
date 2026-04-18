import React, { useId } from 'react';

type SleepingMainButtonFaceProps = {
  className?: string;
};

export function SleepingMainButtonFace({ className = '' }: SleepingMainButtonFaceProps) {
  const gradientId = useId().replace(/:/g, '');
  const bodyGradientId = `${gradientId}-body`;
  const legGradientId = `${gradientId}-leg`;
  const strokeColor = '#163815';
  const strokeWidth = 5;

  return (
    <div className={`relative flex items-center justify-center ${className}`} aria-hidden="true">
      <style>{`
        @keyframes breatheSleep {
          0%, 100% { transform: scale(1, 0.96) translateY(2px); }
          50% { transform: scale(1, 0.99) translateY(0px); }
        }
        @keyframes floatZ {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.4);
          }
          15% {
            opacity: 0.9;
            transform: translate(3px, -8px) scale(0.7);
          }
          50% {
            opacity: 0.6;
            transform: translate(8px, -22px) scale(1.1);
          }
          80% {
            opacity: 0.15;
            transform: translate(14px, -36px) scale(1.4);
          }
          100% {
            opacity: 0;
            transform: translate(18px, -48px) scale(1.6);
          }
        }
        .z-particle {
          font-family: 'Comic Sans MS', 'Chalkboard SE', 'Nunito', sans-serif;
          font-weight: 900;
          fill: rgba(255, 255, 255, 0.9);
          animation: floatZ 3.5s infinite ease-in;
          transform-origin: 105px 55px;
        }
        .z1 { animation-delay: 0s; font-size: 16px; }
        .z2 { animation-delay: 1.1s; font-size: 16px; }
        .z3 { animation-delay: 2.2s; font-size: 16px; }
        @media (prefers-reduced-motion: reduce) {
          .z-particle {
            animation: none;
          }
          .sleep-breathing {
            animation: none !important;
          }
        }
      `}</style>

      <div className="relative w-full h-full pointer-events-none">
        <svg viewBox="0 0 140 100" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={bodyGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c3eb78" />
              <stop offset="60%" stopColor="#9bd953" />
              <stop offset="100%" stopColor="#78b833" />
            </linearGradient>
            <linearGradient id={legGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9bd953" />
              <stop offset="100%" stopColor="#649e24" />
            </linearGradient>
          </defs>

          <text x="105" y="55" className="z-particle z1">Z</text>
          <text x="105" y="55" className="z-particle z2">z</text>
          <text x="105" y="55" className="z-particle z3">Z</text>

          <ellipse cx="70" cy="88" rx="36" ry="5" fill="rgba(0,0,0,0.25)" opacity="0.6" />

          <g className="sleep-breathing" style={{ transformOrigin: '70px 80px', animation: 'breatheSleep 3.5s infinite ease-in-out' }}>
            <g style={{ transform: 'translateY(12px)' }}>
              <g style={{ transformOrigin: '38px 65px', transform: 'rotate(-45deg)' }}>
                <path d="M 40 74 C 15 75, 5 60, 15 42 C 22 30, 35 38, 28 48 C 22 55, 25 60, 38 56 Z" fill={`url(#${bodyGradientId})`} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 18 48 C 12 55, 18 68, 35 68" fill="none" stroke="#c3eb78" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              </g>

              <g style={{ transformOrigin: '54px 65px', transform: 'rotate(35deg)' }}>
                <path d="M 54 65 Q 42 85 58 85 Q 65 85 62 70 L 54 65 Z" fill={`url(#${legGradientId})`} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 52 85 L 52 80 M 56 85 L 56 80" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
              </g>

              <g>
                <path d="M 38 75 C 35 50, 60 45, 85 65 C 75 80, 55 82, 38 75 Z" fill={`url(#${bodyGradientId})`} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
                <path
                  d="M 50 50 Q 55 40 60 49 M 62 50 Q 68 40 73 52 M 75 54 Q 82 45 86 58"
                  fill="#78b833"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transformOrigin: '65px 50px', transform: 'scaleY(0.6) rotate(15deg)' }}
                />
              </g>

              <g style={{ transformOrigin: '85px 65px', transform: 'rotate(-35deg)' }}>
                <path d="M 85 65 Q 75 85 90 85 Q 98 85 92 68 L 85 65 Z" fill={`url(#${legGradientId})`} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 84 85 L 84 80 M 88 85 L 88 80" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
              </g>

              <g style={{ transformOrigin: '80px 64px', transform: 'rotate(15deg)' }}>
                <path d="M 80 64 C 80 45, 100 45, 115 55 C 122 60, 118 75, 105 78 C 90 82, 80 75, 80 64 Z" fill={`url(#${bodyGradientId})`} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
                <path d="M 90 70 Q 102 75 112 68" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
                <circle cx="110" cy="60" r="1.5" fill={strokeColor} />

                <g style={{ transformOrigin: '98px 58px', transform: 'scaleY(0.1)' }}>
                  <circle cx="98" cy="58" r="6" fill={strokeColor} />
                </g>
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}