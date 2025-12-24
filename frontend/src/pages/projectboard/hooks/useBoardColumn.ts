import { useState } from "react";

export const useBoardColumn = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return {
    isMenuOpen,
    setIsMenuOpen,
    toggleMenu,
    closeMenu,
  };
};
