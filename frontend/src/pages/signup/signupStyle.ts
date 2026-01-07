import type { CSSProperties } from "react";

export const signupStyles = {
  pageContainer: {
    width: "100%",
    minWidth: "320px",
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif",
    position: "relative" as const,
    padding: "20px",
  } as CSSProperties,

  logoContainer: {
    top: "98px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "173px",
    height: "42px",
  } as CSSProperties,

  logoImage: {
    width: "173px",
    height: "42px",
    position: "relative",
    zIndex: 10,
  } as CSSProperties,

  loginContainer: {
    width: "100%",
    maxWidth: "952px",
    height: "auto",
    minHeight: "593px",
    marginTop: "20px",
    borderRadius: "8px",
  } as CSSProperties,

  leftPanel: {
    padding: "48px 36px 36px 36px",
    position: "relative" as const,
  } as CSSProperties,

  newBadge: {
    padding: "4px 10px",
    fontSize: "11px",
    fontWeight: 700,
  } as CSSProperties,

  badgeIcon: {
    width: "10px",
    height: "10px",
  } as CSSProperties,

  featureTitle: {
    fontFamily: "Inter, sans-serif",
    fontSize: "18px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  } as CSSProperties,

  featureDescription: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: "14.9px",
    lineHeight: "21px",
    letterSpacing: "0%",
    marginBottom: "0",
    maxWidth: "380px",
  } as CSSProperties,

  learnMoreLink: {
    textDecoration: "none",
    fontWeight: 600,
  } as CSSProperties,

  badgeWrapperStyle: {
    marginBottom: "16px",
  } as CSSProperties,

  bottomBoxContainer: {
    width: "100%",
    maxWidth: "340px",
    position: "absolute" as const,
    top: "220px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  } as CSSProperties,

  bottomBoxOuter: {
    width: "100%",
    height: "180px",
    borderRadius: "8px",
    position: "relative" as const,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: "0",
  } as CSSProperties,

  bottomBoxInner: {
    width: "180px",
    height: "36px",
    borderRadius: "2px",
    position: "absolute" as const,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1,
  } as CSSProperties,

  rightPanel: {
    minHeight: "593px",
  } as CSSProperties,

  formWrapper: {
    maxWidth: "400px",
  } as CSSProperties,

  formTitle: {
    fontSize: "24px",
    lineHeight: "35px",
  } as CSSProperties,

  inputLabel: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "13.2px",
    lineHeight: "22.5px",
    letterSpacing: "0%",
  } as CSSProperties,

  passwordLabel: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "13.2px",
    lineHeight: "22.5px",
    letterSpacing: "0%",
  } as CSSProperties,
};

export const signupClasses = {
  pageWrapper:
    "bg-gray-50 dark:bg-gray-900 flex justify-center items-start overflow-x-hidden",
  logoWrapper: "absolute hidden md:block",
  mainContainer:
    "bg-white dark:bg-gray-800 flex flex-col md:flex-row rounded-lg shadow-md dark:shadow-gray-900 overflow-hidden border border-gray-200 dark:border-gray-700 login-container",
  leftPanel: "hidden md:flex flex-col md:w-1/2 bg-off-white dark:bg-gray-700",
  badgeWrapper: "flex items-center gap-2",
  badge:
    "inline-flex items-center gap-1 rounded-full text-xs font-bold text-white bg-brand-orange",
  featureTitle: "text-gray-900 dark:text-white",
  featureDescription: "text-gray-900 dark:text-gray-300",
  learnMoreLink: "text-brand-orange",
  bottomBoxOuter: "bg-off-white dark:bg-gray-600 shadow-lg",
  bottomBoxInner: "bg-white dark:bg-gray-800 shadow-glow",
  rightPanel:
    "w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center bg-white dark:bg-gray-800",
  formWrapper: "w-full",
  formTitle:
    "text-3xl font-semibold text-gray-900 dark:text-white mb-12 text-center",
  form: "space-y-12",
  labelWrapper: "block mb-2 text-gray-900 dark:text-gray-200",
  input:
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-400 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700",
  passwordHeader: "flex justify-between items-center mb-2",
  error: "text-red-600 dark:text-red-400 text-sm text-center",
  submitButton:
    "w-full py-3 rounded-md text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50 bg-brand-blue hover:bg-blue-700",
};

export const signupMediaQuery = `
  @media (min-width: 768px) {
    .login-container {
      margin-top: 209px !important;
    }
  }
`;
