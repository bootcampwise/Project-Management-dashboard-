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
    to
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
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
                flex items-center px-3 py-1.5 mb-0.5 cursor-pointer rounded-md transition
                ${isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }
            `}
        >
            {/* Chevron column / spacer */}
            <div className="w-4 flex items-center justify-center text-gray-400 flex-shrink-0">
                {hasSubmenu &&
                    (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
            </div>

            {/* Indented content */}
            <div
                className="flex items-center gap-3 flex-1"
                style={{ marginLeft: indent * 12 }}
            >
                {/* Icon */}
                {Icon && <Icon size={18} className="text-gray-500" />}

                {/* Badge (project icon) */}
                {badge && <div className="flex-shrink-0">{badge}</div>}

                {/* Text — matches Figma */}
                <span className="font-normal text-[14px] leading-[22px] font-inter">
                    {label}
                </span>
            </div>
        </div>
    );
};

export default SidebarItem;
