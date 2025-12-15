import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { sendSuccess } from "../../utils/response";

const userService = new UserService();

export class UserController {
  async createOrGetProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: supabaseId, email } = req.user!;
      const { name, avatar } = req.body;

      const user = await userService.findOrCreateUser(
        supabaseId,
        email,
        name,
        avatar
      );
      sendSuccess(res, user, "User profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: supabaseId } = req.user!;
      const user = await userService.updateUser(supabaseId, req.body);
      sendSuccess(res, user, "User updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: supabaseId } = req.user!;
      await userService.deleteUser(supabaseId);
      sendSuccess(res, null, "User deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
