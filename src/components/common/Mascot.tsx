import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

/**
 * Iguana Mascot System
 * --------------------
 * This component handles the rendering and subtle motion of the Iguana mascot.
 * It is designed around semantic variants (e.g. 'sleeping' for empty states, 
 * 'protective' for privacy) rather than direct file paths to ensure the UI
 * is driven by emotional intent and can be easily updated or expanded.
 * 
 * Assets: Currently relies on assets in /public/assets/mascot/.
 * Note on Backgrounds: Utilizes \`mix-blend-multiply\` to softly drop the raw orange/white
 * backgrounds of the draft assets directly into the app's cream background context.
 */

// Mascot variants mapped to semantic intent
export type MascotVariant = 
  | 'core'       // 01_iguana_core_calm_main
  | 'front'      // 02_iguana_front_facing
  | 'sleeping'   // 03_iguana_sleeping
  | 'moving'     // 04_iguana_in_motion
  | 'learning'   // 05_iguana_learning
  | 'social'     // 06_iguana_social
  | 'protective' // 07_iguana_protective
  | 'awake_provisional'; // 08_iguana_awake

// Type-safe asset map
const MASCOT_ASSETS: Record<MascotVariant, string> = {
  core: '/assets/mascot/01_iguana_core_calm_main.png',
  front: '/assets/mascot/02_iguana_front_facing.png',
  sleeping: '/assets/mascot/03_iguana_sleeping.png',
  moving: '/assets/mascot/04_iguana_in_motion.png',
  learning: '/assets/mascot/05_iguana_learning.png',
  social: '/assets/mascot/06_iguana_social.png',
  protective: '/assets/mascot/07_iguana_protective.png',
  awake_provisional: '/assets/mascot/08_iguana_awake.png',
};

type AnimationMode = 'breathe' | 'float' | 'fade-rise' | 'none';

interface MascotProps extends HTMLMotionProps<"div"> {
  variant: MascotVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animationMode?: AnimationMode;
  className?: string;
  imgClassName?: string;
}

const SIZE_MAP = {
  sm: 'w-24 h-24',
  md: 'w-40 h-40',
  lg: 'w-56 h-56',
  xl: 'w-72 h-72',
};

const ANIMATION_VARIANTS: Record<AnimationMode, any> = {
  breathe: {
    animate: { scale: [1, 1.02, 1] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  },
  float: {
    animate: { y: [0, -8, 0] },
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  },
  'fade-rise': {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  },
  none: {}
};

export function Mascot({ 
  variant, 
  size = 'md', 
  animationMode = 'breathe', 
  className = '', 
  imgClassName = '',
  ...props 
}: MascotProps) {
  const assetPath = MASCOT_ASSETS[variant];
  const sizeClass = SIZE_MAP[size];
  const animationProps = ANIMATION_VARIANTS[animationMode];

  return (
    <motion.div
      className={`relative flex items-center justify-center ${sizeClass} ${className}`}
      {...(animationMode === 'fade-rise' ? { initial: animationProps.initial } : {})}
      animate={animationProps.animate}
      transition={animationProps.transition}
      {...props}
    >
      <img
        src={assetPath}
        alt={`Iguana Mascot - ${variant}`}
        className={`object-contain w-full h-full mix-blend-multiply ${imgClassName}`}
        loading="lazy"
        width={300}
        height={300}
      />
    </motion.div>
  );
}
