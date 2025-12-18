import { AppError } from "../middlewares/error.middleware";
import { CreateProjectInput, UpdateProjectInput } from "../types/project.types";
import { ProjectRepository } from "../repositories/project.repository";

export class ProjectService {
  private projectRepository: ProjectRepository;

  constructor() {
    this.projectRepository = new ProjectRepository();
  }

  async getUserProjects(userId: string) {
    return this.projectRepository.findManyByUserId(userId);
  }

  async getProjectById(projectId: string, userId: string) {
    const project = await this.projectRepository.findByIdAndUserId(
      projectId,
      userId
    );

    if (!project) {
      throw new AppError("Project not found or access denied", 404);
    }

    return project;
  }

  async createProject(data: CreateProjectInput, ownerId: string) {
    return this.projectRepository.create(data, ownerId);
  }

  async updateProject(
    projectId: string,
    userId: string,
    data: UpdateProjectInput
  ) {
    // Verify ownership
    const project = await this.projectRepository.findByIdAndOwnerId(
      projectId,
      userId
    );

    if (!project) {
      throw new AppError("Only project owner can update project", 403);
    }

    const updated = await this.projectRepository.update(projectId, data);

    return updated;
  }

  async deleteProject(projectId: string, userId: string) {
    const project = await this.projectRepository.findByIdAndOwnerId(
      projectId,
      userId
    );

    if (!project) {
      throw new AppError("Only project owner can delete project", 403);
    }

    await this.projectRepository.delete(projectId);
  }
}
