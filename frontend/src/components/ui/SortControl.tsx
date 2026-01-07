import React from "react";
import { ArrowUpDown } from "lucide-react";
import { Button, Dropdown, type DropdownItem } from ".";
import type { SortControlProps } from "../../types";

const SortControl: React.FC<SortControlProps> = ({
  value,
  onChange,
  options,
  className = "",
}) => {
  const getLabel = () => {
    const selected = options.find((opt) => opt.key === value);
    return selected ? selected.label : "Sort";
  };

  const dropdownItems: DropdownItem[] = options.map((option) => ({
    key: option.key,
    label: option.label,
    onClick: () => onChange(option.key),
  }));

  return (
    <Dropdown
      trigger={
        <Button
          variant="secondary"
          className={`h-9 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all shadow-sm ${className}`}
          leftIcon={
            <ArrowUpDown
              size={16}
              className="text-gray-500 dark:text-gray-400"
            />
          }
        >
          {getLabel()}
        </Button>
      }
      items={dropdownItems}
    />
  );
};

export default SortControl;
