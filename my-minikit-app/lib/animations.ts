"use client"

// Reusable Framer Motion animation presets for SpinMint

import type { Variants, Transition } from "framer-motion"

// Spring configurations
export const springConfig: Transition = {
  type: "spring",
  damping: 18,
  stiffness: 220,
}

export const softSpring: Transition = {
  type: "spring",
  damping: 25,
  stiffness: 180,
}

export const bounceSpring: Transition = {
  type: "spring",
  damping: 12,
  stiffness: 300,
}

// Button animations
export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    boxShadow: "0 4px 12px rgba(139, 92, 246, 0.2)",
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 8px 25px rgba(139, 92, 246, 0.4)",
    transition: springConfig,
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
}

// Card animations
export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      ...springConfig,
      delay: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
}

// Modal animations
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springConfig,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: { duration: 0.2 },
  },
}

// Backdrop animations
export const backdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

// Vinyl record animations
export const vinylVariants: Variants = {
  idle: {
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  hover: {
    scale: 1.05,
    rotateX: 5,
    rotateY: 5,
    boxShadow: "0 12px 48px rgba(139, 92, 246, 0.3)",
    transition: springConfig,
  },
  tap: {
    scale: 0.98,
    rotateX: 2,
    rotateY: 2,
    transition: { duration: 0.1 },
  },
  spinning: {
    rotate: 360,
    transition: {
      duration: 22,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
}

// Text animations
export const textVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...springConfig,
      delay: 0.2,
    },
  },
}

// Stagger children animation
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

// Progress ring animation
export const progressRingVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 2, ease: "easeInOut" },
      opacity: { duration: 0.3 },
    },
  },
}

// Success celebration animations
export const celebrationVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.6,
      times: [0, 0.6, 1],
      ease: "easeOut",
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: { duration: 0.3 },
  },
}

// Floating animation for decorative elements
export const floatVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
}

// Ripple effect animation
export const rippleVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0.8,
  },
  visible: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

// Page transition animations
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  in: {
    opacity: 1,
    x: 0,
    transition: springConfig,
  },
  out: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 },
  },
}

// Loading spinner variants
export const spinnerVariants: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Number.POSITIVE_INFINITY,
    },
  },
}

// Utility function to create custom spring transition
export function createSpringTransition(damping = 18, stiffness = 220, mass = 1): Transition {
  return {
    type: "spring",
    damping,
    stiffness,
    mass,
  }
}

// Utility function to create stagger animation
export function createStaggerTransition(staggerChildren = 0.1, delayChildren = 0): Transition {
  return {
    staggerChildren,
    delayChildren,
  }
}
