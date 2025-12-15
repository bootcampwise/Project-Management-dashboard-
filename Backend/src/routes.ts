import { Router } from "express";

// Import all module routes
import userRoutes from "./modules/users/user.routes";
import projectRoutes from "./modules/projects/project.routes";
import taskRoutes from "./modules/tasks/task.routes";
import budgetRoutes from "./modules/budget/budget.routes";
import teamRoutes from "./modules/team/team.routes";
import notificationRoutes from "./modules/notification/notification.routes";
import commentRoutes from "./modules/comment/comment.routes";
import attachmentRoutes from "./modules/attachment/attachment.routes";
import timeTrackingRoutes from "./modules/time-tracking/time-tracking.routes";
import calendarRoutes from "./modules/calendar/calendar.routes";
import tagRoutes from "./modules/tag/tag.routes";
import labelRoutes from "./modules/label/label.routes";
import activityLogRoutes from "./modules/activity-log/activity-log.routes";
import searchHistoryRoutes from "./modules/search-history/search-history.routes";

const router = Router();

// Register all routes
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/budgets", budgetRoutes);
router.use("/teams", teamRoutes);
router.use("/notifications", notificationRoutes);
router.use("/comments", commentRoutes);
router.use("/attachments", attachmentRoutes);
router.use("/time-tracking", timeTrackingRoutes);
router.use("/calendar", calendarRoutes);
router.use("/tags", tagRoutes);
router.use("/labels", labelRoutes);
router.use("/activity-logs", activityLogRoutes);
router.use("/search-history", searchHistoryRoutes);

export default router;
