import { prisma } from "../config/prisma";
import { EventType } from "@prisma/client";

export class CalendarRepository {
  async create(data: {
    title: string;
    type: EventType;
    start: Date;
    end?: Date;
    description?: string;
    projectId?: string;
  }) {
    return prisma.calendarEvent.create({
      data,
    });
  }

  async findByProjectId(projectId: string) {
    return prisma.calendarEvent.findMany({
      where: { projectId },
      orderBy: { start: "asc" },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      type?: EventType;
      start?: Date;
      end?: Date;
      description?: string;
    }
  ) {
    return prisma.calendarEvent.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.calendarEvent.delete({
      where: { id },
    });
  }
}
