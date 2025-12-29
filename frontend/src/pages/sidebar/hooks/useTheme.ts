import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { setTheme } from "../../../store/uiSlice";

/**
 * Hook for managing theme state.
 * - Reads theme from Redux store
 * - Applies side effects (localStorage + DOM) when theme changes
 * - Returns current theme and toggle function
 */
export const useTheme = () => {
  const theme = useAppSelector((state) => state.ui.theme);
  const dispatch = useAppDispatch();

  // Apply side effects when theme changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("theme", theme);

    // Apply to DOM
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = (newTheme: "light" | "dark") => {
    dispatch(setTheme(newTheme));
  };

  return { theme, toggleTheme };
};
