import { Router } from "express";
import { TeamController } from "../controllers/team.controller";
import { authMiddleware as authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new TeamController();

router.use(authenticate);

router.post("/", controller.createTeam);
router.get("/my-teams", controller.getUserTeams);
router.get("/:id", controller.getTeam);
router.get("/project/:projectId", controller.getProjectTeams);
router.patch("/:id", controller.updateTeam);
router.delete("/:id", controller.deleteTeam);

export default router;
