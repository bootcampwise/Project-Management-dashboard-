import { TaskStatus, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import {
  CreateTaskInput,
  UpdateTaskInput,
  AttachmentMetadata,
} from "../types/task.types";

// ... existing imports

export class TaskRepository {
  // ... existing methods

  async findManyByUserId(userId: string) {
    const tasks = await prisma.task.findMany({
      where: {
        // REMOVED project visibility filter to allow ALL tasks to be seen by logged in users
        // project: {
        //   OR: [{ ownerId: userId }, { memberIds: { has: userId } }],
        // },
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
        _count: {
          select: {
            comments: true,
            attachments: true,
            subtasks: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc", // Good practice to have predictable order
      },
    });

    // 1. Collect all unique tag IDs from all tasks
    const allTagIds = Array.from(new Set(tasks.flatMap((task) => task.tagIds)));

    // 2. Fetch all required tags in a single query
    const allTags = await prisma.tag.findMany({
      where: {
        id: { in: allTagIds },
      },
    });

    // 3. Create a lookup map for faster access
    const tagMap = new Map(allTags.map((tag) => [tag.id, tag]));

    // 4. Map the results
    return tasks.map((task) => {
      // Resolve tags from map
      const tags = task.tagIds
        .map((tagId) => tagMap.get(tagId))
        .filter((tag) => tag !== undefined);

      return {
        ...task,
        tags,
        // Map counts to the flat properties expected by frontend
        comments: task._count.comments,
        attachments: task._count.attachments,
        subtasks: task._count.subtasks,

        // Remove _count from the final object if needed,
        // though spreading task includes it.
        // We explicitly overwrite the counting props.
      };
    });
  }

  async findByIdAndUserId(taskId: string, userId: string) {
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        // Removed project ownership check to match global visibility
        isDeleted: false,
      },
      include: {
        assignees: true,
        creator: true,
        project: true,
        subtasks: true,
        attachments: true,
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
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!task) return null;

    // Fetch tags manually
    const tags = await prisma.tag.findMany({
      where: {
        id: { in: task.tagIds },
      },
    });

    return {
      ...task,
      tags,
    };
  }

  async findByIdAndProjectAccess(taskId: string, userId: string) {
    return prisma.task.findFirst({
      where: {
        id: taskId,
        OR: [
          { project: { ownerId: userId } },
          { project: { memberIds: { has: userId } } },
          { creatorId: userId },
          { assigneeIds: { has: userId } },
        ],
      },
      include: {
        project: { select: { id: true, memberIds: true, ownerId: true } },
      },
    });
  }

  async create(
    data: CreateTaskInput,
    creatorId: string,
    projectId: string,
    files?: AttachmentMetadata[]
  ) {
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
        attachments: {
          create:
            files?.map((file) => ({
              name: file.name,
              url: file.filePath, // We store the relative path/key from Supabase
              size: file.size,
              mimeType: file.mimeType,
              userId: creatorId,
            })) || [],
        },
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
        attachments: true,
      },
    });

    // Manually fetch tags to return with the task (since explicit relation is missing in Prisma schema for include)
    const tags = await prisma.tag.findMany({
      where: { id: { in: processedTagIds } },
    });

    return { ...createdTask, tags };
  }

  async update(taskId: string, data: UpdateTaskInput) {
    const { tags, dueDate, attachments, ...rest } = data as any;

    // Explicitly construct updateData to avoid 'any'
    const updateData: Prisma.TaskUpdateInput = {
      ...rest,
    };

    // Handle Tags: convert ["tag1"] to tagIds
    if (tags && Array.isArray(tags)) {
      const processedTagIds: string[] = [];
      for (const tagText of tags) {
        let tag = await prisma.tag.findFirst({ where: { text: tagText } });
        if (!tag) {
          tag = await prisma.tag.create({
            data: { text: tagText, color: "blue", bg: "bg-blue-100" },
          });
        }
        processedTagIds.push(tag.id);
      }
      updateData.tagIds = processedTagIds;
    }

    // Handle Date
    if (dueDate) {
      updateData.dueDate = new Date(dueDate);
    }

    // Attachments are removed from rest via destructuring, so no need to delete

    return prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
  }

  async softDelete(taskId: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: { isDeleted: true },
    });
  }
  async createSubtask(taskId: string, title: string) {
    return prisma.subTask.create({
      data: {
        title,
        taskId,
        completed: false,
      },
    });
  }
  async updateStatus(taskId: string, status: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: { status: status as TaskStatus },
    });
  }
}
