import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/error.middleware";
import { CreateTaskInput, UpdateTaskInput } from "./task.types";

export class TaskService {
  async getUserTasks(userId: string) {
    const tasks = await prisma.task.findMany({
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

    return tasks;
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
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

    if (!task) {
      throw new AppError(404, "Task not found or access denied");
    }

    return task;
  }

  async createTask(data: CreateTaskInput, creatorId: string, userId: string) {
    // Verify user has access to project
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        OR: [{ ownerId: userId }, { memberIds: { has: userId } }],
      },
    });

    if (!project) {
      throw new AppError(403, "Access denied to this project");
    }

    const task = await prisma.task.create({
      data: {
        ...data,
        creatorId,
      },
    });

    return task;
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskInput) {
    // Verify access
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [{ ownerId: userId }, { memberIds: { has: userId } }],
        },
      },
    });

    if (!task) {
      throw new AppError(403, "Access denied to this task");
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data,
    });

    return updated;
  }

  async deleteTask(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [{ ownerId: userId }, { memberIds: { has: userId } }],
        },
      },
    });

    if (!task) {
      throw new AppError(403, "Access denied to this task");
    }

    // Soft delete
    await prisma.task.update({
      where: { id: taskId },
      data: { isDeleted: true },
    });
  }
}
