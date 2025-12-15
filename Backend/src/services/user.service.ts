import { prisma } from "../../config/prisma";
import { AppError } from "../../middlewares/error.middleware";
import { CreateUserInput, UpdateUserInput } from "./user.types";

export class UserService {
  async findOrCreateUser(
    supabaseId: string,
    email: string,
    name?: string,
    avatar?: string
  ) {
    let user = await prisma.user.findUnique({
      where: { supabaseId },
      include: { settings: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          supabaseId,
          email,
          name,
          avatar,
        },
        include: { settings: true },
      });
    }

    return user;
  }

  async getUserBySupabaseId(supabaseId: string) {
    const user = await prisma.user.findUnique({
      where: { supabaseId },
      include: {
        settings: true,
        ownedProjects: {
          select: {
            id: true,
            name: true,
            key: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  }

  async updateUser(supabaseId: string, data: UpdateUserInput) {
    const user = await prisma.user.update({
      where: { supabaseId },
      data,
    });

    return user;
  }

  async deleteUser(supabaseId: string) {
    await prisma.user.delete({
      where: { supabaseId },
    });
  }
}
