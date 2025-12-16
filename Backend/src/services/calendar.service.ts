import { CalendarRepository } from "../repositories/calendar.repository";
import { EventType } from "@prisma/client";

export class CalendarService {
  private calendarRepository: CalendarRepository;

  constructor() {
    this.calendarRepository = new CalendarRepository();
  }

  async createEvent(data: {
    title: string;
    type: EventType;
    start: Date;
    end?: Date;
    description?: string;
    projectId?: string;
  }) {
    // Basic validation
    if (!data.title || !data.start || !data.type) {
      throw new Error("Missing required event fields");
    }
    return this.calendarRepository.create(data);
  }

  async getProjectEvents(projectId: string) {
    return this.calendarRepository.findByProjectId(projectId);
  }

  async updateEvent(
    id: string,
    data: {
      title?: string;
      type?: EventType;
      start?: Date;
      end?: Date;
      description?: string;
    }
  ) {
    return this.calendarRepository.update(id, data);
  }

  async deleteEvent(id: string) {
    return this.calendarRepository.delete(id);
  }
}
