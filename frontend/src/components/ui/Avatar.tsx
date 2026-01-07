import React from "react";
import type { AvatarProps } from "../../types";

const sizeStyles: Record<string, { container: string; text: string }> = {
  xs: { container: "w-5 h-5", text: "text-[8px]" },
  sm: { container: "w-6 h-6", text: "text-[9px]" },
  md: { container: "w-8 h-8", text: "text-xs" },
  lg: { container: "w-10 h-10", text: "text-sm" },
  xl: { container: "w-16 h-16", text: "text-xl" },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "",
  size = "md",
  className = "",
}) => {
  const initials = name ? name.charAt(0).toUpperCase() : "U";

  const styles = sizeStyles[size];

  const getBackgroundColor = (str: string) => {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-500",
      "bg-lime-500",
      "bg-green-500",
      "bg-emerald-500",
      "bg-teal-500",
      "bg-cyan-500",
      "bg-sky-500",
      "bg-blue-500",
      "bg-indigo-500",
      "bg-violet-500",
      "bg-purple-500",
      "bg-fuchsia-500",
      "bg-pink-500",
      "bg-rose-500",
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const bgColor = getBackgroundColor(name || "User");

  return (
    <div
      className={`
        ${styles.container}
        rounded-full overflow-hidden flex items-center justify-center
        ${bgColor} text-white font-bold border-2 border-white
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      title={name}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span className={styles.text}>{initials}</span>
      )}
    </div>
  );
};

Avatar.displayName = "Avatar";
