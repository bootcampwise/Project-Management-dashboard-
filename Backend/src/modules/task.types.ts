import { TaskStatus, Priority } from "@prisma/client";

export interface CreateTaskInput {
  title: string;
  description?: string;
  projectId: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: Date;
  assigneeId?: string;
  estimatedHours?: number;
  estimatedCost?: number;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  dueDate?: Date;
  assigneeId?: string;
  actualHours?: number;
  actualCost?: number;
}
