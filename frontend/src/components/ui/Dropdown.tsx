import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  header?: boolean;
  custom?: boolean;
  preventClose?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  menuClassName?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  className = '',
  menuClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 mt-1 py-1 min-w-[160px]
            bg-white border border-gray-200 rounded-lg shadow-lg
            ${align === 'right' ? 'right-0' : 'left-0'}
            ${menuClassName}
          `.trim()}
        >
          {items.map((item) => {
            if (item.divider) {
              return <div key={item.key} className="my-1 border-t border-gray-100" />;
            }

            if (item.custom) {
              return <div key={item.key}>{item.label}</div>;
            }

            if (item.header) {
              return (
                <div key={item.key} className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.label}
                </div>
              );
            }

            return (
              <button
                key={item.key}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick?.();
                    if (!item.preventClose) {
                      setIsOpen(false);
                    }
                  }
                }}
                disabled={item.disabled}
                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm text-left
                  transition-colors
                  ${item.disabled
                    ? 'text-gray-300 cursor-not-allowed'
                    : item.danger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }
                `.trim().replace(/\s+/g, ' ')}
              >
                {item.icon && <span className="w-4 h-4 flex items-center justify-center">{item.icon}</span>}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

Dropdown.displayName = 'Dropdown';
