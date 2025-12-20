import { prisma } from "../config/prisma";
import { CreateProjectInput, UpdateProjectInput } from "../types/project.types";

export class ProjectRepository {
  async findManyByUserId(userId: string) {
    const userTeams = await prisma.team.findMany({
      where: { memberIds: { has: userId } },
      select: { id: true },
    });
    const teamIds = userTeams.map((t) => t.id);

    return prisma.project.findMany({
      // REMOVED visibility filters to allow ALL projects to be seen
      // where: {
      //   OR: [
      //     { ownerId: userId },
      //     { members: { some: { id: userId } } },
      //     { teamIds: { hasSome: teamIds } },
      //   ],
      // },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        teams: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            startDate: true,
            endDate: true,
            progress: true,
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });
  }

  async findAll() {
    return prisma.project.findMany({
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        teams: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            startDate: true,
            endDate: true,
            progress: true,
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        _count: { select: { tasks: true } },
      },
    });
  }

  async findByIdAndUserId(projectId: string, userId: string) {
    const userTeams = await prisma.team.findMany({
      where: { memberIds: { has: userId } },
      select: { id: true },
    });
    const teamIds = userTeams.map((t) => t.id);

    return prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
          { teamIds: { hasSome: teamIds } },
        ],
      },
      include: {
        owner: true,
        members: true,
        teams: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            startDate: true,
            endDate: true,
            progress: true,
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        tasks: {
          where: { isDeleted: false },
        },
        budget: true,
      },
    });
  }

  async create(data: CreateProjectInput, ownerId: string) {
    // Generate a simple key from the name + random number
    const prefix = data.name
      ? data.name
          .replace(/[^a-zA-Z0-9]/g, "")
          .substring(0, 3)
          .toUpperCase()
      : "PRJ";
    const key = `${prefix}-${Date.now().toString(36).toUpperCase()}`;

    return prisma.project.create({
      data: {
        ...data,
        ownerId,
        key,
      },
    });
  }

  async findByIdAndOwnerId(projectId: string, ownerId: string) {
    return prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId,
      },
    });
  }

  async update(projectId: string, data: UpdateProjectInput) {
    return prisma.project.update({
      where: { id: projectId },
      data,
    });
  }

  async delete(projectId: string) {
    // Manually delete related targets to bypass foreign key constraints if cascade fails
    // 1. Delete tasks (Prisma should cascade to subtasks, comments, etc. if schema is correct,
    //    but explicitly deleting tasks removes the ProjectToTask constraint check on the project)
    await prisma.task.deleteMany({
      where: { projectId },
    });

    // 2. Delete snapshots
    await prisma.projectSnapshot.deleteMany({
      where: { projectId },
    });

    // 3. Delete calendar events
    await prisma.calendarEvent.deleteMany({
      where: { projectId },
    });

    // 4. Delete budget
    await prisma.budget.deleteMany({
      where: { projectId },
    });

    return prisma.project.delete({
      where: { id: projectId },
    });
  }
}
