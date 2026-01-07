"use client";

import { useMemo } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ChartTooltipProps, BudgetChartProps } from "../../types";

const CHART_COLORS = {
  budget: "var(--chart-budget)",
  expenses: "var(--chart-expenses)",
  grid: "var(--chart-grid)",
  axisText: "var(--chart-axis-text)",
  cursor: "var(--chart-cursor)",
};

const CustomTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 text-sm">
        <div className="text-gray-400 dark:text-gray-500 text-xs mb-2 font-medium">
          {label}
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-blue-300"></div>
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            Budget: ${payload[0].value?.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-800"></div>
          <span className="text-gray-600 dark:text-gray-300 font-medium">
            Expenses: ${payload[1].value?.toLocaleString()}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export function BudgetChart({
  tasks = [],
  projects = [],
  range = "M",
  date = new Date(),
}: BudgetChartProps) {
  const { chartData, percentage, totalBudget, totalExpenses, rangeLabel } =
    useMemo(() => {
      let daysCount = 30;
      let label = "Last 30 Days";

      switch (range) {
        case "D":
          daysCount = 1;
          label = "Today";
          break;
        case "W":
          daysCount = 7;
          label = "Last 7 Days";
          break;
        case "M":
          daysCount = 30;
          label = "Last 30 Days";
          break;
        case "6M":
          daysCount = 180;
          label = "Last 6 Months";
          break;
        case "Y":
          daysCount = 365;
          label = "Last Year";
          break;
      }

      let data;

      if (range === "D") {
        const anchorDate = new Date(date);
        anchorDate.setHours(0, 0, 0, 0);

        const intervals = [0, 4, 8, 12, 16, 20, 23];

        let cumulativeExpenses = 0;

        tasks.forEach((task) => {
          const taskDate = task.createdAt
            ? new Date(task.createdAt)
            : new Date();
          if (taskDate < anchorDate) {
            cumulativeExpenses += task.actualCost || 0;
          }
        });

        data = intervals.map((hour) => {
          const pointDate = new Date(anchorDate);
          pointDate.setHours(hour, hour === 23 ? 59 : 0, 0, 0);

          const dailyBudget = projects.reduce((sum, project) => {
            const pStart = project.startDate
              ? new Date(project.startDate)
              : project.createdAt
                ? new Date(project.createdAt)
                : new Date(0);

            if (pStart <= anchorDate) {
              return sum + (project.budget?.totalBudget || 900);
            }
            return sum;
          }, 0);

          const hourTasks = tasks.filter((t) => {
            const tDate = t.createdAt ? new Date(t.createdAt) : new Date();
            return tDate >= anchorDate && tDate <= pointDate;
          });

          const hourExpenses = hourTasks.reduce(
            (sum, t) => sum + (t.actualCost || 0),
            0,
          );

          const label =
            hour === 0
              ? "12am"
              : hour === 12
                ? "12pm"
                : hour === 23
                  ? "11pm"
                  : hour > 12
                    ? `${hour - 12}pm`
                    : `${hour}am`;

          return {
            day: label,
            fullDate: pointDate,
            fullDateStr: pointDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            budget: dailyBudget,
            expenses: cumulativeExpenses + hourExpenses,
          };
        });
      } else {
        const dates = Array.from({ length: daysCount }, (_, i) => {
          const d = new Date(date);
          d.setDate(d.getDate() - (daysCount - 1 - i));
          d.setHours(0, 0, 0, 0);
          return d;
        });

        let cumulativeExpenses = 0;
        const startDate = dates[0];

        tasks.forEach((task) => {
          const taskDate = task.createdAt
            ? new Date(task.createdAt)
            : new Date();
          if (taskDate < startDate) {
            cumulativeExpenses += task.actualCost || 0;
          }
        });

        data = dates.map((date) => {
          const dailyBudget = projects.reduce((sum, project) => {
            const pStart = project.startDate
              ? new Date(project.startDate)
              : project.createdAt
                ? new Date(project.createdAt)
                : new Date(0);

            if (
              pStart <= date ||
              pStart.toDateString() === date.toDateString()
            ) {
              return sum + (project.budget?.totalBudget || 900);
            }
            return sum;
          }, 0);

          const dayTasks = tasks.filter((t) => {
            const tDate = t.createdAt ? new Date(t.createdAt) : new Date();
            return (
              tDate.getDate() === date.getDate() &&
              tDate.getMonth() === date.getMonth() &&
              tDate.getFullYear() === date.getFullYear()
            );
          });

          dayTasks.forEach((task) => {
            cumulativeExpenses += task.actualCost || 0;
          });

          let dayLabel = date.getDate().toString().padStart(2, "0");
          if (range === "6M" || range === "Y") {
            dayLabel = date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
          }

          return {
            day: dayLabel,
            fullDate: date,
            fullDateStr: date.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            budget: dailyBudget,
            expenses: cumulativeExpenses,
          };
        });
      }

      const finalBudget = data[data.length - 1].budget;
      const finalExpenses = data[data.length - 1].expenses;

      const pct =
        finalBudget > 0
          ? ((finalExpenses / finalBudget) * 100).toFixed(1)
          : "0.0";

      return {
        chartData: data,
        percentage: pct,
        totalBudget: finalBudget,
        totalExpenses: finalExpenses,
        rangeLabel: label,
      };
    }, [tasks, projects, range]);

  const isOverBudget = totalExpenses > totalBudget;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100/60 dark:border-gray-700/60 p-4 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            Budget and Expenses
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {rangeLabel}
          </p>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${
            isOverBudget
              ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
          }`}
        >
          {isOverBudget ? (
            <ArrowDownRight size={16} />
          ) : (
            <ArrowUpRight size={16} />
          )}
          <span>{percentage}% Used</span>
        </div>
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.budget}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.budget}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={CHART_COLORS.expenses}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={CHART_COLORS.expenses}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              stroke={CHART_COLORS.grid}
              strokeDasharray="3 30"
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.axisText, fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: CHART_COLORS.axisText, fontSize: 12 }}
              tickFormatter={(value) => {
                if (value === 0) return "0";
                if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
                return value;
              }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: CHART_COLORS.cursor,
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="budget"
              stroke={CHART_COLORS.budget}
              fillOpacity={1}
              fill="url(#colorBudget)"
              strokeWidth={2}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke={CHART_COLORS.expenses}
              fillOpacity={1}
              fill="url(#colorExpenses)"
              strokeWidth={2}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-300" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Budget
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-800" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Total Expenses
          </span>
        </div>
      </div>
    </div>
  );
}
