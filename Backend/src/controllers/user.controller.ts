import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { sendSuccess } from "../utils/response";
import { UpdateUserInput } from "../types/user.types";

const userService = new UserService();

export class UserController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: currentUserId } = req.user!;
      const user = await userService.getUserBySupabaseId(currentUserId);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: currentUserId } = req.user!;
      const { email, name, avatar } = req.body;
      const user = await userService.findOrCreateUser(
        currentUserId,
        email,
        name,
        avatar
      );
      sendSuccess(res, user, "Profile created successfully");
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: currentUserId } = req.user!;
      const updateData: UpdateUserInput = req.body;
      const user = await userService.updateUser(currentUserId, updateData);
      sendSuccess(res, user, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: currentUserId } = req.user!;
      await userService.deleteUser(currentUserId);
      sendSuccess(res, null, "Account deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
