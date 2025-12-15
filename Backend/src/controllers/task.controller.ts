import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task.service";
import { UserService } from "../users/user.service";
import { sendSuccess } from "../../utils/response";

const taskService = new TaskService();
const userService = new UserService();

export class TaskController {
  async getTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      const tasks = await taskService.getUserTasks(user.id);
      sendSuccess(res, tasks);
    } catch (error) {
      next(error);
    }
  }

  async getTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      const task = await taskService.getTaskById(id, user.id);
      sendSuccess(res, task);
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      const task = await taskService.createTask(req.body, user.id, user.id);
      sendSuccess(res, task, "Task created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      const task = await taskService.updateTask(id, user.id, req.body);
      sendSuccess(res, task, "Task updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      await taskService.deleteTask(id, user.id);
      sendSuccess(res, null, "Task deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
