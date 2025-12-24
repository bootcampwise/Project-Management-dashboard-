import { useState } from "react";

export const useTemplateLibraryModal = () => {
  const [activeCategory, setActiveCategory] = useState("Design");

  const categories = [
    { name: "My templates", color: "text-yellow-400 fill-current" },
    { name: "Productivity", color: "text-orange-500" },
    { name: "Design", color: "text-yellow-600" },
    { name: "Education", color: "text-gray-500" },
    { name: "Marketing", color: "text-gray-500" },
    { name: "Development", color: "text-orange-500" },
    { name: "HR & Operations", color: "text-gray-500" },
    { name: "Remote work", color: "text-red-400" },
    { name: "Sales", color: "text-gray-700" },
  ];

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return {
    activeCategory,
    setActiveCategory,
    categories,
    handleCategoryChange,
  };
};
