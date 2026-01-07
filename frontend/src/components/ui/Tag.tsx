import React from "react";
import { X } from "lucide-react";
import type { TagProps } from "../../types";

const getTagColor = (
  tagText: string
): { bg: string; text: string; border: string } => {
  const colors = [
    { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
    { bg: "bg-green-50", text: "text-green-700", border: "border-green-100" },
    {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-100",
    },
    {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-100",
    },
    { bg: "bg-red-50", text: "text-red-700", border: "border-red-100" },
    { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-100" },
    {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-100",
    },
    { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-100" },
    {
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-100",
    },
    { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-100" },
  ];
  const hash = tagText
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px]",
  md: "px-2.5 py-1 text-xs",
};

export const Tag: React.FC<TagProps> = ({
  text,
  onRemove,
  size = "md",
  className = "",
}) => {
  const colors = getTagColor(text);

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium border
        ${sizeClasses[size]}
        ${colors.bg} ${colors.text} ${colors.border}
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
    >
      {text}
      {onRemove && (
        <button
          onClick={onRemove}
          className="p-0.5 hover:bg-black/5 rounded-full transition-colors"
          type="button"
        >
          <X size={size === "sm" ? 10 : 12} />
        </button>
      )}
    </span>
  );
};

Tag.displayName = "Tag";

export { getTagColor };
