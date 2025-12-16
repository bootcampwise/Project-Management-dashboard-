import { prisma } from "../config/prisma";
import { CreateTaskInput, UpdateTaskInput } from "../types/task";

export class TaskRepository {
  async findManyByUserId(userId: string) {
    return prisma.task.findMany({
      where: {
        project: {
          OR: [{ ownerId: userId }, { memberIds: { has: userId } }],
        },
        isDeleted: false,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            key: true,
          },
        },
      },
    });
  }

  async findByIdAndUserId(taskId: string, userId: string) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [{ ownerId: userId }, { memberIds: { has: userId } }],
        },
        isDeleted: false,
      },
      include: {
        assignee: true,
        creator: true,
        project: true,
        subtasks: true,
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
      },
    });
  }

  async findByIdAndProjectAccess(taskId: string, userId: string) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [{ ownerId: userId }, { memberIds: { has: userId } }],
        },
      },
    });
  }

  async create(data: CreateTaskInput, creatorId: string) {
    return prisma.task.create({
      data: {
        ...data,
        creatorId,
      },
    });
  }

  async update(taskId: string, data: UpdateTaskInput) {
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  async softDelete(taskId: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: { isDeleted: true },
    });
  }
}
