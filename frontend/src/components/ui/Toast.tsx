import { toast, Toaster, type ToastOptions } from 'react-hot-toast';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'loading' | 'info';
  duration?: number;
}

const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: 500,
  },
};

const successStyle: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: '#10B981',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#10B981',
  },
};

const errorStyle: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: '#EF4444',
    color: '#fff',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#EF4444',
  },
};

const infoStyle: ToastOptions = {
  ...defaultOptions,
  style: {
    ...defaultOptions.style,
    background: '#3B82F6',
    color: '#fff',
  },
};

// Toast utility functions
export const showToast = {
  success: (message: string, options?: ToastOptions) =>
    toast.success(message, { ...successStyle, ...options }),

  error: (message: string, options?: ToastOptions) =>
    toast.error(message, { ...errorStyle, ...options }),

  loading: (message: string, options?: ToastOptions) =>
    toast.loading(message, { ...defaultOptions, ...options }),

  info: (message: string, options?: ToastOptions) =>
    toast(message, { ...infoStyle, icon: 'ℹ️', ...options }),

  dismiss: (toastId?: string) => toast.dismiss(toastId),

  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
    options?: ToastOptions
  ) => toast.promise(promise, messages, { ...defaultOptions, ...options }),
};

// Re-export Toaster component for use in App.tsx
export { Toaster };

// Default export for convenience
export default showToast;
