import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ProjectController } from "../controllers/project.controller";

const router = express.Router();
const projectController = new ProjectController();

// Get all projects for the authenticated user
router.get("/", authMiddleware, projectController.getProjects);

// Create new project
router.post("/", authMiddleware, projectController.createProject);

// Get single project (with authorization check)
router.get("/:id", authMiddleware, projectController.getProject);

export default router;
