import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { TaskController } from "../controllers/task.controller";

const router = express.Router();
const taskController = new TaskController();

// Get all tasks for user's projects
router.get("/", authMiddleware, taskController.getTasks);

// Create new task
router.post("/", authMiddleware, taskController.createTask);

export default router;
