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
  } as CSSProperties,

  loginContainer: {
    width: "100%",
    maxWidth: "952px",
    height: "auto",
    minHeight: "593px",
    marginTop: "20px",
    borderRadius: "8px",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "var(--color-gray-border)",
  } as CSSProperties,

  leftPanel: {
    backgroundColor: "var(--color-bg-off-white)",
    padding: "48px 36px 36px 36px",
    position: "relative" as const,
  } as CSSProperties,

  newBadge: {
    backgroundColor: "var(--color-brand-orange)",
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
    color: "var(--color-gray-900)",
    letterSpacing: "-0.01em",
  } as CSSProperties,

  featureDescription: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 400,
    fontSize: "14.9px",
    lineHeight: "21px",
    letterSpacing: "0%",
    color: "var(--color-gray-900)",
    marginBottom: "0",
    maxWidth: "380px",
  } as CSSProperties,

  learnMoreLink: {
    color: "var(--color-brand-orange)",
    textDecoration: "none",
    fontWeight: 600,
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
    backgroundColor: "var(--color-bg-off-white)",
    position: "relative" as const,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: "0",
    boxShadow: `0 2px 8px var(--shadow-light), 0 1px 3px var(--shadow-dark)`,
  } as CSSProperties,

  bottomBoxInner: {
    width: "180px",
    height: "36px",
    backgroundColor: "var(--color-bg-white-glow)",
    borderRadius: "2px",
    boxShadow:
      "0 10px 40px 20px rgba(241, 241, 241, 1), 0 6px 25px 12px rgba(209, 213, 219, 0.5), 0 2px 10px 5px rgba(0, 0, 0, 0.05)",
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
    color: "var(--color-gray-900)",
  } as CSSProperties,

  passwordLabel: {
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "13.2px",
    lineHeight: "22.5px",
    letterSpacing: "0%",
    color: "#000000",
  } as CSSProperties,

  submitButton: (isHovered: boolean): CSSProperties => ({
    backgroundColor: isHovered
      ? "var(--color-blue-700)"
      : "var(--color-brand-blue-light)",
  }),
};

export const signupClasses = {
  pageWrapper: "bg-gray-50 flex justify-center items-start overflow-x-hidden",
  logoWrapper: "absolute hidden md:block",
  mainContainer:
    "bg-white flex flex-col md:flex-row rounded-lg shadow-md overflow-hidden login-container",
  leftPanel: "hidden md:flex flex-col md:w-1/2",
  badgeWrapper: "flex items-center gap-2",
  badge:
    "inline-flex items-center gap-1 rounded-full text-xs font-bold text-white",
  rightPanel:
    "w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center",
  formWrapper: "w-full",
  formTitle: "text-3xl font-semibold text-gray-900 mb-12 text-center",
  form: "space-y-12",
  labelWrapper: "block mb-2",
  input:
    "w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none text-gray-700 placeholder-gray-400",
  passwordHeader: "flex justify-between items-center mb-2",
  error: "text-red-600 text-sm text-center",
  submitButton:
    "w-full py-3 rounded-md text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50",
};

export const signupMediaQuery = `
  @media (min-width: 768px) {
    .login-container {
      margin-top: 209px !important;
    }
  }
`;
