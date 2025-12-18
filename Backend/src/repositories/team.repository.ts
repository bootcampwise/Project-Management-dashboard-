import { prisma } from "../config/prisma";

export class TeamRepository {
  async create(data: {
    name: string;
    projectIds: string[];
    memberIds: string[];
  }) {
    return prisma.team.create({
      data,
    });
  }

  async findById(id: string) {
    return prisma.team.findUnique({
      where: { id },
    });
  }

  async findByProjectId(projectId: string) {
    return prisma.team.findMany({
      where: {
        projectIds: {
          has: projectId,
        },
      },
    });
  }

  async findByMemberId(userId: string) {
    return prisma.team.findMany({
      where: {
        memberIds: {
          has: userId,
        },
      },
    });
  }

  async update(id: string, data: { name?: string; memberIds?: string[] }) {
    return prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.team.delete({
      where: { id },
    });
  }
}
