import { useState } from "react";
import { useGetTopEarningQuery } from "../../../store/api/teamApiSlice";
import type { TopEarningProject } from "../../../types";

export const useTopEarning = (
  teamId?: string,
): {
  range: string;
  setRange: React.Dispatch<React.SetStateAction<string>>;
  projects: TopEarningProject[];
  isLoading: boolean;
} => {
  const [range, setRange] = useState<string>("this_month");

  const { data: projects = [], isLoading } = useGetTopEarningQuery(
    { teamId: teamId || "", range },
    { skip: !teamId },
  );

  return {
    range,
    setRange,
    projects,
    isLoading,
  };
};
