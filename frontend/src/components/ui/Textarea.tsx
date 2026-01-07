import { forwardRef } from "react";
import type { TextareaProps } from "../../types";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helperText, className = "", id, rows = 4, ...props },
    ref,
  ) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={`
            w-full px-4 py-2.5 border rounded-lg text-sm
            transition-all duration-200 resize-none
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-blue-50 dark:focus:ring-blue-900/50 focus:border-blue-500
            ${
              error
                ? "border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-50 dark:focus:ring-red-900/50"
                : "border-gray-200 dark:border-gray-600"
            }
            ${
              props.disabled
                ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-400"
                : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            }
            ${className}
          `
            .trim()
            .replace(/\s+/g, " ")}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
