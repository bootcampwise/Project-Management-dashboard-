import { Router } from "express";
import { CalendarController } from "../controllers/calendar.controller";
import { authMiddleware as authenticate } from "../middlewares/auth.middleware";

const router = Router();
const controller = new CalendarController();

router.use(authenticate);

// Create a new event
router.post("/", controller.createEvent);

// Get all events for a project
router.get("/project/:projectId", controller.getProjectEvents);

// Get events by date range (for calendar month/week view)
router.get("/project/:projectId/range", controller.getEventsByDateRange);

// Get today's events for timeline
router.get("/project/:projectId/today", controller.getTodayEvents);

// Get a single event
router.get("/:id", controller.getEvent);

// Update an event
router.patch("/:id", controller.updateEvent);

// Delete an event
router.delete("/:id", controller.deleteEvent);

export default router;
