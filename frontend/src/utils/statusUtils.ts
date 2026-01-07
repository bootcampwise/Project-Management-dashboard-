export const getStatusColor = (status: string): string => {
  switch (status) {
    case "TODO":
      return "bg-blue-500";
    case "IN_PROGRESS":
      return "bg-yellow-500";
    case "COMPLETED":
      return "bg-green-500";
    case "CANCELED":
      return "bg-red-500";
    case "BACKLOG":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

export const formatStatus = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
