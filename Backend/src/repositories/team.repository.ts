import { prisma } from "../config/prisma";

export class TeamRepository {
  async create(data: {
    name: string;
    projectIds: string[];
    memberIds: string[];
  }) {
    const { name, projectIds, memberIds } = data;

    // 1. Create the team
    const team = await prisma.team.create({
      data: {
        name,
        projects: {
          connect: projectIds.map((id) => ({ id })),
        },
        members: {
          connect: memberIds.map((id) => ({ id })),
        },
      },
    });

    // 2. Explicitly update the projects to include this team
    // (Required because the relations are defined separately in the schema)
    if (projectIds.length > 0) {
      await Promise.all(
        projectIds.map((projectId) =>
          prisma.project.update({
            where: { id: projectId },
            data: {
              teams: {
                connect: { id: team.id },
              },
            },
          })
        )
      );
    }

    return team;
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
