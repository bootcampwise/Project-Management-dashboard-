import React from "react";
import { ChevronDown, Calendar, Layout, Folder, Code } from "lucide-react";
import { Dropdown } from "../../ui";
import type { DropdownItem, TopEarningProps } from "../../../types";
import { useTopEarning } from "../../../pages/team/hooks/useTopEarning";

const TopEarning: React.FC<TopEarningProps> = ({ teamId }) => {
  const { range, setRange, projects, isLoading } = useTopEarning(teamId);

  const rangeOptions: DropdownItem[] = [
    {
      key: "this_month",
      label: "This month",
      onClick: () => setRange("this_month"),
    },
    {
      key: "last_month",
      label: "Last month",
      onClick: () => setRange("last_month"),
    },
    {
      key: "this_year",
      label: "This year",
      onClick: () => setRange("this_year"),
    },
    { key: "all_time", label: "All time", onClick: () => setRange("all_time") },
  ];

  const selectedRangeLabel =
    rangeOptions.find((r) => r.key === range)?.label || "This month";

  const getIconBackground = () => {
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
  };

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("calendar") || n.includes("schedule")) {
      return <Calendar className="w-5 h-5" />;
    } else if (n.includes("design") || n.includes("ui") || n.includes("ux")) {
      return <Layout className="w-5 h-5" />;
    } else if (
      n.includes("dev") ||
      n.includes("code") ||
      n.includes("backend") ||
      n.includes("frontend")
    ) {
      return <Code className="w-5 h-5" />;
    } else {
      return <Folder className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 w-full h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-600 dark:text-gray-300">
          Top earning
        </h3>
        <Dropdown
          trigger={
            <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-md text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors cursor-pointer">
              <span>{selectedRangeLabel}</span>
              <ChevronDown size={14} />
            </div>
          }
          items={rangeOptions}
          align="right"
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="flex flex-col gap-1">
                    <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
                <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
            No earnings in this period
          </div>
        ) : (
          projects.map((project, index: number) => (
            <div
              key={`${project.id}-${index}`}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`w-8 h-8 rounded-lg ${getIconBackground()} flex items-center justify-center flex-shrink-0`}
                >
                  {getIcon(project.name)}
                </div>

                <div className="flex flex-col justify-center overflow-hidden min-w-0">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate leading-tight">
                    {project.name}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 truncate leading-tight">
                    {project.completedTasks} completed tasks
                  </span>
                </div>
              </div>

              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap ml-2">
                $
                {project.earning.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopEarning;
