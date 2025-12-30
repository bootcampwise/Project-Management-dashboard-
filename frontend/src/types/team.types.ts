import type React from "react";
import type { Project } from "./project.types";

// ============================================
// TEAM TYPES
// ============================================

export interface TeamMember {
  id: number | string;
  name: string;
  email: string;
  position: string;
  groups: string[];
  location: string;
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  projectId?: string;
  memberIds: string[];
  members?: TeamMember[];
  projects?: {
    id: string;
    key: string;
    name: string;
    status?: string;
    progress?: number;
    startDate?: string;
    endDate?: string;
    completedTasks?: number;
    totalTasks?: number;
    priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
    members?: { id: string; name: string; avatar?: string }[];
  }[];
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  progress?: number;
  createdAt: string;
}

export interface TeamState {
  members: TeamMember[];
  teams: Team[];
  isLoading: boolean;
  error: string | null;
}

export interface TeamFile {
  id: string;
  name: string;
  type: string;
  size: number | string;
  date: string | Date;
  url?: string;
  filePath?: string;
  mimeType?: string;
  task?: {
    id: string;
    title: string;
    creator?: {
      name: string;
      avatar?: string;
    };
  };
  createdAt?: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

// ============================================
// TEAM PAYLOAD TYPES
// ============================================

export interface CreateTeamPayload {
  name: string;
  memberIds: string[];
  projectIds: string[];
}

export interface UpdateTeamPayload {
  name?: string;
  memberIds?: string[];
  projectIds?: string[];
}

// ============================================
// TEAM COMPONENT PROPS
// ============================================

export interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamToEdit?: Team | null;
}

export interface TeamProjectsProps {
  projects: Project[];
  teamMembers?: { id: string; name: string; avatar?: string }[];
}

export interface TeamMembersProps {
  members: TeamMember[];
  isLoading?: boolean;
  teamId?: string;
  allMemberIds?: string[];
}

export interface TeamFilesProps {
  activeTeam?: Team | null;
  allTeams?: Team[];
  files: TeamFile[];
  isLoading: boolean;
  openMenuId: string | null;
  deletingId: string | null;
  menuRef: React.RefObject<HTMLDivElement | null>;
  formatSize: (bytes: number | string) => string;
  handleFileClick: (file: TeamFile) => Promise<void>;
  handleMenuClick: (e: React.MouseEvent, fileId: string) => void;
  handleDeleteFile: (file: TeamFile) => Promise<void>;
  setOpenMenuId: (id: string | null) => void;
}

export interface TeamStatCardProps {
  title: string;
  value: string | number;
  percentage: string;
  percentageColor: "blue" | "red" | "gray";
}

export interface TeamTableViewProps {
  projectId?: string;
  filteredTeamId?: string;
  sortBy?: "newest" | "oldest" | "alpha";
}
