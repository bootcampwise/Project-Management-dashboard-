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
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { id: userId } } },
          { teamIds: { hasSome: teamIds } },
        ],
      },
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
    return prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
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
    return prisma.project.delete({
      where: { id: projectId },
    });
  }
}
