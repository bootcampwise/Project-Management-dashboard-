import { Router } from "express";

// Import all module routes
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import teamRoutes from "./routes/team.routes";
import notificationRoutes from "./routes/notification.routes";
import commentRoutes from "./routes/comment.routes";
import attachmentRoutes from "./routes/attachment.routes";
import timeTrackingRoutes from "./routes/time-tracking.routes";
import calendarRoutes from "./routes/calendar.routes";
import activityLogRoutes from "./routes/activity-log.routes";

const router = Router();

// Register all routes
router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
// router.use("/budgets", budgetRoutes);
router.use("/teams", teamRoutes);
router.use("/notifications", notificationRoutes);
router.use("/comments", commentRoutes);
router.use("/attachments", attachmentRoutes);
router.use("/time-tracking", timeTrackingRoutes);
router.use("/calendar", calendarRoutes);
// router.use("/tags", tagRoutes);
// router.use("/labels", labelRoutes);
router.use("/activity-logs", activityLogRoutes);
// router.use("/search-history", searchHistoryRoutes);

export default router;
