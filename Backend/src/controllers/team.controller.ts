import { Request, Response, NextFunction } from "express";
import { TeamService } from "../services/team.service";
import { sendSuccess } from "../utils/response";

const teamService = new TeamService();

export class TeamController {
  async createTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const team = await teamService.createTeam(req.body);
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
