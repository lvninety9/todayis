// Animation utilities using Motion library
import { motion, AnimatePresence, type Variants } from 'motion/react';

// Basic animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
};

export const fadeOut: Variants = {
  visible: { opacity: 1, transition: { duration: 0.3 } },
  hidden: { opacity: 0, transition: { duration: 0.3 } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const slideDown: Variants = {
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  hidden: { opacity: 0, y: -20 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

// Hover animations for cards
export const cardHover: Variants = {
  rest: { scale: 1, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
  hover: { scale: 1.02, boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
};

// Button press animation
export const buttonPress: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  press: { scale: 0.95 },
};

// Pulse animation for create buttons
export const pulse: Variants = {
  rest: { scale: 1 },
  pulse: {
    scale: 1.05,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

// Page entrance variants
export const pageEntrance: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
};

// Glass effect animations
export const glassFadeIn: Variants = {
  hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
  visible: { opacity: 1, backdropFilter: 'blur(10px)', transition: { duration: 0.5 } },
};

// Re-export Motion components
export { motion, AnimatePresence };
export type { Variants };

// Motion config for lazy loading
export const motionConfig = {
  animate: true,
  strict: true,
};