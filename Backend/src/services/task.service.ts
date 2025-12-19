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
      throw new AppError(404, "Task not found or access denied");
    }

    return task;
  }

  async createTask(data: CreateTaskInput, userId: string, projectId: string) {
    // Note: The previous logic might have passed projectId as a separate arg,
    // or expected it in data. Now we ensure we use data.projectId if available,
    // or the one passed in (which seemed to be userId in the controller call? "user.id, user.id").

    // In controller: taskService.createTask(req.body, user.id, user.id);
    // Wait, the controller calls it with (body, userId, userId)?? That looks wrong.
    // Let's assume data.projectId is the source of truth if presnet.

    const targetProjectId = data.projectId;

    // Verify user has access to project
    const project = await this.projectRepository.findByIdAndUserId(
      targetProjectId, // Use targetProjectId for verification
      userId
    );

    if (!project) {
      throw new AppError(403, "Access denied to this project");
    }

    const task = await this.taskRepository.create(
      data,
      userId,
      targetProjectId
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
