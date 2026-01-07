import React from "react";
import { X } from "lucide-react";
import { IconButton } from "./IconButton";
import type { ModalProps } from "../../types";

const sizeStyles: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-[90vw]",
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full mx-4 flex flex-col max-h-[90vh]
          ${sizeStyles[size]}
        `.trim()}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            {title && (
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <IconButton
                icon={<X size={20} />}
                onClick={onClose}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 ml-auto"
                aria-label="Close modal"
              />
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {footer && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 rounded-b-xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.displayName = "Modal";
