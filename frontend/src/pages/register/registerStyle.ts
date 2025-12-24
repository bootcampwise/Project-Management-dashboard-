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
    color: "var(--color-gray-900)",
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

  dividerLine: {
    borderTop: `1px solid var(--color-gray-divider)`,
  } as CSSProperties,

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
    border: `1px solid var(--color-gray-border-input)`,
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
    fontWeight: 400,
    fontSize: "12px",
    lineHeight: "18px",
    color: "var(--color-gray-text)",
    opacity: 1,
  } as CSSProperties,

  continueButton: {
    maxWidth: "400px",
    height: "36px",
    backgroundColor: "var(--color-brand-blue)",
    borderRadius: "4px",
    padding: "7px 16px",
    color: "white",
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "22px",
    marginBottom: "16px",
  } as CSSProperties,

  footer: {
    fontFamily: "Inter, sans-serif",
    fontSize: "14px",
    color: "var(--color-gray-text)",
    marginTop: "32px",
    paddingBottom: "32px",
  } as CSSProperties,
};

export const registerClasses = {
  pageContainer:
    "bg-white flex flex-col items-center justify-start overflow-x-hidden",
  contentWrapper: "flex flex-col items-center",

  logoWrapper: "flex items-center justify-center",
  logoImage: "object-contain",

  header: "text-center text-gray-900",

  socialButtonsWrapper: "flex flex-col items-center w-full",

  dividerWrapper: "flex items-center justify-center w-full",
  dividerLine: "w-full",

  emailSection: "flex flex-col w-full",
  label: "text-gray-500",
  input:
    "placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500",

  continueButton: "flex items-center justify-center w-full",

  loginLinkWrapper:
    "flex gap-2 text-md text-gray-400 font-medium font-inter mb-[128px]",
  loginLink: "text-blue-500 hover:text-blue-600",

  footer: "flex justify-center gap-8 w-full",
  footerItem: "whitespace-nowrap",
};
