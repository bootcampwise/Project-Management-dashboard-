import { useGetAllTeamsQuery } from "../../../store/api/teamApiSlice";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

export const useTeamTableView = () => {
  const navigate = useNavigate();

  const { data: allTeams = [], isLoading: teamsLoading } =
    useGetAllTeamsQuery();

  const isLoading = teamsLoading;

  const getStatusColor = (status: string = "On track") => {
    switch (status) {
      case "On track":
      case "ACTIVE":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          dot: "bg-green-500",
        };
      case "At risk":
      case "ON_HOLD":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          dot: "bg-orange-500",
        };
      case "On hold":
      case "ARCHIVED":
      case "COMPLETED":
        return { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700", dot: "bg-gray-500" };
    }
  };

  const getPriorityColor = (priority: string = "Medium") => {
    switch (priority) {
      case "High":
      case "URGENT":
        return { bg: "bg-red-50", text: "text-red-700" };
      case "Medium":
      case "HIGH":
        return { bg: "bg-yellow-50", text: "text-yellow-700" };
      case "Low":
      case "LOW":
        return { bg: "bg-green-50", text: "text-green-700" };
      default:
        return { bg: "bg-gray-50", text: "text-gray-700" };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return {
    allTeams,
    isLoading,
    getStatusColor,
    getPriorityColor,
    formatDate,
    navigate,
  };
};
