// ============================================
// FILE URL CACHE - Beginner-Friendly Version
// ============================================
// Purpose: Cache signed URLs to avoid regenerating them on every click
// URLs are cached for 5 minutes (300 seconds)

import type { CacheItem } from "../types";

// Simple in-memory cache (no fancy data structures needed)
const fileUrlCache: Record<string, CacheItem> = {};

/**
 * Get a cached URL if it exists and hasn't expired
 */
export function getCachedFileUrl(filePath: string): string | null {
  const item = fileUrlCache[filePath];

  // Not in cache
  if (!item) return null;

  // Check if expired
  if (Date.now() > item.expiresAt) {
    delete fileUrlCache[filePath];
    return null;
  }

  return item.url;
}

/**
 * Store a URL in cache with expiration
 * @param filePath - The file path (used as cache key)
 * @param url - The signed/public URL
 * @param expiresInSeconds - How long to cache (default 5 minutes)
 */
export function setCachedFileUrl(
  filePath: string,
  url: string,
  expiresInSeconds: number = 300
): void {
  fileUrlCache[filePath] = {
    url,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };
}

/**
 * Clear a specific URL from cache (call after file deletion)
 */
export function clearCachedFileUrl(filePath: string): void {
  delete fileUrlCache[filePath];
}

/**
 * Clear all cached URLs (call on logout)
 */
export function clearAllFileUrlCache(): void {
  Object.keys(fileUrlCache).forEach((key) => {
    delete fileUrlCache[key];
  });
}
