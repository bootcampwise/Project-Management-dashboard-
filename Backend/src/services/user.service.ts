import { AppError } from "../middlewares/error.middleware";
import { CreateUserInput, UpdateUserInput } from "../types/user.types";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async findOrCreateUser(
    supabaseId: string,
    email: string,
    name?: string,
    avatar?: string
  ) {
    let user = await this.userRepository.findUnique({ supabaseId });

    if (!user) {
      user = await this.userRepository.create({
        supabaseId,
        email,
        name,
        avatar,
      });
    }

    return user;
  }

  async getUserBySupabaseId(supabaseId: string) {
    const user = await this.userRepository.findBySupabaseIdWithProjects(
      supabaseId
    );

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  }

  async updateUser(supabaseId: string, data: UpdateUserInput) {
    return this.userRepository.update(supabaseId, data);
  }

  async deleteUser(supabaseId: string) {
    await this.userRepository.delete(supabaseId);
  }
}
