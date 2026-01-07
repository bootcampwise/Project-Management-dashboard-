import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  Tooltip,
} from "recharts";
import { Select } from "../../ui";
import type { TeamOverviewChartProps } from "../../../types";
import { useTeamOverviewChart } from "../../../pages/team/hooks/useTeamOverviewChart";

const CHART_COLORS = {
  highlight: "var(--chart-highlight)",
  inactive: "var(--chart-inactive)",
  axisText: "var(--chart-axis-text)",
  tooltipBg: "var(--chart-tooltip-bg)",
  tooltipBorder: "var(--chart-tooltip-border)",
};

const TeamOverviewChart: React.FC<TeamOverviewChartProps> = ({ teamId }) => {
  const { year, setYear, isLoading, total, processedData } =
    useTeamOverviewChart(teamId);

  const yearOptions = [
    { value: "2026", label: "2026" },
    { value: "2025", label: "2025" },
    { value: "2024", label: "2024" },
    { value: "2023", label: "2023" },
    { value: "2022", label: "2022" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 w-full lg:flex-1 h-[333px] flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-normal text-gray-500 dark:text-gray-400">
          Overview
        </h3>
        <div className="w-24">
          <Select
            options={yearOptions}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border-gray-200 h-9 text-sm py-1"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-normal text-gray-900 dark:text-white">
          {isLoading ? "..." : `$${total.toLocaleString()}`}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-xs font-medium text-blue-600 dark:text-blue-400">
            Billable
          </div>
          <div className="flex items-center justify-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-500 dark:text-gray-400">
            Non-billable
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={processedData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            barSize={32}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="transparent"
              vertical={false}
              horizontal={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.axisText, fontSize: 12 }}
              dy={10}
              interval={0}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: CHART_COLORS.tooltipBg,
                borderRadius: "8px",
                border: `1px solid ${CHART_COLORS.tooltipBorder}`,
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(
                value: number,
                _name: string,
                props: { payload?: { actualValue?: number } },
              ) => {
                const actualVal = props.payload?.actualValue ?? value;
                return [`$${actualVal.toLocaleString()}`, "Income"];
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 8, 8]}>
              {processedData.map(
                (
                  entry: {
                    month: string;
                    value: number;
                    actualValue: number;
                    isMax: boolean;
                  },
                  index: number,
                ) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isMax
                        ? CHART_COLORS.highlight
                        : CHART_COLORS.inactive
                    }
                  />
                ),
              )}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TeamOverviewChart;
