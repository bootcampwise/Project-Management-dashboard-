import type { CSSProperties } from "react";

export const welcomeStyles = {
  logo: {
    width: "90.79px",
    height: "90.79px",
    objectFit: "contain" as const,
    marginBottom: "30.27px",
  } as CSSProperties,

  title: {
    width: "100%",
    maxWidth: "676px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 600,
    fontSize: "48px",
    lineHeight: "42px",
    textAlign: "center" as const,
    marginBottom: "24px",
  } as CSSProperties,

  description: {
    width: "100%",
    maxWidth: "676px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "35px",
    textAlign: "center" as const,
    marginBottom: "40px",
  } as CSSProperties,

  button: {
    width: "100%",
    maxWidth: "400px",
    height: "36px",
    minWidth: "80px",
    padding: "7px 16px",
    borderWidth: "1px",
    borderRadius: "4px",
    color: "white",
    fontFamily: "Inter, sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    cursor: "pointer",
  } as CSSProperties,
};

export const welcomeClasses = {
  loadingWrapper:
    "min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center",
  loadingSpinner:
    "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500",
  container:
    "min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4 font-sans text-gray-900 dark:text-white",
  contentWrapper: "w-full max-w-3xl flex flex-col items-center",

  button: "hover:bg-blue-600 transition-all",
};
