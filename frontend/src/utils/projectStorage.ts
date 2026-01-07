const STORAGE_KEY_PREFIX = "lastProjectId_";

function getStorageKey(userId?: string): string {
  if (userId) {
    return `${STORAGE_KEY_PREFIX}${userId}`;
  }
  return "lastProjectId";
}

export function saveLastProjectId(projectId: string, userId?: string): void {
  try {
    localStorage.setItem(getStorageKey(userId), projectId);
  } catch {
    console.warn("Could not save project ID to localStorage");
  }
}

export function getLastProjectId(userId?: string): string | null {
  try {
    return localStorage.getItem(getStorageKey(userId));
  } catch {
    return null;
  }
}

export function clearLastProjectId(userId?: string): void {
  try {
    localStorage.removeItem(getStorageKey(userId));
    localStorage.removeItem("lastProjectId");
  } catch {}
}
