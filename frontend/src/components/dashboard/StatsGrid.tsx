import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { StatCard } from "../ui";
import { containerVariants } from "../../utils/motion";
import type { StatsGridProps } from "../../types";

const StatsGrid: React.FC<StatsGridProps> = ({
  tasks,
  range = "M",
  date = new Date(),
}) => {
  const stats = useMemo(() => {
    const now = new Date(date);
    const startDate = new Date(date);

    switch (range) {
      case "D":
        startDate.setDate(now.getDate() - 1);
        break;
      case "W":
        startDate.setDate(now.getDate() - 7);
        break;
      case "M":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "6M":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "Y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredTasks = tasks.filter((t) => {
      const createdInWindow = t.createdAt
        ? new Date(t.createdAt) >= startDate
        : true;
      const updatedInWindow = t.updatedAt
        ? new Date(t.updatedAt) >= startDate
        : false;
      const dueInWindow = t.dueDate
        ? new Date(t.dueDate) >= startDate && new Date(t.dueDate) <= now
        : false;

      return createdInWindow || updatedInWindow || dueInWindow;
    });

    const totalTasks = filteredTasks.length;
    const todoTasks = filteredTasks.filter(
      (t) => t.status === "TODO" || t.status === "BACKLOG",
    ).length;
    const inProgressTasks = filteredTasks.filter(
      (t) =>
        t.status === "IN_PROGRESS" ||
        t.status === "IN_REVIEW" ||
        t.status === "QA",
    ).length;
    const cancelledTasks = filteredTasks.filter(
      (t) => t.status === "CANCELED" || t.status === "POSTPONE",
    ).length;

    return {
      totalTasks,
      todoTasks,
      inProgressTasks,
      cancelledTasks,
    };
  }, [tasks, range]);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] p-[1px]"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <StatCard
        title="Total Tasks"
        value={stats.totalTasks.toString()}
        trend="positive"
        trendText="+3 points since yesterday"
      />
      <StatCard
        title="To Do Tasks"
        value={stats.todoTasks.toString()}
        trend="negative"
        trendText="-3 points since yesterday"
      />
      <StatCard
        title="In Progress Tasks"
        value={stats.inProgressTasks.toString()}
        trend="positive"
        trendText="+3 points since yesterday"
      />
      <StatCard
        title="Cancelled Tasks"
        value={stats.cancelledTasks.toString()}
        trend="negative"
        trendText="-3 points since yesterday"
      />
    </motion.div>
  );
};

export default StatsGrid;
