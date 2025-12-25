// ============================================
// PROJECT STORAGE - Persist Last Opened Project
// ============================================
// Purpose: Remember which project user was viewing before refresh
// This eliminates "No project" flash and opens the same project instantly
// IMPORTANT: User-specific storage to prevent cross-user data leakage

const STORAGE_KEY_PREFIX = "lastProjectId_";

/**
 * Get the storage key for a specific user
 */
function getStorageKey(userId?: string): string {
  if (userId) {
    return `${STORAGE_KEY_PREFIX}${userId}`;
  }
  // Fallback for legacy or when userId not available
  return "lastProjectId";
}

/**
 * Save the currently active project ID to localStorage
 * Call this whenever user switches projects
 * @param projectId - The project ID to save
 * @param userId - Optional user ID for user-specific storage
 */
export function saveLastProjectId(projectId: string, userId?: string): void {
  try {
    localStorage.setItem(getStorageKey(userId), projectId);
  } catch {
    // localStorage might be unavailable (private mode, etc.)
    console.warn("Could not save project ID to localStorage");
  }
}

/**
 * Get the last opened project ID from localStorage
 * Returns null if no project was saved
 * @param userId - Optional user ID for user-specific storage
 */
export function getLastProjectId(userId?: string): string | null {
  try {
    return localStorage.getItem(getStorageKey(userId));
  } catch {
    return null;
  }
}

/**
 * Clear the saved project ID (call on logout)
 * @param userId - Optional user ID for user-specific storage
 */
export function clearLastProjectId(userId?: string): void {
  try {
    localStorage.removeItem(getStorageKey(userId));
    // Also clear legacy key if exists
    localStorage.removeItem("lastProjectId");
  } catch {
    // Ignore errors
  }
}
