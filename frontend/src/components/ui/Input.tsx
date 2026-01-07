import { forwardRef, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import type { InputProps } from "../../types";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, type, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordType = type === "password";
    const inputType = isPasswordType && showPassword ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            className={`
              w-full px-4 py-2.5 border rounded-lg text-sm
              transition-all duration-200
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-4 focus:ring-opacity-20
              ${
                error
                  ? "border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20 text-red-900 dark:text-red-100 placeholder-red-300"
                  : "border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500/20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              }
              ${
                props.disabled
                  ? "bg-gray-50 dark:bg-gray-800 cursor-not-allowed text-gray-500 dark:text-gray-400"
                  : ""
              }
              ${isPasswordType || error ? "pr-10" : ""}
              ${className}
            `
              .trim()
              .replace(/\s+/g, " ")}
            {...props}
          />

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${
                error
                  ? "text-red-400 hover:text-red-600"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}

          {error && !isPasswordType && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 pointer-events-none">
              <AlertCircle size={18} />
            </div>
          )}
        </div>

        {error && (
          <div className="mt-1.5 flex items-center gap-1.5 text-red-500 dark:text-red-400 animate-in slide-in-from-top-1 fade-in duration-200">
            <AlertCircle size={13} strokeWidth={2.5} />
            <p className="text-xs font-medium">{error}</p>
          </div>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
