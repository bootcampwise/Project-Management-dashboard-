import React from "react";
import { X } from "lucide-react";
import type { TagProps } from "../../types";

const getTagColor = (
  tagText: string,
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
    { bg: "bg-lime-50", text: "text-lime-700", border: "border-lime-100" },
    {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-100",
    },
    {
      bg: "bg-fuchsia-50",
      text: "text-fuchsia-700",
      border: "border-fuchsia-100",
    },
    { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
    {
      bg: "bg-violet-50",
      text: "text-violet-700",
      border: "border-violet-100",
    },
  ];

  let hash = 0;
  for (let i = 0; i < tagText.length; i++) {
    hash = tagText.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
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
  backgroundColor,
  color,
}) => {
  const fallbackColors = getTagColor(text);

  let finalClassName =
    `
    inline-flex items-center gap-1.5 rounded-full font-medium border
    ${sizeClasses[size]}
    ${className}
  `
      .trim()
      .replace(/\s+/g, " ") + " ";

  let style: React.CSSProperties = {};

  const isInvalidBg = (bg: string | undefined, textCol: string | undefined) => {
    if (!bg) return true;
    const lowerBg = bg.toLowerCase().trim();
    const lowerCol = (textCol || "").toLowerCase().trim();

    const isWhiteOrTransparent = [
      "#ffffff",
      "#fff",
      "white",
      "transparent",
      "rgba(0,0,0,0)",
      "rgba(255,255,255,0)",
    ].includes(lowerBg);

    const isDefaultBlueBg = lowerBg === "bg-blue-100" || lowerBg === "blue-100";
    const isDefaultBlueCol = lowerCol === "blue" || lowerCol.includes("blue");

    if (isDefaultBlueBg && isDefaultBlueCol) return true;

    return isWhiteOrTransparent;
  };

  let normalizedBg = backgroundColor;
  if (
    normalizedBg &&
    !normalizedBg.startsWith("bg-") &&
    !normalizedBg.startsWith("#") &&
    !normalizedBg.startsWith("rgba") &&
    /^[a-z]+-\d+$/.test(normalizedBg)
  ) {
    normalizedBg = `bg-${normalizedBg}`;
  }

  const hasBgData =
    normalizedBg &&
    normalizedBg.trim() !== "" &&
    !isInvalidBg(normalizedBg, color);
  const isBgClass = hasBgData && normalizedBg!.startsWith("bg-");
  const isTextClass = color && color.startsWith("text-");

  if (hasBgData) {
    if (isBgClass) {
      finalClassName += `${normalizedBg} `;
    } else {
      style = { ...style, backgroundColor: backgroundColor };
      finalClassName += "border-transparent ";
    }

    if (color) {
      if (isTextClass) {
        finalClassName += `${color} `;
      } else {
        style = { ...style, color: color };
      }
    } else {
      finalClassName += "text-gray-800 dark:text-gray-200 ";
    }
  } else {
    finalClassName += `${fallbackColors.bg} ${fallbackColors.text} ${fallbackColors.border} `;
  }

  return (
    <span className={finalClassName} style={style}>
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
