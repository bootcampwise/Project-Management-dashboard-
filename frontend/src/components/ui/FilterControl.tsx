import React from "react";
import { Filter, CheckCircle2 } from "lucide-react";
import { Button, Dropdown, type DropdownItem } from "../ui";
import type { FilterControlProps } from "../../types";

const FilterControl: React.FC<FilterControlProps> = ({
  value,
  onChange,
  options,
  label = "Filters",
  className = "",
  variant,
}) => {
  const buttonVariant = variant || (value ? "primary" : "secondary");

  const getLabel = () => {
    if (!value) return label;
    const selected = options.find((opt) => opt.value === value);
    if (selected) {
      return selected.label;
    }
    return label;
  };

  const dropdownItems: DropdownItem[] = options.map((option) => ({
    key: option.key,
    label: option.label,
    onClick: () => onChange(option.value),
    icon:
      value === option.value ? (
        <CheckCircle2 size={14} className="text-blue-500" />
      ) : undefined,
  }));

  return (
    <Dropdown
      trigger={
        <Button
          variant={buttonVariant}
          className={`h-9 px-3 text-sm font-medium transition-all shadow-sm ${
            buttonVariant === "secondary"
              ? "text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500"
              : ""
          } ${className}`}
          leftIcon={
            <Filter
              size={16}
              className={
                value ? "text-white" : "text-gray-500 dark:text-gray-400"
              }
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

export default FilterControl;
