import { Router } from "express";
import { UserController } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();
const userController = new UserController();

router.post("/profile", authMiddleware, userController.createOrGetProfile);
router.get("/me", authMiddleware, userController.getMe);
router.patch("/me", authMiddleware, userController.updateMe);
router.delete("/me", authMiddleware, userController.deleteMe);

export default router;
