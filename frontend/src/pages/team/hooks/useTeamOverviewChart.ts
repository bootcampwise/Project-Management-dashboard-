import { useState, useMemo } from "react";
import { useGetYearlyOverviewQuery } from "../../../store/api/teamApiSlice";

export const useTeamOverviewChart = (teamId?: string) => {
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());

  const { data: chartData = [], isLoading } = useGetYearlyOverviewQuery(
    { teamId: teamId || "", year: parseInt(year) },
    { skip: !teamId },
  );

  const total = useMemo(
    () =>
      chartData.reduce(
        (sum, item) => sum + (item.billable ?? item.value ?? 0),
        0,
      ),
    [chartData],
  );

  const maxValue = useMemo(
    () => Math.max(...chartData.map((d) => d.billable ?? d.value ?? 0)),
    [chartData],
  );

  const minDisplayValue = maxValue > 0 ? maxValue * 0.15 : 10;

  const processedData = useMemo(
    () =>
      chartData.map((item) => {
        const actualVal = item.billable ?? item.value ?? 0;
        const displayVal = actualVal === 0 ? minDisplayValue : actualVal;
        return {
          month: item.month,
          value: displayVal,
          actualValue: actualVal,
          isMax: actualVal === maxValue && actualVal > 0,
        };
      }),
    [chartData, minDisplayValue, maxValue],
  );

  return {
    year,
    setYear,
    isLoading,
    total,
    processedData,
  };
};
