import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { SidebarItemProps } from "../../types";

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon: Icon,
  isActive = false,
  hasSubmenu = false,
  isOpen = false,
  indent = 0,
  onClick,
  badge,
  to,
  disabled = false,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) return;
    if (to) {
      navigate(to);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
                flex items-center px-3 py-1.5 mb-0.5 rounded-md transition
                ${
                  disabled
                    ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600"
                    : isActive
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                }
            `}
    >
      <div className="w-4 flex items-center justify-center text-gray-400 dark:text-gray-500 flex-shrink-0">
        {hasSubmenu &&
          (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
      </div>

      <div
        className="flex items-center gap-3 flex-1"
        style={{ marginLeft: indent * 12 }}
      >
        {Icon && (
          <Icon size={18} className="text-gray-500 dark:text-gray-400" />
        )}

        {badge && <div className="flex-shrink-0">{badge}</div>}

        <span className="font-normal text-[14px] leading-[22px] font-inter">
          {label}
        </span>
      </div>
    </div>
  );
};

export default SidebarItem;
