import type { Variants, Transition } from "framer-motion";

export const easings = {
  smooth: [0.22, 1, 0.36, 1] as const,
  snappy: [0.16, 1, 0.3, 1] as const, // Stage Reveal easing
  bouncy: [0.34, 1.56, 0.64, 1] as const,
  elastic: [0.68, -0.55, 0.265, 1.55] as const,
};

export const springs = {
  magnetic: { type: "spring" as const, stiffness: 80, damping: 20, mass: 1.2 },
  snappy: { type: "spring" as const, stiffness: 350, damping: 25 },
  bouncy: { type: "spring" as const, stiffness: 400, damping: 15 },
  stiff: { type: "spring" as const, stiffness: 500, damping: 30 },
  gentle: { type: "spring" as const, stiffness: 120, damping: 14 },
};

export const instantTransition = {
  type: "tween",
  duration: 0,
};

export const pageVariants: Variants = {
  initial: {
    y: 24,
    scale: 0.94,
    opacity: 0,
  },
  animate: {
    y: 0,
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.22,
      ease: easings.snappy,
      staggerChildren: 0.08,
    } as Transition,
  },
  exit: {
    y: -8,
    scale: 0.98,
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: easings.snappy,
    } as Transition,
  },
};

export const reducedPageVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    } as Transition,
  },
};

export const itemVariants: Variants = {
  hidden: {
    y: 30,
    opacity: 0,
    scale: 0.95,
  },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export const cardVariants: Variants = {
  initial: {
    y: 15,
    opacity: 0,
    scale: 0.98,
  },
  animate: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: springs.snappy,
  },
  hover: {
    y: -4,
    scale: 1.01,
    transition: springs.magnetic,
    zIndex: 10,
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.05, ease: "easeOut" },
  },
};

export const statCardVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
    },
  },
  hover: {
    y: -5,
    scale: 1.02,
    transition: springs.magnetic,
  },
};

export const panelVariants: Variants = {
  hidden: {
    y: 50,
    opacity: 0,
    scale: 0.92,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 80,
      damping: 12,
      delay: 0.2,
    },
  },
  hover: {
    y: -4,
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)",
    transition: springs.gentle,
  },
};

export const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    } as Transition,
  },
};

export const listItemVariants: Variants = {
  hidden: {
    x: -30,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: springs.gentle,
  },
  hover: {
    x: 5,
    backgroundColor: "rgba(59, 130, 246, 0.05)",
    transition: { duration: 0.2 },
  },
};

export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalVariants: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0,
    y: 50,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    y: 20,
    transition: { duration: 0.15 },
  },
};

export const buttonVariants: Variants = {
  idle: { scale: 1, x: 0, y: 0 },
  hover: {
    scale: 1.03,
    transition: springs.magnetic,
  },
  tap: {
    scale: 0.94,
    transition: { duration: 0.08, ease: "easeOut" },
  },
};

export const fadeInUp: Variants = {
  hidden: {
    y: 30,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    } as Transition,
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    x: -40,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    } as Transition,
  },
};

export const fadeInRight: Variants = {
  hidden: {
    x: 40,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: easings.smooth,
    } as Transition,
  },
};

export const popVariants: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 500,
      damping: 15,
    },
  },
};
