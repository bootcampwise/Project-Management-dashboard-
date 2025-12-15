import { Router } from "express";
import userRoutes from "../modules/users/user.routes";
import projectRoutes from "../modules/projects/project.routes";
import taskRoutes from "../modules/tasks/task.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
