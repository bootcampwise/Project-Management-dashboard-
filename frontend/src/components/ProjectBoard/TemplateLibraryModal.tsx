import React from "react";
import {
  Search,
  Star,
  Rocket,
  Palette,
  Folder,
  Calendar,
  Wallet,
  MessageCircle,
  Layout,
  Table,
} from "lucide-react";
import { Input } from "../ui";
import type { TemplateLibraryModalProps } from "../../types";
import { useTemplateLibraryModal } from "../../pages/projectboard/hooks/useTemplateLibraryModal";

const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const { activeCategory, setActiveCategory } = useTemplateLibraryModal();

  if (!isOpen) return null;

  const categories = [
    { name: "My templates", icon: Star, color: "text-yellow-400 fill-current" },
    { name: "Productivity", icon: Rocket, color: "text-orange-500" },
    { name: "Design", icon: Palette, color: "text-yellow-600" },
    { name: "Education", icon: Search, color: "text-gray-500" },
    { name: "Marketing", icon: Folder, color: "text-gray-500" },
    { name: "Development", icon: Rocket, color: "text-orange-500" },
    { name: "HR & Operations", icon: MessageCircle, color: "text-gray-500" },
    { name: "Remote work", icon: Calendar, color: "text-red-400" },
    { name: "Sales", icon: Wallet, color: "text-gray-700" },
  ];

  const designTemplates = [
    {
      title: "Creative Brief",
      description:
        "Align project goals, audience insights, and key deliverables for design clarity.",
      type: "Table",
      icon: Table,
      imageColor: "bg-pink-100",
      imageContent: (
        <div className="p-4">
          <div className="w-1/2 h-4 bg-gray-800 rounded mb-2 font-bold text-xs opacity-50">
            03:12
          </div>
          <div className="w-full h-2 bg-gray-300 rounded mb-1"></div>
          <div className="w-3/4 h-2 bg-gray-300 rounded"></div>
        </div>
      ),
    },
    {
      title: "Design Sprint",
      description:
        "Plan and track each phase of rapid design sprints for innovative solutions.",
      type: "Calendar",
      icon: Calendar,
      imageColor: "bg-purple-100",
      imageContent: (
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 rounded-full border-4 border-yellow-400 flex items-center justify-center bg-white font-bold">
            9
          </div>
        </div>
      ),
    },
    {
      title: "Brand Guidelines",
      description:
        "Centralize brand colors and visuals for consistent design applications.",
      type: "Board",
      icon: Layout,
      imageColor: "bg-green-100",
      imageContent: (
        <div className="p-4 grid grid-cols-2 gap-2">
          <div className="h-10 bg-green-200 rounded"></div>
          <div className="h-10 bg-green-300 rounded"></div>
        </div>
      ),
    },
    {
      title: "Wireframe & Prototyping",
      description:
        "Organize wireframes and prototypes to refine design concepts efficiently.",
      type: "Table",
      icon: Table,
      imageColor: "bg-red-100",
      imageContent: (
        <div className="p-4 space-y-2">
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <div className="w-20 h-4 bg-white rounded"></div>
          </div>
        </div>
      ),
    },
    {
      title: "Design Feedback",
      description:
        "Collect structured feedback to streamline revisions and approvals.",
      type: "Board",
      icon: Layout,
      imageColor: "bg-yellow-50",
      imageContent: (
        <div className="p-4">
          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">
            Feedback
          </div>
        </div>
      ),
    },
    {
      title: "Asset Library",
      description:
        "Manage design assets, ensuring easy access and version control.",
      type: "Calendar",
      icon: Calendar,
      imageColor: "bg-blue-100",
      imageContent: (
        <div className="p-4 flex gap-2">
          <div className="w-8 h-10 bg-white shadow rounded"></div>
          <div className="w-8 h-10 bg-white shadow rounded"></div>
        </div>
      ),
    },
  ];

  const isDesign = activeCategory === "Design";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-[1000px] max-w-[95vw] h-[640px] flex overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-[280px] bg-gray-50 border-r border-gray-200 flex flex-col p-5 h-full">
          {isDesign ? (
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 mt-1">
              Templates
            </h3>
          ) : (
            <div className="relative mb-4 mt-1">
              <Input type="text" placeholder="Search..." className="pl-10" />
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          )}

          <div className="flex-1 overflow-y-auto space-y-1">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[15px] transition-all duration-200 ${
                  activeCategory === category.name
                    ? "bg-gray-200 text-gray-900 font-medium shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <category.icon
                  size={20}
                  className={category.color}
                  strokeWidth={2}
                />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 mt-auto">
            <button className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors">
              <MessageCircle size={18} className="text-gray-400" />
              <span>Suggest a template</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-white">
          <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100 min-h-[88px]">
            <div className="flex items-center gap-3">
              {isDesign ? (
                <Palette className="text-yellow-600" size={24} />
              ) : (
                <Rocket className="text-orange-500 fill-orange-500" size={28} />
              )}
              <h2 className="text-2xl font-semibold text-gray-900">
                {activeCategory}
              </h2>
            </div>

            {isDesign ? (
              <div className="relative w-64">
                <Input
                  type="text"
                  placeholder="Search template..."
                  className="pl-10"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
                  size={18}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={onSelectTemplate}
                  className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                >
                  Use Template
                </button>
              </div>
            )}
          </div>

          <div className="p-8 overflow-y-auto bg-white flex-1">
            {isDesign ? (
              <div className="grid grid-cols-3 gap-6">
                {designTemplates.map((template, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer flex flex-col h-full border border-gray-100 rounded-xl hover:shadow-lg transition-shadow duration-200 overflow-hidden bg-white"
                  >
                    <div
                      className={`h-32 ${template.imageColor} relative overflow-hidden p-2`}
                    >
                      {template.imageContent}
                    </div>

                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="text-base font-semibold text-gray-800 mb-2">
                        {template.title}
                      </h3>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4 flex-1">
                        {template.description}
                      </p>

                      <div className="flex items-center gap-2 text-gray-400 mt-auto">
                        <template.icon size={14} />
                        <span className="text-[11px] font-medium">
                          {template.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-8 leading-relaxed text-[15px] max-w-[720px]">
                  This template supports tech teams with task tracking, sprint
                  planning, and issue management, enabling agile workflows and
                  efficient collaboration across development phases.
                </p>

                <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4 border-b border-gray-200 pb-2">
                    <div className="w-4 h-4 rounded bg-blue-400"></div>
                    <span className="text-sm font-medium text-gray-700">
                      Teamspace
                    </span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full"></div>
                  </div>

                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-4 h-4 border border-gray-200 rounded"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                        <div className="w-1/3 h-2 bg-gray-100 rounded-full"></div>
                        <div className="w-1/4 h-2 bg-gray-100 rounded-full"></div>
                        <div className="w-1/5 h-2 bg-gray-100 rounded-full"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateLibraryModal;
