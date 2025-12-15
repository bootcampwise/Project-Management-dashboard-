import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/error.middleware";
import { CreateProjectInput, UpdateProjectInput } from "./project.types";

export class ProjectService {
  async getUserProjects(userId: string) {
    const projects = await prisma.project.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
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
        _count: {
          select: {
            tasks: true,
          },
        },
      },
    });

    return projects;
  }

  async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [{ ownerId: userId }, { members: { some: { id: userId } } }],
      },
      include: {
        owner: true,
        members: true,
        tasks: {
          where: { isDeleted: false },
        },
        budget: true,
      },
    });

    if (!project) {
      throw new AppError(404, "Project not found or access denied");
    }

    return project;
  }

  async createProject(data: CreateProjectInput, ownerId: string) {
    const project = await prisma.project.create({
      data: {
        ...data,
        ownerId,
      },
    });

    return project;
  }

  async updateProject(
    projectId: string,
    userId: string,
    data: UpdateProjectInput
  ) {
    // Verify ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new AppError(403, "Only project owner can update project");
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data,
    });

    return updated;
  }

  async deleteProject(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new AppError(403, "Only project owner can delete project");
    }

    await prisma.project.delete({
      where: { id: projectId },
    });
  }
}
