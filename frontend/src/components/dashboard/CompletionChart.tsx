"use client";

import { useMemo } from "react";
import {
  Label,
  PolarRadiusAxis,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import type { CompletionChartProps } from "../../types";

const CHART_COLORS = {
  primary: "var(--chart-primary)",
  primaryLight: "var(--chart-primary-light)",
};

export const description = "A radial chart with text";

export function CompletionChart({
  tasks = [],
  projects = [],
}: CompletionChartProps) {
  const stats = useMemo(() => {
    const filteredTasks = tasks;
    const filteredProjects = projects;

    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(
      (t) => t.status === "COMPLETED",
    ).length;
    const completionPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalProjects = filteredProjects.length;
    const completedProjects = filteredProjects.filter((p) => {
      const status = p.status?.toUpperCase();
      return status === "COMPLETED" || p.progress === 100;
    }).length;

    return {
      totalTasks,
      completedTasks,
      completionPercentage,
      totalProjects,
      completedProjects,
    };
  }, [tasks, projects]);

  const chartData = [
    {
      name: "completed",
      value: stats.completionPercentage,
      fill: CHART_COLORS.primary,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-4 flex flex-col justify-between w-full lg:w-[304px] h-auto min-h-[337px]">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-800 dark:text-white">
          Completion
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Task completion status
        </p>
      </div>

      <div className="flex-1 flex items-center justify-center min-h-0">
        <div className="aspect-square h-[180px] w-[180px] relative">
          <RadialBarChart
            width={180}
            height={180}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            data={chartData}
            startAngle={90}
            endAngle={450}
            innerRadius={70}
            outerRadius={80}
            barSize={10}
            cx="50%"
            cy="50%"
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="value"
              background={{ fill: CHART_COLORS.primaryLight }}
              cornerRadius={10}
              fill={CHART_COLORS.primary}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-gray-900 dark:fill-white text-3xl font-bold italic"
                        >
                          {stats.completionPercentage}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-gray-500 dark:fill-gray-400 text-sm"
                        >
                          Completed
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm pt-2">
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
          <span className="text-xs">Projects:</span>
          <span className="font-medium text-gray-700 dark:text-gray-300 text-xs text-right">
            {stats.completedProjects}/{stats.totalProjects}
          </span>
        </div>
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
          <span className="text-xs">Completed Tasks:</span>
          <span className="font-medium text-gray-700 dark:text-gray-300 text-xs text-right">
            {stats.completedTasks}/{stats.totalTasks}
          </span>
        </div>
      </div>
    </div>
  );
}
