import { prisma } from "../config/prisma";
import { CreateTaskInput, UpdateTaskInput } from "../types/task.types";

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
        assignees: {
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
        assignees: true,
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

  async create(data: CreateTaskInput, creatorId: string, projectId: string) {
    // Basic validations or transformations can happen here if needed.
    // data.dueDate is a string, we might need to cast to Date if not handled by Prisma automatically (Prisma usually expects Date object for DateTime fields).

    // Process tags
    const processedTagIds: string[] = [];
    if (data.tags && Array.isArray(data.tags)) {
      for (const tagText of data.tags) {
        let tag = await prisma.tag.findFirst({ where: { text: tagText } });
        if (!tag) {
          tag = await prisma.tag.create({
            data: { text: tagText, color: "blue", bg: "blue-100" },
          });
        }
        processedTagIds.push(tag.id);
      }
    }

    const createdTask = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
        // Handling Many-to-Many Assignees
        assigneeIds: data.assigneeIds || [],
        projectId: projectId,
        creatorId: creatorId,
        tagIds: processedTagIds,
      },
      include: {
        assignees: {
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

    // Manually fetch tags to return with the task (since explicit relation is missing in Prisma schema for include)
    const tags = await prisma.tag.findMany({
      where: { id: { in: processedTagIds } },
    });

    return { ...createdTask, tags };
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
