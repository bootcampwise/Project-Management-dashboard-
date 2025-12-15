export interface CreateProjectInput {
  name: string;
  key: string;
  description?: string;
  icon?: string;
  color?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  progress?: number;
}
