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
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
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
        subtasks: {
          include: {
            createdBy: {
              select: { id: true, name: true, avatar: true },
            },
            assignees: {
              select: { id: true, name: true, avatar: true },
            },
          },
          orderBy: { createdAt: "desc" },
        },
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
            data: { text: tagText, color: "blue", bg: "bg-blue-100" },
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

  async update(taskId: string, data: UpdateTaskInput, userId: string) {
    const { tags, dueDate, ...rest } = data;

    // Explicitly construct updateData to strictly type-check and avoid ANY
    const updateData: Prisma.TaskUpdateInput = {
      title: rest.title,
      description: rest.description,
      priority: rest.priority,
      status: rest.status,
      // assigneeIds is not directly updateable in Prisma UpdateInput, usage of relation is required
      // actualHours: rest.actualHours, // Assuming these exist
      // actualCost: rest.actualCost,
    };

    if (rest.actualHours !== undefined)
      updateData.actualHours = rest.actualHours;
    if (rest.actualCost !== undefined) updateData.actualCost = rest.actualCost;

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) =>
        updateData[key as keyof Prisma.TaskUpdateInput] === undefined &&
        delete updateData[key as keyof Prisma.TaskUpdateInput]
    );

    // Handle Assignees Relation
    if (rest.assigneeIds) {
      updateData.assignees = {
        set: rest.assigneeIds.map((id) => ({ id })),
      };
    }

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

    await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });

    return this.findByIdAndUserId(taskId, userId);
  }

  async softDelete(taskId: string) {
    return prisma.task.update({
      where: { id: taskId },
      data: { isDeleted: true },
    });
  }

  async hardDelete(taskId: string) {
    // Get attachments before deleting (to delete from Supabase storage later if needed)
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        attachments: {
          select: { url: true },
        },
      },
    });

    // Delete the task - Prisma cascade will delete:
    // - attachments, comments, subtasks, time tracking, history
    await prisma.task.delete({
      where: { id: taskId },
    });

    // Return attachment URLs for potential Supabase cleanup
    return task?.attachments.map((a) => a.url) || [];
  }
  async createSubtask(taskId: string, title: string, createdById: string) {
    return prisma.subTask.create({
      data: {
        title,
        taskId,
        completed: false,
        createdById,
        assigneeIds: [],
      },
      include: {
        createdBy: {
          select: { id: true, name: true, avatar: true },
        },
        assignees: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async deleteSubtask(subtaskId: string) {
    return prisma.subTask.delete({
      where: { id: subtaskId },
    });
  }

  async assignSubtask(
    subtaskId: string,
    assigneeId: string,
    action: "add" | "remove"
  ) {
    // Get current assignees
    const subtask = await prisma.subTask.findUnique({
      where: { id: subtaskId },
      select: { assigneeIds: true },
    });

    if (!subtask) throw new Error("Subtask not found");

    let newAssigneeIds: string[];
    if (action === "add") {
      // Add assignee if not already assigned
      newAssigneeIds = subtask.assigneeIds.includes(assigneeId)
        ? subtask.assigneeIds
        : [...subtask.assigneeIds, assigneeId];
    } else {
      // Remove assignee
      newAssigneeIds = subtask.assigneeIds.filter((id) => id !== assigneeId);
    }

    return prisma.subTask.update({
      where: { id: subtaskId },
      data: { assigneeIds: newAssigneeIds },
      include: {
        createdBy: {
          select: { id: true, name: true, avatar: true },
        },
        assignees: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async toggleSubtaskCompleted(subtaskId: string, completed: boolean) {
    return prisma.subTask.update({
      where: { id: subtaskId },
      data: { completed },
      include: {
        createdBy: {
          select: { id: true, name: true, avatar: true },
        },
        assignees: {
          select: { id: true, name: true, avatar: true },
        },
      },
    });
  }

  async updateStatus(taskId: string, status: string, userId: string) {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: status as TaskStatus },
    });

    // If status is COMPLETED, mark all subtasks as completed
    if (status === "COMPLETED") {
      await prisma.subTask.updateMany({
        where: { taskId: taskId },
        data: { completed: true },
      });
    }

    return this.findByIdAndUserId(taskId, userId);
  }
}
