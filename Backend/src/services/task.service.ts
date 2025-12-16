import { AppError } from "../middlewares/error.middleware";
import { CreateTaskInput, UpdateTaskInput } from "../types/task";
import { TaskRepository } from "../repositories/task.repository";
import { ProjectRepository } from "../repositories/project.repository";

export class TaskService {
  private taskRepository: TaskRepository;
  private projectRepository: ProjectRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
    this.projectRepository = new ProjectRepository();
  }

  async getUserTasks(userId: string) {
    return this.taskRepository.findManyByUserId(userId);
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await this.taskRepository.findByIdAndUserId(taskId, userId);

    if (!task) {
      throw new AppError(404, "Task not found or access denied");
    }

    return task;
  }

  async createTask(data: CreateTaskInput, creatorId: string, userId: string) {
    // Verify user has access to project
    const project = await this.projectRepository.findByIdAndUserId(
      data.projectId,
      userId
    );

    if (!project) {
      throw new AppError(403, "Access denied to this project");
    }

    const task = await this.taskRepository.create(data, creatorId);

    return task;
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskInput) {
    // Verify access
    const task = await this.taskRepository.findByIdAndProjectAccess(
      taskId,
      userId
    );

    if (!task) {
      throw new AppError(403, "Access denied to this task");
    }

    const updated = await this.taskRepository.update(taskId, data);

    return updated;
  }

  async deleteTask(taskId: string, userId: string) {
    // Verify access
    const task = await this.taskRepository.findByIdAndProjectAccess(
      taskId,
      userId
    );

    if (!task) {
      throw new AppError(403, "Access denied to this task");
    }

    // Soft delete
    await this.taskRepository.softDelete(taskId);
  }
}
