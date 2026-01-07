import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cardVariants } from "../../utils/motion";
import { useMagnetic } from "../../hooks/useMagnetic";
import type { StatCardProps } from "../../types";

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendText,
  className = "",
}) => {
  const isPositive = trend === "positive";
  const isNegative = trend === "negative";

  const {
    style: magneticStyle,
    onMouseMove,
    onMouseLeave,
  } = useMagnetic({
    limit: 5,
    strength: 0.15,
  });

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      whileTap="tap"
      className={`
        rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 
        flex items-center justify-between p-5 w-full
        bg-white dark:bg-gray-800
        ${className}
      `
        .trim()
        .replace(/\s+/g, " ")}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ ...magneticStyle, height: "100px" }}
    >
      <div className="flex flex-col justify-center gap-2">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-semibold">
          {title}
        </h3>

        {trendText && (
          <div
            className={`
               mt-5 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium w-fit 
              ${
                isPositive
                  ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                  : ""
              }
              ${
                isNegative
                  ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                  : ""
              }
              ${
                !isPositive && !isNegative
                  ? "bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  : ""
              }
            `.trim()}
          >
            {isPositive && <ArrowUpRight size={12} strokeWidth={2.5} />}
            {isNegative && <ArrowDownRight size={12} strokeWidth={2.5} />}
            <span>{trendText}</span>
          </div>
        )}
      </div>

      <span className="text-3xl font-semibold text-gray-800 dark:text-white">
        {value}
      </span>
    </motion.div>
  );
};

StatCard.displayName = "StatCard";
