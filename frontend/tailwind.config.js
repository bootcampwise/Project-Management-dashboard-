/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      // Colors - only those actually used in project
      colors: {
        blue: {
          50: "var(--color-blue-50)",
          100: "var(--color-blue-100)",
          200: "var(--color-blue-200)",
          300: "var(--color-blue-300)",
          400: "var(--color-blue-400)",
          500: "var(--color-blue-500)",
          600: "var(--color-blue-600)",
          700: "var(--color-blue-700)",
        },
        gray: {
          50: "var(--color-gray-50)",
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
          600: "var(--color-gray-600)",
          700: "var(--color-gray-700)",
          800: "var(--color-gray-800)",
          900: "var(--color-gray-900)",
        },
        green: {
          50: "var(--color-green-50)",
          100: "var(--color-green-100)",
          200: "var(--color-green-200)",
          300: "var(--color-green-300)",
          400: "var(--color-green-400)",
          500: "var(--color-green-500)",
          600: "var(--color-green-600)",
          700: "var(--color-green-700)",
        },
        orange: {
          50: "var(--color-orange-50)",
          100: "var(--color-orange-100)",
          300: "var(--color-orange-300)",
          400: "var(--color-orange-400)",
          500: "var(--color-orange-500)",
          600: "var(--color-orange-600)",
        },
        red: {
          50: "var(--color-red-50)",
          600: "var(--color-red-600)",
        },
        purple: {
          100: "var(--color-purple-100)",
          600: "var(--color-purple-600)",
        },
        indigo: {
          100: "var(--color-indigo-100)",
          600: "var(--color-indigo-600)",
        },
        teal: {
          50: "var(--color-teal-50)",
          300: "var(--color-teal-300)",
        },
        rose: {
          50: "var(--color-rose-50)",
          300: "var(--color-rose-300)",
        },
        emerald: {
          50: "var(--color-emerald-50)",
          300: "var(--color-emerald-300)",
        },
        yellow: {
          600: "var(--color-yellow-600)",
        },
      },
      // Background colors
      backgroundColor: {
        sidebar: "var(--color-bg-sidebar)",
      },
      // Typography
      fontSize: {
        xs: "var(--font-size-xs)",
        "2xs": "var(--font-size-2xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
      },
      fontWeight: {
        normal: "var(--font-weight-normal)",
        medium: "var(--font-weight-medium)",
        semibold: "var(--font-weight-semibold)",
        bold: "var(--font-weight-bold)",
        black: "var(--font-weight-black)",
      },
    },
    fontFamily: {
      sans: ["var(--font-sans)"],
      inter: ["Inter", "sans-serif"],
    },
  },
  plugins: [],
};
