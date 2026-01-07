import React from "react";
import type { StatusDotProps } from "../../types";

const sizeClasses = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
};

const colorClasses = {
  green: "bg-green-500",
  red: "bg-red-500",
  blue: "bg-blue-500",
  gray: "bg-gray-400",
  yellow: "bg-yellow-500",
  orange: "bg-orange-500",
  purple: "bg-purple-500",
};

export const StatusDot: React.FC<StatusDotProps> = ({
  color = "gray",
  size = "sm",
  className = "",
}) => {
  return (
    <div
      className={`
        rounded-full flex-shrink-0
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    />
  );
};

StatusDot.displayName = "StatusDot";
