import { Request, Response, NextFunction } from "express";
import { CalendarService } from "../services/calendar.service";
import { sendSuccess } from "../utils/response";

const calendarService = new CalendarService();

export class CalendarController {
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await calendarService.createEvent(req.body);
      sendSuccess(res, event, "Event created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getProjectEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const events = await calendarService.getProjectEvents(projectId);
      sendSuccess(res, events);
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const event = await calendarService.updateEvent(id, req.body);
      sendSuccess(res, event, "Event updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await calendarService.deleteEvent(id);
      sendSuccess(res, null, "Event deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
