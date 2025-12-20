import { AppError } from "../middlewares/error.middleware";
import { CreateTaskInput, UpdateTaskInput } from "../types/task.types";
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
      throw new AppError("Task not found or access denied", 404);
    }

    return task;
  }

  async createTask(
    data: CreateTaskInput,
    userId: string,
    projectId: string,
    files?: Express.Multer.File[]
  ) {
    const targetProjectId = data.projectId || projectId;

    // Verify user has access to project
    const project = await this.projectRepository.findByIdAndUserId(
      targetProjectId,
      userId
    );

    if (!project) {
      throw new AppError("Access denied to this project", 403);
    }

    const task = await this.taskRepository.create(
      data,
      userId,
      targetProjectId,
      files
    );

    return task;
  }

  async updateTask(taskId: string, userId: string, data: UpdateTaskInput) {
    // Verify access
    const task = await this.taskRepository.findByIdAndProjectAccess(
      taskId,
      userId
    );

    if (!task) {
      throw new AppError("Access denied to this task", 403);
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
      throw new AppError("Access denied to this task", 403);
    }

    // Soft delete
    await this.taskRepository.softDelete(taskId);
  }

  async addSubtask(taskId: string, userId: string, title: string) {
    const task = await this.taskRepository.findByIdAndProjectAccess(
      taskId,
      userId
    );
    if (!task) {
      throw new AppError("Access denied to this task", 403);
    }

    // We need a repository method to create subtask or use prisma directly.
    // Since TaskRepository wrapper is used, I should add a method there or use update.
    // However, I can't access prisma directly easily if not exposed.
    // I'll add createSubtask to TaskRepository.
    return this.taskRepository.createSubtask(taskId, title);
  }
}
