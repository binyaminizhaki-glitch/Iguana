import React, { useEffect, useId, useMemo, useState } from 'react';

type AnimatedOutsideButtonFaceProps = {
  active: boolean;
  className?: string;
};

export function AnimatedOutsideButtonFace({
  active,
  className = '',
}: AnimatedOutsideButtonFaceProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTwitching, setIsTwitching] = useState(false);
  const gradientId = useId().replace(/:/g, '');
  const bodyGradientId = useMemo(() => `${gradientId}-body`, [gradientId]);
  const legGradientId = useMemo(() => `${gradientId}-leg`, [gradientId]);

  useEffect(() => {
    if (!active) {
      setIsBlinking(false);
      setIsTwitching(false);
      return;
    }

    const blinkInterval = window.setInterval(() => {
      if (Math.random() > 0.4) {
        setIsBlinking(true);
        window.setTimeout(() => setIsBlinking(false), 120);

        if (Math.random() > 0.5) {
          window.setTimeout(() => {
            setIsBlinking(true);
            window.setTimeout(() => setIsBlinking(false), 120);
          }, 200);
        }
      }
    }, 3500);

    const twitchInterval = window.setInterval(() => {
      if (Math.random() > 0.6) {
        setIsTwitching(true);
        window.setTimeout(() => setIsTwitching(false), 200);
      }
    }, 4500);

    return () => {
      window.clearInterval(blinkInterval);
      window.clearInterval(twitchInterval);
    };
  }, [active]);

  const isAsleep = !active;
  const eyeTransform = isAsleep || isBlinking ? 'scaleY(0.05)' : 'scaleY(1)';
  const strokeColor = '#163815';
  const strokeWidth = 4.5;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      aria-hidden="true"
    >
      <style>{`
        @keyframes outside-iguana-breathe-sleep {
          0%, 100% { transform: scale(1, 0.97) translateY(2px); }
          50% { transform: scale(1, 0.99) translateY(0px); }
        }
        @keyframes outside-iguana-breathe-awake {
          0%, 100% { transform: scale(1, 1) rotate(0deg); }
          50% { transform: scale(1, 1.02) rotate(-0.45deg); }
        }
        @keyframes outside-iguana-tail-wag {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(10deg); }
        }
      `}</style>

      <svg viewBox="0 0 140 100" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id={bodyGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d0f188" />
            <stop offset="60%" stopColor="#a8de63" />
            <stop offset="100%" stopColor="#7fbc38" />
          </linearGradient>
          <linearGradient id={legGradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a4dc60" />
            <stop offset="100%" stopColor="#6ea92c" />
          </linearGradient>
        </defs>

        <ellipse
          cx="70"
          cy="88"
          rx={isAsleep ? 38 : 30}
          ry={isAsleep ? 5 : 4}
          fill="rgba(0,0,0,0.22)"
          style={{
            opacity: isAsleep ? 0.48 : 0.28,
            transition: 'all 0.8s ease',
          }}
        />

        <g
          style={{
            transformOrigin: '70px 80px',
            animation: isAsleep
              ? 'outside-iguana-breathe-sleep 3.5s infinite ease-in-out'
              : 'outside-iguana-breathe-awake 3s infinite ease-in-out',
          }}
        >
          <g
            style={{
              transformOrigin: '70px 80px',
              transform: isAsleep ? 'translateY(12px)' : 'translateY(0px)',
              transition: 'transform 0.9s cubic-bezier(0.34, 1.1, 0.64, 1)',
            }}
          >
            <g
              style={{
                transformOrigin: '38px 65px',
                transform: isAsleep ? 'rotate(-45deg)' : 'rotate(0deg)',
                transition: 'transform 0.9s cubic-bezier(0.34, 1.1, 0.64, 1)',
              }}
            >
              <g
                style={{
                  animation: active
                    ? 'outside-iguana-tail-wag 4s infinite ease-in-out'
                    : 'none',
                  transformOrigin: '38px 65px',
                }}
              >
                <path
                  d="M 40 74 C 15 75, 5 60, 15 42 C 22 30, 35 38, 28 48 C 22 55, 25 60, 38 56 Z"
                  fill={`url(#${bodyGradientId})`}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M 18 48 C 12 55, 18 68, 35 68"
                  fill="none"
                  stroke="#d8f3a0"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.55"
                />
              </g>
            </g>

            <g
              style={{
                transformOrigin: '54px 65px',
                transform: isAsleep ? 'rotate(35deg)' : 'rotate(0deg)',
                transition: 'transform 0.88s cubic-bezier(0.34, 1.1, 0.64, 1)',
              }}
            >
              <path
                d="M 54 65 Q 42 85 58 85 Q 65 85 62 70 L 54 65 Z"
                fill={`url(#${legGradientId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 52 85 L 52 80 M 56 85 L 56 80"
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            <g>
              <path
                d="M 38 75 C 35 50, 60 45, 85 65 C 75 80, 55 82, 38 75 Z"
                fill={`url(#${bodyGradientId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
              />
              <path
                d="M 50 50 Q 55 40 60 49 M 62 50 Q 68 40 73 52 M 75 54 Q 82 45 86 58"
                fill="#7fbc38"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transformOrigin: '65px 50px',
                  transform: isAsleep ? 'scaleY(0.6) rotate(15deg)' : 'scaleY(1) rotate(0deg)',
                  transition: 'transform 0.85s cubic-bezier(0.34, 1.1, 0.64, 1)',
                }}
              />
            </g>

            <g
              style={{
                transformOrigin: '85px 65px',
                transform: isAsleep ? 'rotate(-35deg)' : 'rotate(0deg)',
                transition: 'transform 0.85s cubic-bezier(0.34, 1.1, 0.64, 1)',
              }}
            >
              <path
                d="M 85 65 Q 75 85 90 85 Q 98 85 92 68 L 85 65 Z"
                fill={`url(#${legGradientId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 84 85 L 84 80 M 88 85 L 88 80"
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            <g
              style={{
                transformOrigin: '80px 64px',
                transform: active
                  ? isTwitching
                    ? 'rotate(2deg) translateX(1px)'
                    : 'rotate(0deg)'
                  : 'rotate(15deg)',
                transition: active
                  ? 'transform 0.18s ease-out'
                  : 'transform 0.9s cubic-bezier(0.34, 1.1, 0.64, 1)',
              }}
            >
              <path
                d="M 80 64 C 80 45, 100 45, 115 55 C 122 60, 118 75, 105 78 C 90 82, 80 75, 80 64 Z"
                fill={`url(#${bodyGradientId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
              />
              <path
                d="M 90 70 Q 102 75 112 68"
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="110" cy="60" r="1.5" fill={strokeColor} />

              <g
                style={{
                  transformOrigin: '98px 58px',
                  transform: eyeTransform,
                  transition: active ? 'transform 0.15s ease-in-out' : 'transform 0.2s ease-out',
                }}
              >
                <circle cx="98" cy="58" r="6" fill={strokeColor} />
                {active && !isBlinking ? <circle cx="96" cy="56" r="2.5" fill="#fff" /> : null}
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
