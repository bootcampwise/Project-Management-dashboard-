import { forwardRef } from "react";
import { motion } from "framer-motion";
import { buttonVariants } from "../../utils/motion";
import { useMagnetic } from "../../hooks/useMagnetic";
import type { ButtonProps } from "../../types";

const variantStyles: Record<string, string> = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md",
  secondary:
    "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm",
  ghost:
    "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800",
  danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-2.5 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      className = "",
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;
    const isPrimary = variant === "primary";

    const {
      style: magneticStyle,
      onMouseMove,
      onMouseLeave,
    } = useMagnetic({
      disabled: !isPrimary || isDisabled,
      limit: 6,
      strength: 0.2,
    });

    const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...rest } = props;

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        variants={isPrimary ? buttonVariants : undefined}
        initial="idle"
        whileHover={!isDisabled ? "hover" : undefined}
        whileTap={!isDisabled ? "tap" : undefined}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={magneticStyle}
        className={`
          inline-flex items-center justify-center gap-2 font-medium rounded-lg
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `
          .trim()
          .replace(/\s+/g, " ")}
        {...rest}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </motion.button>
    );
  },
);

Button.displayName = "Button";
