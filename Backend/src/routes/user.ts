import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = express.Router();
const userController = new UserController();

// Get or create user profile (called after Supabase auth)
router.post("/profile", authMiddleware, userController.getOrCreateProfile);

// Get current user
router.get("/me", authMiddleware, userController.getCurrentUser);

// Update user profile
router.patch("/me", authMiddleware, userController.updateUserProfile);

export default router;
