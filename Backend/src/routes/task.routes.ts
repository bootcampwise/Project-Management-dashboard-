import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
const taskController = new TaskController();

router.get("/", authMiddleware, taskController.getTasks);
router.post("/", authMiddleware, taskController.createTask);
router.get("/:id", authMiddleware, taskController.getTask);
router.patch("/:id", authMiddleware, taskController.updateTask);
router.delete("/:id", authMiddleware, taskController.deleteTask);

// Attachments handled via multipart on creation, or separate attachment route
router.post("/:id/subtasks", authMiddleware, taskController.addSubtask);

export default router;
