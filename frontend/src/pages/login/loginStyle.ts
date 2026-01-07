import type { CSSProperties } from "react";

export const loginStyles = {
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

  ssoButton: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "100%",
    letterSpacing: "0%",
    textAlign: "center" as const,
  } as CSSProperties,

  dividerText: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    fontSize: "11px",
    lineHeight: "16.5px",
    letterSpacing: "0%",
    textAlign: "center" as const,
  } as CSSProperties,

  signUpText: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: "15px",
    lineHeight: "22.5px",
    letterSpacing: "0%",
    textAlign: "center" as const,
  } as CSSProperties,
};

export const loginClasses = {
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
    "w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center mt-0 bg-white dark:bg-gray-800",
  formTitle:
    "text-3xl font-semibold text-gray-900 dark:text-white mb-4 text-center",
  form: "space-y-4",
  labelWrapper: "block mb-2 text-gray-900 dark:text-gray-200",
  input:
    "w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 focus:border-blue-400 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700",
  passwordHeader: "flex justify-between items-center mb-2",
  forgotPassword: "text-sm text-blue-500 hover:text-blue-600 font-medium",
  error: "text-red-600 dark:text-red-400 text-sm text-center",
  submitButton:
    "w-full py-3 rounded-md text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50 bg-brand-blue hover:bg-blue-700",
  socialWrapper: "flex items-center justify-center gap-8 py-2",
  socialButton: "flex items-center gap-2 text-sm font-medium",
  socialDivider: "h-5 w-px bg-gray-300 dark:bg-gray-600",
  ssoButton:
    "w-full py-3 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800",
  dividerWrapper: "relative flex py-2 items-center",
  dividerLine: "flex-grow border-t border-gray-200 dark:border-gray-600",
  dividerText: "flex-shrink-0 mx-4 uppercase text-gray-900 dark:text-gray-300",
  signUpWrapper: "text-center space-y-2",
  signUpText: "text-brand-orange",
  signUpButton:
    "w-auto px-8 py-3 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-sm transition-colors text-brand-orange bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
};

export const loginMediaQuery = `
  @media (min-width: 768px) {
    .login-container {
      margin-top: 209px !important;
    }
  }
`;
