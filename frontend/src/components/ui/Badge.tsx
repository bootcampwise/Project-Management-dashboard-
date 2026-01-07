import React from "react";
import { X } from "lucide-react";
import type { BadgeProps } from "../../types";

const variantStyles: Record<string, string> = {
  default: "bg-gray-100 text-gray-700 border-gray-200",
  primary: "bg-blue-50 text-blue-600 border-blue-100",
  success: "bg-green-50 text-green-600 border-green-100",
  warning: "bg-amber-50 text-amber-600 border-amber-100",
  danger: "bg-red-50 text-red-600 border-red-100",
  info: "bg-purple-50 text-purple-600 border-purple-100",
};

const sizeStyles: Record<string, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  removable = false,
  onRemove,
  className = "",
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1 font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {children}
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 hover:bg-black/10 rounded-full transition-colors"
          aria-label="Remove"
        >
          <X size={size === "sm" ? 10 : 12} />
        </button>
      )}
    </span>
  );
};

Badge.displayName = "Badge";
