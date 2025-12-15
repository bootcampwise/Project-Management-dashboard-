import { Request, Response, NextFunction } from "express";
import { ProjectService } from "../services/project.service";
import { UserService } from "../services/user.service";
import { sendSuccess } from "../utils/response";

const projectService = new ProjectService();
const userService = new UserService();

export class ProjectController {
  async getProjects(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      const projects = await projectService.getUserProjects(user.id);
      sendSuccess(res, projects);
    } catch (error) {
      next(error);
    }
  }

  async getProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      const project = await projectService.getProjectById(id, user.id);
      sendSuccess(res, project);
    } catch (error) {
      next(error);
    }
  }

  async createProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      const project = await projectService.createProject(req.body, user.id);
      sendSuccess(res, project, "Project created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async updateProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      const project = await projectService.updateProject(id, user.id, req.body);
      sendSuccess(res, project, "Project updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteProject(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { sub: supabaseId } = req.user!;
      const user = await userService.getUserBySupabaseId(supabaseId);
      await projectService.deleteProject(id, user.id);
      sendSuccess(res, null, "Project deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
