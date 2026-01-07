import { forwardRef } from "react";
import type { SelectProps } from "../../types";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, options, placeholder, className = "", id, ...props },
    ref,
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full px-4 py-2.5 border rounded-lg text-sm
              appearance-none bg-white dark:bg-gray-800 cursor-pointer
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/50 focus:border-blue-500
              ${
                error
                  ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-50 dark:focus:ring-red-900/50"
                  : "border-gray-200 dark:border-gray-600"
              }
              ${
                props.disabled
                  ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed text-gray-500 dark:text-gray-400"
                  : "text-gray-700 dark:text-gray-200"
              }
              ${className}
            `
              .trim()
              .replace(/\s+/g, " ")}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.5 4.5L6 8L9.5 4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";
