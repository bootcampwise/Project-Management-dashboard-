import React from "react";
import type { IconButtonProps } from "../../types";

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}) => {
  const variantStyles = {
    outline:
      "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700",
    filled:
      "bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
  };

  const sizeStyles = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
  };

  const iconSizeStyles = {
    sm: "[&>svg]:w-4 [&>svg]:h-4",
    md: "[&>svg]:w-5 [&>svg]:h-5",
    lg: "[&>svg]:w-6 [&>svg]:h-6",
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2
        rounded-md transition-colors text-gray-600 dark:text-gray-400
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${iconSizeStyles[size]}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      {...props}
    >
      {icon}
      {text && <span className="text-sm font-medium">{text}</span>}
    </button>
  );
};

IconButton.displayName = "IconButton";
