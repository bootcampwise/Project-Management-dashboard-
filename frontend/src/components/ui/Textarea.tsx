import React, { forwardRef } from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, rows = 4, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-gray-700 mb-1.5"
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
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-50 focus:border-blue-500
            ${error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-50'
              : 'border-gray-200'
            }
            ${props.disabled ? 'bg-gray-50 cursor-not-allowed text-gray-500' : 'bg-white text-gray-900'}
            ${className}
          `.trim().replace(/\s+/g, ' ')}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
