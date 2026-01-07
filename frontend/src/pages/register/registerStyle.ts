import type { CSSProperties } from "react";

export const registerStyles = {
  pageContainer: {
    fontFamily: "Inter, sans-serif",
    width: "100%",
    maxWidth: "100%",
    minHeight: "100vh",
    padding: "32px 16px",
    margin: "0",
    boxSizing: "border-box" as const,
  } as CSSProperties,

  contentWrapper: {
    width: "100%",
    maxWidth: "400px",
    minHeight: "836px",
    boxSizing: "border-box" as const,
  } as CSSProperties,

  logoWrapper: {
    marginTop: "46px",
    marginBottom: "162px",
  } as CSSProperties,

  logoImage: {
    width: "173px",
    height: "42px",
  } as CSSProperties,

  header: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "38px",
    marginBottom: "16px",
  } as CSSProperties,

  socialButtonsWrapper: {
    gap: "16px",
    marginBottom: "16px",
  } as CSSProperties,
  dividerWrapper: {
    maxWidth: "400px",
    height: "8px",
    marginBottom: "16px",
    marginTop: "16px",
  } as CSSProperties,

  dividerLine: {} as CSSProperties,

  emailSection: {
    gap: "4px",
    marginBottom: "16px",
  } as CSSProperties,

  label: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 500,
  } as CSSProperties,

  input: {
    width: "100%",
    maxWidth: "400px",
    height: "36px",
    padding: "7px 16px",
    borderRadius: "4px",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    boxSizing: "border-box" as const,
  } as CSSProperties,

  helperText: {
    width: "100%",
    maxWidth: "400px",
    height: "18px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "18px",
    opacity: 1,
  } as CSSProperties,

  continueButton: {
    maxWidth: "400px",
    height: "36px",
    borderRadius: "4px",
    padding: "7px 16px",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "22px",
    marginTop: "25px",
    marginBottom: "16px",
  } as CSSProperties,

  footer: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    marginTop: "32px",
    paddingBottom: "32px",
  } as CSSProperties,
};

export const registerClasses = {
  pageContainer:
    "bg-white dark:bg-gray-900 flex flex-col items-center justify-start overflow-x-hidden",
  contentWrapper: "flex flex-col items-center",

  logoWrapper: "relative flex items-center justify-center",
  logoBacklight:
    "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[100px] bg-white/80 blur-[45px] rounded-full dark:block hidden pointer-events-none",
  logoImage: "object-contain relative z-10",

  header: "text-center text-gray-900 dark:text-white",

  socialButtonsWrapper: "flex flex-col items-center w-full",

  dividerWrapper: "flex items-center justify-center w-full",
  dividerLine: "w-full border-t border-gray-200 dark:border-gray-700",

  emailSection: "flex flex-col w-full",
  label: "text-gray-500 dark:text-gray-400",
  input:
    "border border-gray-200 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200",

  continueButton:
    "flex items-center justify-center w-full bg-brand-blue text-white hover:bg-blue-600",
  createAccountButton:
    "flex items-center justify-center w-full bg-brand-blue text-white hover:bg-blue-600 mt-4",

  stepWrapper: "w-full",

  emailDisplay:
    "mb-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-between",
  emailDisplayText: "text-sm text-gray-600 dark:text-gray-300",
  changeButton: "text-sm text-brand-blue hover:underline",

  inputWithMargin:
    "border border-gray-200 dark:border-gray-600 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 mb-4",

  loginLinkWrapper:
    "flex gap-2 text-md text-gray-400 dark:text-gray-500 font-sm font-inter mb-[128px]",
  loginLink: "text-blue-500 hover:text-blue-600",

  footer: "flex justify-center gap-8 w-full text-gray-500 dark:text-gray-400",
  footerItem: "whitespace-nowrap hover:text-gray-700 dark:hover:text-gray-300",
};
