import { useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import type { MouseEvent } from "react";

interface UseMagneticConfig {
  strength?: number;
  limit?: number;
  disabled?: boolean;
}

export const useMagnetic = ({
  strength = 0.2,
  limit = 6,
  disabled = false,
}: UseMagneticConfig = {}) => {
  const shouldReduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const isActive = !disabled && !shouldReduceMotion;

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!isActive) return;

    if (
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    ) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const limitedX = Math.max(-limit, Math.min(limit, dx * strength));
    const limitedY = Math.max(-limit, Math.min(limit, dy * strength));

    x.set(limitedX);
    y.set(limitedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return {
    x: xSpring,
    y: ySpring,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    style: isActive ? { x: xSpring, y: ySpring } : undefined,
  };
};
