import { Request, Response, NextFunction } from "express";
import { TeamService } from "../services/team.service";
import { UserService } from "../services/user.service";
import { sendSuccess } from "../utils/response";

const teamService = new TeamService();
const userService = new UserService();

export class TeamController {
  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, projectIds = [], memberIds = [] } = req.body;
      const team = await teamService.createTeam(name, projectIds, memberIds);
      sendSuccess(res, team, "Team created successfully", 201);
    } catch (error) {
      next(error);
    }
  }

  async getTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const team = await teamService.getTeamById(id);
      sendSuccess(res, team);
    } catch (error) {
      next(error);
    }
  }

  async getProjectTeams(req: Request, res: Response, next: NextFunction) {
    try {
      const { projectId } = req.params;
      const teams = await teamService.getProjectTeams(projectId);
      sendSuccess(res, teams);
    } catch (error) {
      next(error);
    }
  }

  async getUserTeams(req: Request, res: Response, next: NextFunction) {
    try {
      const { sub: userId } = req.user!;

      // Get internal user ID from Supabase ID
      const user = await userService.getUserBySupabaseId(userId);

      const teams = await teamService.getUserTeams(user.id);
      sendSuccess(res, teams);
    } catch (error) {
      next(error);
    }
  }

  async updateTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const team = await teamService.updateTeam(id, req.body);
      sendSuccess(res, team, "Team updated successfully");
    } catch (error) {
      next(error);
    }
  }

  async deleteTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await teamService.deleteTeam(id);
      sendSuccess(res, null, "Team deleted successfully");
    } catch (error) {
      next(error);
    }
  }
}
