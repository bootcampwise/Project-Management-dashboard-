import React from "react";
import type { SearchPopupProps } from "../../types";
import GlobalSearch from "./GlobalSearch";

const SearchPopup: React.FC<SearchPopupProps> = ({
  isOpen,
  onClose,
  showProjects = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 bg-black/20 backdrop-blur-[1px]"
      onClick={onClose}
    >
      <GlobalSearch
        onClose={onClose}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        showProjects={showProjects}
      />
    </div>
  );
};

export default SearchPopup;
