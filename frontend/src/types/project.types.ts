import type { TeamFile } from "./team.types";

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  icon?: string;
  color?: string;
  progress?: number;
  status?: string;
  members?: { id: string; name: string; avatar?: string }[];
  teams?: {
    id: string;
    name: string;
    avatar?: string;
    members?: { id: string; name: string; avatar?: string }[];
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
    progress?: number;
  }[];
  startDate?: string;
  endDate?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  createdAt?: string;
  updatedAt?: string;
  completedTasks?: number;
  totalTasks?: number;
  budget?: {
    totalBudget: number;
    spent: number;
    currency: string;
  };
}

export interface CreateProjectPayload {
  name: string;
  description: string;
  dueDate?: string;
  teamId?: string;
  privacy: "public" | "private" | "team";
}

export interface ProjectState {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
  activeTab: string;
  isCreateModalOpen: boolean;
  isTeamModalOpen: boolean;
  isTemplateLibraryOpen: boolean;
  activeProject: Project | null;
  files: TeamFile[];
}

export interface ProjectEarning {
  id: string;
  name: string;
  completedTasks: number;
  earning: number;
  iconColor: "teal" | "blue" | "orange" | "gray";
}

export interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTemplateLibrary: () => void;
  onOpenTeamModal: () => void;
  onCreate: (data: CreateProjectPayload) => Promise<void>;
}

export interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: () => void;
}

export interface UseCreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateProjectPayload) => Promise<void>;
}
