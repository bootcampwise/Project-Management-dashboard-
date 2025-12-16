import { TeamRepository } from "../repositories/team.repository";

export class TeamService {
  private teamRepository: TeamRepository;

  constructor() {
    this.teamRepository = new TeamRepository();
  }

  async createTeam(data: {
    name: string;
    projectId?: string;
    memberIds: string[];
  }) {
    if (!data.name) {
      throw new Error("Team name is required");
    }
    return this.teamRepository.create(data);
  }

  async getTeamById(id: string) {
    const team = await this.teamRepository.findById(id);
    if (!team) {
      throw new Error("Team not found");
    }
    return team;
  }

  async getProjectTeams(projectId: string) {
    return this.teamRepository.findByProjectId(projectId);
  }

  async updateTeam(id: string, data: { name?: string; memberIds?: string[] }) {
    return this.teamRepository.update(id, data);
  }

  async deleteTeam(id: string) {
    return this.teamRepository.delete(id);
  }
}
