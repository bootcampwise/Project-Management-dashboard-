import React from 'react';
import { toast, Toaster, type ToastOptions } from 'react-hot-toast';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'loading' | 'info';
  duration?: number;
}

// ============================================
// TOAST COLORS - INTENTIONAL EXCEPTION
// ============================================
// NOTE:
// react-hot-toast requires inline style values and does not support Tailwind classes.
// This component is an intentional exception to the "no hardcoded colors" rule.
// Colors are centralized here to minimize scattered literals.

const TOAST_COLORS = {
  // Success (green)
  successStart: '#10B981',
  successEnd: '#059669',
  // Error (red)
  errorStart: '#EF4444',
  errorEnd: '#DC2626',
  // Warning (amber)
  warning: '#F59E0B',
  // Info (blue)
  info: '#3B82F6',
  // Common
  white: '#fff',
};

// ============================================
// BASE TOAST STYLES
// ============================================

const defaultOptions: ToastOptions = {
  duration: 3000,
  position: 'top-right',
  style: {
    borderRadius: '12px',
    padding: '14px 18px',
    fontSize: '14px',
    fontWeight: 500,
    maxWidth: '380px',
    wordBreak: 'break-word' as const,
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },
};

const successStyle: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: `linear-gradient(135deg, ${TOAST_COLORS.successStart} 0%, ${TOAST_COLORS.successEnd} 100%)`,
    color: TOAST_COLORS.white,
  },
  iconTheme: {
    primary: TOAST_COLORS.white,
    secondary: TOAST_COLORS.successStart,
  },
};

const errorStyle: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: `linear-gradient(135deg, ${TOAST_COLORS.errorStart} 0%, ${TOAST_COLORS.errorEnd} 100%)`,
    color: TOAST_COLORS.white,
  },
  iconTheme: {
    primary: TOAST_COLORS.white,
    secondary: TOAST_COLORS.errorStart,
  },
};

const warningStyle: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: TOAST_COLORS.warning,
    color: TOAST_COLORS.white,
  },
};

const infoStyle: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: TOAST_COLORS.info,
    color: TOAST_COLORS.white,
  },
};

// ============================================
// ERROR MESSAGE EXTRACTION HELPER
// ============================================

/**
 * Extracts a human-readable error message from various error types.
 * Handles: Error objects, strings, API responses, RTK Query errors, etc.
 * @example showToast.error(`Failed to add subtask. ${getErrorMessage(error)}`)
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;

  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;

    // RTK Query error format: { data: { message: '...' } }
    if (err.data && typeof err.data === 'object') {
      const data = err.data as Record<string, unknown>;
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
    }

    // Direct message property
    if (typeof err.message === 'string') return err.message;

    // Error property
    if (typeof err.error === 'string') return err.error;

    // Status text (for HTTP errors)
    if (typeof err.statusText === 'string') return err.statusText;
  }

  return 'Unknown error occurred';
};

// ============================================
// TOAST UTILITY FUNCTIONS
// ============================================

export const showToast = {
  /**
   * Shows a success toast
   */
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...successStyle, ...options }),

  /**
   * Shows an error toast
   * @param message - The error message to display
   * @example showToast.error(`Failed to add subtask. ${getErrorMessage(error)}`)
   */
  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...errorStyle, ...options }),

  /**
   * Shows a warning toast
   */
  warning: (message: string, options?: ToastOptions) =>
    toast(message, { ...warningStyle, icon: '⚠️', ...options }),

  /**
   * Shows an info toast
   */
  info: (message: string, options?: ToastOptions) =>
    toast(message, { ...infoStyle, icon: 'ℹ️', ...options }),

  /**
   * Shows a loading toast - returns toast ID to dismiss/update later
   */
  loading: (message: string, options?: ToastOptions) =>
    toast.loading(message, { ...defaultOptions, ...options }),

  /**
   * Dismisses a toast by ID, or all toasts if no ID provided
   */
  dismiss: (toastId?: string) => toast.dismiss(toastId),

  /**
   * Wraps a promise with loading/success/error toasts
   * @example
   * showToast.promise(saveProject(), {
   *   loading: 'Saving...',
   *   success: 'Project saved!',
   *   error: (err) => extractErrorMessage(err)
   * });
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    },
    options?: ToastOptions
  ) => {
    // If error is a string, use it; otherwise extract the actual error message
    const errorHandler = typeof messages.error === 'function'
      ? messages.error
      : (err: unknown) => {
        const extracted = getErrorMessage(err);
        return extracted !== 'Unknown error occurred' ? extracted : messages.error as string;
      };

    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: errorHandler,
      },
      { ...defaultOptions, ...options }
    );
  },

  /**
   * Shows a custom toast with custom JSX renderer
   */
  custom: (
    renderer: (t: import('react-hot-toast').Toast) => React.JSX.Element,
    options?: ToastOptions
  ) => toast.custom(renderer, options),

  /**
   * Shows a confirmation toast with Confirm and Cancel buttons
   * @param config - Configuration for the confirmation toast
   * @example
   * showToast.confirm({
   *   title: 'Delete Task?',
   *   message: 'Are you sure? This cannot be undone.',
   *   onConfirm: async () => { await deleteTask(); },
   *   confirmText: 'Delete',
   *   cancelText: 'Cancel',
   *   variant: 'danger'
   * });
   */
  confirm: (config: {
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'primary';
  }) => {
    const {
      title,
      message,
      onConfirm,
      onCancel,
      confirmText = 'Confirm',
      cancelText = 'Cancel',
      variant = 'danger'
    } = config;

    const variantStyles = {
      danger: {
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        buttonBg: 'bg-red-600 hover:bg-red-700',
      },
      warning: {
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600',
        buttonBg: 'bg-amber-600 hover:bg-amber-700',
      },
      primary: {
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        buttonBg: 'bg-blue-600 hover:bg-blue-700',
      },
    };

    const styles = variantStyles[variant];

    return toast.custom(
      (t) => (
        <div
          className={`bg-white rounded-xl shadow-lg border border-gray-200 p-4 max-w-sm ${t.visible ? 'animate-enter' : 'animate-leave'
            }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center flex-shrink-0`}>
              {variant === 'danger' ? (
                <svg className={`w-5 h-5 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ) : variant === 'warning' ? (
                <svg className={`w-5 h-5 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className={`w-5 h-5 ${styles.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
              <p className="text-xs text-gray-500 mb-3">{message}</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    toast.dismiss(t.id);
                    try {
                      await onConfirm();
                    } catch (error) {
                      // Ensure any uncaught errors are displayed
                      const message = getErrorMessage(error);
                      toast.error(`Operation failed. ${message}`, errorStyle);
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium text-white ${styles.buttonBg} rounded-lg transition-colors`}
                >
                  {confirmText}
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    onCancel?.();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      { duration: 5000, position: 'top-center' }
    );
  },
};



// Re-export Toaster component for use in App.tsx
export { Toaster };

// Default export for convenience
export default showToast;
