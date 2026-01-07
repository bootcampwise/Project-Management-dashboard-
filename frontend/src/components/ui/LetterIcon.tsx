import React from "react";
import type { LetterIconProps } from "../../types";

const sizeStyles: Record<string, string> = {
  sm: "w-4 h-4 text-[8px]",
  md: "w-5 h-5 text-[10px]",
  lg: "w-6 h-6 text-xs",
};

const colorStyles: Record<string, string> = {
  gray: "bg-white border-gray-200 text-gray-600",
  blue: "bg-blue-50 border-blue-200 text-blue-600",
  green: "bg-green-50 border-green-200 text-green-600",
  red: "bg-red-50 border-red-200 text-red-600",
  purple: "bg-purple-50 border-purple-200 text-purple-600",
};

export const LetterIcon: React.FC<LetterIconProps> = ({
  letter,
  size = "md",
  color = "gray",
  className = "",
}) => {
  return (
    <div
      className={`
        ${sizeStyles[size]}
        ${colorStyles[color]}
        border rounded font-bold flex items-center justify-center shadow-sm
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {letter.charAt(0).toUpperCase()}
    </div>
  );
};

LetterIcon.displayName = "LetterIcon";
