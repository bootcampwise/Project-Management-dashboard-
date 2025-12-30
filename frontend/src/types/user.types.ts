// User and authentication related types

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  jobTitle?: string;
  department?: string;
  hasCompletedOnboarding?: boolean;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Flexible member type to handle both User and TeamMember
export interface MemberItem {
  id: string | number;
  name: string;
  email?: string;
  avatar?: string;
}
