import type { CSSProperties } from "react";

export const forgotPasswordStyles = {
  container: {
    width: "100%",
  } as CSSProperties,

  title: {
    fontSize: "24px",
    lineHeight: "35px",
    marginBottom: "8px",
  } as CSSProperties,

  subtitle: {
    marginBottom: "32px",
    textAlign: "center" as const,
  } as CSSProperties,

  emailDisplay: {
    fontWeight: 600,
    display: "block",
    marginTop: "4px",
  } as CSSProperties,

  otpContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "24px",
  } as CSSProperties,

  otpInput: {
    width: "48px",
    height: "48px",
    textAlign: "center" as const,
    fontSize: "20px",
    fontWeight: 700,
  } as CSSProperties,

  countdownText: {
    fontSize: "14px",
    marginTop: "16px",
    textAlign: "center" as const,
  } as CSSProperties,

  resendButton: {
    fontSize: "14px",
    fontWeight: 600,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  } as CSSProperties,

  backButton: {
    marginTop: "24px",
    textAlign: "center" as const,
  } as CSSProperties,

  passwordForm: {
    marginBottom: "24px",
  } as CSSProperties,
};

export const forgotPasswordClasses = {
  container: "w-full",
  title: "text-3xl font-semibold text-gray-900 dark:text-white text-center",
  subtitle: "text-gray-500 dark:text-gray-400 text-center",
  emailHighlight: "text-brand-orange",

  otpContainer: "flex justify-center gap-2 mb-6",
  otpInput:
    "w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all",
  otpInputFilled: "border-brand-blue dark:border-brand-blue",

  countdownWrapper: "text-center mt-4",
  countdownText: "text-sm text-gray-500 dark:text-gray-400",
  resendButton:
    "text-brand-blue hover:text-blue-700 dark:hover:text-blue-400 font-semibold transition-colors",
  resendButtonDisabled: "text-gray-400 dark:text-gray-600 cursor-not-allowed",

  backWrapper: "mt-6 text-center",
  backButton:
    "text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 font-medium transition-colors",
  passwordForm: "space-y-4 mb-6",

  submitButton:
    "w-full py-3 rounded-md text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50 bg-brand-blue hover:bg-blue-700",

  input:
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-400 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700",
};
