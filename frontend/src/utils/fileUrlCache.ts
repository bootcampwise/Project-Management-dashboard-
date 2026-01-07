import type { CacheItem } from "../types";

const fileUrlCache: Record<string, CacheItem> = {};

export function getCachedFileUrl(filePath: string): string | null {
  const item = fileUrlCache[filePath];

  if (!item) return null;

  if (Date.now() > item.expiresAt) {
    delete fileUrlCache[filePath];
    return null;
  }

  return item.url;
}

export function setCachedFileUrl(
  filePath: string,
  url: string,
  expiresInSeconds: number = 300,
): void {
  fileUrlCache[filePath] = {
    url,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };
}

export function clearCachedFileUrl(filePath: string): void {
  delete fileUrlCache[filePath];
}

export function clearAllFileUrlCache(): void {
  Object.keys(fileUrlCache).forEach((key) => {
    delete fileUrlCache[key];
  });
}
